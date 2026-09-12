import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import './ContactUs.css';

function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('sent');
  };

  const handleSendAnother = () => {
    setFormData({ name: '', email: '', message: '' });
    setStatus('idle');
  };

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />
        </div>

        <section className="contact-section">
          <div className="container contact-inner">
            <div className="contact-intro">
              <h1>Get In Touch</h1>
              <p>
                Questions about an order, a product, or just want advice on
                your next look? Send us a message and we'll get back to you
                as soon as we can.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              {status === 'sent' ? (
                <div className="contact-success" role="status">
                  <h2>Message sent</h2>
                  <p>Thanks for reaching out — we'll be in touch soon.</p>
                  <div className="contact-success-actions">
                    <button type="button" className="btn btn-primary" onClick={handleSendAnother}>
                      Send Another Message
                    </button>
                    <Link to="/" className="auth-link-btn">
                      Back to Home
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-field">
                    <label htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary contact-submit">
                    Send Message
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ContactUs;
