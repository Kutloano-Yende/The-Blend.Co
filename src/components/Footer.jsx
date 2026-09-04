import './Footer.css';

const footerColumns = [
  {
    heading: 'Shop',
    links: ['Hair', 'Hair Care', 'Beauty', 'New In', 'Sale'],
  },
  {
    heading: 'Support',
    links: ['Contact Us', 'Shipping', 'Returns', 'FAQ'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Wholesale'],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">The Blend.Co</span>
          <p className="footer-tagline">Premium hair &amp; beauty, crafted with intention.</p>
        </div>

        <div className="footer-columns">
          {footerColumns.map((col) => (
            <div className="footer-column" key={col.heading}>
              <h3 className="footer-column-heading">{col.heading}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} The Blend.Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
