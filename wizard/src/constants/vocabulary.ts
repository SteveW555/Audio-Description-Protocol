import { InstrumentationEntry } from '../types/protocol';
import { VOCABULARY_MET, TERMS_BY_FREQUENCY } from './taxonomy';

// Taxonomy metadata for terms (kept for backward compatibility)
export interface TermMetadata {
    id: string;
    term: string;
    freq: 'rare' | 'infrequent' | 'frequent' | 'ubiquitous';
    desc: string;
    category: 'Mood' | 'Energy' | 'Texture';
    cluster?: string;
}

// Frequency-based term groups for UI organization.
export const TERM_FREQUENCY_GROUPS = {
    ubiquitous: ['ubiquitous'],  // Very common terms
    frequent: ['frequent'],      // Common terms
    infrequent: ['infrequent'],  // Unusual terms
    rare: ['rare']                // Very rare terms
} as const;

// MET vocabulary imported from single source of truth (taxonomy.ts)
// This replaces the previous  hard-coded arrays
export const VOCABULARY = {
    mood: VOCABULARY_MET.mood as readonly string[],
    energy: VOCABULARY_MET.energy as readonly string[],
    texture: VOCABULARY_MET.texture as readonly string[],

    primary_genres: ['Electronic', 'Rock', 'Pop', 'Hip-Hop', 'R&B / Soul', 'Jazz', 'Blues', 'Country', 'Classical', 'Folk', 'Latin', 'Reggae', 'World', 'Soundtrack', 'Ambient', 'Spoken Word', 'Sound Effect'] as const,
    secondary_genres: {
        electronic: ['dance', 'disco', 'downtempo', 'drum_and_bass', 'edm', 'glitch', 'house', 'idm', 'synthwave', 'techno', 'trance', 'chiptune'],
        rock: ['alternative_rock', 'goth_rock', 'indie_rock', 'metal', 'post-rock', 'progressive_rock', 'psychedelic_rock', 'punk_rock', 'surf_rock'],
        pop: ['art_pop', 'bubblegum_pop', 'dance-pop', 'dream_pop', 'euro_pop', 'hyperpop', 'indie_pop', 'jangle_pop', 'synth-pop'],
        hip_hop: ['abstract_hip_hop', 'boom-bap', 'cloud_rap', 'conscious_hip_hop', 'drill', 'g_funk', 'gangsta_rap', 'lo-fi_hip_hop', 'trap'],
        rnb_soul: ['contemporary_rnb', 'funk', 'motown', 'neo-soul', 'philly_soul', 'psychedelic_soul', 'quiet_storm'],
        jazz: ['acid_jazz', 'bebop', 'cool_jazz', 'free_jazz', 'jazz_fusion', 'latin_jazz', 'modal_jazz', 'swing'],
        blues: ['acoustic_blues', 'chicago_blues', 'delta_blues', 'electric_blues'],
        country: ['americana', 'bakersfield_sound', 'bluegrass', 'honky_tonk', 'outlaw_country'],
        classical: ['baroque', 'classical_period', 'contemporary_classical', 'minimalism', 'orchestral', 'romantic_era'],
        folk: ['americana', 'anti-folk', 'bluegrass', 'folk-rock', 'freak_folk', 'neofolk', 'singer-songwriter', 'traditional_folk'],
        latin: ['bachata', 'bossa_nova', 'cumbia', 'reggaeton', 'salsa'],
        reggae: ['dancehall', 'dub', 'rocksteady', 'ska'],
        world: ['afrobeat', 'celtic', 'flamenco'],
        soundtrack: ['cinematic', 'epic_score', 'film_score', 'video_game_music'],
        ambient: ['dark_ambient', 'drone', 'soundscape', 'space_music'],
        spoken_word: ['audiobook', 'comedy', 'podcast', 'poetry'],
        sound_effect: ['abstract_sound', 'creature_sound', 'field_recording', 'foley', 'weather'],
    } as const,
    instrument: ['electric_guitar', 'acoustic_guitar', 'bass_guitar', 'double_bass', 'synthesizer', 'bass_synthesizer', 'piano', 'electric_piano', 'organ', 'drums', 'kick_drum', 'snare_drum', 'hi-hat', 'cymbals', 'drum_machine', 'sampler', 'strings', 'violin', 'cello', 'brass', 'trumpet', 'saxophone', 'flute', 'vocals'] as const,
    key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const,
    scale: ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian', 'chromatic', 'pentatonic_major', 'pentatonic_minor'] as const,
    vocals_presence: ['none', 'lead', 'backing', 'choir', 'sampled', 'spoken_word', 'ad-libs'] as const,
    vocals_gender: ['male', 'female', 'mixed', 'androgynous'] as const,
    vocals_style: ['singing', 'rapping', 'screaming', 'growling', 'falsetto', 'whispering', 'operatic'] as const,
    general_roles: ['lead', 'rhythm', 'melody', 'harmony', 'bass', 'percussion', 'pad', 'atmospheric', 'fx', 'counter-melody', 'ostinato', 'fill', 'arpeggio', 'chordal'] as const,
    instrument_roles: {
        electric_guitar: ['lead', 'rhythm', 'fill', 'melody', 'solo', 'riffs'],
        acoustic_guitar: ['rhythm', 'melody', 'fingerpicked', 'chordal'],
        bass_guitar: ['bass', 'rhythm', 'melody', 'ostinato'],
        double_bass: ['bass', 'walking_bassline', 'melody', 'solo'],
        synthesizer: ['lead', 'pad', 'arpeggio', 'melody', 'atmosphere', 'fx', 'bass'],
        bass_synthesizer: ['bass', 'sub-bass', 'arpeggio', 'ostinato'],
        piano: ['melody', 'harmony', 'chordal', 'rhythm', 'lead'],
        electric_piano: ['harmony', 'chordal', 'melody'],
        organ: ['pad', 'harmony', 'lead', 'chordal'],
        drums: ['percussion', 'rhythm', 'fill', 'beat'],
        kick_drum: ['percussion', 'rhythm'],
        snare_drum: ['percussion', 'rhythm', 'backbeat'],
        strings: ['pad', 'harmony', 'melody', 'orchestral_bed', 'ostinato'],
        brass: ['melody', 'harmony', 'fanfare', 'stab'],
        vocals: ['lead', 'backing', 'harmony', 'ad-libs'],
    } as const,
    general_descriptors: ['reverberant', 'dry', 'processed', 'present', 'distant', 'warm', 'bright', 'dark', 'lofi'] as const,
    instrument_descriptors: {
        electric_guitar: ['distorted', 'clean', 'crunchy', 'wailing', 'overdriven', 'fuzzy', 'chugging', 'riff'],
        acoustic_guitar: ['strummed', 'fingerpicked', 'bright', 'warm', 'nylon', 'steel-string'],
        bass_guitar: ['deep', 'funky', 'slapped', 'fretless', 'driving', 'growling', 'sub-bass'],
        double_bass: ['bowed', 'plucked', 'warm', 'deep', 'jazzy'],
        synthesizer: ['soaring', 'arpeggiated', 'bubbly', 'harsh', 'evolving', 'digital', 'analog', 'plucked'],
        bass_synthesizer: ['deep', 'wobbling', 'sub-bass', 'acidic', 'driving'],
        piano: ['percussive', 'gentle', 'honky-tonk', 'grand', 'bright'],
        electric_piano: ['warm', 'bell-like', 'rhodes', 'wurlitzer'],
        organ: ['church', 'hammond', 'rock', 'drawbar'],
        drums: ['heavy', 'light', 'tight', 'loose', 'shuffling', 'tribal', 'acoustic'],
        kick_drum: ['punchy', 'booming', 'tight', 'deep', 'four-on-the-floor', 'lofi'],
        snare_drum: ['sharp', 'fat', 'crisp', 'reverberant', 'rimshot'],
        drum_machine: ['electronic', '808', '909', 'processed', 'glitchy'],
        strings: ['lush', 'sweeping', 'pizzicato', 'staccato', 'orchestral'],
        brass: ['blaring', 'muted', 'majestic', 'jazzy'],
        vocals: ['breathy', 'powerful', 'operatic', 'raspy', 'autotuned', 'harmonized'],
    } as const,
} as const;

export type InstrumentRolesMap = typeof VOCABULARY.instrument_roles;
export type InstrumentDescriptorsMap = typeof VOCABULARY.instrument_descriptors;
export type SecondaryGenresMap = typeof VOCABULARY.secondary_genres;

export const DEFAULT_INSTRUMENT: InstrumentationEntry = {
    instrument: '',
    role: '',
    descriptors: [],
};

// Taxonomy-based term organization by frequency (imported from taxonomy.ts)
export const MOOD_TERMS_BY_FREQUENCY = TERMS_BY_FREQUENCY.Mood;
export const ENERGY_TERMS_BY_FREQUENCY = TERMS_BY_FREQUENCY.Energy;
export const TEXTURE_TERMS_BY_FREQUENCY = TERMS_BY_FREQUENCY.Texture;

// Helper functions for taxonomy-based UI
export function getTermsByFrequency(category: 'mood' | 'energy' | 'texture', frequency: 'ubiquitous' | 'frequent' | 'infrequent' | 'rare'): readonly string[] {
    const categoryMap = {
        mood: TERMS_BY_FREQUENCY.Mood,
        energy: TERMS_BY_FREQUENCY.Energy,
        texture: TERMS_BY_FREQUENCY.Texture
    };
    return categoryMap[category]?.[frequency] || [];
}

export function getAllTermsForCategory(category: 'mood' | 'energy' | 'texture') {
    const allFrequencies = ['ubiquitous', 'frequent', 'infrequent', 'rare'] as const;
    return allFrequencies.flatMap(freq => getTermsByFrequency(category, freq));
}
