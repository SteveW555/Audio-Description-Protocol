# Quickstart Guide: Group By Toolbar Integration Tests

**Feature**: 006-below-the-filter
**Date**: 2025-09-29
**Status**: Complete

## Overview

This document defines end-to-end integration test scenarios for the Group By toolbar feature. These scenarios validate the complete user workflow from UI interaction to state persistence, ensuring all functional requirements are met.

---

## Test Environment Setup

### Prerequisites
```bash
# From repository root
cd wizard
npm install
```

### Test Execution
```bash
# Run all integration tests
npm test -- groupby-workflow.test.tsx

# Run with coverage
npm test -- --coverage groupby-workflow.test.tsx

# Watch mode for development
npm test -- --watch groupby-workflow.test.tsx
```

### Test Dependencies
- Jest 29.7+ (test runner)
- @testing-library/react (component testing)
- @testing-library/user-event (user interaction simulation)
- localStorage mock (browser API simulation)

---

## Integration Scenario 1: Category Grouping Selection

**User Story**: User switches to Category grouping to view terms organized by semantic meaning

**Test File**: `wizard/__tests__/integration/groupby-workflow.test.tsx`

**Test Name**: `'User selects Category grouping - terms reorganize by Mood/Energy/Texture'`

### Setup
```typescript
describe('Scenario 1: Category Grouping', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => null);
    Storage.prototype.setItem = jest.fn();
    
    // Render wizard with term selector and both filters
    render(
      <WizardStep>
        <FrequencyFilter />
        <GroupByFilter />
        <TermSelector terms={mockTerms} />
      </WizardStep>
    );
  });
  
  const mockTerms = [
    { value: 'joyful', label: 'Joyful' },         // Mood
    { value: 'high-energy', label: 'High Energy' }, // Energy
    { value: 'bright', label: 'Bright' },         // Texture
    // ... 100+ terms across categories
  ];
});
```

### Execution Steps
```typescript
test('User selects Category grouping - terms reorganize by Mood/Energy/Texture', async () => {
  const user = userEvent.setup();
  
  // Step 1: Initial state defaults to Category
  const categoryButton = screen.getByRole('button', { name: /category/i });
  expect(categoryButton).toHaveAttribute('aria-pressed', 'true');
  
  // Step 2: Verify 3 groups rendered with correct labels
  expect(screen.getByText('Mood')).toBeInTheDocument();
  expect(screen.getByText('Energy')).toBeInTheDocument();
  expect(screen.getByText('Texture')).toBeInTheDocument();
  
  // Step 3: Verify terms appear in correct groups
  const moodGroup = screen.getByText('Mood').parentElement;
  within(moodGroup!).getByText('Joyful'); // Should be in Mood group
  
  const energyGroup = screen.getByText('Energy').parentElement;
  within(energyGroup!).getByText('High Energy'); // Should be in Energy group
  
  const textureGroup = screen.getByText('Texture').parentElement;
  within(textureGroup!).getByText('Bright'); // Should be in Texture group
  
  // Step 4: Verify visual separators present (3 groups = 2 separators)
  const separators = screen.getAllByTestId('group-separator');
  expect(separators).toHaveLength(2); // Between Mood-Energy and Energy-Texture
  
  // Step 5: Verify group order (Mood → Energy → Texture per spec FR-006)
  const labels = screen.getAllByTestId('group-label');
  expect(labels[0]).toHaveTextContent('Mood');
  expect(labels[1]).toHaveTextContent('Energy');
  expect(labels[2]).toHaveTextContent('Texture');
});
```

### Assertions
- ✅ Category button shows `aria-pressed="true"`
- ✅ Exactly 3 groups rendered (Mood, Energy, Texture)
- ✅ Group labels displayed with `text-[10px]` styling
- ✅ Terms correctly assigned to semantic categories
- ✅ Visual separators appear between groups (2 separators for 3 groups)
- ✅ Group order matches spec (Mood → Energy → Texture)

### Success Criteria
**PASS** if all assertions succeed and no console errors occur

---

## Integration Scenario 2: Popularity Grouping Selection

**User Story**: User switches to Popularity grouping to view terms organized by frequency level

**Test File**: `wizard/__tests__/integration/groupby-workflow.test.tsx`

**Test Name**: `'User switches to Popularity grouping - terms reorganize by frequency'`

### Setup
```typescript
// Same setup as Scenario 1
const mockTerms = [
  { value: 'upbeat', label: 'Upbeat' },           // Ubiquitous
  { value: 'happy', label: 'Happy' },             // Frequent
  { value: 'euphoric', label: 'Euphoric' },       // Infrequent
  { value: 'gossamer-mood', label: 'Gossamer' },  // Rare
  // ... 100+ terms across frequency levels
];
```

### Execution Steps
```typescript
test('User switches to Popularity grouping - terms reorganize by frequency', async () => {
  const user = userEvent.setup();
  
  // Step 1: Start with Category grouping active
  expect(screen.getByRole('button', { name: /category/i }))
    .toHaveAttribute('aria-pressed', 'true');
  
  // Step 2: Click Popularity button
  const popularityButton = screen.getByRole('button', { name: /popularity/i });
  await user.click(popularityButton);
  
  // Step 3: Verify Popularity button now active
  expect(popularityButton).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: /category/i }))
    .toHaveAttribute('aria-pressed', 'false');
  
  // Step 4: Verify up to 4 groups rendered with correct labels
  expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
  expect(screen.getByText('Frequent')).toBeInTheDocument();
  expect(screen.getByText('Infrequent')).toBeInTheDocument();
  expect(screen.getByText('Rare')).toBeInTheDocument();
  
  // Step 5: Verify terms appear in correct frequency groups
  const ubiquitousGroup = screen.getByText('Ubiquitous').parentElement;
  within(ubiquitousGroup!).getByText('Upbeat'); // Should be ubiquitous
  
  const frequentGroup = screen.getByText('Frequent').parentElement;
  within(frequentGroup!).getByText('Happy'); // Should be frequent
  
  const infrequentGroup = screen.getByText('Infrequent').parentElement;
  within(infrequentGroup!).getByText('Euphoric'); // Should be infrequent
  
  const rareGroup = screen.getByText('Rare').parentElement;
  within(rareGroup!).getByText('Gossamer'); // Should be rare
  
  // Step 6: Verify group order (Ubiq → Freq → Infreq → Rare per spec FR-007)
  const labels = screen.getAllByTestId('group-label');
  expect(labels[0]).toHaveTextContent('Ubiquitous');
  expect(labels[1]).toHaveTextContent('Frequent');
  expect(labels[2]).toHaveTextContent('Infrequent');
  expect(labels[3]).toHaveTextContent('Rare');
  
  // Step 7: Verify localStorage save triggered
  expect(localStorage.setItem).toHaveBeenCalledWith(
    'adp-wizard-groupBy-v1',
    JSON.stringify({ method: 'popularity', version: 1 })
  );
});
```

### Assertions
- ✅ Popularity button shows `aria-pressed="true"` after click
- ✅ Category button shows `aria-pressed="false"` after switch
- ✅ Up to 4 groups rendered (Ubiquitous, Frequent, Infrequent, Rare)
- ✅ Terms correctly assigned to frequency levels
- ✅ Group order matches spec (Ubiquitous → Frequent → Infrequent → Rare)
- ✅ localStorage.setItem called with correct data

### Success Criteria
**PASS** if all assertions succeed and state transition completes in <50ms

---

## Integration Scenario 3: Grouping Preference Persistence

**User Story**: User's grouping preference persists across browser sessions

**Test File**: `wizard/__tests__/integration/groupby-workflow.test.tsx`

**Test Name**: `'Grouping preference persists across page reload'`

### Setup
```typescript
describe('Scenario 3: Persistence', () => {
  test('Grouping preference persists across page reload', async () => {
    const user = userEvent.setup();
    
    // Mock localStorage with stored preference
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'adp-wizard-groupBy-v1') {
        return JSON.stringify({ method: 'popularity', version: 1 });
      }
      return null;
    });
    
    // ... test continues
  });
});
```

### Execution Steps
```typescript
test('Grouping preference persists across page reload', async () => {
  const user = userEvent.setup();
  
  // Step 1: Simulate first visit - user selects Popularity
  const { unmount } = render(<WizardWithGroupBy />);
  
  const popularityButton = screen.getByRole('button', { name: /popularity/i });
  await user.click(popularityButton);
  
  // Verify save occurred
  expect(localStorage.setItem).toHaveBeenCalledWith(
    'adp-wizard-groupBy-v1',
    JSON.stringify({ method: 'popularity', version: 1 })
  );
  
  // Step 2: Unmount component (simulate page unload)
  unmount();
  
  // Step 3: Mock localStorage.getItem to return saved state
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'adp-wizard-groupBy-v1') {
      return JSON.stringify({ method: 'popularity', version: 1 });
    }
    return null;
  });
  
  // Step 4: Re-mount component (simulate page reload)
  render(<WizardWithGroupBy />);
  
  // Step 5: Verify Popularity grouping restored
  const restoredButton = screen.getByRole('button', { name: /popularity/i });
  expect(restoredButton).toHaveAttribute('aria-pressed', 'true');
  
  // Step 6: Verify terms grouped by Popularity
  expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
  expect(screen.getByText('Frequent')).toBeInTheDocument();
  
  // Step 7: Verify localStorage.getItem was called
  expect(localStorage.getItem).toHaveBeenCalledWith('adp-wizard-groupBy-v1');
});
```

### Assertions
- ✅ localStorage.setItem called on preference change
- ✅ localStorage.getItem called on component mount
- ✅ Preference restored correctly after remount
- ✅ Grouping method matches stored value
- ✅ Terms display in correct groups after restoration

### Success Criteria
**PASS** if preference persists and restoration completes without errors (spec FR-014)

---

## Integration Scenario 4: Term Selection Independence

**User Story**: Term selections persist when user switches grouping methods

**Test File**: `wizard/__tests__/integration/groupby-workflow.test.tsx`

**Test Name**: `'Term selection preserved when switching between grouping methods'`

### Setup
```typescript
// Same setup with selectable terms
const mockTerms = [
  { value: 'joyful', label: 'Joyful' },
  { value: 'high-energy', label: 'High Energy' },
  { value: 'bright', label: 'Bright' },
];
```

### Execution Steps
```typescript
test('Term selection preserved when switching between grouping methods', async () => {
  const user = userEvent.setup();
  
  render(<WizardWithGroupBy />);
  
  // Step 1: Select 3 terms while in Category grouping
  const joyfulButton = screen.getByRole('button', { name: /joyful/i });
  const energyButton = screen.getByRole('button', { name: /high energy/i });
  const brightButton = screen.getByRole('button', { name: /bright/i });
  
  await user.click(joyfulButton);
  await user.click(energyButton);
  await user.click(brightButton);
  
  // Verify selections (visual indicator: blue background)
  expect(joyfulButton).toHaveClass('bg-blue-600');
  expect(energyButton).toHaveClass('bg-blue-600');
  expect(brightButton).toHaveClass('bg-blue-600');
  
  // Step 2: Switch to Popularity grouping
  const popularityButton = screen.getByRole('button', { name: /popularity/i });
  await user.click(popularityButton);
  
  // Step 3: Verify terms reorganized into new groups
  expect(screen.queryByText('Mood')).not.toBeInTheDocument();
  expect(screen.getByText('Ubiquitous')).toBeInTheDocument(); // New grouping
  
  // Step 4: Verify all 3 selections still active (spec FR-011)
  const joyfulAfter = screen.getByRole('button', { name: /joyful/i });
  const energyAfter = screen.getByRole('button', { name: /high energy/i });
  const brightAfter = screen.getByRole('button', { name: /bright/i });
  
  expect(joyfulAfter).toHaveClass('bg-blue-600'); // Still selected
  expect(energyAfter).toHaveClass('bg-blue-600'); // Still selected
  expect(brightAfter).toHaveClass('bg-blue-600'); // Still selected
  
  // Step 5: Switch back to Category grouping
  const categoryButton = screen.getByRole('button', { name: /category/i });
  await user.click(categoryButton);
  
  // Step 6: Verify selections still preserved
  const joyfulFinal = screen.getByRole('button', { name: /joyful/i });
  const energyFinal = screen.getByRole('button', { name: /high energy/i });
  const brightFinal = screen.getByRole('button', { name: /bright/i });
  
  expect(joyfulFinal).toHaveClass('bg-blue-600'); // Still selected
  expect(energyFinal).toHaveClass('bg-blue-600'); // Still selected
  expect(brightFinal).toHaveClass('bg-blue-600'); // Still selected
});
```

### Assertions
- ✅ Terms selectable in Category grouping
- ✅ Selections preserved after switching to Popularity
- ✅ Terms reorganized visually but selection state unchanged
- ✅ Selections preserved after switching back to Category
- ✅ No glitches or flickering during transitions

### Success Criteria
**PASS** if selection state remains stable across all grouping switches (spec FR-011)

---

## Integration Scenario 5: Frequency Filter + Grouping Combination

**User Story**: Grouping respects active frequency filter

**Test File**: `wizard/__tests__/integration/groupby-workflow.test.tsx`

**Test Name**: `'Grouped terms respect active frequency filter'`

### Setup
```typescript
const mockTerms = [
  { value: 'upbeat', label: 'Upbeat' },           // Mood + Ubiquitous
  { value: 'joyful', label: 'Joyful' },           // Mood + Ubiquitous
  { value: 'happy', label: 'Happy' },             // Mood + Frequent
  { value: 'high-energy', label: 'High Energy' }, // Energy + Ubiquitous
  { value: 'euphoric', label: 'Euphoric' },       // Mood + Infrequent
];
```

### Execution Steps
```typescript
test('Grouped terms respect active frequency filter', async () => {
  const user = userEvent.setup();
  
  render(<WizardWithFilters />);
  
  // Step 1: Initial state - all terms visible in Category groups
  expect(screen.getByText('Upbeat')).toBeInTheDocument();
  expect(screen.getByText('Happy')).toBeInTheDocument();
  expect(screen.getByText('Euphoric')).toBeInTheDocument();
  
  // Step 2: Activate "Ubiquitous" frequency filter
  const ubiquitousFilter = screen.getByRole('button', { name: /ubiquitous/i });
  await user.click(ubiquitousFilter);
  
  // Step 3: Verify only ubiquitous terms visible
  expect(screen.getByText('Upbeat')).toBeInTheDocument();      // Ubiquitous
  expect(screen.getByText('Joyful')).toBeInTheDocument();      // Ubiquitous
  expect(screen.getByText('High Energy')).toBeInTheDocument(); // Ubiquitous
  expect(screen.queryByText('Happy')).not.toBeInTheDocument();    // Frequent (filtered out)
  expect(screen.queryByText('Euphoric')).not.toBeInTheDocument(); // Infrequent (filtered out)
  
  // Step 4: Verify Category grouping still active (Mood + Energy groups)
  expect(screen.getByText('Mood')).toBeInTheDocument();
  expect(screen.getByText('Energy')).toBeInTheDocument();
  
  // Step 5: Switch to Popularity grouping
  const popularityButton = screen.getByRole('button', { name: /popularity/i });
  await user.click(popularityButton);
  
  // Step 6: Verify only "Ubiquitous" group visible (other frequency groups empty)
  expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
  expect(screen.queryByText('Frequent')).not.toBeInTheDocument();   // Empty group (filtered)
  expect(screen.queryByText('Infrequent')).not.toBeInTheDocument(); // Empty group (filtered)
  expect(screen.queryByText('Rare')).not.toBeInTheDocument();       // Empty group (filtered)
  
  // Step 7: Same 3 terms still visible
  expect(screen.getByText('Upbeat')).toBeInTheDocument();
  expect(screen.getByText('Joyful')).toBeInTheDocument();
  expect(screen.getByText('High Energy')).toBeInTheDocument();
});
```

### Assertions
- ✅ Frequency filter removes terms from all groups
- ✅ Category grouping shows only non-empty groups
- ✅ Popularity grouping shows only non-empty groups
- ✅ Filtered terms never appear regardless of grouping method
- ✅ Empty groups automatically hidden (spec FR-012)

### Success Criteria
**PASS** if frequency filter and grouping interact correctly without conflicts

---

## Edge Case Scenario 1: Terms Without Metadata

**Test Name**: `'Terms without category or frequency metadata appear ungrouped at end'`

### Setup
```typescript
const mockTerms = [
  { value: 'joyful', label: 'Joyful' },           // Has metadata
  { value: 'unknown-term-1', label: 'Unknown 1' }, // No metadata
  { value: 'high-energy', label: 'High Energy' }, // Has metadata
  { value: 'unknown-term-2', label: 'Unknown 2' }, // No metadata
];
```

### Execution Steps
```typescript
test('Terms without metadata appear ungrouped at end', async () => {
  render(<WizardWithGroupBy />);
  
  // Step 1: Verify grouped terms appear first
  const groups = screen.getAllByTestId('group-label');
  expect(groups[0]).toHaveTextContent('Mood');
  expect(groups[1]).toHaveTextContent('Energy');
  
  // Step 2: Verify ungrouped terms appear after all groups
  const allButtons = screen.getAllByRole('button', { name: /term/i });
  const unknown1Index = allButtons.findIndex(btn => btn.textContent === 'Unknown 1');
  const unknown2Index = allButtons.findIndex(btn => btn.textContent === 'Unknown 2');
  const lastGroupedIndex = allButtons.findIndex(btn => btn.textContent === 'High Energy');
  
  expect(unknown1Index).toBeGreaterThan(lastGroupedIndex);
  expect(unknown2Index).toBeGreaterThan(lastGroupedIndex);
  
  // Step 3: Verify no group label for ungrouped terms (spec line 61)
  const lastLabel = groups[groups.length - 1];
  expect(lastLabel.nextSibling?.textContent).not.toContain('Unknown');
});
```

### Assertions
- ✅ Terms with metadata grouped normally
- ✅ Terms without metadata appear after all groups
- ✅ No group label displayed for ungrouped terms
- ✅ Ungrouped terms still selectable and functional

---

## Edge Case Scenario 2: Single Category After Filtering

**Test Name**: `'Single group remaining after frequency filter displays correctly'`

### Execution Steps
```typescript
test('Single group remaining after frequency filter displays correctly', async () => {
  const user = userEvent.setup();
  
  // Mock terms - all Mood, mixed frequencies
  const mockTerms = [
    { value: 'upbeat', label: 'Upbeat' },     // Mood + Ubiquitous
    { value: 'joyful', label: 'Joyful' },     // Mood + Ubiquitous
    { value: 'happy', label: 'Happy' },       // Mood + Frequent
  ];
  
  render(<WizardWithFilters terms={mockTerms} />);
  
  // Step 1: Activate "Ubiquitous" frequency filter
  await user.click(screen.getByRole('button', { name: /ubiquitous/i }));
  
  // Step 2: Verify only Mood group visible (Energy and Texture empty)
  expect(screen.getByText('Mood')).toBeInTheDocument();
  expect(screen.queryByText('Energy')).not.toBeInTheDocument();
  expect(screen.queryByText('Texture')).not.toBeInTheDocument();
  
  // Step 3: Verify single group still has label (consistent UX)
  expect(screen.getByTestId('group-label')).toHaveTextContent('Mood');
  
  // Step 4: Verify no separator before first group
  expect(screen.queryByTestId('group-separator')).not.toBeInTheDocument();
});
```

---

## Edge Case Scenario 3: Empty Term List

**Test Name**: `'Empty term list after filtering displays gracefully'`

### Execution Steps
```typescript
test('Empty term list after filtering displays gracefully', async () => {
  const user = userEvent.setup();
  
  render(<WizardWithFilters terms={mockTerms} />);
  
  // Step 1: Activate rare + rare filters (impossible combination)
  await user.click(screen.getByRole('button', { name: /rare/i }));
  
  // Manually set terms to empty array via state
  // (or use mocked filter that returns no results)
  
  // Step 2: Verify no groups rendered
  expect(screen.queryByTestId('group-label')).not.toBeInTheDocument();
  expect(screen.queryByTestId('group-separator')).not.toBeInTheDocument();
  
  // Step 3: Verify empty state message (if implemented)
  expect(screen.getByText(/no terms available/i)).toBeInTheDocument();
});
```

---

## Performance Benchmarks

### Grouping Operation Performance
```typescript
test('Grouping operation completes in <50ms for 100 terms', () => {
  const mockTerms = generateMockTerms(100);
  
  const startTime = performance.now();
  const grouped = groupTermsByCategory(mockTerms);
  const duration = performance.now() - startTime;
  
  expect(duration).toBeLessThan(50); // Spec requirement
  expect(grouped.length).toBeGreaterThan(0);
});
```

### Rendering Performance
```typescript
test('Re-render after grouping switch completes in <16ms', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<WizardWithGroupBy />);
  
  const startTime = performance.now();
  await user.click(screen.getByRole('button', { name: /popularity/i }));
  const duration = performance.now() - startTime;
  
  expect(duration).toBeLessThan(16); // 60fps target
});
```

---

## Accessibility Validation

### ARIA Attributes
```typescript
test('GroupByFilter has proper ARIA attributes', () => {
  render(<GroupByFilter />);
  
  const toolbar = screen.getByRole('group');
  expect(toolbar).toHaveAttribute('aria-label', 'Group by filter');
  
  const categoryBtn = screen.getByRole('button', { name: /category/i });
  expect(categoryBtn).toHaveAttribute('aria-pressed');
  
  const popularityBtn = screen.getByRole('button', { name: /popularity/i });
  expect(popularityBtn).toHaveAttribute('aria-pressed');
});
```

### Keyboard Navigation
```typescript
test('Keyboard navigation works across grouped terms', async () => {
  const user = userEvent.setup();
  render(<WizardWithGroupBy />);
  
  // Tab through toolbar buttons
  await user.tab();
  expect(screen.getByRole('button', { name: /category/i })).toHaveFocus();
  
  await user.tab();
  expect(screen.getByRole('button', { name: /popularity/i })).toHaveFocus();
  
  // Enter key toggles grouping
  await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: /popularity/i }))
    .toHaveAttribute('aria-pressed', 'true');
});
```

---

## Test Execution Summary

### Coverage Requirements
- **Lines**: ≥90% for grouping logic, hooks, and components
- **Branches**: ≥85% for conditional rendering paths
- **Functions**: 100% for exported utilities

### CI/CD Integration
```bash
# Run in GitHub Actions / Jenkins
npm test -- --ci --coverage --maxWorkers=2
```

### Manual Validation Checklist
- [ ] Visual separators appear between groups (light gray, thin)
- [ ] Group labels display at 10px size
- [ ] Button styling matches FrequencyFilter exactly
- [ ] Dark mode styling correct for all elements
- [ ] No layout shift when switching grouping methods
- [ ] Smooth transitions (<16ms perceived)

---

**Quickstart Complete**: 2025-09-29
**Next Phase**: Task Generation (Phase 2 - already complete via tasks.md)
