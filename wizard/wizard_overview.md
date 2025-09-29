# Audio Protocol Wizard Overview

## Project Purpose
- Builds structured, machine-readable JSON records that describe audio samples with consistent semantics.
- Replaces loose, human-written tags with a protocol that downstream databases, AI music models, and analytics pipelines can trust.
- Ships as a browser-based wizard so non-technical users can author rich metadata without learning the schema.

## Evolution From Prototype
- Original artefact (`audio-protocol-wizard.html`) bundled HTML, Tailwind, React 17, and Babel-in-browser transpilation into a single file.
- September 2025 conversion (see `conversion.md`) migrated the app into a modern Vite + React + TypeScript workspace under `app/`.
- Refactor introduced modular files, static typing, reusable hooks, and dedicated state management while preserving UX parity.

## High-Level Architecture
- Vite bootstraps the React 18 SPA (`vite.config.ts`, `index.html`, `src/main.tsx`).
- Global layout wraps the wizard inside `WizardProvider` (Zustand-backed context) and `WizardLayout`.
- Tailwind 3 powers styling via PostCSS pipeline (`tailwind.config.cjs`, `postcss.config.cjs`, `src/styles/index.css`).

## Core Features
- **Guided Wizard Flow:** `useWizardSteps` composes the ordered questions, including conditional steps for optional details.
- **Context-Aware Options:** Subgenre lists react to prior selections through `getSubgenresFor` and vocabulary maps.
- **Instrumentation Sub-Wizard:** Dedicated multi-step flow (`InstrumentationWizard`, `useInstrumentationFlow`) captures instrument, role, and descriptors for any number of entries.
- **Live JSON Preview:** `JsonPreview` renders the evolving protocol payload with syntax highlighting driven by `highlightJsonString`.
- **Export Actions:** `FinalStep` enables copy-to-clipboard and `.json` downloads, then gates restart until an export occurs to prevent data loss.
- **Skip/To-Be-Confirmed Support:** Users can deliberately defer fields, producing `'tbc'` markers in the output.

## Application Structure
- `src/App.tsx` – Minimal wrapper that mounts the wizard inside the provider.
- `src/components/` – Presentation components split by responsibility (generic steps, instrumentation flow, JSON preview, final actions).
- `src/context/WizardContext.tsx` – Provides Zustand store with protocol data, wizard step indices, opt-in flags, and mutators.
- `src/hooks/` – Encapsulates flow logic (`useWizardSteps`, `useWizardNavigation`, `useInstrumentationFlow`).
- `src/constants/` – Houses protocol defaults (`initialState.ts`) and term vocabulary (`vocabulary.ts`), including fallback instrument definitions.
- `src/types/` – TypeScript contracts for protocol entities (`protocol.ts`) and wizard step metadata (`wizard.ts`).
- `src/utils/` – Helper utilities for deep updates, vocabulary lookups, instrumentation helpers, and JSON highlighting.
- `src/styles/index.css` – Tailwind entry plus light/dark defaults.

## State Management
- Zustand store keeps the canonical `AudioProtocolData` object and wizard progress.
- `updateData` mutates any nested field via `setValueAtPath` (structured clone + dot-path write).
- Instrumentation flow stores its own step index and current instrument pointer; `useInstrumentationFlow` orchestrates transitions and updates the shared data in place.
- Flags `addSecondaryGenre` and `addTheory` gate optional branches; `useWizardSteps` reads them to emit or suppress steps at runtime.

## Data Model & Vocabulary
- `AudioProtocolData` schema mirrors the protocol outlined in `wizard.md` with nested `semantic_description`, `theory`, and `protocol_version` metadata.
- Strongly typed term unions (mood, energy, genres, instruments, etc.) constrain user selections.
- `initialState` seeds the store with empty arrays and `'tbc'` placeholders where appropriate.
- `vocabulary.ts` contains curated term lists, instrument-specific role/descriptor maps, and helper constants such as `DEFAULT_INSTRUMENT` for fallbacks.

## Wizard Flow Details
1. Collects semantic descriptors (mood, energy, texture) with multi-select support.
2. Captures primary genre and context-dependent subgenres.
3. Prompts for optional secondary genres and subgenres via branching `AskStep`.
4. Launches instrumentation flow, allowing repeated instrument entries with role/descriptor metadata and skip behaviour.
5. Offers optional theory section (BPM, key, scale) that may be skipped wholesale, defaulting theory fields to `'tbc'`.
6. Gathers vocal presence and, when relevant, gender/style metadata based on `shouldShowVocalDetails`.
7. Final review exposes export utilities.

## Styling & UX Notes
- Dark mode enabled by default (`<html class="dark">` in `index.html`).
- Layout uses responsive two-column grid: left panel for the wizard, right panel for JSON preview.
- Tailwind classes keep visual parity with the prototype while benefitting from design tokens configured in `tailwind.config.cjs`.

## Tooling & Scripts
- `npm run dev` – Start Vite development server with fast HMR.
- `npm run build` – Generate production bundle.
- `npm run preview` – Serve the production build locally.
- `npm run lint` – Execute TypeScript project-wide type checking (currently fails; see below).

## Known Limitations & Follow-Ups
- TypeScript lint step emits errors in `InstrumentationWizard.tsx` related to term unions (tracked during conversion).
- Vocabulary still needs alignment with the original protocol spec (naming consistency, potential missing descriptors).
- `npm audit` reports two moderate vulnerabilities; remediation pending.
- Clipboard export relies on `document.execCommand`, which may warrant a modern replacement for broader browser support.

## Getting Started
1. `cd app`
2. `npm install`
3. `npm run dev` to launch the wizard locally at the default Vite port.
4. `npm run lint` to review outstanding type issues called out above.

## Additional References
- `wizard.md` – Original product brief and refactoring roadmap.
- `conversion.md` – Detailed log of the migration into this TypeScript/Vite codebase.
