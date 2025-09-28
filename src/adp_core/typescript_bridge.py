"""
TypeScript to Python bridge utilities for maintaining TypeScript as source of truth.

This module provides utilities to:
1. Generate Python models from TypeScript interface definitions
2. Validate Python data against TypeScript schemas
3. Convert between TypeScript and Python data formats
"""

import json
import os
import subprocess
from typing import Dict, Any, Optional, Union, List
from pathlib import Path
from pydantic import BaseModel, Field, ValidationError


class TypeScriptBridge:
    """Bridge between TypeScript protocol definitions and Python validation."""

    def __init__(self, typescript_root: str = None):
        """Initialize with path to TypeScript definitions."""
        if typescript_root is None:
            # Default to wizard structures directory
            current_dir = Path(__file__).parent
            self.typescript_root = current_dir.parent.parent / "wizard" / "wizard_structures"
        else:
            self.typescript_root = Path(typescript_root)

    def load_protocol_schema(self) -> Dict[str, Any]:
        """
        Load TypeScript protocol definitions and convert to JSON schema.

        This would require TypeScript compilation or a TypeScript parser.
        For now, returns a manual mapping of the key interfaces.
        """
        # Manual schema mapping based on protocol.ts
        # In production, this would use typescript-json-schema or similar
        return {
            "AudioMetadata": {
                "type": "object",
                "properties": {
                    "format": {"type": "string", "enum": ["wav", "mp3", "flac", "ogg", "m4a"]},
                    "duration_sec": {"type": "number", "minimum": 0},
                    "sample_rate": {"type": "integer", "minimum": 8000},
                    "channels": {"type": "integer", "minimum": 1},
                    "bit_depth": {"type": "integer", "enum": [16, 24, 32]},
                    "checksum": {"type": "string", "pattern": "^[a-z0-9]+:[a-fA-F0-9]+$"}
                },
                "additionalProperties": False
            },
            "AudioFeatures": {
                "type": "object",
                "properties": {
                    "sample_rate": {"type": "integer", "minimum": 8000},
                    "window_size_sec": {"type": "number", "minimum": 0},
                    "hop_length_sec": {"type": "number", "minimum": 0},
                    "features": {"type": "array", "items": {"type": "string"}}
                },
                "additionalProperties": False
            },
            "SpectralFeatures": {
                "type": "object",
                "properties": {
                    "mfcc": {"type": "array", "items": {"type": "number"}},
                    "spectral_centroid": {"type": "array", "items": {"type": "number"}},
                    "spectral_bandwidth": {"type": "array", "items": {"type": "number"}},
                    "spectral_rolloff": {"type": "array", "items": {"type": "number"}},
                    "zero_crossing_rate": {"type": "array", "items": {"type": "number"}},
                    "chroma": {"type": "array", "items": {"type": "number"}},
                    "tonnetz": {"type": "array", "items": {"type": "number"}},
                    "spectral_contrast": {"type": "array", "items": {"type": "number"}}
                },
                "additionalProperties": False
            },
            "InferenceMetadata": {
                "type": "object",
                "properties": {
                    "model_name": {"type": "string"},
                    "model_version": {"type": "string"},
                    "inference_time_ms": {"type": "number", "minimum": 0},
                    "hardware_context": {
                        "type": "string",
                        "enum": ["CPU", "GPU", "TPU", "CUDA", "Metal", "OpenCL"]
                    },
                    "parameters": {"type": "object"},
                    "preprocessing": {"$ref": "#/definitions/AudioFeatures"}
                },
                "required": ["model_name", "model_version"],
                "additionalProperties": False
            },
            "MusicalAnalysis": {
                "type": "object",
                "properties": {
                    "tempo": {"type": "number", "minimum": 0},
                    "tempo_confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "key_signature": {"type": "string"},
                    "key_confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "time_signature": {"type": "string"},
                    "time_signature_confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "genre": {"type": "string"},
                    "genre_confidence": {"type": "number", "minimum": 0, "maximum": 1},
                    "energy": {"type": "number", "minimum": 0, "maximum": 1},
                    "valence": {"type": "number", "minimum": 0, "maximum": 1},
                    "danceability": {"type": "number", "minimum": 0, "maximum": 1},
                    "instrumentalness": {"type": "number", "minimum": 0, "maximum": 1},
                    "acousticness": {"type": "number", "minimum": 0, "maximum": 1},
                    "loudness": {"type": "number"},
                    "speechiness": {"type": "number", "minimum": 0, "maximum": 1}
                },
                "additionalProperties": False
            }
        }

    def validate_audio_metadata(self, data: Dict[str, Any]) -> bool:
        """Validate audio metadata against TypeScript schema."""
        try:
            schema = self.load_protocol_schema()["AudioMetadata"]
            # Basic validation - in production would use jsonschema
            return self._validate_against_schema(data, schema)
        except Exception:
            return False

    def validate_musical_analysis(self, data: Dict[str, Any]) -> bool:
        """Validate musical analysis data against TypeScript schema."""
        try:
            schema = self.load_protocol_schema()["MusicalAnalysis"]
            return self._validate_against_schema(data, schema)
        except Exception:
            return False

    def _validate_against_schema(self, data: Dict[str, Any], schema: Dict[str, Any]) -> bool:
        """Basic schema validation helper."""
        # Simplified validation - in production would use jsonschema library
        if schema.get("type") == "object":
            properties = schema.get("properties", {})
            for key, value in data.items():
                if key in properties:
                    prop_schema = properties[key]
                    if not self._validate_value(value, prop_schema):
                        return False
            return True
        return False

    def _validate_value(self, value: Any, schema: Dict[str, Any]) -> bool:
        """Validate individual value against schema."""
        value_type = schema.get("type")

        if value_type == "string" and not isinstance(value, str):
            return False
        elif value_type == "number" and not isinstance(value, (int, float)):
            return False
        elif value_type == "integer" and not isinstance(value, int):
            return False
        elif value_type == "array" and not isinstance(value, list):
            return False
        elif value_type == "object" and not isinstance(value, dict):
            return False

        # Check constraints
        if "minimum" in schema and value < schema["minimum"]:
            return False
        if "maximum" in schema and value > schema["maximum"]:
            return False
        if "enum" in schema and value not in schema["enum"]:
            return False

        return True

    def convert_python_to_typescript_format(self, python_data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert Python model data to TypeScript-compatible format."""
        # Handle datetime objects, convert to ISO strings
        converted = {}
        for key, value in python_data.items():
            if hasattr(value, 'isoformat'):  # datetime object
                converted[key] = value.isoformat()
            elif isinstance(value, dict):
                converted[key] = self.convert_python_to_typescript_format(value)
            elif isinstance(value, list):
                converted[key] = [
                    self.convert_python_to_typescript_format(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                converted[key] = value
        return converted

    def generate_typescript_schema_file(self, output_path: str):
        """Generate a TypeScript schema validation file."""
        schema_content = '''
// Auto-generated TypeScript schema validation
// Based on protocol.ts definitions

export function validateAudioMetadata(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    if (data.format && !['wav', 'mp3', 'flac', 'ogg', 'm4a'].includes(data.format)) {
        return false;
    }

    if (data.duration_sec !== undefined && (typeof data.duration_sec !== 'number' || data.duration_sec < 0)) {
        return false;
    }

    if (data.sample_rate !== undefined && (typeof data.sample_rate !== 'number' || data.sample_rate < 8000)) {
        return false;
    }

    if (data.channels !== undefined && (typeof data.channels !== 'number' || data.channels < 1)) {
        return false;
    }

    if (data.bit_depth !== undefined && ![16, 24, 32].includes(data.bit_depth)) {
        return false;
    }

    return true;
}

export function validateMusicalAnalysis(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    const numberFields = ['tempo', 'energy', 'valence', 'danceability', 'instrumentalness', 'acousticness', 'speechiness'];
    const confidenceFields = ['tempo_confidence', 'key_confidence', 'time_signature_confidence', 'genre_confidence'];

    for (const field of numberFields) {
        if (data[field] !== undefined && typeof data[field] !== 'number') {
            return false;
        }
    }

    for (const field of confidenceFields) {
        if (data[field] !== undefined && (typeof data[field] !== 'number' || data[field] < 0 || data[field] > 1)) {
            return false;
        }
    }

    return true;
}
'''

        with open(output_path, 'w') as f:
            f.write(schema_content)


# Convenience functions for common operations
def validate_audio_metadata(data: Dict[str, Any]) -> bool:
    """Validate audio metadata using TypeScript schema."""
    bridge = TypeScriptBridge()
    return bridge.validate_audio_metadata(data)


def validate_musical_analysis(data: Dict[str, Any]) -> bool:
    """Validate musical analysis using TypeScript schema."""
    bridge = TypeScriptBridge()
    return bridge.validate_musical_analysis(data)


def convert_to_typescript_format(data: Dict[str, Any]) -> Dict[str, Any]:
    """Convert Python data to TypeScript-compatible format."""
    bridge = TypeScriptBridge()
    return bridge.convert_python_to_typescript_format(data)


# Example usage and migration helpers
class LegacyPythonModelConverter:
    """Helper to convert legacy Python models to TypeScript format."""

    @staticmethod
    def convert_audio_clip(audio_clip) -> Dict[str, Any]:
        """Convert AudioClip model to TypeScript AudioMetadata format."""
        return {
            "format": getattr(audio_clip, 'format', None),
            "duration_sec": getattr(audio_clip, 'duration_sec', None),
            "sample_rate": getattr(audio_clip, 'sample_rate', None),
            "channels": getattr(audio_clip, 'channels', None),
            "bit_depth": getattr(audio_clip, 'bit_depth', None),
            "checksum": getattr(audio_clip, 'checksum', None)
        }

    @staticmethod
    def convert_musical_annotation(musical_annotation) -> Dict[str, Any]:
        """Convert MusicalAnnotation model to TypeScript format."""
        analysis = getattr(musical_annotation, 'musical_analysis', None)
        if not analysis:
            return {}

        return {
            "tempo": getattr(analysis, 'tempo', None),
            "tempo_confidence": getattr(analysis, 'tempo_confidence', None),
            "key_signature": getattr(analysis, 'key_signature', None),
            "key_confidence": getattr(analysis, 'key_confidence', None),
            "time_signature": getattr(analysis, 'time_signature', None),
            "time_signature_confidence": getattr(analysis, 'time_signature_confidence', None),
            "genre": getattr(analysis, 'genre', None),
            "genre_confidence": getattr(analysis, 'genre_confidence', None),
            "energy": getattr(analysis, 'energy', None),
            "valence": getattr(analysis, 'valence', None),
            "danceability": getattr(analysis, 'danceability', None),
            "instrumentalness": getattr(analysis, 'instrumentalness', None),
            "acousticness": getattr(analysis, 'acousticness', None),
            "loudness": getattr(analysis, 'loudness', None),
            "speechiness": getattr(analysis, 'speechiness', None)
        }