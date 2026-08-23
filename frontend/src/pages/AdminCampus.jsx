import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';
import './Admin.css';

const API_URL = '/api';

const SECTIONS = [
  { key: 'library', label: 'Library' },
  { key: 'bus-facility', label: 'Bus Facility' },
  { key: 'canteen', label: 'Canteen' },
  { key: 'registrar', label: "Registrar's Desk" },
  { key: 'office-staff', label: 'Office Staff' },
  { key: 'non-teaching-staff', label: 'Non Teaching Staff' },
];

const defaultForm = {
  title: '',
  content: '',
  infoRows: [],
  stats: [],
  staffMembers: [],
  active: true,
};

const defaultStaff = {
  name: '',
  designation: '',
  phone: '',
  email: '',
  photoUrl: '',
};

function AdminCampus() {
  const [activeTab, setActiveTab] = useState('library');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Inline editing state - frontend-style cards
  const [editingInfoIdx, setEditingInfoIdx] = useState(null);
  const [editingStatIdx, setEditingStatIdx] = useState(null);

  // Staff card form state
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editStaffIdx, setEditStaffIdx] = useState(null);
  const [staffForm, setStaffForm] = useState({ ...defaultStaff });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/campus`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch campus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const existing = sections[activeTab];
    if (existing) {
      setForm({
        title: existing.title || '',
        content: existing.content || '',
        infoRows: existing.infoRows || [],
        stats: existing.stats || [],
        staffMembers: existing.staffMembers || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultForm });
    }
    setMsg(null);
    resetInputs();
    setShowStaffForm(false);
    setEditStaffIdx(null);
    setStaffForm({ ...defaultStaff });
  }, [activeTab, sections]);

  const resetInputs = () => {
    setEditingInfoIdx(null);
    setEditingStatIdx(null);
  };

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/campus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: 'Section saved successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await fetch(`${API_URL}/campus/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultForm });
      setMsg({ type: 'success', text: 'Deleted successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // Info row helpers - inline card editing
  const addEmptyInfoRow = () => {
    handleChange('infoRows', [...form.infoRows, { label: '', value: '' }]);
    setEditingInfoIdx(form.infoRows.length);
  };

  const updateInfoRow = (index, field, value) => {
    const infoRows = [...form.infoRows];
    infoRows[index] = { ...infoRows[index], [field]: value };
    handleChange('infoRows', infoRows);
  };

  const removeInfoRow = (index) => {
    handleChange('infoRows', form.infoRows.filter((_, i) => i !== index));
    setEditingInfoIdx(null);
  };

  // Stat helpers - inline card editing
  const addEmptyStat = () => {
    handleChange('stats', [...form.stats, { num: '', label: '' }]);
    setEditingStatIdx(form.stats.length);
  };

  const updateStat = (index, field, value) => {
    const stats = [...form.stats];
    stats[index] = { ...stats[index], [field]: value };
    handleChange('stats', stats);
  };

  const removeStat = (index) => {
    handleChange('stats', form.stats.filter((_, i) => i !== index));
    setEditingStatIdx(null);
  };

  // Staff card handlers
  const openAddStaff = () => {
    setEditStaffIdx(null);
    setStaffForm({ ...defaultStaff });
    setShowStaffForm(true);
  };

  const openEditStaff = (idx) => {
    const member = form.staffMembers[idx];
    setEditStaffIdx(idx);
    setStaffForm({
      name: member.name || '',
      designation: member.designation || '',
      phone: member.phone || '',
      email: member.email || '',
      photoUrl: member.photoUrl || '',
    });
    setShowStaffForm(true);
  };

  const cancelStaffForm = () => {
    setShowStaffForm(false);
    setEditStaffIdx(null);
    setStaffForm({ ...defaultStaff });
  };

  const saveStaff = () => {
    if (!staffForm.name.trim()) {
      setMsg({ type: 'error', text: 'Name is required' });
      return;
    }
    const updated = [...form.staffMembers];
    if (editStaffIdx !== null) {
      updated[editStaffIdx] = { ...staffForm };
    } else {
      updated.push({ ...staffForm });
    }
    handleChange('staffMembers', updated);
    setShowStaffForm(false);
    setEditStaffIdx(null);
    setStaffForm({ ...defaultStaff });
    setMsg({ type: 'success', text: editStaffIdx !== null ? 'Staff updated!' : 'Staff added!' });
  };

  const deleteStaff = (idx) => {
    handleChange('staffMembers', form.staffMembers.filter((_, i) => i !== idx));
    setDeleteConfirm(null);
    setMsg({ type: 'success', text: 'Staff removed' });
  };

  // Render info rows editor - small cards with inline editing
  const renderInfoRowsEditor = () => (
    <div className="form-group">
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Info Rows (Label - Value)</label>
      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px' }}>Shown exactly like the live website — click a row to edit it.</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Add tile - always first */}
        <div
          onClick={addEmptyInfoRow}
          title="Add Info Row"
          style={{ width: '150px', boxSizing: 'border-box', minHeight: '104px', background: '#fff', border: '1px dashed #b9c3d4', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', color: '#243358' }}
        >
          <span style={{ fontSize: '28px', lineHeight: 1 }}>+</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Add Row</span>
        </div>

        {form.infoRows.map((row, i) => (
          editingInfoIdx === i ? (
            <div key={i} style={{ width: '150px', boxSizing: 'border-box', background: '#fff', border: '1px solid #c8963e', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                autoFocus
                type="text"
                value={row.label || ''}
                onChange={(e) => updateInfoRow(i, 'label', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingInfoIdx(null)}
                placeholder="Label"
                style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                value={row.value || ''}
                onChange={(e) => updateInfoRow(i, 'value', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingInfoIdx(null)}
                placeholder="Value"
                style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px', boxSizing: 'border-box' }}
              />
              <button className="btn btn-success btn-sm" onClick={() => setEditingInfoIdx(null)} style={{ width: '100%' }}>Done</button>
            </div>
          ) : (
            <div
              key={i}
              onClick={() => setEditingInfoIdx(i)}
              title="Click to edit"
              style={{ position: 'relative', width: '150px', boxSizing: 'border-box', background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '14px 12px 12px', textAlign: 'center', cursor: 'pointer' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); removeInfoRow(i); }}
                title="Remove"
                style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', border: 'none', background: '#fdecea', color: '#d32f2f', fontSize: '12px', fontWeight: 700, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                ×
              </button>
              <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#243358' }}>{row.label || <em style={{ color: '#aaa' }}>Label</em>}</span>
              <span style={{ display: 'block', fontSize: '11.5px', color: '#777', marginTop: '4px' }}>{row.value || <em style={{ color: '#aaa' }}>Value</em>}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );

  // Render stats editor - small stat-box style cards like the live site
  const renderStatsEditor = () => (
    <div className="form-group">
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Stats (Number - Label)</label>
      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px' }}>Click a stat to edit it.</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'stretch' }}>
        {/* Add tile - always first */}
        <div
          onClick={addEmptyStat}
          title="Add Stat"
          style={{ width: '150px', boxSizing: 'border-box', minHeight: '104px', background: '#fff', border: '1px dashed #b9c3d4', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', color: '#243358' }}
        >
          <span style={{ fontSize: '28px', lineHeight: 1 }}>+</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Add Stat</span>
        </div>

        {form.stats.map((stat, i) => (
          editingStatIdx === i ? (
            <div key={i} style={{ width: '150px', boxSizing: 'border-box', background: '#fff', border: '1px solid #c8963e', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                autoFocus
                type="text"
                value={stat.num || ''}
                onChange={(e) => updateStat(i, 'num', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingStatIdx(null)}
                placeholder="Number"
                style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                value={stat.label || ''}
                onChange={(e) => updateStat(i, 'label', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingStatIdx(null)}
                placeholder="Label"
                style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12px', boxSizing: 'border-box' }}
              />
              <button className="btn btn-success btn-sm" onClick={() => setEditingStatIdx(null)} style={{ width: '100%' }}>Done</button>
            </div>
          ) : (
            <div
              key={i}
              onClick={() => setEditingStatIdx(i)}
              title="Click to edit"
              style={{ position: 'relative', width: '150px', boxSizing: 'border-box', background: '#f5f7fa', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '18px 12px 14px', textAlign: 'center', cursor: 'pointer' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); removeStat(i); }}
                title="Remove"
                style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', border: 'none', background: '#fdecea', color: '#d32f2f', fontSize: '12px', fontWeight: 700, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >
                ×
              </button>
              <span style={{ display: 'block', fontSize: '22px', fontWeight: 700, color: '#243358', fontFamily: 'Georgia, serif' }}>{stat.num}</span>
              <span style={{ display: 'block', fontSize: '11.5px', color: '#777', marginTop: '4px' }}>{stat.label}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

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
        <h1>Campus</h1>
      </div>

      <div className="admin-content">
        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '4px', flexWrap: 'wrap' }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              className={`gallery-tab ${activeTab === sec.key ? 'active' : ''}`}
              onClick={() => setActiveTab(sec.key)}
            >
              {sec.label}
              {sections[sec.key] && <span className="gallery-tab-count" style={{ fontSize: '10px' }}>Saved</span>}
            </button>
          ))}
        </div>

        {/* Alert */}
        {msg && (
          <div className={`alert alert-${msg.type}`}>
            {msg.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMsg(null)}>x</button>
          </div>
        )}

        <h2 style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', fontSize: '22px', color: '#243358' }}>
          {currentSection?.label}
        </h2>

        {/* ===== COMMON FORM ===== */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Section Content</h3>
            {sections[activeTab] && (
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            )}
          </div>
          <div className="admin-card-body">
            {/* Title */}
            <div className="form-group">
              <label>Section Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={`Enter title for ${currentSection?.label}`}
              />
            </div>

            {/* Content */}
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={4}
                placeholder="Write the main content here..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Info Rows */}
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
            {renderInfoRowsEditor()}

            {/* Stats - only for library */}
            {activeTab === 'library' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                {renderStatsEditor()}
              </>
            )}

            {/* ===== STAFF MEMBERS - CARD STYLE ===== */}
            {activeTab === 'office-staff' || activeTab === 'non-teaching-staff' ? (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />

                {!showStaffForm && (
                  <div style={{ marginBottom: '16px' }}>
                    <button className="btn btn-success" onClick={openAddStaff}>+ Add Staff Member</button>
                  </div>
                )}

                {/* Staff Card Form */}
                {showStaffForm && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                    <div style={{
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '16px',
                      padding: '32px 28px 28px',
                      width: '320px',
                      position: 'relative',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                    }}>
                      {/* Close Button */}
                      <button
                        onClick={cancelStaffForm}
                        style={{
                          position: 'absolute',
                          top: '14px',
                          right: '14px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: 'none',
                          background: '#fdecea',
                          color: '#d32f2f',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>

                      {/* Circular Photo Upload */}
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <ImageUpload
                          value={staffForm.photoUrl}
                          onChange={(url) => setStaffForm({ ...staffForm, photoUrl: url })}
                          circle
                        />
                      </div>

                      {/* Fields */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                          type="text"
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          placeholder="Name"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#333',
                            boxSizing: 'border-box',
                            outline: 'none',
                            background: '#fafafa',
                          }}
                        />
                        <input
                          type="text"
                          value={staffForm.designation}
                          onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })}
                          placeholder="Designation"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#333',
                            boxSizing: 'border-box',
                            outline: 'none',
                            background: '#fafafa',
                          }}
                        />
                        <input
                          type="text"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                          placeholder="Phone"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#333',
                            boxSizing: 'border-box',
                            outline: 'none',
                            background: '#fafafa',
                          }}
                        />
                        <input
                          type="email"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          placeholder="Email"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '10px',
                            fontSize: '14px',
                            color: '#333',
                            boxSizing: 'border-box',
                            outline: 'none',
                            background: '#fafafa',
                          }}
                        />
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={saveStaff}
                          style={{ flex: 1, padding: '10px 0', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {editStaffIdx !== null ? 'Update' : 'Add'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={cancelStaffForm}
                          style={{ flex: 1, padding: '10px 0', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Staff Table */}
                {!showStaffForm && form.staffMembers.length > 0 && (
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h3>All Staff ({form.staffMembers.length})</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                            <th style={{ width: '80px', textAlign: 'center' }}>Photo</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th style={{ width: '200px', textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.staffMembers.map((member, index) => (
                            <tr key={index}>
                              <td style={{ textAlign: 'center', fontWeight: '600', color: '#243358' }}>{index + 1}</td>
                              <td style={{ textAlign: 'center' }}>
                                {member.photoUrl ? (
                                  <img src={member.photoUrl} alt={member.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #e4e8ed' }} />
                                ) : (
                                  <div style={{ width: '45px', height: '45px', background: '#f0f3f8', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#aaa' }}>N/A</div>
                                )}
                              </td>
                              <td style={{ fontWeight: '500', color: '#333' }}>{member.name}</td>
                              <td style={{ color: '#555' }}>{member.designation}</td>
                              <td style={{ color: '#555', fontSize: '13px' }}>{member.phone}</td>
                              <td style={{ color: '#555', fontSize: '13px' }}>{member.email}</td>
                              <td>
                                <div className="actions" style={{ justifyContent: 'center' }}>
                                  <button className="btn btn-primary btn-sm" onClick={() => openEditStaff(index)}>Edit</button>
                                  {deleteConfirm === index ? (
                                    <>
                                      <button className="btn btn-danger btn-sm" onClick={() => deleteStaff(index)}>Yes</button>
                                      <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                                    </>
                                  ) : (
                                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(index)}>Del</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {!showStaffForm && form.staffMembers.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                    <p>No staff members added yet.</p>
                  </div>
                )}
              </>
            ) : null}

            {/* Actions */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '10px 30px' }}>
                {saving ? 'Saving...' : 'Save Section'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (sections[activeTab]) {
                    setForm({
                      title: sections[activeTab].title || '',
                      content: sections[activeTab].content || '',
                      infoRows: sections[activeTab].infoRows || [],
                      stats: sections[activeTab].stats || [],
                      staffMembers: sections[activeTab].staffMembers || [],
                      active: sections[activeTab].active !== false,
                    });
                  } else {
                    setForm({ ...defaultForm });
                  }
                  setMsg(null);
                  resetInputs();
                  setShowStaffForm(false);
                  setEditStaffIdx(null);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCampus;
