#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://yhheeleyykqsefcbbwcp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('');
  console.log('📋 To get your service role key:');
  console.log('1. Visit: https://supabase.com/dashboard/project/yhheeleyykqsefcbbwcp/settings/api');
  console.log('2. Copy the "service_role" key (Secret)');
  console.log('3. Run: SUPABASE_SERVICE_ROLE_KEY="your-key" node scripts/create-delivery-table-direct.js');
  process.exit(1);
}

console.log('🚀 Creating delivery_addresses table in Supabase...\n');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Read SQL migration
const sqlPath = path.join(__dirname, '../supabase/migrations/create_delivery_addresses_table.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

// Split into individual statements
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📄 Found ${statements.length} SQL statements to execute\n`);

let successCount = 0;
let errorCount = 0;

// Execute each statement
for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  const statementNum = i + 1;

  try {
    console.log(`[${statementNum}/${statements.length}] Executing...`);
    console.log(`   ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`);

    // Use rpc to execute raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

    if (error) {
      // Check if this is a "table already exists" error - that's okay
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log(`   ⚠️  Skipped: Already exists\n`);
        successCount++;
      } else {
        console.error(`   ❌ Error: ${error.message}\n`);
        errorCount++;
      }
    } else {
      console.log(`   ✅ Success\n`);
      successCount++;
    }
  } catch (err) {
    console.error(`   ⚠️  ${err.message}\n`);
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✅ Completed: ${successCount} successful, ${errorCount} errors`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errorCount === 0) {
  console.log('🎉 Delivery table setup complete!');
  console.log('📍 Next steps:');
  console.log('   1. Test locally: http://localhost:3000/delivery/test-token');
  console.log('   2. Create test delivery record in Supabase');
  console.log('   3. Test admin dashboard: http://localhost:3000/admin/deliveries');
} else {
  console.log('⚠️  Some statements failed. Check errors above.');
  console.log('💡 You can manually execute the SQL at:');
  console.log('   https://supabase.com/dashboard/project/yhheeleyykqsefcbbwcp/sql/new');
}
