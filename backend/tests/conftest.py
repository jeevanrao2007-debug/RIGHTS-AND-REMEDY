import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# Set environment variables for testing
os.environ["ENVIRONMENT"] = "test"
os.environ["TESTING"] = "1"
os.environ["GEMINI_API_KEY"] = ""

from app.main import app
from app.repositories.case_repository import case_repository

@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c

@pytest_asyncio.fixture
async def auth_client_user_a():
    transport = ASGITransport(app=app)
    headers = {"Authorization": "Bearer mock_token_user_a"}
    async with AsyncClient(transport=transport, base_url="http://testserver", headers=headers) as c:
        yield c

@pytest_asyncio.fixture
async def auth_client_user_b():
    transport = ASGITransport(app=app)
    headers = {"Authorization": "Bearer mock_token_user_b"}
    async with AsyncClient(transport=transport, base_url="http://testserver", headers=headers) as c:
        yield c
