/**
 * Random Description Generator
 *
 * Generates randomized musical descriptions for testing the AI phrase generation feature.
 * Imports vocabulary from single source of truth via backend/src/constants/vocabulary.ts
 */
/**
 * Generates random instrument configuration with role and descriptors
 *
 * @returns Object containing instrument, role, and descriptors
 */
export declare function generateRandomInstrument(): {
    instrument: "electric_guitar" | "acoustic_guitar" | "bass_guitar" | "double_bass" | "synthesizer" | "bass_synthesizer" | "piano" | "electric_piano" | "organ" | "drums" | "kick_drum" | "snare_drum" | "hi-hat" | "cymbals" | "drum_machine" | "sampler" | "strings" | "violin" | "cello" | "brass" | "trumpet" | "saxophone" | "flute" | "vocals";
    role: "fill" | "lead" | "backing" | "ad-libs" | "rhythm" | "melody" | "harmony" | "bass" | "percussion" | "pad" | "fx" | "ostinato" | "arpeggio" | "chordal" | "solo" | "fingerpicked" | "walking_bassline" | "sub-bass" | "orchestral_bed" | "stab" | "fanfare" | "beat" | "backbeat" | "riffs" | "atmosphere";
    descriptors: ("light" | "gentle" | "driving" | "powerful" | "harsh" | "majestic" | "punchy" | "soaring" | "sweeping" | "bright" | "crisp" | "warm" | "lush" | "raspy" | "distorted" | "heavy" | "acoustic" | "breathy" | "digital" | "analog" | "crunchy" | "reverberant" | "growling" | "operatic" | "fingerpicked" | "sub-bass" | "rock" | "clean" | "wailing" | "overdriven" | "fuzzy" | "chugging" | "strummed" | "nylon" | "steel-string" | "deep" | "funky" | "slapped" | "fretless" | "bowed" | "plucked" | "jazzy" | "arpeggiated" | "bubbly" | "evolving" | "wobbling" | "acidic" | "percussive" | "honky-tonk" | "grand" | "bell-like" | "rhodes" | "wurlitzer" | "church" | "hammond" | "drawbar" | "tight" | "loose" | "shuffling" | "tribal" | "booming" | "four-on-the-floor" | "sharp" | "fat" | "rimshot" | "pizzicato" | "staccato" | "orchestral" | "blaring" | "muted" | "autotuned" | "harmonized" | "lofi" | "riff")[];
};
/**
 * Generates random genre with primary and optional subgenres
 *
 * @returns Object containing primary genre and subgenres array
 */
export declare function generateRandomGenre(): {
    primary: "Electronic" | "Rock" | "Pop" | "Hip-Hop" | "R&B / Soul" | "Jazz" | "Blues" | "Country" | "Classical" | "Folk" | "Latin" | "Reggae" | "World" | "Soundtrack" | "Ambient" | "Spoken Word" | "Sound Effect";
    subgenres: string[];
};
/**
 * Generates random vocals configuration with presence, gender, style, and descriptors
 * Returns undefined 50% of the time to simulate optional vocals
 *
 * @returns Vocals object or undefined
 */
export declare function generateRandomVocals(): {
    presence: "lead" | "backing" | "choir" | "sampled" | "spoken_word" | "ad-libs";
    gender: "male" | "female" | "mixed" | "androgynous";
    style: "singing" | "rapping" | "screaming" | "growling" | "falsetto" | "whispering" | "operatic";
    descriptors: ("light" | "gentle" | "driving" | "powerful" | "harsh" | "majestic" | "punchy" | "soaring" | "sweeping" | "bright" | "crisp" | "warm" | "lush" | "raspy" | "distorted" | "heavy" | "acoustic" | "breathy" | "electronic" | "digital" | "processed" | "analog" | "glitchy" | "crunchy" | "reverberant" | "growling" | "operatic" | "fingerpicked" | "sub-bass" | "rock" | "clean" | "wailing" | "overdriven" | "fuzzy" | "chugging" | "strummed" | "nylon" | "steel-string" | "deep" | "funky" | "slapped" | "fretless" | "bowed" | "plucked" | "jazzy" | "arpeggiated" | "bubbly" | "evolving" | "wobbling" | "acidic" | "percussive" | "honky-tonk" | "grand" | "bell-like" | "rhodes" | "wurlitzer" | "church" | "hammond" | "drawbar" | "tight" | "loose" | "shuffling" | "tribal" | "booming" | "four-on-the-floor" | "sharp" | "fat" | "rimshot" | "808" | "909" | "pizzicato" | "staccato" | "orchestral" | "blaring" | "muted" | "autotuned" | "harmonized" | "lofi" | "riff")[];
} | undefined;
/**
 * Generates a random musical description for testing
 *
 * @returns Structured wizard data object with randomized values
 */
export declare function generateRandomDescription(): {
    bpm: number;
    vocals?: {
        presence: "lead" | "backing" | "choir" | "sampled" | "spoken_word" | "ad-libs";
        gender: "male" | "female" | "mixed" | "androgynous";
        style: "singing" | "rapping" | "screaming" | "growling" | "falsetto" | "whispering" | "operatic";
        descriptors: ("light" | "gentle" | "driving" | "powerful" | "harsh" | "majestic" | "punchy" | "soaring" | "sweeping" | "bright" | "crisp" | "warm" | "lush" | "raspy" | "distorted" | "heavy" | "acoustic" | "breathy" | "electronic" | "digital" | "processed" | "analog" | "glitchy" | "crunchy" | "reverberant" | "growling" | "operatic" | "fingerpicked" | "sub-bass" | "rock" | "clean" | "wailing" | "overdriven" | "fuzzy" | "chugging" | "strummed" | "nylon" | "steel-string" | "deep" | "funky" | "slapped" | "fretless" | "bowed" | "plucked" | "jazzy" | "arpeggiated" | "bubbly" | "evolving" | "wobbling" | "acidic" | "percussive" | "honky-tonk" | "grand" | "bell-like" | "rhodes" | "wurlitzer" | "church" | "hammond" | "drawbar" | "tight" | "loose" | "shuffling" | "tribal" | "booming" | "four-on-the-floor" | "sharp" | "fat" | "rimshot" | "808" | "909" | "pizzicato" | "staccato" | "orchestral" | "blaring" | "muted" | "autotuned" | "harmonized" | "lofi" | "riff")[];
    } | undefined;
    genre: {
        subgenres?: ("downtempo" | "cinematic" | "orchestral" | "dance" | "disco" | "drum_and_bass" | "edm" | "glitch" | "house" | "idm" | "synthwave" | "techno" | "trance" | "chiptune" | "alternative_rock" | "goth_rock" | "indie_rock" | "metal" | "post-rock" | "progressive_rock" | "psychedelic_rock" | "punk_rock" | "surf_rock" | "art_pop" | "bubblegum_pop" | "dance-pop" | "dream_pop" | "euro_pop" | "hyperpop" | "indie_pop" | "jangle_pop" | "synth-pop" | "abstract_hip_hop" | "boom-bap" | "cloud_rap" | "conscious_hip_hop" | "drill" | "g_funk" | "gangsta_rap" | "lo-fi_hip_hop" | "trap" | "contemporary_rnb" | "funk" | "motown" | "neo-soul" | "philly_soul" | "psychedelic_soul" | "quiet_storm" | "acid_jazz" | "bebop" | "cool_jazz" | "free_jazz" | "jazz_fusion" | "latin_jazz" | "modal_jazz" | "swing" | "acoustic_blues" | "chicago_blues" | "delta_blues" | "electric_blues" | "americana" | "bakersfield_sound" | "bluegrass" | "honky_tonk" | "outlaw_country" | "baroque" | "classical_period" | "contemporary_classical" | "minimalism" | "romantic_era" | "anti-folk" | "folk-rock" | "freak_folk" | "neofolk" | "singer-songwriter" | "traditional_folk" | "bachata" | "bossa_nova" | "cumbia" | "reggaeton" | "salsa" | "dancehall" | "dub" | "rocksteady" | "ska" | "afrobeat" | "celtic" | "flamenco" | "epic_score" | "film_score" | "video_game_music" | "dark_ambient" | "drone" | "soundscape" | "space_music" | "audiobook" | "comedy" | "podcast" | "poetry" | "abstract_sound" | "creature_sound" | "field_recording" | "foley" | "weather")[] | undefined;
        primary: "Electronic" | "Rock" | "Pop" | "Hip-Hop" | "R&B / Soul" | "Jazz" | "Blues" | "Country" | "Classical" | "Folk" | "Latin" | "Reggae" | "World" | "Soundtrack" | "Ambient" | "Spoken Word" | "Sound Effect";
    };
    mood: string[];
    energy: string[];
    texture: string[];
    instrumentation: {
        instrument: "electric_guitar" | "acoustic_guitar" | "bass_guitar" | "double_bass" | "synthesizer" | "bass_synthesizer" | "piano" | "electric_piano" | "organ" | "drums" | "kick_drum" | "snare_drum" | "hi-hat" | "cymbals" | "drum_machine" | "sampler" | "strings" | "violin" | "cello" | "brass" | "trumpet" | "saxophone" | "flute" | "vocals";
        role: "fill" | "lead" | "backing" | "ad-libs" | "rhythm" | "melody" | "harmony" | "bass" | "percussion" | "pad" | "fx" | "ostinato" | "arpeggio" | "chordal" | "solo" | "fingerpicked" | "walking_bassline" | "sub-bass" | "orchestral_bed" | "stab" | "fanfare" | "beat" | "backbeat" | "riffs" | "atmosphere";
        descriptors: ("light" | "gentle" | "driving" | "powerful" | "harsh" | "majestic" | "punchy" | "soaring" | "sweeping" | "bright" | "crisp" | "warm" | "lush" | "raspy" | "distorted" | "heavy" | "acoustic" | "breathy" | "digital" | "analog" | "crunchy" | "reverberant" | "growling" | "operatic" | "fingerpicked" | "sub-bass" | "rock" | "clean" | "wailing" | "overdriven" | "fuzzy" | "chugging" | "strummed" | "nylon" | "steel-string" | "deep" | "funky" | "slapped" | "fretless" | "bowed" | "plucked" | "jazzy" | "arpeggiated" | "bubbly" | "evolving" | "wobbling" | "acidic" | "percussive" | "honky-tonk" | "grand" | "bell-like" | "rhodes" | "wurlitzer" | "church" | "hammond" | "drawbar" | "tight" | "loose" | "shuffling" | "tribal" | "booming" | "four-on-the-floor" | "sharp" | "fat" | "rimshot" | "pizzicato" | "staccato" | "orchestral" | "blaring" | "muted" | "autotuned" | "harmonized" | "lofi" | "riff")[];
    }[];
};
/**
 * Generates random Mood, Energy, Texture (MET) terms with weighted distribution
 *
 * Uses weighted count selection (60% = 2, 30% = 1, 10% = 3) and enforces
 * maximum 6 total terms across all categories. Terms are selected with
 * popularity weighting (ubiquitous > frequent > infrequent > rare).
 *
 * @returns Object containing mood, energy, and texture term arrays
 */
export declare function generateRandomMET(): {
    mood: string[];
    energy: string[];
    texture: string[];
};
/**
 * Generates multiple random descriptions
 */
export declare function generateRandomDescriptions(count?: number): {
    bpm: number;
    vocals?: {
        presence: "lead" | "backing" | "choir" | "sampled" | "spoken_word" | "ad-libs";
        gender: "male" | "female" | "mixed" | "androgynous";
        style: "singing" | "rapping" | "screaming" | "growling" | "falsetto" | "whispering" | "operatic";
        descriptors: ("light" | "gentle" | "driving" | "powerful" | "harsh" | "majestic" | "punchy" | "soaring" | "sweeping" | "bright" | "crisp" | "warm" | "lush" | "raspy" | "distorted" | "heavy" | "acoustic" | "breathy" | "electronic" | "digital" | "processed" | "analog" | "glitchy" | "crunchy" | "reverberant" | "growling" | "operatic" | "fingerpicked" | "sub-bass" | "rock" | "clean" | "wailing" | "overdriven" | "fuzzy" | "chugging" | "strummed" | "nylon" | "steel-string" | "deep" | "funky" | "slapped" | "fretless" | "bowed" | "plucked" | "jazzy" | "arpeggiated" | "bubbly" | "evolving" | "wobbling" | "acidic" | "percussive" | "honky-tonk" | "grand" | "bell-like" | "rhodes" | "wurlitzer" | "church" | "hammond" | "drawbar" | "tight" | "loose" | "shuffling" | "tribal" | "booming" | "four-on-the-floor" | "sharp" | "fat" | "rimshot" | "808" | "909" | "pizzicato" | "staccato" | "orchestral" | "blaring" | "muted" | "autotuned" | "harmonized" | "lofi" | "riff")[];
    } | undefined;
    genre: {
        subgenres?: ("downtempo" | "cinematic" | "orchestral" | "dance" | "disco" | "drum_and_bass" | "edm" | "glitch" | "house" | "idm" | "synthwave" | "techno" | "trance" | "chiptune" | "alternative_rock" | "goth_rock" | "indie_rock" | "metal" | "post-rock" | "progressive_rock" | "psychedelic_rock" | "punk_rock" | "surf_rock" | "art_pop" | "bubblegum_pop" | "dance-pop" | "dream_pop" | "euro_pop" | "hyperpop" | "indie_pop" | "jangle_pop" | "synth-pop" | "abstract_hip_hop" | "boom-bap" | "cloud_rap" | "conscious_hip_hop" | "drill" | "g_funk" | "gangsta_rap" | "lo-fi_hip_hop" | "trap" | "contemporary_rnb" | "funk" | "motown" | "neo-soul" | "philly_soul" | "psychedelic_soul" | "quiet_storm" | "acid_jazz" | "bebop" | "cool_jazz" | "free_jazz" | "jazz_fusion" | "latin_jazz" | "modal_jazz" | "swing" | "acoustic_blues" | "chicago_blues" | "delta_blues" | "electric_blues" | "americana" | "bakersfield_sound" | "bluegrass" | "honky_tonk" | "outlaw_country" | "baroque" | "classical_period" | "contemporary_classical" | "minimalism" | "romantic_era" | "anti-folk" | "folk-rock" | "freak_folk" | "neofolk" | "singer-songwriter" | "traditional_folk" | "bachata" | "bossa_nova" | "cumbia" | "reggaeton" | "salsa" | "dancehall" | "dub" | "rocksteady" | "ska" | "afrobeat" | "celtic" | "flamenco" | "epic_score" | "film_score" | "video_game_music" | "dark_ambient" | "drone" | "soundscape" | "space_music" | "audiobook" | "comedy" | "podcast" | "poetry" | "abstract_sound" | "creature_sound" | "field_recording" | "foley" | "weather")[] | undefined;
        primary: "Electronic" | "Rock" | "Pop" | "Hip-Hop" | "R&B / Soul" | "Jazz" | "Blues" | "Country" | "Classical" | "Folk" | "Latin" | "Reggae" | "World" | "Soundtrack" | "Ambient" | "Spoken Word" | "Sound Effect";
    };
    mood: string[];
    energy: string[];
    texture: string[];
    instrumentation: {
        instrument: "electric_guitar" | "acoustic_guitar" | "bass_guitar" | "double_bass" | "synthesizer" | "bass_synthesizer" | "piano" | "electric_piano" | "organ" | "drums" | "kick_drum" | "snare_drum" | "hi-hat" | "cymbals" | "drum_machine" | "sampler" | "strings" | "violin" | "cello" | "brass" | "trumpet" | "saxophone" | "flute" | "vocals";
        role: "fill" | "lead" | "backing" | "ad-libs" | "rhythm" | "melody" | "harmony" | "bass" | "percussion" | "pad" | "fx" | "ostinato" | "arpeggio" | "chordal" | "solo" | "fingerpicked" | "walking_bassline" | "sub-bass" | "orchestral_bed" | "stab" | "fanfare" | "beat" | "backbeat" | "riffs" | "atmosphere";
        descriptors: ("light" | "gentle" | "driving" | "powerful" | "harsh" | "majestic" | "punchy" | "soaring" | "sweeping" | "bright" | "crisp" | "warm" | "lush" | "raspy" | "distorted" | "heavy" | "acoustic" | "breathy" | "digital" | "analog" | "crunchy" | "reverberant" | "growling" | "operatic" | "fingerpicked" | "sub-bass" | "rock" | "clean" | "wailing" | "overdriven" | "fuzzy" | "chugging" | "strummed" | "nylon" | "steel-string" | "deep" | "funky" | "slapped" | "fretless" | "bowed" | "plucked" | "jazzy" | "arpeggiated" | "bubbly" | "evolving" | "wobbling" | "acidic" | "percussive" | "honky-tonk" | "grand" | "bell-like" | "rhodes" | "wurlitzer" | "church" | "hammond" | "drawbar" | "tight" | "loose" | "shuffling" | "tribal" | "booming" | "four-on-the-floor" | "sharp" | "fat" | "rimshot" | "pizzicato" | "staccato" | "orchestral" | "blaring" | "muted" | "autotuned" | "harmonized" | "lofi" | "riff")[];
    }[];
}[];
//# sourceMappingURL=randomDescription.d.ts.map