"""
TypeScript to Python bridge utilities for wizard-python validation integration

This module provides utilities to:
1. Generate Python models from TypeScript interface definitions
2. Validate Python data against TypeScript schemas
3. Convert between TypeScript and Python data formats
4. Bridge wizard interface with Python validation API
5. Sync validation results between TypeScript client and Python service
"""

import json
import os
import subprocess
import asyncio
import logging
from typing import Dict, Any, Optional, Union, List
from pathlib import Path
from datetime import datetime
from pydantic import BaseModel, Field, ValidationError

from .validation.models import ValidationRequest, ValidationResult, ValidationError as ValidationErrorModel
from .validation.service import ValidationService

# Configure logging
logger = logging.getLogger(__name__)


class TypeScriptBridge:
    """Bridge between TypeScript wizard interface and Python validation service."""

    def __init__(self, typescript_root: str = None):
        """Initialize with path to TypeScript definitions."""
        if typescript_root is None:
            # Default to wizard services directory
            current_dir = Path(__file__).parent
            self.typescript_root = current_dir.parent.parent / "wizard" / "src" / "services"
        else:
            self.typescript_root = Path(typescript_root)

        # Initialize validation service for bridge operations
        self.validation_service = ValidationService()

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

    async def validate_wizard_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate wizard request using Python validation service

        Args:
            request_data: Wizard validation request data

        Returns:
            Validation result in TypeScript-compatible format
        """
        try:
            # Convert wizard request to ValidationRequest
            validation_request = ValidationRequest(**request_data)

            # Perform validation using Python service
            result = await self.validation_service.validate_protocol(validation_request)

            # Convert result to TypeScript format
            return self.convert_validation_result_to_typescript(result)

        except Exception as e:
            # Return error in TypeScript format
            return {
                "is_valid": False,
                "errors": [{
                    "field_path": "$.request",
                    "message": f"Bridge validation failed: {str(e)}",
                    "error_code": "BRIDGE_ERROR",
                    "severity": "error"
                }],
                "warnings": [],
                "field_results": {},
                "processed_at": datetime.utcnow().isoformat(),
                "schema_version": "1.2.0"
            }

    def convert_validation_result_to_typescript(self, result: ValidationResult) -> Dict[str, Any]:
        """
        Convert Python ValidationResult to TypeScript-compatible format

        Args:
            result: Python ValidationResult

        Returns:
            TypeScript-compatible validation result
        """
        return {
            "is_valid": result.is_valid,
            "errors": [
                {
                    "field_path": error.field_path,
                    "message": error.message,
                    "error_code": error.error_code,
                    "severity": error.severity,
                    "suggested_fix": error.suggested_fix
                }
                for error in result.errors
            ],
            "warnings": [
                {
                    "field_path": warning.field_path,
                    "message": warning.message,
                    "warning_code": warning.warning_code
                }
                for warning in result.warnings
            ],
            "field_results": result.field_results,
            "processed_at": result.processed_at.isoformat(),
            "schema_version": result.schema_version
        }

    def convert_typescript_request_to_python(self, ts_request: Dict[str, Any]) -> ValidationRequest:
        """
        Convert TypeScript validation request to Python format

        Args:
            ts_request: TypeScript validation request

        Returns:
            Python ValidationRequest object
        """
        return ValidationRequest(
            protocol_data=ts_request.get("protocol_data", {}),
            schema_type=ts_request.get("schema_type", "core"),
            field_path=ts_request.get("field_path"),
            session_id=ts_request.get("session_id"),
            validation_mode=ts_request.get("validation_mode", "full")
        )

    async def get_schemas_for_wizard(self) -> List[Dict[str, str]]:
        """
        Get available schemas in TypeScript-compatible format

        Returns:
            List of schema information for wizard interface
        """
        try:
            schemas = await self.validation_service.get_available_schemas()
            return schemas
        except Exception as e:
            logger.error(f"Failed to get schemas for wizard: {e}")
            return []

    def generate_typescript_interfaces(self, output_path: str):
        """
        Generate TypeScript interfaces from Python validation models

        Args:
            output_path: Path to write TypeScript interface file
        """
        interface_content = '''
// Auto-generated TypeScript interfaces for wizard-python validation integration
// Based on Python validation models

export interface ValidationRequest {
  protocol_data: Record<string, any>;
  schema_type: 'core' | 'musical_analysis' | 'semantic_attributes' | 'dataset_manifest';
  field_path?: string;
  session_id: string;
  validation_mode: 'field' | 'full' | 'quick';
}

export interface ValidationError {
  field_path: string;
  message: string;
  error_code: string;
  severity: 'error' | 'warning';
  suggested_fix?: string;
}

export interface ValidationWarning {
  field_path: string;
  message: string;
  warning_code: string;
}

export interface ValidationResult {
  is_valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  field_results: Record<string, 'valid' | 'invalid' | 'pending'>;
  processed_at: string;
  schema_version: string;
}

export interface SchemaInfo {
  schema_id: string;
  version: string;
  description: string;
}

export interface SessionInfo {
  session_id: string;
  validation_rules_version: string;
  created_at: string;
}

export interface ApiError {
  error: string;
  message: string;
  correlation_id?: string;
}

// Validation client interface for wizard integration
export interface WizardValidationClient {
  validateProtocol(request: ValidationRequest): Promise<ValidationResult>;
  getAvailableSchemas(): Promise<SchemaInfo[]>;
  createSession(): Promise<SessionInfo>;
  checkServiceHealth(): Promise<boolean>;
  isServiceOnline(): boolean;
}

// Session storage interface for offline capability
export interface WizardSessionStorage {
  saveSessionData(sessionId: string, data: any): void;
  getSessionData(sessionId: string): any;
  saveProtocolData(protocolData: any): void;
  getProtocolData(): any;
  cacheValidationResult(protocolData: any, result: ValidationResult): void;
  getCachedValidationResult(protocolData: any): ValidationResult | null;
  queueOfflineValidation(requestData: any): void;
  getOfflineQueue(): any[];
  clearOfflineQueue(): void;
}
'''

        with open(output_path, 'w') as f:
            f.write(interface_content)

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


# Convenience functions for wizard-python integration
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


async def validate_wizard_protocol(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate protocol data from wizard interface using Python validation service

    Args:
        request_data: Wizard validation request data

    Returns:
        TypeScript-compatible validation result
    """
    bridge = TypeScriptBridge()
    return await bridge.validate_wizard_request(request_data)


async def get_available_schemas_for_wizard() -> List[Dict[str, str]]:
    """
    Get available schemas for wizard interface

    Returns:
        List of schema information in TypeScript format
    """
    bridge = TypeScriptBridge()
    return await bridge.get_schemas_for_wizard()


def generate_wizard_typescript_interfaces(output_path: str = None):
    """
    Generate TypeScript interfaces for wizard integration

    Args:
        output_path: Path to output file (optional)
    """
    if output_path is None:
        # Default to wizard services directory
        current_dir = Path(__file__).parent
        output_path = current_dir.parent.parent / "wizard" / "src" / "types" / "validation.ts"

    bridge = TypeScriptBridge()
    bridge.generate_typescript_interfaces(str(output_path))
    logger.info(f"Generated TypeScript interfaces at {output_path}")


class WizardPythonBridge:
    """
    Enhanced bridge specifically for wizard-python integration

    Provides high-level integration functions for the wizard interface
    to communicate with the Python validation service.
    """

    def __init__(self):
        """Initialize wizard-python bridge"""
        self.bridge = TypeScriptBridge()
        self.validation_service = ValidationService()

    async def process_wizard_validation(
        self,
        protocol_data: Dict[str, Any],
        schema_type: str,
        session_id: str,
        validation_mode: str = "full",
        field_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Process validation request from wizard interface

        Args:
            protocol_data: Protocol data to validate
            schema_type: Type of schema to validate against
            session_id: Session identifier
            validation_mode: Validation mode (field, full, quick)
            field_path: Field path for field validation

        Returns:
            TypeScript-compatible validation result
        """
        request_data = {
            "protocol_data": protocol_data,
            "schema_type": schema_type,
            "session_id": session_id,
            "validation_mode": validation_mode
        }

        if field_path:
            request_data["field_path"] = field_path

        return await self.bridge.validate_wizard_request(request_data)

    async def create_wizard_session(self) -> Dict[str, Any]:
        """
        Create validation session for wizard interface

        Returns:
            Session information in TypeScript format
        """
        try:
            session_info = await self.validation_service.create_session()
            return {
                "session_id": session_info["session_id"],
                "validation_rules_version": session_info["validation_rules_version"],
                "created_at": session_info["created_at"]
            }
        except Exception as e:
            logger.error(f"Failed to create wizard session: {e}")
            raise

    async def get_wizard_schemas(self) -> List[Dict[str, str]]:
        """
        Get available schemas for wizard interface

        Returns:
            List of schema information
        """
        return await self.bridge.get_schemas_for_wizard()

    def convert_offline_queue_to_python(self, offline_queue: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Convert TypeScript offline queue to Python format

        Args:
            offline_queue: Offline validation queue from TypeScript

        Returns:
            Python-formatted queue items
        """
        python_queue = []

        for item in offline_queue:
            try:
                # Convert request data to Python format
                python_request = self.bridge.convert_typescript_request_to_python(
                    item.get("request_data", {})
                )

                python_item = {
                    "id": item.get("id"),
                    "request_data": python_request.model_dump(),
                    "session_id": item.get("session_id"),
                    "timestamp": item.get("timestamp"),
                    "retry_count": item.get("retry_count", 0)
                }

                python_queue.append(python_item)

            except Exception as e:
                logger.error(f"Failed to convert offline queue item: {e}")
                continue

        return python_queue

    def sync_validation_cache(
        self,
        typescript_cache: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Sync validation cache between TypeScript and Python

        Args:
            typescript_cache: Cache data from TypeScript client

        Returns:
            Synchronized cache data
        """
        # This would implement cache synchronization logic
        # For now, return the input cache
        return typescript_cache


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