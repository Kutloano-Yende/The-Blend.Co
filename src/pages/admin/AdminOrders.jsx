import './AdminComingSoon.css';

function AdminOrders() {
  return (
    <div className="admin-coming-soon">
      <div className="coming-soon-card">
        <h1>📦 Orders Management</h1>
        <p>Track and manage customer orders, shipments, and delivery status.</p>
        <div className="feature-list">
          <ul>
            <li>View all customer orders</li>
            <li>Update order status</li>
            <li>Track shipments</li>
            <li>Generate invoices</li>
            <li>Export order reports</li>
          </ul>
        </div>
        <p className="coming-soon-message">Coming Soon</p>
      </div>
    </div>
  );
}

export default AdminOrders;
