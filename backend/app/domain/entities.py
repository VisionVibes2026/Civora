"""
Civora Domain Models.

Pure domain objects representing core business concepts.
These are independent of any database or API framework.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional


# ── Enums ────────────────────────────────────────────────────────

class SourceType(str, Enum):
    """Provenance of a knowledge source."""
    OFFICIAL = "official"           # From a government gazette or act
    USER_UPLOADED = "user_uploaded"  # Uploaded by the user
    DEMO_DATA = "demo_data"         # Sample/demo data for development


class DocumentType(str, Enum):
    """Types of knowledge documents."""
    ACT = "act"
    RULE = "rule"
    SCHEME = "scheme"
    CIRCULAR = "circular"
    BYLAW = "bylaw"
    FAQ = "faq"


class VerificationStatus(str, Enum):
    """
    Honest verification statuses.

    IMPORTANT: Do NOT use 'verified' unless the system has actually
    performed verification against an authoritative source.
    """
    SOURCE_RETRIEVED = "source_retrieved"       # Source document was found
    EVIDENCE_MATCHED = "evidence_matched"       # Evidence matched query context
    VERIFICATION_REQUIRED = "verification_required"  # Needs external verification
    HUMAN_REVIEW_REQUIRED = "human_review_required"  # Confidence too low
    UNVERIFIED = "unverified"                   # No verification performed


class GrievanceStatus(str, Enum):
    """Grievance lifecycle states."""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    NEEDS_INFORMATION = "needs_information"
    RESOLVED = "resolved"
    CLOSED = "closed"


class HumanReviewStatus(str, Enum):
    """Human-in-the-loop review states."""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DISMISSED = "dismissed"


# ── Domain Objects ───────────────────────────────────────────────

class Evidence:
    """
    A traceable piece of evidence backing a response.

    Every field is designed to be displayable in the UI's
    "Why this answer?" panel.
    """

    def __init__(
        self,
        source_id: str,
        title: str,
        authority: str,
        section: str = "",
        page: Optional[int] = None,
        effective_date: str = "",
        source_type: SourceType = SourceType.DEMO_DATA,
        url: str = "",
        relevance_score: float = 0.0,
    ):
        self.source_id = source_id
        self.title = title
        self.authority = authority
        self.section = section
        self.page = page
        self.effective_date = effective_date
        self.source_type = source_type
        self.url = url
        self.relevance_score = relevance_score


class JurisdictionContext:
    """Jurisdiction and policy context for a query."""

    def __init__(
        self,
        state: str = "",
        district: str = "",
        cooperative_type: str = "",
        authority: str = "",
        applicable_rules: Optional[List[str]] = None,
        effective_date: str = "",
    ):
        self.state = state
        self.district = district
        self.cooperative_type = cooperative_type
        self.authority = authority
        self.applicable_rules = applicable_rules or []
        self.effective_date = effective_date


class ChatResponse:
    """Structured chat response from the assistant."""

    def __init__(
        self,
        answer: str,
        language: str = "en",
        intent: str = "general",
        confidence: float = 0.0,
        citations: Optional[List[Evidence]] = None,
        next_steps: Optional[List[dict]] = None,
        requires_human_review: bool = False,
        jurisdiction: Optional[JurisdictionContext] = None,
        verification_status: VerificationStatus = VerificationStatus.UNVERIFIED,
    ):
        self.answer = answer
        self.language = language
        self.intent = intent
        self.confidence = confidence
        self.citations = citations or []
        self.next_steps = next_steps or []
        self.requires_human_review = requires_human_review
        self.jurisdiction = jurisdiction
        self.verification_status = verification_status


class KnowledgeDocument:
    """
    A document in the knowledge base.

    Tracks provenance so demo data is never confused with official sources.
    """

    def __init__(
        self,
        id: str = "",
        title: str = "",
        source: str = "",
        authority: str = "",
        document_type: DocumentType = DocumentType.FAQ,
        jurisdiction: str = "",
        effective_date: str = "",
        version: str = "",
        language: str = "en",
        content: str = "",
        section: str = "",
        page: Optional[int] = None,
        url: str = "",
        source_type: SourceType = SourceType.DEMO_DATA,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
    ):
        self.id = id or str(uuid.uuid4())
        self.title = title
        self.source = source
        self.authority = authority
        self.document_type = document_type
        self.jurisdiction = jurisdiction
        self.effective_date = effective_date
        self.version = version
        self.language = language
        self.content = content
        self.section = section
        self.page = page
        self.url = url
        self.source_type = source_type
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)
