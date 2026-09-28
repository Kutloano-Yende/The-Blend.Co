import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './MobileBottomNav.css';

function MobileBottomNav() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link 
        to="/shop" 
        className={`bottom-nav-item ${isActive('/shop') ? 'active' : ''}`}
        aria-label="Shop"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>Shop</span>
      </Link>

      <Link 
        to="/wishlist" 
        className={`bottom-nav-item ${isActive('/wishlist') ? 'active' : ''}`}
        aria-label={`Wishlist with ${wishlistCount} items`}
      >
        <div className="bottom-nav-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </div>
        <span>Wishlist</span>
      </Link>

      <Link 
        to="/checkout" 
        className={`bottom-nav-item ${isActive('/checkout') ? 'active' : ''}`}
        aria-label={`Cart with ${cartCount} items`}
      >
        <div className="bottom-nav-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </Link>

      <Link 
        to="/account" 
        className={`bottom-nav-item ${isActive('/account') ? 'active' : ''}`}
        aria-label="Account"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>{user ? 'Account' : 'Sign In'}</span>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;
