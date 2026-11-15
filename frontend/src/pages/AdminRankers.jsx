import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminLoading from '../components/AdminLoading';
import ImageUpload from '../components/ImageUpload';
import RankerCard from '../components/RankerCard';
import './Admin.css';
import './AdminRankers.css';

import API_URL from '../lib/api';

const emptyRanker = { rank: 1, name: '', photo: '', branch: '', year: '', score: '' };

function AdminRankers() {
  const [rankers, setRankers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyRanker });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchRankers = async () => {
    try {
      const res = await fetch(`${API_URL}/rankers`);
      const data = await res.json();
      setRankers(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load rankers' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankers();
  }, []);

  const openAdd = () => {
    const used = rankers.map((r) => r.rank);
    const nextRank = [1, 2, 3].find((rank) => !used.includes(rank)) || 1;
    setEditId(null);
    setForm({ ...emptyRanker, rank: nextRank });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      rank: item.rank || 1,
      name: item.name || '',
      photo: item.photo || '',
      branch: item.branch || '',
      year: item.year || '',
      score: item.score || '',
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ ...emptyRanker });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: 'Student name is required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const url = editId ? `${API_URL}/rankers/${editId}` : `${API_URL}/rankers`;
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rank: Number(form.rank) }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: editId ? 'Updated!' : 'Added!' });
        cancelForm();
        fetchRankers();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/rankers/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: 'Deleted' });
      fetchRankers();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setDeleteConfirm(null);
  };

  const sortedRankers = [...rankers].sort((a, b) => (a.rank || 0) - (b.rank || 0));

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Institute Rankers</h1>
        <div className="admin-topbar-actions">
          <button type="button" className="btn btn-success" onClick={openAdd}>
            + Add Ranker
          </button>
        </div>
      </div>

      <div className="admin-content">
        <AdminAlert type={message?.type} message={message} onDismiss={() => setMessage(null)} />

        <div className="admin-sec-head">
          <h2>Homepage Rankers</h2>
          <p>These three cards appear below Latest News on the homepage. Assign one student per rank.</p>
        </div>

        {showForm && (
          <div className="admin-card" style={{ marginBottom: '24px', borderColor: '#c8963e', borderWidth: '2px' }}>
            <div className="admin-card-header">
              <h3>{editId ? 'Edit Ranker' : 'Add Ranker'}</h3>
              <button type="button" className="alert-dismiss-btn" onClick={cancelForm} style={{ fontSize: '20px' }}>
                ×
              </button>
            </div>
            <div className="admin-card-body">
              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rank *</label>
                    <select value={form.rank} onChange={(e) => handleChange('rank', Number(e.target.value))}>
                      <option value={1}>Rank 1</option>
                      <option value={2}>Rank 2</option>
                      <option value={3}>Rank 3</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Student Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Branch / Course</label>
                    <input
                      type="text"
                      value={form.branch}
                      onChange={(e) => handleChange('branch', e.target.value)}
                      placeholder="e.g. Computer Engineering"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      value={form.year}
                      onChange={(e) => handleChange('year', e.target.value)}
                      placeholder="e.g. 2025-26"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Percentage / CGPA</label>
                  <input
                    type="text"
                    value={form.score}
                    onChange={(e) => handleChange('score', e.target.value)}
                    placeholder="e.g. 92.40%"
                  />
                </div>

                <div className="form-group">
                  <ImageUpload
                    value={form.photo}
                    onChange={(url) => handleChange('photo', url)}
                    label="Student Photo"
                    placeholder="Upload ranker photo..."
                    circle
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e4e8ed' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : editId ? 'Update Ranker' : 'Add Ranker'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={cancelForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <AdminLoading text="Loading rankers..." />
        ) : sortedRankers.length === 0 ? (
          <div className="admin-card">
            <div className="admin-card-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ margin: '0 0 6px', color: '#243358', fontWeight: 600 }}>No rankers added yet.</p>
              <p style={{ margin: 0, color: '#777', fontSize: '13px' }}>
                Click "+ Add Ranker" to create the Rank 1, Rank 2 and Rank 3 cards.
              </p>
            </div>
          </div>
        ) : (
          <div className="rankers-grid admin-rankers-grid">
            {sortedRankers.map((ranker) => (
              <div className="admin-ranker-item" key={ranker._id}>
                <RankerCard ranker={ranker} />

                <div className="admin-ranker-actions">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(ranker)}>
                    Edit
                  </button>
                  {deleteConfirm === ranker._id ? (
                    <>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(ranker._id)}>
                        Confirm Delete
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(ranker._id)}>
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

export default AdminRankers;
