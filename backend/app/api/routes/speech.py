"""
Speech API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.responses import Response

from backend.app.api.dependencies import get_speech_service
from backend.app.schemas.api import TranscriptionResponse, SynthesisRequest
from backend.app.services.speech_service import SpeechService

router = APIRouter(prefix="/speech", tags=["Speech"])


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: str = Form(default="en"),
    speech_service: SpeechService = Depends(get_speech_service),
):
    """
    Transcribe uploaded audio to text.

    Supports Indian languages via configured ASR provider.
    In demo mode, returns sample transcription.
    """
    audio_bytes = await audio.read()
    result = await speech_service.transcribe(audio_bytes, language)
    return TranscriptionResponse(**result)


@router.post("/synthesize")
async def synthesize_speech(
    request: SynthesisRequest,
    speech_service: SpeechService = Depends(get_speech_service),
):
    """
    Synthesize text to speech audio.

    Returns audio bytes (WAV/MP3) or 204 if no audio was generated
    (frontend falls back to browser speechSynthesis).
    """
    audio_bytes = await speech_service.synthesize(request.text, request.language)
    if audio_bytes:
        return Response(content=audio_bytes, media_type="audio/wav")
    return Response(status_code=204)
