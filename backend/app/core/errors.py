from typing import Optional, Any, Dict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None
    request_id: Optional[str] = None

class ErrorResponse(BaseModel):
    error: ErrorDetail

class AppError(Exception):
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Any] = None
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details

class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication required or token invalid"):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class ForbiddenError(AppError):
    def __init__(self, message: str = "You do not have permission to access this resource"):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN
        )

class NotFoundError(AppError):
    def __init__(self, message: str = "Requested resource not found"):
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )

class ValidationError(AppError):
    def __init__(self, message: str = "Invalid input data", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class RateLimitError(AppError):
    def __init__(self, message: str = "Rate limit exceeded. Please wait before retrying."):
        super().__init__(
            message=message,
            code="RATE_LIMIT_EXCEEDED",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS
        )

class LegalAnalysisError(AppError):
    def __init__(self, message: str = "Legal reasoning or source retrieval failed", details: Optional[Any] = None):
        super().__init__(
            message=message,
            code="LEGAL_ANALYSIS_ERROR",
            status_code=status.HTTP_502_BAD_GATEWAY,
            details=details
        )

async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id
            }
        }
    )

async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    # Log exception internally, but NEVER expose internal traceback to the client
    from app.core.logging import logger
    logger.error(f"Unhandled exception during request: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing your legal information request. Please try again.",
                "details": None,
                "request_id": request_id
            }
        }
    )
