"""
<!--
ADP VALIDATION MODULE INITIALIZATION
==============================================================================
FILE PURPOSE:
    Validation utilities package initialization for ADP schema validation.
    Provides JSON Schema-based validation infrastructure with advanced features
    including $data references, format checking, and schema inheritance.

WHAT HAPPENS HERE:
    1. Imports core validation classes and utility functions
    2. Exposes the main validation API for schema-based data validation
    3. Sets up the public interface for JSON Schema Draft 2020-12 validation
    4. Manages validation framework dependencies and configuration

ARCHITECTURAL ROLE:
    - Entry point for all ADP schema validation functionality
    - JSON Schema Draft 2020-12 implementation with ADP extensions
    - Reference resolution for complex schema compositions
    - Format validation for timestamps, patterns, and custom formats

VALIDATION FEATURES:
    - SchemaResolver: Advanced JSON Schema reference resolution
    - $data reference support for dynamic validation constraints
    - Format checkers for ISO 8601 timestamps and custom patterns
    - Schema inheritance through allOf compositions
    - Cross-schema validation for dataset manifests
    - Error reporting with detailed validation feedback

DEPENDENCIES:
    - jsonschema: Core JSON Schema validation engine
    - referencing: Modern reference resolution for Draft 2020-12
    - pathlib: File system operations for schema loading
    - datetime: Timestamp validation and parsing
==============================================================================
-->
"""

"""Validation utilities for ADP schemas."""
from .schema_resolver import SchemaResolver, validate_against_schema

__all__ = ["SchemaResolver", "validate_against_schema"]