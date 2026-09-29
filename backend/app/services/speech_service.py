"""
Civora Speech Services (ASR + TTS).

Provides abstract interfaces for speech-to-text and text-to-speech,
with mock implementations for development.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger

logger = get_logger(__name__)


# ── ASR Interface ────────────────────────────────────────────────

class ASRProvider(ABC):
    """Abstract interface for Automatic Speech Recognition."""

    @abstractmethod
    async def transcribe(
        self, audio_bytes: bytes, language: str = "en"
    ) -> dict:
        """Transcribe audio to text. Returns {text, language, confidence}."""
        ...


class MockASRProvider(ASRProvider):
    """
    Mock ASR for development and demo.

    DEMO IMPLEMENTATION: Returns sample transcription text.
    """

    async def transcribe(
        self, audio_bytes: bytes, language: str = "en"
    ) -> dict:
        logger.info("MockASR: simulating transcription (%d bytes)", len(audio_bytes))
        sample_texts = {
            "en": "Hello, I am a paddy farmer from Nagapattinam.",
            "ta": "வணக்கம், நான் நாகப்பட்டினத்தைச் சேர்ந்த நெல் விவசாயி.",
            "hi": "नमस्ते, मैं नागपट्टिनम का एक धान किसान हूँ।",
            "te": "నమస్కారం, నేను నాగపట్టినం నుండి వచ్చిన వరి రైతును.",
            "kn": "ನಮಸ್ಕಾರ, ನಾನು ನಾಗಪಟ್ಟಿಣಂನಿಂದ ಬಂದ ಭತ್ತ ಬೆಳೆಗಾರ.",
        }
        return {
            "text": sample_texts.get(language, sample_texts["en"]),
            "language": language,
            "confidence": 0.85,
            "is_demo_result": True,
        }


# ── TTS Interface ────────────────────────────────────────────────

class TTSProvider(ABC):
    """Abstract interface for Text-to-Speech synthesis."""

    @abstractmethod
    async def synthesize(
        self, text: str, language: str = "en"
    ) -> Optional[bytes]:
        """Synthesize text to audio. Returns audio bytes or None."""
        ...


class MockTTSProvider(TTSProvider):
    """
    Mock TTS for development and demo.

    DEMO IMPLEMENTATION: Returns None (no actual audio generated).
    The frontend uses browser-native speechSynthesis as fallback.
    """

    async def synthesize(
        self, text: str, language: str = "en"
    ) -> Optional[bytes]:
        logger.info("MockTTS: synthesis requested for lang=%s, len=%d", language, len(text))
        # No actual audio — frontend falls back to Web Speech API
        return None


# ── Speech Service ───────────────────────────────────────────────

class SpeechService:
    """
    Unified speech service handling ASR and TTS.

    Delegates to configured providers based on settings.
    """

    def __init__(
        self,
        asr_provider: Optional[ASRProvider] = None,
        tts_provider: Optional[TTSProvider] = None,
    ):
        settings = get_settings()

        # ASR
        if asr_provider:
            self.asr = asr_provider
        else:
            self.asr = MockASRProvider()

        # TTS
        if tts_provider:
            self.tts = tts_provider
        else:
            self.tts = MockTTSProvider()

    async def transcribe(
        self, audio_bytes: bytes, language: str = "en"
    ) -> dict:
        """Transcribe audio to text."""
        return await self.asr.transcribe(audio_bytes, language)

    async def synthesize(
        self, text: str, language: str = "en"
    ) -> Optional[bytes]:
        """Synthesize text to audio."""
        return await self.tts.synthesize(text, language)
