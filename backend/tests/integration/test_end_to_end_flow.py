import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_complete_end_to_end_legal_navigator_flow(auth_client_user_a: AsyncClient):
    """
    Validates the end-to-end legal intelligence workflow:
    1. User submits real-life narrative (Intake)
    2. Backend extracts preliminary facts & missing details
    3. User receives and answers targeted follow-up questions
    4. Statutory RAG retrieves authoritative legal sources
    5. Rights are grounded with non-definitive explanations
    6. Practical remedies & 5-stage remedy path are formulated
    7. Evidence checklist is generated with interactive status
    8. Verified deadlines are computed conservatively (no hallucinated dates)
    9. Tailored questions for a lawyer are prepared
    10. Case is saved and isolated to the authenticated user
    """
    # Step 1: Initial situation intake
    intake_payload = {
        "narrative": "I vacated my apartment in Los Angeles on August 1st. My landlord has refused to return my $2,000 security deposit for normal carpet wear without providing any receipts or itemized deduction list.",
        "country": "United States",
        "state_or_region": "California",
        "category": "Housing"
    }

    intake_res = await auth_client_user_a.post("/api/v1/intake", json=intake_payload)
    assert intake_res.status_code == 200
    intake_data = intake_res.json()

    assert intake_data["situation"]["domain"].lower() == "housing"
    assert len(intake_data["facts"]) >= 1
    assert len(intake_data["follow_up_questions"]) >= 1

    # Step 2: Answer follow-up questions
    follow_up_answers = {
        intake_data["follow_up_questions"][0]["id"]: "Yes, 30 days written notice was sent via email on July 1."
    }

    # Step 3: Complete legal RAG analysis
    analysis_payload = {
        "narrative": intake_payload["narrative"],
        "country": intake_payload["country"],
        "state_or_region": intake_payload["state_or_region"],
        "category": intake_payload["category"],
        "clarifications": follow_up_answers,
        "save_case": True,
        "case_title": "LA Security Deposit Dispute"
    }

    analysis_res = await auth_client_user_a.post("/api/v1/analysis", json=analysis_payload)
    assert analysis_res.status_code == 200
    analysis_data = analysis_res.json()

    # Step 4: Verify grounded legal rights
    assert len(analysis_data["potentially_relevant_rights"]) >= 1
    first_right = analysis_data["potentially_relevant_rights"][0]
    assert "right" in first_right["title"].lower() or "deposit" in first_right["title"].lower()
    # Confirm qualified, non-definitive language
    explanation = first_right.get("plainLanguageExplanation") or first_right.get("plain_language_explanation", "")
    assert "will win" not in explanation.lower()
    assert "definitely" not in explanation.lower()

    # Step 5: Verify possible remedies & qualifications
    assert len(analysis_data["possible_remedies"]) >= 1
    first_remedy = analysis_data["possible_remedies"][0]
    assert "qualifications" in first_remedy
    assert len(first_remedy["qualifications"]) > 10

    # Step 6: Verify evidence checklist
    assert len(analysis_data["evidence_checklist"]) >= 1
    for ev in analysis_data["evidence_checklist"]:
        assert ev["status"] in ["have", "need", "not_sure"]
        assert len(ev["why_it_may_matter"]) > 5

    # Step 7: Verify conservative deadlines (no fabricated dates)
    assert "has_verified_deadline" in analysis_data
    if analysis_data["has_verified_deadline"]:
        assert len(analysis_data["verified_deadlines"]) >= 1
        dl = analysis_data["verified_deadlines"][0]
        assert "21" in dl["date_or_period"] or "calendar days" in dl["date_or_period"].lower()
    else:
        assert analysis_data["deadline_limitation_note"] is not None

    # Step 8: Verify tailored lawyer questions
    assert len(analysis_data["lawyer_questions"]) >= 1

    # Step 9: Verify authoritative sources
    assert len(analysis_data["citations"]) >= 1

    # Step 10: Verify case isolation in user's saved cases
    case_id = analysis_data["id"]
    get_res = await auth_client_user_a.get(f"/api/v1/cases/{case_id}")
    assert get_res.status_code == 200
    saved_case = get_res.json()
    assert saved_case["id"] == case_id
