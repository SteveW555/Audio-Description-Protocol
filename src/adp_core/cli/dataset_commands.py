"""
Dataset validation commands for ADP CLI.

This module provides specialized commands for validating dataset manifests,
checking file references, and verifying dataset integrity.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import urlparse

from ..validation import SchemaResolver
from ..models import Dataset


class DatasetValidator:
    """Specialized validator for dataset manifests and file references."""

    def __init__(self, schema_resolver: Optional[SchemaResolver] = None):
        """Initialize with optional schema resolver."""
        self.resolver = schema_resolver or SchemaResolver()

    def validate_dataset_file(self, file_path: Path) -> bool:
        """Validate a single dataset manifest file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.resolver.validate(data, "dataset")
            return True

        except Exception as e:
            print(f"Dataset validation failed: {e}")
            return False

    def validate_clip_references(self, dataset_data: dict, base_path: Optional[Path] = None) -> Dict[str, List[str]]:
        """Validate that all clip references point to existing files or valid URLs."""
        results = {
            "valid_files": [],
            "valid_urls": [],
            "missing_files": [],
            "invalid_urls": [],
            "errors": []
        }

        clips = dataset_data.get("clips", [])
        for clip in clips:
            clip_id = clip.get("id", "unknown")
            uri = clip.get("uri")

            if not uri:
                results["errors"].append(f"Clip {clip_id}: missing URI")
                continue

            # Check if it's a URL
            parsed = urlparse(uri)
            if parsed.scheme in ["http", "https"]:
                # URL validation - basic check
                if self._is_valid_url(uri):
                    results["valid_urls"].append(f"{clip_id}: {uri}")
                else:
                    results["invalid_urls"].append(f"{clip_id}: {uri}")
            else:
                # File path validation
                file_path = Path(uri)
                if not file_path.is_absolute() and base_path:
                    file_path = base_path / file_path

                if file_path.exists():
                    results["valid_files"].append(f"{clip_id}: {file_path}")
                else:
                    results["missing_files"].append(f"{clip_id}: {file_path}")

        return results

    def validate_annotation_references(self, dataset_data: dict, base_path: Optional[Path] = None) -> Dict[str, List[str]]:
        """Validate that all annotation file references exist."""
        results = {
            "valid": [],
            "missing": [],
            "invalid_json": []
        }

        annotations = dataset_data.get("annotations", [])
        for annotation in annotations:
            ann_id = annotation.get("id", "unknown")
            file_path = annotation.get("file_path")

            if not file_path:
                results["missing"].append(f"Annotation {ann_id}: missing file_path")
                continue

            # Resolve relative paths
            path = Path(file_path)
            if not path.is_absolute() and base_path:
                path = base_path / path

            if not path.exists():
                results["missing"].append(f"Annotation {ann_id}: {path}")
                continue

            # Check if it's valid JSON
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    json.load(f)
                results["valid"].append(f"Annotation {ann_id}: {path}")
            except Exception as e:
                results["invalid_json"].append(f"Annotation {ann_id}: {path} - {e}")

        return results

    def validate_dictionary_references(self, dataset_data: dict, base_path: Optional[Path] = None) -> Dict[str, List[str]]:
        """Validate that all dictionary file references exist."""
        results = {
            "valid": [],
            "missing": [],
            "invalid_json": []
        }

        dictionary_entries = dataset_data.get("dictionary_entries", [])
        for entry in dictionary_entries:
            entry_id = entry.get("id", "unknown")
            file_path = entry.get("file_path")

            if not file_path:
                results["missing"].append(f"Dictionary {entry_id}: missing file_path")
                continue

            # Resolve relative paths
            path = Path(file_path)
            if not path.is_absolute() and base_path:
                path = base_path / path

            if not path.exists():
                results["missing"].append(f"Dictionary {entry_id}: {path}")
                continue

            # Check if it's valid JSON
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    json.load(f)
                results["valid"].append(f"Dictionary {entry_id}: {path}")
            except Exception as e:
                results["invalid_json"].append(f"Dictionary {entry_id}: {path} - {e}")

        return results

    def validate_id_uniqueness(self, dataset_data: dict) -> Dict[str, List[str]]:
        """Validate that all IDs within the dataset are unique."""
        results = {
            "duplicate_clips": [],
            "duplicate_annotations": [],
            "duplicate_dictionary": []
        }

        # Check clip IDs
        clip_ids = [clip.get("id") for clip in dataset_data.get("clips", [])]
        duplicates = self._find_duplicates(clip_ids)
        if duplicates:
            results["duplicate_clips"] = duplicates

        # Check annotation IDs
        annotation_ids = [ann.get("id") for ann in dataset_data.get("annotations", [])]
        duplicates = self._find_duplicates(annotation_ids)
        if duplicates:
            results["duplicate_annotations"] = duplicates

        # Check dictionary entry IDs
        dict_ids = [entry.get("id") for entry in dataset_data.get("dictionary_entries", [])]
        duplicates = self._find_duplicates(dict_ids)
        if duplicates:
            results["duplicate_dictionary"] = duplicates

        return results

    def validate_scale_limits(self, dataset_data: dict) -> List[str]:
        """Validate that dataset doesn't exceed scale limits."""
        errors = []

        clips_count = len(dataset_data.get("clips", []))
        annotations_count = len(dataset_data.get("annotations", []))

        # Constitution specifies 10K scale limit
        if clips_count > 10000:
            errors.append(f"Too many clips: {clips_count} (max 10,000)")

        if annotations_count > 10000:
            errors.append(f"Too many annotations: {annotations_count} (max 10,000)")

        return errors

    def validate_license(self, dataset_data: dict) -> List[str]:
        """Validate license field."""
        errors = []

        license_id = dataset_data.get("license", "")

        # Check for valid SPDX license identifier
        if not license_id:
            errors.append("Missing license field")
        elif license_id not in ["CC0-1.0", "MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause"]:
            # This is a basic check - in production, could validate against full SPDX list
            errors.append(f"Unknown license identifier: {license_id}")

        return errors

    def validate_dataset_integrity(self, dataset_path: Path) -> Dict[str, any]:
        """Perform comprehensive dataset validation."""
        results = {
            "schema_valid": False,
            "file_issues": {},
            "id_issues": {},
            "scale_issues": [],
            "license_issues": [],
            "summary": {}
        }

        try:
            with open(dataset_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            results["summary"]["error"] = f"Failed to load dataset: {e}"
            return results

        # Schema validation
        results["schema_valid"] = self.validate_dataset_file(dataset_path)

        # Get base path for relative file resolution
        base_path = dataset_path.parent

        # File reference validation
        clip_results = self.validate_clip_references(data, base_path)
        annotation_results = self.validate_annotation_references(data, base_path)
        dict_results = self.validate_dictionary_references(data, base_path)

        results["file_issues"] = {
            "clips": clip_results,
            "annotations": annotation_results,
            "dictionary": dict_results
        }

        # ID uniqueness validation
        results["id_issues"] = self.validate_id_uniqueness(data)

        # Scale validation
        results["scale_issues"] = self.validate_scale_limits(data)

        # License validation
        results["license_issues"] = self.validate_license(data)

        # Summary
        total_clips = len(data.get("clips", []))
        total_annotations = len(data.get("annotations", []))
        total_dictionary = len(data.get("dictionary_entries", []))

        results["summary"] = {
            "total_clips": total_clips,
            "total_annotations": total_annotations,
            "total_dictionary": total_dictionary,
            "valid_clips": len(clip_results["valid_files"]) + len(clip_results["valid_urls"]),
            "valid_annotations": len(annotation_results["valid"]),
            "valid_dictionary": len(dict_results["valid"])
        }

        return results

    def _is_valid_url(self, url: str) -> bool:
        """Basic URL validation."""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except Exception:
            return False

    def _find_duplicates(self, items: List[str]) -> List[str]:
        """Find duplicate items in a list."""
        seen = set()
        duplicates = set()

        for item in items:
            if item is None:
                continue
            if item in seen:
                duplicates.add(item)
            else:
                seen.add(item)

        return list(duplicates)


def validate_dataset_command(file_path: Path, check_files: bool = True,
                           strict: bool = False) -> bool:
    """Command function for dataset validation."""
    validator = DatasetValidator()

    # Basic schema validation
    if not validator.validate_dataset_file(file_path):
        return False

    if check_files:
        print("🔍 Validating file references...")
        results = validator.validate_dataset_integrity(file_path)

        # Display results
        summary = results["summary"]
        print(f"\n📊 Dataset Summary:")
        print(f"  📁 Clips: {summary['valid_clips']}/{summary['total_clips']} valid")
        print(f"  📝 Annotations: {summary['valid_annotations']}/{summary['total_annotations']} valid")
        print(f"  📚 Dictionary: {summary['valid_dictionary']}/{summary['total_dictionary']} valid")

        # Check for issues
        issues = []

        # File issues
        clips = results["file_issues"]["clips"]
        if clips["missing_files"] or clips["invalid_urls"]:
            issues.append("Missing or invalid clip references")

        annotations = results["file_issues"]["annotations"]
        if annotations["missing"] or annotations["invalid_json"]:
            issues.append("Missing or invalid annotation files")

        dictionary = results["file_issues"]["dictionary"]
        if dictionary["missing"] or dictionary["invalid_json"]:
            issues.append("Missing or invalid dictionary files")

        # ID issues
        id_issues = results["id_issues"]
        if any(id_issues.values()):
            issues.append("Duplicate IDs found")

        # Scale issues
        if results["scale_issues"]:
            issues.append("Scale limits exceeded")

        # License issues
        if results["license_issues"]:
            issues.append("License validation failed")

        if issues:
            print(f"\n❌ Issues found:")
            for issue in issues:
                print(f"  - {issue}")
            return False
        else:
            print(f"\n✅ All file references and constraints validated")

    return True


def create_dataset_command(dataset_id: str, name: str, clips_dir: Path,
                         annotations_dir: Path, dictionary_dir: Path,
                         output: Optional[Path] = None) -> bool:
    """Command function for creating a new dataset manifest."""
    import datetime

    # Collect clips
    clips = []
    if clips_dir.exists():
        audio_extensions = [".wav", ".mp3", ".flac", ".m4a", ".ogg"]
        for ext in audio_extensions:
            for audio_file in clips_dir.glob(f"*{ext}"):
                clip_id = audio_file.stem
                clips.append({
                    "id": clip_id,
                    "uri": str(audio_file.relative_to(Path.cwd())),
                    "format": ext[1:]  # Remove the dot
                })

    # Collect annotations
    annotations = []
    if annotations_dir.exists():
        for ann_file in annotations_dir.glob("*.json"):
            ann_id = ann_file.stem
            annotations.append({
                "id": ann_id,
                "file_path": str(ann_file.relative_to(Path.cwd()))
            })

    # Collect dictionary entries
    dictionary_entries = []
    if dictionary_dir.exists():
        for dict_file in dictionary_dir.glob("*.json"):
            # Try to extract ID from file content
            try:
                with open(dict_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                entry_id = data.get("id", dict_file.stem)
            except Exception:
                entry_id = dict_file.stem

            dictionary_entries.append({
                "id": entry_id,
                "file_path": str(dict_file.relative_to(Path.cwd()))
            })

    # Create dataset manifest
    dataset_data = {
        "id": dataset_id,
        "name": name,
        "version": "1.0.0",
        "license": "CC0-1.0",
        "clips": clips,
        "annotations": annotations,
        "dictionary_entries": dictionary_entries,
        "schema_version": "1.0",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

    # Validate the created dataset
    validator = DatasetValidator()
    try:
        validator.resolver.validate(dataset_data, "dataset")
    except Exception as e:
        print(f"❌ Created dataset failed validation: {e}")
        return False

    # Determine output path
    if not output:
        output = Path(f"{dataset_id}.json")

    # Write the file
    try:
        with open(output, 'w', encoding='utf-8') as f:
            json.dump(dataset_data, f, indent=2, ensure_ascii=False)
        print(f"✅ Created dataset manifest: {output}")
        print(f"  📁 {len(clips)} clips")
        print(f"  📝 {len(annotations)} annotations")
        print(f"  📚 {len(dictionary_entries)} dictionary entries")
        return True
    except Exception as e:
        print(f"❌ Failed to write file: {e}")
        return False