# Quickstart: Frequency Filter Feature

**Feature**: Add Frequency Filter Toolbar
**Date**: 2025-01-29

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Running wizard development server

## Quick Test Steps

### 1. Start Development Server
```bash
cd wizard
npm install  # If dependencies not installed
npm run dev
```

### 2. Navigate to Wizard
Open browser to `http://localhost:3000` (or displayed port)

### 3. Test Filter Display
- Navigate to any step with terms
- Verify filter toolbar appears below Step label
- Verify filter is above term buttons
- Check all 5 options are visible: All, Ubiquitous, Frequent, Infrequent, Rare

### 4. Test Basic Filtering
- Click "Frequent" filter option
- ✓ Only frequent terms should be visible
- Click "All" filter option
- ✓ All terms should return

### 5. Test Empty State
- Click a filter option with no matching terms (e.g., "Rare" on a step with no rare terms)
- ✓ Filter button should be disabled
- ✓ Should show "No rare Available" label

### 6. Test Persistence
- Select "Ubiquitous" filter
- Navigate to next step
- ✓ Filter should still show "Ubiquitous" selected
- ✓ Only ubiquitous terms visible on new step

### 7. Test Multi-Select with Filter
- On a multi-select step, apply "Frequent" filter
- Select multiple frequent terms
- ✓ Selection should work normally
- Change filter to "All"
- ✓ Previous selections should remain

## Validation Checklist

- [ ] Filter toolbar renders on all steps with terms
- [ ] Filter positioned correctly (below label, above terms)
- [ ] All 5 filter options present
- [ ] Filtering works correctly for each option
- [ ] Empty categories show disabled state
- [ ] Filter persists across step navigation
- [ ] No modification to term button styling
- [ ] Dark mode theming works correctly
- [ ] Performance is instant (<100ms response)

## Edge Cases to Test

1. **Step with no terms**: Filter should not appear
2. **All terms same frequency**: Other filters disabled
3. **Terms without frequency**: Only appear in "All" filter
4. **Rapid filter switching**: No lag or glitches
5. **Browser refresh**: Filter resets to "All"

## Troubleshooting

### Filter not appearing
- Check console for errors
- Verify terms have frequency metadata
- Ensure FrequencyFilter component is imported

### Filter not persisting
- Check Zustand store is properly initialized
- Verify session storage is not blocked
- Check for store reset calls

### Terms not filtering
- Verify frequency metadata matches filter values
- Check filter logic in useFrequencyFilter hook
- Ensure filtered array is passed to TermSelector

## Success Criteria

✅ User can filter terms by frequency with single click
✅ Filter state persists during wizard session
✅ Empty states are clearly communicated
✅ No breaking changes to existing functionality
✅ Performance meets <100ms requirement

---
*If all checklist items pass, the feature is ready for production.*