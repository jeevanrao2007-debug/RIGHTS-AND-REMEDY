from fastapi import APIRouter, Path
from typing import Optional
from app.repositories.source_repository import source_repository, LegalSource
from app.core.errors import NotFoundError

router = APIRouter(prefix="/sources", tags=["Authoritative Legal Sources"])

@router.get("/{source_id}", response_model=LegalSource)
async def get_legal_source(
    source_id: str = Path(..., description="Unique statutory source identifier")
):
    """
    Returns full authoritative metadata, statutory provisions, and verified chunks
    for a legal source in the corpus.
    """
    source = source_repository.get_source_by_id(source_id)
    if not source:
        raise NotFoundError(f"Authoritative legal source '{source_id}' was not found.")
    return source
