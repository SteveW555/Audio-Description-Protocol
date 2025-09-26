"""Annotation data model for audio clips."""

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field, validator, root_validator


class TimeRange(BaseModel):
    """Time range specification for audio segments."""

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
        """Validate that end_sec > start_sec."""
        start = values.get('start_sec')
        end = values.get('end_sec')

        if start is not None and end is not None:
            if end <= start:
                raise ValueError('end_sec must be greater than start_sec')

        return values

    @property
    def duration_sec(self) -> float:
        """Calculate duration in seconds."""
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
    """Label with confidence score."""

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
    """Provenance information for annotations."""

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
    """Quality metrics for annotations."""

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
    """Base annotation model for audio clips."""

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

    @validator('labels')
    def validate_labels_not_empty(cls, v):
        """Ensure labels list is not empty."""
        if not v:
            raise ValueError('Labels cannot be empty')
        return v

    @root_validator
    def compute_quality_metrics(cls, values):
        """Compute quality metrics if not provided."""
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