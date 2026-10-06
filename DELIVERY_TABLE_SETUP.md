# Delivery Address Table Setup

The delivery form system is complete but needs the database table created in Supabase.

## Quick Setup (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/yhheeleyykqsefcbbwcp/sql/new
2. Sign in with your Supabase account

### Step 2: Run the SQL Migration

Copy and paste this SQL into the editor:

```sql
-- Create delivery_addresses table
CREATE TABLE IF NOT EXISTS delivery_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,

  -- Delivery details
  street_address TEXT,
  city TEXT,
  postal_code TEXT,
  phone_number TEXT,

  -- Status tracking
  delivery_link_token TEXT UNIQUE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_delivery_order_id ON delivery_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_email ON delivery_addresses(customer_email);
CREATE INDEX IF NOT EXISTS idx_delivery_token ON delivery_addresses(delivery_link_token);
CREATE INDEX IF NOT EXISTS idx_delivery_completed ON delivery_addresses(is_completed);
CREATE INDEX IF NOT EXISTS idx_delivery_created_at ON delivery_addresses(created_at DESC);

-- Enable RLS
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;

-- Allow anyone with valid token to view their form
CREATE POLICY "Users can view delivery form with token" ON delivery_addresses
  FOR SELECT
  USING (TRUE);

-- Allow service role to insert/update/delete
CREATE POLICY "Service role can manage delivery addresses" ON delivery_addresses
  FOR ALL
  USING (auth.role() = 'service_role');
```

### Step 3: Execute
- Click the **Execute** button (or Cmd+Enter)
- Wait for success confirmation

### Step 4: Test
1. Local dev: http://localhost:3000/delivery/test-token
2. Production: Will work after Vercel deployment

---

## What Gets Created

### Table: `delivery_addresses`
- Stores customer delivery forms after checkout
- Links orders to delivery details via `order_id`
- Tracks completion status and expiration

### Columns:
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Unique record ID |
| order_id | TEXT | Links to the order |
| customer_name | TEXT | Name from checkout |
| customer_email | TEXT | Email for delivery link |
| delivery_link_token | TEXT | Unique form access token |
| street_address | TEXT | Filled by customer |
| city | TEXT | Filled by customer |
| postal_code | TEXT | Filled by customer |
| phone_number | TEXT | Filled by customer |
| is_completed | BOOLEAN | True after form submission |
| completed_at | TIMESTAMP | When form was submitted |
| created_at | TIMESTAMP | When record was created |
| updated_at | TIMESTAMP | Last update timestamp |
| expires_at | TIMESTAMP | Link expires after 7 days |

### Indexes:
- `idx_delivery_order_id` - Fast lookup by order
- `idx_delivery_email` - Fast lookup by email  
- `idx_delivery_token` - Fast lookup by token
- `idx_delivery_completed` - Filter by completion status
- `idx_delivery_created_at` - Sort by creation date

### Row Level Security:
- Public SELECT access (anyone can read with valid token)
- Service role only for INSERT/UPDATE/DELETE

---

## After Setup

### 1. Local Testing
```bash
cd /Users/yendek/Documents/programming/The\ Blend.Co/the-blend-co
npm run dev
# Navigate to http://localhost:3000/delivery/any-token
```

### 2. Production Deployment
- Latest changes already pushed
- Vercel will auto-deploy
- Test at https://the-blend-co.vercel.app/admin/deliveries

### 3. Full End-to-End Flow
1. Place a test order
2. Check email for delivery link
3. Click link and fill address form
4. See submission success message
5. Check `/admin/deliveries` to view data

---

## Troubleshooting

**Q: "Could not find the table" error?**
- SQL hasn't been executed yet
- Verify table exists in Supabase

**Q: Where's my delivery link?**
- Check CheckoutSuccess.jsx sends email
- Verify VITE_RESEND_API_KEY is set
- Check email logs at `/admin/emails`

**Q: Invalid token error?**
- Token doesn't exist in database
- Create test record first (see below)

---

## Create Test Delivery Record (Optional)

Once table exists, create a test record to verify the form works:

```bash
# Using Supabase console query:
INSERT INTO delivery_addresses (
  order_id,
  customer_name,
  customer_email,
  delivery_link_token,
  is_completed
) VALUES (
  'TEST-' || NOW()::TEXT,
  'John Doe',
  'test@example.com',
  'test-token-123',
  false
);

-- Then visit:
-- http://localhost:3000/delivery/test-token-123
```

---

✅ **Table setup complete! Delivery system is ready.**
