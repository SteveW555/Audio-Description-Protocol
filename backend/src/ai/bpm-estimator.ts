import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-load Groq client to ensure env vars are loaded
let groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

// Cache the BPM estimator prompt (load once, reuse forever)
let cachedPrompt: string | null = null;

function loadBpmEstimatorPrompt(): string {
  if (!cachedPrompt) {
    const promptPath = path.join(__dirname, '../../../prompts/bpm-estimator-prompt.md');
    cachedPrompt = fs.readFileSync(promptPath, 'utf-8').trim();
  }
  return cachedPrompt;
}

export interface BpmEstimationInput {
  inputPhrase: string;
  standardizedPhrase: string;
  genre?: string;
  subgenres?: string[];
  mood?: string[];
  energy?: string[];
  texture?: string[];
}

export interface BpmEstimationResult {
  bpm: number;
  tokensUsed: number;
  costUSD: number;
}

/**
 * Estimates BPM using Groq's fast inference with the BPM estimator prompt
 */
export async function estimateBpm(input: BpmEstimationInput): Promise<BpmEstimationResult> {
  const systemPrompt = loadBpmEstimatorPrompt();
  const client = getGroqClient();

  // Build user message with structured context
  const userMessage = `
Input Phrase: "${input.inputPhrase}"

Standardized Phrase: "${input.standardizedPhrase}"

Structured Terms:
- Genre: ${input.genre || 'None'}
- Subgenres: ${input.subgenres?.join(', ') || 'None'}
- Mood: ${input.mood?.join(', ') || 'None'}
- Energy: ${input.energy?.join(', ') || 'None'}
- Texture: ${input.texture?.join(', ') || 'None'}

Provide only the BPM as a single integer.
`.trim();

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile', // Fast Groq model
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3, // Lower for more deterministic BPM estimates
    max_tokens: 10,   // Only need a number
  });

  const bpmString = response.choices[0].message.content?.trim() || '';
  const bpm = parseInt(bpmString, 10);

  if (isNaN(bpm) || bpm < 40 || bpm > 250) {
    throw new Error(`Invalid BPM returned: "${bpmString}". Expected integer between 40-250.`);
  }

  const tokensUsed = response.usage?.total_tokens || 0;

  // Calculate cost (Groq llama-3.3-70b-versatile pricing: $0.59/1M input tokens, $0.79/1M output tokens)
  const inputTokens = response.usage?.prompt_tokens || 0;
  const outputTokens = response.usage?.completion_tokens || 0;
  const costUSD = (inputTokens * 0.59 + outputTokens * 0.79) / 1_000_000;

  return {
    bpm,
    tokensUsed,
    costUSD,
  };
}
