import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminTerms.css';

function AdminTerms() {
  const [terms, setTerms] = useState({
    shipping: '',
    returns: '',
    privacy: '',
    terms_conditions: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      setStatus('loading');
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows, create default
          setTerms({
            shipping: '',
            returns: '',
            privacy: '',
            terms_conditions: '',
          });
        } else {
          throw error;
        }
      } else if (data) {
        setTerms({
          shipping: data.shipping_info || '',
          returns: data.returns_info || '',
          privacy: data.privacy_policy || '',
          terms_conditions: data.terms_conditions || '',
        });
      }
      setStatus('ready');
    } catch (err) {
      setMessage(`Error loading: ${err.message}`);
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerms((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage('');

      const { error } = await supabase
        .from('store_settings')
        .upsert({
          id: 1,
          shipping_info: terms.shipping,
          returns_info: terms.returns,
          privacy_policy: terms.privacy,
          terms_conditions: terms.terms_conditions,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setMessage('Terms updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`Error saving: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-terms">
      <div className="admin-page-header">
        <h1>Store Terms & Policies</h1>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Terms
          </button>
        )}
      </div>

      {message && (
        <div className={`admin-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {status === 'loading' && <p>Loading terms…</p>}
      {status === 'error' && <p className="admin-error">Error loading terms</p>}

      {status === 'ready' && (
        <div className="admin-terms-container">
          <div className="admin-term-section">
            <label htmlFor="shipping">
              <h3>Shipping Information</h3>
              {!isEditing && <p className="term-preview">{terms.shipping || 'Not set'}</p>}
            </label>
            {isEditing && (
              <textarea
                id="shipping"
                name="shipping"
                value={terms.shipping}
                onChange={handleChange}
                placeholder="Enter shipping information..."
                rows="6"
              />
            )}
          </div>

          <div className="admin-term-section">
            <label htmlFor="returns">
              <h3>Returns Policy</h3>
              {!isEditing && <p className="term-preview">{terms.returns || 'Not set'}</p>}
            </label>
            {isEditing && (
              <textarea
                id="returns"
                name="returns"
                value={terms.returns}
                onChange={handleChange}
                placeholder="Enter returns policy..."
                rows="6"
              />
            )}
          </div>

          <div className="admin-term-section">
            <label htmlFor="privacy">
              <h3>Privacy Policy</h3>
              {!isEditing && <p className="term-preview">{terms.privacy || 'Not set'}</p>}
            </label>
            {isEditing && (
              <textarea
                id="privacy"
                name="privacy"
                value={terms.privacy}
                onChange={handleChange}
                placeholder="Enter privacy policy..."
                rows="6"
              />
            )}
          </div>

          <div className="admin-term-section">
            <label htmlFor="terms_conditions">
              <h3>Terms & Conditions</h3>
              {!isEditing && <p className="term-preview">{terms.terms_conditions || 'Not set'}</p>}
            </label>
            {isEditing && (
              <textarea
                id="terms_conditions"
                name="terms_conditions"
                value={terms.terms_conditions}
                onChange={handleChange}
                placeholder="Enter terms & conditions..."
                rows="8"
              />
            )}
          </div>

          {isEditing && (
            <div className="admin-term-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminTerms;
