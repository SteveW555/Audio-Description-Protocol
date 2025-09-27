"""
<!--
ANNOTATION DATA MODEL - CORE ADP FUNCTIONALITY
==============================================================================
FILE PURPOSE:
    Defines the foundational annotation data model for audio clip descriptions.
    This is the core entity in the ADP system, representing labeled segments
    of audio with provenance, confidence, and quality metrics.

WHAT HAPPENS HERE:
    1. TimeRange: Defines temporal boundaries for audio segments
    2. Label: Individual classification labels with confidence scores
    3. Provenance: Tracks annotation creation context and lineage
    4. QualityMetrics: Computes annotation reliability and agreement metrics
    5. Annotation: Main class combining all annotation components

ARCHITECTURAL ROLE:
    - Foundation for all ADP annotation types (human, AI, musical)
    - Base class for inheritance by specialized annotation models
    - Core validation logic for temporal and confidence constraints
    - Quality metrics computation for annotation reliability assessment

KEY FEATURES:
    - Temporal validation ensuring end_sec > start_sec
    - Confidence score validation (0.0 to 1.0 range)
    - Automatic quality metrics computation
    - ISO 8601 timestamp handling for provenance
    - Extensible base for specialized annotation types

VALIDATION LOGIC:
    - Time range consistency checks
    - Label confidence score bounds
    - Schema version pattern matching
    - Provenance timestamp format validation
    - Quality metrics automatic computation

DEPENDENCIES:
    - pydantic: Data validation and serialization framework
    - datetime: Timestamp handling and ISO format support
    - typing: Type annotations for robust API contracts
==============================================================================
-->
"""

"""Annotation data model for audio clips."""

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, model_validator


class TimeRange(BaseModel):
    """
    <!-- Temporal boundary specification for audio segments with validation -->
    Time range specification for audio segments.

    Validates that end_sec > start_sec and provides duration calculation.
    """

    start_sec: float = Field(
        ...,
        ge=0,
        description="Start time in seconds from beginning of clip"
    )

    end_sec: float = Field(
        ...,
        ge=0,
        description="End time in seconds from beginning of clip"
    )

    @root_validator
    def validate_time_range(cls, values):
        """
        <!-- Ensures temporal consistency: end_sec > start_sec -->
        Validate that end_sec > start_sec.
        """
        start = values.get('start_sec')
        end = values.get('end_sec')

        if start is not None and end is not None:
            if end <= start:
                raise ValueError('end_sec must be greater than start_sec')

        return values

    @property
    def duration_sec(self) -> float:
        """
        <!-- Computes time span: end_sec - start_sec -->
        Calculate duration in seconds.
        """
        return self.end_sec - self.start_sec

    class Config:
        """Pydantic configuration."""
        schema_extra = {
            "example": {
                "start_sec": 0.0,
                "end_sec": 30.0
            }
        }


class Label(BaseModel):
    """
    <!-- Individual classification label with confidence scoring -->
    Label with confidence score.

    Represents a single classification label applied to an audio segment.
    """

    entry_id: str = Field(
        ...,
        description="ID of the dictionary entry used as label"
    )

    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for this label assignment"
    )

    class Config:
        """Pydantic configuration."""
        schema_extra = {
            "example": {
                "entry_id": "lo-fi-hip-hop",
                "confidence": 0.85
            }
        }


class Provenance(BaseModel):
    """
    <!-- Annotation creation metadata and lineage tracking -->
    Provenance information for annotations.

    Tracks who, when, and how an annotation was created.
    """

    annotator_type: Literal["human", "ai"] = Field(
        ...,
        description="Type of annotator that created this annotation"
    )

    timestamp: datetime = Field(
        ...,
        description="ISO 8601 timestamp when annotation was created"
    )

    annotator_id: Optional[str] = Field(
        None,
        description="Optional identifier for the specific annotator"
    )

    tool_version: Optional[str] = Field(
        None,
        description="Version of the annotation tool used"
    )

    session_id: Optional[str] = Field(
        None,
        description="Optional session identifier for grouping annotations"
    )

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "annotator_type": "human",
                "annotator_id": "researcher-001",
                "timestamp": "2025-09-26T10:30:00Z",
                "tool_version": "adp-annotator-v1.0"
            }
        }


class QualityMetrics(BaseModel):
    """
    <!-- Annotation reliability and agreement assessment -->
    Quality metrics for annotations.

    Provides measures of annotation quality and inter-annotator agreement.
    """

    inter_annotator_agreement: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Agreement score between multiple annotators"
    )

    confidence_avg: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Average confidence across all labels"
    )


class Annotation(BaseModel):
    """
    <!-- Core annotation entity combining temporal, semantic, and provenance data -->
    Base annotation model for audio clips.

    Primary data structure for describing labeled audio segments with full metadata.
    """

    id: str = Field(
        ...,
        description="Unique identifier for the annotation"
    )

    clip_id: str = Field(
        ...,
        description="Identifier of the audio clip this annotation refers to"
    )

    time_range: TimeRange = Field(
        ...,
        description="Time range within the audio clip"
    )

    labels: List[Label] = Field(
        ...,
        min_items=1,
        description="Array of labels with confidence scores"
    )

    provenance: Provenance = Field(
        ...,
        description="Provenance information"
    )

    schema_version: str = Field(
        ...,
        regex=r"^\d+\.\d+(?:\.\d+)*$",
        description="Version of the annotation schema used"
    )

    free_text: Optional[str] = Field(
        None,
        description="Optional free-text description of the audio content"
    )

    quality_metrics: Optional[QualityMetrics] = Field(
        None,
        description="Quality metrics for the annotation"
    )


    @model_validator(mode='before')
    @classmethod
    def compute_quality_metrics(cls, values):
        """
        <!-- Auto-calculates confidence averages and quality scores -->
        Compute quality metrics if not provided.
        """
        labels = values.get('labels', [])
        quality_metrics = values.get('quality_metrics')

        # Auto-compute confidence_avg if not provided
        if labels and (quality_metrics is None or quality_metrics.confidence_avg is None):
            avg_confidence = sum(label.confidence for label in labels) / len(labels)

            if quality_metrics is None:
                quality_metrics = QualityMetrics()

            if quality_metrics.confidence_avg is None:
                quality_metrics.confidence_avg = round(avg_confidence, 3)

            values['quality_metrics'] = quality_metrics

        return values

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
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
        }