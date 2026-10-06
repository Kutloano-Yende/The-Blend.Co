import { useState, useEffect } from 'react';
import { deliveryService } from '../../lib/deliveryService';
import './AdminDeliveries.css';

function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadDeliveries();
  }, []);

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
