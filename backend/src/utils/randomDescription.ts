/**
 * Random Description Generator
 *
 * Generates randomized musical descriptions for testing the AI phrase generation feature.
 * Uses vocabulary from wizard/src/constants/vocabulary.ts
 */

// Vocabulary arrays (imported from wizard constants)
const VOCABULARY = {
  mood: [
    'upbeat', 'energetic', 'joyful', 'happy', 'cheerful', 'uplifting', 'positive',
    'peaceful', 'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative',
    'dark', 'melancholic', 'sad', 'somber', 'brooding', 'haunting', 'moody',
    'intense', 'aggressive', 'driving', 'powerful', 'forceful', 'fierce', 'raw',
    'mysterious', 'enigmatic', 'ethereal', 'otherworldly', 'mystical',
    'tender', 'affectionate', 'intimate', 'loving', 'sensual', 'passionate',
    'nostalgic', 'reflective', 'bittersweet', 'pensive', 'poignant'
  ],
  energy: [
    'high-energy', 'driving', 'vigorous', 'propulsive', 'pumping', 'explosive',
    'kinetic', 'punchy', 'pulsating', 'vibrant', 'bouncy', 'electrifying',
    'flowing', 'steady', 'moderate', 'balanced-energy', 'rolling', 'rhythmic', 'groovy',
    'laid-back', 'low-energy', 'ambient', 'chill', 'mellow-energy', 'gentle-energy',
    'subdued', 'restrained', 'placid', 'relaxed-energy', 'serene-energy',
    'tense-energy', 'anxious-energy', 'chaotic-energy', 'agitated', 'erratic',
    'expansive', 'soaring', 'lifting', 'sweeping', 'majestic-energy'
  ],
  texture: [
    'bright', 'crisp', 'clear', 'brilliant', 'sparkling', 'crystalline', 'shimmering',
    'warm', 'rich', 'full', 'lush', 'creamy', 'golden', 'mellow', 'rounded',
    'dark', 'muddy', 'harsh', 'gritty-texture', 'murky', 'distorted', 'heavy', 'dense',
    'acoustic', 'organic', 'natural', 'raw-texture', 'live', 'authentic', 'intimate',
    'electronic', 'synthetic', 'digital', 'processed', 'robotic', 'metallic', 'analog',
    'layered', 'complex', 'rich-density', 'intricate', 'detailed', 'sparse', 'minimalistic',
    'smooth', 'silky-texture', 'polished-texture', 'refined', 'elegant', 'fluid',
    'rough', 'gritty', 'edgy', 'spacious', 'reverberant', 'atmospheric', 'cinematic'
  ],
  primary_genre: ['electronic', 'rock', 'pop', 'hip_hop', 'jazz', 'classical', 'folk', 'world', 'soundtrack', 'ambient'],
  subgenres: {
    electronic: ['progressive_house', 'tech_house', 'synthwave', 'trap', 'downtempo', 'drum_and_bass'],
    rock: ['alternative_rock', 'indie_rock', 'punk_rock', 'progressive_rock', 'heavy_metal'],
    pop: ['indie_pop', 'synth-pop', 'dance-pop', 'hyperpop'],
    hip_hop: ['lo-fi_hip_hop', 'trap', 'boom-bap', 'gangsta_rap', 'conscious_hip_hop'],
    jazz: ['cool_jazz', 'swing', 'bebop', 'modal_jazz', 'jazz_fusion'],
    classical: ['baroque', 'romantic_era', 'contemporary_classical', 'orchestral'],
    folk: ['bluegrass', 'folk-rock', 'singer-songwriter', 'americana'],
    world: ['reggae', 'afrobeat', 'latin', 'celtic', 'bossa_nova'],
    soundtrack: ['film_score', 'video_game_music', 'cinematic'],
    ambient: ['dark_ambient', 'drone', 'space_music', 'soundscape']
  },
  instrument: [
    'electric_guitar', 'acoustic_guitar', 'bass_guitar', 'synthesizer', 'bass_synthesizer',
    'piano', 'electric_piano', 'organ', 'drums', 'strings', 'violin', 'cello',
    'brass', 'trumpet', 'saxophone', 'flute', 'vocals'
  ],
  instrument_roles: {
    electric_guitar: ['lead', 'rhythm', 'melody', 'solo'],
    acoustic_guitar: ['rhythm', 'melody', 'fingerpicked'],
    bass_guitar: ['bass', 'rhythm', 'melody'],
    synthesizer: ['lead', 'pad', 'arpeggio', 'melody', 'atmospheric'],
    bass_synthesizer: ['bass', 'sub-bass', 'arpeggio'],
    piano: ['melody', 'harmony', 'chordal', 'rhythm'],
    electric_piano: ['harmony', 'chordal', 'melody'],
    organ: ['pad', 'harmony', 'lead'],
    drums: ['percussion', 'rhythm', 'beat'],
    strings: ['pad', 'harmony', 'melody'],
    brass: ['melody', 'harmony', 'fanfare'],
    vocals: ['lead', 'backing', 'harmony']
  },
  instrument_descriptors: {
    electric_guitar: ['distorted', 'clean', 'crunchy', 'overdriven', 'fuzzy'],
    acoustic_guitar: ['strummed', 'fingerpicked', 'bright', 'warm'],
    bass_guitar: ['deep', 'funky', 'slapped', 'driving', 'growling'],
    synthesizer: ['soaring', 'arpeggiated', 'bubbly', 'evolving', 'analog'],
    bass_synthesizer: ['deep', 'wobbling', 'sub-bass', 'driving'],
    piano: ['percussive', 'gentle', 'grand', 'bright'],
    electric_piano: ['warm', 'bell-like', 'rhodes'],
    organ: ['church', 'hammond', 'rock'],
    drums: ['heavy', 'tight', 'loose', 'tribal'],
    strings: ['lush', 'sweeping', 'pizzicato', 'orchestral'],
    brass: ['blaring', 'muted', 'majestic', 'jazzy'],
    vocals: ['breathy', 'powerful', 'raspy', 'harmonized']
  },
  vocals_presence: ['lead', 'backing', 'choir', 'sampled', 'spoken_word'],
  vocals_gender: ['male', 'female', 'mixed', 'androgynous'],
  vocals_style: ['singing', 'rapping', 'falsetto', 'whispering', 'operatic']
};

/**
 * Picks random items from an array
 */
function pickRandom<T>(arr: readonly T[], count: number = 1): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Picks a single random item from an array
 */
function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random musical description for testing
 *
 * @returns Structured wizard data object with randomized values
 */
export function generateRandomDescription() {
  // Pick primary genre
  const primaryGenre = pickOne(VOCABULARY.primary_genre);

  // Pick 1 subgenre for the primary genre
  const subgenreList = VOCABULARY.subgenres[primaryGenre as keyof typeof VOCABULARY.subgenres] || [];
  const subgenre = subgenreList.length > 0 ? pickOne(subgenreList) : undefined;

  // Pick 1-3 terms for Mood, Energy, Texture
  const moodCount = randomInt(1, 3);
  const energyCount = randomInt(1, 3);
  const textureCount = randomInt(1, 3);

  const mood = pickRandom(VOCABULARY.mood, moodCount);
  const energy = pickRandom(VOCABULARY.energy, energyCount);
  const texture = pickRandom(VOCABULARY.texture, textureCount);

  // Pick 1 random instrument
  const instrument = pickOne(VOCABULARY.instrument);

  // Get instrument-specific roles and descriptors
  const instrumentKey = instrument as keyof typeof VOCABULARY.instrument_roles;
  const rolesList = VOCABULARY.instrument_roles[instrumentKey] || ['lead'];
  const descriptorsList = VOCABULARY.instrument_descriptors[instrumentKey] || ['processed'];

  const role = pickOne(rolesList);

  // Pick 1 random descriptor for each instrument attribute
  const descriptor = pickOne(descriptorsList);

  // Randomly include vocals (50% chance)
  const includeVocals = Math.random() > 0.5;
  const vocals = includeVocals ? {
    presence: pickOne(VOCABULARY.vocals_presence),
    gender: pickOne(VOCABULARY.vocals_gender),
    style: pickOne(VOCABULARY.vocals_style),
    descriptors: [pickOne(descriptorsList)] // Reusing instrument descriptors for simplicity
  } : undefined;

  // Random BPM between 100 and 150
  const bpm = randomInt(100, 150);

  // Construct the wizard data object
  return {
    genre: {
      primary: primaryGenre,
      ...(subgenre && { subgenres: [subgenre] })
    },
    mood,
    energy,
    texture,
    instrumentation: [
      {
        instrument,
        role,
        descriptors: [descriptor]
      }
    ],
    ...(vocals && { vocals }),
    bpm
  };
}

/**
 * Generates multiple random descriptions
 */
export function generateRandomDescriptions(count: number = 10) {
  return Array.from({ length: count }, () => generateRandomDescription());
}
