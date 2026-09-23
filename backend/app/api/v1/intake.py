from fastapi import APIRouter, Depends
from typing import Optional
from app.schemas.intake import (
    IntakeRequest,
    IntakeResponse,
    QuestionsSubmissionRequest,
    QuestionsSubmissionResponse
)
from app.services.intake_service import intake_service
from app.middleware.auth import get_optional_user, AuthenticatedUser

router = APIRouter(prefix="/intake", tags=["Legal Intake"])

@router.post("", response_model=IntakeResponse)
@router.post("/analyze-initial", response_model=IntakeResponse)
async def process_intake(
    request: IntakeRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Accepts natural-language situation description, extracts structured facts,
    identifies uncertainty and gaps, and returns targeted follow-up questions.
    """
    return await intake_service.analyze_initial_situation(request)

@router.post("/questions", response_model=QuestionsSubmissionResponse)
async def submit_follow_up_questions(
    request: QuestionsSubmissionRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Submits answers to targeted follow-up questions to refine facts before legal analysis.
    """
    return await intake_service.process_question_answers(request)
