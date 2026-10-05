/**
 * Paxi Shipping Integration Service
 * Handles shipment creation, tracking, and quote generation
 * API Documentation: https://www.paxi.co.za/
 */

const PAXI_API_BASE = 'https://api.paxi.co.za/v1';
const PAXI_API_KEY = import.meta.env.VITE_PAXI_API_KEY;

export const getPaxiShippingQuotes = async (shipmentData) => {
  /**
   * Get shipping quotes from Paxi for different service levels
   * @param {Object} shipmentData - Shipment details
   * @param {string} shipmentData.recipientEmail - Customer email
   * @param {string} shipmentData.recipientPhone - Customer phone
   * @param {Object} shipmentData.recipientAddress - Delivery address
   * @param {string} shipmentData.recipientAddress.street - Street address
   * @param {string} shipmentData.recipientAddress.city - City
   * @param {string} shipmentData.recipientAddress.postalCode - Postal code
   * @param {number} shipmentData.weight - Package weight in kg
   * @param {number} shipmentData.value - Package value in ZAR
   * @returns {Promise<Array>} Array of shipping options with prices
   */
  if (!PAXI_API_KEY) {
    console.warn('Paxi API key not configured');
    return getDefaultShippingOptions();
  }

  try {
    const response = await fetch(`${PAXI_API_BASE}/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAXI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to_address: {
          street: shipmentData.recipientAddress.street,
          city: shipmentData.recipientAddress.city,
          postal_code: shipmentData.recipientAddress.postalCode,
          country: 'ZA',
        },
        parcel: {
          weight: shipmentData.weight || 1,
          value: shipmentData.value || 0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Paxi API error: ${response.status}`);
    }

    const quotes = await response.json();

    // Format quotes for display
    return formatPaxiQuotes(quotes);
  } catch (error) {
    console.error('Error getting Paxi quotes:', error);
    // Return default options as fallback
    return getDefaultShippingOptions();
  }
};

export const createPaxiShipment = async (shipmentData) => {
  /**
   * Create a shipment in Paxi system
   * @param {Object} shipmentData - Complete shipment details
   * @returns {Promise<Object>} Shipment confirmation with tracking info
   */
  if (!PAXI_API_KEY) {
    throw new Error('Paxi API key not configured');
  }

  try {
    const response = await fetch(`${PAXI_API_BASE}/shipments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAXI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: shipmentData.orderId,
        service: shipmentData.service, // 'next-day', 'standard', etc.
        to_contact: {
          name: shipmentData.recipientName,
          email: shipmentData.recipientEmail,
          phone: shipmentData.recipientPhone,
        },
        to_address: {
          street: shipmentData.recipientAddress.street,
          city: shipmentData.recipientAddress.city,
          postal_code: shipmentData.recipientAddress.postalCode,
          country: 'ZA',
        },
        from_contact: {
          name: 'The Blend.Co',
          email: 'shipping@thebland-co.com',
          phone: '+27 XXX XXX XXXX', // Update with actual number
        },
        from_address: {
          street: 'Your Business Address',
          city: 'Your City',
          postal_code: 'Your Postal Code',
          country: 'ZA',
        },
        parcel: {
          description: shipmentData.description || 'Hair & Beauty Products',
          weight: shipmentData.weight || 1,
          value: shipmentData.value || 0,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Paxi error: ${error.message}`);
    }

    const shipment = await response.json();

    return {
      success: true,
      shipmentId: shipment.id,
      trackingNumber: shipment.tracking_number,
      trackingUrl: shipment.tracking_url,
      estimatedDelivery: shipment.estimated_delivery_date,
      cost: shipment.cost,
    };
  } catch (error) {
    console.error('Error creating Paxi shipment:', error);
    throw error;
  }
};

export const getPaxiTrackingInfo = async (trackingNumber) => {
  /**
   * Get tracking information for a shipment
   * @param {string} trackingNumber - Paxi tracking number
   * @returns {Promise<Object>} Tracking details
   */
  if (!PAXI_API_KEY) {
    throw new Error('Paxi API key not configured');
  }

  try {
    const response = await fetch(`${PAXI_API_BASE}/shipments/${trackingNumber}/tracking`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAXI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Paxi tracking error: ${response.status}`);
    }

    const tracking = await response.json();
    return formatTrackingInfo(tracking);
  } catch (error) {
    console.error('Error getting tracking info:', error);
    throw error;
  }
};

export const generatePaxiLabel = async (trackingNumber) => {
  /**
   * Generate a shipping label for a shipment
   * @param {string} trackingNumber - Paxi tracking number
   * @returns {Promise<string>} Label URL
   */
  if (!PAXI_API_KEY) {
    throw new Error('Paxi API key not configured');
  }

  try {
    const response = await fetch(
      `${PAXI_API_BASE}/shipments/${trackingNumber}/label`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${PAXI_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Paxi label error: ${response.status}`);
    }

    const label = await response.json();
    return label.label_url;
  } catch (error) {
    console.error('Error generating label:', error);
    throw error;
  }
};

// Helper Functions

function formatPaxiQuotes(quotes) {
  /**
   * Format Paxi quotes into display format
   */
  if (!quotes || !quotes.services) {
    return getDefaultShippingOptions();
  }

  return quotes.services.map(service => ({
    id: service.service_type,
    name: formatServiceName(service.service_type),
    price: Number(service.price),
    estimatedDays: service.estimated_days || 1,
    description: service.description,
    features: getServiceFeatures(service.service_type),
  }));
}

function formatServiceName(serviceType) {
  const names = {
    'express': 'Express (Next Day)',
    'standard': 'Standard (2-3 Days)',
    'economy': 'Economy (3-5 Days)',
  };
  return names[serviceType] || serviceType;
}

function getServiceFeatures(serviceType) {
  const features = {
    'express': ['Next day delivery', 'Real-time tracking', 'SMS notifications'],
    'standard': ['2-3 day delivery', 'Real-time tracking', 'Email tracking'],
    'economy': ['3-5 day delivery', 'Standard tracking', 'Email notification'],
  };
  return features[serviceType] || ['Basic tracking'];
}

function formatTrackingInfo(tracking) {
  /**
   * Format Paxi tracking response for display
   */
  return {
    status: tracking.status,
    statusDisplay: formatTrackingStatus(tracking.status),
    currentLocation: tracking.current_location || 'In transit',
    lastUpdate: tracking.last_update,
    estimatedDelivery: tracking.estimated_delivery,
    events: (tracking.events || []).map(event => ({
      date: event.timestamp,
      status: event.status,
      location: event.location,
      description: event.description,
    })),
  };
}

function formatTrackingStatus(status) {
  const statuses = {
    'pending': 'Pending Collection',
    'picked_up': 'Picked Up',
    'in_transit': 'In Transit',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'delivery_failed': 'Delivery Attempted',
  };
  return statuses[status] || status;
}

function getDefaultShippingOptions() {
  /**
   * Default shipping options when Paxi API is not available
   * Used for fallback/testing
   */
  return [
    {
      id: 'express',
      name: 'Express (Next Day)',
      price: 89.99,
      estimatedDays: 1,
      description: 'Get your order tomorrow',
      features: ['Next day delivery', 'Real-time tracking'],
    },
    {
      id: 'standard',
      name: 'Standard (2-3 Days)',
      price: 49.99,
      estimatedDays: 3,
      description: 'Reliable 2-3 day delivery',
      features: ['2-3 day delivery', 'Real-time tracking'],
    },
    {
      id: 'economy',
      name: 'Economy (3-5 Days)',
      price: 29.99,
      estimatedDays: 5,
      description: 'Budget-friendly option',
      features: ['3-5 day delivery', 'Standard tracking'],
    },
  ];
}

export { getDefaultShippingOptions };
