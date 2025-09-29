# Audio Description Protocol - Wizard

Interactive wizard for creating musical annotations using the Audio Description Protocol.

## Features

- **Real-time validation** against Python backend
- **Live preview** in JSON, Python, YAML, and TypeScript formats
- **Taxonomy search** with 479-term vocabulary
- **Syntax highlighting** and error indicators
- **Dark/light mode** support

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (for backend API)

### Frontend Setup

1. Install dependencies:
```bash
cd wizard
npm install
```

2. Start development server:
```bash
npm run dev
```

The wizard will be available at http://localhost:3000

### Backend Setup

1. Start the Python API server:
```bash
cd ../src/adp_core
python api_server.py
```

The API will be available at http://localhost:8000

### Full Development Workflow

1. **Terminal 1** - Start Python backend:
```bash
cd src/adp_core
python api_server.py
```

2. **Terminal 2** - Start React frontend:
```bash
cd wizard
npm run dev
```

3. Open http://localhost:3000 in your browser

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

The wizard communicates with the Python backend via REST API:

- `POST /api/validate/semantic-attributes` - Validate taxonomy terms
- `POST /api/validate/musical-analysis` - Validate musical parameters
- `GET /api/taxonomy/search` - Search taxonomy terms
- `POST /api/generate-code` - Generate code in various formats

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.