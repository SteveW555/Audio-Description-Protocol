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
export const VOCABULARY = {
  mood: ['upbeat', 'energetic', 'joyful', 'positive', 'happy', 'cheerful', 'uplifting', 'hopeful', 'playful', 'romantic', 'sentimental', 'triumphant', 'heroic', 'optimistic', 'euphoric', 'exuberant', 'ecstatic', 'elated', 'celebratory', 'festive', 'inspiring', 'proud', 'sparkly', 'thrilling', 'peaceful', 'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative', 'soothing', 'gentle', 'contemplative', 'restful', 'ethereal', 'atmospheric', 'flowing', 'smooth', 'gossamer', 'dark', 'melancholic', 'sad', 'somber', 'brooding', 'chilling', 'fearful', 'mournful', 'gloomy', 'haunting', 'moody', 'desolate', 'forlorn', 'wistful', 'tragic', 'lonely', 'nauseating', 'ominous', 'painful', 'disturbing', 'shadowy', 'plaintive', 'negative', 'intense', 'aggressive', 'driving', 'powerful', 'forceful', 'fierce', 'raw', 'edgy', 'explosive', 'menacing', 'angry', 'violent', 'furious', 'tense', 'harsh', 'thunderous', 'blistering', 'snarling', 'annoying', 'anxious', 'agitated', 'defiant', 'unsettling', 'restless', 'chaotic', 'mysterious', 'enigmatic', 'ethereal-ambience', 'otherworldly', 'mystical', 'cryptic', 'elusive', 'veiled', 'obscure', 'twilight', 'liminal', 'awe-inspiring', 'entrancing', 'majestic', 'puzzling', 'spine-tingling', 'epic', 'strange', 'transcendent', 'cosmic', 'panoramic', 'tender', 'affectionate', 'compassionate', 'intimate', 'loving', 'sensual', 'warm-hearted', 'sultry', 'passionate', 'yearning', 'longing', 'nostalgic', 'reflective', 'bittersweet', 'reminiscent', 'pensive', 'poignant', 'memory-laden', 'retrospective'] as const,

  energy: ['high-energy', 'energetic', 'driving', 'vigorous', 'propulsive', 'pumping', 'dynamic', 'explosive', 'kinetic', 'punchy', 'pulsating', 'frenetic', 'relentless', 'urgent', 'vibrant', 'bouncy', 'brisk', 'electrifying', 'exciting', 'high-octane', 'strong', 'turbocharged', 'thumping', 'flowing', 'steady', 'moderate', 'balanced', 'measured', 'rolling', 'rhythmic', 'groovy', 'medium-energy', 'cascading', 'undulating', 'swinging', 'pulsing', 'unhurried', 'cruising', 'mid-tempo', 'paced', 'laid-back', 'low-energy', 'ambient', 'boring', 'chill', 'mellow', 'gentle', 'subdued', 'restrained', 'placid', 'still', 'relaxed', 'downtempo', 'languid', 'serene', 'hushed', 'delicate', 'soft', 'sedate', 'hypnotic', 'tense', 'anxious', 'chaotic', 'agitated', 'erratic', 'unstable', 'jarring', 'dissonant', 'turbulent', 'unsettling', 'fragmented', 'static', 'restless', 'jittery', 'hectic', 'disjointed', 'expansive', 'soaring', 'lifting', 'transcendent', 'boundless', 'sweeping', 'majestic', 'panoramic', 'vast', 'cosmic', 'breathless', 'gradual', 'crescendoing', 'swelling', 'decaying', 'wavering', 'oscillating', 'spiraling'] as const,

  texture: ['bright', 'crisp', 'clear', 'brilliant', 'sparkling', 'crystalline', 'shimmering', 'radiant', 'gleaming', 'airy', 'polished', 'pristine', 'shiny', 'luminous', 'refined', 'sleek', 'elegant', 'sophisticated', 'seamless', 'effortless', 'fluid', 'graceful', 'smooth', 'wet', 'glassy', 'muddy', 'harsh', 'buzzy', 'distorted', 'abrasive', 'dissonant', 'static', 'glitchy', 'crunchy', 'ratty', 'warm', 'rich', 'full', 'lush', 'creamy', 'honeyed', 'golden', 'mellow', 'rounded', 'embracing', 'enveloping', 'cozy', 'sumptuous', 'velvety', 'buttery', 'silky', 'soft', 'layered', 'complex', 'rich-density', 'full-bodied', 'orchestrated', 'intricate', 'detailed', 'multi-textured', 'stratified', 'elaborate', 'polyphonic', 'homophonic', 'heterophonic', 'dense', 'thick', 'gritty', 'raspy', 'coarse', 'raw', 'unprocessed', 'grainy', 'rough', 'jagged', 'raw-finish', 'unpolished', 'edgy', 'dry', 'dark', 'murky', 'shadowy', 'veiled', 'obscured', 'heavy', 'clouded', 'muffled', 'oppressive', 'acoustic', 'organic', 'natural', 'live', 'authentic', 'woody', 'breathy', 'human', 'intimate', 'close-miked', 'hollow', 'earthy', 'fibrous', 'resonant', 'textured', 'electronic', 'synthetic', 'digital', 'processed', 'programmed', 'artificial', 'computerized', 'robotic', 'futuristic', 'cyber', 'pixelated', 'metallic', 'analog', 'mechanical', 'challenging', 'sparse', 'minimalistic', 'monophonic', 'spacious', 'reverberant', 'intimate-space', 'echoey', 'atmospheric', 'cinematic'] as const,

  primary_genre: ['Electronic', 'Rock', 'Pop', 'Hip-Hop', 'R&B / Soul', 'Jazz', 'Blues', 'Country', 'Classical', 'Folk', 'Latin', 'Reggae', 'World', 'Soundtrack', 'Ambient', 'Spoken Word', 'Sound Effect'] as const,

  subgenres: {
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

  vocals_presence: ['lead', 'backing', 'choir', 'sampled', 'spoken_word', 'ad-libs'] as const, // 'none' excluded for random generation
  vocals_gender: ['male', 'female', 'mixed', 'androgynous'] as const,
  vocals_style: ['singing', 'rapping', 'screaming', 'growling', 'falsetto', 'whispering', 'operatic'] as const,
} as const;
