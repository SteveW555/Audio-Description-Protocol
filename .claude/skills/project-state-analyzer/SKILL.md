---
name: project-state-analyzer
description: Analyze AutoEncoder project specifications to provide high-level answers about development state, feature priorities, research goals, and constraints
---

# Project State Analyzer

## Overview

This Skill reads and analyzes the specs directory to provide comprehensive answers about the current development state of the AutoEncoder research project. It enables quick understanding of project goals, feature roadmap, research constraints, success criteria, and common pitfalls. Use this skill to answer questions about "what are we building?", "what's the current focus?", "what are the constraints?", and "what are we measuring?"

## Project Goal

The AutoEncoder project is exploratory research that trains deep convolutional autoencoders to investigate whether AI-generated music and human-created music form distinct clusters in a compressed 16-dimensional latent space. The goal is unsupervised learning research to detect AI-generated music through latent space clustering analysis.

## Active Features

### Feature 001: Autoencoder AI Music Detector (Foundation)

- **Status**: Draft
- **Branch**: `001-autoencoder-ai-detector`
- **Priority**: P1 - All downstream features depend on this
- **Goal**: Core unsupervised learning system
- **Key Components**:
  - 4-layer CNN autoencoder with 16D bottleneck
  - Stratified 80/20 train/validation split
  - Global normalization (dataset-wide min/max to [-1,1])
  - Clustering metrics: silhouette, Davies-Bouldin, cluster purity
  - 2D visualizations: PCA and t-SNE
  - Configuration-driven (YAML, no code changes needed)

### Feature 002: Persistent WAV Chunk Caching (Optimization)

- **Status**: Draft
- **Branch**: `002-persistent-wav-chunk`
- **Priority**: P1/P2 - Improves workflow efficiency
- **Goal**: Deterministic, reproducible spectrogram generation
- **Key Benefits**:
  - Byte-for-byte identical spectrogram reproduction
  - 2x faster spectrogram generation from cache
  - Incremental cache updates (only new/modified files)
  - Shareable preprocessed datasets

### Feature 003: Multi-Headed Autoencoder (Current - Analysis)

- **Status**: Draft
- **Branch**: `003-multi-headed-autoencoder`
- **Priority**: P1/P2 - Provides interpretability
- **Goal**: Supervised classification with reconstruction quality
- **Key Additions**:
  - Dual-loss training: reconstruction + classification
  - Configurable loss weighting (reconstruction=1.0, classification=0.1 default)
  - Binary classifier head (16D → 1 output)
  - Dimension importance analysis
  - Transfer learning support
  - Easy architecture switching via config

## Development Dependency Chain

Feature 001 (Foundation - Single-Head)
    ↓
    ├→ Feature 002 (Optimization - WAV Caching)
    └→ Feature 003 (Analysis - Multi-Headed)

Feature 001 is critical foundation. Features 002 & 003 can progress somewhat independently once 001 is solid.

## Core Research Constraints

1. **16D Bottleneck**: Fixed research constraint (not a hyperparameter)
2. **Unsupervised Training** (Feature 001): Labels only used post-training
3. **Global Normalization**: Dataset-wide min/max statistics (not per-sample)
4. **44.1kHz Mono**: Fixed audio sample rate and channel config
5. **5-Second Chunks**: Non-overlapping segments only, discard incomplete chunks

## Critical Edge Cases

### Data Quality

- **Imbalanced datasets**: Warn if AI/Real ratio differs from 50/50
- **Short audio**: Discard chunks <5 seconds (no padding)
- **Corrupted files**: Log and skip, continue processing
- **Low disk space**: Calculate required space beforehand, warn before extraction

### Training

- **GPU OOM**: Catch error and suggest reducing batch_size
- **Non-convergence**: Early stopping detects, alerts researcher
- **Training instability**: Oscillating losses trigger diagnostic warnings

### Analysis

- **No clustering**: VALID research outcome (not failure)
- **Uniform dimension importance**: Valid finding (not failure)
- **Low classification accuracy**: Investigate data quality or loss weighting
- **Model type mismatch**: Refuse loading incompatible checkpoint

## Success Criteria by Feature

### Feature 001

- ✅ Convergent reconstruction loss curves
- ✅ MAE < 0.10 on normalized spectrograms
- ✅ Early stopping triggers appropriately
- ✅ 95%+ edge case handling without crashes
- ✅ Clear reporting of positive OR negative results

### Feature 002

- ✅ 1000 files cached in <30 minutes
- ✅ Byte-for-byte identical spectrogram output
- ✅ 2x faster generation from cache
- ✅ Incremental updates skip 90%+ unchanged files
- ✅ 100% configuration mismatch detection

### Feature 003

- ✅ Classification accuracy >70% (vs 50% random)
- ✅ Reconstruction MAE < 0.10 (comparable to single-head)
- ✅ Both losses converge within 100 epochs
- ✅ Non-uniform dimension importance revealed
- ✅ Transfer learning reduces training time by 30%

## Current Development Focus

**Current Branch**: `003-multi-headed-autoencoder`

Active work on multi-headed architecture and dual-loss training. Recent progress includes Python 3.11+/PyTorch 2.7+ integration, code structure refinement, and comprehensive documentation.

## Technology Stack

- **Python**: 3.11+
- **Deep Learning**: PyTorch 2.7+
- **Audio**: librosa
- **ML**: scikit-learn (clustering), UMAP (visualization)
- **Viz**: matplotlib
- **Hardware**: NVIDIA GPU 8GB+ VRAM (RTX 3080/4080/5080)
- **Note**: RTX 5080 requires CUDA 12.8+ and PyTorch 2.7.0+

## Data Processing Requirements

### Audio Preprocessing

1. Convert to mono
2. Resample to 44.1kHz
3. Segment into 5-second non-overlapping chunks
4. Discard incomplete chunks

### Spectrogram Generation

- Support mel or STFT spectrograms (configurable)
- Compute global min/max across entire dataset
- Normalize to [-1,1] using global statistics
- Result: Byte-for-byte reproducible spectrograms

### Data Split

- 80% training / 20% validation
- Stratified sampling (equal AI/Real proportions)
- Labels for analysis only (Feature 001), labels required for training (Feature 003)

## Configuration System

- **Format**: YAML files in `config/` directory
- **Validation**: JSON schema via `src/utils/config_loader.py`
- **Philosophy**: No code changes needed for experiments
- **Parameters**: Audio settings, spectrogram settings, model architecture, training settings, analysis settings
- **Feature-specific**: model_type (single_head/multi_head), reconstruction_weight, classification_weight

## Output File Formats

- **Model checkpoints**: `.pth` (PyTorch)
- **Training metrics**: `.json` (per-epoch loss and classification metrics)
- **Latent vectors**: `.csv` or `.json`
- **Clustering metrics**: `.json`
- **Visualizations**: `.png` (PCA, t-SNE, importance charts)
- **Cache metadata**: `.json` (configuration, counts, timestamps)
- **Dimension importance**: `.json` (ranked scores)

## Error Handling Philosophy

1. **Log and Continue**: Document errors but don't crash
2. **Graceful Degradation**: Skip problematic files, report counts
3. **Clear Diagnostics**: Suggest remediation actions
4. **No Silent Failures**: Always report what succeeded/failed
5. **Edge Case Validation**: Early stopping, config validation, memory checks

## Research Philosophy

- **Negative results are valid**: No clustering is scientifically valuable
- **Outcomes are measurable, not guaranteed**: Objective measurement without bias
- **Learning focus**: Understand whether AI/Real music cluster
- **Interpretability matters**: Feature 003 reveals discriminative latent dimensions
- **Both approaches compared**: Single-head (unsupervised) vs multi-head (supervised)

## Common Pitfalls to Avoid

1. ❌ Using labels during training (Feature 001): Breaks unsupervised paradigm
2. ❌ Per-spectrogram normalization: Use global statistics only
3. ❌ Changing 16D bottleneck: Research constraint is non-negotiable
4. ❌ Treating "no clustering" as failure: Valid research outcome
5. ❌ Modifying sample rate: Must always be 44.1kHz
6. ❌ Overlapping audio chunks: Must be non-overlapping 5-second segments
7. ❌ Mismatched batch sizes: Same batch size for training and inference
8. ❌ Model checkpoint conflicts: Use distinct naming for single-head vs multi-head

## Key Assumptions

### Core Research Assumptions

- 16D latent space captures AI-detection patterns
- 5-second chunks provide sufficient temporal context
- Mel spectrograms are effective (STFT may outperform)
- Standard clustering metrics are appropriate
- Researchers have GPU with 8GB+ VRAM

### Negative Result Validity

- No clustering = valid scientific finding
- Uniform dimension importance = valid finding
- Low classification accuracy (55%) = weak signal (valid)

### Dataset Assumptions

- Minimum 500 samples per class (optimal 1000+)
- AI-generated from modern generators (MusicGen, Stable Audio, Jukebox)
- Real music spans multiple genres
- Audio files legally obtained and properly labeled

## When to Reference This Skill

Use this skill when you need to:

- Understand overall project goals and roadmap
- Clarify feature dependencies and priority
- Explain research constraints to others
- Understand success criteria and measurable outcomes
- Identify edge cases and error handling requirements
- Understand configuration options and requirements
- Answer "what are we building?" or "what are we measuring?"
- Identify common pitfalls to avoid
- Understand data processing requirements
- Clarify when negative results are valid outcomes

## Quick Reference Examples

**"What's the project about?"**
→ Exploratory research investigating whether AI-generated and real music cluster distinctly in a 16D compressed latent space using unsupervised autoencoders.

**"What are the three features?"**
→ Feature 001 (baseline single-head autoencoder), Feature 002 (WAV chunk caching for reproducibility), Feature 003 (multi-headed with classification).

**"What's the current focus?"**
→ Feature 003: Multi-headed architecture with dual-loss training for interpretable AI detection.

**"What are the core constraints?"**
→ Fixed 16D bottleneck, global normalization, 44.1kHz mono, non-overlapping 5-second chunks, stratified 80/20 split.

**"When is a negative result valid?"**
→ Always. If no clustering appears (AI/Real overlap) or all dimensions equally important or classification accuracy barely beats random, these are scientifically valid findings.

**"What makes a model successful?"**
→ Feature 001: Convergent loss < 0.10 MAE, handles 95%+ edge cases. Feature 002: 2x faster, byte-for-byte identical. Feature 003: >70% classification, MAE < 0.10.
