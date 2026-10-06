import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yhheeleyykqsefcbbwcp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testPaymentFiltering() {
  console.log('🧪 Testing Payment Filtering System\n');

  // Test 1: Create UNPAID order
  console.log('TEST 1: Creating UNPAID order...');
  const { data: unpaidOrder, error: unpaidError } = await supabase
    .from('orders')
    .insert({
      customer_email: 'unpaid-test-' + Date.now() + '@test.com',
      customer_first_name: 'Test',
      customer_last_name: 'Unpaid',
      payment_status: 'pending',
      total: 500,
    })
    .select()
    .single();

  if (unpaidError) {
    console.error('❌ Error creating unpaid order:', unpaidError.message);
  } else {
    console.log('✅ Unpaid order created:', unpaidOrder.id);
    console.log('   Payment Status:', unpaidOrder.payment_status);
  }

  // Test 2: Create PAID order
  console.log('\nTEST 2: Creating PAID order...');
  const { data: paidOrder, error: paidError } = await supabase
    .from('orders')
    .insert({
      customer_email: 'paid-test-' + Date.now() + '@test.com',
      customer_first_name: 'Test',
      customer_last_name: 'Paid',
      payment_status: 'paid',
      total: 750,
    })
    .select()
    .single();

  if (paidError) {
    console.error('❌ Error creating paid order:', paidError.message);
  } else {
    console.log('✅ Paid order created:', paidOrder.id);
    console.log('   Payment Status:', paidOrder.payment_status);
  }

  // Test 3: Try to create delivery for UNPAID order
  if (unpaidOrder) {
    console.log('\nTEST 3: Attempting to create delivery for UNPAID order (should fail)...');
    const { data: unpaidDelivery, error: unpaidDeliveryError } = await supabase
      .from('delivery_addresses')
      .insert({
        order_id: unpaidOrder.id,
        customer_name: unpaidOrder.customer_first_name,
        customer_email: unpaidOrder.customer_email,
        delivery_link_token: 'test-unpaid-' + Date.now(),
      })
      .select()
      .single();

    if (unpaidDeliveryError) {
      console.log('⚠️ Error (expected):', unpaidDeliveryError.message);
      console.log('✅ PASS: Delivery not created for unpaid order');
    } else {
      console.log('❌ PROBLEM: Delivery record created for UNPAID order!', unpaidDelivery.id);
    }
  }

  // Test 4: Create delivery for PAID order
  if (paidOrder) {
    console.log('\nTEST 4: Creating delivery for PAID order (should succeed)...');
    const { data: paidDelivery, error: paidDeliveryError } = await supabase
      .from('delivery_addresses')
      .insert({
        order_id: paidOrder.id,
        customer_name: paidOrder.customer_first_name,
        customer_email: paidOrder.customer_email,
        delivery_link_token: 'test-paid-' + Date.now(),
      })
      .select()
      .single();

    if (paidDeliveryError) {
      console.error('❌ Error creating delivery for paid order:', paidDeliveryError.message);
    } else {
      console.log('✅ PASS: Delivery record created for PAID order:', paidDelivery.id);
    }
  }

  // Test 5: Query and filter deliveries
  console.log('\nTEST 5: Checking filtered query results...');
  const { data: allDeliveries, error: queryError } = await supabase
    .from('delivery_addresses')
    .select(`
      *,
      orders(id, payment_status, customer_email)
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (queryError) {
    console.error('❌ Error querying deliveries:', queryError.message);
  } else {
    const paidDeliveries = allDeliveries.filter(d => d.orders?.payment_status === 'paid');
    const unpaidDeliveries = allDeliveries.filter(d => d.orders?.payment_status === 'pending');

    console.log(`\n📊 Total deliveries in database: ${allDeliveries.length}`);
    console.log(`✅ PAID deliveries: ${paidDeliveries.length}`);
    console.log(`❌ UNPAID/PENDING deliveries: ${unpaidDeliveries.length}`);

    // Show summary
    if (unpaidDeliveries.length === 0) {
      console.log('\n✅ PASS: No unpaid orders in delivery records');
    } else {
      console.log('\n⚠️ WARNING: Found unpaid orders in delivery records:');
      unpaidDeliveries.slice(0, 3).forEach(d => {
        console.log(`   - Order ${d.order_id} (${d.orders?.payment_status})`);
      });
    }
  }

  console.log('\n✅ Payment filtering test complete!\n');
}

testPaymentFiltering().catch(console.error);
