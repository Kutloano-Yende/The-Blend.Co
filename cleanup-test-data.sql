-- Cleanup test data script
-- Delete test delivery records
DELETE FROM delivery_addresses 
WHERE order_id LIKE 'TEST-%' 
   OR customer_email LIKE '%@test.com'
   OR customer_email LIKE 'unpaid-%'
   OR customer_email LIKE 'paid-%'
   OR delivery_link_token LIKE 'test-%';

-- Delete test orders
DELETE FROM orders 
WHERE customer_email LIKE '%@test.com'
   OR customer_email LIKE 'unpaid-%'
   OR customer_email LIKE 'paid-%'
   OR order_id LIKE 'TEST-%';

-- Verify cleanup
SELECT COUNT(*) as remaining_test_records 
FROM delivery_addresses 
WHERE customer_email LIKE '%test%' 
   OR order_id LIKE 'TEST-%';
