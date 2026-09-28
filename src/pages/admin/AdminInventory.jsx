import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminInventory.css';

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('id, name, stock_quantity, price')
        .order('name');
      setInventory(data || []);
    } catch (err) {
      console.error('Error loading inventory:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', productId);
      loadInventory();
    } catch (err) {
      alert(`Error updating stock: ${err.message}`);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 5) return 'low-stock';
    return 'in-stock';
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'low') return item.stock_quantity < 5 && item.stock_quantity > 0;
    if (filter === 'out') return item.stock_quantity === 0;
    return true;
  });

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(i => i.stock_quantity < 5 && i.stock_quantity > 0).length,
    outOfStock: inventory.filter(i => i.stock_quantity === 0).length,
  };

  return (
    <div className="admin-inventory">
      <div className="admin-page-header">
        <h1>Inventory Management</h1>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card warning">
          <h3>Low Stock</h3>
          <p className="stat-number">{stats.lowStock}</p>
        </div>
        <div className="stat-card danger">
          <h3>Out of Stock</h3>
          <p className="stat-number">{stats.outOfStock}</p>
        </div>
      </div>

      <div className="inventory-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Products
        </button>
        <button
          className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
          onClick={() => setFilter('low')}
        >
          Low Stock
        </button>
        <button
          className={`filter-btn ${filter === 'out' ? 'active' : ''}`}
          onClick={() => setFilter('out')}
        >
          Out of Stock
        </button>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : inventory.length === 0 ? (
        <p className="empty-state">No products in inventory</p>
      ) : (
        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td className="product-name">{item.name}</td>
                  <td className="stock-quantity">{item.stock_quantity} units</td>
                  <td>
                    <span className={`status-badge ${getStockStatus(item.stock_quantity)}`}>
                      {getStockStatus(item.stock_quantity).replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.stock_quantity}
                      onChange={(e) => updateStock(item.id, parseInt(e.target.value) || 0)}
                      className="stock-input"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminInventory;
