# Spec-Driven Development (SDD) & Spec Kit Setup Guide

**Version**: 1.0
**Date**: 2025-09-30
**Author**: Extracted from Audio Description Protocol reference implementation
**Target Audience**: Claude AI assistant setting up SDD in a new project

---

# Important

This guide should only be used to set up Claude Code, Spec Kit, and SDD related matters. Under no circumstances change the core code of the project itself. If you think you need to, give a warning to the user first and ask for permission.

There is a possibility that some or all of the enclose process has already been completed, if so inform the user and ask for confirmation or otherwise which setup tasks can be skipped. Check if files or folders exist before creating them, and ask the user what to do if they exist.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure Setup](#directory-structure-setup)3
3. [Constitution Creation](#constitution-creation)
4. [Template Files](#template-files)
5. [Bash Scripts](#bash-scripts)
6. [Slash Commands](#slash-commands)
7. [Agent Configuration](#agent-configuration)
8. [Supplementary Project Files](#supplementary-project-files)
9. [Project Initialization](#project-initialization)
10. [Workflow Guide](#workflow-guide)
11. [Best Practices](#best-practices)
12. [User Preferences](#user-preferences)

---

## Overview

### What is Spec-Driven Development?

SDD is a constitutional methodology that enforces:
- **Specifications before implementation**: No code without written requirements
- **Phased progression**: Specify → Plan → Tasks → Implement → Analyze
- **Constitutional governance**: Project principles encoded in `.specify/memory/constitution.md`
- **Traceable evolution**: Every feature tracked from spec to implementation

### What is Spec Kit?

Spec Kit is the framework that implements SDD:
- **Templates**: Self-documenting templates with execution flows
- **Automation**: Bash scripts for feature creation, validation, and progression
- **Slash Commands**: Claude Code commands that orchestrate the workflow
- **Agent System**: Specialized agents (startup-advisor, session-summary) for project continuity

### Key Benefits

✅ **Prevents scope creep** - Requirements locked before planning
✅ **Auditable history** - Full traceability from idea to code
✅ **Constitutional consistency** - Principles enforced at gates
✅ **Parallel execution** - Tasks marked [P] for concurrent work
✅ **Project continuity** - Session tracking + startup advisor orient new sessions

---

## Directory Structure Setup

### Step 1: Create Core Directories

**IMPORTANT**: Check if directories already exist before creating them. If any directories already contain files (e.g., existing `.claude/` setup or `specs/` from prior work), **DO NOT DELETE OR OVERWRITE THEM**. Only create missing directories and preserve all existing content.

Execute these commands from the repository root:

```bash
# Check for existing directories first
ls -la .specify/ .claude/ specs/ 2>/dev/null || echo "Some directories don't exist yet (this is normal for new setup)"

# Core Spec Kit structure (creates only if missing)
mkdir -p .specify/templates
mkdir -p .specify/scripts/bash
mkdir -p .specify/memory

# Agent configuration (creates only if missing)
mkdir -p .claude/agents
mkdir -p .claude/commands
mkdir -p .claude/sessions

# Feature specifications (creates only if missing)
mkdir -p specs

# Create project-level files (only if they don't exist)
[ ! -f PROGRESS.md ] && touch PROGRESS.md || echo "PROGRESS.md already exists, preserving it"
[ ! -f QUICK_OVERVIEW.md ] && touch QUICK_OVERVIEW.md || echo "QUICK_OVERVIEW.md already exists, preserving it"
```

**Safety Notes**:
- `mkdir -p` is safe - it only creates directories that don't exist
- Always verify existing content before copying templates
- If the project already has `.claude/commands/`, review existing commands before overwriting
- If `specs/` has existing features, new features will start from next available number

### Step 2: Verify Structure

After creation, your repository should have:

```
your-project/
├── .specify/
│   ├── templates/           # spec-template.md, plan-template.md, tasks-template.md, agent-file-template.md
│   ├── scripts/bash/        # create-new-feature.sh, setup-plan.sh, check-prerequisites.sh, common.sh, update-agent-context.sh
│   └── memory/
│       └── constitution.md  # Project principles and governance
├── .claude/
│   ├── agents/
│   │   └── startup-advisor.md    # Session orientation agent
│   ├── commands/
│   │   ├── specify.md            # /specify command
│   │   ├── plan.md               # /plan command
│   │   ├── tasks.md              # /tasks command
│   │   ├── implement.md          # /implement command
│   │   ├── clarify.md            # /clarify command
│   │   ├── analyze.md            # /analyze command
│   │   └── constitution.md       # /constitution command
│   └── sessions/                 # session_N.md files (created during use)
├── specs/                        # Feature specifications (created per feature)
│   └── 001-feature-name/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       └── contracts/
├── PROGRESS.md                   # High-level project milestones
├── QUICK_OVERVIEW.md             # One-page project reference
└── CLAUDE.md                     # Auto-generated agent context (created by scripts)
```

---

## Constitution Creation

### Step 1: Create Constitution Template

The constitution defines your project's non-negotiable principles. Create `.specify/memory/constitution.md`:

```markdown
# [PROJECT_NAME] Constitution

## Core Principles

### [PRINCIPLE_1_NAME]

[Description of the principle and its enforcement rules]

**Rationale**: [Why this principle exists]

### [PRINCIPLE_2_NAME]

[Description of the principle and its enforcement rules]

**Rationale**: [Why this principle exists]

[Continue for 3-5 core principles]

## Ethical + Licensing Rules

[Define licensing defaults, data handling policies, provenance requirements]

**Rationale**: [Why these rules matter for your domain]

## Development Workflow

1. **Specification** → [What happens in this phase]
2. **Planning** → [What happens in this phase]
3. **Tasks** → [What happens in this phase]
4. **Implementation** → [What happens in this phase]
5. **Validation** → [What happens in this phase]

## Governance

**Amendments** → [Process for changing principles]
**Versioning** → Semantic versioning (major/minor/patch)
**Compliance** → [Review schedule and violation remediation]
**Execution Constraints** → [Specific gates and checkpoints]

**Version**: 1.0.0 | **Ratified**: [DATE] | **Last Amended**: [DATE]
```

### Step 2: Example Constitution (Audio Description Protocol)

Here's a real example for reference:

```markdown
# Audio Description Protocol (ADP) Constitution

## Core Principles

### Python + PyTorch First

All ML libraries MUST default to **PyTorch** unless there is a strong reason otherwise.
Experimental work may use auxiliary libs (e.g. librosa, torchaudio, HuggingFace) but PyTorch
remains the core runtime.

**Rationale**: Keeps the ML stack consistent and easier to maintain for audio processing workflows.

### Spec-First Development

Every new capability MUST begin with a written spec (spec.md). Specs MUST include: data flow,
inputs/outputs, schema references, and open questions. No code may land without a linked spec section.

**Rationale**: ADP is a protocol; schema stability and documentation matter more than speed.

### JSON Schema Compliance

All data exchanged (dictionary entries, annotations, datasets, model outputs) MUST conform to
versioned JSON Schemas in `/schemas`. PRs that introduce or change schemas MUST include validation
tests on sample JSON files.

**Rationale**: ADP's usefulness depends on strict, versioned contracts for interoperability.

### Library-First Modularity

Core logic MUST be packaged as reusable Python libraries before integration into tools or CLIs.
Libraries MUST ship with unit tests and at least one usage example.

**Rationale**: Ensures low coupling and reuse across CLI tools, training pipelines, and Unity adapters.

### Test-Driven Delivery

Tests MUST be written before or alongside code changes. All schema, unit, and integration tests
MUST pass in CI before merge. Datasets MUST include at least one validation script that checks
schema conformance.

**Rationale**: Guarantees correctness in a protocol where precision matters for human-AI interoperability.

## Ethical + Licensing Rules

Default dataset license MUST be **CC0-1.0** unless explicitly documented otherwise. Free-text
annotations MUST NOT include PII or sensitive data. Provenance fields MUST identify whether
annotations were made by human or AI.

**Rationale**: Ensures ADP datasets are safe, reusable, and aligned with open science principles.

## Development Workflow

1. **Specification** → Describe new object/flow in `specs/###-feature/spec.md`
2. **Planning** → Expand into `plan.md` (schema refs, test coverage, migration notes)
3. **Tasks** → Break into concrete steps (`tasks.md`)
4. **Implementation** → Write code and data under `/src` and `/schemas`, add tests under `/tests`
5. **Validation** → Run schema validation and ML training tests before merge

## Governance

**Amendments** → Require PR with rationale, schema impact, and migration notes.
**Versioning** → Semantic versioning (major/minor/patch).
**Compliance** → Maintainers review specs/tasks quarterly; violations must have remediation tasks.
**Execution Constraints** → Specs MUST be ratified before planning begins. Plans MUST include:
schema updates, test plan, and dataset impact. Implementation MUST NOT skip tests or validation
scripts. Breaking schema changes MUST bump the major version and document migration steps.

**Version**: 1.0.0 | **Ratified**: 2025-09-26 | **Last Amended**: 2025-09-26
```

### Step 3: Customize for Your Project

**Key Questions to Answer**:
1. **What is your primary technology stack?** (e.g., "Python + FastAPI First", "TypeScript + React First")
2. **What quality gates are non-negotiable?** (e.g., test coverage, performance targets, security scans)
3. **What contract formats matter?** (e.g., JSON Schema, Protocol Buffers, OpenAPI specs)
4. **What ethical/licensing constraints exist?** (e.g., GDPR compliance, open source licenses)
5. **What architectural patterns are mandated?** (e.g., "API-first", "Library-first", "Microservices")

**Principles typically range from 3-7**. Too few = not enough guidance. Too many = not memorable.

---

## Template Files

### Template 1: spec-template.md

**Location**: `.specify/templates/spec-template.md`

**Purpose**: Generate feature specifications that describe WHAT users need and WHY (no HOW/tech details)

**Key Sections**:
- **Execution Flow**: Quasi-executable pseudocode showing how to process the spec
- **User Scenarios & Testing**: Primary user story + acceptance scenarios
- **Requirements**: Functional requirements (FR-001, FR-002, etc.) marked as testable
- **Key Entities**: Data shapes without implementation details
- **Review & Acceptance Checklist**: Validation gates before moving to planning

**Copy the full template from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/templates/spec-template.md` (shown in earlier context)

**Critical Features**:
- `[NEEDS CLARIFICATION: specific question]` markers for ambiguities
- Execution Flow that agents can follow step-by-step
- Clear separation: business requirements vs. technical solutions

---

### Template 2: plan-template.md

**Location**: `.specify/templates/plan-template.md`

**Purpose**: Transform specs into technical designs with architecture, contracts, and task generation strategy

**Key Sections**:
- **Execution Flow**: Steps for `/plan` command to execute (including constitution checks)
- **Summary**: One-line spec + technical approach
- **Technical Context**: Language, dependencies, storage, testing, performance goals
- **Constitution Check**: Gates that validate principles (auto-generated from constitution)
- **Project Structure**: Source code layout (single/web/mobile patterns)
- **Phase 0**: Research unknowns and resolve NEEDS CLARIFICATION
- **Phase 1**: Design contracts, data models, quickstart scenarios, update agent context
- **Phase 2**: Describe task generation approach (NOT execute /tasks)
- **Complexity Tracking**: Justify any constitutional violations
- **Progress Tracking**: Checklist updated during execution

**Copy the full template from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/templates/plan-template.md`

**Critical Features**:
- Constitution Check section that enforces project principles
- NEEDS CLARIFICATION resolution requirement before proceeding
- Phase separation: /plan stops at Phase 1, /tasks handles Phase 2
- Calls `update-agent-context.sh` to maintain agent context files

---

### Template 3: tasks-template.md

**Location**: `.specify/templates/tasks-template.md`

**Purpose**: Generate dependency-ordered task lists with parallel execution markers

**Key Sections**:
- **Execution Flow**: Steps for `/tasks` command to generate tasks from design docs
- **Format**: `[ID] [P?] Description` with exact file paths
- **Phase 3.1**: Setup tasks (project init, dependencies, linting)
- **Phase 3.2**: Tests First (TDD - contract tests, integration tests marked [P])
- **Phase 3.3**: Core Implementation (models, services, CLI, endpoints)
- **Phase 3.4**: Integration (DB, middleware, logging)
- **Phase 3.5**: Polish (unit tests, performance, docs)
- **Dependencies**: Explicit blocking relationships
- **Parallel Example**: How to run [P] tasks concurrently

**Copy the full template from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/templates/tasks-template.md`

**Critical Features**:
- `[P]` markers for parallel-safe tasks (different files, no dependencies)
- TDD enforcement: Phase 3.2 must complete before 3.3
- Numbered task IDs (T001, T002, ...)
- Exact file paths in task descriptions

---

### Template 4: agent-file-template.md

**Location**: `.specify/templates/agent-file-template.md`

**Purpose**: Template for auto-generated agent context files (CLAUDE.md, GEMINI.md, etc.)

**Key Sections**:
- **Active Technologies**: List of tech stacks by feature
- **Project Structure**: Directory layout
- **Commands**: Common operations for active technologies
- **Code Style**: Language-specific conventions
- **Recent Changes**: Last 3 features and what they added
- **Manual Additions**: Protected region for human edits

**Copy the full template from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/templates/agent-file-template.md`

**Critical Features**:
- `<!-- MANUAL ADDITIONS START -->` / `<!-- MANUAL ADDITIONS END -->` markers preserve human edits
- Auto-updated by `update-agent-context.sh` after each `/plan` execution
- Keeps under 150 lines for token efficiency

---

## Bash Scripts

### Script 1: common.sh

**Location**: `.specify/scripts/bash/common.sh`

**Purpose**: Shared functions for all scripts (DRY principle)

**Key Functions**:
- `get_repo_root()`: Find repository root (git or non-git)
- `get_current_branch()`: Current feature branch (supports SPECIFY_FEATURE env var)
- `has_git()`: Check if git is available
- `check_feature_branch()`: Validate branch naming (###-feature-name pattern)
- `get_feature_dir()`: Construct feature directory path
- `get_feature_paths()`: Export all relevant paths as shell variables

**Copy the full script from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/scripts/bash/common.sh`

**Critical Features**:
- Non-git repository support (uses SPECIFY_FEATURE env var)
- Consistent path resolution across all scripts
- Branch naming validation (###-feature-name pattern)

---

### Script 2: create-new-feature.sh

**Location**: `.specify/scripts/bash/create-new-feature.sh`

**Purpose**: Create new feature branch and spec directory

**Usage**: `.specify/scripts/bash/create-new-feature.sh --json "feature description"`

**What It Does**:
1. Finds highest existing feature number in `specs/`
2. Increments to next number (e.g., 006 → 007)
3. Slugifies feature description (e.g., "Add Dark Mode" → "add-dark-mode")
4. Creates branch `007-add-dark-mode` (if git available)
5. Creates `specs/007-add-dark-mode/` directory
6. Copies spec-template.md to `specs/007-add-dark-mode/spec.md`
7. Exports SPECIFY_FEATURE environment variable
8. Returns JSON: `{"BRANCH_NAME":"007-add-dark-mode","SPEC_FILE":"/.../spec.md","FEATURE_NUM":"007"}`

**Copy the full script from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/scripts/bash/create-new-feature.sh`

**Critical Features**:
- Auto-incrementing feature numbers
- JSON output for programmatic parsing
- Supports non-git repositories

---

### Script 3: setup-plan.sh

**Location**: `.specify/scripts/bash/setup-plan.sh`

**Purpose**: Initialize planning phase for current feature

**Usage**: `.specify/scripts/bash/setup-plan.sh --json`

**What It Does**:
1. Validates you're on a feature branch
2. Ensures feature directory exists
3. Copies plan-template.md to `specs/###-feature/plan.md`
4. Returns JSON: `{"FEATURE_SPEC":"/.../spec.md","IMPL_PLAN":"/.../plan.md","SPECS_DIR":"/.../###-feature","BRANCH":"###-feature-name","HAS_GIT":"true"}`

**Copy the full script from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/scripts/bash/setup-plan.sh`

**Critical Features**:
- Branch validation before proceeding
- JSON output for command consumption
- Error messages guide user to correct command

---

### Script 4: check-prerequisites.sh

**Location**: `.specify/scripts/bash/check-prerequisites.sh`

**Purpose**: Consolidated prerequisite checking for workflow phases

**Usage Examples**:
```bash
# For /tasks command (requires plan.md)
.specify/scripts/bash/check-prerequisites.sh --json

# For /implement command (requires plan.md + tasks.md)
.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks

# Just get paths (no validation)
.specify/scripts/bash/check-prerequisites.sh --json --paths-only
```

**What It Does**:
1. Validates feature directory exists
2. Checks for required files (plan.md, optionally tasks.md)
3. Scans for optional docs (research.md, data-model.md, contracts/, quickstart.md)
4. Returns JSON: `{"FEATURE_DIR":"/.../###-feature","AVAILABLE_DOCS":["research.md","data-model.md","contracts/"]}`

**Copy the full script from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/scripts/bash/check-prerequisites.sh`

**Critical Features**:
- Unified prerequisite checking (replaces multiple ad-hoc scripts)
- Supports multiple modes (validation, paths-only)
- Clear error messages with remediation steps

---

### Script 5: update-agent-context.sh

**Location**: `.specify/scripts/bash/update-agent-context.sh`

**Purpose**: Maintain agent context files (CLAUDE.md, GEMINI.md, etc.) with latest project info

**Usage**: `.specify/scripts/bash/update-agent-context.sh [agent_type]`

**Agent Types**: `claude`, `gemini`, `copilot`, `cursor`, `qwen`, `opencode`, `codex`, `windsurf`, `kilocode`, `auggie`, `roo`

**What It Does**:
1. Parses plan.md for: Language/Version, Primary Dependencies, Storage, Project Type
2. Updates or creates agent context file from template
3. Preserves `<!-- MANUAL ADDITIONS START -->` / `<!-- MANUAL ADDITIONS END -->` sections
4. Adds new technologies to Active Technologies section
5. Updates Recent Changes (keeps last 3)
6. Updates last modified timestamp

**Copy the full script from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.specify/scripts/bash/update-agent-context.sh` (720 lines)

**Critical Features**:
- Multi-agent support (Claude, Gemini, Copilot, Cursor, etc.)
- Preserves manual edits in protected regions
- Incremental updates (O(1) operation, not O(n) full rebuild)
- Automatically called by `/plan` command (Phase 1, step 5)

**IMPORTANT**: The `/plan` command template calls this script as:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```
Do NOT add extra arguments. The script auto-detects which agent file to update.

---

## Slash Commands

### Command 1: /specify

**Location**: `.claude/commands/specify.md`

**Purpose**: Create or update feature specification from natural language description

**Usage**: `/specify Add dark mode toggle to settings page`

**Execution Flow**:
1. Run `create-new-feature.sh --json "$ARGUMENTS"` (ONCE only)
2. Parse JSON output for BRANCH_NAME and SPEC_FILE
3. Load `.specify/templates/spec-template.md`
4. Fill template sections from user's feature description
5. Mark ambiguities with `[NEEDS CLARIFICATION: specific question]`
6. Write completed spec to SPEC_FILE
7. Report completion with branch name and spec path

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/specify.md`

**Critical Behaviors**:
- Only run create-new-feature.sh ONCE (parse JSON from stdout)
- Focus on WHAT and WHY, avoid HOW and tech details
- Mark all assumptions as NEEDS CLARIFICATION
- No implementation details in spec (that's for /plan)

---

### Command 2: /plan

**Location**: `.claude/commands/plan.md`

**Purpose**: Execute implementation planning workflow using plan template

**Usage**: `/plan` (user can provide optional technical details as arguments)

**Execution Flow**:
1. Run `setup-plan.sh --json` and parse for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH
2. PAUSE if spec.md has no `## Clarifications` section → instruct user to run `/clarify` first
3. Read and analyze feature specification
4. Read constitution at `.specify/memory/constitution.md`
5. Execute plan template steps 1-9:
   - Fill Technical Context
   - Fill Constitution Check section
   - Execute Phase 0 (research.md)
   - Execute Phase 1 (contracts, data-model.md, quickstart.md, call update-agent-context.sh)
   - Re-evaluate Constitution Check
   - Plan Phase 2 approach (describe, DON'T create tasks.md)
6. Update Progress Tracking checklist
7. STOP - ready for /tasks command

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/plan.md`

**Critical Behaviors**:
- Check for Clarifications section before proceeding (prevent rework)
- Call `update-agent-context.sh claude` exactly as shown (no extra args)
- STOP after Phase 1 - do NOT create tasks.md (that's /tasks job)
- Incorporate user-provided technical details into Technical Context

---

### Command 3: /clarify

**Location**: `.claude/commands/clarify.md`

**Purpose**: Identify and resolve underspecified areas in feature spec before planning

**Usage**: `/clarify` (should run BEFORE /plan to reduce rework)

**Execution Flow**:
1. Run `check-prerequisites.sh --json --paths-only` and parse for FEATURE_SPEC
2. Load spec.md and scan for ambiguities across taxonomy:
   - Functional scope & behavior
   - Domain & data model
   - Interaction & UX flow
   - Non-functional quality attributes
   - Integration & dependencies
   - Edge cases & failure handling
   - Terminology & consistency
3. Generate up to 5 high-priority clarification questions
4. Ask questions ONE AT A TIME (interactive loop)
5. After each answer: integrate immediately into spec.md and update `## Clarifications` section
6. Write updated spec back to FEATURE_SPEC
7. Report: questions asked, sections touched, coverage summary

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/clarify.md`

**Critical Behaviors**:
- Maximum 5 questions total (avoid analysis paralysis)
- Ask ONE question at a time (no batch presentation)
- Incremental updates after EACH answer (atomic saves)
- Multiple-choice format with table rendering for complex questions
- Short-answer format (<=5 words) for simple questions
- Creates `## Clarifications` section with `### Session YYYY-MM-DD` subsections

---

### Command 4: /tasks

**Location**: `.claude/commands/tasks.md`

**Purpose**: Generate actionable, dependency-ordered tasks.md from design artifacts

**Usage**: `/tasks` (user can provide optional context as arguments)

**Execution Flow**:
1. Run `check-prerequisites.sh --json` and parse FEATURE_DIR and AVAILABLE_DOCS
2. Load plan.md (REQUIRED) and optional docs (data-model.md, contracts/, research.md, quickstart.md)
3. Generate tasks following template:
   - Phase 3.1: Setup (project init, dependencies, linting)
   - Phase 3.2: Tests First [P] (contract tests, integration tests)
   - Phase 3.3: Core Implementation (models, services, CLI, endpoints)
   - Phase 3.4: Integration (DB, middleware, logging)
   - Phase 3.5: Polish [P] (unit tests, performance, docs)
4. Apply task rules:
   - Each contract file → contract test task [P]
   - Each entity → model creation task [P]
   - Each endpoint → implementation task
   - Different files = mark [P]
   - Same file = sequential
   - Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002, ...)
6. Generate dependency graph and parallel execution examples
7. Write to FEATURE_DIR/tasks.md

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/tasks.md`

**Critical Behaviors**:
- Immediately executable tasks (no vague descriptions)
- [P] marker = parallel-safe (different files, no dependencies)
- TDD order: Phase 3.2 tests before Phase 3.3 implementation
- Exact file paths in every task description
- Not all projects have all docs (CLI tools may lack contracts/)

---

### Command 5: /implement

**Location**: `.claude/commands/implement.md`

**Purpose**: Execute implementation plan by processing and executing all tasks

**Usage**: `/implement` (user can provide optional context as arguments)

**Execution Flow**:
1. Run `check-prerequisites.sh --json --require-tasks --include-tasks` and parse FEATURE_DIR and AVAILABLE_DOCS
2. Load tasks.md (REQUIRED), plan.md (REQUIRED), and optional docs
3. Parse tasks.md structure:
   - Task phases (Setup, Tests, Core, Integration, Polish)
   - Task dependencies (sequential vs parallel [P])
   - Task details (ID, description, file paths)
4. Execute phase-by-phase:
   - Complete each phase before moving to next
   - Respect dependencies (sequential in order, parallel [P] can batch)
   - Follow TDD approach (tests before implementation)
5. Mark tasks as [X] in tasks.md after completion
6. Report progress after each task
7. Halt on errors (non-parallel tasks), continue with successful [P] tasks
8. Final validation: all tasks completed, tests pass, coverage met

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/implement.md`

**Critical Behaviors**:
- Phase-by-phase execution (no skipping ahead)
- Mark [X] in tasks.md after each completion
- Halt on sequential task failure, report and suggest remediation
- For [P] tasks, continue with successful, report failed
- Verify implementation matches original spec at completion

---

### Command 6: /analyze

**Location**: `.claude/commands/analyze.md`

**Purpose**: Non-destructive consistency and quality analysis across spec/plan/tasks artifacts

**Usage**: `/analyze` (should run AFTER /tasks, BEFORE /implement)

**Execution Flow**:
1. Run `check-prerequisites.sh --json --require-tasks --include-tasks` and parse FEATURE_DIR
2. Load spec.md, plan.md, tasks.md, and constitution.md
3. Build semantic models:
   - Requirements inventory (functional + non-functional)
   - User story/action inventory
   - Task coverage mapping (task → requirements)
   - Constitution rule set
4. Detection passes:
   - Duplication (near-duplicate requirements)
   - Ambiguity (vague adjectives, placeholders)
   - Underspecification (missing objects, outcomes, acceptance criteria)
   - Constitution alignment (MUST principle violations)
   - Coverage gaps (requirements without tasks, tasks without requirements)
   - Inconsistency (terminology drift, conflicting requirements)
5. Severity assignment: CRITICAL, HIGH, MEDIUM, LOW
6. Produce Markdown report with:
   - Findings table (ID, Category, Severity, Location, Summary, Recommendation)
   - Coverage summary (requirement → task mapping)
   - Constitution alignment issues
   - Unmapped tasks
   - Metrics (total requirements, total tasks, coverage %, issue counts)
7. Ask user: "Would you like me to suggest concrete remediation edits for the top N issues?"

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/analyze.md`

**Critical Behaviors**:
- READ-ONLY operation (NEVER modify files automatically)
- Constitution violations are automatically CRITICAL
- Deterministic findings (same input = same output)
- Limit to 50 findings in main table (aggregate remainder)
- Offer remediation suggestions, require user approval before edits

---

### Command 7: /constitution

**Location**: `.claude/commands/constitution.md`

**Purpose**: Create or update project constitution with principle tracking and sync impact

**Usage**: `/constitution [principle changes]` (user can provide specific updates as arguments)

**Execution Flow**:
1. Load existing constitution at `.specify/memory/constitution.md`
2. Identify placeholder tokens `[ALL_CAPS_IDENTIFIER]`
3. Collect/derive values:
   - From user input if provided
   - Infer from README, docs, prior versions
   - Ask user for RATIFICATION_DATE if unknown
   - Increment CONSTITUTION_VERSION (major/minor/patch based on change type)
4. Draft updated constitution (replace all placeholders)
5. Consistency propagation:
   - Read plan-template.md (ensure Constitution Check aligns)
   - Read spec-template.md (ensure mandatory sections match)
   - Read tasks-template.md (ensure task categories reflect principles)
   - Read commands/*.md (update agent-specific references)
6. Produce Sync Impact Report (HTML comment at top of constitution):
   - Version change (old → new)
   - Modified/added/removed principles
   - Templates requiring updates (✅ updated / ⚠ pending)
   - Follow-up TODOs
7. Validation:
   - No unexplained bracket tokens
   - Version matches report
   - Dates in ISO format (YYYY-MM-DD)
   - Principles declarative and testable
8. Write updated constitution to `.specify/memory/constitution.md`
9. Report: new version, bump rationale, files needing follow-up, suggested commit message

**Copy the full command from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/commands/constitution.md`

**Critical Behaviors**:
- Version bump decision: MAJOR (backward incompatible), MINOR (new principle), PATCH (clarifications)
- Sync Impact Report as HTML comment preserves change history
- Propagate changes to all dependent templates
- Never create new template - always operate on existing file

---

## Agent Configuration

### Agent 1: startup-advisor

**Location**: `.claude/agents/startup-advisor.md`

**Purpose**: Provide strategic guidance when starting work on the project

**Usage**: User says "I'm starting work on the project today, what should I focus on?"

**What It Does**:
1. Assert `.claude/sessions/` exists (create if needed, notify user)
2. Assert `PROGRESS.md` exists (create if needed, notify user)
3. Read QUICK_OVERVIEW.md
4. Read last 2 entries in PROGRESS.md (understand trajectory)
5. Read most recent session file (`.claude/sessions/session_*.md` with highest index)
6. Read most recent specs folder (e.g., `specs/006-below-the-filter/`)
7. Cross-reference progress vs. recent activity:
   - Gaps between planned and actual
   - Momentum from recent work
   - Blockers or dependencies
   - Spec-driven alignment
8. Provide exactly ONE actionable recommendation
9. Format response:
   - Files Read During Startup (list with one-line summaries - FIRST SECTION)
   - Current Project State (1-2 sentences)
   - Key Insight from Recent Session (1-2 sentences)
   - Next Step (one clear action)

**Copy the full agent from**: `/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol/.claude/agents/startup-advisor.md`

**Critical Behaviors**:
- Proactively create `.claude/sessions/` and `PROGRESS.md` if missing
- Read QUICK_OVERVIEW.md first for rapid orientation
- List all files read (helps user verify agent understood context)
- Exactly ONE recommendation (avoid choice paralysis)
- Leverage recent progress rather than starting something new

**When to Use**: At the start of EVERY work session for project continuity

---

### Agent 2: session-summary (Recommended Addition)

**Purpose**: Generate session summaries for `.claude/sessions/session_N.md` files

**What It Does**:
1. Asks user for session highlights (features, fixes, improvements, decisions)
2. Generates structured markdown:
   - Session number and date
   - Duration estimate
   - Summary paragraph
   - Changes Made (Features, Fixes, Improvements)
   - Key Code Changes (file paths with snippets)
   - Decisions & Discussion
   - Next Steps
   - Files Modified
   - Commit Info (branch, modified files, commit hashes)
   - Technical Metrics
3. Writes to `.claude/sessions/session_N.md` (auto-increments N)
4. Updates PROGRESS.md with session entry

**Recommended Template** (create `.claude/agents/session-summary.md`):

```markdown
---
name: session-summary
description: Generate structured session summary and update progress tracking
model: sonnet 4.5
---

You are an expert technical writer who creates detailed session summaries for development work. Your role is to capture the what, why, and how of each coding session in a structured format.

When activated, you will:

## 1. Gather Session Information
Ask the user for:
- Session highlights (features, fixes, improvements)
- Key decisions made during the session
- Blockers encountered and resolutions
- Files modified and their purposes
- Commit information (branch, hashes if available)
- Next planned steps

## 2. Generate Session Document
Create `.claude/sessions/session_N.md` (auto-increment N) with:

```markdown
# Session N - [Title from highlights]

**Date:** YYYY-MM-DD
**Duration:** Approximately [X hours/minutes]

## Summary
[1-2 paragraph narrative of what was accomplished]

## Changes Made

### ✨ New Features
- Feature 1 with brief description
- Feature 2 with brief description

### 🔧 Fixes
- Fix 1 with brief description
- Fix 2 with brief description

### 📈 Improvements
- Improvement 1 with brief description
- Improvement 2 with brief description

## Key Code Changes

### /path/to/file1.ext
- Change description with context
- Impact on system

### /path/to/file2.ext
- Change description with context
- Impact on system

## Decisions & Discussion

### Decision Title 1
[Explanation of the decision, rationale, and trade-offs]

### Decision Title 2
[Explanation of the decision, rationale, and trade-offs]

## Next Steps
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Files Modified
- `/absolute/path/to/file1` - One-line description
- `/absolute/path/to/file2` - One-line description

## Commit Info
**Status**: [Committed/Working changes]
**Branch**: [branch-name]
**Commits**: [hash1] ([message]), [hash2] ([message])

## Technical Metrics
- [Relevant metrics: lines added/removed, test coverage, performance improvements, etc.]
```

## 3. Update PROGRESS.md
Prepend new entry to PROGRESS.md:

```markdown
### YYYY-MM-DD - Session N
**Features:** [One-line feature summary]
**Fixes:** [One-line fix summary]
**Improvements:** [One-line improvement summary]
**Commit Info:** [Branch and commit details]
```

## 4. Validation
- Session number increments correctly (check existing sessions)
- All file paths are absolute
- Dates in ISO format (YYYY-MM-DD)
- Commit hashes are valid (if provided)
- Next Steps are actionable

## 5. Report Completion
- Path to session file
- PROGRESS.md updated confirmation
- Suggested next action (e.g., "Ready to start next session" or "Run /commit to save changes")
```

**When to Use**: At the END of every work session for continuity tracking

---

## Supplementary Project Files

Beyond the core SDD infrastructure, several supplementary files enhance workflow continuity and project orientation. These files are read by the startup-advisor agent and referenced throughout the development cycle.

### Required Files

#### 1. QUICK_OVERVIEW.md

**Location**: Repository root

**Purpose**: One-page project reference for rapid orientation (read by startup-advisor first)

**Key Sections**:
- **What It Is**: 1-2 sentence description
- **Core Purpose**: 3-4 bullet points of main capabilities
- **Key Features**: Organized by category (Generation System, Customization, etc.)
- **Current State**: Status, latest work, active branch
- **Project Structure**: Directory layout with comments
- **Key Technical Details**: Dependencies, data flow, performance
- **Key Files to Know**: Table with file paths, line counts, purposes
- **Workflow Commands**: Dev commands and SDD slash commands
- **Documentation**: Where to find detailed docs
- **Development Principles**: Summary of constitutional rules
- **Recent Achievements**: Last 3-5 sessions with highlights
- **Next Steps**: Immediate TODOs

**Template**:
```markdown
# [PROJECT_NAME] - Quick Overview

**Version**: [X.Y] | **Type**: [Project Type] | **Target**: [Platform/Runtime]

## What It Is

[1-2 sentence description of what the project does]

## Core Purpose

- **[Capability 1]** [brief description]
- **[Capability 2]** [brief description]
- **[Capability 3]** [brief description]

## Key Features

### [Category 1]
- **[Feature 1]**: [Description]
- **[Feature 2]**: [Description]

### [Category 2]
- **[Feature 1]**: [Description]

## Current State

**Status**: [Development phase and readiness]
**Latest**: [Most recent session summary]
**Branch**: [Active feature branch]

## Project Structure

[See earlier in guide for full structure template]

## Key Technical Details

### Dependencies
[List primary dependencies]

### Data Flow
1. **[Step 1]** → [Description]
2. **[Step 2]** → [Description]

## Key Files to Know

| File | Lines | Purpose |
|------|-------|---------|
| `path/to/file1` | ~500 | [Purpose] |
| `path/to/file2` | ~800 | [Purpose] |

## Workflow Commands

### Development
```bash
# [Common commands]
```

### Spec-Driven Development (SDD)
```bash
/specify <description>
/plan
/tasks
/implement
```

## Documentation

- **README**: `README.md` (comprehensive guide)
- **Progress Log**: `PROGRESS.md` (session history)
- **Sessions**: `.claude/sessions/session_*.md` (detailed logs)
- **Specs**: `specs/00X-*/` (feature specifications)

## Recent Achievements

### Session N (YYYY-MM-DD) - Latest
- [Highlight 1]
- [Highlight 2]

### Session N-1 (YYYY-MM-DD)
- [Highlight 1]

## Next Steps

- [ ] [Immediate TODO 1]
- [ ] [Immediate TODO 2]
```

**Why It's Important**:
- startup-advisor reads this FIRST for rapid context
- Keeps orientation time under 30 seconds
- Single source of truth for "what is this project?"
- Updated after major milestones (not every session)

---

#### 2. PROGRESS.md

**Location**: Repository root

**Purpose**: High-level session log (read by startup-advisor for trajectory)

**Format**:
```markdown
# [PROJECT_NAME] Development Progress

### YYYY-MM-DD - Session N
**Features:** [One-line feature summary]
**Fixes:** [One-line fix summary]
**Improvements:** [One-line improvement summary]
**Commits:** [Commit hashes and messages]

### YYYY-MM-DD - Session N-1
**Features:** [One-line feature summary]
**Documentation:** [One-line doc update]
**Commits:** [Commit hashes]

---

[Earlier sessions continue in reverse chronological order]
```

**What to Include**:
- **One line per category** (Features, Fixes, Improvements, Documentation, etc.)
- **Commit references** (hashes + short messages)
- **No implementation details** (save for session files)
- **Reverse chronological** (latest at top)

**Update Frequency**: After every session (manual or via session-summary agent)

**Why It's Important**:
- startup-advisor reads last 2 entries to understand trajectory
- Provides momentum context ("recent work that should continue")
- Identifies gaps between planned and actual progress
- Quick project history without reading full session logs

---

#### 3. Session Files (.claude/sessions/session_N.md)

**Location**: `.claude/sessions/` directory

**Purpose**: Detailed session documentation (read by startup-advisor for recent activity)

**Naming Convention**: `session_1.md`, `session_2.md`, `session_3.md` (sequential numbering)

**Format**:
```markdown
# Session N - [Title Summarizing Main Work]

**Date:** YYYY-MM-DD
**Duration:** Approximately [X hours]

## Summary
[1-3 paragraph narrative of what was accomplished and why it matters]

## Changes Made

### ✨ New Features
- **Feature name**: Brief description with context
- **Feature name**: Brief description with context

### 🔧 Fixes
- **Issue resolved**: What was broken and how it was fixed
- **Issue resolved**: What was broken and how it was fixed

### 📈 Improvements
- **Area improved**: What was enhanced and why
- **Area improved**: What was enhanced and why

## Key Code Changes

### /absolute/path/to/file1.ext
- Change description with rationale
- Impact on system architecture or behavior

### /absolute/path/to/file2.ext
- Change description with rationale
- Impact on system architecture or behavior

## Decisions & Discussion

### Architectural Decision: [Title]
[Explanation of what was decided, why, and what alternatives were considered]

### Design Trade-off: [Title]
[Explanation of competing concerns and resolution]

## Next Steps
- [ ] Task 1 with context
- [ ] Task 2 with context
- [ ] Task 3 with context

## Files Modified
- `/absolute/path/to/file1` - One-line summary
- `/absolute/path/to/file2` - One-line summary
- `/absolute/path/to/file3` - One-line summary

## Commit Info
**Status**: [Committed / Working changes not committed]
**Branch**: [branch-name]
**Commits**:
- abc1234 (commit message short summary)
- def5678 (commit message short summary)

## Technical Metrics
- Lines added: [X] / Lines removed: [Y]
- Test coverage: [Z%] (or [+/-N%] change)
- Build time: [N seconds]
- [Other relevant metrics]
```

**What to Include**:
- **Narrative summary**: Context for why this work happened
- **Key decisions**: Architectural or design choices with rationale
- **Code changes**: File paths with summaries (not full diffs)
- **Next steps**: Actionable TODOs for next session
- **Metrics**: Quantitative measures of progress

**Update Frequency**: At the end of every work session

**Why It's Important**:
- startup-advisor reads most recent session for "what was last worked on"
- Preserves decision rationale that would otherwise be lost
- Enables effective handoff between sessions (even days/weeks apart)
- Documents "why" not just "what" (git commits show what changed)

**Pro Tip**: Use session-summary agent to generate these automatically

---

### Optional Files (Recommended)

#### 4. README.md (Comprehensive)

**Location**: Repository root

**Purpose**: Complete project documentation for external users and deep dives

**Key Sections**:
- Project overview and purpose (detailed)
- Installation and setup instructions
- Usage examples and tutorials
- Architecture diagrams and explanations
- API/CLI reference documentation
- Contributing guidelines
- Licensing and credits

**Relationship to QUICK_OVERVIEW.md**:
- README is **comprehensive** (500-1000+ lines)
- QUICK_OVERVIEW is **concise** (150-250 lines)
- README is for deep understanding
- QUICK_OVERVIEW is for rapid orientation

**Update Frequency**: After major features or architecture changes

---

#### 5. Tutorial / Architecture Guide

**Location**: `tutorial.md` or `docs/architecture.md`

**Purpose**: Deep-dive explanation of system design and implementation patterns

**What to Include**:
- System architecture with diagrams
- Data flow explanations
- Design patterns and rationale
- Integration points and contracts
- Common operations and workflows
- Performance considerations
- Testing strategy

**Update Frequency**: After architectural changes or new patterns introduced

---

#### 6. Feature-Specific Documentation

**Location**: Within each `specs/###-feature/` directory

**Optional Files**:
- `IMPLEMENTATION_SUMMARY.md`: Post-implementation review
- `INTEGRATION_GUIDE.md`: How to use the implemented feature
- `TESTING_NOTES.md`: Test scenarios and edge cases
- `PERFORMANCE_NOTES.md`: Benchmarks and optimization notes

**When to Create**: For complex features that need additional context beyond spec/plan/tasks

---

### Supplementary Files Directory Structure

After full setup, your supplementary files should look like:

```
your-project/
├── QUICK_OVERVIEW.md              # ← Read by startup-advisor (1st)
├── PROGRESS.md                     # ← Read by startup-advisor (2nd)
├── README.md                       # Optional but recommended
├── tutorial.md                     # Optional architecture guide
├── .claude/
│   └── sessions/
│       ├── session_1.md           # ← Read by startup-advisor (3rd, most recent)
│       ├── session_2.md
│       ├── session_3.md
│       └── ...
└── specs/
    └── 006-feature-name/
        ├── spec.md                 # ← Read by startup-advisor (4th, current feature)
        ├── plan.md
        ├── tasks.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        ├── contracts/
        ├── IMPLEMENTATION_SUMMARY.md  # Optional
        └── INTEGRATION_GUIDE.md       # Optional
```

### startup-advisor Reading Order

When you say "I'm starting work on the project today, what should I focus on?", the agent reads:

1. **QUICK_OVERVIEW.md** → Rapid project context (what/why/how)
2. **PROGRESS.md (last 2 entries)** → Recent trajectory and momentum
3. **Most recent `.claude/sessions/session_N.md`** → Last session's details
4. **Most recent `specs/###-feature/` folder** → Current feature context
5. **Cross-reference** → Identify gaps, blockers, and next action

This reading order provides complete context in under 60 seconds of agent processing time.

---

## Project Initialization

### Step-by-Step Setup

#### 1. Copy All Templates
```bash
# From reference project to new project
cp -r reference-project/.specify/templates/* new-project/.specify/templates/
```

Verify you have:
- `spec-template.md`
- `plan-template.md`
- `tasks-template.md`
- `agent-file-template.md`

#### 2. Copy All Bash Scripts
```bash
cp -r reference-project/.specify/scripts/bash/* new-project/.specify/scripts/bash/
chmod +x new-project/.specify/scripts/bash/*.sh
```

Verify you have:
- `common.sh`
- `create-new-feature.sh`
- `setup-plan.sh`
- `check-prerequisites.sh`
- `update-agent-context.sh`

#### 3. Copy All Slash Commands
```bash
cp -r reference-project/.claude/commands/* new-project/.claude/commands/
```

Verify you have:
- `specify.md`
- `plan.md`
- `tasks.md`
- `implement.md`
- `clarify.md`
- `analyze.md`
- `constitution.md`

#### 4. Copy Agent Configuration
```bash
cp reference-project/.claude/agents/startup-advisor.md new-project/.claude/agents/
```

Optionally add session-summary agent (see template above).

#### 5. Create Constitution
```bash
# Option A: Copy and customize
cp reference-project/.specify/memory/constitution.md new-project/.specify/memory/
# Then edit to match your project's principles

# Option B: Use /constitution command
# In Claude Code, run: /constitution
# Answer questions interactively
```

#### 6. Initialize Supplementary Files
```bash
cd new-project

# Create PROGRESS.md
echo "# Project Development Progress" > PROGRESS.md
echo "" >> PROGRESS.md
echo "---" >> PROGRESS.md

# Create QUICK_OVERVIEW.md
# Use template from "Supplementary Project Files" section above
# Fill in project-specific details

# Create session directory
mkdir -p .claude/sessions

# Note: Session files (session_1.md, session_2.md, etc.) will be created
# as you work on the project, either manually or via session-summary agent
```

**Supplementary Files Checklist**:
- [x] `.claude/sessions/` directory created
- [ ] `PROGRESS.md` created (minimal structure)
- [ ] `QUICK_OVERVIEW.md` created (fill from template in section 8)
- [ ] `README.md` optional (can defer to after first feature)
- [ ] Session files will be created during work sessions

#### 7. Test the Setup
```bash
# Verify scripts are executable
.specify/scripts/bash/create-new-feature.sh --help

# Test feature creation (dry run)
.specify/scripts/bash/create-new-feature.sh --json "test feature"

# Should create specs/001-test-feature/ and branch (if git)
```

#### 8. Create First Feature (Real)
In Claude Code:
```
/specify Add comprehensive README with architecture overview
```

This will:
- Run create-new-feature.sh
- Create specs/001-add-comprehensive/
- Fill spec.md from template
- Report branch and spec path

#### 9. Complete First Cycle
```
/clarify             # Resolve ambiguities (if any)
/plan                # Generate technical design
/tasks               # Create task breakdown
/analyze             # Validate consistency (optional but recommended)
/implement           # Execute tasks (or manually implement)
```

#### 10. Verify Agent Context
After `/plan`, verify CLAUDE.md was auto-created:
```bash
cat CLAUDE.md
```

Should show:
- Active Technologies (from plan.md)
- Project Structure
- Commands for your tech stack
- Recent Changes (001-add-comprehensive)

---

## Workflow Guide

### Daily Workflow

#### Morning Routine
1. **Start Claude Code** in project directory
2. **Say**: "I'm starting work on the project today, what should I focus on?"
3. **startup-advisor runs**:
   - Reads QUICK_OVERVIEW.md, PROGRESS.md, recent session
   - Analyzes gaps, momentum, blockers
   - Recommends ONE next action
4. **Follow recommendation** (e.g., "Continue implementing tasks in 006-below-the-filter")

#### During Work
- **Use TodoWrite tool** frequently to track progress
- **Mark tasks [X] in tasks.md** as you complete them
- **Commit incrementally** after each task (not batch at end)

#### End of Session
1. **Say**: "Generate session summary for today's work"
2. **session-summary agent runs** (if configured):
   - Asks for highlights
   - Creates `.claude/sessions/session_N.md`
   - Updates PROGRESS.md
3. **Alternative**: Manually update PROGRESS.md with one-line summary

### Feature Workflow

#### Phase 1: Specification
```
/specify Add user authentication with OAuth2 support
```
- Creates branch `008-add-user` (auto-incremented)
- Creates `specs/008-add-user/spec.md`
- Fills requirements, user stories, acceptance criteria
- Marks ambiguities with `[NEEDS CLARIFICATION: ...]`

**Review**: Read spec.md, verify it captures WHAT and WHY (not HOW)

#### Phase 2: Clarification (Optional but Recommended)
```
/clarify
```
- Scans spec for ambiguities
- Asks up to 5 targeted questions (one at a time)
- Updates spec.md incrementally after each answer
- Creates `## Clarifications` section with session log

**Review**: Verify all `[NEEDS CLARIFICATION: ...]` markers resolved

#### Phase 3: Planning
```
/plan We'll use FastAPI for backend, NextAuth.js for frontend OAuth flow
```
- Checks for Clarifications section (pauses if missing)
- Fills Technical Context from arguments
- Runs Constitution Check (validates principles)
- Executes Phase 0: research.md (resolves unknowns)
- Executes Phase 1:
  - Creates contracts/ (OpenAPI schemas)
  - Creates data-model.md (entities and relationships)
  - Creates quickstart.md (integration test scenarios)
  - Calls `update-agent-context.sh claude` (updates CLAUDE.md)
- Re-runs Constitution Check
- Describes Phase 2 task generation approach (doesn't create tasks.md yet)

**Review**: Read plan.md sections, verify technical decisions align with constitution

#### Phase 4: Task Generation
```
/tasks
```
- Loads plan.md, data-model.md, contracts/, research.md, quickstart.md
- Generates tasks following template:
  - Phase 3.1: Setup
  - Phase 3.2: Tests First [P]
  - Phase 3.3: Core Implementation
  - Phase 3.4: Integration
  - Phase 3.5: Polish [P]
- Marks [P] for parallel-safe tasks (different files, no dependencies)
- Numbers sequentially (T001, T002, ...)
- Creates dependency graph

**Review**: Read tasks.md, verify TDD order (tests before implementation)

#### Phase 5: Quality Analysis (Optional but Recommended)
```
/analyze
```
- Loads spec.md, plan.md, tasks.md, constitution.md
- Detects:
  - Duplicate requirements
  - Ambiguities and placeholders
  - Coverage gaps (requirements without tasks)
  - Constitution violations
  - Terminology drift
- Assigns severity (CRITICAL, HIGH, MEDIUM, LOW)
- Produces report with recommendations
- **READ-ONLY**: Never modifies files automatically

**Review**: Address CRITICAL issues before /implement, optionally defer LOW issues

#### Phase 6: Implementation
```
/implement
```
- Executes tasks phase-by-phase
- Respects dependencies (sequential in order, [P] can batch)
- Follows TDD (tests before implementation)
- Marks [X] in tasks.md after each completion
- Halts on sequential task failure (reports and suggests remediation)
- Continues with successful [P] tasks, reports failures

**Review**: Verify all tasks marked [X], tests pass, spec requirements met

#### Phase 7: Commit and Merge
```bash
# Review changes
git status
git diff

# Commit (follow your project's commit message format)
git add .
git commit -m "feat(auth): implement OAuth2 authentication

- Added FastAPI OAuth2 endpoints
- Integrated NextAuth.js frontend flow
- Created user model and auth middleware
- Added 45 tests (100% pass rate)

Closes #008"

# Merge to main (or create PR)
git checkout main
git merge 008-add-user
git push
```

**Review**: Verify merge conflicts resolved, CI passes

---

## Best Practices

### Constitutional Discipline
✅ **DO**: Enforce constitution gates at Phase 0 and Phase 1 of /plan
✅ **DO**: Document violations in Complexity Tracking table (with justification)
✅ **DO**: Amend constitution when principles repeatedly block progress
❌ **DON'T**: Skip Constitution Check to "move faster"
❌ **DON'T**: Silently ignore principle violations

### Specification Quality
✅ **DO**: Mark all assumptions as `[NEEDS CLARIFICATION: specific question]`
✅ **DO**: Write testable acceptance criteria (Given/When/Then format)
✅ **DO**: Focus on WHAT and WHY (business value), defer HOW to /plan
❌ **DON'T**: Include implementation details in spec.md (languages, frameworks, APIs)
❌ **DON'T**: Guess at ambiguous requirements (mark and clarify)

### Planning Rigor
✅ **DO**: Run /clarify before /plan to reduce rework risk
✅ **DO**: Create failing tests in Phase 1 (contract tests, integration tests)
✅ **DO**: Call `update-agent-context.sh` exactly as specified (no extra args)
✅ **DO**: Stop at Phase 1 - let /tasks handle Phase 2
❌ **DON'T**: Create tasks.md during /plan (breaks separation of concerns)
❌ **DON'T**: Skip research.md if unknowns remain (causes downstream failures)

### Task Breakdown
✅ **DO**: Mark [P] for parallel-safe tasks (different files, no dependencies)
✅ **DO**: Enforce TDD order (Phase 3.2 tests before Phase 3.3 implementation)
✅ **DO**: Include exact file paths in task descriptions
✅ **DO**: Keep tasks atomic (1 task = 1 file or closely related files)
❌ **DON'T**: Mark [P] on tasks that modify the same file (causes conflicts)
❌ **DON'T**: Create vague tasks ("Add authentication" → break into smaller tasks)

### Implementation Discipline
✅ **DO**: Execute tasks phase-by-phase (no skipping ahead)
✅ **DO**: Mark [X] in tasks.md after EACH completion (not batch at end)
✅ **DO**: Commit incrementally (after each task or small group)
✅ **DO**: Halt and remediate on sequential task failure
❌ **DON'T**: Skip tests to "finish faster" (violates TDD principle)
❌ **DON'T**: Batch commits (loses granular history)

### Session Continuity
✅ **DO**: Use startup-advisor at the start of EVERY session
✅ **DO**: Generate session summary at the end of EVERY session
✅ **DO**: Update PROGRESS.md with one-line summary per session
✅ **DO**: Preserve session files in `.claude/sessions/` (never delete)
❌ **DON'T**: Rely on memory from previous sessions (read session files)
❌ **DON'T**: Skip QUICK_OVERVIEW.md updates (causes orientation drift)

### Agent Context Maintenance
✅ **DO**: Let `update-agent-context.sh` auto-update CLAUDE.md during /plan
✅ **DO**: Preserve manual additions in `<!-- MANUAL ADDITIONS START -->` / `<!-- END -->` regions
✅ **DO**: Keep agent context files under 150 lines (token efficiency)
❌ **DON'T**: Manually edit Active Technologies or Recent Changes (script overwrites)
❌ **DON'T**: Delete CLAUDE.md (regenerate with `update-agent-context.sh claude`)

---

## User Preferences

### Preferences Extracted from Audio Description Protocol Project

#### Communication Style
- **Concise responses**: Avoid preamble/postamble unless asked
- **Direct answers**: "4" not "The answer is 4"
- **Minimal explanations**: Only explain complex decisions or non-obvious choices
- **Token efficiency**: Shorter is better when maintaining quality

#### Workflow Preferences
- **Proactive todo tracking**: Use TodoWrite tool frequently during multi-step tasks
- **Incremental todo completion**: Mark completed immediately, don't batch
- **Parallel execution**: Batch independent tool calls in single message when possible
- **Constitutional adherence**: Respect project principles, document violations if unavoidable

#### File Operations
- **Edit over write**: Prefer editing existing files to creating new ones
- **Read before write**: Always read file before modifying (Edit/Write tools enforce this)
- **Avoid unnecessary files**: Never proactively create docs unless explicitly requested
- **Glob/Grep over Bash**: Use specialized tools for file operations, not `cat`/`grep` commands

#### Code Quality
- **TDD discipline**: Tests before implementation (enforced in tasks.md Phase 3.2)
- **Exact file paths**: Always specify absolute paths in task descriptions
- **[P] markers**: Use parallel markers for truly independent tasks only
- **Atomic commits**: Small, focused commits after each task

#### Agent Behavior
- **Startup advisor**: Use at beginning of every session for orientation
- **Session summary**: Generate at end of every session for continuity
- **Constitutional checks**: Never skip, document violations in Complexity Tracking
- **Clarification before planning**: Run /clarify before /plan to reduce rework

#### UI Preferences (from CLAUDE.md manual additions)
- **TermSelector.tsx sensitivity**: "Take care not to break the UI, always ask before modifying"
- **Term styling preservation**: "Never edit the terms styling in TermSelector.tsx without asking"
- **Visual design preservation**: Maintain sophisticated styling when refactoring

#### Documentation Style
- **Markdown formatting**: Use headings, tables, code blocks for readability
- **Execution flows**: Quasi-executable pseudocode in templates
- **One-line summaries**: For file lists (e.g., "spec.md - Core requirements and user stories")
- **XML-style comments**: For technical implementation notes

---

## Troubleshooting

### Issue: Branch validation fails
**Symptom**: `check-prerequisites.sh` errors with "Not on a feature branch"
**Cause**: Not on a branch matching `###-feature-name` pattern
**Fix**:
```bash
# Option 1: Use /specify to create feature branch
/specify Your feature description

# Option 2: Manual branch creation (if git)
git checkout -b 009-your-feature

# Option 3: Non-git repository
export SPECIFY_FEATURE="009-your-feature"
mkdir -p specs/009-your-feature
```

### Issue: /plan pauses with "Run /clarify first"
**Symptom**: /plan command stops and requests clarification
**Cause**: spec.md has no `## Clarifications` section (indicates unresolved ambiguities)
**Fix**:
```bash
# Option 1: Run /clarify (recommended)
/clarify

# Option 2: Explicit override (increases rework risk)
"Proceed without clarification, I accept rework risk"
```

### Issue: update-agent-context.sh fails with "No language information found"
**Symptom**: CLAUDE.md has empty Active Technologies section
**Cause**: plan.md missing `**Language/Version**: ` field in Technical Context
**Fix**: Edit plan.md and fill Technical Context section properly:
```markdown
## Technical Context
**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, Pydantic
**Storage**: PostgreSQL
**Testing**: pytest
```

### Issue: /tasks generates tasks but /implement can't find them
**Symptom**: "tasks.md not found" error during /implement
**Cause**: tasks.md created in wrong directory
**Fix**: Verify tasks.md is in `specs/###-feature-name/tasks.md`, not repository root

### Issue: Parallel tasks marked [P] fail with conflicts
**Symptom**: Git merge conflicts or file locking during parallel execution
**Cause**: [P] tasks incorrectly marked on tasks modifying the same file
**Fix**: Review tasks.md, remove [P] from tasks that touch shared files:
```markdown
❌ WRONG:
- [ ] T008 [P] User model in src/models/user.py
- [ ] T009 [P] Admin model in src/models/user.py  # SAME FILE

✅ CORRECT:
- [ ] T008 [P] User model in src/models/user.py
- [ ] T009 Admin model in src/models/admin.py  # DIFFERENT FILE
```

### Issue: Constitution Check fails with principle violations
**Symptom**: /plan halts at Constitution Check gate
**Cause**: Design violates a MUST principle from constitution.md
**Fix**:
```markdown
# Option 1: Refactor design to comply
[Adjust plan.md to follow principle]

# Option 2: Justify violation in Complexity Tracking
| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Used React instead of PyTorch | Frontend requires UI framework | PyTorch is backend-only, cannot render UI |

# Option 3: Amend constitution (if principle is outdated)
/constitution Update "Python + PyTorch First" to allow TypeScript for frontend
```

### Issue: Agent context file not updating
**Symptom**: CLAUDE.md shows old technologies after running /plan
**Cause**: Script called incorrectly or manual edits outside protected regions
**Fix**:
```bash
# Regenerate manually
.specify/scripts/bash/update-agent-context.sh claude

# Verify protected regions exist
grep "MANUAL ADDITIONS START" CLAUDE.md
# If missing, re-create from template
```

---

## Quick Reference Card

### Commands
| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/specify <desc>` | Create feature spec | Start of new feature |
| `/clarify` | Resolve ambiguities | After /specify, before /plan |
| `/plan [tech]` | Generate technical design | After clarification complete |
| `/tasks` | Create task breakdown | After /plan complete |
| `/analyze` | Validate consistency | After /tasks, before /implement |
| `/implement` | Execute tasks | After /analyze (or skip to implement) |
| `/constitution [changes]` | Update principles | When amending governance |

### Files
| File | Purpose | Updated By |
|------|---------|------------|
| `constitution.md` | Project principles | /constitution command or manual |
| `spec.md` | Feature requirements (WHAT/WHY) | /specify command |
| `plan.md` | Technical design (HOW) | /plan command |
| `tasks.md` | Implementation breakdown | /tasks command |
| `research.md` | Phase 0 unknowns resolution | /plan command (Phase 0) |
| `data-model.md` | Entities and relationships | /plan command (Phase 1) |
| `quickstart.md` | Integration test scenarios | /plan command (Phase 1) |
| `contracts/` | API schemas (OpenAPI, etc.) | /plan command (Phase 1) |
| `CLAUDE.md` | Agent context (auto-generated) | update-agent-context.sh |
| `PROGRESS.md` | Session log (high-level) | Manual or session-summary agent |
| `QUICK_OVERVIEW.md` | One-page project reference | Manual updates |
| `.claude/sessions/session_N.md` | Detailed session logs | session-summary agent or manual |

### Scripts
| Script | Purpose | Called By |
|--------|---------|-----------|
| `create-new-feature.sh` | Create feature branch/directory | /specify command |
| `setup-plan.sh` | Initialize planning phase | /plan command |
| `check-prerequisites.sh` | Validate workflow phase | /tasks, /implement, /analyze commands |
| `update-agent-context.sh` | Maintain agent context files | /plan command (Phase 1, step 5) |
| `common.sh` | Shared utility functions | All other scripts |

### Agents
| Agent | Purpose | Triggered By |
|-------|---------|--------------|
| `startup-advisor` | Session orientation | User says "I'm starting work" or similar |
| `session-summary` | Session documentation | User says "Generate session summary" (optional agent) |

### Task Markers
| Marker | Meaning | Example |
|--------|---------|---------|
| `[P]` | Parallel-safe (different files, no dependencies) | `T004 [P] Contract test POST /api/users` |
| `[X]` | Completed | `[X] T001 Create project structure` |
| (none) | Sequential (must complete before next) | `T011 POST /api/users endpoint` |

### Phase Progression
```
┌─────────────┐
│  /specify   │  Creates: specs/###-feature/spec.md
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  /clarify   │  Updates: spec.md (adds ## Clarifications section)
└──────┬──────┘  Optional but recommended
       │
       ▼
┌─────────────┐
│    /plan    │  Creates: plan.md, research.md, data-model.md, quickstart.md, contracts/
└──────┬──────┘  Updates: CLAUDE.md (auto-generated)
       │
       ▼
┌─────────────┐
│   /tasks    │  Creates: tasks.md
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  /analyze   │  Validates: spec.md ↔ plan.md ↔ tasks.md consistency
└──────┬──────┘  Optional but recommended
       │
       ▼
┌─────────────┐
│ /implement  │  Executes: All tasks in tasks.md
└──────┬──────┘  Updates: tasks.md (marks [X])
       │
       ▼
  [Commit & Merge]
```

---

## Conclusion

This guide provides a complete reference for setting up Spec-Driven Development (SDD) and Spec Kit in a new project. The system is designed to:

- **Enforce constitutional principles** through automated gates
- **Prevent scope creep** by locking requirements before implementation
- **Maintain traceability** from idea to code with full audit trail
- **Enable parallel execution** through task dependency analysis
- **Ensure project continuity** via startup-advisor and session tracking

### Next Steps After Setup

1. **Create your constitution** - Define 3-7 core principles that matter for your project
2. **Write QUICK_OVERVIEW.md** - One-page reference for rapid orientation (see section 8)
3. **Initialize PROGRESS.md** - Start with project name and horizontal rule
4. **Test with first feature** - Run full cycle: /specify → /clarify → /plan → /tasks → /implement
5. **Create first session file** - Document session 1 work (manual or via session-summary)
6. **Refine templates** - Adjust templates based on your project's needs (preserve execution flows)
7. **Establish session rhythm** - Start with startup-advisor, end with session-summary
8. **Update supplementary files** - Keep QUICK_OVERVIEW.md and PROGRESS.md current

### Support

- **Reference Implementation**: Audio Description Protocol (provided as context)
- **Template Source**: All templates, scripts, and commands copied from working implementation
- **Troubleshooting**: See Troubleshooting section above for common issues

---

**Version**: 1.0
**Last Updated**: 2025-09-30
**Based On**: Audio Description Protocol v1.0 (14 sessions, 7 features, production-ready)
**License**: CC0-1.0 (adapt freely for your projects)