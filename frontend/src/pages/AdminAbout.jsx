import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const API_URL = '/api';

const SECTIONS = [
  { key: 'society', label: 'Satara Education Society' },
  { key: 'institute', label: 'Institute' },
  { key: 'disclosure', label: 'Mandatory Disclosure' },
  { key: 'vision', label: 'Vision & Mission' },
  { key: 'affiliation', label: 'Affiliation & Approval' },
];

const defaultSection = {
  title: '',
  content: '',
  mission: [],
  achievements: [],
  infoRows: [],
  stats: [],
  active: true,
};

function AdminAbout() {
  const [activeTab, setActiveTab] = useState('society');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultSection });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Dynamic list items
  const [newMissionItem, setNewMissionItem] = useState('');
  const [newAchievementItem, setNewAchievementItem] = useState('');

  // Index of the stat card currently being edited inline
  const [editingStatIdx, setEditingStatIdx] = useState(null);

  // Index of the info row card currently being edited inline
  const [editingInfoIdx, setEditingInfoIdx] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/about`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch about:', err);
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
        mission: existing.mission || [],
        achievements: existing.achievements || [],
        infoRows: existing.infoRows || [],
        stats: existing.stats || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultSection });
    }
    setMsg(null);
    setNewMissionItem('');
    setNewAchievementItem('');
    setEditingStatIdx(null);
    setEditingInfoIdx(null);
  }, [activeTab, sections]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: 'Section saved successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await fetch(`${API_URL}/about/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => {
        const updated = { ...prev };
        delete updated[activeTab];
        return updated;
      });
      setForm({ ...defaultSection });
      setMsg({ type: 'success', text: 'Deleted successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // List helpers
  const addListItem = (field, value, setter) => {
    if (!value.trim()) return;
    handleChange(field, [...form[field], value.trim()]);
    setter('');
  };

  const removeListItem = (field, index) => {
    handleChange(field, form[field].filter((_, i) => i !== index));
  };

  // Creates an empty info row card and opens it for inline editing
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

  // Creates an empty stat card and opens it for inline editing
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

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  // Render list editor
  const renderListEditor = (label, field, value, setter) => (
    <div className="form-group">
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setter(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addListItem(field, value, setter)}
          placeholder={`Add ${label.toLowerCase()}...`}
          style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
        />
        <button className="btn btn-primary btn-sm" onClick={() => addListItem(field, value, setter)}>Add</button>
      </div>
      {form[field].length > 0 && (
        <div style={{ background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '8px' }}>
          {form[field].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderBottom: i < form[field].length - 1 ? '1px solid #eee' : 'none' }}>
              <span style={{ fontSize: '13px', color: '#444' }}>{item}</span>
              <button onClick={() => removeListItem(field, i)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render info rows editor - small cards with inline editing, like stats
  const renderInfoRowsEditor = () => (
    <div className="form-group">
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Info Rows (Label - Value)</label>
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
            /* Editing mode - inline inputs inside the small card */
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
            /* Display mode */
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
              <span style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#243358' }}>{row.label}</span>
              <span style={{ display: 'block', fontSize: '11.5px', color: '#777', marginTop: '4px' }}>{row.value}</span>
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
            /* Editing mode - inline inputs inside the small card */
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
            /* Display mode - same look as the live stat boxes */
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
        <h1>About College</h1>
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
          <div className={`alert alert-${msg.type}`}>{msg.text}</div>
        )}

        {/* Title */}
        <h2 style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', fontSize: '22px', color: '#243358' }}>
          {currentSection?.label}
        </h2>

        {/* Form */}
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
              <label>Content (main text)</label>
              <textarea
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={6}
                placeholder="Write the main content here..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {/* Vision & Mission specific */}
            {activeTab === 'vision' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Mission Points</h4>
                {renderListEditor('Mission Point', 'mission', newMissionItem, setNewMissionItem)}
              </>
            )}

            {/* Achievements specific */}
            {activeTab === 'achievements' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Achievement Items</h4>
                {renderListEditor('Achievement', 'achievements', newAchievementItem, setNewAchievementItem)}
              </>
            )}

            {/* Institute specific - stats */}
            {activeTab === 'institute' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Stats</h4>
                {renderStatsEditor()}
              </>
            )}

            {/* Accreditation, Affiliation, Disclosure - info rows */}
            {['accreditation', 'affiliation', 'disclosure'].includes(activeTab) && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Info Rows</h4>
                {renderInfoRowsEditor()}
              </>
            )}

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
                      mission: sections[activeTab].mission || [],
                      achievements: sections[activeTab].achievements || [],
                      infoRows: sections[activeTab].infoRows || [],
                      stats: sections[activeTab].stats || [],
                      active: sections[activeTab].active !== false,
                    });
                  } else {
                    setForm({ ...defaultSection });
                  }
                  setMsg(null);
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

export default AdminAbout;
