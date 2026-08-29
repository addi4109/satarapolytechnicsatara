import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminApiKey } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminAlumni() {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth') || !getAdminApiKey()) {
      navigate('/admin/login');
      return;
    }
    fetchAlumni();
  }, [navigate]);

  const fetchAlumni = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/alumni`);
      const data = await res.json();
      setAlumni(data);
    } catch (err) {
      console.error('Failed to fetch alumni:', err);
      setError('Failed to load alumni data.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const departments = [...new Set(alumni.map((a) => a.department).filter(Boolean))];

  const filtered = alumni.filter((a) => {
    const matchesSearch =
      !searchTerm ||
      (a.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.phone || '').includes(searchTerm) ||
      (a.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || a.status === filterStatus;
    const matchesDept = !filterDept || a.department === filterDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/alumni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAlumni((prev) => prev.map((a) => (a._id === id ? updated : a)));
        if (selectedAlumni?._id === id) setSelectedAlumni(updated);
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this alumni record?')) return;
    try {
      const res = await fetch(`${API_URL}/alumni/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAlumni((prev) => prev.filter((a) => a._id !== id));
        if (selectedAlumni?._id === id) setSelectedAlumni(null);
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const startEditing = () => {
    if (!selectedAlumni) return;
    setEditForm({
      fullName: selectedAlumni.fullName || '',
      email: selectedAlumni.email || '',
      phone: selectedAlumni.phone || '',
      passingYear: selectedAlumni.passingYear || '',
      department: selectedAlumni.department || '',
      currentPosition: selectedAlumni.currentPosition || '',
      company: selectedAlumni.company || '',
      message: selectedAlumni.message || '',
      status: selectedAlumni.status || 'pending',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    if (!selectedAlumni || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/alumni/${selectedAlumni._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setAlumni((prev) => prev.map((a) => (a._id === selectedAlumni._id ? updated : a)));
        setSelectedAlumni(updated);
        setEditing(false);
        setEditForm(null);
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'approved': return { bg: '#dcfce7', color: '#166534' };
      case 'rejected': return { bg: '#fee2e2', color: '#991b1b' };
      default: return { bg: '#fef3c7', color: '#92400e' };
    }
  };

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Alumni Management</h1>
        <div className="admin-topbar-actions">
          <span style={{ fontSize: '13px', color: '#888', alignSelf: 'center' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
          <button className="btn btn-primary" onClick={fetchAlumni}>Refresh</button>
        </div>
      </div>

      <div className="admin-content">
        {error && (
          <div className="alert alert-error">
            {error}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif" }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif", minWidth: '140px' }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif", minWidth: '180px' }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading alumni...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            {alumni.length === 0
              ? 'No alumni registrations yet.'
              : 'No records match your search.'}
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="admin-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Passing Year</th>
                      <th>Status</th>
                      <th style={{ width: '120px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a, idx) => (
                      <tr
                        key={a._id}
                        onClick={() => setSelectedAlumni(selectedAlumni?._id === a._id ? null : a)}
                        style={{ cursor: 'pointer', background: selectedAlumni?._id === a._id ? '#f0f3f8' : 'transparent' }}
                      >
                        <td style={{ fontWeight: 600, color: '#243358' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{a.fullName || 'N/A'}</td>
                        <td>{a.phone || 'N/A'}</td>
                        <td>{a.email || 'N/A'}</td>
                        <td>
                          <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>
                            {a.department || 'N/A'}
                          </span>
                        </td>
                        <td>{a.passingYear || 'N/A'}</td>
                        <td>
                          <span style={{ ...statusColor(a.status), padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {a.status || 'pending'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {a.status !== 'approved' && (
                              <button
                                className="btn btn-primary btn-sm"
                                title="Approve"
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(a._id, 'approved'); }}
                              >✓</button>
                            )}
                            {a.status !== 'rejected' && (
                              <button
                                className="btn btn-secondary btn-sm"
                                title="Reject"
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(a._id, 'rejected'); }}
                              >✗</button>
                            )}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => { e.stopPropagation(); handleDelete(a._id); }}
                            >Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Card */}
            {selectedAlumni && (
              <div style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '24px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e4e8ed' }}>
                  <h3 style={{ margin: 0, fontFamily: "'Georgia', serif", color: '#243358' }}>Alumni Details</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!editing ? (
                      <button className="btn btn-primary btn-sm" onClick={startEditing}>Edit</button>
                    ) : (
                      <>
                        <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setEditForm(null); }}>Cancel</button>
                      </>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedAlumni(null); setEditing(false); setEditForm(null); }}>Close</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {editing ? (
                    <>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Full Name</label>
                        <input type="text" value={editForm.fullName} onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Email</label>
                        <input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Phone</label>
                        <input type="text" value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Passing Year</label>
                        <input type="text" value={editForm.passingYear} onChange={(e) => setEditForm((p) => ({ ...p, passingYear: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Department</label>
                        <select value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }}>
                          <option value="">Select</option>
                          <option value="Computer Engineering">Computer Engineering</option>
                          <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Chemical Engineering">Chemical Engineering</option>
                          <option value="Electrical Engineering">Electrical Engineering</option>
                          <option value="Automobile Engineering">Automobile Engineering</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Current Position</label>
                        <input type="text" value={editForm.currentPosition} onChange={(e) => setEditForm((p) => ({ ...p, currentPosition: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Company</label>
                        <input type="text" value={editForm.company} onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Status</label>
                        <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' }}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Message</label>
                        <textarea value={editForm.message} onChange={(e) => setEditForm((p) => ({ ...p, message: e.target.value }))} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box', resize: 'vertical' }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Status</label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <span style={{ ...statusColor(selectedAlumni.status), padding: '4px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {selectedAlumni.status || 'pending'}
                          </span>
                          {selectedAlumni.status !== 'approved' && (
                            <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(selectedAlumni._id, 'approved')}>✓ Approve</button>
                          )}
                          {selectedAlumni.status !== 'rejected' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(selectedAlumni._id, 'rejected')}>✗ Reject</button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Full Name</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Phone</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Email</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.email || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Department</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.department || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Passing Year</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.passingYear || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Current Position</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.currentPosition || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Company</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.company || 'N/A'}</p>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Registered On</label>
                        <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{formatDate(selectedAlumni.createdAt)}</p>
                      </div>
                      {selectedAlumni.message && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>Message</label>
                          <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333', lineHeight: 1.6 }}>{selectedAlumni.message}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAlumni;
