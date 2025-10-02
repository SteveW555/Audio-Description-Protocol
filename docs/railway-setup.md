# Railway Deployment Setup

## 1. Local Requirements, Changes, and Setup Needed for Railway Deployment

- **Runtime versions**: Pin Node to `20.19.0` and Python to `3.13.7` via `.tool-versions`, `.mise/config.toml`, and `.mise.toml` (with `legacy_version_file = true`).
- **Deterministic installs**: Keep both root and wizard `package-lock.json` files tracked so the `npm ci` that Railpack runs during the install step reproduces exactly what you have locally.
- **Wizard TypeScript config**: Commit `wizard/tsconfig.json` so `tsc` behaves the same on Railway as it does locally.
- **Static server**: Use `server.js` (Express) to serve `wizard/dist`. The root `package.json` must keep `"postinstall": "npm ci --prefix wizard"` so the wizard’s dependencies install during `npm ci`, and the `start` script must invoke `node server.js`.
- **Wizard dependencies**: Include both `lodash-es` and `@types/lodash-es` in `wizard/package.json`; without them the build fails when strict type checking runs on Railway.
- **Build-time logging**: Leave the logging in `server.js` that prints the runtime port, the existence of `wizard/dist`, and its contents—those log lines are invaluable when diagnosing 502s.

## 2. Railway Setup

- **Build command**: Set the Railway build command to:

  ```bash
  mise install node@20.19.0 python@3.13.7 && npm run build
  ```

  Railpack already executes `npm ci` in the install phase; running it again causes cache-locking errors, so do not add an extra `npm ci` here.

- **Start command**: The default `npm run start` is correct—it executes `node server.js`, which serves the built wizard on the injected port.

- **Public Networking**: In the Networking settings, set the HTTP target port to `8080`. This matches the Express fallback and keeps Railway’s proxy aligned with the app.

- **Variables**: Keep `NPM_CONFIG_PRODUCTION=false` (or equivalent) so dev dependencies needed for the build remain available. Avoid setting `PORT` manually; Railway already injects it (currently 8080 because the target port is locked to 8080).

- **Post-deploy checks**: After every deploy, confirm the logs show:
  - `Environment PORT=...`
  - `Dist exists: true`
  - `Dist contents: [...]`
  - Any incoming requests (thanks to the Express middleware logging)

  Seeing these lines confirms the build artifacts are present, the server is listening, and the proxy port matches.

