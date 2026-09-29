"""
Civora Demo Data Provider.

IMPORTANT: This module contains DEMO / DEVELOPMENT DATA ONLY.
It is NOT connected to any government system or live database.

All responses are sample data for demonstration and testing purposes.
The application uses this provider when APP_MODE=development.
"""

from __future__ import annotations

from typing import Dict

# ── Demo Response Mappings ───────────────────────────────────────

DEMO_RESPONSES_EN: Dict[str, str] = {
    "greeting": "Hi, I'm Civora. How can I help you?",
    "crop_insurance": (
        "I can help you check your crop-insurance details. Please upload "
        "your loan or insurance document so I can identify the crop, "
        "insurance and policy information."
    ),
    "document_check": (
        "Sure. Upload the document and I'll check the relevant crop, "
        "loan and insurance details."
    ),
    "insurance_applicable": (
        "I found insurance information in your document. Rain-related crop "
        "damage may be covered under applicable crop-insurance provisions, "
        "depending on the notified crop, area, coverage and policy conditions.\n\n"
        "I'll check the official information for Tamil Nadu, your paddy crop "
        "and the insurance details I found."
    ),
    "next_steps": (
        "If your loss falls under the applicable coverage, the loss should "
        "be reported within the required time period. For PMFBY-related "
        "support, I can show you the official reporting channel and help "
        "you prepare the information you need."
    ),
    "info_ready": (
        "Keep your insurance or policy details, crop details, location, "
        "date of damage and supporting evidence ready. I can use the "
        "information from your uploaded document to prepare a simple "
        "crop-loss summary."
    ),
    "prepare_summary": (
        "Crop: Paddy\n"
        "Location: Nagapattinam, Tamil Nadu\n"
        "Cause reported: Heavy rain\n"
        "Loan: Agricultural loan through PACS\n"
        "Insurance: Identified from uploaded document\n"
        "Incident: Crop damage reported"
    ),
    "default": (
        "I can help you with cooperative laws, government schemes, "
        "document verification, and grievance preparation. Please "
        "describe your question."
    ),
}

DEMO_RESPONSES_TA: Dict[str, str] = {
    "greeting": "வணக்கம், நான் சிவோரா. உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?",
    "crop_insurance": (
        "உங்கள் பயிர் காப்பீட்டு விவரங்களைச் சரிபார்க்க நான் உதவுகிறேன். "
        "பயிர், காப்பீடு மற்றும் கொள்கை விவரங்களை அடையாளம் காண உங்கள் கடன் "
        "அல்லது காப்பீட்டு ஆவணத்தைப் பதிவேற்றவும்."
    ),
    "document_check": (
        "நிச்சயமாக. ஆவணத்தைப் பதிவேற்றவும், பயிர், கடன் மற்றும் "
        "காப்பீட்டு விவரங்களைச் சரிபார்க்கிறேன்."
    ),
    "default": (
        "கூட்டுறவு சட்டங்கள், அரசு திட்டங்கள், ஆவண சரிபார்ப்பு மற்றும் "
        "குறைதீர்ப்பு தயாரிப்பு ஆகியவற்றில் நான் உங்களுக்கு உதவ முடியும்."
    ),
}


class DemoDataProvider:
    """
    Provides demo/sample responses for development and testing.

    CLEARLY LABELED AS DEMO DATA — not connected to any government
    system or live knowledge base.
    """

    def get_response(self, query: str, language: str = "en") -> str:
        """Return a demo response matching the query intent."""
        lower = query.lower().strip()
        responses = DEMO_RESPONSES_TA if language == "ta" else DEMO_RESPONSES_EN

        # Pattern matching against demo scenario keywords
        if lower in ("hi", "hello", "வணக்கம்") or lower.startswith("hi "):
            return responses.get("greeting", responses["default"])

        if "paddy farmer" in lower or "நெல் விவசாயி" in lower or "crop" in lower:
            return responses.get("crop_insurance", responses["default"])

        if "loan document" in lower or "கடன் ஆவணம்" in lower:
            return responses.get("document_check", responses["default"])

        if "applicable" in lower or "பொருந்துமா" in lower:
            return responses.get("insurance_applicable", responses["default"])

        if "what should i do" in lower or "என்ன செய்ய" in lower:
            return responses.get("next_steps", responses["default"])

        if "keep ready" in lower or "ஆயத்தமாக" in lower:
            return responses.get("info_ready", responses["default"])

        if "prepare" in lower or "தயார்" in lower:
            return responses.get("prepare_summary", responses["default"])

        return responses["default"]
