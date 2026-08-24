import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ cells: 0, departments: 0, photos: 0, videos: 0, news: 0, recruiters: 0, notices: 0, slides: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingScreenEnabled, setLoadingScreenEnabled] = useState(true);
  const [savingSetting, setSavingSetting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cells, depts, photos, videos, news, recruiters, notices, slides, settings] = await Promise.all([
          fetch(`${API_URL}/cells`).then((r) => r.json()),
          fetch(`${API_URL}/departments`).then((r) => r.json()),
          fetch(`${API_URL}/photos`).then((r) => r.json()),
          fetch(`${API_URL}/videos`).then((r) => r.json()),
          fetch(`${API_URL}/news`).then((r) => r.json()),
          fetch(`${API_URL}/recruiters`).then((r) => r.json()),
          fetch(`${API_URL}/notices/all`).then((r) => r.json()),
          fetch(`${API_URL}/slides`).then((r) => r.json()),
          fetch(`${API_URL}/settings`).then((r) => r.json()),
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
        if (settings.loadingScreen !== undefined) {
          setLoadingScreenEnabled(settings.loadingScreen);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleLoadingScreen = async () => {
    const newValue = !loadingScreenEnabled;
    setSavingSetting(true);
    try {
      await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'loadingScreen', value: newValue }),
      });
      setLoadingScreenEnabled(newValue);
    } catch (err) {
      console.error('Failed to update setting:', err);
    } finally {
      setSavingSetting(false);
    }
  };

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

        {/* Site Settings */}
        <div className="admin-card" style={{ marginBottom: '24px' }}>
          <div className="admin-card-header">
            <h3>Site Settings</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e4e8ed' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#243358' }}>Loading Screen (Splash)</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#888' }}>Show intro loading screen on homepage visit</p>
              </div>
              <button
                onClick={toggleLoadingScreen}
                disabled={savingSetting}
                style={{
                  position: 'relative',
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  border: 'none',
                  cursor: savingSetting ? 'not-allowed' : 'pointer',
                  background: loadingScreenEnabled ? '#315C4A' : '#ccc',
                  transition: 'background 0.3s',
                  opacity: savingSetting ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: loadingScreenEnabled ? '25px' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.3s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                />
              </button>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '11px', color: loadingScreenEnabled ? '#315C4A' : '#999', fontWeight: 500 }}>
              {loadingScreenEnabled ? '✓ Loading screen is ON — visitors will see the splash screen' : '○ Loading screen is OFF — visitors go directly to the website'}
            </p>
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
