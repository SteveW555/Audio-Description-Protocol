# Data Model: Reduce Attribute Button Height

## UI Component Entities

### AttributeButton
**Description**: Individual selectable button component for attribute selection

**Properties**:
- `text`: string - The attribute label text
- `isSelected`: boolean - Selection state of the button
- `isDisabled`: boolean - Whether button is interactive
- `onClick`: function - Click handler for selection
- `className`: string - CSS classes including height styles

**States**:
- Default: Normal unselected state with reduced height
- Selected: Active state with visual feedback
- Hover: Interactive feedback state
- Disabled: Non-interactive state

**Height Styling**:
- Previous: `py-1.5` (12px vertical padding)
- New: `py-1` (8px vertical padding)
- Reduction: ~33% padding reduction

### TooltipWrapper
**Description**: Accessibility wrapper for text overflow handling

**Properties**:
- `content`: string - Full text content for tooltip
- `showTooltip`: boolean - Whether tooltip should be displayed
- `children`: ReactNode - Wrapped button component
- `position`: 'top' | 'bottom' - Tooltip positioning

**Behavior**:
- Shows on hover for mouse users
- Shows on focus for keyboard users
- Hidden by default
- Accessible to screen readers

### TermSelector
**Description**: Container component managing multiple attribute buttons

**Properties**:
- `terms`: string[] - List of available attribute terms
- `selected`: string | string[] - Currently selected terms
- `multi`: boolean - Whether multiple selection is allowed
- `heightStyle`: 'reduced' | 'normal' - Button height variant

**Layout Changes**:
- Container maintains same spacing
- Buttons use reduced height consistently
- Grid layout accommodates more buttons per row

## Style System

### CSS Classes
**Existing Button Classes**:
```css
px-3 py-1.5 text-sm font-medium rounded-full
```

**New Button Classes**:
```css
px-3 py-1 text-sm font-medium rounded-full
```

**Tooltip Classes**:
```css
/* Tooltip container */
relative inline-block

/* Tooltip content */
absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded-md
```

### Responsive Behavior
- All breakpoints use same reduced height
- Touch targets remain accessible on mobile
- Text remains readable at all screen sizes

## Validation Rules

### Height Requirements
- Button height reduction: 25-30% of original
- Minimum touch target: 44px (including margins)
- Text must remain readable

### Accessibility Requirements
- Tooltip content must be accessible to screen readers
- Focus indicators must remain visible
- Color contrast must meet WCAG standards

### Consistency Requirements
- All attribute buttons use same height reduction
- Visual styling remains consistent across wizard pages
- Hover/focus states maintain same behavior patterns