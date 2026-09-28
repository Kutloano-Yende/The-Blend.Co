import './AdminComingSoon.css';

function AdminCustomers() {
  return (
    <div className="admin-coming-soon">
      <div className="coming-soon-card">
        <h1>👥 Customer Management</h1>
        <p>View and manage customer information, contact details, and purchase history.</p>
        <div className="feature-list">
          <ul>
            <li>View all customers</li>
            <li>Customer profiles & history</li>
            <li>Communication history</li>
            <li>Export customer data</li>
            <li>Customer segmentation</li>
          </ul>
        </div>
        <p className="coming-soon-message">Coming Soon</p>
      </div>
    </div>
  );
}

export default AdminCustomers;
