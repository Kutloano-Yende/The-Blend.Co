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
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
                <th style={{ width: '40px' }}></th>
                <th>Order ID</th>
                <th>Customer Email</th>
                <th>Products</th>
                <th>Total</th>
                <th>Order Status</th>
                <th>Delivery Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const isExpanded = expandedOrderId === order.id;
                const items = order.order_items || [];
                const customerInfo = getCustomerInfo(order);
                const orderTotal = getOrderTotal(order);
                const orderNumber = String(idx + 1).padStart(5, '0');

                return (
                  <tr key={order.id} className={isExpanded ? 'expanded' : ''}>
                    <td>
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      >
                        {isExpanded ? '▼' : '▶'}
                      </button>
                    </td>
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
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {expandedOrderId && (() => {
            const expandedOrder = filteredOrders.find(o => o.id === expandedOrderId);
            const delivery = getDeliveryInfo(expandedOrder);
            const items = expandedOrder?.order_items || [];

            return (
              <div className="order-details">
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                  <h3 style={{ marginBottom: '10px' }}>Products</h3>
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <h4>{item.product_name || item.name || 'Unknown Product'}</h4>
                        <p>Quantity: {item.quantity || 1}</p>
                        <p>Price: {formatZAR(item.price || 0)}</p>
                        {item.product_id && <p>Product ID: {item.product_id}</p>}
                      </div>
                    ))
                  ) : (
                    <p>No items in this order</p>
                  )}
                </div>

                {delivery && (
                  <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
                    <h3 style={{ marginBottom: '10px' }}>Delivery Address</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p><strong>Status:</strong> {delivery.is_completed ? '✓ Completed' : '⏳ Pending'}</p>
                        <p><strong>Street:</strong> {delivery.street_address || 'Not provided'}</p>
                        <p><strong>City:</strong> {delivery.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p><strong>Postal Code:</strong> {delivery.postal_code || 'Not provided'}</p>
                        <p><strong>Phone:</strong> {delivery.phone_number || 'Not provided'}</p>
                        <p><strong>Submitted:</strong> {delivery.completed_at ? new Date(delivery.completed_at).toLocaleDateString('en-ZA') : 'Not submitted'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
