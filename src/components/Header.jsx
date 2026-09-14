import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function formatZAR(amount) {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { items: cartItems, cartCount, cartTotal, lastAddedAt, updateQuantity, removeItem } = useCart();
  const { isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const shopMenuCloseTimeout = useRef(null);
  const openShopMenu = () => {
    clearTimeout(shopMenuCloseTimeout.current);
    setIsShopMenuOpen(true);
  };
  const closeShopMenu = () => {
    shopMenuCloseTimeout.current = setTimeout(() => setIsShopMenuOpen(false), 250);
  };
  useEffect(() => () => clearTimeout(shopMenuCloseTimeout.current), []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(trimmed ? `/shop?search=${encodeURIComponent(trimmed)}` : '/shop');
  };

  const lastAddedRef = useRef(lastAddedAt);
  useEffect(() => {
    if (lastAddedAt && lastAddedAt !== lastAddedRef.current) {
      lastAddedRef.current = lastAddedAt;
      setShowAddedToast(true);
      const timeout = setTimeout(() => setShowAddedToast(false), 2200);
      return () => clearTimeout(timeout);
    }
  }, [lastAddedAt]);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" aria-label="The Blend.Co Home">
            <img src={logo} alt="The Blend.Co" className="logo-image" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-only">
          <div
            className="nav-item-has-menu"
            onMouseEnter={openShopMenu}
            onMouseLeave={closeShopMenu}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsShopMenuOpen(false);
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsShopMenuOpen(false);
              }
            }}
          >
            <button
              className="nav-link nav-link-btn"
              aria-expanded={isShopMenuOpen}
              aria-haspopup="true"
              onFocus={openShopMenu}
            >
              Shop
            </button>

            {isShopMenuOpen && (
              <div className="mega-menu" role="menu">
                <div className="mega-menu-column">
                  <h3>Hair</h3>
                  <ul>
                    <li><Link to="/shop?category=hair&subcategory=wigs">Wigs</Link></li>
                    <li><Link to="/shop?category=hair&subcategory=bundles">Bundles</Link></li>
                    <li><Link to="/shop?category=hair&subcategory=closures">Closures</Link></li>
                    <li><Link to="/shop?category=hair&subcategory=frontals">Frontals</Link></li>
                    <li><Link to="/shop?category=hair&subcategory=extensions">Extensions</Link></li>
                  </ul>
                </div>
                <div className="mega-menu-column">
                  <h3>Hair Care</h3>
                  <ul>
                    <li><Link to="/shop?category=hair-care&subcategory=shampoos">Shampoos</Link></li>
                    <li><Link to="/shop?category=hair-care&subcategory=conditioners">Conditioners</Link></li>
                    <li><Link to="/shop?category=hair-care&subcategory=treatments">Treatments</Link></li>
                  </ul>
                </div>
                <div className="mega-menu-column">
                  <h3>Beauty</h3>
                  <ul>
                    <li><Link to="/shop?category=beauty&subcategory=lashes">Lashes</Link></li>
                    <li><Link to="/shop?category=beauty&subcategory=accessories">Accessories</Link></li>
                    <li><Link to="/shop?category=beauty&subcategory=tools">Beauty Tools</Link></li>
                  </ul>
                </div>
                <div className="mega-menu-column mega-menu-featured">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80"
                    alt="Featured hair collection"
                    loading="lazy"
                  />
                  <Link to="/shop?sort=newest" className="mega-menu-featured-link">Shop New In</Link>
                </div>
              </div>
            )}
          </div>

          <Link to="/shop?sort=newest" className="nav-link">New In</Link>
          <Link to="/shop?sale=true" className="nav-link">Sale</Link>
          <Link to="/about" className="nav-link">About</Link>
          {isAdmin && <Link to="/admin/products" className="nav-link">Admin</Link>}
        </nav>

        {/* Utilities */}
        <div className="header-utilities">
          {/* Search - Desktop */}
          <button
            className="utility-btn desktop-only"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          {/* Account - Desktop */}
          <Link to="/account" className="utility-btn desktop-only" aria-label="Account">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          {/* Wishlist - Desktop */}
          <Link to="/wishlist" className="utility-btn desktop-only" aria-label={`Wishlist with ${wishlistCount} items`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          {/* Search - Mobile */}
          <button
            className="utility-btn mobile-only"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          {/* Cart */}
          <div className="cart-btn-wrap">
            <button
              className="utility-btn"
              aria-label={`Cart with ${cartCount} items`}
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
            {showAddedToast && (
              <div className="cart-added-toast" role="status">
                Added to cart
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <button
            className="utility-btn mobile-only hamburger"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Search Modal - Mobile */}
      {isSearchOpen && (
        <form className="search-modal" onSubmit={handleSearchSubmit} role="search">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            aria-label="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button
            type="button"
            className="close-btn"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        </form>
      )}

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="menu-backdrop" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
      )}
      {isMenuOpen && (
        <nav className="mobile-menu">
          <div className="mobile-menu-section">
            <h3 className="mobile-menu-heading">Shop</h3>
            <ul className="mobile-menu-list">
              <li><Link to="/shop?category=hair" onClick={() => setIsMenuOpen(false)}>Hair</Link>
                <ul className="mobile-submenu">
                  <li><Link to="/shop?category=hair&subcategory=wigs" onClick={() => setIsMenuOpen(false)}>Wigs</Link></li>
                  <li><Link to="/shop?category=hair&subcategory=bundles" onClick={() => setIsMenuOpen(false)}>Bundles</Link></li>
                  <li><Link to="/shop?category=hair&subcategory=closures" onClick={() => setIsMenuOpen(false)}>Closures</Link></li>
                  <li><Link to="/shop?category=hair&subcategory=frontals" onClick={() => setIsMenuOpen(false)}>Frontals</Link></li>
                  <li><Link to="/shop?category=hair&subcategory=extensions" onClick={() => setIsMenuOpen(false)}>Extensions</Link></li>
                </ul>
              </li>
              <li><Link to="/shop?category=hair-care" onClick={() => setIsMenuOpen(false)}>Hair Care</Link>
                <ul className="mobile-submenu">
                  <li><Link to="/shop?category=hair-care&subcategory=shampoos" onClick={() => setIsMenuOpen(false)}>Shampoos</Link></li>
                  <li><Link to="/shop?category=hair-care&subcategory=conditioners" onClick={() => setIsMenuOpen(false)}>Conditioners</Link></li>
                  <li><Link to="/shop?category=hair-care&subcategory=treatments" onClick={() => setIsMenuOpen(false)}>Treatments</Link></li>
                </ul>
              </li>
              <li><Link to="/shop?category=beauty" onClick={() => setIsMenuOpen(false)}>Beauty</Link>
                <ul className="mobile-submenu">
                  <li><Link to="/shop?category=beauty&subcategory=lashes" onClick={() => setIsMenuOpen(false)}>Lashes</Link></li>
                  <li><Link to="/shop?category=beauty&subcategory=accessories" onClick={() => setIsMenuOpen(false)}>Accessories</Link></li>
                  <li><Link to="/shop?category=beauty&subcategory=tools" onClick={() => setIsMenuOpen(false)}>Beauty Tools</Link></li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="mobile-menu-section">
            <h3 className="mobile-menu-heading">Browse</h3>
            <ul className="mobile-menu-list">
              <li><Link to="/shop?sort=newest" onClick={() => setIsMenuOpen(false)}>New In</Link></li>
              <li><Link to="/shop?sale=true" onClick={() => setIsMenuOpen(false)}>Sale</Link></li>
              <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            </ul>
          </div>

          <div className="mobile-menu-section">
            <h3 className="mobile-menu-heading">Account</h3>
            <ul className="mobile-menu-list">
              <li><Link to="/account" onClick={() => setIsMenuOpen(false)}>Sign In</Link></li>
              <li><Link to="/account" onClick={() => setIsMenuOpen(false)}>Create Account</Link></li>
            </ul>
          </div>
        </nav>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="menu-backdrop" onClick={() => setIsCartOpen(false)} aria-hidden="true" />
      )}
      {isCartOpen && (
        <div className="cart-drawer">
          <div className="cart-drawer-header">
            <h2>Cart</h2>
            <button
              className="close-btn"
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>Your cart is empty</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <ul className="cart-items-list">
                {cartItems.map((item) => (
                  <li className="cart-item" key={item.key}>
                    <img src={item.image} alt="" className="cart-item-image" />
                    <div className="cart-item-body">
                      <p className="cart-item-name">{item.name}</p>
                      {item.variants && (
                        <p className="cart-item-variants">
                          {Object.values(item.variants).join(' · ')}
                        </p>
                      )}
                      <p className="cart-item-price">{formatZAR(item.price)}</p>
                      <div className="cart-item-qty">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-drawer-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span>{formatZAR(cartTotal)}</span>
                </div>
                <Link
                  to="/checkout"
                  className="btn btn-primary cart-checkout-btn"
                  onClick={() => setIsCartOpen(false)}
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
