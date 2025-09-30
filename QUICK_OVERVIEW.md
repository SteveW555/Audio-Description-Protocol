# Audio Description Protocol (ADP) - Quick Overview

**Version**: 1.0 | **Type**: Spec-Driven Framework | **Target**: Python 3.11+ / React + TypeScript

## What It Is

Production-ready framework for **musical audio annotation** with structured text descriptions. Features a comprehensive 479-term taxonomy and interactive React wizard interface for seamless human-AI interoperability in audio analysis and dataset creation.

## Core Purpose

- **Standardized audio annotation** using versioned JSON schemas
- **479-term taxonomy** with hierarchical organization (mood/energy/texture)
- **Interactive wizard interface** for step-by-step annotation creation
- **Type-safe data exchange** between Python backend and React frontend

## Key Features

### Taxonomy System
- **479 curated terms** across three dimensions: Mood (147), Energy (100), Texture (232)
- **21 subcategories**: 7 Mood + 5 Energy + 9 Texture hierarchical groups
- **Frequency-based filtering**: Very Common, Common, Moderate, Rare tiers
- **Multi-select organization**: Toggle between Category (hierarchical) and Popularity (frequency) views

### Backend (Python)
- **Pydantic models**: Type-safe data structures with validation
- **JSON Schema compliance**: Versioned contracts for all data types
- **PyTorch integration**: ML-ready architecture for audio processing
- **Validation framework**: Multi-level quality enforcement

### Frontend (React Wizard)
- **Step-by-step workflow**: Audio metadata → Genre → Semantic attributes → Export
- **Real-time validation**: Immediate feedback with comprehensive error reporting
- **Smart state management**: Zustand store with localStorage persistence and automatic migration
- **Dark/light themes**: Sophisticated visual design with user preference persistence

## Current State

**Status**: Core implementation complete, production-ready for annotation workflows
**Latest**: Session 14 - Complete hierarchical taxonomy expansion with Energy/Texture subcategories
**Branch**: 006-below-the-filter (Group By toolbar with category/popularity grouping)

## Project Structure

```
Audio Description Protocol/
├── src/adp_core/              # Python Backend
│   ├── models/                # Pydantic data models
│   │   ├── annotation.py      # Core annotation types
│   │   ├── musical_annotation.py  # Musical analysis extensions
│   │   └── dataset.py         # Dataset management
│   ├── validation/            # Multi-level validation
│   ├── api/                   # FastAPI service (future)
│   ├── taxonomy.py            # 479-term taxonomy system
│   ├── taxonomyHelpers.py     # Taxonomy utilities
│   └── typescript_bridge.py   # Frontend type generation
├── wizard/app/                # React Frontend
│   └── src/
│       ├── components/        # UI components
│       │   ├── TermSelector.tsx   # Taxonomy term selection
│       │   ├── FrequencyFilter.tsx # Popularity filtering
│       │   └── GroupByToolbar.tsx  # Category/Popularity toggle
│       ├── context/           # State management (Zustand)
│       ├── types/             # TypeScript definitions
│       └── utils/             # Helper functions
├── tests/                     # Test suites
│   ├── python/                # Backend tests (111 tests, 100% pass)
│   └── e2e/                   # End-to-end tests
├── schemas/                   # JSON Schema contracts
├── .specify/                  # Spec Kit framework
│   ├── templates/             # SDD templates (spec/plan/tasks)
│   ├── scripts/bash/          # Workflow automation
│   └── memory/constitution.md # Project principles
└── specs/                     # Feature specifications (7 features)
    ├── 001-create-a-spec/     # Initial framework
    ├── 002-advanced-audio-processing/
    ├── 003-integrate-wizard-interface/
    ├── 004-make-all-attribute/
    ├── 005-add-a-filter/
    ├── 006-below-the-filter/  # Group By toolbar (active)
    └── 007-contradiction-warnings/
```

## Key Technical Details

### Dependencies
**Python**: Python 3.11+, PyTorch, Pydantic, jsonschema, librosa/torchaudio, pytest
**TypeScript**: React, Vite, Tailwind CSS v3, Zustand, TypeScript 5.x
**Optional**: FastAPI (for API service), FBX export capabilities

### Data Flow
1. **User interaction** → React wizard collects annotation data
2. **Type safety** → TypeScript bridge ensures consistency
3. **Python validation** → Backend validates against taxonomy and schemas
4. **JSON export** → Generates ADP-compliant JSON
5. **Dataset integration** → Annotations aggregated into curated datasets

### Performance
- **Schema validation**: <100ms target
- **Wizard responsiveness**: Real-time feedback with no lag
- **Scale target**: 10,000 audio clips and annotations
- **State persistence**: Automatic localStorage with version migration

## Key Files to Know

| File | Lines | Purpose |
|------|-------|---------|
| `src/adp_core/taxonomy.py` | ~2,000 | 479-term taxonomy with hierarchy |
| `wizard/app/src/components/TermSelector.tsx` | ~800 | Main term selection UI |
| `wizard/app/src/utils/termGrouping.ts` | ~500 | Hierarchical grouping logic |
| `src/adp_core/models/annotation.py` | ~400 | Core annotation data models |
| `wizard/app/src/context/wizardStore.ts` | ~300 | Zustand state management |
| `src/adp_core/validation/validator.py` | ~600 | Multi-level validation engine |

## Workflow Commands

### Development
```bash
# Backend tests
pytest tests/python/

# Frontend development
cd wizard/app && npm run dev  # → http://localhost:3000

# TypeScript compilation
cd wizard/app && npm run build

# Code quality
ruff check src/
```

### Spec-Driven Development (SDD)
```bash
# Create new feature
/specify <feature description>

# Plan implementation
/plan <technical details>

# Generate tasks
/tasks

# Execute implementation
/implement

# Quality analysis
/analyze

# Clarify ambiguities
/clarify
```

## Documentation

- **README**: `README.md` (comprehensive 450+ lines with taxonomy details)
- **Progress Log**: `PROGRESS.md` (session-by-session development history)
- **Sessions**: `.claude/sessions/session_*.md` (14 detailed session logs)
- **Specs**: `specs/00X-*/` (7 complete feature specifications with plans/tasks)
- **Constitution**: `.specify/memory/constitution.md` (project governance principles)
- **Tutorial**: `tutorial.md` (architecture deep-dive)

## Development Principles

### Constitutional Governance
1. **Python + PyTorch First**: Primary technology stack
2. **Spec-First Development**: Requirements before implementation
3. **JSON Schema Compliance**: Strict contract validation
4. **Library-First Modularity**: Reusable components before interfaces
5. **Test-Driven Delivery**: Tests written before implementation

### Workflow (4-Phase SDD)
1. **Specification** (`/specify`) → Requirements and user stories
2. **Planning** (`/plan`) → Technical design and architecture
3. **Tasks** (`/tasks`) → Implementation breakdown with dependencies
4. **Implementation** (`/implement`) → TDD-based development

## Recent Achievements

### Session 14 (2025-09-29) - Latest
- Complete hierarchical taxonomy expansion
- Energy: 5 subcategories organizing 100 terms
- Texture: 9 subcategories organizing 232 terms
- Total: 21 subcategories across all three dimensions

### Session 13 (2025-09-29)
- Group By toolbar with Category/Popularity toggle
- Centralized Zustand state management
- localStorage persistence with automatic migration
- 125+ test assertions

### Session 12 (2025-09-29)
- Multi-select frequency filter
- Exclusive "All" button logic
- Enhanced visual design system

## Next Steps

- Test Group By Category functionality with Energy/Texture terms
- Implement contradiction detection (Feature 007)
- Deploy FastAPI service for frontend-backend communication
- Add subcategory descriptions/tooltips for user guidance
- Performance optimization for large datasets

---

**Quick Start**: `cd wizard/app && npm run dev` → Open http://localhost:3000
**Test Backend**: `pytest tests/python/`
**Explore Taxonomy**: `python -c "from adp_core.taxonomy import TAXONOMY_TERMS; print(len(TAXONOMY_TERMS))"`