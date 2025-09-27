# Document Session Task

## Purpose
Create session summaries and update project progress documentation after coding sessions.

## Instructions
When this task is executed, analyze the recent conversation history and:

1. **Determine next session number** by checking existing session_*.md files
2. **Create session_N.md** with:
   - Date and summary
   - Categorized changes (features, fixes, refactoring)
   - Key code changes and decisions
   - Next steps and files modified

3. **Update PROGRESS.md** with timestamped summary

## Session File Template
```markdown
# Session N - [Brief Description]

**Date:** [Current date]
**Duration:** [Estimated]

## Summary
[2-3 sentence overview]

## Changes Made

### ✨ New Features
- [List new features]

### 🐛 Bug Fixes  
- [List bugs fixed]

### 🔧 Refactoring & Improvements
- [List improvements]

### 📝 Documentation & Config
- [List documentation updates]

## Key Code Changes
[Important modifications with file names]

## Decisions & Discussion
[Architectural decisions, trade-offs]

## Next Steps
[Todos, planned features, blockers]

## Files Modified
[List of changed files]
```

## Progress Update Format
Add to top of PROGRESS.md:
```markdown
### [Date] - Session N
**Features:** [Brief list]
**Fixes:** [Brief list] 
**Improvements:** [Brief list]
```