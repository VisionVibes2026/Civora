"""
Chat API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from backend.app.api.dependencies import get_chat_service
from backend.app.schemas.api import ChatRequest, ChatResponse as ChatResponseSchema
from backend.app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/", response_model=ChatResponseSchema)
async def send_message(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
):
    """
    Process a user chat query and return a structured response.

    The response includes the answer, evidence citations, jurisdiction
    context, confidence score, and verification status.
    """
    result = await chat_service.process_query(
        query=request.query,
        language=request.language,
        conversation_id=request.conversation_id,
        jurisdiction_state=request.jurisdiction_state,
        cooperative_type=request.cooperative_type,
    )

    return ChatResponseSchema(
        answer=result.answer,
        language=result.language,
        intent=result.intent,
        confidence=result.confidence,
        citations=[
            {
                "source_id": c.source_id,
                "title": c.title,
                "authority": c.authority,
                "section": c.section,
                "effective_date": c.effective_date,
                "source_type": c.source_type.value if hasattr(c.source_type, 'value') else str(c.source_type),
                "url": c.url,
                "relevance_score": c.relevance_score,
            }
            for c in result.citations
        ],
        next_steps=[
            {"label": s.get("label", ""), "action_type": s.get("action_type", "query")}
            for s in result.next_steps
        ],
        requires_human_review=result.requires_human_review,
        verification_status=result.verification_status.value if hasattr(result.verification_status, 'value') else str(result.verification_status),
        jurisdiction={
            "state": result.jurisdiction.state if result.jurisdiction else "",
            "cooperative_type": result.jurisdiction.cooperative_type if result.jurisdiction else "",
            "authority": result.jurisdiction.authority if result.jurisdiction else "",
        } if result.jurisdiction else None,
        conversation_id=request.conversation_id or "",
    )
