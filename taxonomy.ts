// taxonomy.ts
// Unified Mood–Energy–Texture taxonomy (merged with Expanded QualityHierarchy dump).
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

// NOTE ON POLYSEMY:
// - We suffix terms that appear in multiple dimensions: `-mood`, `-energy`, `-texture`.
// - Example: `dark-mood` vs `dark` (timbre), `energetic-mood` vs `high-energy` (kinetic).

// Canonical registry (merged)
export const Terms: Record<string, TermDef> = {
    // ==================== Mood ====================
    // Positive / Uplifting
    'upbeat': { id: 'upbeat', term: 'upbeat', freq: 'ubiquitous', desc: 'Cheerful, lively mood—often mid/fast tempo and major-harmony.' },
    'energetic-mood': { id: 'energetic-mood', term: 'energetic', freq: 'ubiquitous', desc: 'Vital, excited feeling; overlaps with Energy but here denotes affect.' },
    'joyful': { id: 'joyful', term: 'joyful', freq: 'ubiquitous', desc: 'Clearly happy and celebratory in feeling.' },
    'happy': { id: 'happy', term: 'happy', freq: 'frequent', desc: 'Pleasant, contented, lighthearted mood.' },
    'cheerful': { id: 'cheerful', term: 'cheerful', freq: 'frequent', desc: 'Bright, pleasant, and mood-lifting.' },
    'uplifting': { id: 'uplifting', term: 'uplifting', freq: 'frequent', desc: 'Inspiring and elevating; leaves a hopeful afterglow.' },
    'positive-mood': { id: 'positive-mood', term: 'positive', freq: 'ubiquitous', desc: 'Overall optimistic or constructive feeling.' },
    'hopeful': { id: 'hopeful', term: 'hopeful', freq: 'frequent', desc: 'Gently confident that good outcomes await.' },
    'playful': { id: 'playful', term: 'playful', freq: 'frequent', desc: 'Light-hearted, fun, and quirky.' },
    'romantic': { id: 'romantic', term: 'romantic', freq: 'frequent', desc: 'Loving, passionate; tender emotional focus.' },
    'sentimental': { id: 'sentimental', term: 'sentimental', freq: 'frequent', desc: 'Nostalgic, tender, emotionally evocative.' },
    'triumphant': { id: 'triumphant', term: 'triumphant', freq: 'frequent', desc: 'Victorious, celebratory, often climactic.' },
    'heroic': { id: 'heroic', term: 'heroic', freq: 'frequent', desc: 'Bold, valiant, evokes courage and resolve.' },
    'optimistic': { id: 'optimistic', term: 'optimistic', freq: 'frequent', desc: 'Forward-looking confidence and positivity.' },
    'euphoric': { id: 'euphoric', term: 'euphoric', freq: 'infrequent', desc: 'Intense, overwhelming happiness or excitement.' },
    'exuberant': { id: 'exuberant', term: 'exuberant', freq: 'frequent', desc: 'Highly lively and effusively cheerful.' },
    'ecstatic': { id: 'ecstatic', term: 'ecstatic', freq: 'infrequent', desc: 'Overwhelming joyful excitement.' },
    'elated': { id: 'elated', term: 'elated', freq: 'infrequent', desc: 'Extremely happy and exhilarated.' },
    'celebratory': { id: 'celebratory', term: 'celebratory', freq: 'infrequent', desc: 'Marked by festivity and celebration.' },
    'festive': { id: 'festive', term: 'festive', freq: 'infrequent', desc: 'Cheerful mood associated with holidays/events.' },
    'inspiring': { id: 'inspiring', term: 'inspiring', freq: 'infrequent', desc: 'Evokes motivation, uplift, or awe.' },
    'sparkly-mood': { id: 'sparkly-mood', term: 'sparkly', freq: 'rare', desc: 'Glittering, lively mood coloration.', figurative: true },

    // Calm / Peaceful
    'peaceful': { id: 'peaceful', term: 'peaceful', freq: 'ubiquitous', desc: 'Serene and undisturbed; invites calm.' },
    'calm': { id: 'calm', term: 'calm', freq: 'ubiquitous', desc: 'Peaceful, unagitated, often slow and soft.' },
    'relaxed': { id: 'relaxed', term: 'relaxed', freq: 'ubiquitous', desc: 'Easy-going, unhurried, comfortable.' },
    'serene': { id: 'serene', term: 'serene', freq: 'frequent', desc: 'Calm, peaceful, and untroubled.' },
    'dreamy': { id: 'dreamy', term: 'dreamy', freq: 'frequent', desc: 'Soft, drifting, hazy; lull-like.' },
    'tranquil': { id: 'tranquil', term: 'tranquil', freq: 'frequent', desc: 'Very calm; stillness and quietude.' },
    'meditative': { id: 'meditative', term: 'meditative', freq: 'frequent', desc: 'Contemplative, repetitive, induces reflection.' },
    'soothing': { id: 'soothing', term: 'soothing', freq: 'frequent', desc: 'Comforting, tension-reducing, gentle.' },
    'gentle': { id: 'gentle', term: 'gentle', freq: 'frequent', desc: 'Mild, tender, and soft in character.' },
    'contemplative': { id: 'contemplative', term: 'contemplative', freq: 'infrequent', desc: 'Invites reflection and inward focus.' },
    'restful': { id: 'restful', term: 'restful', freq: 'infrequent', desc: 'Encourages rest; soothing calm.' },
    'ethereal-mood': { id: 'ethereal-mood', term: 'ethereal', freq: 'infrequent', desc: 'Delicate, light, beyond the ordinary; mood sense.', figurative: true },
    'atmospheric-mood': { id: 'atmospheric-mood', term: 'atmospheric', freq: 'infrequent', desc: 'Immersive calm ambience as a mood state.' },
    'flowing-mood': { id: 'flowing-mood', term: 'flowing', freq: 'infrequent', desc: 'Gently continuous, smooth emotional movement.' },
    'smooth-mood': { id: 'smooth-mood', term: 'smooth', freq: 'frequent', desc: 'Even, unruffled feeling; no sharp changes.' },
    'gossamer-mood': { id: 'gossamer-mood', term: 'gossamer', freq: 'rare', desc: 'Extremely light/delicate emotional hue.', figurative: true },

    // Dark / Negative
    'dark-mood': { id: 'dark-mood', term: 'dark', freq: 'ubiquitous', desc: 'Somber or ominous overall emotional cast (mood sense).' },
    'melancholic': { id: 'melancholic', term: 'melancholic', freq: 'frequent', desc: 'Pensive sadness; beautiful gloom.' },
    'sad': { id: 'sad', term: 'sad', freq: 'ubiquitous', desc: 'Plainly unhappy or sorrowful mood.' },
    'somber': { id: 'somber', term: 'somber', freq: 'frequent', desc: 'Grave, serious, darkly quiet.' },
    'brooding': { id: 'brooding', term: 'brooding', freq: 'frequent', desc: 'Heavy, simmering darkness; inward tension.' },
    'mournful': { id: 'mournful', term: 'mournful', freq: 'frequent', desc: 'Expressing grief or loss.' },
    'gloomy': { id: 'gloomy', term: 'gloomy', freq: 'frequent', desc: 'Oppressively dark or dejected.' },
    'haunting': { id: 'haunting', term: 'haunting', freq: 'frequent', desc: 'Eerily evocative; lingers in memory.' },
    'moody': { id: 'moody', term: 'moody', freq: 'frequent', desc: 'Darkly expressive; emotionally changeable.' },
    'desolate': { id: 'desolate', term: 'desolate', freq: 'infrequent', desc: 'Bleak emptiness; abandoned feeling.' },
    'forlorn': { id: 'forlorn', term: 'forlorn', freq: 'infrequent', desc: 'Pitifully sad and abandoned.' },
    'wistful': { id: 'wistful', term: 'wistful', freq: 'infrequent', desc: 'Reflective longing; gentle sadness.' },
    'tragic': { id: 'tragic', term: 'tragic', freq: 'infrequent', desc: 'Marked by extreme distress or sorrow.' },
    'lonely': { id: 'lonely', term: 'lonely', freq: 'infrequent', desc: 'Evokes isolation and solitude.' },
    'ominous': { id: 'ominous', term: 'ominous', freq: 'infrequent', desc: 'Foreboding; signals approaching threat.' },
    'disturbing': { id: 'disturbing', term: 'disturbing', freq: 'infrequent', desc: 'Causes unease or psychological discomfort.' },
    'shadowy-mood': { id: 'shadowy-mood', term: 'shadowy', freq: 'rare', desc: 'Suggests obscurity or lurking darkness.' },
    'plaintive': { id: 'plaintive', term: 'plaintive', freq: 'rare', desc: 'Sounding sad and mournful.' },
    'negative-mood': { id: 'negative-mood', term: 'negative', freq: 'frequent', desc: 'Overall pessimistic or destructive feeling.' },

    // Intense / Aggressive
    'intense-mood': { id: 'intense-mood', term: 'intense', freq: 'ubiquitous', desc: 'Powerful, emotionally charged; mood sense.' },
    'aggressive': { id: 'aggressive', term: 'aggressive', freq: 'ubiquitous', desc: 'Confrontational, forceful, often loud.' },
    'driving-mood': { id: 'driving-mood', term: 'driving', freq: 'frequent', desc: 'Insistent, forward-pushing emotional drive.' },
    'powerful-mood': { id: 'powerful-mood', term: 'powerful', freq: 'frequent', desc: 'Strong, commanding affect.' },
    'forceful': { id: 'forceful', term: 'forceful', freq: 'frequent', desc: 'Assertive, insistent presence.' },
    'fierce': { id: 'fierce', term: 'fierce', freq: 'frequent', desc: 'Savage intensity; ferocity.' },
    'raw-mood': { id: 'raw-mood', term: 'raw', freq: 'frequent', desc: 'Unfiltered, rough emotional edge.' },
    'edgy-mood': { id: 'edgy-mood', term: 'edgy', freq: 'frequent', desc: 'Nervy, sharp, provocative affect.' },
    'explosive-mood': { id: 'explosive-mood', term: 'explosive', freq: 'frequent', desc: 'Sudden emotional outbursts; volatility.' },
    'menacing': { id: 'menacing', term: 'menacing', freq: 'frequent', desc: 'Threatening presence; looming danger.' },
    'angry': { id: 'angry', term: 'angry', freq: 'frequent', desc: 'Explicit rage or frustration.' },
    'violent': { id: 'violent', term: 'violent', freq: 'infrequent', desc: 'Brutal, forceful aggression.' },
    'furious': { id: 'furious', term: 'furious', freq: 'infrequent', desc: 'Extremely angry or violent.' },
    'tense': { id: 'tense', term: 'tense', freq: 'infrequent', desc: 'Anxious strain; sustained unease.' },
    'harsh-mood': { id: 'harsh-mood', term: 'harsh', freq: 'infrequent', desc: 'Severe, unforgiving emotional quality.' },
    'thunderous': { id: 'thunderous', term: 'thunderous', freq: 'infrequent', desc: 'Extremely loud/powerful impact.' },
    'blistering': { id: 'blistering', term: 'blistering', freq: 'rare', desc: 'Scorchingly intense affect.' },
    'snarling': { id: 'snarling', term: 'snarling', freq: 'rare', desc: 'Hostile, growling aggression.' },
    'chaotic-mood': { id: 'chaotic-mood', term: 'chaotic', freq: 'infrequent', desc: 'Confused, disorderly affect causing anxiety.' },

    // Mysterious / Ambiguous
    'mysterious': { id: 'mysterious', term: 'mysterious', freq: 'frequent', desc: 'Unknown/uncanny; invites curiosity.' },
    'enigmatic': { id: 'enigmatic', term: 'enigmatic', freq: 'frequent', desc: 'Difficult to interpret; puzzling.' },
    'ethereal-ambience': { id: 'ethereal-ambience', term: 'ethereal', freq: 'frequent', desc: 'Otherworldly aura; ambiguous wonder.', figurative: true },
    'haunting': { id: 'haunting', term: 'haunting', freq: 'frequent', desc: 'Eerily evocative; lingers in memory.' },
    'otherworldly': { id: 'otherworldly', term: 'otherworldly', freq: 'infrequent', desc: 'Beyond earthly; uncanny atmosphere.', figurative: true },
    'mystical': { id: 'mystical', term: 'mystical', freq: 'infrequent', desc: 'Suggests spiritual/magical aura.', figurative: true },
    'cryptic': { id: 'cryptic', term: 'cryptic', freq: 'infrequent', desc: 'Obscure meaning; coded feel.' },
    'elusive': { id: 'elusive', term: 'elusive', freq: 'rare', desc: 'Hard to grasp or define.' },
    'veiled-mood': { id: 'veiled-mood', term: 'veiled', freq: 'rare', desc: 'Concealed, partially hidden emotional color.' },
    'obscure-mood': { id: 'obscure-mood', term: 'obscure', freq: 'infrequent', desc: 'Ambiguous/hidden intent.' },
    'twilight': { id: 'twilight', term: 'twilight', freq: 'rare', desc: 'Between light/dark; liminal feel.' },
    'liminal': { id: 'liminal', term: 'liminal', freq: 'rare', desc: 'Threshold/transition state mood.' },
    'majestic': { id: 'majestic', term: 'majestic', freq: 'frequent', desc: 'Impressive grandeur and dignity.' },
    'epic': { id: 'epic', term: 'epic', freq: 'frequent', desc: 'Grand, larger-than-life, cinematic in scope.' },
    'strange': { id: 'strange', term: 'strange', freq: 'frequent', desc: 'Unusual, difficult to explain.' },

    // Romantic / Tender (NEW)
    'tender': { id: 'tender', term: 'tender', freq: 'frequent', desc: 'Gentle affection; caring emotional tone.' },
    'affectionate': { id: 'affectionate', term: 'affectionate', freq: 'frequent', desc: 'Warm fondness; loving character.' },
    'intimate-mood': { id: 'intimate-mood', term: 'intimate', freq: 'frequent', desc: 'Close, personal proximity; vulnerability.' },
    'loving': { id: 'loving', term: 'loving', freq: 'frequent', desc: 'Expresses love and devotion.' },
    'sensual': { id: 'sensual', term: 'sensual', freq: 'frequent', desc: 'Evokes physical/romantic allure.' },
    'warm-hearted': { id: 'warm-hearted', term: 'warm-hearted', freq: 'infrequent', desc: 'Kindly, compassionate tone.' },
    'sultry': { id: 'sultry', term: 'sultry', freq: 'infrequent', desc: 'Smoldering, suggestive warmth.' },
    'passionate': { id: 'passionate', term: 'passionate', freq: 'frequent', desc: 'Intense, ardent feeling.' },
    'yearning': { id: 'yearning', term: 'yearning', freq: 'infrequent', desc: 'Intense longing desire.' },
    'longing': { id: 'longing', term: 'longing', freq: 'infrequent', desc: 'Persistent desire tinged with sadness.' },

    // Nostalgic / Reflective (NEW)
    'nostalgic': { id: 'nostalgic', term: 'nostalgic', freq: 'frequent', desc: 'Fond remembrance of the past.' },
    'reflective': { id: 'reflective', term: 'reflective', freq: 'frequent', desc: 'Thoughtful contemplation; introspective.' },
    'bittersweet': { id: 'bittersweet', term: 'bittersweet', freq: 'frequent', desc: 'Pleasant yet tinged with sadness.' },
    'reminiscent': { id: 'reminiscent', term: 'reminiscent', freq: 'infrequent', desc: 'Evokes earlier styles/memories.' },
    'pensive': { id: 'pensive', term: 'pensive', freq: 'infrequent', desc: 'Engaged in deep or serious thought.' },
    'poignant': { id: 'poignant', term: 'poignant', freq: 'infrequent', desc: 'Touching, emotionally moving.' },
    'memory-laden': { id: 'memory-laden', term: 'memory-laden', freq: 'rare', desc: 'Heavily charged with memory associations.' },
    'retrospective': { id: 'retrospective', term: 'retrospective', freq: 'infrequent', desc: 'Looking back; backward gaze.' },

    // ==================== Energy ====================
    // High / Positive Drive
    'high-energy': { id: 'high-energy', term: 'high-energy', freq: 'ubiquitous', desc: 'Very lively, intense; strong beats and dynamics.' },
    'driving': { id: 'driving', term: 'driving', freq: 'frequent', desc: 'Relentless forward propulsion from pulse/groove.', aliases: ['propulsive'] },
    'vigorous': { id: 'vigorous', term: 'vigorous', freq: 'frequent', desc: 'Robust, forceful kinetic output.' },
    'propulsive': { id: 'propulsive', term: 'propulsive', freq: 'frequent', desc: 'Pushes forward insistently; kinetic motion.', aliases: ['driving'] },
    'pumping': { id: 'pumping', term: 'pumping', freq: 'frequent', desc: 'Throbbing, vigorous energy (dance/EDM connotation).' },
    'dynamic-energy': { id: 'dynamic-energy', term: 'dynamic', freq: 'frequent', desc: 'Marked changes/impact; lively articulation.' },
    'explosive': { id: 'explosive', term: 'explosive', freq: 'frequent', desc: 'Sudden bursts of high intensity.' },
    'kinetic': { id: 'kinetic', term: 'kinetic', freq: 'infrequent', desc: 'Emphasizes motion and activity.' },
    'punchy': { id: 'punchy', term: 'punchy', freq: 'frequent', desc: 'Strong attack/transient impact.' },
    'pulsating': { id: 'pulsating', term: 'pulsating', freq: 'infrequent', desc: 'Strong repeating beat or vibration.' },
    'frenetic': { id: 'frenetic', term: 'frenetic', freq: 'infrequent', desc: 'Extremely energetic and chaotic.' },
    'relentless': { id: 'relentless', term: 'relentless', freq: 'infrequent', desc: 'Unyielding pace; no respite.' },
    'urgent': { id: 'urgent', term: 'urgent', freq: 'infrequent', desc: 'Insistent forward pressure; haste.' },
    'vibrant': { id: 'vibrant', term: 'vibrant', freq: 'frequent', desc: 'Full of life and energetic motion.' },
    'bouncy': { id: 'bouncy', term: 'bouncy', freq: 'frequent', desc: 'Springy, buoyant rhythmic lift.' },
    'brisk': { id: 'brisk', term: 'brisk', freq: 'infrequent', desc: 'Quick and lively without heaviness.' },
    'electrifying': { id: 'electrifying', term: 'electrifying', freq: 'infrequent', desc: 'Thrilling surge of live energy.' },
    'high-octane': { id: 'high-octane', term: 'high-octane', freq: 'rare', desc: 'Colloquial for extremely energetic.' },
    'turbocharged': { id: 'turbocharged', term: 'turbocharged', freq: 'rare', desc: 'Maximal, amped-up energy.' },
    'thumping': { id: 'thumping', term: 'thumping', freq: 'infrequent', desc: 'Dominant, emphatic kick/bass beat.' },

    // Medium / Flowing
    'flowing': { id: 'flowing', term: 'flowing', freq: 'frequent', desc: 'Smooth motion; continuous line without jolts.' },
    'steady': { id: 'steady', term: 'steady', freq: 'frequent', desc: 'Even, consistent pulse or energy.' },
    'moderate': { id: 'moderate', term: 'moderate', freq: 'frequent', desc: 'Middle-range tempo and intensity.' },
    'balanced-energy': { id: 'balanced-energy', term: 'balanced', freq: 'frequent', desc: 'Moderate, controlled feel with elements in proportion.' },
    'measured': { id: 'measured', term: 'measured', freq: 'frequent', desc: 'Careful, controlled pace.' },
    'rolling': { id: 'rolling', term: 'rolling', freq: 'frequent', desc: 'Continuous, gentle rhythmic motion.' },
    'rhythmic': { id: 'rhythmic', term: 'rhythmic', freq: 'frequent', desc: 'Strong, regular pattern of movement/sound.' },
    'groovy': { id: 'groovy', term: 'groovy', freq: 'frequent', desc: 'Infectious rhythmic feel; danceable pocket.' },
    'medium-energy': { id: 'medium-energy', term: 'medium-energy', freq: 'infrequent', desc: 'Moderate intensity; balanced drive.' },
    'cascading': { id: 'cascading', term: 'cascading', freq: 'infrequent', desc: 'Wave-like successive motion.' },
    'undulating': { id: 'undulating', term: 'undulating', freq: 'infrequent', desc: 'Rising/falling rhythmic contour.' },
    'swinging': { id: 'swinging', term: 'swinging', freq: 'frequent', desc: 'Jazz long–short eighths; lilting feel.' },
    'pulsing': { id: 'pulsing', term: 'pulsing', freq: 'infrequent', desc: 'Steady beat emphasis without aggression.' },
    'unhurried': { id: 'unhurried', term: 'unhurried', freq: 'infrequent', desc: 'Without haste; relaxed pacing.' },
    'cruising': { id: 'cruising', term: 'cruising', freq: 'rare', desc: 'Comfortably moving along; effortless pace.' },
    'mid-tempo': { id: 'mid-tempo', term: 'mid-tempo', freq: 'frequent', desc: 'Moderate tempo; comfortable pacing.' },
    'paced': { id: 'paced', term: 'paced', freq: 'infrequent', desc: 'Deliberately controlled speed.' },

    // Low / Peaceful
    'laid-back': { id: 'laid-back', term: 'laid-back', freq: 'frequent', desc: 'Relaxed feel within a moderate pace.' },
    'low-energy': { id: 'low-energy', term: 'low-energy', freq: 'frequent', desc: 'Soft, subtle intensity; minimal drive.' },
    'ambient': { id: 'ambient', term: 'ambient', freq: 'frequent', desc: 'Atmospheric background focus; little rhythmic drive.' },
    'chill': { id: 'chill', term: 'chill', freq: 'ubiquitous', desc: 'Very relaxed and mellow vibe.' },
    'mellow-energy': { id: 'mellow-energy', term: 'mellow', freq: 'ubiquitous', desc: 'Soft relaxed energy profile (not timbre).' },
    'gentle-energy': { id: 'gentle-energy', term: 'gentle', freq: 'frequent', desc: 'Soft, non-insistent kinetic character.' },
    'subdued': { id: 'subdued', term: 'subdued', freq: 'frequent', desc: 'Restrained energy and dynamics.' },
    'restrained': { id: 'restrained', term: 'restrained', freq: 'infrequent', desc: 'Held-back intensity; controlled output.' },
    'placid': { id: 'placid', term: 'placid', freq: 'infrequent', desc: 'Calm, undisturbed energy.' },
    'still': { id: 'still', term: 'still', freq: 'infrequent', desc: 'Near motionless; minimal rhythmic activity.' },
    'relaxed-energy': { id: 'relaxed-energy', term: 'relaxed', freq: 'ubiquitous', desc: 'General low-arousal pacing.' },
    'downtempo': { id: 'downtempo', term: 'downtempo', freq: 'frequent', desc: 'Low BPM electronic contexts.' },
    'languid': { id: 'languid', term: 'languid', freq: 'infrequent', desc: 'Lazy-slow and relaxed; unhurried.' },
    'serene-energy': { id: 'serene-energy', term: 'serene', freq: 'frequent', desc: 'Peaceful kinetic profile.' },
    'hushed': { id: 'hushed', term: 'hushed', freq: 'infrequent', desc: 'Very quiet, intimate dynamics.' },
    'delicate-energy': { id: 'delicate-energy', term: 'delicate', freq: 'frequent', desc: 'Light touch; gentle motion.' },
    'soft-energy': { id: 'soft-energy', term: 'soft', freq: 'ubiquitous', desc: 'Low level, non-strident dynamics.' },
    'sedate': { id: 'sedate', term: 'sedate', freq: 'rare', desc: 'Very subdued, motionless feel.' },
    'hypnotic': { id: 'hypnotic', term: 'hypnotic', freq: 'infrequent', desc: 'Gently repetitive; trance-like state.' },

    // Negative / Unstable
    'tense-energy': { id: 'tense-energy', term: 'tense', freq: 'frequent', desc: 'Sustained stress in kinetic profile.' },
    'anxious-energy': { id: 'anxious-energy', term: 'anxious', freq: 'frequent', desc: 'Nervous restlessness; jitter.' },
    'chaotic-energy': { id: 'chaotic-energy', term: 'chaotic', freq: 'frequent', desc: 'Irregular/unpredictable rhythm or form.' },
    'agitated': { id: 'agitated', term: 'agitated', freq: 'infrequent', desc: 'Stirred-up, unsettled motion.' },
    'erratic': { id: 'erratic', term: 'erratic', freq: 'infrequent', desc: 'Uneven, unpredictable movement.' },
    'unstable': { id: 'unstable', term: 'unstable', freq: 'infrequent', desc: 'Lacking steadiness; fluctuating energy.' },
    'jarring-energy': { id: 'jarring-energy', term: 'jarring', freq: 'infrequent', desc: 'Shocking discontinuities; sudden changes.' },
    'dissonant-energy': { id: 'dissonant-energy', term: 'dissonant', freq: 'frequent', desc: 'Harmonic clash used to create tension (structural driver of energy instability).' },
    'turbulent': { id: 'turbulent', term: 'turbulent', freq: 'infrequent', desc: 'Rough, stormy motion; upheaval.' },
    'unsettling-energy': { id: 'unsettling-energy', term: 'unsettling', freq: 'infrequent', desc: 'Disturbing, uneasy motion.' },
    'fragmented': { id: 'fragmented', term: 'fragmented', freq: 'infrequent', desc: 'Broken, discontinuous structure.' },
    'static-energy': { id: 'static-energy', term: 'static', freq: 'infrequent', desc: 'Little/no movement; stasis perceived negatively.' },
    'restless': { id: 'restless', term: 'restless', freq: 'infrequent', desc: 'Unable to be still; fidgety impulse to move.' },
    'jittery': { id: 'jittery', term: 'jittery', freq: 'rare', desc: 'Nervous, shaky energy.' },
    'hectic': { id: 'hectic', term: 'hectic', freq: 'infrequent', desc: 'Frantic activity; overbusy motion.' },
    'disjointed': { id: 'disjointed', term: 'disjointed', freq: 'rare', desc: 'Lacking coherent sequence/connection.' },

    // Expansive / Other (temporal evolution of energy)
    'expansive': { id: 'expansive', term: 'expansive', freq: 'frequent', desc: 'Broadening scope/scale; widening feel.' },
    'soaring': { id: 'soaring', term: 'soaring', freq: 'frequent', desc: 'Rising, uplifting arc.' },
    'lifting': { id: 'lifting', term: 'lifting', freq: 'infrequent', desc: 'Perceptible rise in intensity or mood.' },
    'transcendent-energy': { id: 'transcendent-energy', term: 'transcendent', freq: 'infrequent', desc: 'Beyond ordinary bounds; elevating arc.' },
    'boundless': { id: 'boundless', term: 'boundless', freq: 'rare', desc: 'Seemingly limitless scale.' },
    'sweeping': { id: 'sweeping', term: 'sweeping', freq: 'frequent', desc: 'Wide, grand movement.' },
    'majestic-energy': { id: 'majestic-energy', term: 'majestic', freq: 'frequent', desc: 'Grand scaling of energy over time.' },
    'panoramic': { id: 'panoramic', term: 'panoramic', freq: 'infrequent', desc: 'Wide-field, expansive vista.' },
    'vast': { id: 'vast', term: 'vast', freq: 'infrequent', desc: 'Very great in size/extent.' },
    'cosmic': { id: 'cosmic', term: 'cosmic', freq: 'infrequent', desc: 'Space-like vastness; psychedelic arc.' },
    'breathless': { id: 'breathless', term: 'breathless', freq: 'infrequent', desc: 'So intense it takes one’s breath away.' },
    'gradual': { id: 'gradual', term: 'gradual', freq: 'frequent', desc: 'Slow change by degrees (energy evolution).' },
    'crescendoing': { id: 'crescendoing', term: 'crescendoing', freq: 'infrequent', desc: 'Gradual increase in loudness/intensity.' },
    'swelling': { id: 'swelling', term: 'swelling', freq: 'frequent', desc: 'Becoming greater in intensity/volume.' },
    'decaying': { id: 'decaying', term: 'decaying', freq: 'infrequent', desc: 'Gradual decrease in strength/quality.' },
    'wavering': { id: 'wavering', term: 'wavering', freq: 'rare', desc: 'Quivering/unstable amplitude or intensity.' },
    'oscillating': { id: 'oscillating', term: 'oscillating', freq: 'rare', desc: 'Back-and-forth periodic motion.' },
    'spiraling': { id: 'spiraling', term: 'spiraling', freq: 'rare', desc: 'Continuous dramatic increase or decrease.' },

    // ==================== Texture ====================
    // Bright / Positive
    'bright': { id: 'bright', term: 'bright', freq: 'ubiquitous', desc: 'Treble-forward tone; crisp highs and sparkle.' },
    'crisp': { id: 'crisp', term: 'crisp', freq: 'ubiquitous', desc: 'Sharp transients; fresh, snappy detail.' },
    'clear': { id: 'clear', term: 'clear', freq: 'ubiquitous', desc: 'Easy instrument separation; intelligible mix.' },
    'brilliant': { id: 'brilliant', term: 'brilliant', freq: 'frequent', desc: 'Exceptionally bright/gleaming highs.' },
    'sparkling': { id: 'sparkling', term: 'sparkling', freq: 'frequent', desc: 'Very crisp and bright high frequencies.' },
    'crystalline': { id: 'crystalline', term: 'crystalline', freq: 'frequent', desc: 'Exceptionally clear/transparent highs.' },
    'shimmering': { id: 'shimmering', term: 'shimmering', freq: 'frequent', desc: 'Softly sparkling highs; cymbals/reverb sheen.' },
    'radiant': { id: 'radiant', term: 'radiant', freq: 'infrequent', desc: 'Glowing, luminous presence.' },
    'gleaming': { id: 'gleaming', term: 'gleaming', freq: 'infrequent', desc: 'Highly polished/sparkling impression.' },
    'airy': { id: 'airy', term: 'airy', freq: 'frequent', desc: 'Open top-end “air” and breathable space.' },
    'polished': { id: 'polished', term: 'polished', freq: 'frequent', desc: 'Refined, professional sheen; smoothed edges.' },
    'pristine': { id: 'pristine', term: 'pristine', freq: 'frequent', desc: 'Spotlessly clean/untouched quality.' },
    'shiny': { id: 'shiny', term: 'shiny', freq: 'infrequent', desc: 'Glossy, reflective timbral surface.' },
    'luminous': { id: 'luminous', term: 'luminous', freq: 'rare', desc: 'Emits an impression of light/shine.', figurative: true },

    // Warm / Peaceful
    'warm': { id: 'warm', term: 'warm', freq: 'ubiquitous', desc: 'Rich low/low-mid emphasis; cozy fullness.' },
    'rich': { id: 'rich', term: 'rich', freq: 'ubiquitous', desc: 'Abundant, pleasing harmonic content.' },
    'full': { id: 'full', term: 'full', freq: 'frequent', desc: 'Robust body; not thin.' },
    'lush': { id: 'lush', term: 'lush', freq: 'frequent', desc: 'Rich, abundant harmonics; enveloping beauty.' },
    'creamy': { id: 'creamy', term: 'creamy', freq: 'frequent', desc: 'Smooth, thick overdrive or timbre.' },
    'honeyed': { id: 'honeyed', term: 'honeyed', freq: 'infrequent', desc: 'Sweet, pleasant warmth.' },
    'golden': { id: 'golden', term: 'golden', freq: 'frequent', desc: 'Vintage-like, pleasing warmth.' },
    'mellow': { id: 'mellow', term: 'mellow', freq: 'ubiquitous', desc: 'Pleasantly smooth or soft; free from harshness.' },
    'rounded': { id: 'rounded', term: 'rounded', freq: 'frequent', desc: 'Lacks sharp edges; gentle contours.' },
    'embracing': { id: 'embracing', term: 'embracing', freq: 'rare', desc: 'Enveloping, comforting tone.' },
    'enveloping': { id: 'enveloping', term: 'enveloping', freq: 'infrequent', desc: 'Immersive, surrounding soundfield.' },
    'cozy': { id: 'cozy', term: 'cozy', freq: 'infrequent', desc: 'Intimate, comfortable warmth.' },
    'sumptuous': { id: 'sumptuous', term: 'sumptuous', freq: 'rare', desc: 'Luxuriously rich sound.' },
    'velvety': { id: 'velvety', term: 'velvety', freq: 'infrequent', desc: 'Exceptionally smooth/soft impression.' },
    'buttery': { id: 'buttery', term: 'buttery', freq: 'infrequent', desc: 'Smooth, rich, creamy tone.' },
    'silky': { id: 'silky', term: 'silky', freq: 'infrequent', desc: 'Soft, smooth highs; glossy surface.' },
    'soft-texture': { id: 'soft-texture', term: 'soft', freq: 'ubiquitous', desc: 'Rounded attacks; gentle, non-abrasive surface.' },

    // Dark / Negative (Texture)
    'dark': { id: 'dark', term: 'dark', freq: 'ubiquitous', desc: 'Rolled-off highs; mellow/low-tilted tone.' },
    'muddy': { id: 'muddy', term: 'muddy', freq: 'frequent', desc: 'Blurred definition; excess low-mids.' },
    'harsh': { id: 'harsh', term: 'harsh', freq: 'frequent', desc: 'Grating/piercing upper-mids or treble; fatiguing.' },
    'gritty-texture': { id: 'gritty-texture', term: 'gritty', freq: 'frequent', desc: 'Rough, grainy surface (often light distortion).' },
    'murky': { id: 'murky', term: 'murky', freq: 'frequent', desc: 'Obscured, unclear timbre.' },
    'raspy': { id: 'raspy', term: 'raspy', freq: 'frequent', desc: 'Hoarse/rough-sounding timbre.' },
    'buzzy': { id: 'buzzy', term: 'buzzy', freq: 'frequent', desc: 'Low continuous buzz-like overtone.' },
    'distorted': { id: 'distorted', term: 'distorted', freq: 'frequent', desc: 'Overdrive/fuzz artifacts; deliberate roughness.' },
    'coarse': { id: 'coarse', term: 'coarse', freq: 'infrequent', desc: 'Rough, harshly textured timbre.' },
    'abrasive': { id: 'abrasive', term: 'abrasive', freq: 'infrequent', desc: 'Harsh/grating surface texture.' },
    'shadowy-texture': { id: 'shadowy-texture', term: 'shadowy', freq: 'infrequent', desc: 'Obscured, dim tonal quality.' },
    'veiled': { id: 'veiled', term: 'veiled', freq: 'infrequent', desc: 'Covered/less defined highs; slight haze.' },
    'obscured': { id: 'obscured', term: 'obscured', freq: 'infrequent', desc: 'Details hidden by noise/mix.' },
    'heavy': { id: 'heavy', term: 'heavy', freq: 'frequent', desc: 'Great density, often low-end focus.' },
    'dense': { id: 'dense', term: 'dense', freq: 'frequent', desc: 'Many simultaneous layers; packed sound.' },
    'thick': { id: 'thick', term: 'thick', freq: 'frequent', desc: 'Heavily layered or weighty texture.' },
    'clouded': { id: 'clouded', term: 'clouded', freq: 'infrequent', desc: 'Hazy, fogged clarity.' },
    'muffled': { id: 'muffled', term: 'muffled', freq: 'frequent', desc: 'Dulled highs; covered/blanketed sound.' },
    'oppressive': { id: 'oppressive', term: 'oppressive', freq: 'rare', desc: 'Overwhelming weight; stifling timbre.' },

    // Natural / Acoustic
    'acoustic': { id: 'acoustic', term: 'acoustic', freq: 'ubiquitous', desc: 'Natural, non-electric instruments; organic tone.' },
    'organic': { id: 'organic', term: 'organic', freq: 'frequent', desc: 'Natural/untreated character; not artificial.' },
    'natural': { id: 'natural', term: 'natural', freq: 'ubiquitous', desc: 'Not electronically created; authentic tone.' },
    'raw-texture': { id: 'raw-texture', term: 'raw', freq: 'frequent', desc: 'Unrefined, minimally processed; gritty realism.' },
    'live': { id: 'live', term: 'live', freq: 'frequent', desc: 'Captured performance; concert feel.' },
    'authentic': { id: 'authentic', term: 'authentic', freq: 'frequent', desc: 'Genuine, unfeigned production choices.' },
    'unprocessed': { id: 'unprocessed', term: 'unprocessed', freq: 'infrequent', desc: 'Minimal signal processing audible.' },
    'woody': { id: 'woody', term: 'woody', freq: 'frequent', desc: 'Wood-bodied instrument coloration.' },
    'breathy': { id: 'breathy', term: 'breathy', freq: 'frequent', desc: 'Audible airflow in vocals/winds.' },
    'human': { id: 'human', term: 'human', freq: 'frequent', desc: 'Clearly human touch/imperfections.' },
    'intimate': { id: 'intimate', term: 'intimate', freq: 'frequent', desc: 'Very close, personal proximity; detail-forward.' },
    'close-miked': { id: 'close-miked', term: 'close-miked', freq: 'infrequent', desc: 'Microphone placed near source; proximity tone.' },
    'hollow': { id: 'hollow', term: 'hollow', freq: 'infrequent', desc: 'Scooped midrange; empty center.' },
    'earthy': { id: 'earthy', term: 'earthy', freq: 'infrequent', desc: 'Unrefined, grounded, rustic character.' },
    'fibrous': { id: 'fibrous', term: 'fibrous', freq: 'rare', desc: 'Fiber-like, stringy timbral quality.' },
    'resonant': { id: 'resonant', term: 'resonant', freq: 'frequent', desc: 'Deep, clear, continuing reverberation.' },
    'textured': { id: 'textured', term: 'textured', freq: 'frequent', desc: 'Noticeably tactile sonic surface.' },
    'grainy': { id: 'grainy', term: 'grainy', freq: 'frequent', desc: 'Granular, roughened surface.' },

    // Synthetic / Electronic
    'electronic': { id: 'electronic', term: 'electronic', freq: 'ubiquitous', desc: 'Synthesized/programmed sources; artificial timbres.' },
    'synthetic': { id: 'synthetic', term: 'synthetic', freq: 'frequent', desc: 'Deliberately artificial sound character.', aliases: ['electronic'] },
    'digital': { id: 'digital', term: 'digital', freq: 'frequent', desc: 'Crisp, precise, sometimes clinical texture.' },
    'processed': { id: 'processed', term: 'processed', freq: 'frequent', desc: 'Audibly manipulated with effects/processing.' },
    'programmed': { id: 'programmed', term: 'programmed', freq: 'frequent', desc: 'Sequenced/computer-created parts.' },
    'artificial': { id: 'artificial', term: 'artificial', freq: 'frequent', desc: 'Non-natural/manufactured sounds.' },
    'computerized': { id: 'computerized', term: 'computerized', freq: 'infrequent', desc: 'Overtly digital/computer-derived tone.' },
    'robotic': { id: 'robotic', term: 'robotic', freq: 'frequent', desc: 'Mechanical, inhuman articulations.' },
    'futuristic': { id: 'futuristic', term: 'futuristic', freq: 'infrequent', desc: 'Sci‑fi/forward-looking timbres.' },
    'cyber': { id: 'cyber', term: 'cyber', freq: 'infrequent', desc: 'Digital/internet-aesthetic coloration.' },
    'pixelated': { id: 'pixelated', term: 'pixelated', freq: 'rare', desc: 'Blocky/granular digital artifacting.', figurative: true },
    'metallic': { id: 'metallic', term: 'metallic', freq: 'frequent', desc: 'Sharp, ringing, metal-like overtones.' },
    'glassy': { id: 'glassy', term: 'glassy', freq: 'infrequent', desc: 'Smooth, brittle, crystalline timbre.' },
    'analog': { id: 'analog', term: 'analog', freq: 'frequent', desc: 'Warm coloration typical of analog gear.' },
    'mechanical': { id: 'mechanical', term: 'mechanical', freq: 'infrequent', desc: 'Machine-like regularity; non-human quality.' },
    'glitchy': { id: 'glitchy', term: 'glitchy', freq: 'infrequent', desc: 'Clicks/stutters; intentional digital error aesthetic.' },

    // Density & Layering (formal + informal)
    'layered': { id: 'layered', term: 'layered', freq: 'frequent', desc: 'Multiple overlapping parts/tracks.' },
    'complex': { id: 'complex', term: 'complex', freq: 'frequent', desc: 'Intricate interplay; many details.' },
    'rich-density': { id: 'rich-density', term: 'rich', freq: 'ubiquitous', desc: 'Overall fullness from many components.' },
    'full-bodied': { id: 'full-bodied', term: 'full-bodied', freq: 'frequent', desc: 'Rich presence across spectrum; solid weight.' },
    'orchestrated': { id: 'orchestrated', term: 'orchestrated', freq: 'infrequent', desc: 'Arranged for many parts/sections.' },
    'intricate': { id: 'intricate', term: 'intricate', freq: 'frequent', desc: 'Complex, detailed structure.' },
    'detailed': { id: 'detailed', term: 'detailed', freq: 'frequent', desc: 'Fine nuance is audible; micro-details present.' },
    'multi-textured': { id: 'multi-textured', term: 'multi-textured', freq: 'rare', desc: 'Varied surfaces within one mix.' },
    'stratified': { id: 'stratified', term: 'stratified', freq: 'rare', desc: 'Distinct layers arranged in tiers.' },
    'elaborate': { id: 'elaborate', term: 'elaborate', freq: 'infrequent', desc: 'Ornate, highly worked arrangement.' },
    'sparse': { id: 'sparse', term: 'sparse', freq: 'frequent', desc: 'Few elements; lots of space/air.' },
    'minimalistic': { id: 'minimalistic', term: 'minimalistic', freq: 'frequent', desc: 'Deliberately few elements; simplicity.' },
    'polyphonic': { id: 'polyphonic', term: 'polyphonic', freq: 'infrequent', desc: 'Multiple independent melodic lines.' },
    'homophonic': { id: 'homophonic', term: 'homophonic', freq: 'infrequent', desc: 'Primary melody with chordal accompaniment.' },
    'monophonic': { id: 'monophonic', term: 'monophonic', freq: 'rare', desc: 'Single, unaccompanied melodic line.' },
    'heterophonic': { id: 'heterophonic', term: 'heterophonic', freq: 'rare', desc: 'Simultaneous variants of the same melody.' },

    // Smooth / Refined
    'smooth': { id: 'smooth', term: 'smooth', freq: 'ubiquitous', desc: 'Even, gentle tonality; no jarring peaks.' },
    'silky-texture': { id: 'silky-texture', term: 'silky', freq: 'frequent', desc: 'Soft, smooth highs; glossy surface.' },
    'polished-texture': { id: 'polished-texture', term: 'polished', freq: 'frequent', desc: 'Refined, professional sheen; smoothed edges.' },
    'refined': { id: 'refined', term: 'refined', freq: 'frequent', desc: 'Sophisticated, carefully finished sound.' },
    'sleek': { id: 'sleek', term: 'sleek', freq: 'infrequent', desc: 'Streamlined, modern finish.' },
    'elegant': { id: 'elegant', term: 'elegant', freq: 'frequent', desc: 'Tasteful, graceful tone or mix.' },
    'sophisticated': { id: 'sophisticated', term: 'sophisticated', freq: 'frequent', desc: 'Cultured, complex, well-judged production.' },
    'seamless': { id: 'seamless', term: 'seamless', freq: 'frequent', desc: 'Transitions/parts fit without seams.' },
    'effortless': { id: 'effortless', term: 'effortless', freq: 'infrequent', desc: 'Unforced, flowing ease.' },
    'fluid': { id: 'fluid', term: 'fluid', freq: 'frequent', desc: 'Smooth and flowing audio movement.' },
    'graceful': { id: 'graceful', term: 'graceful', freq: 'infrequent', desc: 'Elegant, poised motion/timbre.' },

    // Rough / Gritty
    'rough': { id: 'rough', term: 'rough', freq: 'frequent', desc: 'Unrefined and raw textures.' },
    'gritty': { id: 'gritty', term: 'gritty', freq: 'frequent', desc: 'Coarse and authentic production styles.' },
    'grainy-texture': { id: 'grainy-texture', term: 'grainy', freq: 'frequent', desc: 'Slightly rough and textured audio.' },
    'coarse-texture': { id: 'coarse-texture', term: 'coarse', freq: 'infrequent', desc: 'Rough and unpolished textures.' },
    'jagged': { id: 'jagged', term: 'jagged', freq: 'infrequent', desc: 'Sharp, irregular edges.' },
    'harsh-texture': { id: 'harsh-texture', term: 'harsh', freq: 'frequent', desc: 'Aggressive, unpleasant high mids.' },
    'raw-finish': { id: 'raw-finish', term: 'raw', freq: 'frequent', desc: 'Unprocessed/lo-fi finishing aesthetic.' },
    'unpolished': { id: 'unpolished', term: 'unpolished', freq: 'infrequent', desc: 'Lacking refinement; rough edges present.' },
    'edgy': { id: 'edgy', term: 'edgy', freq: 'frequent', desc: 'Noticeable bite/grit; excited upper-mids.' },
    'abrasive-texture': { id: 'abrasive-texture', term: 'abrasive', freq: 'infrequent', desc: 'Harsh and irritating textures.' },
    'crunchy': { id: 'crunchy', term: 'crunchy', freq: 'frequent', desc: 'Compressed, textured transients (mix slang).' },
    'distorted-texture': { id: 'distorted-texture', term: 'distorted', freq: 'frequent', desc: 'Intentional nonlinear distortion artifacts.' },
    'ratty': { id: 'ratty', term: 'ratty', freq: 'rare', desc: 'Degraded, shabby audio quality.' },

    // Space & Atmosphere
    'spacious': { id: 'spacious', term: 'spacious', freq: 'frequent', desc: 'Wide/deep sense of room; stereo and reverb depth.' },
    'reverberant': { id: 'reverberant', term: 'reverberant', freq: 'infrequent', desc: 'Audible room/echo tail; long decays.' },
    'wet': { id: 'wet', term: 'wet', freq: 'infrequent', desc: 'Effect-heavy (reverb/delay); opposite of dry.' },
    'dry': { id: 'dry', term: 'dry', freq: 'frequent', desc: 'Close/roomless sound; minimal ambience.' },
    'intimate-space': { id: 'intimate-space', term: 'intimate', freq: 'frequent', desc: 'Very close, personal proximity; detail-forward.' },
    'echoey': { id: 'echoey', term: 'echoey', freq: 'infrequent', desc: 'Audible repeats/reflections; obvious echoes.' },
    'atmospheric': { id: 'atmospheric', term: 'atmospheric', freq: 'frequent', desc: 'Evocative ambience; mood-first sound design.' },
    'cinematic': { id: 'cinematic', term: 'cinematic', freq: 'frequent', desc: 'Film-score scale; expansive and evocative.' },
};

// Hierarchy referencing canonical IDs (merged)
export const QualityHierarchyRef: Record<QualityCategory, { [clusterName: string]: string[] }> = {
    Mood: {
        'Positive / Uplifting': [
            'upbeat','energetic-mood','joyful','happy','cheerful','uplifting','positive-mood','hopeful','playful','romantic','sentimental','triumphant','heroic','optimistic','euphoric','exuberant','ecstatic','elated','celebratory','festive','inspiring','sparkly-mood'
        ],
        'Calm / Peaceful': [
            'peaceful','calm','relaxed','serene','dreamy','tranquil','meditative','soothing','gentle','contemplative','restful','ethereal-mood','atmospheric-mood','flowing-mood','smooth-mood','gossamer-mood'
        ],
        'Dark / Negative': [
            'dark-mood','melancholic','sad','somber','brooding','mournful','gloomy','haunting','moody','desolate','forlorn','wistful','tragic','lonely','ominous','disturbing','shadowy-mood','plaintive','negative-mood'
        ],
        'Intense / Aggressive': [
            'intense-mood','aggressive','driving-mood','powerful-mood','forceful','fierce','raw-mood','edgy-mood','explosive-mood','menacing','angry','violent','furious','tense','harsh-mood','thunderous','blistering','snarling','chaotic-mood'
        ],
        'Mysterious / Ambiguous': [
            'mysterious','enigmatic','ethereal-ambience','haunting','otherworldly','mystical','cryptic','elusive','veiled-mood','obscure-mood','twilight','liminal','majestic','epic','strange'
        ],
        'Romantic / Tender': [
            'tender','affectionate','intimate-mood','loving','sensual','warm-hearted','sultry','passionate','yearning','longing','sentimental'
        ],
        'Nostalgic / Reflective': [
            'nostalgic','reflective','bittersweet','reminiscent','pensive','poignant','memory-laden','retrospective'
        ]
    },

    Energy: {
        'High / Positive Drive': [
            'high-energy','driving','vigorous','propulsive','pumping','dynamic-energy','explosive','kinetic','punchy','pulsating','frenetic','relentless','urgent','vibrant','bouncy','brisk','electrifying','high-octane','turbocharged','thumping'
        ],
        'Medium / Flowing': [
            'flowing','steady','moderate','balanced-energy','measured','rolling','rhythmic','groovy','medium-energy','cascading','undulating','swinging','pulsing','unhurried','cruising','mid-tempo','paced'
        ],
        'Low / Peaceful': [
            'laid-back','low-energy','ambient','chill','mellow-energy','gentle-energy','subdued','restrained','placid','still','relaxed-energy','downtempo','languid','serene-energy','hushed','delicate-energy','soft-energy','sedate','hypnotic'
        ],
        'Negative / Unstable': [
            'tense-energy','anxious-energy','chaotic-energy','agitated','erratic','unstable','jarring-energy','dissonant-energy','turbulent','unsettling-energy','fragmented','static-energy','restless','jittery','hectic','disjointed'
        ],
        'Expansive / Other': [
            'expansive','soaring','lifting','transcendent-energy','boundless','sweeping','majestic-energy','panoramic','vast','cosmic','breathless','gradual','crescendoing','swelling','decaying','wavering','oscillating','spiraling'
        ]
    },

    Texture: {
        'Bright / Positive': [
            'bright','crisp','clear','brilliant','sparkling','crystalline','shimmering','radiant','gleaming','airy','polished','pristine','shiny','luminous'
        ],
        'Warm / Peaceful': [
            'warm','rich','full','lush','creamy','honeyed','golden','mellow','rounded','embracing','enveloping','cozy','sumptuous','velvety','buttery','silky','soft-texture'
        ],
        'Dark / Negative': [
            'dark','muddy','harsh','gritty-texture','murky','raspy','buzzy','distorted','coarse','abrasive','shadowy-texture','veiled','obscured','heavy','dense','thick','clouded','muffled','oppressive'
        ],
        'Natural / Acoustic': [
            'acoustic','organic','natural','raw-texture','live','authentic','unprocessed','woody','breathy','human','intimate','close-miked','hollow','earthy','fibrous','resonant','textured','grainy'
        ],
        'Synthetic / Electronic': [
            'electronic','synthetic','digital','processed','programmed','artificial','computerized','robotic','futuristic','cyber','pixelated','metallic','glassy','analog','mechanical','glitchy'
        ],
        'Density & Layering': [
            'layered','complex','rich-density','full-bodied','orchestrated','intricate','detailed','multi-textured','stratified','elaborate','sparse','minimalistic','polyphonic','homophonic','monophonic','heterophonic'
        ],
        'Smooth / Refined': [
            'smooth','silky-texture','polished-texture','refined','sleek','elegant','sophisticated','seamless','effortless','fluid','graceful'
        ],
        'Rough / Gritty': [
            'rough','gritty','grainy-texture','coarse-texture','jagged','harsh-texture','raw-finish','unpolished','edgy','abrasive-texture','crunchy','distorted-texture','ratty'
        ],
        'Space & Atmosphere': [
            'spacious','reverberant','wet','dry','intimate-space','echoey','atmospheric','cinematic'
        ]
    }
};

// Small resolver
export function resolveTerms(ids: string[]): TermDef[] {
    return ids.map(id => Terms[id]).filter((t): t is TermDef => Boolean(t));
}
