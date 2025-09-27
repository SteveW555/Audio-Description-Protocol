"""Test annotation schema validation."""

import json
import pytest
from pathlib import Path
from jsonschema import ValidationError
from src.adp_core.validation import SchemaResolver


class TestAnnotationSchemaValidation:
    """Test annotation schema validation."""

    @pytest.fixture
    def schema_resolver(self):
        """Schema resolver for handling references."""
        return SchemaResolver()

    @pytest.fixture
    def schema_path(self):
        """Path to annotation schema file."""
        return Path("schemas/annotation.schema.json")

    @pytest.fixture
    def schema(self, schema_resolver):
        """Load annotation schema."""
        return schema_resolver.get_schema("annotation.schema")

    @pytest.fixture
    def valid_annotation(self):
        """Valid annotation for testing."""
        return {
            "id": "annotation-001",
            "clip_id": "sample-audio-001",
            "time_range": {
                "start_sec": 0.0,
                "end_sec": 30.0
            },
            "labels": [
                {
                    "entry_id": "lo-fi-hip-hop",
                    "confidence": 0.85
                },
                {
                    "entry_id": "instrumental",
                    "confidence": 0.95
                }
            ],
            "free_text": "Relaxing background music with vinyl crackle",
            "provenance": {
                "annotator_type": "human",
                "annotator_id": "researcher-001",
                "timestamp": "2025-09-26T10:30:00Z"
            },
            "schema_version": "1.0"
        }

    def test_schema_file_exists(self, schema_path):
        """Test that annotation schema file exists."""
        assert schema_path.exists(), f"Schema file not found: {schema_path}"

    def test_schema_is_valid_json(self, schema_path):
        """Test that schema file contains valid JSON."""
        with open(schema_path) as f:
            json.load(f)  # Should not raise exception

    def test_valid_annotation_passes(self, schema_resolver, valid_annotation):
        """Test that valid annotation passes validation."""
        schema_resolver.validate(valid_annotation, "annotation.schema")

    def test_required_fields_validation(self, schema_resolver):
        """Test that required fields are enforced."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "labels": [{"entry_id": "test", "confidence": 0.5}],
            "provenance": {"annotator_type": "human", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0"
        }

        # Test each required field
        required_fields = ["id", "clip_id", "time_range", "labels", "provenance", "schema_version"]

        for field in required_fields:
            invalid_annotation = base_annotation.copy()
            del invalid_annotation[field]

            with pytest.raises(ValidationError, match=f"'{field}' is a required property"):
                schema_resolver.validate(invalid_annotation, "annotation.schema")

    def test_time_range_validation(self, schema_resolver):
        """Test time range validation rules."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "labels": [{"entry_id": "test", "confidence": 0.5}],
            "provenance": {"annotator_type": "human", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0"
        }

        # Valid time ranges
        valid_ranges = [
            {"start_sec": 0.0, "end_sec": 1.0},
            {"start_sec": 0.5, "end_sec": 10.5},
            {"start_sec": 100.0, "end_sec": 200.0}
        ]

        for time_range in valid_ranges:
            annotation = base_annotation.copy()
            annotation["time_range"] = time_range
            schema_resolver.validate(annotation, "annotation.schema")

        # Invalid time ranges (end <= start)
        invalid_ranges = [
            {"start_sec": 1.0, "end_sec": 1.0},  # Equal
            {"start_sec": 2.0, "end_sec": 1.0},  # End < start
            {"start_sec": -1.0, "end_sec": 1.0},  # Negative start
            {"start_sec": 0.0, "end_sec": -1.0}   # Negative end
        ]

        for time_range in invalid_ranges:
            annotation = base_annotation.copy()
            annotation["time_range"] = time_range
            with pytest.raises(ValidationError):
                schema_resolver.validate(annotation, "annotation.schema")

    def test_labels_validation(self, schema_resolver):
        """Test labels array validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "human", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0"
        }

        # Valid labels
        valid_labels = [
            [{"entry_id": "test", "confidence": 0.5}],
            [{"entry_id": "test1", "confidence": 0.0}, {"entry_id": "test2", "confidence": 1.0}],
            [{"entry_id": "test", "confidence": 0.75}]
        ]

        for labels in valid_labels:
            annotation = base_annotation.copy()
            annotation["labels"] = labels
            schema_resolver.validate(annotation, "annotation.schema")

        # Empty labels array (should fail)
        annotation = base_annotation.copy()
        annotation["labels"] = []
        with pytest.raises(ValidationError):
            schema_resolver.validate(annotation, "annotation.schema")

        # Invalid confidence scores
        invalid_labels = [
            [{"entry_id": "test", "confidence": -0.1}],  # Below 0
            [{"entry_id": "test", "confidence": 1.1}],   # Above 1
            [{"entry_id": "test", "confidence": "high"}], # Non-numeric
        ]

        for labels in invalid_labels:
            annotation = base_annotation.copy()
            annotation["labels"] = labels
            with pytest.raises(ValidationError):
                schema_resolver.validate(annotation, "annotation.schema")

    def test_provenance_validation(self, schema_resolver):
        """Test provenance object validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "labels": [{"entry_id": "test", "confidence": 0.5}],
            "schema_version": "1.0"
        }

        # Valid annotator_type values
        valid_types = ["human", "ai"]
        for annotator_type in valid_types:
            annotation = base_annotation.copy()
            annotation["provenance"] = {
                "annotator_type": annotator_type,
                "timestamp": "2025-09-26T10:30:00Z"
            }
            schema_resolver.validate(annotation, "annotation.schema")

        # Invalid annotator_type
        annotation = base_annotation.copy()
        annotation["provenance"] = {
            "annotator_type": "robot",
            "timestamp": "2025-09-26T10:30:00Z"
        }
        with pytest.raises(ValidationError):
            schema_resolver.validate(annotation, "annotation.schema")

        # Missing required provenance fields
        required_provenance_fields = ["annotator_type", "timestamp"]
        for field in required_provenance_fields:
            provenance = {
                "annotator_type": "human",
                "timestamp": "2025-09-26T10:30:00Z"
            }
            del provenance[field]

            annotation = base_annotation.copy()
            annotation["provenance"] = provenance
            with pytest.raises(ValidationError):
                schema_resolver.validate(annotation, "annotation.schema")

    def test_schema_version_pattern(self, schema_resolver):
        """Test schema version pattern validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "labels": [{"entry_id": "test", "confidence": 0.5}],
            "provenance": {"annotator_type": "human", "timestamp": "2025-09-26T10:30:00Z"},
        }

        # Valid versions
        valid_versions = ["1.0", "1.2.3", "10.20.30"]
        for version in valid_versions:
            annotation = base_annotation.copy()
            annotation["schema_version"] = version
            schema_resolver.validate(annotation, "annotation.schema")

        # Invalid versions
        invalid_versions = ["v1.0", "1", "1.0.0.1", "1.a", ""]
        for version in invalid_versions:
            annotation = base_annotation.copy()
            annotation["schema_version"] = version
            with pytest.raises(ValidationError):
                schema_resolver.validate(annotation, "annotation.schema")

    def test_optional_fields(self, schema, valid_annotation):
        """Test that optional fields work correctly."""
        # Minimal annotation without optional fields
        minimal_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "labels": [{"entry_id": "test", "confidence": 0.5}],
            "provenance": {"annotator_type": "human", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0"
        }
        schema_resolver.validate(minimal_annotation, "annotation.schema")

        # Full annotation with all optional fields
        schema_resolver.validate(valid_annotation, "annotation.schema")

    def test_iso_timestamp_format(self, schema_resolver):
        """Test ISO 8601 timestamp format validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "labels": [{"entry_id": "test", "confidence": 0.5}],
            "schema_version": "1.0"
        }

        valid_timestamps = [
            "2025-09-26T10:00:00Z",
            "2025-09-26T10:00:00+00:00",
            "2025-09-26T10:00:00.123Z"
        ]

        for timestamp in valid_timestamps:
            annotation = base_annotation.copy()
            annotation["provenance"] = {
                "annotator_type": "human",
                "timestamp": timestamp
            }
            schema_resolver.validate(annotation, "annotation.schema")

        # Invalid timestamp formats
        invalid_timestamps = [
            "2025-09-26",
            "10:00:00",
            "2025/09/26 10:00:00",
            "invalid-date"
        ]

        for timestamp in invalid_timestamps:
            annotation = base_annotation.copy()
            annotation["provenance"] = {
                "annotator_type": "human",
                "timestamp": timestamp
            }
            with pytest.raises(ValidationError):
                schema_resolver.validate(annotation, "annotation.schema")