# Implementation Plan: Contradiction Warnings for Term Selection

**Feature**: 007-contradiction-warnings
**Status**: Planning Phase
**Approach**: Subcategory-based contradiction detection (Phase 1 only)

---

## Overview

Implement real-time validation that warns users when they select semantically contradictory mood terms. Uses taxonomy subcategory rules to detect incompatible pairings (e.g., Positive/Uplifting vs Dark/Negative).

**Key Constraint**: Phase 1 uses **subcategory rules only**—no term-level overrides or AI-generated matrices. Keep it simple and gather usage data before adding complexity.

---

## Architecture

### High-Level Flow
```
User selects/deselects term
    ↓
TermSelector calls validateTermSelection()
    ↓
For each pair of selected terms:
    - Look up their subcategories
    - Check if subcategories are in INCOMPATIBLE_PAIRS
    ↓
Return list of contradictions
    ↓
ContradictionWarning component displays results
```

### Component Structure
```
TermSelector (existing, modified)
    ├── validateTermSelection() → contradiction results
    ├── ContradictionWarning (new component)
    │   └── Displays conflicting pairs with explanations
    └── Term buttons (existing, unchanged)

Utilities (new)
    ├── termContradictions.ts
    │   ├── INCOMPATIBLE_SUBCATEGORIES (data)
    │   ├── validateTermSelection() (logic)
    │   ├── getTermSubcategory() (lookup)
    │   └── areSubcategoriesIncompatible() (checker)
```

---

## Phase 1 Implementation Steps

### Step 1: Define Incompatible Subcategory Pairs (30 min)
**File**: `wizard/src/utils/termContradictions.ts`

**Data Structure**:
```typescript
export const INCOMPATIBLE_SUBCATEGORIES: [string, string][] = [
  ['Positive / Uplifting', 'Dark / Negative'],
  ['Calm / Peaceful', 'Intense / Aggressive'],
  ['Romantic / Tender', 'Intense / Aggressive'],
  // 10-15 total pairs
];
```

**Decisions**:
- Start with ~10-15 high-confidence incompatible pairs
- Focus on Mood subcategories only (Energy/Texture deferred)
- Bidirectional: ["A", "B"] matches both A↔B and B↔A
- Order doesn't matter—normalize during comparison

**Deliverable**: TypeScript constant with initial incompatible pairs

---

### Step 2: Implement Subcategory Lookup (30 min)
**File**: `wizard/src/utils/termContradictions.ts`

**Function**: `getTermSubcategory(term: string): string | null`
- Input: Term string (e.g., "joyful")
- Output: Subcategory name (e.g., "Positive / Uplifting") or null
- Implementation: Iterate through MOOD_SUBCATEGORIES (already exists in termGrouping.ts)
- Handle: Terms not found in any subcategory return null

**Function**: `areSubcategoriesIncompatible(subcat1: string, subcat2: string): boolean`
- Input: Two subcategory names
- Output: Boolean indicating if they're in INCOMPATIBLE_SUBCATEGORIES
- Implementation: Check both [A, B] and [B, A] orders
- Handle: Null subcategories return false (no warning)

**Deliverable**: Pure utility functions with O(n) lookup

---

### Step 3: Implement Validation Logic (45 min)
**File**: `wizard/src/utils/termContradictions.ts`

**Function**: `validateTermSelection(selectedTerms: string[]): ContradictionResult[]`

**Algorithm**:
```typescript
1. Initialize empty results array
2. For i from 0 to selectedTerms.length - 1:
   3. For j from i+1 to selectedTerms.length:
      4. term1 = selectedTerms[i]
      5. term2 = selectedTerms[j]
      6. subcat1 = getTermSubcategory(term1)
      7. subcat2 = getTermSubcategory(term2)
      8. If areSubcategoriesIncompatible(subcat1, subcat2):
         9. Add ContradictionResult to results
10. Return results
```

**Types**:
```typescript
export interface ContradictionResult {
  term1: string;
  term2: string;
  subcategory1: string;
  subcategory2: string;
  reason: string; // Pre-formatted message
}
```

**Performance**: O(n²) where n = number of selected terms
- Typical case: 2-5 terms = 1-10 comparisons
- Edge case: 20 terms = 190 comparisons (~2ms)

**Deliverable**: Core validation function with typed results

---

### Step 4: Create Warning Component (1 hour)
**File**: `wizard/src/components/ContradictionWarning.tsx`

**Props**:
```typescript
interface ContradictionWarningProps {
  contradictions: ContradictionResult[];
}
```

**UI Structure**:
```tsx
<div role="alert" aria-live="polite" className="warning-container">
  <ExclamationTriangleIcon />
  <div>
    <h4>Contradictory Moods Detected</h4>
    {contradictions.map(c => (
      <p>"{c.term1}" and "{c.term2}": {c.reason}</p>
    ))}
    <p className="suggestion">
      Consider removing one of these terms for a more coherent description.
    </p>
  </div>
</div>
```

**Styling**:
- Background: yellow-50/yellow-900/20 (light/dark)
- Text: yellow-800/yellow-400
- Icon: yellow-600
- Border: Optional subtle yellow border
- Margin: mt-2 to separate from term buttons

**Accessibility**:
- role="alert" for immediate announcement
- aria-live="polite" to avoid interrupting
- Color contrast: WCAG AA compliant
- Icon has aria-hidden (text conveys meaning)

**Deliverable**: Reusable warning component with full accessibility

---

### Step 5: Integrate into TermSelector (45 min)
**File**: `wizard/src/components/TermSelector.tsx` (modify existing)

**Changes**:
1. Import validateTermSelection and ContradictionWarning
2. Add validation call after term selection changes:
   ```typescript
   const contradictions = useMemo(
     () => validateTermSelection(selectedArray),
     [selectedArray]
   );
   ```
3. Render warning component above "Skip/Next" buttons:
   ```tsx
   {contradictions.length > 0 && (
     <ContradictionWarning contradictions={contradictions} />
   )}
   ```

**Constraints**:
- **Preserve all existing comments** (user requirement)
- **Preserve empty lines** (user requirement)
- Add imports at top of file (separate edit)
- Place warning in logical position (after terms, before buttons)

**Deliverable**: Enhanced TermSelector with validation

---

### Step 6: Write Tests (1 hour)
**File**: `wizard/tests/utils/termContradictions.test.ts`

**Test Suites**:
1. **getTermSubcategory()**
   - Returns correct subcategory for known term
   - Returns null for unknown term
   - Handles all 7 mood subcategories
   
2. **areSubcategoriesIncompatible()**
   - Returns true for defined incompatible pairs
   - Returns false for compatible pairs
   - Handles bidirectional matching (A↔B = B↔A)
   - Returns false for null subcategories
   
3. **validateTermSelection()**
   - Returns empty array for single term
   - Returns empty array for compatible terms
   - Detects single contradiction
   - Detects multiple contradictions
   - Returns all pairs when 3+ contradictory terms selected
   - Performance: <10ms for 10 terms
   
4. **Edge Cases**
   - Empty selection → no contradictions
   - Terms from same subcategory → no contradiction
   - Terms without subcategory → no contradiction
   - Mixed valid/invalid terms → only valid pairs checked

**File**: `wizard/tests/components/ContradictionWarning.test.tsx`

**Test Suites**:
1. **Rendering**
   - Displays all contradictory pairs
   - Shows correct term names and subcategories
   - Renders suggestion text
   
2. **Accessibility**
   - Has role="alert"
   - Has aria-live="polite"
   - Icon is decorative (aria-hidden)
   
3. **Styling**
   - Matches design spec colors
   - Dark mode support

**Deliverable**: 20-30 test assertions with full coverage

---

### Step 7: Documentation (30 min)

**Update**: `wizard/src/utils/termContradictions.ts`
- Add JSDoc comments to all exported functions
- Document incompatible pairs list with examples

**Create**: Brief section in `specs/007-contradiction-warnings/quickstart.md`
- How to add new incompatible pairs
- How validation works
- Performance characteristics

**Update**: `specs/007-contradiction-warnings/IMPLEMENTATION_SUMMARY.md`
- Similar to 006 summary
- List files created/modified
- Testing results
- Known limitations

**Deliverable**: Developer-facing documentation

---

## Files to Create

1. `wizard/src/utils/termContradictions.ts` (~150 lines)
   - Data: INCOMPATIBLE_SUBCATEGORIES
   - Logic: validation functions
   - Types: ContradictionResult interface

2. `wizard/src/components/ContradictionWarning.tsx` (~80 lines)
   - UI component with accessibility

3. `wizard/tests/utils/termContradictions.test.ts` (~200 lines)
   - Comprehensive utility tests

4. `wizard/tests/components/ContradictionWarning.test.tsx` (~100 lines)
   - Component rendering tests

5. `specs/007-contradiction-warnings/quickstart.md` (~100 lines)
   - Usage and maintenance guide

6. `specs/007-contradiction-warnings/IMPLEMENTATION_SUMMARY.md` (~200 lines)
   - Implementation status and results

---

## Files to Modify

1. `wizard/src/components/TermSelector.tsx`
   - Add imports (top of file)
   - Add validation logic (in component body)
   - Add warning component rendering (before buttons)
   - **Preserve all comments and empty lines**

2. `wizard/src/utils/termGrouping.ts` (possibly)
   - Export MOOD_SUBCATEGORIES if not already exported
   - No other changes

---

## Initial Incompatible Pairs List (Design Decision)

Based on semantic analysis of taxonomy subcategories:

### High Confidence (Core Oppositions)
1. `['Positive / Uplifting', 'Dark / Negative']` - Joy vs sadness/gloom
2. `['Calm / Peaceful', 'Intense / Aggressive']` - Tranquility vs intensity
3. `['Romantic / Tender', 'Intense / Aggressive']` - Tenderness vs aggression

### Medium Confidence (Strong Contrasts)
4. `['Positive / Uplifting', 'Intense / Aggressive']` - Upbeat vs forceful/violent
5. `['Calm / Peaceful', 'Dark / Negative']` - Serenity vs darkness (debatable—dark can be calm)
6. `['Romantic / Tender', 'Dark / Negative']` - Love vs gloom (debatable—dark romance exists)

### Considerations
- **Not including**: Mysterious/Ambiguous pairs—mystery can coexist with many moods
- **Not including**: Nostalgic/Reflective pairs—nostalgia spans positive and negative
- **Conservative approach**: Start with 3-6 pairs, expand based on user feedback

**Decision**: Launch with **3-6 pairs** following this strategy:
- **Minimum (3 pairs)**: High-confidence core oppositions (Positive↔Dark, Calm↔Intense, Tender↔Intense)
- **Optional (+1-3 pairs)**: Medium-confidence contrasts added during implementation if testing validates them
- **Rationale**: Start conservative, expand incrementally based on false positive rates during manual testing (T011)

---

## Testing Strategy

### Unit Tests
- All utility functions tested in isolation
- Edge cases covered (empty, null, single term)
- Performance benchmarked (<10ms for typical cases)

### Component Tests
- Warning renders correctly
- Accessibility attributes present
- Dark mode styling verified

### Integration Tests
- TermSelector integration tested end-to-end
- Warning appears/disappears correctly
- Does not block wizard progression

### Manual Testing Checklist
- [ ] Select contradictory terms → warning appears
- [ ] Deselect one term → warning disappears
- [ ] Select 3+ contradictory terms → all pairs shown
- [ ] Warning does not block "Next" button
- [ ] Screen reader announces warning
- [ ] Dark mode styling correct
- [ ] Performance acceptable (<50ms validation)

---

## Performance Budget

| Operation | Target | Maximum |
|-----------|--------|---------|
| Validation (2-5 terms) | <5ms | 10ms |
| Validation (20 terms) | <10ms | 50ms |
| Warning render | <10ms | 20ms |
| Total user-visible latency | <20ms | 50ms |

**Rationale**: User should not perceive any lag when selecting terms.

---

## Rollout Plan

### Phase 1 (This Sprint)
✅ Subcategory-based validation
✅ 3-6 incompatible pairs
✅ Visual warning component
✅ Non-blocking behavior

### Phase 2 (Future - Data-Driven)
After 2-4 weeks of usage:
- Analyze which contradictions users ignore (maybe they're valid!)
- Identify missed contradictions (false negatives)
- Consider adding specific term-level overrides if needed
- Possibly expand to Energy/Texture when hierarchies available

### Phase 3+ (Future - Advanced)
- AI-generated term pair matrix (if subcategories prove insufficient)
- Severity levels (strong vs weak contradictions)
- Context-aware whitelist (allow intentional contradictions)

---

## Success Criteria

### Must Have (Phase 1)
- ✅ Warns for defined incompatible subcategory pairs
- ✅ No false positives (same subcategory never warns)
- ✅ <50ms validation latency
- ✅ Non-blocking UX
- ✅ Screen reader accessible

### Nice to Have (Future)
- Analytics tracking of ignored warnings
- User feedback mechanism ("Was this warning helpful?")
- Expandable/collapsible warning for multiple contradictions

---

## Risk Mitigation

### Risk: Users ignore warnings (low impact)
**Mitigation**: Non-blocking design—users retain control. Gather data to refine rules.

### Risk: False positives (medium impact)
**Mitigation**: Conservative initial rule set (3-6 pairs). Easy to disable specific rules.

### Risk: Performance issues with many terms (low probability)
**Mitigation**: O(n²) is fine for n<20. Benchmark tests ensure <50ms budget met.

### Risk: Incomplete coverage (expected in Phase 1)
**Mitigation**: Document as known limitation. Plan Phase 2 based on usage data.

---

## Estimated Timeline

| Task | Duration | Dependencies |
|------|----------|--------------|
| Define incompatible pairs | 30 min | None |
| Implement lookup functions | 30 min | Step 1 |
| Implement validation logic | 45 min | Step 2 |
| Create warning component | 1 hour | None (parallel) |
| Integrate into TermSelector | 45 min | Steps 3-4 |
| Write tests | 1 hour | Steps 1-5 |
| Documentation | 30 min | Steps 1-6 |

**Total**: ~5 hours (single session)

---

## Next Step

Proceed to **tasks.md** to break down implementation into granular tasks following TDD approach.

**Ready for**: Task breakdown → Implementation → Testing → Documentation
