/**
 * Backend Vocabulary Constants
 *
 * Vocabulary data copied from wizard/src/constants/vocabulary.ts to avoid cross-folder imports.
 * This makes the backend self-contained for Railway deployment.
 *
 * NOTE: If wizard vocabulary changes, this file needs to be updated manually.
 */
/**
 * Vocabulary for random description generation
 * Copied from wizard/src/constants/vocabulary.ts (with MET terms from taxonomy.ts)
 */
export declare const VOCABULARY: {
    readonly mood: readonly ["upbeat", "energetic", "joyful", "positive", "happy", "cheerful", "uplifting", "hopeful", "playful", "romantic", "sentimental", "triumphant", "heroic", "optimistic", "euphoric", "exuberant", "ecstatic", "elated", "celebratory", "festive", "inspiring", "proud", "sparkly", "thrilling", "peaceful", "calm", "relaxed", "serene", "dreamy", "tranquil", "meditative", "soothing", "gentle", "contemplative", "restful", "ethereal", "atmospheric", "flowing", "smooth", "gossamer", "dark", "melancholic", "sad", "somber", "brooding", "chilling", "fearful", "mournful", "gloomy", "haunting", "moody", "desolate", "forlorn", "wistful", "tragic", "lonely", "nauseating", "ominous", "painful", "disturbing", "shadowy", "plaintive", "negative", "intense", "aggressive", "driving", "powerful", "forceful", "fierce", "raw", "edgy", "explosive", "menacing", "angry", "violent", "furious", "tense", "harsh", "thunderous", "blistering", "snarling", "annoying", "anxious", "agitated", "defiant", "unsettling", "restless", "chaotic", "mysterious", "enigmatic", "ethereal-ambience", "otherworldly", "mystical", "cryptic", "elusive", "veiled", "obscure", "twilight", "liminal", "awe-inspiring", "entrancing", "majestic", "puzzling", "spine-tingling", "epic", "strange", "transcendent", "cosmic", "panoramic", "tender", "affectionate", "compassionate", "intimate", "loving", "sensual", "warm-hearted", "sultry", "passionate", "yearning", "longing", "nostalgic", "reflective", "bittersweet", "reminiscent", "pensive", "poignant", "memory-laden", "retrospective"];
    readonly energy: readonly ["high-energy", "energetic", "driving", "vigorous", "propulsive", "pumping", "dynamic", "explosive", "kinetic", "punchy", "pulsating", "frenetic", "relentless", "urgent", "vibrant", "bouncy", "brisk", "electrifying", "exciting", "high-octane", "strong", "turbocharged", "thumping", "flowing", "steady", "moderate", "balanced", "measured", "rolling", "rhythmic", "groovy", "medium-energy", "cascading", "undulating", "swinging", "pulsing", "unhurried", "cruising", "mid-tempo", "paced", "laid-back", "low-energy", "ambient", "boring", "chill", "mellow", "gentle", "subdued", "restrained", "placid", "still", "relaxed", "downtempo", "languid", "serene", "hushed", "delicate", "soft", "sedate", "hypnotic", "tense", "anxious", "chaotic", "agitated", "erratic", "unstable", "jarring", "dissonant", "turbulent", "unsettling", "fragmented", "static", "restless", "jittery", "hectic", "disjointed", "expansive", "soaring", "lifting", "transcendent", "boundless", "sweeping", "majestic", "panoramic", "vast", "cosmic", "breathless", "gradual", "crescendoing", "swelling", "decaying", "wavering", "oscillating", "spiraling"];
    readonly texture: readonly ["bright", "crisp", "clear", "brilliant", "sparkling", "crystalline", "shimmering", "radiant", "gleaming", "airy", "polished", "pristine", "shiny", "luminous", "refined", "sleek", "elegant", "sophisticated", "seamless", "effortless", "fluid", "graceful", "smooth", "wet", "glassy", "muddy", "harsh", "buzzy", "distorted", "abrasive", "dissonant", "static", "glitchy", "crunchy", "ratty", "warm", "rich", "full", "lush", "creamy", "honeyed", "golden", "mellow", "rounded", "embracing", "enveloping", "cozy", "sumptuous", "velvety", "buttery", "silky", "soft", "layered", "complex", "rich-density", "full-bodied", "orchestrated", "intricate", "detailed", "multi-textured", "stratified", "elaborate", "polyphonic", "homophonic", "heterophonic", "dense", "thick", "gritty", "raspy", "coarse", "raw", "unprocessed", "grainy", "rough", "jagged", "raw-finish", "unpolished", "edgy", "dry", "dark", "murky", "shadowy", "veiled", "obscured", "heavy", "clouded", "muffled", "oppressive", "acoustic", "organic", "natural", "live", "authentic", "woody", "breathy", "human", "intimate", "close-miked", "hollow", "earthy", "fibrous", "resonant", "textured", "electronic", "synthetic", "digital", "processed", "programmed", "artificial", "computerized", "robotic", "futuristic", "modern", "cyber", "pixelated", "metallic", "analog", "mechanical", "challenging", "sparse", "minimalistic", "monophonic", "spacious", "reverberant", "intimate-space", "echoey", "atmospheric", "cinematic"];
    readonly primary_genre: readonly ["Dance", "Electronic", "Rock", "Pop", "Hip-Hop", "R&B / Soul", "Jazz", "Blues", "Country", "Classical", "Folk", "Latin", "Reggae", "World", "Soundtrack", "Ambient", "Spoken Word", "Sound Effect"];
    readonly subgenres: {
        readonly dance: readonly ["house", "tech_house", "techno", "trance", "edm", "disco", "electro", "dubstep", "garage", "hardstyle", "progressive_house", "deep_house", "minimal_techno"];
        readonly electronic: readonly ["downtempo", "drum_and_bass", "glitch", "idm", "synthwave", "chiptune"];
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
    readonly instrument: readonly ["electric_guitar", "acoustic_guitar", "bass_guitar", "double_bass", "synthesizer", "bass_synthesizer", "piano", "electric_piano", "organ", "drums", "kick_drum", "snare_drum", "hi-hat", "cymbals", "drum_machine", "sampler", "strings", "violin", "cello", "brass", "trumpet", "saxophone", "flute", "vocals"];
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
    readonly vocals_presence: readonly ["lead", "backing", "choir", "sampled", "spoken_word", "ad-libs"];
    readonly vocals_gender: readonly ["male", "female", "mixed", "androgynous"];
    readonly vocals_style: readonly ["singing", "rapping", "screaming", "growling", "falsetto", "whispering", "operatic"];
};
