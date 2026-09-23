import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_follow_up_questions_flow(client: AsyncClient):
    # Step 1: Submit answers to follow up questions
    payload = {
        "intake_id": "intake-test-123",
        "category": "Housing",
        "country": "United States",
        "state_or_region": "California",
        "answers": [
            {
                "question_id": "q-written-notice",
                "question_text": "Did you provide written notice?",
                "answer": "Yes, 30 days notice was emailed on July 1st"
            }
        ]
    }

    res = await client.post("/api/v1/intake/questions", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["intake_id"] == "intake-test-123"
    assert data["ready_for_analysis"] is True
    assert len(data["updated_facts"]) > 0

@pytest.mark.asyncio
async def test_evidence_checklist_update_flow(auth_client_user_a: AsyncClient):
    # Create analysis with saved case for user A
    payload = {
        "narrative": "My landlord has kept my deposit for 3 weeks without an itemized statement.",
        "country": "United States",
        "state_or_region": "California",
        "category": "Housing",
        "save_case": True,
        "case_title": "My Security Deposit Dispute"
    }
    analysis_res = await auth_client_user_a.post("/api/v1/analysis", json=payload)
    assert analysis_res.status_code == 200
    case_id = analysis_res.json()["id"]
    evidence_checklist = analysis_res.json()["evidence_checklist"]
    assert len(evidence_checklist) > 0
    evidence_id = evidence_checklist[0]["id"]

    # User A updates evidence item status to 'have'
    patch_res = await auth_client_user_a.patch(
        f"/api/v1/cases/{case_id}/evidence/{evidence_id}",
        json={"status": "have"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["new_status"] == "have"

    # Verify updated case reflection
    get_res = await auth_client_user_a.get(f"/api/v1/cases/{case_id}")
    assert get_res.status_code == 200
    items = get_res.json()["evidence_checklist"]
    matching = [i for i in items if i["id"] == evidence_id]
    assert len(matching) == 1
    assert matching[0]["status"] == "have"
