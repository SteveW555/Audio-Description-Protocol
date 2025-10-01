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
    id: string;
    category: TaxonomyCategory;
    subcategory: string;
    frequency: FrequencyLevel;
    description?: string;
}
export declare const TAXONOMY: readonly TaxonomyTerm[];
/**
 * Term lookup by ID (O(1) access)
 */
export declare const TAXONOMY_BY_ID: Map<string, TaxonomyTerm>;
/**
 * Get term metadata by ID (first occurrence if multi-category)
 */
export declare function getTerm(id: string): TaxonomyTerm | undefined;
/**
 * Get ALL occurrences of a term across categories
 */
export declare function getTerms(id: string): readonly TaxonomyTerm[];
/**
 * Get all term IDs for a category (may include duplicates from multi-category terms)
 */
export declare function getTermIds(category: TaxonomyCategory): string[];
/**
 * Get all terms for a category
 */
export declare function getTermsByCategory(category: TaxonomyCategory): readonly TaxonomyTerm[];
/**
 * Subcategory mappings organized by main category
 */
export declare const SUBCATEGORIES: Record<TaxonomyCategory, Record<string, string[]>>;
/**
 * Frequency mappings for all terms (uses first occurrence for multi-category terms)
 */
export declare const TERM_FREQUENCIES: Record<string, FrequencyLevel>;
/**
 * Terms organized by frequency within each category
 */
export declare const TERMS_BY_FREQUENCY: Record<TaxonomyCategory, Record<FrequencyLevel, string[]>>;
/**
 * Backward compatibility: Vocabulary arrays (for existing code)
 */
export declare const VOCABULARY_MET: {
    readonly mood: string[];
    readonly energy: string[];
    readonly texture: string[];
};
//# sourceMappingURL=taxonomy.d.ts.map