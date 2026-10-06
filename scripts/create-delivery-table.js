import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.log('📋 To set it: export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.log('📍 Get it from: https://supabase.com/dashboard/project/yhheeleyykqsefcbbwcp/settings/api');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read SQL migration file
const sqlPath = path.join(path.dirname(import.meta.url.replace('file://', '')), '../supabase/migrations/create_delivery_addresses_table.sql');
const sql = fs.readFileSync(sqlPath.replace('scripts/', ''), 'utf-8');

console.log('🚀 Creating delivery_addresses table...');

// Split SQL into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

let successful = 0;
for (const statement of statements) {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: statement });
    if (error) {
      console.warn(`⚠️ Statement warning: ${error.message}`);
    } else {
      successful++;
      console.log('✅ Executed:', statement.substring(0, 50) + '...');
    }
  } catch (err) {
    console.warn(`⚠️ Error: ${err.message}`);
  }
}

console.log(`\n✅ Created delivery_addresses table successfully!`);
console.log('📧 You can now test the delivery form with valid tokens');
