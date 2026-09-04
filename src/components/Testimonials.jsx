import './Testimonials.css';

const testimonials = [
  {
    quote: 'The quality is unmatched. My bundle still looks brand new after months of wear.',
    name: 'Naledi M.',
    product: 'Brazilian Body Wave',
    rating: 5,
  },
  {
    quote: 'Fast delivery and the frontal blended so naturally. Exactly what I needed.',
    name: 'Thandi K.',
    product: 'Silk Straight Lace Frontal',
    rating: 5,
  },
  {
    quote: 'Customer service helped me pick the right texture for my routine. Love it.',
    name: 'Amahle P.',
    product: 'Kinky Straight Bundle',
    rating: 4,
  },
];

function Testimonials() {
  return (
    <section className="testimonials section" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="testimonials-heading">
          Loved By Our Customers
        </h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <figure className="testimonial-card" key={i}>
              <div
                className="testimonial-stars"
                aria-label={`${t.rating} out of 5 stars`}
              >
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <blockquote>
                <p>&ldquo;{t.quote}&rdquo;</p>
              </blockquote>
              <figcaption>
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-product">{t.product}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
