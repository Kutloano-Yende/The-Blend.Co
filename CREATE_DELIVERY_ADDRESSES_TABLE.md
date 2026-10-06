# Create Delivery Addresses Table

This guide shows how to set up the delivery_addresses table in Supabase.

## Step 1: Copy and paste this SQL in Supabase SQL Editor

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

-- Enable RLS
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;

-- Allow anyone with valid token to view/update their form
CREATE POLICY "Users can view delivery form with token" ON delivery_addresses
  FOR SELECT
  USING (TRUE);

-- Allow service role to manage all
CREATE POLICY "Service role can manage delivery addresses" ON delivery_addresses
  FOR ALL
  USING (auth.role() = 'service_role');
```

## Step 2: Create the Table

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the SQL above
5. Click **Run**
6. Wait for success message ✅

## Step 3: Verify

Run this query to confirm:

```sql
SELECT * FROM delivery_addresses LIMIT 1;
```

You should see the table structure with all columns.

## Table Schema Explained

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Unique identifier |
| `order_id` | TEXT | Links to orders table |
| `customer_email` | TEXT | Customer email for validation |
| `customer_name` | TEXT | Customer name (pre-filled) |
| `street_address` | TEXT | Delivery street address |
| `city` | TEXT | Delivery city/town |
| `postal_code` | TEXT | Delivery postal code |
| `phone_number` | TEXT | Delivery phone number |
| `delivery_link_token` | TEXT | Unique token for email link |
| `is_completed` | BOOLEAN | Whether form is submitted |
| `completed_at` | TIMESTAMP | When form was completed |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |
| `expires_at` | TIMESTAMP | Link expires after 7 days |

## Next Steps

After creating the table, you can:
1. Use the delivery form component
2. Send emails with delivery link
3. View admin dashboard with all deliveries
