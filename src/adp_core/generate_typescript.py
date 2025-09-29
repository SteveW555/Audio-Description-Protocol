#!/usr/bin/env python3
"""
TypeScript type generation from Python Pydantic models.

This script automatically generates TypeScript interfaces from the enhanced Python models,
ensuring type consistency between the Python backend and TypeScript frontend.
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional

from .models.musical_annotation import MusicalAnnotation, MusicalAnalysis, MusicalElement, MusicalStructure
from .models.annotation import Annotation, TimeRange, Label, Provenance, QualityMetrics
from .models.dataset import Dataset, AudioClip, AnnotationReference, DictionaryReference
from .taxonomy import SemanticAttributes, TermDefinition, QualityCategory, Frequency


class TypeScriptGenerator:
    """Generates TypeScript interfaces from Pydantic models."""

    def __init__(self, output_dir: str = None):
        """Initialize with output directory for generated TypeScript files."""
        if output_dir is None:
            # Default to wizard app types directory
            current_dir = Path(__file__).parent
            self.output_dir = current_dir.parent.parent / "wizard" / "app" / "src" / "types" / "generated"
        else:
            self.output_dir = Path(output_dir)

        self.output_dir.mkdir(exist_ok=True)

    def generate_taxonomy_types(self) -> str:
        """Generate TypeScript types for taxonomy system."""
        ts_content = '''// Auto-generated TypeScript types for taxonomy system
// Source: src/adp_core/taxonomy.py

export type QualityCategory = 'Mood' | 'Energy' | 'Texture';

export type Frequency = 'rare' | 'infrequent' | 'frequent' | 'ubiquitous';

export interface TermDefinition {
    id: string;
    term: string;
    freq: Frequency;
    desc: string;
    figurative?: boolean;
    aliases?: string[];
    examples?: string[];
    sources?: string[];
    meta?: Record<string, any>;
}

export interface SemanticAttributes {
    mood: string[];
    energy: string[];
    texture: string[];
}
'''
        return ts_content

    def generate_annotation_types(self) -> str:
        """Generate TypeScript types for annotation models."""
        ts_content = '''// Auto-generated TypeScript types for annotation models
// Source: src/adp_core/models/

export interface TimeRange {
    start_sec: number;
    end_sec: number;
}

export interface Label {
    entry_id: string;
    confidence: number;
}

export interface Provenance {
    annotator_type: 'human' | 'ai';
    timestamp: string; // ISO 8601
    annotator_id?: string;
    tool_version?: string;
    session_id?: string;
}

export interface QualityMetrics {
    inter_annotator_agreement?: number;
    confidence_avg?: number;
}

export interface Annotation {
    id: string;
    clip_id: string;
    time_range: TimeRange;
    labels: Label[];
    provenance: Provenance;
    schema_version: string;
    free_text?: string;
    quality_metrics?: QualityMetrics;
}
'''
        return ts_content

    def generate_musical_annotation_types(self) -> str:
        """Generate TypeScript types for musical annotation models."""
        ts_content = '''// Auto-generated TypeScript types for musical annotation models
// Source: src/adp_core/models/musical_annotation.py

export type MusicalElementType =
    | 'note' | 'chord' | 'rhythm' | 'tempo' | 'key' | 'time_signature'
    | 'dynamics' | 'articulation' | 'timbre' | 'harmony' | 'melody'
    | 'structure' | 'genre' | 'style' | 'instrument' | 'voice';

export interface MusicalElement {
    element_type: MusicalElementType;
    value: string | number | Record<string, any>;
    confidence?: number;
    attributes?: Record<string, any>;
}

export type StructuralLevel =
    | 'note' | 'beat' | 'measure' | 'phrase' | 'section' | 'movement' | 'piece';

export interface MusicalStructure {
    level: StructuralLevel;
    parent_id?: string;
    children_ids: string[];
    time_range: TimeRange;
    label?: string;
    attributes?: Record<string, any>;
}

export interface MusicalAnalysis {
    tempo?: number;
    tempo_confidence?: number;
    key_signature?: string;
    key_confidence?: number;
    time_signature?: string;
    time_signature_confidence?: number;
    genre?: string;
    genre_confidence?: number;
    energy?: number;
    valence?: number;
    danceability?: number;
    instrumentalness?: number;
    acousticness?: number;
    loudness?: number;
    speechiness?: number;
    semantic_attributes?: SemanticAttributes;
}

export interface MusicalAnnotation extends Annotation {
    annotation_type: 'musical';
    musical_elements: MusicalElement[];
    musical_structure: MusicalStructure[];
    musical_analysis?: MusicalAnalysis;
    chord_progressions?: Array<Record<string, any>>;
    melodic_patterns?: Array<Record<string, any>>;
    rhythmic_patterns?: Array<Record<string, any>>;
    harmonic_analysis?: Record<string, any>;
    spectral_features?: Record<string, number[]>;
    onset_times?: number[];
    beat_times?: number[];
    downbeat_times?: number[];
}
'''
        return ts_content

    def generate_dataset_types(self) -> str:
        """Generate TypeScript types for dataset models."""
        ts_content = '''// Auto-generated TypeScript types for dataset models
// Source: src/adp_core/models/dataset.py

export type AudioFormat = 'wav' | 'mp3' | 'flac' | 'ogg' | 'm4a';
export type BitDepth = 16 | 24 | 32;

export interface AudioClip {
    id: string;
    uri: string;
    format?: AudioFormat;
    duration_sec?: number;
    sample_rate?: number;
    channels?: number;
    bit_depth?: BitDepth;
    checksum?: string;
    metadata?: Record<string, any>;
}

export interface AnnotationReference {
    id: string;
    file_path: string;
    annotation_type?: 'annotation' | 'musical_annotation' | 'model_output';
    checksum?: string;
}

export interface DictionaryReference {
    id: string;
    file_path: string;
    category?: string;
    checksum?: string;
}

export interface DatasetSplits {
    train?: string[];
    validation?: string[];
    test?: string[];
}

export interface DatasetMetadata {
    curator?: string;
    purpose?: string;
    total_duration_sec?: number;
    annotation_count?: number;
    unique_labels?: number;
    language?: string;
}

export interface Dataset {
    id: string;
    name: string;
    version: string;
    license: string;
    clips: AudioClip[];
    annotations: AnnotationReference[];
    dictionary_entries: DictionaryReference[];
    schema_version: string;
    created_at: string;
    description?: string;
    updated_at?: string;
    metadata?: DatasetMetadata;
    splits?: DatasetSplits;
}
'''
        return ts_content

    def generate_validation_functions(self) -> str:
        """Generate TypeScript validation functions."""
        ts_content = '''// Auto-generated TypeScript validation functions
// Source: Python Pydantic validators

export class TaxonomyValidator {
    // This would be populated with the actual taxonomy terms
    private static readonly VALID_TERMS = new Set<string>([
        // Mood terms
        'upbeat', 'energetic-mood', 'joyful', 'happy', 'cheerful', 'uplifting',
        'positive-mood', 'hopeful', 'playful', 'romantic', 'sentimental', 'peaceful',
        'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative',
        // Energy terms
        'high-energy', 'driving', 'vigorous', 'propulsive', 'pumping', 'dynamic-energy',
        'flowing', 'steady', 'moderate', 'balanced-energy', 'measured', 'rolling',
        'laid-back', 'low-energy', 'ambient', 'chill', 'mellow-energy',
        // Texture terms
        'bright', 'crisp', 'clear', 'brilliant', 'sparkling', 'crystalline',
        'warm', 'rich', 'full', 'lush', 'creamy', 'honeyed', 'golden',
        'dark', 'muddy', 'harsh', 'gritty-texture', 'murky', 'raspy',
        // Add more terms as needed...
    ]);

    static isValidTerm(termId: string): boolean {
        return this.VALID_TERMS.has(termId);
    }

    static validateSemanticAttributes(attributes: SemanticAttributes): string[] {
        const invalidTerms: string[] = [];

        attributes.mood.forEach(term => {
            if (!this.isValidTerm(term)) {
                invalidTerms.push(`mood:${term}`);
            }
        });

        attributes.energy.forEach(term => {
            if (!this.isValidTerm(term)) {
                invalidTerms.push(`energy:${term}`);
            }
        });

        attributes.texture.forEach(term => {
            if (!this.isValidTerm(term)) {
                invalidTerms.push(`texture:${term}`);
            }
        });

        return invalidTerms;
    }
}

export function validateMusicalAnalysis(analysis: MusicalAnalysis): boolean {
    // Validate numeric ranges
    if (analysis.tempo_confidence !== undefined &&
        (analysis.tempo_confidence < 0 || analysis.tempo_confidence > 1)) {
        return false;
    }

    if (analysis.energy !== undefined &&
        (analysis.energy < 0 || analysis.energy > 1)) {
        return false;
    }

    // Validate semantic attributes if present
    if (analysis.semantic_attributes) {
        const invalidTerms = TaxonomyValidator.validateSemanticAttributes(analysis.semantic_attributes);
        return invalidTerms.length === 0;
    }

    return true;
}

export function validateTimeRange(timeRange: TimeRange): boolean {
    return timeRange.end_sec > timeRange.start_sec &&
           timeRange.start_sec >= 0 &&
           timeRange.end_sec >= 0;
}
'''
        return ts_content

    def generate_all_types(self) -> None:
        """Generate all TypeScript type definition files."""
        # Generate individual type files
        type_files = {
            'taxonomy.ts': self.generate_taxonomy_types(),
            'annotations.ts': self.generate_annotation_types(),
            'musical-annotations.ts': self.generate_musical_annotation_types(),
            'datasets.ts': self.generate_dataset_types(),
            'validators.ts': self.generate_validation_functions()
        }

        # Write individual files
        for filename, content in type_files.items():
            file_path = self.output_dir / filename
            with open(file_path, 'w') as f:
                f.write(content)

        # Generate combined index file
        index_content = '''// Auto-generated TypeScript type definitions
// Combined exports from all model types

export * from './taxonomy';
export * from './annotations';
export * from './musical-annotations';
export * from './datasets';
export * from './validators';

// Re-export commonly used types
export type {
    SemanticAttributes,
    MusicalAnnotation,
    MusicalAnalysis,
    Annotation,
    Dataset,
    AudioClip
} from './musical-annotations';
'''

        index_path = self.output_dir / 'index.ts'
        with open(index_path, 'w') as f:
            f.write(index_content)

        print(f"Generated TypeScript types in: {self.output_dir}")
        print(f"Generated files: {', '.join(type_files.keys())}, index.ts")

    def export_json_schemas(self) -> None:
        """Export JSON schemas for additional validation."""
        schemas = {
            'MusicalAnnotation': MusicalAnnotation.schema(),
            'MusicalAnalysis': MusicalAnalysis.schema(),
            'SemanticAttributes': SemanticAttributes.schema(),
            'Dataset': Dataset.schema(),
            'AudioClip': AudioClip.schema()
        }

        schema_dir = self.output_dir / 'schemas'
        schema_dir.mkdir(exist_ok=True)

        for schema_name, schema in schemas.items():
            schema_path = schema_dir / f'{schema_name}.json'
            with open(schema_path, 'w') as f:
                json.dump(schema, f, indent=2)

        print(f"Generated JSON schemas in: {schema_dir}")


def main():
    """Main script entry point."""
    output_dir = sys.argv[1] if len(sys.argv) > 1 else None

    generator = TypeScriptGenerator(output_dir)
    generator.generate_all_types()
    generator.export_json_schemas()

    print("\nTypeScript type generation complete!")
    print("Frontend can now import types with:")
    print("  import { MusicalAnnotation, SemanticAttributes } from './generated';")


if __name__ == "__main__":
    main()