# Random Description Generation System

## Overview

The random description generation system provides intelligent randomization of musical descriptions for the Audio Description Protocol. It implements weighted probability distributions and popularity-based term selection to generate realistic musical metadata across all wizard categories.

## Architecture

### Core Files

1. **[backend/src/utils/randomDescription.ts](backend/src/utils/randomDescription.ts)** - Primary randomization logic
2. **[wizard/src/utils/randomMET.ts](wizard/src/utils/randomMET.ts)** - Wizard-specific MET randomization wrapper
3. **[backend/src/constants/vocabulary.ts](backend/src/constants/vocabulary.ts)** - Vocabulary sourcing from wizard constants

### Data Flow

```
wizard/src/constants/vocabulary.ts (single source of truth)
           ↓
backend/src/constants/vocabulary.ts (re-exports with adaptations)
           ↓
backend/src/utils/randomDescription.ts (core randomization functions)
           ↓
wizard/src/utils/randomMET.ts (re-exports for wizard use)
           ↓
UI Components (GenreStep, WizardStep, InstrumentationWizard, WizardLayout)
```

## Core Functions

### MET (Mood, Energy, Texture) Randomization

#### `generateRandomMET()`
**Location**: [backend/src/utils/randomDescription.ts:228](backend/src/utils/randomDescription.ts#L228)

Generates random Mood, Energy, and Texture terms with sophisticated distribution logic.

**Algorithm**:
1. Pick weighted counts for each category using `getWeightedMETCount()`:
   - 60% chance of 2 terms
   - 30% chance of 1 term
   - 10% chance of 3 terms
2. Enforce maximum 6 total terms across all MET categories
3. Pick terms using popularity weighting via `pickWeightedTerms()`

**Returns**:
```typescript
{
  mood: string[],      // 1-3 terms
  energy: string[],    // 1-3 terms
  texture: string[]    // 1-3 terms
}
```

#### `generateRandomMETCategory(category)`
**Location**: [wizard/src/utils/randomMET.ts:68](wizard/src/utils/randomMET.ts#L68)

Generates random selection for a single MET category (Mood, Energy, or Texture).

**Parameters**:
- `category: 'Mood' | 'Energy' | 'Texture'`

**Returns**: `string[]` - 1-3 randomly selected terms

### Weighted Selection Logic

#### `getWeightedMETCount()`
**Location**: [backend/src/utils/randomDescription.ts:15](backend/src/utils/randomDescription.ts#L15)

Returns weighted random count with distribution:
- 2 terms: 60% (0.0 - 0.6)
- 1 term: 30% (0.6 - 0.9)
- 3 terms: 10% (0.9 - 1.0)

**Implementation**:
```typescript
function getWeightedMETCount(): number {
  const rand = Math.random();
  if (rand < 0.6) return 2;
  if (rand < 0.9) return 1;
  return 3;
}
```

#### `pickWeightedTerms(category, count)`
**Location**: [backend/src/utils/randomDescription.ts:28](backend/src/utils/randomDescription.ts#L28)

Picks terms with popularity-based weighting using `TERMS_BY_FREQUENCY` taxonomy data.

**Weighting Strategy**:
- Ubiquitous terms: weight 4 (duplicated 4× in pool)
- Frequent terms: weight 3 (duplicated 3× in pool)
- Infrequent terms: weight 2 (duplicated 2× in pool)
- Rare terms: weight 1 (single entry in pool)

**Algorithm**:
1. Create weighted pool with duplicates based on frequency
2. Shuffle the pool using Fisher-Yates-inspired approach
3. Pick unique terms until desired count reached
4. Use Set to ensure uniqueness

### Genre Randomization

#### `generateRandomGenre()`
**Location**: [backend/src/utils/randomDescription.ts:133](backend/src/utils/randomDescription.ts#L133)

Generates random primary genre with 1-3 applicable subgenres.

**Algorithm**:
1. Pick random primary genre from `VOCABULARY.primary_genre`
2. Convert primary genre to lowercase key using `genreToKey()` mapping
3. Look up applicable subgenres in `VOCABULARY.subgenres[genreKey]`
4. Pick 1-3 random subgenres (if available)
5. Return 'tbc' if no subgenres available

**Returns**:
```typescript
{
  primary: string,      // e.g., 'Electronic', 'Hip-Hop'
  subgenres: string[]   // e.g., ['techno', 'house'] or ['tbc']
}
```

**Key Mapping**:
The `genreToKey()` function handles capitalization and special character conversions:
- 'Electronic' → 'electronic'
- 'Hip-Hop' → 'hip_hop'
- 'R&B / Soul' → 'rnb_soul'
- 'Spoken Word' → 'spoken_word'
- 'Sound Effect' → 'sound_effect'

### Instrumentation Randomization

#### `generateRandomInstrument()`
**Location**: [backend/src/utils/randomDescription.ts:81](backend/src/utils/randomDescription.ts#L81)

Generates random instrument with appropriate role and descriptor.

**Algorithm**:
1. Pick random instrument from `VOCABULARY.instrument`
2. Look up instrument-specific roles in `VOCABULARY.instrument_roles[instrument]`
3. Look up instrument-specific descriptors in `VOCABULARY.instrument_descriptors[instrument]`
4. Pick one random role and one random descriptor
5. Fallback to generic values if instrument not found

**Returns**:
```typescript
{
  instrument: string,      // e.g., 'electric_guitar'
  role: string,           // e.g., 'lead'
  descriptors: string[]   // e.g., ['distorted']
}
```

### Vocals Randomization

#### `generateRandomVocals()`
**Location**: [backend/src/utils/randomDescription.ts:162](backend/src/utils/randomDescription.ts#L162)

Generates random vocals configuration with 50% inclusion chance.

**Algorithm**:
1. Return `undefined` 50% of the time (no vocals)
2. Otherwise, pick random values from:
   - `VOCABULARY.vocals_presence` (excluding 'none')
   - `VOCABULARY.vocals_gender`
   - `VOCABULARY.vocals_style`
   - `VOCABULARY.instrument_descriptors['vocals']`

**Returns**: `VocalsObject | undefined`

```typescript
{
  presence: string,     // e.g., 'lead', 'backing'
  gender: string,       // e.g., 'male', 'female'
  style: string,        // e.g., 'singing', 'rapping'
  descriptors: string[] // e.g., ['breathy']
}
```

### Utility Functions

#### `pickRandom<T>(arr, count)`
**Location**: [backend/src/utils/randomDescription.ts:57](backend/src/utils/randomDescription.ts#L57)

Picks multiple random items from array.

**Implementation**: Fisher-Yates shuffle + slice

#### `pickOne<T>(arr)`
**Location**: [backend/src/utils/randomDescription.ts:65](backend/src/utils/randomDescription.ts#L65)

Picks single random item from array.

**Implementation**: `arr[Math.floor(Math.random() * arr.length)]`

#### `randomInt(min, max)`
**Location**: [backend/src/utils/randomDescription.ts:72](backend/src/utils/randomDescription.ts#L72)

Returns random integer between min and max (inclusive).

## UI Integration

### Random Buttons on Wizard Steps

All wizard screens have purple "Random" buttons that populate the current step and advance to the next step.

#### MET Steps (Mood, Energy, Texture)
**Component**: [wizard/src/components/WizardStep.tsx:54](wizard/src/components/WizardStep.tsx#L54)

```typescript
const handleRandom = () => {
    if (!metCategory) return;
    const randomTerms = generateRandomMETCategory(metCategory);
    updateData(path, randomTerms);
    onNext(); // Auto-advance to next step
};
```

**Button Location**: Right of "Next" button with 20px left margin (`ml-5`)

#### Genre Step
**Component**: [wizard/src/components/GenreStep.tsx:66](wizard/src/components/GenreStep.tsx#L66)

```typescript
const handleRandomize = () => {
    const randomGenre = generateRandomGenre();
    updateData('semantic_description.genre.primary', randomGenre.primary);
    updateData('semantic_description.genre.primary_subgenres', randomGenre.subgenres);
    onNext(); // Auto-advance to next step
};
```

**Data Paths**:
- Primary: `semantic_description.genre.primary`
- Subgenres: `semantic_description.genre.primary_subgenres`

#### Instrumentation Step
**Component**: [wizard/src/components/InstrumentationWizard.tsx:80](wizard/src/components/InstrumentationWizard.tsx#L80)

```typescript
const handleRandomize = () => {
    const randomInst = generateRandomInstrument();
    const nextInstrument: InstrumentationEntry = {
        instrument: randomInst.instrument,
        role: randomInst.role,
        descriptors: randomInst.descriptors,
    };
    overwriteCurrentInstrument(nextInstrument);
    setInstrumentStep(0); // Return to "Add another?" prompt
};
```

### Randomize All Tool

**Component**: [wizard/src/components/WizardLayout.tsx:39](wizard/src/components/WizardLayout.tsx#L39)

Located in collapsible Tools section at bottom of wizard interface.

**Functionality**:
1. **Genre**: Random primary + 1-3 applicable subgenres
2. **MET**: Random mood/energy/texture with weighted distribution
3. **Instrumentation**: 1-2 random instruments (50/50 chance)
4. **Vocals**: 50% chance of random vocals configuration
5. **Music Theory**: Random BPM (100-150), random key, random scale

**State Management**:
- Sets `hasRandomized = true` to enable "Save JSON" button
- Updates all wizard state via `updateData()` calls

**Save JSON Button**:
- Appears to right of "Randomize All" after first randomization
- Green styling (`bg-green-600`)
- Downloads JSON file with filename from `data.path`

## Technical Patterns

### Single Source of Truth
All vocabulary comes from [wizard/src/constants/vocabulary.ts](wizard/src/constants/vocabulary.ts), which is re-exported by the backend with minimal adaptations.

**Backend Adaptations** ([backend/src/constants/vocabulary.ts](backend/src/constants/vocabulary.ts)):
- `primary_genres` → `primary_genre` (array conversion)
- `secondary_genres` → `subgenres` (direct reference)
- `vocals_presence` excludes 'none' (filter)

### Weighted Probability
The system uses two levels of probability weighting:

1. **Count Distribution**: How many terms to pick (60/30/10 split)
2. **Popularity Weighting**: Which terms to pick (4:3:2:1 ratio)

This creates realistic distributions that favor common terms while still including variety.

### Genre Key Mapping
Solves the capitalization mismatch between:
- Primary genres: Capitalized display names ('Electronic', 'Hip-Hop')
- Subgenre keys: Lowercase snake_case ('electronic', 'hip_hop')

The `genreToKey()` function provides explicit mapping for all 17 primary genres.

### Auto-Advance Pattern
All random buttons in wizard steps call `onNext()` after populating data, providing seamless UX where randomization automatically advances the workflow.

## Data Paths Reference

### Genre
- `semantic_description.genre.primary` - Primary genre string
- `semantic_description.genre.primary_subgenres` - Subgenres array

### MET
- `semantic_description.attributes.mood` - Mood terms array
- `semantic_description.attributes.energy` - Energy terms array
- `semantic_description.attributes.texture` - Texture terms array

### Instrumentation
- `semantic_description.instrumentation` - Array of InstrumentationEntry objects

### Vocals
- `semantic_description.vocals.presence` - Presence string
- `semantic_description.vocals.gender` - Gender string
- `semantic_description.vocals.style` - Style string
- `semantic_description.vocals.descriptors` - Descriptors array

### Music Theory
- `theory.bpm` - BPM string (100-150)
- `theory.key` - Key string (C, C#, D, etc.)
- `theory.scale` - Scale string (major, minor, dorian, etc.)
- `theory.chords` - Always set to 'tbc' on randomization

## Testing Utilities

### `generateRandomDescription()`
**Location**: [backend/src/utils/randomDescription.ts:184](backend/src/utils/randomDescription.ts#L184)

Legacy function that generates a complete random description in a single call. Returns simplified object with:
- Genre (primary + 1 subgenre)
- MET arrays (mood, energy, texture)
- 1 instrument entry
- Optional vocals (50% chance)
- Random BPM (100-150)

### `generateRandomDescriptions(count)`
**Location**: [backend/src/utils/randomDescription.ts:262](backend/src/utils/randomDescription.ts#L262)

Generates multiple random descriptions for batch testing.

**Parameters**: `count: number = 10`

**Returns**: Array of random description objects

## Styling and UX

### Random Button Styling
All random buttons follow consistent design:
- Purple background (`bg-purple-600`)
- Hover state (`hover:bg-purple-700`)
- 20px left margin (`ml-5`)
- Focus ring with purple accent
- White text, semibold font
- Rounded corners, shadow

### Button Placement
- **MET/Genre/Instrumentation Steps**: Right of primary action button
- **Tools Section**: Left button in two-button group

### Visual Feedback
- Human-readable preview shows green text for valid values
- JSON preview updates in real-time
- Save JSON button appears only after randomization

## Common Issues and Solutions

### Issue: Subgenres not displaying
**Cause**: Mismatch between `subgenres` and `primary_subgenres` paths

**Solution**: Always use `semantic_description.genre.primary_subgenres` path

### Issue: Genre/subgenre mismatch
**Cause**: Capitalization difference between primary genres and subgenre keys

**Solution**: Use `genreToKey()` mapping function to convert display names to lookup keys

### Issue: MET exceeding 6 terms
**Cause**: Weighted counts can sum to 7+ terms

**Solution**: `generateRandomMET()` enforces maximum via reduction loop (lines 234-249)

### Issue: Vocals always included
**Cause**: Missing 50% inclusion check

**Solution**: `generateRandomVocals()` returns `undefined` half the time (line 164)

## Future Enhancements

Potential improvements to the randomization system:

1. **Configurable Distributions**: Allow users to adjust probability weights
2. **Smart Subgenre Selection**: Weight subgenres by compatibility with MET terms
3. **Instrument Grouping**: Ensure generated instruments work well together
4. **BPM Constraints**: Adjust BPM range based on selected genre
5. **Chord Progression Generation**: Replace 'tbc' with actual chord progressions
6. **Preset Templates**: Genre-specific randomization templates (e.g., "Electronic Dance" preset)

## Code Quality Notes

- All functions are pure (no side effects)
- Comprehensive JSDoc comments
- Type-safe with TypeScript
- Consistent naming conventions
- Minimal dependencies (no external libraries)
- Efficient algorithms (single-pass selection, Set-based uniqueness)
