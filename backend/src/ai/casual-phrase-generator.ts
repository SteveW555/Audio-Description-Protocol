import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { WizardData } from '../types/index.js';

let openai: OpenAI | null = null;
let encoder: ReturnType<typeof encoding_for_model> | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function getEncoder() {
  if (!encoder) {
    encoder = encoding_for_model('gpt-5-nano');
  }
  return encoder;
}

/**
 * Loads the casual phrase generator system prompt from markdown file
 */
function loadCasualPromptFile(): string {
  const promptPath = join(process.cwd(), '..', 'prompts', 'casual-phrase-generator-prompt.md');
  return readFileSync(promptPath, 'utf-8');
}

/**
 * Builds a music data string from wizard data to append to the prompt
 */
function buildMusicDataString(wizardData: WizardData): string {
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

  return parts.join('. ');
}

/**
 * Counts tokens in prompt using tiktoken
 */
function countTokens(text: string): number {
  const tokens = getEncoder().encode(text);
  return tokens.length;
}

/**
 * Generates casual phrase (informal/colloquial description) using GPT-5 Nano
 * Implements retry logic with 2s delay for retryable errors
 *
 * @param wizardData - Structured wizard data following ADP vocabulary
 * @returns Casual phrase with token usage and cost metrics
 */
export async function generateCasualPhrase(
  wizardData: WizardData
): Promise<{ phrase: string; tokensUsed: number; costUSD: number }> {
  const systemPrompt = loadCasualPromptFile();
  const musicData = buildMusicDataString(wizardData);
  const prompt = `${systemPrompt}\n\nMusic Data: ${musicData}`;
  const promptTokens = countTokens(prompt);

  // Enforce 900 token limit
  if (promptTokens > 900) {
    throw new Error(`Token limit exceeded: ${promptTokens} > 900`);
  }

  let lastError: any = null;

  // Attempt with single retry (2s delay)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const client = getOpenAIClient();
      console.log('🔧 Sending prompt to OpenAI (length:', prompt.length, 'chars)');
      console.log('📋 Prompt preview:', prompt.substring(0, 200) + '...');

      const completion = await client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_completion_tokens: 5000, // Need extra tokens for reasoning + output text
        // temperature defaults to 1 (only supported value for gpt-5-nano)
      });

      console.log('🤖 OpenAI raw completion:', JSON.stringify(completion, null, 2));
      let phrase = completion.choices[0]?.message?.content?.trim() || '';
      // Remove numbered list prefix if present (e.g., "1. ")
      phrase = phrase.replace(/^\d+\.\s*/, '');
      console.log('✂️ Extracted phrase after trim:', phrase);
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
      lastError = error;
      const statusCode = error.status || error.statusCode;
      const retryableCodes = [429, 500, 502, 503];
      const isRetryable = retryableCodes.includes(statusCode);

      if (!isRetryable) {
        throw new Error(`Terminal error: ${error.message}`);
      }

      // Retry logic: wait 2s before second attempt
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // Both attempts failed
  throw new Error(`Casual phrase generation failed after retry: ${lastError?.message}`);
}
