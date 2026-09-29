"""
Civora API Dependencies.

Provides dependency injection for services. Uses FastAPI's
dependency injection to wire up the correct providers based
on the application mode (development/production).
"""

from __future__ import annotations

from functools import lru_cache

from backend.app.core.config import get_settings, Settings
from backend.app.services.chat_service import ChatService
from backend.app.services.document_service import DocumentService
from backend.app.services.grievance_service import GrievanceService
from backend.app.services.speech_service import SpeechService


@lru_cache()
def get_chat_service() -> ChatService:
    """Provide the chat service instance."""
    return ChatService()


@lru_cache()
def get_document_service() -> DocumentService:
    """Provide the document service instance."""
    return DocumentService()


@lru_cache()
def get_grievance_service() -> GrievanceService:
    """Provide the grievance service instance."""
    return GrievanceService()


@lru_cache()
def get_speech_service() -> SpeechService:
    """Provide the speech service instance."""
    return SpeechService()
