# Data Model: Audio Description Protocol (ADP) Framework

**Phase 1 Design Output**
**Date**: 2025-09-26

## Entity Definitions

### DictionaryEntry

**Purpose**: Standardized musical descriptor with hierarchical relationships

**Fields**:
- `id` (string, required): Lowercase kebab-case unique identifier
  - Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
  - Example: `"electronic-dance-music"`, `"lo-fi"`
- `label` (string, required): Human-readable lowercase label
  - Pattern: `^[a-z0-9]+(?:[- ][a-z0-9]+)*$`
  - Example: `"electronic dance music"`, `"lo-fi"`
- `definition` (string, required): Detailed description (minimum 10 characters)
  - Example: `"High-energy electronic music designed for dancing"`
- `schema_version` (string, required): Semantic version
  - Pattern: `^[0-9]+\.[0-9]+(\.[0-9]+)?$`
  - Example: `"1.0"`, `"1.2.3"`
- `aliases` (array of strings, optional): Alternative labels
  - Each alias follows same pattern as label
- `tags` (array of strings, optional): Categorization tags
- `parent_id` (string, optional): Reference to parent dictionary entry ID
  - Enables hierarchical relationships
  - Must reference existing dictionary entry
- `created_at` (string, optional): ISO 8601 timestamp
- `updated_at` (string, optional): ISO 8601 timestamp

**Relationships**:
- Self-referencing hierarchy via `parent_id`
- Referenced by Annotation entities via `labels[].entry_id`

**Validation Rules**:
- `id` must be unique across all dictionary entries
- `parent_id` must reference existing dictionary entry (no circular references)
- `definition` minimum length 10 characters
- `schema_version` required for protocol evolution

### Annotation

**Purpose**: Time-bound label application linking audio clips to dictionary entries

**Fields**:
- `id` (string, required): Unique annotation identifier
- `clip_id` (string, required): Reference to audio clip
- `time_range` (object, required):
  - `start_sec` (number, required): Start time in seconds (≥ 0.0)
  - `end_sec` (number, required): End time in seconds (> start_sec)
- `labels` (array, required, non-empty): Applied labels with confidence
  - `entry_id` (string, required): Reference to dictionary entry ID
  - `confidence` (number, required): Confidence score [0.0, 1.0]
- `free_text` (string, optional): Additional description
- `provenance` (object, required): Origin tracking
  - `annotator_type` (string, required): `"human"` or `"ai"`
  - `annotator_id` (string, optional): Annotator identifier
  - `timestamp` (string, required): ISO 8601 creation timestamp
- `schema_version` (string, required): Semantic version
- `metadata` (object, optional): Additional key-value pairs

**Relationships**:
- References AudioClipReference via `clip_id`
- References DictionaryEntry entities via `labels[].entry_id`
- Extended by ModelOutput entity

**Validation Rules**:
- `end_sec` must be greater than `start_sec`
- Both time values must be non-negative
- `confidence` must be in range [0.0, 1.0] inclusive
- `entry_id` must reference existing dictionary entries
- `labels` array must contain at least one entry
- Conflict resolution: last-writer-wins based on `provenance.timestamp`

### Dataset

**Purpose**: Curated collection aggregating clips, annotations, and dictionary entries

**Fields**:
- `id` (string, required): Unique dataset identifier
- `name` (string, required): Human-readable dataset name
- `description` (string, optional): Dataset description
- `version` (string, required): Dataset version (semantic versioning)
- `license` (string, required): Dataset license (default: `"CC0-1.0"`)
- `clips` (array, required): Audio clip references
  - `id` (string, required): Clip identifier
  - `uri` (string, required): File path or HTTP/HTTPS URL
  - `format` (string, optional): Audio format (e.g., `"wav"`, `"mp3"`)
  - `duration_sec` (number, optional): Duration in seconds
  - `checksum` (string, optional): Content integrity hash
- `annotations` (array, required): Annotation references
  - `id` (string, required): Annotation identifier
  - `file_path` (string, required): Path to annotation JSON file
- `dictionary_entries` (array, required): Dictionary entry references
  - `id` (string, required): Dictionary entry identifier
  - `file_path` (string, required): Path to dictionary entry JSON file
- `schema_version` (string, required): Semantic version
- `created_at` (string, required): ISO 8601 timestamp
- `metadata` (object, optional): Additional dataset metadata

**Relationships**:
- Aggregates AudioClipReference, Annotation, and DictionaryEntry entities
- References external files via file paths

**Validation Rules**:
- All referenced clip, annotation, and dictionary entry IDs must exist
- File paths must be valid and accessible
- License must be valid SPDX identifier
- Scale limit: up to 10,000 clips and annotations

### ModelOutput

**Purpose**: AI-generated annotation with inference metadata

**Fields**:
- Inherits all fields from Annotation
- `inference_meta` (object, required): Model-specific metadata
  - `model_name` (string, required): Model identifier
  - `model_version` (string, required): Model version
  - `inference_time_ms` (number, optional): Processing time
  - `hardware_context` (string, optional): Hardware used (e.g., `"GPU"`, `"CPU"`)
  - `parameters` (object, optional): Model parameters used
- `comparison_target` (string, optional): Reference to human annotation ID for comparison

**Relationships**:
- Extends Annotation entity
- Can reference human Annotation for comparison

**Validation Rules**:
- Inherits all Annotation validation rules
- `provenance.annotator_type` must be `"ai"`
- `model_name` and `model_version` required for reproducibility

### AudioClipReference

**Purpose**: Standardized pointer to audio content

**Fields**:
- `id` (string, required): Unique clip identifier
- `uri` (string, required): File path or HTTP/HTTPS URL
  - File path: absolute or relative path
  - URL: must be HTTP or HTTPS scheme
- `format` (string, optional): Audio format specification
- `duration_sec` (number, optional): Duration in seconds
- `sample_rate` (number, optional): Sample rate in Hz
- `channels` (number, optional): Number of audio channels
- `checksum` (string, optional): Content integrity verification
- `metadata` (object, optional): Additional audio metadata

**Relationships**:
- Referenced by Annotation entities via `clip_id`
- Included in Dataset entities

**Validation Rules**:
- `uri` must be valid file path or HTTP/HTTPS URL
- File paths must be accessible when referenced
- URLs must be valid and reachable (validation optional for performance)
- `duration_sec`, `sample_rate`, `channels` must be positive if present

## Schema Evolution Strategy

**Versioning**: Semantic versioning (MAJOR.MINOR.PATCH)
- MAJOR: Breaking schema changes requiring migration
- MINOR: Backward-compatible additions
- PATCH: Bug fixes and clarifications

**Migration Support**:
- Each entity includes `schema_version` field
- Version validation during loading
- Migration scripts for major version changes

## Data Flow Relationships

```
DictionaryEntry (hierarchical)
    ↑ parent_id
    ↓ referenced by
Annotation ← clip_id → AudioClipReference
    ↓ extends
ModelOutput

Dataset aggregates:
├── AudioClipReference (clips array)
├── Annotation (annotations array)
└── DictionaryEntry (dictionary_entries array)
```

## File Organization

**Individual Files**:
- Each entity can exist as standalone JSON file
- Filename convention: `{type}_{id}.json`
- Example: `dictionary_lo-fi.json`, `annotation_001.json`

**Collection Files**:
- Multiple entities of same type in single file
- Array of objects following entity schema
- Example: `dictionary_entries.json`, `annotations.json`

**Dataset Manifests**:
- Reference individual or collection files
- Enable modular dataset composition
- Support distributed file organization

**Status**: Data model complete, ready for contract generation