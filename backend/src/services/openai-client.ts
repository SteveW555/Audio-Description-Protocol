import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
import type { WizardData, ClassifiedError, ErrorClassification } from '../types/index.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const encoder = encoding_for_model('gpt-4');

/**
 * Classifies errors as retryable or terminal
 */
function classifyError(error: any): ClassifiedError {
  const statusCode = error.status || error.statusCode;

  // Retryable errors: 429, 500, 502, 503, network timeout
  const retryableCodes = [429, 500, 502, 503];
  const isRetryable =
    retryableCodes.includes(statusCode) ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT' ||
    error.message?.includes('timeout');

  return {
    classification: isRetryable ? 'retryable' : 'terminal',
    originalError: error,
    statusCode,
    message: error.message || 'Unknown error',
  };
}

/**
 * Builds prompt template from wizard data
 * Excludes key, scale, chords per FR-002
 */
function buildPrompt(wizardData: WizardData): string {
  const parts: string[] = [];

  if (wizardData.genre?.primary) {
    parts.push(`Genre: ${wizardData.genre.primary}`);
    if (wizardData.genre.secondary?.length) {
      parts.push(`(${wizardData.genre.secondary.join(', ')})`);
    }
  }

  if (wizardData.mood?.length) {
    parts.push(`Mood: ${wizardData.mood.join(', ')}`);
  }

  if (wizardData.energy?.length) {
    parts.push(`Energy: ${wizardData.energy.join(', ')}`);
  }

  if (wizardData.texture?.length) {
    parts.push(`Texture: ${wizardData.texture.join(', ')}`);
  }

  if (wizardData.instrumentation?.length) {
    const instruments = wizardData.instrumentation
      .map(i => `${i.instrument} (${i.role})`)
      .join(', ');
    parts.push(`Instruments: ${instruments}`);
  }

  if (wizardData.vocals?.presence && wizardData.vocals.presence !== 'none') {
    parts.push(`Vocals: ${wizardData.vocals.presence}${wizardData.vocals.style ? ` ${wizardData.vocals.style}` : ''}`);
  }

  if (wizardData.bpm) {
    parts.push(`Tempo: ${wizardData.bpm} BPM`);
  }

  const musicDescription = parts.join('. ');

  return `Generate a concise 10-30 word natural language description for this music: ${musicDescription}. Focus on mood, energy, instrumentation, and overall character.`;
}

/**
 * Counts tokens in prompt using tiktoken
 */
function countTokens(text: string): number {
  const tokens = encoder.encode(text);
  return tokens.length;
}

/**
 * Generates natural language phrase using GPT-5 Nano
 * Implements retry logic with 2s delay for retryable errors
 */
export async function generatePhrase(
  wizardData: WizardData
): Promise<{ phrase: string; tokensUsed: number; costUSD: number }> {
  const prompt = buildPrompt(wizardData);
  const promptTokens = countTokens(prompt);

  // Enforce 900 token limit per FR-018
  if (promptTokens > 900) {
    throw new Error(`Token limit exceeded: ${promptTokens} > 900`);
  }

  let lastError: ClassifiedError | null = null;

  // Attempt with single retry (2s delay) per FR-011
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-5-nano', // Per FR-003
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 50, // Ensures <30 words
        temperature: 0.7,
      });

      const phrase = completion.choices[0]?.message?.content?.trim() || '';
      const completionTokens = completion.usage?.completion_tokens || 0;
      const totalTokens = completion.usage?.total_tokens || 0;

      // Estimate cost (placeholder - adjust for actual GPT-5 Nano pricing)
      const costUSD = (totalTokens / 1000) * 0.0001;

      return {
        phrase,
        tokensUsed: totalTokens,
        costUSD,
      };
    } catch (error: any) {
      const classified = classifyError(error);
      lastError = classified;

      if (classified.classification === 'terminal') {
        throw new Error(`Terminal error: ${classified.message}`);
      }

      // Retry logic: wait 2s before second attempt
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // Both attempts failed
  throw new Error(`Phrase generation failed after retry: ${lastError?.message}`);
}

/**
 * Exports for testing
 */
export const _internal = {
  buildPrompt,
  countTokens,
  classifyError,
};
