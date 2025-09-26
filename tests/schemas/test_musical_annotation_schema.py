"""Test musical annotation schema validation."""

import json
import pytest
from pathlib import Path
from jsonschema import validate, ValidationError


class TestMusicalAnnotationSchemaValidation:
    """Test musical annotation schema validation."""

    @pytest.fixture
    def schema_path(self):
        """Path to musical annotation schema file."""
        return Path("schemas/musical_annotation.schema.json")

    @pytest.fixture
    def schema(self, schema_path):
        """Load musical annotation schema."""
        with open(schema_path) as f:
            return json.load(f)

    @pytest.fixture
    def valid_musical_annotation(self):
        """Valid musical annotation for testing."""
        return {
            "id": "musical-annotation-001",
            "clip_id": "sample-audio-001",
            "time_range": {
                "start_sec": 0.0,
                "end_sec": 30.0
            },
            "provenance": {
                "annotator_type": "ai",
                "annotator_id": "music-analyzer-v2.1",
                "timestamp": "2025-09-26T10:45:00Z"
            },
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "theory": {
                    "bpm": 126.0,
                    "key": "F#",
                    "scale": "minor",
                    "key_confidence": 0.83,
                    "chords": [
                        {
                            "time": 0.0,
                            "chord": "F#:min",
                            "confidence": 0.61
                        },
                        {
                            "time": 1.0,
                            "chord": "D:maj",
                            "confidence": 0.55
                        }
                    ],
                    "roman_numerals": ["i", "VI"]
                },
                "semantic_description": {
                    "attributes": {
                        "mood": ["energetic", "upbeat"],
                        "energy": ["driving", "high-energy"],
                        "texture": ["bright", "polished"]
                    },
                    "genre": {
                        "primary": "electronic",
                        "secondary": ["edm", "dance"],
                        "subgenres": []
                    },
                    "instrumentation": [
                        {
                            "instrument": "synthesizer",
                            "role": "lead",
                            "descriptors": ["bright", "melodic", "soaring"]
                        },
                        {
                            "instrument": "kick_drum",
                            "role": "percussion",
                            "descriptors": ["punchy", "heavy"]
                        }
                    ],
                    "vocals": {
                        "presence": "none"
                    }
                }
            },
            "labels": [
                {
                    "entry_id": "electronic",
                    "confidence": 0.95
                }
            ]
        }

    def test_schema_file_exists(self, schema_path):
        """Test that musical annotation schema file exists."""
        assert schema_path.exists(), f"Schema file not found: {schema_path}"

    def test_schema_is_valid_json(self, schema_path):
        """Test that schema file contains valid JSON."""
        with open(schema_path) as f:
            json.load(f)  # Should not raise exception

    def test_valid_musical_annotation_passes(self, schema, valid_musical_annotation):
        """Test that valid musical annotation passes validation."""
        validate(instance=valid_musical_annotation, schema=schema)

    def test_required_fields_validation(self, schema):
        """Test that required fields are enforced."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0"
            }
        }

        # Should validate successfully
        validate(instance=base_annotation, schema=schema)

        # Test core annotation required fields
        core_required = ["id", "clip_id", "time_range", "provenance", "schema_version", "musical_analysis"]

        for field in core_required:
            invalid_annotation = base_annotation.copy()
            del invalid_annotation[field]

            with pytest.raises(ValidationError, match=f"'{field}' is a required property"):
                validate(instance=invalid_annotation, schema=schema)

    def test_musical_analysis_protocol_version_required(self, schema):
        """Test that musical_analysis.protocol_version is required."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {}
        }

        with pytest.raises(ValidationError, match="'protocol_version' is a required property"):
            validate(instance=base_annotation, schema=schema)

    def test_bpm_range_validation(self, schema):
        """Test BPM range validation (40-300)."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "theory": {}
            }
        }

        # Valid BPMs
        valid_bpms = [40, 60, 120, 180, 300]
        for bpm in valid_bpms:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["bpm"] = bpm
            validate(instance=annotation, schema=schema)

        # Invalid BPMs (outside range)
        invalid_bpms = [39, 301, 0, -10, 500]
        for bpm in invalid_bpms:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["bpm"] = bpm
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_key_pattern_validation(self, schema):
        """Test musical key pattern validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "theory": {}
            }
        }

        # Valid keys
        valid_keys = ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"]
        for key in valid_keys:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["key"] = key
            validate(instance=annotation, schema=schema)

        # Invalid keys
        invalid_keys = ["H", "c", "C##", "Cbb", "1", ""]
        for key in invalid_keys:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["key"] = key
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_scale_enum_validation(self, schema):
        """Test scale enum validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "theory": {}
            }
        }

        # Valid scales
        valid_scales = ["major", "minor", "dorian", "mixolydian", "lydian", "phrygian", "locrian", "chromatic", "pentatonic"]
        for scale in valid_scales:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["scale"] = scale
            validate(instance=annotation, schema=schema)

        # Invalid scales
        invalid_scales = ["Major", "MINOR", "blues", "jazz", ""]
        for scale in invalid_scales:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["scale"] = scale
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_chord_symbol_pattern_validation(self, schema):
        """Test chord symbol pattern validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "theory": {
                    "chords": []
                }
            }
        }

        # Valid chord symbols
        valid_chords = [
            {"time": 0.0, "chord": "C:maj", "confidence": 0.8},
            {"time": 1.0, "chord": "F#:min", "confidence": 0.7},
            {"time": 2.0, "chord": "Bb:7", "confidence": 0.9},
            {"time": 3.0, "chord": "A:maj7", "confidence": 0.6},
        ]

        for chord_data in valid_chords:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["chords"] = [chord_data]
            validate(instance=annotation, schema=schema)

        # Invalid chord symbols
        invalid_chords = [
            {"time": 0.0, "chord": "Cmaj", "confidence": 0.8},  # Missing colon
            {"time": 1.0, "chord": "C:Major", "confidence": 0.7},  # Invalid quality
            {"time": 2.0, "chord": "H:min", "confidence": 0.9},   # Invalid root
        ]

        for chord_data in invalid_chords:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["chords"] = [chord_data]
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_roman_numeral_pattern_validation(self, schema):
        """Test roman numeral pattern validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "theory": {}
            }
        }

        # Valid roman numerals
        valid_numerals = [
            ["I", "IV", "V", "I"],
            ["i", "iv", "V", "i"],
            ["ii°", "V7", "I"],
            ["I", "vi", "ii", "V"]
        ]

        for numerals in valid_numerals:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["roman_numerals"] = numerals
            validate(instance=annotation, schema=schema)

        # Invalid roman numerals
        invalid_numerals = [
            ["1", "4", "5", "1"],  # Numbers instead of numerals
            ["IX", "X"],           # Invalid numerals for music theory
            ["i7°+"]               # Invalid combination
        ]

        for numerals in invalid_numerals:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["theory"]["roman_numerals"] = numerals
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_mood_enum_validation(self, schema):
        """Test mood enum validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "semantic_description": {
                    "attributes": {}
                }
            }
        }

        # Valid moods
        valid_moods = [
            ["energetic", "upbeat"],
            ["calm", "peaceful"],
            ["dark", "intense"],
            ["melancholic", "nostalgic"]
        ]

        for mood_list in valid_moods:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["semantic_description"]["attributes"]["mood"] = mood_list
            validate(instance=annotation, schema=schema)

        # Invalid moods
        invalid_moods = [
            ["happy"],     # Not in controlled vocabulary
            ["Energetic"], # Wrong case
            ["sad"]        # Not in controlled vocabulary
        ]

        for mood_list in invalid_moods:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["semantic_description"]["attributes"]["mood"] = mood_list
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_instrumentation_validation(self, schema):
        """Test instrumentation validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "semantic_description": {}
            }
        }

        # Valid instrumentation
        valid_instruments = [
            [{"instrument": "piano", "role": "lead"}],
            [{"instrument": "guitar", "role": "rhythm", "descriptors": ["acoustic", "fingerpicked"]}],
            [{"instrument": "drums", "role": "percussion", "descriptors": ["tight", "punchy"]}]
        ]

        for instruments in valid_instruments:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["semantic_description"]["instrumentation"] = instruments
            validate(instance=annotation, schema=schema)

        # Invalid instrumentation (missing required fields)
        invalid_instruments = [
            [{"instrument": "piano"}],  # Missing role
            [{"role": "lead"}],         # Missing instrument
            [{"instrument": "guitar", "role": "invalid-role"}]  # Invalid role
        ]

        for instruments in invalid_instruments:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["semantic_description"]["instrumentation"] = instruments
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_vocals_validation(self, schema):
        """Test vocals validation."""
        base_annotation = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0",
                "semantic_description": {}
            }
        }

        # Valid vocal presence values
        valid_vocals = [
            {"presence": "none"},
            {"presence": "lead", "gender": "female", "style": "pop"},
            {"presence": "backing", "gender": "mixed"},
            {"presence": "choir"}
        ]

        for vocals in valid_vocals:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["semantic_description"]["vocals"] = vocals
            validate(instance=annotation, schema=schema)

        # Invalid vocals (missing required presence)
        invalid_vocals = [
            {},  # Missing presence
            {"gender": "male"},  # Missing presence
            {"presence": "invalid"}  # Invalid presence value
        ]

        for vocals in invalid_vocals:
            annotation = base_annotation.copy()
            annotation["musical_analysis"]["semantic_description"]["vocals"] = vocals
            with pytest.raises(ValidationError):
                validate(instance=annotation, schema=schema)

    def test_backward_compatibility_labels(self, schema):
        """Test backward compatibility with traditional labels."""
        # Musical annotation with traditional labels (should work)
        annotation_with_labels = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0"
            },
            "labels": [
                {"entry_id": "electronic", "confidence": 0.9}
            ]
        }
        validate(instance=annotation_with_labels, schema=schema)

        # Musical annotation without labels (should also work)
        annotation_without_labels = {
            "id": "test-001",
            "clip_id": "test-clip",
            "time_range": {"start_sec": 0.0, "end_sec": 1.0},
            "provenance": {"annotator_type": "ai", "timestamp": "2025-09-26T10:30:00Z"},
            "schema_version": "1.0",
            "musical_analysis": {
                "protocol_version": "1.0"
            }
        }
        validate(instance=annotation_without_labels, schema=schema)