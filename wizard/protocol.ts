export type MoodTerm =
    | 'energetic'
    | 'upbeat'
    | 'intense'
    | 'melancholic'
    | 'sad'
    | 'calm'
    | 'relaxed'
    | 'epic'
    | 'heroic'
    | 'tense'
    | 'suspenseful'
    | 'dark'
    | 'mysterious'
    | 'romantic'
    | 'sentimental'
    | 'aggressive'
    | 'dreamy'
    | 'ethereal';

export type EnergyTerm =
    | 'high-energy'
    | 'driving'
    | 'pumping'
    | 'medium-energy'
    | 'groovy'
    | 'laid-back'
    | 'low-energy'
    | 'ambient'
    | 'static';

export type TextureTerm =
    | 'bright'
    | 'dark'
    | 'warm'
    | 'cold'
    | 'dense'
    | 'sparse'
    | 'clean'
    | 'polished'
    | 'raw'
    | 'gritty'
    | 'distorted'
    | 'smooth'
    | 'harsh'
    | 'acoustic'
    | 'electronic'
    | 'synthetic';

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
