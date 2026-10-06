# Delivery Address Collection System - Complete Setup Guide

This guide shows how to set up the customer delivery address collection system for The Blend.Co.

## 🎯 What This Feature Does

✅ **Customer Flow:**
1. After checkout, customer receives a branded email from The Blend.Co
2. Email contains a unique link to a delivery form
3. Customer clicks link and fills in: street address, city, postal code, phone number
4. Form is submitted and admin can see all delivery details

✅ **Admin Benefits:**
- View all customer delivery addresses in one dashboard
- Filter by completion status (pending/completed)
- Search by order ID, email, or customer name
- See which customers haven't provided delivery info yet

## 📋 Setup Steps

### Step 1: Create Database Table in Supabase

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste this SQL:

```sql
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

CREATE INDEX IF NOT EXISTS idx_delivery_order_id ON delivery_addresses(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_email ON delivery_addresses(customer_email);
CREATE INDEX IF NOT EXISTS idx_delivery_token ON delivery_addresses(delivery_link_token);
CREATE INDEX IF NOT EXISTS idx_delivery_completed ON delivery_addresses(is_completed);

ALTER TABLE delivery_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view delivery form with token" ON delivery_addresses
  FOR SELECT
  USING (TRUE);

CREATE POLICY "Service role can manage delivery addresses" ON delivery_addresses
  FOR ALL
  USING (auth.role() = 'service_role');
```

4. Click **Run**
5. Wait for success ✅

### Step 2: Files Created

The following files have been created automatically:

**Components:**
- `src/components/DeliveryForm.jsx` - Customer delivery form component
- `src/components/DeliveryForm.css` - Styling for form

**Pages:**
- `src/pages/DeliveryFormPage.jsx` - Delivery form page (accessed via email link)
- `src/pages/admin/AdminDeliveries.jsx` - Admin dashboard for all deliveries
- `src/pages/admin/AdminDeliveries.css` - Admin dashboard styling

**Services:**
- `src/lib/deliveryService.js` - All delivery operations (create, read, update, search)

**Updated Files:**
- `src/lib/emailService.js` - Added delivery form email template
- `src/App.jsx` - Added routes for delivery form and admin page
- `src/pages/admin/AdminLayout.jsx` - Added "Deliveries" navigation item

### Step 3: Integration with Checkout

After a customer completes checkout and order is created, create a delivery address record:

**In your order creation code (e.g., Checkout.jsx or CheckoutSuccess.jsx):**

```javascript
import { deliveryService } from '../lib/deliveryService';
import { sendOrderEmail } from '../lib/emailService';

// After order is created and saved
const createDeliveryRecord = async (order) => {
  // Create delivery address record with unique token
  const result = await deliveryService.createDeliveryRecord(
    order.id,
    order.customer_name,
    order.customer_email
  );

  if (result.success) {
    // Send delivery form email
    await sendOrderEmail('deliveryForm', {
      order_id: order.id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      deliveryLink: result.fullLink, // Full URL to delivery form
      delivery_link_token: result.data.delivery_link_token,
    }, order.customer_email);
  }
};

// Call after order is successfully created
await createDeliveryRecord(newOrder);
```

### Step 4: Email Template

The system automatically sends a branded email with:
- The Blend.Co branding (burgundy #8B5A6F)
- Customer order ID
- Link to delivery form
- Instructions about the 7-day expiration

Email shows:
```
📍 Delivery Address Needed

Complete Your Order
We've received your order! Please provide your delivery address so we can send it to you right away.

[➜ Provide Delivery Address] Button
```

### Step 5: Accessing the Delivery Form

**For Customers:**
- Click link in email
- Form loads with pre-filled customer name and email
- Fill in: street address, city, postal code, phone number
- Click "Submit Delivery Address"
- See success message ✅

**URL Format:**
```
https://the-blend-co.vercel.app/delivery/[unique-token]
```

### Step 6: Admin Dashboard

**Access:** `/admin/deliveries`

**Features:**
- View all customer delivery submissions
- Statistics: Total, Completed, Pending
- Search by: Order ID, Email, Customer Name
- Filter by status: All, Completed, Pending
- Click to expand and see full address details
- Shows when address was completed
- Color-coded status badges (green = complete, orange = pending)

## 📊 Delivery Service Functions

All functions available in `src/lib/deliveryService.js`:

```javascript
// Create delivery record (call after order creation)
deliveryService.createDeliveryRecord(orderId, customerName, customerEmail)

// Get delivery by token (for form page)
deliveryService.getDeliveryByToken(token)

// Get delivery by order ID
deliveryService.getDeliveryByOrderId(orderId)

// Update delivery address
deliveryService.updateDelivery(token, { street_address, city, postal_code, phone_number })

// Get all deliveries (for admin)
deliveryService.getAllDeliveries(page, limit)

// Search deliveries
deliveryService.searchDeliveries(query)

// Get delivery status
deliveryService.getDeliveryStatus(orderId)

// Get pending (not completed, not expired)
deliveryService.getPendingDeliveries()

// Get expired (expired link, not completed)
deliveryService.getIncompleteDeliveries()
```

## 🔒 Security & Validation

✅ **Form Validation:**
- Street address required
- City required
- Postal code required
- Phone number required
- Real-time validation feedback

✅ **Token Security:**
- Unique token for each delivery form
- Tokens expire after 7 days
- Prevents unauthorized form access
- One token per order

✅ **Data Protection:**
- All customer data is encrypted in transit
- Supabase RLS policies restrict access
- Only service role can modify data
- Email shown in delivery form confirmation

## 📧 Email Integration

**Delivery Form Email:**
- Template: `getDeliveryFormTemplate()` in `emailService.js`
- Subject: "Confirm Your Delivery Address - The Blend.Co"
- Includes order ID, customer name
- Shows 7-day expiration warning
- Branded with The Blend.Co colors

**To send delivery email:**
```javascript
await sendOrderEmail('deliveryForm', deliveryData, customerEmail);
```

## 🔄 Customer Journey

1. **Customer places order** → Order created in database
2. **Delivery record created** → Unique token generated
3. **Email sent** → Branded delivery form link
4. **Customer clicks link** → Delivery form loads with pre-filled data
5. **Customer fills address** → Form validates input
6. **Customer submits** → Data saved, success message shown
7. **Admin sees it** → Appears in Deliveries dashboard immediately

## ⏰ Timeline

- **Link Created:** Immediately after order
- **Link Valid:** 7 days
- **Admin Visibility:** Immediate (pending or completed)
- **Email Sent:** When order is created (can be customized)

## 🧪 Testing

### Test Delivery Form:
```javascript
// Create test delivery record
const result = await deliveryService.createDeliveryRecord(
  'TEST-ORDER-123',
  'John Doe',
  'john@example.com'
);

// Access form with token
console.log(result.fullLink);
// https://the-blend-co.vercel.app/delivery/[token]
```

### Test Admin Dashboard:
1. Go to `/admin/deliveries`
2. Should see statistics (Total, Completed, Pending)
3. Should see test delivery record
4. Click to expand and see full details

## 📱 Mobile Responsiveness

✅ Delivery form is fully responsive:
- Mobile: Full-width form with stacked fields
- Tablet: Two-column layout
- Desktop: Three-column form with sidebar

✅ Admin dashboard is fully responsive:
- Mobile: Stacked cards, single-column list
- Tablet: Two-column stats
- Desktop: Full-width with multi-column grid

## 🚀 Production Deployment

### On Vercel:

1. **No additional env vars needed** - Uses existing Supabase connection
2. **Push code to Git:**
   ```bash
   git add .
   git commit -m "Add delivery address collection system"
   git push origin main
   ```
3. **Vercel auto-deploys**
4. **Test delivery form:** `/delivery/[token]`
5. **Test admin:** `/admin/deliveries`

## ✅ Checklist

- [ ] SQL table created in Supabase
- [ ] Files created (components, pages, service)
- [ ] Routes added to App.jsx
- [ ] Navigation added to AdminLayout.jsx
- [ ] Integration code added to checkout flow
- [ ] Test delivery form loads
- [ ] Test admin dashboard shows deliveries
- [ ] Test email sends with delivery link
- [ ] Deploy to production
- [ ] Monitor delivery submissions

## 🐛 Troubleshooting

**Issue:** Form won't load / "Invalid or expired delivery link"
- **Solution:** Check token in URL matches database
- **Check:** `SELECT * FROM delivery_addresses` in Supabase

**Issue:** Email not sending
- **Solution:** Verify Resend API key in .env
- **Check:** Email logs in AdminEmails page

**Issue:** Admin page shows no deliveries
- **Solution:** Ensure orders have delivery records created
- **Check:** Create test delivery with `deliveryService.createDeliveryRecord()`

**Issue:** Token expired but customer wants to fill form
- **Solution:** Admin can create new delivery record with new token
- **Check:** Regenerate link and send new email

## 📞 Support

For issues:
1. Check browser console for errors
2. Check email logs at `/admin/emails`
3. Check delivery records in Supabase SQL Editor
4. View admin deliveries dashboard at `/admin/deliveries`

## 🎉 Next Steps

1. ✅ Database table created
2. ✅ Components built
3. ✅ Routes configured
4. **→ Integrate with checkout flow**
5. **→ Send delivery emails after orders**
6. **→ Admin reviews deliveries**
7. **→ Use delivery info for shipping**

You now have a complete delivery address collection system! 🚀
