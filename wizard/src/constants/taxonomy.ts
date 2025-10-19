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

export type TaxonomyCategory = 'Mood' | 'Energy' | 'Texture';
export type FrequencyLevel = 'ubiquitous' | 'frequent' | 'infrequent' | 'rare';

export interface TaxonomyTerm {
  id: string;                      // Canonical term identifier (clean, no category suffixes)
  category: TaxonomyCategory;      // Main category (disambiguates multi-category terms)
  subcategory: string;             // Subcategory label (e.g., 'Positive / Uplifting')
  frequency: FrequencyLevel;       // Rarity/popularity
  synonyms?: string[];             // Optional array of synonyms for this term
  description?: string;            // Optional description
}

// ============================================================================
// MASTER TAXONOMY REGISTRY - All terms defined here
// ============================================================================

export const TAXONOMY: readonly TaxonomyTerm[] = [
  // ========== MOOD ==========

  // Positive / Uplifting
  { id: 'upbeat', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous', synonyms: ['buoyant', 'jaunty', 'lively', 'peppy', 'sprightly'] },
  { id: 'energetic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous' },
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
  { id: 'flowing', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'infrequent' },
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
  { id: 'chaotic', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },

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
  { id: 'high-energy', category: 'Energy', subcategory: 'High / Driving', frequency: 'ubiquitous' },
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
  { id: 'up-tempo', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent', synonyms: ['fast-paced', 'quick', 'brisk'] },
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
  { id: 'tense', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'frequent' },
  { id: 'anxious', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'frequent' },
  { id: 'chaotic', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'frequent', synonyms: ['anarchic', 'disordered', 'tumultuous'] },
  { id: 'agitated', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'erratic', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['capricious', 'inconsistent', 'unpredictable'] },
  { id: 'unstable', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['precarious', 'shaky', 'volatile'] },
  { id: 'jarring', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['clashing', 'discordant', 'grating'] },
  { id: 'dissonant', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'frequent' },
  { id: 'turbulent', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['stormy', 'tempestuous', 'tumultuous'] },
  { id: 'unsettling', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'fragmented', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['piecemeal', 'scattered', 'splintered'] },
  { id: 'static', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'rare' },
  { id: 'restless', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'jittery', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'rare', synonyms: ['jumpy', 'nervous', 'skittish'] },
  { id: 'hectic', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'infrequent', synonyms: ['frantic', 'frenzied', 'chaotic'] },
  { id: 'disjointed', category: 'Energy', subcategory: 'Irregular / Unstable', frequency: 'rare', synonyms: ['fragmentary', 'incoherent', 'disconnected'] },

  // Expansive / Soaring
  { id: 'expansive', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'frequent', synonyms: ['broad', 'extensive', 'wide-ranging'] },
  { id: 'soaring', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'frequent', synonyms: ['ascending', 'climbing', 'towering'] },
  { id: 'lifting', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'infrequent', synonyms: ['elevating', 'hoisting', 'raising'] },
  { id: 'transcendent', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'boundless', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'rare', synonyms: ['endless', 'infinite', 'limitless'] },
  { id: 'sweeping', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'frequent', synonyms: ['all-encompassing', 'broad', 'wide'] },
  { id: 'majestic', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'frequent' },
  { id: 'panoramic', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'vast', category: 'Energy', subcategory: 'Expansive / Soaring', frequency: 'infrequent', synonyms: ['enormous', 'huge', 'immense'] },
  { id: 'cosmic', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
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

  // Clean / Clear
  { id: 'bright', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'ubiquitous', synonyms: ['brilliant', 'luminous', 'vivid'] },
  { id: 'crisp', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'ubiquitous', synonyms: ['distinct', 'incisive', 'sharp'] },
  { id: 'clear', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'ubiquitous', synonyms: ['lucid', 'transparent', 'unambiguous'] },
  { id: 'brilliant', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['dazzling', 'radiant', 'bright'] },
  { id: 'sparkling', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['glittering', 'scintillating', 'twinkling'] },
  { id: 'crystalline', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['pellucid', 'pristine', 'translucent'] },
  { id: 'shimmering', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['gleaming', 'glinting', 'glistening'] },
  { id: 'radiant', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['aglow', 'beaming', 'incandescent'] },
  { id: 'gleaming', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['glistening', 'lustrous', 'shining'] },
  { id: 'airy', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['delicate', 'light', 'spacious'] },
  { id: 'polished', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['burnished', 'glossy', 'lustrous'] },
  { id: 'pristine', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['immaculate', 'spotless', 'unblemished'] },
  { id: 'shiny', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['gleaming', 'glossy', 'lustrous'] },
  { id: 'luminous', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'rare', synonyms: ['glowing', 'radiant', 'shining'] },
  { id: 'refined', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['cultivated', 'polished', 'urbane'] },
  { id: 'sleek', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['aerodynamic', 'glossy', 'streamlined'] },
  { id: 'elegant', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['chic', 'stylish', 'tasteful'] },
  { id: 'sophisticated', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['cosmopolitan', 'cultured', 'worldly'] },
  { id: 'seamless', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['continuous', 'flawless', 'unbroken'] },
  { id: 'effortless', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['facile', 'easy', 'uncomplicated'] },
  { id: 'fluid', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'frequent', synonyms: ['flowing', 'liquid', 'graceful'] },
  { id: 'graceful', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['agile', 'nimble', 'supple'] },
  { id: 'smooth', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'ubiquitous', synonyms: ['sleek', 'polished', 'flowing'] },
  { id: 'wet', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['damp', 'moist', 'saturated'] },
  { id: 'glassy', category: 'Texture', subcategory: 'Clean / Clear', frequency: 'infrequent', synonyms: ['glazed', 'hyaline', 'vitreous'] },

  // Distorted / Noisy
  { id: 'muddy', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'frequent', synonyms: ['murky', 'turbid', 'opaque'] },
  { id: 'harsh', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'frequent', synonyms: ['jarring', 'severe', 'strident'] },
  { id: 'buzzy', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'frequent', synonyms: ['droning', 'humming', 'whirring'] },
  { id: 'distorted', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'frequent', synonyms: ['deformed', 'twisted', 'warped'] },
  { id: 'abrasive', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'infrequent', synonyms: ['caustic', 'chafing', 'grating'] },
  { id: 'dissonant', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'frequent', synonyms: ['cacophonous', 'discordant', 'inharmonic'] },
  { id: 'static', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'rare', synonyms: ['fixed', 'stationary', 'unchanging'] },
  { id: 'glitchy', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'infrequent', synonyms: ['buggy', 'faulty', 'stuttering'] },
  { id: 'crunchy', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'rare', synonyms: ['crackly', 'crispy', 'brittle'] },
  { id: 'ratty', category: 'Texture', subcategory: 'Distorted / Noisy', frequency: 'rare', synonyms: ['dilapidated', 'shabby', 'tattered'] },

  // Rich / Warm
  { id: 'warm', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'ubiquitous', synonyms: ['balmy', 'cordial', 'genial'] },
  { id: 'rich', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'ubiquitous', synonyms: ['opulent', 'plush', 'sonorous'] },
  { id: 'full', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['abundant', 'complete', 'resonant'] },
  { id: 'lush', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['luxuriant', 'opulent', 'verdant'] },
  { id: 'creamy', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['buttery', 'milky', 'velvety'] },
  { id: 'honeyed', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['nectarous', 'saccharine', 'sugary'] },
  { id: 'golden', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['aureate', 'flaxen', 'gilded'] },
  { id: 'mellow', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'ubiquitous', synonyms: ['smooth', 'soft', 'rounded'] },
  { id: 'rounded', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['bulbous', 'curved', 'globular'] },
  { id: 'embracing', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['clasping', 'encompassing', 'hugging'] },
  { id: 'enveloping', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['blanketing', 'encasing', 'surrounding'] },
  { id: 'cozy', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['comfortable', 'homey', 'snug'] },
  { id: 'sumptuous', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['lavish', 'luxurious', 'opulent'] },
  { id: 'velvety', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['downy', 'satiny', 'suede-like'] },
  { id: 'buttery', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['creamy', 'oily', 'smooth'] },
  { id: 'silky', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['sleek', 'satiny', 'lustrous'] },
  { id: 'soft', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'ubiquitous', synonyms: ['gentle', 'mellow', 'smooth'] },
  { id: 'layered', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['overlapping', 'stratified', 'tiered'] },
  { id: 'complex', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['complicated', 'convoluted', 'involved'] },
  { id: 'rich-density', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['concentrated', 'full-bodied', 'opulent-texture'] },
  { id: 'full-bodied', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['hearty', 'robust', 'substantial'] },
  { id: 'orchestrated', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['arranged', 'composed', 'coordinated'] },
  { id: 'intricate', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['baroque', 'convoluted', 'tangled'] },
  { id: 'detailed', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['comprehensive', 'specific', 'thorough'] },
  { id: 'multi-textured', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['composite', 'heterogeneous', 'variegated'] },
  { id: 'stratified', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['banded', 'laminated', 'tiered'] },
  { id: 'elaborate', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'infrequent', synonyms: ['ornate', 'baroque', 'fancy'] },
  { id: 'polyphonic', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['many-voiced', 'multipart', 'contrapuntal'] },
  { id: 'homophonic', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['block-harmony', 'chordal', 'melody-accompaniment'] },
  { id: 'heterophonic', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'rare', synonyms: ['multi-textured-monody', 'variation-parallel', 'near-unison'] },
  { id: 'dense', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['compact', 'concentrated', 'thickset'] },
  { id: 'thick', category: 'Texture', subcategory: 'Rich / Warm', frequency: 'frequent', synonyms: ['condensed', 'concentrated', 'viscous'] },

  // Rough / Raw
  { id: 'gritty', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['abrasive', 'coarse', 'grainy'] },
  { id: 'raspy', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['croaky', 'gravelly', 'hoarse'] },
  { id: 'coarse', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'infrequent', synonyms: ['bristly', 'scratchy', 'rough'] },
  { id: 'raw', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['brutal', 'crude', 'unrefined'] },
  { id: 'unprocessed', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'infrequent', synonyms: ['untreated', 'raw', 'unrefined'] },
  { id: 'grainy', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['granular', 'sandy', 'coarse'] },
  { id: 'rough', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['bumpy', 'coarse', 'uneven'] },
  { id: 'jagged', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'infrequent', synonyms: ['serrated', 'spiky', 'uneven'] },
  { id: 'raw-finish', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['crude-surface', 'natural-state', 'unfinished'] },
  { id: 'unpolished', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'infrequent', synonyms: ['crude', 'rough-hewn', 'unrefined'] },
  { id: 'edgy', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'frequent', synonyms: ['sharp', 'cutting', 'angular'] },
  { id: 'dry', category: 'Texture', subcategory: 'Rough / Raw', frequency: 'infrequent', synonyms: ['arid', 'desiccated', 'parched'] },

  // Sparse / Minimal
  { id: 'dark', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'ubiquitous', synonyms: ['shadowy', 'murky', 'gloomy'] },
  { id: 'murky', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['cloudy', 'dim', 'obscure'] },
  { id: 'shadowy', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['dark', 'obscure', 'dim'] },
  { id: 'veiled', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['obscured', 'concealed', 'muffled'] },
  { id: 'obscured', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['concealed', 'hidden', 'veiled'] },
  { id: 'heavy', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['massive', 'ponderous', 'weighty'] },
  { id: 'clouded', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['befogged', 'foggy', 'overcast'] },
  { id: 'muffled', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['muted', 'suppressed', 'stifled'] },
  { id: 'oppressive', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'rare', synonyms: ['crushing', 'overbearing', 'stifling'] },
  { id: 'acoustic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'ubiquitous', synonyms: ['instrumental', 'non-electric', 'unplugged'] },
  { id: 'organic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['biological', 'genuine', 'unadulterated'] },
  { id: 'natural', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'ubiquitous', synonyms: ['inherent', 'innate', 'native'] },
  { id: 'live', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['in-person', 'onsite', 'spontaneous'] },
  { id: 'authentic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['bona-fide', 'genuine', 'real'] },
  { id: 'woody', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['ligneous', 'timbered', 'woodsy'] },
  { id: 'breathy', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['aspirated', 'gasping', 'sighing'] },
  { id: 'human', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['anthropic', 'corporeal', 'fleshly'] },
  { id: 'intimate', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['close', 'personal', 'private'] },
  { id: 'close-miked', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['near-field', 'proximal-recording', 'up-close'] },
  { id: 'hollow', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['cavernous', 'empty', 'vacant'] },
  { id: 'earthy', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['rustic', 'terrestrial', 'unrefined'] },
  { id: 'fibrous', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'rare', synonyms: ['sinewy', 'stringy', 'thread-like'] },
  { id: 'resonant', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['reverberating', 'ringing', 'sonorous'] },
  { id: 'textured', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['composite', 'tactile', 'variegated'] },
  { id: 'electronic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'ubiquitous', synonyms: ['automated', 'digitized', 'technological'] },
  { id: 'synthetic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['fabricated', 'man-made', 'manufactured'] },
  { id: 'digital', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['binary', 'computerized', 'numeric'] },
  { id: 'processed', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['altered', 'modified', 'treated'] },
  { id: 'programmed', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['coded', 'instructed', 'scheduled'] },
  { id: 'artificial', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['fake', 'imitation', 'sham'] },
  { id: 'computerized', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['automated', 'digitized', 'mechanized'] },
  { id: 'robotic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['automated', 'mechanical', 'machinelike'] },
  { id: 'futuristic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['advanced', 'visionary', 'forward-looking'] },
  { id: 'modern', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['contemporary', 'up-to-date', 'new-school'] },
  { id: 'cyber', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['networked', 'online', 'virtual'] },
  { id: 'pixelated', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'rare', synonyms: ['blocky', 'digitized', 'mosaic'] },
  { id: 'metallic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['brassy', 'steely', 'tinny'] },
  { id: 'analog', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['continuous', 'non-digital', 'waveform'] },
  { id: 'mechanical', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['automated', 'industrial', 'machinelike'] },
  { id: 'challenging', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['demanding', 'difficult', 'testing'] },
  { id: 'sparse', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['meager', 'scant', 'thin'] },
  { id: 'minimalistic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['austere', 'stark', 'unadorned'] },
  { id: 'monophonic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'rare', synonyms: ['solo-line', 'single-line', 'unison'] },
  { id: 'spacious', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['ample', 'capacious', 'roomy'] },
  { id: 'reverberant', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['echoing', 'resonant', 'vibrating'] },
  { id: 'intimate-space', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['close-quarters', 'cozy-setting', 'confined-area'] },
  { id: 'echoey', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'infrequent', synonyms: ['cavernous', 'reverberating', 'resonant'] },
  { id: 'atmospheric', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['ambient', 'evocative', 'immersive'] },
  { id: 'cinematic', category: 'Texture', subcategory: 'Sparse / Minimal', frequency: 'frequent', synonyms: ['dramatic', 'filmic', 'visual'] },
] as const;

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
export function getTerm(id: string): TaxonomyTerm | undefined {
  return TAXONOMY_BY_ID.get(id);
}

/**
 * Get ALL occurrences of a term across categories
 */
export function getTerms(id: string): readonly TaxonomyTerm[] {
  return TAXONOMY.filter(t => t.id === id);
}

/**
 * Get all term IDs for a category (may include duplicates from multi-category terms)
 */
export function getTermIds(category: TaxonomyCategory): string[] {
  return TAXONOMY.filter(t => t.category === category).map(t => t.id);
}

/**
 * Get all terms for a category
 */
export function getTermsByCategory(category: TaxonomyCategory): readonly TaxonomyTerm[] {
  return TAXONOMY.filter(t => t.category === category);
}

/**
 * Subcategory mappings organized by main category
 */
export const SUBCATEGORIES: Record<TaxonomyCategory, Record<string, string[]>> = {
  Mood: groupBySubcategory('Mood'),
  Energy: groupBySubcategory('Energy'),
  Texture: groupBySubcategory('Texture'),
};

function groupBySubcategory(category: TaxonomyCategory): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

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
export const TERM_FREQUENCIES: Record<string, FrequencyLevel> = Object.fromEntries(
  Array.from(new Map(TAXONOMY.map(t => [t.id, t.frequency])).entries())
);

/**
 * Terms organized by frequency within each category
 */
export const TERMS_BY_FREQUENCY: Record<TaxonomyCategory, Record<FrequencyLevel, string[]>> = {
  Mood: groupByFrequency('Mood'),
  Energy: groupByFrequency('Energy'),
  Texture: groupByFrequency('Texture'),
};

function groupByFrequency(category: TaxonomyCategory): Record<FrequencyLevel, string[]> {
  const groups: Record<FrequencyLevel, string[]> = {
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
 * Backward compatibility: Vocabulary arrays (for existing code)
 */
export const VOCABULARY_MET = {
  mood: getTermIds('Mood'),
  energy: getTermIds('Energy'),
  texture: getTermIds('Texture'),
} as const;
