# Research: Group By Toolbar for Term Organization

**Feature**: 006-below-the-filter
**Date**: 2025-09-29
**Status**: Complete

## Research Objectives

Investigate best practices for implementing a "Group By" toolbar that organizes term buttons by Category or Popularity, matching the existing FrequencyFilter styling and integrating with the wizard's TypeScript/React architecture.

## Research Findings

### 1. Existing Frequency Filter Implementation

**Objective**: Extract styling patterns and localStorage persistence approach from FrequencyFilter.tsx

**Decision**: Use FrequencyFilter.tsx as primary styling reference

**Rationale**: Feature spec FR-003 requires "match the visual styling of the frequency filter toolbar (same spacing, colors, button size, typography)"

**Key Findings**:
- **Container styling**: `flex flex-wrap items-center gap-1 mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg`
  - Flexible wrapping for responsive behavior
  - Dark mode support via `dark:` variants
  - Rounded corners with light gray background
- **Label styling**: `text-gray-600 dark:text-gray-400 text-[12px] font-medium mr-2`
  - 12px text for labels (note: button text is 10px)
  - Medium font weight
  - Right margin for spacing
- **Button styling**: `px-[4px] py-[2px] text-[10px] font-medium rounded transition-all duration-200`
  - Extremely compact padding (4px horizontal, 2px vertical)
  - 10px text (not 12px like label)
  - Smooth transitions for state changes
- **Selected button**: `bg-blue-600 dark:bg-blue-500 text-white shadow-md`
  - Blue background with shadow for prominence
  - White text for contrast
- **Unselected button**: `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600`
  - White/gray background depending on theme
  - Border for definition
  - Hover states for interactivity
- **ARIA accessibility**: `role="group"`, `aria-label="Frequency filter"`, `aria-pressed={isSelected}` on buttons

**Source**: `wizard/src/components/FrequencyFilter.tsx` (lines 12-51)

**Alternatives Considered**:
- Custom styling from scratch → Rejected: violates FR-003 requirement, creates visual inconsistency
- Material-UI components → Rejected: project uses TailwindCSS, no UI library dependency

---

### 2. Term Category Inference

**Objective**: Determine how to categorize terms as Mood, Energy, or Texture

**Decision**: Use TypeScript type unions from protocol.ts to infer category

**Rationale**: Terms are already typed by category (MoodTerm, EnergyTerm, TextureTerm) in the protocol, making runtime inference straightforward via type narrowing

**Key Findings**:
- **MoodTerm**: 109 terms across 6 subcategories
  - Positive/Uplifting: 'upbeat', 'joyful', 'cheerful', etc.
  - Calm/Peaceful: 'peaceful', 'calm', 'serene', etc.
  - Dark/Negative: 'dark-mood', 'melancholic', 'sad', etc.
  - Intense/Aggressive: 'intense-mood', 'aggressive', 'powerful-mood', etc.
  - Mysterious/Ambiguous: 'mysterious', 'enigmatic', 'otherworldly', etc.
  - Romantic/Tender: 'tender', 'affectionate', 'intimate-mood', etc.
- **EnergyTerm**: 80 terms across 5 subcategories
  - High/Positive Drive: 'high-energy', 'driving', 'vigorous', etc.
  - Medium/Flowing: 'flowing', 'steady', 'moderate', etc.
  - Low/Peaceful: 'laid-back', 'low-energy', 'ambient', etc.
  - Negative/Unstable: 'tense-energy', 'anxious-energy', 'chaotic-energy', etc.
  - Expansive/Other: 'expansive', 'soaring', 'transcendent-energy', etc.
- **TextureTerm**: 130 terms across 8 subcategories
  - Bright/Positive: 'bright', 'crisp', 'sparkling', etc.
  - Warm/Peaceful: 'warm', 'rich', 'lush', etc.
  - Dark/Negative: 'dark', 'muddy', 'harsh', etc.
  - Natural/Acoustic: 'acoustic', 'organic', 'raw-texture', etc.
  - Synthetic/Electronic: 'electronic', 'synthetic', 'digital', etc.
  - Density/Layering: 'layered', 'complex', 'sparse', etc.
  - Smooth/Refined: 'smooth', 'polished-texture', 'elegant', etc.
  - Rough/Gritty: 'rough', 'gritty', 'jagged', etc.

**Implementation Approach**:
```typescript
// In termGrouping.ts utility
const MOOD_TERMS: string[] = [ /* extracted from MoodTerm union */ ];
const ENERGY_TERMS: string[] = [ /* extracted from EnergyTerm union */ ];
const TEXTURE_TERMS: string[] = [ /* extracted from TextureTerm union */ ];

function inferTermCategory(term: string): TermCategory | null {
  if (MOOD_TERMS.includes(term)) return 'Mood';
  if (ENERGY_TERMS.includes(term)) return 'Energy';
  if (TEXTURE_TERMS.includes(term)) return 'Texture';
  return null; // Terms without metadata
}
```

**Source**: `wizard/src/types/protocol.ts` (lines 1-81)

**Alternatives Considered**:
- API endpoint for categorization → Rejected: overkill for static data, adds latency
- Hardcoded mappings in separate file → Rejected: duplicates information already in protocol.ts
- Regular expressions on term names → Rejected: fragile, doesn't handle edge cases like 'energetic-mood' vs 'high-energy'

---

### 3. Term Frequency Mapping

**Objective**: Access frequency metadata for Popularity grouping

**Decision**: Import TERM_FREQUENCIES constant from termFrequencies.ts

**Rationale**: Frequency metadata is already centralized and maintained, no need to duplicate or re-implement

**Key Findings**:
- **Format**: `Record<string, 'ubiquitous' | 'frequent' | 'infrequent' | 'rare'>`
- **Coverage**: 142+ terms mapped comprehensively
- **Distribution examples**:
  - Ubiquitous (7 terms): 'upbeat', 'energetic-mood', 'joyful', 'positive-mood', 'calm', 'peaceful', 'high-energy', 'negative-mood'
  - Frequent (majority): 'happy', 'cheerful', 'uplifting', 'relaxed', 'dark-mood', etc.
  - Infrequent (less common): 'euphoric', 'exuberant', 'ethereal-mood', 'menacing', etc.
  - Rare (specialized): 'sparkly-mood', 'gossamer-mood', 'forlorn', 'plaintive', 'blistering', 'snarling', 'monophonic', 'lethargic'

**Implementation**:
```typescript
import { TERM_FREQUENCIES } from '../utils/termFrequencies';

function groupTermsByPopularity(terms: Term[]): TermGroup[] {
  const grouped: Record<string, Term[]> = {
    ubiquitous: [],
    frequent: [],
    infrequent: [],
    rare: []
  };

  terms.forEach(term => {
    const freq = TERM_FREQUENCIES[term.value];
    if (freq) {
      grouped[freq].push(term);
    }
  });

  // Return groups in order with labels
  return [
    { label: 'Ubiquitous', terms: grouped.ubiquitous },
    { label: 'Frequent', terms: grouped.frequent },
    { label: 'Infrequent', terms: grouped.infrequent },
    { label: 'Rare', terms: grouped.rare }
  ].filter(group => group.terms.length > 0);
}
```

**Source**: `wizard/src/utils/termFrequencies.ts` (lines 24-142)

**Alternatives Considered**:
- Dynamic frequency calculation → Rejected: frequency is curated editorial metadata, not computed
- API endpoint for frequencies → Rejected: data is static, no need for runtime fetching

---

### 4. localStorage Patterns for Feature State

**Objective**: Determine best practice for persisting grouping preference across browser sessions

**Decision**: Use versioned JSON format with key `adp-wizard-groupBy-v1`

**Rationale**:
- Matches existing localStorage patterns in useFrequencyFilter.ts
- Version field enables future migration if data structure changes
- Simple key-value storage sufficient for boolean-like state

**Format**:
```typescript
interface GroupByState {
  method: 'category' | 'popularity';
  version: 1;
}

// Save
localStorage.setItem('adp-wizard-groupBy-v1', JSON.stringify({ method: 'category', version: 1 }));

// Load
const stored = localStorage.getItem('adp-wizard-groupBy-v1');
const state: GroupByState | null = stored ? JSON.parse(stored) : null;

// Validate version
if (state && state.version !== 1) {
  // Reset to default if version mismatch
  state = { method: 'category', version: 1 };
}
```

**Migration Strategy**:
- If stored version ≠ 1, reset to default ('category')
- Future versions can implement data transformation
- Key includes `v1` suffix for clarity

**Source**: Pattern observed in `wizard/src/hooks/useFrequencyFilter.ts` (lines 11-28)

**Alternatives Considered**:
- **Unversioned string storage**: `localStorage.setItem('groupBy', 'category')`
  - Rejected: Harder to migrate if we add complexity (e.g., per-step preferences)
- **Zustand persist middleware**: Global state with automatic persistence
  - Rejected: Overkill for single boolean-like value, adds complexity
- **Session storage**: Only persists during tab session
  - Rejected: Spec FR-014 requires "persist across browser sessions"

---

### 5. TailwindCSS Group Separator Styling

**Objective**: Design visual separators between term groups that are "fine, light-gray" per spec

**Decision**: Use `border-t border-gray-300 dark:border-gray-600 pt-2 mt-2` for horizontal separators

**Rationale**:
- TailwindCSS `border-t` provides top border (horizontal line)
- `border-gray-300` is light gray, with `dark:border-gray-600` for dark mode
- Padding-top and margin-top create visual breathing room
- Matches existing separator patterns in wizard UI

**Label Styling**: `text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-1`
- 10px matches button text size (not 12px like toolbar label)
- Gray text de-emphasizes labels (secondary information)
- Medium weight for readability
- Bottom margin separates label from terms

**Placement Logic**:
```tsx
{groups.map((group, groupIndex) => (
  <div key={group.label}>
    {/* Separator for all groups except first */}
    {groupIndex > 0 && (
      <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2" />
    )}

    {/* Group label */}
    <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-1">
      {group.label}
    </div>

    {/* Term buttons */}
    {group.terms.map(term => <TermButton key={term.value} term={term} />)}
  </div>
))}
```

**Alternatives Considered**:
- **`<hr>` element**: Semantic HTML for horizontal rule
  - Rejected: Less flexible for styling, harder to customize with TailwindCSS
- **Thick border**: `border-2` or `border-4`
  - Rejected: Spec says "fine, light-gray" - thin is better
- **Background-based separator**: Colored div instead of border
  - Rejected: Border is more standard and performant

---

## Summary

All research objectives completed successfully. Key takeaways:

1. **Styling**: FrequencyFilter.tsx provides complete reference - exact TailwindCSS classes identified
2. **Category Inference**: protocol.ts type unions enable straightforward runtime categorization
3. **Frequency Metadata**: TERM_FREQUENCIES constant already exists, import and use directly
4. **Persistence**: Versioned JSON in localStorage, pattern established by FrequencyFilter
5. **Separators**: TailwindCSS border utilities provide fine-grained control for "fine, light-gray" requirement

No blocking issues identified. All dependencies (TailwindCSS, protocol types, frequency data, localStorage API) are available in current wizard architecture. Ready to proceed with data model and implementation.

---

**Research Complete**: 2025-09-29
**Next Phase**: Data Model Design (Phase 1)