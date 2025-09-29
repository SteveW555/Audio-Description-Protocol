
# Implementation Plan: Wizard-Python Validation Integration

**Branch**: `003-integrate-wizard-interface` | **Date**: 2025-09-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-integrate-wizard-interface/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Integrate the existing TypeScript wizard interface with the Python validation framework to provide real-time validation feedback during protocol creation. Users will receive field-level validation on blur/change events with brief error messages, while maintaining session persistence and graceful degradation when validation services are unavailable.

## Technical Context
**Language/Version**: Python 3.11+ (primary), TypeScript (wizard interface)
**Primary Dependencies**: PyTorch, jsonschema, FastAPI, Node.js/TypeScript runtime
**Storage**: File-based (JSON schemas, protocol configurations), session storage for wizard state
**Testing**: pytest (Python validation), jest/testing-library (TypeScript wizard)
**Target Platform**: Cross-platform desktop/web application with Python backend
**Project Type**: web - TypeScript frontend + Python backend API
**Performance Goals**: <500ms validation response time, field-level validation on blur events
**Constraints**: Offline-capable protocol creation, session persistence, graceful degradation
**Scale/Scope**: Single-user wizard sessions, all current ADP schemas + taxonomy support

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Python + PyTorch First**: ✅ PASS - Python 3.11+ with PyTorch core, using jsonschema for validation
**Spec-First Development**: ✅ PASS - Feature begins with written spec including data flow and schema references
**JSON Schema Compliance**: ✅ PASS - Validates against all current ADP schemas including taxonomy
**Library-First Modularity**: ✅ PASS - Validation logic packaged as reusable Python libraries with unit tests
**Test-Driven Delivery**: ✅ PASS - Tests written alongside code, schema validation tests required
**Ethical + Licensing**: ✅ PASS - No new dataset creation, working with existing CC0-1.0 schemas

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Python validation backend
src/
├── adp_core/
│   ├── validation/
│   │   ├── service.py          # Validation service coordinator
│   │   ├── schema_loader.py    # JSON schema loading and caching
│   │   └── session_manager.py  # Session persistence
│   ├── api/
│   │   ├── validation_api.py   # FastAPI validation endpoints
│   │   └── middleware.py       # Error handling, CORS
│   └── typescript_bridge.py    # Existing bridge interface

# TypeScript wizard frontend (existing)
wizard/
├── src/
│   ├── components/
│   │   ├── validation/         # Validation UI components
│   │   └── forms/              # Enhanced form components
│   ├── services/
│   │   ├── validation-client.ts # API client for validation
│   │   └── session-storage.ts   # Local session management
│   └── types/
│       └── validation.ts        # Validation response types

tests/
├── python/
│   ├── unit/                   # Python validation unit tests
│   ├── integration/            # API integration tests
│   └── contract/               # Schema contract tests
└── typescript/
    ├── unit/                   # Component unit tests
    └── integration/            # End-to-end validation flow tests
```

**Structure Decision**: Web application with existing TypeScript wizard frontend and new Python validation backend API. Leverages existing wizard infrastructure while adding validation integration layer.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Validation API contract tests → FastAPI endpoint contract tests [P]
- Data model entities → Pydantic model creation tasks [P]
- TypeScript types → Generated client type definitions [P]
- Wizard integration → React component enhancement tasks
- User scenarios from quickstart → End-to-end integration tests

**Ordering Strategy**:
- TDD order: Schema/contract tests → Models → API endpoints → Client integration → UI components
- Dependency order: Python validation core → FastAPI API → TypeScript client → Wizard UI
- Constitutional compliance: Python+PyTorch first, then TypeScript integration
- Mark [P] for parallel execution within same layer (e.g., multiple model files)

**Specific Task Categories**:
1. **Schema & Contract Tests** (5-7 tasks): OpenAPI validation, schema loading tests, contract test setup
2. **Python Validation Core** (8-10 tasks): Pydantic models, validation service, session management, schema caching
3. **FastAPI Integration** (6-8 tasks): API endpoints, middleware, error handling, CORS setup
4. **TypeScript Client** (4-6 tasks): Generated client, validation service wrapper, error handling
5. **Wizard UI Integration** (6-8 tasks): Validation components, form enhancements, offline handling, session management

**Estimated Output**: 29-39 numbered, ordered tasks in tasks.md following constitutional TDD principles

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
