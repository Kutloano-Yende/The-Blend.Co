# Email Setup Guide - The Blend.Co

## Overview
This guide walks you through setting up Resend email service to send branded order notifications to customers.

## Step 1: Sign Up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Go to the dashboard

## Step 2: Create API Key

1. In Resend dashboard, go to **API Keys** section
2. Click **Create API Key**
3. Give it a name like "The Blend.Co Production"
4. Copy the API key (starts with `re_`)

## Step 3: Configure Environment Variables

1. Open `.env.local` in your project root (create if it doesn't exist)
2. Add your Resend API key:
   ```
   VITE_RESEND_API_KEY=re_your_api_key_here
   ```
3. Keep other variables as they are

## Step 4: Set Up Custom Domain (Optional but Recommended)

For better deliverability:

1. In Resend, go to **Domains**
2. Click **Add Domain**
3. Add your domain (e.g., `thebland-co.com`)
4. Follow DNS setup instructions
5. Once verified, update the email sending address in `src/lib/emailService.js`:
   ```javascript
   from: 'The Blend.Co <noreply@yourdomain.com>',
   ```

## Step 5: Set Up Supabase Database Table

Create the email logs table to track sent emails:

```sql
-- Create email_logs table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT,
  recipient TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'received', 'processing', 'shipped', 'delivered'
  subject TEXT,
  status TEXT DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX idx_email_logs_email_type ON email_logs(email_type);
```

## Step 6: Integrate with Order Flow

Currently, the email service is set up to be called manually. To automate:

### Option A: Trigger from Frontend (After Order Creation)
```javascript
import { sendOrderEmail } from '@/lib/emailService';

// After creating order
try {
  await sendOrderEmail('received', orderData, customerEmail);
} catch (error) {
  console.error('Email send failed:', error);
}
```

### Option B: Trigger from Supabase (Recommended)
Create a Supabase Edge Function:

```javascript
// supabase/functions/send-order-email/index.ts
import { Resend } from "https://esm.sh/resend@latest";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  const { order, emailType } = await req.json();

  try {
    const response = await resend.emails.send({
      from: "The Blend.Co <noreply@thebland-co.com>",
      to: order.customer_email,
      subject: getEmailSubject(emailType),
      html: getEmailTemplate(emailType, order),
    });

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});
```

## Step 7: Test Email Sending

1. Go to Admin Panel → **Emails**
2. You'll see:
   - **Email Templates**: Shows all configured templates
   - **Email Send History**: Logs of all sent emails
   - **Configuration**: Current email setup details

## Email Templates

The system includes 4 branded email templates:

### 1. Order Received
- **Trigger**: When customer places order
- **Includes**: Order confirmation, item details, total amount
- **Color**: Burgundy (#8B5A6F)

### 2. Order Processing
- **Trigger**: When order begins processing
- **Includes**: Processing status, estimated delivery
- **Color**: Orange (#ff9800)

### 3. Order Shipped
- **Trigger**: When order ships
- **Includes**: Tracking info (when available)
- **Color**: Green (#4caf50)

### 4. Order Delivered
- **Trigger**: When order delivered
- **Includes**: Thank you message, review request
- **Color**: Dark Green (#2e7d32)

## Customization

To customize email templates, edit `src/lib/emailService.js`:

1. Find the template function (e.g., `getOrderReceivedTemplate`)
2. Modify HTML/CSS as needed
3. Update subject lines
4. Change brand colors and messaging

## Testing Email Sending

### Manual Test
```javascript
import { sendOrderEmail } from '@/lib/emailService';

const testOrder = {
  id: 'test-123',
  customer_email: 'customer@example.com',
  total_amount: 150.00,
  created_at: new Date(),
  order_items: [
    {
      product_name: 'Black Straight Headband Wig',
      quantity: 1,
      price: 150.00
    }
  ]
};

// Test sending
await sendOrderEmail('received', testOrder, 'customer@example.com');
```

### Check Logs
1. Go to Admin Panel → **Emails**
2. View **Email Send History**
3. Search by customer email to see status

## Troubleshooting

### Email Not Sending?
1. Check API key in `.env.local`
2. Verify email address is not in Resend's test mode
3. Check console for error messages
4. View email logs in Admin Panel

### Emails Going to Spam?
1. Set up domain verification in Resend
2. Add DMARC/SPF records
3. Use consistent from address
4. Avoid spam trigger words

### Database Issues?
1. Ensure `email_logs` table exists
2. Check Supabase SQL editor for table
3. Verify column names match code

## Monitoring

- **Admin Panel → Emails**: View all sent emails
- **Filter by type**: See which templates are being used
- **Search by recipient**: Track emails for specific customers
- **Resend Dashboard**: See delivery rates and analytics

## Next Steps

1. ✅ Sign up for Resend
2. ✅ Add API key to `.env.local`
3. ✅ Create `email_logs` table in Supabase
4. ✅ Test email sending from Admin Panel
5. ⏳ Integrate with order checkout flow
6. ⏳ Set up Supabase Edge Functions (optional)
7. ⏳ Monitor email delivery in admin dashboard

## Support

For Resend issues: [https://resend.com/docs](https://resend.com/docs)
For template customization, edit `src/lib/emailService.js`
