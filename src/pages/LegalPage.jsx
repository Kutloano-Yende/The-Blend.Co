import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import './InfoPage.css';
import './LegalPage.css';

const LINK_PATTERN = /\[\[(.+?)\|(.+?)\]\]/g;

function renderWithLinks(text) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<Link key={match.index} to={match[2]}>{match[1]}</Link>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

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
                  <p key={idx}>{renderWithLinks(paragraph)}</p>
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
