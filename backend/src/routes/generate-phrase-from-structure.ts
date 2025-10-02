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
  try {
    const { wizardData, sessionId, requestId } = req.body as GeneratePhraseFromStructureRequest;

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

    // Generate phrase from structure - time just the model execution
    const startTime = performance.now();
    const result = await generatePhraseFromStructure(wizardData);
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

    if (error.message?.includes('Token limit exceeded')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message?.includes('Terminal error')) {
      return res.status(500).json({ error: 'AI service error', details: error.message });
    }

    return res.status(500).json({ error: 'Failed to generate phrase from structure' });
  }
});

export default router;
