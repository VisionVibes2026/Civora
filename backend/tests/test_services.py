"""
Civora Backend Test Suite — Chat Service.
"""

import pytest
from backend.app.services.demo_data_provider import DemoDataProvider


class TestDemoDataProvider:
    """Tests for the demo data provider."""

    def setup_method(self):
        self.provider = DemoDataProvider()

    def test_greeting_en(self):
        result = self.provider.get_response("Hi", "en")
        assert "Civora" in result

    def test_greeting_ta(self):
        result = self.provider.get_response("வணக்கம்", "ta")
        assert "சிவோரா" in result

    def test_crop_insurance_query(self):
        result = self.provider.get_response(
            "I am a paddy farmer and my crop is damaged", "en"
        )
        assert "crop" in result.lower() or "insurance" in result.lower()

    def test_default_response(self):
        result = self.provider.get_response("random nonsense query", "en")
        assert len(result) > 0

    def test_tamil_default(self):
        result = self.provider.get_response("random query", "ta")
        assert len(result) > 0


class TestIntentClassification:
    """Tests for basic intent classification."""

    def setup_method(self):
        from backend.app.services.chat_service import ChatService
        self.service = ChatService()

    def test_grievance_intent(self):
        assert self.service._classify_intent("I have a complaint") == "grievance"

    def test_scheme_intent(self):
        assert self.service._classify_intent("Tell me about loan subsidy") == "scheme_inquiry"

    def test_legal_intent(self):
        assert self.service._classify_intent("What does section 21 say") == "legal_inquiry"

    def test_general_intent(self):
        assert self.service._classify_intent("hello") == "general"
