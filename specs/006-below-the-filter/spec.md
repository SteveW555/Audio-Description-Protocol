# Feature Specification: Group By Toolbar for Term Organization

**Feature Branch**: `006-below-the-filter`
**Created**: 2025-09-29
**Status**: Draft
**Input**: User description: "below the filter-by-frequency toolbar, add a similar \"Group By\" toolbar with two choices: Category or Popularity. It should be styled the same as the filter by freq ui. Then within each terms buttons panels, group the terms accordingly and separate each group with a fine, light-gray horizontal line with a tiny label text-[10px] stating the group"

## Execution Flow (main)
```
1. Parse user description from Input
   → Feature adds grouping UI and visual organization to term selector
2. Extract key concepts from description
   → Actors: Users selecting/viewing terms in wizard
   → Actions: Choose grouping method, view grouped terms
   → Data: Terms with category and frequency metadata
   → Constraints: Match existing frequency filter styling
3. For each unclear aspect:
   → [RESOLVED: Grouping preference persists across sessions (stored permanently)]
   → [RESOLVED: Default grouping on first load is Category]
   → [RESOLVED: Terms without metadata appear ungrouped at end]
4. Fill User Scenarios & Testing section
5. Generate Functional Requirements
6. Identify Key Entities
7. Run Review Checklist
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## Clarifications

### Session 2025-09-29
- Q: When a user first opens the wizard (or first sees the Group By toolbar), which grouping should be active by default? → A: Category
- Q: When a user selects a grouping method (Category or Popularity) and then navigates to another wizard step, what should happen when they return? → A: Persist across sessions (stored permanently)
- Q: How should the system handle terms that lack category or frequency metadata? → A: Show ungrouped at end (display after all grouped terms without a group label)
- Q: When displaying groups (either Category or Popularity), in what order should the groups appear? → A: Semantic order (Mood, Energy, Texture for Category; Ubiquitous, Frequent, Infrequent, Rare for Popularity)
- Q: Within each group, how should individual term buttons be ordered? → A: By frequency (most common terms first within each group)

---

## User Scenarios & Testing

### Primary User Story
A user working with the wizard interface wants to explore available terms in an organized manner. After selecting a frequency filter (e.g., "ubiquitous" or "frequent"), they want to see the filtered terms organized by either their semantic category (mood, energy, texture) or their popularity level. The user switches between "Category" and "Popularity" grouping to better understand term organization and make informed selections.

### Acceptance Scenarios
1. **Given** the user is on a wizard step with term selection and has filtered terms by frequency, **When** they click "Category" in the Group By toolbar, **Then** the terms display in groups separated by category labels (e.g., "Mood", "Energy", "Texture") with visual separators
2. **Given** the user has selected "Category" grouping, **When** they click "Popularity" in the Group By toolbar, **Then** the terms reorganize into frequency-based groups (e.g., "Ubiquitous", "Frequent", "Infrequent", "Rare") with visual separators
3. **Given** the user has selected a grouping preference, **When** they navigate to the next wizard step and return, **Then** the grouping preference is preserved across sessions (stored permanently)
4. **Given** the user is viewing grouped terms, **When** they select or deselect terms, **Then** selections work normally regardless of grouping display

### Edge Cases
- What happens when a frequency filter results in terms from only one category/frequency level?
- Terms without category or frequency metadata appear ungrouped at the end after all grouped terms
- What is the display behavior when no terms match the active frequency filter?
- If grouping adds significant height, should there be scrolling behavior?

## Requirements

### Functional Requirements
- **FR-001**: System MUST display a "Group By" toolbar below the frequency filter toolbar
- **FR-002**: Group By toolbar MUST provide two mutually exclusive options: "Category" and "Popularity"
- **FR-003**: Group By toolbar MUST match the visual styling of the frequency filter toolbar (same spacing, colors, button size, typography)
- **FR-004**: System MUST display exactly one grouping option as selected at all times, defaulting to "Category" on initial load
- **FR-005**: System MUST organize term buttons into visual groups based on the selected grouping method
- **FR-006**: When "Category" is selected, system MUST group terms by their semantic category in order: Mood, Energy, Texture
- **FR-007**: When "Popularity" is selected, system MUST group terms by their frequency level in order: Ubiquitous, Frequent, Infrequent, Rare
- **FR-008**: System MUST display a fine, light-gray horizontal line separator between each group
- **FR-007a**: Within each group, system MUST order term buttons by frequency (most common first)
- **FR-009**: System MUST display a small label (text-[10px] size) above or beside each group stating the group name
- **FR-010**: Group labels MUST use proper capitalization and human-readable names (e.g., "Mood" not "mood", "Ubiquitous" not "ubiquitous")
- **FR-011**: System MUST maintain term selection state when users switch between grouping methods
- **FR-012**: System MUST respect the active frequency filter when displaying grouped terms
- **FR-013**: Grouped term buttons MUST retain their existing styling and interaction behavior
- **FR-014**: System MUST persist grouping preference across browser sessions using local storage
- **FR-015**: System MUST display terms without category or frequency metadata ungrouped at the end, after all grouped terms, without a group label

### Key Entities
- **Group By Selection**: Represents the user's choice between "Category" and "Popularity" grouping methods
- **Term Group**: A collection of terms sharing the same category or frequency level, displayed together with a separator and label
- **Group Label**: A text identifier for each term group (e.g., "Mood", "Frequent") displayed in small typography

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous (once clarifications resolved)
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (3 clarifications)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
