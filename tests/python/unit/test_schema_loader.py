"""
Unit tests for schema loading

Tests schema loading, caching, validation, and error handling
following the clarified requirements for ADP schema support.
"""

import pytest
import json
import tempfile
import os
from pathlib import Path
from unittest.mock import Mock, patch, mock_open
from typing import Dict, Any

from src.adp_core.validation.schema_loader import SchemaLoader, SchemaCache


class TestSchemaCache:
    """Test SchemaCache functionality"""

    @pytest.fixture
    def schema_cache(self):
        """Create SchemaCache instance for testing"""
        return SchemaCache()

    @pytest.fixture
    def sample_schema(self):
        """Sample schema for testing"""
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "core-schema-v1.2.0",
            "type": "object",
            "properties": {
                "title": {"type": "string", "minLength": 1, "maxLength": 200},
                "duration": {"type": "number", "minimum": 0}
            },
            "required": ["title"]
        }

    def test_cache_schema(self, schema_cache, sample_schema):
        """Test caching a schema"""
        schema_cache.cache_schema("core", "1.2.0", sample_schema)

        cached_schema = schema_cache.get_schema("core", "1.2.0")
        assert cached_schema == sample_schema

    def test_cache_miss(self, schema_cache):
        """Test cache miss for non-existent schema"""
        cached_schema = schema_cache.get_schema("nonexistent", "1.0.0")
        assert cached_schema is None

    def test_cache_version_specificity(self, schema_cache, sample_schema):
        """Test that cache is version-specific"""
        schema_cache.cache_schema("core", "1.2.0", sample_schema)

        # Different version should be cache miss
        cached_schema = schema_cache.get_schema("core", "1.3.0")
        assert cached_schema is None

        # Same version should be cache hit
        cached_schema = schema_cache.get_schema("core", "1.2.0")
        assert cached_schema == sample_schema

    def test_cache_schema_type_specificity(self, schema_cache, sample_schema):
        """Test that cache is schema-type specific"""
        schema_cache.cache_schema("core", "1.2.0", sample_schema)

        # Different schema type should be cache miss
        cached_schema = schema_cache.get_schema("musical_analysis", "1.2.0")
        assert cached_schema is None

        # Same schema type should be cache hit
        cached_schema = schema_cache.get_schema("core", "1.2.0")
        assert cached_schema == sample_schema

    def test_cache_clear(self, schema_cache, sample_schema):
        """Test clearing the cache"""
        schema_cache.cache_schema("core", "1.2.0", sample_schema)
        schema_cache.cache_schema("musical_analysis", "1.2.0", sample_schema)

        assert schema_cache.get_cache_size() == 2

        schema_cache.clear_cache()

        assert schema_cache.get_cache_size() == 0
        assert schema_cache.get_schema("core", "1.2.0") is None

    def test_cache_size_tracking(self, schema_cache, sample_schema):
        """Test cache size tracking"""
        assert schema_cache.get_cache_size() == 0

        schema_cache.cache_schema("core", "1.2.0", sample_schema)
        assert schema_cache.get_cache_size() == 1

        schema_cache.cache_schema("musical_analysis", "1.2.0", sample_schema)
        assert schema_cache.get_cache_size() == 2

    def test_cache_statistics(self, schema_cache, sample_schema):
        """Test cache hit/miss statistics"""
        # Initial stats
        stats = schema_cache.get_cache_stats()
        assert stats["hits"] == 0
        assert stats["misses"] == 0
        assert stats["hit_rate"] == 0

        # Cache miss
        schema_cache.get_schema("core", "1.2.0")
        stats = schema_cache.get_cache_stats()
        assert stats["misses"] == 1

        # Cache schema
        schema_cache.cache_schema("core", "1.2.0", sample_schema)

        # Cache hit
        schema_cache.get_schema("core", "1.2.0")
        stats = schema_cache.get_cache_stats()
        assert stats["hits"] == 1
        assert stats["hit_rate"] == 0.5  # 1 hit out of 2 total requests


class TestSchemaLoader:
    """Test SchemaLoader functionality"""

    @pytest.fixture
    def schema_loader(self):
        """Create SchemaLoader instance for testing"""
        return SchemaLoader()

    @pytest.fixture
    def sample_core_schema(self):
        """Sample core schema for testing"""
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "core-schema-v1.2.0",
            "title": "Audio Description Protocol Core Schema",
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 200,
                    "description": "Title of the audio content"
                },
                "description": {
                    "type": "string",
                    "maxLength": 1000,
                    "description": "Description of the audio content"
                },
                "duration": {
                    "type": "number",
                    "minimum": 0,
                    "description": "Duration in seconds"
                },
                "language": {
                    "type": "string",
                    "pattern": "^[a-z]{2}-[A-Z]{2}$",
                    "description": "Language code (e.g., en-US)"
                }
            },
            "required": ["title"],
            "additionalProperties": False
        }

    @pytest.fixture
    def sample_musical_analysis_schema(self):
        """Sample musical analysis schema for testing"""
        return {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "musical-analysis-schema-v1.2.0",
            "title": "Audio Description Protocol Musical Analysis Schema",
            "type": "object",
            "properties": {
                "title": {"type": "string", "minLength": 1},
                "tempo": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 300,
                    "description": "Tempo in BPM"
                },
                "key": {
                    "type": "string",
                    "enum": ["C_major", "C_minor", "D_major", "D_minor"],
                    "description": "Musical key"
                },
                "time_signature": {
                    "type": "string",
                    "pattern": "^\\d+/\\d+$",
                    "description": "Time signature (e.g., 4/4)"
                }
            },
            "required": ["title", "tempo"]
        }

    @pytest.fixture
    def temp_schema_dir(self, sample_core_schema, sample_musical_analysis_schema):
        """Create temporary directory with test schemas"""
        with tempfile.TemporaryDirectory() as temp_dir:
            schemas_dir = Path(temp_dir) / "schemas"
            schemas_dir.mkdir()

            # Write core schema
            core_file = schemas_dir / "core.json"
            with open(core_file, 'w') as f:
                json.dump(sample_core_schema, f)

            # Write musical analysis schema
            musical_file = schemas_dir / "musical_analysis.json"
            with open(musical_file, 'w') as f:
                json.dump(sample_musical_analysis_schema, f)

            yield str(schemas_dir)

    def test_load_schema_from_file(self, schema_loader, temp_schema_dir, sample_core_schema):
        """Test loading schema from file"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            schema = schema_loader.get_schema("core")

        assert schema == sample_core_schema

    def test_load_schema_with_caching(self, schema_loader, temp_schema_dir, sample_core_schema):
        """Test schema loading with caching"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            # First load - should read from file
            schema1 = schema_loader.get_schema("core")

            # Second load - should come from cache
            schema2 = schema_loader.get_schema("core")

        assert schema1 == sample_core_schema
        assert schema2 == sample_core_schema
        assert schema1 is schema2  # Should be same object from cache

    def test_load_nonexistent_schema(self, schema_loader, temp_schema_dir):
        """Test loading non-existent schema"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            schema = schema_loader.get_schema("nonexistent")

        assert schema is None

    def test_load_invalid_json_schema(self, schema_loader):
        """Test loading invalid JSON schema file"""
        invalid_json = "{ invalid json content"

        with patch.object(schema_loader, 'schema_base_path', "/fake/path"):
            with patch("builtins.open", mock_open(read_data=invalid_json)):
                with patch("os.path.exists", return_value=True):
                    schema = schema_loader.get_schema("invalid")

        assert schema is None

    def test_load_schema_file_not_found(self, schema_loader):
        """Test loading schema when file doesn't exist"""
        with patch.object(schema_loader, 'schema_base_path', "/nonexistent/path"):
            schema = schema_loader.get_schema("core")

        assert schema is None

    def test_get_available_schemas(self, schema_loader, temp_schema_dir):
        """Test getting list of available schemas"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            schemas = schema_loader.get_available_schemas()

        assert len(schemas) == 2

        schema_ids = [s["schema_id"] for s in schemas]
        assert "core" in schema_ids
        assert "musical_analysis" in schema_ids

        # Check schema info structure
        core_schema_info = next(s for s in schemas if s["schema_id"] == "core")
        assert core_schema_info["version"] == "1.2.0"
        assert "description" in core_schema_info

    def test_get_available_schemas_empty_directory(self, schema_loader):
        """Test getting available schemas from empty directory"""
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch.object(schema_loader, 'schema_base_path', temp_dir):
                schemas = schema_loader.get_available_schemas()

        assert schemas == []

    def test_get_available_schemas_no_directory(self, schema_loader):
        """Test getting available schemas when directory doesn't exist"""
        with patch.object(schema_loader, 'schema_base_path', "/nonexistent/path"):
            schemas = schema_loader.get_available_schemas()

        assert schemas == []

    def test_validate_schema_structure(self, schema_loader, sample_core_schema):
        """Test schema structure validation"""
        # Valid schema
        assert schema_loader._validate_schema_structure(sample_core_schema) is True

        # Invalid schema - missing required fields
        invalid_schema = {"type": "object"}
        assert schema_loader._validate_schema_structure(invalid_schema) is False

        # Invalid schema - not a dict
        assert schema_loader._validate_schema_structure("not a dict") is False

    def test_extract_schema_info(self, schema_loader, sample_core_schema):
        """Test extracting schema information"""
        schema_info = schema_loader._extract_schema_info("core", sample_core_schema)

        assert schema_info["schema_id"] == "core"
        assert schema_info["version"] == "1.2.0"
        assert schema_info["description"] == "Audio Description Protocol Core Schema"

    def test_extract_schema_info_missing_metadata(self, schema_loader):
        """Test extracting schema info with missing metadata"""
        minimal_schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "type": "object"
        }

        schema_info = schema_loader._extract_schema_info("test", minimal_schema)

        assert schema_info["schema_id"] == "test"
        assert schema_info["version"] == "unknown"
        assert schema_info["description"] == "No description available"

    def test_cache_integration(self, schema_loader, temp_schema_dir, sample_core_schema):
        """Test integration with schema cache"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            # Load schema multiple times
            schema1 = schema_loader.get_schema("core")
            schema2 = schema_loader.get_schema("core")
            schema3 = schema_loader.get_schema("core")

        # All should be the same cached object
        assert schema1 == sample_core_schema
        assert schema1 is schema2 is schema3

        # Check cache stats
        cache_stats = schema_loader.cache.get_cache_stats()
        assert cache_stats["hits"] == 2  # Second and third access
        assert cache_stats["misses"] == 1  # First access

    def test_concurrent_schema_loading(self, schema_loader, temp_schema_dir):
        """Test concurrent schema loading"""
        import threading
        import queue

        results_queue = queue.Queue()

        def load_schema(schema_type):
            with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
                schema = schema_loader.get_schema(schema_type)
                results_queue.put((schema_type, schema is not None))

        # Launch concurrent loads
        threads = []
        schema_types = ["core", "musical_analysis"] * 5  # Load each schema 5 times

        for schema_type in schema_types:
            thread = threading.Thread(target=load_schema, args=(schema_type,))
            threads.append(thread)
            thread.start()

        # Wait for all threads
        for thread in threads:
            thread.join()

        # Check results
        results = {}
        while not results_queue.empty():
            schema_type, loaded = results_queue.get()
            if schema_type not in results:
                results[schema_type] = []
            results[schema_type].append(loaded)

        # All loads should be successful
        assert all(all(loads) for loads in results.values())
        assert len(results["core"]) == 5
        assert len(results["musical_analysis"]) == 5

    def test_schema_version_extraction(self, schema_loader):
        """Test extracting version from schema ID"""
        assert schema_loader._extract_version_from_id("core-schema-v1.2.0") == "1.2.0"
        assert schema_loader._extract_version_from_id("musical-v2.1.3") == "2.1.3"
        assert schema_loader._extract_version_from_id("no-version-schema") == "unknown"
        assert schema_loader._extract_version_from_id("") == "unknown"

    def test_schema_file_path_generation(self, schema_loader):
        """Test generating schema file paths"""
        with patch.object(schema_loader, 'schema_base_path', "/schemas"):
            path = schema_loader._get_schema_file_path("core")
            assert path == "/schemas/core.json"

            path = schema_loader._get_schema_file_path("musical_analysis")
            assert path == "/schemas/musical_analysis.json"

    def test_error_handling_file_permission(self, schema_loader, temp_schema_dir):
        """Test error handling for file permission issues"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            with patch("builtins.open", side_effect=PermissionError("Permission denied")):
                schema = schema_loader.get_schema("core")

        assert schema is None

    def test_error_handling_io_error(self, schema_loader, temp_schema_dir):
        """Test error handling for I/O errors"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            with patch("builtins.open", side_effect=IOError("I/O error")):
                schema = schema_loader.get_schema("core")

        assert schema is None

    def test_schema_reload_after_cache_clear(self, schema_loader, temp_schema_dir, sample_core_schema):
        """Test schema reloading after cache clear"""
        with patch.object(schema_loader, 'schema_base_path', temp_schema_dir):
            # Load and cache schema
            schema1 = schema_loader.get_schema("core")
            assert schema1 == sample_core_schema

            # Clear cache
            schema_loader.cache.clear_cache()

            # Load again - should read from file again
            schema2 = schema_loader.get_schema("core")
            assert schema2 == sample_core_schema


class TestSchemaLoaderIntegration:
    """Test SchemaLoader integration scenarios"""

    @pytest.fixture
    def schema_loader(self):
        """Create SchemaLoader instance for integration testing"""
        return SchemaLoader()

    def test_full_schema_workflow(self, schema_loader):
        """Test complete schema loading workflow"""
        # Test with real-world schema structure
        schema_data = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "semantic-attributes-schema-v1.2.0",
            "title": "Audio Description Protocol Semantic Attributes Schema",
            "type": "object",
            "properties": {
                "title": {"type": "string", "minLength": 1},
                "genre": {
                    "type": "string",
                    "enum": ["classical", "jazz", "rock", "electronic", "folk"]
                },
                "mood": {
                    "type": "string",
                    "enum": ["happy", "sad", "energetic", "calm", "dramatic"]
                },
                "tags": {
                    "type": "array",
                    "items": {"type": "string"},
                    "uniqueItems": True
                }
            },
            "required": ["title"]
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            # Write schema file
            schema_file = Path(temp_dir) / "semantic_attributes.json"
            with open(schema_file, 'w') as f:
                json.dump(schema_data, f)

            with patch.object(schema_loader, 'schema_base_path', temp_dir):
                # Test getting available schemas
                available = schema_loader.get_available_schemas()
                assert len(available) == 1
                assert available[0]["schema_id"] == "semantic_attributes"

                # Test loading specific schema
                schema = schema_loader.get_schema("semantic_attributes")
                assert schema == schema_data

                # Test cache performance
                schema_cached = schema_loader.get_schema("semantic_attributes")
                assert schema is schema_cached

    def test_multiple_schema_versions(self, schema_loader):
        """Test handling multiple schema versions"""
        v1_schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "core-schema-v1.0.0",
            "title": "Core Schema v1.0.0",
            "type": "object",
            "properties": {"title": {"type": "string"}}
        }

        v2_schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "core-schema-v2.0.0",
            "title": "Core Schema v2.0.0",
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "version": {"type": "string"}
            }
        }

        with tempfile.TemporaryDirectory() as temp_dir:
            # Write schema files (only one can be named core.json for this test)
            core_file = Path(temp_dir) / "core.json"
            with open(core_file, 'w') as f:
                json.dump(v2_schema, f)  # Use latest version

            with patch.object(schema_loader, 'schema_base_path', temp_dir):
                schema = schema_loader.get_schema("core")
                assert schema["$id"] == "core-schema-v2.0.0"
                assert "version" in schema["properties"]

    def test_schema_validation_edge_cases(self, schema_loader):
        """Test schema validation edge cases"""
        # Empty schema file
        empty_schema = {}

        # Schema without required metadata
        minimal_schema = {"type": "object"}

        # Schema with extra metadata
        detailed_schema = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "detailed-schema-v1.2.0",
            "title": "Detailed Schema",
            "description": "A detailed schema for testing",
            "version": "1.2.0",
            "author": "Test Author",
            "type": "object",
            "properties": {"test": {"type": "string"}}
        }

        # Test validation
        assert not schema_loader._validate_schema_structure(empty_schema)
        assert schema_loader._validate_schema_structure(minimal_schema)
        assert schema_loader._validate_schema_structure(detailed_schema)

        # Test info extraction
        info = schema_loader._extract_schema_info("detailed", detailed_schema)
        assert info["schema_id"] == "detailed"
        assert info["version"] == "1.2.0"
        assert info["description"] == "A detailed schema for testing"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])