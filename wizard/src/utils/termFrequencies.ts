/**
 * Term frequency utilities
 *
 * NOTE: All frequency data is now imported from ../constants/taxonomy.ts (single source of truth)
 */

import { Term } from '../types/filter';
import { FrequencyCategory } from '../types/frequency';
import { TERM_FREQUENCIES } from '../constants/taxonomy';

// Re-export for convenience
export { TERM_FREQUENCIES } from '../constants/taxonomy';

// Map backend frequency enum values to frontend lowercase values (if needed in future)
export const backendToFrontendFrequency = (backendFreq?: string): Exclude<FrequencyCategory, 'all'> | undefined => {
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
