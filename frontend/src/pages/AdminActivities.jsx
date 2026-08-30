import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import AdminLoading from '../components/AdminLoading';
import ImageUpload from '../components/ImageUpload';

import './Admin.css';
import './Academics.css';
import './Gallery.css';

const API_URL = '/api';

const SECTIONS = [
  { key: 'sports', label: 'Sports' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'technical', label: 'Technical Events' },
  { key: 'academic-events', label: 'Academic Events' },
];

const defaultForm = {
  title: '',
  content: '',
  infoRows: [],
  stats: [],
  images: [],
  subSections: [],
  active: true,
};

function AdminActivities() {
  const [activeTab, setActiveTab] = useState('sports');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // View mode
  const [view, setView] = useState('preview');

  // Inline editing state
  const [editingStatIdx, setEditingStatIdx] = useState(null);
  const [editingInfoIdx, setEditingInfoIdx] = useState(null);
  const [editingSubIdx, setEditingSubIdx] = useState(null);
  const [editingSubImgIdx, setEditingSubImgIdx] = useState(null);
  const [newSubImage, setNewSubImage] = useState('');

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
        subSections: existing.subSections || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultForm });
    }
    setMsg(null);
    resetInputs();
    setView('preview');
  }, [activeTab, sections]);

  const resetInputs = () => {
    setEditingStatIdx(null);
    setEditingInfoIdx(null);
    setEditingSubIdx(null);
    setEditingSubImgIdx(null);
    setNewSubImage('');
  };

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const startEditing = () => { setView('edit'); resetInputs(); };

  const cancelEditing = () => {
    const existing = sections[activeTab];
    if (existing) {
      setForm({
        title: existing.title || '', content: existing.content || '', infoRows: existing.infoRows || [], stats: existing.stats || [], images: existing.images || [], subSections: existing.subSections || [], active: existing.active !== false,
      });
    } else { setForm({ ...defaultForm }); }
    setView('preview'); resetInputs();
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: 'Saved!' });
      setView('preview');
    } catch { setMsg({ type: 'error', text: 'Failed to save.' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await fetch(`${API_URL}/activities/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultForm }); setMsg({ type: 'success', text: 'Deleted.' }); setView('preview');
    } catch { setMsg({ type: 'error', text: 'Failed.' }); }
  };

  // Sub-section helpers
  const addSubSection = () => {
    handleChange('subSections', [...form.subSections, { title: '', description: '', images: [] }]);
    setEditingSubIdx(form.subSections.length);
  };

  const updateSubSection = (i, field, val) => {
    const subs = [...form.subSections];
    subs[i] = { ...subs[i], [field]: val };
    handleChange('subSections', subs);
  };

  const removeSubSection = (i) => {
    handleChange('subSections', form.subSections.filter((_, idx) => idx !== i));
    setEditingSubIdx(null);
  };

  const addSubImage = (subIdx) => {
    if (!newSubImage) return;
    const subs = [...form.subSections];
    subs[subIdx] = { ...subs[subIdx], images: [...subs[subIdx].images, { url: newSubImage, caption: '' }] };
    handleChange('subSections', subs);
    setNewSubImage('');
  };

  const updateSubImageCaption = (subIdx, imgIdx, val) => {
    const subs = [...form.subSections];
    const images = [...subs[subIdx].images];
    images[imgIdx] = { ...images[imgIdx], caption: val };
    subs[subIdx] = { ...subs[subIdx], images };
    handleChange('subSections', subs);
  };

  const removeSubImage = (subIdx, imgIdx) => {
    const subs = [...form.subSections];
    subs[subIdx] = { ...subs[subIdx], images: subs[subIdx].images.filter((_, i) => i !== imgIdx) };
    handleChange('subSections', subs);
    setEditingSubImgIdx(null);
  };

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  if (loading) return <AdminLayout><div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div></AdminLayout>;

  // Static descriptions for each section
  const staticDescriptions = {
    sports: 'The institute encourages students to participate in sports at inter-collegiate, university and state level. Annual sports events, qualified coaches and well-maintained grounds help students build fitness, team spirit and sportsmanship.',
    cultural: 'Cultural activities give students a platform to showcase their talent in music, dance, drama and fine arts. Events are organised throughout the year, including the annual gathering and youth festival competitions.',
    technical: 'Technical events such as paper presentations, project exhibitions, coding contests, robo-races and workshops help students apply classroom knowledge to real-world problems and sharpen their innovation skills.',
    'academic-events': 'Academic events and activities including seminars, workshops, guest lectures, and technical talks are organised to supplement classroom teaching and provide exposure to industry trends and emerging technologies.',
  };

  // ─── Preview ──────────────────────────────────────────────────────
  const renderPreview = () => (
    <div className="admission-preview-card">
      <h2 className="content-heading">{currentSection?.label}</h2>
      <div className="content-line"></div>
      <p>{staticDescriptions[activeTab]}</p>

      {form.subSections.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          {form.subSections.map((sub, i) => (
            <div key={i} className="activity-sub-preview" style={{ marginBottom: '28px', padding: '20px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '10px' }}>
              <h3 className="content-sub-heading" style={{ margin: '0 0 8px' }}>{sub.title || 'Untitled'}</h3>
              <div style={{ width: '35px', height: '2px', background: '#c8963e', marginBottom: '12px', borderRadius: '2px' }}></div>
              {sub.description && <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '12px' }}>{sub.description}</p>}
              {sub.images && sub.images.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {sub.images.map((img, j) => (
                    <div key={j} style={{ textAlign: 'center' }}>
                      <div style={{ width: '160px', height: '160px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e4e8ed' }}>
                        <img src={img.url} alt={img.caption || `Image ${j + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      {img.caption && <p style={{ fontSize: '12px', color: '#555', margin: '6px 0 0', fontWeight: 500 }}>{img.caption}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {form.subSections.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic', marginTop: '16px' }}>No sub-sections added yet.</p>}
    </div>
  );

  // ─── Editor ───────────────────────────────────────────────────────
  const renderEditor = () => (
    <div className="admission-edit-form">
      <h4>Sub-Sections ({form.subSections.length})</h4>
      <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Add individual sports, events or activities with title, description and images.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {form.subSections.map((sub, i) => (
        <div key={i} style={{ padding: '16px', background: editingSubIdx === i ? '#fffbe6' : '#f8f9fa', border: editingSubIdx === i ? '2px solid #c8963e' : '1px solid #e4e8ed', borderRadius: '10px', position: 'relative' }}>
          {editingSubIdx === i ? (
            <>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <input autoFocus type="text" value={sub.title} onChange={(e) => updateSubSection(i, 'title', e.target.value)} placeholder="Title (e.g. Cricket, Chess, Annual Day)" style={{ flex: 1, padding: '8px 12px', border: '1px solid #c8963e', borderRadius: '6px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box' }} />
                <button className="btn btn-success btn-sm" onClick={() => { setEditingSubIdx(null); setEditingSubImgIdx(null); }}>Done</button>
              </div>
              <textarea value={sub.description} onChange={(e) => updateSubSection(i, 'description', e.target.value)} placeholder="Description..." rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', resize: 'vertical', marginBottom: '12px', boxSizing: 'border-box' }} />

              {/* Images for this sub-section */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '10px', display: 'block' }}>Images</label>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {/* Add Image Card */}
                  <div style={{ width: '160px', flexShrink: 0 }}>
                    {!newSubImage ? (
                      <div style={{ width: '160px', height: '160px', border: '2px dashed #d7dde6', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fafbfc', transition: 'border-color 0.2s' }}>
                        <ImageUpload value={newSubImage} onChange={(url) => setNewSubImage(url)} label="" placeholder="" />
                        <span style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Click to upload</span>
                      </div>
                    ) : (
                      <div style={{ width: '160px', background: '#fff', border: '2px solid #c8963e', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: '160px', height: '160px', overflow: 'hidden' }}>
                          <img src={newSubImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => addSubImage(i)} style={{ flex: 1, fontSize: '12px' }}>Add</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setNewSubImage('')} style={{ fontSize: '12px' }}>Cancel</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Existing Images */}
                  {sub.images && sub.images.map((img, j) => (
                    <div key={j} style={{ width: '160px', flexShrink: 0, position: 'relative' }}>
                      <div style={{ width: '160px', height: '160px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e4e8ed', background: '#f8f9fa' }}>
                        <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <button onClick={() => removeSubImage(i, j)} style={{ position: 'absolute', top: '6px', right: '6px', background: '#fdecea', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '12px', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      {editingSubImgIdx === `${i}-${j}` ? (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                          <input autoFocus type="text" value={img.caption} onChange={(e) => updateSubImageCaption(i, j, e.target.value)} placeholder="Caption" style={{ flex: 1, padding: '6px 8px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '12px', boxSizing: 'border-box' }} />
                          <button className="btn btn-success btn-sm" onClick={() => setEditingSubImgIdx(null)} style={{ padding: '6px 8px', fontSize: '11px' }}>Done</button>
                        </div>
                      ) : (
                        <p onClick={() => setEditingSubImgIdx(`${i}-${j}`)} style={{ fontSize: '12px', color: '#555', margin: '6px 0 0', cursor: 'pointer', textAlign: 'center' }}>{img.caption || <em style={{ color: '#aaa' }}>Add caption...</em>}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div onClick={() => { setEditingSubIdx(i); setEditingSubImgIdx(null); }} style={{ cursor: 'pointer', flex: 1 }}>
                <h4 style={{ margin: '0 0 4px', color: '#243358', fontSize: '16px' }}>{sub.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled</em>}</h4>
                {sub.description && <p style={{ margin: '0 0 8px', color: '#555', fontSize: '13px', lineHeight: '1.5' }}>{sub.description.length > 120 ? sub.description.substring(0, 120) + '...' : sub.description}</p>}
                {sub.images && sub.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {sub.images.slice(0, 4).map((img, j) => (
                      <div key={j} style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e4e8ed' }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    {sub.images.length > 4 && <span style={{ fontSize: '11px', color: '#888', alignSelf: 'center' }}>+{sub.images.length - 4}</span>}
                  </div>
                )}
              </div>
              <button className="member-remove-btn" onClick={() => removeSubSection(i)}>×</button>
            </div>
          )}
        </div>
      ))}
      </div>

      <button className="btn btn-success btn-sm" onClick={addSubSection}>+ Add Sub-Section</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-topbar"><h1>Activities</h1></div>

      <div className="admin-content">
        <AdminTabs tabs={SECTIONS.map((s) => ({ ...s, saved: !!sections[s.key] }))} activeTab={activeTab} onChange={setActiveTab} />
        <AdminAlert type={msg?.type} message={msg} onDismiss={() => setMsg(null)} />

        {/* Action Bar */}
        <div className="admission-action-bar">
          {view === 'preview' ? (
            <>
              <button className="btn btn-primary" onClick={startEditing}>{sections[activeTab] ? 'Edit' : 'Add Content'}</button>
              {sections[activeTab] && <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>}
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
            </>
          )}
        </div>

        {/* Preview or Editor */}
        {view === 'preview' ? renderPreview() : (
          <div className="admission-editor-panel">
            <div className="admission-editor-header"><h3>Editing: {currentSection?.label}</h3></div>
            {renderEditor()}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminActivities;
