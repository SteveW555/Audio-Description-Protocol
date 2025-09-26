# Quickstart: Audio Description Protocol (ADP) Framework

**Phase 1 Integration Test Scenarios**
**Date**: 2025-09-26

## Overview

This quickstart guide validates the ADP Framework implementation by walking through the primary user scenarios defined in the specification. Each scenario represents an integration test that must pass for successful implementation.

## Prerequisites

- Python 3.11+ installed
- ADP Framework package installed (`pip install adp-framework`)
- Audio files for testing (WAV/MP3 format)

## Scenario 1: Create and Validate Dictionary Entry

**User Story**: A music researcher creates a new dictionary entry for "lo-fi hip hop" with hierarchical relationships.

### Steps

1. **Create dictionary entry JSON**:
```json
{
  "id": "lo-fi-hip-hop",
  "label": "lo-fi hip hop",
  "definition": "Relaxed hip hop subgenre characterized by low-fidelity sound quality, jazz samples, and downtempo beats.",
  "schema_version": "1.0",
  "parent_id": "hip-hop",
  "tags": ["chill", "instrumental", "study-music"],
  "created_at": "2025-09-26T10:00:00Z"
}
```

2. **Validate against schema**:
```bash
adp validate dictionary lo-fi-hip-hop.json
```

**Expected Result**: ✅ Validation passes, outputs "VALID"

3. **Test hierarchical relationship**:
```bash
adp validate-hierarchy lo-fi-hip-hop.json --parent hip-hop.json
```

**Expected Result**: ✅ Parent-child relationship validated

## Scenario 2: Create and Validate Audio Annotation

**User Story**: An annotator labels a 30-second audio clip with confidence scores and time ranges.

### Steps

1. **Create annotation JSON**:
```json
{
  "id": "annotation-001",
  "clip_id": "sample-audio-001",
  "time_range": {
    "start_sec": 0.0,
    "end_sec": 30.0
  },
  "labels": [
    {
      "entry_id": "lo-fi-hip-hop",
      "confidence": 0.85
    },
    {
      "entry_id": "instrumental",
      "confidence": 0.95
    }
  ],
  "free_text": "Relaxing background music with vinyl crackle",
  "provenance": {
    "annotator_type": "human",
    "annotator_id": "researcher-001",
    "timestamp": "2025-09-26T10:30:00Z"
  },
  "schema_version": "1.0"
}
```

2. **Validate annotation**:
```bash
adp validate annotation annotation-001.json
```

**Expected Result**: ✅ Validation passes

3. **Validate dictionary references**:
```bash
adp validate-references annotation-001.json --dictionary-dir ./dictionary/
```

**Expected Result**: ✅ All entry_id references found in dictionary

## Scenario 2b: Create and Validate Musical Annotation

**User Story**: A music analyst creates a rich musical annotation with theory analysis, semantic description, and instrumentation details.

### Steps

1. **Create musical annotation JSON**:
```json
{
  "id": "musical-annotation-001",
  "clip_id": "sample-audio-001",
  "time_range": {
    "start_sec": 0.0,
    "end_sec": 30.0
  },
  "provenance": {
    "annotator_type": "ai",
    "annotator_id": "music-analyzer-v2.1",
    "timestamp": "2025-09-26T10:45:00Z"
  },
  "schema_version": "1.0",
  "musical_analysis": {
    "protocol_version": "1.0",
    "theory": {
      "bpm": 126.0,
      "key": "F#",
      "scale": "minor",
      "key_confidence": 0.83,
      "chords": [
        {
          "time": 0.0,
          "chord": "F#:min",
          "confidence": 0.61
        },
        {
          "time": 1.0,
          "chord": "D:maj",
          "confidence": 0.55
        }
      ],
      "roman_numerals": ["i", "VI"]
    },
    "semantic_description": {
      "attributes": {
        "mood": ["energetic", "upbeat"],
        "energy": ["driving", "high-energy"],
        "texture": ["bright", "polished"]
      },
      "genre": {
        "primary": "electronic",
        "secondary": ["edm", "dance"],
        "subgenres": []
      },
      "instrumentation": [
        {
          "instrument": "synthesizer",
          "role": "lead",
          "descriptors": ["bright", "melodic", "soaring"]
        },
        {
          "instrument": "kick_drum",
          "role": "percussion",
          "descriptors": ["punchy", "heavy"]
        }
      ],
      "vocals": {
        "presence": "none"
      }
    }
  }
}
```

2. **Validate musical annotation**:
```bash
adp validate musical-annotation musical-annotation-001.json
```

**Expected Result**: ✅ Validation passes with musical analysis structure

3. **Validate music theory constraints**:
```bash
adp validate-music-theory musical-annotation-001.json
```

**Expected Result**: ✅ BPM range, chord symbols, and confidence scores validated

## Scenario 3: Create and Validate Dataset Manifest

**User Story**: A researcher creates a dataset manifest that references multiple clips and annotations.

### Steps

1. **Create dataset manifest JSON**:
```json
{
  "id": "lo-fi-study-dataset",
  "name": "Lo-Fi Study Music Dataset",
  "description": "Curated collection of lo-fi hip hop tracks for music analysis",
  "version": "1.0.0",
  "license": "CC0-1.0",
  "clips": [
    {
      "id": "sample-audio-001",
      "uri": "/audio/lofi-track-001.wav",
      "format": "wav",
      "duration_sec": 180.5
    },
    {
      "id": "sample-audio-002",
      "uri": "https://example.com/audio/lofi-track-002.mp3",
      "format": "mp3",
      "duration_sec": 142.3
    }
  ],
  "annotations": [
    {
      "id": "annotation-001",
      "file_path": "./annotations/annotation-001.json"
    },
    {
      "id": "annotation-002",
      "file_path": "./annotations/annotation-002.json"
    }
  ],
  "dictionary_entries": [
    {
      "id": "lo-fi-hip-hop",
      "file_path": "./dictionary/lo-fi-hip-hop.json"
    }
  ],
  "schema_version": "1.0",
  "created_at": "2025-09-26T11:00:00Z"
}
```

2. **Validate dataset manifest**:
```bash
adp validate dataset lo-fi-study-dataset.json
```

**Expected Result**: ✅ Dataset manifest validates

3. **Validate file references**:
```bash
adp validate-dataset-files lo-fi-study-dataset.json
```

**Expected Result**: ✅ All referenced files exist and validate

## Scenario 4: Generate and Validate Model Output

**User Story**: An AI model processes an audio clip and generates annotation with inference metadata.

### Steps

1. **Create model output JSON**:
```json
{
  "id": "model-annotation-001",
  "clip_id": "sample-audio-001",
  "time_range": {
    "start_sec": 0.0,
    "end_sec": 30.0
  },
  "labels": [
    {
      "entry_id": "lo-fi-hip-hop",
      "confidence": 0.82
    }
  ],
  "provenance": {
    "annotator_type": "ai",
    "annotator_id": "adp-classifier-v1",
    "timestamp": "2025-09-26T12:00:00Z"
  },
  "inference_meta": {
    "model_name": "ADP Audio Classifier",
    "model_version": "1.2.0",
    "inference_time_ms": 245,
    "hardware_context": "GPU",
    "parameters": {
      "temperature": 0.7,
      "top_k": 5
    }
  },
  "comparison_target": "annotation-001",
  "schema_version": "1.0"
}
```

2. **Validate model output**:
```bash
adp validate model-output model-annotation-001.json
```

**Expected Result**: ✅ Model output validates with AI-specific constraints

## Scenario 5: End-to-End Workflow Validation

**User Story**: Complete workflow from dictionary creation to dataset assembly.

### Steps

1. **Create complete workflow**:
```bash
# Create dictionary entries
adp create dictionary hip-hop "Hip hop music genre"
adp create dictionary lo-fi-hip-hop "Lo-fi hip hop subgenre" --parent hip-hop

# Annotate audio clips
adp annotate sample-audio.wav --labels lo-fi-hip-hop:0.85 --human-annotator researcher-001

# Generate dataset manifest
adp create dataset lo-fi-collection --clips ./audio/ --annotations ./annotations/ --dictionary ./dictionary/

# Validate complete dataset
adp validate-all lo-fi-collection.json
```

**Expected Results**:
- ✅ All files validate individually
- ✅ Cross-references resolve correctly
- ✅ Hierarchical relationships maintained
- ✅ Dataset integrity confirmed

## Performance Validation

**Scale Test**: Validate handling of target scale (10K clips/annotations)

### Steps

1. **Generate test dataset**:
```bash
adp generate test-dataset --clips 1000 --annotations 5000 --output large-test-dataset.json
```

2. **Validate performance**:
```bash
time adp validate dataset large-test-dataset.json
```

**Expected Result**: ✅ Validation completes in under 30 seconds for 5K annotations

## Error Handling Validation

**Edge Cases**: Test validation of common error scenarios

### Steps

1. **Invalid time ranges**:
```bash
adp validate annotation invalid-timerange.json
```
**Expected Result**: ❌ Validation fails with clear error message

2. **Missing dictionary references**:
```bash
adp validate annotation missing-reference.json
```
**Expected Result**: ❌ Validation fails identifying missing entry_id

3. **Invalid confidence scores**:
```bash
adp validate annotation invalid-confidence.json
```
**Expected Result**: ❌ Validation fails for confidence outside [0.0, 1.0]

## Integration Success Criteria

**All scenarios must pass for successful ADP Framework implementation:**

- [ ] Dictionary entry creation and validation
- [ ] Hierarchical relationship validation
- [ ] Audio annotation validation with time ranges and confidence
- [ ] Dictionary reference validation
- [ ] Dataset manifest creation and validation
- [ ] Model output generation and validation
- [ ] End-to-end workflow execution
- [ ] Performance requirements met (10K scale)
- [ ] Error handling for invalid data

**Implementation Status**: Ready for task generation and implementation phases