"""
Civora SQLAlchemy ORM Database Models.

Defines the relational schema for persistence:
- Users & Sessions
- Conversations & Messages
- Uploaded Documents & OCR extractions
- Grievance Drafts & Statutory records
- Schemes & Legal Act Provisions Knowledge Base
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional, List

from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Boolean,
    Float,
    Integer,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class UserModel(Base):
    """User account entity (for authenticated users / citizen accounts)."""
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_number = Column(String(20), unique=True, index=True, nullable=True)
    full_name = Column(String(255), nullable=True)
    preferred_language = Column(String(10), default="en", nullable=False)
    state = Column(String(100), default="Tamil Nadu", nullable=False)
    district = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    conversations = relationship("ConversationModel", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("DocumentModel", back_populates="user", cascade="all, delete-orphan")
    grievances = relationship("GrievanceModel", back_populates="user", cascade="all, delete-orphan")


class ConversationModel(Base):
    """Chat session or kiosk conversation thread."""
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    title = Column(String(255), default="New Legal Query", nullable=False)
    language = Column(String(10), default="en", nullable=False)
    channel = Column(String(20), default="web", nullable=False)  # web, kiosk, voice
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("UserModel", back_populates="conversations")
    messages = relationship("MessageModel", back_populates="conversation", cascade="all, delete-orphan", order_by="MessageModel.created_at")


class MessageModel(Base):
    """Individual message in a conversation with RAG citations and evidence provenance."""
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(36), ForeignKey("conversations.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en", nullable=False)
    intent = Column(String(50), nullable=True)
    confidence_score = Column(Float, default=1.0, nullable=False)
    citations = Column(JSON, default=list, nullable=False)  # List of cited legal acts / schemes
    evidence_metadata = Column(JSON, default=dict, nullable=False)  # OCR or retrieval provenance
    audio_url = Column(String(512), nullable=True)  # Synthesized TTS audio if generated
    created_at = Column(DateTime, default=utc_now, nullable=False)

    conversation = relationship("ConversationModel", back_populates="messages")


class DocumentModel(Base):
    """Uploaded user document (e.g. Passbook, Land Record, Society Notice) for OCR analysis."""
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    storage_path = Column(String(512), nullable=False)
    extracted_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, default=0.0, nullable=False)
    extracted_fields = Column(JSON, default=dict, nullable=False)  # Key-value pairs (Account No, Society Name, etc.)
    status = Column(String(30), default="processed", nullable=False)  # uploaded, processing, processed, error
    created_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("UserModel", back_populates="documents")


class GrievanceModel(Base):
    """Drafted legal grievance representation with statutory citations."""
    __tablename__ = "grievances"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    grievance_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # loan_waiver, election_dispute, passbook, corruption, audit
    society_name = Column(String(255), nullable=False)
    society_registration_no = Column(String(100), nullable=True)
    jurisdiction_level = Column(String(50), nullable=False)  # state_registrar, deputy_registrar, central_registrar
    addressed_authority = Column(String(255), nullable=False)
    formal_draft_text = Column(Text, nullable=False)
    statutory_citations = Column(JSON, default=list, nullable=False)
    evidence_documents = Column(JSON, default=list, nullable=False)
    status = Column(String(30), default="drafted", nullable=False)  # drafted, exported, pending_user_action
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("UserModel", back_populates="grievances")


class SchemeModel(Base):
    """Government and Cooperative Welfare Scheme knowledge entity."""
    __tablename__ = "schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # agriculture, credit, dairy, housing, women_shg
    department = Column(String(255), nullable=False)
    level = Column(String(20), default="Central", nullable=False)  # Central, State
    state = Column(String(100), nullable=True)  # Null if Central
    summary = Column(Text, nullable=False)
    benefits = Column(JSON, default=list, nullable=False)
    eligibility_criteria = Column(JSON, default=list, nullable=False)
    required_documents = Column(JSON, default=list, nullable=False)
    application_process = Column(Text, nullable=False)
    official_portal_url = Column(String(512), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)


class LegalProvisionModel(Base):
    """Cooperative Acts and statutory provisions knowledge entity."""
    __tablename__ = "legal_provisions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    act_name = Column(String(255), nullable=False)  # e.g., Multi-State Co-operative Societies Act 2002
    act_code = Column(String(50), index=True, nullable=False)  # MSCS_2002, TNCSA_1983
    jurisdiction = Column(String(50), nullable=False)  # Central, Tamil Nadu, Maharashtra
    section = Column(String(50), nullable=False)  # e.g., Section 84
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    full_text = Column(Text, nullable=True)
    remedy_available = Column(Text, nullable=True)
    competent_forum = Column(String(255), nullable=True)
    tags = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
