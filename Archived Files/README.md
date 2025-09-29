# Archived Files

This directory contains files that were archived during the codebase cleanup on the `Cleaning-Codebase` branch.

## Archive Date
2025-09-29

## Reason for Archival
These files were part of the original TypeScript-first taxonomy implementation that has been superseded by the Python-first approach with a separate React wizard frontend.

## Directory Structure

### `root-configs/`
Root-level configuration files that were superseded by the wizard/app configuration:
- TypeScript configs (tsconfig.json, tsconfig.node.json)
- Build configs (vite.config.ts)
- Styling configs (tailwind.config.js)
- Original taxonomy helpers (taxonomyHelpers.ts)

### `typescript-tests/`
Integration tests for the old TypeScript validation system that no longer exists.

### `wizard-structures/`
Original TypeScript taxonomy and protocol definitions that were replaced by:
- Python taxonomy system (`src/adp_core/taxonomy.py`)
- React wizard frontend (`wizard/app/`)

### `spec-contracts/`
TypeScript interface definitions from feature development specs that are no longer relevant to the current architecture.

## Current Architecture
- **Backend**: Python-based taxonomy and validation (`src/adp_core/`)
- **Frontend**: React wizard application (`wizard/app/`)
- **API**: FastAPI backend serves taxonomy data to wizard frontend