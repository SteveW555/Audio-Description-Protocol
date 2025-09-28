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
    // General descriptors that apply across instruments - aligned with comprehensive taxonomy
    | 'reverberant'
    | 'dry'
    | 'processed'
    | 'present'
    | 'distant'
    | 'warm'
    | 'bright'
    | 'dark'
    | 'clean'
    | 'distorted'
    | 'crunchy'
    | 'fuzzy'
    | 'deep'
    | 'driving'
    | 'growling'
    | 'percussive'
    | 'gentle'
    | 'heavy'
    | 'light'
    | 'tight'
    | 'loose'
    | 'acoustic'
    | 'punchy'
    | 'booming'
    | 'sharp'
    | 'fat'
    | 'crisp'
    | 'electronic'
    | 'glitchy'
    | 'lush'
    | 'sweeping'
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

// Audio Technical Metadata
export interface AudioMetadata {
    format?: 'wav' | 'mp3' | 'flac' | 'ogg' | 'm4a';
    duration_sec?: number;
    sample_rate?: number;
    channels?: number;
    bit_depth?: 16 | 24 | 32;
    checksum?: string; // Format: "algorithm:hash" (e.g., "sha256:abc123...")
}

// Audio Features for ML Processing
export interface AudioFeatures {
    sample_rate?: number;
    window_size_sec?: number;
    hop_length_sec?: number;
    features?: string[]; // e.g., ["mfcc", "spectral_centroid", "zero_crossing_rate"]
}

// Spectral Features for Advanced Analysis
export interface SpectralFeatures {
    mfcc?: number[];
    spectral_centroid?: number[];
    spectral_bandwidth?: number[];
    spectral_rolloff?: number[];
    zero_crossing_rate?: number[];
    chroma?: number[];
    tonnetz?: number[];
    spectral_contrast?: number[];
}

// ML/AI Inference Metadata
export interface InferenceMetadata {
    model_name: string;
    model_version: string;
    inference_time_ms?: number;
    hardware_context?: 'CPU' | 'GPU' | 'TPU' | 'CUDA' | 'Metal' | 'OpenCL';
    parameters?: Record<string, any>;
    preprocessing?: AudioFeatures;
}

// Ensemble Model Information
export interface EnsembleInfo {
    is_ensemble: boolean;
    model_weights?: Record<string, number>; // Model weights between 0-1
    voting_strategy?: 'majority' | 'weighted' | 'confidence_based';
}

// Uncertainty Quantification
export interface UncertaintyInfo {
    prediction_entropy?: number;
    confidence_interval?: {
        lower: number;
        upper: number;
    };
    calibration_score?: number; // 0-1 range
}

// Model Explainability
export interface ExplainabilityInfo {
    attention_weights?: number[];
    feature_importance?: Record<string, number>;
    grad_cam?: string; // Path to visualization file
}

// AI Model Provenance
export interface ModelProvenance {
    annotator_type: 'ai';
    annotator_id?: string;
    timestamp: string; // ISO 8601
    tool_version?: string;
    session_id?: string;
}

// Model Output Extension
export interface ModelOutput {
    inference_meta: InferenceMetadata;
    provenance: ModelProvenance;
    comparison_target?: string; // ID of human annotation for comparison
    ensemble_info?: EnsembleInfo;
    uncertainty?: UncertaintyInfo;
    explainability?: ExplainabilityInfo;
}

// Advanced Musical Analysis
export interface MusicalElement {
    element_type: 'note' | 'chord' | 'rhythm' | 'tempo' | 'key' | 'time_signature' |
                  'dynamics' | 'articulation' | 'timbre' | 'harmony' | 'melody' |
                  'structure' | 'genre' | 'style' | 'instrument' | 'voice';
    value: string | number | Record<string, any>;
    confidence?: number; // 0-1 range
    attributes?: Record<string, any>;
}

export interface MusicalStructure {
    level: 'note' | 'beat' | 'measure' | 'phrase' | 'section' | 'movement' | 'piece';
    parent_id?: string;
    children_ids?: string[];
    time_range: {
        start_sec: number;
        end_sec: number;
    };
    label?: string;
    attributes?: Record<string, any>;
}

export interface MusicalAnalysis {
    tempo?: number;
    tempo_confidence?: number;
    key_signature?: string; // e.g., 'C major', 'A minor'
    key_confidence?: number;
    time_signature?: string; // e.g., '4/4', '3/4'
    time_signature_confidence?: number;
    genre?: string;
    genre_confidence?: number;
    energy?: number; // 0-1 range
    valence?: number; // 0-1 range (positivity)
    danceability?: number; // 0-1 range
    instrumentalness?: number; // 0-1 range (0=vocal, 1=instrumental)
    acousticness?: number; // 0-1 range
    loudness?: number; // decibels
    speechiness?: number; // 0-1 range
}

export interface MusicalTiming {
    onset_times?: number[]; // seconds
    beat_times?: number[]; // seconds
    downbeat_times?: number[]; // seconds
}

export interface MusicalPatterns {
    chord_progressions?: Array<Record<string, any>>;
    melodic_patterns?: Array<Record<string, any>>;
    rhythmic_patterns?: Array<Record<string, any>>;
    harmonic_analysis?: Record<string, any>;
}

export interface AdvancedMusicalData {
    musical_elements?: MusicalElement[];
    musical_structure?: MusicalStructure[];
    musical_analysis?: MusicalAnalysis;
    musical_timing?: MusicalTiming;
    musical_patterns?: MusicalPatterns;
}

export interface AudioProtocolData {
    protocol_version: string;
    path: string;
    theory: TheoryDetails;
    semantic_description: SemanticDescription;
    audio_metadata?: AudioMetadata;
    audio_features?: AudioFeatures;
    spectral_features?: SpectralFeatures;
    model_output?: ModelOutput;
    advanced_musical_data?: AdvancedMusicalData;
}
