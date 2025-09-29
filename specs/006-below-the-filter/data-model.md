# Data Model: Group By Toolbar for Term Organization

**Feature**: 006-below-the-filter
**Date**: 2025-09-29
**Status**: Complete

## Overview

This document defines the data model for the Group By toolbar feature. The model supports two grouping strategies (Category and Popularity) with localStorage persistence and visual term organization.

---

## Type Definitions

### 1. GroupByMethod

**Type**: String Literal Union
```typescript
type GroupByMethod = 'category' | 'popularity';
```

**Purpose**: Represents the user's selected grouping method for term organization.

**Usage**:
- `useGroupByFilter` hook state
- `TermSelectorProps.groupByMethod` prop
- `groupTermsByCategory` and `groupTermsByPopularity` function parameters

**Values**:
- `'category'`: Group terms by semantic category (Mood, Energy, Texture)
- `'popularity'`: Group terms by frequency level (Ubiquitous, Frequent, Infrequent, Rare)

**Constraints**:
- Exactly one method active at all times
- Default value: `'category'`

---

### 2. GroupByState

**Type**: Interface
```typescript
interface GroupByState {
  method: GroupByMethod;
  version: number;
}
```

**Purpose**: localStorage persistence format for grouping preference.

**Fields**:
- `method`: The selected grouping strategy
- `version`: Schema version for future migration support (current: `1`)

**Example**:
```json
{
  "method": "category",
  "version": 1
}
```

**Validation Rules**:
- `method` must be valid GroupByMethod ('category' | 'popularity')
- `version` must equal `1` (if mismatch, reset to default)

**Storage Key**: `adp-wizard-groupBy-v1`

**Migration Strategy**:
- Version 1: Current format (method + version)
- Future versions: Add transformation logic in useGroupByFilter hook

---

### 3. TermCategory

**Type**: String Literal Union
```typescript
type TermCategory = 'Mood' | 'Energy' | 'Texture';
```

**Purpose**: Semantic categories for audio description terms.

**Usage**:
- `TermGroup.label` for category-based grouping
- `inferTermCategory()` return type
- Display labels in UI (capitalized)

**Values**:
- `'Mood'`: Emotional/affective qualities (e.g., 'joyful', 'melancholic')
- `'Energy'`: Activity/intensity levels (e.g., 'high-energy', 'calm')
- `'Texture'`: Sonic/timbral characteristics (e.g., 'bright', 'warm')

**Group Order** (spec FR-006):
1. Mood
2. Energy
3. Texture

**Inference Logic**:
- Derived from protocol.ts type unions (MoodTerm, EnergyTerm, TextureTerm)
- Runtime lookup via pre-computed arrays
- Returns `null` for terms without metadata

---

### 4. TermGroup

**Type**: Interface
```typescript
interface TermGroup {
  label: string;
  terms: Term[];
}
```

**Purpose**: Collection of terms sharing a category or frequency level, rendered as a visual group.

**Fields**:
- `label`: Human-readable group name (e.g., "Mood", "Ubiquitous", "Frequent")
- `terms`: Array of Term objects belonging to this group

**Usage**:
- Return type for `groupTermsByCategory()` and `groupTermsByPopularity()`
- Iteration target in TermSelector rendering
- Determines separator and label placement

**Example (Category grouping)**:
```typescript
[
  { label: 'Mood', terms: [/* 45 mood terms */] },
  { label: 'Energy', terms: [/* 30 energy terms */] },
  { label: 'Texture', terms: [/* 25 texture terms */] }
]
```

**Example (Popularity grouping)**:
```typescript
[
  { label: 'Ubiquitous', terms: [/* 7 ubiquitous terms */] },
  { label: 'Frequent', terms: [/* 60 frequent terms */] },
  { label: 'Infrequent', terms: [/* 25 infrequent terms */] },
  { label: 'Rare', terms: [/* 8 rare terms */] }
]
```

**Constraints**:
- Empty groups (`terms.length === 0`) should be filtered out before rendering
- Terms within groups ordered by frequency (most common first per spec FR-007a)
- Groups ordered semantically (spec FR-006, FR-007)

---

## State Transitions

### User Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Initial Load                                                │
├─────────────────────────────────────────────────────────────┤
│ 1. useGroupByFilter() reads localStorage                   │
│ 2. If valid state found → restore method                   │
│ 3. If no state / invalid version → default to 'category'  │
│ 4. TermSelector receives groupByMethod='category'          │
│ 5. Terms grouped by category (Mood, Energy, Texture)       │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ User Clicks "Popularity" Button                            │
├─────────────────────────────────────────────────────────────┤
│ 1. GroupByFilter fires onClick handler                     │
│ 2. setGroupByMethod('popularity') called                   │
│ 3. localStorage.setItem() saves new state                  │
│ 4. TermSelector re-renders with groupByMethod='popularity' │
│ 5. Terms re-grouped by frequency (Ubiq, Freq, Infreq, Rare)│
│ 6. Term selection state preserved (spec FR-011)            │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ User Navigates Away and Returns                            │
├─────────────────────────────────────────────────────────────┤
│ 1. useGroupByFilter() re-initializes                       │
│ 2. localStorage read finds method='popularity'             │
│ 3. State restored automatically (spec FR-014)              │
│ 4. TermSelector renders with popularity grouping           │
└─────────────────────────────────────────────────────────────┘
```

### State Invariants

1. **Exactly One Method Active**: `groupByMethod` is never `null` or `undefined` - always one of `'category' | 'popularity'`
2. **Persistence Consistency**: localStorage state always matches in-memory state after writes
3. **Group Non-Empty**: Empty groups filtered before rendering (no visual output for groups with 0 terms)
4. **Term Selection Independence**: Selected terms remain selected when grouping method changes (spec FR-011)
5. **Frequency Filter Integration**: Grouped terms respect active frequency filter (spec FR-012)

---

## Data Flow Diagram

```
┌────────────────────┐
│  localStorage      │
│  (Browser API)     │
└─────────┬──────────┘
          │ load/save
          ↓
┌────────────────────┐     setGroupByMethod()
│ useGroupByFilter   │◄────────────────────────┐
│ (Custom Hook)      │                         │
└─────────┬──────────┘                         │
          │ provides: groupByMethod            │
          ↓                                    │
┌────────────────────┐                   ┌─────────────────┐
│  TermSelector      │                   │ GroupByFilter   │
│  (Component)       │                   │ (Component)     │
└─────────┬──────────┘                   └─────────────────┘
          │
          ├──→ groupTerms() (utils/termGrouping.ts)
          │    ├─→ groupTermsByCategory() if method='category'
          │    └─→ groupTermsByPopularity() if method='popularity'
          │
          └──→ Render grouped terms with separators & labels
```

---

## Entity Relationships

```
GroupByState (localStorage)
    │
    │ persists
    │
    ↓
GroupByMethod (enum: 'category' | 'popularity')
    │
    │ determines grouping strategy
    │
    ↓
TermGroup[] (array of groups)
    │
    │ contains
    │
    ↓
TermGroup { label: string, terms: Term[] }
    │
    │ label derives from
    │
    ├──→ TermCategory ('Mood' | 'Energy' | 'Texture')
    │    [if method='category']
    │
    └──→ FrequencyLevel ('Ubiquitous' | 'Frequent' | 'Infrequent' | 'Rare')
         [if method='popularity']
```

---

## Integration with Existing Data Structures

### Term (existing type)
```typescript
// From wizard/src/types/protocol.ts
type Term = {
  value: string;           // Term identifier (kebab-case)
  label?: string;          // Display name (optional)
  category?: string;       // Subcategory (optional, not used for grouping)
};
```

**Integration**:
- `Term.value` used for category inference (lookup in MOOD_TERMS, ENERGY_TERMS, TEXTURE_TERMS arrays)
- `Term.value` used for frequency lookup (TERM_FREQUENCIES[term.value])
- `Term` objects passed through grouping functions unmodified
- `Term` selection state managed independently from grouping

### FrequencyCategory (existing type)
```typescript
// From wizard/src/types/filter.ts
type FrequencyCategory = 'all' | 'ubiquitous' | 'frequent' | 'infrequent' | 'rare';
```

**Integration**:
- Frequency filter operates upstream of grouping (filters terms before grouping)
- Grouped terms always respect active frequency filter (spec FR-012)
- No direct coupling between FrequencyCategory and GroupByMethod

### TERM_FREQUENCIES (existing constant)
```typescript
// From wizard/src/utils/termFrequencies.ts
export const TERM_FREQUENCIES: Record<string, 'ubiquitous' | 'frequent' | 'infrequent' | 'rare'>;
```

**Integration**:
- Used directly by `groupTermsByPopularity()` for frequency-based grouping
- Read-only reference (no mutations)
- Terms without frequency metadata handled via null checks

---

## Edge Cases & Handling

### 1. Terms Without Metadata
**Scenario**: Term not in category type unions or TERM_FREQUENCIES
**Handling**: 
- `inferTermCategory()` returns `null`
- `TERM_FREQUENCIES[term.value]` returns `undefined`
- Terms appended to end, ungrouped (no group label per spec line 61)

### 2. Empty Groups
**Scenario**: Frequency filter removes all terms from a category/frequency level
**Handling**: Filter out groups with `terms.length === 0` before rendering (no empty group dividers)

### 3. Single Group Remaining
**Scenario**: Filter results in only Mood terms, or only Ubiquitous terms
**Handling**: Still render single group with label (consistent UX)

### 4. localStorage Unavailable
**Scenario**: Browser blocks localStorage (privacy mode, disabled)
**Handling**: 
- Try-catch around localStorage access
- Fallback to in-memory state only (no persistence)
- Default to 'category' on each mount

### 5. Version Migration
**Scenario**: User has stored state from future version (version > 1)
**Handling**: Reset to default `{ method: 'category', version: 1 }`

### 6. Switching Methods with Selected Terms
**Scenario**: User has 5 terms selected, switches from Category to Popularity
**Handling**: Preserve selection state (spec FR-011), terms remain selected but visually reorganized

---

## Validation Rules

### GroupByMethod
- ✅ Must be `'category'` or `'popularity'`
- ✅ Never null, undefined, or empty string
- ✅ Case-sensitive (lowercase only)

### GroupByState
- ✅ Must have `method` field of type GroupByMethod
- ✅ Must have `version` field equal to `1`
- ✅ No extra fields allowed
- ✅ JSON serializable

### TermGroup
- ✅ `label` must be non-empty string
- ✅ `label` must be properly capitalized (e.g., "Mood" not "mood")
- ✅ `terms` must be array (can be empty before filtering)
- ✅ Terms within group ordered by frequency (most common first)

---

## Performance Considerations

### Grouping Operations
- **Target**: <50ms for 100+ terms (spec Technical Context)
- **Optimization**: Pre-compute category/frequency lookups (O(1) access)
- **Approach**: Use `Record<string, ...>` for constant-time lookups

### Rendering
- **Target**: <16ms updates for smooth 60fps transitions (spec Technical Context)
- **Optimization**: React.memo for TermButton components (prevent unnecessary re-renders)
- **Approach**: Stable keys (`term.value`) for efficient reconciliation

### localStorage Access
- **Frequency**: Only on mount and method change (not on every render)
- **Safety**: Wrapped in try-catch to handle quota errors
- **Size**: ~50 bytes JSON (negligible)

---

## Test Coverage Requirements

### Unit Tests (Types/Utils)
- [ ] `inferTermCategory()` correctly maps all 319 terms
- [ ] `groupTermsByCategory()` creates 3 groups in correct order
- [ ] `groupTermsByPopularity()` creates up to 4 groups in correct order
- [ ] Empty groups filtered before return
- [ ] Terms ordered by frequency within groups
- [ ] Terms without metadata handled gracefully

### Integration Tests (Hooks)
- [ ] `useGroupByFilter()` loads from localStorage on mount
- [ ] `useGroupByFilter()` saves to localStorage on method change
- [ ] Invalid version triggers reset to default
- [ ] localStorage unavailable handled gracefully (fallback)

### Component Tests
- [ ] GroupByFilter renders both buttons with correct styles
- [ ] Selected button has active styling
- [ ] Click handler toggles method
- [ ] ARIA attributes present and correct

### E2E Tests
- [ ] Switching methods re-groups terms visually
- [ ] Term selection preserved across grouping changes (spec FR-011)
- [ ] Preference persists across page reloads (spec FR-014)
- [ ] Frequency filter and grouping work together (spec FR-012)

---

**Data Model Complete**: 2025-09-29
**Next Phase**: Quickstart Scenarios (Phase 1 continued)
