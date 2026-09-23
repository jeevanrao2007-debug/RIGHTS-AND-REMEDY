from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class LegalSourceCitation(BaseModel):
    source_id: str
    source_title: str
    authority: str
    provision: Optional[str] = None
    source_url: Optional[str] = None
    source_type: Literal["statute", "regulation", "court_rule", "official_guidance", "case_law"] = "statute"
    verification_status: Literal["statutory", "authoritative", "verified"] = "statutory"
    supporting_text: Optional[str] = None

class PotentiallyRelevantRight(BaseModel):
    id: str
    title: str
    plain_language_explanation: str = Field(default="", description="Qualified plain-language legal concept", alias="plainLanguageExplanation")
    why_relevant: str = Field(default="", description="Contextual relevance to the user's provided facts", alias="whyRelevant")
    supporting_citation: Optional[LegalSourceCitation] = None
    citation_id: Optional[str] = None

    model_config = {
        "populate_by_name": True,
        "serialize_by_alias": True
    }

class PossibleRemedyStep(BaseModel):
    order: int
    title: str
    description: str
    stage: Literal["informal_negotiation", "formal_demand", "administrative_complaint", "small_claims", "legal_counsel"]
    basis_sources: List[str] = Field(default_factory=list, description="IDs of authoritative sources supporting this remedy pathway")
    qualifications: str = Field(default="This represents one potential course of action to consider. It is not guaranteed.")

class EvidenceChecklistItem(BaseModel):
    id: str
    name: str
    why_it_may_matter: str
    status: Literal["have", "need", "not_sure"] = "need"
    related_fact: Optional[str] = None

class VerifiedDeadline(BaseModel):
    date_or_period: str = Field(description="Authoritative statutory timeframe, e.g. '21 calendar days'")
    triggering_event: str = Field(description="Event triggering the timeline, e.g. 'Vacating premises and key surrender'")
    jurisdiction: str = Field(description="Jurisdiction where statutory period applies")
    condition: Optional[str] = Field(default=None, description="Any statutory conditions or exceptions")
    source: Optional[LegalSourceCitation] = None

class LawyerQuestion(BaseModel):
    id: str
    question: str
    context_and_purpose: str
    target_area: str

class AnalysisRequest(BaseModel):
    narrative: str = Field(..., min_length=10, max_length=15000)
    country: str = Field(default="United States")
    state_or_region: Optional[str] = None
    category: Optional[str] = None
    clarifications: Optional[Dict[str, str]] = None
    save_case: bool = True
    case_title: Optional[str] = None

class LegalAnalysis(BaseModel):
    id: str
    created_at: str
    updated_at: str
    title: str
    category: str
    jurisdiction_country: str
    jurisdiction_state: Optional[str] = None
    
    # 1. Situation & Facts
    situation_domain: str
    situation_issue: str
    core_facts: List[str]
    missing_or_uncertain_information: List[str]
    
    # 2. Potentially Relevant Rights (Non-definitive)
    potentially_relevant_rights: List[PotentiallyRelevantRight]
    
    # 3. Possible Remedies & Pathways
    possible_remedies: List[PossibleRemedyStep]
    
    # 4. Evidence Checklist
    evidence_checklist: List[EvidenceChecklistItem]
    
    # 5. Verified Deadlines (Conservative)
    has_verified_deadline: bool
    verified_deadlines: List[VerifiedDeadline]
    deadline_limitation_note: Optional[str] = None
    
    # 6. Possible Next Steps (Sequential action roadmap)
    possible_next_steps: List[str]
    
    # 7. Questions for a Legal Professional
    lawyer_questions: List[LawyerQuestion]
    
    # 8. Validated Citations & Limitations
    citations: List[LegalSourceCitation]
    limitations_and_disclaimers: List[str] = Field(
        default_factory=lambda: [
            "This analysis provides legal information and source citations for educational and informational purposes only.",
            "It does not constitute legal advice, representation, or an attorney-client relationship.",
            "Applicability of legal authorities depends on precise factual nuances not captured here.",
            "Consult a licensed attorney in your jurisdiction before initiating legal proceedings or waiving rights."
        ]
    )
