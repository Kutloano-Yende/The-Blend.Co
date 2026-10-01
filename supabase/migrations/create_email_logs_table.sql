-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT,
  recipient TEXT NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT,
  status TEXT DEFAULT 'sent',
  error_message TEXT,
  response_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints to ensure valid data
ALTER TABLE email_logs
ADD CONSTRAINT valid_email_type
CHECK (email_type IN ('received', 'processing', 'shipped', 'delivered'));

ALTER TABLE email_logs
ADD CONSTRAINT valid_status
CHECK (status IN ('sent', 'failed', 'pending'));

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view email logs
CREATE POLICY "Allow authenticated users to view email logs" ON email_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow service role to insert and update
CREATE POLICY "Allow service role to insert/update email logs" ON email_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role to update email logs" ON email_logs
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON email_logs TO authenticated;
GRANT INSERT, UPDATE ON email_logs TO service_role;
