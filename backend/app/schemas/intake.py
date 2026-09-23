from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SituationMeta(BaseModel):
    domain: str = Field(description="Legal domain, e.g. housing, employment, consumer, contract")
    issue: str = Field(description="Primary legal issue, e.g. security_deposit_withheld, wrongful_termination")
    jurisdiction_country: str = Field(default="United States")
    jurisdiction_state: Optional[str] = Field(default=None)

class FollowUpQuestion(BaseModel):
    id: str
    question: str
    why_it_matters: str
    placeholder: Optional[str] = None
    category: Optional[str] = None

class IntakeRequest(BaseModel):
    narrative: str = Field(..., min_length=10, max_length=15000, description="Natural language user narrative")
    country: str = Field(default="United States")
    state_or_region: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None)

class IntakeResponse(BaseModel):
    intake_id: str
    situation: SituationMeta
    facts: List[str] = Field(description="Extracted factual assertions preserving user uncertainty")
    missing_information: List[str] = Field(description="Critical evidentiary or timeline gaps")
    follow_up_questions: List[FollowUpQuestion] = Field(description="Targeted clarifying questions")

class QuestionAnswer(BaseModel):
    question_id: str
    question_text: str
    answer: str

class QuestionsSubmissionRequest(BaseModel):
    intake_id: str
    narrative: Optional[str] = Field(default="")
    country: str = "United States"
    state_or_region: Optional[str] = None
    category: Optional[str] = None
    answers: List[QuestionAnswer]

class QuestionsSubmissionResponse(BaseModel):
    intake_id: str
    situation: SituationMeta
    updated_facts: List[str]
    ready_for_analysis: bool = True
