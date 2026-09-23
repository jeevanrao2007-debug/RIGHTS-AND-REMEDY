import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_complete_analysis_pipeline(client: AsyncClient):
    payload = {
        "narrative": "My former employer laid me off two weeks ago in Los Angeles and never gave me my final paycheck or reimbursed my work travel mileage.",
        "country": "United States",
        "state_or_region": "California",
        "category": "Employment",
        "save_case": True,
        "case_title": "Unpaid Final Wages Claim"
    }

    response = await client.post("/api/v1/analysis", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["id"].startswith("case-")
    assert len(data["potentially_relevant_rights"]) > 0
    assert len(data["possible_remedies"]) == 5  # 5-stage progression
    assert len(data["evidence_checklist"]) > 0
    assert len(data["citations"]) > 0

    # Ensure disclaimers are present
    assert len(data["limitations_and_disclaimers"]) >= 2
