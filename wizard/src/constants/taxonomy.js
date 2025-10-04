/**
 * SINGLE SOURCE OF TRUTH for Mood/Energy/Texture Taxonomy
 *
 * This file contains the complete taxonomy with full metadata.
 * All other taxonomy-related files derive their data from this registry.
 *
 * IMPORTANT: Terms can appear in multiple categories when they describe
 * genuinely different musical dimensions (e.g., "soft" energy vs "soft" texture).
 * The category field disambiguates them.
 *
 * DO NOT duplicate this data elsewhere - import from this file instead.
 */
// ============================================================================
// MASTER TAXONOMY REGISTRY - All terms defined here
// ============================================================================
export const TAXONOMY = [
    // ========== MOOD ==========
    // Positive / Uplifting
    { id: 'upbeat', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous', synonyms: ['buoyant', 'jaunty', 'lively', 'peppy', 'sprightly'] },
    { id: 'joyful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous', synonyms: ['elated', 'gleeful', 'jubilant'] },
    { id: 'positive', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous', synonyms: ['affirmative', 'constructive', 'favorable', 'sanguine'] },
    { id: 'happy', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['content', 'glad', 'pleased', 'mirthful'] },
    { id: 'cheerful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['blithe', 'cheery', 'jolly', 'merry'] },
    { id: 'uplifting', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['elevating', 'heartening', 'inspiriting', 'invigorating', 'rousing'] },
    { id: 'hopeful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['auspicious', 'expectant', 'promising'] },
    { id: 'playful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['frisky', 'lighthearted', 'whimsical'] },
    { id: 'romantic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['amorous', 'amatory', 'impassioned'] },
    { id: 'sentimental', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['emotional', 'mawkish', 'schmaltzy'] },
    { id: 'triumphant', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['victorious', 'winning', 'conquering'] },
    { id: 'heroic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['brave', 'courageous', 'valiant'] },
    { id: 'optimistic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['bullish', 'sanguine', 'sunny'] },
    { id: 'euphoric', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent', synonyms: ['blissful', 'overjoyed', 'rapturous'] },
    { id: 'exuberant', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent', synonyms: ['ebullient', 'high-spirited', 'vivacious'] },
    { id: 'ecstatic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent', synonyms: ['blissful', 'overjoyed', 'rapturous'] },
    { id: 'elated', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent', synonyms: ['gleeful', 'jubilant', 'thrilled'] },
    { id: 'celebratory', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['commemorative', 'gala', 'tribute'] },
    { id: 'festive', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['convivial', 'jovial', 'mirthful'] },
    { id: 'inspiring', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['encouraging', 'motivating', 'stimulating'] },
    { id: 'proud', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['gratified', 'honored', 'satisfied'] },
    { id: 'sparkly', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'rare', synonyms: ['glittering', 'scintillating', 'twinkling'] },
    { id: 'thrilling', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent', synonyms: ['gripping', 'riveting', 'stirring'] },
    // Calm / Peaceful
    { id: 'peaceful', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'ubiquitous', synonyms: ['balmy', 'halcyon', 'untroubled'] },
    { id: 'calm', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'ubiquitous', synonyms: ['composed', 'unruffled', 'untroubled'] },
    { id: 'relaxed', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['at-ease', 'leisurely', 'unwinding'] },
    { id: 'serene', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['halcyon', 'placid', 'undisturbed'] },
    { id: 'dreamy', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['hazy', 'surreal', 'visionary'] },
    { id: 'tranquil', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['reposing', 'unperturbed', 'undisturbed'] },
    { id: 'meditative', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['introspective', 'ruminative', 'thoughtful'] },
    { id: 'soothing', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['balmy', 'calming', 'comforting', 'lulling'] },
    { id: 'gentle', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['clement', 'lenient', 'mild'] },
    { id: 'contemplative', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['introspective', 'ruminative', 'thoughtful'] },
    { id: 'restful', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'infrequent', synonyms: ['leisurely', 'relaxing', 'reposing'] },
    { id: 'ethereal', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'infrequent', synonyms: ['celestial', 'diaphanous', 'unearthly'] },
    { id: 'atmospheric', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['allusive', 'emotive', 'evocative'] },
    { id: 'smooth', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent', synonyms: ['even', 'level', 'uninterrupted'] },
    { id: 'gossamer', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'rare', synonyms: ['diaphanous', 'filmy', 'sheer'] },
    // Dark / Negative
    { id: 'dark', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['bleak', 'dismal', 'tenebrous'] },
    { id: 'melancholic', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['doleful', 'lugubrious', 'sorrowful'] },
    { id: 'sad', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['dejected', 'sorrowful', 'unhappy'] },
    { id: 'somber', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['dour', 'grave', 'solemn'] },
    { id: 'brooding', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['morose', 'sullen', 'sulky'] },
    { id: 'chilling', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['eerie', 'frightening', 'spooky'] },
    { id: 'fearful', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['afraid', 'apprehensive', 'scared'] },
    { id: 'mournful', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['grieving', 'lamenting', 'sorrowful'] },
    { id: 'gloomy', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['cheerless', 'depressing', 'dismal'] },
    { id: 'haunting', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['eerie', 'memorable', 'unforgettable'] },
    { id: 'moody', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['changeable', 'sullen', 'temperamental'] },
    { id: 'desolate', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['barren', 'bleak', 'stark'] },
    { id: 'forlorn', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'rare', synonyms: ['crestfallen', 'miserable', 'woebegone'] },
    { id: 'wistful', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['pining', 'regretful', 'ruminative'] },
    { id: 'tragic', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['calamitous', 'catastrophic', 'heartbreaking'] },
    { id: 'lonely', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['isolated', 'lonesome', 'solitary'] },
    { id: 'nauseating', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'rare', synonyms: ['disgusting', 'revolting', 'sickening'] },
    { id: 'ominous', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent', synonyms: ['foreboding', 'portentous', 'sinister'] },
    { id: 'painful', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['aching', 'agonizing', 'sore'] },
    { id: 'disturbing', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['perturbing', 'troubling', 'disquieting'] },
    { id: 'shadowy', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent', synonyms: ['dim', 'indistinct', 'nebulous'] },
    { id: 'plaintive', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'rare', synonyms: ['doleful', 'lamenting', 'sorrowful'] },
    { id: 'negative', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'ubiquitous', synonyms: ['adverse', 'detrimental', 'pessimistic'] },
    // Intense / Aggressive
    { id: 'intense', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['acute', 'extreme', 'severe'] },
    { id: 'aggressive', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['belligerent', 'confrontational', 'hostile'] },
    { id: 'driving', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['compelling', 'impelling', 'motivating'] },
    { id: 'powerful', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['commanding', 'mighty', 'potent'] },
    { id: 'forceful', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['assertive', 'coercive', 'emphatic'] },
    { id: 'fierce', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['ferocious', 'savage', 'vicious'] },
    { id: 'raw', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['brutal', 'primitive', 'unfiltered'] },
    { id: 'edgy', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['avant-garde', 'nervous', 'unconventional'] },
    { id: 'explosive', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['detonative', 'eruptive', 'volatile'] },
    { id: 'menacing', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['intimidating', 'sinister', 'threatening'] },
    { id: 'angry', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['enraged', 'incensed', 'irate'] },
    { id: 'violent', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['brutal', 'destructive', 'savage'] },
    { id: 'furious', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['incensed', 'livid', 'enraged'] },
    { id: 'tense', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['strained', 'stressed', 'taut'] },
    { id: 'harsh', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['severe', 'stern', 'unpleasant'] },
    { id: 'thunderous', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['booming', 'deafening', 'resounding'] },
    { id: 'blistering', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'rare', synonyms: ['rapid', 'scorching', 'searing'] },
    { id: 'snarling', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'rare', synonyms: ['growling', 'threatening', 'vicious'] },
    { id: 'annoying', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['bothersome', 'irritating', 'vexing'] },
    { id: 'anxious', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['apprehensive', 'nervous', 'worried'] },
    { id: 'agitated', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['disturbed', 'flustered', 'unsettled'] },
    { id: 'defiant', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent', synonyms: ['insubordinate', 'rebellious', 'disobedient'] },
    { id: 'unsettling', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['disquieting', 'unnerving', 'perturbing'] },
    { id: 'restless', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent', synonyms: ['fidgety', 'fretful', 'uneasy'] },
    // Mysterious / Ambiguous
    { id: 'mysterious', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['baffling', 'inexplicable', 'secretive'] },
    { id: 'enigmatic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['ambiguous', 'inscrutable', 'perplexing'] },
    { id: 'ethereal-ambience', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['celestial-vibe', 'otherworldly-atmosphere', 'unearthly-mood'] },
    { id: 'otherworldly', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['alien', 'supernatural', 'unearthly'] },
    { id: 'mystical', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['magical', 'occult', 'spiritual'] },
    { id: 'cryptic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['arcane', 'abstruse', 'esoteric'] },
    { id: 'elusive', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'rare', synonyms: ['evasive', 'fleeting', 'slippery'] },
    { id: 'veiled', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['concealed', 'disguised', 'hidden'] },
    { id: 'obscure', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['indistinct', 'unclear', 'vague'] },
    { id: 'twilight', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'rare', synonyms: ['crepuscule', 'dusk', 'gloaming'] },
    { id: 'liminal', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'rare', synonyms: ['in-between', 'threshold', 'transitional'] },
    { id: 'awe-inspiring', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['breathtaking', 'magnificent', 'stunning'] },
    { id: 'entrancing', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['captivating', 'mesmerizing', 'spellbinding'] },
    { id: 'majestic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['grand', 'regal', 'stately'] },
    { id: 'puzzling', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['bewildering', 'confounding', 'perplexing'] },
    { id: 'spine-tingling', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['creepy', 'eerie', 'hair-raising'] },
    { id: 'epic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['colossal', 'grandiose', 'monumental'] },
    { id: 'strange', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent', synonyms: ['odd', 'peculiar', 'unusual'] },
    { id: 'transcendent', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['exalted', 'metaphysical', 'surpassing'] },
    { id: 'cosmic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['celestial', 'galactic', 'universal'] },
    { id: 'panoramic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent', synonyms: ['broad', 'extensive', 'wide-ranging'] },
    // Romantic / Tender
    { id: 'tender', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent', synonyms: ['fond', 'kind', 'sympathetic'] },
    { id: 'affectionate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent', synonyms: ['caring', 'devoted', 'fond'] },
    { id: 'compassionate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent', synonyms: ['benevolent', 'empathetic', 'sympathetic'] },
    { id: 'intimate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent', synonyms: ['close', 'confidential', 'personal'] },
    { id: 'loving', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent', synonyms: ['adoring', 'devoted', 'fond'] },
    { id: 'sensual', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent', synonyms: ['erotic', 'luscious', 'pleasurable'] },
    { id: 'warm-hearted', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent', synonyms: ['amiable', 'generous', 'kind'] },
    { id: 'sultry', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent', synonyms: ['provocative', 'seductive', 'torrid'] },
    { id: 'passionate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent', synonyms: ['ardent', 'fervent', 'fervid'] },
    { id: 'yearning', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent', synonyms: ['craving', 'hankering', 'pining'] },
    { id: 'longing', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent', synonyms: ['craving', 'desire', 'pining'] },
    // Nostalgic / Reflective
    { id: 'nostalgic', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'frequent', synonyms: ['homesick', 'pining', 'regretful'] },
    { id: 'reflective', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'frequent', synonyms: ['cerebral', 'introspective', 'ruminative'] },
    { id: 'bittersweet', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'frequent', synonyms: ['mixed-emotion', 'sadly-fond', 'melancholy-yet-pleasant'] },
    { id: 'reminiscent', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent', synonyms: ['evocative', 'redolent', 'suggestive'] },
    { id: 'pensive', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent', synonyms: ['absorbed', 'introspective', 'ruminative'] },
    { id: 'poignant', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent', synonyms: ['affecting', 'moving', 'touching'] },
    { id: 'memory-laden', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'rare', synonyms: ['evocative', 'recollective', 'redolent'] },
    { id: 'retrospective', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent', synonyms: ['backward-looking', 'recollective', 'reviewing'] },
    // ========== ENERGY ==========
    // High / Driving
    { id: 'energetic', category: 'Energy', subcategory: 'High / Driving', frequency: 'ubiquitous', synonyms: ['active', 'lively', 'spirited'] },
    { id: 'driving', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['compelling', 'impelling', 'motivating'] },
    { id: 'vigorous', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['robust', 'strenuous', 'hardy'] },
    { id: 'propulsive', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['impelling', 'motivating', 'projecting'] },
    { id: 'pumping', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['beating', 'pounding', 'throbbing'] },
    { id: 'dynamic', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['active', 'high-powered', 'lively'] },
    { id: 'explosive', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['detonative', 'eruptive', 'volatile'] },
    { id: 'kinetic', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['in-motion', 'moving', 'active'] },
    { id: 'punchy', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['impactful', 'incisive', 'forceful'] },
    { id: 'pulsating', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['beating', 'throbbing', 'vibrating'] },
    { id: 'frenetic', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['feverish', 'frantic', 'frenzied'] },
    { id: 'relentless', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['ceaseless', 'incessant', 'persistent'] },
    { id: 'urgent', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['critical', 'imperative', 'pressing'] },
    { id: 'vibrant', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['lively', 'spirited', 'vivacious'] },
    { id: 'bouncy', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['jouncy', 'resilient', 'springy'] },
    { id: 'brisk', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['jaunty', 'quick', 'swift'] },
    { id: 'electrifying', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['exhilarating', 'galvanizing', 'stimulating'] },
    { id: 'exciting', category: 'Energy', subcategory: 'High / Driving', frequency: 'ubiquitous', synonyms: ['rousing', 'stirring', 'stimulating'] },
    { id: 'high-octane', category: 'Energy', subcategory: 'High / Driving', frequency: 'rare', synonyms: ['full-throttle', 'high-powered', 'fast-paced'] },
    { id: 'strong', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['potent', 'robust', 'sturdy'] },
    { id: 'turbocharged', category: 'Energy', subcategory: 'High / Driving', frequency: 'rare', synonyms: ['accelerated', 'boosted', 'supercharged'] },
    { id: 'thumping', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent', synonyms: ['beating', 'pounding', 'throbbing'] },
    // Medium / Flowing
    { id: 'flowing', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['continuous', 'graceful', 'unbroken'] },
    { id: 'steady', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['consistent', 'stable', 'unwavering'] },
    { id: 'moderate', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['reasonable', 'temperate', 'medium'] },
    { id: 'balanced', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['even', 'proportional', 'stable'] },
    { id: 'measured', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['calibrated', 'considered', 'regular'] },
    { id: 'rolling', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['billowing', 'surging', 'wavy'] },
    { id: 'rhythmic', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['cadenced', 'lilting', 'metrical'] },
    { id: 'groovy', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['cool', 'funky', 'swinging'] },
    { id: 'medium-energy', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent', synonyms: ['average-intensity', 'mid-level', 'moderate-paced'] },
    { id: 'cascading', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent', synonyms: ['descending', 'pouring', 'tumbling'] },
    { id: 'undulating', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent', synonyms: ['fluctuating', 'rippling', 'wavy'] },
    { id: 'swinging', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['lilting', 'rocking', 'swaying'] },
    { id: 'pulsing', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent', synonyms: ['beating', 'throbbing', 'vibrating'] },
    { id: 'unhurried', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent', synonyms: ['deliberate', 'easygoing', 'leisurely'] },
    { id: 'cruising', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'rare', synonyms: ['coasting', 'gliding', 'sailing'] },
    { id: 'mid-tempo', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent', synonyms: ['andante', 'medium-paced', 'moderate-speed'] },
    { id: 'paced', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent', synonyms: ['controlled', 'regulated', 'timed'] },
    // Low / Calm
    { id: 'laid-back', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['carefree', 'easygoing', 'untroubled'] },
    { id: 'low-energy', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['inactive', 'lethargic', 'sluggish'] },
    { id: 'ambient', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['background', 'environmental', 'surrounding'] },
    { id: 'boring', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['dull', 'tedious', 'uninteresting'] },
    { id: 'chill', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous', synonyms: ['carefree', 'easygoing', 'unwinding'] },
    { id: 'mellow', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous', synonyms: ['dulcet', 'euphonious', 'tuneful'] },
    { id: 'gentle', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['mild', 'soft', 'tender'] },
    { id: 'subdued', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['low-key', 'muted', 'quiet'] },
    { id: 'restrained', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['controlled', 'reserved', 'understated'] },
    { id: 'placid', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['composed', 'equable', 'unruffled'] },
    { id: 'still', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['inert', 'motionless', 'unmoving'] },
    { id: 'relaxed', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous', synonyms: ['calm', 'easygoing', 'laid-back'] },
    { id: 'downtempo', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['largo', 'leisurely', 'slow-paced'] },
    { id: 'languid', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['lethargic', 'listless', 'unenergetic'] },
    { id: 'serene', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['peaceful', 'calm', 'tranquil'] },
    { id: 'hushed', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['muted', 'quiet', 'silent'] },
    { id: 'delicate', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent', synonyms: ['fine', 'fragile', 'subtle'] },
    { id: 'soft', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous', synonyms: ['gentle', 'quiet', 'muted'] },
    { id: 'sedate', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['calm', 'composed', 'tranquil'] },
    { id: 'hypnotic', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent', synonyms: ['mesmerizing', 'spellbinding', 'trance-like'] },
    // Irregular / Unstable
    { id: 'chaotic', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'frequent', synonyms: ['anarchic', 'disordered', 'tumultuous'] },
    { id: 'erratic', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['capricious', 'inconsistent', 'unpredictable'] },
    { id: 'unstable', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['precarious', 'shaky', 'volatile'] },
    { id: 'jarring', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['clashing', 'discordant', 'grating'] },
    { id: 'turbulent', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['stormy', 'tempestuous', 'tumultuous'] },
    { id: 'fragmented', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['piecemeal', 'scattered', 'splintered'] },
    { id: 'jittery', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'rare', synonyms: ['jumpy', 'nervous', 'skittish'] },
    { id: 'hectic', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['frantic', 'frenzied', 'chaotic'] },
    { id: 'disjointed', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'rare', synonyms: ['fragmentary', 'incoherent', 'disconnected'] },
    // Expansive / Soaring
    { id: 'expansive', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'frequent', synonyms: ['broad', 'extensive', 'wide-ranging'] },
    { id: 'soaring', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'frequent', synonyms: ['ascending', 'climbing', 'towering'] },
    { id: 'lifting', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'infrequent', synonyms: ['elevating', 'hoisting', 'raising'] },
    { id: 'sweeping', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'frequent', synonyms: ['all-encompassing', 'broad', 'wide'] },
    { id: 'boundless', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'rare', synonyms: ['endless', 'infinite', 'limitless'] },
    { id: 'vast', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'infrequent', synonyms: ['enormous', 'huge', 'immense'] },
    { id: 'breathless', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'infrequent', synonyms: ['gasping', 'intense', 'panting'] },
    // Dynamic / Changing
    { id: 'gradual', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'frequent', synonyms: ['incremental', 'progressive', 'slow'] },
    { id: 'crescendoing', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'infrequent', synonyms: ['building', 'intensifying', 'swelling'] },
    { id: 'swelling', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'frequent', synonyms: ['expanding', 'growing', 'increasing'] },
    { id: 'decaying', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'infrequent', synonyms: ['diminishing', 'fading', 'waning'] },
    { id: 'wavering', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'rare', synonyms: ['faltering', 'hesitating', 'fluctuating'] },
    { id: 'oscillating', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'rare', synonyms: ['fluctuating', 'swinging', 'vibrating'] },
    { id: 'spiraling', category: 'Energy', subcategory: 'Dynamic / Changing', frequency: 'rare', synonyms: ['coiling', 'twisting', 'winding'] },
    // ========== TEXTURE ==========
    // Bright / Clear
    { id: 'bright', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'ubiquitous', synonyms: ['brilliant', 'luminous', 'vivid'] },
    { id: 'crisp', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'ubiquitous', synonyms: ['distinct', 'incisive', 'sharp'] },
    { id: 'clear', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'ubiquitous', synonyms: ['lucid', 'transparent', 'unambiguous'] },
    { id: 'brilliant', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['dazzling', 'radiant', 'bright'] },
    { id: 'sparkling', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['glittering', 'scintillating', 'twinkling'] },
    { id: 'crystalline', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['pellucid', 'pristine', 'translucent'] },
    { id: 'shimmering', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['gleaming', 'glinting', 'glistening'] },
    { id: 'radiant', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'infrequent', synonyms: ['aglow', 'beaming', 'incandescent'] },
    { id: 'gleaming', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'infrequent', synonyms: ['glistening', 'lustrous', 'shining'] },
    { id: 'airy', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['delicate', 'light', 'spacious'] },
    { id: 'polished', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['burnished', 'glossy', 'lustrous'] },
    { id: 'pristine', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent', synonyms: ['immaculate', 'spotless', 'unblemished'] },
    { id: 'shiny', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'infrequent', synonyms: ['gleaming', 'glossy', 'lustrous'] },
    { id: 'luminous', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'rare', synonyms: ['glowing', 'radiant', 'shining'] },
    // Warm / Rich
    { id: 'warm', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'ubiquitous', synonyms: ['balmy', 'cordial', 'genial'] },
    { id: 'rich', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'ubiquitous', synonyms: ['opulent', 'plush', 'sonorous'] },
    { id: 'full', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent', synonyms: ['abundant', 'complete', 'resonant'] },
    { id: 'lush', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent', synonyms: ['luxuriant', 'opulent', 'verdant'] },
    { id: 'creamy', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent', synonyms: ['buttery', 'milky', 'velvety'] },
    { id: 'honeyed', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent', synonyms: ['nectarous', 'saccharine', 'sugary'] },
    { id: 'golden', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent', synonyms: ['aureate', 'flaxen', 'gilded'] },
    { id: 'mellow', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'ubiquitous', synonyms: ['smooth', 'soft', 'rounded'] },
    { id: 'rounded', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent', synonyms: ['bulbous', 'curved', 'globular'] },
    { id: 'embracing', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'rare', synonyms: ['clasping', 'encompassing', 'hugging'] },
    { id: 'enveloping', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent', synonyms: ['blanketing', 'encasing', 'surrounding'] },
    { id: 'cozy', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent', synonyms: ['comfortable', 'homey', 'snug'] },
    { id: 'sumptuous', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'rare', synonyms: ['lavish', 'luxurious', 'opulent'] },
    { id: 'velvety', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent', synonyms: ['downy', 'satiny', 'suede-like'] },
    { id: 'buttery', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent', synonyms: ['creamy', 'oily', 'smooth'] },
    { id: 'silky', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent', synonyms: ['sleek', 'satiny', 'lustrous'] },
    { id: 'soft', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'ubiquitous', synonyms: ['gentle', 'mellow', 'smooth'] },
    // Dark / Heavy
    { id: 'dark', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'ubiquitous', synonyms: ['shadowy', 'murky', 'gloomy'] },
    { id: 'muddy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['murky', 'turbid', 'opaque'] },
    { id: 'harsh', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['jarring', 'severe', 'strident'] },
    { id: 'gritty', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['abrasive', 'coarse', 'grainy'] },
    { id: 'murky', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['cloudy', 'dim', 'obscure'] },
    { id: 'raspy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['croaky', 'gravelly', 'hoarse'] },
    { id: 'buzzy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['droning', 'humming', 'whirring'] },
    { id: 'distorted', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['deformed', 'twisted', 'warped'] },
    { id: 'coarse', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent', synonyms: ['bristly', 'scratchy', 'rough'] },
    { id: 'abrasive', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent', synonyms: ['caustic', 'chafing', 'grating'] },
    { id: 'shadowy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent', synonyms: ['dark', 'obscure', 'dim'] },
    { id: 'veiled', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent', synonyms: ['obscured', 'concealed', 'muffled'] },
    { id: 'obscured', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent', synonyms: ['concealed', 'hidden', 'veiled'] },
    { id: 'heavy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['massive', 'ponderous', 'weighty'] },
    { id: 'dense', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['compact', 'concentrated', 'thickset'] },
    { id: 'thick', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['condensed', 'concentrated', 'viscous'] },
    { id: 'clouded', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent', synonyms: ['befogged', 'foggy', 'overcast'] },
    { id: 'muffled', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['muted', 'suppressed', 'stifled'] },
    { id: 'oppressive', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'rare', synonyms: ['crushing', 'overbearing', 'stifling'] },
    { id: 'dissonant', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent', synonyms: ['cacophonous', 'discordant', 'inharmonic'] },
    { id: 'static', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'rare', synonyms: ['fixed', 'stationary', 'unchanging'] },
    // Natural / Acoustic
    { id: 'acoustic', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'ubiquitous', synonyms: ['instrumental', 'non-electric', 'unplugged'] },
    { id: 'organic', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['biological', 'genuine', 'unadulterated'] },
    { id: 'natural', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'ubiquitous', synonyms: ['inherent', 'innate', 'native'] },
    { id: 'raw', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['brutal', 'crude', 'unrefined'] },
    { id: 'live', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['in-person', 'onsite', 'spontaneous'] },
    { id: 'authentic', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['bona-fide', 'genuine', 'real'] },
    { id: 'unprocessed', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent', synonyms: ['untreated', 'raw', 'unrefined'] },
    { id: 'woody', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['ligneous', 'timbered', 'woodsy'] },
    { id: 'breathy', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['aspirated', 'gasping', 'sighing'] },
    { id: 'human', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['anthropic', 'corporeal', 'fleshly'] },
    { id: 'intimate', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['close', 'personal', 'private'] },
    { id: 'close-miked', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent', synonyms: ['near-field', 'proximal-recording', 'up-close'] },
    { id: 'hollow', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent', synonyms: ['cavernous', 'empty', 'vacant'] },
    { id: 'earthy', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent', synonyms: ['rustic', 'terrestrial', 'unrefined'] },
    { id: 'fibrous', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'rare', synonyms: ['sinewy', 'stringy', 'thread-like'] },
    { id: 'resonant', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['reverberating', 'ringing', 'sonorous'] },
    { id: 'textured', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['composite', 'tactile', 'variegated'] },
    { id: 'grainy', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent', synonyms: ['granular', 'sandy', 'coarse'] },
    // Synthetic / Electronic
    { id: 'electronic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'ubiquitous', synonyms: ['automated', 'digitized', 'technological'] },
    { id: 'synthetic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['fabricated', 'man-made', 'manufactured'] },
    { id: 'digital', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['binary', 'computerized', 'numeric'] },
    { id: 'processed', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['altered', 'modified', 'treated'] },
    { id: 'programmed', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['coded', 'instructed', 'scheduled'] },
    { id: 'artificial', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['fake', 'imitation', 'sham'] },
    { id: 'computerized', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent', synonyms: ['automated', 'digitized', 'mechanized'] },
    { id: 'robotic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['automated', 'mechanical', 'machinelike'] },
    { id: 'futuristic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent', synonyms: ['advanced', 'visionary', 'forward-looking'] },
    { id: 'cyber', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent', synonyms: ['networked', 'online', 'virtual'] },
    { id: 'pixelated', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'rare', synonyms: ['blocky', 'digitized', 'mosaic'] },
    { id: 'metallic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['brassy', 'steely', 'tinny'] },
    { id: 'glassy', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent', synonyms: ['glazed', 'hyaline', 'vitreous'] },
    { id: 'analog', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent', synonyms: ['continuous', 'non-digital', 'waveform'] },
    { id: 'mechanical', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent', synonyms: ['automated', 'industrial', 'machinelike'] },
    { id: 'glitchy', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent', synonyms: ['buggy', 'faulty', 'stuttering'] },
    // Dense / Layered
    { id: 'challenging', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'infrequent', synonyms: ['demanding', 'difficult', 'testing'] },
    { id: 'layered', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['overlapping', 'stratified', 'tiered'] },
    { id: 'complex', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['complicated', 'convoluted', 'involved'] },
    { id: 'rich-density', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['concentrated', 'full-bodied', 'opulent-texture'] },
    { id: 'full-bodied', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['hearty', 'robust', 'substantial'] },
    { id: 'orchestrated', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'infrequent', synonyms: ['arranged', 'composed', 'coordinated'] },
    { id: 'intricate', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['baroque', 'convoluted', 'tangled'] },
    { id: 'detailed', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['comprehensive', 'specific', 'thorough'] },
    { id: 'multi-textured', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare', synonyms: ['composite', 'heterogeneous', 'variegated'] },
    { id: 'stratified', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare', synonyms: ['banded', 'laminated', 'tiered'] },
    { id: 'elaborate', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'infrequent', synonyms: ['ornate', 'baroque', 'fancy'] },
    { id: 'sparse', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['meager', 'scant', 'thin'] },
    { id: 'minimalistic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent', synonyms: ['austere', 'stark', 'unadorned'] },
    { id: 'polyphonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare', synonyms: ['many-voiced', 'multipart', 'contrapuntal'] },
    { id: 'homophonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare', synonyms: ['block-harmony', 'chordal', 'melody-accompaniment'] },
    { id: 'monophonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare', synonyms: ['solo-line', 'single-line', 'unison'] },
    { id: 'heterophonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare', synonyms: ['multi-textured-monody', 'variation-parallel', 'near-unison'] },
    // Smooth / Refined
    { id: 'smooth', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'ubiquitous', synonyms: ['sleek', 'polished', 'flowing'] },
    { id: 'refined', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent', synonyms: ['cultivated', 'polished', 'urbane'] },
    { id: 'sleek', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'infrequent', synonyms: ['aerodynamic', 'glossy', 'streamlined'] },
    { id: 'elegant', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent', synonyms: ['chic', 'stylish', 'tasteful'] },
    { id: 'sophisticated', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent', synonyms: ['cosmopolitan', 'cultured', 'worldly'] },
    { id: 'seamless', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent', synonyms: ['continuous', 'flawless', 'unbroken'] },
    { id: 'effortless', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'infrequent', synonyms: ['facile', 'easy', 'uncomplicated'] },
    { id: 'fluid', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent', synonyms: ['flowing', 'liquid', 'graceful'] },
    { id: 'graceful', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'infrequent', synonyms: ['agile', 'nimble', 'supple'] },
    // Rough / Gritty
    { id: 'rough', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'frequent', synonyms: ['bumpy', 'coarse', 'uneven'] },
    { id: 'jagged', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'infrequent', synonyms: ['serrated', 'spiky', 'uneven'] },
    { id: 'raw-finish', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'frequent', synonyms: ['crude-surface', 'natural-state', 'unfinished'] },
    { id: 'unpolished', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'infrequent', synonyms: ['crude', 'rough-hewn', 'unrefined'] },
    { id: 'edgy', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'frequent', synonyms: ['sharp', 'cutting', 'angular'] },
    { id: 'crunchy', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'rare', synonyms: ['crackly', 'crispy', 'brittle'] },
    { id: 'ratty', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'rare', synonyms: ['dilapidated', 'shabby', 'tattered'] },
    // Spatial / Atmospheric
    { id: 'spacious', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'frequent', synonyms: ['ample', 'capacious', 'roomy'] },
    { id: 'reverberant', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent', synonyms: ['echoing', 'resonant', 'vibrating'] },
    { id: 'wet', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent', synonyms: ['damp', 'moist', 'saturated'] },
    { id: 'dry', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent', synonyms: ['arid', 'desiccated', 'parched'] },
    { id: 'intimate-space', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent', synonyms: ['close-quarters', 'cozy-setting', 'confined-area'] },
    { id: 'echoey', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent', synonyms: ['cavernous', 'reverberating', 'resonant'] },
    { id: 'atmospheric', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'frequent', synonyms: ['ambient', 'evocative', 'immersive'] },
    { id: 'cinematic', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'frequent', synonyms: ['dramatic', 'filmic', 'visual'] },
];
// ============================================================================
// DERIVED DATA STRUCTURES - Auto-generated from TAXONOMY array
// ============================================================================
/**
 * Term lookup by ID (O(1) access)
 */
export const TAXONOMY_BY_ID = new Map(TAXONOMY.map(term => [term.id, term]));
/**
 * Get term metadata by ID (first occurrence if multi-category)
 */
export function getTerm(id) {
    return TAXONOMY_BY_ID.get(id);
}
/**
 * Get ALL occurrences of a term across categories
 */
export function getTerms(id) {
    return TAXONOMY.filter(t => t.id === id);
}
/**
 * Get all term IDs for a category (may include duplicates from multi-category terms)
 */
export function getTermIds(category) {
    return TAXONOMY.filter(t => t.category === category).map(t => t.id);
}
/**
 * Get all terms for a category
 */
export function getTermsByCategory(category) {
    return TAXONOMY.filter(t => t.category === category);
}
/**
 * Subcategory mappings organized by main category
 */
export const SUBCATEGORIES = {
    Mood: groupBySubcategory('Mood'),
    Energy: groupBySubcategory('Energy'),
    Texture: groupBySubcategory('Texture'),
};
function groupBySubcategory(category) {
    const groups = {};
    TAXONOMY
        .filter(t => t.category === category)
        .forEach(term => {
            if (!groups[term.subcategory]) {
                groups[term.subcategory] = [];
            }
            groups[term.subcategory].push(term.id);
        });
    return groups;
}
/**
 * Frequency mappings for all terms (uses first occurrence for multi-category terms)
 */
export const TERM_FREQUENCIES = Object.fromEntries(Array.from(new Map(TAXONOMY.map(t => [t.id, t.frequency])).entries()));
/**
 * Terms organized by frequency within each category
 */
export const TERMS_BY_FREQUENCY = {
    Mood: groupByFrequency('Mood'),
    Energy: groupByFrequency('Energy'),
    Texture: groupByFrequency('Texture'),
};
function groupByFrequency(category) {
    const groups = {
        ubiquitous: [],
        frequent: [],
        infrequent: [],
        rare: [],
    };
    TAXONOMY
        .filter(t => t.category === category)
        .forEach(term => {
            groups[term.frequency].push(term.id);
        });
    return groups;
}
/**
 * Main category enum
 */
export const Category = {
    MOOD: 'Mood',
    ENERGY: 'Energy',
    TEXTURE: 'Texture',
};

/**
 * Subcategory enums for each main category
 */
export const MoodSubcategory = {
    POSITIVE_UPLIFTING: 'Positive / Uplifting',
    CALM_PEACEFUL: 'Calm / Peaceful',
    DARK_NEGATIVE: 'Dark / Negative',
    INTENSE_AGGRESSIVE: 'Intense / Aggressive',
    MYSTERIOUS_AMBIGUOUS: 'Mysterious / Ambiguous',
    ROMANTIC_TENDER: 'Romantic / Tender',
    NOSTALGIC_REFLECTIVE: 'Nostalgic / Reflective',
};

export const EnergySubcategory = {
    HIGH_DRIVING: 'High / Driving',
    MEDIUM_FLOWING: 'Medium / Flowing',
    LOW_CALM: 'Low / Calm',
    IRREGULAR_UNSTABLE: 'Irregular / Unstable',
    EXPANSIVE_SOARING: 'Expansive / Soaring',
    DYNAMIC_CHANGING: 'Dynamic / Changing',
};

export const TextureSubcategory = {
    BRIGHT_CLEAR: 'Bright / Clear',
    WARM_RICH: 'Warm / Rich',
    DARK_HEAVY: 'Dark / Heavy',
    NATURAL_ACOUSTIC: 'Natural / Acoustic',
    SYNTHETIC_ELECTRONIC: 'Synthetic / Electronic',
    DENSE_LAYERED: 'Dense / Layered',
    SMOOTH_REFINED: 'Smooth / Refined',
    ROUGH_GRITTY: 'Rough / Gritty',
    SPATIAL_ATMOSPHERIC: 'Spatial / Atmospheric',
};

/**
 * Dictionary mapping subcategory names to their terms
 * Organized by: category -> subcategory -> [term ids]
 */
export const SUBCATEGORY_DICTIONARY = {
    [Category.MOOD]: {
        [MoodSubcategory.POSITIVE_UPLIFTING]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.POSITIVE_UPLIFTING).map(t => t.id),
        [MoodSubcategory.CALM_PEACEFUL]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.CALM_PEACEFUL).map(t => t.id),
        [MoodSubcategory.DARK_NEGATIVE]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.DARK_NEGATIVE).map(t => t.id),
        [MoodSubcategory.INTENSE_AGGRESSIVE]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.INTENSE_AGGRESSIVE).map(t => t.id),
        [MoodSubcategory.MYSTERIOUS_AMBIGUOUS]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.MYSTERIOUS_AMBIGUOUS).map(t => t.id),
        [MoodSubcategory.ROMANTIC_TENDER]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.ROMANTIC_TENDER).map(t => t.id),
        [MoodSubcategory.NOSTALGIC_REFLECTIVE]: TAXONOMY.filter(t => t.category === Category.MOOD && t.subcategory === MoodSubcategory.NOSTALGIC_REFLECTIVE).map(t => t.id),
    },
    [Category.ENERGY]: {
        [EnergySubcategory.HIGH_DRIVING]: TAXONOMY.filter(t => t.category === Category.ENERGY && t.subcategory === EnergySubcategory.HIGH_DRIVING).map(t => t.id),
        [EnergySubcategory.MEDIUM_FLOWING]: TAXONOMY.filter(t => t.category === Category.ENERGY && t.subcategory === EnergySubcategory.MEDIUM_FLOWING).map(t => t.id),
        [EnergySubcategory.LOW_CALM]: TAXONOMY.filter(t => t.category === Category.ENERGY && t.subcategory === EnergySubcategory.LOW_CALM).map(t => t.id),
        [EnergySubcategory.IRREGULAR_UNSTABLE]: TAXONOMY.filter(t => t.category === Category.ENERGY && t.subcategory === EnergySubcategory.IRREGULAR_UNSTABLE).map(t => t.id),
        [EnergySubcategory.EXPANSIVE_SOARING]: TAXONOMY.filter(t => t.category === Category.ENERGY && t.subcategory === EnergySubcategory.EXPANSIVE_SOARING).map(t => t.id),
        [EnergySubcategory.DYNAMIC_CHANGING]: TAXONOMY.filter(t => t.category === Category.ENERGY && t.subcategory === EnergySubcategory.DYNAMIC_CHANGING).map(t => t.id),
    },
    [Category.TEXTURE]: {
        [TextureSubcategory.BRIGHT_CLEAR]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.BRIGHT_CLEAR).map(t => t.id),
        [TextureSubcategory.WARM_RICH]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.WARM_RICH).map(t => t.id),
        [TextureSubcategory.DARK_HEAVY]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.DARK_HEAVY).map(t => t.id),
        [TextureSubcategory.NATURAL_ACOUSTIC]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.NATURAL_ACOUSTIC).map(t => t.id),
        [TextureSubcategory.SYNTHETIC_ELECTRONIC]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.SYNTHETIC_ELECTRONIC).map(t => t.id),
        [TextureSubcategory.DENSE_LAYERED]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.DENSE_LAYERED).map(t => t.id),
        [TextureSubcategory.SMOOTH_REFINED]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.SMOOTH_REFINED).map(t => t.id),
        [TextureSubcategory.ROUGH_GRITTY]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.ROUGH_GRITTY).map(t => t.id),
        [TextureSubcategory.SPATIAL_ATMOSPHERIC]: TAXONOMY.filter(t => t.category === Category.TEXTURE && t.subcategory === TextureSubcategory.SPATIAL_ATMOSPHERIC).map(t => t.id),
    },
};

/**
 * Token-optimized taxonomy for LLM music description generation
 * Structure: { category: { subcategory: { frequency: [[term, synonyms], ...] } } }
 * Categories: M=Mood, E=Energy, T=Texture
 * Frequencies: u=ubiquitous, f=frequent, i=infrequent, r=rare
 */

/**
 * System prompt legend for LLM (compact format for token efficiency)
 */
/*
A Hierarchical taxonomy for describing music, organized into three main categories: Mood (M), Energy (E), and Texture (T). 
Each category is broken down into descriptive subcategories, and within those, specific terms are ranked by frequency of use: 
ubiquitous (u), frequent (f), infrequent (i), and rare (r). 
Each primary term is also paired with a list of its synonyms.
/*

export const LLM_TAXONOMY_LEGEND = `TAXONOMY LEGEND:
Categories: M=Mood, E=Energy, T=Texture
Frequencies: u=ubiquitous (use most), f=frequent, i=infrequent, r=rare (use least)

Subcategories:
M: PU=Positive/Uplifting, CP=Calm/Peaceful, DN=Dark/Negative, IA=Intense/Aggressive, MA=Mysterious/Ambiguous, RT=Romantic/Tender, NR=Nostalgic/Reflective
E: HD=High/Driving, MF=Medium/Flowing, LC=Low/Calm, IU=Irregular/Unstable, ES=Expansive/Soaring, DC=Dynamic/Changing
T: BC=Bright/Clear, WR=Warm/Rich, DH=Dark/Heavy, NA=Natural/Acoustic, SE=Synthetic/Electronic, DL=Dense/Layered, SR=Smooth/Refined, RG=Rough/Gritty, SA=Spatial/Atmospheric

Task: Generate 1-2 natural sentences describing music. Use 1-3 terms from each category (M, E, T). 
Bias selection by frequency. 
Only use listed terms or their synonyms.
Aim for between 12-30 words total.';

export const TAXONOMY_FOR_LLM_GENERATION = {
    M: {
        PU: {
            u: [
                ['upbeat', ['buoyant','jaunty','lively','peppy','sprightly']],
                ['joyful', ['elated','gleeful','jubilant']],
                ['positive', ['affirmative','constructive','favorable','sanguine']],
            ],
            f: [
                ['happy', ['content','glad','pleased','mirthful']],
                ['cheerful', ['blithe','cheery','jolly','merry']],
                ['uplifting', ['elevating','heartening','inspiriting','invigorating','rousing']],
                ['hopeful', ['auspicious','expectant','promising']],
                ['playful', ['frisky','lighthearted','whimsical']],
                ['romantic', ['amorous','amatory','impassioned']],
                ['sentimental', ['emotional','mawkish','schmaltzy']],
                ['triumphant', ['victorious','winning','conquering']],
                ['heroic', ['brave','courageous','valiant']],
                ['optimistic', ['bullish','sanguine','sunny']],
                ['celebratory', ['commemorative','gala','tribute']],
                ['festive', ['convivial','jovial','mirthful']],
                ['inspiring', ['encouraging','motivating','stimulating']],
                ['proud', ['gratified','honored','satisfied']],
                ['thrilling', ['gripping','riveting','stirring']],
            ],
            i: [
                ['euphoric', ['blissful','overjoyed','rapturous']],
                ['exuberant', ['ebullient','high-spirited','vivacious']],
                ['ecstatic', ['blissful','overjoyed','rapturous']],
                ['elated', ['gleeful','jubilant','thrilled']],
            ],
            r: [
                ['sparkly', ['glittering','scintillating','twinkling']],
            ],
        },
        CP: { // Calm / Peaceful
            u: [
                ['peaceful', ['balmy','halcyon','untroubled']],
                ['calm', ['composed','unruffled','untroubled']],
            ],
            f: [
                ['relaxed', ['at-ease','leisurely','unwinding']],
                ['serene', ['halcyon','placid','undisturbed']],
                ['dreamy', ['hazy','surreal','visionary']],
                ['tranquil', ['reposing','unperturbed','undisturbed']],
                ['meditative', ['introspective','ruminative','thoughtful']],
                ['soothing', ['balmy','calming','comforting','lulling']],
                ['gentle', ['clement','lenient','mild']],
                ['contemplative', ['introspective','ruminative','thoughtful']],
                ['atmospheric', ['allusive','emotive','evocative']],
                ['smooth', ['even','level','uninterrupted']],
            ],
            i: [
                ['restful', ['leisurely','relaxing','reposing']],
                ['ethereal', ['celestial','diaphanous','unearthly']],
            ],
            r: [
                ['gossamer', ['diaphanous','filmy','sheer']],
            ],
        },
        DN: { // Dark / Negative
            f: [
                ['dark', ['bleak','dismal','tenebrous']],
                ['melancholic', ['doleful','lugubrious','sorrowful']],
                ['sad', ['dejected','sorrowful','unhappy']],
                ['somber', ['dour','grave','solemn']],
                ['brooding', ['morose','sullen','sulky']],
                ['chilling', ['eerie','frightening','spooky']],
                ['fearful', ['afraid','apprehensive','scared']],
                ['gloomy', ['cheerless','depressing','dismal']],
                ['haunting', ['eerie','memorable','unforgettable']],
                ['moody', ['changeable','sullen','temperamental']],
                ['lonely', ['isolated','lonesome','solitary']],
                ['ominous', ['foreboding','portentous','sinister']],
            ],
            i: [
                ['mournful', ['grieving','lamenting','sorrowful']],
                ['desolate', ['barren','bleak','stark']],
                ['wistful', ['pining','regretful','ruminative']],
                ['tragic', ['calamitous','catastrophic','heartbreaking']],
                ['painful', ['aching','agonizing','sore']],
                ['disturbing', ['perturbing','troubling','disquieting']],
                ['shadowy', ['dim','indistinct','nebulous']],
            ],
            r: [
                ['forlorn', ['crestfallen','miserable','woebegone']],
                ['nauseating', ['disgusting','revolting','sickening']],
                ['plaintive', ['doleful','lamenting','sorrowful']],
            ],
            u: [
                ['negative', ['adverse','detrimental','pessimistic']],
            ],
        },
        IA: { // Intense / Aggressive
            f: [
                ['intense', ['acute','extreme','severe']],
                ['aggressive', ['belligerent','confrontational','hostile']],
                ['driving', ['compelling','impelling','motivating']],
                ['powerful', ['commanding','mighty','potent']],
                ['forceful', ['assertive','coercive','emphatic']],
                ['raw', ['brutal','primitive','unfiltered']],
                ['edgy', ['avant-garde','nervous','unconventional']],
                ['angry', ['enraged','incensed','irate']],
                ['tense', ['strained','stressed','taut']],
                ['defiant', ['insubordinate','rebellious','disobedient']],
                ['anxious', ['apprehensive','nervous','worried']],
            ],
            i: [
                ['fierce', ['ferocious','savage','vicious']],
                ['explosive', ['detonative','eruptive','volatile']],
                ['menacing', ['intimidating','sinister','threatening']],
                ['violent', ['brutal','destructive','savage']],
                ['furious', ['incensed','livid','enraged']],
                ['harsh', ['severe','stern','unpleasant']],
                ['thunderous', ['booming','deafening','resounding']],
                ['annoying', ['bothersome','irritating','vexing']],
                ['agitated', ['disturbed','flustered','unsettled']],
                ['unsettling', ['disquieting','unnerving','perturbing']],
                ['restless', ['fidgety','fretful','uneasy']],
            ],
            r: [
                ['blistering', ['rapid','scorching','searing']],
                ['snarling', ['growling','threatening','vicious']],
            ],
        },
        MA: { // Mysterious / Ambiguous
            f: [
                ['mysterious', ['baffling','inexplicable','secretive']],
                ['enigmatic', ['ambiguous','inscrutable','perplexing']],
                ['ethereal-ambience', ['celestial-vibe','otherworldly-atmosphere','unearthly-mood']],
                ['mystical', ['magical','occult','spiritual']],
                ['entrancing', ['captivating','mesmerizing','spellbinding']],
                ['majestic', ['grand','regal','stately']],
                ['epic', ['colossal','grandiose','monumental']],
                ['strange', ['odd','peculiar','unusual']],
            ],
            i: [
                ['otherworldly', ['alien','supernatural','unearthly']],
                ['cryptic', ['arcane','abstruse','esoteric']],
                ['veiled', ['concealed','disguised','hidden']],
                ['obscure', ['indistinct','unclear','vague']],
                ['awe-inspiring', ['breathtaking','magnificent','stunning']],
                ['puzzling', ['bewildering','confounding','perplexing']],
                ['spine-tingling', ['creepy','eerie','hair-raising']],
                ['transcendent', ['exalted','metaphysical','surpassing']],
                ['cosmic', ['celestial','galactic','universal']],
                ['panoramic', ['broad','extensive','wide-ranging']],
            ],
            r: [
                ['elusive', ['evasive','fleeting','slippery']],
                ['twilight', ['crepuscule','dusk','gloaming']],
                ['liminal', ['in-between','threshold','transitional']],
            ],
        },
        RT: { // Romantic / Tender
            f: [
                ['tender', ['fond','kind','sympathetic']],
                ['affectionate', ['caring','devoted','fond']],
                ['intimate', ['close','confidential','personal']],
                ['loving', ['adoring','devoted','fond']],
                ['sensual', ['erotic','luscious','pleasurable']],
                ['passionate', ['ardent','fervent','fervid']],
            ],
            i: [
                ['compassionate', ['benevolent','empathetic','sympathetic']],
                ['warm-hearted', ['amiable','generous','kind']],
                ['sultry', ['provocative','seductive','torrid']],
                ['yearning', ['craving','hankering','pining']],
                ['longing', ['craving','desire','pining']],
            ],
        },
        NR: { // Nostalgic / Reflective
            f: [
                ['nostalgic', ['homesick','pining','regretful']],
                ['reflective', ['cerebral','introspective','ruminative']],
                ['bittersweet', ['mixed-emotion','sadly-fond','melancholy-yet-pleasant']],
            ],
            i: [
                ['reminiscent', ['evocative','redolent','suggestive']],
                ['pensive', ['absorbed','introspective','ruminative']],
                ['poignant', ['affecting','moving','touching']],
                ['retrospective', ['backward-looking','recollective','reviewing']],
            ],
            r: [
                ['memory-laden', ['evocative','recollective','redolent']],
            ],
        },
    },
    E: {
        HD: { // High / Driving
            u: [
                ['energetic', ['active','lively','spirited']],
                ['exciting', ['rousing','stirring','stimulating']],
            ],
            f: [
                ['driving', ['compelling','impelling','motivating']],
                ['vigorous', ['robust','strenuous','hardy']],
                ['pumping', ['beating','pounding','throbbing']],
                ['dynamic', ['active','high-powered','lively']],
                ['punchy', ['impactful','incisive','forceful']],
                ['vibrant', ['lively','spirited','vivacious']],
                ['bouncy', ['jouncy','resilient','springy']],
                ['strong', ['potent','robust','sturdy']],
            ],
            i: [
                ['propulsive', ['impelling','motivating','projecting']],
                ['explosive', ['detonative','eruptive','volatile']],
                ['kinetic', ['in-motion','moving','active']],
                ['pulsating', ['beating','throbbing','vibrating']],
                ['frenetic', ['feverish','frantic','frenzied']],
                ['relentless', ['ceaseless','incessant','persistent']],
                ['urgent', ['critical','imperative','pressing']],
                ['brisk', ['jaunty','quick','swift']],
                ['electrifying', ['exhilarating','galvanizing','stimulating']],
                ['thumping', ['beating','pounding','throbbing']],
            ],
            r: [
                ['high-octane', ['full-throttle','high-powered','fast-paced']],
                ['turbocharged', ['accelerated','boosted','supercharged']],
            ],
        },
        MF: { // Medium / Flowing
            f: [
                ['flowing', ['continuous','graceful','unbroken']],
                ['steady', ['consistent','stable','unwavering']],
                ['moderate', ['reasonable','temperate','medium']],
                ['balanced', ['even','proportional','stable']],
                ['measured', ['calibrated','considered','regular']],
                ['rolling', ['billowing','surging','wavy']],
                ['rhythmic', ['cadenced','lilting','metrical']],
                ['groovy', ['cool','funky','swinging']],
                ['swinging', ['lilting','rocking','swaying']],
                ['mid-tempo', ['andante','medium-paced','moderate-speed']],
            ],
            i: [
                ['medium-energy', ['average-intensity','mid-level','moderate-paced']],
                ['cascading', ['descending','pouring','tumbling']],
                ['undulating', ['fluctuating','rippling','wavy']],
                ['pulsing', ['beating','throbbing','vibrating']],
                ['unhurried', ['deliberate','easygoing','leisurely']],
                ['paced', ['controlled','regulated','timed']],
            ],
            r: [
                ['cruising', ['coasting','gliding','sailing']],
            ],
        },
        LC: { // Low / Calm
            u: [
                ['chill', ['carefree','easygoing','unwinding']],
                ['mellow', ['dulcet','euphonious','tuneful']],
                ['relaxed', ['calm','easygoing','laid-back']],
                ['soft', ['gentle','quiet','muted']],
            ],
            f: [
                ['laid-back', ['carefree','easygoing','untroubled']],
                ['low-energy', ['inactive','lethargic','sluggish']],
                ['ambient', ['background','environmental','surrounding']],
                ['gentle', ['mild','soft','tender']],
                ['subdued', ['low-key','muted','quiet']],
                ['serene', ['peaceful','calm','tranquil']],
                ['delicate', ['fine','fragile','subtle']],
            ],
            i: [
                ['boring', ['dull','tedious','uninteresting']],
                ['restrained', ['controlled','reserved','understated']],
                ['placid', ['composed','equable','unruffled']],
                ['still', ['inert','motionless','unmoving']],
                ['downtempo', ['largo','leisurely','slow-paced']],
                ['languid', ['lethargic','listless','unenergetic']],
                ['hushed', ['muted','quiet','silent']],
                ['sedate', ['calm','composed','tranquil']],
                ['hypnotic', ['mesmerizing','spellbinding','trance-like']],
            ],
        },
        IU: { // Irregular / Unstable
            f: [
                ['chaotic', ['anarchic','disordered','tumultuous']],
            ],
            i: [
                ['erratic', ['capricious','inconsistent','unpredictable']],
                ['unstable', ['precarious','shaky','volatile']],
                ['jarring', ['clashing','discordant','grating']],
                ['turbulent', ['stormy','tempestuous','tumultuous']],
                ['fragmented', ['piecemeal','scattered','splintered']],
                ['hectic', ['frantic','frenzied','chaotic']],
            ],
            r: [
                ['jittery', ['jumpy','nervous','skittish']],
                ['disjointed', ['fragmentary','incoherent','disconnected']],
            ],
        },
        ES: { // Expansive / Soaring
            f: [
                ['expansive', ['broad','extensive','wide-ranging']],
                ['soaring', ['ascending','climbing','towering']],
                ['sweeping', ['all-encompassing','broad','wide']],
            ],
            i: [
                ['lifting', ['elevating','hoisting','raising']],
                ['vast', ['enormous','huge','immense']],
                ['breathless', ['gasping','intense','panting']],
            ],
            r: [
                ['boundless', ['endless','infinite','limitless']],
            ],
        },
        DC: { // Dynamic / Changing
            f: [
                ['gradual', ['incremental','progressive','slow']],
                ['swelling', ['expanding','growing','increasing']],
            ],
            i: [
                ['crescendoing', ['building','intensifying','swelling']],
                ['decaying', ['diminishing','fading','waning']],
            ],
            r: [
                ['wavering', ['faltering','hesitating','fluctuating']],
                ['oscillating', ['fluctuating','swinging','vibrating']],
                ['spiraling', ['coiling','twisting','winding']],
            ],
        },
    },
    T: {
        BC: { // Bright / Clear
            u: [
                ['bright', ['brilliant','luminous','vivid']],
                ['crisp', ['distinct','incisive','sharp']],
                ['clear', ['lucid','transparent','unambiguous']],
            ],
            f: [
                ['brilliant', ['dazzling','radiant','bright']],
                ['sparkling', ['glittering','scintillating','twinkling']],
                ['crystalline', ['pellucid','pristine','translucent']],
                ['shimmering', ['gleaming','glinting','glistening']],
                ['airy', ['delicate','light','spacious']],
                ['polished', ['burnished','glossy','lustrous']],
                ['pristine', ['immaculate','spotless','unblemished']],
            ],
            i: [
                ['radiant', ['aglow','beaming','incandescent']],
                ['gleaming', ['glistening','lustrous','shining']],
                ['shiny', ['gleaming','glossy','lustrous']],
            ],
            r: [
                ['luminous', ['glowing','radiant','shining']],
            ],
        },
        WR: { // Warm / Rich
            u: [
                ['warm', ['balmy','cordial','genial']],
                ['rich', ['opulent','plush','sonorous']],
                ['mellow', ['smooth','soft','rounded']],
                ['soft', ['gentle','mellow','smooth']],
            ],
            f: [
                ['full', ['abundant','complete','resonant']],
                ['lush', ['luxuriant','opulent','verdant']],
                ['creamy', ['buttery','milky','velvety']],
                ['golden', ['aureate','flaxen','gilded']],
                ['rounded', ['bulbous','curved','globular']],
            ],
            i: [
                ['honeyed', ['nectarous','saccharine','sugary']],
                ['enveloping', ['blanketing','encasing','surrounding']],
                ['cozy', ['comfortable','homey','snug']],
                ['velvety', ['downy','satiny','suede-like']],
                ['buttery', ['creamy','oily','smooth']],
                ['silky', ['sleek','satiny','lustrous']],
            ],
            r: [
                ['embracing', ['clasping','encompassing','hugging']],
                ['sumptuous', ['lavish','luxurious','opulent']],
            ],
        },
        DH: { // Dark / Heavy
            u: [
                ['dark', ['shadowy','murky','gloomy']],
            ],
            f: [
                ['muddy', ['murky','turbid','opaque']],
                ['harsh', ['jarring','severe','strident']],
                ['gritty', ['abrasive','coarse','grainy']],
                ['murky', ['cloudy','dim','obscure']],
                ['raspy', ['croaky','gravelly','hoarse']],
                ['buzzy', ['droning','humming','whirring']],
                ['distorted', ['deformed','twisted','warped']],
                ['heavy', ['massive','ponderous','weighty']],
                ['dense', ['compact','concentrated','thickset']],
                ['thick', ['condensed','concentrated','viscous']],
                ['muffled', ['muted','suppressed','stifled']],
                ['dissonant', ['cacophonous','discordant','inharmonic']],
            ],
            i: [
                ['coarse', ['bristly','scratchy','rough']],
                ['abrasive', ['caustic','chafing','grating']],
                ['shadowy', ['dark','obscure','dim']],
                ['veiled', ['obscured','concealed','muffled']],
                ['obscured', ['concealed','hidden','veiled']],
                ['clouded', ['befogged','foggy','overcast']],
            ],
            r: [
                ['oppressive', ['crushing','overbearing','stifling']],
                ['static', ['fixed','stationary','unchanging']],
            ],
        },
        NA: { // Natural / Acoustic
            u: [
                ['acoustic', ['instrumental','non-electric','unplugged']],
                ['natural', ['inherent','innate','native']],
            ],
            f: [
                ['organic', ['biological','genuine','unadulterated']],
                ['raw', ['brutal','crude','unrefined']],
                ['live', ['in-person','onsite','spontaneous']],
                ['authentic', ['bona-fide','genuine','real']],
                ['woody', ['ligneous','timbered','woodsy']],
                ['breathy', ['aspirated','gasping','sighing']],
                ['human', ['anthropic','corporeal','fleshly']],
                ['intimate', ['close','personal','private']],
                ['resonant', ['reverberating','ringing','sonorous']],
                ['textured', ['composite','tactile','variegated']],
                ['grainy', ['granular','sandy','coarse']],
            ],
            i: [
                ['unprocessed', ['untreated','raw','unrefined']],
                ['close-miked', ['near-field','proximal-recording','up-close']],
                ['hollow', ['cavernous','empty','vacant']],
                ['earthy', ['rustic','terrestrial','unrefined']],
            ],
            r: [
                ['fibrous', ['sinewy','stringy','thread-like']],
            ],
        },
        SE: { // Synthetic / Electronic
            u: [
                ['electronic', ['automated','digitized','technological']],
            ],
            f: [
                ['synthetic', ['fabricated','man-made','manufactured']],
                ['digital', ['binary','computerized','numeric']],
                ['processed', ['altered','modified','treated']],
                ['programmed', ['coded','instructed','scheduled']],
                ['artificial', ['fake','imitation','sham']],
                ['robotic', ['automated','mechanical','machinelike']],
                ['metallic', ['brassy','steely','tinny']],
                ['analog', ['continuous','non-digital','waveform']],
            ],
            i: [
                ['computerized', ['automated','digitized','mechanized']],
                ['futuristic', ['advanced','visionary','forward-looking']],
                ['cyber', ['networked','online','virtual']],
                ['glassy', ['glazed','hyaline','vitreous']],
                ['mechanical', ['automated','industrial','machinelike']],
                ['glitchy', ['buggy','faulty','stuttering']],
            ],
            r: [
                ['pixelated', ['blocky','digitized','mosaic']],
            ],
        },
        DL: { // Dense / Layered
            f: [
                ['layered', ['overlapping','stratified','tiered']],
                ['complex', ['complicated','convoluted','involved']],
                ['rich-density', ['concentrated','full-bodied','opulent-texture']],
                ['full-bodied', ['hearty','robust','substantial']],
                ['intricate', ['baroque','convoluted','tangled']],
                ['detailed', ['comprehensive','specific','thorough']],
                ['sparse', ['meager','scant','thin']],
                ['minimalistic', ['austere','stark','unadorned']],
            ],
            i: [
                ['challenging', ['demanding','difficult','testing']],
                ['orchestrated', ['arranged','composed','coordinated']],
                ['elaborate', ['ornate','baroque','fancy']],
            ],
            r: [
                ['multi-textured', ['composite','heterogeneous','variegated']],
                ['stratified', ['banded','laminated','tiered']],
                ['polyphonic', ['many-voiced','multipart','contrapuntal']],
                ['homophonic', ['block-harmony','chordal','melody-accompaniment']],
                ['monophonic', ['solo-line','single-line','unison']],
                ['heterophonic', ['multi-textured-monody','variation-parallel','near-unison']],
            ],
        },
        SR: { // Smooth / Refined
            u: [
                ['smooth', ['sleek','polished','flowing']],
            ],
            f: [
                ['refined', ['cultivated','polished','urbane']],
                ['elegant', ['chic','stylish','tasteful']],
                ['sophisticated', ['cosmopolitan','cultured','worldly']],
                ['seamless', ['continuous','flawless','unbroken']],
                ['fluid', ['flowing','liquid','graceful']],
            ],
            i: [
                ['sleek', ['aerodynamic','glossy','streamlined']],
                ['effortless', ['facile','easy','uncomplicated']],
                ['graceful', ['agile','nimble','supple']],
            ],
        },
        RG: { // Rough / Gritty
            f: [
                ['rough', ['bumpy','coarse','uneven']],
                ['raw-finish', ['crude-surface','natural-state','unfinished']],
                ['edgy', ['sharp','cutting','angular']],
            ],
            i: [
                ['jagged', ['serrated','spiky','uneven']],
                ['unpolished', ['crude','rough-hewn','unrefined']],
            ],
            r: [
                ['crunchy', ['crackly','crispy','brittle']],
                ['ratty', ['dilapidated','shabby','tattered']],
            ],
        },
        SA: { // Spatial / Atmospheric
            f: [
                ['spacious', ['ample','capacious','roomy']],
                ['atmospheric', ['ambient','evocative','immersive']],
                ['cinematic', ['dramatic','filmic','visual']],
            ],
            i: [
                ['reverberant', ['echoing','resonant','vibrating']],
                ['wet', ['damp','moist','saturated']],
                ['dry', ['arid','desiccated','parched']],
                ['intimate-space', ['close-quarters','cozy-setting','confined-area']],
                ['echoey', ['cavernous','reverberating','resonant']],
            ],
        },
    },
};

/**
 * Backward compatibility: Vocabulary arrays (for existing code)
 */
export const VOCABULARY_MET = {
    mood: getTermIds('Mood'),
    energy: getTermIds('Energy'),
    texture: getTermIds('Texture'),
};
//# sourceMappingURL=taxonomy.js.map