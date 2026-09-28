import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminOrders.css';

function formatZAR(amount) {
  return `R${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

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
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const items = order.order_items || [];

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
                    <td className="order-id">#{order.id.slice(0, 8)}</td>
                    <td className="customer-email">{order.customer_email || 'N/A'}</td>
                    <td className="product-count">{items.length} item{items.length !== 1 ? 's' : ''}</td>
                    <td className="order-total">{formatZAR(order.total_amount || 0)}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="order-date">
                      {new Date(order.created_at).toLocaleDateString('en-ZA')}
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

          {expandedOrderId && (
            <div className="order-details">
              {filteredOrders.find(o => o.id === expandedOrderId)?.order_items?.map((item, idx) => (
                <div key={idx} className="order-item">
                  <h4>{item.product_name || item.name || 'Unknown Product'}</h4>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Price: {formatZAR(item.price || 0)}</p>
                  {item.product_id && <p>Product ID: {item.product_id}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
