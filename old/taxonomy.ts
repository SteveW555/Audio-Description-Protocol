// quality.types.ts
export type QualityCategory = 'Mood' | 'Energy' | 'Texture';
export type Frequency = 'rare' | 'infrequent' | 'frequent' | 'ubiquitous';

export interface TermDef {
    id: string;            // stable slug (lowercase, hyphens)
    term: string;          // display string (can match id)
    freq: Frequency;       // rarity signal
    desc: string;          // concise, plain-English description
    figurative?: boolean;  // true if metaphorical by nature (e.g., "otherworldly")
    aliases?: string[];    // synonyms/near-synonyms
    examples?: string[];   // short usage examples
    sources?: string[];    // optional source notes/urls if you add them later
    meta?: Record<string, any>; // room for future fields (embeddings, locale, etc.)
}

export interface QualityHierarchyRef {
    [K in QualityCategory]: {
        [clusterName: string]: string[]; // TermDef.id[]
    };
}

// ------------------------------
// Canonical registry (single source of truth)
// ------------------------------

export const Terms: Record<string, TermDef> = {
    // ---------------- Mood: Positive / Uplifting ----------------
    'upbeat': {
        id: 'upbeat', term: 'upbeat', freq: 'frequent',
        desc: 'Cheerful, lively mood—often mid/fast tempo and major-harmony.'
    },
    'joyful': {
        id: 'joyful', term: 'joyful', freq: 'frequent',
        desc: 'Clearly happy and celebratory in feeling.'
    },
    'cheerful': {
        id: 'cheerful', term: 'cheerful', freq: 'frequent',
        desc: 'Bright, pleasant, and mood-lifting.'
    },
    'feel-good': {
        id: 'feel-good', term: 'feel-good', freq: 'frequent',
        desc: 'Instantly mood-boosting and positive.'
    },
    'uplifting': {
        id: 'uplifting', term: 'uplifting', freq: 'frequent',
        desc: 'Inspiring and elevating; leaves a hopeful afterglow.'
    },
    'triumphant': {
        id: 'triumphant', term: 'triumphant', freq: 'infrequent',
        desc: 'Victorious, celebratory, often climactic.'
    },
    'epic': {
        id: 'epic', term: 'epic', freq: 'frequent',
        desc: 'Grand, larger-than-life, cinematic in scope.'
    },
    'heroic': {
        id: 'heroic', term: 'heroic', freq: 'infrequent',
        desc: 'Bold, valiant, evokes courage and resolve.'
    },
    'optimistic': {
        id: 'optimistic', term: 'optimistic', freq: 'frequent',
        desc: 'Forward-looking confidence and positivity.'
    },
    'playful': {
        id: 'playful', term: 'playful', freq: 'infrequent',
        desc: 'Light-hearted, fun, and quirky.'
    },
    'whimsical': {
        id: 'whimsical', term: 'whimsical', freq: 'rare',
        desc: 'Fantastical, childlike imagination and charm.'
    },
    'hopeful': {
        id: 'hopeful', term: 'hopeful', freq: 'frequent',
        desc: 'Gently confident that good outcomes await.'
    },

    // ---------------- Mood: Calm / Peaceful ----------------
    'calm': {
        id: 'calm', term: 'calm', freq: 'ubiquitous',
        desc: 'Peaceful, unagitated, often slow and soft.'
    },
    'relaxed': {
        id: 'relaxed', term: 'relaxed', freq: 'frequent',
        desc: 'Easy-going, unhurried, comfortable.'
    },
    'soothing': {
        id: 'soothing', term: 'soothing', freq: 'frequent',
        desc: 'Comforting, tension-reducing, gentle.'
    },
    'peaceful': {
        id: 'peaceful', term: 'peaceful', freq: 'frequent',
        desc: 'Serene and undisturbed; invites calm.'
    },
    'serene': {
        id: 'serene', term: 'serene', freq: 'infrequent',
        desc: 'Deeply tranquil and untroubled.'
    },
    'mellow': {
        id: 'mellow', term: 'mellow', freq: 'frequent',
        desc: 'Smooth, warm, and easy on the ear.'
    },
    'tranquil': {
        id: 'tranquil', term: 'tranquil', freq: 'infrequent',
        desc: 'Very calm; stillness and quietude.'
    },
    'meditative': {
        id: 'meditative', term: 'meditative', freq: 'infrequent',
        desc: 'Contemplative, repetitive, induces reflection.'
    },

    // ---------------- Mood: Emotional / Sentimental ----------------
    'romantic': {
        id: 'romantic', term: 'romantic', freq: 'frequent',
        desc: 'Loving, passionate; tender emotional focus.'
    },
    'sentimental': {
        id: 'sentimental', term: 'sentimental', freq: 'frequent',
        desc: 'Nostalgic, tender, emotionally evocative.'
    },
    'heartfelt': {
        id: 'heartfelt', term: 'heartfelt', freq: 'frequent',
        desc: 'Sincere, deeply felt expression.'
    },
    'soulful': {
        id: 'soulful', term: 'soulful', freq: 'frequent',
        desc: 'Rich emotional depth, often vocal-forward.'
    },
    'poignant': {
        id: 'poignant', term: 'poignant', freq: 'infrequent',
        desc: 'Touching and bittersweet, lingers emotionally.'
    },
    'bittersweet': {
        id: 'bittersweet', term: 'bittersweet', freq: 'infrequent',
        desc: 'Pleasant yet tinged with sadness.'
    },
    'wistful': {
        id: 'wistful', term: 'wistful', freq: 'infrequent',
        desc: 'Reflective longing; gentle sadness.'
    },

    // ---------------- Mood: Dark / Brooding ----------------
    'sad': {
        id: 'sad', term: 'sad', freq: 'ubiquitous',
        desc: 'Plainly unhappy or sorrowful mood.'
    },
    'melancholic': {
        id: 'melancholic', term: 'melancholic', freq: 'frequent',
        desc: 'Pensive sadness; beautiful gloom.'
    },
    'somber': {
        id: 'somber', term: 'somber', freq: 'frequent',
        desc: 'Grave, serious, darkly quiet.'
    },
    'gloomy': {
        id: 'gloomy', term: 'gloomy', freq: 'frequent',
        desc: 'Oppressively dark or dejected.'
    },
    'brooding': {
        id: 'brooding', term: 'brooding', freq: 'infrequent',
        desc: 'Heavy, simmering darkness; inward tension.'
    },
    'gritty-mood': {
        id: 'gritty-mood', term: 'gritty', freq: 'infrequent',
        desc: 'Raw, rough-edged emotional tone.'
    },
    'bleak': {
        id: 'bleak', term: 'bleak', freq: 'infrequent',
        desc: 'Hopeless, stripped of light or comfort.'
    },
    'ominous': {
        id: 'ominous', term: 'ominous', freq: 'frequent',
        desc: 'Foreboding; signals approaching threat.'
    },
    'haunting': {
        id: 'haunting', term: 'haunting', freq: 'frequent',
        desc: 'Eerily evocative; lingers in memory.'
    },
    'eerie': {
        id: 'eerie', term: 'eerie', freq: 'frequent',
        desc: 'Spooky, uncanny, unsettling.'
    },

    // ---------------- Mood: Intense / Tense ----------------
    'intense': {
        id: 'intense', term: 'intense', freq: 'frequent',
        desc: 'Powerful, emotionally charged, gripping.'
    },
    'aggressive': {
        id: 'aggressive', term: 'aggressive', freq: 'frequent',
        desc: 'Confrontational, forceful, often loud.'
    },
    'fiery': {
        id: 'fiery', term: 'fiery', freq: 'infrequent',
        desc: 'Burning passion or fervor.'
    },
    'angry': {
        id: 'angry', term: 'angry', freq: 'frequent',
        desc: 'Explicit rage or frustration.'
    },
    'tense': {
        id: 'tense', term: 'tense', freq: 'frequent',
        desc: 'Anxious strain; sustained unease.'
    },
    'suspenseful': {
        id: 'suspenseful', term: 'suspenseful', freq: 'frequent',
        desc: 'Anticipatory tension; edge-of-seat feel.'
    },
    'urgent': {
        id: 'urgent', term: 'urgent', freq: 'frequent',
        desc: 'Insistent forward pressure; haste.'
    },
    'dramatic': {
        id: 'dramatic', term: 'dramatic', freq: 'frequent',
        desc: 'Theatrical and emotionally striking.'
    },
    'frantic': {
        id: 'frantic', term: 'frantic', freq: 'infrequent',
        desc: 'Desperately fast and chaotic.'
    },

    // ---------------- Mood: Dreamy / Ethereal ----------------
    'dreamy': {
        id: 'dreamy', term: 'dreamy', freq: 'frequent',
        desc: 'Soft, drifting, hazy; lull-like.'
    },
    'ethereal': {
        id: 'ethereal', term: 'ethereal', freq: 'frequent',
        desc: 'Light, otherworldly, floating; airy timbres.',
        figurative: true
    },
    'otherworldly': {
        id: 'otherworldly', term: 'otherworldly', freq: 'infrequent',
        desc: 'Alien or beyond earthly; uncanny atmosphere.',
        figurative: true
    },
    'mystical': {
        id: 'mystical', term: 'mystical', freq: 'infrequent',
        desc: 'Enigmatic, spiritual aura; magical hue.',
        figurative: true
    },
    'enchanted': {
        id: 'enchanted', term: 'enchanted', freq: 'rare',
        desc: 'Fairy-tale charm; spellbinding shimmer.',
        figurative: true
    },

    // ==================== Energy ====================

    // ---------------- Energy: High / Fast-Paced ----------------
    'high-energy': {
        id: 'high-energy', term: 'high-energy', freq: 'frequent',
        desc: 'Very lively, intense; strong beats and dynamics.'
    },
    'up-tempo': {
        id: 'up-tempo', term: 'up-tempo', freq: 'frequent',
        desc: 'Faster tempo; lively momentum.'
    },
    'fast-paced': {
        id: 'fast-paced', term: 'fast-paced', freq: 'frequent',
        desc: 'Rapid movement; quick sections or feel.'
    },
    'driving': {
        id: 'driving', term: 'driving', freq: 'frequent',
        desc: 'Relentless forward propulsion from pulse/groove.',
        aliases: ['propulsive']
    },
    'pumping': {
        id: 'pumping', term: 'pumping', freq: 'frequent',
        desc: 'Throbbing, vigorous energy (dance/EDM connotation).'
    },
    'pulsating': {
        id: 'pulsating', term: 'pulsating', freq: 'frequent',
        desc: 'Strong repeating beat or pulse; hypnotic drive.'
    },
    'propulsive': {
        id: 'propulsive', term: 'propulsive', freq: 'infrequent',
        desc: 'Pushes forward insistently; kinetic motion.',
        aliases: ['driving']
    },
    'relentless': {
        id: 'relentless', term: 'relentless', freq: 'infrequent',
        desc: 'Unyielding pace; no respite.'
    },
    'explosive': {
        id: 'explosive', term: 'explosive', freq: 'infrequent',
        desc: 'Sudden bursts of high intensity.'
    },
    'frenetic': {
        id: 'frenetic', term: 'frenetic', freq: 'infrequent',
        desc: 'Extremely energetic and chaotic.'
    },
    'brisk': {
        id: 'brisk', term: 'brisk', freq: 'infrequent',
        desc: 'Quick and lively without heaviness.'
    },

    // ---------------- Energy: Medium / Flowing ----------------
    'medium-energy': {
        id: 'medium-energy', term: 'medium-energy', freq: 'frequent',
        desc: 'Moderate intensity; balanced drive.'
    },
    'mid-tempo': {
        id: 'mid-tempo', term: 'mid-tempo', freq: 'frequent',
        desc: 'Moderate tempo; comfortable pacing.'
    },
    'flowing': {
        id: 'flowing', term: 'flowing', freq: 'infrequent',
        desc: 'Smooth motion; continuous line without jolts.'
    },
    'groovy': {
        id: 'groovy', term: 'groovy', freq: 'frequent',
        desc: 'Infectious rhythmic feel; danceable pocket.'
    },
    'rhythmic': {
        id: 'rhythmic', term: 'rhythmic', freq: 'frequent',
        desc: 'Beat-forward; pattern emphasis.'
    },
    'steady': {
        id: 'steady', term: 'steady', freq: 'frequent',
        desc: 'Even, consistent pulse or energy.'
    },
    'laid-back': {
        id: 'laid-back', term: 'laid-back', freq: 'frequent',
        desc: 'Relaxed feel within a moderate pace.'
    },
    'easy-going': {
        id: 'easy-going', term: 'easy-going', freq: 'frequent',
        desc: 'Undemanding, casual flow.'
    },
    'bouncy': {
        id: 'bouncy', term: 'bouncy', freq: 'infrequent',
        desc: 'Springy, buoyant rhythmic lift.'
    },

    // ---------------- Energy: Low / Relaxed ----------------
    'low-energy': {
        id: 'low-energy', term: 'low-energy', freq: 'frequent',
        desc: 'Soft, subtle intensity; minimal drive.'
    },
    'slow': {
        id: 'slow', term: 'slow', freq: 'ubiquitous',
        desc: 'Low tempo; unhurried pacing.'
    },
    'chill': {
        id: 'chill', term: 'chill', freq: 'frequent',
        desc: 'Very relaxed and mellow vibe.'
    },
    'ambient': {
        id: 'ambient', term: 'ambient', freq: 'frequent',
        desc: 'Atmospheric background focus; little rhythmic drive.'
    },
    'sedate': {
        id: 'sedate', term: 'sedate', freq: 'infrequent',
        desc: 'Very subdued, motionless feel.'
    },
    'subdued': {
        id: 'subdued', term: 'subdued', freq: 'frequent',
        desc: 'Restrained energy and dynamics.'
    },
    'static': {
        id: 'static', term: 'static', freq: 'infrequent',
        desc: 'Little change or motion; hovering.'
    },
    'languid': {
        id: 'languid', term: 'languid', freq: 'rare',
        desc: 'Lazy-slow and relaxed; unhurried.'
    },
    'drowsy': {
        id: 'drowsy', term: 'drowsy', freq: 'rare',
        desc: 'Sleepy, lulling quality.'
    },

    // ==================== Texture ====================

    // ---------------- Texture: Tone & Timbre ----------------
    'bright': {
        id: 'bright', term: 'bright', freq: 'frequent',
        desc: 'Treble-forward tone; crisp highs and sparkle.'
    },
    'dark': {
        id: 'dark', term: 'dark', freq: 'frequent',
        desc: 'Rolled-off highs; mellow/low-tilted tone.'
    },
    'warm': {
        id: 'warm', term: 'warm', freq: 'frequent',
        desc: 'Rich low/low-mid emphasis; cozy fullness.'
    },
    'cold': {
        id: 'cold', term: 'cold', freq: 'infrequent',
        desc: 'Thin/sterile tilt; analytical, less bass warmth.'
    },
    'balanced': {
        id: 'balanced', term: 'balanced', freq: 'frequent',
        desc: 'Even tonal distribution across the spectrum.'
    },
    'neutral': {
        id: 'neutral', term: 'neutral', freq: 'frequent',
        desc: 'Uncolored tonality; faithful reproduction.'
    },
    'full': {
        id: 'full', term: 'full', freq: 'frequent',
        desc: 'Robust body; not thin.'
    },
    'thin': {
        id: 'thin', term: 'thin', freq: 'frequent',
        desc: 'Lacks body/bass; insubstantial.'
    },
    'tinny': {
        id: 'tinny', term: 'tinny', freq: 'infrequent',
        desc: 'Very thin with sharp treble; small-speaker feel.'
    },
    'lush': {
        id: 'lush', term: 'lush', freq: 'frequent',
        desc: 'Rich, abundant harmonics; enveloping beauty.'
    },
    'ethereal-texture': {
        id: 'ethereal-texture', term: 'ethereal', freq: 'frequent',
        desc: 'Light, airy timbre with floating quality.',
        figurative: true
    },
    'bassy': {
        id: 'bassy', term: 'bassy', freq: 'infrequent',
        desc: 'Dominant low end presence.'
    },
    'boomy': {
        id: 'boomy', term: 'boomy', freq: 'infrequent',
        desc: 'Excess/loose bass causing muddiness.'
    },

    // ---------------- Texture: Density & Layering ----------------
    'dense': {
        id: 'dense', term: 'dense', freq: 'frequent',
        desc: 'Many simultaneous layers; packed sound.'
    },
    'thick': {
        id: 'thick', term: 'thick', freq: 'frequent',
        desc: 'Heavily layered or weighty texture.'
    },
    'sparse': {
        id: 'sparse', term: 'sparse', freq: 'frequent',
        desc: 'Few elements; lots of space/air.'
    },
    'layered': {
        id: 'layered', term: 'layered', freq: 'frequent',
        desc: 'Multiple overlapping parts/tracks.'
    },
    'minimalistic': {
        id: 'minimalistic', term: 'minimalistic', freq: 'frequent',
        desc: 'Deliberately few elements; simplicity.'
    },
    'full-bodied': {
        id: 'full-bodied', term: 'full-bodied', freq: 'frequent',
        desc: 'Rich presence across spectrum; solid weight.'
    },
    'rich': {
        id: 'rich', term: 'rich', freq: 'frequent',
        desc: 'Abundant, pleasing harmonic content.'
    },
    'complex': {
        id: 'complex', term: 'complex', freq: 'frequent',
        desc: 'Intricate interplay; many details.'
    },
    'hollow': {
        id: 'hollow', term: 'hollow', freq: 'infrequent',
        desc: 'Scooped midrange; empty center.'
    },

    // ---------------- Texture: Clarity & Production ----------------
    'clean': {
        id: 'clean', term: 'clean', freq: 'frequent',
        desc: 'Clear, low-noise; well-defined elements.'
    },
    'crisp': {
        id: 'crisp', term: 'crisp', freq: 'frequent',
        desc: 'Sharp transients; fresh, snappy detail.'
    },
    'clear': {
        id: 'clear', term: 'clear', freq: 'frequent',
        desc: 'Easy instrument separation; intelligible mix.'
    },
    'polished': {
        id: 'polished', term: 'polished', freq: 'frequent',
        desc: 'Refined, professional sheen; smoothed edges.'
    },
    'lo-fi': {
        id: 'lo-fi', term: 'lo-fi', freq: 'infrequent',
        desc: 'Intentional imperfections; retro/rough aesthetic.'
    },
    'raw-texture': {
        id: 'raw-texture', term: 'raw', freq: 'frequent',
        desc: 'Unrefined, minimally processed; gritty realism.'
    },
    'muddy': {
        id: 'muddy', term: 'muddy', freq: 'frequent',
        desc: 'Blurred definition; overlapping lows/low-mids.'
    },
    'muffled': {
        id: 'muffled', term: 'muffled', freq: 'frequent',
        desc: 'Dulled highs; covered/blanketed sound.'
    },
    'veiled': {
        id: 'veiled', term: 'veiled', freq: 'infrequent',
        desc: 'Subtle loss of clarity as if behind a veil.'
    },
    'detailed': {
        id: 'detailed', term: 'detailed', freq: 'frequent',
        desc: 'Fine nuance is audible; micro-details present.'
    },
    'sharp-texture': {
        id: 'sharp-texture', term: 'sharp', freq: 'infrequent',
        desc: 'Strongly defined edges; can verge on bright/edgy.'
    },

    // ---------------- Texture: Smoothness & Harshness ----------------
    'smooth': {
        id: 'smooth', term: 'smooth', freq: 'frequent',
        desc: 'Even, gentle tonality; no jarring peaks.'
    },
    'silky': {
        id: 'silky', term: 'silky', freq: 'infrequent',
        desc: 'Exceptionally smooth/soft, especially in highs.'
    },
    'soft-texture': {
        id: 'soft-texture', term: 'soft', freq: 'frequent',
        desc: 'Rounded attacks; gentle, non-abrasive surface.'
    },
    'harsh': {
        id: 'harsh', term: 'harsh', freq: 'frequent',
        desc: 'Grating/piercing upper-mids or treble; fatiguing.'
    },
    'shrill': {
        id: 'shrill', term: 'shrill', freq: 'infrequent',
        desc: 'Excessively bright/piercing; whistle-like top.'
    },
    'edgy': {
        id: 'edgy', term: 'edgy', freq: 'infrequent',
        desc: 'Noticeable bite/grit; excited upper-mids.'
    },
    'grating': {
        id: 'grating', term: 'grating', freq: 'infrequent',
        desc: 'Unpleasant scratchiness; rough on ears.'
    },
    'gritty-texture': {
        id: 'gritty-texture', term: 'gritty', freq: 'frequent',
        desc: 'Rough, grainy surface (often light distortion).'
    },
    'distorted': {
        id: 'distorted', term: 'distorted', freq: 'frequent',
        desc: 'Overdrive/fuzz artifacts; deliberate roughness.'
    },
    'creamy': {
        id: 'creamy', term: 'creamy', freq: 'rare',
        desc: 'Smooth, thick overdrive (guitarists’ slang).'
    },

    // ---------------- Texture: Space & Atmosphere ----------------
    'spacious': {
        id: 'spacious', term: 'spacious', freq: 'frequent',
        desc: 'Wide/deep sense of room; stereo and reverb depth.'
    },
    'airy': {
        id: 'airy', term: 'airy', freq: 'frequent',
        desc: 'Open top-end “air” and breathable space.'
    },
    'reverberant': {
        id: 'reverberant', term: 'reverberant', freq: 'infrequent',
        desc: 'Audible room/echo tail; long decays.'
    },
    'wet': {
        id: 'wet', term: 'wet', freq: 'infrequent',
        desc: 'Effect-heavy (reverb/delay); opposite of dry.'
    },
    'dry': {
        id: 'dry', term: 'dry', freq: 'frequent',
        desc: 'Close/roomless sound; minimal ambience.'
    },
    'intimate': {
        id: 'intimate', term: 'intimate', freq: 'infrequent',
        desc: 'Very close, personal proximity; detail-forward.'
    },
    'echoey': {
        id: 'echoey', term: 'echoey', freq: 'infrequent',
        desc: 'Audible repeats/reflections; obvious echoes.'
    },
    'atmospheric': {
        id: 'atmospheric', term: 'atmospheric', freq: 'frequent',
        desc: 'Evocative ambience; mood-first sound design.'
    },
    'cinematic': {
        id: 'cinematic', term: 'cinematic', freq: 'frequent',
        desc: 'Film-score scale; expansive and evocative.'
    },

    // ---------------- Texture: Source & Instrumentation ----------------
    'acoustic': {
        id: 'acoustic', term: 'acoustic', freq: 'frequent',
        desc: 'Natural, non-electric instruments; organic tone.'
    },
    'electric': {
        id: 'electric', term: 'electric', freq: 'frequent',
        desc: 'Amplified instruments; characteristic bite/shine.'
    },
    'electronic': {
        id: 'electronic', term: 'electronic', freq: 'frequent',
        desc: 'Synthesized/programmed sources; artificial timbres.'
    },
    'synthetic': {
        id: 'synthetic', term: 'synthetic', freq: 'frequent',
        desc: 'Deliberately artificial sound character.',
        aliases: ['electronic']
    },
    'orchestral': {
        id: 'orchestral', term: 'orchestral', freq: 'frequent',
        desc: 'Strings/brass/woods ensemble sonority; lush acoustic layers.'
    },
    'digital': {
        id: 'digital', term: 'digital', freq: 'infrequent',
        desc: 'Crisp, precise, sometimes clinical texture.'
    },
    'analog': {
        id: 'analog', term: 'analog', freq: 'infrequent',
        desc: 'Warm, saturated coloration associated with analog gear.'
    },
    'hybrid': {
        id: 'hybrid', term: 'hybrid', freq: 'rare',
        desc: 'Blend of acoustic and electronic sources.'
    }
};

// ------------------------------
// Hierarchy referencing canonical IDs
// ------------------------------
export const QualityHierarchyRef: QualityHierarchyRef = {
    Mood: {
        'Positive / Uplifting': [
            'upbeat', 'joyful', 'cheerful', 'feel-good', 'uplifting',
            'triumphant', 'epic', 'heroic', 'optimistic', 'playful', 'whimsical', 'hopeful'
        ],
        'Calm / Peaceful': [
            'calm', 'relaxed', 'soothing', 'peaceful', 'serene', 'mellow', 'tranquil', 'meditative'
        ],
        'Emotional / Sentimental': [
            'romantic', 'sentimental', 'heartfelt', 'soulful', 'poignant', 'bittersweet', 'wistful'
        ],
        'Dark / Brooding': [
            'sad', 'melancholic', 'somber', 'gloomy', 'brooding', 'gritty-mood', 'bleak', 'ominous', 'haunting', 'eerie'
        ],
        'Intense / Tense': [
            'intense', 'aggressive', 'fiery', 'angry', 'tense', 'suspenseful', 'urgent', 'dramatic', 'frantic'
        ],
        'Dreamy / Ethereal': [
            'dreamy', 'ethereal', 'otherworldly', 'mystical', 'enchanted'
        ]
    },

    Energy: {
        'High / Fast-Paced': [
            'high-energy', 'up-tempo', 'fast-paced', 'driving', 'pumping', 'pulsating',
            'propulsive', 'relentless', 'explosive', 'frenetic', 'brisk'
        ],
        'Medium / Flowing': [
            'medium-energy', 'mid-tempo', 'flowing', 'groovy', 'rhythmic', 'steady', 'laid-back', 'easy-going', 'bouncy'
        ],
        'Low / Relaxed': [
            'low-energy', 'slow', 'chill', 'ambient', 'sedate', 'subdued', 'static', 'languid', 'drowsy'
        ]
    },

    Texture: {
        'Tone & Timbre': [
            'bright', 'dark', 'warm', 'cold', 'balanced', 'neutral', 'full', 'thin', 'tinny', 'lush', 'ethereal-texture', 'bassy', 'boomy'
        ],
        'Density & Layering': [
            'dense', 'thick', 'sparse', 'layered', 'minimalistic', 'full-bodied', 'rich', 'complex', 'hollow'
        ],
        'Clarity & Production': [
            'clean', 'crisp', 'clear', 'polished', 'lo-fi', 'raw-texture', 'muddy', 'muffled', 'veiled', 'detailed', 'sharp-texture'
        ],
        'Smoothness & Harshness': [
            'smooth', 'silky', 'soft-texture', 'harsh', 'shrill', 'edgy', 'grating', 'gritty-texture', 'distorted', 'creamy'
        ],
        'Space & Atmosphere': [
            'spacious', 'airy', 'reverberant', 'wet', 'dry', 'intimate', 'echoey', 'atmospheric', 'cinematic'
        ],
        'Source & Instrumentation': [
            'acoustic', 'electric', 'electronic', 'synthetic', 'orchestral', 'digital', 'analog', 'hybrid'
        ]
    }
};

// ------------------------------
// Small helper for resolving IDs to TermDefs
// ------------------------------
export function resolveTerms(ids: string[]): TermDef[] {
    return ids.map(id => Terms[id]).filter((t): t is TermDef => Boolean(t));
}