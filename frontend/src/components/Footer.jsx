import './Footer.css';
import { getCopyrightYear } from '../lib/siteConfig';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-accent"></div>

      <div className="footer-main">
        <div className="footer-inner">
          <div className="footer-brand">
            <h2 className="footer-logo">SPS</h2>
            <p className="footer-tagline">Satara Polytechnic, Satara</p>
            <p className="footer-desc">
              Shaping future engineers since 1983. A legacy of academic
              excellence, strong placements, and holistic development.
            </p>

          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-list">
              <li><a href="/about/college">About Us</a></li>
              <li><a href="/admissions/overview">Admissions</a></li>
              <li><a href="/departments/computer">Departments</a></li>
              <li><a href="/placements/cell">Placements</a></li>
              <li><a href="/examination/results">Results</a></li>
              <li><a href="/gallery/photos">Gallery</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Departments</h4>
            <ul className="footer-list">
              <li><a href="/departments/computer">Computer Engineering</a></li>
              <li><a href="/departments/etc">Electronics & Telecom</a></li>
              <li><a href="/departments/mechanical">Mechanical Engineering</a></li>
              <li><a href="/departments/electrical">Electrical Engineering</a></li>
              <li><a href="/departments/chemical">Chemical Engineering</a></li>
              <li><a href="/departments/auto">Automobile Engineering</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Reach Us</h4>
            <ul className="footer-contact">
              <li>
                <span className="fc-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <span>near NH - 4, near Khindwadi, Songaon, Satara 415519</span>
              </li>
              <li>
                <span className="fc-icon">✆</span>
                <span>+91-94233 42843</span>
              </li>
              <li>
                <span className="fc-icon">✉</span>
                <span>satarapolyinfo@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {getCopyrightYear()} Satara Polytechnic, Satara. All rights reserved.</p>
          <a href="/admin/login" className="footer-admin-link">Admin</a>
          <span className="built-by">Built by Aditya Sawant</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
