import pytest
from pydantic import ValidationError
from app.schemas.intake import IntakeRequest, SituationMeta, FollowUpQuestion
from app.schemas.analysis import (
    AnalysisRequest,
    LegalAnalysis,
    PotentiallyRelevantRight,
    VerifiedDeadline,
    LegalSourceCitation
)

def test_intake_request_validation():
    # Valid intake
    valid = IntakeRequest(narrative="My landlord withheld my security deposit after 30 days notice.")
    assert valid.country == "United States"
    assert len(valid.narrative) >= 10

    # Short narrative should fail
    with pytest.raises(ValidationError):
        IntakeRequest(narrative="Too short")

def test_legal_analysis_schema():
    citation = LegalSourceCitation(
        source_id="src-1",
        source_title="Test Statute",
        authority="State Legislature",
        provision="§ 100",
        source_url="https://example.gov",
        source_type="statute",
        verification_status="statutory"
    )

    right = PotentiallyRelevantRight(
        id="right-1",
        title="Potential Right to Return",
        plainLanguageExplanation="Statute requires prompt deposit return.",
        whyRelevant="Applicable to vacating tenants.",
        supporting_citation=citation,
        citation_id="src-1"
    )

    analysis = LegalAnalysis(
        id="case-test-1",
        created_at="2026-09-19T00:00:00Z",
        updated_at="2026-09-19T00:00:00Z",
        title="Test Security Deposit Review",
        category="Housing",
        jurisdiction_country="United States",
        situation_domain="housing",
        situation_issue="security_deposit",
        core_facts=["Tenant surrendered keys.", "Landlord retained deposit."],
        missing_or_uncertain_information=["Whether written notice was emailed."],
        potentially_relevant_rights=[right],
        possible_remedies=[],
        evidence_checklist=[],
        has_verified_deadline=True,
        verified_deadlines=[
            VerifiedDeadline(
                date_or_period="21 calendar days",
                triggering_event="Move out and surrender of keys",
                jurisdiction="California",
                source=citation
            )
        ],
        possible_next_steps=["Send demand letter."],
        lawyer_questions=[],
        citations=[citation]
    )

    assert analysis.id == "case-test-1"
    assert analysis.has_verified_deadline is True
    assert len(analysis.limitations_and_disclaimers) >= 2
