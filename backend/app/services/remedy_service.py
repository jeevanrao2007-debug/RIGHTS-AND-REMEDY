from typing import List
from app.schemas.analysis import PossibleRemedyStep

class RemedyService:
    def build_remedy_progression(
        self,
        domain: str,
        issue: str,
        basis_sources: List[str]
    ) -> List[PossibleRemedyStep]:
        """
        Builds a structured 5-stage non-prescriptive remedy progression.
        All pathways are explicitly qualified as potential courses of action, not guarantees.
        """
        steps: List[PossibleRemedyStep] = []

        # Stage 1: Documentation & Evidence Preservation
        steps.append(
            PossibleRemedyStep(
                order=1,
                title="Preserve Factual Evidence and Document Timelines",
                description="Secure and organize all relevant correspondence, inspection reports, timestamps, photographic records, contracts, or transaction receipts in chronological order.",
                stage="informal_negotiation",
                basis_sources=basis_sources,
                qualifications="Organizing verifiable records helps establish clear factual baselines for any future inquiry."
            )
        )

        # Stage 2: Direct Informal Clarification & Inquiries
        steps.append(
            PossibleRemedyStep(
                order=2,
                title="Send Written Clarification or Informal Inquiry",
                description="Contact the other party in writing (e.g. dated email or certified letter) referencing undisputed facts and requesting an explanation or itemization of the disputed action.",
                stage="informal_negotiation",
                basis_sources=basis_sources,
                qualifications="Informal resolution is often the fastest and least adversarial path when misunderstandings exist."
            )
        )

        # Stage 3: Formal Statutory Demand Letter
        steps.append(
            PossibleRemedyStep(
                order=3,
                title="Draft a Formal Demand or Notice Letter",
                description="If informal communication fails, deliver a structured written demand citing statutory deadlines and requesting return of withheld funds or performance by a specific reasonable date.",
                stage="formal_demand",
                basis_sources=basis_sources,
                qualifications="A formal demand establishes written notice, which courts and administrative bodies typically review when evaluating good faith."
            )
        )

        # Stage 4: Administrative Complaint or Mediation
        steps.append(
            PossibleRemedyStep(
                order=4,
                title="Explore Community Mediation or Administrative Agency Filing",
                description="Consider contacting a local dispute resolution center, housing mediation program, labor commissioner, or consumer affairs agency to seek neutral resolution.",
                stage="administrative_complaint",
                basis_sources=basis_sources,
                qualifications="Administrative processes and mediation provide structured, low-cost avenues without formal litigation."
            )
        )

        # Stage 5: Small Claims Court or Attorney Representation
        steps.append(
            PossibleRemedyStep(
                order=5,
                title="Consider Small Claims Filing or Formal Legal Representation",
                description="For monetary claims within statutory small claims limits (e.g. up to $12,500 in CA), individuals may file without an attorney. For complex issues or high stakes, seek consultation with a licensed attorney.",
                stage="small_claims",
                basis_sources=basis_sources,
                qualifications="Legal action involves filing fees, service requirements, and preparation time. Consultation with a lawyer helps assess individual claim merits."
            )
        )

        return steps

remedy_service = RemedyService()
