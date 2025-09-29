"""
Contract tests for GET /validation/schemas endpoint

These tests verify the API contract defined in validation-api.yaml
They MUST FAIL initially (TDD red phase) before implementation.
"""

import pytest
from httpx import AsyncClient
from fastapi import FastAPI

from adp_core.api.app import app


@pytest.mark.asyncio
class TestSchemasEndpointContract:
    """Contract tests for the schemas endpoint"""

    async def test_schemas_endpoint_exists(self):
        """Test that GET /validation/schemas endpoint exists"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/v1/validation/schemas")
            # Should not return 404 (endpoint exists)
            assert response.status_code != 404

    async def test_schemas_response_contract(self):
        """Test that schemas endpoint returns proper contract"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/v1/validation/schemas")

            # Should return 200 for successful request
            assert response.status_code == 200

            # Response should be an array of SchemaInfo objects
            data = response.json()
            assert isinstance(data, list)

            # Each schema info should have required fields
            if len(data) > 0:
                schema_info = data[0]
                assert "schema_id" in schema_info
                assert "version" in schema_info
                assert "description" in schema_info

                # Validate field types
                assert isinstance(schema_info["schema_id"], str)
                assert isinstance(schema_info["version"], str)
                assert isinstance(schema_info["description"], str)

    async def test_schemas_includes_required_adp_schemas(self):
        """Test that all required ADP schemas are available"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/v1/validation/schemas")
            assert response.status_code == 200

            data = response.json()
            schema_ids = [schema["schema_id"] for schema in data]

            # Should include all ADP schema types from clarifications
            required_schemas = ["core", "musical_analysis", "semantic_attributes", "dataset_manifest"]
            for required_schema in required_schemas:
                assert required_schema in schema_ids, f"Missing required schema: {required_schema}"

    async def test_schemas_no_query_parameters_needed(self):
        """Test that schemas endpoint works without query parameters"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/v1/validation/schemas")
            assert response.status_code == 200

    async def test_schemas_response_format(self):
        """Test specific schema response format requirements"""
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.get("/api/v1/validation/schemas")
            assert response.status_code == 200

            data = response.json()
            assert isinstance(data, list)

            # Check that response contains expected schema structure
            for schema in data:
                # Required fields according to OpenAPI contract
                assert "schema_id" in schema
                assert "version" in schema
                assert "description" in schema

                # Validate that schema_id matches expected ADP types
                valid_schema_ids = ["core", "musical_analysis", "semantic_attributes", "dataset_manifest"]
                assert schema["schema_id"] in valid_schema_ids

                # Version should follow semantic versioning pattern
                assert len(schema["version"]) > 0
                assert "." in schema["version"]  # Basic semver check

                # Description should be non-empty
                assert len(schema["description"]) > 0