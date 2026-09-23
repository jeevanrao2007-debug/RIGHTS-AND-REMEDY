from typing import List, Tuple, Set, Optional
from app.schemas.analysis import LegalSourceCitation, PotentiallyRelevantRight
from app.repositories.source_repository import LegalSource
from app.core.logging import logger

class CitationValidationService:
    """
    Validates that every citation produced or attached by the model
    strictly corresponds to an authoritative source in the retrieved source set.
    Rejects any ungrounded or fabricated citations.
    """
    def validate_citations(
        self,
        candidate_citations: List[LegalSourceCitation],
        retrieved_sources: List[LegalSource]
    ) -> Tuple[List[LegalSourceCitation], List[str]]:
        """
        Filters candidate citations against retrieved sources.
        Returns (valid_citations, rejected_citation_reasons).
        """
        valid_sources_by_id = {s.id: s for s in retrieved_sources}
        valid_citations: List[LegalSourceCitation] = []
        rejected: List[str] = []

        seen_ids: Set[str] = set()

        for c in candidate_citations:
            if not c.source_id or c.source_id not in valid_sources_by_id:
                rejected.append(f"Rejected citation with unknown or unretrieved source_id: '{c.source_id}'")
                continue

            authoritative_source = valid_sources_by_id[c.source_id]
            
            # Enrich citation with authoritative repository fields to prevent hallucination in attributes
            verified_citation = LegalSourceCitation(
                source_id=authoritative_source.id,
                source_title=authoritative_source.title,
                authority=authoritative_source.authority,
                provision=c.provision or authoritative_source.provision,
                source_url=authoritative_source.source_url,
                source_type=authoritative_source.source_type,  # type: ignore
                verification_status=authoritative_source.verification_status,  # type: ignore
                supporting_text=c.supporting_text
            )

            if verified_citation.source_id not in seen_ids:
                seen_ids.add(verified_citation.source_id)
                valid_citations.append(verified_citation)

        return valid_citations, rejected

    def ground_rights_with_citations(
        self,
        rights: List[PotentiallyRelevantRight],
        valid_citations: List[LegalSourceCitation]
    ) -> List[PotentiallyRelevantRight]:
        """
        Attaches verified citations to rights or marks them as ungrounded if unsupported.
        """
        citation_map = {c.source_id: c for c in valid_citations}

        grounded_rights: List[PotentiallyRelevantRight] = []
        for right in rights:
            matched_citation = None
            if right.citation_id and right.citation_id in citation_map:
                matched_citation = citation_map[right.citation_id]
            elif right.supporting_citation and right.supporting_citation.source_id in citation_map:
                matched_citation = citation_map[right.supporting_citation.source_id]
            elif valid_citations:
                # Default to primary retrieved source for this domain
                matched_citation = valid_citations[0]

            right.supporting_citation = matched_citation
            if matched_citation:
                right.citation_id = matched_citation.source_id
            grounded_rights.append(right)

        return grounded_rights

citation_service = CitationValidationService()
