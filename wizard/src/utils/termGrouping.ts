/**
 * Term grouping utilities for organizing terms by category or popularity
 * Feature: 006-below-the-filter
 * Task: T004
 *
 * NOTE: All taxonomy data is now imported from ../constants/taxonomy.ts (single source of truth)
 */

import type { MoodTerm, EnergyTerm, TextureTerm } from '../types/protocol';
import type { TermCategory, TermGroup } from '../types/grouping';
import type { FrequencyCategory } from '../types/frequency';
import { SUBCATEGORIES, TERM_FREQUENCIES, TAXONOMY } from '../constants/taxonomy';

// Re-export for backward compatibility
export { TERM_FREQUENCIES } from '../constants/taxonomy';

// Hierarchical subcategory mappings imported from taxonomy.ts (single source of truth)
const MOOD_SUBCATEGORIES: Record<string, string[]> = SUBCATEGORIES.Mood;
const ENERGY_SUBCATEGORIES: Record<string, string[]> = SUBCATEGORIES.Energy;
const TEXTURE_SUBCATEGORIES: Record<string, string[]> = SUBCATEGORIES.Texture;

// Pre-computed term sets for O(1) category lookups (derived from TAXONOMY)
const MOOD_TERMS: Set<string> = new Set(
  TAXONOMY.filter(t => t.category === 'Mood').map(t => t.id)
);
const ENERGY_TERMS: Set<string> = new Set(
  TAXONOMY.filter(t => t.category === 'Energy').map(t => t.id)
);
const TEXTURE_TERMS: Set<string> = new Set(
  TAXONOMY.filter(t => t.category === 'Texture').map(t => t.id)
);

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

  // Group by energy subcategories
  for (const [subcategoryLabel, subcategoryTerms] of Object.entries(ENERGY_SUBCATEGORIES)) {
    const matchingTerms = terms.filter(term => subcategoryTerms.includes(term));
    if (matchingTerms.length > 0) {
      sortedGroups.push({
        label: subcategoryLabel,
        terms: sortTermsByFrequency(matchingTerms)
      });
    }
  }

  // Group by texture subcategories
  for (const [subcategoryLabel, subcategoryTerms] of Object.entries(TEXTURE_SUBCATEGORIES)) {
    const matchingTerms = terms.filter(term => subcategoryTerms.includes(term));
    if (matchingTerms.length > 0) {
      sortedGroups.push({
        label: subcategoryLabel,
        terms: sortTermsByFrequency(matchingTerms)
      });
    }
  }

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
