# Implementation Tasks: Contradiction Warnings

**Feature**: 007-contradiction-warnings
**Approach**: Test-Driven Development (TDD)
**Status**: Ready for implementation

---

## Task Overview

Following strict TDD: **Write tests first**, then implement to make tests pass.

| ID | Task | Type | Est. Time | Status |
|----|------|------|-----------|--------|
| T001 | Define incompatible pairs data | Data | 20 min | Pending |
| T002 | Write tests for getTermSubcategory | Test | 20 min | Pending |
| T003 | Implement getTermSubcategory | Code | 15 min | Pending |
| T004 | Write tests for areSubcategoriesIncompatible | Test | 20 min | Pending |
| T005 | Implement areSubcategoriesIncompatible | Code | 15 min | Pending |
| T006 | Write tests for validateTermSelection | Test | 30 min | Pending |
| T007 | Implement validateTermSelection | Code | 30 min | Pending |
| T008 | Write tests for ContradictionWarning | Test | 25 min | Pending |
| T009 | Implement ContradictionWarning component | Code | 45 min | Pending |
| T010 | Integrate into TermSelector | Code | 30 min | Pending |
| T011 | Manual testing & refinement | Test | 20 min | Pending |
| T012 | Documentation | Docs | 20 min | Pending |

**Total Estimated Time**: ~5 hours

---

## Phase 1: Data Definition

### T001: Define Incompatible Subcategory Pairs (20 min)

**File**: `wizard/src/utils/termContradictions.ts` (new)

**Create**:
```typescript
/**
 * Contradiction detection for semantically opposing term selections
 * Feature: 007-contradiction-warnings
 * Phase 1: Subcategory-based rules only
 */

export const INCOMPATIBLE_SUBCATEGORIES: ReadonlyArray<readonly [string, string]> = [
  ['Positive / Uplifting', 'Dark / Negative'],
  ['Calm / Peaceful', 'Intense / Aggressive'],
  ['Romantic / Tender', 'Intense / Aggressive'],
  // Additional pairs as determined during implementation
] as const;

export interface ContradictionResult {
  term1: string;
  term2: string;
  subcategory1: string;
  subcategory2: string;
  reason: string;
}
```

**Decisions to Make**:
- How many pairs to include initially? (Recommend: 3-6)
- Should we include Positive↔Intense? (Debatable)
- Should we include Calm↔Dark? (Debatable—dark can be calm)

**Acceptance Criteria**:
- [ ] TypeScript constant exported
- [ ] ReadonlyArray type for immutability
- [ ] ContradictionResult interface defined
- [ ] JSDoc comments added

---

## Phase 2: Utility Functions (TDD)

### T002: Write Tests for getTermSubcategory (20 min)

**File**: `wizard/tests/utils/termContradictions.test.ts` (new)

**Test Cases**:
```typescript
describe('getTermSubcategory', () => {
  it('returns correct subcategory for known term', () => {
    expect(getTermSubcategory('joyful')).toBe('Positive / Uplifting');
    expect(getTermSubcategory('peaceful')).toBe('Calm / Peaceful');
    expect(getTermSubcategory('melancholic')).toBe('Dark / Negative');
  });

  it('returns null for unknown term', () => {
    expect(getTermSubcategory('unknown-term')).toBeNull();
    expect(getTermSubcategory('')).toBeNull();
  });

  it('handles all mood subcategories', () => {
    expect(getTermSubcategory('aggressive')).toBe('Intense / Aggressive');
    expect(getTermSubcategory('mysterious')).toBe('Mysterious / Ambiguous');
    expect(getTermSubcategory('tender')).toBe('Romantic / Tender');
    expect(getTermSubcategory('nostalgic')).toBe('Nostalgic / Reflective');
  });

  it('is case-sensitive', () => {
    expect(getTermSubcategory('Joyful')).toBeNull(); // capitals not in taxonomy
  });
});
```

**Acceptance Criteria**:
- [ ] 4 test suites covering happy path and edge cases
- [ ] Tests initially fail (no implementation yet)
- [ ] Sample terms from each subcategory tested

---

### T003: Implement getTermSubcategory (15 min)

**File**: `wizard/src/utils/termContradictions.ts`

**Implementation**:
```typescript
import { MOOD_SUBCATEGORIES } from './termGrouping';

export function getTermSubcategory(term: string): string | null {
  for (const [subcategoryName, terms] of Object.entries(MOOD_SUBCATEGORIES)) {
    if (terms.includes(term)) {
      return subcategoryName;
    }
  }
  return null;
}
```

**Acceptance Criteria**:
- [ ] All T002 tests pass
- [ ] Function exported
- [ ] JSDoc comment added
- [ ] Performance: O(n) where n = total terms across subcategories

---

### T004: Write Tests for areSubcategoriesIncompatible (20 min)

**File**: `wizard/tests/utils/termContradictions.test.ts`

**Test Cases**:
```typescript
describe('areSubcategoriesIncompatible', () => {
  it('returns true for defined incompatible pairs', () => {
    expect(areSubcategoriesIncompatible(
      'Positive / Uplifting',
      'Dark / Negative'
    )).toBe(true);
    expect(areSubcategoriesIncompatible(
      'Calm / Peaceful',
      'Intense / Aggressive'
    )).toBe(true);
  });

  it('returns false for compatible pairs', () => {
    expect(areSubcategoriesIncompatible(
      'Positive / Uplifting',
      'Calm / Peaceful'
    )).toBe(false);
    expect(areSubcategoriesIncompatible(
      'Romantic / Tender',
      'Nostalgic / Reflective'
    )).toBe(false);
  });

  it('is bidirectional (A↔B = B↔A)', () => {
    expect(areSubcategoriesIncompatible(
      'Dark / Negative',
      'Positive / Uplifting'
    )).toBe(true); // Reversed order
  });

  it('returns false for same subcategory', () => {
    expect(areSubcategoriesIncompatible(
      'Positive / Uplifting',
      'Positive / Uplifting'
    )).toBe(false);
  });

  it('returns false for null subcategories', () => {
    expect(areSubcategoriesIncompatible(null, 'Positive / Uplifting')).toBe(false);
    expect(areSubcategoriesIncompatible('Calm / Peaceful', null)).toBe(false);
    expect(areSubcategoriesIncompatible(null, null)).toBe(false);
  });
});
```

**Acceptance Criteria**:
- [ ] 5 test suites covering all logic branches
- [ ] Tests initially fail
- [ ] Bidirectional matching tested explicitly

---

### T005: Implement areSubcategoriesIncompatible (15 min)

**File**: `wizard/src/utils/termContradictions.ts`

**Implementation**:
```typescript
export function areSubcategoriesIncompatible(
  subcat1: string | null,
  subcat2: string | null
): boolean {
  if (!subcat1 || !subcat2 || subcat1 === subcat2) {
    return false;
  }

  return INCOMPATIBLE_SUBCATEGORIES.some(
    ([a, b]) => 
      (a === subcat1 && b === subcat2) || 
      (a === subcat2 && b === subcat1)
  );
}
```

**Acceptance Criteria**:
- [ ] All T004 tests pass
- [ ] Function exported
- [ ] JSDoc comment added
- [ ] Handles null inputs gracefully

---

### T006: Write Tests for validateTermSelection (30 min)

**File**: `wizard/tests/utils/termContradictions.test.ts`

**Test Cases**:
```typescript
describe('validateTermSelection', () => {
  it('returns empty array for empty selection', () => {
    expect(validateTermSelection([])).toEqual([]);
  });

  it('returns empty array for single term', () => {
    expect(validateTermSelection(['joyful'])).toEqual([]);
  });

  it('returns empty array for compatible terms', () => {
    const result = validateTermSelection(['joyful', 'happy', 'upbeat']);
    expect(result).toEqual([]); // All Positive/Uplifting
  });

  it('detects single contradiction', () => {
    const result = validateTermSelection(['joyful', 'tragic']);
    expect(result).toHaveLength(1);
    expect(result[0].term1).toBe('joyful');
    expect(result[0].term2).toBe('tragic');
    expect(result[0].subcategory1).toBe('Positive / Uplifting');
    expect(result[0].subcategory2).toBe('Dark / Negative');
    expect(result[0].reason).toContain('opposing');
  });

  it('detects multiple contradictions', () => {
    const result = validateTermSelection(['joyful', 'tragic', 'peaceful', 'aggressive']);
    expect(result.length).toBeGreaterThanOrEqual(2);
    // joyful↔tragic and peaceful↔aggressive
  });

  it('returns all contradictory pairs when 3+ terms conflict', () => {
    const result = validateTermSelection(['joyful', 'happy', 'tragic', 'gloomy']);
    // Should find: joyful↔tragic, joyful↔gloomy, happy↔tragic, happy↔gloomy
    expect(result.length).toBe(4);
  });

  it('ignores terms without subcategory', () => {
    const result = validateTermSelection(['joyful', 'unknown-term', 'tragic']);
    expect(result).toHaveLength(1); // Only joyful↔tragic, unknown ignored
  });

  it('completes in <10ms for typical case (5 terms)', () => {
    const terms = ['joyful', 'happy', 'upbeat', 'peaceful', 'calm'];
    const start = performance.now();
    validateTermSelection(terms);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(10);
  });

  it('completes in <50ms for edge case (20 terms)', () => {
    const terms = Array(20).fill('joyful'); // Worst case: all same term
    const start = performance.now();
    validateTermSelection(terms);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(50);
  });
});
```

**Acceptance Criteria**:
- [ ] 8 test suites covering all scenarios
- [ ] Performance benchmarks included
- [ ] Tests initially fail
- [ ] Edge cases tested (empty, null, unknown terms)

---

### T007: Implement validateTermSelection (30 min)

**File**: `wizard/src/utils/termContradictions.ts`

**Implementation**:
```typescript
export function validateTermSelection(selectedTerms: string[]): ContradictionResult[] {
  if (selectedTerms.length < 2) {
    return [];
  }

  const contradictions: ContradictionResult[] = [];

  for (let i = 0; i < selectedTerms.length; i++) {
    for (let j = i + 1; j < selectedTerms.length; j++) {
      const term1 = selectedTerms[i];
      const term2 = selectedTerms[j];
      
      const subcat1 = getTermSubcategory(term1);
      const subcat2 = getTermSubcategory(term2);
      
      if (subcat1 && subcat2 && areSubcategoriesIncompatible(subcat1, subcat2)) {
        contradictions.push({
          term1,
          term2,
          subcategory1: subcat1,
          subcategory2: subcat2,
          reason: `These moods are from opposing categories: "${subcat1}" vs "${subcat2}"`
        });
      }
    }
  }

  return contradictions;
}
```

**Acceptance Criteria**:
- [ ] All T006 tests pass
- [ ] Function exported
- [ ] JSDoc comment with examples added
- [ ] Performance targets met (<10ms typical, <50ms edge case)

---

## Phase 3: UI Component (TDD)

### T008: Write Tests for ContradictionWarning (25 min)

**File**: `wizard/tests/components/ContradictionWarning.test.tsx` (new)

**Test Cases**:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ContradictionWarning } from '../../src/components/ContradictionWarning';

describe('ContradictionWarning', () => {
  const mockContradictions = [
    {
      term1: 'joyful',
      term2: 'tragic',
      subcategory1: 'Positive / Uplifting',
      subcategory2: 'Dark / Negative',
      reason: 'These moods are from opposing categories'
    }
  ];

  it('renders warning heading', () => {
    render(<ContradictionWarning contradictions={mockContradictions} />);
    expect(screen.getByText(/contradictory moods detected/i)).toBeInTheDocument();
  });

  it('displays all contradictory pairs', () => {
    render(<ContradictionWarning contradictions={mockContradictions} />);
    expect(screen.getByText(/joyful/i)).toBeInTheDocument();
    expect(screen.getByText(/tragic/i)).toBeInTheDocument();
  });

  it('shows reason for each contradiction', () => {
    render(<ContradictionWarning contradictions={mockContradictions} />);
    expect(screen.getByText(/opposing categories/i)).toBeInTheDocument();
  });

  it('renders multiple contradictions', () => {
    const multiple = [
      mockContradictions[0],
      {
        term1: 'peaceful',
        term2: 'aggressive',
        subcategory1: 'Calm / Peaceful',
        subcategory2: 'Intense / Aggressive',
        reason: 'Another opposition'
      }
    ];
    render(<ContradictionWarning contradictions={multiple} />);
    expect(screen.getAllByText(/opposing|opposition/i)).toHaveLength(2);
  });

  it('has alert role for accessibility', () => {
    const { container } = render(<ContradictionWarning contradictions={mockContradictions} />);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen readers', () => {
    const { container } = render(<ContradictionWarning contradictions={mockContradictions} />);
    const alert = container.querySelector('[aria-live="polite"]');
    expect(alert).toBeInTheDocument();
  });

  it('renders suggestion text', () => {
    render(<ContradictionWarning contradictions={mockContradictions} />);
    expect(screen.getByText(/consider removing/i)).toBeInTheDocument();
  });
});
```

**Acceptance Criteria**:
- [ ] 7 test suites covering rendering and accessibility
- [ ] Tests initially fail (component doesn't exist)
- [ ] Accessibility attributes tested explicitly

---

### T009: Implement ContradictionWarning Component (45 min)

**File**: `wizard/src/components/ContradictionWarning.tsx` (new)

**Implementation**:
```typescript
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { ContradictionResult } from '../utils/termContradictions';

interface ContradictionWarningProps {
  contradictions: ContradictionResult[];
}

export const ContradictionWarning: React.FC<ContradictionWarningProps> = ({ contradictions }) => {
  if (contradictions.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
    >
      <div className="flex items-start">
        <ExclamationTriangleIcon 
          className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0 mt-0.5" 
          aria-hidden="true"
        />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
            Contradictory Moods Detected
          </h4>
          <div className="space-y-1">
            {contradictions.map((c, i) => (
              <p key={i} className="text-xs text-yellow-700 dark:text-yellow-300">
                <span className="font-medium">"{c.term1}"</span> and{' '}
                <span className="font-medium">"{c.term2}"</span>: {c.reason}
              </p>
            ))}
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            Consider removing one of these terms for a more coherent description.
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Acceptance Criteria**:
- [ ] All T008 tests pass
- [ ] Component exported
- [ ] Accessibility attributes present (role, aria-live)
- [ ] Dark mode styling implemented
- [ ] Icon uses aria-hidden (decorative)
- [ ] Matches design spec (yellow theme)

---

## Phase 4: Integration

### T010: Integrate into TermSelector (30 min)

**File**: `wizard/src/components/TermSelector.tsx` (modify existing)

**Changes Required**:

1. **Add imports** (at top of file, separate edit to preserve structure):
```typescript
import { validateTermSelection } from '../utils/termContradictions';
import { ContradictionWarning } from './ContradictionWarning';
```

2. **Add validation logic** (inside component, before return statement):
```typescript
// Validate for contradictions
const selectedArray = Array.isArray(selected) ? selected : (selected ? [selected] : []);
const contradictions = useMemo(
  () => validateTermSelection(selectedArray),
  [selectedArray]
);
```

3. **Add warning rendering** (after term selection area, before Skip/Next buttons):
```tsx
{/* Contradiction Warning */}
{contradictions.length > 0 && (
  <ContradictionWarning contradictions={contradictions} />
)}
```

**Critical Constraints**:
- ⚠️ **PRESERVE ALL EXISTING COMMENTS** (user requirement)
- ⚠️ **PRESERVE ALL EMPTY LINES** (user requirement)
- ⚠️ **DO NOT MODIFY UNRELATED CODE** (user requirement)
- Use separate edits for imports, logic, and rendering
- Add new code in logical positions without disrupting existing structure

**Acceptance Criteria**:
- [ ] Imports added at top of file
- [ ] Validation logic added to component
- [ ] Warning component rendered in correct position
- [ ] All existing comments preserved
- [ ] All empty lines preserved
- [ ] No unrelated code modified
- [ ] TypeScript compiles without errors

---

## Phase 5: Testing & Documentation

### T011: Manual Testing & Refinement (20 min)

**Manual Test Checklist**:
- [ ] Select "joyful" then "tragic" → warning appears
- [ ] Deselect "tragic" → warning disappears
- [ ] Select "joyful", "happy", "tragic", "gloomy" → shows multiple pairs
- [ ] Warning does not block "Next" button
- [ ] Warning does not block "Skip" button
- [ ] Screen reader announces warning (test with NVDA/JAWS/VoiceOver)
- [ ] Dark mode styling looks correct
- [ ] Warning appears in logical position (after terms, before buttons)
- [ ] Performance feels instant (<50ms perceived latency)

**Refinement Tasks** (if needed):
- Adjust warning position if layout looks off
- Refine wording if user feedback suggests confusion
- Adjust incompatible pairs list based on testing insights

**Acceptance Criteria**:
- [ ] All manual tests pass
- [ ] No layout issues or visual glitches
- [ ] Accessibility verified with screen reader

---

### T012: Documentation (20 min)

**Create**: `specs/007-contradiction-warnings/quickstart.md`

**Content**:
- How contradiction detection works
- **How to add/remove incompatible pairs** (detailed maintenance section):
  - Edit `INCOMPATIBLE_SUBCATEGORIES` constant in `termContradictions.ts`
  - Add corresponding test case to `areSubcategoriesIncompatible` test suite
  - Run test suite to verify no regressions
  - Perform manual testing (T011 checklist) to verify no false positives
  - Document rationale in Git commit message
- Performance characteristics
- Known limitations (Phase 1 only)
- Example usage

**Create**: `specs/007-contradiction-warnings/IMPLEMENTATION_SUMMARY.md`

**Content**:
- Files created (4 new files)
- Files modified (TermSelector.tsx, possibly termGrouping.ts)
- Test coverage summary
- Performance benchmarks
- Known limitations and future phases
- Screenshots or GIFs of warning in action

**Update**: `CLAUDE.md`

**Content**:
- Add Session 14 entry with contradiction warnings feature

**Acceptance Criteria**:
- [ ] Quickstart guide created
- [ ] Implementation summary created
- [ ] CLAUDE.md updated
- [ ] All code has JSDoc comments

---

## Definition of Done

### Code Complete
- [ ] All tests passing (20-30 assertions)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with no warnings
- [ ] All code has JSDoc documentation

### Quality Standards
- [ ] Test coverage >90% for new code
- [ ] Performance targets met (<10ms typical, <50ms edge case)
- [ ] Accessibility: WCAG AA compliance verified
- [ ] Dark mode styling implemented and tested

### Documentation Complete
- [ ] Quickstart guide written
- [ ] Implementation summary created
- [ ] CLAUDE.md updated
- [ ] All functions have JSDoc comments

### User Requirements Met
- [ ] All existing comments preserved
- [ ] All empty lines preserved
- [ ] No unrelated code modified
- [ ] Non-blocking warnings (users can proceed)

---

## Task Dependencies

```
T001 (Data) → T002 (Test) → T003 (Code)
                                ↓
T001 (Data) → T004 (Test) → T005 (Code)
                                ↓
T003 + T005 → T006 (Test) → T007 (Code)
                                ↓
              T008 (Test) → T009 (Code)
                                ↓
            T007 + T009 → T010 (Integration)
                                ↓
                          T011 (Manual Test)
                                ↓
                          T012 (Documentation)
```

---

## Next Steps

1. Review and approve this task breakdown
2. Begin T001: Define incompatible pairs
3. Follow TDD strictly: Test → Implement → Refactor
4. Preserve all code structure per user requirements
5. Complete all 12 tasks in sequence

**Ready to start implementation?**
