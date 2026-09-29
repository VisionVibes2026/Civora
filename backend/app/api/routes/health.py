"""
Health check API route.
"""

from __future__ import annotations

from fastapi import APIRouter

from backend.app.core.config import get_settings
from backend.app.schemas.api import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Application health check.

    Returns application status, version, mode, and service availability.
    """
    settings = get_settings()

    services = {
        "llm": {"provider": settings.LLM_PROVIDER, "status": "mock" if settings.LLM_PROVIDER == "mock" else "configured"},
        "ocr": {"provider": settings.OCR_PROVIDER, "status": "mock" if settings.OCR_PROVIDER == "mock" else "configured"},
        "asr": {"provider": settings.ASR_PROVIDER, "status": "mock" if settings.ASR_PROVIDER == "mock" else "configured"},
        "tts": {"provider": settings.TTS_PROVIDER, "status": "mock" if settings.TTS_PROVIDER == "mock" else "configured"},
        "vector_store": {"provider": "qdrant", "status": "configured" if settings.QDRANT_URL else "not_configured"},
    }

    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        mode=settings.APP_MODE.value,
        services=services,
    )
