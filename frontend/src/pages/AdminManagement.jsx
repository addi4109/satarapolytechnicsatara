import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';

const API_URL = '/api';

const ROLES = [
  { key: 'founder', label: 'Founder' },
  { key: 'chairman', label: 'Chairman' },
  { key: 'secretary', label: 'Secretary' },
  { key: 'principal', label: 'Principal' },
];

const defaultEntry = {
  name: '',
  title: '',
  qualification: '',
  photoUrl: '',
  message: '',
  shortDesc: '',
  active: true,
};

const defaultGbMember = {
  name: '',
  designation: '',
  photoUrl: '',
  order: 0,
  active: true,
};

function AdminManagement() {
  const [activeTab, setActiveTab] = useState('founder');
  const [entries, setEntries] = useState({});
  const [form, setForm] = useState({ ...defaultEntry });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editingRole, setEditingRole] = useState(false);

  // Governing Body state
  const [gbMembers, setGbMembers] = useState([]);
  const [gbLoading, setGbLoading] = useState(true);
  const [showGbForm, setShowGbForm] = useState(false);
  const [editGbId, setEditGbId] = useState(null);
  const [gbForm, setGbForm] = useState({ ...defaultGbMember });
  const [gbSaving, setGbSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Local Governing Body state
  const [lgbMembers, setLgbMembers] = useState([]);
  const [lgbLoading, setLgbLoading] = useState(true);
  const [showLgbForm, setShowLgbForm] = useState(false);
  const [editLgbId, setEditLgbId] = useState(null);
  const [lgbForm, setLgbForm] = useState({ ...defaultGbMember });
  const [lgbSaving, setLgbSaving] = useState(false);
  const [deleteConfirmLgb, setDeleteConfirmLgb] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (activeTab === 'governing-body') {
      fetchGbMembers();
    }
    if (activeTab === 'local-governing-body') {
      fetchLgbMembers();
    }
  }, [activeTab]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/management`);
      const data = await res.json();
      const mapped = {};
      data.forEach((entry) => {
        mapped[entry.role] = entry;
      });
      setEntries(mapped);
    } catch (err) {
      console.error('Failed to fetch management:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGbMembers = async () => {
    setGbLoading(true);
    try {
      const res = await fetch(`${API_URL}/governing-body/all`);
      const data = await res.json();
      setGbMembers(data);
    } catch (err) {
      console.error('Failed to fetch governing body:', err);
    } finally {
      setGbLoading(false);
    }
  };

  const fetchLgbMembers = async () => {
    setLgbLoading(true);
    try {
      const res = await fetch(`${API_URL}/local-governing-body/all`);
      const data = await res.json();
      setLgbMembers(data);
    } catch (err) {
      console.error('Failed to fetch local governing body:', err);
    } finally {
      setLgbLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'governing-body' && activeTab !== 'local-governing-body') {
      const existing = entries[activeTab];
      if (existing) {
        setForm({ ...defaultEntry, ...existing });
      } else {
        setForm({ ...defaultEntry });
      }
      setMsg(null);
      setEditingRole(false);
    }
  }, [activeTab, entries]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMsg({ type: 'error', text: 'Name is required' });
      return;
    }

    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch(`${API_URL}/management`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: activeTab, order: 0 }),
      });

      if (!res.ok) throw new Error('Failed to save');

      const saved = await res.json();
      setEntries((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: `${ROLES.find((r) => r.key === activeTab)?.label} details saved successfully!` });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${ROLES.find((r) => r.key === activeTab)?.label} details?`)) {
      return;
    }

    try {
      await fetch(`${API_URL}/management/${activeTab}`, { method: 'DELETE' });
      setEntries((prev) => {
        const updated = { ...prev };
        delete updated[activeTab];
        return updated;
      });
      setForm({ ...defaultEntry });
      setMsg({ type: 'success', text: 'Deleted successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // Governing Body handlers
  const openAddGb = () => {
    setEditGbId(null);
    setGbForm({ ...defaultGbMember });
    setShowGbForm(true);
  };

  const openEditGb = (member) => {
    setEditGbId(member._id);
    setGbForm({
      name: member.name || '',
      designation: member.designation || '',
      photoUrl: member.photoUrl || '',
      order: member.order || 0,
      active: member.active !== false,
    });
    setShowGbForm(true);
  };

  const cancelGbForm = () => {
    setShowGbForm(false);
    setEditGbId(null);
    setGbForm({ ...defaultGbMember });
  };

  const handleGbSave = async (e) => {
    e.preventDefault();
    setGbSaving(true);
    try {
      const url = editGbId ? `${API_URL}/governing-body/${editGbId}` : `${API_URL}/governing-body`;
      const method = editGbId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gbForm),
      });
      if (res.ok) {
        setMsg({ type: 'success', text: editGbId ? 'Member updated!' : 'Member added!' });
        setShowGbForm(false);
        setEditGbId(null);
        setGbForm({ ...defaultGbMember });
        fetchGbMembers();
      } else {
        const err = await res.json();
        setMsg({ type: 'error', text: err.error || 'Failed' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error' });
    } finally {
      setGbSaving(false);
    }
  };

  const handleGbDelete = async (id) => {
    try {
      await fetch(`${API_URL}/governing-body/${id}`, { method: 'DELETE' });
      setMsg({ type: 'success', text: 'Member deleted' });
      fetchGbMembers();
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete' });
    }
    setDeleteConfirm(null);
  };

  // Local Governing Body handlers
  const openAddLgb = () => {
    setEditLgbId(null);
    setLgbForm({ ...defaultGbMember });
    setShowLgbForm(true);
  };

  const openEditLgb = (member) => {
    setEditLgbId(member._id);
    setLgbForm({
      name: member.name || '',
      designation: member.designation || '',
      photoUrl: member.photoUrl || '',
      order: member.order || 0,
      active: member.active !== false,
    });
    setShowLgbForm(true);
  };

  const cancelLgbForm = () => {
    setShowLgbForm(false);
    setEditLgbId(null);
    setLgbForm({ ...defaultGbMember });
  };

  const handleLgbSave = async (e) => {
    e.preventDefault();
    setLgbSaving(true);
    try {
      const url = editLgbId ? `${API_URL}/local-governing-body/${editLgbId}` : `${API_URL}/local-governing-body`;
      const method = editLgbId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lgbForm),
      });
      if (res.ok) {
        setMsg({ type: 'success', text: editLgbId ? 'Member updated!' : 'Member added!' });
        setShowLgbForm(false);
        setEditLgbId(null);
        setLgbForm({ ...defaultGbMember });
        fetchLgbMembers();
      } else {
        const err = await res.json();
        setMsg({ type: 'error', text: err.error || 'Failed' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error' });
    } finally {
      setLgbSaving(false);
    }
  };

  const handleLgbDelete = async (id) => {
    try {
      await fetch(`${API_URL}/local-governing-body/${id}`, { method: 'DELETE' });
      setMsg({ type: 'success', text: 'Member deleted' });
      fetchLgbMembers();
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete' });
    }
    setDeleteConfirmLgb(null);
  };

  const activeEntry = entries[activeTab];
  const currentRole = ROLES.find((r) => r.key === activeTab);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div className="admin-topbar" style={{ flexShrink: 0 }}>
          <h1>Management</h1>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Sub-tabs */}
          <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
            <div className="gallery-admin-tabs" style={{ marginBottom: 0 }}>
              {ROLES.map((role) => (
                <button
                  key={role.key}
                  className={`gallery-tab ${activeTab === role.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(role.key)}
                >
                  {role.label}
                  {entries[role.key] && <span className="gallery-tab-count" style={{ fontSize: '10px' }}>Saved</span>}
                </button>
              ))}
              <button
                className={`gallery-tab ${activeTab === 'governing-body' ? 'active' : ''}`}
                onClick={() => setActiveTab('governing-body')}
              >
                Governing Body
                {gbMembers.length > 0 && <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{gbMembers.length}</span>}
              </button>
              <button
                className={`gallery-tab ${activeTab === 'local-governing-body' ? 'active' : ''}`}
                onClick={() => setActiveTab('local-governing-body')}
              >
                Local Governing Body
                {lgbMembers.length > 0 && <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{lgbMembers.length}</span>}
              </button>
            </div>
          </div>

          {/* Title */}
          <div style={{ padding: '10px 24px', textAlign: 'center', flexShrink: 0 }}>
            <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '22px', color: '#243358' }}>
              {activeTab === 'governing-body' ? 'Governing Body Management' : activeTab === 'local-governing-body' ? 'Local Governing Body Management' : `${currentRole?.label} Management`}
            </h2>
          </div>

          {/* Alert */}
          {msg && (
            <div className={`alert alert-${msg.type}`} style={{ margin: '0 24px 8px', flexShrink: 0 }}>
              {msg.text}
              <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMsg(null)}>x</button>
            </div>
          )}

          {/* ===== GOVERNING BODY TAB ===== */}
          {activeTab === 'governing-body' && (
            <div style={{ flex: 1, padding: '0 24px 24px' }}>
              {gbLoading ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
              ) : (
                <>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Click a card to edit. Click the + box to add a new member.</p>

                  <div className="gb-cards-grid">
                    {/* Add Member Box */}
                    {showGbForm && !editGbId ? (
                      <div className="gb-member-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'solid', borderColor: '#c8963e', background: '#fffbe6' }}>
                        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                          <ImageUpload
                            value={gbForm.photoUrl}
                            onChange={(url) => setGbForm({ ...gbForm, photoUrl: url })}
                            circle
                          />
                        </div>
                        <input type="text" className="gb-member-input" value={gbForm.name} onChange={(e) => setGbForm({ ...gbForm, name: e.target.value })} placeholder="Name" required />
                        <input type="text" className="gb-member-input" value={gbForm.designation} onChange={(e) => setGbForm({ ...gbForm, designation: e.target.value })} placeholder="Designation" required />
                        <input type="number" className="gb-member-input" value={gbForm.order} onChange={(e) => setGbForm({ ...gbForm, order: Number(e.target.value) })} placeholder="Display Order" min="0" />
                        <div className="gb-member-actions">
                          <button className="btn btn-success btn-sm" onClick={handleGbSave} disabled={gbSaving}>{gbSaving ? 'Saving...' : 'Save'}</button>
                          <button className="btn btn-secondary btn-sm" onClick={cancelGbForm}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="gb-member-card"
                        onClick={openAddGb}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', minHeight: '240px' }}
                      >
                        <span style={{ fontSize: '36px', color: '#bbb', marginBottom: '6px' }}>+</span>
                        <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>Add Member</span>
                      </div>
                    )}

                    {/* Member Cards - live preview */}
                    {gbMembers.map((member) =>
                      editGbId === member._id ? (
                        /* Edit mode */
                        <div key={member._id} className="gb-member-card" style={{ border: '2px solid #c8963e', background: '#fffbe6' }}>
                          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                            <ImageUpload
                              value={gbForm.photoUrl}
                              onChange={(url) => setGbForm({ ...gbForm, photoUrl: url })}
                              circle
                            />
                          </div>
                          <input type="text" className="gb-member-input" value={gbForm.name} onChange={(e) => setGbForm({ ...gbForm, name: e.target.value })} placeholder="Name" required />
                          <input type="text" className="gb-member-input" value={gbForm.designation} onChange={(e) => setGbForm({ ...gbForm, designation: e.target.value })} placeholder="Designation" required />
                          <input type="number" className="gb-member-input" value={gbForm.order} onChange={(e) => setGbForm({ ...gbForm, order: Number(e.target.value) })} placeholder="Display Order" min="0" />
                          <div className="gb-member-actions">
                            <button className="btn btn-success btn-sm" onClick={handleGbSave} disabled={gbSaving}>{gbSaving ? 'Saving...' : 'Save'}</button>
                            <button className="btn btn-secondary btn-sm" onClick={cancelGbForm}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        /* Preview mode */
                        <div
                          key={member._id}
                          className="gb-member-card"
                          onClick={() => openEditGb(member)}
                          style={{ cursor: 'pointer' }}
                          title="Click to edit"
                        >
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="gb-member-photo" />
                          ) : (
                            <div className="gb-member-photo gb-member-photo-empty">
                              <span>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                            </div>
                          )}
                          <h3 className="gb-member-name">{member.name}</h3>
                          <p className="gb-member-designation">{member.designation}</p>
                          <div className="gb-member-actions" onClick={(e) => e.stopPropagation()}>
                            {deleteConfirm === member._id ? (
                              <>
                                <button className="btn btn-danger btn-sm" onClick={() => handleGbDelete(member._id)}>Yes, Delete</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                              </>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(member._id)}>Delete</button>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== LOCAL GOVERNING BODY TAB ===== */}
          {activeTab === 'local-governing-body' && (
            <div style={{ flex: 1, padding: '0 24px 24px' }}>
              {lgbLoading ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
              ) : (
                <>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Click a card to edit. Click the + box to add a new member.</p>

                  <div className="gb-cards-grid">
                    {/* Add Member Box */}
                    {showLgbForm && !editLgbId ? (
                      <div className="gb-member-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'solid', borderColor: '#c8963e', background: '#fffbe6' }}>
                        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                          <ImageUpload
                            value={lgbForm.photoUrl}
                            onChange={(url) => setLgbForm({ ...lgbForm, photoUrl: url })}
                            circle
                          />
                        </div>
                        <input type="text" className="gb-member-input" value={lgbForm.name} onChange={(e) => setLgbForm({ ...lgbForm, name: e.target.value })} placeholder="Name" required />
                        <input type="text" className="gb-member-input" value={lgbForm.designation} onChange={(e) => setLgbForm({ ...lgbForm, designation: e.target.value })} placeholder="Designation" required />
                        <input type="number" className="gb-member-input" value={lgbForm.order} onChange={(e) => setLgbForm({ ...lgbForm, order: Number(e.target.value) })} placeholder="Display Order" min="0" />
                        <div className="gb-member-actions">
                          <button className="btn btn-success btn-sm" onClick={handleLgbSave} disabled={lgbSaving}>{lgbSaving ? 'Saving...' : 'Save'}</button>
                          <button className="btn btn-secondary btn-sm" onClick={cancelLgbForm}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="gb-member-card"
                        onClick={openAddLgb}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', minHeight: '240px' }}
                      >
                        <span style={{ fontSize: '36px', color: '#bbb', marginBottom: '6px' }}>+</span>
                        <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>Add Member</span>
                      </div>
                    )}

                    {/* Member Cards - live preview */}
                    {lgbMembers.map((member) =>
                      editLgbId === member._id ? (
                        /* Edit mode */
                        <div key={member._id} className="gb-member-card" style={{ border: '2px solid #c8963e', background: '#fffbe6' }}>
                          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                            <ImageUpload
                              value={lgbForm.photoUrl}
                              onChange={(url) => setLgbForm({ ...lgbForm, photoUrl: url })}
                              circle
                            />
                          </div>
                          <input type="text" className="gb-member-input" value={lgbForm.name} onChange={(e) => setLgbForm({ ...lgbForm, name: e.target.value })} placeholder="Name" required />
                          <input type="text" className="gb-member-input" value={lgbForm.designation} onChange={(e) => setLgbForm({ ...lgbForm, designation: e.target.value })} placeholder="Designation" required />
                          <input type="number" className="gb-member-input" value={lgbForm.order} onChange={(e) => setLgbForm({ ...lgbForm, order: Number(e.target.value) })} placeholder="Display Order" min="0" />
                          <div className="gb-member-actions">
                            <button className="btn btn-success btn-sm" onClick={handleLgbSave} disabled={lgbSaving}>{lgbSaving ? 'Saving...' : 'Save'}</button>
                            <button className="btn btn-secondary btn-sm" onClick={cancelLgbForm}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        /* Preview mode */
                        <div
                          key={member._id}
                          className="gb-member-card"
                          onClick={() => openEditLgb(member)}
                          style={{ cursor: 'pointer' }}
                          title="Click to edit"
                        >
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="gb-member-photo" />
                          ) : (
                            <div className="gb-member-photo gb-member-photo-empty">
                              <span>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                            </div>
                          )}
                          <h3 className="gb-member-name">{member.name}</h3>
                          <p className="gb-member-designation">{member.designation}</p>
                          <div className="gb-member-actions" onClick={(e) => e.stopPropagation()}>
                            {deleteConfirmLgb === member._id ? (
                              <>
                                <button className="btn btn-danger btn-sm" onClick={() => handleLgbDelete(member._id)}>Yes, Delete</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirmLgb(null)}>Cancel</button>
                              </>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmLgb(member._id)}>Delete</button>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== MANAGEMENT ROLE TABS - Click to Edit ===== */}
          {activeTab !== 'governing-body' && activeTab !== 'local-governing-body' && (
            <div style={{ flex: 1, padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#888' }}>Click the card to edit</span>
              </div>

              {/* Preview mode - looks like the live website */}
              {!editingRole ? (
                <div
                  className="placement-officer-card"
                  onClick={() => setEditingRole(true)}
                  style={{ cursor: 'pointer' }}
                  title="Click to edit"
                >
                  <div className="placement-officer-left">
                    {form.photoUrl ? (
                      <div className="placement-officer-photo">
                        <img src={form.photoUrl} alt={form.name} />
                      </div>
                    ) : (
                      <div className="placement-officer-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f3f8' }}>
                        <span style={{ fontSize: '48px', fontWeight: 700, color: '#243358', fontFamily: 'Georgia, serif' }}>?</span>
                      </div>
                    )}
                    <h4 className="placement-officer-name">{form.name || currentRole?.label || 'Name'}</h4>
                    <p className="placement-officer-designation">{form.title || currentRole?.label}</p>
                    {form.qualification && (
                      <p className="placement-officer-qual">{form.qualification}</p>
                    )}
                  </div>
                  <div className="placement-officer-msg">
                    {form.message ? (
                      form.message.split('\n').filter(p => p.trim()).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))
                    ) : (
                      <p style={{ fontStyle: 'italic', color: '#aaa' }}>No message added yet. Click to edit.</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Edit mode */
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', border: '2px solid #c8963e', borderRadius: '10px', padding: '24px', background: '#f5f7fa' }}>
                  <div className="placement-officer-left">
                    <div className="placement-officer-photo">
                      <ImageUpload
                        value={form.photoUrl}
                        onChange={(url) => handleChange('photoUrl', url)}
                        label=""
                        placeholder="Photo"
                      />
                    </div>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Full Name"
                      style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#243358', textAlign: 'center', marginBottom: '6px', boxSizing: 'border-box' }}
                    />
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Title / Designation"
                      style={{ width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', textAlign: 'center', color: '#243358', fontWeight: 500, marginBottom: '6px', boxSizing: 'border-box' }}
                    />
                    <input
                      type="text"
                      value={form.qualification}
                      onChange={(e) => handleChange('qualification', e.target.value)}
                      placeholder="Qualification"
                      style={{ width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', textAlign: 'center', color: '#666', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div className="placement-officer-msg">
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Write the message or about section..."
                      rows={6}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', color: '#555', lineHeight: '1.75', resize: 'vertical', boxSizing: 'border-box', minHeight: '120px' }}
                    />
                  </div>
                </div>
              )}

              {editingRole && (
                <div style={{ marginTop: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => { handleSave(); setEditingRole(false); }}
                    disabled={saving}
                    style={{ padding: '8px 22px', fontSize: '13px' }}
                  >
                    {saving ? 'Saving...' : 'Save & Done'}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (activeEntry) {
                        setForm({ ...defaultEntry, ...activeEntry });
                      } else {
                        setForm({ ...defaultEntry });
                      }
                      setEditingRole(false);
                      setMsg(null);
                    }}
                    style={{ padding: '8px 22px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  {activeEntry && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => { handleDelete(); setEditingRole(false); }}
                      style={{ padding: '8px 22px', fontSize: '13px' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminManagement;
