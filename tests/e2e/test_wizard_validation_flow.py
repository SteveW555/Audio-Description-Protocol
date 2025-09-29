"""
End-to-end tests for wizard-python validation integration

Tests the complete validation flow from TypeScript client through
Python API with realistic quickstart scenarios.
"""

import pytest
import asyncio
import json
import time
from typing import Dict, Any
from uuid import uuid4

import httpx
from fastapi.testclient import TestClient

from adp_core.api.app import app
from adp_core.validation.models import ValidationRequest, SchemaType, ValidationMode


class TestWizardValidationFlow:
    """
    End-to-end tests for complete wizard validation integration

    Tests realistic scenarios that mirror the quickstart guide workflows.
    """

    @pytest.fixture
    def client(self):
        """Test client for API endpoints"""
        return TestClient(app)

    @pytest.fixture
    def session_id(self):
        """Generate test session ID"""
        return str(uuid4())

    @pytest.fixture
    def sample_core_protocol(self):
        """Sample core protocol data for testing"""
        return {
            "title": "Test Audio Track",
            "description": "A sample audio track for testing validation",
            "duration": 180.5,
            "sample_rate": 44100,
            "channels": 2,
            "format": "wav",
            "language": "en-US",
            "created_at": "2025-09-29T10:30:00Z"
        }

    @pytest.fixture
    def sample_musical_analysis(self):
        """Sample musical analysis data for testing"""
        return {
            "title": "Musical Analysis Test",
            "tempo": 120,
            "key": "C_major",
            "time_signature": "4/4",
            "genre": "classical",
            "instruments": ["piano", "violin"],
            "dynamic_range": "medium",
            "harmonic_complexity": "moderate"
        }

    def test_complete_core_validation_flow(self, client, session_id, sample_core_protocol):
        """
        Test complete core schema validation flow

        Simulates a user creating a basic audio description protocol
        through the wizard interface.
        """
        # Step 1: Create validation session
        session_response = client.post("/api/v1/validation/session")
        assert session_response.status_code == 201
        session_data = session_response.json()
        assert "session_id" in session_data
        assert "validation_rules_version" in session_data

        actual_session_id = session_data["session_id"]

        # Step 2: Get available schemas
        schemas_response = client.get("/api/v1/validation/schemas")
        assert schemas_response.status_code == 200
        schemas = schemas_response.json()
        assert len(schemas) >= 4  # core, musical_analysis, semantic_attributes, dataset_manifest

        core_schema = next((s for s in schemas if s["schema_id"] == "core"), None)
        assert core_schema is not None
        assert core_schema["version"] == "1.2.0"

        # Step 3: Validate complete protocol (should pass)
        validation_request = {
            "protocol_data": sample_core_protocol,
            "schema_type": "core",
            "session_id": actual_session_id,
            "validation_mode": "full"
        }

        validation_response = client.post("/api/v1/validation/validate", json=validation_request)
        assert validation_response.status_code == 200

        result = validation_response.json()
        assert result["is_valid"] is True
        assert len(result["errors"]) == 0
        assert "field_results" in result
        assert result["schema_version"] == "1.2.0"

        # Step 4: Test field-level validation
        field_validation_request = {
            "protocol_data": sample_core_protocol,
            "schema_type": "core",
            "field_path": "$.title",
            "session_id": actual_session_id,
            "validation_mode": "field"
        }

        field_response = client.post("/api/v1/validation/validate", json=field_validation_request)
        assert field_response.status_code == 200

        field_result = field_response.json()
        assert field_result["is_valid"] is True

    def test_validation_error_handling_flow(self, client, session_id):
        """
        Test validation error handling with invalid data

        Simulates user making common mistakes in protocol configuration.
        """
        # Create session
        session_response = client.post("/api/v1/validation/session")
        session_id = session_response.json()["session_id"]

        # Test with invalid protocol data
        invalid_protocol = {
            "title": "",  # Invalid: empty title
            "duration": -10,  # Invalid: negative duration
            "sample_rate": "invalid",  # Invalid: non-numeric sample rate
            "channels": 100  # Invalid: too many channels
        }

        validation_request = {
            "protocol_data": invalid_protocol,
            "schema_type": "core",
            "session_id": session_id,
            "validation_mode": "full"
        }

        response = client.post("/api/v1/validation/validate", json=validation_request)
        assert response.status_code == 200

        result = response.json()
        assert result["is_valid"] is False
        assert len(result["errors"]) > 0

        # Check error structure
        for error in result["errors"]:
            assert "field_path" in error
            assert "message" in error
            assert "error_code" in error
            assert "severity" in error
            assert error["field_path"].startswith("$.")
            assert len(error["message"]) <= 200  # Brief messages

    def test_musical_analysis_validation_flow(self, client, sample_musical_analysis):
        """
        Test musical analysis schema validation flow

        Simulates advanced user creating detailed musical analysis.
        """
        # Create session
        session_response = client.post("/api/v1/validation/session")
        session_id = session_response.json()["session_id"]

        # Validate musical analysis protocol
        validation_request = {
            "protocol_data": sample_musical_analysis,
            "schema_type": "musical_analysis",
            "session_id": session_id,
            "validation_mode": "full"
        }

        response = client.post("/api/v1/validation/validate", json=validation_request)
        assert response.status_code == 200

        result = response.json()
        assert result["is_valid"] is True
        assert "tempo" in result["field_results"]
        assert "key" in result["field_results"]

    def test_performance_requirements(self, client, session_id, sample_core_protocol):
        """
        Test performance requirements (<500ms response time)

        Validates that API responses meet performance targets.
        """
        # Create session
        session_response = client.post("/api/v1/validation/session")
        session_id = session_response.json()["session_id"]

        validation_request = {
            "protocol_data": sample_core_protocol,
            "schema_type": "core",
            "session_id": session_id,
            "validation_mode": "full"
        }

        # Measure response time
        start_time = time.time()
        response = client.post("/api/v1/validation/validate", json=validation_request)
        end_time = time.time()

        response_time_ms = (end_time - start_time) * 1000

        assert response.status_code == 200
        assert response_time_ms < 500, f"Response time {response_time_ms}ms exceeds 500ms target"

    def test_session_consistency_flow(self, client, sample_core_protocol):
        """
        Test session-scoped validation rule consistency

        Validates that session maintains consistent validation rules.
        """
        # Create session
        session_response = client.post("/api/v1/validation/session")
        session_data = session_response.json()
        session_id = session_data["session_id"]
        rules_version = session_data["validation_rules_version"]

        # Multiple validations in same session should use same rules version
        for i in range(3):
            validation_request = {
                "protocol_data": {**sample_core_protocol, "title": f"Test {i}"},
                "schema_type": "core",
                "session_id": session_id,
                "validation_mode": "full"
            }

            response = client.post("/api/v1/validation/validate", json=validation_request)
            result = response.json()

            assert result["schema_version"] == rules_version

    def test_concurrent_validation_flow(self, client, sample_core_protocol):
        """
        Test concurrent validation requests

        Simulates multiple users validating protocols simultaneously.
        """
        import threading
        import queue

        results_queue = queue.Queue()

        def validate_protocol(protocol_data):
            # Create individual session per thread
            session_response = client.post("/api/v1/validation/session")
            session_id = session_response.json()["session_id"]

            validation_request = {
                "protocol_data": protocol_data,
                "schema_type": "core",
                "session_id": session_id,
                "validation_mode": "full"
            }

            response = client.post("/api/v1/validation/validate", json=validation_request)
            results_queue.put((response.status_code, response.json()))

        # Launch concurrent validations
        threads = []
        for i in range(5):
            protocol = {**sample_core_protocol, "title": f"Concurrent Test {i}"}
            thread = threading.Thread(target=validate_protocol, args=(protocol,))
            threads.append(thread)
            thread.start()

        # Wait for all threads
        for thread in threads:
            thread.join()

        # Check all results
        assert results_queue.qsize() == 5

        while not results_queue.empty():
            status_code, result = results_queue.get()
            assert status_code == 200
            assert result["is_valid"] is True

    def test_health_check_integration(self, client):
        """
        Test health check endpoint for monitoring integration
        """
        response = client.get("/api/v1/health")
        assert response.status_code == 200

        health_data = response.json()
        assert health_data["status"] == "healthy"
        assert health_data["service"] == "adp-validation-api"
        assert "version" in health_data

    def test_cors_headers_for_wizard(self, client, sample_core_protocol):
        """
        Test CORS headers for wizard interface integration
        """
        # Create session first
        session_response = client.post("/api/v1/validation/session")
        session_id = session_response.json()["session_id"]

        # Test preflight request (OPTIONS)
        options_response = client.options(
            "/api/v1/validation/validate",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            }
        )

        assert "Access-Control-Allow-Origin" in options_response.headers
        assert "Access-Control-Allow-Methods" in options_response.headers

        # Test actual request with CORS
        validation_request = {
            "protocol_data": sample_core_protocol,
            "schema_type": "core",
            "session_id": session_id,
            "validation_mode": "full"
        }

        response = client.post(
            "/api/v1/validation/validate",
            json=validation_request,
            headers={"Origin": "http://localhost:3000"}
        )

        assert response.status_code == 200
        assert "Access-Control-Allow-Origin" in response.headers

    def test_error_format_consistency(self, client):
        """
        Test consistent error format across all endpoints
        """
        # Test invalid request to validate endpoint
        invalid_request = {
            "protocol_data": "not an object",  # Invalid type
            "schema_type": "invalid_schema",   # Invalid schema
            "session_id": "invalid-uuid",     # Invalid UUID
            "validation_mode": "invalid_mode" # Invalid mode
        }

        response = client.post("/api/v1/validation/validate", json=invalid_request)
        assert response.status_code == 422  # Validation error

        error_data = response.json()
        assert "detail" in error_data

    def test_quickstart_scenario_basic_audio(self, client):
        """
        Test quickstart scenario: Basic audio description

        Simulates the step-by-step process from the quickstart guide.
        """
        # Quickstart Step 1: Create session
        session_response = client.post("/api/v1/validation/session")
        assert session_response.status_code == 201
        session_id = session_response.json()["session_id"]

        # Quickstart Step 2: Get schemas
        schemas_response = client.get("/api/v1/validation/schemas")
        assert schemas_response.status_code == 200

        # Quickstart Step 3: Build basic protocol
        basic_protocol = {
            "title": "My First Audio Description",
            "description": "Learning to use the Audio Description Protocol",
            "duration": 120.0,
            "language": "en-US"
        }

        # Quickstart Step 4: Validate protocol
        validation_request = {
            "protocol_data": basic_protocol,
            "schema_type": "core",
            "session_id": session_id,
            "validation_mode": "full"
        }

        response = client.post("/api/v1/validation/validate", json=validation_request)
        assert response.status_code == 200

        result = response.json()
        assert result["is_valid"] is True

    def test_quickstart_scenario_musical_analysis(self, client):
        """
        Test quickstart scenario: Musical analysis workflow

        Simulates advanced musical analysis from quickstart guide.
        """
        # Create session
        session_response = client.post("/api/v1/validation/session")
        session_id = session_response.json()["session_id"]

        # Build musical analysis protocol
        musical_protocol = {
            "title": "Beethoven Symphony No. 9",
            "composer": "Ludwig van Beethoven",
            "tempo": 125,
            "key": "D_minor",
            "time_signature": "4/4",
            "duration": 900.0,
            "instruments": ["orchestra", "choir"],
            "movements": [
                {
                    "title": "Allegro ma non troppo",
                    "tempo": 120,
                    "duration": 200.0
                }
            ]
        }

        # Validate musical analysis
        validation_request = {
            "protocol_data": musical_protocol,
            "schema_type": "musical_analysis",
            "session_id": session_id,
            "validation_mode": "full"
        }

        response = client.post("/api/v1/validation/validate", json=validation_request)
        assert response.status_code == 200

        result = response.json()
        assert result["is_valid"] is True


class TestOfflineValidationFlow:
    """
    Tests for offline validation capability

    Simulates network failures and offline scenarios.
    """

    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_service_unavailable_handling(self, client):
        """
        Test graceful handling when validation service is unavailable
        """
        # This would typically test network failure scenarios
        # For now, we test the error response format

        # Test with malformed request that might trigger service errors
        invalid_request = {}

        response = client.post("/api/v1/validation/validate", json=invalid_request)

        # Should return proper error format, not crash
        assert response.status_code in [400, 422, 500]

        if response.status_code != 500:
            error_data = response.json()
            assert "detail" in error_data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])