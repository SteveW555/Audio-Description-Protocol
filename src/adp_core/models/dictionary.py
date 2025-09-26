"""Dictionary entry data model."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator


class DictionaryEntry(BaseModel):
    """Dictionary entry model for standardized audio labels."""

    id: str = Field(
        ...,
        regex=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="Unique identifier for the dictionary entry (kebab-case)"
    )

    label: str = Field(
        ...,
        min_length=1,
        description="Human-readable label for the entry"
    )

    definition: str = Field(
        ...,
        min_length=10,
        description="Detailed definition of what this label represents"
    )

    schema_version: str = Field(
        ...,
        regex=r"^\d+\.\d+(?:\.\d+)*$",
        description="Version of the dictionary schema used"
    )

    category: Optional[str] = Field(
        None,
        description="Optional category classification for the entry"
    )

    synonyms: Optional[List[str]] = Field(
        None,
        description="Alternative terms or labels that refer to the same concept"
    )

    parent_id: Optional[str] = Field(
        None,
        regex=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="Optional parent entry ID for hierarchical classification"
    )

    related_ids: Optional[List[str]] = Field(
        None,
        description="Related dictionary entry IDs"
    )

    created_at: Optional[datetime] = Field(
        None,
        description="ISO 8601 timestamp when the entry was created"
    )

    updated_at: Optional[datetime] = Field(
        None,
        description="ISO 8601 timestamp when the entry was last updated"
    )

    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional metadata for the dictionary entry"
    )

    @validator('synonyms', each_item=True)
    def validate_synonyms(cls, v):
        """Validate that synonyms are non-empty strings."""
        if not v or len(v.strip()) == 0:
            raise ValueError('Synonym cannot be empty')
        return v.strip()

    @validator('related_ids', each_item=True)
    def validate_related_ids(cls, v):
        """Validate related ID format."""
        import re
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError('Related ID must be in kebab-case format')
        return v

    @validator('metadata')
    def validate_metadata(cls, v):
        """Validate metadata contains expected optional fields."""
        if v is None:
            return v

        # Validate usage_frequency if present
        if 'usage_frequency' in v:
            freq = v['usage_frequency']
            if not isinstance(freq, (int, float)) or freq < 0:
                raise ValueError('usage_frequency must be a non-negative number')

        # Validate confidence_threshold if present
        if 'confidence_threshold' in v:
            threshold = v['confidence_threshold']
            if not isinstance(threshold, (int, float)) or not 0 <= threshold <= 1:
                raise ValueError('confidence_threshold must be between 0 and 1')

        return v

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
        schema_extra = {
            "example": {
                "id": "lo-fi-hip-hop",
                "label": "Lo-Fi Hip Hop",
                "definition": "A subgenre of hip hop music characterized by relaxed tempo, nostalgic atmosphere, and vinyl crackle effects",
                "schema_version": "1.0",
                "category": "genre",
                "synonyms": ["lofi hip hop", "chillhop"],
                "parent_id": "hip-hop",
                "related_ids": ["instrumental", "chill"],
                "created_at": "2025-09-26T10:00:00Z",
                "metadata": {
                    "usage_frequency": 0.85,
                    "confidence_threshold": 0.7
                }
            }
        }