# Tasks: Group By Toolbar for Term Organization

**Input**: Design documents from `/specs/006-below-the-filter/`
**Prerequisites**: spec.md (with clarifications), plan.md

## Execution Flow (main)
```
1. Load spec.md with clarified requirements ✓
2. Extract design from plan.md (TypeScript/React wizard UI) ✓
3. Generate tasks: Types → Utils → Hooks → Components → Integration ✓
4. Apply TDD ordering: Tests before implementation ✓
5. Mark [P] for parallel execution (independent files) ✓
6. Validate completeness ✓
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to `wizard/src/` unless specified

## Phase 3.1: Setup & Type Definitions

- [ ] **T001** [P] Create `wizard/src/types/grouping.ts` with GroupByMethod ('category' | 'popularity'), GroupByState, TermCategory, TermGroup types
- [ ] **T002** [P] Enhance `wizard/src/types/filter.ts` to add optional `groupByMethod?: GroupByMethod` to TermSelectorProps

## Phase 3.2: Utility Layer (TDD)

- [ ] **T003** [P] Write tests in `wizard/src/__tests__/utils/termGrouping.test.ts`:
  - Test groupTermsByCategory returns 3 groups (mood, energy, texture) in semantic order
  - Test groupTermsByPopularity returns 4 groups (ubiquitous, frequent, infrequent, rare) in order
  - Test terms sorted by frequency within each group (most common first)
  - Test terms without metadata appear ungrouped at end
  - Test empty input returns empty groups

- [ ] **T004** Implement `wizard/src/utils/termGrouping.ts`:
  - `groupTermsByCategory(terms)` → returns TermGroup[] ordered [Mood, Energy, Texture]
  - `groupTermsByPopularity(terms)` → returns TermGroup[] ordered [Ubiquitous, Frequent, Infrequent, Rare]
  - `sortTermsByFrequency(terms)` → helper to sort within groups using termFrequencies.ts
  - `inferTermCategory(term)` → determine if mood/energy/texture from protocol.ts types
  - Ensure tests pass

## Phase 3.3: Hook Layer (TDD)

- [ ] **T005** [P] Write tests in `wizard/src/__tests__/hooks/useGroupByFilter.test.ts`:
  - Test hook returns `{ groupByMethod, toggleGroupBy, isCategory, isPopularity }`
  - Test default state is 'category'
  - Test toggleGroupBy cycles between 'category' and 'popularity'
  - Test localStorage persistence on method change (key: `adp-wizard-groupBy-v1`)
  - Test localStorage load on mount
  - Test version migration (if stored version ≠ 1, reset to default)
  - Mock localStorage

- [ ] **T006** Implement `wizard/src/hooks/useGroupByFilter.ts`:
  - useState for groupByMethod (default 'category')
  - useEffect to load from localStorage on mount
  - useEffect to save to localStorage on change
  - toggleGroupBy function to cycle between methods
  - Computed values: isCategory, isPopularity
  - Storage format: `{ method: GroupByMethod, version: 1 }`
  - Ensure tests pass

## Phase 3.4: GroupByFilter Component (TDD)

- [ ] **T007** [P] Write tests in `wizard/src/__tests__/components/GroupByFilter.test.tsx`:
  - Test renders two buttons: "Category" and "Popularity"
  - Test "Category" is selected by default
  - Test clicking "Popularity" changes selection
  - Test clicking "Category" when on "Popularity" changes back
  - Test ARIA attributes (role="group", aria-label, aria-pressed)
  - Test styling matches FrequencyFilter (same button sizes, colors, spacing)
  - Mock useGroupByFilter hook

- [ ] **T008** Create `wizard/src/components/GroupByFilter.tsx`:
  - Component props: `{ className?: string }`
  - Call useGroupByFilter() hook
  - Render toolbar with label "Group By:" and two buttons
  - Button 1: "Category" - calls toggleGroupBy when method === 'popularity'
  - Button 2: "Popularity" - calls toggleGroupBy when method === 'category'
  - Match FrequencyFilter styling exactly:
    - Container: `flex flex-wrap items-center gap-1 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg`
    - Label: `text-gray-600 dark:text-gray-400 text-[12px] font-medium mr-2`
    - Buttons: `px-[4px] py-[2px] text-[10px] font-medium rounded transition-all duration-200`
    - Selected: `bg-blue-600 dark:bg-blue-500 text-white shadow-md`
    - Unselected: `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600`
  - ARIA: role="group", aria-label="Group by method", aria-pressed on buttons
  - Ensure tests pass

## Phase 3.5: Enhanced TermSelector (TDD)

- [ ] **T009** [P] Write tests in `wizard/src/__tests__/components/TermSelector.grouped.test.tsx`:
  - Test renders flat layout when groupByMethod is undefined (backward compat)
  - Test renders grouped layout when groupByMethod='category'
  - Test renders 3 groups with labels: "Mood", "Energy", "Texture"
  - Test renders grouped layout when groupByMethod='popularity'
  - Test renders up to 4 groups with labels: "Ubiquitous", "Frequent", "Infrequent", "Rare"
  - Test group separators are visible (border-t styling)
  - Test group labels have text-[10px] styling
  - Test terms within groups are clickable and selectable
  - Test term selection state preserved when switching groups
  - Test ungrouped terms (no metadata) appear at end without label
  - Test keyboard navigation works across grouped terms

- [ ] **T010** Enhance `wizard/src/components/TermSelector.tsx`:
  - Add optional prop `groupByMethod?: GroupByMethod`
  - Import `groupTermsByCategory`, `groupTermsByPopularity` from utils
  - If groupByMethod is undefined → render existing flat layout (no changes)
  - If groupByMethod === 'category' → call groupTermsByCategory(filteredTerms)
  - If groupByMethod === 'popularity' → call groupTermsByPopularity(filteredTerms)
  - Render grouped layout:
    - For each group: render group label with `text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-1`
    - Separator between groups: `border-t border-gray-300 dark:border-gray-600 pt-2 mt-2` (except first group)
    - Render term buttons within each group with existing styling
    - Terms without metadata → render at end without group label
  - Maintain existing term selection logic (handleSelect function unchanged)
  - Preserve accessibility (ARIA, keyboard nav)
  - Ensure tests pass

## Phase 3.6: Integration

- [ ] **T011** Wire GroupByFilter into wizard flow:
  - Import GroupByFilter in step component (e.g., `MoodStep.tsx`, `EnergyStep.tsx`, `TextureStep.tsx`)
  - Import useGroupByFilter hook
  - Render GroupByFilter above FrequencyFilter
  - Pass `groupByMethod` from hook to TermSelector component
  - Test in browser: verify GroupByFilter appears, toggle works, terms regroup

- [ ] **T012** [P] Add integration test in `wizard/src/__tests__/integration/groupby-workflow.test.tsx`:
  - Test full user workflow: select Category → terms grouped by mood/energy/texture
  - Test switch to Popularity → terms regroup by frequency
  - Test selection persists across grouping changes
  - Test localStorage persistence across page reload (mock window.location.reload)
  - Test frequency filter + grouping work together

## Phase 3.7: Polish & Validation

- [ ] **T013** [P] Update `CLAUDE.md`:
  - Add "Group By toolbar" to Active Technologies section
  - Add recent change: "006-below-the-filter: Added Group By toolbar with category/popularity grouping, localStorage persistence"

- [ ] **T014** [P] Visual regression testing:
  - Start dev server: `cd wizard && npm run dev`
  - Manually verify GroupByFilter styling matches FrequencyFilter exactly
  - Test light/dark mode toggle
  - Test responsive behavior
  - Test with real term data (100+ terms)
  - Verify smooth transitions when toggling grouping
  - Screenshot before/after for documentation

- [ ] **T015** [P] Performance validation:
  - Test grouping with 100+ terms < 50ms response time
  - Test localStorage read/write performance
  - Test no jank during group transitions
  - Profile with React DevTools if needed

- [ ] **T016** [P] Accessibility audit:
  - Test keyboard navigation (Tab, Enter, Space)
  - Test screen reader announcements (NVDA/JAWS/VoiceOver)
  - Verify ARIA labels are descriptive
  - Test focus indicators visible
  - Run axe DevTools or Lighthouse accessibility scan

- [ ] **T017** Run all tests and linting:
  - `cd wizard && npm test` - ensure all tests pass
  - `cd wizard && npm run lint` - ensure no linting errors
  - `cd wizard && npm run build` - ensure build succeeds

## Dependencies

**Sequential Dependencies:**
- T001-T002 (types) must complete before T003-T004 (utils)
- T003 (util tests) must complete before T004 (util implementation)
- T004 (utils) must complete before T005-T006 (hooks)
- T005 (hook tests) must complete before T006 (hook implementation)
- T006 (hook) must complete before T007-T008 (GroupByFilter component)
- T007 (component tests) must complete before T008 (component implementation)
- T008 (GroupByFilter) must complete before T009-T010 (TermSelector enhancement)
- T009 (TermSelector tests) must complete before T010 (TermSelector implementation)
- T010 (TermSelector) must complete before T011 (integration)
- T011 (integration) must complete before T012-T017 (polish)

**Parallel Opportunities:**
- T001 + T002 (different files, type definitions)
- T003 (util tests) can be written independently
- T005 (hook tests) can be written independently
- T007 (component tests) can be written independently
- T009 (TermSelector tests) can be written independently
- T012 + T013 + T014 + T015 + T016 (different files, polish tasks)

## Parallel Execution Examples

### Phase 3.1 - Type Definitions (run together):
```bash
# T001 + T002 in parallel
```

### Phase 3.2 - Write All Utility Tests First:
```bash
# T003 alone (single test file)
```

### Phase 3.7 - Polish Tasks (run together):
```bash
# T012 + T013 + T014 + T015 + T016 in parallel
```

## Notes

- **TDD Strictly Enforced**: Tests MUST fail before implementation
- **Styling Consistency Critical**: GroupByFilter must match FrequencyFilter pixel-perfect
- **Backward Compatibility**: TermSelector must work without groupByMethod prop
- **Accessibility Required**: ARIA labels, keyboard nav, screen reader support
- **Performance Target**: <50ms for grouping operations
- **localStorage Key**: `adp-wizard-groupBy-v1` (version 1, migration-ready)

## Validation Checklist

- [x] All utility functions have tests (T003)
- [x] Hook has comprehensive tests (T005)
- [x] Components have tests (T007, T009)
- [x] Integration workflow tested (T012)
- [x] Tests written before implementation (TDD)
- [x] Parallel tasks are truly independent
- [x] All tasks specify exact file paths
- [x] Styling matches FrequencyFilter
- [x] Accessibility requirements covered
- [x] Performance targets defined

---

**Total Tasks**: 17
**Estimated Time**: 6-8 hours for experienced developer
**Ready for Execution**: Yes - proceed with T001