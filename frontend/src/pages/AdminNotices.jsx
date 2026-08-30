import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import PdfUpload from '../components/PdfUpload';
import ImageUpload from '../components/ImageUpload';
import './Admin.css';

const API_URL = '/api';

const emptyNotice = { title: '', text: '', category: 'general', pdfUrl: '', imageUrl: '', active: true, order: 0 };

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

  const filteredNotices = notices.filter((n) => {
    if (activeTab === 'notices') return n.category !== 'tinker' && n.category !== 'admission';
    if (activeTab === 'admission') return n.category === 'admission';
    return n.category === 'tinker';
  });

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
    setForm({ ...emptyNotice, category: activeTab === 'tinker' ? 'tinker' : activeTab === 'admission' ? 'admission' : 'general' });
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
          imageUrl: (form.imageUrl || '').trim(),
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
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{notices.filter((n) => n.category !== 'tinker' && n.category !== 'admission').length}</span>
          </button>
          <button
            className={`gallery-tab ${activeTab === 'admission' ? 'active' : ''}`}
            onClick={() => { setActiveTab('admission'); setShowForm(false); }}
          >
            Admission Notice
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{notices.filter((n) => n.category === 'admission').length}</span>
          </button>
          <button
            className={`gallery-tab ${activeTab === 'tinker' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tinker'); setShowForm(false); }}
          >
            Notice Tinker
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{notices.filter((n) => n.category === 'tinker').length}</span>
          </button>
        </div>

        {/* Card Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Add New Card */}
            <div
              onClick={openAdd}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '180px', border: '2px dashed #b9c3d4', borderRadius: '10px', cursor: 'pointer',
                background: '#fff', transition: 'all 0.25s ease', gap: '10px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2a5a8a'; e.currentTarget.style.background = '#f8f9fa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#b9c3d4'; e.currentTarget.style.background = '#fff'; }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#2a5a8a', fontWeight: 300 }}>+</div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#2a5a8a' }}>Add Notice</span>
            </div>

            {/* Notice Cards */}
            {filteredNotices.map((notice) => (
              <div key={notice._id} style={{
                background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '16px',
                display: 'flex', flexDirection: 'column', position: 'relative',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(36,51,88,0.1)'; e.currentTarget.style.borderColor = '#d4a54a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e4e8ed'; }}
              >
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className={`badge ${notice.active ? 'badge-cell' : 'badge-committee'}`} style={{ fontSize: '10px' }}>{notice.active ? 'Active' : 'Inactive'}</span>
                </div>

                {/* Image Preview */}
                {notice.imageUrl && (
                  <img src={notice.imageUrl} alt={notice.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e4e8ed' }} />
                )}

                {/* Title */}
                <h4 style={{ margin: '0 0 4px', color: '#2a5a8a', fontSize: '15px', fontWeight: 700, paddingRight: '60px' }}>{notice.title}</h4>

                {/* Description */}
                {notice.text && (
                  <p style={{ margin: '0 0 8px', color: '#666', fontSize: '13px', lineHeight: '1.5', flex: 1 }}>
                    {notice.text.substring(0, 100)}{notice.text.length > 100 ? '...' : ''}
                  </p>
                )}

                {/* Date */}
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#999' }}>{new Date(notice.createdAt).toLocaleDateString('en-IN')}</p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(notice.pdfUrl || notice.imageUrl) && (
                    <a
                      href={notice.pdfUrl ? `/api/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                      target="_blank"
                      style={{ padding: '5px 12px', background: '#2a5a8a', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', textDecoration: 'none' }}
                    >View</a>
                  )}
                  {(notice.pdfUrl || notice.imageUrl) && (
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        const fileUrl = notice.pdfUrl || notice.imageUrl;
                        const ext = notice.pdfUrl ? 'pdf' : 'jpg';
                        const fileName = `${notice.title.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;
                        try {
                          const res = await fetch(fileUrl);
                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = fileName;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch { window.open(fileUrl, '_blank'); }
                      }}
                      style={{ padding: '5px 12px', background: '#fff', color: '#2a5a8a', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #2a5a8a', textDecoration: 'none', cursor: 'pointer' }}
                    >Download</a>
                  )}
                  <button
                    onClick={() => openEdit(notice)}
                    style={{ padding: '5px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                  >Edit</button>
                  {deleteConfirm === notice._id ? (
                    <>
                      <button onClick={() => handleDelete(notice._id)} style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Yes</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '5px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>No</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(notice._id)}
                      style={{ padding: '5px 12px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}
                    >Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) cancelForm(); }}
        >
          <div style={{
            background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '520px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e8ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: '#2a5a8a', fontSize: '17px' }}>{editId ? 'Edit' : 'Add'} {activeTab === 'tinker' ? 'Tinker Notice' : 'Notice'}</h3>
              <button onClick={cancelForm} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              <form onSubmit={handleSave}>
                {activeTab === 'tinker' ? (
                  <>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Notice Text *</label>
                      <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value, text: e.target.value })} placeholder="Enter notice text (one line)" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Status</label>
                      <div className="toggle-row">
                        <button type="button" className={`toggle-switch ${form.active !== false ? 'active' : ''}`} onClick={() => setForm({ ...form, active: form.active === false ? true : false })}>
                          <span className="toggle-knob"></span>
                        </button>
                        <span className="toggle-label">{form.active !== false ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Title *</label>
                      <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Description *</label>
                      <textarea value={form.text || ''} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} placeholder="Notice description" required style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Upload Image (optional)</label>
                      <ImageUpload value={form.imageUrl || ''} onChange={(url) => setForm({ ...form, imageUrl: url })} label="" placeholder="Upload notice image" />
                    </div>
                    {form.imageUrl && (
                      <div style={{ marginBottom: '14px' }}>
                        <img src={form.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '6px', border: '1px solid #e4e8ed', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Upload PDF (optional)</label>
                      <PdfUpload value={form._uploadPdf || ''} onChange={(url) => setForm({ ...form, _uploadPdf: url })} />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Status</label>
                      <div className="toggle-row">
                        <button type="button" className={`toggle-switch ${form.active !== false ? 'active' : ''}`} onClick={() => setForm({ ...form, active: form.active === false ? true : false })}>
                          <span className="toggle-knob"></span>
                        </button>
                        <span className="toggle-label">{form.active !== false ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e4e8ed' }}>
                  <button type="submit" className="btn btn-success" disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Notice'}</button>
                  <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminNotices;
