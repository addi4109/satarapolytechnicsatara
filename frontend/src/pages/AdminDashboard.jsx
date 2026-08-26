import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ cells: 0, departments: 0, photos: 0, videos: 0, news: 0, recruiters: 0, notices: 0, slides: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cells, depts, photos, videos, news, recruiters, notices, slides] = await Promise.all([
          fetch(`${API_URL}/cells`).then((r) => r.json()),
          fetch(`${API_URL}/departments`).then((r) => r.json()),
          fetch(`${API_URL}/photos`).then((r) => r.json()),
          fetch(`${API_URL}/videos`).then((r) => r.json()),
          fetch(`${API_URL}/news`).then((r) => r.json()),
          fetch(`${API_URL}/recruiters`).then((r) => r.json()),
          fetch(`${API_URL}/notices/all`).then((r) => r.json()),
          fetch(`${API_URL}/slides`).then((r) => r.json()),
        ]);
        setStats({
          cells: cells.length,
          departments: depts.length,
          photos: photos.length,
          videos: videos.length,
          news: news.length,
          recruiters: recruiters.length,
          notices: notices.length,
          slides: slides.length,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Welcome, Admin</h1>
      </div>
      <div className="admin-content">
        {/* Welcome Card */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <div style={{ padding: '30px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '24px', color: '#7A263A', margin: '0 0 8px' }}>Satara Polytechnic Admin Panel</h2>
            <p style={{ fontSize: '14px', color: '#888', margin: '0 0 12px' }}>Manage your website content from here</p>
            <p style={{ fontSize: '12px', color: '#315C4A', fontWeight: 600, margin: 0 }}>Built by Aditya Sawant</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }}>
          <Link to="/admin/cells" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.cells}</span>
            <span className="dashboard-stat-label">Cells & Committees</span>
          </Link>
          <Link to="/admin/departments" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.departments}</span>
            <span className="dashboard-stat-label">Departments</span>
          </Link>
          <Link to="/admin/gallery" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.photos}</span>
            <span className="dashboard-stat-label">Photos</span>
          </Link>
          <Link to="/admin/gallery" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.videos}</span>
            <span className="dashboard-stat-label">Videos</span>
          </Link>
          <Link to="/admin/gallery" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.news}</span>
            <span className="dashboard-stat-label">News</span>
          </Link>
          <Link to="/admin/gallery" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.recruiters}</span>
            <span className="dashboard-stat-label">Recruiters</span>
          </Link>
          <Link to="/admin/gallery" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.slides}</span>
            <span className="dashboard-stat-label">Slider</span>
          </Link>
          <Link to="/admin/gallery" className="admin-dashboard-stat" style={{ textDecoration: 'none' }}>
            <span className="dashboard-stat-num">{loading ? '—' : stats.notices}</span>
            <span className="dashboard-stat-label">Notices</span>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Quick Actions</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/admin/cells/new" className="btn btn-success">+ Add Cell</Link>
            <Link to="/admin/departments/new" className="btn btn-success">+ Add Department</Link>
            <Link to="/admin/gallery" className="btn btn-primary">Manage Gallery</Link>
            <a href="/" target="_blank" className="btn btn-secondary">View Website ↗</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
