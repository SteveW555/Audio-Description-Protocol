"""
Pydantic models for wizard-python validation integration

These models define the data structures for validation requests and responses
following the OpenAPI contract specifications.
"""

from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, Field, validator


class SchemaType(str, Enum):
    """ADP schema types supported for validation"""
    CORE = "core"
    MUSICAL_ANALYSIS = "musical_analysis"
    SEMANTIC_ATTRIBUTES = "semantic_attributes"
    DATASET_MANIFEST = "dataset_manifest"


class ValidationMode(str, Enum):
    """Validation modes for different validation scopes"""
    FIELD = "field"
    FULL = "full"
    QUICK = "quick"


class ErrorSeverity(str, Enum):
    """Severity levels for validation issues"""
    ERROR = "error"
    WARNING = "warning"


class ValidationRequest(BaseModel):
    """
    Request model for protocol validation

    Represents a request to validate protocol data from the wizard interface.
    """
    protocol_data: Dict[str, Any] = Field(
        ...,
        description="The user's protocol configuration from wizard"
    )
    schema_type: SchemaType = Field(
        ...,
        description="Type of ADP schema to validate against"
    )
    field_path: Optional[str] = Field(
        None,
        description="Specific field path for field-level validation",
        pattern=r"^\$\."
    )
    session_id: UUID = Field(
        ...,
        description="Session identifier for rule versioning"
    )
    validation_mode: ValidationMode = Field(
        ...,
        description="Validation scope and detail level"
    )

    @validator('protocol_data')
    def protocol_data_must_be_object(cls, v):
        """Validate that protocol_data is a valid object"""
        if not isinstance(v, dict):
            raise ValueError('protocol_data must be a valid JSON object')
        return v

    @validator('field_path')
    def field_path_jsonpath_format(cls, v):
        """Validate that field_path follows JSONPath syntax when provided"""
        if v is not None and not v.startswith('$.'):
            raise ValueError('field_path must follow JSONPath syntax starting with "$."')
        return v

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "protocol_data": {
                    "title": "My Audio Track",
                    "duration": 180
                },
                "schema_type": "core",
                "field_path": "$.title",
                "session_id": "550e8400-e29b-41d4-a716-446655440000",
                "validation_mode": "field"
            }
        }


class ValidationError(BaseModel):
    """
    Model representing a specific validation failure

    Contains detailed information about validation errors with brief,
    user-friendly messages and actionable guidance.
    """
    field_path: str = Field(
        ...,
        description="JSONPath to the failing field"
    )
    message: str = Field(
        ...,
        max_length=200,
        description="Brief, user-friendly error message (1-2 sentences)"
    )
    error_code: str = Field(
        ...,
        description="Machine-readable error identifier"
    )
    severity: ErrorSeverity = Field(
        ...,
        description="Error severity level"
    )
    suggested_fix: Optional[str] = Field(
        None,
        description="Actionable guidance for correction"
    )

    @validator('message')
    def message_must_be_brief(cls, v):
        """Ensure message is brief (1-2 sentences max)"""
        sentences = v.split('.') if v else []
        if len([s for s in sentences if s.strip()]) > 2:
            raise ValueError('Error message must be 1-2 sentences maximum')
        return v

    @validator('field_path')
    def field_path_must_be_jsonpath(cls, v):
        """Validate field_path follows JSONPath format"""
        if not v.startswith('$.'):
            raise ValueError('field_path must be valid JSONPath starting with "$."')
        return v

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "field_path": "$.title",
                "message": "Title must be between 1 and 200 characters. Current length is 0.",
                "error_code": "FIELD_LENGTH_INVALID",
                "severity": "error",
                "suggested_fix": "Enter a descriptive title for your audio content"
            }
        }


class ValidationWarning(BaseModel):
    """
    Model representing a non-blocking validation warning

    Similar to ValidationError but for issues that don't prevent
    protocol creation.
    """
    field_path: str = Field(
        ...,
        description="JSONPath to the field with warning"
    )
    message: str = Field(
        ...,
        max_length=200,
        description="Brief warning message"
    )
    warning_code: str = Field(
        ...,
        description="Machine-readable warning identifier"
    )

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "field_path": "$.description",
                "message": "Description is recommended for better protocol clarity.",
                "warning_code": "FIELD_RECOMMENDED"
            }
        }


class ValidationResult(BaseModel):
    """
    Response model containing validation outcome with detailed feedback

    Contains the outcome of validation with detailed feedback for the
    wizard interface, including field-level status and error details.
    """
    is_valid: bool = Field(
        ...,
        description="Overall validation status"
    )
    errors: List[ValidationError] = Field(
        default_factory=list,
        description="List of validation errors found"
    )
    warnings: List[ValidationWarning] = Field(
        default_factory=list,
        description="List of validation warnings"
    )
    field_results: Dict[str, str] = Field(
        default_factory=dict,
        description="Field-level validation status map"
    )
    processed_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When validation was completed"
    )
    schema_version: str = Field(
        ...,
        description="Version of schema used for validation"
    )

    @validator('field_results')
    def field_results_valid_statuses(cls, v):
        """Validate field result statuses are valid"""
        valid_statuses = {'valid', 'invalid', 'pending'}
        for field, status in v.items():
            if status not in valid_statuses:
                raise ValueError(f'Invalid field status: {status}. Must be one of {valid_statuses}')
        return v

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "is_valid": True,
                "errors": [],
                "warnings": [],
                "field_results": {
                    "title": "valid",
                    "duration": "valid"
                },
                "processed_at": "2025-09-29T10:30:00Z",
                "schema_version": "1.2.0"
            }
        }