import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function formatZAR(amount) {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ProductCard({ product }) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { id, name, texture, length, meta, rating, reviewCount, price, originalPrice, image, imageAlt, inStock } = product;

  const isOnSale = originalPrice && originalPrice > price;
  const metaLine = texture && length ? `${texture} · ${length}` : meta;

  const handleAddToCart = () => {
    if (!inStock || isAdding) return;
    setIsAdding(true);
    setTimeout(() => {
      addItem({ id, name, image, price });
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 900);
  };

  return (
    <article className={`product-card ${!inStock ? 'is-out-of-stock' : ''}`}>
      <div className="product-card-image-wrap">
        <Link to={`/product/${id}`} tabIndex={-1} aria-hidden="true">
          <img
            src={image}
            alt={imageAlt}
            className="product-card-image"
            loading="lazy"
          />
        </Link>

        {isOnSale && inStock && <span className="badge-sale">Sale</span>}

        {!inStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}

        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? 'is-active' : ''}`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={isWishlisted}
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        {metaLine && <p className="product-card-meta">{metaLine}</p>}

        {reviewCount > 0 ? (
          <div className="product-card-rating" aria-label={`${rating} out of 5 stars, ${reviewCount} reviews`}>
            <span aria-hidden="true" className="stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
            <span className="review-count">{reviewCount} reviews</span>
          </div>
        ) : (
          <div className="product-card-rating">
            <span className="review-count">No reviews yet</span>
          </div>
        )}

        <div className="product-card-price">
          <span className="price-current" aria-label={`R${price.toFixed(2)}`}>
            {formatZAR(price)}
          </span>
          {isOnSale && (
            <span className="price-original" aria-hidden="true">
              {formatZAR(originalPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          className="add-to-cart-btn"
          disabled={!inStock}
          aria-disabled={!inStock}
          onClick={handleAddToCart}
          aria-label={inStock ? `Add ${name} to cart` : `${name} - Out of Stock`}
        >
          {!inStock
            ? 'Out of Stock'
            : isAdding
              ? <span className="btn-spinner" aria-hidden="true" />
              : justAdded
                ? 'Added ✓'
                : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
