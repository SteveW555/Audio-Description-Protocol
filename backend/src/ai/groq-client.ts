import Groq from 'groq-sdk';
import { encoding_for_model } from 'tiktoken';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { WizardData } from '../types/index.js';

/**
 * Available Groq production models (fetched from API 2025-10-02)
 * @see https://api.groq.com/openai/v1/models
 */
export enum GroqModel {
  // Meta LLaMA models
  LLAMA_3_1_8B_INSTANT = 'llama-3.1-8b-instant',
  LLAMA_3_3_70B_VERSATILE = 'llama-3.3-70b-versatile',
  LLAMA_4_SCOUT_17B = 'meta-llama/llama-4-scout-17b-16e-instruct',
  LLAMA_4_MAVERICK_17B = 'meta-llama/llama-4-maverick-17b-128e-instruct',
  LLAMA_GUARD_4_12B = 'meta-llama/llama-guard-4-12b',
  LLAMA_PROMPT_GUARD_2_22M = 'meta-llama/llama-prompt-guard-2-22m',
  LLAMA_PROMPT_GUARD_2_86M = 'meta-llama/llama-prompt-guard-2-86m',

  // OpenAI models
  GPT_OSS_120B = 'openai/gpt-oss-120b',
  GPT_OSS_20B = 'openai/gpt-oss-20b',

  // Moonshot AI models
  KIMI_K2_INSTRUCT = 'moonshotai/kimi-k2-instruct',
  KIMI_K2_INSTRUCT_0905 = 'moonshotai/kimi-k2-instruct-0905',

  // Other LLMs
  QWEN3_32B = 'qwen/qwen3-32b',
  GEMMA2_9B_IT = 'gemma2-9b-it',
  DEEPSEEK_R1_DISTILL_LLAMA_70B = 'deepseek-r1-distill-llama-70b',
  ALLAM_2_7B = 'allam-2-7b',

  // Production Systems
  GROQ_COMPOUND = 'groq/compound',
  GROQ_COMPOUND_MINI = 'groq/compound-mini',

  // Audio Transcription
  WHISPER_LARGE_V3 = 'whisper-large-v3',
  WHISPER_LARGE_V3_TURBO = 'whisper-large-v3-turbo',

  // Text-to-Speech
  PLAYAI_TTS = 'playai-tts',
  PLAYAI_TTS_ARABIC = 'playai-tts-arabic',
}

/**
 * Model pricing per 1M tokens (USD)
 */
export const GROQ_PRICING: Record<GroqModel, number> = {
  // Meta LLaMA
  [GroqModel.LLAMA_3_1_8B_INSTANT]: 0.05,
  [GroqModel.LLAMA_3_3_70B_VERSATILE]: 0.59,
  [GroqModel.LLAMA_4_SCOUT_17B]: 0.3, // Estimated
  [GroqModel.LLAMA_4_MAVERICK_17B]: 0.3, // Estimated
  [GroqModel.LLAMA_GUARD_4_12B]: 0.2,
  [GroqModel.LLAMA_PROMPT_GUARD_2_22M]: 0.02, // Estimated
  [GroqModel.LLAMA_PROMPT_GUARD_2_86M]: 0.05, // Estimated

  // OpenAI
  [GroqModel.GPT_OSS_120B]: 1.0, // Estimated
  [GroqModel.GPT_OSS_20B]: 0.5, // Estimated

  // Moonshot AI
  [GroqModel.KIMI_K2_INSTRUCT]: 0.6, // Estimated
  [GroqModel.KIMI_K2_INSTRUCT_0905]: 0.6, // Estimated

  // Other LLMs
  [GroqModel.QWEN3_32B]: 0.5, // Estimated
  [GroqModel.GEMMA2_9B_IT]: 0.2,
  [GroqModel.DEEPSEEK_R1_DISTILL_LLAMA_70B]: 0.7, // Estimated
  [GroqModel.ALLAM_2_7B]: 0.1, // Estimated

  // Production Systems
  [GroqModel.GROQ_COMPOUND]: 0.59, // Estimated
  [GroqModel.GROQ_COMPOUND_MINI]: 0.05, // Estimated

  // Audio
  [GroqModel.WHISPER_LARGE_V3]: 0.111,
  [GroqModel.WHISPER_LARGE_V3_TURBO]: 0.04,

  // TTS
  [GroqModel.PLAYAI_TTS]: 0.2, // Estimated
  [GroqModel.PLAYAI_TTS_ARABIC]: 0.2, // Estimated
};

/**
 * Complete list of all available Groq models (reference)
 */
export const ALL_GROQ_MODELS: GroqModel[] = [
  // Meta LLaMA - Text Generation
  GroqModel.LLAMA_3_1_8B_INSTANT,
  GroqModel.LLAMA_3_3_70B_VERSATILE,
  GroqModel.LLAMA_4_SCOUT_17B,
  GroqModel.LLAMA_4_MAVERICK_17B,

  // Meta LLaMA - Safety/Guard
  GroqModel.LLAMA_GUARD_4_12B,
  GroqModel.LLAMA_PROMPT_GUARD_2_22M,
  GroqModel.LLAMA_PROMPT_GUARD_2_86M,

  // OpenAI - Text Generation
  GroqModel.GPT_OSS_120B,
  GroqModel.GPT_OSS_20B,

  // Moonshot AI
  GroqModel.KIMI_K2_INSTRUCT,
  GroqModel.KIMI_K2_INSTRUCT_0905,

  // Other LLMs
  GroqModel.QWEN3_32B,
  GroqModel.GEMMA2_9B_IT,
  GroqModel.DEEPSEEK_R1_DISTILL_LLAMA_70B,
  GroqModel.ALLAM_2_7B,

  // Production Systems
  GroqModel.GROQ_COMPOUND,
  GroqModel.GROQ_COMPOUND_MINI,

  // Audio Transcription
  GroqModel.WHISPER_LARGE_V3,
  GroqModel.WHISPER_LARGE_V3_TURBO,

  // Text-to-Speech
  GroqModel.PLAYAI_TTS,
  GroqModel.PLAYAI_TTS_ARABIC,
];

/**
 * Array of language models suitable for casual phrase generation
 * Excludes audio, TTS, safety/guard models, and compound system models
 */
export const TEXT_GENERATION_MODELS: GroqModel[] = [
  // Meta LLaMA
  GroqModel.LLAMA_3_1_8B_INSTANT,
  GroqModel.LLAMA_3_3_70B_VERSATILE,
  GroqModel.LLAMA_4_SCOUT_17B,
  GroqModel.LLAMA_4_MAVERICK_17B,

  // OpenAI
  GroqModel.GPT_OSS_20B,

  // Other LLMs
  GroqModel.GEMMA2_9B_IT,
  GroqModel.ALLAM_2_7B,
];

/**
 * Selects a random model from the text generation models array
 */
function getRandomModel(): GroqModel {
  const randomIndex = Math.floor(Math.random() * TEXT_GENERATION_MODELS.length);
  return TEXT_GENERATION_MODELS[randomIndex];
}

let groq: Groq | null = null;
let encoder: ReturnType<typeof encoding_for_model> | null = null;

function getGroqClient(): Groq {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

function getEncoder() {
  if (!encoder) {
    // Using gpt-5-nano encoder as approximation for token counting
    encoder = encoding_for_model('gpt-5-nano');
  }
  return encoder;
}

/**
 * Loads the casual phrase generator system prompt from markdown file
 * and appends poetic/factual instruction based on poeticLevel
 *
 * @param poeticLevel - 1 (very poetic) to 100 (very factual)
 */
function loadCasualPromptFile(poeticLevel: number = 50): string {
  const promptPath = join(process.cwd(), '..', 'prompts', 'casual-phrase-generator-prompt.md');
  const basePrompt = readFileSync(promptPath, 'utf-8');

  // Generate style instruction based on poeticLevel
  let styleInstruction = '';

  if (poeticLevel <= 20) {
    // Very poetic (1-20)
    styleInstruction = '\n\n**IMPORTANT STYLE INSTRUCTION:** Be EXTREMELY poetic, flowery, and metaphorical. Use vivid imagery, creative comparisons, and evocative language. Prioritize emotional impact and artistic expression over technical accuracy. Paint a picture with words, but still make it clearly about music, with at least 1 musical term';
  } else if (poeticLevel <= 40) {
    // Moderately poetic (21-40)
    styleInstruction = '\n\n**IMPORTANT STYLE INSTRUCTION:** Be quite poetic and descriptive. Use metaphors, imagery, and colorful language. Balance artistic expression with some musical references, with at least 1 musical term.';
  } else if (poeticLevel <= 60) {
    // Balanced (41-60)
    styleInstruction = '\n\n**IMPORTANT STYLE INSTRUCTION:** Balance poetic description with musical terminology. Mix creative language with accurate music, instrument and genre references, with at least 1 musical term';
  } else if (poeticLevel <= 80) {
    // Moderately factual (61-80)
    styleInstruction = '\n\n**IMPORTANT STYLE INSTRUCTION:** Be precise and musical. Use proper instrument names, genre terms, and technical vocabulary. Include specific musical characteristics while keeping it accessible.';
  } else {
    // Very factual (81-100)
    styleInstruction = '\n\n**IMPORTANT STYLE INSTRUCTION:** Be EXTREMELY factual, precise, and technical. Use specific instrument names, exact musical terms, genre classifications, and production techniques. Prioritize accuracy and clarity. Describe using realistic musical and instrument terminology as logical and precise as possible.';
  }

  return basePrompt + styleInstruction;
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
 * Generates casual phrase (informal/colloquial description) using Groq API
 * Implements retry logic with 2s delay for retryable errors
 *
 * @param wizardData - Structured wizard data following ADP vocabulary
 * @param model - Groq model to use (defaults to random selection from TEXT_GENERATION_MODELS)
 * @param poeticLevel - Style level from 1 (very poetic) to 100 (very factual), defaults to 50
 * @returns Casual phrase with token usage and cost metrics
 */
export async function generateCasualPhraseGroq(
  wizardData: WizardData,
  model?: GroqModel,
  poeticLevel: number = 50
): Promise<{ phrase: string; tokensUsed: number; costUSD: number; provider: string; model: string }> {
  // Select random model if not specified
  const selectedModel = model ?? getRandomModel();
  const systemPrompt = loadCasualPromptFile(poeticLevel);
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
      const client = getGroqClient();
      console.log('🔧 Sending prompt to Groq (length:', prompt.length, 'chars)');
      console.log('📋 Prompt preview:', prompt.substring(0, 200) + '...');
      console.log('🎲 Randomly selected model:', selectedModel);

      const completion = await client.chat.completions.create({
        model: selectedModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 5000,
        temperature: 1.0,
      });

      console.log('🤖 Groq raw completion:', JSON.stringify(completion, null, 2));
      let phrase = completion.choices[0]?.message?.content?.trim() || '';
      // Remove numbered list prefix if present (e.g., "1. ")
      phrase = phrase.replace(/^\d+\.\s*/, '');
      console.log('✂️ Extracted phrase after trim:', phrase);
      const completionTokens = completion.usage?.completion_tokens || 0;
      const totalTokens = completion.usage?.total_tokens || 0;

      // Get pricing for the selected model
      const pricePerMillion = GROQ_PRICING[selectedModel];
      const costUSD = parseFloat(((totalTokens / 1_000_000) * pricePerMillion).toPrecision(7));

      return {
        phrase,
        tokensUsed: totalTokens,
        costUSD,
        provider: 'groq',
        model: selectedModel,
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
