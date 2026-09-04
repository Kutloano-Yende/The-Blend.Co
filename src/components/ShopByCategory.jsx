import { Link } from 'react-router-dom';
import './ShopByCategory.css';

const categories = [
  {
    name: 'Hair',
    href: '/shop?category=hair',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
    alt: 'Woman with long flowing textured hair extensions',
  },
  {
    name: 'Hair Care',
    href: '/shop?category=hair-care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80',
    alt: 'Premium hair care products arranged on a marble surface',
  },
  {
    name: 'Beauty',
    href: '/shop?category=beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80',
    alt: 'Close-up beauty product application with soft lighting',
  },
];

function ShopByCategory() {
  return (
    <section className="shop-category section" aria-labelledby="shop-category-heading">
      <div className="container">
        <h2 id="shop-category-heading" className="shop-category-heading">
          Shop by Category
        </h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link to={category.href} className="category-tile" key={category.name}>
              <div className="category-tile-image-wrap">
                <img src={category.image} alt={category.alt} className="category-tile-image" loading="lazy" />
              </div>
              <span className="category-tile-label">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;
