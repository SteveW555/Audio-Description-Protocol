"""
Annotation validation commands for ADP CLI.

This module provides specialized commands for validating annotations,
checking time ranges, confidence scores, and dictionary references.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from ..validation import SchemaResolver
from ..models import Annotation


class AnnotationValidator:
    """Specialized validator for annotation files and relationships."""

    def __init__(self, schema_resolver: Optional[SchemaResolver] = None):
        """Initialize with optional schema resolver."""
        self.resolver = schema_resolver or SchemaResolver()

    def validate_annotation_file(self, file_path: Path) -> bool:
        """Validate a single annotation file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            self.resolver.validate(data, "annotation")
            return True

        except Exception as e:
            print(f"Annotation validation failed: {e}")
            return False

    def validate_time_ranges(self, annotation_data: dict) -> List[str]:
        """Validate time range constraints in annotation."""
        errors = []

        time_range = annotation_data.get("time_range", {})
        start_sec = time_range.get("start_sec")
        end_sec = time_range.get("end_sec")

        if start_sec is None or end_sec is None:
            errors.append("Missing start_sec or end_sec in time_range")
            return errors

        if start_sec < 0:
            errors.append(f"start_sec must be non-negative, got {start_sec}")

        if end_sec < 0:
            errors.append(f"end_sec must be non-negative, got {end_sec}")

        if end_sec <= start_sec:
            errors.append(f"end_sec ({end_sec}) must be greater than start_sec ({start_sec})")

        # Check for reasonable duration (less than 24 hours)
        duration = end_sec - start_sec
        if duration > 86400:  # 24 hours in seconds
            errors.append(f"Duration ({duration:.1f}s) exceeds maximum (24 hours)")

        return errors

    def validate_confidence_scores(self, annotation_data: dict) -> List[str]:
        """Validate confidence scores in labels."""
        errors = []

        labels = annotation_data.get("labels", [])
        for i, label in enumerate(labels):
            confidence = label.get("confidence")
            if confidence is None:
                errors.append(f"Label {i}: missing confidence score")
                continue

            if not isinstance(confidence, (int, float)):
                errors.append(f"Label {i}: confidence must be numeric, got {type(confidence)}")
                continue

            if confidence < 0.0 or confidence > 1.0:
                errors.append(f"Label {i}: confidence ({confidence}) must be in range [0.0, 1.0]")

        return errors

    def validate_dictionary_references(self, annotation_data: dict,
                                     dictionary_dir: Path) -> Tuple[List[str], List[str]]:
        """Validate that annotation references point to existing dictionary entries."""
        missing_refs = []
        found_refs = []

        labels = annotation_data.get("labels", [])
        for label in labels:
            entry_id = label.get("entry_id")
            if not entry_id:
                continue

            # Look for dictionary file with this ID
            dict_file = self._find_dictionary_file(dictionary_dir, entry_id)
            if dict_file:
                found_refs.append(entry_id)
            else:
                missing_refs.append(entry_id)

        return found_refs, missing_refs

    def validate_provenance(self, annotation_data: dict) -> List[str]:
        """Validate provenance information."""
        errors = []

        provenance = annotation_data.get("provenance", {})
        annotator_type = provenance.get("annotator_type")

        if annotator_type not in ["human", "ai"]:
            errors.append(f"Invalid annotator_type: {annotator_type} (must be 'human' or 'ai')")

        timestamp = provenance.get("timestamp")
        if not timestamp:
            errors.append("Missing timestamp in provenance")
        else:
            # Basic ISO 8601 format check
            try:
                from datetime import datetime
                datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            except ValueError:
                errors.append(f"Invalid timestamp format: {timestamp}")

        return errors

    def validate_clip_reference(self, annotation_data: dict, clips_dir: Optional[Path] = None) -> List[str]:
        """Validate that clip_id references exist (if clips directory provided)."""
        errors = []

        clip_id = annotation_data.get("clip_id")
        if not clip_id:
            errors.append("Missing clip_id")
            return errors

        if clips_dir and clips_dir.exists():
            # Look for audio files with this ID
            audio_extensions = [".wav", ".mp3", ".flac", ".m4a", ".ogg"]
            found = False

            for ext in audio_extensions:
                clip_file = clips_dir / f"{clip_id}{ext}"
                if clip_file.exists():
                    found = True
                    break

            if not found:
                errors.append(f"Audio clip not found: {clip_id}")

        return errors

    def validate_annotation_directory(self, annotations_dir: Path,
                                    dictionary_dir: Optional[Path] = None,
                                    clips_dir: Optional[Path] = None) -> Dict[str, any]:
        """Validate all annotations in a directory."""
        results = {
            "valid": [],
            "invalid": [],
            "total_errors": 0,
            "time_range_errors": [],
            "confidence_errors": [],
            "reference_errors": [],
            "provenance_errors": []
        }

        if not annotations_dir.exists():
            print(f"❌ Annotations directory not found: {annotations_dir}")
            return results

        for ann_file in annotations_dir.glob("*.json"):
            file_valid = True
            file_errors = []

            try:
                with open(ann_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                # Basic schema validation
                try:
                    self.resolver.validate(data, "annotation")
                except Exception as e:
                    file_errors.append(f"Schema validation: {e}")
                    file_valid = False

                # Time range validation
                time_errors = self.validate_time_ranges(data)
                if time_errors:
                    file_errors.extend(time_errors)
                    results["time_range_errors"].extend([(str(ann_file), err) for err in time_errors])
                    file_valid = False

                # Confidence score validation
                conf_errors = self.validate_confidence_scores(data)
                if conf_errors:
                    file_errors.extend(conf_errors)
                    results["confidence_errors"].extend([(str(ann_file), err) for err in conf_errors])
                    file_valid = False

                # Dictionary reference validation
                if dictionary_dir:
                    found_refs, missing_refs = self.validate_dictionary_references(data, dictionary_dir)
                    if missing_refs:
                        ref_error = f"Missing dictionary references: {', '.join(missing_refs)}"
                        file_errors.append(ref_error)
                        results["reference_errors"].append((str(ann_file), ref_error))
                        file_valid = False

                # Provenance validation
                prov_errors = self.validate_provenance(data)
                if prov_errors:
                    file_errors.extend(prov_errors)
                    results["provenance_errors"].extend([(str(ann_file), err) for err in prov_errors])
                    file_valid = False

                # Clip reference validation
                clip_errors = self.validate_clip_reference(data, clips_dir)
                if clip_errors:
                    file_errors.extend(clip_errors)
                    file_valid = False

            except Exception as e:
                file_errors.append(f"File processing error: {e}")
                file_valid = False

            if file_valid:
                results["valid"].append(str(ann_file))
            else:
                results["invalid"].append((str(ann_file), file_errors))
                results["total_errors"] += len(file_errors)

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


def validate_annotation_command(file_path: Path, dictionary_dir: Optional[Path] = None,
                               clips_dir: Optional[Path] = None, strict: bool = False) -> bool:
    """Command function for annotation validation."""
    validator = AnnotationValidator()

    # Load annotation data
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Failed to load annotation file: {e}")
        return False

    # Basic schema validation
    if not validator.validate_annotation_file(file_path):
        return False

    errors = []

    # Time range validation
    time_errors = validator.validate_time_ranges(data)
    errors.extend(time_errors)

    # Confidence score validation
    conf_errors = validator.validate_confidence_scores(data)
    errors.extend(conf_errors)

    # Dictionary reference validation
    if dictionary_dir:
        found_refs, missing_refs = validator.validate_dictionary_references(data, dictionary_dir)
        if missing_refs:
            errors.append(f"Missing dictionary references: {', '.join(missing_refs)}")
        elif found_refs:
            print(f"✅ Dictionary references found: {', '.join(found_refs)}")

    # Provenance validation
    prov_errors = validator.validate_provenance(data)
    errors.extend(prov_errors)

    # Clip reference validation
    clip_errors = validator.validate_clip_reference(data, clips_dir)
    errors.extend(clip_errors)

    if errors:
        print(f"❌ Annotation validation failed:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print(f"✅ Annotation validation passed")
        return True


def validate_annotation_directory_command(annotations_dir: Path,
                                         dictionary_dir: Optional[Path] = None,
                                         clips_dir: Optional[Path] = None) -> bool:
    """Command function for validating entire annotation directory."""
    validator = AnnotationValidator()
    results = validator.validate_annotation_directory(annotations_dir, dictionary_dir, clips_dir)

    print(f"📊 Annotation Validation Results:")
    print(f"  ✅ Valid annotations: {len(results['valid'])}")
    print(f"  ❌ Invalid annotations: {len(results['invalid'])}")
    print(f"  🚨 Total errors: {results['total_errors']}")

    if results["invalid"]:
        print(f"\n❌ Invalid files:")
        for file_path, file_errors in results["invalid"]:
            print(f"  - {file_path}:")
            for error in file_errors:
                print(f"    • {error}")

    return len(results["invalid"]) == 0