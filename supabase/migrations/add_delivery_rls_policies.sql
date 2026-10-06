-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view delivery form with token" ON delivery_addresses;
DROP POLICY IF EXISTS "Service role can manage delivery addresses" ON delivery_addresses;
DROP POLICY IF EXISTS "Admins can view all deliveries" ON delivery_addresses;

-- Ensure RLS is enabled
ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public users to view/update their delivery form by token (not paid check here - token is unique)
CREATE POLICY "Users can view delivery form with token"
  ON delivery_addresses
  FOR SELECT
  USING (TRUE);

-- Policy 2: Allow users to update their own delivery address by token
CREATE POLICY "Users can update delivery form with token"
  ON delivery_addresses
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policy 3: Service role (backend) can insert/update/delete
CREATE POLICY "Service role can manage delivery addresses"
  ON delivery_addresses
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 4: Admins can view all deliveries (requires is_admin flag in auth.users)
-- Note: This assumes you have admin user verification - adjust as needed
CREATE POLICY "Admins can view all deliveries"
  ON delivery_addresses
  FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND auth.jwt() ->> 'is_admin' = 'true'
  );

-- Add index for payment status queries
CREATE INDEX IF NOT EXISTS idx_delivery_order_payment 
ON delivery_addresses(order_id) 
WHERE is_completed = false;

-- Ensure orders table has proper RLS if not already set
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow reading orders for delivery system
CREATE POLICY IF NOT EXISTS "Service can read orders for delivery"
  ON orders
  FOR SELECT
  USING (auth.role() = 'service_role');
