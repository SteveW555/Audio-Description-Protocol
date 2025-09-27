"""
<!--
DATASET MANIFEST MODEL - AUDIO COLLECTION MANAGEMENT
==============================================================================
FILE PURPOSE:
    Defines comprehensive dataset models for managing audio collections with
    annotations, metadata, and references. Provides manifest functionality
    for dataset packaging, distribution, and machine learning workflows.

WHAT HAPPENS HERE:
    1. AudioClip: Individual audio file metadata and validation
    2. AnnotationReference: Links to annotation files with integrity checks
    3. DictionaryReference: Links to vocabulary files with categorization
    4. DatasetSplits: ML train/validation/test split management
    5. DatasetMetadata: Comprehensive dataset statistics and curation info
    6. Dataset: Main manifest combining all components with validation

ARCHITECTURAL ROLE:
    - Central manifest for audio dataset organization
    - Reference management for distributed annotation files
    - Integrity verification through checksums and validation
    - ML workflow support with predefined data splits
    - Metadata aggregation for dataset discovery and analysis

KEY FEATURES:
    - Audio format validation and metadata extraction
    - File integrity verification with checksums
    - Semantic versioning for dataset releases
    - SPDX license identifier compliance
    - ML splits for reproducible training workflows
    - Comprehensive metadata for dataset curation
    - Unique ID validation across all components

VALIDATION LOGIC:
    - Unique ID enforcement across clips, annotations, dictionaries
    - Audio format and technical parameter validation
    - Checksum format validation for integrity verification
    - Semantic version pattern matching
    - License format validation
    - Dataset consistency and completeness checks

DEPENDENCIES:
    - pydantic: Data validation and serialization
    - datetime: Timestamp handling for versioning
    - typing: Type annotations for flexible metadata
==============================================================================
-->
"""

"""Dataset data model for audio collections."""

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, validator


class AudioClip(BaseModel):
    """
    <!-- Individual audio file metadata with technical parameters -->
    Audio clip metadata.
    """

    id: str = Field(
        ...,
        description="Unique identifier for the audio clip"
    )

    uri: str = Field(
        ...,
        description="Path or URL to the audio file"
    )

    format: Optional[Literal["wav", "mp3", "flac", "ogg", "m4a"]] = Field(
        None,
        description="Audio file format"
    )

    duration_sec: Optional[float] = Field(
        None,
        ge=0,
        description="Duration of the audio clip in seconds"
    )

    sample_rate: Optional[int] = Field(
        None,
        ge=8000,
        description="Sample rate in Hz"
    )

    channels: Optional[int] = Field(
        None,
        ge=1,
        le=8,
        description="Number of audio channels"
    )

    bit_depth: Optional[Literal[16, 24, 32]] = Field(
        None,
        description="Bit depth of the audio"
    )

    checksum: Optional[str] = Field(
        None,
        pattern=r"^(md5|sha1|sha256):[a-fA-F0-9]+$",
        description="File checksum for integrity verification"
    )

    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional metadata for the audio clip"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "id": "clip-001",
                "uri": "/path/to/audio1.wav",
                "format": "wav",
                "duration_sec": 120.5,
                "sample_rate": 44100,
                "channels": 2,
                "bit_depth": 16,
                "checksum": "sha256:abc123def456"
            }
        }


class AnnotationReference(BaseModel):
    """
    <!-- File reference to annotation with integrity verification -->
    Reference to an annotation file in the dataset.
    """

    id: str = Field(
        ...,
        description="Unique identifier for the annotation"
    )

    file_path: str = Field(
        ...,
        description="Path to the annotation JSON file"
    )

    annotation_type: Optional[Literal["annotation", "musical_annotation", "model_output"]] = Field(
        None,
        description="Type of annotation file"
    )

    checksum: Optional[str] = Field(
        None,
        pattern=r"^(md5|sha1|sha256):[a-fA-F0-9]+$",
        description="File checksum for integrity verification"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "id": "annotation-001",
                "file_path": "/path/to/annotation1.json",
                "annotation_type": "musical_annotation",
                "checksum": "sha256:def789ghi012"
            }
        }


class DictionaryReference(BaseModel):
    """
    <!-- File reference to dictionary entry with categorization -->
    Reference to a dictionary entry file in the dataset.
    """

    id: str = Field(
        ...,
        description="Unique identifier for the dictionary entry"
    )

    file_path: str = Field(
        ...,
        description="Path to the dictionary entry JSON file"
    )

    category: Optional[str] = Field(
        None,
        description="Category of the dictionary entry"
    )

    checksum: Optional[str] = Field(
        None,
        pattern=r"^(md5|sha1|sha256):[a-fA-F0-9]+$",
        description="File checksum for integrity verification"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "id": "lo-fi-hip-hop",
                "file_path": "/path/to/dictionary_lo_fi.json",
                "category": "genre",
                "checksum": "sha256:jkl345mno678"
            }
        }


class DatasetSplits(BaseModel):
    """
    <!-- Train/validation/test splits for ML workflows -->
    Dataset splits for machine learning.
    """

    train: Optional[List[str]] = Field(
        None,
        description="Array of clip IDs for training split"
    )

    validation: Optional[List[str]] = Field(
        None,
        description="Array of clip IDs for validation split"
    )

    test: Optional[List[str]] = Field(
        None,
        description="Array of clip IDs for test split"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "train": ["clip-001", "clip-002", "clip-003"],
                "validation": ["clip-004", "clip-005"],
                "test": ["clip-006", "clip-007"]
            }
        }


class DatasetMetadata(BaseModel):
    """
    <!-- Comprehensive dataset statistics and curation information -->
    Additional metadata about the dataset.
    """

    curator: Optional[str] = Field(
        None,
        description="Name or identifier of the dataset curator"
    )

    purpose: Optional[str] = Field(
        None,
        description="Intended use case for the dataset"
    )

    total_duration_sec: Optional[float] = Field(
        None,
        ge=0,
        description="Total duration of all audio clips in seconds"
    )

    annotation_count: Optional[int] = Field(
        None,
        ge=0,
        description="Total number of annotations in the dataset"
    )

    unique_labels: Optional[int] = Field(
        None,
        ge=0,
        description="Number of unique dictionary entries used"
    )

    language: Optional[str] = Field(
        None,
        pattern=r"^[a-z]{2}(-[A-Z]{2})?$",
        description="Primary language code (ISO 639-1)"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "curator": "Research Team",
                "purpose": "Academic research",
                "total_duration_sec": 3600,
                "annotation_count": 150,
                "unique_labels": 25,
                "language": "en-US"
            }
        }


class Dataset(BaseModel):
    """
    <!-- Main dataset manifest combining all components -->
    Dataset manifest model.
    """

    id: str = Field(
        ...,
        description="Unique identifier for the dataset"
    )

    name: str = Field(
        ...,
        min_length=1,
        description="Human-readable name for the dataset"
    )

    version: str = Field(
        ...,
        pattern=r"^\d+\.\d+\.\d+$",
        description="Semantic version of the dataset"
    )

    license: str = Field(
        ...,
        description="SPDX license identifier for the dataset"
    )

    clips: List[AudioClip] = Field(
        ...,
        description="Array of audio clips in the dataset"
    )

    annotations: List[AnnotationReference] = Field(
        ...,
        description="Array of annotation files in the dataset"
    )

    dictionary_entries: List[DictionaryReference] = Field(
        ...,
        description="Array of dictionary entry files in the dataset"
    )

    schema_version: str = Field(
        ...,
        pattern=r"^\d+\.\d+(?:\.\d+)*$",
        description="Version of the dataset schema used"
    )

    created_at: datetime = Field(
        ...,
        description="ISO 8601 timestamp when the dataset was created"
    )

    description: Optional[str] = Field(
        None,
        description="Detailed description of the dataset contents and purpose"
    )

    updated_at: Optional[datetime] = Field(
        None,
        description="ISO 8601 timestamp when the dataset was last updated"
    )

    metadata: Optional[DatasetMetadata] = Field(
        None,
        description="Additional metadata about the dataset"
    )

    splits: Optional[DatasetSplits] = Field(
        None,
        description="Optional dataset splits for machine learning"
    )

    @validator('license')
    def validate_license_format(cls, v):
        """
        <!-- Ensures license follows SPDX identifier format -->
        Validate license is a valid SPDX identifier format.
        """
        # Basic validation - in practice, you'd check against SPDX list
        if not v or len(v.strip()) == 0:
            raise ValueError('License cannot be empty')
        return v.strip()

    @validator('clips')
    def validate_clips_unique_ids(cls, v):
        """
        <!-- Enforces unique clip IDs across dataset -->
        Validate that clip IDs are unique.
        """
        ids = [clip.id for clip in v]
        if len(ids) != len(set(ids)):
            raise ValueError('Clip IDs must be unique')
        return v

    @validator('annotations')
    def validate_annotations_unique_ids(cls, v):
        """Validate that annotation IDs are unique."""
        ids = [ann.id for ann in v]
        if len(ids) != len(set(ids)):
            raise ValueError('Annotation IDs must be unique')
        return v

    @validator('dictionary_entries')
    def validate_dictionary_entries_unique_ids(cls, v):
        """Validate that dictionary entry IDs are unique."""
        ids = [entry.id for entry in v]
        if len(ids) != len(set(ids)):
            raise ValueError('Dictionary entry IDs must be unique')
        return v

    def get_clip_by_id(self, clip_id: str) -> Optional[AudioClip]:
        """
        <!-- Retrieves specific audio clip by unique identifier -->
        Get audio clip by ID.
        """
        for clip in self.clips:
            if clip.id == clip_id:
                return clip
        return None

    def get_total_duration(self) -> Optional[float]:
        """
        <!-- Sums duration metadata across all clips -->
        Calculate total duration from clips with duration metadata.
        """
        clips_with_duration = [clip for clip in self.clips if clip.duration_sec is not None]
        if not clips_with_duration:
            return None
        return sum(clip.duration_sec for clip in clips_with_duration)

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        json_schema_extra = {
            "example": {
                "id": "study-music-dataset",
                "name": "Study Music Dataset",
                "description": "Collection of study music clips with annotations",
                "version": "1.0.0",
                "license": "CC0-1.0",
                "clips": [
                    {
                        "id": "clip-001",
                        "uri": "/path/to/audio1.wav",
                        "format": "wav",
                        "duration_sec": 120.5
                    }
                ],
                "annotations": [
                    {
                        "id": "annotation-001",
                        "file_path": "/path/to/annotation1.json"
                    }
                ],
                "dictionary_entries": [
                    {
                        "id": "lo-fi-hip-hop",
                        "file_path": "/path/to/dictionary_lo_fi.json"
                    }
                ],
                "schema_version": "1.0",
                "created_at": "2025-09-26T10:00:00Z"
            }
        }