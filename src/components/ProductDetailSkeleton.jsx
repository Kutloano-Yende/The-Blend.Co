import './ProductDetailSkeleton.css';

function ProductDetailSkeleton() {
  return (
    <div className="pdp-skeleton" aria-hidden="true">
      <div className="pdp-skeleton-gallery">
        <div className="pdp-skeleton-block pdp-skeleton-image" />
      </div>
      <div className="pdp-skeleton-info">
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '40%', height: 14 }} />
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '75%', height: 32, marginTop: 12 }} />
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '35%', height: 20, marginTop: 16 }} />
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '50%', height: 28, marginTop: 20 }} />
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '100%', height: 44, marginTop: 32 }} />
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '100%', height: 52, marginTop: 24 }} />
        <div className="pdp-skeleton-block pdp-skeleton-line" style={{ width: '100%', height: 52, marginTop: 12 }} />
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
