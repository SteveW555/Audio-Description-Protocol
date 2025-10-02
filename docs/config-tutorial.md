# ADP Configuration Tutorial

## Session Goals
- Understand how the frontend (wizard) and backend work together locally and on Railway
- Learn what npm and Vite do compared with Python tooling
- Get comfortable with version managers, package lists, and key config files

## 1. Two Teams Working Together
Think of ADP as two coordinated teams:
- **Python backend → the kitchen**. It prepares and validates data, using packages such as `pydantic`, `jsonschema`, and `librosa`.
- **React wizard → the waiter**. It is the interface people interact with. It uses React, Tailwind, and other JavaScript tools.

Locally and on Railway the same separation applies: Python runs the kitchen, Node.js runs the waiter. Deployment simply means copying both teams into Railway and letting them keep the same jobs.

## 2. Node.js, npm, and Vite (the Frontend Toolkit)
- **Node.js** lets JavaScript run outside the browser—like giving the waiter a rehearsal stage.
- **npm** (Node Package Manager) is the supply manager that downloads frontend libraries.
- **Vite** is the quick assistant that previews and bundles the wizard. During development it runs `npm run dev`; during deployment it runs `npm run build` to polish everything for production.

On Railway the build logs mention Vite because Railway asks it to bundle the wizard before serving the static files.

## 3. Package Lists: Backend vs Wizard
The project keeps two shopping lists of packages because each side speaks a different language.

### Backend (Python)
Declared in `pyproject.toml`, installed with `pip install -e .[dev,test]`:
- Core: `jsonschema`, `librosa`, `click`, `pydantic`, `typing-extensions`
- Dev/test helpers: `pytest`, `pytest-cov`, `black`, `flake8`, `mypy`, `isort`, `pre-commit`, `pytest-mock`, `hypothesis`

### Wizard (Node/TypeScript)
Declared in `wizard/package.json`, installed with `npm install`:
- App runtime: `react`, `react-dom`, `zustand`, `axios`, `lodash`, `uuid`, `@heroicons/react`
- Build & styling: `vite`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `serve`
- Testing & linting: `vitest`, `@testing-library/*`, `eslint`, `jest`, `jsdom`, `prettier`
- Code generation: `@openapitools/openapi-generator-cli`

Only one copy of React is installed—the entry in `wizard/package.json` pulls in version `19.1.1`, and both local builds and Railway use that single version.

## 4. Version Management Files
These files keep Python and Node versions consistent across laptops and Railway builds:
- `.mise/` and `.mise.toml`: configuration for the **mise** version manager (points to Python 3.13.7, Node 20.19.0).
- `.tool-versions`: same info for tools like **asdf** or **mise**.
- `wizard/.node-version`: guides Node-specific tools to use version 20.19.0 inside the wizard.

Railway honors version hints when possible, and leaving these files in place helps every developer match the same toolchain.

## 5. Build & Styling Config Files
These files steer the frontend toolchain both locally and on Railway:
- `wizard/postcss.config.js` and root `postcss.config.js`: tell PostCSS to run Tailwind and Autoprefixer.
- `wizard/tailwind.config.js` and root `tailwind.config.js`: list where Tailwind should look for class names and enable dark mode.
- `wizard/tsconfig.json`: TypeScript compiler settings (strict mode, path aliases, output settings).
- `wizard/vite.config.ts`: Vite settings when running inside `wizard/` (React plugin, default options).
- Root `vite.config.ts`: lets you run Vite from the repo root by pointing to the `wizard/` folder, defining dev-server port and API proxy.
- `vitest.config.ts`: Vite-powered testing setup when tests run from the repo root.

Keep them all—each plays a part in ensuring the wizard builds correctly no matter where commands are launched.

## 6. Serving the Wizard in Production
`server.js` is a tiny Express server that serves the wizard’s static files from `wizard/dist`. Railway runs it after the Vite build to deliver the frontend to users. You can also run it locally to test the production bundle (`npm run build` then `npm start`).

## 7. Key Takeaways
- Python and Node ecosystems stay separate but coordinated.
- Vite is required both for fast local previews and for production bundling on Railway.
- Version files (`.mise`, `.tool-versions`, `.node-version`) keep environments aligned.
- Tailwind, PostCSS, Vite, and Vitest configs should remain in place so builds and tests behave the same everywhere.
- `server.js` is the production doorway that serves the wizard after Vite prepares the files.

With these pieces in mind you can see how local development and Railway deployment share the same toolchain—just running in different places.
