import { Router, Request, Response } from 'express';
import { generateCasualPhrase } from '../services/casual-phrase-generator.js';
import type { WizardData } from '../types/index.js';

const router = Router();

interface GenerateCasualPhraseRequest {
  wizardData: WizardData;
  sessionId: string;
  requestId: string;
}

/**
 * POST /api/generate-casual-phrase
 * Generates a casual phrase (informal/colloquial description) from structured wizard data
 */
router.post('/generate-casual-phrase', async (req: Request, res: Response) => {
  try {
    const { wizardData, sessionId, requestId } = req.body as GenerateCasualPhraseRequest;

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

    // Generate casual phrase
    const result = await generateCasualPhrase(wizardData);
    console.log('🎵 Generated casual phrase:', result.phrase);

    // Return response
    const response = {
      casualPhrase: result.phrase,
      confidence: 0.85, // Casual phrases are more creative, slightly lower confidence
      tokensUsed: result.tokensUsed,
      costUSD: result.costUSD,
      requestId,
      timestamp: new Date().toISOString(),
    };
    console.log('📤 Sending response:', response);
    return res.status(200).json(response);
  } catch (error: any) {
    console.error('Error generating casual phrase:', error);

    if (error.message?.includes('Token limit exceeded')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message?.includes('Terminal error')) {
      return res.status(500).json({ error: 'AI service error', details: error.message });
    }

    return res.status(500).json({ error: 'Failed to generate casual phrase' });
  }
});

export default router;
