"""
<!--
ADP DATA MODELS MODULE INITIALIZATION
==============================================================================
FILE PURPOSE:
    Central import hub for all ADP data model classes. This file establishes
    the public API for the models package and manages cross-model dependencies.
    Provides a unified interface for working with ADP's structured data types.

WHAT HAPPENS HERE:
    1. Imports all data model classes from their respective modules
    2. Establishes the public API surface for the models package
    3. Manages import order to handle circular dependencies
    4. Defines __all__ for explicit control of public exports

ARCHITECTURAL ROLE:
    - API gateway for all ADP data models
    - Dependency management for cross-model relationships
    - Public interface standardization
    - Import optimization through centralized access

MODELS EXPOSED:
    Core Models:
        - Annotation: Base audio annotation with labels and provenance
        - Label: Individual label with confidence scoring
        - TimeRange: Time segment specification for audio clips
        - Provenance: Annotation creation metadata and lineage

    Dictionary Models:
        - DictionaryEntry: Standardized vocabulary definitions

    Dataset Models:
        - Dataset: Audio collection manifests with metadata
        - AudioClip: Individual audio file metadata
        - AnnotationReference: References to annotation files
        - DictionaryReference: References to dictionary entries

    AI/ML Models:
        - ModelOutput: AI-generated annotations with inference metadata
        - InferenceMeta: Model execution context and performance data

    Musical Models:
        - MusicalAnnotation: Extended annotations for detailed music analysis
        - MusicalAnalysis: Comprehensive musical feature extraction

DEPENDENCIES:
    - pydantic: For data validation and serialization
    - datetime: For timestamp handling
    - typing: For type annotations and generics
==============================================================================
-->
"""

"""Data models for the Audio Description Protocol."""

from .dictionary import DictionaryEntry
from .annotation import Annotation, Label, TimeRange, Provenance
from .dataset import Dataset, AudioClip, AnnotationReference, DictionaryReference
from .model_output import ModelOutput, InferenceMeta
from .musical_annotation import MusicalAnnotation, MusicalAnalysis

__all__ = [
    "DictionaryEntry",
    "Annotation",
    "Label",
    "TimeRange",
    "Provenance",
    "Dataset",
    "AudioClip",
    "AnnotationReference",
    "DictionaryReference",
    "ModelOutput",
    "InferenceMeta",
    "MusicalAnnotation",
    "MusicalAnalysis",
]