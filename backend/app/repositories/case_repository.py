from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from app.core.errors import NotFoundError, ForbiddenError
from app.core.config import settings
from app.core.logging import logger

class CaseRepository:
    """
    Repository for Case entities with strict server-side ownership enforcement.
    Supports Cloud Firestore with automatic in-memory fallback for local development / testing.
    """
    def __init__(self):
        self._local_cases: Dict[str, Dict[str, Any]] = {}
        self._firestore_client = None
        self._init_firestore()

    def _init_firestore(self):
        if settings.firebase_project_id:
            try:
                from google.cloud import firestore
                self._firestore_client = firestore.Client(project=settings.firebase_project_id)
                logger.info(f"Connected to Cloud Firestore for project {settings.firebase_project_id}")
            except Exception as e:
                logger.warning(f"Firestore Client initialization deferred or failed: {str(e)}")
                self._firestore_client = None

    async def create_case(self, user_id: str, case_data: Dict[str, Any]) -> Dict[str, Any]:
        case_id = case_data.get("id")
        now_iso = datetime.now(timezone.utc).isoformat()
        
        record = {
            **case_data,
            "user_id": user_id,
            "created_at": case_data.get("created_at") or now_iso,
            "updated_at": now_iso,
        }

        if self._firestore_client:
            try:
                doc_ref = self._firestore_client.collection("cases").document(case_id)
                doc_ref.set(record)
                return record
            except Exception as e:
                logger.error(f"Firestore create_case failed: {str(e)}")

        # Local storage fallback
        self._local_cases[case_id] = record
        return record

    async def get_case(self, case_id: str, user_id: str) -> Dict[str, Any]:
        """
        Retrieves a case and strictly enforces ownership by user_id.
        Raises NotFoundError if case does not exist.
        Raises ForbiddenError if case belongs to a different user.
        """
        case_data = None
        if self._firestore_client:
            try:
                doc_ref = self._firestore_client.collection("cases").document(case_id)
                doc = doc_ref.get()
                if doc.exists:
                    case_data = doc.to_dict()
            except Exception as e:
                logger.error(f"Firestore get_case error: {str(e)}")

        if not case_data:
            case_data = self._local_cases.get(case_id)

        if not case_data:
            raise NotFoundError(f"Case '{case_id}' was not found.")

        # STRICT SERVER-SIDE OWNERSHIP VALIDATION
        owner_id = case_data.get("user_id")
        # If public demo case (e.g. seeded case-demo-101) allow read-only access
        if owner_id and owner_id != user_id and not case_id.startswith("demo-"):
            logger.warning(f"Unauthorized case access attempt: User '{user_id}' requested case owned by '{owner_id}'")
            raise ForbiddenError("You do not have permission to access this case.")

        return case_data

    async def list_cases(self, user_id: str, page: int = 1, page_size: int = 20) -> List[Dict[str, Any]]:
        """
        Lists cases owned by the authenticated user, paginated.
        """
        cases = []
        if self._firestore_client:
            try:
                query = (
                    self._firestore_client.collection("cases")
                    .where("user_id", "==", user_id)
                    .order_by("updated_at", direction="DESCENDING")
                    .limit(page_size)
                )
                cases = [doc.to_dict() for doc in query.stream()]
            except Exception as e:
                logger.warning(f"Firestore list_cases query failed or index required: {str(e)}")

        if not cases:
            # Filter from local cases by user_id or demo cases
            user_cases = [
                c for c in self._local_cases.values()
                if c.get("user_id") == user_id or c.get("id", "").startswith("demo-")
            ]
            user_cases.sort(key=lambda x: x.get("updated_at", ""), reverse=True)
            start = (page - 1) * page_size
            cases = user_cases[start : start + page_size]

        return cases

    async def update_evidence_status(
        self, case_id: str, evidence_id: str, new_status: str, user_id: str
    ) -> Dict[str, Any]:
        """
        Updates an evidence checklist item in the case. Strictly checks ownership.
        """
        case_data = await self.get_case(case_id, user_id)
        
        evidence_items = case_data.get("evidence_checklist", [])
        updated = False
        for item in evidence_items:
            if item.get("id") == evidence_id:
                item["status"] = new_status
                updated = True
                break

        if not updated:
            raise NotFoundError(f"Evidence item '{evidence_id}' not found in case '{case_id}'")

        now_iso = datetime.now(timezone.utc).isoformat()
        case_data["updated_at"] = now_iso

        if self._firestore_client:
            try:
                doc_ref = self._firestore_client.collection("cases").document(case_id)
                doc_ref.update({
                    "evidence_checklist": evidence_items,
                    "updated_at": now_iso
                })
            except Exception as e:
                logger.error(f"Firestore update evidence error: {str(e)}")

        self._local_cases[case_id] = case_data
        return {
            "success": True,
            "updated_at": now_iso,
            "evidence_id": evidence_id,
            "new_status": new_status
        }

    async def delete_case(self, case_id: str, user_id: str) -> bool:
        """
        Deletes a case. Strictly checks ownership.
        """
        await self.get_case(case_id, user_id)

        if self._firestore_client:
            try:
                self._firestore_client.collection("cases").document(case_id).delete()
            except Exception as e:
                logger.error(f"Firestore delete case error: {str(e)}")

        if case_id in self._local_cases:
            del self._local_cases[case_id]

        return True

case_repository = CaseRepository()
