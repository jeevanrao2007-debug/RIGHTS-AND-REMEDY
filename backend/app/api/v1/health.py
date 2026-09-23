from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timezone
from app.core.config import settings

router = APIRouter()

class HealthCheckResponse(BaseModel):
    status: str
    environment: str
    timestamp: str
    version: str = "1.0.0"
    service: str = "Rights & Remedy Navigator Backend"

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(
        status="ok",
        environment=settings.environment,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
