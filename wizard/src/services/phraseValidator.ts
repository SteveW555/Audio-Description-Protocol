import type { ValidationResult } from '../types/wizard';

/**
 * Simple profanity filter (basic implementation)
 * In production, use a more robust library
 */
const INAPPROPRIATE_WORDS = [
  // Add inappropriate words here
  'badword1', 'badword2', // Placeholder
];

/**
 * Validates AI-generated phrase for word count and inappropriate content
 * Per FR-014: 10-30 words, no inappropriate content
 */
export function validatePhrase(phrase: string | null | undefined): ValidationResult {
  const errors: string[] = [];

  // Handle empty/null input
  if (!phrase || phrase.trim().length === 0) {
    return {
      isValid: false,
      errors: ['Empty phrase'],
      wordCount: 0,
      hasInappropriateContent: false,
    };
  }

  // Trim and count words
  const trimmedPhrase = phrase.trim();
  const words = trimmedPhrase.split(/\s+/);
  const wordCount = words.length;

  // Check word count (10-30 per FR-014)
  if (wordCount < 10) {
    errors.push(`Too few words: ${wordCount} (minimum 10)`);
  }

  if (wordCount > 30) {
    errors.push(`Too many words: ${wordCount} (maximum 30)`);
  }

  // Check for inappropriate content
  const lowerPhrase = trimmedPhrase.toLowerCase();
  const hasInappropriateContent = INAPPROPRIATE_WORDS.some(word =>
    lowerPhrase.includes(word.toLowerCase())
  );

  if (hasInappropriateContent) {
    errors.push('Phrase contains inappropriate content');
  }

  return {
    isValid: errors.length === 0,
    errors,
    wordCount,
    hasInappropriateContent,
  };
}
