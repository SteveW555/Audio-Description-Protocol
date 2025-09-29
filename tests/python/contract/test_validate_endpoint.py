"""
Contract tests for POST /validation/validate endpoint

These tests verify the API contract defined in validation-api.yaml
They MUST FAIL initially (TDD red phase) before implementation.
"""

import pytest
from httpx import AsyncClient
from fastapi import FastAPI

from adp_core.api.app import app


@pytest.mark.asyncio
class TestValidateEndpointContract:
    """Contract tests for the validation endpoint"""

    async def test_validate_endpoint_exists(self):
        """Test that POST /validation/validate endpoint exists"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json={})
            # Should not return 404 (endpoint exists)
            assert response.status_code != 404

    async def test_validate_field_validation_request(self):
        """Test field-level validation request contract"""
        valid_request = {
            "protocol_data": {
                "title": "My Audio Track",
                "duration": 180
            },
            "schema_type": "core",
            "field_path": "$.title",
            "session_id": "550e8400-e29b-41d4-a716-446655440000",
            "validation_mode": "field"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=valid_request)

            # Should return 200 for valid request
            assert response.status_code == 200

            # Response should match ValidationResult schema
            data = response.json()
            assert "is_valid" in data
            assert "errors" in data
            assert "warnings" in data
            assert "field_results" in data
            assert "processed_at" in data
            assert "schema_version" in data

            # Validate response types
            assert isinstance(data["is_valid"], bool)
            assert isinstance(data["errors"], list)
            assert isinstance(data["warnings"], list)
            assert isinstance(data["field_results"], dict)
            assert isinstance(data["processed_at"], str)
            assert isinstance(data["schema_version"], str)

    async def test_validate_full_validation_request(self):
        """Test full protocol validation request contract"""
        valid_request = {
            "protocol_data": {
                "title": "Complete Audio Description",
                "duration": 180,
                "annotations": []
            },
            "schema_type": "musical_analysis",
            "session_id": "550e8400-e29b-41d4-a716-446655440000",
            "validation_mode": "full"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=valid_request)
            assert response.status_code == 200

    async def test_validate_request_validation_errors(self):
        """Test validation error response contract"""
        # Invalid request missing required fields
        invalid_request = {
            "protocol_data": {},
            "schema_type": "invalid_schema"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=invalid_request)

            # Should return 400 for invalid request
            assert response.status_code == 400

            # Response should match ErrorResponse schema
            data = response.json()
            assert "error" in data
            assert "message" in data

    async def test_validate_missing_protocol_data(self):
        """Test contract for missing protocol_data field"""
        invalid_request = {
            "schema_type": "core",
            "session_id": "550e8400-e29b-41d4-a716-446655440000",
            "validation_mode": "field"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=invalid_request)
            assert response.status_code == 422  # Unprocessable Entity for missing required field

    async def test_validate_invalid_schema_type(self):
        """Test contract for invalid schema_type enum value"""
        invalid_request = {
            "protocol_data": {"title": "test"},
            "schema_type": "invalid_type",
            "session_id": "550e8400-e29b-41d4-a716-446655440000",
            "validation_mode": "field"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=invalid_request)
            assert response.status_code == 422  # Unprocessable Entity for invalid enum

    async def test_validate_invalid_validation_mode(self):
        """Test contract for invalid validation_mode enum value"""
        invalid_request = {
            "protocol_data": {"title": "test"},
            "schema_type": "core",
            "session_id": "550e8400-e29b-41d4-a716-446655440000",
            "validation_mode": "invalid_mode"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=invalid_request)
            assert response.status_code == 422  # Unprocessable Entity for invalid enum

    async def test_validate_malformed_session_id(self):
        """Test contract for malformed UUID session_id"""
        invalid_request = {
            "protocol_data": {"title": "test"},
            "schema_type": "core",
            "session_id": "not-a-uuid",
            "validation_mode": "field"
        }

        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/api/v1/validation/validate", json=invalid_request)
            assert response.status_code == 422  # Unprocessable Entity for invalid UUID format