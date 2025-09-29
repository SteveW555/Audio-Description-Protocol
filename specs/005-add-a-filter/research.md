# Phase 0: Research Findings

**Feature**: Add Frequency Filter Toolbar
**Date**: 2025-01-29
**Status**: Complete

## Technical Decisions

### 1. Frequency Data Structure
**Decision**: Use existing Frequency enum from taxonomy.py
**Rationale**: Data already exists in Python backend with enum values: RARE, INFREQUENT, FREQUENT, UBIQUITOUS
**Alternatives considered**:
- Custom frequency categories in frontend (rejected - would duplicate backend)
- Dynamic frequency calculation (rejected - static metadata is already defined)

### 2. State Management Approach
**Decision**: Use Zustand for global filter state
**Rationale**: Already in package.json dependencies, lightweight, TypeScript-friendly
**Alternatives considered**:
- React Context API (viable but more boilerplate)
- Component local state (rejected - needs to persist across steps)
- WizardContext integration (considered but filter is orthogonal to wizard flow)

### 3. Component Architecture
**Decision**: Create standalone FrequencyFilter component that communicates via Zustand store
**Rationale**: Maintains separation of concerns, doesn't modify existing TermSelector
**Alternatives considered**:
- Modify TermSelector directly (rejected - violates user constraint)
- HOC wrapper (rejected - unnecessary complexity)

### 4. Filter Integration Point
**Decision**: Filter terms array before passing to TermSelector
**Rationale**: Clean separation, TermSelector remains unchanged
**Alternatives considered**:
- Filter inside TermSelector (rejected - modifies existing component)
- Create filtered copy component (rejected - code duplication)

## Key Findings

### Current TermSelector Structure
- Accepts `terms: string[]` prop
- Has multi-select capability
- Already has "No terms available" empty state
- Uses Tailwind for styling (must preserve)

### Frequency Enum Values
From taxonomy.py:
- `RARE = "rare"`
- `INFREQUENT = "infrequent"`
- `FREQUENT = "frequent"`
- `UBIQUITOUS = "ubiquitous"`

Note: Need to add "all" as frontend-only filter option.

### Existing Patterns
- Components use TypeScript with explicit interfaces
- Tailwind CSS for styling with dark mode support
- React.memo for performance optimization
- Separate handler functions before component body

## Implementation Constraints

1. **Must NOT modify**: Term button styling in TermSelector.tsx
2. **Must preserve**: Existing dark mode theming
3. **Must support**: All frequency categories plus "all" option
4. **Must implement**: Disabled state with "No [frequency] Available" labels

## Performance Considerations

- Filter operation should be O(n) where n = number of terms
- Use React.memo to prevent unnecessary re-renders
- Consider virtualization if term lists grow very large (defer to future optimization)

## Next Steps (Phase 1)

1. Define TypeScript types for frequency categories
2. Create Zustand store for filter state
3. Implement FrequencyFilter component
4. Create filter hook for term filtering logic
5. Update parent components to use filtered terms

---
*All technical unknowns resolved. Ready for Phase 1 design.*