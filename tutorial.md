# Audio Description Protocol (ADP) - Comprehensive Architecture Tutorial

A beginner's guide to understanding the Audio Description Protocol project architecture, data flow, and component interactions.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Components](#architecture-components)
3. [Python Backend Deep Dive](#python-backend-deep-dive)
4. [TypeScript Frontend Wizard](#typescript-frontend-wizard)
5. [Data Structures & Taxonomy](#data-structures--taxonomy)
6. [Validation System](#validation-system)
7. [Real-Time Interaction Flow](#real-time-interaction-flow)
8. [Step-by-Step User Workflow](#step-by-step-user-workflow)
9. [Code Examples](#code-examples)
10. [Getting Started](#getting-started)

---

## Project Overview

The Audio Description Protocol (ADP) is a comprehensive framework designed to bridge the gap between human music experts and AI systems. It provides a standardized way to describe musical audio clips with structured text annotations, enabling seamless collaboration between humans and machines.

### Core Mission
- **Enable Human ⟷ AI Interoperability**: Both humans and AI models can create, read, and validate musical annotations using the same format
- **Provide Structured Musical Vocabulary**: A 479-term taxonomy covering mood, energy, and texture descriptors
- **Ensure Data Quality**: Comprehensive validation at every level from individual terms to complete datasets
- **Support Professional Workflows**: Time-based annotations with confidence scores and provenance tracking

---

## Architecture Components

The ADP project consists of several interconnected components working together:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADP SYSTEM ARCHITECTURE                     │
├─────────────────────┬───────────────────┬─────────────────────┤
│   PYTHON BACKEND    │   DATA BRIDGE     │  TYPESCRIPT WIZARD  │
│                     │                   │                     │
│ ┌─────────────────┐ │ ┌───────────────┐ │ ┌─────────────────┐ │
│ │   Data Models   │ │ │  TS Bridge    │ │ │   React UI      │ │
│ │   - Annotation  │◄─┤ │  - Converter  │ ├─►│   - Wizard      │ │
│ │   - Musical     │ │ │  - Validator  │ │ │   - State Mgmt  │ │
│ │   - Dictionary  │ │ │  - Schema     │ │ │   - Components  │ │
│ └─────────────────┘ │ │    Sync       │ │ └─────────────────┘ │
│                     │ └───────────────┘ │                     │
│ ┌─────────────────┐ │                   │ ┌─────────────────┐ │
│ │   Validation    │ │                   │ │   Vocabulary    │ │
│ │   - Core        │ │                   │ │   - 479 Terms   │ │
│ │   - Taxonomy    │ │                   │ │   - Hierarchies │ │
│ │   - Schema      │ │                   │ │   - Helpers     │ │
│ └─────────────────┘ │                   │ └─────────────────┘ │
│                     │                   │                     │
│ ┌─────────────────┐ │                   │ ┌─────────────────┐ │
│ │   Processing    │ │                   │ │   Protocol      │ │
│ │   - Audio Feat  │ │                   │ │   - Types       │ │
│ │   - ML Models   │ │                   │ │   - Interfaces  │ │
│ │   - Analysis    │ │                   │ │   - Schemas     │ │
│ └─────────────────┘ │                   │ └─────────────────┘ │
└─────────────────────┴───────────────────┴─────────────────────┘
```

### Key Components

1. **Python Backend**: Core data processing, validation, and audio analysis
2. **TypeScript Bridge**: Maintains type safety between frontend and backend
3. **TypeScript Wizard**: Interactive web interface for creating annotations
4. **Shared Taxonomy**: 479-term vocabulary used by both systems
5. **Validation Layer**: Multi-level validation ensuring data quality

---

## Python Backend Deep Dive

The Python backend serves as the foundational layer, handling data modeling, validation, and audio processing.

### Core Models Architecture

```python
# Base Annotation Model (src/adp_core/models/annotation.py)
class Annotation(BaseModel):
    """
    The fundamental unit of musical description

    Structure:
    - id: Unique identifier
    - clip_id: References audio file
    - time_range: Start/end timestamps
    - labels: Array of dictionary entry references with confidence
    - provenance: Who/when/how annotation was created
    - quality_metrics: Confidence averages and agreement scores
    """
    id: str
    clip_id: str
    time_range: TimeRange
    labels: List[Label]
    provenance: Provenance
    schema_version: str
    quality_metrics: Optional[QualityMetrics]
```

### Musical Annotation Extension

```python
# Extended Musical Model (src/adp_core/models/musical_annotation.py)
class MusicalAnnotation(Annotation):
    """
    Professional-grade musical analysis

    Adds:
    - Musical elements (notes, chords, rhythms)
    - Hierarchical structure (beats → measures → sections)
    - Comprehensive analysis (tempo, key, genre, mood)
    - Audio features (MFCCs, spectral analysis)
    - Timing data (onsets, beats, downbeats)
    """
    musical_elements: List[MusicalElement]
    musical_structure: List[MusicalStructure]
    musical_analysis: Optional[MusicalAnalysis]
    spectral_features: Optional[Dict[str, List[float]]]
    onset_times: Optional[List[float]]
    beat_times: Optional[List[float]]
```

### Key Responsibilities

1. **Data Validation**: Ensures all annotations meet schema requirements
2. **Temporal Logic**: Validates time ranges (end_sec > start_sec)
3. **Taxonomy Compliance**: Checks all terms against 479-term vocabulary
4. **Audio Processing**: Extracts features using librosa/PyTorch
5. **Quality Metrics**: Computes confidence averages and agreement scores

### TypeScript Bridge

The bridge component (`src/adp_core/typescript_bridge.py`) maintains data consistency:

```python
class TypeScriptBridge:
    """
    Maintains TypeScript as the source of truth for data structures

    Key Functions:
    - Schema validation against TS interfaces: Checks if incoming data matches the expected TypeScript structure.
      Example: Verifies that an audio annotation has required fields like 'bpm', 'key', and 'genre' with correct data types

    - Data format conversion (Python ↔ TypeScript): Translates between Python dictionaries and JavaScript objects so both systems can understand the same data.
      Example: Converts Python {'bpm': 120, 'key': 'C major'} to TypeScript-compatible JSON format for the frontend wizard

    - Type-safe data exchange: Ensures data types remain consistent when passing information between the Python backend and TypeScript frontend.
      Example: Guarantees that 'bpm' is always a number, not a string, preventing runtime errors in calculations
    """

    def validate_audio_metadata(self, data: Dict[str, Any]) -> bool:
        """Validate against TypeScript AudioMetadata interface"""

    def convert_python_to_typescript_format(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Convert Python models to TS-compatible JSON"""
```

---

## TypeScript Frontend Wizard

The TypeScript wizard provides an intuitive web interface for creating musical annotations.

### State Management Architecture

```typescript
// Zustand-based global state (wizard/app/src/context/WizardContext.tsx)
interface WizardState {
    data: AudioProtocolData;           // Current annotation data
    step: number;                      // Current wizard step
    instrumentStep: number;            // Sub-step for instrument details
    currentInstrumentIndex: number;    // Which instrument being edited
    addSecondaryGenre: boolean;        // UI flow control
    addTheory: boolean;                // Whether to include music theory

    // Actions
    updateData: (path: string, value: unknown) => void;
    replaceData: (data: AudioProtocolData) => void;
    reset: () => void;
}
```

### TypeScript Protocol Definitions

The system uses comprehensive TypeScript interfaces for type safety:

```typescript
// Core Musical Descriptors (wizard/wizard_structures/protocol.ts)
export interface AudioProtocolData {
    protocol_version: string;
    path: string;
    theory: TheoryDetails;
    semantic_description: SemanticDescription;
    audio_metadata?: AudioMetadata;
    model_output?: ModelOutput;
    advanced_musical_data?: AdvancedMusicalData;
}

export interface SemanticDescription {
    attributes: SemanticAttributes;  // mood, energy, texture arrays
    genre: GenreDetails;            // primary/secondary genres
    instrumentation: InstrumentationEntry[];
    vocals: VocalsDetails;
}
```

### Key Frontend Responsibilities

1. **User Experience**: Step-by-step wizard for annotation creation
2. **Real-time Validation**: Immediate feedback on invalid inputs
3. **Type Safety**: TypeScript ensures data structure compliance
4. **State Persistence**: Maintains annotation state across wizard steps
5. **JSON Export**: Generates valid ADP JSON for backend processing

---

## Data Structures & Taxonomy

### The 479-Term Taxonomy System

The project includes a comprehensive vocabulary covering three dimensions:

```typescript
// Taxonomy Structure (wizard/wizard_structures/taxonomy.ts)
export interface TermDef {
    id: string;           // Stable identifier (e.g., "upbeat")
    term: string;         // Display name (e.g., "upbeat")
    freq: Frequency;      // Usage frequency: rare | infrequent | frequent | ubiquitous
    desc: string;         // Concise description
    figurative?: boolean; // Whether term is metaphorical
    aliases?: string[];   // Synonyms and variations
    examples?: string[];  // Usage examples
}
```

### Taxonomy Categories

#### 1. Mood (147 terms)
Emotional and affective descriptors organized by valence:

```
Positive / Uplifting: upbeat, joyful, triumphant, heroic...
Calm / Peaceful: peaceful, serene, dreamy, meditative...
Dark / Negative: melancholic, somber, haunting, ominous...
Intense / Aggressive: aggressive, forceful, explosive...
Mysterious / Ambiguous: mysterious, enigmatic, ethereal...
Romantic / Tender: tender, passionate, intimate...
Nostalgic / Reflective: nostalgic, bittersweet, pensive...
```

#### 2. Energy (100 terms)
Kinetic and dynamic properties:

```
High / Positive Drive: high-energy, driving, pumping, explosive...
Medium / Flowing: groovy, steady, rhythmic, rolling...
Low / Peaceful: laid-back, ambient, chill, mellow...
Negative / Unstable: tense, chaotic, erratic, jarring...
Expansive / Other: soaring, transcendent, cosmic...
```

#### 3. Texture (232 terms)
Timbral and sonic surface qualities:

```
Bright / Positive: bright, crisp, sparkling, crystalline...
Warm / Peaceful: warm, rich, lush, golden...
Dark / Negative: dark, muddy, harsh, gritty...
Natural / Acoustic: acoustic, organic, woody, breathy...
Synthetic / Electronic: electronic, digital, robotic...
Density & Layering: layered, complex, sparse, intricate...
Smooth / Refined: smooth, polished, elegant...
Rough / Gritty: rough, crunchy, distorted...
Space & Atmosphere: spacious, reverberant, intimate...
```

### Hierarchical Organization

```typescript
// Term Resolution (wizard/wizard_structures/taxonomy.ts)
export const QualityHierarchyRef: Record<QualityCategory, { [clusterName: string]: string[] }> = {
    Mood: {
        'Positive / Uplifting': ['upbeat', 'joyful', 'triumphant', ...],
        'Calm / Peaceful': ['peaceful', 'serene', 'dreamy', ...],
        // ... other mood clusters
    },
    Energy: { /* energy clusters */ },
    Texture: { /* texture clusters */ }
};
```

---

## Validation System

The ADP system implements multi-layer validation ensuring data quality and consistency.

### Validation Hierarchy

```
Level 1: Individual Term Validation
    ↓
Level 2: Category Consistency Checks
    ↓
Level 3: Cross-Reference Validation
    ↓
Level 4: Temporal Logic Validation
    ↓
Level 5: Schema Compliance Validation
```

### Python Validation Components

#### 1. Base Annotation Validation

```python
# Time Range Validation (src/adp_core/models/annotation.py)
class TimeRange(BaseModel):
    start_sec: float = Field(ge=0, description="Start time >= 0")
    end_sec: float = Field(ge=0, description="End time >= 0")

    @model_validator(mode='before')
    def validate_time_range(cls, values):
        start, end = values.get('start_sec'), values.get('end_sec')
        if start is not None and end is not None and end <= start:
            raise ValueError('end_sec must be greater than start_sec')
        return values
```

#### 2. Musical Structure Validation

```python
# Hierarchical Structure Validation (src/adp_core/models/musical_annotation.py)
@validator('musical_structure')
def validate_musical_structure(cls, structures):
    """Ensure parent-child relationships are consistent"""
    structure_ids = {s.parent_id for s in structures if s.parent_id}
    existing_ids = {s.id for s in structures if hasattr(s, 'id')}

    invalid_parents = structure_ids - existing_ids
    if invalid_parents and None not in invalid_parents:
        raise ValueError(f"Invalid parent IDs: {invalid_parents}")
    return structures
```

#### 3. Taxonomy Validation

```python
# Semantic Term Validation (src/adp_core/models/musical_annotation.py)
@validator('semantic_attributes')
def validate_semantic_taxonomy(cls, semantic_attr):
    """Validate all terms against 479-term canonical vocabulary"""
    if semantic_attr is None:
        return semantic_attr

    invalid_terms = semantic_attr.validate_terms()
    if invalid_terms:
        invalid_list = []
        for category, terms in invalid_terms.items():
            invalid_list.extend([f"{category}:{term}" for term in terms])
        raise ValueError(f"Invalid taxonomy terms: {', '.join(invalid_list)}")
    return semantic_attr
```

### TypeScript Validation

The frontend provides real-time validation using the shared taxonomy:

```typescript
// Taxonomy Validation (wizard/app/src/utils/taxonomyHelpers.ts)
export function validateMoodTerms(terms: string[]): string[] {
    const validMoodTerms = new Set(Object.keys(Terms).filter(id =>
        QualityHierarchyRef.Mood.some(cluster =>
            cluster.includes(id)
        )
    ));

    return terms.filter(term => !validMoodTerms.has(term));
}
```

---

## Real-Time Interaction Flow

### Data Flow Architecture

```
USER INTERACTION → WIZARD STATE → VALIDATION → BACKEND → RESPONSE

┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│   User      │    │   Wizard     │    │  Validation │    │   Backend    │
│   Input     │───▶│   State      │───▶│   Layer     │───▶│  Processing  │
│             │    │   (Zustand)  │    │             │    │              │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
       ▲                   │                    │                  │
       │                   ▼                    ▼                  ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│  UI Update  │◄───│  Component   │◄───│  Error      │◄───│   JSON       │
│  (Success)  │    │  Re-render   │    │  Handling   │    │   Output     │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
```

### Step-by-Step Flow

#### 1. User Input
```typescript
// User selects mood terms in the wizard
const handleMoodSelection = (selectedTerms: string[]) => {
    updateData('semantic_description.attributes.mood', selectedTerms);
};
```

#### 2. State Update
```typescript
// Zustand store updates and validates
updateData: (path: string, value: unknown) =>
    set((state) => ({
        data: setValueAtPath(state.data, path, value),
    }))
```

#### 3. Real-time Validation
```typescript
// Component validates input immediately
const invalidTerms = validateMoodTerms(moodTerms);
if (invalidTerms.length > 0) {
    setErrors(prev => ({
        ...prev,
        mood: `Invalid terms: ${invalidTerms.join(', ')}`
    }));
}
```

#### 4. JSON Generation
```typescript
// When complete, generate ADP-compliant JSON
const generateJSON = () => {
    const adpData: AudioProtocolData = wizardState.data;
    return JSON.stringify(adpData, null, 2);
};
```

#### 5. Backend Validation
```python
# Python backend validates the complete annotation
def validate_annotation(annotation_data: Dict[str, Any]) -> ValidationResult:
    try:
        # Parse using Pydantic models
        annotation = MusicalAnnotation(**annotation_data)
        return ValidationResult(valid=True, annotation=annotation)
    except ValidationError as e:
        return ValidationResult(valid=False, errors=e.errors())
```

---

## Step-by-Step User Workflow

### Complete Annotation Creation Process

#### Phase 1: Audio Metadata
```
User Journey: "I want to describe a lo-fi hip-hop track"

1. Upload/Reference Audio File
   - Provide file path or URL
   - System extracts: duration, sample rate, format
   - Auto-generates clip_id

2. Basic Information
   - User provides basic description
   - System validates file accessibility
```

#### Phase 2: Musical Characteristics
```
3. Genre Classification
   - Primary genre selection (e.g., "hip_hop")
   - Secondary genre options (e.g., "lo-fi", "chill")
   - Subgenre tags

4. Semantic Description
   - Mood selection: ["relaxed", "peaceful", "nostalgic"]
   - Energy level: ["low-energy", "laid-back", "mellow"]
   - Texture qualities: ["warm", "soft", "analog"]
```

#### Phase 3: Musical Analysis
```
5. Instrumentation Details
   - Instrument identification: drums, bass, piano
   - Role assignment: rhythm, harmony, melody
   - Descriptors: "warm", "analog", "filtered"

6. Theory Details (Optional)
   - BPM estimation
   - Key signature detection
   - Chord progressions
   - Time signature
```

#### Phase 4: Validation & Export
```
7. Real-time Validation
   - Check all terms against taxonomy
   - Validate time ranges
   - Ensure required fields

8. Quality Review
   - Confidence score assignment
   - Provenance tracking
   - Final validation

9. Export
   - Generate JSON output
   - Validate against schema
   - Ready for dataset inclusion
```

### Example User Session

```typescript
// Step 1: Initialize annotation
const wizardState = {
    data: {
        protocol_version: "1.0",
        path: "/audio/lofi-track.mp3",
        theory: { bpm: 85, key: "A", scale: "minor" },
        semantic_description: {
            attributes: {
                mood: [],      // User will populate
                energy: [],    // User will populate
                texture: []    // User will populate
            },
            genre: {
                primary: "",           // User will select
                secondary: []          // User will select
            },
            instrumentation: [],       // User will configure
            vocals: { presence: "none" }
        }
    },
    step: 0
};

// Step 2: User progresses through wizard
// Each step updates specific data paths
updateData('semantic_description.genre.primary', 'hip_hop');
updateData('semantic_description.attributes.mood', ['relaxed', 'peaceful']);
updateData('semantic_description.attributes.energy', ['low-energy', 'laid-back']);

// Step 3: System validates in real-time
const validation = validateSemanticAttributes(wizardState.data.semantic_description.attributes);
if (!validation.valid) {
    showErrors(validation.errors);
}

// Step 4: Generate final JSON
const annotationJSON = JSON.stringify(wizardState.data, null, 2);
```

---

## Code Examples

### Creating a Basic Annotation (Python)

```python
from datetime import datetime
from adp_core.models.annotation import Annotation, TimeRange, Label, Provenance

# Create a basic annotation
annotation = Annotation(
    id="annotation-001",
    clip_id="lofi-track-001",
    time_range=TimeRange(start_sec=0.0, end_sec=180.0),
    labels=[
        Label(entry_id="lo-fi-hip-hop", confidence=0.9),
        Label(entry_id="instrumental", confidence=0.95),
        Label(entry_id="relaxing", confidence=0.85)
    ],
    provenance=Provenance(
        annotator_type="human",
        annotator_id="expert-001",
        timestamp=datetime.now()
    ),
    schema_version="1.0"
)

# Validation happens automatically via Pydantic
print(f"Annotation created with average confidence: {annotation.quality_metrics.confidence_avg}")
```

### Creating a Musical Annotation (Python)

```python
from adp_core.models.musical_annotation import MusicalAnnotation, MusicalAnalysis

# Create comprehensive musical annotation
musical_annotation = MusicalAnnotation(
    # Base annotation fields...
    id="musical-001",
    clip_id="jazz-piano-001",

    # Musical analysis
    musical_analysis=MusicalAnalysis(
        tempo=120.0,
        tempo_confidence=0.92,
        key_signature="C major",
        key_confidence=0.88,
        time_signature="4/4",
        genre="jazz",
        energy=0.7,
        valence=0.8,
        semantic_attributes=SemanticAttributes(
            mood=["upbeat", "optimistic", "playful"],
            energy=["medium-energy", "groovy", "swinging"],
            texture=["warm", "acoustic", "rich"]
        )
    ),

    # Timing data
    beat_times=[0.0, 0.5, 1.0, 1.5, 2.0, 2.5],
    onset_times=[0.0, 0.3, 0.8, 1.3, 1.8, 2.3],

    # Audio features
    spectral_features={
        "mfcc": [1.2, -0.5, 0.8, ...],
        "spectral_centroid": [2500.0, 2600.0, ...],
        "chroma": [0.1, 0.3, 0.8, ...]
    }
)
```

### Frontend Wizard Integration (TypeScript)

```typescript
// Wizard component using state management
const MoodSelectionStep: React.FC = () => {
    const { data, updateData } = useWizardStore();
    const [selectedMoods, setSelectedMoods] = useState<string[]>(
        data.semantic_description.attributes.mood || []
    );

    const handleMoodChange = (moods: string[]) => {
        setSelectedMoods(moods);
        updateData('semantic_description.attributes.mood', moods);

        // Real-time validation
        const invalidTerms = validateMoodTerms(moods);
        if (invalidTerms.length > 0) {
            console.warn('Invalid mood terms:', invalidTerms);
        }
    };

    return (
        <div>
            <h3>Select Mood Descriptors</h3>
            <TaxonomySelector
                category="Mood"
                selected={selectedMoods}
                onChange={handleMoodChange}
                hierarchy={QualityHierarchyRef.Mood}
            />
        </div>
    );
};
```

### Cross-System Validation

```python
# Python backend validates TypeScript-generated data
from adp_core.typescript_bridge import TypeScriptBridge

bridge = TypeScriptBridge()

# Data from frontend wizard
wizard_data = {
    "protocol_version": "1.0",
    "semantic_description": {
        "attributes": {
            "mood": ["upbeat", "joyful"],
            "energy": ["high-energy", "driving"],
            "texture": ["bright", "crisp"]
        }
    }
}

# Validate against TypeScript schema
is_valid = bridge.validate_musical_analysis(wizard_data)

# Convert for Python processing
python_data = bridge.convert_to_python_format(wizard_data)

# Create validated annotation
annotation = MusicalAnnotation(**python_data)
```

---

## Getting Started

### Prerequisites

1. **Python 3.11+** for backend processing
2. **Node.js 18+** for frontend development
3. **Audio files** (WAV, MP3) for testing

### Quick Setup

#### 1. Backend Setup
```bash
# Navigate to project root
cd "Audio Description Protocol"

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/
```

#### 2. Frontend Setup
```bash
# Navigate to wizard application
cd wizard/app

# Install dependencies
npm install

# Start development server
npm run dev

# View at http://localhost:5173
```

#### 3. Explore the Components

```bash
# Examine data models
less src/adp_core/models/annotation.py
less src/adp_core/models/musical_annotation.py

# Review taxonomy
less wizard/wizard_structures/taxonomy.ts

# Check TypeScript protocol
less wizard/wizard_structures/protocol.ts

# See validation examples
less tests/validation/test_validator_core.py
```

### Creating Your First Annotation

#### Option 1: Using the Wizard (Recommended)
1. Start the frontend: `cd wizard/app && npm run dev`
2. Open http://localhost:5173
3. Follow the step-by-step wizard
4. Export the JSON when complete

#### Option 2: Programmatic Creation
```python
# Create annotation programmatically
from adp_core.models.annotation import Annotation, TimeRange, Label, Provenance
from datetime import datetime

annotation = Annotation(
    id="my-first-annotation",
    clip_id="test-audio",
    time_range=TimeRange(start_sec=0.0, end_sec=30.0),
    labels=[Label(entry_id="upbeat", confidence=0.8)],
    provenance=Provenance(
        annotator_type="human",
        timestamp=datetime.now()
    ),
    schema_version="1.0"
)

# Export to JSON
print(annotation.model_dump_json(indent=2))
```

### Next Steps

1. **Explore the Taxonomy**: Browse the 479-term vocabulary in `wizard/wizard_structures/taxonomy.ts`
2. **Try Advanced Features**: Experiment with musical structure and audio features
3. **Validate Your Data**: Use both frontend and backend validation
4. **Build Datasets**: Combine multiple annotations into dataset manifests
5. **Integrate AI Models**: Use the model output schema for ML predictions

### Understanding the Codebase

The project follows a clear structure:

```
Audio Description Protocol/
├── src/adp_core/              # Python backend
│   ├── models/                # Data models
│   ├── validation/            # Validation logic
│   └── typescript_bridge.py   # Frontend integration
├── wizard/                    # TypeScript frontend
│   ├── wizard_structures/     # Shared definitions
│   └── app/src/              # React application
├── schemas/                   # JSON schemas
├── tests/                     # Test suites
└── examples/                  # Sample data
```

This architecture ensures both systems stay synchronized while providing the flexibility for each to excel in their domain—Python for data processing and validation, TypeScript for user experience and type safety.

---

## Summary

The Audio Description Protocol represents a sophisticated approach to musical annotation that combines:

- **Rigorous Data Modeling**: Python backend with comprehensive validation
- **Intuitive User Experience**: TypeScript wizard with real-time feedback
- **Shared Vocabulary**: 479-term taxonomy ensuring consistency
- **Type Safety**: End-to-end type checking from UI to database
- **Professional Workflows**: Confidence scores, provenance, and quality metrics

By understanding these components and their interactions, you can effectively use, extend, or contribute to the ADP system for your musical annotation needs.

The system is designed to scale from individual annotations to large datasets while maintaining data quality and consistency throughout the entire workflow.