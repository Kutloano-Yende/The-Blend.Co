import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import './AboutUs.css';

const values = [
  {
    title: 'Quality First',
    description:
      'Every wig, bundle and treatment is chosen against one standard: would we wear it ourselves? If not, it doesn’t make the cut.',
  },
  {
    title: 'Made For You',
    description:
      'Hair isn’t one-size-fits-all. We curate textures, lengths and densities so every client finds a match for their own natural beauty.',
  },
  {
    title: 'Honest Service',
    description:
      'No pressure, no upsells you don’t need — just straightforward advice from people who genuinely love hair and beauty.',
  },
];

function AboutUs() {
  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />
        </div>

        <section className="about-hero">
          <div className="container">
            <h1>Crafted With Intention</h1>
            <p className="about-hero-lede">
              The Blend.Co was founded on a simple belief: every woman deserves
              hair that feels as good as it looks. This is why we started, and
              what keeps us going.
            </p>
          </div>
        </section>

        <section className="about-story">
          <div className="about-story-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1595475884562-073c30d45670?w=1000&q=80"
              alt="Founder inspecting premium hair bundles in the studio"
              className="about-story-image"
              loading="lazy"
            />
          </div>
          <div className="about-story-content">
            <h2>Our Story</h2>
            <p>
              We source only the finest textures and pair them with rituals
              that protect, nourish, and celebrate your natural beauty. From
              bundle to bag, every piece is chosen with the same standard —
              quality that lasts, and a finish that feels premium every
              single time.
            </p>
            <p>
              What started as a passion for great hair has grown into a
              destination for women who want more from their beauty
              routine — real quality, real care, and results you can see
              and feel.
            </p>
          </div>
        </section>

        <section className="about-values">
          <div className="container">
            <h2 className="about-values-heading">What We Stand For</h2>
            <div className="about-values-grid">
              {values.map((value) => (
                <div className="about-value-card" key={value.title}>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="container about-cta-inner">
            <h2>Ready to find your blend?</h2>
            <Link to="/shop" className="btn btn-primary">Shop The Collection</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutUs;
