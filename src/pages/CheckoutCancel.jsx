import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Checkout.css';

function CheckoutCancel() {
  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <section className="checkout-section">
          <div className="container checkout-empty">
            <h1>Checkout cancelled</h1>
            <p>Your payment was cancelled and your card was not charged. Your cart is still saved.</p>
            <Link to="/checkout" className="btn btn-primary">Return to Checkout</Link>
            <Link to="/shop" className="checkout-back-link">← Continue Shopping</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CheckoutCancel;
