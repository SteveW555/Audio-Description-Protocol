"""
<!--
SCHEMA RESOLVER - ADVANCED JSON SCHEMA VALIDATION ENGINE
==============================================================================
FILE PURPOSE:
    Implements advanced JSON Schema validation with Draft 2020-12 support,
    $data reference resolution, custom format validation, and schema
    inheritance. Core validation engine for the entire ADP framework.

WHAT HAPPENS HERE:
    1. Schema loading and registry creation for reference resolution
    2. Advanced $data reference validation for dynamic constraints
    3. Custom format checkers for ISO 8601 timestamps and patterns
    4. Schema inheritance resolution through allOf compositions
    5. Cross-schema validation for complex data structures
    6. Error handling and detailed validation feedback

ARCHITECTURAL ROLE:
    - Central validation engine for all ADP schemas
    - JSON Schema Draft 2020-12 implementation with extensions
    - Reference resolution for modular schema architecture
    - Format validation for domain-specific data types
    - Validation error reporting and debugging support

KEY FEATURES:
    - Automatic schema discovery and loading from directory
    - Registry-based reference resolution for schema composition
    - $data reference support for dynamic validation constraints
    - Custom ISO 8601 date-time format validation
    - Two-pass validation: basic + $data constraints
    - Detailed error messages with path information
    - Schema inheritance through allOf resolution

VALIDATION PROCESS:
    1. Load all schemas from directory into registry
    2. Create validator with reference resolution support
    3. First pass: Basic validation with $data references removed
    4. Second pass: Custom $data constraint validation
    5. Error aggregation and detailed reporting

DEPENDENCIES:
    - jsonschema: Core JSON Schema validation engine
    - referencing: Modern reference resolution for Draft 2020-12
    - pathlib: File system operations for schema loading
    - datetime: Timestamp validation and parsing
    - re: Regular expression validation for custom formats
==============================================================================
-->
"""

"""Schema resolver for handling JSON Schema references."""
import json
import copy
import logging
from pathlib import Path
from typing import Dict, Any, Set, Optional
import jsonschema
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012
import rfc3339_validator
from datetime import datetime
import re

# Configure logging for validation diagnostics
logger = logging.getLogger(__name__)


class SchemaResolver:
    """
    <!-- Advanced JSON Schema validation with reference resolution -->
    Resolver for JSON Schema references in ADP schemas.
    """

    def __init__(self, schemas_dir: Optional[str] = None):
        """
        <!-- Initializes schema registry and loads all schema files -->
        Initialize the schema resolver.

        Args:
            schemas_dir: Directory containing schema files. Defaults to schemas/ in project root.

        Raises:
            FileNotFoundError: If schemas directory cannot be found
            ValueError: If schemas_dir is invalid
        """
        # Input validation
        if schemas_dir is not None and not isinstance(schemas_dir, (str, Path)):
            raise ValueError(f"schemas_dir must be string or Path, got {type(schemas_dir)}")

        if schemas_dir is None:
            # Find the project root (where schemas/ directory is located)
            current_dir = Path(__file__).parent
            max_depth = 10  # Prevent infinite traversal
            depth = 0

            while current_dir.parent != current_dir and depth < max_depth:
                schemas_path = current_dir / "schemas"
                if schemas_path.exists() and schemas_path.is_dir():
                    # Check if directory contains JSON files
                    if list(schemas_path.glob("*.json")):
                        schemas_dir = str(schemas_path)
                        logger.info(f"Found schemas directory at: {schemas_path}")
                        break
                current_dir = current_dir.parent
                depth += 1

            if schemas_dir is None:
                raise FileNotFoundError(
                    "Could not find schemas directory. Please specify schemas_dir parameter."
                )

        self.schemas_dir = Path(schemas_dir)

        # Validate schemas directory exists and is accessible
        if not self.schemas_dir.exists():
            raise FileNotFoundError(f"Schemas directory does not exist: {self.schemas_dir}")
        if not self.schemas_dir.is_dir():
            raise ValueError(f"Schemas path is not a directory: {self.schemas_dir}")

        self.schemas: Dict[str, Dict[str, Any]] = {}
        self.registry: Optional[Registry] = None
        self._schema_cache: Dict[str, Dict[str, Any]] = {}  # Cache for cleaned schemas
        self._reference_stack: Set[str] = set()  # Track circular references

        try:
            self._load_all_schemas()
        except Exception as e:
            logger.error(f"Failed to load schemas from {self.schemas_dir}: {e}")
            raise

    def _load_all_schemas(self):
        """
        <!-- Discovers and loads all JSON schema files into registry -->
        Load all schema files from the schemas directory.

        Raises:
            FileNotFoundError: If schema file cannot be read
            json.JSONDecodeError: If schema file contains invalid JSON
            PermissionError: If insufficient permissions to read files
        """
        schema_files = list(self.schemas_dir.glob("*.json"))
        if not schema_files:
            logger.warning(f"No JSON schema files found in {self.schemas_dir}")
            return

        # Load all schemas with comprehensive error handling
        for schema_file in schema_files:
            schema_name = schema_file.stem
            try:
                with open(schema_file, 'r', encoding='utf-8') as f:
                    schema = json.load(f)

                # Validate schema structure
                if not isinstance(schema, dict):
                    raise ValueError(f"Schema must be a JSON object, got {type(schema)}")

                self.schemas[schema_name] = schema
                logger.debug(f"Loaded schema: {schema_name}")

            except FileNotFoundError:
                logger.error(f"Schema file not found: {schema_file}")
                raise
            except PermissionError:
                logger.error(f"Permission denied reading schema file: {schema_file}")
                raise
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON in schema file {schema_file}: {e}")
                raise ValueError(f"Invalid JSON in schema file {schema_file}: {e}")
            except Exception as e:
                logger.error(f"Unexpected error loading schema {schema_file}: {e}")
                raise

        logger.info(f"Loaded {len(self.schemas)} schemas from {self.schemas_dir}")

        # Create registry with all schemas
        resources = []
        for schema_name, schema in self.schemas.items():
            # Create URI for this schema
            schema_file = self.schemas_dir / f"{schema_name}.json"
            schema_uri = f"file://{schema_file.absolute()}"

            # Create resource and add to registry
            resource = Resource.from_contents(schema, default_specification=DRAFT202012)
            resources.append((schema_uri, resource))

            # Also register with relative name and $id if present
            if "$id" in schema:
                resources.append((schema["$id"], resource))
            resources.append((f"{schema_name}.json", resource))

        self.registry = Registry().with_resources(resources)

    def _create_format_checker(self) -> jsonschema.FormatChecker:
        """Create a format checker with robust date-time support."""
        format_checker = jsonschema.FormatChecker()

        # Add robust date-time format checker using rfc3339_validator
        @format_checker.checks('date-time', raises=ValueError)
        def is_date_time(instance):
            """Check if instance is a valid ISO 8601 date-time using RFC 3339 validator."""
            if not isinstance(instance, str):
                return True  # Let type validation handle this

            try:
                # Use rfc3339_validator for robust ISO 8601/RFC 3339 validation
                rfc3339_validator.validate_rfc3339(instance)
                return True
            except ValueError as e:
                # Re-raise with more context
                raise ValueError(f"'{instance}' is not a valid RFC 3339 date-time: {e}")

        # Add additional format checkers for common patterns
        @format_checker.checks('uri', raises=ValueError)
        def is_uri(instance):
            """Check if instance is a valid URI."""
            if not isinstance(instance, str):
                return True

            # Basic URI pattern validation
            uri_pattern = r'^[a-zA-Z][a-zA-Z0-9+.-]*:'
            if not re.match(uri_pattern, instance):
                raise ValueError(f"'{instance}' is not a valid URI")
            return True

        return format_checker

    def get_schema(self, schema_name: str) -> Dict[str, Any]:
        """Get a schema by name with comprehensive validation.

        Args:
            schema_name: Name of the schema (without .json extension)

        Returns:
            The loaded schema

        Raises:
            ValueError: If schema_name is invalid or schema not found
            TypeError: If schema_name is not a string
        """
        # Input validation
        if not isinstance(schema_name, str):
            raise TypeError(f"schema_name must be a string, got {type(schema_name)}")

        if not schema_name.strip():
            raise ValueError("schema_name cannot be empty or whitespace")

        # Normalize schema name (remove .json extension if present)
        normalized_name = schema_name.replace('.json', '')

        if normalized_name not in self.schemas:
            available_schemas = list(self.schemas.keys())
            raise ValueError(
                f"Schema '{normalized_name}' not found. "
                f"Available schemas: {available_schemas}"
            )

        return self.schemas[normalized_name]

    def get_registry(self) -> Registry:
        """Get the registry containing all schemas.

        Returns:
            Registry configured with all schemas
        """
        return self.registry

    def validate(self, instance: Any, schema_name: str) -> None:
        """
        <!-- Two-pass validation: basic + $data constraint validation -->
        Validate an instance against a schema with reference resolution.

        Args:
            instance: The data to validate
            schema_name: Name of the schema to validate against

        Raises:
            jsonschema.ValidationError: If validation fails
            ValueError: If schema not found or validation error
            TypeError: If schema_name is not a string
        """
        # Input validation
        if not isinstance(schema_name, str):
            raise TypeError(f"schema_name must be a string, got {type(schema_name)}")

        if instance is None:
            raise ValueError("instance cannot be None")

        try:
            schema = self.get_schema(schema_name)
            logger.debug(f"Validating instance against schema: {schema_name}")

            # First run basic validation with $data references removed
            clean_schema = self._remove_data_references(schema)

            # Create custom format checker with date-time support
            format_checker = self._create_format_checker()

            # Use Draft202012Validator to match the schema specification
            validator = jsonschema.Draft202012Validator(
                clean_schema,
                registry=self.registry,
                format_checker=format_checker
            )

            # Validate with detailed error reporting
            errors = list(validator.iter_errors(instance))
            if errors:
                # Log validation errors for debugging
                logger.warning(f"Validation failed for schema {schema_name}: {len(errors)} errors")
                for error in errors[:5]:  # Log first 5 errors
                    logger.debug(f"Validation error: {error.message} at {error.absolute_path}")

                # Raise the first error (jsonschema behavior)
                raise errors[0]

            # Then run custom validation for $data constraints
            self._validate_data_references(instance, schema)

            logger.debug(f"Validation successful for schema: {schema_name}")

        except jsonschema.ValidationError:
            # Re-raise validation errors as-is
            raise
        except Exception as e:
            # Wrap other exceptions with context
            logger.error(f"Validation error for schema {schema_name}: {e}")
            raise ValueError(f"Validation failed for schema '{schema_name}': {e}") from e

    def _remove_data_references(self, schema: Dict[str, Any]) -> Dict[str, Any]:
        """
        Remove $data references from schema for basic validation with caching and circular reference detection.

        Args:
            schema: Schema to clean

        Returns:
            Cleaned schema without $data references

        Raises:
            ValueError: If circular reference detected
        """
        # Generate cache key from schema structure
        schema_id = schema.get('$id', id(schema))
        cache_key = f"clean_{schema_id}"

        # Check cache first
        if cache_key in self._schema_cache:
            logger.debug(f"Using cached cleaned schema for {schema_id}")
            return self._schema_cache[cache_key]

        # Reset reference stack for this operation
        self._reference_stack.clear()

        try:
            clean_schema = copy.deepcopy(schema)
            self._clean_recursive(clean_schema, set())

            # Cache the result
            self._schema_cache[cache_key] = clean_schema
            logger.debug(f"Cached cleaned schema for {schema_id}")

            return clean_schema
        except RecursionError:
            raise ValueError("Maximum recursion depth exceeded - possible circular reference")

    def _clean_recursive(self, obj: Any, visited_refs: Set[str]) -> None:
        """
        Recursively clean schema with circular reference detection.

        Args:
            obj: Schema object to clean
            visited_refs: Set of visited references to detect cycles

        Raises:
            ValueError: If circular reference detected
        """
        if isinstance(obj, dict):
            # Handle allOf references - resolve them first with cycle detection
            if "allOf" in obj:
                resolved_allof = []
                for subschema in obj["allOf"]:
                    if "$ref" in subschema:
                        # Resolve the reference with circular detection
                        ref = subschema["$ref"]
                        if ref in visited_refs:
                            logger.warning(f"Circular reference detected: {ref}")
                            raise ValueError(f"Circular reference detected: {ref}")

                        if ref.endswith(".json"):
                            ref_schema_name = ref.replace(".json", "")
                            if ref_schema_name in self.schemas:
                                # Add to visited refs before recursion
                                new_visited = visited_refs | {ref}
                                resolved_schema = copy.deepcopy(self.schemas[ref_schema_name])
                                self._clean_recursive(resolved_schema, new_visited)
                                resolved_allof.append(resolved_schema)
                            else:
                                logger.warning(f"Referenced schema not found: {ref_schema_name}")
                                resolved_allof.append(subschema)
                        else:
                            resolved_allof.append(subschema)
                    else:
                        self._clean_recursive(subschema, visited_refs)
                        resolved_allof.append(subschema)
                obj["allOf"] = resolved_allof

            # Remove $data references and clean nested objects
            keys_to_remove = []
            for key, value in obj.items():
                if isinstance(value, dict):
                    # If the value contains a $data reference, remove this constraint entirely
                    if "$data" in value:
                        keys_to_remove.append(key)
                        logger.debug(f"Removing $data reference in key: {key}")
                    else:
                        # Recursively clean nested objects
                        self._clean_recursive(value, visited_refs)
                elif isinstance(value, list):
                    # Clean lists recursively
                    self._clean_recursive(value, visited_refs)

            # Remove the keys that contained $data references
            for key in keys_to_remove:
                del obj[key]

        elif isinstance(obj, list):
            for item in obj:
                self._clean_recursive(item, visited_refs)

    def _validate_data_references(self, instance: Any, schema: Dict[str, Any]) -> None:
        """Validate $data reference constraints."""
        def validate_recursive(data, schema_part, path=""):
            if isinstance(schema_part, dict):
                # Handle allOf constructs (composition/inheritance)
                if "allOf" in schema_part:
                    for subschema in schema_part["allOf"]:
                        if "$ref" in subschema:
                            # Resolve the reference
                            ref = subschema["$ref"]
                            if ref.endswith(".json"):
                                ref_schema_name = ref.replace(".json", "")
                                if ref_schema_name in self.schemas:
                                    resolved_schema = self.schemas[ref_schema_name]
                                    validate_recursive(data, resolved_schema, path)
                        else:
                            validate_recursive(data, subschema, path)

                # Handle time_range validation specifically
                if "if" in schema_part and "then" in schema_part:
                    # Check if condition is met
                    if_condition = schema_part["if"]
                    if self._check_condition(data, if_condition):
                        # Apply then constraint
                        then_constraint = schema_part["then"]
                        self._apply_data_constraints(data, then_constraint, path)

                # Handle properties
                if "properties" in schema_part and isinstance(data, dict):
                    for prop_name, prop_schema in schema_part["properties"].items():
                        if prop_name in data:
                            validate_recursive(data[prop_name], prop_schema, f"{path}/{prop_name}")

                # Handle other schema constructs recursively
                for key, value in schema_part.items():
                    if key in ["properties", "items", "additionalProperties", "allOf"]:
                        continue  # Already handled
                    if isinstance(value, dict):
                        validate_recursive(data, value, path)
                    elif isinstance(value, list):
                        for item in value:
                            if isinstance(item, dict):
                                validate_recursive(data, item, path)

            elif isinstance(schema_part, list):
                for item in schema_part:
                    if isinstance(item, dict):
                        validate_recursive(data, item, path)

        validate_recursive(instance, schema)

    def _check_condition(self, data: Any, condition: Dict[str, Any]) -> bool:
        """Check if a condition is met."""
        if "properties" in condition:
            if not isinstance(data, dict):
                return False
            # Check if all required properties exist
            for prop_name, prop_constraint in condition["properties"].items():
                if prop_name not in data:
                    return False
                # For true constraints, just check existence
                if prop_constraint is True:
                    continue
        return True

    def _apply_data_constraints(self, data: Any, constraint: Dict[str, Any], path: str) -> None:
        """Apply constraints that use $data references."""
        if "properties" in constraint:
            for prop_name, prop_constraint in constraint["properties"].items():
                if prop_name in data and isinstance(prop_constraint, dict):
                    prop_value = data[prop_name]

                    # Handle exclusiveMinimum with $data reference
                    if "exclusiveMinimum" in prop_constraint:
                        min_constraint = prop_constraint["exclusiveMinimum"]
                        if isinstance(min_constraint, dict) and "$data" in min_constraint:
                            # Parse $data reference like "1/start_sec"
                            data_ref = min_constraint["$data"]
                            min_value = self._resolve_data_reference(data, data_ref, path)
                            if min_value is not None and prop_value <= min_value:
                                raise jsonschema.ValidationError(
                                    f"{prop_value} is not greater than {min_value}",
                                    path=[prop_name]
                                )

    def _resolve_data_reference(self, data: Any, data_ref: str, current_path: str) -> Any:
        """Resolve a $data reference to get the actual value."""
        # Handle references like "1/start_sec" which means go up 1 level and get start_sec
        parts = data_ref.split("/")
        if len(parts) >= 2 and parts[0].isdigit():
            levels_up = int(parts[0])
            field_name = parts[1]

            # For level 1, we want the parent object
            if levels_up == 1 and isinstance(data, dict) and field_name in data:
                return data[field_name]

        return None


    def clear_cache(self) -> None:
        """Clear the schema cache to free memory."""
        cache_size = len(self._schema_cache)
        self._schema_cache.clear()
        logger.info(f"Cleared schema cache ({cache_size} entries)")

    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics for monitoring."""
        return {
            'cache_size': len(self._schema_cache),
            'schemas_loaded': len(self.schemas),
            'cache_keys': list(self._schema_cache.keys())
        }


def validate_against_schema(instance: Any, schema_name: str, schemas_dir: Optional[str] = None) -> None:
    """
    <!-- Convenience function for one-off schema validation -->
    Convenience function to validate an instance against a schema.

    Args:
        instance: The data to validate
        schema_name: Name of the schema to validate against
        schemas_dir: Directory containing schema files

    Raises:
        jsonschema.ValidationError: If validation fails
        ValueError: If schema not found or invalid input
        TypeError: If arguments have wrong types
    """
    # Input validation
    if not isinstance(schema_name, str):
        raise TypeError(f"schema_name must be a string, got {type(schema_name)}")

    if schemas_dir is not None and not isinstance(schemas_dir, (str, Path)):
        raise TypeError(f"schemas_dir must be string or Path, got {type(schemas_dir)}")

    try:
        resolver = SchemaResolver(schemas_dir)
        resolver.validate(instance, schema_name)
    except Exception as e:
        logger.error(f"Validation failed in convenience function: {e}")
        raise