import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import './Account.css';

function SignUpForm({ onSuccess }) {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const { data, error } = await signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus('idle');
      return;
    }

    if (data.session) {
      onSuccess();
    } else {
      setConfirmationSent(true);
      setStatus('idle');
    }
  };

  if (confirmationSent) {
    return (
      <div className="auth-success" role="status">
        <h2>Check your email</h2>
        <p>We've sent a confirmation link to {formData.email}. Confirm your address to finish creating your account.</p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

      <div className="auth-form-row">
        <div className="form-field">
          <label htmlFor="signup-firstname">First Name</label>
          <input
            id="signup-firstname"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="signup-lastname">Last Name</label>
          <input
            id="signup-lastname"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary auth-submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Creating Account…' : 'Create Account'}
      </button>
    </form>
  );
}

function SignInForm({ onSuccess }) {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const { error } = await signIn(formData);

    if (error) {
      setErrorMessage(error.message);
      setStatus('idle');
      return;
    }

    onSuccess();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

      <div className="form-field">
        <label htmlFor="signin-email">Email</label>
        <input
          id="signin-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary auth-submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing In…' : 'Sign In'}
      </button>
    </form>
  );
}

function AccountOverview() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="account-overview">
      <h1>My Account</h1>
      <p className="account-email">Signed in as {user.email}</p>
      <button type="button" className="btn btn-primary" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

function Account() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/account');
  };

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />
        </div>

        <section className="account-section">
          <div className="container account-inner">
            {isLoading ? null : user ? (
              <AccountOverview />
            ) : (
              <>
                <div className="auth-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'signin'}
                    className={`auth-tab ${activeTab === 'signin' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('signin')}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'signup'}
                    className={`auth-tab ${activeTab === 'signup' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('signup')}
                  >
                    Create Account
                  </button>
                </div>

                {activeTab === 'signin' ? (
                  <SignInForm onSuccess={handleAuthSuccess} />
                ) : (
                  <SignUpForm onSuccess={handleAuthSuccess} />
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Account;
