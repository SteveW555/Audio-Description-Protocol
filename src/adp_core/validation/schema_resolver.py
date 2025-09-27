"""Schema resolver for handling JSON Schema references."""
import json
import os
from pathlib import Path
from typing import Dict, Any
import jsonschema
from jsonschema import RefResolver, Draft7Validator, validators


class SchemaResolver:
    """Resolver for JSON Schema references in ADP schemas."""

    def __init__(self, schemas_dir: str = None):
        """Initialize the schema resolver.

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
        self.resolvers: Dict[str, RefResolver] = {}
        self._load_all_schemas()

    def _load_all_schemas(self):
        """Load all schema files from the schemas directory."""
        # First pass: load all schemas
        for schema_file in self.schemas_dir.glob("*.json"):
            schema_name = schema_file.stem
            with open(schema_file, 'r') as f:
                schema = json.load(f)
            self.schemas[schema_name] = schema

        # Second pass: create resolvers with all schemas available
        for schema_file in self.schemas_dir.glob("*.json"):
            schema_name = schema_file.stem
            schema = self.schemas[schema_name]

            # Create a resolver for this schema
            schema_uri = f"file://{schema_file.absolute()}"
            resolver = RefResolver(base_uri=schema_uri, referrer=schema)

            # Add all schemas to this resolver's store
            for other_name, other_schema in self.schemas.items():
                other_file = self.schemas_dir / f"{other_name}.json"
                other_uri = f"file://{other_file.absolute()}"
                resolver.store[other_uri] = other_schema
                # Also store with relative references
                resolver.store[f"{other_name}.json"] = other_schema
                # Store with absolute schema ID URLs from the schema itself
                if "$id" in other_schema:
                    resolver.store[other_schema["$id"]] = other_schema

            self.resolvers[schema_name] = resolver

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

    def get_resolver(self, schema_name: str) -> RefResolver:
        """Get a resolver for a specific schema.

        Args:
            schema_name: Name of the schema

        Returns:
            RefResolver configured for this schema
        """
        if schema_name not in self.resolvers:
            raise ValueError(f"Resolver for schema '{schema_name}' not found")
        return self.resolvers[schema_name]

    def validate(self, instance: Any, schema_name: str) -> None:
        """Validate an instance against a schema with reference resolution.

        Args:
            instance: The data to validate
            schema_name: Name of the schema to validate against

        Raises:
            jsonschema.ValidationError: If validation fails
            ValueError: If schema not found
        """
        schema = self.get_schema(schema_name)
        resolver = self.get_resolver(schema_name)

        # For now, remove $data references to get basic validation working
        # TODO: Implement proper $data reference handling
        clean_schema = self._remove_data_references(schema)

        validator_class = jsonschema.validators.Draft7Validator
        validator = validator_class(clean_schema, resolver=resolver)
        validator.validate(instance)

    def _remove_data_references(self, schema):
        """Remove $data references from schema for basic validation."""
        import copy
        clean_schema = copy.deepcopy(schema)

        def clean_recursive(obj):
            if isinstance(obj, dict):
                # Handle $data references by removing the constraint
                keys_to_remove = []
                for key, value in obj.items():
                    if isinstance(value, dict) and "$data" in value:
                        # Remove constraints that use $data references
                        keys_to_remove.append(key)
                    elif key in ["if", "then", "else"] and isinstance(value, dict):
                        # For conditional schemas, clean them recursively but keep structure
                        clean_recursive(value)
                    else:
                        clean_recursive(value)

                # Remove the keys after iteration to avoid dict change during iteration
                for key in keys_to_remove:
                    del obj[key]

            elif isinstance(obj, list):
                for item in obj:
                    clean_recursive(item)

        clean_recursive(clean_schema)
        return clean_schema



def validate_against_schema(instance: Any, schema_name: str, schemas_dir: str = None) -> None:
    """Convenience function to validate an instance against a schema.

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