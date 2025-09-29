import { Term } from '../types/filter';
import { FrequencyCategory } from '../types/frequency';

// Map backend frequency enum values to frontend lowercase values
const backendToFrontendFrequency = (backendFreq?: string): Exclude<FrequencyCategory, 'all'> | undefined => {
  if (!backendFreq) return undefined;

  const mapping: Record<string, Exclude<FrequencyCategory, 'all'>> = {
    'RARE': 'rare',
    'INFREQUENT': 'infrequent',
    'FREQUENT': 'frequent',
    'UBIQUITOUS': 'ubiquitous',
    'rare': 'rare',
    'infrequent': 'infrequent',
    'frequent': 'frequent',
    'ubiquitous': 'ubiquitous'
  };

  return mapping[backendFreq];
};

// Sample frequency mappings based on backend taxonomy.py
// In production, this would come from an API endpoint
export const TERM_FREQUENCIES: Record<string, Exclude<FrequencyCategory, 'all'>> = {
  // Mood - Positive/Uplifting
  'upbeat': 'ubiquitous',
  'energetic-mood': 'ubiquitous',
  'joyful': 'ubiquitous',
  'positive-mood': 'ubiquitous',
  'happy': 'frequent',
  'cheerful': 'frequent',
  'uplifting': 'frequent',
  'hopeful': 'frequent',
  'playful': 'frequent',
  'romantic': 'frequent',
  'sentimental': 'frequent',
  'triumphant': 'frequent',
  'heroic': 'frequent',
  'optimistic': 'frequent',
  'euphoric': 'infrequent',
  'exuberant': 'infrequent',
  'ecstatic': 'infrequent',
  'elated': 'infrequent',
  'celebratory': 'frequent',
  'festive': 'frequent',
  'inspiring': 'frequent',
  'sparkly-mood': 'rare',

  // Mood - Calm/Peaceful
  'peaceful': 'ubiquitous',
  'calm': 'ubiquitous',
  'relaxed': 'frequent',
  'serene': 'frequent',
  'dreamy': 'frequent',
  'tranquil': 'frequent',
  'meditative': 'frequent',
  'soothing': 'frequent',
  'gentle': 'frequent',
  'contemplative': 'frequent',
  'restful': 'infrequent',
  'ethereal-mood': 'infrequent',
  'atmospheric-mood': 'frequent',
  'flowing-mood': 'infrequent',
  'smooth-mood': 'frequent',
  'gossamer-mood': 'rare',

  // Mood - Dark/Negative
  'dark-mood': 'frequent',
  'melancholic': 'frequent',
  'sad': 'frequent',
  'somber': 'frequent',
  'brooding': 'frequent',
  'mournful': 'infrequent',
  'gloomy': 'frequent',
  'haunting': 'frequent',
  'moody': 'frequent',
  'desolate': 'infrequent',
  'forlorn': 'rare',
  'wistful': 'infrequent',
  'tragic': 'infrequent',
  'lonely': 'frequent',
  'ominous': 'frequent',
  'disturbing': 'infrequent',
  'shadowy-mood': 'infrequent',
  'plaintive': 'rare',
  'negative-mood': 'ubiquitous',

  // Mood - Intense/Aggressive
  'intense-mood': 'frequent',
  'aggressive': 'frequent',
  'driving-mood': 'frequent',
  'powerful-mood': 'frequent',
  'forceful': 'frequent',
  'fierce': 'infrequent',
  'raw-mood': 'frequent',
  'edgy-mood': 'frequent',
  'explosive-mood': 'infrequent',
  'menacing': 'infrequent',
  'angry': 'frequent',
  'violent': 'infrequent',
  'furious': 'infrequent',
  'tense': 'frequent',
  'harsh-mood': 'infrequent',
  'thunderous': 'infrequent',
  'blistering': 'rare',
  'snarling': 'rare',
  'chaotic-mood': 'infrequent',

  // Energy levels
  'energetic': 'ubiquitous',
  'high-energy': 'ubiquitous',
  'lively': 'frequent',
  'vivacious': 'infrequent',
  'dynamic': 'frequent',
  'vibrant': 'frequent',
  'pulsing': 'frequent',
  'driving': 'frequent',
  'propulsive': 'infrequent',
  'restrained': 'frequent',
  'laid-back': 'frequent',
  'mellow': 'frequent',
  'subdued': 'frequent',
  'low-energy': 'frequent',
  'ambient': 'frequent',
  'static': 'infrequent',
  'lethargic': 'rare',

  // Texture
  'sparse': 'frequent',
  'dense': 'frequent',
  'layered': 'frequent',
  'thick': 'frequent',
  'thin': 'frequent',
  'rich': 'frequent',
  'lush': 'frequent',
  'minimal': 'frequent',
  'complex': 'frequent',
  'simple': 'frequent',
  'polyphonic': 'infrequent',
  'homophonic': 'infrequent',
  'monophonic': 'rare',
};

/**
 * Convert an array of string terms to Term objects with frequency metadata
 */
export const convertToTermsWithFrequency = (termValues: string[]): Term[] => {
  return termValues.map(value => ({
    value,
    frequency: TERM_FREQUENCIES[value] || undefined
  }));
};

/**
 * Get frequency for a specific term
 */
export const getTermFrequency = (term: string): Exclude<FrequencyCategory, 'all'> | undefined => {
  return TERM_FREQUENCIES[term];
};