import { InstrumentationEntry } from '../types/protocol';

export const VOCABULARY = {
    // Comprehensive mood descriptors from unified taxonomy
    mood: [
        // Positive / Uplifting
        'upbeat', 'energetic', 'joyful', 'happy', 'cheerful', 'uplifting', 'positive', 'hopeful', 'playful', 'romantic', 'sentimental', 'triumphant', 'heroic', 'optimistic', 'euphoric', 'exuberant', 'ecstatic', 'elated', 'celebratory', 'festive', 'inspiring', 'sparkly',
        // Calm / Peaceful
        'peaceful', 'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative', 'soothing', 'gentle', 'contemplative', 'restful', 'ethereal', 'atmospheric', 'flowing', 'smooth', 'gossamer',
        // Dark / Negative
        'dark', 'melancholic', 'sad', 'somber', 'brooding', 'mournful', 'gloomy', 'haunting', 'moody', 'desolate', 'forlorn', 'wistful', 'tragic', 'lonely', 'ominous', 'disturbing', 'shadowy', 'plaintive', 'negative',
        // Intense / Aggressive
        'intense', 'aggressive', 'driving', 'powerful', 'forceful', 'fierce', 'raw', 'edgy', 'explosive', 'menacing', 'angry', 'violent', 'furious', 'tense', 'harsh', 'thunderous', 'blistering', 'snarling', 'chaotic',
        // Mysterious / Ambiguous
        'mysterious', 'enigmatic', 'otherworldly', 'mystical', 'cryptic', 'elusive', 'veiled', 'obscure', 'twilight', 'liminal', 'majestic', 'epic', 'strange',
        // Romantic / Tender
        'tender', 'affectionate', 'intimate', 'loving', 'sensual', 'warm-hearted', 'sultry', 'passionate', 'yearning', 'longing',
        // Nostalgic / Reflective
        'nostalgic', 'reflective', 'bittersweet', 'reminiscent', 'pensive', 'poignant', 'memory-laden', 'retrospective'
    ] as const,

    // Comprehensive energy descriptors from unified taxonomy
    energy: [
        // High / Positive Drive
        'high-energy', 'driving', 'vigorous', 'propulsive', 'pumping', 'dynamic', 'explosive', 'kinetic', 'punchy', 'pulsating', 'frenetic', 'relentless', 'urgent', 'vibrant', 'bouncy', 'brisk', 'electrifying', 'high-octane', 'turbocharged', 'thumping',
        // Medium / Flowing
        'flowing', 'steady', 'moderate', 'balanced', 'measured', 'rolling', 'rhythmic', 'groovy', 'medium-energy', 'cascading', 'undulating', 'swinging', 'pulsing', 'unhurried', 'cruising', 'mid-tempo', 'paced',
        // Low / Peaceful
        'laid-back', 'low-energy', 'ambient', 'chill', 'mellow', 'gentle', 'subdued', 'restrained', 'placid', 'still', 'relaxed', 'downtempo', 'languid', 'serene', 'hushed', 'delicate', 'soft', 'sedate', 'hypnotic',
        // Negative / Unstable
        'tense', 'anxious', 'chaotic', 'agitated', 'erratic', 'unstable', 'jarring', 'dissonant', 'turbulent', 'unsettling', 'fragmented', 'static', 'restless', 'jittery', 'hectic', 'disjointed',
        // Expansive / Other
        'expansive', 'soaring', 'lifting', 'transcendent', 'boundless', 'sweeping', 'majestic', 'panoramic', 'vast', 'cosmic', 'breathless', 'gradual', 'crescendoing', 'swelling', 'decaying', 'wavering', 'oscillating', 'spiraling'
    ] as const,

    // Comprehensive texture descriptors from unified taxonomy
    texture: [
        // Bright / Positive
        'bright', 'crisp', 'clear', 'brilliant', 'sparkling', 'crystalline', 'shimmering', 'radiant', 'gleaming', 'airy', 'polished', 'pristine', 'shiny', 'luminous',
        // Warm / Peaceful
        'warm', 'rich', 'full', 'lush', 'creamy', 'honeyed', 'golden', 'mellow', 'rounded', 'embracing', 'enveloping', 'cozy', 'sumptuous', 'velvety', 'buttery', 'silky', 'soft',
        // Dark / Negative
        'dark', 'muddy', 'harsh', 'gritty', 'murky', 'raspy', 'buzzy', 'distorted', 'coarse', 'abrasive', 'shadowy', 'veiled', 'obscured', 'heavy', 'dense', 'thick', 'clouded', 'muffled', 'oppressive',
        // Natural / Acoustic
        'acoustic', 'organic', 'natural', 'raw', 'live', 'authentic', 'unprocessed', 'woody', 'breathy', 'human', 'intimate', 'close-miked', 'hollow', 'earthy', 'fibrous', 'resonant', 'textured', 'grainy',
        // Synthetic / Electronic
        'electronic', 'synthetic', 'digital', 'processed', 'programmed', 'artificial', 'computerized', 'robotic', 'futuristic', 'cyber', 'pixelated', 'metallic', 'glassy', 'analog', 'mechanical', 'glitchy',
        // Density & Layering
        'layered', 'complex', 'full-bodied', 'orchestrated', 'intricate', 'detailed', 'multi-textured', 'stratified', 'elaborate', 'sparse', 'minimalistic', 'polyphonic', 'homophonic', 'monophonic', 'heterophonic',
        // Smooth / Refined
        'smooth', 'refined', 'sleek', 'elegant', 'sophisticated', 'seamless', 'effortless', 'fluid', 'graceful',
        // Rough / Gritty
        'rough', 'gritty', 'jagged', 'unpolished', 'edgy', 'crunchy', 'ratty',
        // Space & Atmosphere
        'spacious', 'reverberant', 'wet', 'dry', 'echoey', 'atmospheric', 'cinematic'
    ] as const,
    primary_genre: ['electronic', 'rock', 'pop', 'hip_hop', 'jazz', 'classical', 'folk', 'world', 'soundtrack', 'ambient', 'sound_effect'] as const,
    secondary_genre: ['dance', 'edm', 'house', 'techno', 'alternative_rock', 'metal', 'indie_pop', 'rnb', 'soul', 'blues', 'country', 'cinematic'] as const,
    subgenres: {
        electronic: ['progressive_house', 'tech_house', 'ambient_techno', 'synthwave', 'trap', 'downtempo', 'drum_and_bass'],
        rock: ['alternative_rock', 'indie_rock', 'punk_rock', 'progressive_rock', 'psychedelic_rock', 'heavy_metal', 'death_metal', 'progressive metal'],
        pop: ['indie_pop', 'synth-pop', 'dance-pop', 'hyperpop', 'bubblegum_pop', 'art_pop', 'euro_pop'],
        hip_hop: ['lo-fi_hip_hop', 'trap', 'boom-bap', 'gangsta_rap', 'conscious_hip_hop', 'cloud_rap'],
        jazz: ['cool_jazz', 'swing', 'bebop', 'modal_jazz', 'free_jazz', 'jazz_fusion'],
        classical: ['baroque', 'romantic_era', 'classical_period', 'contemporary_classical', 'minimalism', 'orchestral'],
        folk: ['bluegrass', 'folk-rock', 'singer-songwriter', 'americana', 'traditional_folk', 'freak_folk'],
        world: ['reggae', 'afrobeat', 'latin', 'celtic', 'bossa_nova', 'flamenco'],
        soundtrack: ['film_score', 'video_game_music', 'ambient_soundtrack', 'orchestral_soundtrack', 'cinematic'],
        ambient: ['ambient_techno', 'dark_ambient', 'drone', 'space_music', 'soundscape'],
        sound_effect: ['foley', 'field_recording', 'abstract_sound', 'creature_sound', 'weather'],
        dance: ['house', 'techno', 'edm', 'dance-pop', 'disco', 'trance'],
        edm: ['progressive_house', 'tech_house', 'trap', 'drum_and_bass', 'dubstep'],
        house: ['progressive_house', 'tech_house', 'deep_house', 'acid_house'],
        techno: ['ambient_techno', 'industrial_techno', 'minimal_techno', 'detroit_techno'],
        alternative_rock: ['indie_rock', 'punk_rock', 'grunge', 'post-punk'],
        metal: ['heavy_metal', 'death_metal', 'black_metal', 'thrash_metal', 'doom_metal', 'progressive_metal'],
        indie_pop: ['dream_pop', 'twee_pop', 'synth-pop', 'jangle_pop'],
        rnb: ['neo-soul', 'contemporary_rnb', 'quiet_storm', 'funk'],
        soul: ['neo-soul', 'motown', 'funk', 'southern_soul'],
        blues: ['delta_blues', 'chicago_blues', 'electric_blues', 'acoustic_blues'],
        country: ['bluegrass', 'americana', 'honky_tonk', 'outlaw_country', 'bakersfield_sound'],
        cinematic: ['film_score', 'orchestral_soundtrack', 'ambient_soundtrack', 'epic_score'],
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
        synthesizer: ['lead', 'pad', 'arpeggio', 'melody', 'atmospheric', 'fx', 'bass'],
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
    general_descriptors: [
        // From comprehensive taxonomy - general descriptors that apply across instruments
        'reverberant', 'dry', 'processed', 'present', 'distant', 'warm', 'bright', 'dark', 'clean', 'distorted',
        'crunchy', 'fuzzy', 'deep', 'driving', 'growling', 'percussive', 'gentle', 'heavy', 'light', 'tight',
        'loose', 'acoustic', 'punchy', 'booming', 'sharp', 'fat', 'crisp', 'electronic', 'glitchy', 'lush',
        'sweeping', 'blaring', 'muted', 'majestic', 'breathy', 'powerful', 'raspy', 'autotuned', 'harmonized'
    ] as const,
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
export type SubgenreMap = typeof VOCABULARY.subgenres;

export const DEFAULT_INSTRUMENT: InstrumentationEntry = {
    instrument: '',
    role: '',
    descriptors: [],
};
