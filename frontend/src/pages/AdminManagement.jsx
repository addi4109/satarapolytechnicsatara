import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import AdminStaffCard from '../components/AdminStaffCard';
import AdminLoading from '../components/AdminLoading';
import ImageUpload from '../components/ImageUpload';

import API_URL from '../lib/api';

const ROLES = [
  { key: 'founder', label: 'Founder' },
  { key: 'chairman', label: 'Chairman' },
  { key: 'secretary', label: 'Secretary' },
  { key: 'principal', label: 'Principal' },
];

const STAFF_FIELDS = [
  { key: 'name', label: 'Name', placeholder: 'Name' },
  { key: 'designation', label: 'Designation', placeholder: 'Designation' },
  { key: 'order', label: 'Display Order', placeholder: 'Display Order', type: 'number', min: 0 },
];

const defaultEntry = {
  name: '', title: '', qualification: '', photoUrl: '', message: '', shortDesc: '', active: true,
};

const defaultGbMember = {
  name: '', designation: '', photoUrl: '', order: 0, active: true,
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

  useEffect(() => { fetchEntries(); }, []);

  useEffect(() => {
    if (activeTab === 'governing-body') fetchGbMembers();
    if (activeTab === 'local-governing-body') fetchLgbMembers();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'governing-body' && activeTab !== 'local-governing-body') {
      const existing = entries[activeTab];
      setForm(existing ? { ...defaultEntry, ...existing } : { ...defaultEntry });
      setMsg(null);
      setEditingRole(false);
    }
  }, [activeTab, entries]);

  // ── Fetch helpers ──
  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/management`);
      const data = await res.json();
      const mapped = {};
      data.forEach((entry) => { mapped[entry.role] = entry; });
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
      setGbMembers(await res.json());
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
      setLgbMembers(await res.json());
    } catch (err) {
      console.error('Failed to fetch local governing body:', err);
    } finally {
      setLgbLoading(false);
    }
  };

  // ── Management role handlers ──
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setMsg({ type: 'error', text: 'Name is required' }); return; }
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
      setMsg({ type: 'success', text: `${ROLES.find((r) => r.key === activeTab)?.label} saved!` });
    } catch {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${ROLES.find((r) => r.key === activeTab)?.label} details?`)) return;
    try {
      await fetch(`${API_URL}/management/${activeTab}`, { method: 'DELETE' });
      setEntries((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultEntry });
      setMsg({ type: 'success', text: 'Deleted!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // ── GB handlers ──
  const openAddGb = () => { setEditGbId(null); setGbForm({ ...defaultGbMember }); setShowGbForm(true); };
  const openEditGb = (m) => { setEditGbId(m._id); setGbForm({ name: m.name || '', designation: m.designation || '', photoUrl: m.photoUrl || '', order: m.order || 0, active: m.active !== false }); setShowGbForm(true); };
  const cancelGbForm = () => { setShowGbForm(false); setEditGbId(null); setGbForm({ ...defaultGbMember }); };

  const handleGbSave = async () => {
    setGbSaving(true);
    try {
      const url = editGbId ? `${API_URL}/governing-body/${editGbId}` : `${API_URL}/governing-body`;
      const method = editGbId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gbForm) });
      if (res.ok) {
        setMsg({ type: 'success', text: editGbId ? 'Member updated!' : 'Member added!' });
        cancelGbForm();
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

  // ── LGB handlers ──
  const openAddLgb = () => { setEditLgbId(null); setLgbForm({ ...defaultGbMember }); setShowLgbForm(true); };
  const openEditLgb = (m) => { setEditLgbId(m._id); setLgbForm({ name: m.name || '', designation: m.designation || '', photoUrl: m.photoUrl || '', order: m.order || 0, active: m.active !== false }); setShowLgbForm(true); };
  const cancelLgbForm = () => { setShowLgbForm(false); setEditLgbId(null); setLgbForm({ ...defaultGbMember }); };

  const handleLgbSave = async () => {
    setLgbSaving(true);
    try {
      const url = editLgbId ? `${API_URL}/local-governing-body/${editLgbId}` : `${API_URL}/local-governing-body`;
      const method = editLgbId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lgbForm) });
      if (res.ok) {
        setMsg({ type: 'success', text: editLgbId ? 'Member updated!' : 'Member added!' });
        cancelLgbForm();
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
  const isGbTab = activeTab === 'governing-body';
  const isLgbTab = activeTab === 'local-governing-body';

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoading text="Loading management..." />
      </AdminLayout>
    );
  }

  const allTabs = [
    ...ROLES.map((r) => ({ key: r.key, label: r.label, saved: !!entries[r.key] })),
    { key: 'governing-body', label: 'Governing Body', badge: gbMembers.length },
    { key: 'local-governing-body', label: 'Local Governing Body', badge: lgbMembers.length },
  ];

  // Staff fields for add/edit form
  const staffFields = STAFF_FIELDS;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div className="admin-topbar" style={{ flexShrink: 0 }}>
          <h1>Management</h1>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px 0', flexShrink: 0 }}>
            <AdminTabs tabs={allTabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div style={{ padding: '10px 24px', textAlign: 'center', flexShrink: 0 }}>
            <h2 className="admin-section-title">
              {isGbTab ? 'Governing Body' : isLgbTab ? 'Local Governing Body' : `${currentRole?.label} Management`}
            </h2>
          </div>

          <div style={{ flex: 1, padding: '0 24px 24px' }}>
            <AdminAlert type={msg?.type} message={msg} onDismiss={() => setMsg(null)} />

            {/* ── Governing Body Tab ── */}
            {isGbTab && (
              <>
                <p className="admin-edit-hint">Click a card to edit. Click the + box to add a new member.</p>
                {gbLoading ? (
                  <AdminLoading text="Loading governing body..." />
                ) : (
                  <div className="gb-cards-grid">
                    {/* Add Member */}
                    {showGbForm && !editGbId ? (
                      <AdminStaffCard
                        isAddMode
                        editForm={gbForm}
                        onFormChange={setGbForm}
                        onSave={handleGbSave}
                        onCancel={cancelGbForm}
                        saving={gbSaving}
                        fields={staffFields}
                      />
                    ) : (
                      <div
                        className="gb-member-card"
                        onClick={openAddGb}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderColor: '#000', background: '#fff', minHeight: '240px' }}
                      >
                        <span style={{ fontSize: '36px', color: '#bbb', marginBottom: '6px' }}>+</span>
                        <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>Add Member</span>
                      </div>
                    )}

                    {/* Member Cards */}
                    {gbMembers.map((member) => (
                      <AdminStaffCard
                        key={member._id}
                        member={member}
                        isEditing={editGbId === member._id}
                        editForm={gbForm}
                        onFormChange={setGbForm}
                        onStartEdit={() => openEditGb(member)}
                        onSave={handleGbSave}
                        onCancel={cancelGbForm}
                        onDelete={() => handleGbDelete(member._id)}
                        deleteConfirm={deleteConfirm === member._id}
                        onCancelDelete={() => setDeleteConfirm(null)}
                        saving={gbSaving}
                        fields={staffFields}
                        order={member.order}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Local Governing Body Tab ── */}
            {isLgbTab && (
              <>
                <p className="admin-edit-hint">Click a card to edit. Click the + box to add a new member.</p>
                {lgbLoading ? (
                  <AdminLoading text="Loading local governing body..." />
                ) : (
                  <div className="gb-cards-grid">
                    {/* Add Member */}
                    {showLgbForm && !editLgbId ? (
                      <AdminStaffCard
                        isAddMode
                        editForm={lgbForm}
                        onFormChange={setLgbForm}
                        onSave={handleLgbSave}
                        onCancel={cancelLgbForm}
                        saving={lgbSaving}
                        fields={staffFields}
                      />
                    ) : (
                      <div
                        className="gb-member-card"
                        onClick={openAddLgb}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderColor: '#000', background: '#fff', minHeight: '240px' }}
                      >
                        <span style={{ fontSize: '36px', color: '#bbb', marginBottom: '6px' }}>+</span>
                        <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>Add Member</span>
                      </div>
                    )}

                    {/* Member Cards */}
                    {lgbMembers.map((member) => (
                      <AdminStaffCard
                        key={member._id}
                        member={member}
                        isEditing={editLgbId === member._id}
                        editForm={lgbForm}
                        onFormChange={setLgbForm}
                        onStartEdit={() => openEditLgb(member)}
                        onSave={handleLgbSave}
                        onCancel={cancelLgbForm}
                        onDelete={() => handleLgbDelete(member._id)}
                        deleteConfirm={deleteConfirmLgb === member._id}
                        onCancelDelete={() => setDeleteConfirmLgb(null)}
                        saving={lgbSaving}
                        fields={staffFields}
                        order={member.order}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Management Role Tabs (Founder/Chairman/etc.) ── */}
            {!isGbTab && !isLgbTab && (
              <>
                <p className="admin-edit-hint">Click the card to edit.</p>

                {/* Preview mode */}
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
                        <div className="placement-officer-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                          <span style={{ fontSize: '48px', fontWeight: 700, color: '#243358', fontFamily: 'Georgia, serif' }}>?</span>
                        </div>
                      )}
                      <h4 className="placement-officer-name">{form.name || currentRole?.label || 'Name'}</h4>
                      <p className="placement-officer-designation">{form.title || currentRole?.label}</p>
                      {form.qualification && <p className="placement-officer-qual">{form.qualification}</p>}
                    </div>
                    <div className="placement-officer-msg">
                      {form.message ? (
                        form.message.split('\n').filter((p) => p.trim()).map((para, i) => <p key={i}>{para}</p>)
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
                        <ImageUpload value={form.photoUrl} onChange={(url) => handleChange('photoUrl', url)} label="" placeholder="Photo" />
                      </div>
                      <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full Name"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#243358', textAlign: 'center', marginBottom: '6px', boxSizing: 'border-box' }} />
                      <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Title / Designation"
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', textAlign: 'center', color: '#243358', fontWeight: 500, marginBottom: '6px', boxSizing: 'border-box' }} />
                      <input type="text" value={form.qualification} onChange={(e) => handleChange('qualification', e.target.value)} placeholder="Qualification"
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', textAlign: 'center', color: '#666', boxSizing: 'border-box' }} />
                    </div>
                    <div className="placement-officer-msg">
                      <textarea value={form.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="Write the message or about section..." rows={6}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', color: '#555', lineHeight: '1.75', resize: 'vertical', boxSizing: 'border-box', minHeight: '120px' }} />
                    </div>
                  </div>
                )}

                {editingRole && (
                  <div style={{ marginTop: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn btn-success btn-sm" onClick={() => { handleSave(); setEditingRole(false); }} disabled={saving} style={{ padding: '8px 22px', fontSize: '13px' }}>
                      {saving ? 'Saving...' : 'Save & Done'}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setForm(activeEntry ? { ...defaultEntry, ...activeEntry } : { ...defaultEntry }); setEditingRole(false); setMsg(null); }} style={{ padding: '8px 22px', fontSize: '13px' }}>
                      Cancel
                    </button>
                    {activeEntry && (
                      <button className="btn btn-danger btn-sm" onClick={() => { handleDelete(); setEditingRole(false); }} style={{ padding: '8px 22px', fontSize: '13px' }}>
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminManagement;
