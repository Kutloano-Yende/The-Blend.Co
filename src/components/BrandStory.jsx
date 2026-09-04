import './BrandStory.css';

function BrandStory() {
  return (
    <section className="brand-story" aria-labelledby="brand-story-heading">
      <div className="brand-story-image-wrap">
        <img
          src="https://images.unsplash.com/photo-1595475884562-073c30d45670?w=1000&q=80"
          alt="Founder inspecting premium hair bundles in the studio"
          className="brand-story-image"
          loading="lazy"
        />
      </div>
      <div className="brand-story-content">
        <h2 id="brand-story-heading">Crafted With Intention</h2>
        <p>
          The Blend.Co was founded on a simple belief: every woman deserves
          hair that feels as good as it looks. We source only the finest
          textures and pair them with rituals that protect, nourish, and
          celebrate your natural beauty.
        </p>
        <p>
          From bundle to bag, every piece is chosen with the same standard —
          quality that lasts, and a finish that feels premium every single
          time.
        </p>
        <a href="#about" className="brand-story-link">Our Story</a>
      </div>
    </section>
  );
}

export default BrandStory;
