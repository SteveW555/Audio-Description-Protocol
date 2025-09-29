# Quickstart: Reduce Attribute Button Height

## Quick Test Setup

### 1. Visual Verification
```bash
# Navigate to wizard directory
cd wizard/src

# Start development server
npm run dev

# Navigate to any wizard page with attribute buttons
# Example: Musical Analysis or Semantic Attributes forms
```

### 2. Height Measurement Test
```javascript
// Browser console test
const buttons = document.querySelectorAll('[class*="py-1"]');
buttons.forEach(btn => {
  console.log('Button height:', btn.offsetHeight + 'px');
  console.log('Button classes:', btn.className);
});
```

### 3. Mobile Responsiveness Test
```bash
# Open browser dev tools
# Set device emulation to:
# - iPhone SE (375px width)
# - iPad (768px width)
# - Desktop (1024px+ width)
# Verify buttons maintain reduced height across all sizes
```

## Acceptance Test Scenarios

### Scenario 1: Height Reduction Verification
**Given** the wizard page loads with attribute buttons
**When** I measure button heights
**Then** buttons should be 25-30% shorter than original
**And** padding should be `py-1` instead of `py-1.5`

**Test Steps**:
1. Open wizard page with attribute buttons
2. Inspect button elements
3. Verify CSS class contains `py-1`
4. Measure actual height reduction

### Scenario 2: Text Overflow Handling
**Given** attribute buttons with long text labels
**When** text doesn't fit in reduced height
**Then** tooltip should appear on hover/focus
**And** full text should be readable in tooltip

**Test Steps**:
1. Find button with long text label
2. Hover over button
3. Verify tooltip appears with full text
4. Test keyboard focus accessibility

### Scenario 3: Cross-Device Consistency
**Given** the wizard interface on different screen sizes
**When** I view attribute buttons on mobile, tablet, and desktop
**Then** all buttons should use the same reduced height
**And** touch targets should remain accessible

**Test Steps**:
1. Load wizard on mobile device/emulation
2. Load wizard on tablet device/emulation
3. Load wizard on desktop
4. Verify consistent button heights
5. Test touch interaction on mobile

### Scenario 4: Accessibility Preservation
**Given** reduced height attribute buttons
**When** I use keyboard navigation
**Then** buttons should remain focusable and accessible
**And** screen readers should announce button content correctly

**Test Steps**:
1. Navigate buttons using Tab key
2. Verify focus indicators are visible
3. Test with screen reader
4. Verify ARIA attributes intact

## Quick Performance Check

### Visual Density Improvement
```javascript
// Count visible buttons test
const container = document.querySelector('[class*="max-h-80"]');
const buttons = container.querySelectorAll('button');
const containerHeight = container.offsetHeight;
const visibleButtons = Array.from(buttons).filter(btn => {
  const rect = btn.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return rect.top >= containerRect.top && rect.bottom <= containerRect.bottom;
});
console.log('Visible buttons:', visibleButtons.length);
```

### Expected Results
- **Height Reduction**: 25-30% shorter buttons
- **Increased Density**: More buttons visible without scrolling
- **Maintained Usability**: All interactions work correctly
- **Cross-Device**: Consistent appearance on all screen sizes
- **Accessibility**: No degradation in keyboard or screen reader access

## Rollback Plan
If issues are discovered:
1. Revert CSS changes: `py-1` → `py-1.5`
2. Remove tooltip implementation
3. Test original functionality
4. Investigate and fix issues before re-implementation