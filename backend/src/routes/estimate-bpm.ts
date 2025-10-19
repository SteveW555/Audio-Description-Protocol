import { Router, Request, Response } from 'express';
import { estimateBpm, BpmEstimationInput } from '../ai/bpm-estimator.js';

const router = Router();

/**
 * POST /api/estimate-bpm
 * Estimates BPM based on phrase and structured terms
 */
router.post('/estimate-bpm', async (req: Request, res: Response) => {
  try {
    const { inputPhrase, standardizedPhrase, genre, subgenres, mood, energy, texture } = req.body;

    if (!inputPhrase || typeof inputPhrase !== 'string') {
      return res.status(400).json({ error: 'inputPhrase is required and must be a string' });
    }

    if (!standardizedPhrase || typeof standardizedPhrase !== 'string') {
      return res.status(400).json({ error: 'standardizedPhrase is required and must be a string' });
    }

    const input: BpmEstimationInput = {
      inputPhrase,
      standardizedPhrase,
      genre,
      subgenres: Array.isArray(subgenres) ? subgenres : [],
      mood: Array.isArray(mood) ? mood : [],
      energy: Array.isArray(energy) ? energy : [],
      texture: Array.isArray(texture) ? texture : [],
    };

    // Estimate BPM
    const result = await estimateBpm(input);

    return res.status(200).json({
      bpm: result.bpm,
      tokensUsed: result.tokensUsed,
      costUSD: result.costUSD,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error estimating BPM:', error);

    return res.status(500).json({
      error: 'Failed to estimate BPM',
      message: error.message,
    });
  }
});

export default router;
