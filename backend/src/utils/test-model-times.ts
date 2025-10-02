import { generateCasualPhraseGroq, GroqModel, TEXT_GENERATION_MODELS } from '../ai/groq-client.js';
import type { WizardData } from '../types/index.js';

/**
 * Statistics for a single model's performance
 */
interface ModelStats {
  model: GroqModel;
  runs: number;
  totalTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  avgTimeMs: number;
  medianTimeMs: number;
  stdDevMs: number;
  totalTokens: number;
  totalCostUSD: number;
  avgTokens: number;
  avgCostUSD: number;
  executionTimes: number[];
  errors: number;
}

/**
 * Complete test results structure
 */
interface TestResults {
  totalRuns: number;
  modelsTest: GroqModel[];
  runsPerModel: number;
  startTime: string;
  endTime: string;
  totalDurationMs: number;
  modelStats: Record<string, ModelStats>;
  overallStats: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    avgTimeMs: number;
    minTimeMs: number;
    maxTimeMs: number;
  };
}

/**
 * Single run result
 */
interface RunResult {
  model: GroqModel;
  success: boolean;
  executionTimeMs?: number;
  tokensUsed?: number;
  costUSD?: number;
  error?: string;
}

/**
 * Calculates standard deviation
 */
function calculateStdDev(values: number[], mean: number): number {
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculates median
 */
function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Test function that sends 10 requests to each model
 * Rotates through models sequentially to avoid overwhelming any single model
 *
 * @param runsPerModel - Number of runs per model (default: 10)
 * @param wizardData - Optional wizard data to use for testing (uses default if not provided)
 */
export async function test_model_times_generate_casual(
  runsPerModel: number = 10,
  wizardData?: WizardData
): Promise<TestResults> {
  const startTimestamp = new Date();
  const models = TEXT_GENERATION_MODELS;
  const totalRuns = models.length * runsPerModel;

  console.log(`\n🧪 Starting Model Timing Test`);
  console.log(`📊 Models to test: ${models.length}`);
  console.log(`🔄 Runs per model: ${runsPerModel}`);
  console.log(`📈 Total requests: ${totalRuns}\n`);

  // Default test wizard data if not provided
  const testData: WizardData = wizardData ?? {
    genre: { primary: 'Electronic', secondary: ['Ambient'] },
    mood: ['Dark', 'Mysterious'],
    energy: ['Low'],
    texture: ['Atmospheric'],
    instrumentation: [{ instrument: 'Synthesizer', role: 'Lead' }],
    vocals: { presence: 'None' },
    bpm: 80,
  };

  // Initialize results tracking
  const runResults: RunResult[] = [];
  const modelStats: Record<string, ModelStats> = {};

  // Initialize stats for each model
  models.forEach(model => {
    modelStats[model] = {
      model,
      runs: 0,
      totalTimeMs: 0,
      minTimeMs: Infinity,
      maxTimeMs: 0,
      avgTimeMs: 0,
      medianTimeMs: 0,
      stdDevMs: 0,
      totalTokens: 0,
      totalCostUSD: 0,
      avgTokens: 0,
      avgCostUSD: 0,
      executionTimes: [],
      errors: 0,
    };
  });

  // Execute requests in rotation: model1-run1, model2-run1, model3-run1, model1-run2, etc.
  for (let runIndex = 0; runIndex < runsPerModel; runIndex++) {
    console.log(`\n--- Round ${runIndex + 1}/${runsPerModel} ---`);

    for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
      const model = models[modelIndex];
      const overallProgress = runIndex * models.length + modelIndex + 1;

      console.log(`[${overallProgress}/${totalRuns}] Testing ${model}...`);

      try {
        const startTime = performance.now();
        const result = await generateCasualPhraseGroq(testData, model);
        const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

        // Record successful run
        const runResult: RunResult = {
          model,
          success: true,
          executionTimeMs,
          tokensUsed: result.tokensUsed,
          costUSD: result.costUSD,
        };
        runResults.push(runResult);

        // Update stats
        const stats = modelStats[model];
        stats.runs++;
        stats.totalTimeMs += executionTimeMs;
        stats.minTimeMs = Math.min(stats.minTimeMs, executionTimeMs);
        stats.maxTimeMs = Math.max(stats.maxTimeMs, executionTimeMs);
        stats.executionTimes.push(executionTimeMs);
        stats.totalTokens += result.tokensUsed;
        stats.totalCostUSD += result.costUSD;

        console.log(`  ✓ ${executionTimeMs}ms, ${result.tokensUsed} tokens, $${result.costUSD.toFixed(7)}`);

        // Small delay to avoid rate limiting (100ms between requests)
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        console.log(`  ✗ Error: ${error.message}`);

        // Record failed run
        const runResult: RunResult = {
          model,
          success: false,
          error: error.message,
        };
        runResults.push(runResult);

        // Update error count
        modelStats[model].errors++;

        // Longer delay after error
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  const endTimestamp = new Date();
  const totalDurationMs = endTimestamp.getTime() - startTimestamp.getTime();

  // Calculate final statistics for each model
  Object.values(modelStats).forEach(stats => {
    if (stats.runs > 0) {
      stats.avgTimeMs = parseFloat((stats.totalTimeMs / stats.runs).toFixed(2));
      stats.medianTimeMs = parseFloat(calculateMedian(stats.executionTimes).toFixed(2));
      stats.stdDevMs = parseFloat(calculateStdDev(stats.executionTimes, stats.avgTimeMs).toFixed(2));
      stats.avgTokens = Math.round(stats.totalTokens / stats.runs);
      stats.avgCostUSD = parseFloat((stats.totalCostUSD / stats.runs).toFixed(7));
    }
  });

  // Calculate overall stats
  const allSuccessfulTimes = runResults
    .filter(r => r.success && r.executionTimeMs)
    .map(r => r.executionTimeMs!);

  const overallStats = {
    totalRequests: totalRuns,
    successfulRequests: runResults.filter(r => r.success).length,
    failedRequests: runResults.filter(r => !r.success).length,
    avgTimeMs: allSuccessfulTimes.length > 0
      ? parseFloat((allSuccessfulTimes.reduce((a, b) => a + b, 0) / allSuccessfulTimes.length).toFixed(2))
      : 0,
    minTimeMs: allSuccessfulTimes.length > 0 ? Math.min(...allSuccessfulTimes) : 0,
    maxTimeMs: allSuccessfulTimes.length > 0 ? Math.max(...allSuccessfulTimes) : 0,
  };

  const results: TestResults = {
    totalRuns,
    modelsTest: models,
    runsPerModel,
    startTime: startTimestamp.toISOString(),
    endTime: endTimestamp.toISOString(),
    totalDurationMs,
    modelStats,
    overallStats,
  };

  // Print summary
  console.log(`\n\n═══════════════════════════════════════════════════════════`);
  console.log(`📊 TEST SUMMARY`);
  console.log(`═══════════════════════════════════════════════════════════`);
  console.log(`Total Duration: ${(totalDurationMs / 1000).toFixed(2)}s`);
  console.log(`Successful: ${overallStats.successfulRequests}/${totalRuns}`);
  console.log(`Failed: ${overallStats.failedRequests}/${totalRuns}`);
  console.log(`\nOverall Performance:`);
  console.log(`  Avg: ${overallStats.avgTimeMs}ms`);
  console.log(`  Min: ${overallStats.minTimeMs}ms`);
  console.log(`  Max: ${overallStats.maxTimeMs}ms`);

  console.log(`\n───────────────────────────────────────────────────────────`);
  console.log(`📈 PER-MODEL RESULTS (sorted by avg time)`);
  console.log(`───────────────────────────────────────────────────────────`);

  // Sort models by average time
  const sortedStats = Object.values(modelStats)
    .filter(s => s.runs > 0)
    .sort((a, b) => a.avgTimeMs - b.avgTimeMs);

  sortedStats.forEach((stats, index) => {
    console.log(`\n${index + 1}. ${stats.model}`);
    console.log(`   Runs: ${stats.runs}/${runsPerModel} (${stats.errors} errors)`);
    console.log(`   Time: avg=${stats.avgTimeMs}ms, median=${stats.medianTimeMs}ms, σ=${stats.stdDevMs}ms`);
    console.log(`   Range: ${stats.minTimeMs}ms - ${stats.maxTimeMs}ms`);
    console.log(`   Tokens: avg=${stats.avgTokens}, total=${stats.totalTokens}`);
    console.log(`   Cost: avg=$${stats.avgCostUSD.toFixed(7)}, total=$${stats.totalCostUSD.toFixed(7)}`);
  });

  console.log(`\n═══════════════════════════════════════════════════════════\n`);

  return results;
}

/**
 * Export results to JSON file
 */
export function exportResultsToJSON(results: TestResults, filepath: string): void {
  const fs = require('fs');
  fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
  console.log(`📁 Results exported to: ${filepath}`);
}
