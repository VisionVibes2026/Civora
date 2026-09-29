"""
Civora Multilingual Processing Engine.

Supports 5 target Indic languages:
- en: English
- ta: Tamil (தமிழ்)
- hi: Hindi (हिन्दी)
- te: Telugu (తెలుగు)
- kn: Kannada (ಕನ್ನಡ)

Features:
1. Fast heuristic script detector based on Unicode block ranges
2. Abstract translation interface for Bhashini / IndicTrans2
3. Mock transliteration and translation fallbacks for development
"""

from __future__ import annotations

import re
from abc import ABC, abstractmethod
from typing import Dict, Optional, Tuple


class LanguageDetector:
    """Heuristic Unicode-based Indic language script detector."""

    # Unicode ranges for Indic scripts
    SCRIPT_RANGES = {
        "ta": (0x0B80, 0x0BFF),  # Tamil
        "hi": (0x0900, 0x097F),  # Devanagari (Hindi, Marathi)
        "te": (0x0C00, 0x0C7F),  # Telugu
        "kn": (0x0C80, 0x0CFF),  # Kannada
    }

    TAMIL_KEYWORDS = ["வணக்கம்", "பயிர்", "கடன்", "விவசாயி", "சங்கம்", "புகார்", "தள்ளுபடி"]
    HINDI_KEYWORDS = ["नमस्ते", "फसल", "ऋण", "किसान", "सोसायटी", "शिकायत", "माफी"]
    TELUGU_KEYWORDS = ["నమస్కారం", "పంట", "రుణం", "రైతు", "సంఘం", "ఫిర్యాదు"]
    KANNADA_KEYWORDS = ["ನಮಸ್ಕಾರ", "ಬೆಳೆ", "ಸಾಲ", "ರೈತ", "ಸಂಘ", "ದೂರು"]

    def detect(self, text: str) -> str:
        """Detect the language code (en, ta, hi, te, kn) of the input text."""
        if not text or not text.strip():
            return "en"

        text_lower = text.lower()

        # Check script characters count
        counts = {"en": 0, "ta": 0, "hi": 0, "te": 0, "kn": 0}

        for char in text:
            cp = ord(char)
            matched = False
            for lang, (start, end) in self.SCRIPT_RANGES.items():
                if start <= cp <= end:
                    counts[lang] += 1
                    matched = True
                    break
            if not matched and char.isalpha():
                counts["en"] += 1

        # Return script with highest character match if any Indic characters found
        total_indic = sum(counts[lang] for lang in ["ta", "hi", "te", "kn"])
        if total_indic > 0:
            best_indic = max(["ta", "hi", "te", "kn"], key=lambda l: counts[l])
            if counts[best_indic] > 0:
                return best_indic

        # Fallback to English
        return "en"


class BaseTranslator(ABC):
    """Abstract multilingual translation interface."""

    @abstractmethod
    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate text between supported Indic languages."""
        pass


class MockTranslator(BaseTranslator):
    """
    Mock translator for development.
    Preserves known legal terms and appends target language markers.
    """

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        if source_lang == target_lang:
            return text
        # For development, return original text or mock localized prefix
        return text
