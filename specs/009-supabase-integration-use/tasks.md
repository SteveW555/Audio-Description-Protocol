# Tasks: Supabase Integration for Usage Tracking

**Input**: Design documents from `/specs/009-supabase-integration-use/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/supabase-schema.sql, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ COMPLETE: TypeScript/React frontend, Supabase PostgreSQL backend
   → Extract: TypeScript 5.2+, React 18.2+, Supabase Client, Vitest
2. Load optional design documents:
   → ✅ data-model.md: adp_usage table entity
   → ✅ contracts/: supabase-schema.sql contract
   → ✅ research.md: Silent error handling, HOF pattern, timeout decisions
3. Generate tasks by category:
   → Setup: Dependencies, Supabase config
   → Tests: Contract test (schema), integration tests (tracking)
   → Core: UsageTracker service, button instrumentation
   → Integration: WizardLayout button handlers
   → Polish: Manual validation scenarios
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ Schema contract has test
   → ✅ Entity (adp_usage) has implementation
   → ✅ All 6 buttons instrumented
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app structure**: `wizard/src/` for frontend, `server.js` for backend
- Paths based on plan.md structure (React SPA with Express server)

## Phase 3.1: Setup
- [ ] T001 Install Supabase dependencies: `@supabase/supabase-js` in wizard/package.json
- [ ] T002 Create Supabase client configuration in wizard/src/lib/supabaseClient.ts
- [ ] T003 [P] Add environment variables template to wizard/.env.example (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test for Supabase schema in wizard/tests/contract/supabase-schema.test.ts (verify table structure, indexes, constraints)
- [ ] T005 [P] Integration test for basic tracking flow in wizard/tests/integration/usageTracking.test.ts (track button click, verify record created)
- [ ] T006 [P] Integration test for silent failure in wizard/tests/integration/usageTracking.silentFailure.test.ts (network error, verify no user impact)
- [ ] T007 [P] Integration test for timeout enforcement in wizard/tests/integration/usageTracking.timeout.test.ts (verify 750ms timeout)
- [ ] T008 [P] Integration test for concurrent prevention in wizard/tests/integration/usageTracking.concurrent.test.ts (rapid clicks, verify only first tracked)

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T009 Create UsageData and UsageRecord TypeScript interfaces in wizard/src/types/usage.ts
- [ ] T010 Implement SupabaseUsageTracker service class in wizard/src/services/usageTracking.ts (track method, 750ms timeout, silent failures, concurrent prevention)
- [ ] T011 Create button-specific data extractors in wizard/src/services/usageDataExtractors.ts (6 extractor functions for each button type)
- [ ] T012 Create withTracking higher-order function wrapper in wizard/src/utils/withTracking.tsx

## Phase 3.4: Integration
- [ ] T013 Instrument handleRandomizeAll in wizard/src/components/WizardLayout.tsx:626 with tracking wrapper
- [ ] T014 Instrument handleRunModelTest in wizard/src/components/WizardLayout.tsx:634 with tracking wrapper
- [ ] T015 Instrument handleGenerateCasualPhrase in wizard/src/components/WizardLayout.tsx:679 with tracking wrapper
- [ ] T016 Instrument handleTranslatePhrase in wizard/src/components/WizardLayout.tsx:816 with tracking wrapper
- [ ] T017 Instrument handleGenerateStandardizedPhrase in wizard/src/components/WizardLayout.tsx:758 with tracking wrapper
- [ ] T018 Instrument handleSaveJSON in wizard/src/components/WizardLayout.tsx:666 with tracking wrapper

## Phase 3.5: Polish
- [ ] T019 [P] Unit tests for data extractors in wizard/tests/unit/usageDataExtractors.test.ts (verify correct field extraction for each button)
- [ ] T020 [P] Unit tests for withTracking wrapper in wizard/tests/unit/withTracking.test.ts (verify after-completion timing, error re-throw)
- [ ] T021 Execute Quickstart Scenario 1 (Basic Tracking - Randomize All) from quickstart.md
- [ ] T022 Execute Quickstart Scenario 2 (Phrase Translation Tracking) from quickstart.md
- [ ] T023 Execute Quickstart Scenario 3 (Silent Failure - Network Error) from quickstart.md
- [ ] T024 Execute Quickstart Scenario 4 (750ms Timeout Enforcement) from quickstart.md
- [ ] T025 Execute Quickstart Scenario 5 (Concurrent Click Prevention) from quickstart.md
- [ ] T026 Execute Quickstart Scenario 6 (All Buttons Tracked) from quickstart.md
- [ ] T027 Execute Quickstart Scenario 7 (Error State Tracking) from quickstart.md
- [ ] T028 Execute Quickstart Scenario 8 (Special Characters and Long Text) from quickstart.md
- [ ] T029 Execute Quickstart Scenario 9 (Data Retention) from quickstart.md
- [ ] T030 Execute Quickstart Scenario 10 (No UI for Viewing Data) from quickstart.md
- [ ] T031 Deploy Supabase schema using contracts/supabase-schema.sql to production Supabase project
- [ ] T032 Verify all tests pass (contract + integration + unit)

## Dependencies

**Setup Dependencies:**
- T002 (Supabase client config) requires T001 (install dependencies)
- T003 (env template) independent

**Test Dependencies:**
- T004-T008 all independent [P] (different test files)
- T004-T008 require T001-T002 (Supabase setup)

**Core Implementation Dependencies:**
- T009 (interfaces) independent, but blocks T010-T012
- T010 (UsageTracker service) requires T009 (interfaces)
- T011 (data extractors) requires T009 (interfaces)
- T012 (withTracking wrapper) requires T010 (UsageTracker)

**Integration Dependencies:**
- T013-T018 (button instrumentation) all modify same file (WizardLayout.tsx) → SEQUENTIAL (no [P])
- T013-T018 require T010, T011, T012 (core implementation)

**Polish Dependencies:**
- T019-T020 independent [P] (different test files)
- T021-T030 sequential (manual validation scenarios)
- T031 (schema deployment) independent, can run anytime
- T032 (final validation) requires all prior tasks complete

**Critical Path:**
```
T001 → T002 → T004-T008 → T009 → T010 → T012 → T013 → T014 → T015 → T016 → T017 → T018 → T032
                     ↓
                   T011 (extractors, parallel with T010)
```

## Parallel Execution Examples

### Setup Phase (after T001)
```bash
# Can run T002 and T003 in parallel:
# T002: Supabase client config
# T003: Env template
```

### Test Phase (after T002)
```bash
# Launch T004-T008 together (all independent test files):
# T004: Contract test (schema validation)
# T005: Integration test (basic tracking)
# T006: Integration test (silent failure)
# T007: Integration test (timeout)
# T008: Integration test (concurrent prevention)
```

### Core Implementation (after T009)
```bash
# Can run T010 and T011 in parallel:
# T010: UsageTracker service
# T011: Data extractors
```

### Polish Phase (after T018)
```bash
# Can run T019 and T020 in parallel:
# T019: Unit tests for extractors
# T020: Unit tests for withTracking
```

## Notes
- **[P] tasks** = different files, no dependencies, safe to run concurrently
- **WizardLayout instrumentation (T013-T018)** must be sequential (same file modifications)
- **Silent failure requirement**: No console logs, no user-facing errors, no state changes on tracking failure
- **Timeout enforcement**: Use Promise.race() with 750ms timeout
- **Concurrent prevention**: Boolean lock in UsageTracker service
- **TDD approach**: Tests T004-T008 must be written and failing before T009-T018 implementation
- **Manual validation**: Quickstart scenarios (T021-T030) verify production behavior

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - ✅ contracts/supabase-schema.sql → T004 (contract test)
   - ✅ Schema deployment → T031

2. **From Data Model**:
   - ✅ adp_usage entity → T009 (TypeScript interfaces), T010 (service implementation)

3. **From User Stories (Quickstart)**:
   - ✅ 10 quickstart scenarios → T021-T030 (manual validation tasks)

4. **From Integration Points**:
   - ✅ 6 button handlers → T013-T018 (instrumentation tasks)

5. **Ordering**:
   - ✅ Setup (T001-T003) → Tests (T004-T008) → Core (T009-T012) → Integration (T013-T018) → Polish (T019-T032)

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (supabase-schema.sql → T004)
- [x] All entities have model tasks (adp_usage → T009, T010)
- [x] All tests come before implementation (T004-T008 before T009-T018)
- [x] Parallel tasks truly independent (T004-T008 different files, T019-T020 different files)
- [x] Each task specifies exact file path (all tasks include wizard/... paths)
- [x] No task modifies same file as another [P] task (T013-T018 sequential, not marked [P])
- [x] All 6 buttons have instrumentation tasks (T013-T018)
- [x] All quickstart scenarios have validation tasks (T021-T030)
- [x] Silent failure, timeout, concurrent prevention all tested (T006, T007, T008)
