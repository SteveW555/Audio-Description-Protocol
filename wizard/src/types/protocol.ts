export type MoodTerm =
    // Positive / Uplifting
    | 'upbeat' | 'energetic-mood' | 'joyful' | 'happy' | 'cheerful' | 'uplifting' | 'positive-mood'
    | 'hopeful' | 'playful' | 'romantic' | 'sentimental' | 'triumphant' | 'heroic' | 'optimistic'
    | 'euphoric' | 'exuberant' | 'ecstatic' | 'elated' | 'celebratory' | 'festive' | 'inspiring' | 'sparkly-mood'
    // Calm / Peaceful
    | 'peaceful' | 'calm' | 'relaxed' | 'serene' | 'dreamy' | 'tranquil' | 'meditative' | 'soothing'
    | 'gentle' | 'contemplative' | 'restful' | 'ethereal-mood' | 'atmospheric-mood' | 'flowing-mood'
    | 'smooth-mood' | 'gossamer-mood'
    // Dark / Negative
    | 'dark-mood' | 'melancholic' | 'sad' | 'somber' | 'brooding' | 'mournful' | 'gloomy' | 'haunting'
    | 'moody' | 'desolate' | 'forlorn' | 'wistful' | 'tragic' | 'lonely' | 'ominous' | 'disturbing'
    | 'shadowy-mood' | 'plaintive' | 'negative-mood'
    // Intense / Aggressive
    | 'intense-mood' | 'aggressive' | 'driving-mood' | 'powerful-mood' | 'forceful' | 'fierce'
    | 'raw-mood' | 'edgy-mood' | 'explosive-mood' | 'menacing' | 'angry' | 'violent' | 'furious'
    | 'tense' | 'harsh-mood' | 'thunderous' | 'blistering' | 'snarling' | 'chaotic-mood'
    // Mysterious / Ambiguous
    | 'mysterious' | 'enigmatic' | 'ethereal-ambience' | 'otherworldly' | 'mystical' | 'cryptic'
    | 'elusive' | 'veiled-mood' | 'obscure-mood' | 'twilight' | 'liminal' | 'majestic' | 'epic' | 'strange'
    // Romantic / Tender
    | 'tender' | 'affectionate' | 'intimate-mood' | 'loving' | 'sensual' | 'warm-hearted' | 'sultry'
    | 'passionate' | 'yearning' | 'longing'
    // Nostalgic / Reflective
    | 'nostalgic' | 'reflective' | 'bittersweet' | 'reminiscent' | 'pensive' | 'poignant'
    | 'memory-laden' | 'retrospective';

export type EnergyTerm =
    // High / Positive Drive
    | 'high-energy' | 'driving' | 'vigorous' | 'propulsive' | 'pumping' | 'dynamic-energy' | 'explosive'
    | 'kinetic' | 'punchy' | 'pulsating' | 'frenetic' | 'relentless' | 'urgent' | 'vibrant' | 'bouncy'
    | 'brisk' | 'electrifying' | 'high-octane' | 'turbocharged' | 'thumping'
    // Medium / Flowing
    | 'flowing' | 'steady' | 'moderate' | 'balanced-energy' | 'measured' | 'rolling' | 'rhythmic'
    | 'groovy' | 'medium-energy' | 'cascading' | 'undulating' | 'swinging' | 'pulsing' | 'unhurried'
    | 'cruising' | 'mid-tempo' | 'paced'
    // Low / Peaceful
    | 'laid-back' | 'low-energy' | 'ambient' | 'chill' | 'mellow-energy' | 'gentle-energy' | 'subdued'
    | 'restrained' | 'placid' | 'still' | 'relaxed-energy' | 'downtempo' | 'languid' | 'serene-energy'
    | 'hushed' | 'delicate-energy' | 'soft-energy' | 'sedate' | 'hypnotic'
    // Negative / Unstable
    | 'tense-energy' | 'anxious-energy' | 'chaotic-energy' | 'agitated' | 'erratic' | 'unstable'
    | 'jarring-energy' | 'dissonant-energy' | 'turbulent' | 'unsettling-energy' | 'fragmented'
    | 'static-energy' | 'restless' | 'jittery' | 'hectic' | 'disjointed'
    // Expansive / Other
    | 'expansive' | 'soaring' | 'lifting' | 'transcendent-energy' | 'boundless' | 'sweeping'
    | 'majestic-energy' | 'panoramic' | 'vast' | 'cosmic' | 'breathless' | 'gradual' | 'crescendoing'
    | 'swelling' | 'decaying' | 'wavering' | 'oscillating' | 'spiraling';

export type TextureTerm =
    // Bright / Positive
    | 'bright' | 'crisp' | 'clear' | 'brilliant' | 'sparkling' | 'crystalline' | 'shimmering' | 'radiant'
    | 'gleaming' | 'airy' | 'polished' | 'pristine' | 'shiny' | 'luminous'
    // Warm / Peaceful
    | 'warm' | 'rich' | 'full' | 'lush' | 'creamy' | 'honeyed' | 'golden' | 'mellow' | 'rounded'
    | 'embracing' | 'enveloping' | 'cozy' | 'sumptuous' | 'velvety' | 'buttery' | 'silky' | 'soft-texture'
    // Dark / Negative
    | 'dark' | 'muddy' | 'harsh' | 'gritty-texture' | 'murky' | 'raspy' | 'buzzy' | 'distorted'
    | 'coarse' | 'abrasive' | 'shadowy-texture' | 'veiled' | 'obscured' | 'heavy' | 'dense' | 'thick'
    | 'clouded' | 'muffled' | 'oppressive'
    // Natural / Acoustic
    | 'acoustic' | 'organic' | 'natural' | 'raw-texture' | 'live' | 'authentic' | 'unprocessed'
    | 'woody' | 'breathy' | 'human' | 'intimate' | 'close-miked' | 'hollow' | 'earthy' | 'fibrous'
    | 'resonant' | 'textured' | 'grainy'
    // Synthetic / Electronic
    | 'electronic' | 'synthetic' | 'digital' | 'processed' | 'programmed' | 'artificial' | 'computerized'
    | 'robotic' | 'futuristic' | 'cyber' | 'pixelated' | 'metallic' | 'glassy' | 'analog' | 'mechanical'
    | 'glitchy'
    // Density & Layering
    | 'layered' | 'complex' | 'rich-density' | 'full-bodied' | 'orchestrated' | 'intricate' | 'detailed'
    | 'multi-textured' | 'stratified' | 'elaborate' | 'sparse' | 'minimalistic' | 'polyphonic'
    | 'homophonic' | 'monophonic' | 'heterophonic'
    // Smooth / Refined
    | 'smooth' | 'silky-texture' | 'polished-texture' | 'refined' | 'sleek' | 'elegant' | 'sophisticated'
    | 'seamless' | 'effortless' | 'fluid' | 'graceful'
    // Rough / Gritty
    | 'rough' | 'gritty' | 'grainy-texture' | 'coarse-texture' | 'jagged' | 'harsh-texture'
    | 'raw-finish' | 'unpolished' | 'edgy' | 'abrasive-texture' | 'crunchy' | 'distorted-texture' | 'ratty'
    // Space & Atmosphere
    | 'spacious' | 'reverberant' | 'wet' | 'dry' | 'intimate-space' | 'echoey' | 'atmospheric' | 'cinematic';

export type PrimaryGenre =
    | 'electronic'
    | 'rock'
    | 'pop'
    | 'hip_hop'
    | 'jazz'
    | 'classical'
    | 'folk'
    | 'world'
    | 'soundtrack'
    | 'ambient'
    | 'sound_effect';

export type SecondaryGenre =
    | 'dance'
    | 'edm'
    | 'house'
    | 'techno'
    | 'alternative_rock'
    | 'metal'
    | 'indie_pop'
    | 'rnb'
    | 'soul'
    | 'blues'
    | 'country'
    | 'cinematic';

export type InstrumentName =
    | 'electric_guitar'
    | 'acoustic_guitar'
    | 'bass_guitar'
    | 'double_bass'
    | 'synthesizer'
    | 'bass_synthesizer'
    | 'piano'
    | 'electric_piano'
    | 'organ'
    | 'drums'
    | 'kick_drum'
    | 'snare_drum'
    | 'hi-hat'
    | 'cymbals'
    | 'drum_machine'
    | 'sampler'
    | 'strings'
    | 'violin'
    | 'cello'
    | 'brass'
    | 'trumpet'
    | 'saxophone'
    | 'flute'
    | 'vocals';

export type ScaleName =
    | 'major'
    | 'minor'
    | 'dorian'
    | 'phrygian'
    | 'lydian'
    | 'mixolydian'
    | 'locrian'
    | 'chromatic'
    | 'pentatonic_major'
    | 'pentatonic_minor';

export type KeyName =
    | 'C'
    | 'C#'
    | 'D'
    | 'D#'
    | 'E'
    | 'F'
    | 'F#'
    | 'G'
    | 'G#'
    | 'A'
    | 'A#'
    | 'B';

export type VocalPresence =
    | 'none'
    | 'lead'
    | 'backing'
    | 'choir'
    | 'sampled'
    | 'spoken_word'
    | 'ad-libs'
    | '';

export type VocalGender = 'male' | 'female' | 'mixed' | 'androgynous' | null;
export type VocalStyle =
    | 'singing'
    | 'rapping'
    | 'screaming'
    | 'growling'
    | 'falsetto'
    | 'whispering'
    | 'operatic'
    | null;

export type GenericRole =
    | 'lead'
    | 'rhythm'
    | 'melody'
    | 'harmony'
    | 'bass'
    | 'percussion'
    | 'pad'
    | 'atmospheric'
    | 'fx'
    | 'counter-melody'
    | 'ostinato'
    | 'fill'
    | 'arpeggio'
    | 'chordal'
    | 'solo'
    | 'fingerpicked'
    | 'walking_bassline'
    | 'sub-bass'
    | 'orchestral_bed'
    | 'stab'
    | 'fanfare'
    | 'beat'
    | 'backbeat'
    | 'rock'
    | 'ad-libs';

export type GenericDescriptor =
    | 'reverberant'
    | 'dry'
    | 'processed'
    | 'present'
    | 'distant'
    | 'warm'
    | 'bright'
    | 'dark'
    | 'distorted'
    | 'clean'
    | 'crunchy'
    | 'wailing'
    | 'overdriven'
    | 'fuzzy'
    | 'chugging'
    | 'strummed'
    | 'fingerpicked'
    | 'nylon'
    | 'steel-string'
    | 'deep'
    | 'funky'
    | 'slapped'
    | 'fretless'
    | 'driving'
    | 'growling'
    | 'sub-bass'
    | 'bowed'
    | 'plucked'
    | 'jazzy'
    | 'soaring'
    | 'arpeggiated'
    | 'bubbly'
    | 'harsh'
    | 'evolving'
    | 'digital'
    | 'analog'
    | 'wobbling'
    | 'acidic'
    | 'percussive'
    | 'gentle'
    | 'honky-tonk'
    | 'grand'
    | 'bell-like'
    | 'rhodes'
    | 'wurlitzer'
    | 'church'
    | 'hammond'
    | 'drawbar'
    | 'heavy'
    | 'light'
    | 'tight'
    | 'loose'
    | 'shuffling'
    | 'tribal'
    | 'acoustic'
    | 'punchy'
    | 'booming'
    | 'four-on-the-floor'
    | 'sharp'
    | 'fat'
    | 'crisp'
    | 'reverberant'
    | 'rimshot'
    | 'electronic'
    | '808'
    | '909'
    | 'processed'
    | 'glitchy'
    | 'lush'
    | 'sweeping'
    | 'pizzicato'
    | 'staccato'
    | 'orchestral'
    | 'blaring'
    | 'muted'
    | 'majestic'
    | 'breathy'
    | 'powerful'
    | 'raspy'
    | 'autotuned'
    | 'harmonized';

export interface InstrumentationEntry {
    instrument: InstrumentName | 'tbc' | '';
    role: GenericRole | 'tbc' | '';
    descriptors: Array<GenericDescriptor | 'tbc'>;
}

export interface TheoryDetails {
    bpm: string | number | '';
    key: KeyName | 'tbc' | '';
    scale: ScaleName | 'tbc' | '';
    key_confidence: 'tbc' | string;
    chords: 'tbc' | string;
    roman_numerals: 'tbc' | string;
}

export interface VocalsDetails {
    presence: VocalPresence;
    gender: VocalGender;
    style: VocalStyle;
}

export interface GenreDetails {
    primary: PrimaryGenre | '' | 'tbc';
    primary_subgenres: string[];
    secondary: SecondaryGenre[];
    secondary_subgenres: string[];
}

export interface SemanticAttributes {
    mood: string[];
    energy: string[];
    texture: string[];
}

export interface SemanticDescription {
    attributes: SemanticAttributes;
    genre: GenreDetails;
    instrumentation: InstrumentationEntry[];
    vocals: VocalsDetails;
}

export interface AudioProtocolData {
    protocol_version: string;
    path: string;
    theory: TheoryDetails;
    semantic_description: SemanticDescription;
}
