import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/promotions', label: 'Promotions' },
];

function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">The Blend.Co</div>
        <Link to="/" className="admin-back-to-store">
          ← Back to Store
        </Link>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p className="admin-user-email">{user?.email}</p>
          <button type="button" className="admin-signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
