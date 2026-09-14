import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './Checkout.css';

function formatZAR(amount) {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const SHIPPING_RATES = { normal: 60, standard: 110 };

function Checkout() {
  const { items, cartTotal } = useCart();
  const { user } = useAuth();

  const [shippingMethod, setShippingMethod] = useState('normal');
  const [form, setForm] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('first_name, last_name, phone, address, city, province, postal_code')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        setForm((prev) => ({
          ...prev,
          email: user.email || prev.email,
          firstName: data.first_name || prev.firstName,
          lastName: data.last_name || prev.lastName,
          address: data.address || prev.address,
          city: data.city || prev.city,
          province: data.province || prev.province,
          postalCode: data.postal_code || prev.postalCode,
          phone: data.phone || prev.phone,
        }));
      });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const shippingCost = SHIPPING_RATES[shippingMethod];
  const total = cartTotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variants: item.variants,
          })),
          email: form.email,
          shipping: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
            phone: form.phone,
          },
          shippingMethod,
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (error || !data?.fields) {
        setErrorMessage(data?.error || error?.message || 'Something went wrong placing your order.');
        setStatus('idle');
        return;
      }

      // Build and submit a hidden form to redirect to PayFast, since the
      // payment fields must arrive as a signed POST, not a client-side navigation.
      const form2 = document.createElement('form');
      form2.method = 'POST';
      form2.action = data.redirectUrl;
      Object.entries(data.fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form2.appendChild(input);
      });
      document.body.appendChild(form2);
      form2.submit();
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong placing your order.');
      setStatus('idle');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <a href="#main-content" className="sr-only">Skip to main content</a>
        <Header />
        <main id="main-content">
          <div className="container">
            <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
          </div>
          <section className="checkout-section">
            <div className="container checkout-empty">
              <h1>Your cart is empty</h1>
              <p>Add something to your bag before checking out.</p>
              <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Checkout' }]} />
        </div>

        <section className="checkout-section">
          <div className="container checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h1>Checkout</h1>

              {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

              <h2 className="checkout-heading">Contact</h2>
              <div className="form-field">
                <label htmlFor="checkout-email">Email</label>
                <input id="checkout-email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>

              <h2 className="checkout-heading">Shipping Address</h2>
              <div className="auth-form-row">
                <div className="form-field">
                  <label htmlFor="checkout-firstName">First Name</label>
                  <input id="checkout-firstName" name="firstName" type="text" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-lastName">Last Name</label>
                  <input id="checkout-lastName" name="lastName" type="text" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="checkout-address">Address</label>
                <input id="checkout-address" name="address" type="text" value={form.address} onChange={handleChange} required />
              </div>
              <div className="auth-form-row">
                <div className="form-field">
                  <label htmlFor="checkout-city">City</label>
                  <input id="checkout-city" name="city" type="text" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-province">Province</label>
                  <input id="checkout-province" name="province" type="text" value={form.province} onChange={handleChange} />
                </div>
              </div>
              <div className="auth-form-row">
                <div className="form-field">
                  <label htmlFor="checkout-postalCode">Postal Code</label>
                  <input id="checkout-postalCode" name="postalCode" type="text" value={form.postalCode} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label htmlFor="checkout-phone">Phone</label>
                  <input id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <h2 className="checkout-heading">Delivery Method</h2>
              <div className="shipping-options">
                <label className={`shipping-option ${shippingMethod === 'normal' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="normal"
                    checked={shippingMethod === 'normal'}
                    onChange={() => setShippingMethod('normal')}
                  />
                  <span>PAXI Normal</span>
                  <span className="shipping-option-price">{formatZAR(60)}</span>
                </label>
                <label className={`shipping-option ${shippingMethod === 'standard' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <span>PAXI Standard</span>
                  <span className="shipping-option-price">{formatZAR(110)}</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary checkout-submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Redirecting to PayFast…' : `Pay ${formatZAR(total)} with PayFast`}
              </button>
              <Link to="/shop" className="checkout-back-link">← Back to Shop</Link>
            </form>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>
              <ul className="checkout-summary-list">
                {items.map((item) => (
                  <li key={item.key} className="checkout-summary-item">
                    <img src={item.image} alt="" className="checkout-summary-image" />
                    <div className="checkout-summary-body">
                      <p className="checkout-summary-name">{item.name}</p>
                      {item.variants && (
                        <p className="checkout-summary-variants">{Object.values(item.variants).join(' · ')}</p>
                      )}
                      <p className="checkout-summary-qty">Qty {item.quantity}</p>
                    </div>
                    <p className="checkout-summary-price">{formatZAR(item.price * item.quantity)}</p>
                  </li>
                ))}
              </ul>
              <div className="checkout-summary-totals">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>{formatZAR(cartTotal)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Shipping</span>
                  <span>{formatZAR(shippingCost)}</span>
                </div>
                <div className="checkout-summary-row checkout-summary-total">
                  <span>Total</span>
                  <span>{formatZAR(total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Checkout;
