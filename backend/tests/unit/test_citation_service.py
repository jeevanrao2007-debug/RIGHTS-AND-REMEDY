import pytest
from app.services.citation_service import citation_service
from app.schemas.analysis import LegalSourceCitation, PotentiallyRelevantRight
from app.repositories.source_repository import source_repository

def test_citation_validation_rejects_hallucinated_sources():
    retrieved_sources = [source_repository.get_source_by_id("src-ca-civ-1950")]
    assert retrieved_sources[0] is not None

    candidates = [
        # Real retrieved citation
        LegalSourceCitation(
            source_id="src-ca-civ-1950",
            source_title="California Civil Code § 1950.5",
            authority="State Legislature",
            provision="§ 1950.5(g)",
            source_url="https://leginfo.legislature.ca.gov",
            source_type="statute",
            verification_status="statutory"
        ),
        # Fabricated hallucinated citation
        LegalSourceCitation(
            source_id="src-fake-hallucination-999",
            source_title="Fabricated General Law Section 123",
            authority="Fictional Court",
            provision="§ 999",
            source_url="https://fake-url.org",
            source_type="statute",
            verification_status="statutory"
        )
    ]

    valid, rejected = citation_service.validate_citations(candidates, retrieved_sources)

    # Valid set must only contain the verified source
    assert len(valid) == 1
    assert valid[0].source_id == "src-ca-civ-1950"

    # Fake source must be explicitly rejected
    assert len(rejected) == 1
    assert "src-fake-hallucination-999" in rejected[0]
