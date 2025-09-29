# Integration Guide: Group By Toolbar

**Task**: T011 - Wire GroupByFilter into wizard flow  
**Status**: Ready for integration

## Quick Start

The GroupByFilter and enhanced TermSelector are fully implemented and tested. To integrate them into your wizard:

### Step 1: Import the Components

```tsx
import { GroupByFilter } from '../components/GroupByFilter';
import { useGroupByFilter } from '../hooks/useGroupByFilter';
```

### Step 2: Use the Hook

```tsx
function YourWizardStep() {
  const { groupByMethod } = useGroupByFilter();
  
  // ... rest of your component
}
```

### Step 3: Add GroupByFilter to Layout

Place the `<GroupByFilter />` component **below** the FrequencyFilter and **above** the TermSelector:

```tsx
<div>
  {/* Existing frequency filter */}
  <FrequencyFilter terms={allTerms} />
  
  {/* NEW: Add Group By toolbar */}
  <GroupByFilter />
  
  {/* Existing term selector - add groupByMethod prop */}
  <TermSelector
    terms={filteredTerms}
    onSelect={handleSelect}
    selected={selectedTerms}
    multi={true}
    onNext={handleNext}
    onSkip={handleSkip}
    groupByMethod={groupByMethod}  {/* NEW: Add this prop */}
  />
</div>
```

## Complete Integration Example

Here's a complete example showing how to integrate both filters:

```tsx
import React, { useState } from 'react';
import { FrequencyFilter } from '../components/FrequencyFilter';
import { GroupByFilter } from '../components/GroupByFilter';
import { TermSelector } from '../components/TermSelector';
import { useGroupByFilter } from '../hooks/useGroupByFilter';
import { useFrequencyFilter } from '../hooks/useFrequencyFilter';

function MoodStep() {
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  
  // Use both filter hooks
  const { groupByMethod } = useGroupByFilter();
  const { filterTerms } = useFrequencyFilter();
  
  // All available mood terms
  const allMoodTerms = [
    'joyful', 'peaceful', 'happy', 'upbeat', 'calm', 
    'melancholic', 'uplifting', 'serene', /* ... more terms */
  ];
  
  // Apply frequency filter
  const filteredTerms = filterTerms(allMoodTerms);
  
  const handleSelect = (terms: string | string[]) => {
    setSelectedTerms(terms as string[]);
  };
  
  const handleNext = () => {
    // Proceed to next step
    console.log('Selected mood terms:', selectedTerms);
  };
  
  const handleSkip = () => {
    // Skip this step
    console.log('Skipped mood selection');
  };
  
  return (
    <div className="wizard-step">
      <h2>Select Mood Terms</h2>
      
      {/* Frequency Filter Toolbar */}
      <FrequencyFilter terms={allMoodTerms} />
      
      {/* Group By Toolbar */}
      <GroupByFilter />
      
      {/* Term Selector with Grouping */}
      <TermSelector
        terms={filteredTerms}
        onSelect={handleSelect}
        selected={selectedTerms}
        multi={true}
        onNext={handleNext}
        onSkip={handleSkip}
        groupByMethod={groupByMethod}
      />
    </div>
  );
}

export default MoodStep;
```

## Integration Checklist

- [ ] Import `GroupByFilter` and `useGroupByFilter`
- [ ] Call `useGroupByFilter()` hook in component
- [ ] Add `<GroupByFilter />` below FrequencyFilter
- [ ] Add `groupByMethod` prop to TermSelector
- [ ] Test in browser - verify toolbar appears
- [ ] Test clicking Category/Popularity - verify terms regroup
- [ ] Test term selection - verify it works across grouping changes
- [ ] Test page reload - verify preference persists

## Expected Behavior

### Default State (Category Grouping)
```
┌─────────────────────────────────────────┐
│ Filter by Popularity: [All] [Ubiq] ... │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Group By: [Category✓] [Popularity]     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Mood                                    │
│ [joyful] [peaceful] [happy] ...         │
│ ─────────────────────────────────────   │
│ Energy                                  │
│ [high-energy] [driving] ...             │
│ ─────────────────────────────────────   │
│ Texture                                 │
│ [bright] [warm] ...                     │
└─────────────────────────────────────────┘
```

### After Clicking "Popularity"
```
┌─────────────────────────────────────────┐
│ Filter by Popularity: [All] [Ubiq] ... │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Group By: [Category] [Popularity✓]     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Ubiquitous                              │
│ [joyful] [peaceful] [high-energy] ...   │
│ ─────────────────────────────────────   │
│ Frequent                                │
│ [happy] [uplifting] [driving] ...       │
│ ─────────────────────────────────────   │
│ Infrequent                              │
│ [euphoric] ...                          │
│ ─────────────────────────────────────   │
│ Rare                                    │
│ [sparkly-mood] ...                      │
└─────────────────────────────────────────┘
```

## Styling Verification

The GroupByFilter should match FrequencyFilter **exactly**:

### Container
- Same background color (gray-50/gray-800)
- Same padding (p-2)
- Same border radius (rounded-lg)
- Same spacing (mb-4, gap-1)

### Label
- Text size: 12px (text-[12px])
- Color: gray-600/gray-400
- Font weight: medium

### Buttons
- Size: px-[4px] py-[2px] text-[10px]
- Selected: blue-600/blue-500 background, white text, shadow
- Unselected: white/gray-700 background, border, hover states

## Troubleshooting

### GroupByFilter not appearing
- Check that you imported both the component and the hook
- Verify the component is rendered in the JSX
- Check browser console for errors

### Terms not regrouping when clicking buttons
- Verify `groupByMethod` prop is passed to TermSelector
- Check that the hook is being called correctly
- Inspect localStorage to see if preference is saving

### Styling doesn't match FrequencyFilter
- Verify you're using the exact same Tailwind classes
- Check for any custom CSS that might be overriding
- Test in both light and dark modes

### Selected terms disappear when switching grouping
- This is incorrect behavior - selections should persist
- Check that the `selected` prop is being maintained in parent state
- Verify the TermSelector's renderTermButton function is using the correct selection logic

## Testing in Browser

1. **Start dev server**:
   ```bash
   cd wizard
   npm run dev
   ```

2. **Navigate to the wizard step** with terms

3. **Verify default state**:
   - GroupByFilter should show "Category" as selected
   - Terms should be grouped by Mood/Energy/Texture

4. **Click "Popularity"**:
   - Button should highlight
   - Terms should reorganize into frequency groups

5. **Select some terms**, then switch grouping:
   - Selected terms should remain selected
   - Only visual organization should change

6. **Reload the page**:
   - Grouping preference should be remembered
   - Selected terms may reset (depends on wizard state management)

## Performance Notes

- Grouping operations are O(n) where n = number of terms
- Target: <50ms for 100+ terms (measured in tests)
- Uses Set lookups for O(1) category inference
- Memoization not required for typical term counts

## Accessibility Notes

- Both buttons have `aria-pressed` state
- Toolbar has `role="group"` and `aria-label="Group by method"`
- Keyboard navigation works (Tab, Enter, Space)
- Screen readers announce button states correctly

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2022+ features
- localStorage API required (graceful fallback if unavailable)

---

**Ready to integrate?** Follow the steps above and refer to the complete example.  
**Questions?** Check IMPLEMENTATION_SUMMARY.md for architectural details.  
**Issues?** All components have comprehensive test coverage - check test files for expected behavior.
