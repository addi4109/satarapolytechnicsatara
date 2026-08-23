import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  type: 'cell',
  order: 0,
  members: [],
};

function AdminCellForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchCell();
    }
  }, [id]);

  const fetchCell = async () => {
    try {
      const res = await fetch(`${API_URL}/cells`);
      const cells = await res.json();
      const cell = cells.find((c) => c._id === id);
      if (cell) {
        setForm({
          name: cell.name || '',
          slug: cell.slug || '',
          description: cell.description || '',
          type: cell.type || 'cell',
          order: cell.order || 0,
          members: cell.members || [],
        });
      } else {
        setMessage({ type: 'error', text: 'Cell not found' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load cell' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const addMember = () => {
    setForm((prev) => ({
      ...prev,
      members: [...prev.members, { name: '', designation: '', phone: '', position: '' }],
    }));
  };

  const updateMember = (index, field, value) => {
    setForm((prev) => {
      const members = [...prev.members];
      members[index] = { ...members[index], [field]: value };
      return { ...prev, members };
    });
  };

  const removeMember = (index) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const url = isEdit ? `${API_URL}/cells/${id}` : `${API_URL}/cells`;
      const method = isEdit ? 'PUT' : 'POST';

      const data = {
        ...form,
        members: form.members.filter((m) => m.name.trim() !== ''),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: isEdit ? 'Cell updated successfully!' : 'Cell created successfully!' });
        setTimeout(() => navigate('/admin/cells'), 1000);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Is the server running?' });
    } finally {
      setSaving(false);
    }
  };

  // Filter valid members for preview
  const validMembers = form.members.filter((m) => m.name.trim() !== '');

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-topbar">
          <h1>Loading...</h1>
        </div>
        <div className="admin-content">
          <p>Loading cell data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>{isEdit ? 'Edit Cell / Committee' : 'Add New Cell / Committee'}</h1>
      </div>
      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'inherit',
              }}
              onClick={() => setMessage(null)}
            >
              x
            </button>
          </div>
        )}

        {/* Live Preview */}
        <div className="live-preview">
          <div className="live-preview-header">Live Preview</div>
          {form.name || form.description || validMembers.length > 0 ? (
            <div className="preview-cell-card">
              {form.type && (
                <span className={`preview-tag preview-tag-${form.type}`}>
                  {form.type}
                </span>
              )}
              <h3 className="preview-cell-name">{form.name || 'Cell Name'}</h3>
              <p className="preview-cell-desc">
                {form.description || 'Description will appear here...'}
              </p>
              {validMembers.length > 0 && (
                <table className="preview-members-table">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Designation</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validMembers.map((m, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{m.name}</td>
                        <td>{m.position}</td>
                        <td>{m.designation}</td>
                        <td>{m.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <p className="preview-empty">
              Start filling the form below to see a live preview here.
            </p>
          )}
        </div>

        <div className="form-bg-card">
          <div className="form-card-wrapper">
            <div className="admin-card form-card">
              <div className="admin-card-header">
                <h3>{isEdit ? 'Edit Details' : 'Cell Details'}</h3>
              </div>
              <div className="admin-card-body">
                <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Anti-Ragging Cell"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Slug (auto-generated)</label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto-generated-from-name"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="cell">Cell</option>
                    <option value="committee">Committee</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the purpose of this cell/committee..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Sort Order</label>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min={0}
                />
              </div>

              {/* Members Editor */}
              <div className="form-group">
                <label>Members</label>
                <div className="members-editor">
                  <div className="members-editor-header">
                    <span>Committee Members ({form.members.length})</span>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={addMember}
                    >
                      Add Member
                    </button>
                  </div>
                  {form.members.length === 0 ? (
                    <div className="members-empty">
                      No members added yet. Click "Add Member" to add one.
                    </div>
                  ) : (
                    form.members.map((member, idx) => (
                      <div className="member-row" key={idx}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => updateMember(idx, 'name', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={member.position || ''}
                          onChange={(e) => updateMember(idx, 'position', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Designation"
                          value={member.designation}
                          onChange={(e) => updateMember(idx, 'designation', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={member.phone}
                          onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                        />
                        <button
                          type="button"
                          className="member-remove-btn"
                          title="Remove member"
                          onClick={() => removeMember(idx)}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : isEdit ? 'Update Cell' : 'Create Cell'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/admin/cells')}
                >
                  Cancel
                </button>
              </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCellForm;
