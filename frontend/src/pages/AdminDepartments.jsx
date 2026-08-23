import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`${API_URL}/departments`);
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setMessage({ type: 'error', text: 'Failed to load departments' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/departments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = departments.filter((d) => d._id !== id);
        setDepartments(updated);
        if (selectedDept?._id === id) setSelectedDept(null);
        setMessage({ type: 'success', text: 'Department deleted successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete department' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete department' });
    }
    setDeleteConfirm(null);
  };

  const sectionItems = [
    { key: 'about', label: 'About' },
    { key: 'hod', label: 'HOD Desk' },
    { key: 'faculty', label: 'Faculty' },
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'curriculum', label: 'Curriculum / Syllabus' },
  ];

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Departments</h1>
        <div className="admin-topbar-actions">
          <Link to="/admin/departments/new" className="btn btn-success">
            Add New Department
          </Link>
        </div>
      </div>
      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button
              style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }}
              onClick={() => setMessage(null)}
            >
              x
            </button>
          </div>
        )}

        {/* Live Preview */}
        {selectedDept && (
          <div className="live-preview">
            <div className="live-preview-header">Live Preview - {selectedDept.name}</div>
            <div className="preview-cell-card">
              {selectedDept.image && (
                <div style={{ marginBottom: '12px', borderRadius: '6px', overflow: 'hidden', height: '180px' }}>
                  <img src={selectedDept.image} alt={selectedDept.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <h3 className="preview-cell-name">{selectedDept.name}</h3>
              <p className="preview-cell-desc">{selectedDept.about}</p>
              {selectedDept.hod && (
                <div style={{ marginTop: '12px', padding: '10px', background: '#F2E5E8', borderRadius: '4px' }}>
                  <strong>HOD:</strong> {selectedDept.hod} ({selectedDept.hodQual})
                </div>
              )}
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#666' }}>Intake: {selectedDept.intake}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>Faculty: {selectedDept.faculty?.length || 0}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>Infrastructure: {(selectedDept.labs?.length || 0) + (selectedDept.infrastructure?.length || 0)}</span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <strong style={{ fontSize: '13px', color: '#7A263A' }}>Sections:</strong>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {sectionItems.map((s) => (
                    <span key={s.key} style={{ padding: '3px 10px', background: '#F2E5E8', borderRadius: '10px', fontSize: '11px', color: '#7A263A' }}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Department Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : departments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: '#888', marginBottom: '16px' }}>No departments found.</p>
            <Link to="/admin/departments/new" className="btn btn-success">
              Add First Department
            </Link>
          </div>
        ) : (
          <div className="cells-admin-grid">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className={`cells-admin-card ${selectedDept?._id === dept._id ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept.image && (
                  <div style={{ height: '140px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                    <img src={dept.image} alt={dept.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div className="cells-admin-card-top">
                  <span className="cells-admin-card-count">
                    Intake: {dept.intake} | Faculty: {dept.faculty?.length || 0}
                  </span>
                </div>
                <h3 className="cells-admin-card-title">{dept.name}</h3>
                <p className="cells-admin-card-desc">
                  {dept.about
                    ? dept.about.length > 100
                      ? dept.about.substring(0, 100) + '...'
                      : dept.about
                    : 'No description'}
                </p>
                <div className="cells-admin-card-actions">
                  <Link
                    to={`/admin/departments/edit/${dept._id}`}
                    className="btn btn-primary btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  {deleteConfirm === dept._id ? (
                    <>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => { e.stopPropagation(); handleDelete(dept._id); }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(dept._id); }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDepartments;
