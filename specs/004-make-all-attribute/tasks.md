# Tasks: Reduce Attribute Button Height

**Input**: Design documents from `/specs/004-make-all-attribute/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Phase 3.1: Setup

- [x] T001 Verify wizard development environment setup and dependencies
- [x] T002 [P] Configure Tailwind CSS linting for height class validation
- [x] T003 [P] Set up component testing environment with React Testing Library

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T004 [P] Contract test AttributeButton interface in `wizard/tests/components/AttributeButton.test.tsx`
- [x] T005 [P] Contract test TooltipWrapper interface in `wizard/tests/components/TooltipWrapper.test.tsx`
- [x] T006 [P] Contract test TermSelector interface in `wizard/tests/components/TermSelector.test.tsx`
- [x] T007 [P] Integration test button height reduction in `wizard/tests/integration/button-height.test.tsx`
- [x] T008 [P] Integration test tooltip functionality in `wizard/tests/integration/tooltip-behavior.test.tsx`
- [x] T009 [P] Integration test cross-device responsiveness in `wizard/tests/integration/responsive-height.test.tsx`
- [x] T010 [P] Accessibility test for reduced buttons in `wizard/tests/accessibility/button-a11y.test.tsx`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T011 [P] Create TooltipWrapper component in `wizard/src/components/TooltipWrapper.tsx`
- [x] T012 Update TermSelector button CSS from `py-1.5` to `py-1` in `wizard/src/components/TermSelector.tsx`
- [x] T013 Integrate TooltipWrapper with TermSelector buttons in `wizard/src/components/TermSelector.tsx`
- [x] T014 [P] Update button styling constants in `wizard/src/constants/button-styles.ts`
- [x] T015 [P] Add TypeScript interfaces for height variants in `wizard/src/types/wizard.ts`

## Phase 3.4: Integration

- [ ] T016 Update all wizard pages using TermSelector with reduced height buttons
- [ ] T017 Verify tooltip behavior across all attribute selection forms
- [ ] T018 Test button height consistency across Musical Analysis and Semantic Attributes forms
- [ ] T019 Validate cross-component height styling consistency

## Phase 3.5: Polish

- [ ] T020 [P] Unit tests for tooltip positioning in `wizard/tests/unit/tooltip-positioning.test.tsx`
- [ ] T021 [P] Unit tests for height calculation utilities in `wizard/tests/unit/height-utils.test.tsx`
- [ ] T022 [P] Visual regression tests for button height in `wizard/tests/visual/button-height.test.tsx`
- [ ] T023 Performance tests for tooltip rendering latency
- [ ] T024 [P] Update component documentation for height variants
- [ ] T025 Manual cross-device testing per quickstart.md scenarios
- [ ] T026 Remove any unused CSS classes and cleanup styling
- [ ] T027 [P] Validate visual consistency across all wizard pages in `wizard/tests/integration/visual-consistency.test.tsx`

## Dependencies

- Setup (T001-T003) before everything
- Tests (T004-T010) before implementation (T011-T015)
- T011 blocks T013 (TooltipWrapper must exist before integration)
- T012 can run parallel with T011 (different files)
- T014-T015 parallel with core implementation (different files)
- Integration (T016-T019) after core implementation
- Polish (T020-T027) after integration complete

## Parallel Example

```bash
# Launch T004-T007 together (all different test files):
Task: "Contract test AttributeButton interface in wizard/tests/components/AttributeButton.test.tsx"
Task: "Contract test TooltipWrapper interface in wizard/tests/components/TooltipWrapper.test.tsx"
Task: "Contract test TermSelector interface in wizard/tests/components/TermSelector.test.tsx"
Task: "Integration test button height reduction in wizard/tests/integration/button-height.test.tsx"

# Launch T011, T014, T015 together (different files):
Task: "Create TooltipWrapper component in wizard/src/components/TooltipWrapper.tsx"
Task: "Update button styling constants in wizard/src/constants/button-styles.ts"
Task: "Add TypeScript interfaces for height variants in wizard/src/types/wizard.ts"
```

## Task Details

### T004: Contract test AttributeButton interface
- Verify all props defined in `contracts/attribute-button.interface.ts`
- Test height styling variants (`py-1.5` vs `py-1`)
- Validate state transitions (selected, hover, focus)

### T005: Contract test TooltipWrapper interface
- Verify all props defined in `contracts/tooltip-wrapper.interface.ts`
- Test positioning options (top, bottom, left, right)
- Validate accessibility attributes

### T007: Integration test button height reduction
- Measure actual button heights before/after changes
- Verify 25-30% height reduction target
- Test across multiple screen sizes

### T011: Create TooltipWrapper component
- Implement all interface properties from contract
- Add hover and focus event handlers
- Include ARIA attributes for accessibility
- Support positioning variants

### T012: Update TermSelector button CSS
- Change `py-1.5` to `py-1` in button className
- Preserve all other existing styling
- Maintain responsive behavior

### T013: Integrate TooltipWrapper with TermSelector
- Wrap buttons with TooltipWrapper
- Detect text overflow conditions
- Pass full text as tooltip content

### T027: Validate visual consistency across wizard pages
- Test button height consistency on Musical Analysis form
- Test button height consistency on Semantic Attributes form
- Verify all attribute buttons use same reduced height
- Validate styling remains consistent across wizard navigation

## Validation Checklist

- [x] All contracts have corresponding tests (T004-T006)
- [x] All entities have implementation tasks (TooltipWrapper: T011, TermSelector: T012-T013)
- [x] All tests come before implementation (T004-T010 before T011-T015)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task

## Notes

- Tests must fail before implementing (TDD approach)
- Button height reduction: `py-1.5` → `py-1` (33% padding reduction)
- Tooltip shows on hover/focus for accessibility
- Cross-device consistency maintained
- All changes in wizard frontend (no backend changes needed)