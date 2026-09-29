"""
Civora security utilities.

Provides JWT token creation/validation, password hashing, API key
validation, and input sanitization foundations.

NOTE: The current implementation provides the *structure* for
authentication. Full user management (registration, OAuth, etc.) is
planned for a future milestone.
"""

from __future__ import annotations

import hashlib
import hmac
import re
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from backend.app.core.config import get_settings

# ── PII Redaction Patterns ───────────────────────────────────────
# These patterns detect common Indian PII formats for log redaction.

AADHAAR_PATTERN = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")
PHONE_PATTERN = re.compile(r"\b(?:\+91[\s-]?)?[6-9]\d{9}\b")
PAN_PATTERN = re.compile(r"\b[A-Z]{5}\d{4}[A-Z]\b")


def redact_pii(text: str) -> str:
    """
    Redact known PII patterns from text for safe logging.

    Replaces Aadhaar numbers, phone numbers, and PAN numbers with
    redaction markers. This is a best-effort filter — it does NOT
    guarantee complete PII removal.
    """
    text = AADHAAR_PATTERN.sub("[AADHAAR-REDACTED]", text)
    text = PHONE_PATTERN.sub("[PHONE-REDACTED]", text)
    text = PAN_PATTERN.sub("[PAN-REDACTED]", text)
    return text


def generate_api_key() -> str:
    """Generate a cryptographically secure API key."""
    return secrets.token_urlsafe(32)


def verify_api_key(provided_key: str, stored_hash: str) -> bool:
    """Verify an API key against its stored hash."""
    provided_hash = hashlib.sha256(provided_key.encode()).hexdigest()
    return hmac.compare_digest(provided_hash, stored_hash)


def hash_api_key(key: str) -> str:
    """Hash an API key for storage."""
    return hashlib.sha256(key.encode()).hexdigest()


# ── JWT Utilities (structure only — no real user DB yet) ─────────

def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token.

    NOTE: Requires `python-jose` to be installed for production use.
    Currently returns a placeholder token in development mode.
    """
    settings = get_settings()
    if settings.is_demo_mode:
        # In demo mode, return a simple non-cryptographic token
        import base64, json
        payload = {**data, "exp": str(datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=60)))}
        return base64.urlsafe_b64encode(json.dumps(payload).encode()).decode()

    try:
        from jose import jwt
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (
            expires_delta or timedelta(minutes=settings.JWT_EXPIRY_MINUTES)
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    except ImportError:
        raise RuntimeError(
            "python-jose is required for JWT in production mode. "
            "Install it with: pip install python-jose[cryptography]"
        )


# ── Input Validation ─────────────────────────────────────────────

MAX_QUERY_LENGTH = 4000
MAX_FILENAME_LENGTH = 255
ALLOWED_FILENAME_CHARS = re.compile(r"^[\w\s\-\.\(\)]+$")


def validate_query_input(text: str) -> str:
    """Validate and sanitize user query input."""
    text = text.strip()
    if len(text) > MAX_QUERY_LENGTH:
        raise ValueError(f"Query exceeds maximum length of {MAX_QUERY_LENGTH} characters")
    if not text:
        raise ValueError("Query cannot be empty")
    return text


def validate_filename(filename: str) -> str:
    """Validate uploaded filename for safety."""
    filename = filename.strip()
    if len(filename) > MAX_FILENAME_LENGTH:
        raise ValueError("Filename too long")
    # Strip path separators to prevent directory traversal
    filename = filename.replace("/", "").replace("\\", "")
    if not filename:
        raise ValueError("Invalid filename")
    return filename
