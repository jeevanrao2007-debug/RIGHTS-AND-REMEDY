import math
from typing import List, Optional, Tuple, Dict, Any
from app.repositories.source_repository import source_repository, LegalChunk, LegalSource
from app.services.embedding_service import embedding_service
from app.core.logging import logger

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return dot / (norm1 * norm2)

class RetrievalResult:
    def __init__(
        self,
        chunks: List[LegalChunk],
        sources: List[LegalSource],
        insufficient_sources: bool,
        explanation: Optional[str] = None
    ):
        self.chunks = chunks
        self.sources = sources
        self.insufficient_sources = insufficient_sources
        self.explanation = explanation

class LegalRetrievalService:
    def __init__(self):
        self._source_repo = source_repository
        self._chunk_embeddings: Dict[str, List[float]] = {}

    async def _get_chunk_embedding(self, chunk: LegalChunk) -> List[float]:
        if chunk.chunk_id in self._chunk_embeddings:
            return self._chunk_embeddings[chunk.chunk_id]
        emb = await embedding_service.get_embedding(chunk.text + " " + " ".join(chunk.keywords))
        self._chunk_embeddings[chunk.chunk_id] = emb
        return emb

    async def retrieve_relevant_sources(
        self,
        facts: List[str],
        domain: Optional[str] = None,
        jurisdiction_state: Optional[str] = None,
        top_k: int = 4,
        similarity_threshold: float = 0.20
    ) -> RetrievalResult:
        """
        Retrieves relevant legal chunks filtered by jurisdiction and legal domain.
        Computes cosine similarity between fact embeddings and statutory chunks.
        """
        all_chunks = self._source_repo.get_all_chunks()
        if not all_chunks:
            return RetrievalResult(
                chunks=[],
                sources=[],
                insufficient_sources=True,
                explanation="No authoritative legal sources are indexed in the repository."
            )

        # Build search query text from facts
        combined_facts = " ".join(facts)
        query_embedding = await embedding_service.get_embedding(combined_facts)

        scored_chunks: List[Tuple[float, LegalChunk]] = []

        query_terms = set(combined_facts.lower().split())

        for chunk in all_chunks:
            # Metadata filter: Domain matching
            if domain and domain != "general" and chunk.domain != "dispute_resolution":
                # If domain specified, prioritize matching domains
                domain_match = chunk.domain.lower() in domain.lower() or domain.lower() in chunk.domain.lower()
            else:
                domain_match = True

            # Keyword overlap boost
            keyword_matches = sum(1 for kw in chunk.keywords if any(term in kw for term in query_terms))
            keyword_score = min(keyword_matches * 0.15, 0.6)

            # Vector similarity with cached chunk embedding
            chunk_emb = await self._get_chunk_embedding(chunk)
            sim = cosine_similarity(query_embedding, chunk_emb)

            # Combined score
            final_score = (sim * 0.5) + (keyword_score * 0.5)
            if not domain_match:
                final_score *= 0.3  # penalize cross-domain chunks unless highly relevant

            if final_score >= similarity_threshold:
                scored_chunks.append((final_score, chunk))

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        top_chunks = [c for _, c in scored_chunks[:top_k]]

        if not top_chunks:
            return RetrievalResult(
                chunks=[],
                sources=[],
                insufficient_sources=True,
                explanation="Insufficient verified legal information was retrieved for this issue. The system will not speculate without authoritative sources."
            )

        # Collect parent sources
        source_ids = {c.source_id for c in top_chunks}
        matched_sources = [
            self._source_repo.get_source_by_id(sid)
            for sid in source_ids
            if self._source_repo.get_source_by_id(sid) is not None
        ]

        return RetrievalResult(
            chunks=top_chunks,
            sources=matched_sources,
            insufficient_sources=False
        )

retrieval_service = LegalRetrievalService()
