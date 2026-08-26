import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth')) {
      navigate('/admin/login');
    }
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
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
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
