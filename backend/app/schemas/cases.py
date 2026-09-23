from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class CaseListItem(BaseModel):
    id: str
    title: str
    category: str
    created_at: str
    updated_at: str
    primary_issue: str
    jurisdiction_country: str
    jurisdiction_state: Optional[str] = None
    has_verified_deadline: bool = False
    rights_count: int = 0
    evidence_item_count: int = 0

class CaseListResponse(BaseModel):
    cases: List[CaseListItem]
    total: int
    page: int = 1
    page_size: int = 20

class UpdateEvidenceStatusRequest(BaseModel):
    status: Literal["have", "need", "not_sure"]

class UpdateEvidenceStatusResponse(BaseModel):
    success: bool
    updated_at: str
    evidence_id: str
    new_status: str

class DeleteCaseResponse(BaseModel):
    success: bool
    case_id: str
    message: str = "Case successfully deleted"
