import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-load OpenAI client to ensure env vars are loaded
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// Cache the translator prompt (load once, reuse forever)
let cachedPrompt: string | null = null;

function loadTranslatorPrompt(): string {
  if (!cachedPrompt) {
    const promptPath = path.join(__dirname, '../../../prompts/phrase-translator-prompt.md');
    cachedPrompt = fs.readFileSync(promptPath, 'utf-8').trim();
  }
  return cachedPrompt;
}

export interface TranslationResult {
  standardizedPhrase: string;
  tokensUsed: number;
  costUSD: number;
}

/**
 * Translates a casual phrase to standardized vocabulary using OpenAI
 */
export async function translatePhrase(casualPhrase: string): Promise<TranslationResult> {
  const systemPrompt = loadTranslatorPrompt();
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: casualPhrase },
    ],
    temperature: 0.5,  // Lower = faster, more deterministic
    max_tokens: 100,   // Limit output length for speed
  });

  const standardizedPhrase = response.choices[0].message.content?.trim().replace(/^"|"$/g, '') || '';
  const tokensUsed = response.usage?.total_tokens || 0;

  // Calculate cost (gpt-4o-mini pricing: $0.15/1M input tokens, $0.60/1M output tokens)
  const inputTokens = response.usage?.prompt_tokens || 0;
  const outputTokens = response.usage?.completion_tokens || 0;
  const costUSD = (inputTokens * 0.15 + outputTokens * 0.60) / 1_000_000;

  return {
    standardizedPhrase,
    tokensUsed,
    costUSD,
  };
}
