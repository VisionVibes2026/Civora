"""
Civora Document Processing Service.

Pipeline: Upload → validation → storage → OCR → text extraction →
entity extraction → structured data → evidence linking.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger
from backend.app.core.security import validate_filename

logger = get_logger(__name__)


# ── OCR Provider Interface ───────────────────────────────────────

class OCRProvider(ABC):
    """Abstract interface for OCR providers."""

    @abstractmethod
    async def extract_text(self, file_bytes: bytes, filename: str) -> str:
        """Extract text from a document image or PDF."""
        ...


class MockOCRProvider(OCRProvider):
    """
    Mock OCR provider for development and testing.

    DEMO IMPLEMENTATION: Returns sample extracted text.
    Does NOT perform actual OCR processing.
    """

    async def extract_text(self, file_bytes: bytes, filename: str) -> str:
        logger.info("MockOCRProvider: simulating OCR for %s", filename)
        return (
            "Primary Agricultural Credit Society (PACS) Loan Subvention Form. "
            "Member ID: 88421. Land Patta No: 1402. Crop: Paddy (Kharif). "
            "Maximum loan ceiling: ₹1,60,000."
        )


class PaddleOCRProvider(OCRProvider):
    """
    PaddleOCR-based text extraction.

    PENDING IMPLEMENTATION: Requires PaddleOCR to be installed and
    configured. Currently raises NotImplementedError.
    """

    async def extract_text(self, file_bytes: bytes, filename: str) -> str:
        raise NotImplementedError(
            "PaddleOCR integration is pending. Install paddleocr and "
            "configure OCR_PROVIDER=paddleocr in .env."
        )


# ── Document Service ─────────────────────────────────────────────

class DocumentService:
    """
    Orchestrates document upload, OCR, and analysis.

    In demo mode, uses MockOCRProvider and returns sample results.
    """

    def __init__(self, ocr_provider: Optional[OCRProvider] = None):
        settings = get_settings()
        if ocr_provider:
            self.ocr = ocr_provider
        elif settings.OCR_PROVIDER == "paddleocr":
            self.ocr = PaddleOCRProvider()
        else:
            self.ocr = MockOCRProvider()

    async def analyze_document(
        self,
        file_bytes: bytes,
        filename: str,
        language: str = "en",
    ) -> dict:
        """
        Analyze an uploaded document.

        Returns structured extraction results.
        """
        filename = validate_filename(filename)
        logger.info("Analyzing document: %s (%d bytes)", filename, len(file_bytes))

        # Validate file size
        settings = get_settings()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(file_bytes) > max_bytes:
            raise ValueError(
                f"File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB"
            )

        # OCR extraction
        extracted_text = await self.ocr.extract_text(file_bytes, filename)

        # In demo mode, return sample analysis
        if settings.is_demo_mode:
            return {
                "document_name": filename,
                "document_type": "PACS Loan Application & Subsidy Declaration",
                "extracted_text_snippet": extracted_text[:200],
                "summary": (
                    "Official application for 3% Interest Subvention (ISS) "
                    "under NABARD and State Agriculture Credit Scheme."
                ),
                "key_points": [
                    "Base loan rate capped at 7% per annum; effective rate 4% on timely repayment",
                    "Requires VAO crop cultivation certificate",
                    "Requires Aadhaar-seeded bank account for DBT",
                ],
                "required_actions": [
                    "Attach land ownership Patta/Chitta copy",
                    "Obtain VAO sign-off on cultivation area",
                    "Submit to PACS Secretary before deadline",
                ],
                "verification_status": "source_retrieved",
                "detected_authority": "Registrar of Cooperative Societies (RCS)",
                "is_demo_result": True,
            }

        # Production pipeline would:
        # 1. Run OCR
        # 2. Extract entities (NER)
        # 3. Classify document type
        # 4. Match against knowledge base
        # 5. Generate structured summary
        return {
            "document_name": filename,
            "document_type": "unknown",
            "extracted_text_snippet": extracted_text[:200],
            "summary": "Document processing requires configured LLM provider.",
            "key_points": [],
            "required_actions": [],
            "verification_status": "unverified",
            "detected_authority": "",
            "is_demo_result": False,
        }
