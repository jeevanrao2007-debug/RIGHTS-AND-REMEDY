from fastapi import APIRouter, Depends, Query, Path
from typing import List, Optional
from app.schemas.cases import (
    CaseListItem,
    CaseListResponse,
    UpdateEvidenceStatusRequest,
    UpdateEvidenceStatusResponse,
    DeleteCaseResponse
)
from app.schemas.analysis import LegalAnalysis
from app.repositories.case_repository import case_repository
from app.middleware.auth import get_optional_user, get_current_user, AuthenticatedUser

router = APIRouter(prefix="/cases", tags=["Case Management"])

@router.get("", response_model=List[CaseListItem])
async def list_user_cases(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Returns cases owned by the authenticated user.
    """
    user_id = user.uid if user else "anonymous-session"
    raw_cases = await case_repository.list_cases(user_id=user_id, page=page, page_size=page_size)
    
    items: List[CaseListItem] = []
    for c in raw_cases:
        items.append(
            CaseListItem(
                id=c.get("id", ""),
                title=c.get("title", "Untitled Case"),
                category=c.get("category", "General"),
                created_at=c.get("created_at", ""),
                updated_at=c.get("updated_at", ""),
                primary_issue=c.get("situation_issue", c.get("primaryIssue", "")),
                jurisdiction_country=c.get("jurisdiction_country", "United States"),
                jurisdiction_state=c.get("jurisdiction_state"),
                has_verified_deadline=bool(c.get("has_verified_deadline", False)),
                rights_count=len(c.get("potentially_relevant_rights", c.get("potentiallyRelevantRights", []))),
                evidence_item_count=len(c.get("evidence_checklist", c.get("evidenceChecklist", [])))
            )
        )
    return items

@router.get("/{case_id}")
async def get_case_by_id(
    case_id: str = Path(..., description="Unique case identifier"),
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Retrieves complete case details. Strictly enforces server-side ownership.
    """
    user_id = user.uid if user else "anonymous-session"
    case_data = await case_repository.get_case(case_id=case_id, user_id=user_id)
    return case_data

@router.patch("/{case_id}/evidence/{evidence_id}", response_model=UpdateEvidenceStatusResponse)
async def update_evidence_status(
    case_id: str,
    evidence_id: str,
    body: UpdateEvidenceStatusRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Updates the status ('have', 'need', 'not_sure') of an evidence checklist item.
    """
    user_id = user.uid if user else "anonymous-session"
    result = await case_repository.update_evidence_status(
        case_id=case_id,
        evidence_id=evidence_id,
        new_status=body.status,
        user_id=user_id
    )
    return UpdateEvidenceStatusResponse(
        success=result["success"],
        updated_at=result["updated_at"],
        evidence_id=result["evidence_id"],
        new_status=result["new_status"]
    )

@router.delete("/{case_id}", response_model=DeleteCaseResponse)
async def delete_case(
    case_id: str,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Deletes a case. Strictly enforces server-side ownership.
    """
    user_id = user.uid if user else "anonymous-session"
    await case_repository.delete_case(case_id=case_id, user_id=user_id)
    return DeleteCaseResponse(success=True, case_id=case_id)
