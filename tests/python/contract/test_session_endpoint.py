"""
Contract tests for POST /validation/session endpoint

These tests verify the API contract defined in validation-api.yaml
They MUST FAIL initially (TDD red phase) before implementation.
"""

import pytest
from httpx import AsyncClient
from fastapi import FastAPI

from adp_core.api.app import app


@pytest.mark.asyncio
class TestSessionEndpointContract:
    """Contract tests for the session creation endpoint"""

    async def test_session_endpoint_exists(self):
        """Test that POST /validation/session endpoint exists"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session")
            # Should not return 404 (endpoint exists)
            assert response.status_code != 404

    async def test_session_creation_response_contract(self):
        """Test session creation returns proper contract"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session")

            # Should return 201 for successful session creation
            assert response.status_code == 201

            # Response should match SessionInfo schema
            data = response.json()
            assert "session_id" in data
            assert "validation_rules_version" in data
            assert "created_at" in data

            # Validate response types
            assert isinstance(data["session_id"], str)
            assert isinstance(data["validation_rules_version"], str)
            assert isinstance(data["created_at"], str)

    async def test_session_id_is_valid_uuid(self):
        """Test that session_id follows UUID format"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session")
            assert response.status_code == 201

            data = response.json()
            session_id = data["session_id"]

            # Basic UUID format validation (8-4-4-4-12 hex characters)
            import re
            uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
            assert re.match(uuid_pattern, session_id, re.IGNORECASE), f"Invalid UUID format: {session_id}"

    async def test_session_validation_rules_version_format(self):
        """Test that validation_rules_version follows semantic versioning"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session")
            assert response.status_code == 201

            data = response.json()
            version = data["validation_rules_version"]

            # Basic semantic versioning check
            assert len(version) > 0
            assert "." in version
            parts = version.split(".")
            assert len(parts) >= 2  # At least major.minor

    async def test_session_created_at_iso_format(self):
        """Test that created_at follows ISO 8601 datetime format"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session")
            assert response.status_code == 201

            data = response.json()
            created_at = data["created_at"]

            # Should be parseable as ISO datetime
            from datetime import datetime
            try:
                datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except ValueError:
                pytest.fail(f"created_at is not valid ISO 8601 format: {created_at}")

    async def test_session_no_request_body_needed(self):
        """Test that session creation works without request body"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session")
            assert response.status_code == 201

    async def test_session_empty_request_body_accepted(self):
        """Test that session creation accepts empty JSON body"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/session", json={})
            assert response.status_code == 201

    async def test_multiple_session_creation_unique_ids(self):
        """Test that multiple session creations return unique session IDs"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            # Create first session
            response1 = await client.post("/api/v1/validation/session")
            assert response1.status_code == 201
            session1 = response1.json()

            # Create second session
            response2 = await client.post("/api/v1/validation/session")
            assert response2.status_code == 201
            session2 = response2.json()

            # Session IDs should be unique
            assert session1["session_id"] != session2["session_id"]

    async def test_session_validation_rules_version_consistency(self):
        """Test that sessions created at same time have same validation rules version"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            # Create multiple sessions quickly
            response1 = await client.post("/api/v1/validation/session")
            response2 = await client.post("/api/v1/validation/session")

            assert response1.status_code == 201
            assert response2.status_code == 201

            session1 = response1.json()
            session2 = response2.json()

            # Should have same validation rules version (locked at creation time)
            assert session1["validation_rules_version"] == session2["validation_rules_version"]