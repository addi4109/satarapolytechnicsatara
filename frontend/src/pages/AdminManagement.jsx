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

  const gbFormFields = (
    <>
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <ImageUpload
          value={gbForm.photoUrl}
          onChange={(url) => setGbForm({ ...gbForm, photoUrl: url })}
          circle
        />
      </div>
      <input
        type="text"
        className="gb-member-input"
        value={gbForm.name}
        onChange={(e) => setGbForm({ ...gbForm, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="text"
        className="gb-member-input"
        value={gbForm.designation}
        onChange={(e) => setGbForm({ ...gbForm, designation: e.target.value })}
        placeholder="Designation"
        required
      />
      <input
        type="number"
        className="gb-member-input"
        value={gbForm.order}
        onChange={(e) => setGbForm({ ...gbForm, order: Number(e.target.value) })}
        placeholder="Display Order (e.g. 1, 2, 3)"
        min="0"
      />
    </>
  );

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
                  {/* Add / Close Button */}
                  <div style={{ marginBottom: '16px' }}>
                    <button
                      className={`btn ${showGbForm && !editGbId ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => (showGbForm && !editGbId ? cancelGbForm() : openAddGb())}
                    >
                      {showGbForm && !editGbId ? 'Close Form' : '+ Add Member'}
                    </button>
                  </div>

                  {/* Empty State */}
                  {gbMembers.length === 0 && !showGbForm && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <p style={{ color: '#888', marginBottom: '16px' }}>No governing body members yet.</p>
                      <button className="btn btn-success" onClick={openAddGb}>Add First Member</button>
                    </div>
                  )}

                  {/* Members Cards (inline editing) */}
                  <div className="gb-cards-grid">
                    {/* Inline Add Form */}
                    {showGbForm && !editGbId && (
                      <form className="gb-member-card gb-member-editing" onSubmit={handleGbSave}>
                        {gbFormFields}
                        <div className="gb-member-actions">
                          <button type="submit" className="btn btn-success btn-sm" disabled={gbSaving}>
                            {gbSaving ? 'Saving...' : 'Add Member'}
                          </button>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={cancelGbForm}>Cancel</button>
                        </div>
                      </form>
                    )}

                    {gbMembers.map((member) =>
                      editGbId === member._id ? (
                        <form key={member._id} className="gb-member-card gb-member-editing" onSubmit={handleGbSave}>
                          {gbFormFields}
                          <div className="gb-member-actions">
                            <button type="submit" className="btn btn-success btn-sm" disabled={gbSaving}>
                              {gbSaving ? 'Saving...' : 'Update'}
                            </button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={cancelGbForm}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div key={member._id} className="gb-member-card">
                          <span className="gb-member-order">#{member.order ?? 0}</span>
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="gb-member-photo" />
                          ) : (
                            <div className="gb-member-photo gb-member-photo-empty">No Photo</div>
                          )}
                          <h3 className="gb-member-name">{member.name}</h3>
                          <p className="gb-member-designation">{member.designation}</p>
                          <div className="gb-member-actions">
                            <button className="btn btn-primary btn-sm" onClick={() => openEditGb(member)}>Edit</button>
                            {deleteConfirm === member._id ? (
                              <>
                                <button className="btn btn-danger btn-sm" onClick={() => handleGbDelete(member._id)}>Yes</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>No</button>
                              </>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(member._id)}>Del</button>
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
                  <div style={{ marginBottom: '16px' }}>
                    <button
                      className={`btn ${showLgbForm && !editLgbId ? 'btn-secondary' : 'btn-success'}`}
                      onClick={() => (showLgbForm && !editLgbId ? cancelLgbForm() : openAddLgb())}
                    >
                      {showLgbForm && !editLgbId ? 'Close Form' : '+ Add Member'}
                    </button>
                  </div>

                  {lgbMembers.length === 0 && !showLgbForm && (
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                      <p style={{ color: '#888', marginBottom: '16px' }}>No local governing body members yet.</p>
                      <button className="btn btn-success" onClick={openAddLgb}>Add First Member</button>
                    </div>
                  )}

                  <div className="gb-cards-grid">
                    {showLgbForm && !editLgbId && (
                      <form className="gb-member-card gb-member-editing" onSubmit={handleLgbSave}>
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
                          <button type="submit" className="btn btn-success btn-sm" disabled={lgbSaving}>{lgbSaving ? 'Saving...' : 'Add Member'}</button>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={cancelLgbForm}>Cancel</button>
                        </div>
                      </form>
                    )}

                    {lgbMembers.map((member) =>
                      editLgbId === member._id ? (
                        <form key={member._id} className="gb-member-card gb-member-editing" onSubmit={handleLgbSave}>
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
                            <button type="submit" className="btn btn-success btn-sm" disabled={lgbSaving}>{lgbSaving ? 'Saving...' : 'Update'}</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={cancelLgbForm}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <div key={member._id} className="gb-member-card">
                          <span className="gb-member-order">#{member.order ?? 0}</span>
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="gb-member-photo" />
                          ) : (
                            <div className="gb-member-photo gb-member-photo-empty">No Photo</div>
                          )}
                          <h3 className="gb-member-name">{member.name}</h3>
                          <p className="gb-member-designation">{member.designation}</p>
                          <div className="gb-member-actions">
                            <button className="btn btn-primary btn-sm" onClick={() => openEditLgb(member)}>Edit</button>
                            {deleteConfirmLgb === member._id ? (
                              <>
                                <button className="btn btn-danger btn-sm" onClick={() => handleLgbDelete(member._id)}>Yes</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirmLgb(null)}>No</button>
                              </>
                            ) : (
                              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmLgb(member._id)}>Del</button>
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

          {/* ===== MANAGEMENT ROLE TABS ===== */}
          {activeTab !== 'governing-body' && activeTab !== 'local-governing-body' && (
            <div style={{ flex: 1, padding: '0 24px 24px', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              {/* Left: Circular Photo + Fields */}
              <div style={{
                background: '#fff',
                border: '1px solid #e4e8ed',
                borderRadius: '12px',
                width: '300px',
                flexShrink: 0,
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '24px 20px 20px',
              }}>
                {/* Circular Photo Upload */}
                <ImageUpload
                  value={form.photoUrl}
                  onChange={(url) => handleChange('photoUrl', url)}
                  circle
                />

                {/* Fields below photo */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. Hon. Dr. Chetna Majgaonkar"
                      style={{ width: '100%', fontSize: '13px', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Title / Designation</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g. Chairman, S. E. Society"
                      style={{ width: '100%', fontSize: '13px', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Qualification</label>
                    <input
                      type="text"
                      value={form.qualification}
                      onChange={(e) => handleChange('qualification', e.target.value)}
                      placeholder="e.g. ME (Mechanical)"
                      style={{ width: '100%', fontSize: '13px', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#666', marginBottom: '4px', display: 'block' }}>Short Description</label>
                    <input
                      type="text"
                      value={form.shortDesc}
                      onChange={(e) => handleChange('shortDesc', e.target.value)}
                      placeholder="One-line description"
                      style={{ width: '100%', fontSize: '13px', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right side: Message + Actions */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Message */}
                <div className="admin-card" style={{ overflow: 'hidden' }}>
                  <div className="admin-card-header" style={{ padding: '8px 16px', flexShrink: 0 }}>
                    <h3 style={{ margin: 0, fontSize: '14px' }}>Message / About</h3>
                  </div>
                  <div className="admin-card-body" style={{ padding: '12px 16px' }}>
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Write the message or about section..."
                      rows={8}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', minHeight: '200px' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: '10px 28px', fontSize: '14px' }}
                  >
                    {saving ? 'Saving...' : 'Save Details'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      if (activeEntry) {
                        setForm({ ...defaultEntry, ...activeEntry });
                      } else {
                        setForm({ ...defaultEntry });
                      }
                      setMsg(null);
                    }}
                    style={{ padding: '10px 28px', fontSize: '14px' }}
                  >
                    Reset
                  </button>
                  {activeEntry && (
                    <button className="btn btn-danger" onClick={handleDelete} style={{ padding: '10px 28px', fontSize: '14px' }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminManagement;
