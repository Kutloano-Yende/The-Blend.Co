import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../data/fetchProducts';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then((all) => setProducts(all.filter((p) => p.isFeatured).slice(0, 4)))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

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
