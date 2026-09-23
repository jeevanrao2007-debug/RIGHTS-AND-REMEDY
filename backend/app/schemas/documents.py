from typing import List, Optional, Literal
from pydantic import BaseModel, Field

DocumentAnalysisMode = Literal[
    "explain_simply",
    "find_obligations",
    "find_important_clauses",
    "identify_potential_risks",
    "find_dates_deadlines",
    "find_inconsistencies",
    "ask_questions"
]

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    content_type: str
    file_size_bytes: int
    extracted_character_count: int
    uploaded_at: str
    case_id: Optional[str] = None
    extracted_text: Optional[str] = None

class DocumentAnalyzeRequest(BaseModel):
    mode: DocumentAnalysisMode = "explain_simply"
    user_question: Optional[str] = None
    document_name: Optional[str] = None
    direct_text_content: Optional[str] = None  # Fallback direct paste

class DocumentFinding(BaseModel):
    id: str
    topic: str
    location: Optional[str] = None
    excerpt: Optional[str] = None
    explanation: str
    recommendation: Optional[str] = None
    risk_level: Optional[Literal["low", "medium", "high"]] = None

class DocumentDateDeadline(BaseModel):
    date: str
    description: str
    clause_reference: Optional[str] = None

class DocumentRisk(BaseModel):
    risk: str
    severity: Literal["low", "medium", "high"]
    clause_reference: Optional[str] = None

class DocumentQuestionAnswer(BaseModel):
    question: str
    answer: str
    references: Optional[str] = None

class DocumentAnalysisResult(BaseModel):
    document_id: str
    document_name: str
    selected_mode: DocumentAnalysisMode
    uploaded_at: str
    executive_summary: str
    findings: List[DocumentFinding] = Field(default_factory=list)
    dates_and_deadlines: List[DocumentDateDeadline] = Field(default_factory=list)
    potential_risks: List[DocumentRisk] = Field(default_factory=list)
    answers_to_user_questions: List[DocumentQuestionAnswer] = Field(default_factory=list)
    supporting_citations: List[str] = Field(default_factory=list)
    disclaimer: str = "This document review provides informational highlights based strictly on the provided text. It does not replace independent legal representation or counsel."
