import pytest
from app.services.remedy_service import remedy_service
from app.services.legal_analysis_service import legal_analysis_service
from app.schemas.analysis import AnalysisRequest

def test_remedy_pathway_structure_and_non_guarantee():
    steps = remedy_service.build_remedy_progression(
        domain="housing",
        issue="security_deposit",
        basis_sources=["src-ca-civ-1950"]
    )
    assert len(steps) == 5
    assert steps[0].order == 1
    assert "Preserve" in steps[0].title
    # Check that each step contains qualification language
    for step in steps:
        assert step.qualifications is not None
        assert "guarantee" not in step.description.lower()

@pytest.mark.asyncio
async def test_deadline_handling_is_conservative():
    # California Housing query with explicit statutory backing
    req = AnalysisRequest(
        narrative="I moved out 30 days ago in San Francisco and my landlord kept the whole deposit without any statement.",
        country="United States",
        state_or_region="California",
        category="Housing"
    )
    analysis = await legal_analysis_service.perform_analysis(req, user_id="test-user")
    assert analysis.has_verified_deadline is True
    assert len(analysis.verified_deadlines) > 0
    # Deadline must cite specific statute
    assert "21" in analysis.verified_deadlines[0].date_or_period
    assert analysis.verified_deadlines[0].source is not None
