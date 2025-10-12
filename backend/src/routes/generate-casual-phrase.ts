import { Router, Request, Response } from 'express';
import { generateCasualPhraseGroq } from '../ai/groq-client.js';
import type { WizardData } from '../types/index.js';

const router = Router();

interface GenerateCasualPhraseRequest {
  wizardData: WizardData;
  sessionId: string;
  requestId: string;
  poeticLevel?: number;
}

/**
 * POST /api/generate-casual-phrase
 * Generates a casual phrase (informal/colloquial description) from structured wizard data
 */
router.post('/generate-casual-phrase', async (req: Request, res: Response) => {
  try {
    const { wizardData, sessionId, requestId, poeticLevel = 50 } = req.body as GenerateCasualPhraseRequest;

    // Validate required fields
    if (!wizardData) {
      return res.status(400).json({ error: 'wizardData is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'requestId is required' });
    }

    // No validation required - allow any combination of attributes

    // Generate casual phrase - time just the model execution
    const startTime = performance.now();
    const result = await generateCasualPhraseGroq(wizardData, undefined, poeticLevel);
    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    console.log('🎵 Generated casual phrase:', result.phrase);

    // Return response
    const response = {
      casualPhrase: result.phrase,
      confidence: 0.85, // Casual phrases are more creative, slightly lower confidence
      tokensUsed: result.tokensUsed,
      costUSD: result.costUSD,
      provider: result.provider,
      model: result.model,
      executionTimeMs,
      requestId,
      timestamp: new Date().toISOString(),
    };
    console.log('📤 Sending response:', response);
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error generating casual phrase:', error);

    // Check for missing API key
    if (error.message?.includes('GROQ_API_KEY environment variable is not set')) {
      return res.status(500).json({
        error: 'Missing API Key',
        details: 'GROQ_API_KEY is not configured. Please add it to your .env file.'
      });
    }

    // Check for authentication errors
    if (error.status === 401 || error.message?.toLowerCase().includes('unauthorized') || error.message?.toLowerCase().includes('invalid api key')) {
      return res.status(401).json({
        error: 'Invalid API Key',
        details: 'The GROQ_API_KEY is invalid or expired. Please check your .env file.'
      });
    }

    // Token limit errors
    if (error.message?.includes('Token limit exceeded')) {
      return res.status(400).json({
        error: 'Token Limit Exceeded',
        details: error.message
      });
    }

    // Rate limit errors
    if (error.status === 429 || error.message?.toLowerCase().includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        details: 'Too many requests to AI service. Please try again in a moment.'
      });
    }

    // Network/connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message?.toLowerCase().includes('network')) {
      return res.status(503).json({
        error: 'Connection Error',
        details: 'Unable to connect to AI service. Please check your internet connection.'
      });
    }

    // Terminal errors (non-retryable)
    if (error.message?.includes('Terminal error')) {
      return res.status(500).json({
        error: 'AI Service Error',
        details: error.message.replace('Terminal error: ', '')
      });
    }

    // Generic fallback
    return res.status(500).json({
      error: 'Failed to Generate Casual Phrase',
      details: error.message || 'An unexpected error occurred while generating the casual phrase.'
    });
  }
});

export default router;
