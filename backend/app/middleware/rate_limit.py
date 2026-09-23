import time
from collections import defaultdict
from typing import Dict, List
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from app.core.config import settings

class InMemoryRateLimiter:
    """
    Sliding window rate limiter keeping track of timestamps per client key.
    Automatically trims old timestamps.
    """
    def __init__(self, requests_per_minute: int = 60):
        self.limit = requests_per_minute
        self.window_seconds = 60.0
        self.history: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, client_key: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds
        
        # Filter timestamps within current window
        valid_timestamps = [t for t in self.history[client_key] if t > cutoff]
        if len(valid_timestamps) >= self.limit:
            self.history[client_key] = valid_timestamps
            return False
            
        valid_timestamps.append(now)
        self.history[client_key] = valid_timestamps
        return True

limiter = InMemoryRateLimiter(requests_per_minute=settings.rate_limit_requests_per_minute)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Exempt health check and preflight OPTIONS from rate limiting
        if request.url.path.endswith("/health") or request.method == "OPTIONS":
            return await call_next(request)

        # Identify client by Auth header or Client IP
        client_ip = request.client.host if request.client else "unknown"
        auth_header = request.headers.get("Authorization", "")
        client_key = f"{client_ip}:{auth_header[:16]}" if auth_header else client_ip

        if not limiter.is_allowed(client_key):
            request_id = getattr(request.state, "request_id", None)
            return JSONResponse(
                status_code=429,
                content={
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please slow down.",
                        "request_id": request_id
                    }
                }
            )

        return await call_next(request)
