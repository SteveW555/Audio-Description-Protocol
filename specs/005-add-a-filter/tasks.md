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
- **Frontend**: `wizard/src/` for React TypeScript components
- **Types**: `wizard/src/types/` for TypeScript type definitions
- **Hooks**: `wizard/src/hooks/` for custom React hooks
- **Store**: `wizard/src/store/` for Zustand state management
- **Tests**: `wizard/tests/` for all test files

## Phase 3.1: Setup
- [ ] T001 Verify Zustand is installed in wizard/package.json (already in dependencies)
- [ ] T002 Create directory structure: `wizard/src/types/`, `wizard/src/hooks/`, `wizard/src/store/`
- [ ] T003 [P] Verify TypeScript and Tailwind CSS configurations are correct

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

### Component Tests
- [ ] T004 [P] Create `wizard/tests/components/FrequencyFilter.test.tsx` - test filter toolbar renders with 5 options
- [ ] T005 [P] Create `wizard/tests/components/FrequencyFilter.test.tsx` - test disabled state with "No [frequency] Available" labels
- [ ] T006 [P] Create `wizard/tests/components/FrequencyFilter.test.tsx` - test dark mode styling support

### Hook Tests
- [ ] T007 [P] Create `wizard/tests/hooks/useFrequencyFilter.test.ts` - test filterTerms function filters correctly
- [ ] T008 [P] Create `wizard/tests/hooks/useFrequencyFilter.test.ts` - test getAvailability calculates counts correctly

### Store Tests
- [ ] T009 [P] Create `wizard/tests/store/filterStore.test.ts` - test initial state is 'all'
- [ ] T010 [P] Create `wizard/tests/store/filterStore.test.ts` - test setFrequency updates state
- [ ] T011 [P] Create `wizard/tests/store/filterStore.test.ts` - test session storage persistence

### Integration Tests (from quickstart.md scenarios)
- [ ] T012 Create `wizard/tests/integration/filterPersistence.test.tsx` - test filter persists across step navigation
- [ ] T013 Create `wizard/tests/integration/termFiltering.test.tsx` - test only filtered terms display
- [ ] T014 Create `wizard/tests/integration/multiSelect.test.tsx` - test multi-select works with active filter

## Phase 3.3: Type Definitions & Models

### Type Definitions (from data-model.md)
- [ ] T015 [P] Create `wizard/src/types/frequency.ts` with FrequencyCategory type ('all' | 'ubiquitous' | 'frequent' | 'infrequent' | 'rare')
- [ ] T016 [P] Create `wizard/src/types/filter.ts` with FilterState, Term, and FilterAvailability interfaces
- [ ] T017 [P] Create `wizard/src/types/filter.ts` with FrequencyFilterProps and UseFrequencyFilterResult interfaces

### Store Implementation (from data-model.md)
- [ ] T018 Create `wizard/src/store/filterStore.ts` implementing FilterStore interface with Zustand
- [ ] T019 Add session storage persistence to filterStore with StoredFilterState schema
- [ ] T020 Implement version checking and migration strategy in filterStore

## Phase 3.4: Core Implementation

### Hook Implementation (from data-model.md)
- [ ] T021 Create `wizard/src/hooks/useFrequencyFilter.ts` with filterTerms function
- [ ] T022 Add getAvailability function to useFrequencyFilter hook
- [ ] T023 Connect useFrequencyFilter to filterStore for state management

### Component Implementation (from research.md decisions)
- [ ] T024 Create `wizard/src/components/FrequencyFilter.tsx` component with 5 filter buttons
- [ ] T025 Style FrequencyFilter with Tailwind CSS including dark mode classes
- [ ] T026 Implement disabled state rendering with "No [frequency] Available" labels
- [ ] T027 Add React.memo optimization to FrequencyFilter component

## Phase 3.5: Integration

### Component Integration
- [ ] T028 Identify parent component that renders TermSelector (likely WizardStep.tsx or similar)
- [ ] T029 Import and add FrequencyFilter component below Step label in parent component
- [ ] T030 Modify data flow to use useFrequencyFilter hook and pass filtered terms to TermSelector
- [ ] T031 Ensure FrequencyFilter positioning is above TermSelector buttons

### Data Integration
- [ ] T032 Parse frequency metadata from backend taxonomy.py format to frontend Term interface
- [ ] T033 Map backend frequency values (RARE, INFREQUENT, FREQUENT, UBIQUITOUS) to lowercase frontend values
- [ ] T034 Handle terms without frequency metadata (only show in 'all' filter)

## Phase 3.6: Polish & Validation

### Performance Validation
- [ ] T035 [P] Verify filter response time is <100ms as per requirement
- [ ] T036 [P] Check React DevTools for unnecessary re-renders

### Manual Testing (from quickstart.md)
- [ ] T037 [P] Run through quickstart.md validation checklist
- [ ] T038 [P] Test all edge cases listed in quickstart.md
- [ ] T039 [P] Verify no modifications to TermSelector.tsx term button styling

### Documentation
- [ ] T040 [P] Update any relevant component documentation if it exists

## Dependency Graph
```
Setup (T001-T003)
    ↓
Tests (T004-T014) [All can run in parallel]
    ↓
Types (T015-T017) [All can run in parallel]
    ↓
Store (T018-T020) [Sequential - depend on each other]
    ↓
Hook (T021-T023) [Sequential - depend on store]
    ↓
Component (T024-T027) [Sequential - depend on hook]
    ↓
Integration (T028-T034) [Sequential - modify existing components]
    ↓
Polish (T035-T040) [All can run in parallel]
```

## Parallel Execution Examples

### Example 1: After setup, run all test file creation in parallel
```bash
# Can run these simultaneously:
Task agent 1: "Complete T004-T006 - Create FrequencyFilter component tests"
Task agent 2: "Complete T007-T008 - Create useFrequencyFilter hook tests"
Task agent 3: "Complete T009-T011 - Create filterStore state tests"
Task agent 4: "Complete T012-T014 - Create integration tests"
```

### Example 2: Create all type definitions in parallel
```bash
# Can run these simultaneously:
Task agent 1: "Complete T015 - Create frequency.ts with FrequencyCategory type"
Task agent 2: "Complete T016-T017 - Create filter.ts with all interfaces"
```

### Example 3: Final validation in parallel
```bash
# Can run these simultaneously:
Task agent 1: "Complete T035-T036 - Performance validation"
Task agent 2: "Complete T037-T038 - Manual testing checklist"
Task agent 3: "Complete T039 - Verify TermSelector unchanged"
Task agent 4: "Complete T040 - Update documentation"
```

## Success Criteria
- ✅ All tests created and passing
- ✅ Filter toolbar displays below Step label, above terms
- ✅ All 5 frequency options working ('all', 'ubiquitous', 'frequent', 'infrequent', 'rare')
- ✅ Filter state persists across steps via Zustand store
- ✅ Disabled filters show "No [frequency] Available" labels
- ✅ Performance meets <100ms requirement
- ✅ No modifications to TermSelector.tsx styling
- ✅ Dark mode theming functional

## Critical Implementation Notes
1. **CONSTRAINT**: Must NOT modify TermSelector.tsx term button styling (user requirement)
2. **TECH STACK**: React 19.1.1, TypeScript 5.2.0, Zustand (already installed), Tailwind CSS
3. **BACKEND**: Frequency enum from taxonomy.py uses UPPERCASE (RARE, INFREQUENT, FREQUENT, UBIQUITOUS)
4. **FRONTEND**: Use lowercase values ('rare', 'infrequent', 'frequent', 'ubiquitous') plus 'all'
5. **STATE**: Use Zustand for global state, session storage for persistence

---
*Total Tasks: 40 | Parallel Opportunities: 14 tests + 3 types + 4 polish = 21 tasks can run in parallel*
*Estimated Time: 6-8 hours with single developer, 3-4 hours with parallel execution*