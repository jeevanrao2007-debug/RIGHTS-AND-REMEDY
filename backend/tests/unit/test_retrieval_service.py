import pytest
from app.services.retrieval_service import retrieval_service

@pytest.mark.asyncio
async def test_retrieval_returns_relevant_housing_sources():
    facts = ["Landlord refuses to return security deposit of $2000 after 25 days since move out."]
    result = await retrieval_service.retrieve_relevant_sources(
        facts=facts,
        domain="housing",
        jurisdiction_state="California",
        top_k=3
    )

    assert result.insufficient_sources is False
    assert len(result.chunks) > 0
    # Must retrieve CA Civ Code 1950.5
    source_ids = [s.id for s in result.sources]
    assert "src-ca-civ-1950" in source_ids

@pytest.mark.asyncio
async def test_retrieval_insufficient_sources_when_unmatched():
    # Out of domain query with high threshold
    facts = ["Extraterrestrial space navigation patent dispute on Mars orbit station."]
    result = await retrieval_service.retrieve_relevant_sources(
        facts=facts,
        domain="astronomy",
        similarity_threshold=0.85
    )
    assert result.insufficient_sources is True
    assert "Insufficient verified legal information" in (result.explanation or "")
