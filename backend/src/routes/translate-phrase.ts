import { Router, Request, Response } from 'express';
import { translatePhrase } from '../ai/phrase-translator.js';

const router = Router();

/**
 * POST /api/translate-phrase
 * Translates a casual phrase to standardized vocabulary
 */
router.post('/translate-phrase', async (req: Request, res: Response) => {
  try {
    const { casualPhrase } = req.body;

    if (!casualPhrase || typeof casualPhrase !== 'string') {
      return res.status(400).json({ error: 'casualPhrase is required and must be a string' });
    }

    if (casualPhrase.trim().length === 0) {
      return res.status(400).json({ error: 'casualPhrase cannot be empty' });
    }

    // Translate the phrase
    const result = await translatePhrase(casualPhrase);

    return res.status(200).json({
      standardizedPhrase: result.standardizedPhrase,
      tokensUsed: result.tokensUsed,
      costUSD: result.costUSD,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error translating phrase:', error);

    return res.status(500).json({
      error: 'Failed to translate phrase',
      message: error.message,
    });
  }
});

export default router;
