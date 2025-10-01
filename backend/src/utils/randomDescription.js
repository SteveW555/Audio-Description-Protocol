/**
 * Random Description Generator
 *
 * Generates randomized musical descriptions for testing the AI phrase generation feature.
 * Imports vocabulary from single source of truth via backend/src/constants/vocabulary.ts
 */
import { VOCABULARY } from '../constants/vocabulary';
import { TERMS_BY_FREQUENCY } from '../../../wizard/src/constants/taxonomy';
/**
 * Returns a weighted random count for MET categories
 * 60% chance of 2, 30% chance of 1, 10% chance of 3
 */
function getWeightedMETCount() {
    const rand = Math.random();
    if (rand < 0.6)
        return 2;
    if (rand < 0.9)
        return 1;
    return 3;
}
/**
 * Picks random terms weighted by popularity (ubiquitous > frequent > infrequent > rare)
 * @param category The MET category ('mood', 'energy', or 'texture')
 * @param count Number of terms to pick
 * @returns Array of selected terms
 */
function pickWeightedTerms(category, count) {
    const termsByFreq = TERMS_BY_FREQUENCY[category];
    // Create weighted pool: ubiquitous (weight 4), frequent (3), infrequent (2), rare (1)
    const weightedPool = [
        ...termsByFreq.ubiquitous.flatMap(t => Array(4).fill(t)),
        ...termsByFreq.frequent.flatMap(t => Array(3).fill(t)),
        ...termsByFreq.infrequent.flatMap(t => Array(2).fill(t)),
        ...termsByFreq.rare,
    ];
    // Shuffle and pick unique terms
    const shuffled = [...weightedPool].sort(() => Math.random() - 0.5);
    const selected = new Set();
    for (const term of shuffled) {
        selected.add(term);
        if (selected.size === count)
            break;
    }
    return Array.from(selected);
}
/**
 * Picks random items from an array
 */
function pickRandom(arr, count = 1) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
/**
 * Picks a single random item from an array
 */
function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
/**
 * Returns random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * Generates random instrument configuration with role and descriptors
 *
 * @returns Object containing instrument, role, and descriptors
 */
export function generateRandomInstrument() {
    // Pick 1 random instrument
    const instrument = pickOne(VOCABULARY.instrument);
    // Get instrument-specific roles and descriptors
    const instrumentKey = instrument;
    const rolesList = VOCABULARY.instrument_roles[instrumentKey] || ['lead'];
    const descriptorsList = VOCABULARY.instrument_descriptors[instrumentKey] || ['processed'];
    const role = pickOne(rolesList);
    const descriptor = pickOne(descriptorsList);
    return {
        instrument,
        role,
        descriptors: [descriptor],
    };
}
/**
 * Converts primary genre name to its lowercase secondary_genres key
 * @param primaryGenre The capitalized primary genre name
 * @returns The lowercase key for secondary_genres lookup
 */
function genreToKey(primaryGenre) {
    const mapping = {
        'Electronic': 'electronic',
        'Rock': 'rock',
        'Pop': 'pop',
        'Hip-Hop': 'hip_hop',
        'R&B / Soul': 'rnb_soul',
        'Jazz': 'jazz',
        'Blues': 'blues',
        'Country': 'country',
        'Classical': 'classical',
        'Folk': 'folk',
        'Latin': 'latin',
        'Reggae': 'reggae',
        'World': 'world',
        'Soundtrack': 'soundtrack',
        'Ambient': 'ambient',
        'Spoken Word': 'spoken_word',
        'Sound Effect': 'sound_effect',
    };
    return mapping[primaryGenre] || primaryGenre.toLowerCase();
}
/**
 * Generates random genre with primary and optional subgenres
 *
 * @returns Object containing primary genre and subgenres array
 */
export function generateRandomGenre() {
    // Pick primary genre
    const primaryGenre = pickOne(VOCABULARY.primary_genre);
    // Convert primary genre to lowercase key for subgenre lookup
    const genreKey = genreToKey(primaryGenre);
    // Pick 1-3 applicable subgenres for the primary genre
    const subgenreList = VOCABULARY.subgenres[genreKey] || [];
    const subgenres = [];
    if (subgenreList.length > 0) {
        const count = Math.min(randomInt(1, 3), subgenreList.length);
        const shuffled = [...subgenreList].sort(() => Math.random() - 0.5);
        subgenres.push(...shuffled.slice(0, count));
    }
    return {
        primary: primaryGenre,
        subgenres: subgenres.length > 0 ? subgenres : ['tbc'],
    };
}
/**
 * Generates random vocals configuration with presence, gender, style, and descriptors
 * Returns undefined 50% of the time to simulate optional vocals
 *
 * @returns Vocals object or undefined
 */
export function generateRandomVocals() {
    // 50% chance of including vocals
    if (Math.random() <= 0.5) {
        return undefined;
    }
    // Get vocals descriptors (or use general descriptors as fallback)
    const vocalsDescriptors = VOCABULARY.instrument_descriptors['vocals'] || ['processed'];
    return {
        presence: pickOne(VOCABULARY.vocals_presence),
        gender: pickOne(VOCABULARY.vocals_gender),
        style: pickOne(VOCABULARY.vocals_style),
        descriptors: [pickOne(vocalsDescriptors)],
    };
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
    const subgenreList = VOCABULARY.subgenres[primaryGenre] || [];
    const subgenre = subgenreList.length > 0 ? pickOne(subgenreList) : undefined;
    // Generate random MET terms with weighted distribution
    const { mood, energy, texture } = generateRandomMET();
    // Generate random instrument
    const instrumentEntry = generateRandomInstrument();
    // Generate random vocals (50% chance of inclusion)
    const vocals = generateRandomVocals();
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
        instrumentation: [instrumentEntry],
        ...(vocals && { vocals }),
        bpm
    };
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
        }
        else if (energyCount >= textureCount && energyCount > 1) {
            energyCount--;
        }
        else if (textureCount > 1) {
            textureCount--;
        }
        else {
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
/**
 * Generates multiple random descriptions
 */
export function generateRandomDescriptions(count = 10) {
    return Array.from({ length: count }, () => generateRandomDescription());
}
//# sourceMappingURL=randomDescription.js.map