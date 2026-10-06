import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './DeliveryForm.css';

function DeliveryForm({ token }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const [formData, setFormData] = useState({
    street_address: '',
    city: '',
    postal_code: '',
    phone_number: '',
  });

  useEffect(() => {
    loadDeliveryForm();
  }, [token]);

  const loadDeliveryForm = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('delivery_addresses')
        .select('*')
        .eq('delivery_link_token', token)
        .single();

      if (fetchError) {
        setError('Invalid or expired delivery link');
        return;
      }

      if (data.is_completed) {
        setError('This delivery form has already been completed');
        return;
      }

      // Check if link has expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This delivery link has expired');
        return;
      }

      setDelivery(data);
      setFormData({
        street_address: data.street_address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        phone_number: data.phone_number || '',
      });
    } catch (err) {
      setError('Error loading delivery form: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.street_address.trim()) {
      setError('Street address is required');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    if (!formData.postal_code.trim()) {
      setError('Postal code is required');
      return;
    }
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return;
    }

    try {
      setSubmitting(true);

      // Update delivery address
      const { error: updateError } = await supabase
        .from('delivery_addresses')
        .update({
          ...formData,
          is_completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('delivery_link_token', token);

      if (updateError) throw updateError;

      setSuccess(true);
    } catch (err) {
      setError('Error submitting form: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="delivery-form-container">
        <div className="loading">Loading delivery form...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="delivery-form-container">
        <div className="success-message">
          <h2>✓ Thank you!</h2>
          <p>Your delivery address has been received successfully.</p>
          <p>We'll process your order and send you a tracking update soon.</p>
          <div className="blend-signature">
            <p>The Blend.Co</p>
            <p className="small">Hair & Beauty Store</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-form-container">
      <div className="delivery-form-wrapper">
        <div className="form-header">
          <h1>Delivery Details</h1>
          <p>Please provide your delivery address to complete your order</p>
        </div>

        {delivery && (
          <div className="customer-info">
            <p><strong>Order ID:</strong> {delivery.order_id}</p>
            <p><strong>Customer:</strong> {delivery.customer_name}</p>
            <p><strong>Email:</strong> {delivery.customer_email}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="delivery-form">
          <div className="form-group">
            <label htmlFor="street_address">Street Address *</label>
            <input
              type="text"
              id="street_address"
              name="street_address"
              placeholder="e.g., 123 Main Street"
              value={formData.street_address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City / Town *</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="e.g., Johannesburg"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="postal_code">Postal Code *</label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              placeholder="e.g., 2000"
              value={formData.postal_code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number *</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              placeholder="e.g., +27 63 123 4567"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Delivery Address'}
          </button>
        </form>

        <div className="form-footer">
          <div className="blend-signature">
            <p>The Blend.Co</p>
            <p className="small">Hair & Beauty Store</p>
          </div>
          <p className="security-note">
            Your information is secure and will only be used for delivery purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryForm;
