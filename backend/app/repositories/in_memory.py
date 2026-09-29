"""
Civora In-Memory Repositories for Development and Testing.

Provides zero-dependency in-memory storage implementations of all repositories,
preloaded with domain knowledge data.
"""

from __future__ import annotations

from typing import List, Optional, Dict
from datetime import datetime, timezone

from backend.app.domain.entities import (
    Conversation,
    Message,
    Document,
    GrievanceDraft,
    Scheme,
    LegalProvision,
)
from backend.app.repositories.base import (
    ConversationRepository,
    DocumentRepository,
    GrievanceRepository,
    KnowledgeRepository,
)


class InMemoryConversationRepository(ConversationRepository):
    """In-memory implementation of ConversationRepository."""

    def __init__(self):
        self._conversations: Dict[str, Conversation] = {}
        self._messages: Dict[str, List[Message]] = {}

    async def get_by_id(self, conversation_id: str) -> Optional[Conversation]:
        return self._conversations.get(conversation_id)

    async def list_by_user(self, user_id: str, limit: int = 20) -> List[Conversation]:
        return [c for c in self._conversations.values() if c.user_id == user_id][:limit]

    async def save(self, conversation: Conversation) -> Conversation:
        self._conversations[conversation.id] = conversation
        if conversation.id not in self._messages:
            self._messages[conversation.id] = []
        return conversation

    async def add_message(self, message: Message) -> Message:
        if message.conversation_id not in self._messages:
            self._messages[message.conversation_id] = []
        self._messages[message.conversation_id].append(message)
        return message

    async def get_messages(self, conversation_id: str) -> List[Message]:
        return self._messages.get(conversation_id, [])


class InMemoryDocumentRepository(DocumentRepository):
    """In-memory implementation of DocumentRepository."""

    def __init__(self):
        self._documents: Dict[str, Document] = {}

    async def get_by_id(self, document_id: str) -> Optional[Document]:
        return self._documents.get(document_id)

    async def save(self, document: Document) -> Document:
        self._documents[document.id] = document
        return document

    async def list_by_user(self, user_id: str) -> List[Document]:
        return [d for d in self._documents.values() if d.user_id == user_id]


class InMemoryGrievanceRepository(GrievanceRepository):
    """In-memory implementation of GrievanceRepository."""

    def __init__(self):
        self._grievances: Dict[str, GrievanceDraft] = {}

    async def get_by_id(self, grievance_id: str) -> Optional[GrievanceDraft]:
        return self._grievances.get(grievance_id)

    async def get_by_number(self, grievance_number: str) -> Optional[GrievanceDraft]:
        for g in self._grievances.values():
            if g.grievance_number == grievance_number:
                return g
        return None

    async def save(self, draft: GrievanceDraft) -> GrievanceDraft:
        self._grievances[draft.id] = draft
        return draft

    async def list_by_user(self, user_id: str) -> List[GrievanceDraft]:
        return [g for g in self._grievances.values() if g.user_id == user_id]


class InMemoryKnowledgeRepository(KnowledgeRepository):
    """In-memory implementation of KnowledgeRepository pre-seeded with sample data."""

    def __init__(self):
        self._schemes: List[Scheme] = [
            Scheme(
                id="sch_01",
                code="PM_KISAN",
                name="PM Kisan Samman Nidhi",
                category="Direct Income Support",
                department="Ministry of Agriculture & Farmers Welfare",
                level="Central",
                summary="Income support of Rs. 6000 per year in three equal installments to all landholding farmer families.",
                benefits=["Rs. 6000 per annum in 3 installments of Rs. 2000 directly to bank account via DBT."],
                eligibility_criteria=[
                    "Small and marginal farmer families with cultivable landholding up to 2 hectares.",
                    "Active bank account linked with Aadhaar.",
                    "Land records registered under state revenue portal."
                ],
                required_documents=["Aadhaar Card", "Land Ownership Documents / Patta", "Bank Passbook", "Active Mobile Number"],
                application_process="Online via pmkisan.gov.in portal or CSC / PACS Common Service Centers.",
                portal_url="https://pmkisan.gov.in"
            ),
            Scheme(
                id="sch_02",
                code="TN_COOP_WAIVER",
                name="Tamil Nadu Co-operative Crop Loan Waiver Scheme",
                category="Debt Relief & Credit Support",
                department="Co-operation, Food and Consumer Protection Department, Govt of Tamil Nadu",
                level="State",
                state="Tamil Nadu",
                summary="Waiver of outstanding crop loans availed by eligible small & marginal farmers from Primary Agricultural Cooperative Credit Societies (PACCS).",
                benefits=["Full or partial waiver of outstanding principal and interest on eligible short-term crop loans."],
                eligibility_criteria=[
                    "Member of a registered PACCS in Tamil Nadu.",
                    "Loan disbursed on or before cut-off date with valid land holding documentation.",
                    "Aadhaar authentication and verification of family ration card."
                ],
                required_documents=["PACCS Loan Passbook", "Patta / Chitta copy", "Ration Card (Smart Card)", "Aadhaar Card"],
                application_process="Verification through respective PACCS secretary and audit inspection committee.",
                portal_url="https://tnpacs.tn.gov.in"
            ),
            Scheme(
                id="sch_03",
                code="NCDC_PACS_COMP",
                name="Computerization of Primary Agricultural Credit Societies (PACS)",
                category="Cooperative Modernization",
                department="Ministry of Cooperation, Govt of India / NCDC",
                level="Central",
                summary="Transformation of PACS into dynamic economic entities and Common Service Centres with ERP cloud software.",
                benefits=[
                    "Standardized ERP software across all PACS.",
                    "Direct linkage with NABARD and State Cooperative Banks.",
                    "Transparent bookkeeping and direct subsidy delivery."
                ],
                eligibility_criteria=["Registered Primary Agricultural Cooperative Society."],
                required_documents=["PACS Registration Certificate", "Society Bylaws", "Audit Report"],
                application_process="Through State Registrar of Cooperative Societies to National Implementation Committee.",
                portal_url="https://cooperation.gov.in"
            )
        ]

        self._provisions: List[LegalProvision] = [
            LegalProvision(
                id="leg_01",
                act_name="Multi-State Co-operative Societies Act, 2002",
                act_code="MSCS_2002",
                jurisdiction="Central",
                section="Section 84",
                title="Reference of Disputes to Arbitration",
                summary="Any dispute touching the constitution, management or business of a multi-state co-operative society shall be referred to arbitration by the Central Registrar.",
                remedy_available="Filing of arbitration petition before Central Registrar or designated Arbitrator within limitation period.",
                competent_forum="Central Registrar of Cooperative Societies, New Delhi",
                tags=["dispute", "arbitration", "election", "management", "recovery"]
            ),
            LegalProvision(
                id="leg_02",
                act_name="Tamil Nadu Co-operative Societies Act, 1983",
                act_code="TNCSA_1983",
                jurisdiction="Tamil Nadu",
                section="Section 90",
                title="Disputes and Surcharge Proceedings",
                summary="If any dispute touching the constitution of the board, management, or business of a registered society arises, such dispute shall be referred to the Registrar.",
                remedy_available="Statutory dispute petition under Section 90 before the Deputy Registrar of Cooperative Societies.",
                competent_forum="Deputy Registrar (DRCS) / Joint Registrar (JRCS) of the respective circle",
                tags=["dispute", "paccs", "loan", "mismanagement", "state_registrar"]
            ),
            LegalProvision(
                id="leg_03",
                act_name="Tamil Nadu Co-operative Societies Act, 1983",
                act_code="TNCSA_1983",
                jurisdiction="Tamil Nadu",
                section="Section 81",
                title="Inquiry by Registrar",
                summary="The Registrar may of his own motion, and shall on the application of a majority of the board or not less than one-third of the members, hold an inquiry into the constitution, working and financial condition of a registered society.",
                remedy_available="Representation by members to order statutory inquiry into society irregularities.",
                competent_forum="District Joint Registrar of Cooperative Societies",
                tags=["inquiry", "audit", "fraud", "irregularities", "investigation"]
            ),
            LegalProvision(
                id="leg_04",
                act_name="Maharashtra Co-operative Societies Act, 1960",
                act_code="MCSA_1960",
                jurisdiction="Maharashtra",
                section="Section 91",
                title="Disputes to be Referred to Co-operative Court",
                summary="Notwithstanding anything contained in any other law, any dispute touching the constitution, elections, conduct of general meetings, management or business of a society shall be referred to the Co-operative Court.",
                remedy_available="Filing a dispute plaint before the Co-operative Court having territorial jurisdiction.",
                competent_forum="Maharashtra Co-operative Court",
                tags=["cooperative_court", "dispute", "election", "recovery"]
            )
        ]

    async def search_schemes(
        self, query: str, state: Optional[str] = None, category: Optional[str] = None, limit: int = 10
    ) -> List[Scheme]:
        query_lower = query.lower()
        results = []
        for s in self._schemes:
            if state and s.level == "State" and s.state and s.state.lower() != state.lower():
                continue
            if category and s.category.lower() != category.lower():
                continue
            if (
                query_lower in s.name.lower()
                or query_lower in s.summary.lower()
                or query_lower in s.category.lower()
                or any(query_lower in b.lower() for b in s.benefits)
            ):
                results.append(s)
            elif not query:
                results.append(s)
        return results[:limit]

    async def search_provisions(
        self, query: str, act_code: Optional[str] = None, jurisdiction: Optional[str] = None, limit: int = 10
    ) -> List[LegalProvision]:
        query_lower = query.lower()
        results = []
        for p in self._provisions:
            if act_code and p.act_code != act_code:
                continue
            if jurisdiction and p.jurisdiction.lower() != jurisdiction.lower():
                continue
            if (
                query_lower in p.title.lower()
                or query_lower in p.summary.lower()
                or query_lower in p.section.lower()
                or any(query_lower in t.lower() for t in p.tags)
            ):
                results.append(p)
            elif not query:
                results.append(p)
        return results[:limit]

    async def get_all_schemes(self, state: Optional[str] = None) -> List[Scheme]:
        if state:
            return [s for s in self._schemes if s.level == "Central" or (s.state and s.state.lower() == state.lower())]
        return self._schemes

    async def get_all_provisions(self, act_code: Optional[str] = None) -> List[LegalProvision]:
        if act_code:
            return [p for p in self._provisions if p.act_code == act_code]
        return self._provisions
