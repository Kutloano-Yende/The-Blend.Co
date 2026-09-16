import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchAdminProduct,
  fetchCategoryOptions,
  createProduct,
  updateProduct,
  uploadProductImage,
  toSlug,
} from '../../lib/adminProducts';
import './AdminProductForm.css';

const emptyForm = {
  name: '',
  slug: '',
  category_id: '',
  price: '',
  original_price: '',
  stock_quantity: '0',
  description: '',
  details_heading: '',
  details_content: '',
  care_content: '',
  is_featured: false,
  is_new_arrival: false,
  is_archived: false,
  primaryImageUrl: '',
};

function AdminProductForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState(isEditMode ? 'loading' : 'ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategoryOptions().then(setCategories).catch((err) => setErrorMessage(err.message));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;
    fetchAdminProduct(id)
      .then((product) => {
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          category_id: product.category_id || '',
          price: product.price ?? '',
          original_price: product.original_price ?? '',
          stock_quantity: product.stock_quantity ?? '0',
          description: product.description || '',
          details_heading: product.details_heading || '',
          details_content: product.details_content || '',
          care_content: product.care_content || '',
          is_featured: product.is_featured || false,
          is_new_arrival: product.is_new_arrival || false,
          is_archived: product.is_archived || false,
          primaryImageUrl: product.primaryImageUrl || '',
        });
        setStatus('ready');
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'name' && !slugTouched) {
      setFormData((prev) => ({ ...prev, slug: toSlug(value) }));
    }
    if (name === 'slug') setSlugTouched(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage('');
    setIsUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, primaryImageUrl: url }));
    } catch (err) {
      setErrorMessage(`Image upload failed: ${err.message}`);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSaving(true);

    const payload = {
      name: formData.name,
      slug: formData.slug,
      category_id: formData.category_id,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      stock_quantity: Number(formData.stock_quantity),
      description: formData.description || null,
      details_heading: formData.details_heading || null,
      details_content: formData.details_content || null,
      care_content: formData.care_content || null,
      is_featured: formData.is_featured,
      is_new_arrival: formData.is_new_arrival,
      is_archived: formData.is_archived,
      primaryImageUrl: formData.primaryImageUrl || null,
    };

    try {
      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setErrorMessage(err.message);
      setIsSaving(false);
    }
  };

  if (status === 'loading') return <p>Loading…</p>;
  if (status === 'error') return <p className="admin-error">{errorMessage}</p>;

  return (
    <div className="admin-product-form-page">
      <h1>{isEditMode ? 'Edit Product' : 'New Product'}</h1>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="admin-error">{errorMessage}</p>}

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="admin-form-field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" value={formData.slug} onChange={handleChange} required />
          </div>
        </div>

        <div className="admin-form-field">
          <label htmlFor="category_id">Category</label>
          <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required>
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="price">Price (R)</label>
            <input id="price" name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="admin-form-field">
            <label htmlFor="original_price">Original Price (R) — optional, for sale items</label>
            <input id="original_price" name="original_price" type="number" step="0.01" min="0" value={formData.original_price} onChange={handleChange} />
          </div>
          <div className="admin-form-field">
            <label htmlFor="stock_quantity">Stock Quantity</label>
            <input id="stock_quantity" name="stock_quantity" type="number" min="0" value={formData.stock_quantity} onChange={handleChange} required />
          </div>
        </div>

        <div className="admin-form-field">
          <label htmlFor="imageFile">Product Photo</label>
          <input id="imageFile" type="file" accept="image/*" onChange={handleImageFileChange} disabled={isUploadingImage} />
          {isUploadingImage && <p className="admin-upload-status">Uploading…</p>}
          {formData.primaryImageUrl && (
            <img src={formData.primaryImageUrl} alt="Product preview" className="admin-image-preview" />
          )}
          <input
            id="primaryImageUrl"
            name="primaryImageUrl"
            value={formData.primaryImageUrl}
            onChange={handleChange}
            placeholder="Or paste an image URL directly"
            className="admin-image-url-fallback"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange} />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="details_heading">Details Heading</label>
            <input id="details_heading" name="details_heading" value={formData.details_heading} onChange={handleChange} />
          </div>
        </div>

        <div className="admin-form-field">
          <label htmlFor="details_content">Details Content</label>
          <textarea id="details_content" name="details_content" rows="3" value={formData.details_content} onChange={handleChange} />
        </div>

        <div className="admin-form-field">
          <label htmlFor="care_content">Care Instructions</label>
          <textarea id="care_content" name="care_content" rows="3" value={formData.care_content} onChange={handleChange} />
        </div>

        <div className="admin-form-checkboxes">
          <label>
            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
            Featured
          </label>
          <label>
            <input type="checkbox" name="is_new_arrival" checked={formData.is_new_arrival} onChange={handleChange} />
            New Arrival
          </label>
          <label>
            <input type="checkbox" name="is_archived" checked={formData.is_archived} onChange={handleChange} />
            Archived (hidden from storefront)
          </label>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Product'}
          </button>
          <button type="button" className="admin-cancel-btn" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
