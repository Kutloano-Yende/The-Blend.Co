import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import './Account.css';

function SignUpForm({ onSuccess, onBack }) {
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
        <button type="button" className="auth-link-btn" style={{ marginTop: 'var(--spacing-md)' }} onClick={onBack}>
          Back to Sign In
        </button>
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
          minLength={8}
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

function SignInForm({ onSuccess, onForgotPassword }) {
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

      <button type="button" className="auth-link-btn" onClick={onForgotPassword}>
        Forgot password?
      </button>

      <button type="submit" className="btn btn-primary auth-submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing In…' : 'Sign In'}
      </button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }) {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const { error } = await requestPasswordReset(email);

    if (error) {
      setErrorMessage(error.message);
      setStatus('idle');
      return;
    }

    setSent(true);
    setStatus('idle');
  };

  if (sent) {
    return (
      <div className="auth-success" role="status">
        <h2>Check your email</h2>
        <p>If an account exists for {email}, we've sent a link to reset your password.</p>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

      <div className="form-field">
        <label htmlFor="forgot-email">Email</label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary auth-submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
      </button>

      <button type="button" className="auth-link-btn" onClick={onBack}>
        Back to Sign In
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
  const [authView, setAuthView] = useState('signin');
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
                {authView !== 'forgot' && (
                  <div className="auth-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authView === 'signin'}
                      className={`auth-tab ${authView === 'signin' ? 'is-active' : ''}`}
                      onClick={() => setAuthView('signin')}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={authView === 'signup'}
                      className={`auth-tab ${authView === 'signup' ? 'is-active' : ''}`}
                      onClick={() => setAuthView('signup')}
                    >
                      Create Account
                    </button>
                  </div>
                )}

                {authView === 'signin' && (
                  <SignInForm onSuccess={handleAuthSuccess} onForgotPassword={() => setAuthView('forgot')} />
                )}
                {authView === 'signup' && (
                  <SignUpForm onSuccess={handleAuthSuccess} onBack={() => setAuthView('signin')} />
                )}
                {authView === 'forgot' && <ForgotPasswordForm onBack={() => setAuthView('signin')} />}
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
