"""
Grievance drafting API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from backend.app.api.dependencies import get_grievance_service
from backend.app.schemas.api import GrievanceCreateRequest, GrievanceResponse
from backend.app.services.grievance_service import GrievanceService

router = APIRouter(prefix="/grievances", tags=["Grievances"])


@router.post("/draft", response_model=GrievanceResponse)
async def create_grievance_draft(
    request: GrievanceCreateRequest,
    grievance_service: GrievanceService = Depends(get_grievance_service),
):
    """
    Generate a formal grievance draft with statutory citations.

    ADVISORY ONLY: This does NOT submit the grievance to any
    government system. The user must print, sign, and submit
    the generated draft manually.
    """
    result = grievance_service.generate_draft(
        issue_type=request.issue_type,
        description=request.description,
        state=request.state,
        society_name=request.society_name,
        society_type=request.society_type,
        member_id=request.member_id or "",
    )
    return GrievanceResponse(**result)
