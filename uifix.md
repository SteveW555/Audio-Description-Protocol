# UI Fix Report - Audio Description Protocol Wizard

## Problem Summary
The wizard interface lost its sophisticated dark theme styling from Session 8/9 and reverted to a plain black & white appearance. The React components were missing imports causing "React is not defined" errors, and the styling didn't match the reference design.

## Reference Design Target
The UI should match the reference image showing:
- Dark slate background (slate-900)
- Semi-transparent card containers (slate-700/50 or slate-800/50)
- Blue-bordered input fields (border-2 border-blue-500)
- Dark slate term buttons (bg-slate-700) with rounded corners
- Clean typography with proper spacing
- Blue accent colors for selected states and primary actions

## Root Issues Identified

### 1. React Import Issues
All components using JSX needed explicit React imports in Vite/React 17+.

### 2. Lost Session 8 Styling
The properly styled components exist in `wizard/app/src/` but the active components in `wizard/src/` had different/incorrect styling.

### 3. Dark Mode Not Applied
The HTML root element was missing the `class="dark"` attribute needed for Tailwind dark mode.

### 4. Wrong Color Palette
Components were using gray colors instead of slate colors, missing the sophisticated look.

## Complete Fix Steps Applied

### Step 1: Fix React Imports
Added `import React from 'react';` to all components:
- `wizard/src/App.tsx`
- `wizard/src/context/WizardContext.tsx`
- `wizard/src/components/WizardLayout.tsx`
- `wizard/src/components/AskStep.tsx`
- `wizard/src/components/FinalStep.tsx`
- `wizard/src/components/InstrumentationWizard.tsx`
- `wizard/src/components/JsonPreview.tsx`
- `wizard/src/components/TermSelector.tsx`
- `wizard/src/components/TextInputStep.tsx`
- `wizard/src/components/WizardStep.tsx`

### Step 2: Enable Dark Mode
**File:** `index.html`
```html
<!-- Changed from: -->
<html lang="en">
<!-- To: -->
<html lang="en" class="dark">
```

**File:** `index.html` body
```html
<!-- Changed from: -->
<body class="bg-gray-50 dark:bg-gray-900">
<!-- To: -->
<body class="bg-gray-50 dark:bg-slate-900">
```

### Step 3: Update WizardLayout Styling
**File:** `wizard/src/components/WizardLayout.tsx`

Container styling:
```tsx
// Changed from:
<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
// To:
<div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-sans p-4 sm:p-6 lg:p-8">
```

Card container:
```tsx
// Changed from:
<div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 lg:p-8">
// To:
<div className="bg-white dark:bg-slate-700/50 rounded-xl shadow-lg p-6 lg:p-8">
```

Input field:
```tsx
// Changed from:
className="w-full p-3 mt-4 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
// To:
className="w-full p-3 mt-4 border-2 border-blue-500 rounded-lg dark:bg-slate-600 dark:border-blue-500 dark:text-white focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
```

Text colors:
- Headers: `dark:text-slate-100` or `dark:text-white`
- Subtitles: `dark:text-slate-400`
- Borders: `dark:border-slate-700`

### Step 4: Update TermSelector Styling
**File:** `wizard/src/components/TermSelector.tsx`

Search input:
```tsx
className="w-full px-4 py-2 text-sm border-2 border-blue-500 rounded-lg bg-white dark:bg-slate-600 dark:text-white focus:ring-blue-500 focus:border-blue-400 placeholder-gray-400"
```

Term container:
```tsx
className="flex flex-wrap gap-3 p-6 border border-slate-600 rounded-xl bg-transparent dark:bg-slate-800/50 min-h-[8rem] max-h-80 overflow-y-auto items-center"
```

Term buttons:
```tsx
// Selected state:
'bg-blue-600 text-white shadow-md'
// Unselected state:
'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
```

Frequency filter buttons:
```tsx
// Active:
'bg-blue-600 text-white'
// Inactive:
'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
```

Navigation buttons:
```tsx
// Skip button:
className="h-10 px-6 font-semibold text-slate-400 bg-transparent rounded-lg hover:text-slate-200 transition-colors"
// Next button:
className="h-10 px-6 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
```

### Step 5: Update Button Heights
**All button components:** Changed from `py-2` padding to `h-10` or `h-12` fixed heights for proper visual weight.

Files updated:
- `wizard/src/components/AskStep.tsx` - buttons use `h-10`
- `wizard/src/components/FinalStep.tsx` - buttons use `h-12`
- `wizard/src/components/TextInputStep.tsx` - button uses `h-10`
- `wizard/src/components/TermSelector.tsx` - buttons use `h-10`

### Step 6: Update JsonPreview Styling
**File:** `wizard/src/components/JsonPreview.tsx`
```tsx
// Container:
className="h-full bg-gray-900 rounded-lg p-4 overflow-auto"
// Text:
className="text-sm text-gray-300 whitespace-pre-wrap"
```

### Step 7: Update Other Input Components
**File:** `wizard/src/components/TextInputStep.tsx`

Headers and text:
```tsx
<h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">
<p className="text-gray-500 dark:text-slate-400 mb-4">
```

Input field:
```tsx
className="w-full p-3 mt-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
```

## Color Palette Summary

### Dark Mode Colors
- **Backgrounds:**
  - Main: `bg-slate-900`
  - Cards: `bg-slate-700/50` or `bg-slate-800/50`
  - Inputs: `bg-slate-600` or `bg-slate-700`
  - Term buttons: `bg-slate-700`
  - JSON preview: `bg-gray-900`

- **Text:**
  - Primary: `text-white` or `text-slate-100`
  - Secondary: `text-slate-400`
  - Term buttons: `text-slate-200`
  - JSON: `text-gray-300`

- **Borders:**
  - Primary: `border-slate-700`
  - Containers: `border-slate-600`
  - Active inputs: `border-blue-500` (2px width)

- **Accents:**
  - Primary buttons: `bg-blue-600` hover: `bg-blue-700`
  - Focus rings: `ring-blue-500`
  - Selected terms: `bg-blue-600`

## Key Styling Patterns

1. **Semi-transparent backgrounds:** Use `/50` opacity for depth
2. **Blue accent borders:** 2px blue borders for active inputs
3. **Fixed button heights:** h-10 or h-12 instead of padding
4. **Transition effects:** `transition-colors` for smooth hover states
5. **Focus rings:** Proper focus states with ring-offset for accessibility
6. **Rounded corners:** `rounded-lg` or `rounded-xl` for modern look

## Files with Correct Reference Styling
The properly styled components from Session 8 are preserved in:
- `wizard/app/src/components/` (reference implementations)

These can be used as reference if the styling needs to be restored again.

## Verification Checklist
- [ ] Dark mode enabled on HTML element
- [ ] Slate colors used throughout (not gray)
- [ ] Blue borders on inputs (2px)
- [ ] Semi-transparent card backgrounds
- [ ] Dark slate term buttons
- [ ] Fixed height buttons (h-10/h-12)
- [ ] Proper focus states and transitions
- [ ] React imports in all components

## Root Cause Analysis - Why UI Styling Keeps Breaking

### PRIMARY ISSUE: Duplicate Component Directories
The codebase has **TWO parallel component directories** that are causing confusion:

1. **`wizard/app/src/components/`** - Contains the properly styled components from Session 8
2. **`wizard/src/components/`** - Contains the active components being served by Vite

This dual structure means:
- Changes made to one set don't affect the other
- It's unclear which components are actually being served
- Different sessions may have edited different versions

### Evidence of the Problem
From git history (Session 7):
- Commit e8e12c6: "Enhanced wizard directory structure"
- Commit b0ab4e3: "Refactoring with wizard_structures organization"

This suggests a directory restructuring that created the duplicate structure but didn't fully migrate or clean up the old files.

### Secondary Contributing Factors

#### 1. Vite Configuration Issue
The `vite.config.js` or entry point may be inconsistently pointing to different source directories:
- Sometimes serving from `wizard/src/`
- Sometimes serving from `wizard/app/src/`
- The index.html entry point at project root vs wizard directory

#### 2. Git Workflow Creating Conflicts
When features are implemented:
- New features (like 004-make-all-attribute) may modify one set of files
- Styling fixes modify another set
- Merges or rebases don't reconcile the duplicate structures

#### 3. React Version/Build Config Mismatch
The React import issue suggests different build configurations:
- The `wizard/app/` structure might use older React (< 17) with automatic JSX transform
- The `wizard/src/` structure requires explicit React imports (React 17+)

#### 4. Multiple Package.json Files
There appear to be multiple package.json files:
- Root level `package.json`
- `wizard/package.json`
- Potentially `wizard/app/package.json`

Each may have different scripts, dependencies, or build configurations.

### Why It Keeps Happening

**The Cycle:**
1. UI is styled correctly in one component set
2. New feature development happens (possibly using different component set)
3. Feature implementation overwrites or ignores existing styling
4. Developer tries to fix styling in the "wrong" component set
5. Vite serves the unchanged files, making it appear nothing works
6. Multiple dev servers get started on different ports trying to fix it
7. Browser caches compound the confusion

### Permanent Fix Recommendations

#### Immediate Actions Needed:
1. **Choose ONE component directory** (recommend `wizard/src/`)
2. **Delete or archive the other** (`wizard/app/`)
3. **Single package.json** at project root
4. **Single vite.config.js** pointing to correct source
5. **Clear all node_modules and reinstall**

#### Long-term Prevention:
1. **Add .gitignore entries** for duplicate structures
2. **Document the canonical file structure** in README
3. **Use a pre-commit hook** to check for duplicate component files
4. **Establish clear feature branch practices** that specify which files to edit

### The "Button Height" Smoking Gun
From Session 9 notes:
> "Button height reduction from 004-make-all-attribute feature broke Session 8 visual design"

This confirms that:
- Different features are editing different versions of components
- Changes in one feature branch don't see the styled versions
- The build system isn't catching these conflicts

### Verification Commands
To confirm this theory after restart:
```bash
# Check for duplicate component files
ls -la wizard/app/src/components/
ls -la wizard/src/components/
diff -r wizard/app/src/components/ wizard/src/components/

# Check which entry point is being used
cat vite.config.js
cat index.html | grep "src="

# Check for multiple package.json
find . -name "package.json" -not -path "*/node_modules/*"
```

### Current State Assessment
As of this session:
- **Styling has been applied to:** `wizard/src/components/`
- **Reference styling exists in:** `wizard/app/src/components/`
- **Vite is configured to serve:** Unknown (likely inconsistent)
- **Browser is caching from:** Multiple ports (5173-5176, 3000)

This explains why even with correct styling applied, the UI doesn't update - Vite might be serving the unstyled files from `wizard/app/src/` or cached versions.