import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import './InfoPage.css';

function InfoPage({ title, content }) {
  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
        </div>

        <section className="info-page-section">
          <div className="container info-page-inner">
            <h1>{title}</h1>
            <p>{content}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default InfoPage;
