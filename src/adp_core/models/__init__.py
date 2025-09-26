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