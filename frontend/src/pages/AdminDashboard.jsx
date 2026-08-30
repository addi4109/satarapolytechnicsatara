import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import DebugPanel from '../components/DebugPanel';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Admin.css';

const API_URL = '/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    cells: 0, departments: 0, photos: 0, videos: 0,
    news: 0, recruiters: 0, notices: 0, slides: 0, enquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);

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
        const enquiriesSnap = await getDocs(collection(db, 'enquiries'));
        setStats({
          cells: cells.length,
          departments: depts.length,
          photos: photos.length,
          videos: videos.length,
          news: news.length,
          recruiters: recruiters.length,
          notices: notices.length,
          slides: slides.length,
          enquiries: enquiriesSnap.size,
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
        <h1>Dashboard</h1>
      </div>
      <div className="admin-content">
        {/* Header */}
        <div className="dash-header">
          <h2 className="dash-header-title">Satara Polytechnic, Satara</h2>
          <p className="dash-header-sub">Admin Panel</p>
          <p className="dash-header-by">Built by Aditya Sawant</p>
        </div>

        {/* Stats */}
        <div className="dash-stats-grid">
          <Link to="/admin/cells" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.cells}</div>
            <div className="dash-stat-label">Cells & Committees</div>
          </Link>
          <Link to="/admin/departments" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.departments}</div>
            <div className="dash-stat-label">Departments</div>
          </Link>
          <Link to="/admin/gallery" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.photos}</div>
            <div className="dash-stat-label">Photos</div>
          </Link>
          <Link to="/admin/gallery" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.videos}</div>
            <div className="dash-stat-label">Videos</div>
          </Link>
          <Link to="/admin/gallery" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.news}</div>
            <div className="dash-stat-label">News</div>
          </Link>
          <Link to="/admin/gallery" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.recruiters}</div>
            <div className="dash-stat-label">Recruiters</div>
          </Link>
          <Link to="/admin/gallery" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.slides}</div>
            <div className="dash-stat-label">Slider</div>
          </Link>
          <Link to="/admin/notices" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.notices}</div>
            <div className="dash-stat-label">Notices</div>
          </Link>
          <Link to="/admin/enquiries" className="dash-stat-card">
            <div className="dash-stat-num">{loading ? '—' : stats.enquiries}</div>
            <div className="dash-stat-label">Enquiries</div>
          </Link>
        </div>

        {/* Quick Actions */}
        <h3 className="dash-section-title">Quick Actions</h3>
        <div className="dash-actions-grid">
          <Link to="/admin/cells/new" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#d4edda', color: '#155724' }}>+</div>
            <div className="dash-action-info">
              <span className="dash-action-name">Add Cell</span>
              <span className="dash-action-desc">Create a new cell or committee</span>
            </div>
          </Link>

          <Link to="/admin/departments/new" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#d4edda', color: '#155724' }}>+</div>
            <div className="dash-action-info">
              <span className="dash-action-name">Add Department</span>
              <span className="dash-action-desc">Create a new department</span>
            </div>
          </Link>

          <Link to="/admin/gallery" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div className="dash-action-info">
              <span className="dash-action-name">Gallery</span>
              <span className="dash-action-desc">Manage photos, videos & news</span>
            </div>
          </Link>

          <Link to="/admin/notices" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#fff3cd', color: '#856404' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="dash-action-info">
              <span className="dash-action-name">Notices</span>
              <span className="dash-action-desc">Post & manage notices</span>
            </div>
          </Link>

          <Link to="/admin/enquiries" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#f8d7da', color: '#721c24' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="dash-action-info">
              <span className="dash-action-name">Enquiries</span>
              <span className="dash-action-desc">View admission enquiries</span>
            </div>
          </Link>

          <Link to="/admin/placements" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12z"/></svg>
            </div>
            <div className="dash-action-info">
              <span className="dash-action-name">Placements</span>
              <span className="dash-action-desc">Manage placement records</span>
            </div>
          </Link>

          <a href="/" target="_blank" className="dash-action-card">
            <div className="dash-action-icon" style={{ background: '#f5f7fa', color: '#243358' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </div>
            <div className="dash-action-info">
              <span className="dash-action-name">View Website</span>
              <span className="dash-action-desc">Open live site in new tab</span>
            </div>
          </a>

          <button className="dash-action-card" onClick={() => setShowDebug(true)}>
            <div className="dash-action-icon" style={{ background: '#f5f0ff', color: '#6f42c1' }}>🛠️</div>
            <div className="dash-action-info">
              <span className="dash-action-name">Debug Panel</span>
              <span className="dash-action-desc">Check integration status</span>
            </div>
          </button>
        </div>

        <DebugPanel isOpen={showDebug} onClose={() => setShowDebug(false)} />
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
