import { supabase } from './supabaseClient';
import crypto from 'crypto';

export const deliveryService = {
  // Generate unique token for delivery link
  generateToken: () => {
    return crypto.randomBytes(32).toString('hex');
  },

  // Create delivery address record for order (ONLY if order is paid)
  createDeliveryRecord: async (orderId, customerName, customerEmail) => {
    try {
      // Check if order exists and is paid
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('payment_status')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        console.error('Order not found:', orderId);
        return { success: false, error: 'Order not found' };
      }

      if (orderData.payment_status !== 'paid') {
        console.log('⚠️ Delivery record not created - order not paid yet:', orderId, orderData.payment_status);
        return { success: false, error: 'Order payment not confirmed yet' };
      }

      const token = Math.random().toString(36).substring(2, 15) +
                   Math.random().toString(36).substring(2, 15);

      const { data, error } = await supabase
        .from('delivery_addresses')
        .insert({
          order_id: orderId,
          customer_name: customerName,
          customer_email: customerEmail,
          delivery_link_token: token,
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
        deliveryLink: `/delivery/${token}`,
        fullLink: `${window.location.origin}/delivery/${token}`,
      };
    } catch (error) {
      console.error('Error creating delivery record:', error);
      return { success: false, error: error.message };
    }
  },

  // Get delivery address by token
  getDeliveryByToken: async (token) => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('delivery_link_token', token)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get delivery by order ID
  getDeliveryByOrderId: async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update delivery address
  updateDelivery: async (token, updates) => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('delivery_link_token', token)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all deliveries for admin (ONLY paid orders)
  getAllDeliveries: async (page = 1, limit = 20) => {
    try {
      const offset = (page - 1) * limit;

      // Join with orders table to only get deliveries from paid orders
      const { data, error, count } = await supabase
        .from('delivery_addresses')
        .select(`
          *,
          orders(payment_status)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Filter to only include paid orders
      const paidDeliveries = data.filter(d => d.orders?.payment_status === 'paid');

      return {
        success: true,
        data: paidDeliveries,
        total: paidDeliveries.length,
        page,
        totalPages: Math.ceil(paidDeliveries.length / limit),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search deliveries by order ID or email (ONLY paid orders)
  searchDeliveries: async (query) => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select(`
          *,
          orders(payment_status)
        `)
        .or(`order_id.ilike.%${query}%,customer_email.ilike.%${query}%,customer_name.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter to only include paid orders
      const paidDeliveries = data.filter(d => d.orders?.payment_status === 'paid');

      return { success: true, data: paidDeliveries };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get delivery status
  getDeliveryStatus: async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select('is_completed, completed_at, street_address, city, phone_number')
        .eq('order_id', orderId)
        .single();

      if (error) throw error;

      return {
        success: true,
        completed: data.is_completed,
        completedAt: data.completed_at,
        address: data.street_address ? {
          street: data.street_address,
          city: data.city,
          phone: data.phone_number,
        } : null,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get incomplete deliveries (for reminder emails) - ONLY paid orders
  getIncompleteDeliveries: async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select(`
          *,
          orders(payment_status)
        `)
        .eq('is_completed', false)
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;

      // Filter to only include paid orders
      const paidDeliveries = data.filter(d => d.orders?.payment_status === 'paid');

      return { success: true, data: paidDeliveries };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get pending deliveries (not yet completed but not expired) - ONLY paid orders
  getPendingDeliveries: async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_addresses')
        .select(`
          *,
          orders(payment_status)
        `)
        .eq('is_completed', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Filter to only include paid orders
      const paidDeliveries = data.filter(d => d.orders?.payment_status === 'paid');

      return { success: true, data: paidDeliveries };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
