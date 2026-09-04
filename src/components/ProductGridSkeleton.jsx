import './ProductGridSkeleton.css';

function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-image" />
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-meta" />
          <div className="skeleton-line skeleton-line-price" />
          <div className="skeleton-line skeleton-line-btn" />
        </div>
      ))}
    </div>
  );
}

export default ProductGridSkeleton;
