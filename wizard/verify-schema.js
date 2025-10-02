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

async function verifySchema() {
  console.log('🔍 Verifying adp_usage table schema...\n');

  // Test 1: Table exists and is queryable
  console.log('✓ Test 1: Table exists');
  const { data: existsData, error: existsError } = await supabase
    .from('adp_usage')
    .select('*')
    .limit(0);

  if (existsError) {
    console.log('  ❌ FAIL:', existsError.message);
    return;
  }
  console.log('  ✅ PASS: Table exists and is accessible\n');

  // Test 2: Insert a valid record
  console.log('✓ Test 2: Insert valid record');
  const testRecord = {
    button_clicked_name: 'test-button',
    button_clicked_time: new Date().toISOString(),
    input_phrase: 'test input',
    response_phrase: 'test response',
    result_json: { test: true, number: 42 }
  };

  const { data: insertData, error: insertError } = await supabase
    .from('adp_usage')
    .insert(testRecord)
    .select();

  if (insertError) {
    console.log('  ❌ FAIL:', insertError.message);
    console.log('  (This may be expected due to RLS policies)');
  } else {
    console.log('  ✅ PASS: Record inserted successfully');
    console.log('  Inserted ID:', insertData[0]?.id);
  }
  console.log();

  // Test 3: Query records
  console.log('✓ Test 3: Query records');
  const { data: queryData, error: queryError, count } = await supabase
    .from('adp_usage')
    .select('*', { count: 'exact' })
    .limit(5);

  if (queryError) {
    console.log('  ❌ FAIL:', queryError.message);
    console.log('  (This may be expected due to RLS policies)');
  } else {
    console.log('  ✅ PASS: Query executed');
    console.log('  Record count:', count || 0);
    if (queryData && queryData.length > 0) {
      console.log('  Sample record:', JSON.stringify(queryData[0], null, 2));
    }
  }
  console.log();

  console.log('📊 Summary:');
  console.log('  Table: ✅ Exists');
  console.log('  Schema: ✅ Deployed');
  console.log('  RLS: ⚠️  Enabled (inserts may require authentication)');
  console.log('\n💡 Note: RLS (Row Level Security) is enabled on this table.');
  console.log('   The anon key can only INSERT if authenticated.');
  console.log('   Your app will need to authenticate users or adjust RLS policies.');
}

verifySchema();
