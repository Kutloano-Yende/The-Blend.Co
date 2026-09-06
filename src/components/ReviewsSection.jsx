import './ReviewsSection.css';

function estimateBreakdown(rating, reviewCount) {
  const weights =
    rating >= 4.5
      ? { 5: 0.72, 4: 0.18, 3: 0.06, 2: 0.02, 1: 0.02 }
      : rating >= 4
        ? { 5: 0.5, 4: 0.32, 3: 0.1, 2: 0.05, 1: 0.03 }
        : { 5: 0.32, 4: 0.32, 3: 0.2, 2: 0.1, 1: 0.06 };

  const counts = {};
  let assigned = 0;
  [5, 4, 3, 2].forEach((star) => {
    const c = Math.round(reviewCount * weights[star]);
    counts[star] = c;
    assigned += c;
  });
  counts[1] = Math.max(0, reviewCount - assigned);
  return counts;
}

function ReviewsSection({ rating, reviewCount, reviews }) {
  if (!reviewCount) {
    return (
      <section className="reviews-section" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Customer Reviews</h2>
        <p className="reviews-empty">
          No reviews yet. Be the first to share your experience with this product.
        </p>
      </section>
    );
  }

  const breakdown = estimateBreakdown(rating, reviewCount);
  const maxCount = Math.max(...Object.values(breakdown), 1);

  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">Customer Reviews</h2>

      <div className="reviews-summary">
        <div className="reviews-overall">
          <span className="reviews-overall-number">{rating.toFixed(1)}</span>
          <div
            className="reviews-overall-stars"
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
          >
            {'★'.repeat(Math.round(rating))}
            {'☆'.repeat(5 - Math.round(rating))}
          </div>
          <span className="reviews-overall-count">Based on {reviewCount} reviews</span>
        </div>

        <div className="reviews-breakdown">
          {[5, 4, 3, 2, 1].map((star) => (
            <div className="breakdown-row" key={star}>
              <span className="breakdown-star-label">{star} star</span>
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{ width: `${(breakdown[star] / maxCount) * 100}%` }}
                />
              </div>
              <span className="breakdown-count">{breakdown[star]}</span>
            </div>
          ))}
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <ul className="review-list">
          {reviews.map((review) => (
            <li className="review-item" key={review.id}>
              <div className="review-item-header">
                <div
                  className="review-item-stars"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                {review.verified && (
                  <span className="verified-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="review-item-text">{review.text}</p>
              <p className="review-item-meta">
                <span className="review-item-name">{review.name}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={review.date}>
                  {new Date(review.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="reviews-empty">No written reviews yet for this product.</p>
      )}
    </section>
  );
}

export default ReviewsSection;
