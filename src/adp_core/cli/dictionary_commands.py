"""
Dictionary validation commands for ADP CLI.

This module provides specialized commands for validating dictionary entries,
checking hierarchical relationships, and managing dictionary operations.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Set

from ..validation import SchemaResolver
from ..models import DictionaryEntry


class DictionaryValidator:
    """Specialized validator for dictionary entries and relationships."""

    def __init__(self, schema_resolver: Optional[SchemaResolver] = None):
        """Initialize with optional schema resolver."""
        self.resolver = schema_resolver or SchemaResolver()

    def validate_dictionary_file(self, file_path: Path) -> bool:
        """Validate a single dictionary entry file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.resolver.validate(data, "dictionary")
            return True

        except Exception as e:
            print(f"Dictionary validation failed: {e}")
            return False

    def validate_hierarchy_chain(self, dictionary_dir: Path, entry_id: str) -> bool:
        """Validate complete hierarchical chain for a dictionary entry."""
        visited = set()
        current_id = entry_id

        while current_id:
            if current_id in visited:
                print(f"❌ Circular reference detected in hierarchy: {current_id}")
                return False

            visited.add(current_id)

            # Load current entry
            entry_file = self._find_dictionary_file(dictionary_dir, current_id)
            if not entry_file:
                print(f"❌ Dictionary entry not found: {current_id}")
                return False

            try:
                with open(entry_file, 'r', encoding='utf-8') as f:
                    entry_data = json.load(f)
            except Exception as e:
                print(f"❌ Failed to load {entry_file}: {e}")
                return False

            # Validate this entry
            if not self.validate_dictionary_file(entry_file):
                return False

            # Move to parent
            current_id = entry_data.get("parent_id")

        print(f"✅ Hierarchy chain validated for {entry_id}")
        return True

    def find_orphaned_entries(self, dictionary_dir: Path) -> List[str]:
        """Find dictionary entries that reference non-existent parents."""
        orphaned = []

        for dict_file in dictionary_dir.glob("*.json"):
            try:
                with open(dict_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                parent_id = data.get("parent_id")
                if parent_id:
                    parent_file = self._find_dictionary_file(dictionary_dir, parent_id)
                    if not parent_file:
                        orphaned.append(data.get("id", str(dict_file)))

            except Exception:
                continue

        return orphaned

    def validate_directory(self, dictionary_dir: Path) -> Dict[str, List[str]]:
        """Validate all dictionary entries in a directory."""
        results = {
            "valid": [],
            "invalid": [],
            "orphaned": [],
            "circular": []
        }

        if not dictionary_dir.exists():
            print(f"❌ Dictionary directory not found: {dictionary_dir}")
            return results

        # Validate individual files
        for dict_file in dictionary_dir.glob("*.json"):
            if self.validate_dictionary_file(dict_file):
                results["valid"].append(str(dict_file))
            else:
                results["invalid"].append(str(dict_file))

        # Find orphaned entries
        results["orphaned"] = self.find_orphaned_entries(dictionary_dir)

        # Check for circular references
        for dict_file in dictionary_dir.glob("*.json"):
            try:
                with open(dict_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                entry_id = data.get("id")
                if entry_id and not self._check_hierarchy_circular(dictionary_dir, entry_id):
                    results["circular"].append(entry_id)
            except Exception:
                continue

        return results

    def _find_dictionary_file(self, dictionary_dir: Path, entry_id: str) -> Optional[Path]:
        """Find dictionary file by entry ID using various naming patterns."""
        candidates = [
            dictionary_dir / f"{entry_id}.json",
            dictionary_dir / f"dictionary_{entry_id}.json",
            dictionary_dir / f"{entry_id}_dict.json"
        ]

        for candidate in candidates:
            if candidate.exists():
                return candidate

        return None

    def _check_hierarchy_circular(self, dictionary_dir: Path, entry_id: str) -> bool:
        """Check if hierarchy chain has circular references."""
        visited = set()
        current_id = entry_id

        while current_id:
            if current_id in visited:
                return False  # Circular reference found

            visited.add(current_id)

            entry_file = self._find_dictionary_file(dictionary_dir, current_id)
            if not entry_file:
                break

            try:
                with open(entry_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                current_id = data.get("parent_id")
            except Exception:
                break

        return True  # No circular reference


def validate_dictionary_command(file_path: Path, check_hierarchy: bool = False,
                              dictionary_dir: Optional[Path] = None) -> bool:
    """Command function for dictionary validation."""
    validator = DictionaryValidator()

    # Basic validation
    if not validator.validate_dictionary_file(file_path):
        return False

    # Hierarchy validation if requested
    if check_hierarchy and dictionary_dir:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            entry_id = data.get("id")
            if entry_id:
                return validator.validate_hierarchy_chain(dictionary_dir, entry_id)
        except Exception as e:
            print(f"❌ Failed to check hierarchy: {e}")
            return False

    return True


def validate_dictionary_directory_command(dictionary_dir: Path) -> bool:
    """Command function for validating entire dictionary directory."""
    validator = DictionaryValidator()
    results = validator.validate_directory(dictionary_dir)

    print(f"📊 Dictionary Validation Results:")
    print(f"  ✅ Valid entries: {len(results['valid'])}")
    print(f"  ❌ Invalid entries: {len(results['invalid'])}")
    print(f"  🔗 Orphaned entries: {len(results['orphaned'])}")
    print(f"  🔄 Circular references: {len(results['circular'])}")

    if results["invalid"]:
        print(f"\n❌ Invalid files:")
        for file_path in results["invalid"]:
            print(f"  - {file_path}")

    if results["orphaned"]:
        print(f"\n🔗 Orphaned entries:")
        for entry_id in results["orphaned"]:
            print(f"  - {entry_id}")

    if results["circular"]:
        print(f"\n🔄 Circular references:")
        for entry_id in results["circular"]:
            print(f"  - {entry_id}")

    # Return True if no critical issues
    return len(results["invalid"]) == 0 and len(results["circular"]) == 0