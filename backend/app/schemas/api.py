"""
Civora API Schemas (Pydantic).

Request and response models for all API endpoints.
These enforce validation and provide OpenAPI documentation.
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ── Chat ─────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """User chat message request."""
    query: str = Field(..., min_length=1, max_length=4000, description="User query text")
    language: str = Field(default="en", description="ISO 639-1 language code")
    conversation_id: Optional[str] = Field(default=None, description="Existing conversation ID")
    jurisdiction_state: Optional[str] = Field(default=None, description="State jurisdiction context")
    cooperative_type: Optional[str] = Field(default=None, description="Type of cooperative")


class EvidenceResponse(BaseModel):
    """A single evidence citation backing a response."""
    source_id: str = ""
    title: str = ""
    authority: str = ""
    section: str = ""
    page: Optional[int] = None
    effective_date: str = ""
    source_type: str = "demo_data"  # "official" | "user_uploaded" | "demo_data"
    url: str = ""
    relevance_score: float = 0.0


class JurisdictionResponse(BaseModel):
    """Jurisdiction context in a response."""
    state: str = ""
    district: str = ""
    cooperative_type: str = ""
    authority: str = ""
    applicable_rules: List[str] = []


class NextStepResponse(BaseModel):
    """A suggested next action for the user."""
    label: str
    action_type: str  # "grievance" | "documents" | "laws" | "schemes" | "query"
    payload: Optional[str] = None


class ChatResponse(BaseModel):
    """Structured chat response."""
    answer: str
    language: str = "en"
    intent: str = "general"
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    citations: List[EvidenceResponse] = []
    next_steps: List[NextStepResponse] = []
    requires_human_review: bool = False
    verification_status: str = "unverified"
    jurisdiction: Optional[JurisdictionResponse] = None
    conversation_id: str = ""


# ── Documents ────────────────────────────────────────────────────

class DocumentAnalysisRequest(BaseModel):
    """Request to analyze an uploaded document."""
    language: str = Field(default="en", description="Preferred response language")
    # File is sent as multipart form data, not in JSON body


class DocumentExtractionResponse(BaseModel):
    """Result of document OCR and analysis."""
    document_name: str
    document_type: str
    extracted_text_snippet: str
    summary: str
    key_points: List[str] = []
    required_actions: List[str] = []
    verification_status: str = "unverified"
    detected_authority: str = ""
    is_demo_result: bool = False


# ── Grievances ───────────────────────────────────────────────────

class GrievanceCreateRequest(BaseModel):
    """Request to create a grievance draft."""
    issue_type: str = Field(..., min_length=1, description="Category of grievance")
    description: str = Field(..., min_length=10, description="Detailed description of the issue")
    state: str = Field(..., description="State jurisdiction")
    society_name: str = Field(..., description="Name of cooperative society")
    society_type: str = Field(default="PACS", description="Type of cooperative")
    member_id: Optional[str] = Field(default=None, description="Member ID or account number")


class GrievanceResponse(BaseModel):
    """Generated grievance draft response."""
    reference_no: str
    status: str = "draft"
    generated_text: str
    issue_type: str
    state: str
    society_name: str
    created_at: str
    disclaimer: str = (
        "Civora is an advisory assistance tool. Submit this printed/signed "
        "representation to your local Deputy Registrar of Cooperative Societies "
        "(DRCS) or designated grievance portal."
    )


# ── Speech ───────────────────────────────────────────────────────

class TranscriptionResponse(BaseModel):
    """Speech-to-text transcription result."""
    text: str
    language: str = "en"
    confidence: float = 0.0
    is_demo_result: bool = False


class SynthesisRequest(BaseModel):
    """Text-to-speech synthesis request."""
    text: str = Field(..., min_length=1, max_length=5000)
    language: str = Field(default="en")


# ── Sources / Knowledge ──────────────────────────────────────────

class KnowledgeDocumentResponse(BaseModel):
    """A knowledge document in the system."""
    id: str
    title: str
    source: str
    authority: str
    document_type: str
    jurisdiction: str
    effective_date: str
    version: str
    language: str
    source_type: str  # "official" | "user_uploaded" | "demo_data"


# ── Human Review ─────────────────────────────────────────────────

class HumanReviewRequest(BaseModel):
    """Request for human-in-the-loop review."""
    case_id: str
    reason: str
    conversation_context: str = ""


class HumanReviewResponse(BaseModel):
    """Human review case."""
    case_id: str
    status: str = "pending"
    reason: str
    created_at: str


# ── Health ───────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    """API health check response."""
    status: str = "healthy"
    version: str
    mode: str
    services: dict = {}


# ── Error ────────────────────────────────────────────────────────

class ErrorDetail(BaseModel):
    """Structured error detail."""
    code: str
    message: str
    request_id: str = ""


class ErrorResponse(BaseModel):
    """Structured API error response."""
    error: ErrorDetail
