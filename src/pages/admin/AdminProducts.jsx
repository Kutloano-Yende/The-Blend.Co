import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminProducts, deleteProduct } from '../../lib/adminProducts';
import './AdminProducts.css';

function formatZAR(amount) {
  return `R${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    setStatus('loading');
    fetchAdminProducts()
      .then((data) => {
        setProducts(data);
        setStatus('success');
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      alert(`Could not delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          + New Product
        </Link>
      </div>

      {status === 'loading' && <p>Loading products…</p>}
      {status === 'error' && <p className="admin-error">{errorMessage}</p>}

      {status === 'success' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.primaryImage ? (
                      <img src={product.primaryImage} alt="" className="admin-table-thumb" />
                    ) : (
                      <div className="admin-table-thumb admin-table-thumb-empty" />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.categoryLabel}</td>
                  <td>
                    {formatZAR(product.price)}
                    {product.original_price && (
                      <span className="admin-table-strike">{formatZAR(product.original_price)}</span>
                    )}
                  </td>
                  <td>{product.stock_quantity}</td>
                  <td>
                    <span className={`admin-status-badge ${product.is_archived ? 'is-archived' : 'is-active'}`}>
                      {product.is_archived ? 'Archived' : 'Active'}
                    </span>
                    {product.is_featured && <span className="admin-tag">Featured</span>}
                  </td>
                  <td className="admin-table-actions">
                    <Link to={`/admin/products/${product.id}`}>Edit</Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="admin-empty-row">No products yet.</p>}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
