<!--
SYNC IMPACT REPORT
==================
Version change: Template → 1.0.0
Modified principles: All principles newly defined from template
Added sections: All sections newly defined from template
Removed sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md: Constitution Check reference verified
- ⚠ .specify/templates/spec-template.md: Needs review for ADP-specific requirements
- ⚠ .specify/templates/tasks-template.md: Needs review for TDD and schema validation tasks
- ⚠ .claude/commands/*.md: Need review for agent-specific references
Follow-up TODOs: Review template consistency and update references to constitution v1.0.0
-->

# Audio Description Protocol (ADP) Constitution

## Core Principles

### Python + PyTorch First

All ML libraries MUST default to **PyTorch** unless there is a strong reason otherwise. Experimental work may use auxiliary libs (e.g. librosa, torchaudio, HuggingFace) but PyTorch remains the core runtime.

**Rationale**: Keeps the ML stack consistent and easier to maintain for audio processing workflows.

### Spec-First Development

Every new capability MUST begin with a written spec (spec.md). Specs MUST include: data flow, inputs/outputs, schema references, and open questions. No code may land without a linked spec section.

**Rationale**: ADP is a protocol; schema stability and documentation matter more than speed.

### JSON Schema Compliance

All data exchanged (dictionary entries, annotations, datasets, model outputs) MUST conform to versioned JSON Schemas in `/schemas`. PRs that introduce or change schemas MUST include validation tests on sample JSON files.

**Rationale**: ADP's usefulness depends on strict, versioned contracts for interoperability.

### Library-First Modularity

Core logic MUST be packaged as reusable Python libraries before integration into tools or CLIs. Libraries MUST ship with unit tests and at least one usage example.

**Rationale**: Ensures low coupling and reuse across CLI tools, training pipelines, and Unity adapters.

### Test-Driven Delivery

Tests MUST be written before or alongside code changes. All schema, unit, and integration tests MUST pass in CI before merge. Datasets MUST include at least one validation script that checks schema conformance.

**Rationale**: Guarantees correctness in a protocol where precision matters for human-AI interoperability.

## Ethical + Licensing Rules

Default dataset license MUST be **CC0-1.0** unless explicitly documented otherwise. Free-text annotations MUST NOT include PII or sensitive data. Provenance fields MUST identify whether annotations were made by human or AI.

**Rationale**: Ensures ADP datasets are safe, reusable, and aligned with open science principles.

## Development Workflow

1. **Specification** → Describe new object/flow in `specs/adp/spec.md`
2. **Planning** → Expand into `plan.md` (schema refs, test coverage, migration notes)
3. **Tasks** → Break into concrete steps (`tasks.md`)
4. **Implementation** → Write code and data under `/src` and `/schemas`, add tests under `/tests`
5. **Validation** → Run schema validation and ML training tests before merge

## Governance

**Amendments** → Require PR with rationale, schema impact, and migration notes.
**Versioning** → Semantic versioning (major/minor/patch).
**Compliance** → Maintainers review specs/tasks quarterly; violations must have remediation tasks.
**Execution Constraints** → Specs MUST be ratified before planning begins. Plans MUST include: schema updates, test plan, and dataset impact. Implementation MUST NOT skip tests or validation scripts. Breaking schema changes MUST bump the major version and document migration steps.

**Version**: 1.0.0 | **Ratified**: 2025-09-26 | **Last Amended**: 2025-09-26