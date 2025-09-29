# Feature Specification: Contradiction Warnings for Term Selection

**Feature Branch**: `007-contradiction-warnings`
**Created**: 2025-09-29
**Status**: Draft
**Input**: User description: "Check if any selected buttons are semantically contradictory and warn the user, asking them to choose between them. Examples: aggressive/calm, playful/tragic. Use subcategory rules from taxonomy hierarchy to detect incompatible mood pairings."

## Execution Flow (main)
```
1. Parse user description from Input
   → Feature adds validation to detect contradictory term selections
2. Extract key concepts from description
   → Actors: Users selecting multiple mood/energy/texture terms
   → Actions: Select terms, receive warnings for contradictions, resolve conflicts
   → Data: Taxonomy subcategories, selected terms, incompatibility rules
   → Constraints: Non-blocking warnings (users can proceed), clear explanations
3. For each unclear aspect:
   → [RESOLVED: Use subcategory-based rules, not term-level matrix]
   → [RESOLVED: Warning is informational, not blocking]
   → [RESOLVED: Check on every selection change]
   → [RESOLVED: Show all contradictory pairs at once]
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
- Q: Should the warning prevent users from proceeding (blocking) or just inform them (non-blocking)? → A: Non-blocking - users can proceed with contradictory selections if they choose
- Q: When should contradiction checking occur? → A: On every selection change, immediately after a term is added/removed
- Q: Should we check all possible pairs or just the most recent selection? → A: Check all selected terms and show all contradictory pairs found
- Q: What level of granularity for contradiction rules? → A: Start with subcategory-based rules (e.g., "Positive/Uplifting" vs "Dark/Negative") rather than individual term pairs
- Q: Should contradictions persist if the user ignores the warning and adds more terms? → A: Yes - show updated warnings reflecting all current contradictions
- Q: How specific should the warning message be? → A: Name the specific conflicting terms and cite the subcategories they belong to for clarity

---

## User Scenarios & Testing

### Primary User Story
A music curator is using the wizard to describe a track's mood. They start by selecting "joyful" and "uplifting" (both from Positive/Uplifting subcategory), then absent-mindedly click "tragic" (from Dark/Negative subcategory). The system immediately displays a warning: "Contradictory moods detected: 'joyful' and 'tragic' are from opposing categories (Positive/Uplifting vs Dark/Negative)." The curator realizes the mistake, deselects "tragic", and continues with a coherent mood description.

### Acceptance Scenarios
1. **Given** the user has selected terms from opposing subcategories (e.g., "calm" from Calm/Peaceful and "aggressive" from Intense/Aggressive), **When** the selection is made, **Then** a warning appears explaining the contradiction and naming both terms and their subcategories
2. **Given** the user has a contradiction warning displayed, **When** they deselect one of the conflicting terms, **Then** the warning disappears immediately
3. **Given** the user has multiple contradictory pairs selected (e.g., joyful+tragic, calm+aggressive), **When** the system checks, **Then** all contradictory pairs are listed in the warning message
4. **Given** the user sees a contradiction warning, **When** they click "Next" or "Skip", **Then** the wizard proceeds normally (non-blocking behavior)
5. **Given** the user has selected only terms from compatible subcategories (e.g., "peaceful", "calm", "serene" all from Calm/Peaceful), **When** the system checks, **Then** no warning is displayed

### Edge Cases
- What happens when a user selects 3+ terms where multiple pairs contradict? → Show all contradictory pairs
- What if terms are from the same main category (Mood) but different subcategories that don't have defined opposition rules? → No warning (only defined incompatible pairs trigger warnings)
- What about terms that could be compatible in certain musical contexts (e.g., "bittersweet" combining sad and sweet)? → Phase 1 accepts this limitation; Phase 2 may add override whitelist
- What if a term belongs to multiple subcategories or has ambiguous categorization? → Use primary subcategory from taxonomy hierarchy

---

## Functional Requirements

### FR1: Subcategory Incompatibility Detection
The system shall maintain a list of incompatible subcategory pairs based on semantic opposition (e.g., Positive/Uplifting vs Dark/Negative, Calm/Peaceful vs Intense/Aggressive). When multiple terms are selected, the system shall check if any pair belongs to incompatible subcategories.

### FR2: Real-Time Validation
The system shall validate term selections immediately after any selection change (add or remove term). The validation function shall complete in <10ms for typical cases (2-10 terms). Total user-visible latency (from selection to warning display) shall be <50ms to maintain responsive UI feedback.

### FR3: Visual Warning Display
When contradictions are detected, the system shall display a non-blocking warning message that includes:
- A warning icon and heading
- List of all contradictory term pairs
- Explanation citing the opposing subcategories
- Suggestion to remove one of the conflicting terms

### FR4: Warning Dismissal
The warning shall automatically dismiss when all contradictory pairs are resolved (user deselects conflicting terms). The warning shall not block wizard progression—users can proceed despite warnings.

### FR5: No False Positives from Same Subcategory
Terms from the same subcategory shall never trigger contradiction warnings, regardless of how many are selected. For example, selecting "peaceful", "calm", and "serene" (all Calm/Peaceful) produces no warning.

### FR6: Multi-Pair Detection
If the user has selected terms creating multiple contradictory pairs (e.g., A↔B and C↔D), the system shall list all pairs in a single consolidated warning message rather than showing multiple separate warnings.

---

## Non-Functional Requirements

### NFR1: Performance
Contradiction checking for typical selections (2-10 terms) shall complete in <10ms. Maximum allowable latency is 50ms for edge cases with many terms selected.

### NFR2: Maintainability
Incompatible subcategory pairs shall be defined in a declarative data structure (not hardcoded logic), making it easy to add/remove/modify rules without code changes.

### NFR3: Accessibility
Warning messages shall be announced to screen readers. Warning component shall have appropriate ARIA attributes (role="alert", aria-live="polite").

### NFR4: Localization-Ready
Warning messages shall use string templates that can be easily translated to other languages in future phases.

---

## Key Entities

### Incompatible Subcategory Pair
- **Properties**: subcategory1 (string), subcategory2 (string)
- **Purpose**: Defines which taxonomy subcategories are semantically contradictory
- **Examples**: 
  - ["Positive / Uplifting", "Dark / Negative"]
  - ["Calm / Peaceful", "Intense / Aggressive"]
  - ["Romantic / Tender", "Intense / Aggressive"]

### Contradiction Result
- **Properties**: 
  - conflictingPairs: Array of [term1, term2] tuples
  - subcategory1: string (subcategory of first term)
  - subcategory2: string (subcategory of second term)
  - reason: string (human-readable explanation)
- **Purpose**: Represents a detected contradiction to be displayed to the user

### Validation State
- **Properties**: 
  - hasContradictions: boolean
  - contradictions: Array of Contradiction Results
- **Purpose**: Tracks current validation status of selected terms

---

## Out of Scope (Future Phases)

### Phase 2 Enhancements (Not in Initial Release)
- **Specific term-level overrides**: Manually curated list of term pairs that contradict despite being in compatible subcategories
- **Context-aware whitelist**: Allow certain "contradictory" combinations that are musically valid (e.g., bittersweet)
- **Severity levels**: Distinguish between strong contradictions (warn prominently) and weak contradictions (subtle hint)
- **AI-generated matrix**: Use LLM to evaluate all term pairs and build comprehensive contradiction database

### Not Included in Any Phase
- **Automated resolution**: System does not auto-remove contradictory terms—user retains full control
- **Energy/Texture validation**: Initial phase focuses on Mood subcategories only; Energy and Texture to be added when those subcategory hierarchies are defined
- **Contradiction scoring**: No numeric "contradiction severity" metric—binary yes/no detection only

---

## Success Metrics

### User Experience
- Users correct contradictory selections within 10 seconds of seeing warning (measured via wizard analytics)
- <5% of users proceed with contradictory selections after seeing warning (indicates clear, actionable messaging)

### Technical Performance
- Validation latency: 95th percentile <20ms, 99th percentile <50ms
- Zero false positives: Terms from same subcategory never trigger warning
- Zero UI jank: Warning display/dismissal causes no layout shifts or flicker

### Data Quality
- 30% reduction in obviously contradictory mood combinations in final output annotations (compared to pre-feature baseline)

---

## Review Checklist

- ✅ User needs clearly stated (prevent contradictory mood descriptions)
- ✅ Actors identified (music curators using wizard)
- ✅ Success criteria measurable (latency, false positive rate, user corrections)
- ✅ Edge cases documented (multiple contradictions, ambiguous terms)
- ✅ Non-functional requirements specified (performance, accessibility, maintainability)
- ✅ Out-of-scope items listed (term-level overrides, AI matrix, auto-resolution)
- ✅ Key entities defined (IncompatiblePair, ContradictionResult, ValidationState)
- ✅ No implementation details leaked (no mention of React, hooks, specific files)

---

## Appendix: Example Incompatible Subcategory Pairs (Informative)

*Note: This is informational context, not normative specification*

### Mood Subcategories (from taxonomy.py)
- **Positive / Uplifting**: upbeat, joyful, happy, cheerful, optimistic, euphoric...
- **Calm / Peaceful**: peaceful, calm, serene, tranquil, meditative, gentle...
- **Dark / Negative**: melancholic, sad, tragic, gloomy, ominous, disturbing...
- **Intense / Aggressive**: aggressive, fierce, powerful, violent, furious, explosive...
- **Mysterious / Ambiguous**: mysterious, enigmatic, cryptic, otherworldly...
- **Romantic / Tender**: tender, loving, passionate, affectionate, intimate...
- **Nostalgic / Reflective**: nostalgic, reflective, bittersweet, wistful...

### Likely Incompatible Pairs (Subject to Design Phase Refinement)
- Positive/Uplifting ↔ Dark/Negative
- Calm/Peaceful ↔ Intense/Aggressive
- Romantic/Tender ↔ Intense/Aggressive
- Playful attitudes ↔ Tragic moods
- *(Complete list to be finalized in design phase)*

---

**Status**: Specification complete, ready for design phase
**Next Steps**: Design phase → Define exact incompatible pairs list, plan validation logic, design warning UI component
**Estimated Effort**: 2-3 hours implementation + 1 hour testing
**Dependencies**: Requires taxonomy.py TAXONOMY_HIERARCHY and existing group-by infrastructure (006-below-the-filter)
