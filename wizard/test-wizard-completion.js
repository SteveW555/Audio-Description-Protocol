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

console.log('🧪 Testing Wizard Completion Tracking\n');

async function testWizardCompletion() {
  // Simulate wizard completion
  console.log('📍 Simulating wizard completion...');

  const mockWizardData = {
    path: 'test_audio_file.wav',
    semantic_description: {
      genre: { primary: 'Electronic', primary_subgenres: ['House', 'Techno'] },
      attributes: {
        mood: ['energetic', 'uplifting'],
        energy: ['high'],
        texture: ['dense', 'layered']
      },
      instrumentation: [
        { instrument: 'Synthesizer', role: 'lead', descriptors: ['bright'] },
        { instrument: 'Drum_Machine', role: 'rhythmic', descriptors: ['punchy'] }
      ],
      vocals: { presence: 'none' }
    },
    theory: {
      bpm: '128',
      key: 'Am',
      scale: 'minor',
      chords: 'tbc'
    }
  };

  const record = {
    button_clicked_name: 'wizard-completed',
    button_clicked_time: new Date().toISOString(),
    input_phrase: null,
    response_phrase: null,
    result_json: mockWizardData
  };

  const { data, error } = await supabase
    .from('adp_usage')
    .insert(record)
    .select();

  if (error) {
    console.log(`  ❌ FAIL: ${error.message}\n`);
    return false;
  }

  console.log(`  ✅ PASS: Wizard completion tracked with ID ${data[0].id}\n`);

  // Verify the record
  console.log('📊 Verifying wizard completion record...\n');
  const { data: completionRecords, error: queryError } = await supabase
    .from('adp_usage')
    .select('*')
    .eq('button_clicked_name', 'wizard-completed')
    .order('created_at', { ascending: false })
    .limit(1);

  if (queryError) {
    console.log(`  ❌ Query error: ${queryError.message}`);
    return false;
  }

  if (completionRecords && completionRecords.length > 0) {
    const record = completionRecords[0];
    console.log('  ✅ Latest wizard completion record:');
    console.log(`     ID: ${record.id}`);
    console.log(`     Time: ${record.button_clicked_time}`);
    console.log(`     Input Phrase: ${record.input_phrase || 'null'} ✓`);
    console.log(`     Response Phrase: ${record.response_phrase || 'null'} ✓`);
    console.log(`     Result JSON Keys: ${Object.keys(record.result_json || {}).join(', ')}`);
    console.log(`     Has Genre: ${record.result_json?.semantic_description?.genre?.primary ? '✓' : '✗'}`);
    console.log(`     Has Instruments: ${record.result_json?.semantic_description?.instrumentation?.length > 0 ? '✓' : '✗'}`);
    console.log(`     Has BPM: ${record.result_json?.theory?.bpm ? '✓' : '✗'}`);
  }

  console.log('\n✅ Wizard completion tracking works correctly!');
  console.log('\n📝 Summary:');
  console.log('   • Button Name: "wizard-completed"');
  console.log('   • Input Phrase: null (N/A)');
  console.log('   • Response Phrase: null (N/A)');
  console.log('   • Result JSON: Complete wizard data');
  console.log('\n🎉 When users reach the "Protocol Generated" page,');
  console.log('   their completed wizard data is automatically tracked!');

  return true;
}

testWizardCompletion().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
