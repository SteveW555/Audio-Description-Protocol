# Railway Deployment Setup

## 1. Local Requirements, Changes, and Setup Needed for Railway Deployment

- **Runtime versions**: Pin Node to `20.19.0` and Python to `3.13.7` via `.tool-versions` and `.mise/config.toml` (with `legacy_version_file = true`).
- **Deterministic installs**: Keep both root and wizard `package-lock.json` files checked in so `npm ci` produces consistent installs.
- **Wizard build assets**: Ensure `wizard/tsconfig.json` is committed so `tsc` runs identically in CI and Railway.
- **Express static server**: Use `server.js` to serve `wizard/dist`. The root `package.json` `start` script must invoke `node server.js` and retain `"postinstall": "npm ci --prefix wizard"` so wizard dependencies install during deployment.
- **Build verification**: `server.js` logs the runtime port and the contents of `wizard/dist`; keep that logging to diagnose missing assets quickly.

## 2. Railway Setup

- **Build command**: 

- Ensure correct Root Directory e,g 'wizard'
  Note for a fullstack app this needs to be the root of the frontend directory

- Ensure correct repo branch

- Set the service build command to:

mise install node@20.19.0 python@3.13.7 && npm ci && npm run build

This installs the required runtimes, installs dependencies (including the wizard via `postinstall`), and runs the root build.

- **Start command**: 
- Use Railway's default:
  
npm run start
  
- so the Express server in `server.js` handles requests.

- **Public Networking**: 
- In the Networking section, set the HTTP target port to `8080`. 
- This matches the Express fallback and the current Railway `PORT` value.

- **Variables**:  (Railway's environment variables) 
- Keep `NPM_CONFIG_PRODUCTION=false` (or equivalent) 
  so dev dependencies needed for builds remain available. 
- Avoid explicitly setting `PORT`; rely on Railway's injection (currently 8080 because of the networking configuration).

- **Post-deploy checks**: After each deploy, verify logs include 
- `Environment PORT=...`, 
- `Dist exists: true`, and 
- `Dist contents: [...]`. These confirm the proxy port and build artifacts.

