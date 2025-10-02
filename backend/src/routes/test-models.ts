import { Router, Request, Response } from 'express';
import { test_model_times_generate_casual } from '../utils/test-model-times.js';

const router = Router();

/**
 * POST /api/test-models
 * Runs model timing tests and returns results
 */
router.post('/test-models', async (req: Request, res: Response) => {
  try {
    const { runsPerModel = 10 } = req.body;

    console.log(`🧪 Starting model timing test (${runsPerModel} runs per model)...`);

    // Run the test
    const results = await test_model_times_generate_casual(runsPerModel);

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Error running model test:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to run model test',
      message: error.message,
    });
  }
});

export default router;
