"""
Unit tests for validation models

Tests Pydantic model validation, serialization, and business logic
following the clarified requirements.
"""

import pytest
from datetime import datetime
from uuid import UUID, uuid4
from typing import Dict, Any

from pydantic import ValidationError

from adp_core.validation.models import (
    ValidationRequest, ValidationResult, ValidationError as ValidationErrorModel,
    ValidationWarning, SchemaType, ValidationMode, ErrorSeverity
)


class TestSchemaType:
    """Test SchemaType enum values"""

    def test_schema_type_values(self):
        """Test all schema type enumeration values"""
        assert SchemaType.CORE == "core"
        assert SchemaType.MUSICAL_ANALYSIS == "musical_analysis"
        assert SchemaType.SEMANTIC_ATTRIBUTES == "semantic_attributes"
        assert SchemaType.DATASET_MANIFEST == "dataset_manifest"

    def test_schema_type_from_string(self):
        """Test creating SchemaType from string values"""
        assert SchemaType("core") == SchemaType.CORE
        assert SchemaType("musical_analysis") == SchemaType.MUSICAL_ANALYSIS
        assert SchemaType("semantic_attributes") == SchemaType.SEMANTIC_ATTRIBUTES
        assert SchemaType("dataset_manifest") == SchemaType.DATASET_MANIFEST

    def test_invalid_schema_type(self):
        """Test invalid schema type raises ValueError"""
        with pytest.raises(ValueError):
            SchemaType("invalid_schema")


class TestValidationMode:
    """Test ValidationMode enum values"""

    def test_validation_mode_values(self):
        """Test all validation mode enumeration values"""
        assert ValidationMode.FIELD == "field"
        assert ValidationMode.FULL == "full"
        assert ValidationMode.QUICK == "quick"

    def test_validation_mode_from_string(self):
        """Test creating ValidationMode from string values"""
        assert ValidationMode("field") == ValidationMode.FIELD
        assert ValidationMode("full") == ValidationMode.FULL
        assert ValidationMode("quick") == ValidationMode.QUICK

    def test_invalid_validation_mode(self):
        """Test invalid validation mode raises ValueError"""
        with pytest.raises(ValueError):
            ValidationMode("invalid_mode")


class TestErrorSeverity:
    """Test ErrorSeverity enum values"""

    def test_error_severity_values(self):
        """Test all error severity enumeration values"""
        assert ErrorSeverity.ERROR == "error"
        assert ErrorSeverity.WARNING == "warning"

    def test_error_severity_from_string(self):
        """Test creating ErrorSeverity from string values"""
        assert ErrorSeverity("error") == ErrorSeverity.ERROR
        assert ErrorSeverity("warning") == ErrorSeverity.WARNING

    def test_invalid_error_severity(self):
        """Test invalid error severity raises ValueError"""
        with pytest.raises(ValueError):
            ErrorSeverity("invalid_severity")


class TestValidationRequest:
    """Test ValidationRequest model validation and functionality"""

    @pytest.fixture
    def valid_protocol_data(self) -> Dict[str, Any]:
        """Valid protocol data for testing"""
        return {
            "title": "Test Audio Track",
            "duration": 180.5,
            "language": "en-US"
        }

    @pytest.fixture
    def valid_session_id(self) -> UUID:
        """Valid session ID for testing"""
        return uuid4()

    def test_valid_validation_request(self, valid_protocol_data, valid_session_id):
        """Test creating valid ValidationRequest"""
        request = ValidationRequest(
            protocol_data=valid_protocol_data,
            schema_type=SchemaType.CORE,
            session_id=valid_session_id,
            validation_mode=ValidationMode.FULL
        )

        assert request.protocol_data == valid_protocol_data
        assert request.schema_type == SchemaType.CORE
        assert request.session_id == valid_session_id
        assert request.validation_mode == ValidationMode.FULL
        assert request.field_path is None

    def test_validation_request_with_field_path(self, valid_protocol_data, valid_session_id):
        """Test ValidationRequest with field path for field validation"""
        request = ValidationRequest(
            protocol_data=valid_protocol_data,
            schema_type=SchemaType.CORE,
            field_path="$.title",
            session_id=valid_session_id,
            validation_mode=ValidationMode.FIELD
        )

        assert request.field_path == "$.title"

    def test_invalid_protocol_data_type(self, valid_session_id):
        """Test ValidationRequest with invalid protocol_data type"""
        with pytest.raises(ValidationError) as exc_info:
            ValidationRequest(
                protocol_data="not an object",  # Should be dict
                schema_type=SchemaType.CORE,
                session_id=valid_session_id,
                validation_mode=ValidationMode.FULL
            )

        error = exc_info.value
        assert "Input should be a valid dictionary" in str(error)

    def test_invalid_field_path_format(self, valid_protocol_data, valid_session_id):
        """Test ValidationRequest with invalid field_path format"""
        with pytest.raises(ValidationError) as exc_info:
            ValidationRequest(
                protocol_data=valid_protocol_data,
                schema_type=SchemaType.CORE,
                field_path="invalid.path",  # Should start with $.
                session_id=valid_session_id,
                validation_mode=ValidationMode.FIELD
            )

        error = exc_info.value
        assert 'String should match pattern' in str(error) or 'field_path must follow JSONPath syntax starting with "$."' in str(error)

    def test_invalid_session_id(self, valid_protocol_data):
        """Test ValidationRequest with invalid session_id"""
        with pytest.raises(ValidationError):
            ValidationRequest(
                protocol_data=valid_protocol_data,
                schema_type=SchemaType.CORE,
                session_id="not-a-uuid",
                validation_mode=ValidationMode.FULL
            )

    def test_validation_request_serialization(self, valid_protocol_data, valid_session_id):
        """Test ValidationRequest JSON serialization/deserialization"""
        request = ValidationRequest(
            protocol_data=valid_protocol_data,
            schema_type=SchemaType.CORE,
            session_id=valid_session_id,
            validation_mode=ValidationMode.FULL
        )

        # Test serialization
        json_data = request.model_dump()
        assert json_data["protocol_data"] == valid_protocol_data
        assert json_data["schema_type"] == "core"
        assert str(json_data["session_id"]) == str(valid_session_id)
        assert json_data["validation_mode"] == "full"

        # Test deserialization
        restored_request = ValidationRequest(**json_data)
        assert restored_request.protocol_data == request.protocol_data
        assert restored_request.schema_type == request.schema_type
        assert restored_request.session_id == request.session_id
        assert restored_request.validation_mode == request.validation_mode


class TestValidationError:
    """Test ValidationError model validation and functionality"""

    def test_valid_validation_error(self):
        """Test creating valid ValidationError"""
        error = ValidationErrorModel(
            field_path="$.title",
            message="Title must be between 1 and 200 characters.",
            error_code="FIELD_LENGTH_INVALID",
            severity=ErrorSeverity.ERROR,
            suggested_fix="Enter a descriptive title for your audio content"
        )

        assert error.field_path == "$.title"
        assert error.message == "Title must be between 1 and 200 characters."
        assert error.error_code == "FIELD_LENGTH_INVALID"
        assert error.severity == ErrorSeverity.ERROR
        assert error.suggested_fix == "Enter a descriptive title for your audio content"

    def test_validation_error_without_suggested_fix(self):
        """Test ValidationError without optional suggested_fix"""
        error = ValidationErrorModel(
            field_path="$.duration",
            message="Duration must be a positive number.",
            error_code="NUMBER_NEGATIVE_INVALID",
            severity=ErrorSeverity.ERROR
        )

        assert error.suggested_fix is None

    def test_invalid_field_path_format(self):
        """Test ValidationError with invalid field_path format"""
        with pytest.raises(ValidationError) as exc_info:
            ValidationErrorModel(
                field_path="invalid.path",  # Should start with $.
                message="Test message",
                error_code="TEST_ERROR",
                severity=ErrorSeverity.ERROR
            )

        error = exc_info.value
        assert 'field_path must be valid JSONPath starting with "$."' in str(error)

    def test_message_length_validation(self):
        """Test ValidationError message length validation"""
        # Test message that's too long
        long_message = "A" * 201  # Over 200 character limit

        with pytest.raises(ValidationError):
            ValidationErrorModel(
                field_path="$.title",
                message=long_message,
                error_code="TEST_ERROR",
                severity=ErrorSeverity.ERROR
            )

    def test_message_sentence_count_validation(self):
        """Test ValidationError message sentence count validation"""
        # Test message with too many sentences
        multi_sentence_message = "First sentence. Second sentence. Third sentence. Fourth sentence."

        with pytest.raises(ValidationError) as exc_info:
            ValidationErrorModel(
                field_path="$.title",
                message=multi_sentence_message,
                error_code="TEST_ERROR",
                severity=ErrorSeverity.ERROR
            )

        error = exc_info.value
        assert "Error message must be 1-2 sentences maximum" in str(error)

    def test_validation_error_serialization(self):
        """Test ValidationError JSON serialization/deserialization"""
        error = ValidationErrorModel(
            field_path="$.title",
            message="Title is required.",
            error_code="REQUIRED_FIELD_MISSING",
            severity=ErrorSeverity.ERROR,
            suggested_fix="Enter a title"
        )

        # Test serialization
        json_data = error.model_dump()
        assert json_data["field_path"] == "$.title"
        assert json_data["message"] == "Title is required."
        assert json_data["error_code"] == "REQUIRED_FIELD_MISSING"
        assert json_data["severity"] == "error"
        assert json_data["suggested_fix"] == "Enter a title"

        # Test deserialization
        restored_error = ValidationErrorModel(**json_data)
        assert restored_error.field_path == error.field_path
        assert restored_error.message == error.message
        assert restored_error.error_code == error.error_code
        assert restored_error.severity == error.severity
        assert restored_error.suggested_fix == error.suggested_fix


class TestValidationWarning:
    """Test ValidationWarning model validation and functionality"""

    def test_valid_validation_warning(self):
        """Test creating valid ValidationWarning"""
        warning = ValidationWarning(
            field_path="$.description",
            message="Description is recommended for better protocol clarity.",
            warning_code="FIELD_RECOMMENDED"
        )

        assert warning.field_path == "$.description"
        assert warning.message == "Description is recommended for better protocol clarity."
        assert warning.warning_code == "FIELD_RECOMMENDED"

    def test_validation_warning_serialization(self):
        """Test ValidationWarning JSON serialization/deserialization"""
        warning = ValidationWarning(
            field_path="$.language",
            message="Language specification is recommended.",
            warning_code="LANGUAGE_RECOMMENDED"
        )

        # Test serialization
        json_data = warning.model_dump()
        assert json_data["field_path"] == "$.language"
        assert json_data["message"] == "Language specification is recommended."
        assert json_data["warning_code"] == "LANGUAGE_RECOMMENDED"

        # Test deserialization
        restored_warning = ValidationWarning(**json_data)
        assert restored_warning.field_path == warning.field_path
        assert restored_warning.message == warning.message
        assert restored_warning.warning_code == warning.warning_code


class TestValidationResult:
    """Test ValidationResult model validation and functionality"""

    @pytest.fixture
    def sample_validation_errors(self):
        """Sample validation errors for testing"""
        return [
            ValidationErrorModel(
                field_path="$.title",
                message="Title is required.",
                error_code="REQUIRED_FIELD_MISSING",
                severity=ErrorSeverity.ERROR
            ),
            ValidationErrorModel(
                field_path="$.duration",
                message="Duration must be positive.",
                error_code="NUMBER_NEGATIVE_INVALID",
                severity=ErrorSeverity.ERROR
            )
        ]

    @pytest.fixture
    def sample_validation_warnings(self):
        """Sample validation warnings for testing"""
        return [
            ValidationWarning(
                field_path="$.description",
                message="Description is recommended.",
                warning_code="FIELD_RECOMMENDED"
            )
        ]

    def test_valid_validation_result(self, sample_validation_errors, sample_validation_warnings):
        """Test creating valid ValidationResult"""
        field_results = {
            "title": "invalid",
            "duration": "invalid",
            "description": "valid"
        }

        result = ValidationResult(
            is_valid=False,
            errors=sample_validation_errors,
            warnings=sample_validation_warnings,
            field_results=field_results,
            schema_version="1.2.0"
        )

        assert result.is_valid is False
        assert len(result.errors) == 2
        assert len(result.warnings) == 1
        assert result.field_results == field_results
        assert result.schema_version == "1.2.0"
        assert isinstance(result.processed_at, datetime)

    def test_validation_result_defaults(self):
        """Test ValidationResult with default values"""
        result = ValidationResult(
            is_valid=True,
            schema_version="1.2.0"
        )

        assert result.is_valid is True
        assert result.errors == []
        assert result.warnings == []
        assert result.field_results == {}
        assert result.schema_version == "1.2.0"

    def test_invalid_field_result_status(self):
        """Test ValidationResult with invalid field result status"""
        with pytest.raises(ValidationError) as exc_info:
            ValidationResult(
                is_valid=True,
                field_results={"title": "invalid_status"},  # Should be valid/invalid/pending
                schema_version="1.2.0"
            )

        error = exc_info.value
        assert "Invalid field status" in str(error)

    def test_valid_field_result_statuses(self):
        """Test ValidationResult with all valid field result statuses"""
        field_results = {
            "title": "valid",
            "duration": "invalid",
            "description": "pending"
        }

        result = ValidationResult(
            is_valid=False,
            field_results=field_results,
            schema_version="1.2.0"
        )

        assert result.field_results == field_results

    def test_validation_result_serialization(self, sample_validation_errors, sample_validation_warnings):
        """Test ValidationResult JSON serialization/deserialization"""
        field_results = {"title": "invalid", "duration": "valid"}

        result = ValidationResult(
            is_valid=False,
            errors=sample_validation_errors,
            warnings=sample_validation_warnings,
            field_results=field_results,
            schema_version="1.2.0"
        )

        # Test serialization
        json_data = result.model_dump()
        assert json_data["is_valid"] is False
        assert len(json_data["errors"]) == 2
        assert len(json_data["warnings"]) == 1
        assert json_data["field_results"] == field_results
        assert json_data["schema_version"] == "1.2.0"
        assert "processed_at" in json_data

        # Test deserialization
        restored_result = ValidationResult(**json_data)
        assert restored_result.is_valid == result.is_valid
        assert len(restored_result.errors) == len(result.errors)
        assert len(restored_result.warnings) == len(result.warnings)
        assert restored_result.field_results == result.field_results
        assert restored_result.schema_version == result.schema_version


class TestModelIntegration:
    """Test integration between different models"""

    def test_complete_validation_flow_models(self):
        """Test complete validation flow using all models"""
        session_id = uuid4()

        # Create validation request
        request = ValidationRequest(
            protocol_data={"title": "", "duration": -10},
            schema_type=SchemaType.CORE,
            session_id=session_id,
            validation_mode=ValidationMode.FULL
        )

        # Create validation errors
        errors = [
            ValidationErrorModel(
                field_path="$.title",
                message="Title cannot be empty.",
                error_code="REQUIRED_FIELD_MISSING",
                severity=ErrorSeverity.ERROR,
                suggested_fix="Enter a descriptive title"
            ),
            ValidationErrorModel(
                field_path="$.duration",
                message="Duration must be positive.",
                error_code="NUMBER_NEGATIVE_INVALID",
                severity=ErrorSeverity.ERROR
            )
        ]

        # Create validation result
        result = ValidationResult(
            is_valid=False,
            errors=errors,
            warnings=[],
            field_results={
                "title": "invalid",
                "duration": "invalid"
            },
            schema_version="1.2.0"
        )

        # Verify the complete flow
        assert request.session_id == session_id
        assert request.schema_type == SchemaType.CORE
        assert result.is_valid is False
        assert len(result.errors) == 2
        assert all(error.severity == ErrorSeverity.ERROR for error in result.errors)

    def test_field_validation_models(self):
        """Test field-specific validation using models"""
        session_id = uuid4()

        # Create field validation request
        request = ValidationRequest(
            protocol_data={"title": "Valid Title"},
            schema_type=SchemaType.CORE,
            field_path="$.title",
            session_id=session_id,
            validation_mode=ValidationMode.FIELD
        )

        # Create successful validation result
        result = ValidationResult(
            is_valid=True,
            errors=[],
            warnings=[],
            field_results={"title": "valid"},
            schema_version="1.2.0"
        )

        assert request.field_path == "$.title"
        assert request.validation_mode == ValidationMode.FIELD
        assert result.is_valid is True
        assert result.field_results["title"] == "valid"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])