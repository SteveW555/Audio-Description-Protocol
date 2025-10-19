# Phrase Generation and Translation System

## Overview

The Audio Description Protocol (ADP) implements a sophisticated **bidirectional phrase generation and translation system** that enables seamless conversion between three distinct representations of musical audio descriptions:

1. **Casual Phrases** - Informal, creative, human-like descriptions (e.g., "A banger for the club with a fat, thumping kick drum")
2. **Standardized Phrases** - Formal descriptions using controlled ADP vocabulary (e.g., "A high-energy electronic track with a punchy kick drum")
3. **Structured JSON** - Machine-readable protocol data following the ADP schema

This system is essential for enabling both human-AI and human-human interoperability when describing musical audio clips, supporting use cases from casual music discovery to professional metadata annotation.

## System Architecture

### Three-Way Translation Model

```
┌─────────────────┐
│  Casual Phrase  │
│  (Colloquial)   │
└────────┬────────┘
         │
         │ translate-phrase API
         │ (OpenAI GPT-4o-mini)
         ↓
┌─────────────────┐       generate-phrase-from-structure API
│  Standardized   │◄──────────────────────────────────────────┐
│     Phrase      │                (Groq Llama)                │
│   (ADP Vocab)   │                                            │
└────────┬────────┘                                            │
         │                                                     │
         │ generate-phrase API                                │
         │ (Groq Llama)                        ┌──────────────┴────────┐
         │                                     │   Structured JSON     │
         ↓                                     │   (ADP Protocol)      │
┌─────────────────┐                           │ - Genre, Mood, Energy │
│  Casual Phrase  │                           │ - Instrumentation     │
│  (Generated)    │◄──────────────────────────│ - Vocals, BPM, etc.  │
└─────────────────┘  generate-casual-phrase   └───────────────────────┘
                           API
                     (OpenAI GPT-5 Nano)
```

### Component Layers

The system is organized into three architectural layers:

1. **Frontend Layer** (TypeScript/React)
   - User-facing phrase display components
   - Client-side API communication
   - Session management and state tracking

2. **Backend Layer** (TypeScript/Express)
   - RESTful API endpoints
   - Request validation and error handling
   - LLM client orchestration

3. **AI Layer** (Python utilities + TypeScript LLM clients)
   - Prompt template management
   - LLM API integration (OpenAI, Groq)
   - Response parsing and validation

## Translation Pathways

### 1. Casual → Standardized (Translation)

**Use Case:** Convert user-provided informal descriptions into controlled vocabulary

**Endpoint:** `POST /api/translate-phrase`

**Implementation:** [`backend/src/routes/translate-phrase.ts`](../backend/src/routes/translate-phrase.ts)

**AI Engine:** [`backend/src/ai/phrase-translator.ts`](../backend/src/ai/phrase-translator.ts:41-68)
- **Model:** OpenAI GPT-4o-mini
- **Temperature:** 0.5 (deterministic translation)
- **Max Tokens:** 100
- **Prompt:** [`prompts/phrase-translator-prompt.md`](../prompts/phrase-translator-prompt.md)

**Translation Process:**
1. **Semantic Analysis** - LLM identifies core musical concepts (genre, mood, energy, texture, instrumentation)
2. **Vocabulary Mapping** - Maps informal terms to standardized ADP vocabulary using:
   - Synonym matching (e.g., "sad" → `melancholic`)
   - Hypernym generalization (e.g., "Stratocaster" → `electric_guitar`)
   - Metonymy resolution (e.g., "John Carpenter vibe" → `synthwave` + `ominous`)
3. **Phrase Construction** - Assembles vocabulary terms into coherent natural language

**Example:**
```javascript
Input:  "A really chilled-out hip-hop track for studying"
Output: "A relaxed and contemplative lo-fi hip hop track with a
         laid-back, chill energy, featuring a smooth, warm electric
         piano over a steady drum machine beat"
```

**Pricing:** $0.15/1M input tokens, $0.60/1M output tokens

### 2. Structured JSON → Standardized (Generation from Structure)

**Use Case:** Convert structured wizard data into professional descriptions

**Endpoint:** `POST /api/generate-phrase-from-structure`

**Implementation:** [`backend/src/routes/generate-phrase-from-structure.ts`](../backend/src/routes/generate-phrase-from-structure.ts:18-69)

**AI Engine:** [`backend/src/ai/groq-client.ts`](../backend/src/ai/groq-client.ts) (generatePhraseFromStructure)
- **Model:** Groq Llama 3.3 70B
- **Prompt:** [`prompts/phrase-prompt.md`](../prompts/phrase-prompt.md) (sections between LLM markers)

**Generation Process:**
1. **Data Extraction** - Receives structured WizardData with selected terms
2. **Synthesis** - LLM weaves tags into cohesive narrative (not simple listing)
3. **Prioritization** - Emphasizes defining characteristics (primary mood, sub-genre, featured instruments)

**Example:**
```json
Input: {
  "genre": { "primary": "electronic", "secondary": ["synthwave"] },
  "mood": ["nostalgic", "dreamy"],
  "energy": ["propulsive"],
  "instrumentation": [{
    "instrument": "bass_synthesizer",
    "role": "ostinato",
    "descriptors": ["driving", "analog"]
  }]
}

Output: "A dreamy and nostalgic synthwave track with a polished,
         reverberant texture, driven by a steady analog bass ostinato
         and a soaring synth lead."
```

**Confidence:** 0.9 (high confidence for structured transformations)

### 3. Structured JSON → Casual (Creative Generation)

**Use Case:** Generate creative, relatable descriptions from structured data

**Endpoint:** `POST /api/generate-casual-phrase`

**Implementation:** [`backend/src/routes/generate-casual-phrase.ts`](../backend/src/routes/generate-casual-phrase.ts)

**AI Engine:** [`backend/src/ai/casual-phrase-generator.ts`](../backend/src/ai/casual-phrase-generator.ts:92-161)
- **Model:** OpenAI GPT-5 Nano
- **Temperature:** 1.0 (creative variation)
- **Max Tokens:** 5000 (includes reasoning + output)
- **Prompt:** [`prompts/casual-phrase-generator-prompt.md`](../prompts/casual-phrase-generator-prompt.md)
- **Retry Logic:** Single retry with 2s delay for 429/500/502/503 errors
- **Token Limit:** 900 tokens (enforced pre-request)

**Generation Process:**
1. **Data Filtering** - Extracts semantic fields from AudioProtocolData
2. **Prompt Construction** - Builds music data string from genre, mood, energy, texture, instrumentation, vocals, BPM
3. **Creative Generation** - LLM produces informal, evocative descriptions using:
   - Colloquialisms ("banger", "vibe", "grimy")
   - Scenarios ("music for driving at 2 AM")
   - Metaphors ("guitar sounds like a swarm of angry bees")
   - Varied length (short punchy to detailed descriptive)

**Poetic Level Parameter:**
- Range: 1 (very poetic) to 100 (very factual)
- Default: 50 (balanced)
- Controls creative style vs. technical accuracy

**Example:**
```javascript
Input: {
  semantic_description: {
    genre: { primary: "hip_hop", secondary: ["lo-fi_hip_hop"] },
    attributes: { mood: ["relaxed"], energy: ["laid-back"] }
  }
}

Output: "A really chilled-out hip-hop track for studying"
```

**Avoided Words:** "hauntingly", "road" (per prompt guidelines)

## Frontend Integration

### Wizard UI Components

**NLPhraseDisplay Component** ([`wizard/src/components/NLPhraseDisplay.tsx`](../wizard/src/components/NLPhraseDisplay.tsx))
- Read-only display with 7px font (text-[0.4375rem])
- Max 2-line wrap with line-clamp
- States: generating, error, success
- Displays AI-generated standardized phrases

**Usage Pattern:**
```typescript
import { NLPhraseDisplay } from './components/NLPhraseDisplay';

// Component automatically subscribes to wizard store
<NLPhraseDisplay />
```

### Client-Side Generators

**Standardized Phrase Generator** ([`wizard/src/ai/aiPhraseGenerator.ts`](../wizard/src/ai/aiPhraseGenerator.ts))
```typescript
import { generatePhrase } from '../ai/aiPhraseGenerator';

const result = await generatePhrase(wizardData);
// Returns: { phrase, confidence, tokensUsed, costUSD, requestId, timestamp }
```

**Casual Phrase Generator** ([`wizard/src/ai/casualPhraseGenerator.ts`](../wizard/src/ai/casualPhraseGenerator.ts))
```typescript
import { generateCasualPhrase } from '../ai/casualPhraseGenerator';

const result = await generateCasualPhrase(wizardData, poeticLevel);
// Returns: { casualPhrase, confidence, tokensUsed, costUSD, requestId, timestamp }
```

**Data Filtering:**
- Standardized generator: Excludes key, scale, chords per FR-002
- Casual generator: Extracts from `semantic_description` and `theory.bpm`

**Session Management:**
- Both generators use persistent sessionStorage UUID
- Tracks usage across page refreshes
- Format: `audio-protocol-session-id`

## Python Utilities

### Core Functions ([`src/adp_core/utils/phrase_functions.py`](../src/adp_core/utils/phrase_functions.py))

**Prompt Loading:**
```python
from adp_core.utils.phrase_functions import (
    load_translator_prompt,    # Casual → Standardized
    load_reverse_prompt,        # Standardized → Casual
    load_generation_prompt,     # Structured → Standardized
    load_creator_prompt         # Random casual generation
)
```

**Translation Analysis:**
```python
analysis = analyze_translation(casual_phrase, standardized_phrase)
# Returns: {
#   'found_vocabulary': {'Genres': [...], 'Moods': [...]},
#   'preserved_concepts': ['tempo', 'mood'],
#   'translation_quality': 'Excellent',  # Excellent/Good/Fair/Poor
#   'vocab_count': 7
# }
```

**Quality Metrics:**
- **Excellent:** 5+ vocabulary terms
- **Good:** 3-4 vocabulary terms
- **Fair:** 1-2 vocabulary terms
- **Poor:** 0 vocabulary terms

**Casual Phrase Analysis:**
```python
analysis = analyze_casual_phrases(phrases_list)
# Returns: {
#   'total_phrases': 10,
#   'genre_indicators': {'electronic', 'jazz'},
#   'mood_indicators': {'happy', 'chill'},
#   'length_distribution': {'short': 3, 'medium': 5, 'long': 2},
#   'colloquialisms': ['banger', 'vibe'],
#   'has_metaphors': [1, 3, 5],
#   'has_scenarios': [2, 4]
# }
```

**Random Music Generation:**
```python
desc = generate_random_music_description()
# Returns structured dict with genre, sub-genre, mood, energy,
# texture, 1-3 instruments, and optional vocals
```

**Test Phrases:** ([`src/adp_core/constants/test_phrases.py`](../src/adp_core/constants/test_phrases.py))
- Pre-defined casual and standardized phrase pairs
- Used for validation and regression testing

## ADP Vocabulary Reference

The standardized phrase vocabulary is exhaustively defined in [`prompts/phrase-translator-prompt.md`](../prompts/phrase-translator-prompt.md:25-84). All translations MUST use only these terms when describing musical attributes.

### Core Categories

| Category | Examples | Total Terms |
|----------|----------|-------------|
| **Genre** | `electronic`, `rock`, `pop`, `hip_hop`, `jazz`, `classical`, `folk`, `world`, `soundtrack`, `ambient`, `sound_effect` | 11 |
| **Sub-genre** | `synthwave`, `progressive_metal`, `lo-fi_hip_hop`, `cool_jazz`, `film_score` | 60+ |
| **Mood** | `upbeat`, `melancholic`, `aggressive`, `ethereal`, `nostalgic` | 100+ |
| **Energy** | `high-energy`, `laid-back`, `frenetic`, `groovy`, `static-energy` | 80+ |
| **Texture** | `bright`, `warm`, `distorted`, `layered`, `spacious` | 120+ |
| **Instrument** | `electric_guitar`, `synthesizer`, `drums`, `saxophone`, `vocals` | 24 |
| **Role** | `lead`, `rhythm`, `melody`, `pad`, `riffs`, `ostinato` | 20+ |
| **Descriptors** | `reverberant`, `distorted`, `breathy`, `jazzy`, `analog` | 50+ |

### Instrument Assertion Rule

**Critical:** If NO instrument is specified in casual phrase, the translator MUST add an appropriate instrument based on:
1. Genre conventions (primary factor)
2. Texture characteristics
3. Mood and energy context

**Required fields:**
- Instrument name
- Role
- 1-2 descriptors

## API Specifications

### Request/Response Formats

**Translation Request:**
```json
POST /api/translate-phrase
{
  "casualPhrase": "A really sad rock song",
  "sessionId": "uuid-v4",
  "requestId": "uuid-v4"
}
```

**Translation Response:**
```json
{
  "standardizedPhrase": "A melancholic rock track with downtempo energy",
  "tokensUsed": 45,
  "costUSD": 0.000012,
  "requestId": "uuid-v4",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Generation from Structure Request:**
```json
POST /api/generate-phrase-from-structure
{
  "wizardData": {
    "genre": { "primary": "jazz", "secondary": ["cool_jazz"] },
    "mood": ["relaxed"],
    "energy": ["laid-back"],
    "texture": ["smooth"],
    "instrumentation": [{
      "instrument": "saxophone",
      "role": "melody",
      "descriptors": ["breathy"]
    }]
  },
  "sessionId": "uuid-v4",
  "requestId": "uuid-v4"
}
```

**Casual Generation Request:**
```json
POST /api/generate-casual-phrase
{
  "wizardData": { /* structured data */ },
  "poeticLevel": 50,
  "sessionId": "uuid-v4",
  "requestId": "uuid-v4"
}
```

**Casual Generation Response:**
```json
{
  "casualPhrase": "A smooth jazz vibe perfect for late night listening",
  "confidence": 0.85,
  "tokensUsed": 120,
  "costUSD": 0.000024,
  "requestId": "uuid-v4",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Error Handling

All endpoints implement comprehensive error handling:

| Error Type | HTTP Status | Example |
|------------|-------------|---------|
| Missing API Key | 500 | `GROQ_API_KEY not configured` |
| Invalid API Key | 401 | `Invalid or expired API key` |
| Token Limit | 400 | `Token limit exceeded: 950 > 900` |
| Rate Limit | 429 | `Too many requests to AI service` |
| Network Error | 503 | `Unable to connect to AI service` |
| Terminal Error | 500 | `AI Service Error` |

## Testing Infrastructure

### Contract Tests

**Generate Phrase Success** ([`backend/tests/contract/generate-phrase-success.test.ts`](../backend/tests/contract/generate-phrase-success.test.ts))
- Validates successful phrase generation from structure
- Checks response schema compliance
- Verifies token/cost calculations

**Generate Phrase Validation** ([`backend/tests/contract/generate-phrase-validation.test.ts`](../backend/tests/contract/generate-phrase-validation.test.ts))
- Tests required field validation
- Ensures proper error responses

**Rate Limit Testing** ([`backend/tests/contract/generate-phrase-ratelimit.test.ts`](../backend/tests/contract/generate-phrase-ratelimit.test.ts))
- Validates rate limiting behavior
- Tests retry logic

### Python AI Tests

**Translation Tests:**
- [`tests/python/ai/test_phrase_translator.py`](../tests/python/ai/test_phrase_translator.py) - Core translation logic
- [`tests/python/ai/test_random_phrase_translator.py`](../tests/python/ai/test_random_phrase_translator.py) - Random phrase translation
- [`tests/python/ai/test_phrase_reverse.py`](../tests/python/ai/test_phrase_reverse.py) - Reverse translation (Standardized → Casual)

**Generation Tests:**
- [`tests/python/ai/test_phrase_generation.py`](../tests/python/ai/test_phrase_generation.py) - Structured → Standardized
- [`tests/python/ai/test_phrase_creator.py`](../tests/python/ai/test_phrase_creator.py) - Casual phrase creation
- [`tests/python/ai/test_triple_chain.py`](../tests/python/ai/test_triple_chain.py) - Three-way translation chain

### Integration Tests

**Wizard Integration:**
- [`wizard/tests/integration/nl-phrase-complete-flow.test.ts`](../wizard/tests/integration/nl-phrase-complete-flow.test.ts) - End-to-end phrase generation flow
- [`wizard/tests/integration/nl-phrase-partial-data.test.ts`](../wizard/tests/integration/nl-phrase-partial-data.test.ts) - Partial data handling

**Schema Validation:**
- [`tests/schema/nl-phrase-validation.test.ts`](../tests/schema/nl-phrase-validation.test.ts) - JSON schema compliance

**Unit Tests:**
- [`wizard/tests/unit/aiPhraseGenerator.test.ts`](../wizard/tests/unit/aiPhraseGenerator.test.ts)
- [`wizard/tests/unit/phraseValidator.test.ts`](../wizard/tests/unit/phraseValidator.test.ts)

## Performance Considerations

### Latency Targets

| Operation | Target | Typical |
|-----------|--------|---------|
| Casual → Standardized | < 2s | ~800ms |
| Structured → Standardized | < 1.5s | ~600ms |
| Structured → Casual | < 3s | ~1.2s |

### Cost Optimization

**Model Selection Strategy:**
- **Translation:** GPT-4o-mini ($0.15/$0.60 per 1M tokens) - optimized for accuracy
- **Structured Generation:** Groq Llama 3.3 70B - optimized for speed and cost
- **Casual Generation:** GPT-5 Nano - optimized for creative variation

**Token Management:**
- Casual generator enforces 900-token limit pre-request
- Standardized generator uses max_tokens=100 for speed
- Prompts cached on backend to reduce memory churn

### Retry Logic

**Casual Generator Retry:**
- Attempts: 2 (initial + 1 retry)
- Delay: 2000ms
- Retryable codes: 429, 500, 502, 503
- Terminal errors: Immediate failure

## Usage Examples

### Complete Translation Chain

```python
# Python - Full translation workflow
from adp_core.utils.phrase_functions import (
    load_translator_prompt,
    generate_random_music_description,
    analyze_translation
)

# 1. Generate random music structure
music_data = generate_random_music_description()

# 2. (Hypothetical) Generate casual phrase from structure
casual = "A banger for the club with a fat kick"

# 3. Translate to standardized
# (Call API with phrase-translator-prompt.md)
standardized = "A high-energy electronic track with a punchy kick drum"

# 4. Analyze translation quality
analysis = analyze_translation(casual, standardized)
print(f"Quality: {analysis['translation_quality']}")
print(f"Vocabulary count: {analysis['vocab_count']}")
```

### Wizard Integration

```typescript
// TypeScript - Wizard phrase generation
import { generatePhrase } from './ai/aiPhraseGenerator';
import { generateCasualPhrase } from './ai/casualPhraseGenerator';
import { useWizardStore } from './context/WizardContext';

// Get current wizard state
const wizardData = useWizardStore.getState().data;

// Generate standardized phrase
const standardized = await generatePhrase(wizardData);
console.log(standardized.phrase);

// Generate casual phrase
const casual = await generateCasualPhrase(wizardData, 50);
console.log(casual.casualPhrase);
```

## Future Enhancements

### Planned Features

1. **Bidirectional Translation Caching**
   - Store translation pairs in database
   - Reduce API calls for common phrases
   - Enable fuzzy matching for similar inputs

2. **Batch Translation API**
   - Process multiple phrases in single request
   - Optimize for dataset annotation workflows

3. **User Feedback Loop**
   - Allow users to rate translation quality
   - Fine-tune prompts based on feedback
   - Track problematic phrase patterns

4. **Multi-Language Support**
   - Translate casual phrases from non-English languages
   - Maintain English standardized vocabulary
   - Use multilingual LLMs (GPT-4 Turbo)

5. **Confidence Scoring Improvements**
   - Dynamic confidence based on input completeness
   - LLM self-evaluation of translation quality
   - Uncertainty estimation for ambiguous inputs

### Research Directions

- **Prompt Engineering:** Investigate chain-of-thought prompting for better semantic reasoning
- **Model Fine-Tuning:** Fine-tune smaller models on ADP-specific translation pairs
- **Hybrid Approaches:** Combine rule-based vocabulary matching with LLM semantic understanding

## Related Documentation

- [ADP Core Specification](../specs/001-autoencoder-ai-detector/spec.md) - Protocol overview
- [Wizard UI Architecture](wizard-architecture.md) - Frontend component design
- [API Documentation](api-reference.md) - Complete REST API reference
- [Testing Strategy](testing-strategy.md) - Quality assurance approach

## Support and Troubleshooting

### Common Issues

**Issue:** "Token limit exceeded" error
- **Cause:** Wizard data too verbose (>900 tokens)
- **Solution:** Reduce number of instruments or descriptors

**Issue:** Low translation quality
- **Cause:** Ambiguous or highly creative casual phrases
- **Solution:** Add more specific musical terms in casual phrase

**Issue:** API key errors
- **Cause:** Missing or invalid environment variables
- **Solution:** Verify `.env` file contains valid `OPENAI_API_KEY` and `GROQ_API_KEY`

### Debug Mode

Enable detailed logging:
```bash
# Backend
DEBUG=adp:* npm start

# Check console logs in browser for frontend
```

## License and Attribution

This phrase generation system uses:
- OpenAI GPT-4o-mini and GPT-5 Nano (proprietary models)
- Groq Llama 3.3 70B (open-source model via Groq API)
- TikToken (OpenAI tokenizer library, MIT License)

All prompts and vocabulary definitions are proprietary to the Audio Description Protocol project.
