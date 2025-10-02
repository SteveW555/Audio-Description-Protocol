# Wizard Working State Information Request

Please gather the following information while you have the wizard UI working correctly with the styled dark theme:

## 1. Screenshots
- Take a screenshot of the working UI showing the dark theme with slate colors
- Save to a known location for reference

## 2. Critical File Contents
Please save/copy the exact content of these files from the working state:

### HTML Entry Point
- `index.html` - especially the `<html>` and `<body>` class attributes

### Package Files
- `wizard/package.json` - exact versions of all dependencies
- `wizard/vite.config.ts` - complete Vite configuration
- `wizard/tailwind.config.js` - complete Tailwind configuration including darkMode setting

### Component Files (from wizard/src/components/)
Please capture the EXACT content especially the className attributes from:
- `WizardLayout.tsx` - particularly the main container div className
- `TermSelector.tsx` - the term button styling classes
- `WizardStep.tsx` - any dark mode specific classes
- `TextInputStep.tsx` - input field styling
- `JsonPreview.tsx` - the preview container styling

## 3. Directory Structure
Run and capture output of:
```bash
ls -la wizard/
ls -la wizard/src/
ls -la wizard/src/components/
```

Confirm there is NO `wizard/app` directory present.

## 4. Running Process Information
While the working UI is displayed:
```bash
# Check what's running on the Vite port
netstat -an | findstr :5173
# Or if using a different port, note which port number
```

## 5. Browser Developer Tools
With the working UI open:
1. Open browser DevTools (F12)
2. Go to Elements/Inspector tab
3. Check the `<html>` element - does it have `class="dark"`?
4. Check the main container divs - what are their computed background colors?
5. Check for any console errors or warnings
6. In Network tab, verify all CSS files are loading successfully

## 6. Git Information
```bash
# Get the exact commit hash where it's working
git rev-parse HEAD

# Show the commit message
git log -1 --oneline

# Check if there are any uncommitted changes
git status
```

## 7. Tailwind CSS Build Output
Check if there's a generated CSS file and its location:
- Look for any `dist/` or `build/` directories
- Check if Tailwind classes are being properly generated

## 8. React Component Imports
Verify the first line of EVERY component file in wizard/src/components/ starts with:
```javascript
import React from 'react';
```

## 9. Color Values to Verify
The working state should show these specific colors:
- Background: `bg-slate-900` (dark mode)
- Cards: `bg-slate-700/50`
- Term buttons (unselected): `bg-slate-600`
- Term buttons (selected): `bg-blue-600`
- Text: `text-white` or `text-gray-200`

## 10. Vite Dev Server Output
Copy the console output from the Vite dev server when it starts successfully with the working UI.

## 11. File Comparison Request
If possible, run a diff between the working state files and the broken state files for:
- `wizard/src/components/WizardLayout.tsx`
- `wizard/src/components/TermSelector.tsx`
- `index.html`

## Important Notes
- The issue appears to be that styling repeatedly reverts from a sophisticated slate-based dark theme to a plain gray/white appearance
- Previous working states were in Session 8 and Session 9
- The problem may be related to duplicate directories, caching, or build processes
- Focus on capturing EXACT className strings and Tailwind configurations

Save all this information to a file that can be provided when returning to the broken state for diagnosis.