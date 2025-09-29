/**
 * Term grouping utilities for organizing terms by category or popularity
 * Feature: 006-below-the-filter
 * Task: T004
 */

import type { MoodTerm, EnergyTerm, TextureTerm } from '../types/protocol';
import type { TermCategory, TermGroup } from '../types/grouping';
import { TERM_FREQUENCIES } from './termFrequencies';
import type { FrequencyCategory } from '../types/frequency';

// Hierarchical subcategory mappings (from taxonomy.py TAXONOMY_HIERARCHY)
const MOOD_SUBCATEGORIES: Record<string, string[]> = {
  'Positive / Uplifting': [
    'upbeat', 'energetic-mood', 'joyful', 'happy', 'cheerful', 'uplifting', 'positive-mood',
    'hopeful', 'playful', 'romantic', 'sentimental', 'triumphant', 'heroic', 'optimistic',
    'euphoric', 'exuberant', 'ecstatic', 'elated', 'celebratory', 'festive', 'inspiring', 'sparkly-mood'
  ],
  'Calm / Peaceful': [
    'peaceful', 'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative', 'soothing',
    'gentle', 'contemplative', 'restful', 'ethereal-mood', 'atmospheric-mood', 'flowing-mood',
    'smooth-mood', 'gossamer-mood'
  ],
  'Dark / Negative': [
    'dark-mood', 'melancholic', 'sad', 'somber', 'brooding', 'mournful', 'gloomy', 'haunting',
    'moody', 'desolate', 'forlorn', 'wistful', 'tragic', 'lonely', 'ominous', 'disturbing',
    'shadowy-mood', 'plaintive', 'negative-mood'
  ],
  'Intense / Aggressive': [
    'intense-mood', 'aggressive', 'driving-mood', 'powerful-mood', 'forceful', 'fierce',
    'raw-mood', 'edgy-mood', 'explosive-mood', 'menacing', 'angry', 'violent', 'furious',
    'tense', 'harsh-mood', 'thunderous', 'blistering', 'snarling', 'chaotic-mood'
  ],
  'Mysterious / Ambiguous': [
    'mysterious', 'enigmatic', 'ethereal-ambience', 'otherworldly', 'mystical', 'cryptic',
    'elusive', 'veiled-mood', 'obscure-mood', 'twilight', 'liminal', 'majestic', 'epic', 'strange'
  ],
  'Romantic / Tender': [
    'tender', 'affectionate', 'intimate-mood', 'loving', 'sensual', 'warm-hearted', 'sultry',
    'passionate', 'yearning', 'longing'
  ],
  'Nostalgic / Reflective': [
    'nostalgic', 'reflective', 'bittersweet', 'reminiscent', 'pensive', 'poignant',
    'memory-laden', 'retrospective'
  ]
};

// Pre-computed term sets for O(1) category lookups (main categories)
const MOOD_TERMS: Set<string> = new Set([
  // Positive / Uplifting
  'upbeat', 'energetic-mood', 'joyful', 'happy', 'cheerful', 'uplifting', 'positive-mood',
  'hopeful', 'playful', 'romantic', 'sentimental', 'triumphant', 'heroic', 'optimistic',
  'euphoric', 'exuberant', 'ecstatic', 'elated', 'celebratory', 'festive', 'inspiring', 'sparkly-mood',
  // Calm / Peaceful
  'peaceful', 'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative', 'soothing',
  'gentle', 'contemplative', 'restful', 'ethereal-mood', 'atmospheric-mood', 'flowing-mood',
  'smooth-mood', 'gossamer-mood',
  // Dark / Negative
  'dark-mood', 'melancholic', 'sad', 'somber', 'brooding', 'mournful', 'gloomy', 'haunting',
  'moody', 'desolate', 'forlorn', 'wistful', 'tragic', 'lonely', 'ominous', 'disturbing',
  'shadowy-mood', 'plaintive', 'negative-mood',
  // Intense / Aggressive
  'intense-mood', 'aggressive', 'driving-mood', 'powerful-mood', 'forceful', 'fierce',
  'raw-mood', 'edgy-mood', 'explosive-mood', 'menacing', 'angry', 'violent', 'furious',
  'tense', 'harsh-mood', 'thunderous', 'blistering', 'snarling', 'chaotic-mood',
  // Mysterious / Ambiguous
  'mysterious', 'enigmatic', 'ethereal-ambience', 'otherworldly', 'mystical', 'cryptic',
  'elusive', 'veiled-mood', 'obscure-mood', 'twilight', 'liminal', 'majestic', 'epic', 'strange',
  // Romantic / Tender
  'tender', 'affectionate', 'intimate-mood', 'loving', 'sensual', 'warm-hearted', 'sultry',
  'passionate', 'yearning', 'longing',
  // Nostalgic / Reflective
  'nostalgic', 'reflective', 'bittersweet', 'reminiscent', 'pensive', 'poignant',
  'memory-laden', 'retrospective'
]);

const ENERGY_TERMS: Set<string> = new Set([
  // High / Positive Drive
  'high-energy', 'driving', 'vigorous', 'propulsive', 'pumping', 'dynamic-energy', 'explosive',
  'kinetic', 'punchy', 'pulsating', 'frenetic', 'relentless', 'urgent', 'vibrant', 'bouncy',
  'brisk', 'electrifying', 'high-octane', 'turbocharged', 'thumping',
  // Medium / Flowing
  'flowing', 'steady', 'moderate', 'balanced-energy', 'measured', 'rolling', 'rhythmic',
  'groovy', 'medium-energy', 'cascading', 'undulating', 'swinging', 'pulsing', 'unhurried',
  'cruising', 'mid-tempo', 'paced',
  // Low / Peaceful
  'laid-back', 'low-energy', 'ambient', 'chill', 'mellow-energy', 'gentle-energy', 'subdued',
  'restrained', 'placid', 'still', 'relaxed-energy', 'downtempo', 'languid', 'serene-energy',
  'hushed', 'delicate-energy', 'soft-energy', 'sedate', 'hypnotic',
  // Negative / Unstable
  'tense-energy', 'anxious-energy', 'chaotic-energy', 'agitated', 'erratic', 'unstable',
  'jarring-energy', 'dissonant-energy', 'turbulent', 'unsettling-energy', 'fragmented',
  'static-energy', 'restless', 'jittery', 'hectic', 'disjointed',
  // Expansive / Other
  'expansive', 'soaring', 'lifting', 'transcendent-energy', 'boundless', 'sweeping',
  'majestic-energy', 'panoramic', 'vast', 'cosmic', 'breathless', 'gradual', 'crescendoing',
  'swelling', 'decaying', 'wavering', 'oscillating', 'spiraling'
]);

const TEXTURE_TERMS: Set<string> = new Set([
  // Bright / Positive
  'bright', 'crisp', 'clear', 'brilliant', 'sparkling', 'crystalline', 'shimmering', 'radiant',
  'gleaming', 'airy', 'polished', 'pristine', 'shiny', 'luminous',
  // Warm / Peaceful
  'warm', 'rich', 'full', 'lush', 'creamy', 'honeyed', 'golden', 'mellow', 'rounded',
  'embracing', 'enveloping', 'cozy', 'sumptuous', 'velvety', 'buttery', 'silky', 'soft-texture',
  // Dark / Negative
  'dark', 'muddy', 'harsh', 'gritty-texture', 'murky', 'raspy', 'buzzy', 'distorted',
  'coarse', 'abrasive', 'shadowy-texture', 'veiled', 'obscured', 'heavy', 'dense', 'thick',
  'clouded', 'muffled', 'oppressive',
  // Natural / Acoustic
  'acoustic', 'organic', 'natural', 'raw-texture', 'live', 'authentic', 'unprocessed',
  'woody', 'breathy', 'human', 'intimate', 'close-miked', 'hollow', 'earthy', 'fibrous',
  'resonant', 'textured', 'grainy',
  // Synthetic / Electronic
  'electronic', 'synthetic', 'digital', 'processed', 'programmed', 'artificial', 'computerized',
  'robotic', 'futuristic', 'cyber', 'pixelated', 'metallic', 'glassy', 'analog', 'mechanical',
  'glitchy',
  // Density & Layering
  'layered', 'complex', 'rich-density', 'full-bodied', 'orchestrated', 'intricate', 'detailed',
  'multi-textured', 'stratified', 'elaborate', 'sparse', 'minimalistic', 'polyphonic',
  'homophonic', 'monophonic', 'heterophonic',
  // Smooth / Refined
  'smooth', 'silky-texture', 'polished-texture', 'refined', 'sleek', 'elegant', 'sophisticated',
  'seamless', 'effortless', 'fluid', 'graceful',
  // Rough / Gritty
  'rough', 'gritty', 'grainy-texture', 'coarse-texture', 'jagged', 'harsh-texture',
  'raw-finish', 'unpolished', 'edgy', 'abrasive-texture', 'crunchy', 'distorted-texture', 'ratty',
  // Space & Atmosphere
  'spacious', 'reverberant', 'wet', 'dry', 'intimate-space', 'echoey', 'atmospheric', 'cinematic'
]);

/**
 * Infer the semantic category of a term
 * @param term - Term string to categorize
 * @returns TermCategory ('Mood', 'Energy', 'Texture') or null if unknown
 */
export function inferTermCategory(term: string): TermCategory | null {
  if (MOOD_TERMS.has(term)) return 'Mood';
  if (ENERGY_TERMS.has(term)) return 'Energy';
  if (TEXTURE_TERMS.has(term)) return 'Texture';
  return null;
}

/**
 * Sort terms by frequency (most common first)
 * @param terms - Array of term strings
 * @returns Sorted array with ubiquitous → frequent → infrequent → rare → unknown
 */
export function sortTermsByFrequency(terms: string[]): string[] {
  const frequencyOrder: Record<Exclude<FrequencyCategory, 'all'>, number> = {
    ubiquitous: 0,
    frequent: 1,
    infrequent: 2,
    rare: 3
  };

  return [...terms].sort((a, b) => {
    const freqA = TERM_FREQUENCIES[a];
    const freqB = TERM_FREQUENCIES[b];

    // Terms without frequency go to end
    if (!freqA && !freqB) return 0; // Preserve order for unknown terms
    if (!freqA) return 1;
    if (!freqB) return -1;

    // Sort by frequency order
    const orderA = frequencyOrder[freqA];
    const orderB = frequencyOrder[freqB];
    return orderA - orderB;
  });
}

/**
 * Group terms by semantic subcategory (e.g., Positive/Uplifting, Calm/Peaceful, etc.)
 * @param terms - Array of term strings to group
 * @returns Array of TermGroup objects in hierarchical order, empty groups filtered out
 */
export function groupTermsByCategory(terms: string[]): TermGroup[] {
  if (terms.length === 0) return [];

  const sortedGroups: TermGroup[] = [];

  // Group by mood subcategories
  for (const [subcategoryLabel, subcategoryTerms] of Object.entries(MOOD_SUBCATEGORIES)) {
    const matchingTerms = terms.filter(term => subcategoryTerms.includes(term));
    if (matchingTerms.length > 0) {
      sortedGroups.push({
        label: subcategoryLabel,
        terms: sortTermsByFrequency(matchingTerms)
      });
    }
  }

  // TODO: Add Energy and Texture subcategories when available
  // For now, only mood terms will be grouped by subcategory

  return sortedGroups;
}

/**
 * Group terms by popularity/frequency level (Ubiquitous, Frequent, Infrequent, Rare)
 * @param terms - Array of term strings to group
 * @returns Array of TermGroup objects in frequency order, empty groups filtered out
 */
export function groupTermsByPopularity(terms: string[]): TermGroup[] {
  if (terms.length === 0) return [];

  // Initialize groups
  const groups: Record<Exclude<FrequencyCategory, 'all'>, string[]> = {
    ubiquitous: [],
    frequent: [],
    infrequent: [],
    rare: []
  };

  // Categorize terms by frequency
  for (const term of terms) {
    const frequency = TERM_FREQUENCIES[term];
    if (frequency) {
      groups[frequency].push(term);
    }
    // Terms without frequency are excluded (handled separately by caller)
  }

  // Sort terms within each group alphabetically (same frequency level)
  const sortedGroups: TermGroup[] = [];
  const frequencyOrder: Array<Exclude<FrequencyCategory, 'all'>> = [
    'ubiquitous',
    'frequent',
    'infrequent',
    'rare'
  ];

  const labelMap: Record<Exclude<FrequencyCategory, 'all'>, string> = {
    ubiquitous: 'Ubiquitous',
    frequent: 'Frequent',
    infrequent: 'Infrequent',
    rare: 'Rare'
  };

  for (const frequency of frequencyOrder) {
    const frequencyTerms = groups[frequency];
    if (frequencyTerms.length > 0) {
      sortedGroups.push({
        label: labelMap[frequency],
        terms: frequencyTerms.sort() // Alphabetical within same frequency
      });
    }
  }

  return sortedGroups;
}
