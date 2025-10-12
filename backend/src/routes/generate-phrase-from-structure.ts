import { Router, Request, Response } from 'express';
import { generatePhraseFromStructure } from '../ai/groq-client.js';
import type { WizardData } from '../types/index.js';

const router = Router();

interface GeneratePhraseFromStructureRequest {
  wizardData: WizardData;
  sessionId: string;
  requestId: string;
}

/**
 * POST /api/generate-phrase-from-structure
 * Generates a concise, human-readable phrase from structured wizard data
 * Uses the phrase-prompt.md to transform structured tags into a professional description
 */
router.post('/generate-phrase-from-structure', async (req: Request, res: Response) => {
  console.log('🎯 Route handler entered for /generate-phrase-from-structure');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { wizardData, sessionId, requestId } = req.body as GeneratePhraseFromStructureRequest;

    console.log('✅ Parsed request data:', { sessionId, requestId, hasWizardData: !!wizardData });

    // Validate required fields
    if (!wizardData) {
      console.log('❌ Missing wizardData');
      return res.status(400).json({ error: 'wizardData is required' });
    }

    if (!sessionId) {
      console.log('❌ Missing sessionId');
      return res.status(400).json({ error: 'sessionId is required' });
    }

    if (!requestId) {
      console.log('❌ Missing requestId');
      return res.status(400).json({ error: 'requestId is required' });
    }

    console.log('✅ All required fields present, calling generatePhraseFromStructure');

    // No validation required - allow any combination of attributes

    // Generate phrase from structure - time just the model execution
    const startTime = performance.now();
    console.log('🚀 About to call generatePhraseFromStructure');
    const result = await generatePhraseFromStructure(wizardData);
    console.log('✅ generatePhraseFromStructure returned successfully');
    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    console.log('🎵 Generated phrase from structure:', result.phrase);

    // Return response
    const response = {
      phrase: result.phrase,
      confidence: 0.9, // High confidence for structured transformation
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
    console.error('Error generating phrase from structure:', error);

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
      error: 'Failed to Generate Phrase',
      details: error.message || 'An unexpected error occurred while generating the phrase from structure.'
    });
  }
});

export default router;
