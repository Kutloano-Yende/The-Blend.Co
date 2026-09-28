import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminCustomers.css';

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.auth.admin.listUsers();
      setCustomers(data?.users || []);
    } catch (err) {
      console.error('Error loading customers:', err.message);
      // Fallback: Load from orders table
      loadCustomersFromOrders();
    } finally {
      setLoading(false);
    }
  };

  const loadCustomersFromOrders = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('customer_email')
        .neq('customer_email', null);
      
      const uniqueEmails = [...new Set(data?.map(o => o.customer_email) || [])];
      const customerList = uniqueEmails.map((email, idx) => ({
        id: idx,
        email,
        created_at: new Date().toISOString(),
      }));
      setCustomers(customerList);
    } catch (err) {
      console.error('Error loading customers from orders:', err.message);
    }
  };

  const filteredCustomers = customers.filter(c =>
    (c.email || c.user_metadata?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-customers">
      <div className="admin-page-header">
        <h1>Customers</h1>
      </div>

      <div className="customers-search">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="customer-count">{filteredCustomers.length} customers</p>
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="empty-state">No customers yet</p>
      ) : (
        <div className="customers-table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Joined</th>
                <th>Last Sign In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const email = customer.email || customer.user_metadata?.email || 'Unknown';
                const joinedDate = new Date(customer.created_at).toLocaleDateString('en-ZA');
                const lastSignIn = customer.last_sign_in_at
                  ? new Date(customer.last_sign_in_at).toLocaleDateString('en-ZA')
                  : 'Never';

                return (
                  <tr key={customer.id}>
                    <td className="customer-email">{email}</td>
                    <td>{joinedDate}</td>
                    <td>{lastSignIn}</td>
                    <td>
                      <span className={`status-badge ${customer.confirmed_at ? 'confirmed' : 'unconfirmed'}`}>
                        {customer.confirmed_at ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
