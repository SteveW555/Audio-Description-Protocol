import type { UsageData } from '../types/usage';

/**
 * Button-specific data extractors
 * Each extractor knows how to extract relevant data from a button's execution context
 */

/**
 * Extract data for "Randomize All Above" button
 * No input phrase, no response phrase, result is wizard data snapshot
 */
export function extractRandomizeAllData(wizardData: any): UsageData {
  return {
    buttonName: 'randomize-all',
    inputPhrase: null,
    responsePhrase: null,
    resultJson: {
      genre: wizardData?.semantic_description?.genre?.primary || null,
      subgenres: wizardData?.semantic_description?.genre?.primary_subgenres || [],
      mood: wizardData?.semantic_description?.attributes?.mood || [],
      energy: wizardData?.semantic_description?.attributes?.energy || [],
      texture: wizardData?.semantic_description?.attributes?.texture || [],
      instruments: wizardData?.semantic_description?.instrumentation || [],
      vocals: wizardData?.semantic_description?.vocals || null,
      bpm: wizardData?.theory?.bpm || null,
      key: wizardData?.theory?.key || null,
      scale: wizardData?.theory?.scale || null
    }
  };
}

/**
 * Extract data for "Test All Models" button
 * No phrases, result is model test results
 */
export function extractModelTestData(results: any): UsageData {
  return {
    buttonName: 'test-all-models',
    inputPhrase: null,
    responsePhrase: null,
    resultJson: results
  };
}

/**
 * Extract data for "Generate Random Casual Phrase" button
 * No input, response is generated casual phrase
 */
export function extractCasualPhraseData(casualPhrase: string, poeticLevel: number): UsageData {
  return {
    buttonName: 'generate-casual-phrase',
    inputPhrase: null,
    responsePhrase: casualPhrase,
    resultJson: {
      casualPhrase,
      poeticLevel
    }
  };
}

/**
 * Extract data for "Translate" button (phrase translation)
 * Input is casual phrase, response is standardized phrase
 */
export function extractTranslatePhraseData(
  inputPhrase: string,
  standardizedPhrase: string,
  wizardData?: any
): UsageData {
  return {
    buttonName: 'translate-phrase',
    inputPhrase,
    responsePhrase: standardizedPhrase,
    resultJson: {
      casualPhrase: inputPhrase,
      standardizedPhrase,
      extractedTerms: wizardData ? {
        genre: wizardData?.semantic_description?.genre?.primary || null,
        mood: wizardData?.semantic_description?.attributes?.mood || [],
        energy: wizardData?.semantic_description?.attributes?.energy || [],
        texture: wizardData?.semantic_description?.attributes?.texture || [],
        instruments: wizardData?.semantic_description?.instrumentation || []
      } : null
    }
  };
}

/**
 * Extract data for "Generate Random Standardized Phrase" button
 * No input, response is generated standardized phrase
 */
export function extractStandardizedPhraseData(
  standardizedPhrase: string,
  wizardData: any
): UsageData {
  return {
    buttonName: 'generate-standardized-phrase',
    inputPhrase: null,
    responsePhrase: standardizedPhrase,
    resultJson: {
      standardizedPhrase,
      sourceData: {
        genre: wizardData?.semantic_description?.genre?.primary || null,
        mood: wizardData?.semantic_description?.attributes?.mood || [],
        energy: wizardData?.semantic_description?.attributes?.energy || [],
        instruments: wizardData?.semantic_description?.instrumentation || []
      }
    }
  };
}

/**
 * Extract data for "Save JSON" button
 * No phrases, result is saved JSON structure
 */
export function extractSaveJsonData(wizardData: any, filename: string): UsageData {
  return {
    buttonName: 'save-json',
    inputPhrase: null,
    responsePhrase: null,
    resultJson: {
      filename,
      dataSnapshot: wizardData
    }
  };
}

/**
 * Extract data for wizard completion (when user reaches final step)
 * No input/response phrases, result is complete wizard data
 */
export function extractWizardCompletionData(wizardData: any): UsageData {
  return {
    buttonName: 'wizard-completed',
    inputPhrase: null,
    responsePhrase: null,
    resultJson: wizardData
  };
}
