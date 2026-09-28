import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminPromotions.css';

function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discount_percent: '',
    discount_amount: '',
    max_uses: '',
    valid_from: '',
    valid_until: '',
    active: true,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      setPromotions(data || []);
    } catch (err) {
      console.error('Error loading promotions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        code: formData.code.toUpperCase(),
        discount_percent: formData.discount_percent ? parseFloat(formData.discount_percent) : null,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        active: formData.active,
      };

      await supabase.from('promotions').insert([payload]);

      setFormData({
        name: '',
        code: '',
        discount_percent: '',
        discount_amount: '',
        max_uses: '',
        valid_from: '',
        valid_until: '',
        active: true,
      });
      setIsAdding(false);
      loadPromotions();
    } catch (err) {
      alert(`Error creating promotion: ${err.message}`);
    }
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await supabase.from('promotions').delete().eq('id', id);
      loadPromotions();
    } catch (err) {
      alert(`Error deleting promotion: ${err.message}`);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await supabase
        .from('promotions')
        .update({ active: !currentStatus })
        .eq('id', id);
      loadPromotions();
    } catch (err) {
      alert(`Error updating promotion: ${err.message}`);
    }
  };

  return (
    <div className="admin-promotions">
      <div className="admin-page-header">
        <h1>Promotions & Discounts</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : '+ New Promotion'}
        </button>
      </div>

      {isAdding && (
        <form className="promotion-form" onSubmit={handleAddPromotion}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Promotion Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Summer Sale"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="code">Code</label>
              <input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., SUMMER20"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="discount_percent">Discount %</label>
              <input
                id="discount_percent"
                name="discount_percent"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount_percent}
                onChange={handleInputChange}
                placeholder="e.g., 20"
              />
            </div>
            <div className="form-field">
              <label htmlFor="discount_amount">Discount Amount (R)</label>
              <input
                id="discount_amount"
                name="discount_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount_amount}
                onChange={handleInputChange}
                placeholder="e.g., 50"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="valid_from">Valid From</label>
              <input
                id="valid_from"
                name="valid_from"
                type="date"
                value={formData.valid_from}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="valid_until">Valid Until</label>
              <input
                id="valid_until"
                name="valid_until"
                type="date"
                value={formData.valid_until}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="max_uses">Max Uses</label>
              <input
                id="max_uses"
                name="max_uses"
                type="number"
                min="1"
                value={formData.max_uses}
                onChange={handleInputChange}
                placeholder="Unlimited if blank"
              />
            </div>
            <div className="form-field checkbox-field">
              <label htmlFor="active">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Promotion
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading promotions...</p>
      ) : promotions.length === 0 ? (
        <p className="empty-state">No promotions yet. Create your first one!</p>
      ) : (
        <div className="promotions-table-wrap">
          <table className="promotions-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Valid Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => {
                const from = promo.valid_from ? new Date(promo.valid_from).toLocaleDateString('en-ZA') : '—';
                const until = promo.valid_until ? new Date(promo.valid_until).toLocaleDateString('en-ZA') : '—';
                const discount = promo.discount_percent
                  ? `${promo.discount_percent}%`
                  : `R${promo.discount_amount}`;

                return (
                  <tr key={promo.id}>
                    <td className="code-cell">{promo.code}</td>
                    <td>{promo.name}</td>
                    <td>{discount}</td>
                    <td className="date-cell">{from} to {until}</td>
                    <td>
                      <button
                        className={`status-toggle ${promo.active ? 'active' : 'inactive'}`}
                        onClick={() => toggleActive(promo.id, promo.active)}
                      >
                        {promo.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePromotion(promo.id)}
                      >
                        Delete
                      </button>
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

export default AdminPromotions;
