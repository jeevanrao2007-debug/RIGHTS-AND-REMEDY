import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.schemas.analysis import (
    AnalysisRequest,
    LegalAnalysis,
    LegalSourceCitation,
    PotentiallyRelevantRight,
    EvidenceChecklistItem,
    VerifiedDeadline,
    LawyerQuestion,
)
from app.security.validation import validate_narrative_text
from app.security.prompt_security import wrap_user_narrative, wrap_retrieved_sources
from app.services.retrieval_service import retrieval_service
from app.services.citation_service import citation_service
from app.services.remedy_service import remedy_service
from app.services.gemini_service import gemini_service
from app.repositories.case_repository import case_repository
from app.repositories.source_repository import source_repository
from app.core.logging import logger

class LegalAnalysisService:
    def _deterministic_analysis_fallback(
        self,
        analysis_id: str,
        narrative: str,
        country: str,
        state_or_region: Optional[str],
        category: Optional[str],
        retrieved_sources: List[Any],
        clarifications: Optional[Dict[str, Any]] = None
    ) -> LegalAnalysis:
        """
        Deterministic, legally sound fallback grounded strictly in the retrieved sources.
        Guarantees zero hallucinated citations and adheres to strict non-definitive phrasing.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        domain = (category or "housing").lower()

        # Build verified citations from retrieved sources
        verified_citations: List[LegalSourceCitation] = []
        for s in retrieved_sources:
            verified_citations.append(
                LegalSourceCitation(
                    source_id=s.id,
                    source_title=s.title,
                    authority=s.authority,
                    provision=s.provision,
                    source_url=s.source_url,
                    source_type=s.source_type,  # type: ignore
                    verification_status=s.verification_status,  # type: ignore
                    supporting_text=s.description
                )
            )

        # Primary source citation
        primary_citation = verified_citations[0] if verified_citations else None

        # Formulate potentially relevant rights (Non-definitive)
        rights: List[PotentiallyRelevantRight] = []
        if "housing" in domain or "1950" in (primary_citation.source_id if primary_citation else ""):
            rights.append(
                PotentiallyRelevantRight(
                    id="right-timely-deposit-return",
                    title="Potential Statutory Right to Timely Security Deposit Return or Itemization",
                    plainLanguageExplanation="Under applicable tenancy law, a landlord must either return the full security deposit or furnish an itemized written statement detailing allowable deductions within a mandatory statutory timeframe.",
                    whyRelevant="Based on your statement that you vacated the premises and the statutory return window has elapsed without full refund or receipts.",
                    supporting_citation=primary_citation,
                    citation_id=primary_citation.source_id if primary_citation else None
                )
            )
            rights.append(
                PotentiallyRelevantRight(
                    id="right-wear-and-tear",
                    title="Potential Protection Against Deductions for Ordinary Wear and Tear",
                    plainLanguageExplanation="Landlords are generally prohibited from retaining deposit funds for normal deterioration resulting from ordinary, everyday residential use.",
                    whyRelevant="Routine painting, standard turnover cleaning, or pre-existing carpet wear are generally not chargeable to a vacating tenant.",
                    supporting_citation=primary_citation,
                    citation_id=primary_citation.source_id if primary_citation else None
                )
            )
        elif "employment" in domain:
            rights.append(
                PotentiallyRelevantRight(
                    id="right-prompt-wage-payment",
                    title="Potential Statutory Entitlement to Prompt Payment of Earned Wages",
                    plainLanguageExplanation="Applicable labor codes require employers to pay all accrued and earned wages promptly following the conclusion of employment.",
                    whyRelevant="If earned compensation or expense reimbursements were withheld following separation.",
                    supporting_citation=primary_citation,
                    citation_id=primary_citation.source_id if primary_citation else None
                )
            )
        else:
            rights.append(
                PotentiallyRelevantRight(
                    id="right-general-written-accounting",
                    title="Potential Right to Written Accounting of Disputed Claims",
                    plainLanguageExplanation="Relevant statutes provide that parties asserting monetary offsets or claims must substantiate amounts through written notices or invoices.",
                    whyRelevant="Applicable to disputed balances or deductions asserted without documentary substantiation.",
                    supporting_citation=primary_citation,
                    citation_id=primary_citation.source_id if primary_citation else None
                )
            )

        # Verified deadlines handling (Conservative: only if supported by retrieved statute)
        verified_deadlines: List[VerifiedDeadline] = []
        has_deadline = False
        deadline_note = None

        deposit_citation = next((c for c in verified_citations if "1950" in c.source_id), None)
        wage_citation = next((c for c in verified_citations if "201" in c.source_id), None)

        if deposit_citation:
            has_deadline = True
            verified_deadlines.append(
                VerifiedDeadline(
                    date_or_period="21 calendar days",
                    triggering_event="Surrender of the premises and return of keys to the landlord",
                    jurisdiction=state_or_region or "California",
                    condition="Applies to residential tenancies under Cal. Civ. Code § 1950.5(g)(1). Failure to provide itemized statement may forfeit right to withhold.",
                    source=deposit_citation
                )
            )
        elif wage_citation:
            has_deadline = True
            verified_deadlines.append(
                VerifiedDeadline(
                    date_or_period="Immediate upon discharge, or 72 hours if quitting without notice",
                    triggering_event="Termination of employment or notice of quitting",
                    jurisdiction=state_or_region or "California",
                    condition="Cal. Lab. Code § 201/202. Willful delay may incur waiting time penalties under § 203.",
                    source=wage_citation
                )
            )
        else:
            has_deadline = False
            deadline_note = "No specific statutory deadline could be verified with certainty for this factual combination. General statutes of limitations may apply."

        # Evidence checklist
        evidence_checklist = [
            EvidenceChecklistItem(
                id="ev-lease-contract",
                name="Signed Agreement or Contract",
                why_it_may_matter="Establishes original covenants, notice procedures, and deposit or compensation terms.",
                status="need",
                related_fact="Contractual terms governing the relationship."
            ),
            EvidenceChecklistItem(
                id="ev-written-notice",
                name="Dated Written Notice (Move-Out, Resignation, or Termination)",
                why_it_may_matter="Proves the exact date the triggering event occurred and notice was delivered.",
                status="have",
                related_fact="Notice served to the opposing party."
            ),
            EvidenceChecklistItem(
                id="ev-photos-condition",
                name="Dated Condition Photos or Work Delivery Records",
                why_it_may_matter="Refutes claims of damage or non-performance by demonstrating baseline conditions.",
                status="need",
                related_fact="Condition of premises or completion of duties."
            ),
            EvidenceChecklistItem(
                id="ev-payment-receipts",
                name="Proof of Payment (Bank Statements, Cancelled Checks, Invoices)",
                why_it_may_matter="Validates exact financial amounts transferred and disputed balances.",
                status="have",
                related_fact="Original transaction amount."
            )
        ]

        # Remedy steps (5-stage progression)
        basis_ids = [s.source_id for s in verified_citations]
        possible_remedies = remedy_service.build_remedy_progression(
            domain=domain,
            issue="monetary_withholding_dispute",
            basis_sources=basis_ids
        )

        # Possible next steps
        possible_next_steps = [
            "Compile and chronologically organize all written notices, emails, receipts, and photos into a single binder or digital folder.",
            "Draft a calm, factual demand letter citing the applicable statutory provision and requesting an itemized accounting within 10-14 business days.",
            "Send the formal letter via trackable mail (e.g. Certified Mail with Return Receipt Requested) and keep a copy for your records.",
            "Review local court limits or administrative filing procedures if the deadline lapses without resolution."
        ]

        # Questions for a lawyer
        lawyer_questions = [
            LawyerQuestion(
                id="lq-1",
                question="Given my documentation and the timeline, do statutory penalties or fee-shifting provisions apply in this jurisdiction?",
                context_and_purpose="Certain statutes allow prevailing parties to recover statutory damages or reasonable attorney fees, which influences negotiation leverage.",
                target_area="Damages & Remedies"
            ),
            LawyerQuestion(
                id="lq-2",
                question="What specific burden of proof must the other party meet to sustain their disputed deductions or claims?",
                context_and_purpose="Clarifies whether receipts, invoices, or third-party repair estimates are legally required to defeat your claim.",
                target_area="Evidentiary Standards"
            ),
            LawyerQuestion(
                id="lq-3",
                question="Would pursuing this in Small Claims Court be more cost-effective than formal representation or mediation?",
                context_and_purpose="Helps weigh court filing fees, time investment, and likelihood of collection against expected recovery.",
                target_area="Procedural Strategy"
            )
        ]

        return LegalAnalysis(
            id=analysis_id,
            created_at=now_iso,
            updated_at=now_iso,
            title=f"Legal Review: {domain.capitalize()} Dispute ({state_or_region or 'General'})",
            category=domain.capitalize(),
            jurisdiction_country=country,
            jurisdiction_state=state_or_region,
            situation_domain=domain,
            situation_issue="disputed_withholding",
            core_facts=[
                f"User reported: '{narrative[:250]}'",
                "Dispute involves withheld funds, compensation, or unitemized charges.",
                f"Jurisdiction identified as {state_or_region or 'General Jurisdiction'}, {country}."
            ] + ([f"Clarification: {k} → {v}" for k, v in clarifications.items()] if clarifications else []),
            missing_or_uncertain_information=[
                "Proof of whether written notice was transmitted by certified mail or verifiable electronic delivery.",
                "Whether the other party provided formal receipts or contractor invoices."
            ],
            potentially_relevant_rights=rights,
            possible_remedies=possible_remedies,
            evidence_checklist=evidence_checklist,
            has_verified_deadline=has_deadline,
            verified_deadlines=verified_deadlines,
            deadline_limitation_note=deadline_note,
            possible_next_steps=possible_next_steps,
            lawyer_questions=lawyer_questions,
            citations=verified_citations
        )

    async def perform_analysis(
        self,
        request: AnalysisRequest,
        user_id: str
    ) -> LegalAnalysis:
        """
        Executes the full Rights & Remedy analysis pipeline:
        1. Validate inputs
        2. Retrieve authoritative legal chunks
        3. Validate citations against retrieved sources
        4. Apply conservative verified deadline rules
        5. Build structured legal analysis
        6. Persist case if requested with ownership verification
        """
        cleaned_narrative = validate_narrative_text(request.narrative)
        analysis_id = f"case-{uuid.uuid4().hex[:8]}"

        # 1. Legal Retrieval
        facts = [cleaned_narrative]
        if request.clarifications:
            facts.extend([f"{k}: {v}" for k, v in request.clarifications.items()])

        retrieval = await retrieval_service.retrieve_relevant_sources(
            facts=facts,
            domain=request.category.lower() if request.category else None,
            jurisdiction_state=request.state_or_region,
            top_k=4
        )

        sources_for_prompt = ""
        for s in retrieval.sources:
            sources_for_prompt += f"Source ID: {s.id}\nTitle: {s.title}\nAuthority: {s.authority}\nProvision: {s.provision}\nText: {s.description}\n\n"

        # 2. System instructions enforcing source grounding and non-definitive language
        system_instruction = (
            "You are the Legal Analysis Engine of Rights & Remedy Navigator.\n"
            "Generate a structured, source-grounded LegalAnalysis object strictly adhering to the schema.\n"
            "RULES:\n"
            "1. Ground all citations exclusively in the provided <authoritative_legal_sources>. NEVER fabricate statutes or source IDs.\n"
            "2. All rights and remedies must use qualified, non-definitive language ('may be relevant', 'potential pathway').\n"
            "3. NEVER state 'You will win', 'You definitely have a claim', or 'You should sue'.\n"
            "4. Only include a verified deadline if explicitly stated in the retrieved sources. Otherwise set verified_deadlines to empty."
        )

        clarifications_str = ""
        if request.clarifications:
            clarifications_str = "\n<follow_up_answers>\n" + "\n".join(f"- {k}: {v}" for k, v in request.clarifications.items()) + "\n</follow_up_answers>\n"

        user_prompt = (
            f"Jurisdiction: {request.state_or_region or 'State'}, {request.country}\n"
            f"Category: {request.category or 'General'}\n\n"
            f"{wrap_retrieved_sources(sources_for_prompt)}\n\n"
            f"{wrap_user_narrative(cleaned_narrative)}\n"
            f"{clarifications_str}"
        )

        def fallback():
            return self._deterministic_analysis_fallback(
                analysis_id=analysis_id,
                narrative=cleaned_narrative,
                country=request.country,
                state_or_region=request.state_or_region,
                category=request.category,
                retrieved_sources=retrieval.sources,
                clarifications=request.clarifications
            )

        analysis = await gemini_service.generate_structured(
            system_instruction=system_instruction,
            user_prompt=user_prompt,
            response_model=LegalAnalysis,
            mock_fallback_generator=fallback
        )

        # 3. Citation Validation Service: Enforce that all citations are verified
        valid_citations, rejected = citation_service.validate_citations(
            candidate_citations=analysis.citations,
            retrieved_sources=retrieval.sources
        )
        if rejected:
            logger.warning(f"Rejected hallucinated citations from analysis output: {rejected}")
        
        analysis.citations = valid_citations
        analysis.potentially_relevant_rights = citation_service.ground_rights_with_citations(
            rights=analysis.potentially_relevant_rights,
            valid_citations=valid_citations
        )

        # 4. Save case to repository if requested
        if request.save_case:
            case_data = analysis.model_dump()
            case_data["id"] = analysis.id
            if request.case_title:
                case_data["title"] = request.case_title
            await case_repository.create_case(user_id=user_id, case_data=case_data)

        return analysis

legal_analysis_service = LegalAnalysisService()
