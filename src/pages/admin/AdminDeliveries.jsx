import { useState, useEffect } from 'react';
import { deliveryService } from '../../lib/deliveryService';
import { sendOrderEmail } from '../../lib/emailService';
import './AdminDeliveries.css';

function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [resendMessage, setResendMessage] = useState({ type: '', text: '' });
  const [customerEmails, setCustomerEmails] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    loadDeliveries();
  }, []);

  useEffect(() => {
    loadCustomerEmails();
  }, []);

  const loadCustomerEmails = async () => {
    try {
      const uniqueEmails = [...new Set(deliveries.map(d => d.customer_email))].filter(Boolean).sort();
      setCustomerEmails(uniqueEmails);
    } catch (err) {
      console.error('Error loading customer emails:', err.message);
    }
  };


  useEffect(() => {
    applyFilters();
  }, [deliveries, searchTerm, filterStatus]);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const result = await deliveryService.getAllDeliveries();
      if (result.success) {
        setDeliveries(result.data || []);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = deliveries;

    if (selectedCustomer) {
      filtered = filtered.filter(d => d.customer_email === selectedCustomer);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(d =>
        filterStatus === 'completed' ? d.is_completed : !d.is_completed
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeliveries(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadgeClass = (isCompleted) => {
    return isCompleted ? 'status-badge completed' : 'status-badge pending';
  };

  const getStatusText = (isCompleted) => {
    return isCompleted ? '✓ Completed' : '⏳ Pending';
  };

  const resendDeliveryEmail = async (delivery) => {
    if (!window.confirm(`Resend delivery form link to ${delivery.customer_email}?`)) {
      return;
    }

    setResendingId(delivery.id);
    setResendMessage({ type: '', text: '' });

    try {
      const deliveryLink = `${window.location.origin}/delivery/${delivery.delivery_link_token}`;

      await sendOrderEmail('deliveryForm', {
        order_id: delivery.order_id,
        customer_name: delivery.customer_name,
        customer_email: delivery.customer_email,
        deliveryLink: deliveryLink,
        delivery_link_token: delivery.delivery_link_token,
      }, delivery.customer_email);

      setResendMessage({
        type: 'success',
        text: `✓ Delivery form link sent to ${delivery.customer_email}`
      });
      setTimeout(() => setResendMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setResendMessage({
        type: 'error',
        text: `Error sending email: ${error.message}`
      });
    } finally {
      setResendingId(null);
    }
  };

  const stats = {
    total: deliveries.length,
    completed: deliveries.filter(d => d.is_completed).length,
    pending: deliveries.filter(d => !d.is_completed).length,
  };

  if (loading) {
    return (
      <div className="admin-deliveries">
        <div className="loading">Loading deliveries...</div>
      </div>
    );
  }

  return (
    <div className="admin-deliveries">
      <div className="admin-page-header">
        <h1>Customer Deliveries</h1>
        <p>Manage and track customer delivery addresses</p>
      </div>

      {/* Status Messages */}
      {resendMessage.text && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: resendMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            color: resendMessage.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${resendMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          {resendMessage.text}
        </div>
      )}

      {/* Statistics */}
      <div className="deliveries-stats">
        <div className="stat-card">
          <h4>Total Submissions</h4>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Completed</h4>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <h4>Pending</h4>
          <p className="stat-number">{stats.pending}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="deliveries-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by order ID, email, or name..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        <select
          className="filter-select"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">All Customers ({customerEmails.length})</option>
          {customerEmails.map(email => (
            <option key={email} value={email}>{email}</option>
          ))}
        </select>
      </div>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <div className="empty-state">
          No deliveries found
        </div>
      ) : (
        <div className="deliveries-list">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery.id} className="delivery-card">
              <div
                className="delivery-header"
                onClick={() => toggleExpand(delivery.id)}
              >
                <div className="delivery-main-info">
                  <div>
                    <p className="order-id">Order #{delivery.order_id}</p>
                  </div>
                  <div>
                    <p className="customer-name">{delivery.customer_name}</p>
                    <p className="customer-email">{delivery.customer_email}</p>
                  </div>
                </div>

                <div className="delivery-status-info">
                  <span className={getStatusBadgeClass(delivery.is_completed)}>
                    {getStatusText(delivery.is_completed)}
                  </span>
                  <span className="expand-icon">
                    {expandedId === delivery.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {expandedId === delivery.id && (
                <div className="delivery-details">
                  {delivery.is_completed ? (
                    <>
                      <div className="details-grid">
                        <div className="detail-item">
                          <label>Street Address</label>
                          <p>{delivery.street_address || 'Not provided'}</p>
                        </div>
                        <div className="detail-item">
                          <label>City</label>
                          <p>{delivery.city || 'Not provided'}</p>
                        </div>
                        <div className="detail-item">
                          <label>Postal Code</label>
                          <p>{delivery.postal_code || 'Not provided'}</p>
                        </div>
                        <div className="detail-item">
                          <label>Phone Number</label>
                          <p>{delivery.phone_number || 'Not provided'}</p>
                        </div>
                        <div className="detail-item">
                          <label>Completed At</label>
                          <p>
                            {new Date(delivery.completed_at).toLocaleDateString('en-ZA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {delivery.street_address && (
                        <div className="address-summary" style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                          <strong>Delivery Address:</strong>
                          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                            {delivery.street_address}<br />
                            {delivery.city}, {delivery.postal_code}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="pending-notice">
                      <p>⏳ This customer has not yet provided their delivery address.</p>
                      <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                        Link expires: {new Date(delivery.expires_at).toLocaleDateString('en-ZA')}
                      </p>
                      <button
                        type="button"
                        className="resend-email-btn"
                        onClick={() => resendDeliveryEmail(delivery)}
                        disabled={resendingId === delivery.id}
                        style={{
                          marginTop: '12px',
                          padding: '8px 16px',
                          backgroundColor: '#8B5A6F',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600',
                          opacity: resendingId === delivery.id ? 0.6 : 1,
                        }}
                      >
                        {resendingId === delivery.id ? 'Sending...' : 'Resend Email'}
                      </button>
                    </div>
                  )}

                  <div className="details-footer">
                    <p style={{ fontSize: '12px', color: '#999', margin: '0' }}>
                      Created: {new Date(delivery.created_at).toLocaleDateString('en-ZA')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDeliveries;
