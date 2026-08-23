import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';
import './Admin.css';

const API_URL = '/api';

const SECTIONS = [
  { key: 'sports', label: 'Sports' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'technical', label: 'Technical Events' },
  { key: 'industrial-visits', label: 'Industrial Visits' },
  { key: 'competitions', label: 'Competitions' },
];

const defaultForm = {
  title: '',
  content: '',
  infoRows: [],
  stats: [],
  images: [],
  active: true,
};

function AdminActivities() {
  const [activeTab, setActiveTab] = useState('sports');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Inline editing state - frontend-style cards
  const [editingStatIdx, setEditingStatIdx] = useState(null);
  const [editingInfoIdx, setEditingInfoIdx] = useState(null);
  const [editingImgIdx, setEditingImgIdx] = useState(null);

  // Image inputs
  const [newImage, setNewImage] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/activities`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
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
        images: existing.images || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultForm });
    }
    setMsg(null);
    resetInputs();
  }, [activeTab, sections]);

  const resetInputs = () => {
    setEditingStatIdx(null);
    setEditingInfoIdx(null);
    setEditingImgIdx(null);
    setNewImage(''); setNewImageCaption('');
  };

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/activities`, {
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
      await fetch(`${API_URL}/activities/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultForm });
      setMsg({ type: 'success', text: 'Deleted successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
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

  // Image helpers
  const addImage = () => {
    if (!newImage) return;
    handleChange('images', [...form.images, { url: newImage, caption: newImageCaption.trim() }]);
    setNewImage(''); setNewImageCaption('');
  };

  const updateImageCaption = (index, value) => {
    const images = [...form.images];
    images[index] = { ...images[index], caption: value };
    handleChange('images', images);
  };

  const removeImage = (index) => {
    handleChange('images', form.images.filter((_, i) => i !== index));
    setEditingImgIdx(null);
  };

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

  // Render info rows editor - small cards with inline editing
  const renderInfoRowsEditor = () => (
    <div className="form-group">
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Info Rows (Label - Value)</label>
      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px' }}>Shown exactly like the live website — click a row to edit it.</p>
      <div className="admin-info-table">
        {/* Add Row - styled like a table row */}
        <div className="admin-info-add" onClick={addEmptyInfoRow} title="Add Info Row">
          + Add Row
        </div>

        {form.infoRows.map((row, i) => (
          editingInfoIdx === i ? (
            /* Editing mode - inline inputs inside the row */
            <div key={i} className="admin-info-editing">
              <input
                autoFocus
                type="text"
                value={row.label || ''}
                onChange={(e) => updateInfoRow(i, 'label', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingInfoIdx(null)}
                placeholder="Label"
                style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12.5px', boxSizing: 'border-box' }}
              />
              <input
                type="text"
                value={row.value || ''}
                onChange={(e) => updateInfoRow(i, 'value', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingInfoIdx(null)}
                placeholder="Value"
                style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12.5px', boxSizing: 'border-box' }}
              />
              <button className="btn btn-success btn-sm" onClick={() => setEditingInfoIdx(null)} style={{ alignSelf: 'flex-start' }}>Done</button>
            </div>
          ) : (
            /* Display mode - same look as the live info table */
            <div key={i} className="admin-info-row" onClick={() => setEditingInfoIdx(i)} title="Click to edit">
              <span className="admin-info-label">{row.label || <em style={{ color: '#aaa' }}>Label</em>}</span>
              <span className="admin-info-value">{row.value || <em style={{ color: '#aaa' }}>Value</em>}</span>
              <button
                className="admin-info-remove"
                onClick={(e) => { e.stopPropagation(); removeInfoRow(i); }}
                title="Remove"
              >
                ×
              </button>
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
        <h1>Activities</h1>
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

            {/* Stats */}
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
            {renderStatsEditor()}

            {/* Info Rows */}
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
            {renderInfoRowsEditor()}

            {/* Images */}
            <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
            <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Images</h4>
            {!newImage ? (
              <ImageUpload value={newImage} onChange={(url) => setNewImage(url)} label="Upload Image" placeholder="Upload section image..." />
            ) : (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginBottom: '8px' }}>
                <div style={{ width: '120px', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e4e8ed', flexShrink: 0 }}>
                  <img src={newImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <input type="text" value={newImageCaption} onChange={(e) => setNewImageCaption(e.target.value)} placeholder="Caption (optional)" style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                <button className="btn btn-primary btn-sm" onClick={addImage}>Add</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setNewImage(''); setNewImageCaption(''); }}>Cancel</button>
              </div>
            )}
            {form.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '8px', position: 'relative' }}>
                    <div style={{ height: '110px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                      <img src={img.url} alt={img.caption || `Image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {editingImgIdx === i ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          autoFocus
                          type="text"
                          value={img.caption}
                          onChange={(e) => updateImageCaption(i, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingImgIdx(null)}
                          placeholder="Caption (optional)"
                          style={{ flex: 1, padding: '6px 8px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '12px' }}
                        />
                        <button className="btn btn-success btn-sm" onClick={() => setEditingImgIdx(null)}>Done</button>
                      </div>
                    ) : (
                      <p
                        onClick={() => setEditingImgIdx(i)}
                        title="Click to edit caption"
                        style={{ fontSize: '12px', color: '#555', margin: '0 0 6px', cursor: 'pointer' }}
                      >
                        {img.caption || <em style={{ color: '#aaa' }}>Add caption...</em>}
                      </p>
                    )}
                    <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '12px', right: '12px', background: '#fdecea', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '14px', width: '24px', height: '24px', borderRadius: '50%' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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
                  images: sections[activeTab].images || [],
                  active: sections[activeTab].active !== false,
                });
              } else {
                setForm({ ...defaultForm });
              }
              setMsg(null);
              resetInputs();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminActivities;
