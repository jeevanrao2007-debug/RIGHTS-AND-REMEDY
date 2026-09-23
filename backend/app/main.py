from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.errors import AppError, app_error_handler, generic_exception_handler
from app.middleware.request_id import RequestIdMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# API Routers
from app.api.v1.health import router as health_router
from app.api.v1.intake import router as intake_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.cases import router as cases_router
from app.api.v1.documents import router as documents_router
from app.api.v1.sources import router as sources_router

logger = setup_logging(settings.log_level)

def create_app() -> FastAPI:
    app = FastAPI(
        title="Rights & Remedy Navigator API",
        description="A source-grounded legal information backend providing intake, statutory RAG, non-definitive remedies, evidence tracking, and document intelligence.",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Middleware: Request ID and Rate Limiting
    app.add_middleware(RequestIdMiddleware)
    app.add_middleware(RateLimitMiddleware)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Custom Exception Handlers
    app.add_exception_handler(AppError, app_error_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    # Standard v1 prefix (/api/v1)
    v1_routers = [
        health_router,
        intake_router,
        analysis_router,
        cases_router,
        documents_router,
        sources_router,
    ]

    for r in v1_routers:
        app.include_router(r, prefix=settings.api_v1_prefix)

    # Direct /api prefix compatibility
    for r in v1_routers:
        app.include_router(r, prefix="/api")

    # Root health probe
    @app.get("/health", include_in_schema=False)
    async def root_health():
        return {"status": "ok", "service": "Rights & Remedy Navigator"}

    return app

app = create_app()
