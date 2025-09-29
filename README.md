# Audio Description Protocol (ADP)

**Status:** Active Development | **Latest Feature:** Group By Toolbar (v006)

A Python-first framework for describing musical audio clips with structured text annotations, featuring a comprehensive 479-term taxonomy and interactive React wizard interface for seamless human-AI interoperability.

## 🎯 Project Overview

The Audio Description Protocol (ADP) provides a complete ecosystem for musical audio annotation:

- **479-Term Taxonomy**: Comprehensive mood, energy, and texture descriptors with hierarchical organization
- **Python Backend**: Robust data models, validation, and audio processing with PyTorch/librosa
- **React Wizard Interface**: User-friendly web application for creating annotations step-by-step
- **TypeScript Bridge**: Type-safe data exchange between frontend and backend
- **Time-Based Annotations**: Precise temporal labels with confidence scores and provenance tracking
- **Dataset Management**: Curated collections with manifests and version control

### Key Features

- 🎵 **Comprehensive Taxonomy**: 479 curated terms across mood (147), energy (100), and texture (232) dimensions
- 🐍 **Python-First Architecture**: Core data models and validation using Pydantic with PyTorch integration
- ⚛️ **Interactive Wizard**: React-based web interface with real-time validation, hierarchical term organization, and multi-select filtering
- 🔗 **TypeScript Bridge**: Maintains type safety and data consistency between Python backend and React frontend
- 🎨 **Smart UI Organization**: Group by category (7 mood subcategories) or popularity (4 frequency tiers) with persistent preferences
- 🕒 **Temporal Precision**: Time-range annotations with microsecond accuracy and validation
- 🤖 **Human-AI Interoperability**: Full provenance tracking for annotation sources and confidence scoring
- 📊 **Professional Quality**: Supports musical analysis, spectral features, and hierarchical musical structures
- ⚡ **Real-time Validation**: Immediate feedback with comprehensive error reporting and term suggestions

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Node.js 18+ (for React wizard interface)
- Audio files (WAV/MP3/FLAC format)

### Installation

#### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd "Audio Description Protocol"

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

#### Frontend Setup (React Wizard)
```bash
# Navigate to wizard application
cd wizard/app

# Install Node.js dependencies
npm install

# Start development server
npm run dev
# Wizard available at http://localhost:5173
```

### Basic Usage

#### Using the Interactive Wizard (Recommended)
```bash
# Start the React wizard interface
cd wizard/app && npm run dev
# Open http://localhost:5173 in your browser
# Follow the step-by-step annotation process
```

#### Programmatic Usage (Python)
```python
from adp_core.models.annotation import Annotation, TimeRange, Label
from adp_core.taxonomy import SemanticAttributes

# Create annotation with taxonomy terms
annotation = Annotation(
    id="my-annotation",
    clip_id="audio-001",
    time_range=TimeRange(start_sec=0.0, end_sec=30.0),
    labels=[Label(entry_id="upbeat", confidence=0.9)],
    # ... other fields
)

# Validate semantic attributes
semantic = SemanticAttributes(
    mood=["upbeat", "joyful"],
    energy=["high-energy"],
    texture=["bright", "crisp"]
)
```

#### Command Line Interface
```bash
# Run tests
pytest tests/

# Check code quality
ruff check src/

# Validate taxonomy terms
python -c "from adp_core.taxonomy import TAXONOMY_TERMS; print(f'Loaded {len(TAXONOMY_TERMS)} taxonomy terms')"
```

## 📖 Project Structure

The codebase is organized into distinct backend and frontend components:

```
📁 Audio Description Protocol/
├── 🐍 src/adp_core/              # Python Backend
│   ├── models/                   # Pydantic data models
│   │   ├── annotation.py         # Core annotation types
│   │   ├── musical_annotation.py # Extended musical analysis
│   │   └── dataset.py           # Dataset management
│   ├── validation/              # Validation framework
│   ├── api/                     # FastAPI web service
│   ├── taxonomy.py              # 479-term taxonomy system
│   ├── taxonomyHelpers.py       # Taxonomy utilities
│   └── typescript_bridge.py     # Frontend type bridge
├── ⚛️ wizard/app/               # React Frontend
│   └── src/                     # React application
│       ├── components/          # UI components
│       ├── context/            # State management
│       ├── types/              # TypeScript definitions
│       └── utils/              # Helper functions
├── 📂 tests/                    # Test suites
│   ├── python/                 # Python backend tests
│   └── e2e/                    # End-to-end tests
├── 📋 schemas/                  # JSON Schema contracts
├── 🗂️ Archived Files/          # Legacy code preservation
├── 🏛️ .specify/                 # Spec Kit framework
└── 📊 PROGRESS.md               # Development history
```

## 🏗️ Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        W[Wizard Interface]
        C[Components]
        S[State Management]
    end

    subgraph "Backend (Python)"
        T[479-Term Taxonomy]
        M[Pydantic Models]
        V[Validation Engine]
        A[FastAPI Service]
    end

    subgraph "Data Layer"
        J[JSON Schemas]
        D[Audio Files]
        AN[Annotations]
    end

    W --> A
    C --> S
    T --> M
    M --> V
    V --> A
    A --> J
    J --> D
    J --> AN
```

### Core Components

- **479-Term Taxonomy**: Comprehensive vocabulary with hierarchical organization (7 mood subcategories, frequency tiers)
- **Pydantic Models**: Type-safe Python data models with validation
- **React Wizard**: Step-by-step annotation interface with advanced term organization and filtering
- **TypeScript Bridge**: Maintains data consistency between frontend and backend
- **Zustand State Management**: Centralized store with localStorage persistence and automatic migration
- **Validation Engine**: Multi-level validation ensuring data quality
- **FastAPI Service**: RESTful API for frontend-backend communication

### Data Flow

1. **User Interaction**: React wizard collects annotation data with real-time validation
2. **Type Safety**: TypeScript bridge ensures data consistency across systems
3. **Python Validation**: Backend validates against taxonomy and schema constraints
4. **JSON Export**: Generates ADP-compliant JSON for storage or further processing
5. **Dataset Integration**: Annotations can be aggregated into curated datasets

## 📋 Specification Overview

### Functional Requirements

- **FR-001**: Standardized schemas for dictionary entries
- **FR-002**: Annotation schema with time ranges and confidence
- **FR-003**: Dataset manifest support
- **FR-004**: Model output capture with metadata
- **FR-005**: Comprehensive validation system
- **FR-006**: Lowercase label standardization
- **FR-007**: Provenance tracking (human vs AI)
- **FR-008**: Versioned schema evolution
- **FR-009**: Time range validation
- **FR-010**: Confidence score validation [0.0, 1.0]
- **FR-011**: File path and web URL support
- **FR-012**: Hierarchical label relationships
- **FR-013**: CC0-1.0 default licensing
- **FR-014**: Last-writer-wins conflict resolution

### Scale Requirements

- **Target**: 10,000 audio clips and annotations
- **Performance**: Schema validation <100ms
- **Storage**: File-based JSON with optional database future support

## 🎵 Taxonomy Overview

### 479-Term Classification System

The ADP taxonomy organizes musical descriptors into three main dimensions:

#### **Mood Descriptors (147 terms across 7 hierarchical subcategories)**
- **Positive/Uplifting** (22 terms): upbeat, energetic-mood, joyful, happy, cheerful, uplifting, positive-mood, hopeful, playful, romantic, sentimental, triumphant, heroic, optimistic, euphoric, exuberant, ecstatic, elated, celebratory, festive, inspiring, sparkly-mood
- **Calm/Peaceful** (16 terms): peaceful, calm, relaxed, serene, dreamy, tranquil, meditative, soothing, gentle, contemplative, restful, ethereal-mood, atmospheric-mood, flowing-mood, smooth-mood, gossamer-mood
- **Dark/Negative** (19 terms): dark-mood, melancholic, sad, somber, brooding, mournful, gloomy, haunting, moody, desolate, forlorn, wistful, tragic, lonely, ominous, disturbing, shadowy-mood, plaintive, negative-mood
- **Intense/Aggressive** (19 terms): intense-mood, aggressive, driving-mood, powerful-mood, forceful, fierce, raw-mood, edgy-mood, explosive-mood, menacing, angry, violent, furious, tense, harsh-mood, thunderous, blistering, snarling, chaotic-mood
- **Mysterious/Ambiguous** (14 terms): mysterious, enigmatic, ethereal-ambience, otherworldly, mystical, cryptic, elusive, veiled-mood, obscure-mood, twilight, liminal, majestic, epic, strange
- **Romantic/Tender** (10 terms): tender, affectionate, intimate-mood, loving, sensual, warm-hearted, sultry, passionate, yearning, longing
- **Nostalgic/Reflective** (8 terms): nostalgic, reflective, bittersweet, reminiscent, pensive, poignant, memory-laden, retrospective

#### **Energy Descriptors (100 terms across 5 hierarchical subcategories)**
- **High/Driving** (20 terms): high-energy, driving, vigorous, propulsive, pumping, dynamic-energy, explosive, kinetic, punchy, pulsating, frenetic, relentless, urgent, vibrant, bouncy, brisk, electrifying, high-octane, turbocharged, thumping
- **Medium/Flowing** (17 terms): flowing, steady, moderate, balanced-energy, measured, rolling, rhythmic, groovy, medium-energy, cascading, undulating, swinging, pulsing, unhurried, cruising, mid-tempo, paced
- **Low/Calm** (19 terms): laid-back, low-energy, ambient, chill, mellow-energy, gentle-energy, subdued, restrained, placid, still, relaxed-energy, downtempo, languid, serene-energy, hushed, delicate-energy, soft-energy, sedate, hypnotic
- **Tense/Unstable** (16 terms): tense-energy, anxious-energy, chaotic-energy, agitated, erratic, unstable, jarring-energy, dissonant-energy, turbulent, unsettling-energy, fragmented, static-energy, restless, jittery, hectic, disjointed
- **Expansive/Building** (18 terms): expansive, soaring, lifting, transcendent-energy, boundless, sweeping, majestic-energy, panoramic, vast, cosmic, breathless, gradual, crescendoing, swelling, decaying, wavering, oscillating, spiraling

#### **Texture Descriptors (232 terms across 9 hierarchical subcategories)**
- **Bright/Clear** (14 terms): bright, crisp, clear, brilliant, sparkling, crystalline, shimmering, radiant, gleaming, airy, polished, pristine, shiny, luminous
- **Warm/Rich** (17 terms): warm, rich, full, lush, creamy, honeyed, golden, mellow, rounded, embracing, enveloping, cozy, sumptuous, velvety, buttery, silky, soft-texture
- **Dark/Heavy** (19 terms): dark, muddy, harsh, gritty-texture, murky, raspy, buzzy, distorted, coarse, abrasive, shadowy-texture, veiled, obscured, heavy, dense, thick, clouded, muffled, oppressive
- **Natural/Acoustic** (19 terms): acoustic, organic, natural, raw-texture, live, authentic, unprocessed, woody, breathy, human, intimate, close-miked, hollow, earthy, fibrous, resonant, textured, grainy
- **Synthetic/Electronic** (16 terms): electronic, synthetic, digital, processed, programmed, artificial, computerized, robotic, futuristic, cyber, pixelated, metallic, glassy, analog, mechanical, glitchy
- **Dense/Layered** (16 terms): layered, complex, rich-density, full-bodied, orchestrated, intricate, detailed, multi-textured, stratified, elaborate, sparse, minimalistic, polyphonic, homophonic, monophonic, heterophonic
- **Smooth/Refined** (11 terms): smooth, silky-texture, polished-texture, refined, sleek, elegant, sophisticated, seamless, effortless, fluid, graceful
- **Rough/Gritty** (13 terms): rough, gritty, grainy-texture, coarse-texture, jagged, harsh-texture, raw-finish, unpolished, edgy, abrasive-texture, crunchy, distorted-texture, ratty
- **Spatial/Atmospheric** (8 terms): spacious, reverberant, wet, dry, intimate-space, echoey, atmospheric, cinematic

### Example Usage
```python
# Semantic annotation using taxonomy terms
semantic_attributes = SemanticAttributes(
    mood=["upbeat", "joyful", "optimistic"],      # Positive mood cluster
    energy=["high-energy", "driving"],           # High energy cluster
    texture=["bright", "crisp", "warm"]          # Mixed texture qualities
)
```

## 🔧 JSON Schema Examples

### Musical Annotation with Taxonomy
```json
{
  "id": "musical-annotation-001",
  "clip_id": "lofi-track-001",
  "annotation_type": "musical",
  "time_range": {
    "start_sec": 0.0,
    "end_sec": 180.0
  },
  "musical_analysis": {
    "tempo": 85,
    "key_signature": "A minor",
    "time_signature": "4/4",
    "semantic_attributes": {
      "mood": ["peaceful", "nostalgic", "dreamy"],
      "energy": ["laid-back", "mellow", "flowing"],
      "texture": ["warm", "soft", "analog"]
    }
  },
  "provenance": {
    "annotator_type": "human",
    "annotator_id": "expert-musicologist",
    "timestamp": "2025-09-29T10:30:00Z"
  },
  "schema_version": "1.0"
}
```

### Dataset with Taxonomy Integration
```json
{
  "id": "chill-hop-dataset",
  "name": "Chill Hip-Hop Collection",
  "version": "1.0",
  "clips": [...],
  "annotations": [...],
  "metadata": {
    "total_duration_sec": 7200,
    "annotation_count": 150,
    "taxonomy_coverage": {
      "mood_terms": 45,
      "energy_terms": 12,
      "texture_terms": 38
    }
  }
}
```

## 🛠️ Development Status

### Current Phase: Core Implementation Complete ✅

- [x] **Python Backend**: Complete taxonomy system with 479 terms and Pydantic models
- [x] **React Wizard**: Fully functional step-by-step annotation interface
- [x] **TypeScript Bridge**: Type-safe data exchange between frontend and backend
- [x] **Validation Framework**: Multi-level validation with real-time feedback
- [x] **Test Coverage**: Comprehensive test suites for Python and TypeScript components
- [x] **Documentation**: Complete architecture and usage documentation
- [x] **Codebase Cleanup**: Archived legacy files and established clean separation

### Recent Achievements (September 2025)

#### **Latest Features (Session 14 - Complete Taxonomy Expansion)**
- **Complete Hierarchical Organization**: All three dimensions now have subcategory groupings
  - **Mood**: 7 subcategories organizing 147 terms (Positive/Uplifting, Calm/Peaceful, Dark/Negative, Intense/Aggressive, Mysterious/Ambiguous, Romantic/Tender, Nostalgic/Reflective)
  - **Energy**: 5 subcategories organizing 90 terms (High/Driving, Medium/Flowing, Low/Calm, Tense/Unstable, Expansive/Building)
  - **Texture**: 9 subcategories organizing 119 terms (Bright/Clear, Warm/Rich, Dark/Heavy, Natural/Acoustic, Synthetic/Electronic, Dense/Layered, Smooth/Refined, Rough/Gritty, Spatial/Atmospheric)
- **Total**: 21 subcategories organizing 356+ taxonomy terms for enhanced discoverability

#### **Session 13 - Feature 006 (Group By Toolbar)**
- **Group By Toolbar**: Toggle between Category (hierarchical) and Popularity (frequency-based) organization
- **Smart State Management**: Centralized Zustand store with localStorage persistence and automatic version migration
- **Visual Design System**: Consistent styling with visual separators and grouped/flat layout modes
- **Comprehensive Testing**: 125+ assertions covering hierarchical grouping, state persistence, and UI integration

#### **Feature 005 - Multi-Select Frequency Filter**
- Exclusive "All" button logic with multi-select frequency filtering
- Enhanced visual design with standardized button sizing
- Type-safe array-based selection with Zustand store integration

#### **Previous Milestones**
- **Session 11**: Complete wizard development environment with Vite, Tailwind CSS v3, theme toggle system
- **Session 9**: Enhanced visual styling and UI polish for wizard interface
- **Session 8**: Complete wizard context and state management implementation
- **Session 7**: React wizard application with TypeScript integration
- **Sessions 4-6**: 479-term taxonomy system and Python backend validation
- **Codebase Cleanup**: Organized archive structure preserving development history

### Current Capabilities

- ✅ **Interactive Annotation Creation**: Full wizard workflow from audio metadata to semantic descriptions
- ✅ **Advanced Term Organization**: Hierarchical grouping by category with 7 mood subcategories, frequency-based filtering with multi-select
- ✅ **Real-time Validation**: Immediate feedback on taxonomy term usage and data constraints
- ✅ **Professional Quality**: Musical analysis, instrumentation details, and spectral features
- ✅ **Type Safety**: End-to-end type checking from React UI to Python backend
- ✅ **Smart Persistence**: Centralized state management with localStorage and automatic migration
- ✅ **Export Ready**: Generates ADP-compliant JSON for dataset integration

## 🏛️ Project Governance

This project follows constitutional principles defined in `.specify/memory/constitution.md`:

### Core Principles

- **Python + PyTorch First**: Primary technology stack
- **Spec-First Development**: Requirements before implementation
- **JSON Schema Compliance**: Strict contract validation
- **Library-First Modularity**: Reusable components before interfaces
- **Test-Driven Delivery**: Tests written before implementation

### Development Workflow

1. **Specification** → Requirements and user stories
2. **Planning** → Technical design and architecture
3. **Tasks** → Implementation breakdown
4. **Implementation** → Code development following TDD
5. **Validation** → Testing and quality assurance

## 🤝 Contributing

### Getting Started

1. Read the [Constitution](.specify/memory/constitution.md) for project principles
2. Review the [Feature Specification](specs/001-create-a-spec/spec.md)
3. Check the [Implementation Plan](specs/001-create-a-spec/plan.md)
4. Follow the [Task List](specs/001-create-a-spec/tasks.md) for current work

### Development Guidelines

- Follow test-driven development (TDD)
- Maintain JSON Schema compliance
- Use library-first approach for modularity
- Write tests before implementation
- Document all changes with rationale

### Branch Structure

- `main`: Stable releases
- `006-below-the-filter`: Current feature branch with Group By toolbar and hierarchical term organization
- `005-add-a-filter`: Multi-select frequency filter implementation
- `004-make-all-attribute`: Complete wizard implementation with all core features
- `Cleaning-Codebase`: Recent cleanup branch (archived legacy TypeScript files)

## 📄 License

Default dataset license: **CC0-1.0** (Creative Commons Public Domain)

- Ensures maximum reusability and open science alignment
- No PII or sensitive data in annotations
- Provenance tracking for human vs AI contributions

## 📞 Support & Documentation

- **Tutorial**: Comprehensive architecture guide in `tutorial.md`
- **Python API**: Review `src/adp_core/` for backend models and validation
- **React Components**: Check `wizard/app/src/` for frontend implementation
- **Taxonomy Reference**: Explore `src/adp_core/taxonomy.py` for 479-term vocabulary
- **JSON Schemas**: Find contracts in `schemas/` directory
- **Progress Tracking**: Monitor `PROGRESS.md` for development history
- **Legacy Files**: Historical code preserved in `Archived Files/` with documentation

## 🔮 Future Roadmap

- **Phase 1** ✅: Core Python backend with 479-term taxonomy
- **Phase 2** ✅: React wizard interface with real-time validation
- **Phase 3**: Advanced audio processing and ML model integration
- **Phase 4**: API service deployment and collaborative annotation
- **Phase 5**: Dataset marketplace and community features
- **Phase 6**: Performance optimization and enterprise scaling

## 🎯 Getting Started Quickly

### For Researchers & Annotators
1. **Use the Wizard**: `cd wizard/app && npm run dev` → Open http://localhost:5173
2. **Follow the Steps**: Audio metadata → Genre → Semantic attributes → Export JSON
3. **Validate Results**: Comprehensive real-time feedback ensures quality

### For Developers
1. **Explore the Taxonomy**: `python -c "from adp_core.taxonomy import TAXONOMY_TERMS; print(len(TAXONOMY_TERMS))"`
2. **Run Tests**: `pytest tests/python/` for backend, `cd wizard/app && npm test` for frontend
3. **Read the Tutorial**: Complete architecture overview in `tutorial.md`

### For AI/ML Practitioners
1. **Review Data Models**: Check `src/adp_core/models/` for annotation structures
2. **Understand Taxonomy**: 479 curated terms for consistent model training
3. **Export Datasets**: Use wizard or programmatic interface for dataset creation

---

**Status**: Core implementation complete with advanced UI features, production ready for annotation workflows
**Architecture**: Python backend + React frontend with 479-term taxonomy and complete hierarchical organization
**Latest Features**: Complete taxonomy expansion with 21 subcategories (7 mood + 5 energy + 9 texture), multi-select frequency filtering, centralized state management
**Last Updated**: 2025-09-29 (Session 14: Complete Hierarchical Taxonomy Expansion)