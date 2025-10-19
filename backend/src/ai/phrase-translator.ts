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
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    console.log('[phrase-translator] Initializing OpenAI client');
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

    try {
      console.log('[phrase-translator] Loading prompt from:', promptPath);
      console.log('[phrase-translator] __dirname:', __dirname);
      console.log('[phrase-translator] Resolved path:', path.resolve(promptPath));

      // Check if file exists
      if (!fs.existsSync(promptPath)) {
        throw new Error(`Prompt file not found at: ${promptPath}`);
      }

      cachedPrompt = fs.readFileSync(promptPath, 'utf-8').trim();
      console.log('[phrase-translator] ✅ Prompt loaded successfully, length:', cachedPrompt.length);
    } catch (error: any) {
      console.error('[phrase-translator] ❌ Error loading prompt file:');
      console.error('[phrase-translator] Attempted path:', promptPath);
      console.error('[phrase-translator] Error:', error.message);
      console.error('[phrase-translator] Stack:', error.stack);
      throw new Error(`Failed to load translator prompt: ${error.message}`);
    }
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
