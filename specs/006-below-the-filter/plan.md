# Implementation Plan: Group By Toolbar for Term Organization

**Branch**: `006-below-the-filter` | **Date**: 2025-09-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-below-the-filter/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path ✓
2. Fill Technical Context ✓
3. Fill Constitution Check section ✓
4. Evaluate Constitution Check section ✓
5. Execute Phase 0 → research.md ✓
6. Execute Phase 1 → data-model.md, quickstart.md, CLAUDE.md ✓
7. Re-evaluate Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md) ✓
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 9. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Add a "Group By" toolbar below the existing frequency filter that allows users to organize term buttons by either Category (Mood, Energy, Texture) or Popularity (Ubiquitous, Frequent, Infrequent, Rare). The toolbar will match the FrequencyFilter styling exactly, and grouped terms will be visually separated with horizontal lines and small labels. Grouping preference persists across browser sessions via localStorage.

This is a pure UI enhancement to the existing wizard interface, building on the successful frequency filter pattern from feature 005. No backend changes, API contracts, or schema modifications required.

## Technical Context

**Language/Version**: TypeScript 5.2+
**Primary Dependencies**: React 19.1+, Zustand 5.0+ (state management), TailwindCSS 3.4+ (styling), Jest 29.7+ (testing)
**Storage**: localStorage for grouping preference persistence (key: `adp-wizard-groupBy-v1`, versioned JSON format)
**Testing**: Jest with @testing-library/react for component/hook/integration tests
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - ES2022+)
**Project Type**: Web (frontend-only wizard interface in `/wizard/src/`)
**Performance Goals**: <50ms grouping operations for 100+ terms, smooth UI transitions <16ms (60fps)
**Constraints**: Must match FrequencyFilter styling pixel-perfect (text-[10px], px-[4px] py-[2px]), backward compatible (TermSelector works without groupByMethod prop), preserve existing term selection behavior
**Scale/Scope**: Single wizard UI feature, ~150-200 LOC across 4 new files + 1 enhanced component, 17 tasks, 6-8 hour implementation

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| **Python + PyTorch First** | ✅ N/A | Frontend TypeScript/React feature only, does not interact with ML stack |
| **Spec-First Development** | ✅ PASS | Spec at `specs/006-below-the-filter/spec.md` completed with 15 functional requirements and 5 clarifications before planning |
| **JSON Schema Compliance** | ✅ N/A | No schema changes (UI-only feature, does not touch protocol data structures or `/schemas/`) |
| **Library-First Modularity** | ✅ PASS | Grouping logic isolated in `utils/termGrouping.ts` (reusable pure functions), state management in hook (`useGroupByFilter.ts`), component decoupled from business logic |
| **Test-Driven Delivery** | ✅ PASS | TDD enforced: tests written before implementation in tasks.md (T003→T004, T005→T006, T007→T008, T009→T010) |

**Gate Decision**: ✅ **PASS** - All applicable constitutional principles satisfied. No violations to document.

## Project Structure

### Documentation (this feature)
```
specs/006-below-the-filter/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (below)
├── data-model.md        # Phase 1 output (below)
├── quickstart.md        # Phase 1 output (below)
└── tasks.md             # Phase 2 output (/tasks command - already exists)
```

### Source Code (repository root)
```
wizard/
├── src/
│   ├── types/
│   │   ├── grouping.ts            # NEW: GroupByMethod, GroupByState, TermCategory, TermGroup
│   │   └── filter.ts              # ENHANCED: Add groupByMethod to TermSelectorProps
│   ├── utils/
│   │   ├── termGrouping.ts        # NEW: groupTermsByCategory, groupTermsByPopularity, sortTermsByFrequency
│   │   └── termFrequencies.ts     # EXISTING: Frequency mappings (read-only reference)
│   ├── hooks/
│   │   ├── useGroupByFilter.ts    # NEW: State management for grouping preference + localStorage
│   │   └── useFrequencyFilter.ts  # EXISTING: Frequency filter logic (reference for patterns)
│   ├── components/
│   │   ├── GroupByFilter.tsx      # NEW: Toolbar component with Category/Popularity buttons
│   │   ├── TermSelector.tsx       # ENHANCED: Add grouping layout rendering
│   │   └── FrequencyFilter.tsx    # EXISTING: Styling reference (read-only)
│   └── store/
│       └── filterStore.ts         # EXISTING: Zustand store (may reference for patterns)
└── __tests__/
    ├── utils/
    │   └── termGrouping.test.ts   # NEW: Grouping logic tests
    ├── hooks/
    │   └── useGroupByFilter.test.ts # NEW: Hook tests (localStorage, toggles)
    ├── components/
    │   ├── GroupByFilter.test.tsx  # NEW: Component tests (rendering, ARIA, styling)
    │   └── TermSelector.grouped.test.tsx # NEW: Grouped layout tests
    └── integration/
        └── groupby-workflow.test.tsx # NEW: End-to-end workflow tests
```

**Structure Decision**: Web application (frontend-only). This feature modifies only the wizard interface under `/wizard/src/`. No backend changes, no Python code, no schema updates. Source structure follows existing TypeScript/React wizard conventions with types → utils → hooks → components → tests layers.

## Phase 0: Outline & Research

**Technical Context Review**: No `NEEDS CLARIFICATION` markers in Technical Context - all tech decisions are known from existing codebase:
- TypeScript 5.2+, React 19.1+, Zustand, TailwindCSS (all already in use)
- Testing with Jest (standard for this project)
- localStorage patterns (established in FrequencyFilter)
- Component styling patterns (FrequencyFilter as reference)

**Research Required**: Best practices for implementing the grouping feature building on existing patterns.

### Research Tasks

1. **Existing Frequency Filter Implementation**
   - **Decision**: Use FrequencyFilter.tsx as styling and localStorage reference
   - **Rationale**: Feature spec FR-003 requires "match the visual styling of the frequency filter toolbar"
   - **Key Findings**:
     - Container: `flex flex-wrap items-center gap-1 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg`
     - Label: `text-gray-600 dark:text-gray-400 text-[12px] font-medium mr-2`
     - Buttons: `px-[4px] py-[2px] text-[10px] font-medium rounded transition-all duration-200`
     - Selected: `bg-blue-600 dark:bg-blue-500 text-white shadow-md`
     - Unselected: `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600`
     - ARIA: `role="group"`, `aria-label`, `aria-pressed` on buttons
   - **File**: `wizard/src/components/FrequencyFilter.tsx` (lines 12-51)

2. **Term Category Inference**
   - **Decision**: Use protocol.ts type unions (MoodTerm, EnergyTerm, TextureTerm) to infer category
   - **Rationale**: Terms are already typed by category in protocol.ts, making inference straightforward
   - **Key Findings**:
     - MoodTerm: 109 terms across 6 subcategories (Positive/Uplifting, Calm/Peaceful, Dark/Negative, Intense/Aggressive, Mysterious/Ambiguous, Romantic/Tender, Nostalgic/Reflective)
     - EnergyTerm: 80 terms across 5 subcategories (High/Positive Drive, Medium/Flowing, Low/Peaceful, Negative/Unstable, Expansive/Other)
     - TextureTerm: 130 terms across 8 subcategories (Bright/Positive, Warm/Peaceful, Dark/Negative, Natural/Acoustic, Synthetic/Electronic, Density/Layering, Smooth/Refined, Rough/Gritty, Space/Atmosphere)
   - **Implementation**: Check if term string is in MoodTerm union → "Mood", else EnergyTerm → "Energy", else TextureTerm → "Texture"
   - **File**: `wizard/src/types/protocol.ts` (lines 1-81)

3. **Term Frequency Mapping**
   - **Decision**: Use existing TERM_FREQUENCIES constant from termFrequencies.ts
   - **Rationale**: Frequency metadata already maintained centrally, no need to duplicate
   - **Key Findings**:
     - Format: `Record<string, 'ubiquitous' | 'frequent' | 'infrequent' | 'rare'>`
     - Coverage: 142+ terms mapped (comprehensive for mood/energy/texture)
     - Ubiquitous examples: 'upbeat', 'energetic-mood', 'joyful', 'calm', 'peaceful', 'high-energy'
     - Rare examples: 'sparkly-mood', 'gossamer-mood', 'forlorn', 'plaintive', 'blistering', 'snarling', 'monophonic', 'lethargic'
   - **Import**: `import { TERM_FREQUENCIES } from '../utils/termFrequencies';`
   - **File**: `wizard/src/utils/termFrequencies.ts` (lines 24-142)

4. **localStorage Patterns for Feature State**
   - **Decision**: Use versioned JSON format with key `adp-wizard-groupBy-v1`
   - **Rationale**: Matches localStorage patterns in frequency filter (useFrequencyFilter.ts line 11-28), allows future migration
   - **Format**: `{ method: 'category' | 'popularity', version: 1 }`
   - **Load**: `JSON.parse(localStorage.getItem('adp-wizard-groupBy-v1') || 'null')`
   - **Save**: `localStorage.setItem('adp-wizard-groupBy-v1', JSON.stringify(state))`
   - **Migration**: If stored `version !== 1`, reset to default ('category')
   - **Alternatives Considered**: Unversioned string storage (rejected: harder to migrate), Zustand persist (rejected: overkill for single boolean-like state)

5. **TailwindCSS Group Separator Styling**
   - **Decision**: Use `border-t border-gray-300 dark:border-gray-600 pt-2 mt-2` for group separators
   - **Rationale**: Matches existing separator patterns in wizard UI, provides clear visual distinction
   - **Label Styling**: `text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-1`
   - **Placement**: Separator applied to all groups except first (conditional: `{groupIndex > 0 && <div className="border-t..." />}`)
   - **Alternatives Considered**: `<hr>` element (rejected: less flexible), thick border (rejected: too prominent per "fine, light-gray" requirement)

**Output**: research.md (to be generated below)

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

### 1. Data Model

**Entities from spec.md Key Entities section:**

1. **GroupByMethod** (type)
   - Values: `'category' | 'popularity'`
   - Purpose: Represents the user's selected grouping method
   - Used in: GroupByState, TermSelectorProps, grouping utility functions

2. **GroupByState** (interface)
   - Fields: `{ method: GroupByMethod, version: number }`
   - Purpose: localStorage persistence format
   - Validation: `version === 1` (future migration support)

3. **TermCategory** (type)
   - Values: `'Mood' | 'Energy' | 'Texture'`
   - Purpose: Semantic categories for terms
   - Used in: TermGroup, groupTermsByCategory function

4. **TermGroup** (interface)
   - Fields: `{ label: string, terms: Term[] }`
   - Purpose: Collection of terms with shared characteristic (category or frequency level)
   - Used in: grouping utility function return values, TermSelector rendering

**State Transitions:**
```
User Action: Click "Popularity" when method='category'
→ toggleGroupBy() called
→ method switches to 'popularity'
→ localStorage updated
→ TermSelector re-renders with new grouping

User Action: Navigate away and return
→ useGroupByFilter loads from localStorage on mount
→ Restores previous method
→ TermSelector renders with persisted grouping
```

**Output**: data-model.md (to be generated below)

### 2. API Contracts

**No API contracts required** - This is a frontend-only UI feature with no backend interaction, no HTTP requests, and no data exchange beyond localStorage (browser API). Skip contract generation and contract tests.

### 3. Extract Test Scenarios

**From spec.md Acceptance Scenarios:**

1. **Scenario 1**: User selects "Category" grouping
   - **Given**: User on wizard step with frequency-filtered terms
   - **When**: Click "Category" in Group By toolbar
   - **Then**: Terms display in groups (Mood, Energy, Texture) with visual separators
   - **Test**: `groupby-workflow.test.tsx` - assert 3 groups rendered, labels match, terms correctly grouped

2. **Scenario 2**: User switches to "Popularity" grouping
   - **Given**: "Category" grouping active
   - **When**: Click "Popularity" in Group By toolbar
   - **Then**: Terms reorganize into frequency-based groups (Ubiquitous, Frequent, Infrequent, Rare)
   - **Test**: `groupby-workflow.test.tsx` - assert up to 4 groups rendered, labels match, terms correctly grouped

3. **Scenario 3**: Grouping preference persists across sessions
   - **Given**: User selected a grouping preference
   - **When**: Navigate to next wizard step and return
   - **Then**: Grouping preference preserved (stored permanently)
   - **Test**: `useGroupByFilter.test.ts` - mock localStorage, assert save/load behavior

4. **Scenario 4**: Term selection works regardless of grouping
   - **Given**: User viewing grouped terms
   - **When**: Select or deselect terms
   - **Then**: Selections work normally regardless of grouping display
   - **Test**: `TermSelector.grouped.test.tsx` - assert term selection state preserved when switching groups

**Edge Case Tests:**
- Terms without metadata appear ungrouped at end (spec.md line 61)
- Only one category/frequency level present after filtering
- Empty term list (no terms match filter)
- Keyboard navigation across grouped terms

**Output**: Quickstart scenarios in quickstart.md (below)

### 4. Update Agent Context

Agent context will be updated via script after data-model.md and quickstart.md are created.

**Output**: data-model.md, quickstart.md, CLAUDE.md update (below)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Note**: The /tasks command has already been executed and tasks.md exists with 17 tasks. This section documents the approach taken:

**Task Generation Strategy**:
- Loaded `.specify/templates/tasks-template.md` as base structure
- Generated tasks from data model entities (types → utils → hooks → components)
- Each grouping function → test task [P] + implementation task (T003-T004)
- Each hook → test task [P] + implementation task (T005-T006)
- Each component → test task [P] + implementation task (T007-T008, T009-T010)
- Integration tasks for wiring (T011) + end-to-end tests (T012)
- Polish tasks for docs, visual regression, performance, accessibility, linting (T013-T017)

**Ordering Strategy**:
- **TDD strictly enforced**: Tests before implementation (T003→T004, T005→T006, T007→T008, T009→T010)
- **Dependency order**: Types (T001-T002) → Utils (T003-T004) → Hooks (T005-T006) → Components (T007-T010) → Integration (T011-T012) → Polish (T013-T017)
- **Parallel opportunities marked [P]**: T001+T002 (different files), T003/T005/T007/T009 (test-only tasks), T012-T016 (polish tasks)

**Estimated Output**: 17 numbered, ordered tasks in tasks.md (already created)

**IMPORTANT**: tasks.md already exists from previous /tasks command execution. This plan validates that approach.

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (tasks.md already generated by /tasks command)
**Phase 4**: Implementation (execute tasks.md T001-T017 following TDD and constitutional principles)
**Phase 5**: Validation (run `npm test`, `npm run lint`, `npm run build`, manual visual regression, accessibility audit)

## Complexity Tracking

**No violations** - Constitution Check shows all principles satisfied (see Constitution Check section above).

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - approach validated)
- [x] Phase 3: Tasks generated (/tasks command - already executed)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (none in Technical Context)
- [x] Complexity deviations documented (none - no violations)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*