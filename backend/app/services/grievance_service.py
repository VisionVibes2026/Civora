"""
Civora Grievance Drafting Service.

Generates formal grievance representations with statutory citations.
Template-based generation with jurisdiction-aware formatting.

IMPORTANT: Civora is an advisory tool. It helps DRAFT representations
but does NOT submit grievances to government systems.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from backend.app.core.logging import get_logger
from backend.app.core.security import validate_query_input

logger = get_logger(__name__)


class GrievanceService:
    """
    Generates grievance drafts with statutory citations.

    All drafts include a clear disclaimer that Civora is advisory only
    and does not submit to any government portal.
    """

    DISCLAIMER = (
        "DISCLAIMER: This document was drafted with the assistance of Civora, "
        "an AI advisory tool. Civora does NOT submit grievances to government "
        "systems on your behalf. Please print, sign, and submit this "
        "representation to the relevant Deputy Registrar of Cooperative "
        "Societies (DRCS) office or designated grievance portal."
    )

    # Mapping of states to their cooperative societies act
    STATE_ACTS = {
        "Tamil Nadu": "Tamil Nadu Cooperative Societies Act, 1983",
        "Maharashtra": "Maharashtra Cooperative Societies Act, 1960",
        "Karnataka": "Karnataka Cooperative Societies Act, 1959",
        "Telangana": "Telangana Mutually Aided Cooperative Societies Act, 1995",
    }

    def generate_draft(
        self,
        issue_type: str,
        description: str,
        state: str,
        society_name: str,
        society_type: str = "PACS",
        member_id: str = "",
    ) -> dict:
        """
        Generate a formal grievance draft.

        Returns the draft text with reference number and metadata.
        """
        validate_query_input(description)
        reference_no = f"CIV-GRV-{uuid.uuid4().hex[:6].upper()}"
        today = datetime.now().strftime("%d-%b-%Y")
        act_name = self.STATE_ACTS.get(state, "Applicable State Cooperative Societies Act")

        draft_text = self._format_draft(
            reference_no=reference_no,
            date=today,
            issue_type=issue_type,
            description=description,
            state=state,
            society_name=society_name,
            society_type=society_type,
            member_id=member_id or "[NOT PROVIDED]",
            act_name=act_name,
        )

        logger.info("Generated grievance draft: %s", reference_no)

        return {
            "reference_no": reference_no,
            "status": "draft",
            "generated_text": draft_text,
            "issue_type": issue_type,
            "state": state,
            "society_name": society_name,
            "created_at": today,
            "disclaimer": self.DISCLAIMER,
        }

    def _format_draft(
        self,
        reference_no: str,
        date: str,
        issue_type: str,
        description: str,
        state: str,
        society_name: str,
        society_type: str,
        member_id: str,
        act_name: str,
    ) -> str:
        """Format the grievance draft using the statutory template."""
        return f"""BEFORE THE DEPUTY REGISTRAR OF COOPERATIVE SOCIETIES
JURISDICTION: {state.upper()}
REFERENCE NO: {reference_no}
DATE: {date}

SUBJECT: Formal Representation regarding {issue_type} - Reg.

APPLICANT DETAILS:
Member Name: [REDACTED — MEMBER NAME]
Member ID / Account No: {member_id}
Cooperative Society: {society_name}
Society Type: {society_type}
State / District: {state}

FACTS OF THE GRIEVANCE:
1. The applicant is a duly registered member of {society_name} holding active share capital.
2. {description}
3. Under the applicable provisions of the {act_name}, members are entitled to timely disbursement of approved subventions and resolution of disputes touching society business.
4. Oral representations made to the society secretary have not yielded resolution within the statutory 30-day timeframe.

REQUESTED RELIEF:
1. Direct the Secretary / Board of {society_name} to verify and address the matter without further administrative delay.
2. Conduct an official inquiry under statutory rules if administrative lapse is identified.

PRAYER:
It is respectfully prayed that the competent authority issue necessary instructions to resolve this matter in the interest of member justice.

Yours faithfully,
(Member Signature / Verification)

---
{self.DISCLAIMER}"""
