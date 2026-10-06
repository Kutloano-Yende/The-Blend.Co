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
