import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';

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
                rows={6}
                placeholder="Write the main content here..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

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
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Process Steps</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={newStepTitle} onChange={(e) => setNewStepTitle(e.target.value)} placeholder="Step title" style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                  <input type="text" value={newStepDesc} onChange={(e) => setNewStepDesc(e.target.value)} placeholder="Step description" style={{ flex: 2, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                  <button className="btn btn-primary btn-sm" onClick={addStep}>Add</button>
                </div>
                {form.steps.length > 0 && (
                  <div style={{ background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px', padding: '8px' }}>
                    {form.steps.map((step, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: i < form.steps.length - 1 ? '1px solid #eee' : 'none' }}>
                        <span style={{ fontSize: '13px', color: '#444' }}><strong>Step {i + 1}:</strong> {step.title} {step.desc && `- ${step.desc}`}</span>
                        <button onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '16px' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Records */}
            {activeTab === 'records' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Placement Records</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <input type="text" value={newRecYear} onChange={(e) => setNewRecYear(e.target.value)} placeholder="Year" style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                  <input type="text" value={newRecPlaced} onChange={(e) => setNewRecPlaced(e.target.value)} placeholder="Students Placed" style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                  <input type="text" value={newRecCompanies} onChange={(e) => setNewRecCompanies(e.target.value)} placeholder="Companies Visited" style={{ flex: 2, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                  <button className="btn btn-primary btn-sm" onClick={addRecord}>Add</button>
                </div>
                {form.records.length > 0 && (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th style={{ width: 50 }}>Sr.</th>
                          <th>Year</th>
                          <th>Students Placed</th>
                          <th>Companies Visited</th>
                          <th style={{ width: 50 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {form.records.map((rec, i) => (
                          <tr key={i}>
                            <td style={{ textAlign: 'center' }}>{i + 1}</td>
                            <td>{rec.year}</td>
                            <td>{rec.placed}</td>
                            <td>{rec.companies}</td>
                            <td style={{ textAlign: 'center' }}>
                              <button onClick={() => removeRecord(i)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '16px' }}>×</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
