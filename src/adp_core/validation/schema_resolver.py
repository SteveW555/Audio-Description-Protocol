"""Schema resolver for handling JSON Schema references."""
import json
from pathlib import Path
from typing import Dict, Any
import jsonschema
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT7


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
        self.registry: Registry = None
        self._load_all_schemas()

    def _load_all_schemas(self):
        """Load all schema files from the schemas directory."""
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
            resource = Resource.from_contents(schema, default_specification=DRAFT7)
            resources.append((schema_uri, resource))

            # Also register with relative name and $id if present
            if "$id" in schema:
                resources.append((schema["$id"], resource))
            resources.append((f"{schema_name}.json", resource))

        self.registry = Registry().with_resources(resources)

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
        """Validate an instance against a schema with reference resolution.

        Args:
            instance: The data to validate
            schema_name: Name of the schema to validate against

        Raises:
            jsonschema.ValidationError: If validation fails
            ValueError: If schema not found
        """
        schema = self.get_schema(schema_name)

        # For now, remove $data references to get basic validation working
        # TODO: Implement proper $data reference handling
        clean_schema = self._remove_data_references(schema)

        # Create validator with registry for reference resolution
        validator = jsonschema.Draft7Validator(clean_schema, registry=self.registry)
        validator.validate(instance)

    def _remove_data_references(self, schema):
        """Remove $data references from schema for basic validation."""
        import copy
        clean_schema = copy.deepcopy(schema)

        def clean_recursive(obj):
            if isinstance(obj, dict):
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