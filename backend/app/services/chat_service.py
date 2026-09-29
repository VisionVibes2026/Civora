"""
Civora Chat Service.

Orchestrates the full chat pipeline:
  User Query → language detection → intent classification → jurisdiction
  → retrieval → evidence validation → answer generation → citation → response

The service delegates to provider interfaces so implementations can be
swapped between mock (demo) and real providers via configuration.
"""

from __future__ import annotations

from typing import Optional

from backend.app.core.config import get_settings
from backend.app.core.logging import get_logger
from backend.app.core.security import redact_pii
from backend.app.domain.entities import (
    ChatResponse,
    Evidence,
    JurisdictionContext,
    SourceType,
    VerificationStatus,
)

logger = get_logger(__name__)


class ChatService:
    """
    Main chat orchestration service.

    In demo mode, returns responses from the demo data provider.
    In production, would route through the full RAG pipeline.
    """

    def __init__(
        self,
        language_service=None,
        retrieval_service=None,
        jurisdiction_service=None,
        llm_service=None,
    ):
        self.language_service = language_service
        self.retrieval_service = retrieval_service
        self.jurisdiction_service = jurisdiction_service
        self.llm_service = llm_service
        self.settings = get_settings()

    async def process_query(
        self,
        query: str,
        language: str = "en",
        conversation_id: Optional[str] = None,
        jurisdiction_state: Optional[str] = None,
        cooperative_type: Optional[str] = None,
    ) -> ChatResponse:
        """
        Process a user query through the full pipeline.

        Steps:
        1. Detect / confirm language
        2. Classify intent
        3. Extract entities and jurisdiction context
        4. Retrieve relevant knowledge
        5. Validate evidence
        6. Generate answer with citations
        """
        logger.info(
            "Processing chat query",
            extra={"language": language, "query_length": len(query)},
        )

        # Never log the raw query in production — it may contain PII
        if self.settings.DEBUG:
            logger.debug("Query (redacted): %s", redact_pii(query[:200]))

        # Step 1: Language detection
        detected_language = language
        if self.language_service:
            detected_language = await self.language_service.detect_language(query)

        # Step 2-3: Intent and entity extraction (mock for now)
        intent = self._classify_intent(query)

        # Step 4: Jurisdiction context
        jurisdiction = JurisdictionContext(
            state=jurisdiction_state or "Tamil Nadu",
            cooperative_type=cooperative_type or "PACS",
            authority="Registrar of Cooperative Societies",
        )

        # Step 5-6: In demo mode, use demo response provider
        if self.settings.is_demo_mode:
            return self._get_demo_response(
                query, detected_language, intent, jurisdiction
            )

        # Production pipeline (not yet connected)
        # Would call: retrieval_service → evidence validation → LLM generation
        return ChatResponse(
            answer="This query requires a connected LLM and knowledge base. "
                   "Please configure LLM_PROVIDER and QDRANT_URL in .env.",
            language=detected_language,
            intent=intent,
            confidence=0.0,
            requires_human_review=True,
            verification_status=VerificationStatus.VERIFICATION_REQUIRED,
            jurisdiction=jurisdiction,
        )

    def _classify_intent(self, query: str) -> str:
        """Basic keyword-based intent classification (demo)."""
        lower = query.lower()
        if any(w in lower for w in ["grievance", "complaint", "problem", "issue"]):
            return "grievance"
        if any(w in lower for w in ["document", "upload", "check", "verify"]):
            return "document_analysis"
        if any(w in lower for w in ["scheme", "subsidy", "benefit", "loan"]):
            return "scheme_inquiry"
        if any(w in lower for w in ["law", "act", "section", "rule", "bylaw"]):
            return "legal_inquiry"
        if any(w in lower for w in ["insurance", "pmfby", "crop", "damage"]):
            return "insurance_inquiry"
        return "general"

    def _get_demo_response(
        self,
        query: str,
        language: str,
        intent: str,
        jurisdiction: JurisdictionContext,
    ) -> ChatResponse:
        """
        Return a demo response from the sample data provider.

        CLEARLY LABELED: This is demo/development data, not a live
        government integration.
        """
        from backend.app.services.demo_data_provider import DemoDataProvider

        provider = DemoDataProvider()
        demo_response = provider.get_response(query, language)

        citations = [
            Evidence(
                source_id="demo-pmfby-001",
                title="Pradhan Mantri Fasal Bima Yojana",
                authority="Ministry of Agriculture & Farmers Welfare",
                section="Clause 6.3 — Localized Calamity Coverage",
                effective_date="01-Aug-2024",
                source_type=SourceType.DEMO_DATA,
                url="https://pmfby.gov.in",
                relevance_score=0.85,
            )
        ]

        return ChatResponse(
            answer=demo_response,
            language=language,
            intent=intent,
            confidence=0.85,
            citations=citations,
            next_steps=[
                {"label": "View Scheme Details", "action_type": "schemes"},
                {"label": "Prepare Grievance", "action_type": "grievance"},
            ],
            requires_human_review=False,
            verification_status=VerificationStatus.EVIDENCE_MATCHED,
            jurisdiction=jurisdiction,
        )
