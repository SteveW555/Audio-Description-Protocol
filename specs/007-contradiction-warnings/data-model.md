# Data Model: Contradiction Warnings

**Feature**: 007-contradiction-warnings
**Phase**: 1 (Subcategory Rules Only)

---

## Core Data Structures

### IncompatibleSubcategoryPair

**Definition**: A pair of taxonomy subcategories that are semantically contradictory.

**Structure**:
```typescript
type IncompatibleSubcategoryPair = readonly [string, string];
```

**Properties**:
- **Item 0**: First subcategory name (e.g., "Positive / Uplifting")
- **Item 1**: Second subcategory name (e.g., "Dark / Negative")

**Constraints**:
- Both strings must be valid subcategory names from TAXONOMY_HIERARCHY
- Order doesn't matter (bidirectional matching)
- Readonly tuple for immutability

**Examples**:
```typescript
['Positive / Uplifting', 'Dark / Negative']
['Calm / Peaceful', 'Intense / Aggressive']
['Romantic / Tender', 'Intense / Aggressive']
```

---

### ContradictionResult

**Definition**: Represents a detected contradiction between two selected terms.

**Structure**:
```typescript
interface ContradictionResult {
  term1: string;
  term2: string;
  subcategory1: string;
  subcategory2: string;
  reason: string;
}
```

**Properties**:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| term1 | string | Yes | First conflicting term (e.g., "joyful") |
| term2 | string | Yes | Second conflicting term (e.g., "tragic") |
| subcategory1 | string | Yes | Subcategory of term1 (e.g., "Positive / Uplifting") |
| subcategory2 | string | Yes | Subcategory of term2 (e.g., "Dark / Negative") |
| reason | string | Yes | Human-readable explanation for UI display |

**Constraints**:
- term1 and term2 must be different
- subcategory1 and subcategory2 must be incompatible per INCOMPATIBLE_SUBCATEGORIES
- reason should be formatted for direct display to users

**Example**:
```typescript
{
  term1: 'joyful',
  term2: 'tragic',
  subcategory1: 'Positive / Uplifting',
  subcategory2: 'Dark / Negative',
  reason: 'These moods are from opposing categories: "Positive / Uplifting" vs "Dark / Negative"'
}
```

---

## Reference Data

### INCOMPATIBLE_SUBCATEGORIES

**Type**: `ReadonlyArray<IncompatibleSubcategoryPair>`

**Purpose**: Define which subcategory combinations are semantically contradictory.

**Initial Value** (Phase 1):
```typescript
[
  ['Positive / Uplifting', 'Dark / Negative'],
  ['Calm / Peaceful', 'Intense / Aggressive'],
  ['Romantic / Tender', 'Intense / Aggressive'],
]
```

**Maintenance**:
- Add pairs based on user feedback and usage data
- Remove pairs if false positive rate is high
- Keep conservative (3-10 pairs) in Phase 1

**Rationale for Initial Pairs**:
- **Positive ↔ Dark**: Joy/happiness fundamentally opposes sadness/gloom
- **Calm ↔ Intense**: Tranquility opposes aggression/violence
- **Tender ↔ Intense**: Gentleness opposes forceful intensity

**Considered but Excluded** (Phase 1):
- Positive ↔ Intense: Can coexist (e.g., "euphoric" is both)
- Calm ↔ Dark: Dark music can be calm (e.g., "brooding")
- Mysterious ↔ Others: Mystery can coexist with most moods

---

## Data Flow

### Validation Pipeline

```
User Input: Selected Terms (string[])
    ↓
1. Extract pairs: For each combination of 2 terms
    ↓
2. Lookup subcategories: getTermSubcategory(term) → subcategory
    ↓
3. Check incompatibility: areSubcategoriesIncompatible(subcat1, subcat2) → boolean
    ↓
4. Build result: Create ContradictionResult if incompatible
    ↓
Output: ContradictionResult[]
```

### Component Data Flow

```
TermSelector State: selected terms
    ↓
validateTermSelection(selected)
    ↓
ContradictionResult[]
    ↓
ContradictionWarning Component (renders warnings)
```

---

## Relationships to Existing Data

### Dependency on termGrouping.ts

**Relies On**:
- `MOOD_SUBCATEGORIES`: Maps subcategory names → term lists
- Used by `getTermSubcategory()` to determine which subcategory a term belongs to

**Example**:
```typescript
MOOD_SUBCATEGORIES['Positive / Uplifting'] = [
  'upbeat', 'joyful', 'happy', ...
];
// Used to look up: 'joyful' → 'Positive / Uplifting'
```

### Dependency on taxonomy.py (Python Backend)

**Source of Truth**: Python `TAXONOMY_HIERARCHY` defines subcategory structure
- TypeScript `MOOD_SUBCATEGORIES` mirrors this structure
- Changes to Python taxonomy must sync to TypeScript

**Future Work**: Generate TypeScript from Python to maintain single source of truth

---

## Storage & Persistence

### No Persistent Storage (Phase 1)

**Rationale**: Contradiction detection is stateless
- No need to store user's ignored warnings
- No need to persist validation results
- Validation runs on-demand when selection changes

**Phase 2 Consideration**: May add analytics tracking
- Track which warnings users ignore (backend logging)
- Could inform which pairs to remove (high ignore rate = false positive)

---

## Performance Considerations

### Data Size

| Item | Count | Size |
|------|-------|------|
| INCOMPATIBLE_SUBCATEGORIES | 3-10 pairs | ~200-600 bytes |
| ContradictionResult (each) | 5 properties | ~150 bytes |
| Typical validation output | 0-4 results | 0-600 bytes |

**Total Memory Footprint**: <1KB

### Lookup Complexity

- **getTermSubcategory**: O(n) where n = total terms across subcategories (~108 mood terms)
- **areSubcategoriesIncompatible**: O(m) where m = incompatible pairs (~3-10)
- **validateTermSelection**: O(k²) where k = selected terms (~2-5 typically)

**Typical Performance**: 
- k=3 terms, n=108, m=5 → ~3 comparisons, ~10 lookups = **<1ms**
- k=10 terms, n=108, m=10 → ~45 comparisons, ~90 lookups = **~5ms**

---

## Testing Data

### Test Fixtures

**Valid Terms** (for positive test cases):
```typescript
const positiveTerms = ['joyful', 'happy', 'upbeat'];
const darkTerms = ['tragic', 'melancholic', 'gloomy'];
const calmTerms = ['peaceful', 'serene', 'tranquil'];
const intenseTerms = ['aggressive', 'fierce', 'violent'];
```

**Invalid Terms** (for edge case testing):
```typescript
const unknownTerms = ['unknown-term', 'not-in-taxonomy', ''];
```

**Mixed Selections** (for integration testing):
```typescript
const contradictorySelection = ['joyful', 'tragic']; // Positive ↔ Dark
const compatibleSelection = ['joyful', 'happy', 'upbeat']; // All Positive
const mixedSelection = ['joyful', 'unknown-term', 'tragic']; // Valid + Unknown
```

---

## Error Handling

### Graceful Degradation

**Unknown Terms**:
- `getTermSubcategory('unknown')` → null
- `areSubcategoriesIncompatible(null, 'Positive / Uplifting')` → false
- Result: No warning for unknown terms (fail silently)

**Missing Subcategories**:
- If MOOD_SUBCATEGORIES is incomplete or corrupted
- Terms without subcategory return null
- Validation proceeds without warnings for affected terms

**Rationale**: Better to show no warning than false positives

---

## Phase 2 Extensions (Future)

### Specific Term Overrides

**New Data Structure**:
```typescript
const SPECIFIC_CONTRADICTIONS: [string, string][] = [
  ['peaceful', 'chaotic-mood'],
  ['gentle', 'harsh-mood'],
];
```

**Logic Change**: Check SPECIFIC_CONTRADICTIONS before INCOMPATIBLE_SUBCATEGORIES

### Contradiction Severity

**Enhanced Structure**:
```typescript
interface EnhancedContradictionResult extends ContradictionResult {
  severity: 'strong' | 'moderate' | 'weak';
}
```

**UI Impact**: Strong → red warning, Weak → yellow hint

### Context-Aware Whitelist

**New Data Structure**:
```typescript
const ALLOWED_CONTRADICTIONS: [string, string][] = [
  ['bittersweet', 'happy'], // Intentional contradiction
];
```

**Logic Change**: Filter out whitelisted pairs from results

---

## API Summary

### Functions (exported from termContradictions.ts)

```typescript
// Lookup functions
getTermSubcategory(term: string): string | null

areSubcategoriesIncompatible(
  subcat1: string | null, 
  subcat2: string | null
): boolean

// Main validation
validateTermSelection(selectedTerms: string[]): ContradictionResult[]
```

### Components (exported)

```typescript
<ContradictionWarning 
  contradictions={ContradictionResult[]} 
/>
```

---

## Validation Rules

### When to Warn

✅ **Warn If**:
- Two or more terms selected
- Terms belong to different subcategories
- Those subcategories are in INCOMPATIBLE_SUBCATEGORIES

❌ **Don't Warn If**:
- Only one term selected
- Terms from same subcategory
- Terms without subcategory (unknown terms)
- Subcategories not in incompatibility list

---

## Examples

### Example 1: Simple Contradiction

**Input**: `['joyful', 'tragic']`

**Processing**:
1. Pair: (joyful, tragic)
2. Subcategories: (Positive/Uplifting, Dark/Negative)
3. Check: Are they incompatible? → Yes
4. Result: ContradictionResult

**Output**:
```typescript
[{
  term1: 'joyful',
  term2: 'tragic',
  subcategory1: 'Positive / Uplifting',
  subcategory2: 'Dark / Negative',
  reason: 'These moods are from opposing categories: "Positive / Uplifting" vs "Dark / Negative"'
}]
```

### Example 2: Multiple Contradictions

**Input**: `['joyful', 'happy', 'tragic', 'gloomy']`

**Processing**:
1. Pairs: (joyful, happy), (joyful, tragic), (joyful, gloomy), (happy, tragic), (happy, gloomy), (tragic, gloomy)
2. Compatible: (joyful, happy) [both Positive], (tragic, gloomy) [both Dark]
3. Incompatible: (joyful, tragic), (joyful, gloomy), (happy, tragic), (happy, gloomy)

**Output**: Array of 4 ContradictionResults

### Example 3: Compatible Selection

**Input**: `['peaceful', 'calm', 'serene']`

**Processing**:
1. All terms from "Calm / Peaceful" subcategory
2. No incompatible pairs

**Output**: `[]` (empty array, no warnings)

### Example 4: Unknown Terms

**Input**: `['joyful', 'unknown-term', 'tragic']`

**Processing**:
1. Pair: (joyful, unknown-term) → unknown has no subcategory → skip
2. Pair: (joyful, tragic) → incompatible → add to results
3. Pair: (unknown-term, tragic) → unknown has no subcategory → skip

**Output**: Array with 1 ContradictionResult (joyful ↔ tragic)

---

**Status**: Data model defined and ready for implementation
**Next**: Proceed to implementation tasks following tasks.md
