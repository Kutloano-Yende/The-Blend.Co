import { Link } from 'react-router-dom';
import './Footer.css';

const footerColumns = [
  {
    heading: 'Shop',
    links: [
      { label: 'Hair', to: '/shop?category=hair' },
      { label: 'Hair Care', to: '/shop?category=hair-care' },
      { label: 'Beauty', to: '/shop?category=beauty' },
      { label: 'New In', to: '/shop?sort=newest' },
      { label: 'Sale', to: '/shop?sale=true' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Shipping', to: '/shipping' },
      { label: 'Returns', to: '/returns' },
      { label: 'FAQ', to: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Wholesale', to: '#' },
    ],
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
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
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
