import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';
import PdfUpload from '../components/PdfUpload';

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
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Placements</h1>
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
            <h3>{activeTab === 'records' ? 'Placement Records' : activeTab === 'about' ? 'Placement Officer & Team' : activeTab === 'process' ? 'Placement Process Steps' : 'Section Content'}</h3>
            {sections[activeTab] && (
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            )}
          </div>
          <div className="admin-card-body">
            {/* Title - hidden for records, about, and process */}
            {activeTab !== 'records' && activeTab !== 'about' && activeTab !== 'process' && (
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

            {/* Content - hidden for records, about, and process */}
            {activeTab !== 'records' && activeTab !== 'about' && activeTab !== 'process' && (
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

            {/* Placement Officer - only for About section */}
            {activeTab === 'about' && (
              <>
                <div className="dept-form-card">
                  <div className="dept-form-card-header">
                    <div className="dept-form-card-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <h3>Placement Officer</h3>
                      <p>Officer photo, name, qualification and message</p>
                    </div>
                  </div>
                  <div className="dept-form-card-body">
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                      {/* Left: Photo, Name, Qualification */}
                      <div style={{ flex: '0 0 240px', textAlign: 'center' }}>
                        <div className="form-group">
                          <label>Photo</label>
                          <ImageUpload
                            value={form.officerPhoto}
                            onChange={(url) => handleChange('officerPhoto', url)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Officer Name</label>
                          <input
                            type="text"
                            value={form.officerName}
                            onChange={(e) => handleChange('officerName', e.target.value)}
                            placeholder="e.g. Mr. Sunil Pawar"
                          />
                        </div>
                        <div className="form-group">
                          <label>Qualification</label>
                          <input
                            type="text"
                            value={form.officerQual}
                            onChange={(e) => handleChange('officerQual', e.target.value)}
                            placeholder="e.g. M.E. Mechanical"
                          />
                        </div>
                      </div>
                      {/* Right: Message */}
                      <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
                        <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <label>Message from Placement Officer</label>
                          <textarea
                            value={form.officerMsg}
                            onChange={(e) => handleChange('officerMsg', e.target.value)}
                            placeholder="Write a message from the placement officer..."
                            style={{ flex: 1, width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', minHeight: '180px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

            {/* Process - Steps */}
            {activeTab === 'process' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 6px', color: '#243358', fontSize: '15px' }}>Process Steps</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Shown exactly like the live website — click a step to edit it.</p>

                {/* Steps list */}
                <div className="process-steps" style={{ marginTop: '12px' }}>
                  {form.steps.map((step, i) => (
                    <div className="process-step" key={i}>
                      <div className="step-number" style={{ cursor: 'default' }}>
                        {i + 1}
                      </div>
                      <div className="step-content" style={{ flex: 1 }}>
                        {editingStepIdx === i ? (
                          <>
                            <input
                              autoFocus
                              type="text"
                              value={step.title}
                              onChange={(e) => {
                                const updated = [...form.steps];
                                updated[i] = { ...updated[i], title: e.target.value };
                                handleChange('steps', updated);
                              }}
                              placeholder="Step title"
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }}
                            />
                            <textarea
                              value={step.desc}
                              onChange={(e) => {
                                const updated = [...form.steps];
                                updated[i] = { ...updated[i], desc: e.target.value };
                                handleChange('steps', updated);
                              }}
                              placeholder="Step description (optional)"
                              rows={2}
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button className="btn btn-success btn-sm" onClick={() => setEditingStepIdx(null)}>Done</button>
                              <button
                                onClick={() => removeStep(i)}
                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <div onClick={() => setEditingStepIdx(i)} title="Click to edit" style={{ cursor: 'pointer' }}>
                            <h4>{step.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled step</em>}</h4>
                            {step.desc && <p>{step.desc}</p>}
                            {!step.desc && <p style={{ fontStyle: 'italic', color: '#aaa' }}>No description</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Step button */}
                <div
                  onClick={() => {
                    const newSteps = [...form.steps, { title: '', desc: '' }];
                    handleChange('steps', newSteps);
                    setEditingStepIdx(newSteps.length - 1);
                  }}
                  title="Add Step"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px', marginTop: '14px' }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Step
                </div>
              </>
            )}

            {/* Records - Table + Images */}
            {activeTab === 'records' && (
              <>
                {/* Record Table */}
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Record Table</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Add placement record years with PDF links for view/download.</p>

                {form.recordTable.map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', background: '#f8f9fb', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '10px 12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#243358', minWidth: '30px' }}>{i + 1}.</span>
                    <input
                      type="text"
                      value={row.year}
                      onChange={(e) => {
                        const updated = [...form.recordTable];
                        updated[i] = { ...updated[i], year: e.target.value };
                        handleChange('recordTable', updated);
                      }}
                      placeholder="Year (e.g. 2023-24)"
                      style={{ width: '140px', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                    <div style={{ flex: 1 }}>
                      <PdfUpload
                        value={row.pdfUrl}
                        onChange={(url) => {
                          const updated = [...form.recordTable];
                          updated[i] = { ...updated[i], pdfUrl: url };
                          handleChange('recordTable', updated);
                        }}
                        compact
                        label="Upload PDF"
                      />
                    </div>
                    <button
                      className="member-remove-btn"
                      title="Remove"
                      onClick={() => handleChange('recordTable', form.recordTable.filter((_, j) => j !== i))}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => handleChange('recordTable', [...form.recordTable, { year: '', pdfUrl: '' }])}
                  title="Add Row"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px', marginBottom: '20px' }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Row
                </div>

                {/* Record Images */}
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Record Images</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Add placement record images with title (e.g. 2020, 2021).</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                  {form.recordImages.map((img, i) => (
                    <div key={i} style={{ background: '#f8f9fb', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '12px', position: 'relative' }}>
                      <button
                        className="member-remove-btn"
                        title="Remove"
                        onClick={() => handleChange('recordImages', form.recordImages.filter((_, j) => j !== i))}
                        style={{ position: 'absolute', top: '8px', right: '8px' }}
                      >
                        ×
                      </button>
                      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <ImageUpload
                          value={img.imageUrl}
                          onChange={(url) => {
                            const updated = [...form.recordImages];
                            updated[i] = { ...updated[i], imageUrl: url };
                            handleChange('recordImages', updated);
                          }}
                          label=""
                          placeholder="Image"
                        />
                      </div>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => {
                          const updated = [...form.recordImages];
                          updated[i] = { ...updated[i], title: e.target.value };
                          handleChange('recordImages', updated);
                        }}
                        placeholder="Title (e.g. 2020)"
                        style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box', textAlign: 'center' }}
                      />
                    </div>
                  ))}
                  {/* Add new image card */}
                  <div
                    onClick={() => handleChange('recordImages', [...form.recordImages, { imageUrl: '', title: '' }])}
                    style={{ background: '#fff', border: '2px dashed #d7dde6', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '180px' }}
                  >
                    <span style={{ fontSize: '32px', color: '#bbb', marginBottom: '6px' }}>+</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>Add Image</span>
                  </div>
                </div>
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
                      <div className="faculty-card-img">
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
