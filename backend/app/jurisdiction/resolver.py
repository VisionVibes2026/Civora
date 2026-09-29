"""
Civora Jurisdiction Resolver.

Handles the multi-tier legal jurisdiction resolution for Indian Cooperative Law:
1. Central Jurisdiction: Multi-State Co-operative Societies Act, 2002 (MSCS Act 2023 Amendment)
   - Governed by Central Registrar of Cooperative Societies (Ministry of Cooperation, New Delhi)
2. State Jurisdiction: State Cooperative Societies Acts
   - Tamil Nadu: Tamil Nadu Co-operative Societies Act, 1983
   - Maharashtra: Maharashtra Co-operative Societies Act, 1960
   - Karnataka: Karnataka Co-operative Societies Act, 1959
   - Andhra Pradesh: AP Co-operative Societies Act, 1964
   - Other States: Respective State Registrar & District Deputy Registrars (DRCS)
"""

from __future__ import annotations

from typing import Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class JurisdictionResult:
    is_multi_state: bool
    applicable_act_name: str
    applicable_act_code: str
    jurisdiction_level: str  # "Central" | "State"
    state: Optional[str]
    competent_authority: str
    appellate_authority: str
    dispute_resolution_section: str
    inquiry_section: str
    notes: str


class JurisdictionResolver:
    """
    Determines statutory jurisdiction and appropriate administrative forum
    based on society type, geography, and multi-state status.
    """

    STATE_ACT_MAPPING = {
        "Tamil Nadu": {
            "act_name": "Tamil Nadu Co-operative Societies Act, 1983",
            "act_code": "TNCSA_1983",
            "competent_authority": "Deputy Registrar of Cooperative Societies (Circle Level) / Joint Registrar (District Level)",
            "appellate_authority": "Co-operative Tribunal / Principal District Court",
            "dispute_section": "Section 90 (Disputes)",
            "inquiry_section": "Section 81 (Inquiry by Registrar)",
            "surcharge_section": "Section 87 (Surcharge Proceedings)",
        },
        "Maharashtra": {
            "act_name": "Maharashtra Co-operative Societies Act, 1960",
            "act_code": "MCSA_1960",
            "competent_authority": "Assistant / Deputy Registrar of Cooperative Societies",
            "appellate_authority": "Maharashtra State Co-operative Appellate Court",
            "dispute_section": "Section 91 (Disputes to be Referred to Co-operative Court)",
            "inquiry_section": "Section 83 (Inquiry by Registrar)",
            "surcharge_section": "Section 88 (Power of Registrar to assess damages)",
        },
        "Karnataka": {
            "act_name": "Karnataka Co-operative Societies Act, 1959",
            "act_code": "KCSA_1959",
            "competent_authority": "Deputy Registrar of Cooperative Societies",
            "appellate_authority": "Karnataka Appellate Tribunal",
            "dispute_section": "Section 70 (Disputes which may be referred to Registrar)",
            "inquiry_section": "Section 64 (Inquiry by Registrar)",
            "surcharge_section": "Section 69 (Surcharge)",
        },
        "Andhra Pradesh": {
            "act_name": "Andhra Pradesh Co-operative Societies Act, 1964",
            "act_code": "APCSA_1964",
            "competent_authority": "Divisional Cooperative Officer / Deputy Registrar",
            "appellate_authority": "Co-operative Tribunal",
            "dispute_section": "Section 61 (Disputes)",
            "inquiry_section": "Section 51 (Inquiry)",
            "surcharge_section": "Section 60 (Surcharge)",
        },
    }

    CENTRAL_ACT = {
        "act_name": "Multi-State Co-operative Societies Act, 2002 (Amended 2023)",
        "act_code": "MSCS_2002",
        "competent_authority": "Central Registrar of Cooperative Societies, Ministry of Cooperation, New Delhi",
        "appellate_authority": "Appellate Authority designated under MSCS Act / High Court",
        "dispute_section": "Section 84 (Reference of Disputes to Arbitration)",
        "inquiry_section": "Section 78 (Inquiry by Central Registrar)",
        "surcharge_section": "Section 83 (Surcharge & Inspection)",
    }

    def resolve(
        self,
        society_name: str,
        state: Optional[str] = "Tamil Nadu",
        is_multi_state: bool = False,
        society_type: Optional[str] = None,
    ) -> JurisdictionResult:
        """
        Resolve the statutory jurisdiction and competent forum for a given cooperative society.
        """
        # Auto-detect multi-state from society name
        name_lower = society_name.lower()
        if (
            is_multi_state
            or "multi-state" in name_lower
            or "multistate" in name_lower
            or "national" in name_lower
            or "mscs" in name_lower
        ):
            return JurisdictionResult(
                is_multi_state=True,
                applicable_act_name=self.CENTRAL_ACT["act_name"],
                applicable_act_code=self.CENTRAL_ACT["act_code"],
                jurisdiction_level="Central",
                state=state,
                competent_authority=self.CENTRAL_ACT["competent_authority"],
                appellate_authority=self.CENTRAL_ACT["appellate_authority"],
                dispute_resolution_section=self.CENTRAL_ACT["dispute_section"],
                inquiry_section=self.CENTRAL_ACT["inquiry_section"],
                notes="This society operates across multiple states and is subject to Central Registrar oversight.",
            )

        # Default to state-level act
        state_key = state if state in self.STATE_ACT_MAPPING else "Tamil Nadu"
        state_info = self.STATE_ACT_MAPPING[state_key]

        return JurisdictionResult(
            is_multi_state=False,
            applicable_act_name=state_info["act_name"],
            applicable_act_code=state_info["act_code"],
            jurisdiction_level="State",
            state=state_key,
            competent_authority=state_info["competent_authority"],
            appellate_authority=state_info["appellate_authority"],
            dispute_resolution_section=state_info["dispute_section"],
            inquiry_section=state_info["inquiry_section"],
            notes=f"Primary agricultural / cooperative society registered under {state_key} State laws.",
        )
