/**
 * Backend Vocabulary Constants
 *
 * Re-exports vocabulary from wizard/src/constants/vocabulary.ts (single source of truth)
 * with necessary adaptations for backend usage.
 *
 * NOTE: This file imports from the wizard module. If the import path breaks,
 * you may need to copy vocabulary data temporarily or set up a monorepo structure.
 */

import { VOCABULARY as WIZARD_VOCABULARY } from '../../../wizard/src/constants/vocabulary';

/**
 * Vocabulary for random description generation
 * Sourced from wizard/src/constants/vocabulary.ts
 */
export const VOCABULARY = {
  mood: Array.from(WIZARD_VOCABULARY.mood),
  energy: Array.from(WIZARD_VOCABULARY.energy),
  texture: Array.from(WIZARD_VOCABULARY.texture),
  primary_genre: Array.from(WIZARD_VOCABULARY.primary_genres),
  subgenres: WIZARD_VOCABULARY.secondary_genres,
  instrument: Array.from(WIZARD_VOCABULARY.instrument),
  instrument_roles: WIZARD_VOCABULARY.instrument_roles,
  instrument_descriptors: WIZARD_VOCABULARY.instrument_descriptors,
  vocals_presence: Array.from(WIZARD_VOCABULARY.vocals_presence).filter(v => v !== 'none'), // Exclude 'none'
  vocals_gender: Array.from(WIZARD_VOCABULARY.vocals_gender),
  vocals_style: Array.from(WIZARD_VOCABULARY.vocals_style),
} as const;
