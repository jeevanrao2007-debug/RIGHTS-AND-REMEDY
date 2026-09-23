import uuid
from typing import Dict, Any, List
from app.schemas.intake import (
    IntakeRequest,
    IntakeResponse,
    SituationMeta,
    FollowUpQuestion,
    QuestionsSubmissionRequest,
    QuestionsSubmissionResponse,
)
from app.security.validation import validate_narrative_text
from app.security.prompt_security import wrap_user_narrative
from app.services.gemini_service import gemini_service
from app.core.logging import logger

class IntakeService:
    def _deterministic_intake_fallback(
        self,
        intake_id: str,
        narrative: str,
        country: str,
        state_or_region: str,
        category: str
    ) -> IntakeResponse:
        """
        Deterministic, realistic fact extraction and follow-up generation for testing/offline mode.
        Preserves user uncertainty explicitly.
        """
        lower = narrative.lower()
        
        # Domain detection
        domain = "housing"
        issue = "general_legal_issue"
        
        if any(w in lower for w in ["landlord", "rent", "deposit", "lease", "evict", "apartment", "tenant"]):
            domain = "housing"
            if "deposit" in lower:
                issue = "security_deposit_withheld"
            elif "repair" in lower or "water" in lower or "mold" in lower or "heat" in lower:
                issue = "habitability_and_repairs"
            else:
                issue = "tenancy_dispute"
        elif any(w in lower for w in ["employer", "job", "fired", "wages", "paycheck", "boss", "workplace"]):
            domain = "employment"
            if "fired" in lower or "terminated" in lower:
                issue = "discharge_or_final_pay"
            elif "reimburs" in lower or "expense" in lower:
                issue = "expense_reimbursement"
            else:
                issue = "wage_and_hour_claim"
        elif any(w in lower for w in ["debt", "collector", "credit", "collection", "loan"]):
            domain = "consumer"
            issue = "debt_collection_dispute"

        # Fact extraction with preserved uncertainty
        facts: List[str] = []
        if "i think" in lower or "might" in lower or "maybe" in lower:
            facts.append("User indicates uncertainty regarding certain aspects of the timeline or agreements.")
        
        # Split sentences and extract verifiable factual assertions
        sentences = [s.strip() for s in narrative.replace('\n', '. ').split('.') if len(s.strip()) > 5]
        for s in sentences[:5]:
            if any(term in s.lower() for term in ["i think", "not sure", "possibly"]):
                facts.append(f"User states with stated uncertainty: '{s}'")
            else:
                facts.append(f"User reported: '{s}'")

        if not facts:
            facts.append(f"User reported their narrative: '{narrative[:200]}'")

        missing_info: List[str] = [
            "Exact dates and delivery methods of written notices or correspondence.",
            "Whether move-in or move-out inspection checklists and dated photos were completed.",
            "Written contract or lease agreement terms specifying notice requirements."
        ]

        questions: List[FollowUpQuestion] = [
            FollowUpQuestion(
                id="q-written-notice",
                question="Did you provide or receive written notice, and on what exact date?",
                why_it_matters="Statutory timeframes and deadlines are calculated from the exact date written notice was served or premises vacated.",
                placeholder="e.g., Yes, I emailed 30-day notice on July 1st",
                category=domain
            ),
            FollowUpQuestion(
                id="q-documentation",
                question="Do you possess copies of signed agreements, invoices, or dated photos?",
                why_it_matters="Verifiable physical or digital evidence determines which factual assertions can be substantiated.",
                placeholder="e.g., Yes, signed lease and 15 move-out photos",
                category=domain
            ),
            FollowUpQuestion(
                id="q-written-response",
                question="Did the other party provide a written itemization or explanation of their position?",
                why_it_matters="Under applicable law, failure to provide timely itemization may limit allowable deductions or defenses.",
                placeholder="e.g., No, they only sent a brief text message",
                category=domain
            )
        ]

        return IntakeResponse(
            intake_id=intake_id,
            situation=SituationMeta(
                domain=domain,
                issue=issue,
                jurisdiction_country=country,
                jurisdiction_state=state_or_region
            ),
            facts=facts,
            missing_information=missing_info,
            follow_up_questions=questions
        )

    async def analyze_initial_situation(self, request: IntakeRequest) -> IntakeResponse:
        cleaned_narrative = validate_narrative_text(request.narrative)
        intake_id = f"intake-{uuid.uuid4().hex[:8]}"

        system_instruction = (
            "You are the intake reasoning module of Rights & Remedy Navigator, a source-grounded legal information tool.\n"
            "Analyze the user's natural language situation.\n"
            "1. Identify the legal domain (e.g. housing, employment, consumer, contract) and primary legal issue.\n"
            "2. Extract structured factual assertions made by the user. Do NOT invent facts.\n"
            "3. If the user expresses uncertainty ('I think', 'maybe', 'not sure'), explicitly preserve that uncertainty.\n"
            "4. Identify missing critical facts or evidentiary gaps.\n"
            "5. Formulate 2 to 4 targeted follow-up questions with clear explanations of why each question matters.\n"
            "Output strictly valid JSON matching the IntakeResponse schema."
        )

        user_prompt = (
            f"Jurisdiction Country: {request.country}\n"
            f"State or Region: {request.state_or_region or 'Not specified'}\n"
            f"Optional Category: {request.category or 'Uncategorized'}\n\n"
            f"{wrap_user_narrative(cleaned_narrative)}"
        )

        def fallback():
            return self._deterministic_intake_fallback(
                intake_id=intake_id,
                narrative=cleaned_narrative,
                country=request.country,
                state_or_region=request.state_or_region or "California",
                category=request.category or "Housing"
            )

        return await gemini_service.generate_structured(
            system_instruction=system_instruction,
            user_prompt=user_prompt,
            response_model=IntakeResponse,
            mock_fallback_generator=fallback
        )

    async def process_question_answers(self, request: QuestionsSubmissionRequest) -> QuestionsSubmissionResponse:
        updated_facts: List[str] = []
        for ans in request.answers:
            if ans.answer.strip():
                updated_facts.append(f"Clarified concerning '{ans.question_text}': {ans.answer.strip()}")

        domain = request.category.lower() if request.category else "housing"
        return QuestionsSubmissionResponse(
            intake_id=request.intake_id,
            situation=SituationMeta(
                domain=domain,
                issue="clarified_dispute",
                jurisdiction_country=request.country,
                jurisdiction_state=request.state_or_region
            ),
            updated_facts=updated_facts,
            ready_for_analysis=True
        )

intake_service = IntakeService()
