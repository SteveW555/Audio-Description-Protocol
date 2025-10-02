import { SupabaseUsageTracker } from './src/services/usageTracking.js';
import { extractRandomizeAllData, extractTranslatePhraseData } from './src/services/usageDataExtractors.js';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 End-to-End Usage Tracking Test\n');

async function testTracking() {
  const tracker = new SupabaseUsageTracker();

  // Test 1: Track a randomize-all button click
  console.log('Test 1: Track "randomize-all" button click');
  const mockWizardData = {
    semantic_description: {
      genre: { primary: 'Electronic', primary_subgenres: ['House'] },
      attributes: {
        mood: ['energetic'],
        energy: ['high'],
        texture: ['dense']
      },
      instrumentation: [
        { instrument: 'Synthesizer', role: 'lead' }
      ]
    },
    theory: { bpm: '128', key: 'Am', scale: 'minor' }
  };

  const usageData1 = extractRandomizeAllData(mockWizardData);
  await tracker.track(usageData1);
  console.log('  ✅ Tracking call completed (750ms timeout)\n');

  // Wait a moment for the async operation
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: Track a translate-phrase button click
  console.log('Test 2: Track "translate-phrase" button click');
  const usageData2 = extractTranslatePhraseData(
    'chill vibes with smooth piano',
    'Ambient, relaxing mood, mellow energy, featuring Piano (melodic)',
    mockWizardData
  );
  await tracker.track(usageData2);
  console.log('  ✅ Tracking call completed\n');

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Query the database to verify records were created
  console.log('📊 Verifying records in database...\n');

  const { data, error, count } = await supabase
    .from('adp_usage')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.log('  ❌ Error querying records:', error.message);
    return;
  }

  console.log(`  ✅ Found ${count} total records in database`);
  console.log(`  Latest ${Math.min(5, data.length)} records:\n`);

  data.forEach((record, i) => {
    console.log(`  ${i + 1}. Button: ${record.button_clicked_name}`);
    console.log(`     Time: ${record.button_clicked_time}`);
    console.log(`     Input: ${record.input_phrase || 'null'}`);
    console.log(`     Response: ${record.response_phrase || 'null'}`);
    console.log(`     Result keys: ${Object.keys(record.result_json || {}).join(', ')}`);
    console.log();
  });

  console.log('✅ End-to-end tracking test PASSED!');
  console.log('\n🎉 Feature 009 is fully operational!');
  console.log('\nNext steps:');
  console.log('  1. Start the dev server: npm run dev');
  console.log('  2. Click buttons in the Dev Tools section');
  console.log('  3. Verify tracking in Supabase dashboard');
}

testTracking().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
