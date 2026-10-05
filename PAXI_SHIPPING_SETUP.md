# Paxi Shipping Integration Guide

This guide shows how to set up Paxi shipping for The Blend.Co e-commerce platform.

## 🚚 What's Integrated

- ✅ Real-time shipping quotes from Paxi
- ✅ Multiple service levels (Express, Standard, Economy)
- ✅ Automatic shipment creation
- ✅ Tracking & shipment management
- ✅ Shipping label generation
- ✅ Customer tracking in order account
- ✅ Admin shipment dashboard

## 📋 Step 1: Get Paxi API Credentials

1. Visit [Paxi Website](https://www.paxi.co.za/)
2. Sign up for a business account
3. Go to **Settings** → **API Keys**
4. Create a new API key
5. Copy the API key (you'll need it next)

## 🔧 Step 2: Add Environment Variables

### Update `.env.local`:

```
VITE_PAXI_API_KEY=your_paxi_api_key_here
```

Replace `your_paxi_api_key_here` with the key from Step 1.

## 📊 Step 3: Create Shipments Table in Supabase

Copy and paste this SQL in **Supabase SQL Editor**:

```sql
-- Create shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  tracking_number TEXT,
  tracking_url TEXT,
  
  -- Recipient details
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_phone TEXT,
  recipient_street TEXT NOT NULL,
  recipient_city TEXT NOT NULL,
  recipient_postal_code TEXT,
  
  -- Shipment details
  service_type TEXT DEFAULT 'standard',
  status TEXT DEFAULT 'pending_collection',
  shipping_cost DECIMAL(10, 2),
  package_weight DECIMAL(8, 2),
  package_value DECIMAL(10, 2),
  
  -- Dates
  estimated_delivery DATE,
  actual_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);

-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their shipments
CREATE POLICY "Users can view their shipments" ON shipments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow service role to insert/update
CREATE POLICY "Service role can manage shipments" ON shipments
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update shipments" ON shipments
  FOR UPDATE
  USING (auth.role() = 'service_role');
```

## 🛒 Step 4: Integrate with Checkout

### In your Checkout page, add shipping options:

```javascript
import ShippingOptions from '../components/ShippingOptions';

// In checkout form:
<ShippingOptions
  address={deliveryAddress}
  cartTotal={totalAmount}
  onShippingSelect={(shipping) => {
    // Save selected shipping
    setSelectedShipping(shipping);
  }}
/>
```

## 📦 Step 5: Create Shipment on Order Confirmation

### After order is created:

```javascript
import { createPaxiShipment } from '../lib/paxiService';

// After order is saved to database
const shipmentResult = await createPaxiShipment({
  orderId: order.id,
  recipientName: order.customer_name,
  recipientEmail: order.customer_email,
  recipientPhone: order.customer_phone,
  recipientAddress: {
    street: order.delivery_address.street,
    city: order.delivery_address.city,
    postalCode: order.delivery_address.postal_code,
  },
  service: order.shipping_service, // 'express', 'standard', 'economy'
  weight: 1, // kg
  value: order.total_amount,
  description: 'Hair & Beauty Products',
});

// Save shipment to database
await supabase.from('shipments').insert({
  order_id: order.id,
  tracking_number: shipmentResult.trackingNumber,
  tracking_url: shipmentResult.trackingUrl,
  recipient_name: order.customer_name,
  recipient_email: order.customer_email,
  recipient_phone: order.customer_phone,
  recipient_street: order.delivery_address.street,
  recipient_city: order.delivery_address.city,
  recipient_postal_code: order.delivery_address.postal_code,
  service_type: order.shipping_service,
  shipping_cost: shipmentResult.cost,
  estimated_delivery: shipmentResult.estimatedDelivery,
});
```

## 📊 Step 6: Admin Shipment Management

The admin panel now has a **Shipments** page at `/admin/shipments`:

- View all shipments
- Filter by status
- Search by tracking number or order ID
- View tracking details
- Download shipping labels
- Monitor delivery status

## 🔄 Step 7: Customer Tracking

### Show tracking in order account:

```javascript
// In Account/Order page
const [tracking, setTracking] = useState(null);

useEffect(() => {
  if (order.shipment?.tracking_number) {
    getPaxiTrackingInfo(order.shipment.tracking_number)
      .then(setTracking);
  }
}, [order.shipment]);

// Display tracking info
{tracking && (
  <div className="tracking-info">
    <h3>Tracking Information</h3>
    <p>Status: {tracking.statusDisplay}</p>
    <p>Location: {tracking.currentLocation}</p>
    <a href={order.shipment.tracking_url} target="_blank">
      View Full Tracking
    </a>
  </div>
)}
```

## 📧 Step 8: Include Tracking in Emails

### Update order confirmation emails:

```javascript
// In emailService.js
const getOrderReceivedTemplate = (order) => `
  ...
  ${order.shipment?.tracking_url ? `
    <a href="${order.shipment.tracking_url}" class="cta-button">
      Track Your Shipment
    </a>
  ` : ''}
  ...
`;
```

## 🧪 Testing

### Test Shipping Quotes:
```javascript
import { getPaxiShippingQuotes } from './lib/paxiService';

const quotes = await getPaxiShippingQuotes({
  recipientAddress: {
    street: '123 Main St',
    city: 'Johannesburg',
    postalCode: '2000',
  },
  weight: 1,
  value: 150,
});

console.log(quotes);
// Output: Array of shipping options with prices
```

### Test Shipment Creation:
```javascript
import { createPaxiShipment } from './lib/paxiService';

const result = await createPaxiShipment({
  orderId: 'test-123',
  recipientName: 'Test Customer',
  recipientEmail: 'test@example.com',
  recipientPhone: '+27123456789',
  recipientAddress: {
    street: '123 Test St',
    city: 'Cape Town',
    postalCode: '8000',
  },
  service: 'standard',
  weight: 1,
  value: 150,
  description: 'Test Products',
});

console.log(result);
// Output: {
//   success: true,
//   shipmentId: '...',
//   trackingNumber: '...',
//   trackingUrl: '...',
//   estimatedDelivery: '...',
//   cost: 49.99
// }
```

## 📱 Shipping Service Levels

### Express (Next Day)
- **Delivery**: Next business day
- **Features**: Real-time tracking, SMS notifications
- **Price**: R89.99 (example)

### Standard (2-3 Days)
- **Delivery**: 2-3 business days
- **Features**: Real-time tracking, Email notifications
- **Price**: R49.99 (example)

### Economy (3-5 Days)
- **Delivery**: 3-5 business days
- **Features**: Standard tracking
- **Price**: R29.99 (example)

*Actual prices depend on location and weight*

## 🐛 Troubleshooting

### "Paxi API key not configured"
- Check `.env.local` has `VITE_PAXI_API_KEY` set
- Restart dev server after adding environment variable

### Shipping quotes not loading
- Verify complete delivery address is entered
- Check browser console for error messages
- Verify Paxi API key is valid

### Shipment creation fails
- Check all required fields are filled
- Verify recipient address format
- Check Paxi API status

### Tracking not updating
- Paxi updates are near real-time
- Allow up to 1 hour for first scan
- Check tracking URL directly at Paxi

## 📞 Support

- **Paxi Support**: https://www.paxi.co.za/support
- **API Docs**: https://api.paxi.co.za/docs
- **Admin Page**: `/admin/shipments`

## ✅ Checklist

- [ ] Sign up for Paxi business account
- [ ] Get API credentials
- [ ] Add API key to `.env.local`
- [ ] Create shipments table in Supabase
- [ ] Add ShippingOptions component to checkout
- [ ] Create shipment on order confirmation
- [ ] Set up customer tracking display
- [ ] Test shipping quotes
- [ ] Test shipment creation
- [ ] Deploy to Vercel
- [ ] Test in production

## 🚀 Next Steps

1. ✅ Paxi service integration built
2. ⏳ Get Paxi API credentials
3. ⏳ Create shipments table
4. ⏳ Add to checkout flow
5. ⏳ Deploy and test
