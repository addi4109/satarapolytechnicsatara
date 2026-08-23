import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import PdfUpload from '../components/PdfUpload';
import './Admin.css';

const API_URL = '/api';

const emptyNotice = { title: '', text: '', category: 'general', pdfUrl: '', active: true, order: 0 };

// Split an existing attachment between the upload and link sections
const splitAttachment = (pdfUrl = '') => {
  if (!pdfUrl) return { _uploadPdf: '', _pdfLink: '' };
  return pdfUrl.includes('supabase') || pdfUrl.includes('/storage/')
    ? { _uploadPdf: pdfUrl, _pdfLink: '' }
    : { _uploadPdf: '', _pdfLink: pdfUrl };
};

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyNotice });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('notices');

  useEffect(() => { fetchNotices(); }, []);

  const filteredNotices = notices.filter((n) =>
    activeTab === 'notices' ? n.category !== 'tinker' : n.category === 'tinker'
  );

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notices/all`);
      const data = await res.json();
      setNotices(data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load notices' });
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyNotice, category: activeTab === 'tinker' ? 'tinker' : 'general' });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({ ...item, ...splitAttachment(item.pdfUrl) });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editId ? `${API_URL}/notices/${editId}` : `${API_URL}/notices`;
      const method = editId ? 'PUT' : 'POST';
      const attachment = (form._uploadPdf || '').trim() || (form._pdfLink || '').trim();
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          text: form.text,
          category: form.category,
          active: form.active,
          order: form.order,
          pdfUrl: attachment,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: editId ? 'Updated!' : 'Added!' });
        setShowForm(false);
        setEditId(null);
        fetchNotices();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/notices/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: 'Deleted' });
      fetchNotices();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Notices</h1>
        <div className="admin-topbar-actions">
          <button className="btn btn-success" onClick={openAdd}>+ Add Notice</button>
        </div>
      </div>
      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMessage(null)}>x</button>
          </div>
        )}

        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '4px', flexWrap: 'wrap' }}>
          <button
            className={`gallery-tab ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => { setActiveTab('notices'); setShowForm(false); }}
          >
            Notices
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{notices.filter((n) => n.category !== 'tinker').length}</span>
          </button>
          <button
            className={`gallery-tab ${activeTab === 'tinker' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tinker'); setShowForm(false); }}
          >
            Notice Tinker
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{notices.filter((n) => n.category === 'tinker').length}</span>
          </button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="dept-form-card" style={{ marginBottom: '24px' }}>
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div><h3>{editId ? 'Edit' : 'Add'} Notice</h3></div>
            </div>
            <div className="dept-form-card-body">
              <form className="admin-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title" required />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea value={form.text || ''} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} placeholder="Notice description" required />
                </div>
                <div className="form-group">
                  <label>Upload PDF (optional)</label>
                  <PdfUpload value={form._uploadPdf || ''} onChange={(url) => setForm({ ...form, _uploadPdf: url })} />
                </div>
                <div className="form-group">
                  <label>PDF Link (optional)</label>
                  <input type="text" value={form._pdfLink || ''} onChange={(e) => setForm({ ...form, _pdfLink: e.target.value })} placeholder="https://example.com/notice.pdf" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <div className="toggle-row">
                    <button type="button" className={`toggle-switch ${form.active !== false ? 'active' : ''}`} onClick={() => setForm({ ...form, active: form.active === false ? true : false })}>
                      <span className="toggle-knob"></span>
                    </button>
                    <span className="toggle-label">{form.active !== false ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
                  <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notices Table */}
        {!showForm && (
          loading ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
          ) : filteredNotices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>No notices yet.</p>
              <button className="btn btn-success" onClick={openAdd}>Add First Notice</button>
            </div>
          ) : (
            <div className="admin-card">
              <div className="admin-card-header">
                <h3>{activeTab === 'tinker' ? 'Notice Tinker' : 'All Notices'} ({filteredNotices.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>Sr. No.</th>
                      <th>Title</th>
                      <th style={{ width: '120px' }}>Date</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>Status</th>
                      <th style={{ width: '220px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotices.map((notice, index) => (
                      <tr key={notice._id}>
                        <td style={{ textAlign: 'center', fontWeight: '600', color: '#243358' }}>{index + 1}</td>
                        <td>
                          <div style={{ fontWeight: '500', color: '#333' }}>{notice.title}</div>
                          {notice.text && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{notice.text.substring(0, 80)}{notice.text.length > 80 ? '...' : ''}</div>}
                        </td>
                        <td style={{ fontSize: '13px', color: '#666' }}>{new Date(notice.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${notice.active ? 'badge-cell' : 'badge-committee'}`}>{notice.active ? 'On' : 'Off'}</span>
                        </td>
                        <td>
                          <div className="actions" style={{ justifyContent: 'center' }}>
                            {notice.pdfUrl ? (
                              <a href={notice.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>View</a>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => openEdit(notice)}>View</button>
                            )}
                            {notice.pdfUrl && <a href={notice.pdfUrl} download className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>Download</a>}
                            <button className="btn btn-primary btn-sm" onClick={() => openEdit(notice)}>Edit</button>
                            {deleteConfirm === notice._id ? (
                              <>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(notice._id)}>Yes</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                              </>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(notice._id)}>Del</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminNotices;
