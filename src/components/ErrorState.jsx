import './ErrorState.css';

function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="13"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h2>Something went wrong</h2>
      <p>{message || 'We could not load products right now. Please try again.'}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

export default ErrorState;
