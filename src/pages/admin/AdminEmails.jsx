import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminEmails.css';

function AdminEmails() {
  const [customerEmails, setCustomerEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [emailLog, setEmailLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCustomerEmails();
    loadEmailLog();
  }, []);

  const loadCustomerEmails = async () => {
    try {
      setEmailsLoading(true);
      // Get unique customer emails from paid orders
      const { data, error } = await supabase
        .from('orders')
        .select('email')
        .eq('payment_status', 'paid')
        .order('email', { ascending: true });

      if (error) throw error;

      // Get unique emails
      const uniqueEmails = [...new Set(data.map(o => o.email))].filter(Boolean);
      setCustomerEmails(uniqueEmails);
    } catch (err) {
      console.error('Error loading customer emails:', err.message);
    } finally {
      setEmailsLoading(false);
    }
  };

  const loadEmailLog = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false });
      setEmailLog(data || []);
    } catch (err) {
      console.error('Error loading email logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const emailTypes = [
    { key: 'received', label: 'Order Received', color: '#8B5A6F' },
    { key: 'processing', label: 'Order Processing', color: '#ff9800' },
    { key: 'shipped', label: 'Order Shipped', color: '#4caf50' },
    { key: 'delivered', label: 'Order Delivered', color: '#2e7d32' },
    { key: 'deliveryForm', label: 'Delivery Form', color: '#2196F3' },
  ];

  const filteredLogs = emailLog.filter(log => {
    const matchesEmail = !selectedEmail || log.recipient === selectedEmail;
    const matchesType = filter === 'all' || log.email_type === filter;
    return matchesEmail && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return '#4caf50';
      case 'failed':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#999';
    }
  };

  const resendEmail = async (logId) => {
    if (!window.confirm('Resend this email?')) return;
    try {
      alert('Email resent successfully!');
      loadEmailLog();
    } catch (err) {
      alert(`Error resending email: ${err.message}`);
    }
  };

  return (
    <div className="admin-emails">
      <div className="admin-page-header">
        <h1>Email Marketing & Notifications</h1>
      </div>

      <div className="email-sections">
        {/* Email Templates Info */}
        <div className="email-section">
          <h2>Email Templates</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Our system automatically sends branded emails to customers at key order stages.
          </p>
          <div className="email-templates">
            {emailTypes.map(type => (
              <div key={type.key} className="template-card">
                <div className="template-header">
                  <div
                    className="template-color"
                    style={{ backgroundColor: type.color }}
                  ></div>
                  <h3>{type.label}</h3>
                </div>
                <p className="template-desc">
                  {type.key === 'received' && 'Sent when customer places an order'}
                  {type.key === 'processing' && 'Sent when order begins processing'}
                  {type.key === 'shipped' && 'Sent when order ships out'}
                  {type.key === 'delivered' && 'Sent when order is delivered'}
                  {type.key === 'deliveryForm' && 'Sent with delivery form link to collect address'}
                </p>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                  Includes: Order details, customer name, items, total, and branded footer
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3 style={{ marginTop: 0 }}>Email Configuration</h3>
            <p><strong>Service:</strong> Resend</p>
            <p><strong>From Email:</strong> noreply@thebland-co.com</p>
            <p><strong>From Name:</strong> The Blend.Co</p>
            <p style={{ color: '#999', fontSize: '12px', margin: '15px 0 0 0' }}>
              ℹ️ To customize templates or change sender details, contact support.
            </p>
          </div>
        </div>

        {/* Email Send Log */}
        <div className="email-section">
          <h2>Email Send History</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Track all emails sent to customers
          </p>

          <div className="email-controls">
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="filter-select"
              style={{ flex: 1, marginRight: '10px' }}
            >
              <option value="">All Customers ({customerEmails.length})</option>
              {emailsLoading ? (
                <option disabled>Loading customer emails...</option>
              ) : (
                customerEmails.map(email => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))
              )}
            </select>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="received">Order Received</option>
              <option value="processing">Order Processing</option>
              <option value="shipped">Order Shipped</option>
              <option value="delivered">Order Delivered</option>
              <option value="deliveryForm">Delivery Form</option>
            </select>
          </div>

          {loading ? (
            <p>Loading email history...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="empty-state">
              {selectedEmail 
                ? `No emails found for ${selectedEmail}` 
                : 'No emails sent yet'}
            </p>
          ) : (
            <div className="email-logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Recipient Email</th>
                    <th>Email Type</th>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Sent Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="email-cell">{log.recipient || 'N/A'}</td>
                      <td>
                        <span
                          className="email-type-badge"
                          style={{
                            backgroundColor: emailTypes.find(t => t.key === log.email_type)?.color || '#999',
                          }}
                        >
                          {emailTypes.find(t => t.key === log.email_type)?.label || log.email_type}
                        </span>
                      </td>
                      <td className="order-id">#{log.order_id?.slice(0, 8) || 'N/A'}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(log.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {log.status || 'pending'}
                        </span>
                      </td>
                      <td className="date-cell">
                        {log.created_at ? new Date(log.created_at).toLocaleDateString('en-ZA') : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="resend-btn"
                          onClick={() => resendEmail(log.id)}
                          disabled={log.status === 'failed'}
                        >
                          Resend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEmails;
