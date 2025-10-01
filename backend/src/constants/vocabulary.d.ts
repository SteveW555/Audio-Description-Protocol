/**
 * Backend Vocabulary Constants
 *
 * Re-exports vocabulary from wizard/src/constants/vocabulary.ts (single source of truth)
 * with necessary adaptations for backend usage.
 *
 * NOTE: This file imports from the wizard module. If the import path breaks,
 * you may need to copy vocabulary data temporarily or set up a monorepo structure.
 */
/**
 * Vocabulary for random description generation
 * Sourced from wizard/src/constants/vocabulary.ts
 */
export declare const VOCABULARY: {
    readonly mood: string[];
    readonly energy: string[];
    readonly texture: string[];
    readonly primary_genre: ("Electronic" | "Rock" | "Pop" | "Hip-Hop" | "R&B / Soul" | "Jazz" | "Blues" | "Country" | "Classical" | "Folk" | "Latin" | "Reggae" | "World" | "Soundtrack" | "Ambient" | "Spoken Word" | "Sound Effect")[];
    readonly subgenres: {
        readonly electronic: readonly ["dance", "disco", "downtempo", "drum_and_bass", "edm", "glitch", "house", "idm", "synthwave", "techno", "trance", "chiptune"];
        readonly rock: readonly ["alternative_rock", "goth_rock", "indie_rock", "metal", "post-rock", "progressive_rock", "psychedelic_rock", "punk_rock", "surf_rock"];
        readonly pop: readonly ["art_pop", "bubblegum_pop", "dance-pop", "dream_pop", "euro_pop", "hyperpop", "indie_pop", "jangle_pop", "synth-pop"];
        readonly hip_hop: readonly ["abstract_hip_hop", "boom-bap", "cloud_rap", "conscious_hip_hop", "drill", "g_funk", "gangsta_rap", "lo-fi_hip_hop", "trap"];
        readonly rnb_soul: readonly ["contemporary_rnb", "funk", "motown", "neo-soul", "philly_soul", "psychedelic_soul", "quiet_storm"];
        readonly jazz: readonly ["acid_jazz", "bebop", "cool_jazz", "free_jazz", "jazz_fusion", "latin_jazz", "modal_jazz", "swing"];
        readonly blues: readonly ["acoustic_blues", "chicago_blues", "delta_blues", "electric_blues"];
        readonly country: readonly ["americana", "bakersfield_sound", "bluegrass", "honky_tonk", "outlaw_country"];
        readonly classical: readonly ["baroque", "classical_period", "contemporary_classical", "minimalism", "orchestral", "romantic_era"];
        readonly folk: readonly ["americana", "anti-folk", "bluegrass", "folk-rock", "freak_folk", "neofolk", "singer-songwriter", "traditional_folk"];
        readonly latin: readonly ["bachata", "bossa_nova", "cumbia", "reggaeton", "salsa"];
        readonly reggae: readonly ["dancehall", "dub", "rocksteady", "ska"];
        readonly world: readonly ["afrobeat", "celtic", "flamenco"];
        readonly soundtrack: readonly ["cinematic", "epic_score", "film_score", "video_game_music"];
        readonly ambient: readonly ["dark_ambient", "drone", "soundscape", "space_music"];
        readonly spoken_word: readonly ["audiobook", "comedy", "podcast", "poetry"];
        readonly sound_effect: readonly ["abstract_sound", "creature_sound", "field_recording", "foley", "weather"];
    };
    readonly instrument: ("electric_guitar" | "acoustic_guitar" | "bass_guitar" | "double_bass" | "synthesizer" | "bass_synthesizer" | "piano" | "electric_piano" | "organ" | "drums" | "kick_drum" | "snare_drum" | "hi-hat" | "cymbals" | "drum_machine" | "sampler" | "strings" | "violin" | "cello" | "brass" | "trumpet" | "saxophone" | "flute" | "vocals")[];
    readonly instrument_roles: {
        readonly electric_guitar: readonly ["lead", "rhythm", "fill", "melody", "solo", "riffs"];
        readonly acoustic_guitar: readonly ["rhythm", "melody", "fingerpicked", "chordal"];
        readonly bass_guitar: readonly ["bass", "rhythm", "melody", "ostinato"];
        readonly double_bass: readonly ["bass", "walking_bassline", "melody", "solo"];
        readonly synthesizer: readonly ["lead", "pad", "arpeggio", "melody", "atmosphere", "fx", "bass"];
        readonly bass_synthesizer: readonly ["bass", "sub-bass", "arpeggio", "ostinato"];
        readonly piano: readonly ["melody", "harmony", "chordal", "rhythm", "lead"];
        readonly electric_piano: readonly ["harmony", "chordal", "melody"];
        readonly organ: readonly ["pad", "harmony", "lead", "chordal"];
        readonly drums: readonly ["percussion", "rhythm", "fill", "beat"];
        readonly kick_drum: readonly ["percussion", "rhythm"];
        readonly snare_drum: readonly ["percussion", "rhythm", "backbeat"];
        readonly strings: readonly ["pad", "harmony", "melody", "orchestral_bed", "ostinato"];
        readonly brass: readonly ["melody", "harmony", "fanfare", "stab"];
        readonly vocals: readonly ["lead", "backing", "harmony", "ad-libs"];
    };
    readonly instrument_descriptors: {
        readonly electric_guitar: readonly ["distorted", "clean", "crunchy", "wailing", "overdriven", "fuzzy", "chugging", "riff"];
        readonly acoustic_guitar: readonly ["strummed", "fingerpicked", "bright", "warm", "nylon", "steel-string"];
        readonly bass_guitar: readonly ["deep", "funky", "slapped", "fretless", "driving", "growling", "sub-bass"];
        readonly double_bass: readonly ["bowed", "plucked", "warm", "deep", "jazzy"];
        readonly synthesizer: readonly ["soaring", "arpeggiated", "bubbly", "harsh", "evolving", "digital", "analog", "plucked"];
        readonly bass_synthesizer: readonly ["deep", "wobbling", "sub-bass", "acidic", "driving"];
        readonly piano: readonly ["percussive", "gentle", "honky-tonk", "grand", "bright"];
        readonly electric_piano: readonly ["warm", "bell-like", "rhodes", "wurlitzer"];
        readonly organ: readonly ["church", "hammond", "rock", "drawbar"];
        readonly drums: readonly ["heavy", "light", "tight", "loose", "shuffling", "tribal", "acoustic"];
        readonly kick_drum: readonly ["punchy", "booming", "tight", "deep", "four-on-the-floor", "lofi"];
        readonly snare_drum: readonly ["sharp", "fat", "crisp", "reverberant", "rimshot"];
        readonly drum_machine: readonly ["electronic", "808", "909", "processed", "glitchy"];
        readonly strings: readonly ["lush", "sweeping", "pizzicato", "staccato", "orchestral"];
        readonly brass: readonly ["blaring", "muted", "majestic", "jazzy"];
        readonly vocals: readonly ["breathy", "powerful", "operatic", "raspy", "autotuned", "harmonized"];
    };
    readonly vocals_presence: ("lead" | "backing" | "choir" | "sampled" | "spoken_word" | "ad-libs")[];
    readonly vocals_gender: ("male" | "female" | "mixed" | "androgynous")[];
    readonly vocals_style: ("singing" | "rapping" | "screaming" | "growling" | "falsetto" | "whispering" | "operatic")[];
};
//# sourceMappingURL=vocabulary.d.ts.map