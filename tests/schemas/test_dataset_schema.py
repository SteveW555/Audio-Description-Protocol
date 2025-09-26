"""Test dataset schema validation."""

import json
import pytest
from pathlib import Path
from jsonschema import validate, ValidationError


class TestDatasetSchemaValidation:
    """Test dataset schema validation."""

    @pytest.fixture
    def schema_path(self):
        """Path to dataset schema file."""
        return Path("schemas/dataset.schema.json")

    @pytest.fixture
    def schema(self, schema_path):
        """Load dataset schema."""
        with open(schema_path) as f:
            return json.load(f)

    @pytest.fixture
    def valid_dataset(self):
        """Valid dataset for testing."""
        return {
            "id": "study-music-dataset",
            "name": "Study Music Dataset",
            "description": "Collection of study music clips with annotations",
            "version": "1.0.0",
            "license": "CC0-1.0",
            "clips": [
                {
                    "id": "clip-001",
                    "uri": "/path/to/audio1.wav",
                    "format": "wav",
                    "duration_sec": 120.5,
                    "checksum": "sha256:abc123def456"
                },
                {
                    "id": "clip-002",
                    "uri": "https://example.com/audio2.mp3",
                    "format": "mp3",
                    "duration_sec": 180.0
                }
            ],
            "annotations": [
                {
                    "id": "annotation-001",
                    "file_path": "/path/to/annotation1.json"
                },
                {
                    "id": "annotation-002",
                    "file_path": "/path/to/annotation2.json"
                }
            ],
            "dictionary_entries": [
                {
                    "id": "lo-fi-hip-hop",
                    "file_path": "/path/to/dictionary_lo_fi.json"
                }
            ],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z",
            "metadata": {
                "curator": "Research Team",
                "purpose": "Academic research"
            }
        }

    def test_schema_file_exists(self, schema_path):
        """Test that dataset schema file exists."""
        assert schema_path.exists(), f"Schema file not found: {schema_path}"

    def test_schema_is_valid_json(self, schema_path):
        """Test that schema file contains valid JSON."""
        with open(schema_path) as f:
            json.load(f)  # Should not raise exception

    def test_valid_dataset_passes(self, schema, valid_dataset):
        """Test that valid dataset passes validation."""
        validate(instance=valid_dataset, schema=schema)

    def test_required_fields_validation(self, schema):
        """Test that required fields are enforced."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "version": "1.0.0",
            "license": "CC0-1.0",
            "clips": [],
            "annotations": [],
            "dictionary_entries": [],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z"
        }

        required_fields = ["id", "name", "version", "license", "clips", "annotations", "dictionary_entries", "schema_version", "created_at"]

        for field in required_fields:
            invalid_dataset = base_dataset.copy()
            del invalid_dataset[field]

            with pytest.raises(ValidationError, match=f"'{field}' is a required property"):
                validate(instance=invalid_dataset, schema=schema)

    def test_clips_validation(self, schema):
        """Test clips array validation."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "version": "1.0.0",
            "license": "CC0-1.0",
            "annotations": [],
            "dictionary_entries": [],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z"
        }

        # Valid clips
        valid_clips = [
            [{"id": "clip1", "uri": "/path/to/file.wav"}],
            [{"id": "clip1", "uri": "https://example.com/file.mp3", "format": "mp3", "duration_sec": 120.0}]
        ]

        for clips in valid_clips:
            dataset = base_dataset.copy()
            dataset["clips"] = clips
            validate(instance=dataset, schema=schema)

        # Invalid clips (missing required fields)
        invalid_clips = [
            [{"uri": "/path/to/file.wav"}],  # Missing id
            [{"id": "clip1"}],  # Missing uri
            [{"id": "clip1", "uri": "/path/to/file.wav", "duration_sec": -10}]  # Negative duration
        ]

        for clips in invalid_clips:
            dataset = base_dataset.copy()
            dataset["clips"] = clips
            with pytest.raises(ValidationError):
                validate(instance=dataset, schema=schema)

    def test_annotations_validation(self, schema):
        """Test annotations array validation."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "version": "1.0.0",
            "license": "CC0-1.0",
            "clips": [],
            "dictionary_entries": [],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z"
        }

        # Valid annotations
        valid_annotations = [
            [{"id": "ann1", "file_path": "/path/to/annotation.json"}]
        ]

        for annotations in valid_annotations:
            dataset = base_dataset.copy()
            dataset["annotations"] = annotations
            validate(instance=dataset, schema=schema)

        # Invalid annotations
        invalid_annotations = [
            [{"file_path": "/path/to/annotation.json"}],  # Missing id
            [{"id": "ann1"}]  # Missing file_path
        ]

        for annotations in invalid_annotations:
            dataset = base_dataset.copy()
            dataset["annotations"] = annotations
            with pytest.raises(ValidationError):
                validate(instance=dataset, schema=schema)

    def test_dictionary_entries_validation(self, schema):
        """Test dictionary_entries array validation."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "version": "1.0.0",
            "license": "CC0-1.0",
            "clips": [],
            "annotations": [],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z"
        }

        # Valid dictionary entries
        valid_entries = [
            [{"id": "entry1", "file_path": "/path/to/dict.json"}]
        ]

        for entries in valid_entries:
            dataset = base_dataset.copy()
            dataset["dictionary_entries"] = entries
            validate(instance=dataset, schema=schema)

        # Invalid dictionary entries
        invalid_entries = [
            [{"file_path": "/path/to/dict.json"}],  # Missing id
            [{"id": "entry1"}]  # Missing file_path
        ]

        for entries in invalid_entries:
            dataset = base_dataset.copy()
            dataset["dictionary_entries"] = entries
            with pytest.raises(ValidationError):
                validate(instance=dataset, schema=schema)

    def test_version_pattern(self, schema):
        """Test version pattern validation (semantic versioning)."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "license": "CC0-1.0",
            "clips": [],
            "annotations": [],
            "dictionary_entries": [],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z"
        }

        # Valid semantic versions
        valid_versions = ["1.0.0", "2.1.3", "10.20.30"]
        for version in valid_versions:
            dataset = base_dataset.copy()
            dataset["version"] = version
            validate(instance=dataset, schema=schema)

        # Invalid versions
        invalid_versions = ["v1.0.0", "1.0", "1", "1.0.0.1", ""]
        for version in invalid_versions:
            dataset = base_dataset.copy()
            dataset["version"] = version
            with pytest.raises(ValidationError):
                validate(instance=dataset, schema=schema)

    def test_license_validation(self, schema):
        """Test license field validation."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "version": "1.0.0",
            "clips": [],
            "annotations": [],
            "dictionary_entries": [],
            "schema_version": "1.0",
            "created_at": "2025-09-26T10:00:00Z"
        }

        # Valid licenses (SPDX identifiers)
        valid_licenses = ["CC0-1.0", "MIT", "Apache-2.0", "GPL-3.0"]
        for license_id in valid_licenses:
            dataset = base_dataset.copy()
            dataset["license"] = license_id
            validate(instance=dataset, schema=schema)

    def test_iso_timestamp_format(self, schema):
        """Test ISO 8601 timestamp format validation."""
        base_dataset = {
            "id": "test-dataset",
            "name": "Test Dataset",
            "version": "1.0.0",
            "license": "CC0-1.0",
            "clips": [],
            "annotations": [],
            "dictionary_entries": [],
            "schema_version": "1.0"
        }

        valid_timestamps = [
            "2025-09-26T10:00:00Z",
            "2025-09-26T10:00:00+00:00",
            "2025-09-26T10:00:00.123Z"
        ]

        for timestamp in valid_timestamps:
            dataset = base_dataset.copy()
            dataset["created_at"] = timestamp
            validate(instance=dataset, schema=schema)

        # Invalid timestamp formats
        invalid_timestamps = [
            "2025-09-26",
            "10:00:00",
            "2025/09/26 10:00:00",
            "invalid-date"
        ]

        for timestamp in invalid_timestamps:
            dataset = base_dataset.copy()
            dataset["created_at"] = timestamp
            with pytest.raises(ValidationError):
                validate(instance=dataset, schema=schema)