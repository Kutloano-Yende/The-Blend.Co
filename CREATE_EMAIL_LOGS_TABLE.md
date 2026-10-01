# Create Email Logs Table in Supabase

This guide shows how to create the `email_logs` table to track all emails sent by The Blend.Co.

## Quick Method: Copy & Paste SQL

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **The Blend.Co** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

### Step 2: Copy the SQL

Copy the entire SQL below:

```sql
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
```

### Step 3: Paste and Execute

1. Paste the SQL into the SQL Editor
2. Click **Run** button (or press `Ctrl+Enter`)
3. Wait for the query to complete
4. You should see a success message: ✅ "Query successful"

### Step 4: Verify

After the query completes:

1. Go to **Table Editor** in the left sidebar
2. Look for **email_logs** in the table list
3. Click on it to see the table structure

You should see these columns:
- `id` (UUID) - Primary key
- `order_id` (Text) - Reference to order
- `recipient` (Text) - Customer email
- `email_type` (Text) - Type of email (received, processing, shipped, delivered)
- `subject` (Text) - Email subject
- `status` (Text) - Status (sent, failed, pending)
- `error_message` (Text) - Error details if failed
- `response_id` (Text) - Resend response ID
- `created_at` (Timestamp) - When email was sent
- `updated_at` (Timestamp) - Last update

## Table Structure

### Columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | Yes | Unique identifier |
| `order_id` | Text | No | Reference to order ID |
| `recipient` | Text | Yes | Customer email address |
| `email_type` | Text | Yes | Type: received, processing, shipped, delivered |
| `subject` | Text | No | Email subject line |
| `status` | Text | Yes | Status: sent, failed, pending |
| `error_message` | Text | No | Error message if failed |
| `response_id` | Text | No | Response ID from Resend |
| `created_at` | Timestamp | Yes | When created |
| `updated_at` | Timestamp | Yes | When updated |

### Constraints:

- **valid_email_type**: Only allows 'received', 'processing', 'shipped', 'delivered'
- **valid_status**: Only allows 'sent', 'failed', 'pending'

### Indexes:

Created for performance:
- `order_id` - Fast lookup by order
- `recipient` - Fast lookup by email
- `email_type` - Fast filtering by type
- `status` - Fast filtering by status
- `created_at` - Fast sorting by date

### Security:

- Row Level Security (RLS) enabled
- Authenticated users can VIEW email logs
- Service role can INSERT and UPDATE
- Prevents unauthorized access

## Troubleshooting

### "Table already exists" error
✅ This is normal! It means the table was already created. The `IF NOT EXISTS` clause prevents errors.

### "Permission denied" error
❌ Make sure you're signed in as a Supabase project owner/admin.

### Can't see the table
1. Refresh the page
2. Check the **Table Editor** list
3. Scroll down in the table list

### Need to delete and recreate?
Run this to drop the table:
```sql
DROP TABLE IF EXISTS email_logs CASCADE;
```
Then run the creation SQL again.

## Testing

After creating the table, test by sending a test email:

```javascript
// In your code
import { sendOrderEmail } from '@/lib/emailService';

const testOrder = {
  id: 'test-123',
  customer_email: 'test@example.com',
  total_amount: 100,
  created_at: new Date(),
  order_items: [{
    product_name: 'Test Product',
    quantity: 1,
    price: 100
  }]
};

try {
  await sendOrderEmail('received', testOrder, 'test@example.com');
  console.log('✅ Email sent!');
  
  // Check email_logs table
  // Should see new record with status: 'sent'
} catch (error) {
  console.error('❌ Error:', error);
}
```

Then check the `email_logs` table to verify the record was inserted.

## Next Steps

1. ✅ Create email_logs table
2. ✅ Verify table structure
3. ⏳ Add Resend API key to Vercel environment variables
4. ⏳ Deploy to production
5. ⏳ Test sending emails
6. ⏳ View email logs in admin panel

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Email Setup**: See `EMAIL_SETUP.md`
- **Admin Panel**: Navigate to `/admin/emails` to view logs
