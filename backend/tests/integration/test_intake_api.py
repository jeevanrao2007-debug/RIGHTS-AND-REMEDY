import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_intake_pipeline(client: AsyncClient):
    payload = {
        "narrative": "I moved out of my apartment 30 days ago in San Francisco and my landlord has not sent any itemized list or returned my $1,500 security deposit.",
        "country": "United States",
        "state_or_region": "California",
        "category": "Housing"
    }

    response = await client.post("/api/v1/intake", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "intake_id" in data
    assert data["situation"]["domain"] == "housing"
    assert len(data["facts"]) > 0
    assert len(data["follow_up_questions"]) > 0

@pytest.mark.asyncio
async def test_intake_rejects_empty_narrative(client: AsyncClient):
    response = await client.post("/api/v1/intake", json={"narrative": "   "})
    assert response.status_code == 422 or response.status_code == 400
