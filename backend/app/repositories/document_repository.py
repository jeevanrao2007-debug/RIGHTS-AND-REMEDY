from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from app.core.errors import NotFoundError, ForbiddenError
from app.core.logging import logger

class DocumentRepository:
    def __init__(self):
        self._documents: Dict[str, Dict[str, Any]] = {}

    async def save_document(self, user_id: str, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        doc_id = doc_data["id"]
        record = {
            **doc_data,
            "user_id": user_id,
            "uploaded_at": doc_data.get("uploaded_at") or datetime.now(timezone.utc).isoformat()
        }
        self._documents[doc_id] = record
        return record

    async def get_document(self, document_id: str, user_id: str) -> Dict[str, Any]:
        doc = self._documents.get(document_id)
        if not doc:
            raise NotFoundError(f"Document '{document_id}' was not found.")
        
        owner_id = doc.get("user_id")
        if owner_id and owner_id != user_id:
            logger.warning(f"Unauthorized document access attempt: User '{user_id}' requested document owned by '{owner_id}'")
            raise ForbiddenError("You do not have permission to access this document.")

        return doc

document_repository = DocumentRepository()
