"""
Civora Document OCR & Structured Data Extraction Engine.

Provides an extensible pipeline:
1. Document Ingestion (PDF, PNG, JPG)
2. Image preprocessing & Binarization
3. OCR Text Extraction (PaddleOCR / Tesseract / Mock)
4. Named Entity & Key-Value Field Parsing (Account No, Society Name, Survey No, Loan Amount)
5. Evidence Confidence Scoring
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
import re


@dataclass
class ExtractedField:
    field_key: str
    field_label: str
    value: str
    confidence: float
    is_critical: bool = False


@dataclass
class OCRProcessingResult:
    document_id: str
    raw_text: str
    overall_confidence: float
    fields: Dict[str, ExtractedField] = field(default_factory=dict)
    detected_language: str = "en"
    page_count: int = 1
    engine_used: str = "mock"


class BaseOCREngine(ABC):
    """Abstract OCR engine interface."""

    @abstractmethod
    async def extract_text(self, file_bytes: bytes, file_name: str) -> str:
        """Extract raw text from document bytes."""
        pass

    @abstractmethod
    async def process_document(self, file_bytes: bytes, file_name: str, doc_id: str) -> OCRProcessingResult:
        """Process document and return structured key-value extractions."""
        pass


class MockOCREngine(BaseOCREngine):
    """
    Mock OCR engine for development and testing.
    Detects document type by filename/keywords and returns representative structured data.
    """

    async def extract_text(self, file_bytes: bytes, file_name: str) -> str:
        return (
            "TAMIL NADU CO-OPERATIVE SOCIETIES\n"
            "PRIMARY AGRICULTURAL CO-OPERATIVE CREDIT SOCIETY (PACCS)\n"
            "VILLAGE: THIRUVARUR NORTH | REG NO: PACCS/TR/1982/402\n\n"
            "MEMBER PASSBOOK & LOAN RECORD\n"
            "Member Name: S. Ramasamy\n"
            "Member ID / Account No: PACCS-TR-402-8812\n"
            "Aadhaar Ref: XXXX-XXXX-4921\n"
            "Land Holding: 3.40 Acres (Wetland / Paddy)\n"
            "Survey No: 142/3B, Thiruvarur Taluk\n"
            "Disbursed Crop Loan: Rs. 75,000.00\n"
            "Disbursement Date: 12-08-2022\n"
            "Repayment Status: Pending Waiver Verification\n"
            "Society Secretary Signature: Verified\n"
        )

    async def process_document(self, file_bytes: bytes, file_name: str, doc_id: str) -> OCRProcessingResult:
        raw_text = await self.extract_text(file_bytes, file_name)

        fields = {
            "society_name": ExtractedField(
                field_key="society_name",
                field_label="Cooperative Society",
                value="Thiruvarur North PACCS No. 402",
                confidence=0.96,
                is_critical=True,
            ),
            "member_name": ExtractedField(
                field_key="member_name",
                field_label="Member / Farmer Name",
                value="S. Ramasamy",
                confidence=0.98,
                is_critical=True,
            ),
            "account_number": ExtractedField(
                field_key="account_number",
                field_label="PACCS Account / Member ID",
                value="PACCS-TR-402-8812",
                confidence=0.97,
                is_critical=True,
            ),
            "land_extent": ExtractedField(
                field_key="land_extent",
                field_label="Land Holding Extent",
                value="3.40 Acres (Paddy Cultivation)",
                confidence=0.92,
            ),
            "survey_number": ExtractedField(
                field_key="survey_number",
                field_label="Survey Number",
                value="142/3B",
                confidence=0.94,
            ),
            "loan_amount": ExtractedField(
                field_key="loan_amount",
                field_label="Sanctioned Crop Loan",
                value="₹ 75,000.00",
                confidence=0.95,
                is_critical=True,
            ),
            "disbursement_date": ExtractedField(
                field_key="disbursement_date",
                field_label="Disbursement Date",
                value="12-Aug-2022",
                confidence=0.91,
            ),
            "waiver_eligibility_status": ExtractedField(
                field_key="waiver_eligibility_status",
                field_label="Eligibility Pre-check",
                value="Eligible (Small Farmer < 5.00 Acres)",
                confidence=0.90,
            ),
        }

        return OCRProcessingResult(
            document_id=doc_id,
            raw_text=raw_text,
            overall_confidence=0.94,
            fields=fields,
            detected_language="en",
            page_count=1,
            engine_used="mock_indic_ocr",
        )
