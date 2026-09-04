import Header from '../components/Header';
import Hero from '../components/Hero';
import ShopByCategory from '../components/ShopByCategory';
import FeaturedProducts from '../components/FeaturedProducts';
import BrandStory from '../components/BrandStory';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <ShopByCategory />
        <FeaturedProducts />
        <BrandStory />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

export default Home;
