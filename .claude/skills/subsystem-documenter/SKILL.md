---
name: subsystem-documenter
description: Create or update technical documentation in docs/ for AutoEncoder project subsystems, with intelligent codebase analysis and cross-referencing
---

# Subsystem Documenter

## Overview

The Subsystem Documenter skill enables Claude to create or update comprehensive technical documentation for specific aspects, topics, or subsystems of the AutoEncoder AI Music Detector project. This skill handles documentation generation for any project component, from high-level architectural overviews to detailed implementation guides.

**Key Capabilities:**
- Automatically discovers and analyzes relevant source code files
- Creates well-structured markdown documentation in the `docs/` directory
- Generates intelligent cross-references with clickable file links
- Infers appropriate documentation structure based on topic type
- Updates existing documentation while preserving important content
- Asks clarifying questions when ambiguity exists

## When to Use This Skill

Invoke this skill when you need to:

1. **Document a new subsystem**: User requests documentation for a specific component (e.g., "Document the multi-head training system")
2. **Update existing docs**: Refresh documentation after significant code changes
3. **Create architectural overviews**: High-level explanations of system design
4. **Write implementation guides**: Detailed technical documentation for developers
5. **Cross-reference components**: Document how different subsystems interact

**Example Triggers:**
- "Document the clustering analysis pipeline"
- "Create documentation for the data preprocessing subsystem"
- "Update the multi-head training docs"
- "Write an overview of the visualization module"
- "Document how audio segmentation works"

## Documentation Workflow

### Step 1: Clarify the Topic

When invoked, always start by clarifying:

```
Which subsystem or topic would you like me to document?

Examples:
- Multi-head training architecture
- Clustering analysis pipeline
- Data preprocessing workflow
- Audio spectrogram generation
- Configuration system
- Model architecture (encoder/decoder)
- Latent space visualization
- Training loop and early stopping
```

If the user's request is ambiguous, ask targeted questions:
- "Should this cover just the training loop or also the data loader?"
- "Do you want implementation details or a high-level overview?"
- "Should I include usage examples?"

### Step 2: Discover Relevant Files

Use intelligent search to find related files:

**Search Strategy by Topic Type:**

1. **Architecture/Models**: Search `src/models/`, config files, training scripts
2. **Training Systems**: Search `src/training/`, `src/cli/train*.py`, config files
3. **Analysis/Visualization**: Search `src/analysis/`, `src/cli/analyze*.py`, `src/cli/visualize*.py`
4. **Preprocessing/Data**: Search `src/preprocessing/`, `src/training/data_loader.py`
5. **Configuration**: Search `config/`, `src/utils/config_loader.py`, schemas
6. **Testing**: Search `tests/`, specific test subdirectories

**Tools to Use:**
- `Glob` tool for pattern matching (e.g., `src/**/*multi*.py`)
- `Grep` tool for content search (e.g., finding class definitions, function signatures)
- `Read` tool to examine discovered files

### Step 3: Infer Documentation Structure

Choose appropriate structure based on topic type:

**For Architecture/Components:**
```markdown
# [Component Name]

## Overview
[Purpose and role in the system]

## Architecture
[Design decisions, structure, key classes]

## Key Components
[Detailed breakdown of main elements]

## Data Flow
[How data moves through the component]

## Configuration
[Relevant config parameters]

## Usage Examples
[Code examples showing typical usage]

## Related Files
[Cross-referenced source files with links]
```

**For Workflows/Pipelines:**
```markdown
# [Workflow Name]

## Overview
[What the workflow accomplishes]

## Pipeline Stages
[Step-by-step breakdown]

## Inputs and Outputs
[What goes in and what comes out]

## Implementation Details
[Technical specifics]

## Configuration
[Relevant parameters]

## Error Handling
[Edge cases and failure modes]

## Related Files
[Cross-referenced source files with links]
```

**For Analysis/Metrics:**
```markdown
# [Analysis Topic]

## Overview
[Purpose and when to use]

## Metrics Explained
[Detailed metric descriptions]

## Interpretation Guidelines
[How to interpret results]

## Implementation
[Technical details]

## Usage
[How to run the analysis]

## Output Format
[What the analysis produces]

## Related Files
[Cross-referenced source files with links]
```

### Step 4: Create Cross-References

Always include a "Related Files" section with properly formatted markdown links:

**Link Format:**
```markdown
## Related Files

- [`src/models/autoencoder.py`](../src/models/autoencoder.py) - Main autoencoder architecture
- [`src/training/multi_head_trainer.py:45-120`](../src/training/multi_head_trainer.py#L45) - Multi-head training loop
- [`config/config_multi.yaml`](../config/config_multi.yaml) - Multi-head configuration schema
```

**Link Best Practices:**
- Use relative paths from `docs/` directory (start with `../`)
- Include line number ranges for specific implementations
- Add brief descriptions after each link
- Group related files logically (e.g., "Core Implementation", "Configuration", "Tests")

### Step 5: Generate or Update Documentation

**For New Documentation:**
1. Create file with appropriate naming: `docs/[topic-name].md` (lowercase, hyphens)
2. Write complete content following inferred structure
3. Include all standard sections
4. Add cross-references to related docs at the end

**For Existing Documentation:**
1. Read existing file first
2. Preserve user-added content and custom sections
3. Update technical details and code references
4. Add new sections if needed
5. Update "Last Updated" timestamp if present

**File Naming Conventions:**
- Use lowercase with hyphens: `multi-head-training.md`
- Be descriptive: `clustering-analysis-pipeline.md` not `clustering.md`
- Group related docs with prefixes: `architecture-encoder.md`, `architecture-decoder.md`

## Project-Specific Context

### AutoEncoder AI Music Detector

This skill operates within a PyTorch-based research project that trains autoencoders to detect AI-generated music through latent space clustering analysis.

**Key Technical Stack:**
- PyTorch 2.7+, librosa, scikit-learn, UMAP, matplotlib
- Python 3.11+
- 4-layer CNN architecture with configurable latent dimension (default 20D)
- Two model types: single-head (reconstruction only) and multi-head (reconstruction + classification)

**Project Structure:**
```
src/
  cli/         - Command-line entry points
  models/      - Autoencoder architecture
  preprocessing/ - Audio processing
  training/    - Training loops and data loaders
  analysis/    - Clustering and visualization
  utils/       - Config, logging, validation
tests/
  unit/        - Component tests
  contract/    - Schema validation
  integration/ - End-to-end tests
config/        - YAML configuration files
docs/          - Documentation output directory (THIS IS WHERE YOU WRITE)
```

**Documentation Style:**
- Technical but clear - suitable for researchers and developers
- Include mathematical concepts when relevant (silhouette scores, loss functions)
- Explain "why" decisions were made, not just "what" they are
- Reference research constraints (e.g., unsupervised learning requirement)
- Always note GPU/CUDA requirements for performance-critical sections

### Important Project Constraints

Document these when relevant:

1. **Global Normalization**: All spectrograms normalized using dataset-wide min/max statistics (not per-sample)
2. **Label Usage**:
   - Single-head: Labels NOT used during training (unsupervised)
   - Multi-head: Labels used for classification loss during training
3. **Latent Dimension**: Configurable (default 20D), was originally 16D research constraint
4. **Audio Processing**: Always mono, 44.1kHz, 5-second non-overlapping chunks
5. **Error Handling**: Log errors, skip problematic files, continue processing - never crash on single file errors

### Cross-Referencing Other Docs

When creating documentation, always check for and reference related existing docs:

**Common Related Documents:**
- Architecture docs when writing about training
- Configuration docs when writing about any subsystem
- Data preprocessing docs when writing about training or analysis
- Analysis docs when writing about visualization

Add a "See Also" section at the end:
```markdown
## See Also

- [Multi-Head Training](multi-head-training.md) - Training methodology for classification tasks
- [Configuration System](configuration.md) - How to configure model parameters
- [Clustering Analysis](clustering-analysis.md) - Interpreting latent space results
```

## Special Handling

### Schema Validation Files

**Important**: Do NOT validate documentation against JSON schemas in `specs/001-autoencoder-ai-detector/contracts/`. These schemas are for output validation (metrics, checkpoints), not documentation.

You should still:
- Reference schemas when documenting output formats
- Include schema file paths in cross-references when relevant
- Explain what schemas validate, but don't validate docs against them

### Code Examples in Documentation

When including code examples:

**Prefer:**
```python
# Clear, minimal examples
from src.models.autoencoder import Autoencoder

model = Autoencoder(latent_dim=20)
print(model)
```

**Avoid:**
```python
# Overly complex, complete scripts
import torch
import torch.nn as nn
import numpy as np
import librosa
# ... 50 more lines
```

**Usage Example Format:**
```markdown
## Usage Example

### Basic Training

python
python train.py


### Multi-Head Training with Custom Config

python
python trainmulti.py --config config/experiment_multi_head.yaml


See [`src/cli/train.py`](../src/cli/train.py) for complete CLI options.
```

## Edge Cases and Error Handling

### When Files Cannot Be Found

If search doesn't find expected files:
1. Tell user: "I couldn't find files matching [pattern]. Could you specify which files implement [feature]?"
2. Offer to search with different patterns
3. Ask if the feature might be in an unexpected location

### When Topic Is Too Broad

If user asks to "document everything":
1. Suggest breaking into logical subsystems
2. Offer to create an index document with links to detailed docs
3. Recommend starting with high-priority areas

### When Documentation Already Exists

Always check `docs/` first:
1. Read existing file
2. Ask: "This topic has existing documentation. Should I update it, replace it, or create a new version?"
3. Preserve valuable user-added content when updating

### When Code Is Unclear

If implementation is ambiguous:
1. Document what you can determine
2. Add `[TODO: Clarify ...]` markers
3. Ask user specific questions about unclear logic
4. Never make up technical details

## Output Quality Checklist

Before finalizing documentation, verify:

- [ ] File is in `docs/` directory with proper naming (lowercase-with-hyphens.md)
- [ ] H1 title clearly identifies the topic
- [ ] Overview section explains purpose and context
- [ ] Technical sections have appropriate depth
- [ ] Code references use correct relative paths from `docs/`
- [ ] Cross-references include line numbers when referencing specific implementations
- [ ] "Related Files" section exists with linked source files
- [ ] "See Also" section links to related documentation (if applicable)
- [ ] Code examples are minimal, clear, and tested (or marked as pseudocode)
- [ ] Project constraints are mentioned when relevant
- [ ] Technical accuracy verified against source code
- [ ] Markdown formatting is clean and consistent

## Common Pitfalls to Avoid

1. **Generic Documentation**: Don't write abstract, project-agnostic docs. Include AutoEncoder-specific details.
2. **Outdated References**: Always verify file paths and line numbers are current.
3. **Missing Context**: Don't assume reader knows the overall project structure - provide enough context.
4. **Over-Documentation**: Focus on important implementation details, not every line of code.
5. **Broken Links**: Test that all cross-references use correct relative paths.
6. **Ignoring Existing Docs**: Always read existing docs to avoid duplication or contradictions.

## Success Indicators

Good subsystem documentation:
- Standalone readable - doesn't require reading other docs first
- Technically accurate - reflects actual implementation
- Actionable - reader can use/extend the subsystem after reading
- Well-linked - connects to related code and documentation
- Appropriate depth - neither too shallow nor excessively detailed
- Explains "why" - documents design decisions and constraints, not just code structure

## Example Invocation Flow

**User**: "Document the clustering analysis pipeline"

**Claude Response**:
```
I'll document the clustering analysis pipeline for you. Let me search for
relevant files in the analysis and CLI modules.

[Searches: src/analysis/, src/cli/analyze*.py, config/ files]

I found:
- src/analysis/clustering_metrics.py (core metrics implementation)
- src/cli/analyze.py (command-line interface)
- config/config.yaml (clustering parameters)

Should the documentation cover:
1. Just the metrics calculation? Or
2. The complete analysis workflow including visualization?

[User clarifies: Complete workflow]

Perfect. I'll create docs/clustering-analysis-pipeline.md with:
- Overview of the clustering analysis purpose
- Three metrics explained (Silhouette, Davies-Bouldin, Purity)
- Step-by-step pipeline stages
- Configuration options
- Usage examples
- Output interpretation guidelines
- Cross-references to source files

[Creates documentation]

Documentation created at docs/clustering-analysis-pipeline.md
```

## Summary

The Subsystem Documenter skill enables comprehensive, intelligent documentation generation for any AutoEncoder project component. It combines automated code discovery, intelligent structure inference, and proper cross-referencing to create high-quality technical documentation that serves both researchers and developers.

Key strengths:
- **Contextual**: Understands AutoEncoder project structure and constraints
- **Intelligent**: Infers appropriate documentation structure automatically
- **Connected**: Creates rich cross-references between docs and code
- **Flexible**: Handles any subsystem from high-level to implementation details
- **Collaborative**: Asks clarifying questions rather than making assumptions
