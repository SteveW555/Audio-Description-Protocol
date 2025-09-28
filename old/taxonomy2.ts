// taxonomy.ts
// Unified Mood–Energy–Texture taxonomy (merged).
// Single source of truth: Terms + QualityHierarchyRef.
// Notes:
// - Some polysemous words are disambiguated with suffixes: `-mood`, `-energy`, `-texture`.
// - Usage ratings are heuristic: 'rare' | 'infrequent' | 'frequent' | 'ubiquitous'.

export type QualityCategory = 'Mood' | 'Energy' | 'Texture';
export type Frequency = 'rare' | 'infrequent' | 'frequent' | 'ubiquitous';

export interface TermDef {
    id: string;            // stable slug (lowercase, hyphens)
    term: string;          // display string
    freq: Frequency;       // rarity signal
    desc: string;          // concise description in this category's sense
    figurative?: boolean;  // metaphorical by nature
    aliases?: string[];    // synonyms/near-synonyms
    examples?: string[];   // optional short examples
    sources?: string[];    // optional notes/urls
    meta?: Record<string, any>;
}

// Canonical registry
export const Terms: Record<string, TermDef> = {
    // ==================== Mood ====================
    // Positive / Uplifting
    'upbeat': { id: 'upbeat', term: 'upbeat', freq: 'ubiquitous', desc: 'Cheerful, lively mood—often mid/fast tempo and major-harmony.' },
    'energetic-mood': { id: 'energetic-mood', term: 'energetic', freq: 'ubiquitous', desc: 'Vital, excited feeling; overlaps with Energy but here denotes affect.' },
    'joyful': { id: 'joyful', term: 'joyful', freq: 'frequent', desc: 'Clearly happy and celebratory in feeling.' },
    'happy': { id: 'happy', term: 'happy', freq: 'frequent', desc: 'Pleasant, contented, lighthearted mood.' },
    'cheerful': { id: 'cheerful', term: 'cheerful', freq: 'frequent', desc: 'Bright, pleasant, and mood-lifting.' },
    'uplifting': { id: 'uplifting', term: 'uplifting', freq: 'frequent', desc: 'Inspiring and elevating; leaves a hopeful afterglow.' },
    'positive-mood': { id: 'positive-mood', term: 'positive', freq: 'frequent', desc: 'Overall optimistic or constructive feeling.' },
    'hopeful': { id: 'hopeful', term: 'hopeful', freq: 'infrequent', desc: 'Gently confident that good outcomes await.' },
    'playful': { id: 'playful', term: 'playful', freq: 'infrequent', desc: 'Light-hearted, fun, and quirky.' },
    'romantic': { id: 'romantic', term: 'romantic', freq: 'infrequent', desc: 'Loving, passionate; tender emotional focus.' },
    'sentimental': { id: 'sentimental', term: 'sentimental', freq: 'infrequent', desc: 'Nostalgic, tender, emotionally evocative.' },
    'triumphant': { id: 'triumphant', term: 'triumphant', freq: 'infrequent', desc: 'Victorious, celebratory, often climactic.' },
    'heroic': { id: 'heroic', term: 'heroic', freq: 'infrequent', desc: 'Bold, valiant, evokes courage and resolve.' },
    'optimistic': { id: 'optimistic', term: 'optimistic', freq: 'infrequent', desc: 'Forward-looking confidence and positivity.' },
    'euphoric': { id: 'euphoric', term: 'euphoric', freq: 'infrequent', desc: 'Intense, overwhelming happiness or excitement.' },
    'exuberant': { id: 'exuberant', term: 'exuberant', freq: 'rare', desc: 'Highly lively and effusively cheerful.' },
    'ecstatic': { id: 'ecstatic', term: 'ecstatic', freq: 'rare', desc: 'Overwhelming joyful excitement.' },
    'ebullient': { id: 'ebullient', term: 'ebullient', freq: 'rare', desc: 'Cheerful and full of energy.' },

    // Calm / Peaceful
    'calm': { id: 'calm', term: 'calm', freq: 'ubiquitous', desc: 'Peaceful, unagitated, often slow and soft.' },
    'relaxed': { id: 'relaxed', term: 'relaxed', freq: 'ubiquitous', desc: 'Easy-going, unhurried, comfortable.' },
    'peaceful': { id: 'peaceful', term: 'peaceful', freq: 'frequent', desc: 'Serene and undisturbed; invites calm.' },
    'serene': { id: 'serene', term: 'serene', freq: 'frequent', desc: 'Calm, peaceful, and untroubled.' },
    'soothing': { id: 'soothing', term: 'soothing', freq: 'frequent', desc: 'Comforting, tension-reducing, gentle.' },
    'dreamy': { id: 'dreamy', term: 'dreamy', freq: 'frequent', desc: 'Soft, drifting, hazy; lull-like.' },
    'tranquil': { id: 'tranquil', term: 'tranquil', freq: 'infrequent', desc: 'Very calm; stillness and quietude.' },
    'gentle': { id: 'gentle', term: 'gentle', freq: 'infrequent', desc: 'Mild, tender, and soft in character.' },
    'meditative': { id: 'meditative', term: 'meditative', freq: 'infrequent', desc: 'Contemplative, repetitive, induces reflection.' },
    'ethereal-mood': { id: 'ethereal-mood', term: 'ethereal', freq: 'infrequent', desc: 'Delicate, light, beyond the ordinary; mood sense.', figurative: true },
    'contented': { id: 'contented', term: 'contented', freq: 'rare', desc: 'Quiet satisfaction; at ease.' },
    'atmospheric-mood': { id: 'atmospheric-mood', term: 'atmospheric', freq: 'infrequent', desc: 'Immersive calm ambience as a mood state.' },

    // Dark / Negative
    'sad': { id: 'sad', term: 'sad', freq: 'ubiquitous', desc: 'Plainly unhappy or sorrowful mood.' },
    'melancholic': { id: 'melancholic', term: 'melancholic', freq: 'frequent', desc: 'Pensive sadness; beautiful gloom.' },
    'somber': { id: 'somber', term: 'somber', freq: 'frequent', desc: 'Grave, serious, darkly quiet.' },
    'mournful': { id: 'mournful', term: 'mournful', freq: 'frequent', desc: 'Expressing grief or loss.' },
    'solemn': { id: 'solemn', term: 'solemn', freq: 'infrequent', desc: 'Formal, dignified seriousness.' },
    'wistful': { id: 'wistful', term: 'wistful', freq: 'infrequent', desc: 'Reflective longing; gentle sadness.' },
    'gloomy': { id: 'gloomy', term: 'gloomy', freq: 'infrequent', desc: 'Oppressively dark or dejected.' },
    'negative-mood': { id: 'negative-mood', term: 'negative', freq: 'infrequent', desc: 'Overall pessimistic or destructive feeling.' },
    'brooding': { id: 'brooding', term: 'brooding', freq: 'rare', desc: 'Heavy, simmering darkness; inward tension.' },
    'tragic': { id: 'tragic', term: 'tragic', freq: 'rare', desc: 'Marked by extreme distress or sorrow.' },
    'lonely': { id: 'lonely', term: 'lonely', freq: 'rare', desc: 'Evokes isolation and solitude.' },

    // Intense / Aggressive
    'intense-mood': { id: 'intense-mood', term: 'intense', freq: 'frequent', desc: 'Powerful, emotionally charged; mood sense.' },
    'aggressive': { id: 'aggressive', term: 'aggressive', freq: 'frequent', desc: 'Confrontational, forceful, often loud.' },
    'tense': { id: 'tense', term: 'tense', freq: 'frequent', desc: 'Anxious strain; sustained unease.' },
    'angry': { id: 'angry', term: 'angry', freq: 'infrequent', desc: 'Explicit rage or frustration.' },
    'menacing': { id: 'menacing', term: 'menacing', freq: 'infrequent', desc: 'Threatening presence; looming danger.' },
    'suspenseful': { id: 'suspenseful', term: 'suspenseful', freq: 'infrequent', desc: 'Anticipatory tension; edge-of-seat feel.' },
    'chaotic-mood': { id: 'chaotic-mood', term: 'chaotic', freq: 'infrequent', desc: 'Confused, disorderly affect causing anxiety.' },
    'anxious': { id: 'anxious', term: 'anxious', freq: 'rare', desc: 'Worried, uneasy mood.' },
    'furious': { id: 'furious', term: 'furious', freq: 'rare', desc: 'Extremely angry or violent.' },
    'violent': { id: 'violent', term: 'violent', freq: 'rare', desc: 'Brutal, forceful aggression.' },

    // Mysterious / Ambiguous
    'mysterious': { id: 'mysterious', term: 'mysterious', freq: 'frequent', desc: 'Unknown/uncanny; invites curiosity.' },
    'haunting': { id: 'haunting', term: 'haunting', freq: 'frequent', desc: 'Eerily evocative; lingers in memory.' },
    'epic': { id: 'epic', term: 'epic', freq: 'frequent', desc: 'Grand, larger-than-life, cinematic in scope.' },
    'dark-mood': { id: 'dark-mood', term: 'dark', freq: 'frequent', desc: 'Somber or ominous overall emotional cast (mood sense).' },
    'majestic': { id: 'majestic', term: 'majestic', freq: 'infrequent', desc: 'Impressive grandeur and dignity.' },
    'enigmatic': { id: 'enigmatic', term: 'enigmatic', freq: 'infrequent', desc: 'Difficult to interpret; puzzling.' },
    'otherworldly': { id: 'otherworldly', term: 'otherworldly', freq: 'infrequent', desc: 'Beyond earthly; uncanny atmosphere.', figurative: true },
    'strange': { id: 'strange', term: 'strange', freq: 'infrequent', desc: 'Unusual, difficult to explain.' },
    'spiritual': { id: 'spiritual', term: 'spiritual', freq: 'infrequent', desc: 'Sacred/transcendent emotional tone.' },

    // ==================== Energy ====================
    // High / Positive Drive
    'high-energy': { id: 'high-energy', term: 'high-energy', freq: 'frequent', desc: 'Very lively, intense; strong beats and dynamics.' },
    'driving': { id: 'driving', term: 'driving', freq: 'frequent', desc: 'Relentless forward propulsion from pulse/groove.', aliases: ['propulsive'] },
    'pumping': { id: 'pumping', term: 'pumping', freq: 'frequent', desc: 'Throbbing, vigorous energy (dance/EDM connotation).' },
    'vibrant': { id: 'vibrant', term: 'vibrant', freq: 'frequent', desc: 'Full of life and energetic motion.' },
    'positive-energy': { id: 'positive-energy', term: 'positive', freq: 'frequent', desc: 'Constructive, forward-moving drive.' },
    'explosive': { id: 'explosive', term: 'explosive', freq: 'infrequent', desc: 'Sudden bursts of high intensity.' },
    'propulsive': { id: 'propulsive', term: 'propulsive', freq: 'infrequent', desc: 'Pushes forward insistently; kinetic motion.', aliases: ['driving'] },
    'relentless': { id: 'relentless', term: 'relentless', freq: 'infrequent', desc: 'Unyielding pace; no respite.' },
    'urgent': { id: 'urgent', term: 'urgent', freq: 'infrequent', desc: 'Insistent forward pressure; haste.' },
    'frenetic': { id: 'frenetic', term: 'frenetic', freq: 'infrequent', desc: 'Extremely energetic and chaotic.' },
    'brisk': { id: 'brisk', term: 'brisk', freq: 'rare', desc: 'Quick and lively without heaviness.' },
    'surging': { id: 'surging', term: 'surging', freq: 'rare', desc: 'Rising powerfully in intensity.' },
    'thumping': { id: 'thumping', term: 'thumping', freq: 'infrequent', desc: 'Dominant, emphatic kick/bass beat.' },

    // Rhythmic Character
    'rhythmic': { id: 'rhythmic', term: 'rhythmic', freq: 'ubiquitous', desc: 'Strong, regular pattern of movement/sound.' },
    'groovy': { id: 'groovy', term: 'groovy', freq: 'frequent', desc: 'Infectious rhythmic feel; danceable pocket.' },
    'pulsing': { id: 'pulsing', term: 'pulsing', freq: 'frequent', desc: 'Strong repeating beat or pulse; hypnotic drive.' },
    'swinging': { id: 'swinging', term: 'swinging', freq: 'infrequent', desc: 'Jazz long–short eighths; lilting feel.' },
    'bouncy': { id: 'bouncy', term: 'bouncy', freq: 'infrequent', desc: 'Springy, buoyant rhythmic lift.' },
    'syncopated': { id: 'syncopated', term: 'syncopated', freq: 'infrequent', desc: 'Accents off-beats/weak beats; displaced rhythm.' },
    'throbbing': { id: 'throbbing', term: 'throbbing', freq: 'infrequent', desc: 'Strong, regular rhythmic pulse felt physically.' },
    'lilting': { id: 'lilting', term: 'lilting', freq: 'rare', desc: 'Pleasant gentle rise-fall rhythmic motion.' },
    'off-beat': { id: 'off-beat', term: 'off-beat', freq: 'rare', desc: 'Accents away from the main beat; syncopated.' },

    // Medium / Flowing
    'medium-energy': { id: 'medium-energy', term: 'medium-energy', freq: 'infrequent', desc: 'Moderate intensity; balanced drive.' },
    'mid-tempo': { id: 'mid-tempo', term: 'mid-tempo', freq: 'frequent', desc: 'Moderate tempo; comfortable pacing.' },
    'steady': { id: 'steady', term: 'steady', freq: 'frequent', desc: 'Even, consistent pulse or energy.' },
    'balanced-energy': { id: 'balanced-energy', term: 'balanced', freq: 'infrequent', desc: 'Moderate, controlled feel with elements in proportion.' },
    'measured': { id: 'measured', term: 'measured', freq: 'rare', desc: 'Careful, controlled pace.' },
    'unhurried': { id: 'unhurried', term: 'unhurried', freq: 'rare', desc: 'Without haste; relaxed pacing.' },
    'rolling': { id: 'rolling', term: 'rolling', freq: 'rare', desc: 'Continuous, gentle rhythmic motion.' },
    'flowing': { id: 'flowing', term: 'flowing', freq: 'infrequent', desc: 'Smooth motion; continuous line without jolts.' },

    // Low / Peaceful
    'low-energy': { id: 'low-energy', term: 'low-energy', freq: 'frequent', desc: 'Soft, subtle intensity; minimal drive.' },
    'slow': { id: 'slow', term: 'slow', freq: 'ubiquitous', desc: 'Low tempo; unhurried pacing.' },
    'chill': { id: 'chill', term: 'chill', freq: 'frequent', desc: 'Very relaxed and mellow vibe.' },
    'ambient': { id: 'ambient', term: 'ambient', freq: 'infrequent', desc: 'Atmospheric background focus; little rhythmic drive.' },
    'hypnotic': { id: 'hypnotic', term: 'hypnotic', freq: 'infrequent', desc: 'Gently repetitive; trance-like state.' },
    'peaceful-energy': { id: 'peaceful-energy', term: 'peaceful', freq: 'infrequent', desc: 'Tranquil energy state (overlaps mood).' },
    'soothing-energy': { id: 'soothing-energy', term: 'soothing', freq: 'infrequent', desc: 'Calming kinetic profile (overlaps mood).' },
    'sedate': { id: 'sedate', term: 'sedate', freq: 'rare', desc: 'Very subdued, motionless feel.' },
    'languid': { id: 'languid', term: 'languid', freq: 'rare', desc: 'Lazy-slow and relaxed; unhurried.' },

    // Negative / Unstable
    'chaotic-energy': { id: 'chaotic-energy', term: 'chaotic', freq: 'frequent', desc: 'Irregular/unpredictable rhythm or form.' },
    'disjointed': { id: 'disjointed', term: 'disjointed', freq: 'infrequent', desc: 'Lacking coherent sequence/connection.' },
    'erratic': { id: 'erratic', term: 'erratic', freq: 'infrequent', desc: 'Uneven, unpredictable movement.' },
    'unsettled': { id: 'unsettled', term: 'unsettled', freq: 'infrequent', desc: 'Lacks stability; prone to disruption.' },
    'negative-energy': { id: 'negative-energy', term: 'negative', freq: 'infrequent', desc: 'Stagnant/restless/destructive kinetic quality.' },
    'restless': { id: 'restless', term: 'restless', freq: 'rare', desc: 'Unable to be still; fidgety impulse to move.' },
    'jittery': { id: 'jittery', term: 'jittery', freq: 'rare', desc: 'Nervous, shaky energy.' },
    'hectic': { id: 'hectic', term: 'hectic', freq: 'rare', desc: 'Frantic activity; overbusy motion.' },

    // Expansive / Other (temporal evolution of energy)
    'gradual': { id: 'gradual', term: 'gradual', freq: 'infrequent', desc: 'Slow change by degrees (energy evolution).' },
    'crescendoing': { id: 'crescendoing', term: 'crescendoing', freq: 'infrequent', desc: 'Gradual increase in loudness/intensity.' },
    'swelling': { id: 'swelling', term: 'swelling', freq: 'infrequent', desc: 'Becoming greater in intensity/volume.' },
    'decaying': { id: 'decaying', term: 'decaying', freq: 'rare', desc: 'Gradual decrease in strength/quality.' },
    'wavering': { id: 'wavering', term: 'wavering', freq: 'rare', desc: 'Quivering/unstable amplitude or intensity.' },
    'oscillating': { id: 'oscillating', term: 'oscillating', freq: 'rare', desc: 'Back-and-forth periodic motion.' },
    'spiraling': { id: 'spiraling', term: 'spiraling', freq: 'rare', desc: 'Continuous dramatic increase or decrease.' },

    // ==================== Texture ====================
    // Tone & Timbre / Timbral Quality & Sonic Finish
    'bright': { id: 'bright', term: 'bright', freq: 'ubiquitous', desc: 'Treble-forward tone; crisp highs and sparkle.' },
    'warm': { id: 'warm', term: 'warm', freq: 'ubiquitous', desc: 'Rich low/low-mid emphasis; cozy fullness.' },
    'smooth': { id: 'smooth', term: 'smooth', freq: 'ubiquitous', desc: 'Even, gentle tonality; no jarring peaks.' },
    'clear': { id: 'clear', term: 'clear', freq: 'frequent', desc: 'Easy instrument separation; intelligible mix.' },
    'crisp': { id: 'crisp', term: 'crisp', freq: 'frequent', desc: 'Sharp transients; fresh, snappy detail.' },
    'raw-texture': { id: 'raw-texture', term: 'raw', freq: 'frequent', desc: 'Unrefined, minimally processed; gritty realism.' },
    'gritty-texture': { id: 'gritty-texture', term: 'gritty', freq: 'frequent', desc: 'Rough, grainy surface (often light distortion).' },
    'dark': { id: 'dark', term: 'dark', freq: 'frequent', desc: 'Rolled-off highs; mellow/low-tilted tone.' },
    'polished': { id: 'polished', term: 'polished', freq: 'frequent', desc: 'Refined, professional sheen; smoothed edges.' },
    'harsh': { id: 'harsh', term: 'harsh', freq: 'frequent', desc: 'Grating/piercing upper-mids or treble; fatiguing.' },
    'distorted': { id: 'distorted', term: 'distorted', freq: 'frequent', desc: 'Overdrive/fuzz artifacts; deliberate roughness.' },
    'mellow': { id: 'mellow', term: 'mellow', freq: 'frequent', desc: 'Pleasantly smooth/soft; free from harshness.' },
    'soft-texture': { id: 'soft-texture', term: 'soft', freq: 'frequent', desc: 'Rounded attacks; gentle, non-abrasive surface.' },
    'airy': { id: 'airy', term: 'airy', freq: 'infrequent', desc: 'Open top-end “air” and breathable space.' },
    'shimmering': { id: 'shimmering', term: 'shimmering', freq: 'infrequent', desc: 'Softly sparkling highs; cymbals/reverb sheen.' },
    'sparkling': { id: 'sparkling', term: 'sparkling', freq: 'infrequent', desc: 'Very crisp and bright high frequencies.' },
    'velvety': { id: 'velvety', term: 'velvety', freq: 'infrequent', desc: 'Exceptionally smooth/soft impression.' },
    'silky': { id: 'silky', term: 'silky', freq: 'infrequent', desc: 'Soft, smooth highs; glossy surface.' },
    'rounded': { id: 'rounded', term: 'rounded', freq: 'infrequent', desc: 'Lacks sharp edges; gentle contours.' },
    'muddy': { id: 'muddy', term: 'muddy', freq: 'infrequent', desc: 'Blurred definition; excess low-mids.' },
    'raspy': { id: 'raspy', term: 'raspy', freq: 'infrequent', desc: 'Hoarse/rough-sounding timbre.' },
    'abrasive': { id: 'abrasive', term: 'abrasive', freq: 'rare', desc: 'Harsh/grating surface texture.' },
    'crystalline': { id: 'crystalline', term: 'crystalline', freq: 'rare', desc: 'Exceptionally clear/transparent highs.' },
    'buzzy': { id: 'buzzy', term: 'buzzy', freq: 'rare', desc: 'Low continuous buzz-like overtone.' },
    'coarse': { id: 'coarse', term: 'coarse', freq: 'rare', desc: 'Rough, harshly textured timbre.' },
    'gleaming': { id: 'gleaming', term: 'gleaming', freq: 'rare', desc: 'Highly polished/sparkling impression.' },
    'buttery': { id: 'buttery', term: 'buttery', freq: 'rare', desc: 'Smooth, rich, creamy tone (esp. guitar OD).' },
    'radiant': { id: 'radiant', term: 'radiant', freq: 'rare', desc: 'Glowing, luminous presence.' },
    'tinny': { id: 'tinny', term: 'tinny', freq: 'infrequent', desc: 'Very thin with sharp treble; small-speaker feel.' },
    'ethereal-texture': { id: 'ethereal-texture', term: 'ethereal', freq: 'frequent', desc: 'Light, airy timbre; floating quality.', figurative: true },
    'bassy': { id: 'bassy', term: 'bassy', freq: 'infrequent', desc: 'Dominant low end presence.' },
    'boomy': { id: 'boomy', term: 'boomy', freq: 'infrequent', desc: 'Excess/loose bass causing muddiness.' },
    'detailed': { id: 'detailed', term: 'detailed', freq: 'frequent', desc: 'Fine nuance is audible; micro-details present.' },
    'sharp-texture': { id: 'sharp-texture', term: 'sharp', freq: 'infrequent', desc: 'Strongly defined edges; can verge on edgy.' },
    'clean': { id: 'clean', term: 'clean', freq: 'frequent', desc: 'Clear, low-noise; well-defined elements.' },

    // Density & Layering (incl. formal textures)
    'dense': { id: 'dense', term: 'dense', freq: 'frequent', desc: 'Many simultaneous layers; packed sound.' },
    'thick': { id: 'thick', term: 'thick', freq: 'frequent', desc: 'Heavily layered or weighty texture.' },
    'sparse': { id: 'sparse', term: 'sparse', freq: 'frequent', desc: 'Few elements; lots of space/air.' },
    'layered': { id: 'layered', term: 'layered', freq: 'frequent', desc: 'Multiple overlapping parts/tracks.' },
    'minimalistic': { id: 'minimalistic', term: 'minimalistic', freq: 'frequent', desc: 'Deliberately few elements; simplicity.' },
    'full-bodied': { id: 'full-bodied', term: 'full-bodied', freq: 'frequent', desc: 'Rich presence across spectrum; solid weight.' },
    'rich': { id: 'rich', term: 'rich', freq: 'frequent', desc: 'Abundant, pleasing harmonic content.' },
    'complex': { id: 'complex', term: 'complex', freq: 'frequent', desc: 'Intricate interplay; many details.' },
    'hollow': { id: 'hollow', term: 'hollow', freq: 'infrequent', desc: 'Scooped midrange; empty center.' },
    'heavy': { id: 'heavy', term: 'heavy', freq: 'infrequent', desc: 'Great density, often low-end focus.' },
    'light': { id: 'light', term: 'light', freq: 'infrequent', desc: 'Low density; airy/upper focus.' },
    'transparent': { id: 'transparent', term: 'transparent', freq: 'infrequent', desc: 'Parts clearly distinguishable; see-through.' },
    'polyphonic': { id: 'polyphonic', term: 'polyphonic', freq: 'infrequent', desc: 'Multiple independent melodic lines.' },
    'homophonic': { id: 'homophonic', term: 'homophonic', freq: 'infrequent', desc: 'Primary melody with chordal accompaniment.' },
    'monophonic': { id: 'monophonic', term: 'monophonic', freq: 'rare', desc: 'Single, unaccompanied melodic line.' },
    'heterophonic': { id: 'heterophonic', term: 'heterophonic', freq: 'rare', desc: 'Simultaneous variants of the same melody.' },

    // Space & Atmosphere
    'spacious': { id: 'spacious', term: 'spacious', freq: 'frequent', desc: 'Wide/deep sense of room; stereo and reverb depth.' },
    'reverberant': { id: 'reverberant', term: 'reverberant', freq: 'infrequent', desc: 'Audible room/echo tail; long decays.' },
    'wet': { id: 'wet', term: 'wet', freq: 'infrequent', desc: 'Effect-heavy (reverb/delay); opposite of dry.' },
    'dry': { id: 'dry', term: 'dry', freq: 'frequent', desc: 'Close/roomless sound; minimal ambience.' },
    'intimate': { id: 'intimate', term: 'intimate', freq: 'infrequent', desc: 'Very close, personal proximity; detail-forward.' },
    'echoey': { id: 'echoey', term: 'echoey', freq: 'infrequent', desc: 'Audible repeats/reflections; obvious echoes.' },
    'atmospheric': { id: 'atmospheric', term: 'atmospheric', freq: 'frequent', desc: 'Evocative ambience; mood-first sound design.' },
    'cinematic': { id: 'cinematic', term: 'cinematic', freq: 'frequent', desc: 'Film-score scale; expansive and evocative.' },

    // Source & Instrumentation / Natural / Synthetic
    'acoustic': { id: 'acoustic', term: 'acoustic', freq: 'ubiquitous', desc: 'Natural, non-electric instruments; organic tone.' },
    'organic': { id: 'organic', term: 'organic', freq: 'frequent', desc: 'Natural/untreated character; not artificial.' },
    'natural': { id: 'natural', term: 'natural', freq: 'frequent', desc: 'Not electronically created; authentic tone.' },
    'resonant': { id: 'resonant', term: 'resonant', freq: 'infrequent', desc: 'Deep, clear, continuing reverberation.' },
    'woody': { id: 'woody', term: 'woody', freq: 'rare', desc: 'Wood-bodied instrument coloration.' },
    'earthy': { id: 'earthy', term: 'earthy', freq: 'rare', desc: 'Unrefined, grounded, rustic character.' },
    'textured': { id: 'textured', term: 'textured', freq: 'rare', desc: 'Noticeably tactile sonic surface.' },
    'grainy': { id: 'grainy', term: 'grainy', freq: 'rare', desc: 'Granular, roughened surface.' },
    'fibrous': { id: 'fibrous', term: 'fibrous', freq: 'rare', desc: 'Fiber-like, stringy timbral quality.' },

    'electric': { id: 'electric', term: 'electric', freq: 'frequent', desc: 'Amplified instruments; characteristic bite/shine.' },
    'electronic': { id: 'electronic', term: 'electronic', freq: 'ubiquitous', desc: 'Synthesized/programmed sources; artificial timbres.' },
    'synthetic': { id: 'synthetic', term: 'synthetic', freq: 'frequent', desc: 'Deliberately artificial sound character.', aliases: ['electronic'] },
    'processed': { id: 'processed', term: 'processed', freq: 'frequent', desc: 'Audibly manipulated with effects/processing.' },
    'digital': { id: 'digital', term: 'digital', freq: 'infrequent', desc: 'Crisp, precise, sometimes clinical texture.' },
    'analog': { id: 'analog', term: 'analog', freq: 'rare', desc: 'Warm coloration typical of analog gear.' },
    'metallic': { id: 'metallic', term: 'metallic', freq: 'infrequent', desc: 'Sharp, ringing, metal-like overtones.' },
    'glitchy': { id: 'glitchy', term: 'glitchy', freq: 'infrequent', desc: 'Clicks/stutters; intentional digital error aesthetic.' },
    'mechanical': { id: 'mechanical', term: 'mechanical', freq: 'rare', desc: 'Machine-like regularity; non-human quality.' },
    'glassy': { id: 'glassy', term: 'glassy', freq: 'rare', desc: 'Smooth, brittle, crystalline timbre.' },
    'hybrid': { id: 'hybrid', term: 'hybrid', freq: 'rare', desc: 'Blend of acoustic and electronic sources.' },
};

// Hierarchy referencing canonical IDs (merged)
export const QualityHierarchyRef: Record<QualityCategory, { [clusterName: string]: string[] }> = {
    Mood: {
        'Positive / Uplifting': [
            'upbeat','energetic-mood','joyful','happy','cheerful','uplifting','positive-mood','hopeful',
            'playful','romantic','sentimental','triumphant','heroic','optimistic','euphoric','exuberant','ecstatic','ebullient'
        ],
        'Calm / Peaceful': [
            'calm','relaxed','peaceful','serene','soothing','dreamy','tranquil','gentle','meditative','ethereal-mood','contented','atmospheric-mood'
        ],
        'Dark / Negative': [
            'sad','melancholic','somber','mournful','solemn','wistful','gloomy','negative-mood','brooding','tragic','lonely'
        ],
        'Intense / Aggressive': [
            'intense-mood','aggressive','tense','angry','menacing','suspenseful','chaotic-mood','anxious','furious','violent'
        ],
        'Mysterious / Ambiguous': [
            'mysterious','haunting','epic','dark-mood','majestic','enigmatic','otherworldly','strange','spiritual'
        ]
    },

    Energy: {
        'High / Positive Drive': [
            'high-energy','driving','pumping','vibrant','positive-energy','explosive','propulsive','relentless','urgent','frenetic','brisk','surging','thumping'
        ],
        'Rhythmic Character': [
            'rhythmic','groovy','pulsing','swinging','bouncy','syncopated','throbbing','lilting','off-beat'
        ],
        'Medium / Flowing': [
            'medium-energy','mid-tempo','steady','balanced-energy','measured','unhurried','rolling','flowing'
        ],
        'Low / Peaceful': [
            'low-energy','slow','chill','ambient','hypnotic','peaceful-energy','soothing-energy','sedate','languid'
        ],
        'Negative / Unstable': [
            'chaotic-energy','disjointed','erratic','unsettled','negative-energy','restless','jittery','hectic'
        ],
        'Expansive / Other': [
            'gradual','crescendoing','swelling','decaying','wavering','oscillating','spiraling'
        ]
    },

    Texture: {
        'Timbral Quality & Sonic Finish': [
            'bright','warm','smooth','clear','crisp','raw-texture','gritty-texture','dark','polished','harsh','distorted','mellow','soft-texture',
            'airy','shimmering','sparkling','velvety','silky','rounded','muddy','raspy','abrasive','crystalline','buzzy','coarse','gleaming','buttery','radiant',
            'tinny','ethereal-texture','bassy','boomy','detailed','sharp-texture','clean'
        ],
        'Density & Layering': [
            'dense','thick','sparse','layered','minimalistic','full-bodied','rich','complex','hollow','heavy','light','transparent',
            'polyphonic','homophonic','monophonic','heterophonic'
        ],
        'Space & Atmosphere': [
            'spacious','reverberant','wet','dry','intimate','echoey','atmospheric','cinematic'
        ],
        'Source & Instrumentation (Natural)': [
            'acoustic','organic','natural','resonant','woody','earthy','textured','grainy','fibrous'
        ],
        'Source & Instrumentation (Electronic/Synthetic)': [
            'electric','electronic','synthetic','processed','digital','analog','metallic','glitchy','mechanical','glassy','hybrid'
        ]
    }
};

// Small resolver
export function resolveTerms(ids: string[]): TermDef[] {
    return ids.map(id => Terms[id]).filter((t): t is TermDef => Boolean(t));
}
