/**
 * Random MET (Mood, Energy, Texture) Generator for Wizard
 *
 * Generates random term selections with weighted distribution matching backend logic
 */

import { TERMS_BY_FREQUENCY } from '../constants/taxonomy';
import {
    generateRandomInstrument as backendGenerateRandomInstrument,
    generateRandomGenre as backendGenerateRandomGenre,
    generateRandomVocals as backendGenerateRandomVocals
} from '../../../backend/src/utils/randomDescription';

export const generateRandomInstrument = backendGenerateRandomInstrument;
export const generateRandomGenre = backendGenerateRandomGenre;
export const generateRandomVocals = backendGenerateRandomVocals;

/**
 * Returns a weighted random count for MET categories
 * 60% chance of 2, 30% chance of 1, 10% chance of 3
 */
function getWeightedMETCount(): number {
  const rand = Math.random();
  if (rand < 0.6) return 2;
  if (rand < 0.9) return 1;
  return 3;
}

/**
 * Picks random terms weighted by popularity (ubiquitous > frequent > infrequent > rare)
 * @param category The MET category ('Mood', 'Energy', or 'Texture')
 * @param count Number of terms to pick
 * @returns Array of selected terms
 */
function pickWeightedTerms(
  category: 'Mood' | 'Energy' | 'Texture',
  count: number
): string[] {
  const termsByFreq = TERMS_BY_FREQUENCY[category];

  // Create weighted pool: ubiquitous (weight 4), frequent (3), infrequent (2), rare (1)
  const weightedPool: string[] = [
    ...termsByFreq.ubiquitous.flatMap(t => Array(4).fill(t)),
    ...termsByFreq.frequent.flatMap(t => Array(3).fill(t)),
    ...termsByFreq.infrequent.flatMap(t => Array(2).fill(t)),
    ...termsByFreq.rare,
  ];

  // Shuffle and pick unique terms
  const shuffled = [...weightedPool].sort(() => Math.random() - 0.5);
  const selected = new Set<string>();

  for (const term of shuffled) {
    selected.add(term);
    if (selected.size === count) break;
  }

  return Array.from(selected);
}

/**
 * Generates random selection for a single MET category
 * Uses weighted count (60% = 2, 30% = 1, 10% = 3) and popularity weighting
 *
 * @param category The MET category ('Mood', 'Energy', or 'Texture')
 * @returns Array of randomly selected terms
 */
export function generateRandomMETCategory(category: 'Mood' | 'Energy' | 'Texture'): string[] {
  const count = getWeightedMETCount();
  return pickWeightedTerms(category, count);
}

/**
 * Generates random Mood, Energy, Texture (MET) terms with weighted distribution
 *
 * Uses weighted count selection (60% = 2, 30% = 1, 10% = 3) and enforces
 * maximum 6 total terms across all categories. Terms are selected with
 * popularity weighting (ubiquitous > frequent > infrequent > rare).
 *
 * @returns Object containing mood, energy, and texture term arrays
 */
export function generateRandomMET() {
  // Pick weighted counts for Mood, Energy, Texture (60% = 2, 30% = 1, 10% = 3)
  let moodCount = getWeightedMETCount();
  let energyCount = getWeightedMETCount();
  let textureCount = getWeightedMETCount();

  // Enforce maximum 6 total terms across all MET categories
  let totalCount = moodCount + energyCount + textureCount;
  while (totalCount > 6) {
    // Reduce the largest count first
    if (moodCount >= energyCount && moodCount >= textureCount && moodCount > 1) {
      moodCount--;
    } else if (energyCount >= textureCount && energyCount > 1) {
      energyCount--;
    } else if (textureCount > 1) {
      textureCount--;
    } else {
      // If all are at 1, reduce mood (arbitrary choice)
      moodCount = Math.max(1, moodCount - 1);
    }
    totalCount = moodCount + energyCount + textureCount;
  }

  // Pick terms weighted by popularity (ubiquitous > frequent > infrequent > rare)
  return {
    mood: pickWeightedTerms('Mood', moodCount),
    energy: pickWeightedTerms('Energy', energyCount),
    texture: pickWeightedTerms('Texture', textureCount),
  };
}
