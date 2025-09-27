#!/usr/bin/env python3
"""
Main CLI entry point for ADP (Audio Description Protocol) Framework.

This module provides command-line interface for validating JSON files against
ADP schemas, creating new entries, and managing datasets.
"""

import argparse
import json
import sys
from pathlib import Path
from typing import Optional

from ..validation import SchemaResolver, validate_against_schema
from ..models import DictionaryEntry, Annotation, Dataset, ModelOutput, MusicalAnnotation


class ADPCLIError(Exception):
    """Custom exception for CLI errors."""
    pass


def setup_argument_parser() -> argparse.ArgumentParser:
    """Set up the main argument parser with subcommands."""
    parser = argparse.ArgumentParser(
        prog="adp",
        description="Audio Description Protocol (ADP) Framework CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Validate command
    validate_parser = subparsers.add_parser(
        "validate",
        help="Validate JSON files against ADP schemas"
    )
    validate_parser.add_argument(
        "schema_type",
        choices=["dictionary", "annotation", "musical-annotation", "dataset", "model-output"],
        help="Type of schema to validate against"
    )
    validate_parser.add_argument(
        "file_path",
        type=Path,
        help="Path to JSON file to validate"
    )
    validate_parser.add_argument(
        "--strict",
        action="store_true",
        help="Enable strict validation mode"
    )

    # Validate references command
    validate_refs_parser = subparsers.add_parser(
        "validate-references",
        help="Validate dictionary references in annotations"
    )
    validate_refs_parser.add_argument(
        "annotation_file",
        type=Path,
        help="Path to annotation JSON file"
    )
    validate_refs_parser.add_argument(
        "--dictionary-dir",
        type=Path,
        default=Path("./dictionary/"),
        help="Directory containing dictionary entry files"
    )

    # Validate hierarchy command
    validate_hierarchy_parser = subparsers.add_parser(
        "validate-hierarchy",
        help="Validate hierarchical relationships in dictionary entries"
    )
    validate_hierarchy_parser.add_argument(
        "dictionary_file",
        type=Path,
        help="Path to dictionary entry JSON file"
    )
    validate_hierarchy_parser.add_argument(
        "--parent",
        type=Path,
        help="Path to parent dictionary entry file"
    )

    # Create dictionary command
    create_dict_parser = subparsers.add_parser(
        "create",
        help="Create new ADP entries"
    )
    create_dict_subparsers = create_dict_parser.add_subparsers(dest="create_type")

    dict_parser = create_dict_subparsers.add_parser("dictionary")
    dict_parser.add_argument("id", help="Dictionary entry ID")
    dict_parser.add_argument("definition", help="Definition text")
    dict_parser.add_argument("--label", help="Human-readable label")
    dict_parser.add_argument("--parent", help="Parent entry ID")
    dict_parser.add_argument("--output", type=Path, help="Output file path")

    # Version command
    version_parser = subparsers.add_parser("version", help="Show version information")

    return parser


def load_json_file(file_path: Path) -> dict:
    """Load and parse a JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise ADPCLIError(f"File not found: {file_path}")
    except json.JSONDecodeError as e:
        raise ADPCLIError(f"Invalid JSON in {file_path}: {e}")


def validate_file(schema_type: str, file_path: Path, strict: bool = False) -> bool:
    """Validate a JSON file against the specified schema."""
    # Load the JSON data
    data = load_json_file(file_path)

    # Map CLI schema types to schema file names (with .schema suffix)
    schema_mapping = {
        "dictionary": "dictionary.schema",
        "annotation": "annotation.schema",
        "musical-annotation": "musical_annotation.schema",
        "dataset": "dataset.schema",
        "model-output": "model_output.schema"
    }

    schema_name = schema_mapping[schema_type]

    try:
        # Initialize schema resolver and validate
        resolver = SchemaResolver()

        # Try to get the schema by name first
        schema = resolver.get_schema(schema_name)
        if schema is None:
            # If not found, the schema might not be loaded - check available schemas
            available = list(resolver.get_registry().keys())
            print(f"Available schemas: {available}")
            raise ValueError(f"Schema '{schema_name}' not found. Available: {[k for k in available]}")

        resolver.validate(data, schema_name)

        print(f"✅ VALID: {file_path} passes {schema_type} schema validation")
        return True

    except Exception as e:
        print(f"❌ INVALID: {file_path} failed {schema_type} schema validation")
        print(f"Error: {e}")
        return False


def validate_references(annotation_file: Path, dictionary_dir: Path) -> bool:
    """Validate that annotation references point to existing dictionary entries."""
    annotation_data = load_json_file(annotation_file)

    # Extract entry_ids from labels
    if "labels" not in annotation_data:
        print("❌ No labels found in annotation")
        return False

    missing_refs = []
    for label in annotation_data["labels"]:
        if "entry_id" not in label:
            continue

        entry_id = label["entry_id"]
        # Look for dictionary file with this ID
        dict_file = dictionary_dir / f"{entry_id}.json"

        if not dict_file.exists():
            # Try alternative naming patterns
            dict_file = dictionary_dir / f"dictionary_{entry_id}.json"

        if not dict_file.exists():
            missing_refs.append(entry_id)

    if missing_refs:
        print(f"❌ Missing dictionary references: {', '.join(missing_refs)}")
        return False
    else:
        print("✅ All dictionary references found")
        return True


def validate_hierarchy(dictionary_file: Path, parent_file: Optional[Path] = None) -> bool:
    """Validate hierarchical relationships in dictionary entries."""
    dict_data = load_json_file(dictionary_file)

    if "parent_id" not in dict_data:
        print("✅ No parent relationship to validate")
        return True

    parent_id = dict_data["parent_id"]

    if parent_file:
        parent_data = load_json_file(parent_file)
        if parent_data.get("id") == parent_id:
            print("✅ Parent-child relationship validated")
            return True
        else:
            print(f"❌ Parent file ID {parent_data.get('id')} doesn't match expected {parent_id}")
            return False
    else:
        print(f"⚠️  Parent ID {parent_id} specified but no parent file provided")
        return False


def create_dictionary_entry(entry_id: str, definition: str, label: Optional[str] = None,
                          parent: Optional[str] = None, output: Optional[Path] = None) -> bool:
    """Create a new dictionary entry JSON file."""
    import datetime

    # Use label if provided, otherwise derive from ID
    if not label:
        label = entry_id.replace("-", " ")

    entry_data = {
        "id": entry_id,
        "label": label,
        "definition": definition,
        "schema_version": "1.0",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    if parent:
        entry_data["parent_id"] = parent

    # Validate the created entry
    try:
        resolver = SchemaResolver()
        resolver.validate(entry_data, "dictionary.schema")
    except Exception as e:
        print(f"❌ Created entry failed validation: {e}")
        return False

    # Determine output path
    if not output:
        output = Path(f"{entry_id}.json")

    # Write the file
    try:
        with open(output, 'w', encoding='utf-8') as f:
            json.dump(entry_data, f, indent=2, ensure_ascii=False)
        print(f"✅ Created dictionary entry: {output}")
        return True
    except Exception as e:
        print(f"❌ Failed to write file: {e}")
        return False


def main() -> int:
    """Main CLI entry point."""
    parser = setup_argument_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    try:
        if args.command == "validate":
            success = validate_file(args.schema_type, args.file_path, args.strict)
            return 0 if success else 1

        elif args.command == "validate-references":
            success = validate_references(args.annotation_file, args.dictionary_dir)
            return 0 if success else 1

        elif args.command == "validate-hierarchy":
            success = validate_hierarchy(args.dictionary_file, args.parent)
            return 0 if success else 1

        elif args.command == "create":
            if args.create_type == "dictionary":
                success = create_dictionary_entry(
                    args.id, args.definition, args.label, args.parent, args.output
                )
                return 0 if success else 1
            else:
                print(f"❌ Unknown create type: {args.create_type}")
                return 1

        elif args.command == "version":
            print("ADP Framework CLI v1.0.0")
            return 0

        else:
            print(f"❌ Unknown command: {args.command}")
            return 1

    except ADPCLIError as e:
        print(f"❌ {e}")
        return 1
    except KeyboardInterrupt:
        print("\n❌ Interrupted by user")
        return 1
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())