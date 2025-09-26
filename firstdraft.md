**Scope Overview**
- Audio Description Protocol (ADP) targets a shared JSON contract for labeling musical audio, capturing dictionary entries, clip annotations, dataset manifests, and model outputs so humans and AIs can interoperate on the same artifacts `ADP/.specify/specs/adp/spec.md:1`.
- Mandatory functional scope spans dictionary and annotation schemas, CLI validation, and unit coverage, with dataset and model-output schemas planned next per FR-001–FR-006 `ADP/.specify/specs/adp/spec.md:87`.
- Operational expectations include CLI exit semantics, structured validation logs, release-note discipline, CC0 licensing defaults, and provenance capture per OP-001–OP-004 `ADP/.specify/specs/adp/spec.md:132`.
- Governance is spec-first: every capability flows through specification, plan, task breakdown, and constitution checks before code changes proceed `ADP/.specify/memory/constitution.md:24`.

**Workspace Layout**
- Root contains the runnable code in `python-project/` and Spec Kit materials in `ADP/`, allowing specs and implementation to evolve in tandem `block-beta.mmd:1`.
- The Python project exposes main entrypoints, schemas, examples, core library, and tests as described in the bundled structure guide `README.md:69`.
- Schemas and example payloads live beside source to keep contracts versioned with code (`schemas/`, `examples/`) `README.md:72`.
- Pytest is wired to resolve the local package by injecting `python-project/src` via `pytest.ini:2`.

**Python Modules**
- `main.py` offers a module-executable CLI that bootstraps `sys.path`, applies schema aliases, performs JSON validation, and emits standardized exit codes `main.py:1`.
- Core validation logic is centralized in `src/adp_core/validate.py`, which resolves schema paths, loads contracts, and surfaces aggregated JSON Schema errors through `jsonschema.Draft202012Validator` `src/adp_core/validate.py:1`.
- `_SCHEMA_FILES` supplies short-name aliases for known schemas to keep CLI usage ergonomic while allowing fallback to explicit filenames `src/adp_core/validate.py:10`.
- `validate_file` is the file-level convenience wrapper used by both programmatic consumers and tests to enforce contracts before raising `ValidationError` `src/adp_core/validate.py:42`.
- Package initialization is intentionally empty, keeping `adp_core` lightweight for importers `src/adp_core/__init__.py:1`.

**JSON Schemas**
- `dictionary.entry.schema.json` enforces lowercase kebab-case IDs, lowercase labels, minimum definition length, semver schema_version, optional aliases/tags, and disallows extraneous fields, anchoring contract FR-001 and FR-009–FR-012 `schemas/dictionary.entry.schema.json:1`.
- `annotation.schema.json` requires positive time ranges, confidence bounds, a non-empty labels array, and optional metadata fields, embodying FR-002 and the edge cases around temporal validation `schemas/annotation.schema.json:1`.
- Minimal examples (`dict_min.json`, `ann_min.json`) showcase valid payloads with schema headers, semver versions, and real-world tags/confidence so downstream tooling has canonical fixtures `examples/dict_min.json:1` `examples/ann_min.json:1`.
- Schema aliases map to these files via `_SCHEMA_FILES`, ensuring friendly CLI semantics while preserving path-based fallbacks `src/adp_core/validate.py:10`.

**Interfaces**
- `pyproject.toml` wires `adp_core.cli:main` as the installed console script `adp`, with `jsonschema` locked as the runtime dependency and dev extras for pytest coverage `pyproject.toml:1`.
- CLI behavior is mirrored between `main.py` and `src/adp_core/cli.py`, covering usage text, alias resolution, path existence checks, JSON loading, validation, and categorized exit codes `src/adp_core/cli.py:15`.
- Schema selection supports both alias (`dictionary`, `annotation`) and explicit filenames, and errors surface as human-readable messages aggregated from the validator `src/adp_core/cli.py:28`.
- Examples in the README outline expected CLI usage, exit code semantics, and validation workflow for quick manual verification `README.md:46`.

**Testing**
- `tests/test_validate.py` drives schema enforcement with happy-path file validation, failing confidence/time range checks, and unit-level assertions on ID/label/version regex rules `tests/test_validate.py:9`.
- Temporary invalid annotation JSON is written to disk during tests to assert failure paths, then cleaned up to avoid residue `tests/test_validate.py:15`.
- CLI integration tests run `python -m main` against valid and invalid command combinations to guarantee process-level behavior and exit codes `tests/test_validate.py:93`.
- Pytest resolves project modules via `Path` arithmetic near the test root, keeping imports stable regardless of invocation context `tests/test_validate.py:6`.

**Dependencies**
- Runtime stack is limited to Python ≥3.11 and `jsonschema==4.23.0`, with optional pytest and pytest-cov extras for development `pyproject.toml:6`.
- `requirements.txt` mirrors those pins and documents deferred torch/torchaudio integrations slated for future phases `requirements.txt:1`.
- Wheel metadata in `src/adp_core.egg-info/` reflects the same dependency set and captures README content for distribution packaging `src/adp_core.egg-info/PKG-INFO:1`.

**Specification Artefacts**
- The feature spec enumerates user scenarios, acceptance tests, edge cases, functional/operational requirements, and outstanding clarifications, setting the authoritative scope for rebuilds `ADP/.specify/specs/adp/spec.md:73`.
- Implementation plan details technical context (Python 3.11, jsonschema, pytest), constitution checkpoints, phased outputs (research, data model, quickstart), and progress gates needed before coding `ADP/.specify/specs/adp/plan.md:31`.
- Tasks blueprint breaks implementation into numbered, dependency-aware items covering schema creation, validator wiring, CLI, CI, dataset expansion, observability, and release documentation `ADP/.specify/specs/adp/tasks.md:31`.
- Templates under `.specify/templates/` provide reusable scaffolds for future features so new work mirrors the same structure `ADP/.specify/templates/spec-template.md:1`.

**Governance**
- The ADP constitution emphasizes PyTorch-first ML work, spec-first changes, JSON Schema compliance, library-first modularity, TDD, and ethical licensing/provenance, setting constraints any successor project must honor `ADP/.specify/memory/constitution.md:13`.
- Execution constraints require ratified specs, plans with schema/test/impact analysis, mandatory tests, and semver-major bumps for breaking schema changes `ADP/.specify/memory/constitution.md:64`.
- Workflow mandates follow the sequence Specification → Planning → Tasks → Implementation → Validation, anchoring development cadence for future teams `ADP/.specify/memory/constitution.md:73`.

**Automation Scripts**
- `create-new-feature.sh` bootstraps numbered feature directories, branches, and spec files, ensuring new work slots into the Spec Kit pipeline with consistent naming `ADP/.specify/scripts/bash/create-new-feature.sh:21`.
- `update-agent-context.sh` parses plan metadata to refresh multi-agent instruction files (Claude, Gemini, Copilot, etc.), ensuring AI collaborators stay aligned with the latest plan details `ADP/.specify/scripts/bash/update-agent-context.sh:31`.
- Shared helpers in `common.sh` (imported by scripts) manage repo detection and feature path resolution, keeping tooling robust even outside Git (referenced in script imports) `ADP/.specify/scripts/bash/update-agent-context.sh:53`.
- Additional scripts (`setup-plan.sh`, `check-prerequisites.sh`) are available to enforce environment readiness before plan or tasks generation `ADP/.specify/scripts/bash/check-prerequisites.sh:1`.

**Known Gaps**
- Dataset and model-output schemas (FR-003/FR-004) plus structured logging and release-note automation (OP-002/OP-003) remain unimplemented in the Python project, existing only as planned tasks `ADP/.specify/specs/adp/spec.md:90`.
- CLI currently prints plain text (`OK`, `INVALID`, `ERROR`) without the JSON log format promised in OP-002, highlighting work item T014 in tasks.md `ADP/.specify/specs/adp/tasks.md:55`.
- The spec calls for lowercase annotation labels (FR-009), but the annotation schema does not yet enforce the same regex, indicating a future schema revision requirement `schemas/annotation.schema.json:48`.
- Spec templates and plan structure mention broader multi-project layouts (frontend/backend/mobile), but the current implementation only exercises the single-project path, so alternative layouts remain unused `ADP/.specify/templates/plan-template.md:70`.

**Bootstrap Steps**
- Install Python 3.11+, create a virtual environment, and install dependencies using the pinned versions to guarantee consistent validation behavior `README.md:8`.
- Run `pytest` to confirm schema and CLI tests while ensuring the repo root `pytest.ini` path injection resolves modules correctly `pytest.ini:2`.
- Use `adp <schema> <json>` (after `pip install -e .`) or `python -m main` when running in-place to validate payloads against shipped schemas `README.md:46`.
- Follow the Spec Kit workflow for enhancements: duplicate `spec-template.md`, fill spec requirements, run planning scripts to populate plan/tasks, then implement code/tests in `python-project/src`, `schemas`, and `tests` accordingly `ADP/.specify/templates/spec-template.md:137`.
- For packaging, rely on `pyproject.toml` metadata to build wheels and expose the console entry point, ensuring `jsonschema` remains pinned for Draft 2020-12 compatibility `pyproject.toml:7`.
