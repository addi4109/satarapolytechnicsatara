import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAdminApiKey, clearAdminApiKey } from '../lib/adminApi';
import './Admin.css';

// Intercept fetch in admin context to auto-inject x-admin-key
const originalFetch = window.fetch;
let adminFetchPatched = false;

function patchFetchForAdmin() {
  if (adminFetchPatched) return;
  adminFetchPatched = true;
  window.fetch = (url, opts = {}) => {
    const method = (opts.method || 'GET').toUpperCase();
    // Only inject admin key for requests to our own API (skip external services like Cloudinary)
    const isExternal = typeof url === 'string' && !url.startsWith('/api') && !url.startsWith(window.location.origin);
    if (method !== 'GET' && method !== 'HEAD' && !isExternal) {
      opts.headers = { ...opts.headers, 'x-admin-key': getAdminApiKey() };
    }
    return originalFetch(url, opts);
  };
}

function unpatchFetch() {
  if (!adminFetchPatched) return;
  window.fetch = originalFetch;
  adminFetchPatched = false;
}

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    patchFetchForAdmin();
    return () => unpatchFetch();
  }, [navigate]);

  const isActive = (path) => location.pathname === path;

  const NAV_LINKS = [
    { to: '/admin/about', label: 'About' },
    { to: '/admin/admissions', label: 'Admissions' },
    { to: '/admin/placements', label: 'Placements' },
    { to: '/admin/management', label: 'Management' },
    { to: '/admin/cells', label: 'Cells & Committees' },
    { to: '/admin/departments', label: 'Departments' },
    { to: '/admin/gallery', label: 'Gallery' },
    { to: '/admin/campus', label: 'Campus' },
    { to: '/admin/activities', label: 'Activities' },
    { to: '/admin/examinations', label: 'Examination' },
    { to: '/admin/notices', label: 'Notices' },
    { to: '/admin/contact', label: 'Contact' },
    { to: '/admin/enquiries', label: 'Enquiries' },
    { to: '/admin/feedbacks', label: 'Feedbacks' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    clearAdminApiKey();
    unpatchFetch();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <p>Satara Polytechnic</p>
        </div>
        <nav className="admin-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`admin-nav-item ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {/* Mobile top strip - horizontal nav shown only on small screens */}
        <div className="admin-mobile-strip">
          <div className="admin-mobile-strip-links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`admin-mobile-strip-item ${isActive(link.to) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button className="admin-mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
