import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageGallery from '../components/ImageGallery';
import VariantSelector from '../components/VariantSelector';
import QuantitySelector from '../components/QuantitySelector';
import ExpandableSection from '../components/ExpandableSection';
import ReviewsSection from '../components/ReviewsSection';
import RelatedProducts from '../components/RelatedProducts';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { fetchProduct, fetchRelatedProducts } from '../data/fetchProduct';
import { categories, SHIPPING_INFO, RETURNS_INFO } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductDetail.css';

function formatZAR(amount) {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const VARIANT_LABELS = {
  length: 'Length',
  colour: 'Colour',
  texture: 'Texture',
  density: 'Density',
  capSize: 'Cap Size',
  size: 'Size',
};

const VARIANT_ORDER = ['length', 'colour', 'texture', 'density', 'capSize', 'size'];

function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isWishlisted: isInWishlist, toggle: toggleWishlist } = useWishlist();
  const [status, setStatus] = useState('loading');
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [addState, setAddState] = useState('idle');
  const [buyState, setBuyState] = useState('idle');
  const [related, setRelated] = useState([]);

  const load = useCallback(() => {
    setStatus('loading');
    fetchProduct(id)
      .then((data) => {
        setProduct(data);
        setStatus('success');
        if (data && data.variantOptions) {
          const initial = {};
          Object.entries(data.variantOptions).forEach(([key, options]) => {
            const unavailable = (data.unavailableOptions && data.unavailableOptions[key]) || [];
            initial[key] = options.find((o) => !unavailable.includes(o)) || options[0];
          });
          setSelectedVariants(initial);
        } else {
          setSelectedVariants({});
        }
        setQuantity(1);
        setAddState('idle');
        setBuyState('idle');
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setStatus('error');
      });
  }, [id]);

  useEffect(() => {
    load();
    window.scrollTo(0, 0);
  }, [load]);

  useEffect(() => {
    if (!product) {
      setRelated([]);
      return;
    }
    fetchRelatedProducts(product).then(setRelated);
  }, [product]);

  const categoryLabel = product ? categories.find((c) => c.value === product.category)?.label : '';
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToBag = () => {
    if (!product || !product.inStock || addState === 'loading') return;
    setAddState('loading');
    setTimeout(() => {
      addItem(
        {
          id: product.id,
          name: product.name,
          image: product.image || product.images?.[0]?.src,
          price: product.price,
          variants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
        },
        quantity
      );
      setAddState('success');
      setTimeout(() => setAddState('idle'), 2500);
    }, 800);
  };

  const handleBuyNow = () => {
    if (!product || !product.inStock || buyState === 'loading') return;
    setBuyState('loading');
    setTimeout(() => {
      addItem(
        {
          id: product.id,
          name: product.name,
          image: product.image || product.images?.[0]?.src,
          price: product.price,
          variants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
        },
        quantity
      );
      setBuyState('success');
    }, 800);
  };

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        {status === 'success' && product && (
          <div className="container">
            <Breadcrumbs
              items={[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
                { label: categoryLabel, to: `/shop?category=${product.category}` },
                { label: product.name },
              ]}
            />
          </div>
        )}

        {status === 'loading' && (
          <div className="container">
            <ProductDetailSkeleton />
          </div>
        )}

        {status === 'error' && (
          <div className="container pdp-state-wrap">
            <ErrorState message={errorMessage} onRetry={load} />
          </div>
        )}

        {status === 'success' && !product && (
          <div className="container pdp-state-wrap">
            <EmptyState
              title="Product not found"
              message="This product may have been removed or the link is incorrect."
              actionLabel="Back to Shop"
              actionTo="/shop"
            />
          </div>
        )}

        {status === 'success' && product && (
          <>
            <div className="container pdp-layout">
              <div className="pdp-gallery-col">
                <ImageGallery images={product.images} productName={product.name} />
              </div>

              <div className="pdp-info-col">
                <h1 className="pdp-name">{product.name}</h1>

                <a href="#reviews-heading" className="pdp-rating-link">
                  {product.reviewCount > 0 ? (
                    <>
                      <span className="pdp-stars" aria-hidden="true">
                        {'★'.repeat(Math.round(product.rating))}
                        {'☆'.repeat(5 - Math.round(product.rating))}
                      </span>
                      <span className="sr-only">{product.rating} out of 5 stars</span>
                      <span className="pdp-review-count">{product.reviewCount} reviews</span>
                    </>
                  ) : (
                    <span className="pdp-review-count">No reviews yet</span>
                  )}
                </a>

                <div className="pdp-price">
                  <span className="pdp-price-current">{formatZAR(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="pdp-price-original">{formatZAR(product.originalPrice)}</span>
                      <span className="pdp-sale-badge">Sale</span>
                    </>
                  )}
                </div>

                <p className={`pdp-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      In Stock
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                      Out of Stock
                    </>
                  )}
                </p>

                {product.variantOptions &&
                  VARIANT_ORDER.filter((key) => product.variantOptions[key]).map((key) => (
                    <VariantSelector
                      key={key}
                      label={VARIANT_LABELS[key] || key}
                      options={product.variantOptions[key]}
                      unavailable={(product.unavailableOptions && product.unavailableOptions[key]) || []}
                      selected={selectedVariants[key]}
                      onSelect={(value) => setSelectedVariants((prev) => ({ ...prev, [key]: value }))}
                    />
                  ))}

                <QuantitySelector value={quantity} onChange={setQuantity} />

                <div className="pdp-actions">
                  <button
                    type="button"
                    className={`btn-add-to-bag ${addState}`}
                    disabled={!product.inStock || addState === 'loading'}
                    onClick={handleAddToBag}
                    aria-label={product.inStock ? `Add ${product.name} to bag` : `${product.name} - Out of Stock`}
                  >
                    {!product.inStock
                      ? 'Out of Stock'
                      : addState === 'loading'
                        ? <span className="btn-spinner" aria-hidden="true" />
                        : addState === 'success'
                          ? 'Added to Bag ✓'
                          : 'Add to Bag'}
                  </button>

                  <button
                    type="button"
                    className={`btn-buy-now ${buyState}`}
                    disabled={!product.inStock || buyState === 'loading'}
                    onClick={handleBuyNow}
                  >
                    {!product.inStock
                      ? 'Out of Stock'
                      : buyState === 'loading'
                        ? <span className="btn-spinner" aria-hidden="true" />
                        : buyState === 'success'
                          ? 'Ready for Checkout ✓'
                          : 'Buy Now'}
                  </button>

                  <button
                    type="button"
                    className={`btn-wishlist-pdp ${isWishlisted ? 'is-active' : ''}`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={isWishlisted}
                    onClick={() =>
                      toggleWishlist({
                        id: product.id,
                        name: product.name,
                        image: product.image || product.images?.[0]?.src,
                        price: product.price,
                      })
                    }
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>

                {(addState === 'success' || buyState === 'success') && (
                  <p className="pdp-cart-feedback" role="status">
                    {quantity} × {product.name} added to your bag.
                  </p>
                )}

                <p className="pdp-delivery-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                  Shipped via PAXI — Normal R60, Standard R110.
                </p>

                <div className="pdp-expandables">
                  <ExpandableSection heading="Description" defaultOpen>
                    <p>{product.description}</p>
                  </ExpandableSection>
                  <ExpandableSection heading={product.detailsHeading || 'Details'}>
                    <p>{product.detailsContent}</p>
                  </ExpandableSection>
                  <ExpandableSection heading="Care Instructions">
                    <p>{product.careContent}</p>
                  </ExpandableSection>
                  <ExpandableSection heading="Shipping">
                    <p>{SHIPPING_INFO}</p>
                  </ExpandableSection>
                  <ExpandableSection heading="Returns">
                    <p>{RETURNS_INFO}</p>
                  </ExpandableSection>
                </div>
              </div>
            </div>

            <div className="container">
              <ReviewsSection rating={product.rating} reviewCount={product.reviewCount} reviews={product.reviews} />
            </div>

            <div className="container">
              <RelatedProducts products={related} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ProductDetail;
