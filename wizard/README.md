# Audio Description Protocol - Wizard

Interactive wizard for creating musical annotations using the Audio Description Protocol.

## Features

- **AI-Powered Phrase Generation** with Groq AI integration
- **Live preview** in JSON, Python, YAML, and TypeScript formats
- **Taxonomy search** with 479-term vocabulary
- **Syntax highlighting** and error indicators
- **Dark/light mode** support

## Production Deployment (Railway)

The application is deployed as a unified service on [Railway.app](https://railway.app) with both frontend and backend running together.

### Environment Variables Required

Add these to your Railway service:
- `GROQ_API_KEY` - Your Groq API key for AI phrase generation
- `NODE_ENV=production`
- `VITE_SUPABASE_URL` - Your Supabase project URL (optional)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key (optional)

### Deployment Process

Railway automatically deploys when you push to the configured branch. The deployment:
1. Installs dependencies (root, wizard, and backend)
2. Builds the wizard frontend (Vite)
3. Builds the backend TypeScript (tsc)
4. Starts both services with `concurrently`

The frontend runs on Railway's assigned PORT and proxies `/api/*` requests to the backend on port 3001.

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Groq API key (for AI phrase generation)

### Quick Start (Unified Development)

From the project root:

```bash
# Install all dependencies
npm install

# Start both frontend and backend together
npm start
```

This will start:
- Backend on http://localhost:3001
- Frontend on http://localhost:8080 (with API proxy)

### Individual Development

**Frontend only:**
```bash
cd wizard
npm run dev
```
The wizard will be available at http://localhost:5173

**Backend only:**
```bash
cd backend
npm run dev
```
The API will be available at http://localhost:3001

## Project Structure

```
wizard/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── dist/                   # Build output
```

## Key Components

- **MusicAnnotationWizard**: Main wizard interface
- **JsonPreview**: Real-time code preview with syntax highlighting
- **SemanticAttributesForm**: Taxonomy term selection with search
- **MusicalAnalysisForm**: Musical parameter inputs with validation

## API Integration

The wizard communicates with the TypeScript backend via REST API:

- `POST /api/generate-phrase-from-structure` - Generate structured AI phrases
- `POST /api/generate-casual-phrase` - Generate casual AI descriptions
- `POST /api/translate-phrase` - Translate between phrase styles
- `POST /api/test-models` - Test available AI models

Backend uses Groq AI with multiple models including:
- `llama-3.3-70b-versatile`
- `meta-llama/llama-4-scout-17b-16e-instruct`
- `openai/gpt-oss-20b`
- And more...

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.