# Tasks: Add Frequency Filter Toolbar

**Input**: Design documents from `/specs/005-add-a-filter/`
**Prerequisites**: plan.md (required), research.md, data-model.md, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **React Frontend**: `wizard/src/` for components
- **Types**: `wizard/src/types/` for TypeScript definitions
- **Hooks**: `wizard/src/hooks/` for custom React hooks
- **Store**: `wizard/src/store/` for Zustand state management
- **Tests**: `wizard/tests/` for test files
- **Backend**: `src/` for Python taxonomy file

## Phase 3.1: Setup
- [ ] T001 Verify wizard project dependencies (React 19.1.1, TypeScript 5.2.0, Zustand, Tailwind CSS)
- [ ] T002 Create required directory structures: `wizard/src/types/`, `wizard/src/hooks/`, `wizard/src/store/`
- [ ] T003 [P] Configure TypeScript paths if needed in `wizard/tsconfig.json`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

### Component Tests
- [ ] T004 [P] Create test file `wizard/tests/components/FrequencyFilter.test.tsx` with rendering tests
- [ ] T005 [P] Create test file `wizard/tests/hooks/useFrequencyFilter.test.ts` with filtering logic tests
- [ ] T006 [P] Create test file `wizard/tests/store/filterStore.test.ts` with state management tests

### Integration Tests
- [ ] T007 Add integration test in `wizard/tests/integration/filterPersistence.test.tsx` for cross-step persistence
- [ ] T008 Add integration test in `wizard/tests/integration/termFiltering.test.tsx` for filter + TermSelector interaction
- [ ] T009 Add test for empty state handling with disabled filters and "No [frequency] Available" labels

## Phase 3.3: Type Definitions & Models
- [ ] T010 [P] Create `wizard/src/types/frequency.ts` with FrequencyCategory type and Term interface
- [ ] T011 [P] Create `wizard/src/types/filter.ts` with FilterState, FilterAvailability, and component prop interfaces
- [ ] T012 [P] Create `wizard/src/store/filterStore.ts` with Zustand store implementation

## Phase 3.4: Core Implementation

### Hook Implementation
- [ ] T013 Create `wizard/src/hooks/useFrequencyFilter.ts` implementing filtering logic and availability calculation

### Component Implementation
- [ ] T014 Create `wizard/src/components/FrequencyFilter.tsx` with toolbar UI rendering all 5 filter options
- [ ] T015 Style FrequencyFilter component with Tailwind CSS including dark mode support
- [ ] T016 Implement disabled state styling and "No [frequency] Available" label display

### Integration Points
- [ ] T017 Update parent components (likely WizardStep.tsx or similar) to include FrequencyFilter below Step label
- [ ] T018 Modify data flow to pass filtered terms to TermSelector without changing TermSelector.tsx
- [ ] T019 Add frequency metadata parsing from backend taxonomy.py data structure

## Phase 3.5: State & Persistence
- [ ] T020 Implement session storage persistence in filterStore with version checking
- [ ] T021 Add store initialization logic to restore filter state on page load
- [ ] T022 Connect FrequencyFilter component to Zustand store for global state management

## Phase 3.6: Polish & Validation
- [ ] T023 [P] Verify all component tests pass with `npm test`
- [ ] T024 [P] Verify filter response time is <100ms (performance requirement)
- [ ] T025 [P] Run quickstart.md validation checklist manually
- [ ] T026 [P] Ensure no modifications to TermSelector.tsx term button styling
- [ ] T027 Update CLAUDE.md if any new patterns or constraints discovered

## Dependency Graph
```
Setup (T001-T003)
    ↓
Tests (T004-T009) [Can run in parallel]
    ↓
Types (T010-T012) [Can run in parallel]
    ↓
Core (T013-T016) [Sequential within, T014-T016 depend on T013]
    ↓
Integration (T017-T019) [Sequential]
    ↓
Persistence (T020-T022) [Sequential]
    ↓
Polish (T023-T027) [Can run in parallel]
```

## Parallel Execution Examples

### Example 1: After setup, run all test creation in parallel
```
Task agent 1: Complete T004 (FrequencyFilter component tests)
Task agent 2: Complete T005 (useFrequencyFilter hook tests)
Task agent 3: Complete T006 (filterStore state tests)
```

### Example 2: Type definitions can be created in parallel
```
Task agent 1: Complete T010 (frequency.ts types)
Task agent 2: Complete T011 (filter.ts interfaces)
Task agent 3: Complete T012 (filterStore.ts implementation)
```

### Example 3: Final validation tasks in parallel
```
Task agent 1: Complete T023 (run test suite)
Task agent 2: Complete T024 (performance validation)
Task agent 3: Complete T025 (quickstart checklist)
Task agent 4: Complete T026 (verify TermSelector unchanged)
```

## Success Criteria
- ✅ All tests pass before implementation
- ✅ Filter toolbar renders below Step label, above terms
- ✅ All 5 frequency options functional
- ✅ Filter persists across step navigation
- ✅ Empty states show disabled options with labels
- ✅ Performance <100ms filter response
- ✅ No changes to TermSelector term styling
- ✅ Dark mode theming works correctly

## Implementation Notes
1. **CRITICAL**: Do NOT modify TermSelector.tsx term button styling (user constraint)
2. Frequency values from taxonomy.py: 'rare', 'infrequent', 'frequent', 'ubiquitous' (add 'all' in frontend)
3. Use existing Zustand from package.json (already installed)
4. Follow existing React component patterns with TypeScript interfaces and React.memo
5. Tailwind CSS classes must support dark mode (dark: prefix)

---
*Total Tasks: 27 | Parallel Groups: 3 | Estimated Time: 4-6 hours*