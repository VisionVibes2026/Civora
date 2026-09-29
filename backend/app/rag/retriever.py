"""
Civora RAG (Retrieval-Augmented Generation) Architecture.

Components:
- BaseEmbedder: Abstract embedding generation
- BaseRetriever: Hybrid dense + sparse search interface
- MockRetriever: Seeded in-memory retriever for development
- CitationValidator: Verifies that cited legal sections exist in the indexed statutory corpus
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class RetrievedChunk:
    chunk_id: str
    doc_id: str
    title: str
    content: str
    source_type: str  # "legal_act", "scheme", "guideline", "paccs_bylaws"
    act_or_scheme_code: str
    section_or_clause: Optional[str] = None
    similarity_score: float = 1.0
    metadata: Dict[str, Any] = field(default_factory=dict)


class BaseEmbedder(ABC):
    """Abstract embedding interface."""

    @abstractmethod
    async def embed_query(self, text: str) -> List[float]:
        """Generate vector embedding for a search query."""
        pass

    @abstractmethod
    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate vector embeddings for multiple text chunks."""
        pass


class MockEmbedder(BaseEmbedder):
    """Mock embedder returning deterministic synthetic vectors for development."""

    async def embed_query(self, text: str) -> List[float]:
        # Return dummy 384-dim vector
        return [0.01 * (i % 10) for i in range(384)]

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return [[0.01 * (i % 10) for i in range(384)] for _ in texts]


class BaseRetriever(ABC):
    """Abstract hybrid retriever."""

    @abstractmethod
    async def retrieve(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None,
        language: str = "en",
    ) -> List[RetrievedChunk]:
        """Retrieve relevant statutory and scheme knowledge chunks."""
        pass


class MockKnowledgeRetriever(BaseRetriever):
    """
    In-memory knowledge retriever with sample cooperative acts and schemes corpus.
    Provides fast, deterministic responses in development without needing Qdrant running.
    """

    def __init__(self):
        self._corpus: List[RetrievedChunk] = [
            RetrievedChunk(
                chunk_id="chunk_tn_01",
                doc_id="TNCSA_1983",
                title="Tamil Nadu Co-operative Societies Act 1983 - Section 90",
                content=(
                    "Section 90: Disputes touching the constitution of the board, management, or "
                    "business of a registered society. Any dispute shall be referred to the Registrar. "
                    "Limitation period is generally within 6 years from the date of cause of action, "
                    "or 1 year in case of election disputes. The Registrar may decide it himself or "
                    "refer it to an arbitrator."
                ),
                source_type="legal_act",
                act_or_scheme_code="TNCSA_1983",
                section_or_clause="Section 90",
                similarity_score=0.92,
                metadata={"state": "Tamil Nadu", "forum": "Deputy Registrar / Co-operative Tribunal"},
            ),
            RetrievedChunk(
                chunk_id="chunk_tn_02",
                doc_id="TNCSA_1983",
                title="Tamil Nadu Co-operative Societies Act 1983 - Section 81",
                content=(
                    "Section 81: Statutory Inquiry by Registrar. The Registrar may on his own motion, "
                    "or on application of 1/3rd of members or majority of the board, hold an inquiry "
                    "into the constitution, working, and financial condition of the society. Inquiry "
                    "report must be completed within 3 months."
                ),
                source_type="legal_act",
                act_or_scheme_code="TNCSA_1983",
                section_or_clause="Section 81",
                similarity_score=0.88,
                metadata={"state": "Tamil Nadu", "forum": "District Joint Registrar"},
            ),
            RetrievedChunk(
                chunk_id="chunk_mscs_01",
                doc_id="MSCS_2002",
                title="Multi-State Co-operative Societies Act 2002 - Section 84",
                content=(
                    "Section 84: Reference of disputes to arbitration. Any dispute touching the "
                    "constitution, management, elections or business of a Multi-State Co-operative "
                    "Society shall be referred to arbitration under the Arbitration and Conciliation "
                    "Act 1996, appointed by the Central Registrar."
                ),
                source_type="legal_act",
                act_or_scheme_code="MSCS_2002",
                section_or_clause="Section 84",
                similarity_score=0.91,
                metadata={"level": "Central", "forum": "Central Registrar of Cooperative Societies"},
            ),
            RetrievedChunk(
                chunk_id="chunk_scheme_crop",
                doc_id="TN_CROP_LOAN_WAIVER",
                title="Tamil Nadu Farm Crop Loan Waiver Guidelines",
                content=(
                    "Eligibility guidelines for crop loan waiver: Applicable to small and marginal "
                    "farmers holding up to 5 acres of agricultural land. The applicant must submit "
                    "PACCS passbook, Patta copy, Aadhaar verification, and family ration card. "
                    "Grievances regarding exclusion must be submitted to the District Collector "
                    "Special Monitoring Committee."
                ),
                source_type="scheme",
                act_or_scheme_code="TN_COOP_WAIVER",
                section_or_clause="Clause 4.2",
                similarity_score=0.89,
                metadata={"category": "Agriculture / Credit"},
            ),
        ]

    async def retrieve(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None,
        language: str = "en",
    ) -> List[RetrievedChunk]:
        query_words = set(query.lower().split())
        scored: List[tuple[float, RetrievedChunk]] = []

        for chunk in self._corpus:
            content_words = set(chunk.content.lower().split()) | set(chunk.title.lower().split())
            intersection = query_words & content_words
            overlap_score = len(intersection) / max(len(query_words), 1)
            final_score = min(0.95, 0.5 + overlap_score * 0.5)
            scored.append((final_score, chunk))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in scored[:top_k]]


class CitationValidator:
    """
    Validates generated response citations against known legal statutory records
    to prevent AI hallucinations of non-existent sections or acts.
    """

    KNOWN_ACT_SECTIONS = {
        "TNCSA_1983": ["Section 81", "Section 82", "Section 87", "Section 90", "Section 152"],
        "MSCS_2002": ["Section 78", "Section 83", "Section 84", "Section 99"],
        "MCSA_1960": ["Section 78", "Section 83", "Section 88", "Section 91", "Section 101"],
    }

    def validate_citation(self, act_code: str, section: str) -> bool:
        """Check if section exists in statutory registry."""
        sections = self.KNOWN_ACT_SECTIONS.get(act_code, [])
        return any(section.lower().replace(" ", "") in s.lower().replace(" ", "") for s in sections)
