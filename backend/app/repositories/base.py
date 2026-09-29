"""
Civora Abstract Repository Interfaces.

Provides clean data access abstractions for:
- Conversations and Message history
- Documents and OCR records
- Grievances and statutory drafts
- Knowledge Base (Schemes and Acts)
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

from backend.app.domain.entities import (
    Conversation,
    Message,
    Document,
    GrievanceDraft,
    Scheme,
    LegalProvision,
)


class ConversationRepository(ABC):
    """Abstract interface for conversation and message persistence."""

    @abstractmethod
    async def get_by_id(self, conversation_id: str) -> Optional[Conversation]:
        """Fetch conversation by ID."""
        pass

    @abstractmethod
    async def list_by_user(self, user_id: str, limit: int = 20) -> List[Conversation]:
        """List conversations for a user."""
        pass

    @abstractmethod
    async def save(self, conversation: Conversation) -> Conversation:
        """Persist or update conversation."""
        pass

    @abstractmethod
    async def add_message(self, message: Message) -> Message:
        """Add message to conversation."""
        pass

    @abstractmethod
    async def get_messages(self, conversation_id: str) -> List[Message]:
        """Fetch all messages for a conversation."""
        pass


class DocumentRepository(ABC):
    """Abstract interface for document record persistence."""

    @abstractmethod
    async def get_by_id(self, document_id: str) -> Optional[Document]:
        """Fetch document record by ID."""
        pass

    @abstractmethod
    async def save(self, document: Document) -> Document:
        """Save new or updated document metadata and OCR results."""
        pass

    @abstractmethod
    async def list_by_user(self, user_id: str) -> List[Document]:
        """List documents uploaded by user."""
        pass


class GrievanceRepository(ABC):
    """Abstract interface for grievance drafting persistence."""

    @abstractmethod
    async def get_by_id(self, grievance_id: str) -> Optional[GrievanceDraft]:
        """Fetch grievance draft by ID."""
        pass

    @abstractmethod
    async def get_by_number(self, grievance_number: str) -> Optional[GrievanceDraft]:
        """Fetch grievance draft by reference number."""
        pass

    @abstractmethod
    async def save(self, draft: GrievanceDraft) -> GrievanceDraft:
        """Persist or update grievance draft."""
        pass

    @abstractmethod
    async def list_by_user(self, user_id: str) -> List[GrievanceDraft]:
        """List grievances drafted by user."""
        pass


class KnowledgeRepository(ABC):
    """Abstract interface for querying schemes and legal provisions."""

    @abstractmethod
    async def search_schemes(
        self, query: str, state: Optional[str] = None, category: Optional[str] = None, limit: int = 10
    ) -> List[Scheme]:
        """Search government and cooperative schemes."""
        pass

    @abstractmethod
    async def search_provisions(
        self, query: str, act_code: Optional[str] = None, jurisdiction: Optional[str] = None, limit: int = 10
    ) -> List[LegalProvision]:
        """Search statutory provisions across acts."""
        pass

    @abstractmethod
    async def get_all_schemes(self, state: Optional[str] = None) -> List[Scheme]:
        """Retrieve all active schemes."""
        pass

    @abstractmethod
    async def get_all_provisions(self, act_code: Optional[str] = None) -> List[LegalProvision]:
        """Retrieve all legal provisions."""
        pass
