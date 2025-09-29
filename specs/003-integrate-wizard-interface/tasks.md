# Tasks: Wizard-Python Validation Integration

**Input**: Design documents from `/specs/003-integrate-wizard-interface/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: FastAPI, PyTorch, jsonschema, TypeScript
   → Structure: web app (Python backend + TypeScript frontend)
2. Load design documents:
   → data-model.md: 5 entities (ValidationRequest, ValidationResult, ValidationError, UserSession, ValidationSchema)
   → contracts/: validation-api.yaml with 3 endpoints
   → quickstart.md: 5 test scenarios for integration validation
3. Generate tasks by category following Phase 2 approach from plan
4. Apply constitutional TDD ordering: Tests before implementation
5. Mark [P] for parallel execution (different files, no dependencies)
6. Number tasks sequentially (T001-T032)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup & Infrastructure

- [x] T001 Create Python validation backend structure in `src/adp_core/validation/` and `src/adp_core/api/`
- [x] T002 Initialize FastAPI project with dependencies: fastapi, pydantic, jsonschema, aiofiles, uvicorn, pytest-asyncio
- [x] T003 [P] Configure Python linting (ruff) and formatting tools for src/ directory
- [x] T004 [P] Set up TypeScript client generation from OpenAPI spec in `wizard/src/services/`
- [x] T005 [P] Create test structure: `tests/python/` for backend tests, `tests/typescript/` for client tests

## Phase 3.2: Contract Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T006 [P] Contract test POST /validation/validate endpoint in `tests/python/contract/test_validate_endpoint.py`
- [x] T007 [P] Contract test GET /validation/schemas endpoint in `tests/python/contract/test_schemas_endpoint.py`
- [x] T008 [P] Contract test POST /validation/session endpoint in `tests/python/contract/test_session_endpoint.py`
- [x] T009 [P] Integration test real-time field validation scenario in `tests/typescript/integration/test_field_validation.spec.ts`
- [x] T010 [P] Integration test schema-specific validation scenario in `tests/typescript/integration/test_schema_validation.spec.ts`
- [x] T011 [P] Integration test offline validation fallback scenario in `tests/typescript/integration/test_offline_validation.spec.ts`
- [x] T012 [P] Integration test session persistence scenario in `tests/typescript/integration/test_session_persistence.spec.ts`
- [x] T013 [P] Integration test comprehensive validation report scenario in `tests/typescript/integration/test_validation_report.spec.ts`

## Phase 3.3: Core Data Models (ONLY after tests are failing)

- [x] T014 [P] ValidationRequest Pydantic model in `src/adp_core/validation/models.py`
- [x] T015 [P] ValidationResult Pydantic model in `src/adp_core/validation/models.py`
- [x] T016 [P] ValidationError Pydantic model in `src/adp_core/validation/models.py`
- [x] T017 [P] UserSession model in `src/adp_core/validation/session_manager.py`
- [x] T018 [P] ValidationSchema model in `src/adp_core/validation/schema_loader.py`

## Phase 3.4: Python Validation Core Services

- [x] T019 SchemaLoader service with caching in `src/adp_core/validation/schema_loader.py`
- [x] T020 SessionManager for rule versioning in `src/adp_core/validation/session_manager.py`
- [x] T021 ValidationService coordinator in `src/adp_core/validation/service.py`
- [x] T022 Error formatting and message generation in `src/adp_core/validation/error_formatter.py`

## Phase 3.5: FastAPI Endpoints Implementation

- [x] T023 POST /validation/validate endpoint implementation in `src/adp_core/api/validation_api.py`
- [x] T024 GET /validation/schemas endpoint implementation in `src/adp_core/api/validation_api.py`
- [x] T025 POST /validation/session endpoint implementation in `src/adp_core/api/validation_api.py`
- [x] T026 CORS middleware and error handling in `src/adp_core/api/middleware.py`
- [x] T027 FastAPI application setup and routing in `src/adp_core/api/app.py`

## Phase 3.6: TypeScript Client Integration

- [ ] T028 [P] Generated OpenAPI client wrapper in `wizard/src/services/validation-client.ts`
- [ ] T029 [P] Session storage management in `wizard/src/services/session-storage.ts`
- [ ] T030 [P] Validation UI components in `wizard/src/components/validation/ValidationFeedback.tsx`
- [ ] T031 [P] Form field validation hooks in `wizard/src/components/forms/useFieldValidation.ts`

## Phase 3.7: Integration & Polish

- [ ] T032 End-to-end validation flow testing with quickstart scenarios
- [ ] T033 [P] Performance optimization for <500ms response target
- [ ] T034 [P] Unit tests for validation models in `tests/python/unit/test_models.py`
- [ ] T035 [P] Unit tests for session management in `tests/python/unit/test_session_manager.py`
- [ ] T036 [P] Unit tests for schema loading in `tests/python/unit/test_schema_loader.py`
- [ ] T037 Offline validation queue implementation
- [ ] T038 TypeScript bridge update for existing `src/adp_core/typescript_bridge.py`

## Dependencies

- Setup (T001-T005) before everything
- Contract tests (T006-T013) before models (T014-T018)
- Models (T014-T018) before services (T019-T022)
- Services (T019-T022) before endpoints (T023-T027)
- Python backend (T019-T027) before TypeScript client (T028-T031)
- Core implementation before integration & polish (T032-T038)

## Parallel Execution Examples

### Phase 3.2 - Contract Tests (Run together)
```bash
# Launch all contract tests in parallel:
Task: "Contract test POST /validation/validate endpoint in tests/python/contract/test_validate_endpoint.py"
Task: "Contract test GET /validation/schemas endpoint in tests/python/contract/test_schemas_endpoint.py"
Task: "Contract test POST /validation/session endpoint in tests/python/contract/test_session_endpoint.py"
Task: "Integration test real-time field validation scenario in tests/typescript/integration/test_field_validation.spec.ts"
Task: "Integration test schema-specific validation scenario in tests/typescript/integration/test_schema_validation.spec.ts"
```

### Phase 3.3 - Data Models (Run together)
```bash
# Launch all model creation tasks in parallel:
Task: "ValidationRequest Pydantic model in src/adp_core/validation/models.py"
Task: "ValidationResult Pydantic model in src/adp_core/validation/models.py"
Task: "ValidationError Pydantic model in src/adp_core/validation/models.py"
Task: "UserSession model in src/adp_core/validation/session_manager.py"
Task: "ValidationSchema model in src/adp_core/validation/schema_loader.py"
```

### Phase 3.6 - TypeScript Components (Run together)
```bash
# Launch TypeScript client tasks in parallel:
Task: "Generated OpenAPI client wrapper in wizard/src/services/validation-client.ts"
Task: "Session storage management in wizard/src/services/session-storage.ts"
Task: "Validation UI components in wizard/src/components/validation/ValidationFeedback.tsx"
Task: "Form field validation hooks in wizard/src/components/forms/useFieldValidation.ts"
```

## Constitutional Compliance Checkpoints

- **Python + PyTorch First**: ✅ Python validation core before TypeScript integration
- **Spec-First Development**: ✅ All tasks reference design documents
- **JSON Schema Compliance**: ✅ T019 implements schema loading for all ADP schemas + taxonomy
- **Library-First Modularity**: ✅ Validation logic in reusable services before API endpoints
- **Test-Driven Delivery**: ✅ Contract tests (T006-T013) before implementation (T014+)

## Notes

- [P] tasks = different files, no dependencies - safe for parallel execution
- Verify all contract tests fail before implementing any models or services
- Follow TDD strictly: Red → Green → Refactor cycle
- Each task should result in a working, tested increment
- Performance target: <500ms validation response time (T033)
- Offline capability implementation in T037 enables graceful degradation

## Validation Checklist

✅ All OpenAPI contracts have corresponding tests (T006-T008)
✅ All data model entities have model tasks (T014-T018)
✅ All tests come before implementation (Phase 3.2 before 3.3+)
✅ Parallel tasks operate on different files
✅ Each task specifies exact file path
✅ Constitutional principles followed throughout
✅ Quickstart scenarios covered in integration tests (T009-T013)