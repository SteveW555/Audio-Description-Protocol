/**
 * Random Description Generator
 *
 * Generates randomized musical descriptions for testing the AI phrase generation feature.
 * Imports vocabulary from single source of truth via backend/src/constants/vocabulary.ts
 */

import { VOCABULARY } from '../constants/vocabulary';

/**
 * Picks random items from an array
 */
function pickRandom<T>(arr: readonly T[], count: number = 1): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Picks a single random item from an array
 */
function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random musical description for testing
 *
 * @returns Structured wizard data object with randomized values
 */
export function generateRandomDescription() {
  // Pick primary genre
  const primaryGenre = pickOne(VOCABULARY.primary_genre);

  // Pick 1 subgenre for the primary genre
  const subgenreList = VOCABULARY.subgenres[primaryGenre as keyof typeof VOCABULARY.subgenres] || [];
  const subgenre = subgenreList.length > 0 ? pickOne(subgenreList) : undefined;

  // Pick 1-3 terms for Mood, Energy, Texture
  const moodCount = randomInt(1, 3);
  const energyCount = randomInt(1, 3);
  const textureCount = randomInt(1, 3);

  const mood = pickRandom(VOCABULARY.mood, moodCount);
  const energy = pickRandom(VOCABULARY.energy, energyCount);
  const texture = pickRandom(VOCABULARY.texture, textureCount);

  // Pick 1 random instrument
  const instrument = pickOne(VOCABULARY.instrument);

  // Get instrument-specific roles and descriptors
  const instrumentKey = instrument as keyof typeof VOCABULARY.instrument_roles;
  const rolesList = VOCABULARY.instrument_roles[instrumentKey] || ['lead'];
  const descriptorsList = VOCABULARY.instrument_descriptors[instrumentKey] || ['processed'];

  const role = pickOne(rolesList);

  // Pick 1 random descriptor for each instrument attribute
  const descriptor = pickOne(descriptorsList);

  // Randomly include vocals (50% chance)
  const includeVocals = Math.random() > 0.5;
  const vocals = includeVocals ? {
    presence: pickOne(VOCABULARY.vocals_presence),
    gender: pickOne(VOCABULARY.vocals_gender),
    style: pickOne(VOCABULARY.vocals_style),
    descriptors: [pickOne(descriptorsList)] // Reusing instrument descriptors for simplicity
  } : undefined;

  // Random BPM between 100 and 150
  const bpm = randomInt(100, 150);

  // Construct the wizard data object
  return {
    genre: {
      primary: primaryGenre,
      ...(subgenre && { subgenres: [subgenre] })
    },
    mood,
    energy,
    texture,
    instrumentation: [
      {
        instrument,
        role,
        descriptors: [descriptor]
      }
    ],
    ...(vocals && { vocals }),
    bpm
  };
}

/**
 * Generates multiple random descriptions
 */
export function generateRandomDescriptions(count: number = 10) {
  return Array.from({ length: count }, () => generateRandomDescription());
}
