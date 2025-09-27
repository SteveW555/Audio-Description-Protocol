"""Test dictionary schema validation."""

import json
import pytest
from pathlib import Path
from jsonschema import ValidationError
from adp_core.validation import SchemaResolver


class TestDictionarySchemaValidation:
    """Test dictionary entry schema validation."""

    @pytest.fixture
    def schema_resolver(self):
        """Schema resolver for handling references."""
        return SchemaResolver()

    @pytest.fixture
    def schema_path(self):
        """Path to dictionary schema file."""
        return Path("schemas/dictionary.schema.json")

    @pytest.fixture
    def schema(self, schema_resolver):
        """Load dictionary schema."""
        return schema_resolver.get_schema("dictionary.schema")

    @pytest.fixture
    def valid_dictionary_entry(self):
        """Valid dictionary entry for testing."""
        return {
            "id": "lo-fi-hip-hop",
            "label": "lo-fi hip hop",
            "definition": "Relaxed hip hop subgenre characterized by low-fidelity sound quality, jazz samples, and downtempo beats.",
            "schema_version": "1.0",
            "parent_id": "hip-hop",
            "tags": ["chill", "instrumental", "study-music"],
            "created_at": "2025-09-26T10:00:00Z"
        }

    def test_schema_file_exists(self, schema_path):
        """Test that dictionary schema file exists."""
        assert schema_path.exists(), f"Schema file not found: {schema_path}"

    def test_schema_is_valid_json(self, schema_path):
        """Test that schema file contains valid JSON."""
        with open(schema_path) as f:
            json.load(f)  # Should not raise exception

    def test_valid_dictionary_entry_passes(self, schema_resolver, valid_dictionary_entry):
        """Test that valid dictionary entry passes validation."""
        schema_resolver.validate(valid_dictionary_entry, "dictionary.schema")

    def test_required_fields_validation(self, schema_resolver):
        """Test that required fields are enforced."""
        # Missing id
        invalid_entry = {
            "label": "test label",
            "definition": "test definition",
            "schema_version": "1.0"
        }
        with pytest.raises(ValidationError, match="'id' is a required property"):
            schema_resolver.validate(invalid_entry, "dictionary.schema")

        # Missing label
        invalid_entry = {
            "id": "test-id",
            "definition": "test definition",
            "schema_version": "1.0"
        }
        with pytest.raises(ValidationError, match="'label' is a required property"):
            schema_resolver.validate(invalid_entry, "dictionary.schema")

    def test_id_pattern_validation(self, schema_resolver):
        """Test ID pattern validation (kebab-case)."""
        # Valid kebab-case IDs
        valid_ids = ["test", "test-id", "multi-word-test", "test123", "test-123-abc"]
        for valid_id in valid_ids:
            entry = {
                "id": valid_id,
                "label": "test label",
                "definition": "test definition",
                "schema_version": "1.0"
            }
            schema_resolver.validate(entry, "dictionary.schema")

        # Invalid IDs
        invalid_ids = ["Test", "test_id", "test ID", "test.", "-test", "test-"]
        for invalid_id in invalid_ids:
            entry = {
                "id": invalid_id,
                "label": "test label",
                "definition": "test definition",
                "schema_version": "1.0"
            }
            with pytest.raises(ValidationError):
                schema_resolver.validate(entry, "dictionary.schema")

    def test_label_pattern_validation(self, schema_resolver):
        """Test label pattern validation (lowercase with spaces/hyphens)."""
        # Valid labels
        valid_labels = ["test", "test label", "multi-word test", "test-label", "test 123"]
        for valid_label in valid_labels:
            entry = {
                "id": "test-id",
                "label": valid_label,
                "definition": "test definition",
                "schema_version": "1.0"
            }
            schema_resolver.validate(entry, "dictionary.schema")

        # Invalid labels (should contain uppercase, special chars, etc.)
        invalid_labels = ["Test", "test_label", "test.label", "test@label"]
        for invalid_label in invalid_labels:
            entry = {
                "id": "test-id",
                "label": invalid_label,
                "definition": "test definition",
                "schema_version": "1.0"
            }
            with pytest.raises(ValidationError):
                schema_resolver.validate(entry, "dictionary.schema")

    def test_definition_minimum_length(self, schema_resolver):
        """Test definition minimum length requirement."""
        # Valid definition (>= 10 characters)
        entry = {
            "id": "test-id",
            "label": "test label",
            "definition": "1234567890",  # Exactly 10 characters
            "schema_version": "1.0"
        }
        schema_resolver.validate(entry, "dictionary.schema")

        # Invalid definition (< 10 characters)
        entry = {
            "id": "test-id",
            "label": "test label",
            "definition": "123456789",  # Only 9 characters
            "schema_version": "1.0"
        }
        with pytest.raises(ValidationError):
            schema_resolver.validate(entry, "dictionary.schema")

    def test_schema_version_pattern(self, schema_resolver):
        """Test schema version pattern validation."""
        # Valid versions
        valid_versions = ["1.0", "1.2.3", "10.20.30"]
        for version in valid_versions:
            entry = {
                "id": "test-id",
                "label": "test label",
                "definition": "test definition",
                "schema_version": version
            }
            schema_resolver.validate(entry, "dictionary.schema")

        # Invalid versions
        invalid_versions = ["v1.0", "1", "1.0.0.1", "1.a", ""]
        for version in invalid_versions:
            entry = {
                "id": "test-id",
                "label": "test label",
                "definition": "test definition",
                "schema_version": version
            }
            with pytest.raises(ValidationError):
                schema_resolver.validate(entry, "dictionary.schema")

    def test_optional_fields(self, schema_resolver, valid_dictionary_entry):
        """Test that optional fields work correctly."""
        # Test without optional fields
        minimal_entry = {
            "id": "test-id",
            "label": "test label",
            "definition": "test definition",
            "schema_version": "1.0"
        }
        schema_resolver.validate(minimal_entry, "dictionary.schema")

        # Test with all optional fields
        schema_resolver.validate(valid_dictionary_entry, "dictionary.schema")

    def test_iso_timestamp_format(self, schema_resolver):
        """Test ISO 8601 timestamp format validation."""
        valid_timestamps = [
            "2025-09-26T10:00:00Z",
            "2025-09-26T10:00:00+00:00",
            "2025-09-26T10:00:00.123Z"
        ]

        for timestamp in valid_timestamps:
            entry = {
                "id": "test-id",
                "label": "test label",
                "definition": "test definition",
                "schema_version": "1.0",
                "created_at": timestamp
            }
            schema_resolver.validate(entry, "dictionary.schema")

        # Invalid timestamp formats
        invalid_timestamps = [
            "2025-09-26",
            "10:00:00",
            "2025/09/26 10:00:00",
            "invalid-date"
        ]

        for timestamp in invalid_timestamps:
            entry = {
                "id": "test-id",
                "label": "test label",
                "definition": "test definition",
                "schema_version": "1.0",
                "created_at": timestamp
            }
            with pytest.raises(ValidationError):
                schema_resolver.validate(entry, "dictionary.schema")