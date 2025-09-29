# Repository Guidelines

## Project Structure & Module Organization
- Python framework lives in `src/adp_core` (submodules: `api`, `cli`, `models`, `validation`). CLI entrypoints belong in `src/adp_core/cli`.
- Test suites mirror runtime packages under `tests/` (for example `tests/validation`, `tests/models`) plus `tests/e2e` for integration flows. Place fixtures in `tests/fixtures`.
- The React wizard is housed in `wizard/src` with reusable UI in `wizard/components` and hooks in `wizard/hooks`. Static study materials sit in `docs/`, `specs/`, and sample audio or annotation assets in `audio/`, `annotations/`, and `json examples/`.

## Build, Test, and Development Commands
- Install Python deps with `pip install -e .[dev,test]`; run the CLI via `python -m adp_core.cli.main --help`.
- Spin up the React wizard from the repo root with `npm install` then `npm run dev`; use `npm run build` for production bundles and `npm run lint` to enforce TypeScript and JavaScript rules.
- To work on the wizard in isolation, run `npm install` and `npm run dev` inside the `wizard/` directory.

## Coding Style & Naming Conventions
- Python follows Black and Isort defaults (88 character lines, 4 space indents). Keep functions and modules snake_case, classes PascalCase, and include typing for new APIs.
- Run `ruff check .` and `black src tests` before submitting; resolve reported issues instead of silencing them.
- TypeScript components use PascalCase filenames under `wizard/src`, hooks start with `use`, and shared util modules stay in camelCase. Prefer Tailwind utility classes for styling and keep JSX props ordered logically.

## Testing Guidelines
- Execute `pytest` (or `pytest -m "not slow"` during local loops). Add new tests under the matching package directory, following `test_<feature>.py` naming.
- Generate coverage with `pytest --cov=src --cov-report=term-missing` when touching critical pipelines.
- Tag long running scenarios with `@pytest.mark.slow` or `@pytest.mark.integration` to keep CI predictable.

## Commit & Pull Request Guidelines
- Follow Conventional Commits such as `feat: add schema crosswalk`, `fix: correct validator`, or `chore: update docs`, mirroring existing history.
- Each PR should summarize scope, list validation commands (for example `pytest`, `npm run lint`), and link related GitHub issues or architecture notes in `docs/`.
- Include screenshots or GIFs for wizard UI updates and reference updated schema files when applicable.

## Tooling & Environment Tips
- Activate the local virtualenv (`.venv\Scripts\activate`) before invoking CLI utilities.
- Store environment specific wizard settings in `wizard/.env`; never commit real credentials or private datasets.
- Large audio assets should live in `audio/` or `Archived Files/` and stay out of Git history unless anonymized.

## Extra Reading
- Study CLAUDE.md and respect any instruction there that haven't yet been actioned
- Read README.md
- acknowledge by quoting the last line of both files
