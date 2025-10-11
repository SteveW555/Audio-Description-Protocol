# Deployment Guide - Railway.app

This guide covers deploying the Audio Description Protocol Wizard to Railway.app.

## Architecture

The application uses a **unified deployment** model where both frontend and backend run in a single Railway service:

- **Frontend**: React + Vite (served as static files + Express proxy)
- **Backend**: TypeScript + Express API server
- **Port Strategy**: Railway assigns one PORT, frontend proxies `/api/*` to backend on port 3001

## Prerequisites

1. GitHub repository connected to Railway
2. Groq API key for AI phrase generation
3. (Optional) Supabase project for usage tracking

## Railway Configuration

### 1. Environment Variables

Add these in Railway's Variables tab:

**Required:**
- `GROQ_API_KEY` - Your Groq API key
- `NODE_ENV=production`

**Optional (for Supabase features):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 2. Build Configuration

Railway uses `nixpacks.toml` in the project root:

```toml
[phases.setup]
nixPkgs = ["nodejs"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

This ensures Railway:
1. Uses the **root** `package.json` (not wizard/package.json)
2. Installs all dependencies (root, wizard, backend)
3. Builds both wizard and backend
4. Starts with `concurrently` to run both services

### 3. Deployment Process

When you push to your configured branch:

1. **Install Phase**: `npm install`
   - Installs root dependencies (express, concurrently, http-proxy-middleware, etc.)
   - Runs `postinstall` which installs wizard and backend dependencies

2. **Build Phase**: `npm run build`
   - Builds wizard: `cd wizard && npm run build` → creates `wizard/dist/`
   - Builds backend: `cd backend && npm ci && npm run build` → creates `backend/dist/`

3. **Start Phase**: `npm start`
   - Runs `concurrently "npm run start:backend" "npm run start:frontend"`
   - Backend starts on port 3001
   - Frontend starts on Railway's PORT (proxies API requests to backend)

## Architecture Details

### Frontend Server ([server.js](server.js))

```javascript
// Serves static files from wizard/dist
app.use(express.static(distDir));

// Proxies API requests to backend
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${backendPort}`,
  changeOrigin: true
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});
```

### Backend Server ([backend/src/index.ts](backend/src/index.ts))

- Express API server
- Groq AI integration for phrase generation
- Cost tracking and rate limiting
- Runs on port 3001

### Process Management

Uses `concurrently` to run both servers:
- Backend: `cd backend && cross-env PORT=3001 node dist/index.js`
- Frontend: `cross-env BACKEND_PORT=3001 node server.js`

## Troubleshooting

### "Backend service unavailable" errors

**Cause**: Backend didn't start or crashed
**Check**: Railway logs for backend startup errors
**Common issues**:
- Missing `GROQ_API_KEY` environment variable
- Backend port 3001 already in use (shouldn't happen on Railway)

### API calls return HTML instead of JSON

**Cause**: Railway is using wrong `package.json`
**Fix**: Ensure `nixpacks.toml` exists in project root
**Verify**: Check Railway logs - should see "Unified server listening on port X"

### Build fails during TypeScript compilation

**Cause**: TypeScript errors in backend or wizard
**Fix**: Run `npm run build` locally to see full error messages
**Check**: Ensure all dependencies are in `package.json` files

### Frontend loads but no API calls work

**Cause**: Proxy not configured or backend crashed after starting
**Check**:
- Railway logs for proxy errors
- Backend logs for runtime errors
- Environment variables are set correctly

## Email Notifications (Currently Disabled)

Email notifications for rate/cost limits are currently disabled for simplicity. To re-enable:

1. Uncomment email-related code in:
   - `backend/src/index.ts` (lines 10-11, 66-68)
   - `backend/src/routes/generate-phrase.ts` (lines 5-6, 71-77, 97-103)

2. Add environment variables:
   - `SMTP_HOST` (e.g., smtp.gmail.com)
   - `SMTP_PORT` (e.g., 587)
   - `SMTP_USER` (your email)
   - `SMTP_PASS` (app password)
   - `NOTIFY_EMAIL` (notification recipient)

3. Rebuild: `npm run build` and redeploy

## Monitoring

Check Railway dashboard for:
- **Metrics**: CPU, memory, network usage
- **Logs**: Real-time application logs (both frontend and backend)
- **Deployments**: Build status and deployment history

Useful log patterns:
- `"Unified server listening on port"` - Frontend started successfully
- `"Backend server running on http://localhost:3001"` - Backend started successfully
- `"Proxying /api requests to"` - Proxy configured correctly
- `"🎵 Generated casual phrase:"` - AI generation working

## Cost Management

The backend implements cost tracking for Groq API usage:
- Per-session limits
- Daily limits
- Rate limiting (requests per minute/hour)
- Cost tracking stored in `daily-costs.json`

Monitor costs in Railway logs - search for "costUSD" to see API costs per request.

## Scaling Considerations

Current unified deployment works well for moderate traffic. For high traffic, consider:

1. **Separate Services**: Deploy frontend and backend as separate Railway services
2. **Database**: Move cost tracking from JSON file to PostgreSQL/Redis
3. **Caching**: Add Redis for rate limiting and cost tracking
4. **CDN**: Use Cloudflare or similar for static asset delivery
5. **Load Balancing**: Railway supports horizontal scaling

## Local Testing of Production Build

Before deploying, test the production build locally:

```bash
# Build everything
npm run build

# Start production mode
npm start

# Test at http://localhost:8080
```

This simulates Railway's environment exactly.
