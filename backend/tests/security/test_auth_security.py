import pytest
from httpx import AsyncClient
from app.repositories.case_repository import case_repository

@pytest.mark.asyncio
async def test_user_a_cannot_access_user_b_case(auth_client_user_a: AsyncClient, auth_client_user_b: AsyncClient):
    # 1. Create a case owned strictly by User B
    case_b = {
        "id": "case-private-b-101",
        "title": "User B Confidential Dispute",
        "category": "Housing",
        "jurisdiction_country": "United States",
        "evidence_checklist": []
    }
    await case_repository.create_case(user_id="user_b", case_data=case_b)

    # 2. User B can access their own case
    res_b = await auth_client_user_b.get("/api/v1/cases/case-private-b-101")
    assert res_b.status_code == 200
    assert res_b.json()["id"] == "case-private-b-101"

    # 3. User A attempts to access User B's case -> MUST return 403 Forbidden!
    res_a = await auth_client_user_a.get("/api/v1/cases/case-private-b-101")
    assert res_a.status_code == 403
    assert "permission" in res_a.json()["error"]["message"].lower()

@pytest.mark.asyncio
async def test_user_a_cannot_delete_user_b_case(auth_client_user_a: AsyncClient):
    # User A tries to delete User B's case -> MUST return 403 Forbidden
    res = await auth_client_user_a.delete("/api/v1/cases/case-private-b-101")
    assert res.status_code == 403

@pytest.mark.asyncio
async def test_user_a_cannot_update_user_b_evidence(auth_client_user_a: AsyncClient):
    # User A tries to patch evidence in User B's case -> MUST return 403 Forbidden
    res = await auth_client_user_a.patch(
        "/api/v1/cases/case-private-b-101/evidence/ev-1",
        json={"status": "have"}
    )
    assert res.status_code == 403
    assert "permission" in res.json()["error"]["message"].lower()

@pytest.mark.asyncio
async def test_invalid_bearer_token_handled_gracefully(client: AsyncClient):
    # Passing malformed or bogus authorization token
    res = await client.get("/api/v1/cases", headers={"Authorization": "Bearer invalid_malformed_token_123"})
    # Either returns 401 or falls back cleanly to empty/anonymous without leaking exceptions
    assert res.status_code in [200, 401]

@pytest.mark.asyncio
async def test_forged_client_identity_ignored(auth_client_user_a: AsyncClient):
    # Client tries to pass user_id="admin" or user_id="user_b" in query or header
    res = await auth_client_user_a.get("/api/v1/cases?user_id=user_b")
    assert res.status_code == 200
    # Returned cases must NOT leak user_b's private cases
    cases = res.json()
    for c in cases:
        assert c["id"] != "case-private-b-101"

@pytest.mark.asyncio
async def test_oversized_file_rejected(client: AsyncClient):
    # Create fake oversized content (>10MB limit)
    oversized_content = b"%PDF-1.4\n" + (b"0" * (11 * 1024 * 1024))
    files = {"file": ("huge.pdf", oversized_content, "application/pdf")}
    res = await client.post("/api/v1/documents", files=files)
    assert res.status_code == 400
    assert "exceeds maximum limit" in res.json()["error"]["message"]
