import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import './Account.css';

function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [hasRecoverySession, setHasRecoverySession] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasRecoverySession(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY' || newSession) {
        setHasRecoverySession(true);
      }
    });

    const timeout = setTimeout(() => {
      setHasRecoverySession((current) => (current === null ? false : current));
    }, 3000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    const { error } = await updatePassword(password);

    if (error) {
      setErrorMessage(error.message);
      setStatus('idle');
      return;
    }

    setDone(true);
    setStatus('idle');
  };

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Reset Password' }]} />
        </div>

        <section className="account-section">
          <div className="container account-inner">
            {done ? (
              <div className="auth-success" role="status">
                <h2>Password updated</h2>
                <p>Your password has been changed. You're signed in.</p>
                <button type="button" className="btn btn-primary auth-submit" onClick={() => navigate('/account')}>
                  Go to My Account
                </button>
              </div>
            ) : hasRecoverySession === false ? (
              <div className="auth-error" role="alert">
                This reset link is invalid or has expired. Request a new one from the account page.
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Set a New Password</h1>
                {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}

                <div className="form-field">
                  <label htmlFor="new-password">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ResetPassword;
