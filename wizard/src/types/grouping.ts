/**
 * Type definitions for the Group By feature
 * Feature: 006-below-the-filter
 */

/**
 * Represents the user's selected grouping method for term organization
 */
export type GroupByMethod = 'category' | 'popularity';

/**
 * localStorage persistence format for grouping preference
 * Key: adp-wizard-groupBy-v1
 */
export interface GroupByState {
  method: GroupByMethod;
  version: number;
}

/**
 * Semantic categories for audio description terms
 */
export type TermCategory = 'Mood' | 'Energy' | 'Texture';

/**
 * Collection of terms sharing a category or frequency level
 */
export interface TermGroup {
  label: string;
  terms: string[];
}
