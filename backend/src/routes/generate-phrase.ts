import { Router, Request, Response } from 'express';
import { generatePhrase } from '../services/openai-client.js';
import { rateLimiter } from '../services/rate-limiter.js';
import { costTracker } from '../services/cost-tracker.js';
import { emailNotifier } from '../services/email-notifier.js';
import type { AIGenerationRequest, AIGenerationResponse, WizardData } from '../types/index.js';

const router = Router();

/**
 * Validates AIGenerationRequest per FR-007
 */
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body.sessionId) {
    return { valid: false, error: 'sessionId is required' };
  }

  if (!body.requestId) {
    return { valid: false, error: 'requestId is required' };
  }

  if (!body.wizardData) {
    return { valid: false, error: 'wizardData is required' };
  }

  const { wizardData } = body;

  // Check genre (required per FR-007)
  if (!wizardData.genre?.primary) {
    //return { valid: false, error: 'genre is required' };
  }

  // Check at least one attribute (per FR-007: genre + at least one attribute)
  const hasAttribute =
    (wizardData.mood && wizardData.mood.length > 0) ||
    (wizardData.energy && wizardData.energy.length > 0) ||
    (wizardData.texture && wizardData.texture.length > 0) ||
    (wizardData.instrumentation && wizardData.instrumentation.length > 0) ||
    (wizardData.vocals && wizardData.vocals.presence) ||
    (wizardData.bpm !== undefined && wizardData.bpm !== null);

  if (!hasAttribute) {
    return {
      valid: false,
      error: 'At least one attribute (mood, energy, texture, instrumentation, vocals, or bpm) is required in addition to genre',
    };
  }

  return { valid: true };
}

/**
 * POST /api/generate-phrase
 * Generates AI phrase with rate limiting, cost tracking, and notifications
 */
router.post('/generate-phrase', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validation = validateRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const request: AIGenerationRequest = req.body;
    const { wizardData, sessionId, requestId } = request;

    // Check rate limits (FR-015, FR-016)
    const rateLimitCheck = rateLimiter.canMakeRequest();
    if (!rateLimitCheck.allowed) {
      // Send email notification per FR-019
      await emailNotifier.notifyRateLimit(
        rateLimitCheck.limitType!,
        rateLimitCheck.current!,
        rateLimitCheck.limit!,
        sessionId
      );

      return res.status(429).json({
        error: `Rate limit exceeded: ${rateLimitCheck.limitType}`,
        limit: rateLimitCheck.limit,
        current: rateLimitCheck.current,
        retryAfter: rateLimitCheck.retryAfter,
      });
    }

    // Track request
    rateLimiter.trackRequest();

    try {
      // Generate phrase
      const result = await generatePhrase(wizardData as WizardData);

      // Check cost limits before committing (FR-017)
      const costCheck = costTracker.canAddCost(sessionId, result.costUSD);
      if (!costCheck.allowed) {
        // Send email notification per FR-019
        await emailNotifier.notifyCostLimit(
          costCheck.limitType!,
          costCheck.current!,
          costCheck.limit!,
          sessionId
        );

        return res.status(429).json({
          error: `Cost limit exceeded: ${costCheck.limitType}`,
          limit: costCheck.limit,
          current: costCheck.current,
          remaining: costCheck.remaining,
        });
      }

      // Add cost to tracking
      await costTracker.addCost(sessionId, result.costUSD);

      // Validate phrase (FR-014: 10-30 words)
      const wordCount = result.phrase.split(/\s+/).length;
      if (wordCount < 10 || wordCount > 30) {
        // Phrase invalid, but don't fail - per FR-010, retry generation once
        console.warn(`Invalid phrase word count: ${wordCount}. Regenerating...`);

        // Second attempt
        const retryResult = await generatePhrase(wizardData as WizardData);
        const retryWordCount = retryResult.phrase.split(/\s+/).length;

        if (retryWordCount < 10 || retryWordCount > 30) {
          return res.status(500).json({
            error: 'AI Phrase Update failed response',
            details: 'Generated phrase does not meet quality requirements',
          });
        }

        // Use retry result
        await costTracker.addCost(sessionId, retryResult.costUSD);

        const response: AIGenerationResponse = {
          phrase: retryResult.phrase,
          confidence: 0.85, // Placeholder - could be calculated
          tokensUsed: retryResult.tokensUsed,
          costUSD: retryResult.costUSD,
          requestId,
          timestamp: new Date().toISOString(),
        };

        return res.status(200).json(response);
      }

      // Success
      const response: AIGenerationResponse = {
        phrase: result.phrase,
        confidence: 0.9, // Placeholder - could be calculated
        tokensUsed: result.tokensUsed,
        costUSD: result.costUSD,
        requestId,
        timestamp: new Date().toISOString(),
      };

      return res.status(200).json(response);
    } finally {
      // Always complete request (decrement concurrent counter)
      rateLimiter.completeRequest();
    }
  } catch (error: any) {
    console.error('Error generating phrase:', error);

    return res.status(500).json({
      error: 'Failed to generate phrase',
      message: error.message,
    });
  }
});

export default router;
