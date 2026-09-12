import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import { useWishlist } from '../context/WishlistContext';
import './Wishlist.css';

function formatZAR(amount) {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Wishlist() {
  const { items, removeItem } = useWishlist();

  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        </div>

        <section className="wishlist-section">
          <div className="container">
            <h1>My Wishlist</h1>

            {items.length === 0 ? (
              <EmptyState
                title="Your wishlist is empty"
                message="Save products you love by tapping the heart icon — they'll show up here."
                actionLabel="Browse Products"
                actionTo="/shop"
              />
            ) : (
              <ul className="wishlist-grid">
                {items.map((item) => (
                  <li className="wishlist-item" key={item.id}>
                    <Link to={`/product/${item.id}`} className="wishlist-item-image-wrap">
                      <img src={item.image} alt="" className="wishlist-item-image" />
                    </Link>
                    <div className="wishlist-item-body">
                      <Link to={`/product/${item.id}`} className="wishlist-item-name">
                        {item.name}
                      </Link>
                      <p className="wishlist-item-price">{formatZAR(item.price)}</p>
                    </div>
                    <button
                      type="button"
                      className="wishlist-item-remove"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Wishlist;
