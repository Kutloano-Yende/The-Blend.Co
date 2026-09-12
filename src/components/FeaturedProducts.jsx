import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products as allProducts } from '../data/products';
import './FeaturedProducts.css';

const FEATURED_IDS = ['h9', 'h10', 'h11', 'h12'];
const products = FEATURED_IDS.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

function FeaturedProducts() {
  return (
    <section className="featured-products section" aria-labelledby="featured-heading">
      <div className="container">
        <div className="featured-header">
          <h2 id="featured-heading">Featured Products</h2>
          <Link to="/shop" className="view-all-link">View All</Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
