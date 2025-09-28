#!/usr/bin/env python3
"""
Migration script to convert Python models to TypeScript-compatible format.

This script demonstrates how to migrate existing Python data models to use
TypeScript as the single source of truth while preserving all functionality.
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, List

from .typescript_bridge import (
    TypeScriptBridge,
    LegacyPythonModelConverter,
    validate_audio_metadata,
    validate_musical_analysis,
    convert_to_typescript_format
)


class DataMigrator:
    """Migrates existing Python model data to TypeScript format."""

    def __init__(self):
        self.bridge = TypeScriptBridge()
        self.converter = LegacyPythonModelConverter()
        self.migration_log = []

    def migrate_dataset(self, dataset_path: str, output_path: str) -> bool:
        """
        Migrate a dataset from Python format to TypeScript format.

        Args:
            dataset_path: Path to existing Python dataset JSON
            output_path: Path for migrated TypeScript-compatible dataset

        Returns:
            True if migration successful, False otherwise
        """
        try:
            # Load existing dataset
            with open(dataset_path, 'r') as f:
                dataset = json.load(f)

            # Migrate structure
            migrated_dataset = self._migrate_dataset_structure(dataset)

            # Validate migrated data
            if self._validate_migrated_dataset(migrated_dataset):
                # Save migrated dataset
                with open(output_path, 'w') as f:
                    json.dump(migrated_dataset, f, indent=2)

                self.migration_log.append(f"Successfully migrated {dataset_path} to {output_path}")
                return True
            else:
                self.migration_log.append(f"Validation failed for {dataset_path}")
                return False

        except Exception as e:
            self.migration_log.append(f"Error migrating {dataset_path}: {str(e)}")
            return False

    def _migrate_dataset_structure(self, dataset: Dict[str, Any]) -> Dict[str, Any]:
        """Migrate dataset structure to TypeScript format."""
        migrated = {}

        # Preserve core dataset fields
        for field in ['id', 'name', 'version', 'license', 'schema_version', 'description']:
            if field in dataset:
                migrated[field] = dataset[field]

        # Handle timestamps
        for field in ['created_at', 'updated_at']:
            if field in dataset:
                migrated[field] = dataset[field]  # Assume already ISO format

        # Migrate clips with audio metadata
        if 'clips' in dataset:
            migrated['clips'] = []
            for clip in dataset['clips']:
                migrated_clip = self._migrate_audio_clip(clip)
                migrated['clips'].append(migrated_clip)

        # Preserve other fields as-is
        for field in ['annotations', 'dictionary_entries', 'splits', 'metadata']:
            if field in dataset:
                migrated[field] = dataset[field]

        return migrated

    def _migrate_audio_clip(self, clip: Dict[str, Any]) -> Dict[str, Any]:
        """Migrate individual audio clip to include TypeScript audio metadata."""
        migrated_clip = {}

        # Preserve core clip fields
        for field in ['id', 'uri']:
            if field in clip:
                migrated_clip[field] = clip[field]

        # Extract audio metadata
        audio_metadata = {}
        for field in ['format', 'duration_sec', 'sample_rate', 'channels', 'bit_depth', 'checksum']:
            if field in clip:
                audio_metadata[field] = clip[field]

        if audio_metadata:
            migrated_clip['audio_metadata'] = audio_metadata

        # Preserve other metadata
        if 'metadata' in clip:
            migrated_clip['metadata'] = clip['metadata']

        return migrated_clip

    def _validate_migrated_dataset(self, dataset: Dict[str, Any]) -> bool:
        """Validate migrated dataset structure."""
        validation_passed = True

        # Validate clips with audio metadata
        if 'clips' in dataset:
            for i, clip in enumerate(dataset['clips']):
                if 'audio_metadata' in clip:
                    if not validate_audio_metadata(clip['audio_metadata']):
                        self.migration_log.append(f"Audio metadata validation failed for clip {i}")
                        validation_passed = False

        return validation_passed

    def migrate_annotations(self, annotations_dir: str, output_dir: str) -> int:
        """
        Migrate annotation files to TypeScript format.

        Args:
            annotations_dir: Directory containing annotation JSON files
            output_dir: Directory for migrated annotations

        Returns:
            Number of successfully migrated files
        """
        annotations_path = Path(annotations_dir)
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)

        migrated_count = 0

        for annotation_file in annotations_path.glob("*.json"):
            try:
                with open(annotation_file, 'r') as f:
                    annotation = json.load(f)

                migrated_annotation = self._migrate_annotation(annotation)

                if self._validate_migrated_annotation(migrated_annotation):
                    output_file = output_path / annotation_file.name
                    with open(output_file, 'w') as f:
                        json.dump(migrated_annotation, f, indent=2)

                    migrated_count += 1
                    self.migration_log.append(f"Migrated annotation: {annotation_file.name}")

            except Exception as e:
                self.migration_log.append(f"Error migrating {annotation_file.name}: {str(e)}")

        return migrated_count

    def _migrate_annotation(self, annotation: Dict[str, Any]) -> Dict[str, Any]:
        """Migrate individual annotation to TypeScript format."""
        migrated = {}

        # Preserve core annotation fields
        for field in ['id', 'clip_id', 'time_range', 'labels', 'provenance', 'schema_version']:
            if field in annotation:
                migrated[field] = convert_to_typescript_format({field: annotation[field]})[field]

        # Handle musical annotation specific fields
        if annotation.get('annotation_type') == 'musical':
            migrated['annotation_type'] = 'musical'

            # Migrate musical analysis
            if 'musical_analysis' in annotation:
                analysis = annotation['musical_analysis']
                migrated_analysis = self._migrate_musical_analysis(analysis)
                if migrated_analysis:
                    migrated['advanced_musical_data'] = {
                        'musical_analysis': migrated_analysis
                    }

            # Migrate musical elements and timing
            if 'musical_elements' in annotation:
                if 'advanced_musical_data' not in migrated:
                    migrated['advanced_musical_data'] = {}
                migrated['advanced_musical_data']['musical_elements'] = annotation['musical_elements']

            # Migrate timing data
            timing_fields = ['onset_times', 'beat_times', 'downbeat_times']
            timing_data = {}
            for field in timing_fields:
                if field in annotation:
                    timing_data[field] = annotation[field]

            if timing_data:
                if 'advanced_musical_data' not in migrated:
                    migrated['advanced_musical_data'] = {}
                migrated['advanced_musical_data']['musical_timing'] = timing_data

            # Migrate spectral features
            if 'spectral_features' in annotation:
                migrated['spectral_features'] = annotation['spectral_features']

        # Handle model output annotations
        if 'inference_meta' in annotation:
            model_output = self._migrate_model_output(annotation)
            migrated['model_output'] = model_output

        return migrated

    def _migrate_musical_analysis(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Migrate musical analysis to TypeScript format."""
        migrated = {}

        # Map fields directly
        field_mapping = {
            'tempo': 'tempo',
            'tempo_confidence': 'tempo_confidence',
            'key_signature': 'key_signature',
            'key_confidence': 'key_confidence',
            'time_signature': 'time_signature',
            'time_signature_confidence': 'time_signature_confidence',
            'genre': 'genre',
            'genre_confidence': 'genre_confidence',
            'energy': 'energy',
            'valence': 'valence',
            'danceability': 'danceability',
            'instrumentalness': 'instrumentalness',
            'acousticness': 'acousticness',
            'loudness': 'loudness',
            'speechiness': 'speechiness'
        }

        for old_field, new_field in field_mapping.items():
            if old_field in analysis:
                migrated[new_field] = analysis[old_field]

        return migrated

    def _migrate_model_output(self, annotation: Dict[str, Any]) -> Dict[str, Any]:
        """Migrate model output annotation to TypeScript format."""
        model_output = {}

        # Migrate inference metadata
        if 'inference_meta' in annotation:
            inference = annotation['inference_meta']
            model_output['inference_meta'] = {
                'model_name': inference.get('model_name', ''),
                'model_version': inference.get('model_version', ''),
                'inference_time_ms': inference.get('inference_time_ms'),
                'hardware_context': inference.get('hardware_context'),
                'parameters': inference.get('parameters'),
                'preprocessing': inference.get('preprocessing')
            }

        # Migrate provenance (ensure AI type)
        if 'provenance' in annotation:
            provenance = annotation['provenance']
            model_output['provenance'] = {
                'annotator_type': 'ai',
                'annotator_id': provenance.get('annotator_id'),
                'timestamp': provenance.get('timestamp', provenance.get('annotation_time')),
                'tool_version': provenance.get('tool_version'),
                'session_id': provenance.get('session_id')
            }

        # Migrate additional model fields
        for field in ['comparison_target', 'ensemble_info', 'uncertainty', 'explainability']:
            if field in annotation:
                model_output[field] = annotation[field]

        return model_output

    def _validate_migrated_annotation(self, annotation: Dict[str, Any]) -> bool:
        """Validate migrated annotation structure."""
        validation_passed = True

        # Validate musical analysis if present
        if 'advanced_musical_data' in annotation and 'musical_analysis' in annotation['advanced_musical_data']:
            analysis = annotation['advanced_musical_data']['musical_analysis']
            if not validate_musical_analysis(analysis):
                self.migration_log.append("Musical analysis validation failed")
                validation_passed = False

        return validation_passed

    def print_migration_log(self):
        """Print migration log to console."""
        print("\n=== Migration Log ===")
        for entry in self.migration_log:
            print(entry)


def main():
    """Main migration script entry point."""
    if len(sys.argv) < 3:
        print("Usage: python migrate_to_typescript.py <input_dir> <output_dir>")
        print("       python migrate_to_typescript.py dataset <dataset.json> <output.json>")
        sys.exit(1)

    migrator = DataMigrator()

    if sys.argv[1] == "dataset":
        # Migrate single dataset file
        dataset_path = sys.argv[2]
        output_path = sys.argv[3]
        success = migrator.migrate_dataset(dataset_path, output_path)
        migrator.print_migration_log()
        sys.exit(0 if success else 1)

    else:
        # Migrate annotations directory
        input_dir = sys.argv[1]
        output_dir = sys.argv[2]
        migrated_count = migrator.migrate_annotations(input_dir, output_dir)
        migrator.print_migration_log()
        print(f"\nMigrated {migrated_count} annotation files")


if __name__ == "__main__":
    main()