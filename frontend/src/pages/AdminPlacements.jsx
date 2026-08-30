import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import AdminLoading from '../components/AdminLoading';
import ImageUpload from '../components/ImageUpload';
import PdfUpload from '../components/PdfUpload';
import './Academics.css';

const API_URL = '/api';

const SECTIONS = [
  { key: 'about', label: 'About Placement Cell' },
  { key: 'process', label: 'Placement Process' },
  { key: 'records', label: 'Placement Records' },
  { key: 'recruiters', label: 'Our Recruiters' },
];

const defaultSection = {
  title: '',
  content: '',
  steps: [],
  records: [],
  recordTable: [],
  recordImages: [],
  recruiters: [],
  officerName: '',
  officerPhoto: '',
  officerQual: '',
  officerMsg: '',
  officeTeam: [],
  active: true,
};

function AdminPlacements() {
  const [activeTab, setActiveTab] = useState('about');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultSection });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // View mode for process and records tabs
  const [view, setView] = useState('preview');

  // Step states
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [editingStepIdx, setEditingStepIdx] = useState(null);

  // Record states
  const [newRecYear, setNewRecYear] = useState('');
  const [newRecPlaced, setNewRecPlaced] = useState('');
  const [newRecCompanies, setNewRecCompanies] = useState('');



  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/placements-admin`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch placements:', err);
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
        steps: existing.steps || [],
        records: existing.records || [],
        recordTable: existing.recordTable || [],
        recordImages: existing.recordImages || [],
        recruiters: existing.recruiters || [],
        officerName: existing.officerName || '',
        officerPhoto: existing.officerPhoto || '',
        officerQual: existing.officerQual || '',
        officerMsg: existing.officerMsg || '',
        officeTeam: existing.officeTeam || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultSection });
    }
    setMsg(null);
    resetInputs();
    setView('preview');
  }, [activeTab, sections]);

  const resetInputs = () => {
    setNewStepTitle('');
    setNewStepDesc('');
    setNewRecYear('');
    setNewRecPlaced('');
    setNewRecCompanies('');
    setEditingStepIdx(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = () => { setView('edit'); resetInputs(); };

  const cancelEditing = () => {
    const existing = sections[activeTab];
    if (existing) {
      setForm({
        title: existing.title || '', content: existing.content || '', steps: existing.steps || [], records: existing.records || [], recordTable: existing.recordTable || [], recordImages: existing.recordImages || [], recruiters: existing.recruiters || [], officerName: existing.officerName || '', officerPhoto: existing.officerPhoto || '', officerQual: existing.officerQual || '', officerMsg: existing.officerMsg || '', officeTeam: existing.officeTeam || [], active: existing.active !== false,
      });
    } else { setForm({ ...defaultSection }); }
    setView('preview'); resetInputs();
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/placements-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: 'Saved!' });
      setView('preview');
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await fetch(`${API_URL}/placements-admin/${activeTab}`, { method: 'DELETE' });
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

  // Step helpers
  const addStep = () => {
    if (!newStepTitle.trim()) return;
    handleChange('steps', [...form.steps, { title: newStepTitle.trim(), desc: newStepDesc.trim() }]);
    setNewStepTitle('');
    setNewStepDesc('');
  };

  const removeStep = (index) => {
    handleChange('steps', form.steps.filter((_, i) => i !== index));
  };

  // Record helpers
  const addRecord = () => {
    if (!newRecYear.trim()) return;
    handleChange('records', [...form.records, { year: newRecYear.trim(), placed: newRecPlaced.trim(), companies: newRecCompanies.trim() }]);
    setNewRecYear('');
    setNewRecPlaced('');
    setNewRecCompanies('');
  };

  const removeRecord = (index) => {
    handleChange('records', form.records.filter((_, i) => i !== index));
  };

  // Recruiter helpers
  const addRecruiter = () => {
    handleChange('recruiters', [...form.recruiters, { name: '', logoUrl: '' }]);
  };

  const removeRecruiter = (index) => {
    handleChange('recruiters', form.recruiters.filter((_, i) => i !== index));
  };

  // Team member helpers
  const addTeamMember = () => {
    handleChange('officeTeam', [...form.officeTeam, {
      name: '',
      designation: '',
      photo: '',
      qual: '',
      email: '',
    }]);
  };

  const removeTeamMember = (index) => {
    handleChange('officeTeam', form.officeTeam.filter((_, i) => i !== index));
  };

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  if (loading) {
    return (
      <AdminLayout>
        <AdminLoading text="Loading placements..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Placements</h1>
      </div>

      <div className="admin-content">
        <AdminTabs tabs={SECTIONS.map((s) => ({ ...s, saved: !!sections[s.key] }))} activeTab={activeTab} onChange={setActiveTab} />

        <AdminAlert type={msg?.type} message={msg} onDismiss={() => setMsg(null)} />

        {/* Title */}
        <h2 className="admin-section-title" style={{ marginBottom: '20px' }}>
          {currentSection?.label}
        </h2>

        {/* Action bar for process and records */}
        {(activeTab === 'process' || activeTab === 'records') && (
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
        )}

        {/* Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{activeTab === 'records' ? 'Placement Records' : activeTab === 'about' ? 'Placement Officer & Team' : activeTab === 'process' ? 'Placement Process Steps' : activeTab === 'recruiters' ? 'Our Recruiters' : 'Section Content'}</h3>
            {sections[activeTab] && (
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            )}
          </div>
          <div className="admin-card-body">
            {/* Title - hidden for records, about, process, and recruiters */}
            {activeTab !== 'records' && activeTab !== 'about' && activeTab !== 'process' && activeTab !== 'recruiters' && (
              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder={`Enter title for ${currentSection?.label}`}
                />
              </div>
            )}

            {/* Content - hidden for records, about, process, and recruiters */}
            {activeTab !== 'records' && activeTab !== 'about' && activeTab !== 'process' && activeTab !== 'recruiters' && (
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={6}
                  placeholder="Write the main content here..."
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            )}

            {/* Placement Officer - click to edit like live website */}
            {activeTab === 'about' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#243358', fontSize: '15px' }}>Placement Officer</h4>
                  <span style={{ fontSize: '12px', color: '#888' }}>Click the card to edit</span>
                </div>

                {/* Preview mode - looks like the live website */}
                {editingStepIdx !== 'officer' ? (
                  <div
                    className="placement-officer-card"
                    onClick={() => setEditingStepIdx('officer')}
                    style={{ cursor: 'pointer' }}
                    title="Click to edit"
                  >
                    <div className="placement-officer-left">
                      {form.officerPhoto ? (
                        <div className="placement-officer-photo">
                          <img src={form.officerPhoto} alt={form.officerName} />
                        </div>
                      ) : (
                        <div className="placement-officer-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                          <span style={{ fontSize: '48px', fontWeight: 700, color: '#243358', fontFamily: 'Georgia, serif' }}>?</span>
                        </div>
                      )}
                      <h4 className="placement-officer-name">{form.officerName || 'Officer Name'}</h4>
                      <p className="placement-officer-designation">Placement Officer</p>
                      {form.officerQual && (
                        <p className="placement-officer-qual">{form.officerQual}</p>
                      )}
                    </div>
                    <div className="placement-officer-msg">
                      <p style={{ whiteSpace: 'pre-line' }}>{form.officerMsg || 'No message added yet. Click to edit.'}</p>
                    </div>
                  </div>
                ) : (
                  /* Edit mode */
                  <div className="placement-officer-card" style={{ border: '2px solid #c8963e' }}>
                    <div className="placement-officer-left">
                      <div className="placement-officer-photo">
                        <ImageUpload
                          value={form.officerPhoto}
                          onChange={(url) => handleChange('officerPhoto', url)}
                          label=""
                          placeholder="Photo"
                        />
                      </div>
                      <input
                        type="text"
                        value={form.officerName}
                        onChange={(e) => handleChange('officerName', e.target.value)}
                        placeholder="Officer Name"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', fontWeight: 700, fontFamily: 'Georgia, serif', color: '#243358', textAlign: 'center', marginBottom: '6px', boxSizing: 'border-box' }}
                      />
                      <p className="placement-officer-designation">Placement Officer</p>
                      <input
                        type="text"
                        value={form.officerQual}
                        onChange={(e) => handleChange('officerQual', e.target.value)}
                        placeholder="Qualification"
                        style={{ width: '100%', padding: '5px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', textAlign: 'center', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div className="placement-officer-msg">
                      <textarea
                        value={form.officerMsg}
                        onChange={(e) => handleChange('officerMsg', e.target.value)}
                        placeholder="Write a message from the placement officer..."
                        rows={6}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', color: '#555', lineHeight: '1.75', resize: 'vertical', boxSizing: 'border-box', minHeight: '120px' }}
                      />
                    </div>
                  </div>
                )}
                {editingStepIdx === 'officer' && (
                  <div style={{ marginTop: '10px' }}>
                    <button className="btn btn-success btn-sm" onClick={() => setEditingStepIdx(null)}>Done</button>
                  </div>
                )}
              </>
            )}

            {/* Office Team - only for About section */}
            {activeTab === 'about' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Placement & Training Office Team</h4>
                <div className="faculty-cards-grid">
                  {/* Existing team members as editable cards */}
                  {form.officeTeam.map((member, idx) => (
                    <div key={idx} className="faculty-card">
                      <button type="button" className="faculty-card-remove" onClick={() => removeTeamMember(idx)} title="Remove">
                        ✕
                      </button>
                      <div className="faculty-card-img">
                        <ImageUpload
                          value={member.photo}
                          onChange={(url) => {
                            const updated = [...form.officeTeam];
                            updated[idx] = { ...updated[idx], photo: url };
                            handleChange('officeTeam', updated);
                          }}
                          label=""
                          placeholder="Photo"
                          circle
                        />
                      </div>
                      <div className="faculty-card-fields">
                        <input type="text" placeholder="Name" value={member.name} onChange={(e) => {
                          const updated = [...form.officeTeam];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          handleChange('officeTeam', updated);
                        }} />
                        <input type="text" placeholder="Designation" value={member.designation} onChange={(e) => {
                          const updated = [...form.officeTeam];
                          updated[idx] = { ...updated[idx], designation: e.target.value };
                          handleChange('officeTeam', updated);
                        }} />
                        <input type="text" placeholder="Qualification" value={member.qual} onChange={(e) => {
                          const updated = [...form.officeTeam];
                          updated[idx] = { ...updated[idx], qual: e.target.value };
                          handleChange('officeTeam', updated);
                        }} />
                        <input type="text" placeholder="Email" value={member.email} onChange={(e) => {
                          const updated = [...form.officeTeam];
                          updated[idx] = { ...updated[idx], email: e.target.value };
                          handleChange('officeTeam', updated);
                        }} />
                      </div>
                    </div>
                  ))}
                  {/* Add new team member card */}
                  <div className="faculty-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderStyle: 'dashed', minHeight: '320px' }} onClick={addTeamMember}>
                    <div style={{ fontSize: '36px', color: '#bbb', marginBottom: '8px' }}>+</div>
                    <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>Add Team Member</p>
                  </div>
                </div>
              </>
            )}

            {/* Process - Preview/Edit */}
            {activeTab === 'process' && (
              <>
                {view === 'preview' ? (
                  /* Preview */
                  <>
                    <h4 style={{ margin: '0 0 6px', color: '#243358', fontSize: '15px' }}>Process Steps</h4>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Preview of how steps appear on the live website.</p>
                    <div className="process-steps" style={{ marginTop: '12px' }}>
                      {form.steps.map((step, i) => (
                        <div className="process-step" key={i}>
                          <div className="step-number">{i + 1}</div>
                          <div className="step-content">
                            <h4>{step.title || 'Untitled'}</h4>
                            {step.desc && <p>{step.desc}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    {form.steps.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic' }}>No steps added yet.</p>}
                  </>
                ) : (
                  /* Edit mode */
                  <>
                    <h4 style={{ margin: '0 0 6px', color: '#243358', fontSize: '15px' }}>Process Steps</h4>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Click a step to edit it.</p>
                    <div className="process-steps" style={{ marginTop: '12px' }}>
                      {form.steps.map((step, i) => (
                        <div className="process-step" key={i}>
                          <div className="step-number" style={{ cursor: 'default' }}>{i + 1}</div>
                          <div className="step-content" style={{ flex: 1 }}>
                            {editingStepIdx === i ? (
                              <>
                                <input autoFocus type="text" value={step.title} onChange={(e) => { const u = [...form.steps]; u[i] = { ...u[i], title: e.target.value }; handleChange('steps', u); }} placeholder="Step title" style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }} />
                                <textarea value={step.desc} onChange={(e) => { const u = [...form.steps]; u[i] = { ...u[i], desc: e.target.value }; handleChange('steps', u); }} placeholder="Description" rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }} />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button className="btn btn-success btn-sm" onClick={() => setEditingStepIdx(null)}>Done</button>
                                  <button onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Remove</button>
                                </div>
                              </>
                            ) : (
                              <div onClick={() => setEditingStepIdx(i)} style={{ cursor: 'pointer' }}>
                                <h4>{step.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled</em>}</h4>
                                {step.desc && <p>{step.desc}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-success btn-sm" style={{ marginTop: '12px' }} onClick={() => { const ns = [...form.steps, { title: '', desc: '' }]; handleChange('steps', ns); setEditingStepIdx(ns.length - 1); }}>+ Add Step</button>
                  </>
                )}
              </>
            )}

            {/* Records - Preview/Edit */}
            {activeTab === 'records' && (
              <>
                {view === 'preview' ? (
                  /* Preview */
                  <>
                    <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Placement Records</h4>
                    <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Preview of how records appear on the live website.</p>

                    {/* Record Table Preview */}
                    {form.recordTable.length > 0 && (
                      <div className="fee-table-wrap" style={{ marginBottom: '24px' }}>
                        <table className="fee-table">
                          <thead><tr><th style={{ width: 60 }}>Sr.</th><th>Academic Year</th><th style={{ width: 160, textAlign: 'center' }}>Actions</th></tr></thead>
                          <tbody>
                            {form.recordTable.map((rec, i) => (
                              <tr key={i}>
                                <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                                <td className="fee-particular" style={{ fontWeight: 600 }}>{rec.year}</td>
                                <td style={{ textAlign: 'center' }}>
                                  {rec.pdfUrl ? (
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                      <a href={`/api/pdf-proxy?url=${encodeURIComponent(rec.pdfUrl)}`} target="_blank" style={{ padding: '5px 14px', background: '#243358', color: '#fff', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>View</a>
                                      <a href={`/api/pdf-proxy?url=${encodeURIComponent(rec.pdfUrl)}`} download style={{ padding: '5px 14px', background: '#fff', color: '#243358', border: '1px solid #243358', borderRadius: '4px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>Download</a>
                                    </div>
                                  ) : <span style={{ color: '#ccc' }}>No PDF</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Record Images Preview */}
                    {form.recordImages.length > 0 && (
                      <div style={{ marginTop: '24px' }}>
                        <h4 style={{ margin: '0 0 16px', color: '#243358', fontSize: '15px' }}>Record Gallery</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                          {form.recordImages.map((img, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                              {img.imageUrl && (
                                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e4e8ed', marginBottom: '12px' }}>
                                  <img src={img.imageUrl} alt={img.title || 'Record'} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                              )}
                              {img.title && <p style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#243358', margin: 0 }}>{img.title}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {form.recordTable.length === 0 && form.recordImages.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic' }}>No records added yet.</p>}
                  </>
                ) : (
                  /* Edit mode */
                  <>
                    <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Record Table</h4>
                    {form.recordTable.map((row, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', background: '#f8f9fb', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '10px 12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#243358', minWidth: '30px' }}>{i + 1}.</span>
                        <input type="text" value={row.year} onChange={(e) => { const u = [...form.recordTable]; u[i] = { ...u[i], year: e.target.value }; handleChange('recordTable', u); }} placeholder="Year" style={{ width: '140px', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
                        <div style={{ flex: 1 }}><PdfUpload value={row.pdfUrl} onChange={(url) => { const u = [...form.recordTable]; u[i] = { ...u[i], pdfUrl: url }; handleChange('recordTable', u); }} compact /></div>
                        <button className="member-remove-btn" onClick={() => handleChange('recordTable', form.recordTable.filter((_, j) => j !== i))}>×</button>
                      </div>
                    ))}
                    <button className="btn btn-success btn-sm" style={{ marginBottom: '20px' }} onClick={() => handleChange('recordTable', [...form.recordTable, { year: '', pdfUrl: '' }])}>+ Add Row</button>

                    <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                    <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Record Images</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                      {form.recordImages.map((img, i) => (
                        <div key={i} style={{ background: '#f8f9fb', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '12px', position: 'relative' }}>
                          <button className="member-remove-btn" onClick={() => handleChange('recordImages', form.recordImages.filter((_, j) => j !== i))} style={{ position: 'absolute', top: '8px', right: '8px' }}>×</button>
                          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <ImageUpload value={img.imageUrl} onChange={(url) => { const u = [...form.recordImages]; u[i] = { ...u[i], imageUrl: url }; handleChange('recordImages', u); }} placeholder="Image" />
                          </div>
                          <input type="text" value={img.title} onChange={(e) => { const u = [...form.recordImages]; u[i] = { ...u[i], title: e.target.value }; handleChange('recordImages', u); }} placeholder="Title (e.g. 2020)" style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box', textAlign: 'center' }} />
                        </div>
                      ))}
                      <div onClick={() => handleChange('recordImages', [...form.recordImages, { imageUrl: '', title: '' }])} style={{ background: '#fff', border: '2px dashed #d7dde6', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '180px' }}>
                        <span style={{ fontSize: '32px', color: '#bbb', marginBottom: '6px' }}>+</span>
                        <span style={{ fontSize: '12px', color: '#999' }}>Add Image</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Recruiters */}
            {activeTab === 'recruiters' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Our Recruiters</h4>
                <div className="faculty-cards-grid">
                  {/* Add new recruiter card first */}
                  <div className="faculty-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderStyle: 'dashed', minHeight: '180px' }} onClick={addRecruiter}>
                    <div style={{ fontSize: '36px', color: '#bbb', marginBottom: '8px' }}>+</div>
                    <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>Add Recruiter</p>
                  </div>
                  {/* Existing recruiter cards */}
                  {form.recruiters.map((rec, idx) => (
                    <div key={idx} className="faculty-card">
                      <button type="button" className="faculty-card-remove" onClick={() => removeRecruiter(idx)} title="Remove">
                        ✕
                      </button>
                      <div className="faculty-card-img" style={{ height: '80px', overflow: 'hidden' }}>
                        {rec.logoUrl ? (
                          <img
                            src={rec.logoUrl}
                            alt={rec.name}
                            style={{ width: '100%', height: '80px', objectFit: 'contain', display: 'block' }}
                          />
                        ) : (
                          <ImageUpload
                            value={rec.logoUrl}
                            onChange={(url) => {
                              const updated = [...form.recruiters];
                              updated[idx] = { ...updated[idx], logoUrl: url };
                              handleChange('recruiters', updated);
                            }}
                            label=""
                            placeholder="Logo"
                          />
                        )}
                      </div>
                      <div className="faculty-card-fields">
                        <input type="text" placeholder="Company Name" value={rec.name} onChange={(e) => {
                          const updated = [...form.recruiters];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          handleChange('recruiters', updated);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
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
                      steps: sections[activeTab].steps || [],
                      records: sections[activeTab].records || [],
                      recordTable: sections[activeTab].recordTable || [],
                      recordImages: sections[activeTab].recordImages || [],
                      recruiters: sections[activeTab].recruiters || [],
                      officerName: sections[activeTab].officerName || '',
                      officerPhoto: sections[activeTab].officerPhoto || '',
                      officerQual: sections[activeTab].officerQual || '',
                      officerMsg: sections[activeTab].officerMsg || '',
                      officeTeam: sections[activeTab].officeTeam || [],
                      active: sections[activeTab].active !== false,
                    });
                  } else {
                    setForm({ ...defaultSection });
                  }
                  setMsg(null);
                  resetInputs();
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

export default AdminPlacements;
