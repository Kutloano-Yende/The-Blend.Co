import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import './InfoPage.css';
import './LegalPage.css';

function LegalPage({ title, sections }) {
  return (
    <>
      <a href="#main-content" className="sr-only">Skip to main content</a>
      <Header />
      <main id="main-content">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />
        </div>

        <section className="info-page-section">
          <div className="container legal-page-inner">
            <h1>{title}</h1>
            {sections.map((section) => (
              <div className="legal-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default LegalPage;
