import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import AdminLoading from '../components/AdminLoading';
import ImageUpload from '../components/ImageUpload';
import PdfUpload from '../components/PdfUpload';
import './Admin.css';
import './AboutCollege.css';

import API_URL from '../lib/api';

const SECTIONS = [
  { key: 'society', label: 'Satara Education Society' },
  { key: 'institute', label: 'Institute' },
  { key: 'disclosure', label: 'Mandatory Disclosure' },
  { key: 'vision', label: 'Vision & Mission' },
  { key: 'affiliation', label: 'Affiliation & Approval' },
  { key: 'policy', label: 'Institute Policy' },
  { key: 'organisational-chart', label: 'Org Chart' },
  { key: 'code-of-conduct', label: 'Code of Conduct' },
];

const defaultSection = {
  title: '',
  content: '',
  mission: [],
  achievements: [],
  infoRows: [],
  stats: [],
  image: '',
  orgLevels: [],
  conductSections: [],
  pdfUrl: '',
  active: true,
};

function PdfPreview({ url }) {
  if (!url) return null;
  return (
    <div style={{ marginTop: '16px' }}>
      <a
        href={`${API_URL}/pdf-proxy?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 22px', background: '#243358', color: '#fff', fontSize: '13px', fontWeight: 600, borderRadius: '6px', textDecoration: 'none' }}
      >
        📄 View PDF
      </a>
    </div>
  );
}

function AdminAbout() {
  const [activeTab, setActiveTab] = useState('society');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...defaultSection });

  // Inline editing
  const [editingStatIdx, setEditingStatIdx] = useState(null);
  const [editingInfoIdx, setEditingInfoIdx] = useState(null);
  const [newMissionItem, setNewMissionItem] = useState('');
  const [newAchievementItem, setNewAchievementItem] = useState('');
  // Tracks which conduct card the inline "Add rule" input belongs to.
  const [newConductItem, setNewConductItem] = useState(null);
  const [newConductItemText, setNewConductItemText] = useState('');

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
    setEditing(false);
    setEditingStatIdx(null);
    setEditingInfoIdx(null);
    setMsg(null);
    setNewMissionItem('');
    setNewAchievementItem('');
    setNewConductItem(null);
    setNewConductItemText('');
  }, [activeTab]);

  const currentData = sections[activeTab] || {};

  const startEditing = () => {
    setEditForm({
      title: currentData.title || '',
      content: currentData.content || '',
      mission: currentData.mission || [],
      achievements: currentData.achievements || [],
      infoRows: currentData.infoRows || [],
      stats: currentData.stats || [],
      image: currentData.image || '',
      orgLevels: currentData.orgLevels || [],
      conductSections: currentData.conductSections || [],
      pdfUrl: currentData.pdfUrl || '',
      active: currentData.active !== false,
    });
    setEditing(true);
    setMsg(null);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditForm({ ...defaultSection });
    setEditingStatIdx(null);
    setEditingInfoIdx(null);
    setNewMissionItem('');
    setNewAchievementItem('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: 'Saved successfully!' });
      setEditing(false);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this section data?')) return;
    try {
      await fetch(`${API_URL}/about/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => {
        const updated = { ...prev };
        delete updated[activeTab];
        return updated;
      });
      setEditing(false);
      setMsg({ type: 'success', text: 'Deleted.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Info row helpers
  const addInfoRow = () => {
    handleChange('infoRows', [...editForm.infoRows, { label: '', value: '' }]);
    setEditingInfoIdx(editForm.infoRows.length);
  };
  const updateInfoRow = (i, field, val) => {
    const rows = [...editForm.infoRows];
    rows[i] = { ...rows[i], [field]: val };
    handleChange('infoRows', rows);
  };
  const removeInfoRow = (i) => {
    handleChange('infoRows', editForm.infoRows.filter((_, idx) => idx !== i));
    setEditingInfoIdx(null);
  };

  // Stat helpers
  const addStat = () => {
    handleChange('stats', [...editForm.stats, { num: '', label: '' }]);
    setEditingStatIdx(editForm.stats.length);
  };
  const updateStat = (i, field, val) => {
    const stats = [...editForm.stats];
    stats[i] = { ...stats[i], [field]: val };
    handleChange('stats', stats);
  };
  const removeStat = (i) => {
    handleChange('stats', editForm.stats.filter((_, idx) => idx !== i));
    setEditingStatIdx(null);
  };

  // Org chart: managed as a single image now; legacy block helpers removed.

  // Code of conduct helpers
  const addConductSection = () => {
    handleChange('conductSections', [...editForm.conductSections, { title: '', items: [] }]);
  };
  const updateConductSection = (i, field, val) => {
    const sections = editForm.conductSections.map((s, si) => (si === i ? { ...s, [field]: val } : s));
    handleChange('conductSections', sections);
  };
  const removeConductSection = (i) => {
    handleChange('conductSections', editForm.conductSections.filter((_, si) => si !== i));
  };
  const moveConductSection = (i, dir) => {
    const sections = [...editForm.conductSections];
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    [sections[i], sections[j]] = [sections[j], sections[i]];
    handleChange('conductSections', sections);
  };
  const addConductItem = (i) => {
    if (!newConductItemText.trim() || newConductItem !== i) return;
    const sections = editForm.conductSections.map((s, si) => (
      si === i ? { ...s, items: [...(s.items || []), newConductItemText.trim()] } : s
    ));
    handleChange('conductSections', sections);
    setNewConductItemText('');
  };
  const removeConductItem = (i, j) => {
    const sections = editForm.conductSections.map((s, si) => (
      si === i ? { ...s, items: (s.items || []).filter((_, ij) => ij !== j) } : s
    ));
    handleChange('conductSections', sections);
  };

  // Mission helpers
  const addMission = () => {
    if (!newMissionItem.trim()) return;
    handleChange('mission', [...editForm.mission, newMissionItem.trim()]);
    setNewMissionItem('');
  };
  const removeMission = (i) => {
    handleChange('mission', editForm.mission.filter((_, idx) => idx !== i));
  };

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoading text="Loading about..." />
      </AdminLayout>
    );
  }

  // ─── Preview card components ──────────────────────────────────────

  const PreviewCard = ({ children }) => (
    <div className="about-preview-card" onClick={!editing ? startEditing : undefined}>
      {!editing && (
        <div className="about-preview-hint">Click to edit</div>
      )}
      {children}
    </div>
  );

  const ContentPreview = ({ text }) => {
    if (!text) return <p style={{ color: '#aaa', fontStyle: 'italic' }}>No content yet. Click to add.</p>;
    return text.split('\n').filter(p => p.trim()).map((para, i) => (
      <p key={i} style={{ marginBottom: '12px', lineHeight: '1.7', color: '#444' }}>{para}</p>
    ));
  };

  const InfoTablePreview = ({ rows }) => {
    if (!rows || rows.length === 0) return null;
    return (
      <div className="info-table">
        {rows.map((row, i) => (
          <div className="info-row" key={i}>
            <span className="info-label">{row.label}</span>
            <span className="info-value">{row.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const StatsPreview = ({ stats }) => {
    if (!stats || stats.length === 0) return null;
    return (
      <div className="overview-stats">
        {stats.map((stat, i) => (
          <div className="stat-box" key={i}>
            <span className="stat-num">{stat.num}</span>
            <span className="stat-txt">{stat.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const MissionPreview = ({ items }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="vm-block">
        <h3 className="vm-title">Mission</h3>
        <ul className="vm-list">
          {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    );
  };

  // ─── Render tab content ──────────────────────────────────────────

  const renderPreview = () => {
    switch (activeTab) {
      case 'society':
        return (
          <PreviewCard>
            <h2 className="content-heading">{currentData.title || 'Satara Education Society'}</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
          </PreviewCard>
        );

      case 'institute':
        return (
          <PreviewCard>
            <h2 className="content-heading">{currentData.title || 'Institute Overview'}</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
            <StatsPreview stats={currentData.stats} />
          </PreviewCard>
        );

      case 'disclosure':
        return (
          <PreviewCard>
            <h2 className="content-heading">{currentData.title || 'Mandatory Disclosure'}</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
            <InfoTablePreview rows={currentData.infoRows} />
          </PreviewCard>
        );

      case 'vision':
        return (
          <PreviewCard>
            <h2 className="content-heading">{currentData.title || 'Vision & Mission'}</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
            <MissionPreview items={currentData.mission} />
          </PreviewCard>
        );

      case 'affiliation':
        return (
          <PreviewCard>
            <h2 className="content-heading">{currentData.title || 'Affiliation & Approval'}</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
            <InfoTablePreview rows={currentData.infoRows} />
          </PreviewCard>
        );

      case 'policy':
        return (
          <PreviewCard>
            <h2 className="content-heading">{currentData.title || 'Institute Policy'}</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
            <InfoTablePreview rows={currentData.infoRows} />
            <PdfPreview url={currentData.pdfUrl} />
          </PreviewCard>
        );

      case 'organisational-chart':
        return (
          <PreviewCard>
            <h2 className="content-heading">Organisational Chart</h2>
            <div className="content-line"></div>
            {currentData.image ? (
              <div className="org-chart-image">
                <img src={currentData.image} alt="Organisational Chart preview" style={{ cursor: 'default' }} />
              </div>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>
                No chart image uploaded yet. The site shows a built-in placeholder structure until you upload one. Click to add.
              </p>
            )}
          </PreviewCard>
        );

      case 'code-of-conduct':
        return (
          <PreviewCard>
            <h2 className="content-heading">Code of Conduct</h2>
            <div className="content-line"></div>
            <ContentPreview text={currentData.content} />
            <PdfPreview url={currentData.pdfUrl} />
            {(currentData.conductSections || []).length === 0 ? (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>
                No rules added yet. The site shows built-in default rules until you add content. Click to add.
              </p>
            ) : (
              <div className="coc-grid">
                {currentData.conductSections.map((section, i) => (
                  <div className="coc-card" key={i}>
                    <h3 className="coc-card-title">{section.title}</h3>
                    <ul className="coc-list">
                      {(section.items || []).map((item, j) => <li key={j}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </PreviewCard>
        );

      default:
        return null;
    }
  };

  const renderEditor = () => {
    switch (activeTab) {
      case 'society':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Section Title</label>
              <input type="text" value={editForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={8} placeholder="Write the content here..." />
            </div>
          </div>
        );

      case 'institute':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Section Title</label>
              <input type="text" value={editForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={8} placeholder="Write the content here..." />
            </div>
            {/* Stats */}
            <div className="form-group">
              <label>Stats</label>
              <div className="about-stats-grid">
                {editForm.stats.map((stat, i) => (
                  editingStatIdx === i ? (
                    <div key={i} className="about-stat-edit">
                      <input autoFocus type="text" value={stat.num} onChange={(e) => updateStat(i, 'num', e.target.value)} placeholder="Number" />
                      <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label" />
                      <div className="about-edit-btns">
                        <button className="btn btn-success btn-sm" onClick={() => setEditingStatIdx(null)}>Done</button>
                        <button className="btn btn-danger btn-sm" onClick={() => removeStat(i)}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="about-stat-preview" onClick={() => setEditingStatIdx(i)}>
                      <span className="about-stat-num">{stat.num}</span>
                      <span className="about-stat-label">{stat.label}</span>
                      <button className="about-stat-delete" onClick={(e) => { e.stopPropagation(); removeStat(i); }}>×</button>
                    </div>
                  )
                ))}
                <div className="about-stat-add" onClick={addStat}>
                  <span>+</span>
                  <span>Add Stat</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'disclosure':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Section Title</label>
              <input type="text" value={editForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={8} placeholder="Write the content here..." />
            </div>
            {renderInfoRowsEditor()}
          </div>
        );

      case 'vision':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Section Title</label>
              <input type="text" value={editForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label>Content (Vision)</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={8} placeholder="Write vision content..." />
            </div>
            <div className="form-group">
              <label>Mission Points</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input type="text" value={newMissionItem} onChange={(e) => setNewMissionItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addMission()} placeholder="Add mission point..." style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                <button className="btn btn-primary btn-sm" onClick={addMission}>Add</button>
              </div>
              {editForm.mission.length > 0 && (
                <div className="about-mission-list">
                  {editForm.mission.map((item, i) => (
                    <div key={i} className="about-mission-item">
                      <span>{item}</span>
                      <button onClick={() => removeMission(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'affiliation':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Section Title</label>
              <input type="text" value={editForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={8} placeholder="Write the content here..." />
            </div>
            {renderInfoRowsEditor()}
          </div>
        );

      case 'policy':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Section Title</label>
              <input type="text" value={editForm.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter title..." />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={10} placeholder="Write institute policy details here..." />
            </div>
            {renderInfoRowsEditor()}
            <div className="form-group">
              <label>Policy PDF (optional — shows a "View" button on the site)</label>
              <PdfUpload value={editForm.pdfUrl || ''} onChange={(url) => handleChange('pdfUrl', url)} label="Policy PDF" />
            </div>
          </div>
        );

      case 'organisational-chart':
        return (
          <div className="about-edit-form">
            <p style={{ color: '#777', fontSize: '13px', marginBottom: '16px' }}>
              Upload the organisational chart as a single image (a clear photo or export of the chart).
              It replaces the old block-by-block chart everywhere on the site.
            </p>
            <div className="form-group">
              <ImageUpload
                value={editForm.image || ''}
                onChange={(url) => handleChange('image', url)}
                placeholder="Upload organisational chart image..."
              />
            </div>
            {editForm.image && (
              <img
                src={editForm.image}
                alt="Organisational chart preview"
                style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e4e8ed', padding: '6px', background: '#fff' }}
              />
            )}
          </div>
        );

      case 'code-of-conduct':
        return (
          <div className="about-edit-form">
            <div className="form-group">
              <label>Intro Paragraph (optional)</label>
              <textarea value={editForm.content} onChange={(e) => handleChange('content', e.target.value)} rows={4} placeholder="Shown above the rules. Leave empty to keep the built-in intro." />
            </div>
            <div className="form-group">
              <label>Conduct PDF (optional — shows a "View" button on the site)</label>
              <PdfUpload value={editForm.pdfUrl || ''} onChange={(url) => handleChange('pdfUrl', url)} label="Code of Conduct PDF" />
            </div>
            <div className="form-group">
              <label>Rule Cards</label>
              {editForm.conductSections.length === 0 && (
                <p style={{ color: '#aaa', fontStyle: 'italic', margin: '0 0 10px' }}>No cards yet.</p>
              )}
              {editForm.conductSections.map((section, i) => (
                <div key={i} className="about-mission-item" style={{ display: 'block', alignItems: 'stretch', gap: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="text" value={section.title} onChange={(e) => updateConductSection(i, 'title', e.target.value)} placeholder="Card title (e.g. For Students)" style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }} />
                    <button className="btn btn-danger btn-sm" onClick={() => removeConductSection(i)}>Remove</button>
                  </div>
                  {(section.items || []).length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      {section.items.map((item, j) => (
                        <div key={j} className="about-mission-item" style={{ marginBottom: '6px' }}>
                          <span style={{ flex: 1, fontSize: '12.5px' }}>{item}</span>
                          <button onClick={() => removeConductItem(i, j)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input type="text" value={newConductItem === i ? newConductItemText : ''} onChange={(e) => { setNewConductItem(i); setNewConductItemText(e.target.value); }} onKeyDown={(e) => e.key === 'Enter' && addConductItem(i)} placeholder="Add rule..." style={{ flex: 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12.5px' }} />
                    <button className="btn btn-primary btn-sm" onClick={() => addConductItem(i)}>Add</button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => moveConductSection(i, -1)} disabled={i === 0}>↑</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => moveConductSection(i, 1)} disabled={i === editForm.conductSections.length - 1}>↓</button>
                  </div>
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={addConductSection}>+ Add Rule Card</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderInfoRowsEditor = () => (
    <div className="form-group">
      <label>Info Rows</label>
      <div className="about-info-table">
        {editForm.infoRows.map((row, i) => (
          editingInfoIdx === i ? (
            <div key={i} className="about-info-editing">
              <input autoFocus type="text" value={row.label} onChange={(e) => updateInfoRow(i, 'label', e.target.value)} placeholder="Label" />
              <input type="text" value={row.value} onChange={(e) => updateInfoRow(i, 'value', e.target.value)} placeholder="Value" />
              <div className="about-edit-btns">
                <button className="btn btn-success btn-sm" onClick={() => setEditingInfoIdx(null)}>Done</button>
                <button className="btn btn-danger btn-sm" onClick={() => removeInfoRow(i)}>Remove</button>
              </div>
            </div>
          ) : (
            <div key={i} className="about-info-row" onClick={() => setEditingInfoIdx(i)}>
              <span className="about-info-label">{row.label || <em style={{ color: '#aaa' }}>Label</em>}</span>
              <span className="about-info-value">{row.value || <em style={{ color: '#aaa' }}>Value</em>}</span>
              <button className="about-info-delete" onClick={(e) => { e.stopPropagation(); removeInfoRow(i); }}>×</button>
            </div>
          )
        ))}
        <div className="about-info-add" onClick={addInfoRow}>+ Add Row</div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>About College</h1>
      </div>

      <div className="admin-content">
        <AdminTabs tabs={SECTIONS.map((s) => ({ ...s, saved: !!sections[s.key] }))} activeTab={activeTab} onChange={setActiveTab} />

        {/* Alert */}
        <AdminAlert type={msg?.type} message={msg} onDismiss={() => setMsg(null)} />

        {/* Preview or Editor */}
        {editing ? (
          <div className="about-admin-editor">
            <div className="about-editor-header">
              <h2>Editing: {currentSection?.label}</h2>
              <div className="about-editor-actions">
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
                {sections[activeTab] && (
                  <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
                )}
              </div>
            </div>
            {renderEditor()}
          </div>
        ) : (
          <div className="about-admin-preview">
            {renderPreview()}
            <div className="about-preview-actions">
              <button className="btn btn-primary" onClick={startEditing}>
                {sections[activeTab] ? 'Edit Section' : 'Add Content'}
              </button>
              {sections[activeTab] && (
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAbout;
