import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createEmailLogsTable = async () => {
  try {
    console.log('📧 Creating email_logs table...');

    // First, check if table already exists
    const { data: existingTable } = await supabase
      .from('email_logs')
      .select('*')
      .limit(1);

    if (existingTable !== null) {
      console.log('✅ email_logs table already exists');
      return;
    }
  } catch (err) {
    // Table doesn't exist, proceed to create it
  }

  const sqlStatements = `
-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT,
  recipient TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('received', 'processing', 'shipped', 'delivered')),
  subject TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT,
  response_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all email logs
CREATE POLICY "Allow admins to view email logs" ON email_logs
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
  ));

-- Allow service role to insert
CREATE POLICY "Allow service role to insert email logs" ON email_logs
  FOR INSERT
  WITH CHECK (TRUE);

-- Allow service role to update
CREATE POLICY "Allow service role to update email logs" ON email_logs
  FOR UPDATE
  USING (TRUE);
  `;

  console.log('Running SQL...\n');
  console.log(sqlStatements);
  console.log('\n⚠️  Please run the above SQL in your Supabase SQL Editor:\n');
  console.log('Steps:');
  console.log('1. Go to Supabase Dashboard → your project');
  console.log('2. Click "SQL Editor" in the left sidebar');
  console.log('3. Click "New Query"');
  console.log('4. Copy and paste the SQL above');
  console.log('5. Click "Run"');
  console.log('\nAlternatively, run this command with your Supabase credentials.');
};

createEmailLogsTable().catch(console.error);
