# Research: Reduce Attribute Button Height

## Current Implementation Analysis

### Existing Button Structure
- **Component**: `TermSelector.tsx` (line 119-130)
- **Current CSS Classes**: `px-3 py-1.5 text-sm font-medium rounded-full`
- **Framework**: Tailwind CSS with React
- **Current Padding**: `py-1.5` (6px top/bottom = 12px total vertical padding)

### Button Height Calculation
- **Decision**: Current buttons use `py-1.5` (12px vertical padding) + text height
- **Target Reduction**: 25-30% height reduction per clarifications
- **New Padding**: `py-1` (8px vertical padding) achieves ~33% padding reduction
- **Rationale**: Maintains readability while providing significant space savings

### Responsive Design Research
- **Decision**: Apply reduction consistently across all devices
- **Current Implementation**: Uses Tailwind responsive classes
- **Approach**: Single height reduction class that works on all screen sizes
- **Rationale**: Clarification specified "all devices including mobile"

### Text Overflow Handling
- **Decision**: Implement tooltip on hover/focus for truncated text
- **Current Text Handling**: Uses `break-words` class for text wrapping
- **Required Addition**: Tooltip component for accessibility
- **Rationale**: Clarification specified "show full text on hover/tooltip"

### Accessibility Considerations
- **Decision**: Maintain minimum 44px touch target for mobile
- **Current Approach**: Uses adequate padding and margin
- **Validation**: Need to verify reduced buttons still meet WCAG standards
- **Rationale**: Must preserve accessibility while reducing visual height

## Technical Decisions

### CSS Approach
- **Decision**: Modify Tailwind padding classes from `py-1.5` to `py-1`
- **Rationale**: Clean, maintainable, and consistent with existing codebase
- **Alternatives considered**: Custom CSS (rejected - inconsistent with Tailwind pattern)

### Tooltip Implementation
- **Decision**: Add tooltip wrapper component for text overflow
- **Implementation**: React component with hover/focus states
- **Rationale**: Provides accessible text overflow solution
- **Alternatives considered**: CSS-only tooltips (rejected - limited accessibility)

### Cross-Component Consistency
- **Decision**: Update all attribute button instances across wizard
- **Scope**: TermSelector component used throughout wizard
- **Rationale**: Ensures visual consistency per requirements
- **Alternatives considered**: Component-specific changes (rejected - inconsistent UX)

### Testing Strategy
- **Decision**: Visual regression tests + accessibility tests
- **Framework**: React Testing Library for component testing
- **Validation**: Manual testing across screen sizes
- **Rationale**: Ensures functionality and accessibility preservation

## Implementation Approach

### Phase 1: Core Button Styling
1. Update `TermSelector.tsx` padding from `py-1.5` to `py-1`
2. Test height reduction meets 25-30% target
3. Verify visual consistency across wizard pages

### Phase 2: Tooltip Integration
1. Create reusable tooltip component
2. Integrate with button text overflow detection
3. Ensure keyboard and screen reader accessibility

### Phase 3: Cross-Device Validation
1. Test on mobile, tablet, and desktop breakpoints
2. Validate touch target sizes remain adequate
3. Verify text readability at reduced heights