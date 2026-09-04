import ProductCard from './ProductCard';
import './RelatedProducts.css';

function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="related-products" aria-labelledby="related-heading">
      <h2 id="related-heading">You May Also Like</h2>
      <div className="related-products-row">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
