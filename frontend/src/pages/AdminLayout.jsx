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
          <Link
            to="/admin/about"
            className={`admin-nav-item ${isActive('/admin/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link
            to="/admin/admissions"
            className={`admin-nav-item ${isActive('/admin/admissions') ? 'active' : ''}`}
          >
            Admissions
          </Link>
          <Link
            to="/admin/placements"
            className={`admin-nav-item ${isActive('/admin/placements') ? 'active' : ''}`}
          >
            Placements
          </Link>
          <Link
            to="/admin/management"
            className={`admin-nav-item ${isActive('/admin/management') ? 'active' : ''}`}
          >
            Management
          </Link>
          <Link
            to="/admin/cells"
            className={`admin-nav-item ${isActive('/admin/cells') ? 'active' : ''}`}
          >
            Cells & Committees
          </Link>
          <Link
            to="/admin/departments"
            className={`admin-nav-item ${isActive('/admin/departments') ? 'active' : ''}`}
          >
            Departments
          </Link>
          <Link
            to="/admin/gallery"
            className={`admin-nav-item ${isActive('/admin/gallery') ? 'active' : ''}`}
          >
            Gallery
          </Link>
          <Link
            to="/admin/campus"
            className={`admin-nav-item ${isActive('/admin/campus') ? 'active' : ''}`}
          >
            Campus
          </Link>
          <Link
            to="/admin/activities"
            className={`admin-nav-item ${isActive('/admin/activities') ? 'active' : ''}`}
          >
            Activities
          </Link>
          <Link
            to="/admin/examinations"
            className={`admin-nav-item ${isActive('/admin/examinations') ? 'active' : ''}`}
          >
            Examination
          </Link>
          <Link
            to="/admin/notices"
            className={`admin-nav-item ${isActive('/admin/notices') ? 'active' : ''}`}
          >
            Notices
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
