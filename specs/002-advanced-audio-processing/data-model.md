# Data Model: Advanced Audio Processing Integration

**Date**: 2025-09-27
**Feature**: Advanced Audio Processing Integration

## Entity Definitions

### AudioFile
Represents source musical content for analysis
- **file_path**: str - Absolute path to audio file
- **duration**: float - Duration in seconds
- **sample_rate**: int - Sample rate in Hz
- **format**: str - Audio format (wav, mp3, flac, etc.)
- **channels**: int - Number of audio channels
- **metadata**: dict - Additional file metadata

**Validation Rules**:
- file_path must exist and be readable
- duration must be > 0
- sample_rate must be > 0
- format must be supported by torchaudio
- channels must be 1 or 2 (mono/stereo)

### AnalysisResult
Complete feature extraction output
- **audio_file**: AudioFile - Reference to source audio
- **tempo**: float - Detected tempo in BPM
- **tempo_confidence**: float - Confidence score 0-1
- **key**: str - Detected musical key (e.g., "C major", "A minor")
- **key_confidence**: float - Confidence score 0-1
- **chords**: List[ChordSegment] - Chord progression analysis
- **spectral_features**: SpectralFeatures - Frequency domain analysis
- **processing_time**: float - Analysis duration in seconds
- **model_versions**: dict - Model names and versions used

**Validation Rules**:
- tempo must be between 60-300 BPM
- tempo_confidence must be 0-1
- key must be valid musical key notation
- key_confidence must be 0-1
- processing_time must be > 0

### ChordSegment
Individual chord detection within audio
- **start_time**: float - Start time in seconds
- **end_time**: float - End time in seconds
- **chord**: str - Chord notation (e.g., "C", "Am", "F#dim")
- **confidence**: float - Detection confidence 0-1

**Validation Rules**:
- start_time >= 0
- end_time > start_time
- chord must be valid chord notation
- confidence must be 0-1

### SpectralFeatures
Frequency domain characteristics
- **mfcc**: List[float] - Mel-frequency cepstral coefficients
- **spectral_centroid**: List[float] - Brightness measure over time
- **zero_crossing_rate**: List[float] - Zero crossing rate over time
- **rolloff**: List[float] - Spectral rolloff frequency
- **chroma**: List[List[float]] - Chromagram features

**Validation Rules**:
- All feature arrays must have consistent time dimensions
- MFCC coefficients typically 12-13 values
- All values must be finite (no NaN/Inf)

### AIAnnotation
ADP-compliant annotation generated from extracted features
- **id**: str - Unique annotation identifier
- **audio_file_path**: str - Path to source audio file
- **annotation_type**: str - Type of annotation (tempo, key, chord, etc.)
- **start_time**: float - Start time in seconds (for time-based annotations)
- **end_time**: float - End time in seconds (for time-based annotations)
- **content**: dict - Annotation content following ADP schema
- **confidence**: float - AI confidence score 0-1
- **provenance**: ProvenanceRecord - Generation metadata

**Validation Rules**:
- Must validate against ADP JSON schema
- annotation_type must be supported type
- Time ranges must be valid if applicable
- confidence must be 0-1

### ProvenanceRecord
Complete tracking of analysis process
- **generation_timestamp**: datetime - When annotation was created
- **model_name**: str - Primary model used
- **model_version**: str - Model version identifier
- **library_versions**: dict - Versions of key libraries (pytorch, torchaudio, librosa)
- **parameters**: dict - Analysis parameters used
- **processing_duration**: float - Time taken for analysis
- **hardware_info**: dict - GPU/CPU information
- **source_file_hash**: str - Hash of input audio file

**Validation Rules**:
- generation_timestamp must be valid datetime
- model_name and version must be non-empty
- processing_duration must be > 0
- source_file_hash must be valid hash

### ModelConfiguration
Settings and parameters for audio analysis models
- **model_id**: str - Unique model identifier
- **model_type**: str - Type (tempo, key, chord, spectral)
- **model_path**: str - Path to model file
- **parameters**: dict - Model-specific parameters
- **supported_formats**: List[str] - Supported audio formats
- **performance_metrics**: dict - Accuracy/speed benchmarks

**Validation Rules**:
- model_id must be unique
- model_type must be supported type
- model_path must exist if local model
- supported_formats must be non-empty

### ValidationReport
Comparison results between AI-generated and human annotations
- **report_id**: str - Unique report identifier
- **ai_annotation**: AIAnnotation - AI-generated annotation
- **human_annotation**: dict - Human annotation for comparison
- **accuracy_metrics**: dict - Comparison metrics
- **discrepancies**: List[dict] - Identified differences
- **validation_timestamp**: datetime - When validation performed
- **validator_info**: str - Information about validation process

**Validation Rules**:
- Both annotations must reference same audio file
- accuracy_metrics must contain numeric values
- validation_timestamp must be valid

## State Transitions

### Audio Processing Pipeline
1. **AudioFile** loaded and validated
2. **AnalysisResult** generated through feature extraction
3. **AIAnnotation** created from analysis results
4. **ProvenanceRecord** attached for tracking
5. **ValidationReport** generated if human annotations available

### Model Management
1. **ModelConfiguration** registered in system
2. Model loaded for analysis tasks
3. Performance metrics updated based on results
4. Model versioning tracked in provenance

## Relationships

- **AnalysisResult** → **AudioFile** (one-to-one)
- **AIAnnotation** → **AnalysisResult** (many-to-one)
- **AIAnnotation** → **ProvenanceRecord** (one-to-one)
- **ValidationReport** → **AIAnnotation** (one-to-one)
- **ChordSegment** → **AnalysisResult** (many-to-one)
- **ModelConfiguration** → **AnalysisResult** (many-to-many through model_versions)

## Schema Compliance

All **AIAnnotation** entities must validate against existing ADP JSON schemas:
- Annotation schema for basic structure
- Type-specific schemas for content validation
- Provenance schema for metadata tracking

Implementation must use the existing `jsonschema` validation framework to ensure compliance.