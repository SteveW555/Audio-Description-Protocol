# Gemini Project: Audio Description Protocol (ADP)

This file provides a summary of the Audio Description Protocol (ADP) project for Gemini agents.

## Project Overview

The Audio Description Protocol (ADP) is a Python-first framework for describing musical audio clips with structured text annotations. It features a comprehensive 322-term multi-category taxonomy and an interactive React wizard interface for seamless human-AI interoperability.

## Technologies

- **Backend:** Python, Pydantic, PyTorch, FastAPI, librosa
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand
- **Testing:** pytest (backend), Vitest (frontend)
- **Linting:** ruff, flake8, mypy (backend), ESLint (frontend)
- **Package Management:** pip (backend), npm (frontend)

## Project Structure

```
/
├── src/adp_core/              # Python Backend
├── wizard/                    # React Frontend
│   ├── src/                   # React application source
│   └── package.json           # Frontend dependencies and scripts
├── tests/                     # Test suites (Python and E2E)
├── schemas/                   # JSON Schema contracts
├── pyproject.toml             # Backend dependencies and project info
└── README.md                  # Main project README
```

## Key Commands

### Backend

- **Install dependencies:** `pip install -r requirements.txt`
- **Run tests:** `pytest tests/python/`
- **Run linter:** `ruff check src/`
- **Run CLI:** `adp`

### Frontend

- **Navigate to frontend directory:** `cd wizard`
- **Install dependencies:** `npm install`
- **Start development server:** `npm run dev`
- **Run tests:** `npm run test`
- **Run linter:** `npm run lint`
- **Build for production:** `npm run build`
