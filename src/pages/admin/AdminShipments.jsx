import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { getPaxiTrackingInfo, generatePaxiLabel } from '../../lib/paxiService';
import './AdminShipments.css';

function AdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedShipment, setExpandedShipment] = useState(null);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });
      setShipments(data || []);
    } catch (err) {
      console.error('Error loading shipments:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending_collection': '#ff9800',
      'picked_up': '#2196f3',
      'in_transit': '#00bcd4',
      'out_for_delivery': '#4caf50',
      'delivered': '#2e7d32',
      'delivery_failed': '#f44336',
    };
    return colors[status] || '#999';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending_collection': 'Pending Collection',
      'picked_up': 'Picked Up',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'delivery_failed': 'Delivery Failed',
    };
    return labels[status] || status;
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch =
      shipment.tracking_number?.includes(searchTerm) ||
      shipment.order_id?.includes(searchTerm) ||
      shipment.recipient_email?.includes(searchTerm);

    const matchesFilter = filter === 'all' || shipment.status === filter;

    return matchesSearch && matchesFilter;
  });

  const toggleExpanded = (shipmentId) => {
    setExpandedShipment(expandedShipment === shipmentId ? null : shipmentId);
  };

  const downloadLabel = async (trackingNumber) => {
    try {
      const labelUrl = await generatePaxiLabel(trackingNumber);
      window.open(labelUrl, '_blank');
    } catch (error) {
      alert(`Error downloading label: ${error.message}`);
    }
  };

  return (
    <div className="admin-shipments">
      <div className="admin-page-header">
        <h1>Shipments & Tracking</h1>
      </div>

      <div className="shipments-controls">
        <input
          type="text"
          placeholder="Search by tracking #, order ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending_collection">Pending Collection</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="delivery_failed">Delivery Failed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading shipments...</p>
      ) : filteredShipments.length === 0 ? (
        <p className="empty-state">No shipments found</p>
      ) : (
        <div className="shipments-list">
          {filteredShipments.map((shipment) => {
            const isExpanded = expandedShipment === shipment.id;

            return (
              <div key={shipment.id} className="shipment-card">
                <div
                  className="shipment-header"
                  onClick={() => toggleExpanded(shipment.id)}
                >
                  <div className="shipment-main-info">
                    <div>
                      <p className="shipment-tracking">
                        #{shipment.tracking_number || 'No Tracking'}
                      </p>
                      <p className="shipment-order">Order #{shipment.order_id?.slice(0, 8) || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="shipment-recipient">{shipment.recipient_name}</p>
                      <p className="shipment-city">{shipment.recipient_city}</p>
                    </div>
                  </div>

                  <div className="shipment-status-info">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(shipment.status) }}
                    >
                      {getStatusLabel(shipment.status)}
                    </span>
                    <span className="expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="shipment-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <label>Tracking Number</label>
                        <p>{shipment.tracking_number || 'Not assigned'}</p>
                      </div>
                      <div className="detail-item">
                        <label>Service Type</label>
                        <p>{shipment.service_type || 'Standard'}</p>
                      </div>
                      <div className="detail-item">
                        <label>Shipping Cost</label>
                        <p>R{Number(shipment.shipping_cost || 0).toFixed(2)}</p>
                      </div>
                      <div className="detail-item">
                        <label>Estimated Delivery</label>
                        <p>
                          {shipment.estimated_delivery
                            ? new Date(shipment.estimated_delivery).toLocaleDateString('en-ZA')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="recipient-details">
                      <h4>Delivery Address</h4>
                      <p>{shipment.recipient_street}</p>
                      <p>{shipment.recipient_city}, {shipment.recipient_postal_code}</p>
                      <p>Email: {shipment.recipient_email}</p>
                      <p>Phone: {shipment.recipient_phone}</p>
                    </div>

                    <div className="shipment-actions">
                      {shipment.tracking_number && (
                        <>
                          <a
                            href={shipment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn primary"
                          >
                            View Tracking
                          </a>
                          <button
                            onClick={() => downloadLabel(shipment.tracking_number)}
                            className="action-btn"
                          >
                            Download Label
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="shipments-stats">
        <div className="stat-card">
          <h4>Total Shipments</h4>
          <p className="stat-number">{shipments.length}</p>
        </div>
        <div className="stat-card">
          <h4>Delivered</h4>
          <p className="stat-number" style={{ color: '#2e7d32' }}>
            {shipments.filter(s => s.status === 'delivered').length}
          </p>
        </div>
        <div className="stat-card">
          <h4>In Transit</h4>
          <p className="stat-number" style={{ color: '#00bcd4' }}>
            {shipments.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length}
          </p>
        </div>
        <div className="stat-card">
          <h4>Issues</h4>
          <p className="stat-number" style={{ color: '#f44336' }}>
            {shipments.filter(s => s.status === 'delivery_failed').length}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminShipments;
