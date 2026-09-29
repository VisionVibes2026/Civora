"""
Document analysis API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, UploadFile, File, Form

from backend.app.api.dependencies import get_document_service
from backend.app.schemas.api import DocumentExtractionResponse
from backend.app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/analyze", response_model=DocumentExtractionResponse)
async def analyze_document(
    file: UploadFile = File(...),
    language: str = Form(default="en"),
    doc_service: DocumentService = Depends(get_document_service),
):
    """
    Upload and analyze a cooperative document.

    Performs OCR, entity extraction, and document classification.
    Returns a structured analysis with key points and required actions.
    """
    file_bytes = await file.read()
    result = await doc_service.analyze_document(
        file_bytes=file_bytes,
        filename=file.filename or "unknown",
        language=language,
    )
    return DocumentExtractionResponse(**result)
