"""
Tests for Jurisdiction Resolver, Multilingual Detector, and Evidence Verifier.
"""

import pytest
from backend.app.jurisdiction.resolver import JurisdictionResolver
from backend.app.multilingual.processor import LanguageDetector
from backend.app.evidence.verifier import EvidenceVerifier, ProvenanceStatus


class TestJurisdictionResolver:
    def setup_method(self):
        self.resolver = JurisdictionResolver()

    def test_state_society_resolution(self):
        res = self.resolver.resolve("Thiruvarur PACCS", state="Tamil Nadu")
        assert res.is_multi_state is False
        assert "Tamil Nadu" in res.applicable_act_name
        assert "Section 90" in res.dispute_resolution_section

    def test_multi_state_society_resolution(self):
        res = self.resolver.resolve("National Multi-State Agricultural Credit Society")
        assert res.is_multi_state is True
        assert "Multi-State" in res.applicable_act_name
        assert "Section 84" in res.dispute_resolution_section


class TestLanguageDetector:
    def setup_method(self):
        self.detector = LanguageDetector()

    def test_english_detection(self):
        assert self.detector.detect("What is the crop loan waiver?") == "en"

    def test_tamil_detection(self):
        assert self.detector.detect("பயிர் கடன் தள்ளுபடி குறித்து சொல்லுங்கள்") == "ta"

    def test_hindi_detection(self):
        assert self.detector.detect("किसान ऋण माफी योजना की जानकारी दें") == "hi"

    def test_telugu_detection(self):
        assert self.detector.detect("రైతు రుణమాఫీ పథకం వివరాలు") == "te"

    def test_kannada_detection(self):
        assert self.detector.detect("ಬೆಳೆ ಸಾಲ ಮನ್ನಾ ಯೋಜನೆ ಮಾಹಿತಿ") == "kn"


class TestEvidenceVerifier:
    def setup_method(self):
        self.verifier = EvidenceVerifier()

    def test_crop_loan_evidence_small_farmer(self):
        fields = {
            "account_number": "PACCS-TR-402",
            "land_extent": "3.4 Acres",
        }
        record = self.verifier.evaluate_crop_loan_evidence(fields, "test.pdf", b"test_content")
        assert record.verification_status == ProvenanceStatus.STATUTORY_CRITERIA_MATCH
        assert record.ocr_confidence > 0.9
        assert len(record.matched_criteria) > 0

    def test_crop_loan_evidence_large_farmer(self):
        fields = {
            "account_number": "PACCS-TR-402",
            "land_extent": "8.5 Acres",
        }
        record = self.verifier.evaluate_crop_loan_evidence(fields, "test.pdf", b"test_content")
        assert record.verification_status == ProvenanceStatus.CRITERIA_DISCREPANCY
        assert len(record.flagged_discrepancies) > 0
