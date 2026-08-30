import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';
import './CellsPage.css';

const API_URL = '/api';

function AdminCells() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // View mode: 'list' or 'detail'
  const [view, setView] = useState('list');
  const [selectedCell, setSelectedCell] = useState(null);

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

  const openCell = (cell) => {
    setSelectedCell(cell);
    setView('detail');
    setEditing(false);
    setEditForm(null);
    setEditingMemberIdx(null);
  };

  const goBack = () => {
    setView('list');
    setSelectedCell(null);
    setEditing(false);
    setEditForm(null);
    setEditingMemberIdx(null);
  };

  const startEditing = () => {
    if (!selectedCell) return;
    setEditForm({
      name: selectedCell.name || '',
      slug: selectedCell.slug || '',
      description: selectedCell.description || '',
      type: selectedCell.type || 'cell',
      order: selectedCell.order || 0,
      members: selectedCell.members ? JSON.parse(JSON.stringify(selectedCell.members)) : [],
    });
    setEditing(true);
    setEditingMemberIdx(null);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditForm(null);
    setEditingMemberIdx(null);
  };

  const handleSave = async () => {
    if (!selectedCell || !editForm) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/cells/${selectedCell._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          members: editForm.members.filter((m) => m.name.trim() !== ''),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCells((prev) => prev.map((c) => c._id === selectedCell._id ? updated : c));
        setSelectedCell(updated);
        setMessage({ type: 'success', text: 'Saved!' });
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
        goBack();
        setMessage({ type: 'success', text: 'Deleted' });
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
        {view === 'list' && (
          <div className="admin-topbar-actions">
            <Link to="/admin/cells/new" className="btn btn-success">+ Add New</Link>
          </div>
        )}
        {view === 'detail' && (
          <div className="admin-topbar-actions">
            <button className="btn btn-secondary" onClick={goBack}>← Back to List</button>
          </div>
        )}
      </div>

      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        {/* ─── LIST VIEW ─── */}
        {view === 'list' && (
          cells.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#888', marginBottom: '16px' }}>No cells found.</p>
              <Link to="/admin/cells/new" className="btn btn-success">Add First Cell</Link>
            </div>
          ) : (
            <div className="cells-admin-grid">
              {cells.map((cell) => (
                <div key={cell._id} className="cells-admin-card">
                  <div className="cells-admin-card-top">
                    <span className={`badge badge-${cell.type}`}>{cell.type}</span>
                    <span className="cells-admin-card-count">{cell.members?.length || 0} members</span>
                  </div>
                  <h3 className="cells-admin-card-title">{cell.name}</h3>
                  <p className="cells-admin-card-desc">
                    {cell.description
                      ? cell.description.length > 120
                        ? cell.description.substring(0, 120) + '...'
                        : cell.description
                      : 'No description'}
                  </p>
                  <div className="cells-admin-card-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => openCell(cell)}>Edit</button>
                    {window.confirm && false ? null : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cell._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ─── DETAIL / EDIT VIEW ─── */}
        {view === 'detail' && selectedCell && (
          <div className="cells-detail-view">
            {/* Action bar */}
            <div className="cells-detail-bar">
              {!editing ? (
                <button className="btn btn-primary" onClick={startEditing}>Edit Cell</button>
              ) : (
                <div className="cells-detail-bar-actions">
                  <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
                </div>
              )}
            </div>

            {/* Live preview / editable view */}
            <div className="cells-detail-card">
              {/* Cell name */}
              {editing ? (
                <div className="cells-detail-edit-section">
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
              ) : (
                <h2 className="cells-detail-heading">{selectedCell.name}</h2>
              )}

              <div className="cells-detail-line"></div>

              {/* Type badge */}
              {editing ? (
                <div className="cells-detail-edit-row">
                  <div className="cells-detail-edit-section" style={{ flex: 1 }}>
                    <label>Type</label>
                    <select value={editForm.type} onChange={(e) => setEditForm((prev) => ({ ...prev, type: e.target.value }))}>
                      <option value="cell">Cell</option>
                      <option value="committee">Committee</option>
                    </select>
                  </div>
                  <div className="cells-detail-edit-section" style={{ flex: 1 }}>
                    <label>Sort Order</label>
                    <input type="number" value={editForm.order} onChange={(e) => setEditForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))} min={0} />
                  </div>
                </div>
              ) : (
                <span className={`cells-live-type cells-live-type-${selectedCell.type}`}>{selectedCell.type}</span>
              )}

              {/* Description */}
              {editing ? (
                <div className="cells-detail-edit-section">
                  <label>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={5}
                    placeholder="Cell description..."
                  />
                </div>
              ) : (
                selectedCell.description && (
                  <p className="cells-detail-desc">{selectedCell.description}</p>
                )
              )}

              {/* Members */}
              <div className="cells-detail-members">
                {editing ? (
                  <div className="cells-detail-edit-section">
                    <div className="cells-members-header">
                      <label>Committee Members ({editForm.members.length})</label>
                      <button className="btn btn-success btn-sm" onClick={addMember}>+ Add Member</button>
                    </div>

                    {editForm.members.length === 0 ? (
                      <div className="cells-members-empty">No members yet.</div>
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
                ) : selectedCell.members && selectedCell.members.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="cell-card-table">
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
                  <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No members found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCells;
