import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminCells() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedCellId, setSelectedCellId] = useState(null);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingMemberIdx, setEditingMemberIdx] = useState(null);

  useEffect(() => {
    fetchCells();
  }, []);

  const fetchCells = async () => {
    try {
      const res = await fetch(`${API_URL}/cells`);
      const data = await res.json();
      setCells(data);
    } catch (err) {
      console.error('Failed to fetch cells:', err);
      setMessage({ type: 'error', text: 'Failed to load cells' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCell = cells.find((c) => c._id === selectedCellId);

  const startEditing = (cell) => {
    setEditForm({
      name: cell.name || '',
      slug: cell.slug || '',
      description: cell.description || '',
      type: cell.type || 'cell',
      order: cell.order || 0,
      members: cell.members || [],
    });
    setEditing(true);
    setEditingMemberIdx(null);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditForm(null);
    setEditingMemberIdx(null);
  };

  const handleSelectCell = (cell) => {
    if (editing) return;
    setSelectedCellId(cell._id);
  };

  const handleSave = async () => {
    if (!selectedCellId || !editForm) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/cells/${selectedCellId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          members: editForm.members.filter((m) => m.name.trim() !== ''),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCells((prev) => prev.map((c) => c._id === selectedCellId ? updated : c));
        setMessage({ type: 'success', text: 'Cell updated successfully!' });
        setEditing(false);
        setEditForm(null);
      } else {
        setMessage({ type: 'error', text: 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cell?')) return;
    try {
      const res = await fetch(`${API_URL}/cells/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCells((prev) => prev.filter((c) => c._id !== id));
        if (selectedCellId === id) {
          setSelectedCellId(null);
          setEditing(false);
          setEditForm(null);
        }
        setMessage({ type: 'success', text: 'Cell deleted' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  // Member helpers
  const addMember = () => {
    setEditForm((prev) => ({
      ...prev,
      members: [...prev.members, { name: '', designation: '', phone: '', position: '' }],
    }));
    setEditingMemberIdx(editForm.members.length);
  };

  const updateMember = (i, field, val) => {
    const members = [...editForm.members];
    members[i] = { ...members[i], [field]: val };
    setEditForm((prev) => ({ ...prev, members }));
  };

  const removeMember = (i) => {
    setEditForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, idx) => idx !== i),
    }));
    setEditingMemberIdx(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Cells & Committees</h1>
        <div className="admin-topbar-actions">
          <Link to="/admin/cells/new" className="btn btn-success">+ Add New</Link>
        </div>
      </div>

      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        <div className="cells-admin-layout">
          {/* Left: Cell cards list */}
          <div className="cells-admin-sidebar">
            <h3 className="cells-sidebar-title">All Cells ({cells.length})</h3>
            {cells.length === 0 ? (
              <div className="cells-empty-state">
                <p>No cells found.</p>
                <Link to="/admin/cells/new" className="btn btn-success btn-sm">Add First Cell</Link>
              </div>
            ) : (
              <div className="cells-admin-list">
                {cells.map((cell) => (
                  <div
                    key={cell._id}
                    className={`cells-admin-item ${selectedCellId === cell._id ? 'active' : ''}`}
                    onClick={() => handleSelectCell(cell)}
                  >
                    <div className="cells-item-info">
                      <span className={`cells-item-type cells-item-type-${cell.type}`}>{cell.type}</span>
                      <h4 className="cells-item-name">{cell.name}</h4>
                      <span className="cells-item-count">{cell.members?.length || 0} members</span>
                    </div>
                    <div className="cells-item-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => { e.stopPropagation(); setSelectedCellId(cell._id); startEditing(cell); }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => { e.stopPropagation(); handleDelete(cell._id); }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Live preview / editor */}
          <div className="cells-admin-main">
            {!selectedCell && !editing ? (
              <div className="cells-preview-empty">
                <div className="cells-preview-empty-icon">📋</div>
                <h3>Select a Cell</h3>
                <p>Click on a cell from the list to preview it. Click "Edit" to make changes.</p>
              </div>
            ) : editing && editForm ? (
              <div className="cells-live-editor">
                {/* Editor header */}
                <div className="cells-editor-header">
                  <h2>Editing: {editForm.name || 'New Cell'}</h2>
                  <div className="cells-editor-actions">
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
                  </div>
                </div>

                {/* Cell name - click to edit */}
                <div className="cells-edit-section">
                  <label>Cell Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setEditForm((prev) => ({ ...prev, name, slug }));
                    }}
                    placeholder="Cell name..."
                  />
                </div>

                {/* Type + Order */}
                <div className="cells-edit-row">
                  <div className="cells-edit-section" style={{ flex: 1 }}>
                    <label>Type</label>
                    <select value={editForm.type} onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}>
                      <option value="cell">Cell</option>
                      <option value="committee">Committee</option>
                    </select>
                  </div>
                  <div className="cells-edit-section" style={{ flex: 1 }}>
                    <label>Sort Order</label>
                    <input type="number" value={editForm.order} onChange={(e) => setEditForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))} min={0} />
                  </div>
                </div>

                {/* Description */}
                <div className="cells-edit-section">
                  <label>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={5}
                    placeholder="Cell description..."
                  />
                </div>

                {/* Members */}
                <div className="cells-edit-section">
                  <div className="cells-members-header">
                    <label>Committee Members ({editForm.members.length})</label>
                    <button className="btn btn-success btn-sm" onClick={addMember}>+ Add Member</button>
                  </div>

                  {editForm.members.length === 0 ? (
                    <div className="cells-members-empty">No members yet. Click "+ Add Member" to add one.</div>
                  ) : (
                    <div className="cells-members-table">
                      <div className="cells-members-thead">
                        <span className="cells-mem-col-sr">Sr.</span>
                        <span className="cells-mem-col-name">Name</span>
                        <span className="cells-mem-col-desig">Designation</span>
                        <span className="cells-mem-col-phone">Contact</span>
                        <span className="cells-mem-col-action"></span>
                      </div>
                      {editForm.members.map((member, idx) => (
                        editingMemberIdx === idx ? (
                          <div key={idx} className="cells-members-row editing">
                            <span className="cells-mem-col-sr">{idx + 1}</span>
                            <input className="cells-mem-col-name" type="text" autoFocus value={member.name} onChange={(e) => updateMember(idx, 'name', e.target.value)} placeholder="Name" />
                            <input className="cells-mem-col-desig" type="text" value={member.position || ''} onChange={(e) => updateMember(idx, 'position', e.target.value)} placeholder="Designation" />
                            <input className="cells-mem-col-phone" type="text" value={member.phone} onChange={(e) => updateMember(idx, 'phone', e.target.value)} placeholder="Phone" />
                            <div className="cells-mem-col-action">
                              <button className="btn btn-success btn-sm" onClick={() => setEditingMemberIdx(null)}>Done</button>
                              <button className="btn btn-danger btn-sm" onClick={() => removeMember(idx)}>×</button>
                            </div>
                          </div>
                        ) : (
                          <div key={idx} className="cells-members-row" onClick={() => setEditingMemberIdx(idx)}>
                            <span className="cells-mem-col-sr">{idx + 1}</span>
                            <span className="cells-mem-col-name">{member.name || <em style={{ color: '#aaa' }}>Name</em>}</span>
                            <span className="cells-mem-col-desig">{member.position || member.designation || <em style={{ color: '#aaa' }}>Designation</em>}</span>
                            <span className="cells-mem-col-phone">{member.phone || <em style={{ color: '#aaa' }}>Phone</em>}</span>
                            <span className="cells-mem-col-action">
                              <button className="cells-member-del" onClick={(e) => { e.stopPropagation(); removeMember(idx); }}>×</button>
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : selectedCell ? (
              <div className="cells-live-preview">
                <div className="cells-preview-header">
                  <h2>Live Preview</h2>
                  <div className="cells-preview-actions">
                    <button className="btn btn-primary" onClick={() => startEditing(selectedCell)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selectedCell._id)}>Delete</button>
                  </div>
                </div>

                {/* Cell name */}
                <h2 className="cells-live-heading">{selectedCell.name}</h2>
                <div className="cells-live-line"></div>

                {/* Type badge */}
                <span className={`cells-live-type cells-live-type-${selectedCell.type}`}>{selectedCell.type}</span>

                {/* Description */}
                {selectedCell.description && (
                  <p className="cells-live-desc">{selectedCell.description}</p>
                )}

                {/* Members table */}
                {selectedCell.members && selectedCell.members.length > 0 ? (
                  <div className="cells-live-table-wrap">
                    <table className="cells-live-table">
                      <thead>
                        <tr>
                          <th style={{ width: '70px', textAlign: 'center' }}>Sr. No.</th>
                          <th>Name of Member</th>
                          <th>Designation</th>
                          <th>Contact Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCell.members.map((member, index) => (
                          <tr key={index}>
                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{index + 1}</td>
                            <td style={{ fontWeight: 500 }}>{member.name}</td>
                            <td>{member.position || member.designation || '-'}</td>
                            <td>{member.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="cells-live-empty">No members added yet.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCells;
