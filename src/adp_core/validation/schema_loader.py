"""
Schema loading and management for wizard-python validation integration

Handles ADP schema definitions, caching, and validation rule management
for all supported schema types including full taxonomy support.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional
from enum import Enum
import json

from pydantic import BaseModel, Field

from .models import SchemaType


class ValidationSchema(BaseModel):
    """
    Model representing ADP schema definitions used for validation

    Contains schema content, version information, and taxonomy rules
    for comprehensive validation support.
    """
    schema_id: str = Field(
        ...,
        description="Unique identifier for schema type"
    )
    version: str = Field(
        ...,
        description="Schema version (semantic versioning)"
    )
    schema_content: Dict[str, Any] = Field(
        ...,
        description="The JSON schema definition"
    )
    taxonomy_rules: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional taxonomy validation rules"
    )
    cached_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="When schema was loaded/cached"
    )
    description: str = Field(
        ...,
        description="Human-readable schema description"
    )

    def is_cache_fresh(self, max_age_minutes: int = 60) -> bool:
        """
        Check if cached schema is still fresh

        Args:
            max_age_minutes: Maximum age in minutes before refresh needed

        Returns:
            True if cache is fresh, False if refresh needed
        """
        from datetime import timedelta
        age = datetime.utcnow() - self.cached_at
        return age < timedelta(minutes=max_age_minutes)

    def validate_protocol_data(self, protocol_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Validate protocol data against this schema

        Args:
            protocol_data: The protocol data to validate

        Returns:
            List of validation errors found
        """
        errors = []

        try:
            import jsonschema
            # Validate against JSON schema
            validator = jsonschema.Draft7Validator(self.schema_content)
            for error in validator.iter_errors(protocol_data):
                errors.append({
                    'field_path': f"$.{'.'.join(str(p) for p in error.absolute_path)}",
                    'message': error.message,
                    'error_code': 'SCHEMA_VALIDATION_ERROR',
                    'severity': 'error'
                })

            # Additional taxonomy validation
            taxonomy_errors = self._validate_taxonomy_compliance(protocol_data)
            errors.extend(taxonomy_errors)

        except Exception as e:
            errors.append({
                'field_path': '$',
                'message': f'Schema validation failed: {str(e)}',
                'error_code': 'SCHEMA_VALIDATION_FAILURE',
                'severity': 'error'
            })

        return errors

    def _validate_taxonomy_compliance(self, protocol_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Validate taxonomy compliance for protocol data

        Args:
            protocol_data: The protocol data to validate

        Returns:
            List of taxonomy validation errors
        """
        errors = []

        # Check taxonomy version if present
        taxonomy_version = protocol_data.get('taxonomy_version')
        if taxonomy_version:
            if not self._is_valid_semantic_version(taxonomy_version):
                errors.append({
                    'field_path': '$.taxonomy_version',
                    'message': 'Taxonomy version must follow semantic versioning (e.g., "1.2.0")',
                    'error_code': 'TAXONOMY_VERSION_INVALID',
                    'severity': 'error',
                    'suggested_fix': 'Use semantic versioning format like "1.2.0"'
                })

        # Validate custom taxonomy references
        custom_fields = protocol_data.get('custom_fields', {})
        if isinstance(custom_fields, dict):
            for field_name, field_value in custom_fields.items():
                if field_name.endswith('_taxonomy_ref'):
                    if not self._is_valid_taxonomy_reference(field_value):
                        errors.append({
                            'field_path': f'$.custom_fields.{field_name}',
                            'message': 'Invalid taxonomy reference format',
                            'error_code': 'TAXONOMY_REFERENCE_INVALID',
                            'severity': 'warning',
                            'suggested_fix': 'Use valid taxonomy reference identifier'
                        })

        return errors

    def _is_valid_semantic_version(self, version: str) -> bool:
        """Check if version follows semantic versioning"""
        import re
        pattern = r'^\d+\.\d+\.\d+(?:-[a-zA-Z0-9-]+)?(?:\+[a-zA-Z0-9-]+)?$'
        return bool(re.match(pattern, version))

    def _is_valid_taxonomy_reference(self, ref: str) -> bool:
        """Check if taxonomy reference is valid"""
        # Basic validation - could be enhanced with actual taxonomy lookup
        return isinstance(ref, str) and len(ref) > 0 and not ref.startswith('unknown_')

    class Config:
        """Pydantic configuration"""
        schema_extra = {
            "example": {
                "schema_id": "core",
                "version": "1.2.0",
                "schema_content": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "minLength": 1, "maxLength": 200},
                        "duration": {"type": "number", "minimum": 0}
                    },
                    "required": ["title", "duration"]
                },
                "taxonomy_rules": {
                    "supported_taxonomies": ["core_audio", "metadata"],
                    "required_fields": ["title", "duration"]
                },
                "cached_at": "2025-09-29T10:00:00Z",
                "description": "Core Audio Description Protocol schema with taxonomy support"
            }
        }


class SchemaLoader:
    """
    Schema loading and caching manager

    Handles loading ADP schemas from various sources, caching for performance,
    and providing validation capabilities for all supported schema types.
    """

    def __init__(self):
        """Initialize schema loader with empty cache"""
        self._schema_cache: Dict[str, ValidationSchema] = {}
        self._initialize_default_schemas()

    def _initialize_default_schemas(self) -> None:
        """Initialize default ADP schemas"""
        # Core schema
        core_schema = {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200,
                    "description": "Title of the audio content"
                },
                "duration": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Duration in seconds"
                },
                "description": {
                    "type": "string",
                    "maxLength": 1000,
                    "description": "Optional description of the audio content"
                }
            },
            "required": ["title", "duration"]
        }

        # Musical analysis schema
        musical_schema = {
            "allOf": [
                core_schema,
                {
                    "type": "object",
                    "properties": {
                        "tempo": {
                            "type": "number",
                            "minimum": 1,
                            "maximum": 300,
                            "description": "Tempo in beats per minute"
                        },
                        "key_signature": {
                            "type": "string",
                            "pattern": "^[A-G][#b]? (major|minor)$",
                            "description": "Musical key signature"
                        },
                        "time_signature": {
                            "type": "string",
                            "pattern": "^\\d+/\\d+$",
                            "description": "Time signature (e.g., 4/4)"
                        }
                    },
                    "required": ["tempo", "key_signature", "time_signature"]
                }
            ]
        }

        # Semantic attributes schema
        semantic_schema = {
            "allOf": [
                core_schema,
                {
                    "type": "object",
                    "properties": {
                        "emotional_tone": {
                            "type": "string",
                            "enum": ["happy", "sad", "neutral", "energetic", "calm"],
                            "description": "Emotional tone of the audio"
                        },
                        "genre_classification": {
                            "type": "string",
                            "description": "Genre classification"
                        },
                        "semantic_tags": {
                            "type": "array",
                            "items": {"type": "string"},
                            "minItems": 1,
                            "description": "Semantic tags for content"
                        }
                    },
                    "required": ["emotional_tone", "semantic_tags"]
                }
            ]
        }

        # Dataset manifest schema
        dataset_schema = {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200
                },
                "dataset_version": {
                    "type": "string",
                    "pattern": "^\\d+\\.\\d+\\.\\d+$",
                    "description": "Dataset version in semantic versioning format"
                },
                "entries": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "path": {"type": "string"}
                        },
                        "required": ["id", "path"]
                    },
                    "minItems": 1,
                    "description": "Dataset entries"
                },
                "metadata": {
                    "type": "object",
                    "description": "Dataset metadata"
                }
            },
            "required": ["title", "dataset_version", "entries", "metadata"]
        }

        # Create ValidationSchema instances
        schemas = [
            ValidationSchema(
                schema_id="core",
                version="1.2.0",
                schema_content=core_schema,
                description="Core Audio Description Protocol schema with taxonomy support",
                taxonomy_rules={"supported_taxonomies": ["core_audio", "metadata"]}
            ),
            ValidationSchema(
                schema_id="musical_analysis",
                version="1.2.0",
                schema_content=musical_schema,
                description="Musical analysis schema with tempo, key, and time signature taxonomy support",
                taxonomy_rules={"supported_taxonomies": ["musical", "tempo", "harmony"]}
            ),
            ValidationSchema(
                schema_id="semantic_attributes",
                version="1.2.0",
                schema_content=semantic_schema,
                description="Semantic attributes schema with emotional and genre taxonomy support",
                taxonomy_rules={"supported_taxonomies": ["emotional", "genre", "semantic"]}
            ),
            ValidationSchema(
                schema_id="dataset_manifest",
                version="1.2.0",
                schema_content=dataset_schema,
                description="Dataset manifest schema with versioning and entry taxonomy support",
                taxonomy_rules={"supported_taxonomies": ["dataset", "versioning", "manifest"]}
            )
        ]

        for schema in schemas:
            self._schema_cache[schema.schema_id] = schema

    def get_schema(self, schema_type: SchemaType) -> Optional[ValidationSchema]:
        """
        Get schema by type

        Args:
            schema_type: The schema type to retrieve

        Returns:
            ValidationSchema if found, None otherwise
        """
        schema = self._schema_cache.get(schema_type.value)
        if schema and schema.is_cache_fresh():
            return schema
        elif schema:
            # Refresh schema if cache is stale
            return self._refresh_schema(schema_type)
        return None

    def get_all_schemas(self) -> List[ValidationSchema]:
        """
        Get all available schemas

        Returns:
            List of all available ValidationSchema instances
        """
        return list(self._schema_cache.values())

    def _refresh_schema(self, schema_type: SchemaType) -> Optional[ValidationSchema]:
        """
        Refresh schema from source

        Args:
            schema_type: The schema type to refresh

        Returns:
            Refreshed ValidationSchema if successful
        """
        # In a real implementation, this would reload from file system or API
        # For now, we'll just update the cached_at timestamp
        schema = self._schema_cache.get(schema_type.value)
        if schema:
            schema.cached_at = datetime.utcnow()
            return schema
        return None

    def validate_schema_id(self, schema_id: str) -> bool:
        """
        Validate if schema ID is supported

        Args:
            schema_id: The schema ID to validate

        Returns:
            True if schema ID is valid, False otherwise
        """
        return schema_id in [schema_type.value for schema_type in SchemaType]