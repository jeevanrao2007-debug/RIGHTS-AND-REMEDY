import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_direct_document_analysis(client: AsyncClient):
    payload = {
        "mode": "explain_simply",
        "document_name": "Residential Lease Agreement",
        "direct_text_content": (
            "SECTION 5: SECURITY DEPOSIT.\n"
            "Tenant deposits $2,000. Landlord shall return deposit within 21 days with an itemized deduction statement.\n"
            "Tenant is not liable for normal wear and tear.\n"
            "SECTION 12: NOTICE.\n"
            "All notices must be delivered in writing with 30 days notice prior to lease expiration."
        )
    }

    response = await client.post("/api/v1/documents/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["document_name"] == "Residential Lease Agreement"
    assert data["selected_mode"] == "explain_simply"
    assert "findings" in data
    assert "disclaimer" in data
