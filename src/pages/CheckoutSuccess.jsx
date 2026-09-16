import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import { downloadInvoicePdf } from '../lib/invoice';
import './Checkout.css';

function formatZAR(amount) {
  return `R${Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { clearCart } = useCart();
  const [status, setStatus] = useState('loading');
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    Promise.all([
      supabase.rpc('track_order_by_token', { _token: token }),
      supabase.rpc('get_order_items_by_token', { _token: token }),
    ]).then(([orderRes, itemsRes]) => {
      if (orderRes.error || !orderRes.data || orderRes.data.length === 0) {
        setStatus('error');
        return;
      }
      setOrder(orderRes.data[0]);
      setItems(itemsRes.data || []);
      setStatus('success');
    });
  }, [token]);

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <section className="checkout-section">
          <div className="container checkout-empty">
            {status === 'loading' && <p>Loading your order…</p>}

            {status === 'error' && (
              <>
                <h1>We couldn't find that order</h1>
                <p>If you completed a payment, check your email for confirmation, or contact us if you're unsure.</p>
                <Link to="/contact" className="btn btn-primary">Contact Us</Link>
              </>
            )}

            {status === 'success' && order && (
              <>
                <h1>Thank you for your order</h1>
                <p>
                  Payment status: <strong>{order.payment_status}</strong>
                  {order.payment_status !== 'paid' && ' — we’ll update this once PayFast confirms your payment.'}
                </p>
                <p>Order total: <strong>{formatZAR(order.total)}</strong></p>
                <p>A confirmation will be sent to your email once payment is confirmed.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => downloadInvoicePdf(order, items)}
                >
                  Download Invoice
                </button>
                <Link to="/shop" className="checkout-back-link">Continue Shopping</Link>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CheckoutSuccess;
