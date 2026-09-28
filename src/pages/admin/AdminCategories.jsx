import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminCategories.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.trim() }]);

      if (error) throw error;
      setNewCategory('');
      loadCategories();
    } catch (err) {
      alert(`Error adding category: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await supabase.from('categories').delete().eq('id', id);
      loadCategories();
    } catch (err) {
      alert(`Error deleting category: ${err.message}`);
    }
  };

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <h1>Categories</h1>
      </div>

      <form onSubmit={handleAddCategory} className="add-category-form">
        <input
          type="text"
          placeholder="New category name..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          disabled={saving}
        />
        <button type="submit" disabled={saving || !newCategory.trim()}>
          {saving ? 'Adding...' : '+ Add Category'}
        </button>
      </form>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="empty-state">No categories yet</p>
      ) : (
        <div className="categories-list">
          <ul>
            {categories.map((cat) => (
              <li key={cat.id} className="category-item">
                <span>{cat.name}</span>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteCategory(cat.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
