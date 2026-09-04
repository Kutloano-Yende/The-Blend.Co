import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-label="Featured campaign">
      <div className="hero-image-wrap">
        <img
          src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1600&q=80"
          alt="Model wearing premium burgundy-toned hair extensions"
          className="hero-image"
          fetchpriority="high"
        />
      </div>
      <div className="hero-content">
        <h1 className="hero-heading">Elevate Your Hair Routine</h1>
        <p className="hero-subheading">
          Premium wigs, bundles and hair care crafted for the modern woman who
          expects more from her beauty ritual.
        </p>
        <a href="#shop" className="btn btn-primary hero-cta">
          Shop Now
        </a>
      </div>
    </section>
  );
}

export default Hero;
