import pytest
from app.services.intake_service import intake_service
from app.schemas.intake import IntakeRequest

@pytest.mark.asyncio
async def test_fact_extraction_preserves_uncertainty():
    # When user says "I think", uncertainty must be preserved
    req = IntakeRequest(
        narrative="I think my security deposit was $1,500, but I moved out 25 days ago and my landlord hasn't sent an itemized list.",
        country="United States",
        state_or_region="California",
        category="Housing"
    )
    result = await intake_service.analyze_initial_situation(req)
    
    assert result.situation.domain == "housing"
    assert len(result.facts) > 0
    # Must preserve uncertainty
    uncertain_facts = [f for f in result.facts if "uncertainty" in f.lower() or "uncertain" in f.lower() or "i think" in f.lower()]
    assert len(uncertain_facts) > 0

@pytest.mark.asyncio
async def test_follow_up_question_generation():
    req = IntakeRequest(
        narrative="My boss fired me without giving my final wages or explaining deductions.",
        country="United States",
        state_or_region="California",
        category="Employment"
    )
    result = await intake_service.analyze_initial_situation(req)
    
    assert result.situation.domain == "employment"
    assert len(result.follow_up_questions) >= 2
    for q in result.follow_up_questions:
        assert q.question
        assert q.why_it_matters
