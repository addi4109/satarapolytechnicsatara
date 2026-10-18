import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO, { breadcrumbSchema } from '../components/SEO';
import { setAdminApiKey } from '../lib/adminApi';
import API_URL from '../lib/api';
import './GrievancePortal.css';

const COLLEGE_LOGO =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLd7Dy_lmlGJVHmuU9Xft3chSek82jrLr2qJZ_Rl8kuw&s=10';

// Small quick-info strip under the portal box.
const quickInfo = [
  { label: 'Acknowledgement', value: 'Within 3 working days' },
  { label: 'Resolution', value: 'Within 15 working days' },
  { label: 'Confidentiality', value: '100% — no victimisation' },
];

function GrievancePortal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', apiKey: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Committee / admin sign-in — same credentials as the admin panel.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          apiKey: form.apiKey.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('adminAuth', 'true');
        setAdminApiKey(form.apiKey.trim());
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Grievance Redressal Portal | Satara Polytechnic, Satara"
        description="Online Grievance Redressal Portal of Satara Polytechnic, Satara — committee sign-in, grievance redressal process and contact details of the Grievance Redressal Cell."
        keywords="grievance portal, grievance redressal portal, student grievance Satara Polytechnic, complaint cell, AICTE grievance"
        url="/student/grievance-portal"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Student Section' },
          { name: 'Grievance Portal' },
        ])}
      />

      <div className="gp-page">
        {/* ===== Portal header — college identity block (as in the ERP portal) ===== */}
        <div className="gp-header">
          <div className="gp-header-left">
            <div className="gp-logo-circle">
              <img src={COLLEGE_LOGO} alt="Satara Polytechnic, Satara Logo" width="84" height="84" />
            </div>
            <div className="gp-header-text">
              <p className="gp-society">Satara Education Society's</p>
              <h1 className="gp-college">Satara Polytechnic, Satara</h1>
              <p className="gp-address">
                At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra, India.
              </p>
            </div>
          </div>
          <div className="gp-header-right">
            <p className="gp-portal-title">
              Grievance <strong>Redressal</strong> Portal
            </p>
            <p className="gp-portal-sub">AICTE Grievance Redressal Cell</p>
          </div>
        </div>

        {/* ===== Divider bar ===== */}
        <div className="gp-divider" />

        {/* ===== Portal login box ===== */}
        <div className="gp-box">
          <div className="gp-box-header">Grievance Redressal Portal</div>
          <div className="gp-box-body">
            <p className="gp-box-intro">Committee / Admin Login</p>

            <form className="gp-form" onSubmit={handleSubmit}>
              {error && <div className="gp-form-error">{error}</div>}

              <div className="gp-form-group">
                <label htmlFor="gp-email">Email</label>
                <input
                  id="gp-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="gp-form-group">
                <label htmlFor="gp-password">Password</label>
                <input
                  id="gp-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="gp-form-group">
                <label htmlFor="gp-apikey">API Key</label>
                <input
                  id="gp-apikey"
                  type="password"
                  name="apiKey"
                  value={form.apiKey}
                  onChange={handleChange}
                  placeholder="Enter admin API key"
                  autoComplete="off"
                  required
                />
              </div>

              <button type="submit" className="gp-login-btn" disabled={loading}>
                {loading ? 'Logging in…' : 'Login'}
              </button>
            </form>

            <p className="gp-form-note">
              Students &amp; parents can lodge a grievance on the{' '}
              <Link to="/student/grievance-redressal">Grievance Redressal page</Link>.
            </p>
          </div>
        </div>

        {/* ===== Quick info strip ===== */}
        <div className="gp-quick">
          {quickInfo.map((item) => (
            <div className="gp-quick-item" key={item.label}>
              <span className="gp-quick-label">{item.label}</span>
              <span className="gp-quick-value">{item.value}</span>
            </div>
          ))}
        </div>

        {/* ===== Portal footer links ===== */}
        <div className="gp-footer-links">
          <Link to="/">Go to home page</Link>
          <span className="gp-sep">|</span>
          <Link to="/student/grievance-redressal">Need Help?</Link>
        </div>
        <p className="gp-copyright">
          All rights reserved. Satara Education Society's Satara Polytechnic, Satara. &copy;{new Date().getFullYear()}.
        </p>
      </div>
    </>
  );
}

export default GrievancePortal;
