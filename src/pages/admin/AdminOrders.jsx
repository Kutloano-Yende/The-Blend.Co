import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminOrders.css';

function formatZAR(amount) {
  return `R${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const { data } = await supabase
        .from('delivery_addresses')
        .select('*');
      setDeliveries(data || []);
    } catch (err) {
      console.error('Error loading deliveries:', err.message);
      setDeliveries([]);
    }
  };

  const getDeliveryInfo = (order) => {
    const customerEmail = getCustomerInfo(order);
    return deliveries.find(d => d.customer_email === customerEmail);
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err.message);
      // Fallback: load orders without items
      const { data: fallbackData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders(fallbackData || []);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      loadOrders();
    } catch (err) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  const getCustomerInfo = (order) => {
    // Try multiple possible field names for customer email
    return order.customer_email ||
           order.user_email ||
           order.email ||
           order.customer?.email ||
           order.user?.email ||
           'Unknown Customer';
  };

  const getOrderTotal = (order) => {
    // Try multiple possible field names for total
    return order.total_amount ||
           order.total ||
           order.amount ||
           order.price ||
           0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => (o.status || 'pending') === filter);

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1>Orders</h1>
      </div>

      <div className="orders-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="empty-state">No orders found</p>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Email</th>
                <th>Products</th>
                <th>Total</th>
                <th>Order Status</th>
                <th>Delivery Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const items = order.order_items || [];
                const customerInfo = getCustomerInfo(order);
                const orderTotal = getOrderTotal(order);
                const orderNumber = String(idx + 1).padStart(5, '0');

                return (
                  <tr key={order.id}>

                    <td className="order-id">#ORD-{orderNumber}</td>
                    <td className="customer-email">{customerInfo}</td>
                    <td className="product-count">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                    <td className="order-total">{formatZAR(orderTotal)}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        const delivery = getDeliveryInfo(order);
                        if (!delivery) {
                          return <span className="status-badge status-pending">⏳ Not Started</span>;
                        }
                        return (
                          <span className={`status-badge ${delivery.is_completed ? 'status-completed' : 'status-pending'}`}>
                            {delivery.is_completed ? '✓ Address Received' : '⏳ Pending'}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="order-date">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-ZA') : 'N/A'}
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#8B5A6F',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (() => {
        const selectedOrder = orders.find(o => o.id === selectedOrderId);
        const delivery = getDeliveryInfo(selectedOrder);
        const items = selectedOrder?.order_items || [];
        const customerEmail = getCustomerInfo(selectedOrder);
        const orderNumber = orders.findIndex(o => o.id === selectedOrderId) + 1;

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '90%',
              maxWidth: '800px',
              padding: '30px',
            }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #eee', paddingBottom: '15px' }}>
                <h2 style={{ margin: 0 }}>Order #ORD-{String(orderNumber).padStart(5, '0')}</h2>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Order Info */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>📋 Order Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px' }}>
                  <div>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Customer Email:</strong></p>
                    <p style={{ margin: '0', fontSize: '15px' }}>{customerEmail}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Total:</strong></p>
                    <p style={{ margin: '0', fontSize: '15px' }}>{formatZAR(getOrderTotal(selectedOrder))}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Order Status:</strong></p>
                    <select
                      value={selectedOrder.status || 'pending'}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder.id, e.target.value);
                        setSelectedOrderId(null);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Order Date:</strong></p>
                    <p style={{ margin: '0', fontSize: '15px' }}>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('en-ZA') : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>📦 Products ({items.length})</h3>
                {items.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {items.map((item, idx) => (
                      <div key={idx} style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #8B5A6F' }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>{item.product_name || item.name || 'Unknown Product'}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px', color: '#666' }}>
                          <p style={{ margin: 0 }}>Quantity: {item.quantity || 1}</p>
                          <p style={{ margin: 0 }}>Price: {formatZAR(item.price || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#999' }}>No items in this order</p>
                )}
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ marginBottom: '15px', color: '#333' }}>📍 Delivery Address</h3>
                {delivery ? (
                  <div style={{ backgroundColor: '#f0f8f0', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #28a745' }}>
                    <p style={{ margin: '0 0 12px 0' }}><strong>Status:</strong> {delivery.is_completed ? '✓ Completed' : '⏳ Pending'}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Street Address:</strong></p>
                        <p style={{ margin: '0', fontSize: '15px' }}>{delivery.street_address || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>City:</strong></p>
                        <p style={{ margin: '0', fontSize: '15px' }}>{delivery.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Postal Code:</strong></p>
                        <p style={{ margin: '0', fontSize: '15px' }}>{delivery.postal_code || 'Not provided'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Phone Number:</strong></p>
                        <p style={{ margin: '0', fontSize: '15px' }}>{delivery.phone_number || 'Not provided'}</p>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}><strong>Submitted Date:</strong></p>
                        <p style={{ margin: '0', fontSize: '15px' }}>{delivery.completed_at ? new Date(delivery.completed_at).toLocaleDateString('en-ZA') : 'Not submitted'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
                    <p style={{ margin: '0', color: '#856404' }}>⏳ Delivery address not yet provided. Customer needs to submit their address.</p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
