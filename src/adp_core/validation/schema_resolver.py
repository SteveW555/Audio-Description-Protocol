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
from pathlib import Path
from typing import Dict, Any
import jsonschema
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012
import rfc3339_validator
from datetime import datetime
import re


class SchemaResolver:
    """
    <!-- Advanced JSON Schema validation with reference resolution -->
    Resolver for JSON Schema references in ADP schemas.
    """

    def __init__(self, schemas_dir: str = None):
        """
        <!-- Initializes schema registry and loads all schema files -->
        Initialize the schema resolver.

        Args:
            schemas_dir: Directory containing schema files. Defaults to schemas/ in project root.
        """
        if schemas_dir is None:
            # Find the project root (where schemas/ directory is located)
            current_dir = Path(__file__).parent
            while current_dir.parent != current_dir:
                schemas_path = current_dir / "schemas"
                if schemas_path.exists() and list(schemas_path.glob("*.json")):
                    schemas_dir = str(schemas_path)
                    break
                current_dir = current_dir.parent

            if schemas_dir is None:
                raise FileNotFoundError("Could not find schemas directory")

        self.schemas_dir = Path(schemas_dir)
        self.schemas: Dict[str, Dict[str, Any]] = {}
        self.registry: Registry = None
        self._load_all_schemas()

    def _load_all_schemas(self):
        """
        <!-- Discovers and loads all JSON schema files into registry -->
        Load all schema files from the schemas directory.
        """
        # Load all schemas
        for schema_file in self.schemas_dir.glob("*.json"):
            schema_name = schema_file.stem
            with open(schema_file, 'r') as f:
                schema = json.load(f)
            self.schemas[schema_name] = schema

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
        """Create a format checker with date-time support."""
        format_checker = jsonschema.FormatChecker()

        # Add date-time format checker that raises ValidationError
        @format_checker.checks('date-time', raises=ValueError)
        def is_date_time(instance):
            """Check if instance is a valid ISO 8601 date-time."""
            if not isinstance(instance, str):
                return True  # Let type validation handle this

            # Check for basic ISO 8601 date-time format
            iso_pattern = r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$'
            if not re.match(iso_pattern, instance):
                raise ValueError(f"'{instance}' is not a valid date-time format")

            # Try to parse the datetime
            try:
                # Handle different timezone formats
                if instance.endswith('Z'):
                    datetime.fromisoformat(instance.replace('Z', '+00:00'))
                else:
                    datetime.fromisoformat(instance)
            except ValueError as e:
                raise ValueError(f"'{instance}' is not a valid date-time: {e}")

            return True

        return format_checker

    def get_schema(self, schema_name: str) -> Dict[str, Any]:
        """Get a schema by name.

        Args:
            schema_name: Name of the schema (without .json extension)

        Returns:
            The loaded schema
        """
        if schema_name not in self.schemas:
            raise ValueError(f"Schema '{schema_name}' not found")
        return self.schemas[schema_name]

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
            ValueError: If schema not found
        """
        schema = self.get_schema(schema_name)

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
        validator.validate(instance)

        # Then run custom validation for $data constraints
        self._validate_data_references(instance, schema)

    def _remove_data_references(self, schema):
        """Remove $data references from schema for basic validation."""
        import copy
        clean_schema = copy.deepcopy(schema)

        def clean_recursive(obj):
            if isinstance(obj, dict):
                # Handle allOf references - resolve them first
                if "allOf" in obj:
                    resolved_allof = []
                    for subschema in obj["allOf"]:
                        if "$ref" in subschema:
                            # Resolve the reference
                            ref = subschema["$ref"]
                            if ref.endswith(".json"):
                                ref_schema_name = ref.replace(".json", "")
                                if ref_schema_name in self.schemas:
                                    resolved_schema = copy.deepcopy(self.schemas[ref_schema_name])
                                    clean_recursive(resolved_schema)
                                    resolved_allof.append(resolved_schema)
                                else:
                                    resolved_allof.append(subschema)
                            else:
                                resolved_allof.append(subschema)
                        else:
                            clean_recursive(subschema)
                            resolved_allof.append(subschema)
                    obj["allOf"] = resolved_allof

                keys_to_remove = []
                for key, value in obj.items():
                    if isinstance(value, dict):
                        # If the value contains a $data reference, remove this constraint entirely
                        if "$data" in value:
                            keys_to_remove.append(key)
                        else:
                            # Recursively clean nested objects
                            clean_recursive(value)
                    elif isinstance(value, list):
                        # Clean lists recursively
                        clean_recursive(value)

                # Remove the keys that contained $data references
                for key in keys_to_remove:
                    del obj[key]

            elif isinstance(obj, list):
                for item in obj:
                    clean_recursive(item)

        clean_recursive(clean_schema)
        return clean_schema

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


def validate_against_schema(instance: Any, schema_name: str, schemas_dir: str = None) -> None:
    """
    <!-- Convenience function for one-off schema validation -->
    Convenience function to validate an instance against a schema.

    Args:
        instance: The data to validate
        schema_name: Name of the schema to validate against
        schemas_dir: Directory containing schema files

    Raises:
        jsonschema.ValidationError: If validation fails
        ValueError: If schema not found
    """
    resolver = SchemaResolver(schemas_dir)
    resolver.validate(instance, schema_name)