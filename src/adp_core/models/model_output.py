"""
<!--
MODEL OUTPUT DATA MODEL - AI ANNOTATION FRAMEWORK
==============================================================================
FILE PURPOSE:
    Extends base annotations with AI model inference metadata, uncertainty
    quantification, and explainability information. Specialized for machine
    learning model outputs with comprehensive inference context tracking.

WHAT HAPPENS HERE:
    1. PreprocessingInfo: Audio preprocessing metadata for model inputs
    2. EnsembleInfo: Multi-model ensemble configuration and voting
    3. UncertaintyInfo: Prediction confidence and calibration metrics
    4. ExplainabilityInfo: Model interpretability and attention weights
    5. InferenceMeta: Core model execution context and performance
    6. ModelProvenance: AI-specific provenance with annotator constraints
    7. ModelOutput: Complete AI annotation with all metadata

ARCHITECTURAL ROLE:
    - Specialized annotation for AI/ML model outputs
    - Comprehensive inference metadata tracking
    - Model performance and reliability assessment
    - Explainability and interpretability support
    - Ensemble model result aggregation

KEY FEATURES:
    - Enforced AI annotator type validation
    - Inference timing and hardware context tracking
    - Uncertainty quantification with entropy and confidence intervals
    - Ensemble voting strategy configuration
    - Model explainability through attention and feature importance
    - Preprocessing step documentation for reproducibility
    - Comparison target linking for evaluation workflows

VALIDATION LOGIC:
    - AI annotator type enforcement
    - Model weight normalization validation
    - Confidence interval bounds checking
    - Inference time non-negative validation
    - Hardware context enumeration
    - Feature importance score validation

DEPENDENCIES:
    - annotation: Base annotation model inheritance
    - pydantic: Data validation and serialization
    - datetime: Timestamp handling
    - typing: Type annotations for metadata flexibility
==============================================================================
-->
"""

"""Model output data model extending annotation."""

from datetime import datetime
from typing import Dict, Any, Optional, List, Literal
from pydantic import BaseModel, Field, validator

from .annotation import Annotation, Provenance


class PreprocessingInfo(BaseModel):
    """
    <!-- Audio preprocessing metadata for model input preparation -->
    Preprocessing information for model inference.
    """

    sample_rate: Optional[int] = Field(
        None,
        ge=8000,
        description="Sample rate used for preprocessing"
    )

    window_size_sec: Optional[float] = Field(
        None,
        ge=0,
        description="Analysis window size in seconds"
    )

    hop_length_sec: Optional[float] = Field(
        None,
        ge=0,
        description="Hop length for windowed analysis"
    )

    features: Optional[List[str]] = Field(
        None,
        description="Audio features extracted for model input"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "sample_rate": 22050,
                "window_size_sec": 0.025,
                "hop_length_sec": 0.010,
                "features": ["mfcc", "spectral_centroid", "zero_crossing_rate"]
            }
        }


class EnsembleInfo(BaseModel):
    """
    <!-- Multi-model ensemble configuration and voting strategies -->
    Ensemble model information.
    """

    is_ensemble: bool = Field(
        ...,
        description="Whether this output is from an ensemble of models"
    )

    model_weights: Optional[Dict[str, float]] = Field(
        None,
        description="Weights for each model in ensemble"
    )

    voting_strategy: Optional[Literal["majority", "weighted", "confidence_based"]] = Field(
        None,
        description="Strategy used to combine ensemble predictions"
    )

    @validator('model_weights')
    def validate_weights(cls, v):
        """
        <!-- Ensures ensemble weights are properly normalized -->
        Validate model weights are between 0 and 1.
        """
        if v is not None:
            for weight in v.values():
                if not 0 <= weight <= 1:
                    raise ValueError('Model weights must be between 0 and 1')
        return v


class UncertaintyInfo(BaseModel):
    """
    <!-- Prediction confidence metrics and calibration scores -->
    Uncertainty quantification for model predictions.
    """

    prediction_entropy: Optional[float] = Field(
        None,
        ge=0,
        description="Entropy of the prediction distribution"
    )

    confidence_interval: Optional[Dict[str, float]] = Field(
        None,
        description="Confidence interval for the prediction"
    )

    calibration_score: Optional[float] = Field(
        None,
        ge=0,
        le=1,
        description="Model calibration score indicating reliability"
    )

    @validator('confidence_interval')
    def validate_confidence_interval(cls, v):
        """
        <!-- Ensures confidence intervals have proper bounds -->
        Validate confidence interval format.
        """
        if v is not None:
            required_keys = {'lower', 'upper'}
            if not required_keys.issubset(v.keys()):
                raise ValueError('Confidence interval must have "lower" and "upper" keys')

            lower, upper = v['lower'], v['upper']
            if not (0 <= lower <= 1 and 0 <= upper <= 1 and lower <= upper):
                raise ValueError('Confidence interval bounds must be between 0 and 1 with lower <= upper')
        return v


class ExplainabilityInfo(BaseModel):
    """
    <!-- Model interpretability through attention and feature importance -->
    Model explainability information.
    """

    attention_weights: Optional[List[float]] = Field(
        None,
        description="Attention weights over time for transformer-based models"
    )

    feature_importance: Optional[Dict[str, float]] = Field(
        None,
        description="Importance scores for input features"
    )

    grad_cam: Optional[str] = Field(
        None,
        description="Path to Grad-CAM visualization file"
    )


class InferenceMeta(BaseModel):
    """
    <!-- Core model execution context and performance metrics -->
    Inference metadata for model outputs.
    """

    model_name: str = Field(
        ...,
        description="Name of the AI model that generated this output"
    )

    model_version: str = Field(
        ...,
        description="Version identifier of the model"
    )

    inference_time_ms: Optional[float] = Field(
        None,
        ge=0,
        description="Time taken to generate this prediction in milliseconds"
    )

    hardware_context: Optional[Literal["CPU", "GPU", "TPU", "CUDA", "Metal", "OpenCL"]] = Field(
        None,
        description="Hardware platform used for inference"
    )

    parameters: Optional[Dict[str, Any]] = Field(
        None,
        description="Model parameters or hyperparameters used for inference"
    )

    preprocessing: Optional[PreprocessingInfo] = Field(
        None,
        description="Preprocessing steps applied to the audio"
    )

    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "model_name": "MusicGenreClassifier",
                "model_version": "2.1.0",
                "inference_time_ms": 150.5,
                "hardware_context": "GPU",
                "parameters": {
                    "temperature": 0.7,
                    "top_k": 5
                },
                "preprocessing": {
                    "sample_rate": 22050,
                    "features": ["mel_spectrogram"]
                }
            }
        }


class ModelProvenance(Provenance):
    """
    <!-- AI-specific provenance with enforced annotator type -->
    Provenance for model outputs with AI constraint.
    """

    annotator_type: Literal["ai"] = Field(
        "ai",
        description="Must be 'ai' for model outputs"
    )

    annotator_id: Optional[str] = Field(
        None,
        description="Model identifier (same as inference_meta.model_name)"
    )

    tool_version: Optional[str] = Field(
        None,
        description="Version of inference framework or tool"
    )


class ModelOutput(Annotation):
    """
    <!-- Complete AI annotation with inference metadata and uncertainty -->
    Model output extending annotation with inference metadata.
    """

    inference_meta: InferenceMeta = Field(
        ...,
        description="Inference metadata"
    )

    provenance: ModelProvenance = Field(
        ...,
        description="Provenance information (must be AI)"
    )

    comparison_target: Optional[str] = Field(
        None,
        description="Optional ID of human annotation to compare against for evaluation"
    )

    ensemble_info: Optional[EnsembleInfo] = Field(
        None,
        description="Information about ensemble model predictions"
    )

    uncertainty: Optional[UncertaintyInfo] = Field(
        None,
        description="Uncertainty quantification for model predictions"
    )

    explainability: Optional[ExplainabilityInfo] = Field(
        None,
        description="Model explainability information"
    )

    @validator('provenance')
    def validate_ai_provenance(cls, v):
        """
        <!-- Enforces AI annotator type for model outputs -->
        Ensure provenance is for AI annotator.
        """
        if v.annotator_type != "ai":
            raise ValueError('Model output provenance must have annotator_type="ai"')
        return v

    class Config:
        """Pydantic configuration."""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
        json_schema_extra = {
            "example": {
                "id": "model-output-001",
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
                    "annotator_id": "music-analyzer-v2.1",
                    "timestamp": "2025-09-26T10:45:00Z"
                },
                "schema_version": "1.0",
                "inference_meta": {
                    "model_name": "MusicGenreClassifier",
                    "model_version": "2.1.0",
                    "inference_time_ms": 150.5,
                    "hardware_context": "GPU",
                    "parameters": {
                        "temperature": 0.7,
                        "top_k": 5
                    }
                },
                "comparison_target": "annotation-001"
            }
        }