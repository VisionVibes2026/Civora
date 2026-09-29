"""
Civora Backend Configuration.

All configuration is loaded from environment variables.
Never commit real secrets — use .env.example as a template.
"""

from __future__ import annotations

import os
from enum import Enum
from functools import lru_cache
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings


class AppMode(str, Enum):
    """Application runtime mode."""
    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TESTING = "testing"


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    In development mode, mock/demo providers are used for services
    that have not yet been connected to real backends.
    """

    # ── Application ──────────────────────────────────────────────
    APP_NAME: str = "Civora"
    APP_VERSION: str = "0.1.0"
    APP_MODE: AppMode = AppMode.DEVELOPMENT
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # ── Server ───────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./civora_dev.db"

    # ── Vector Store ─────────────────────────────────────────────
    QDRANT_URL: str = ""
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION: str = "civora_knowledge"

    # ── LLM / Embedding ──────────────────────────────────────────
    LLM_PROVIDER: str = "mock"  # "openai" | "google" | "mock"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # ── OCR ───────────────────────────────────────────────────────
    OCR_PROVIDER: str = "mock"  # "paddleocr" | "mock"

    # ── Speech ────────────────────────────────────────────────────
    ASR_PROVIDER: str = "mock"  # "indic_asr" | "whisper" | "mock"
    TTS_PROVIDER: str = "mock"  # "indic_tts" | "mock"

    # ── Multilingual ──────────────────────────────────────────────
    SUPPORTED_LANGUAGES: List[str] = ["en", "ta", "hi", "te", "kn"]
    DEFAULT_LANGUAGE: str = "en"

    # ── Security ──────────────────────────────────────────────────
    JWT_SECRET: str = "CHANGE-ME-IN-PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_MINUTES: int = 60
    API_KEY_HEADER: str = "X-API-Key"

    # ── Rate Limiting ─────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60

    # ── File Upload ───────────────────────────────────────────────
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    @property
    def is_demo_mode(self) -> bool:
        """True when running with mock/demo providers."""
        return self.APP_MODE == AppMode.DEVELOPMENT

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached singleton for application settings."""
    return Settings()
