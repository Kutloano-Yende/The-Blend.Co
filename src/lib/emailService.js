import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendOrderEmail = async (emailType, orderData, customerEmail) => {
  const templates = {
    received: {
      subject: 'Order Received - The Blend.Co',
      html: getOrderReceivedTemplate(orderData),
    },
    processing: {
      subject: 'Your Order is Being Processed - The Blend.Co',
      html: getOrderProcessingTemplate(orderData),
    },
    shipped: {
      subject: 'Your Order Has Shipped! - The Blend.Co',
      html: getOrderShippedTemplate(orderData),
    },
    delivered: {
      subject: 'Your Order Has Been Delivered - The Blend.Co',
      html: getOrderDeliveredTemplate(orderData),
    },
    deliveryForm: {
      subject: 'Confirm Your Delivery Address - The Blend.Co',
      html: getDeliveryFormTemplate(orderData),
    },
  };

  const template = templates[emailType];
  if (!template) throw new Error(`Unknown email type: ${emailType}`);

  try {
    const response = await resend.emails.send({
      from: 'The Blend.Co <noreply@thebland-co.com>',
      to: customerEmail,
      subject: template.subject,
      html: template.html,
    });
    return response;
  } catch (error) {
    console.error(`Error sending ${emailType} email:`, error);
    throw error;
  }
};

const getOrderReceivedTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f7f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #8B5A6F;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #8B5A6F;
      margin: 0;
    }
    .status-badge {
      display: inline-block;
      background-color: #8B5A6F;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin: 15px 0 0 0;
    }
    .order-details {
      background-color: #f9f7f4;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .order-number {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    .order-date {
      color: #666;
      font-size: 14px;
      margin: 8px 0 0 0;
    }
    .items-section {
      margin: 30px 0;
    }
    .item {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item-name {
      font-weight: 500;
      color: #333;
    }
    .item-price {
      color: #8B5A6F;
      font-weight: 600;
    }
    .total-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #8B5A6F;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 10px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #8B5A6F;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
    .contact-info {
      margin: 15px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="logo">The Blend.Co</p>
      <p style="font-size: 14px; color: #666; margin: 10px 0 0 0;">Premium Hair & Beauty</p>
      <span class="status-badge">✓ Order Received</span>
    </div>

    <h2 style="color: #333; margin: 0 0 10px 0;">Thank You for Your Order!</h2>
    <p style="color: #666; margin: 0 0 20px 0;">We've received your order and we're thrilled to help you elevate your hair routine.</p>

    <div class="order-details">
      <p class="order-number">Order #${order.id?.slice(0, 8) || 'PENDING'}</p>
      <p class="order-date">Order Date: ${new Date(order.created_at).toLocaleDateString('en-ZA')}</p>
    </div>

    <div class="items-section">
      <h3 style="color: #333; margin: 0 0 15px 0;">Order Items</h3>
      ${order.order_items?.map(item => `
        <div class="item">
          <div>
            <p class="item-name">${item.product_name || 'Product'}</p>
            <p style="color: #999; font-size: 12px; margin: 4px 0 0 0;">Qty: ${item.quantity || 1}</p>
          </div>
          <p class="item-price">R${Number(item.price || 0).toFixed(2)}</p>
        </div>
      `).join('') || '<p style="color: #999;">No items</p>'}
    </div>

    <div class="total-section">
      <div class="total-row">
        <span>Total Amount:</span>
        <span>R${Number(order.total_amount || 0).toFixed(2)}</span>
      </div>
    </div>

    <p style="color: #666; margin: 20px 0;">
      We'll send you another email as soon as we start processing your order. Typically this happens within 24 hours.
    </p>

    <a href="https://the-blend-co.vercel.app/account" class="cta-button">Track Your Order</a>

    <div class="footer">
      <div class="contact-info">
        <p style="margin: 5px 0;"><strong>The Blend.Co</strong></p>
        <p style="margin: 5px 0;">Premium Hair & Beauty, Crafted with Intention</p>
        <p style="margin: 5px 0;">Email: support@thebland-co.com</p>
      </div>
      <p style="margin: 15px 0 0 0; color: #ccc;">© 2026 The Blend.Co. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const getOrderProcessingTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f7f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #8B5A6F;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #8B5A6F;
      margin: 0;
    }
    .status-badge {
      display: inline-block;
      background-color: #ff9800;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin: 15px 0 0 0;
    }
    .order-details {
      background-color: #f9f7f4;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .progress-bar {
      background-color: #eee;
      border-radius: 10px;
      height: 8px;
      margin: 20px 0;
      overflow: hidden;
    }
    .progress-fill {
      background-color: #ff9800;
      height: 100%;
      width: 50%;
      transition: width 0.3s ease;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="logo">The Blend.Co</p>
      <span class="status-badge">⏳ Processing</span>
    </div>

    <h2 style="color: #333; margin: 0 0 10px 0;">Your Order is Being Processed</h2>
    <p style="color: #666; margin: 0 0 20px 0;">We're getting your order ready with care and attention to detail.</p>

    <div class="order-details">
      <p style="font-size: 18px; font-weight: 600; color: #333; margin: 0;">Order #${order.id?.slice(0, 8) || 'PENDING'}</p>
      <p style="color: #999; font-size: 12px; margin: 8px 0 0 0;">Status: Processing</p>
    </div>

    <div style="margin: 30px 0;">
      <p style="color: #666; font-size: 14px; margin: 0;">Order Status</p>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #999;">
        <span>Received</span>
        <span>Processing</span>
        <span>Shipped</span>
        <span>Delivered</span>
      </div>
    </div>

    <p style="color: #666; margin: 20px 0;">
      Our team is carefully selecting and packaging your items. We'll notify you as soon as your order ships!
    </p>

    <div class="footer">
      <p style="margin: 5px 0;"><strong>The Blend.Co</strong></p>
      <p style="margin: 5px 0;">Premium Hair & Beauty, Crafted with Intention</p>
      <p style="margin: 5px 0;">Email: support@thebland-co.com</p>
    </div>
  </div>
</body>
</html>
`;

const getOrderShippedTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f7f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #8B5A6F;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #8B5A6F;
      margin: 0;
    }
    .status-badge {
      display: inline-block;
      background-color: #4caf50;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin: 15px 0 0 0;
    }
    .tracking-box {
      background-color: #f9f7f4;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #4caf50;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="logo">The Blend.Co</p>
      <span class="status-badge">✉ Shipped!</span>
    </div>

    <h2 style="color: #333; margin: 0 0 10px 0;">Your Order Has Been Shipped!</h2>
    <p style="color: #666; margin: 0 0 20px 0;">Great news! Your order is on its way to you.</p>

    <div class="tracking-box">
      <p style="font-size: 14px; font-weight: 600; color: #333; margin: 0 0 10px 0;">Order #${order.id?.slice(0, 8) || 'PENDING'}</p>
      <p style="color: #666; font-size: 14px; margin: 0;">
        Your package is on its way! You should receive it within 2-3 business days.
      </p>
      <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
        Tracking information will be available shortly.
      </p>
    </div>

    <p style="color: #666; margin: 20px 0;">
      We're excited for you to receive your products! If you have any questions, feel free to reach out to our support team.
    </p>

    <div class="footer">
      <p style="margin: 5px 0;"><strong>The Blend.Co</strong></p>
      <p style="margin: 5px 0;">Premium Hair & Beauty, Crafted with Intention</p>
      <p style="margin: 5px 0;">Email: support@thebland-co.com</p>
    </div>
  </div>
</body>
</html>
`;

const getOrderDeliveredTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f7f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #8B5A6F;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #8B5A6F;
      margin: 0;
    }
    .status-badge {
      display: inline-block;
      background-color: #2e7d32;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin: 15px 0 0 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #8B5A6F;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="logo">The Blend.Co</p>
      <span class="status-badge">✓ Delivered!</span>
    </div>

    <h2 style="color: #333; margin: 0 0 10px 0;">Your Order Has Been Delivered</h2>
    <p style="color: #666; margin: 0 0 20px 0;">We hope you love your new products from The Blend.Co!</p>

    <div style="background-color: #f9f7f4; padding: 20px; border-radius: 4px; margin: 20px 0;">
      <p style="font-size: 18px; font-weight: 600; color: #333; margin: 0;">Order #${order.id?.slice(0, 8) || 'PENDING'}</p>
      <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
        Thank you for shopping with The Blend.Co!
      </p>
    </div>

    <h3 style="color: #333; margin: 20px 0 10px 0;">We'd Love Your Feedback!</h3>
    <p style="color: #666; margin: 0 0 15px 0;">
      Your experience matters to us. Please take a moment to share your thoughts about your order.
    </p>

    <a href="https://the-blend-co.vercel.app/account" class="cta-button">Leave a Review</a>

    <h3 style="color: #333; margin: 20px 0 10px 0;">Care Instructions</h3>
    <p style="color: #666; margin: 0;">
      Make sure to follow the included care instructions to keep your products in top condition and get the most out of your purchase.
    </p>

    <div class="footer">
      <p style="margin: 5px 0;"><strong>The Blend.Co</strong></p>
      <p style="margin: 5px 0;">Premium Hair & Beauty, Crafted with Intention</p>
      <p style="margin: 5px 0;">Email: support@thebland-co.com</p>
    </div>
  </div>
</body>
</html>
`;

const getDeliveryFormTemplate = (delivery) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f7f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #8B5A6F;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #8B5A6F;
      margin: 0;
    }
    .status-badge {
      display: inline-block;
      background-color: #8B5A6F;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      margin: 15px 0 0 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #8B5A6F;
      color: white;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      margin: 25px 0;
      text-align: center;
      font-size: 16px;
    }
    .info-box {
      background-color: #f9f7f4;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
      border-left: 4px solid #8B5A6F;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="logo">The Blend.Co</p>
      <span class="status-badge">📍 Delivery Address Needed</span>
    </div>

    <h2 style="color: #333; margin: 0 0 10px 0;">Complete Your Order</h2>
    <p style="color: #666; margin: 0 0 20px 0;">We've received your order! Please provide your delivery address so we can send it to you right away.</p>

    <div class="info-box">
      <p style="font-size: 14px; color: #333; margin: 0 0 8px 0;"><strong>Order #${delivery.order_id}</strong></p>
      <p style="font-size: 13px; color: #666; margin: 0;">Customer: ${delivery.customer_name}</p>
    </div>

    <h3 style="color: #333; margin: 20px 0 10px 0;">What We Need From You</h3>
    <p style="color: #666; margin: 0 0 15px 0;">
      To ensure your order arrives safely, please click the button below and fill in your delivery address, including your street address, city, postal code, and phone number.
    </p>

    <a href="${delivery.deliveryLink || 'https://the-blend-co.vercel.app/delivery/' + delivery.delivery_link_token}" class="cta-button">
      ➜ Provide Delivery Address
    </a>

    <h3 style="color: #333; margin: 20px 0 10px 0;">Why We Need This</h3>
    <ul style="color: #666; padding-left: 20px;">
      <li>Ensures accurate and timely delivery of your order</li>
      <li>Helps us contact you if there are any delivery questions</li>
      <li>Enables real-time tracking of your shipment</li>
    </ul>

    <div class="info-box">
      <p style="font-size: 13px; color: #666; margin: 0;">
        <strong>⏰ Note:</strong> This link expires in 7 days. Please complete your delivery details as soon as possible to avoid any delays.
      </p>
    </div>

    <p style="color: #666; margin: 20px 0;">
      If you have any questions or need assistance, please don't hesitate to contact our support team at support@thebland-co.com.
    </p>

    <div class="footer">
      <p style="margin: 5px 0;"><strong>The Blend.Co</strong></p>
      <p style="margin: 5px 0;">Premium Hair & Beauty, Crafted with Intention</p>
      <p style="margin: 5px 0;">Email: support@thebland-co.com</p>
      <p style="margin: 15px 0 0 0; color: #ccc;">© 2026 The Blend.Co. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
