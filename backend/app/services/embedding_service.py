import math
import hashlib
from typing import List, Dict
from app.core.config import settings
from app.core.logging import logger

class EmbeddingService:
    def __init__(self):
        self._cache: Dict[str, List[float]] = {}
        self._gemini_client = None
        self._init_client()

    def _init_client(self):
        if settings.gemini_api_key:
            try:
                from google import genai
                self._gemini_client = genai.Client(api_key=settings.gemini_api_key)
            except Exception as e:
                logger.warning(f"Embedding service Gemini client initialization deferred: {str(e)}")
                self._gemini_client = None

    def _deterministic_hash_vector(self, text: str, dimensions: int = 128) -> List[float]:
        """
        Deterministic, normalized pseudo-embedding vector for offline tests and fallback.
        Ensures identical texts receive identical vectors and similar keywords have high dot product.
        """
        words = text.lower().split()
        vec = [0.0] * dimensions
        for word in words:
            h = int(hashlib.md5(word.encode('utf-8')).hexdigest(), 16)
            idx = h % dimensions
            sign = 1.0 if (h >> 8) % 2 == 0 else -1.0
            vec[idx] += sign

        # L2 normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec

    async def get_embedding(self, text: str) -> List[float]:
        cleaned = text.strip()
        if not cleaned:
            return [0.0] * 128

        cache_key = hashlib.sha256(cleaned.encode('utf-8')).hexdigest()
        if cache_key in self._cache:
            return self._cache[cache_key]

        if self._gemini_client and settings.gemini_api_key:
            try:
                response = self._gemini_client.models.embed_content(
                    model=settings.gemini_embedding_model,
                    contents=cleaned
                )
                if response and hasattr(response, "embedding") and response.embedding:
                    emb = list(response.embedding.values)
                    self._cache[cache_key] = emb
                    return emb
            except Exception as e:
                logger.warning(f"Live Gemini embedding failed, falling back to local vector: {str(e)}")

        # Fallback local deterministic embedding
        emb = self._deterministic_hash_vector(cleaned)
        self._cache[cache_key] = emb
        return emb

embedding_service = EmbeddingService()
