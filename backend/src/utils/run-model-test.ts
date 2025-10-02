/**
 * Example script to run model timing tests
 *
 * Usage:
 *   npx tsx src/utils/run-model-test.ts
 */

import { test_model_times_generate_casual, exportResultsToJSON } from './test-model-times.js';

async function main() {
  console.log('🚀 Starting Model Performance Test...\n');

  // Run test: 10 requests per model
  const results = await test_model_times_generate_casual(10);

  // Export results to JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `model-test-results-${timestamp}.json`;
  exportResultsToJSON(results, filename);

  console.log('\n✅ Test complete!');
}

main().catch(console.error);
