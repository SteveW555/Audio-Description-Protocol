import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    console.log('🔍 Querying Supabase for table list...\n');

    // Query information_schema to get list of tables
    const { data, error } = await supabase
      .rpc('list_tables', {});

    if (error) {
      // Fallback: Try to query adp_usage table directly
      console.log('RPC not available, trying direct table query...\n');

      const { data: adpData, error: adpError } = await supabase
        .from('adp_usage')
        .select('*')
        .limit(0);

      if (adpError) {
        console.log('❌ Error querying adp_usage table:');
        console.log('   Code:', adpError.code);
        console.log('   Message:', adpError.message);
        console.log('   Details:', adpError.details);
        console.log('\n⚠️  The adp_usage table may not exist yet.');
        console.log('   Deploy the schema using: specs/009-supabase-integration-use/contracts/supabase-schema.sql');
      } else {
        console.log('✅ adp_usage table exists and is accessible!');
        console.log('   Columns:', Object.keys(adpData || {}).length ? 'Schema accessible' : 'Empty result (expected)');
      }
    } else {
      console.log('📊 Tables found:');
      console.log(data);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

listTables();
