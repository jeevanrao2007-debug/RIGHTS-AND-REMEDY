from fastapi import APIRouter, Depends
from typing import Optional
from app.schemas.analysis import AnalysisRequest, LegalAnalysis
from app.services.legal_analysis_service import legal_analysis_service
from app.middleware.auth import get_optional_user, AuthenticatedUser

router = APIRouter(tags=["Legal Analysis"])

@router.post("/analysis", response_model=LegalAnalysis)
@router.post("/intake/complete-analysis", response_model=LegalAnalysis)
async def generate_legal_analysis(
    request: AnalysisRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Performs source-grounded legal RAG analysis:
    - Retrieves authoritative statutory sources
    - Grounds rights and conservative verified deadlines
    - Validates citations and rejects hallucinated provisions
    - Builds a 5-stage non-prescriptive remedy pathway
    - Persists case tied securely to the authenticated user
    """
    effective_user_id = user.uid if user else "anonymous-session"
    return await legal_analysis_service.perform_analysis(request, user_id=effective_user_id)
