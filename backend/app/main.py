"""
Civora FastAPI Application Entry Point.

Configures the application, middleware, CORS, exception handlers,
and mounts all API routes.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.core.config import get_settings
from backend.app.core.logging import setup_logging, get_logger, request_id_ctx
from backend.app.schemas.api import ErrorResponse, ErrorDetail


# ── Application Lifespan ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    settings = get_settings()
    setup_logging(settings.LOG_LEVEL)
    logger = get_logger("civora.main")

    logger.info(
        "Starting Civora v%s in %s mode",
        settings.APP_VERSION,
        settings.APP_MODE.value,
    )

    if settings.is_demo_mode:
        logger.warning(
            "Running in DEVELOPMENT mode with mock service providers. "
            "Set APP_MODE=production and configure real providers for "
            "production deployment."
        )

    yield

    logger.info("Civora shutting down")


# ── FastAPI App ──────────────────────────────────────────────────

def create_app() -> FastAPI:
    """Factory function to create and configure the FastAPI app."""
    settings = get_settings()

    app = FastAPI(
        title="Civora API",
        description=(
            "Backend services for the Civora multilingual assistance platform.\n\n"
            "Civora is an AI-powered multilingual assistance platform designed to help users "
            "understand cooperative services, government schemes, legal information, documents, "
            "and grievance processes through conversational, voice, and document-based interactions.\n\n"
            "⚠️ **Advisory Tool**: Civora assists with information and drafting but does "
            "NOT submit documents to government systems on behalf of users."
        ),
        version=settings.APP_VERSION,
        lifespan=lifespan,
        docs_url="/docs" if settings.DEBUG or settings.is_demo_mode else None,
        redoc_url="/redoc" if settings.DEBUG or settings.is_demo_mode else None,
    )

    # ── CORS ─────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Request ID Middleware ────────────────────────────────────
    @app.middleware("http")
    async def add_request_id(request: Request, call_next):
        import uuid
        rid = str(uuid.uuid4())[:8]
        request_id_ctx.set(rid)
        response = await call_next(request)
        response.headers["X-Request-ID"] = rid
        return response

    # ── Exception Handlers ──────────────────────────────────────
    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error=ErrorDetail(code="BAD_REQUEST", message=str(exc))
            ).model_dump(),
        )

    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception):
        logger = get_logger("civora.error")
        logger.error("Unhandled exception: %s", str(exc), exc_info=True)
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error=ErrorDetail(
                    code="INTERNAL_ERROR",
                    message="An unexpected error occurred. Please try again.",
                )
            ).model_dump(),
        )

    # ── Register Routes ─────────────────────────────────────────
    from backend.app.api.routes import chat, documents, grievances, speech, health

    app.include_router(health.router, prefix="/api/v1")
    app.include_router(chat.router, prefix="/api/v1")
    app.include_router(documents.router, prefix="/api/v1")
    app.include_router(grievances.router, prefix="/api/v1")
    app.include_router(speech.router, prefix="/api/v1")

    return app


# ── Module-level app instance for uvicorn ────────────────────────
app = create_app()
