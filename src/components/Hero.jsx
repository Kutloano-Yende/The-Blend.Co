import heroVideo from '../assets/hero-video.mp4';
import './Hero.css';

function Hero() {
  return (
    <section className="hero" aria-label="Featured campaign">
      <div className="hero-image-wrap">
        <video
          className="hero-image"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-label="The Blend.Co campaign video"
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
