import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Get products count
      const { data: products } = await supabase
        .from('products')
        .select('id, stock_quantity', { count: 'exact' });

      // Get categories count
      const { data: categories } = await supabase
        .from('categories')
        .select('id', { count: 'exact' });

      const activeCount = products?.filter(p => p.stock_quantity > 0).length || 0;
      const outOfStockCount = products?.filter(p => p.stock_quantity === 0).length || 0;

      setStats({
        totalProducts: products?.length || 0,
        totalCategories: categories?.length || 0,
        activeProducts: activeCount,
        outOfStock: outOfStockCount,
      });
    } catch (err) {
      console.error('Error loading stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Store Overview</p>

      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Products</h3>
            <p className="dashboard-stat">{stats.totalProducts}</p>
          </div>

          <div className="dashboard-card">
            <h3>Categories</h3>
            <p className="dashboard-stat">{stats.totalCategories}</p>
          </div>

          <div className="dashboard-card dashboard-card-active">
            <h3>In Stock</h3>
            <p className="dashboard-stat">{stats.activeProducts}</p>
          </div>

          <div className="dashboard-card dashboard-card-warning">
            <h3>Out of Stock</h3>
            <p className="dashboard-stat">{stats.outOfStock}</p>
          </div>
        </div>
      )}

      <div className="dashboard-info">
        <h2>Quick Links</h2>
        <ul>
          <li><a href="/admin/products">Manage Products</a></li>
          <li><a href="/admin/terms">Update Store Policies</a></li>
          <li><a href="/admin/categories">Manage Categories</a></li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
