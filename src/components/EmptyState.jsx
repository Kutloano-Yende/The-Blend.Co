import { Link } from 'react-router-dom';
import './EmptyState.css';

function EmptyState({
  title = 'No products found',
  message = "Try adjusting your filters or search term to find what you're looking for.",
  actionLabel = 'Clear All Filters',
  onClearFilters,
  actionTo,
}) {
  return (
    <div className="empty-state" role="status">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <h2>{title}</h2>
      <p>{message}</p>
      {onClearFilters && (
        <button type="button" className="btn btn-primary" onClick={onClearFilters}>
          {actionLabel}
        </button>
      )}
      {actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
