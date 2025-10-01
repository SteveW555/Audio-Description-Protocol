/**
 * SINGLE SOURCE OF TRUTH for Mood/Energy/Texture Taxonomy
 *
 * This file contains the complete 479-term taxonomy with full metadata.
 * All other taxonomy-related files derive their data from this registry.
 *
 * DO NOT duplicate this data elsewhere - import from this file instead.
 */

export type TaxonomyCategory = 'Mood' | 'Energy' | 'Texture';
export type FrequencyLevel = 'ubiquitous' | 'frequent' | 'infrequent' | 'rare';

export interface TaxonomyTerm {
  id: string;                      // Canonical term identifier (clean, no category suffixes)
  category: TaxonomyCategory;      // Main category
  subcategory: string;             // Subcategory label (e.g., 'Positive / Uplifting')
  frequency: FrequencyLevel;       // Rarity/popularity
  description?: string;            // Optional description
}

// ============================================================================
// MASTER TAXONOMY REGISTRY - All 479 terms defined here
// ============================================================================

export const TAXONOMY: readonly TaxonomyTerm[] = [
  // ========== MOOD ==========

  // Positive / Uplifting
  { id: 'upbeat', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous' },
  { id: 'energetic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous' },
  { id: 'joyful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous' },
  { id: 'positive', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'ubiquitous' },
  { id: 'happy', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'cheerful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'uplifting', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'hopeful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'playful', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'romantic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'sentimental', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'triumphant', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'heroic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'optimistic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'euphoric', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent' },
  { id: 'exuberant', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent' },
  { id: 'ecstatic', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent' },
  { id: 'elated', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'infrequent' },
  { id: 'celebratory', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'festive', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'inspiring', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'frequent' },
  { id: 'sparkly', category: 'Mood', subcategory: 'Positive / Uplifting', frequency: 'rare' },

  // Calm / Peaceful
  { id: 'peaceful', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'ubiquitous' },
  { id: 'calm', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'ubiquitous' },
  { id: 'relaxed', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'serene', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'dreamy', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'tranquil', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'meditative', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'soothing', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'gentle', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'contemplative', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'restful', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'infrequent' },
  { id: 'ethereal', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'infrequent' },
  { id: 'atmospheric', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'flowing', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'infrequent' },
  { id: 'smooth', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'frequent' },
  { id: 'gossamer', category: 'Mood', subcategory: 'Calm / Peaceful', frequency: 'rare' },

  // Dark / Negative
  { id: 'dark', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'melancholic', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'sad', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'somber', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'brooding', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'mournful', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent' },
  { id: 'gloomy', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'haunting', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'moody', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'desolate', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent' },
  { id: 'forlorn', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'rare' },
  { id: 'wistful', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent' },
  { id: 'tragic', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent' },
  { id: 'lonely', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'ominous', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'frequent' },
  { id: 'disturbing', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent' },
  { id: 'shadowy', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'infrequent' },
  { id: 'plaintive', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'rare' },
  { id: 'negative', category: 'Mood', subcategory: 'Dark / Negative', frequency: 'ubiquitous' },

  // Intense / Aggressive
  { id: 'intense', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'aggressive', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'driving', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'powerful', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'forceful', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'fierce', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'raw', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'edgy', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'explosive', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'menacing', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'angry', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'violent', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'furious', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'tense', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'frequent' },
  { id: 'harsh', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'thunderous', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },
  { id: 'blistering', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'rare' },
  { id: 'snarling', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'rare' },
  { id: 'chaotic', category: 'Mood', subcategory: 'Intense / Aggressive', frequency: 'infrequent' },

  // Mysterious / Ambiguous
  { id: 'mysterious', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },
  { id: 'enigmatic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },
  { id: 'ethereal-ambience', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },
  { id: 'otherworldly', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent' },
  { id: 'mystical', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },
  { id: 'cryptic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent' },
  { id: 'elusive', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'rare' },
  { id: 'veiled', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent' },
  { id: 'obscure', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'infrequent' },
  { id: 'twilight', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'rare' },
  { id: 'liminal', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'rare' },
  { id: 'majestic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },
  { id: 'epic', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },
  { id: 'strange', category: 'Mood', subcategory: 'Mysterious / Ambiguous', frequency: 'frequent' },

  // Romantic / Tender
  { id: 'tender', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent' },
  { id: 'affectionate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent' },
  { id: 'intimate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent' },
  { id: 'loving', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent' },
  { id: 'sensual', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent' },
  { id: 'warm-hearted', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent' },
  { id: 'sultry', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent' },
  { id: 'passionate', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'frequent' },
  { id: 'yearning', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent' },
  { id: 'longing', category: 'Mood', subcategory: 'Romantic / Tender', frequency: 'infrequent' },

  // Nostalgic / Reflective
  { id: 'nostalgic', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'frequent' },
  { id: 'reflective', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'frequent' },
  { id: 'bittersweet', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'frequent' },
  { id: 'reminiscent', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent' },
  { id: 'pensive', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent' },
  { id: 'poignant', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent' },
  { id: 'memory-laden', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'rare' },
  { id: 'retrospective', category: 'Mood', subcategory: 'Nostalgic / Reflective', frequency: 'infrequent' },

  // ========== ENERGY ==========

  // High / Driving
  { id: 'high-energy', category: 'Energy', subcategory: 'High / Driving', frequency: 'ubiquitous' },
  { id: 'vigorous', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent' },
  { id: 'propulsive', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'pumping', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent' },
  { id: 'dynamic', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent' },
  { id: 'kinetic', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'punchy', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent' },
  { id: 'pulsating', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'frenetic', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'relentless', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'urgent', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'vibrant', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent' },
  { id: 'bouncy', category: 'Energy', subcategory: 'High / Driving', frequency: 'frequent' },
  { id: 'brisk', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'electrifying', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },
  { id: 'high-octane', category: 'Energy', subcategory: 'High / Driving', frequency: 'rare' },
  { id: 'turbocharged', category: 'Energy', subcategory: 'High / Driving', frequency: 'rare' },
  { id: 'thumping', category: 'Energy', subcategory: 'High / Driving', frequency: 'infrequent' },

  // Medium / Flowing
  { id: 'steady', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'moderate', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'balanced', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'measured', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'rolling', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'rhythmic', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'groovy', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'medium-energy', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent' },
  { id: 'cascading', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent' },
  { id: 'undulating', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent' },
  { id: 'swinging', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'pulsing', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent' },
  { id: 'unhurried', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent' },
  { id: 'cruising', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'rare' },
  { id: 'mid-tempo', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'frequent' },
  { id: 'paced', category: 'Energy', subcategory: 'Medium / Flowing', frequency: 'infrequent' },

  // Low / Calm
  { id: 'laid-back', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent' },
  { id: 'low-energy', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent' },
  { id: 'ambient', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent' },
  { id: 'chill', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous' },
  { id: 'mellow', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous' },
  { id: 'subdued', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent' },
  { id: 'restrained', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'placid', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'still', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'downtempo', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'languid', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'hushed', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'delicate', category: 'Energy', subcategory: 'Low / Calm', frequency: 'frequent' },
  { id: 'soft', category: 'Energy', subcategory: 'Low / Calm', frequency: 'ubiquitous' },
  { id: 'sedate', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },
  { id: 'hypnotic', category: 'Energy', subcategory: 'Low / Calm', frequency: 'infrequent' },

  // Tense / Unstable
  { id: 'anxious', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'frequent' },
  { id: 'agitated', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'erratic', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'unstable', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'jarring', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'dissonant', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'frequent' },
  { id: 'turbulent', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'unsettling', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'fragmented', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'static', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'rare' },
  { id: 'restless', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'jittery', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'rare' },
  { id: 'hectic', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'infrequent' },
  { id: 'disjointed', category: 'Energy', subcategory: 'Tense / Unstable', frequency: 'rare' },

  // Expansive / Building
  { id: 'expansive', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'frequent' },
  { id: 'soaring', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'frequent' },
  { id: 'lifting', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'transcendent', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'boundless', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'rare' },
  { id: 'sweeping', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'frequent' },
  { id: 'panoramic', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'vast', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'cosmic', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'breathless', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'gradual', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'frequent' },
  { id: 'crescendoing', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'swelling', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'frequent' },
  { id: 'decaying', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'infrequent' },
  { id: 'wavering', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'rare' },
  { id: 'oscillating', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'rare' },
  { id: 'spiraling', category: 'Energy', subcategory: 'Expansive / Building', frequency: 'rare' },

  // ========== TEXTURE ==========

  // Bright / Clear
  { id: 'bright', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'ubiquitous' },
  { id: 'crisp', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'ubiquitous' },
  { id: 'clear', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'ubiquitous' },
  { id: 'brilliant', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'sparkling', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'crystalline', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'shimmering', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'radiant', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'infrequent' },
  { id: 'gleaming', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'infrequent' },
  { id: 'airy', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'polished', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'pristine', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'frequent' },
  { id: 'shiny', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'infrequent' },
  { id: 'luminous', category: 'Texture', subcategory: 'Bright / Clear', frequency: 'rare' },

  // Warm / Rich
  { id: 'warm', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'ubiquitous' },
  { id: 'rich', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'ubiquitous' },
  { id: 'full', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent' },
  { id: 'lush', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent' },
  { id: 'creamy', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent' },
  { id: 'honeyed', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent' },
  { id: 'golden', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent' },
  { id: 'rounded', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'frequent' },
  { id: 'embracing', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'rare' },
  { id: 'enveloping', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent' },
  { id: 'cozy', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent' },
  { id: 'sumptuous', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'rare' },
  { id: 'velvety', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent' },
  { id: 'buttery', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent' },
  { id: 'silky', category: 'Texture', subcategory: 'Warm / Rich', frequency: 'infrequent' },

  // Dark / Heavy
  { id: 'muddy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'gritty', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'murky', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'raspy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'buzzy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'distorted', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'coarse', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent' },
  { id: 'abrasive', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent' },
  { id: 'obscured', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent' },
  { id: 'heavy', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'dense', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'thick', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'clouded', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'infrequent' },
  { id: 'muffled', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'frequent' },
  { id: 'oppressive', category: 'Texture', subcategory: 'Dark / Heavy', frequency: 'rare' },

  // Natural / Acoustic
  { id: 'acoustic', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'ubiquitous' },
  { id: 'organic', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'natural', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'ubiquitous' },
  { id: 'live', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'authentic', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'unprocessed', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent' },
  { id: 'woody', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'breathy', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'human', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'close-miked', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent' },
  { id: 'hollow', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent' },
  { id: 'earthy', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'infrequent' },
  { id: 'fibrous', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'rare' },
  { id: 'resonant', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'textured', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },
  { id: 'grainy', category: 'Texture', subcategory: 'Natural / Acoustic', frequency: 'frequent' },

  // Synthetic / Electronic
  { id: 'electronic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'ubiquitous' },
  { id: 'synthetic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'digital', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'processed', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'programmed', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'artificial', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'computerized', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent' },
  { id: 'robotic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'futuristic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent' },
  { id: 'cyber', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent' },
  { id: 'pixelated', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'rare' },
  { id: 'metallic', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'glassy', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent' },
  { id: 'analog', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'frequent' },
  { id: 'mechanical', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent' },
  { id: 'glitchy', category: 'Texture', subcategory: 'Synthetic / Electronic', frequency: 'infrequent' },

  // Dense / Layered
  { id: 'layered', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'complex', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'rich-density', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'full-bodied', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'orchestrated', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'infrequent' },
  { id: 'intricate', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'detailed', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'multi-textured', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare' },
  { id: 'stratified', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare' },
  { id: 'elaborate', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'infrequent' },
  { id: 'sparse', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'minimalistic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'frequent' },
  { id: 'polyphonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare' },
  { id: 'homophonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare' },
  { id: 'monophonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare' },
  { id: 'heterophonic', category: 'Texture', subcategory: 'Dense / Layered', frequency: 'rare' },

  // Smooth / Refined
  { id: 'refined', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent' },
  { id: 'sleek', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'infrequent' },
  { id: 'elegant', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent' },
  { id: 'sophisticated', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent' },
  { id: 'seamless', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent' },
  { id: 'effortless', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'infrequent' },
  { id: 'fluid', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'frequent' },
  { id: 'graceful', category: 'Texture', subcategory: 'Smooth / Refined', frequency: 'infrequent' },

  // Rough / Gritty
  { id: 'rough', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'frequent' },
  { id: 'jagged', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'infrequent' },
  { id: 'raw-finish', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'frequent' },
  { id: 'unpolished', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'infrequent' },
  { id: 'crunchy', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'rare' },
  { id: 'ratty', category: 'Texture', subcategory: 'Rough / Gritty', frequency: 'rare' },

  // Spatial / Atmospheric
  { id: 'spacious', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'frequent' },
  { id: 'reverberant', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent' },
  { id: 'wet', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent' },
  { id: 'dry', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent' },
  { id: 'intimate-space', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent' },
  { id: 'echoey', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'infrequent' },
  { id: 'cinematic', category: 'Texture', subcategory: 'Spatial / Atmospheric', frequency: 'frequent' },
] as const;

// ============================================================================
// DERIVED DATA STRUCTURES - Auto-generated from TAXONOMY array
// ============================================================================

/**
 * Term lookup by ID (O(1) access)
 */
export const TAXONOMY_BY_ID = new Map(TAXONOMY.map(term => [term.id, term]));

/**
 * Get term metadata by ID
 */
export function getTerm(id: string): TaxonomyTerm | undefined {
  return TAXONOMY_BY_ID.get(id);
}

/**
 * Get all term IDs for a category
 */
export function getTermIds(category: TaxonomyCategory): string[] {
  return TAXONOMY.filter(t => t.category === category).map(t => t.id);
}

/**
 * Get all terms for a category
 */
export function getTerms(category: TaxonomyCategory): readonly TaxonomyTerm[] {
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
 * Frequency mappings for all terms
 */
export const TERM_FREQUENCIES: Record<string, FrequencyLevel> = Object.fromEntries(
  TAXONOMY.map(t => [t.id, t.frequency])
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
