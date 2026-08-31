import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import ImageUpload from '../components/ImageUpload';
import PdfUpload from '../components/PdfUpload';
import './Admin.css';

const API_URL = '/api';

const emptyForm = {
  name: '',
  slug: '',
  image: '',
  intake: 60,
  directSecond: true,
  about: '',
  vision: '',
  mission: '',
  hod: '',
  hodImage: '',
  hodQual: '',
  hodMsg: '',
  faculty: [],
  labs: [],
  infrastructure: [],
  curriculum: [],
  peos: [],
  pos: [],
  psos: [],
  cos: [],
  deptNotices: [],
  deptEvents: [],
  deptTimetable: [],
  order: 0,
};

const years = ['1st Year', '2nd Year', '3rd Year'];
const semestersByYear = { '1st Year': [1, 2], '2nd Year': [3, 4], '3rd Year': [5, 6] };

function getNextSemester(curriculum, year) {
  const yearSems = curriculum.filter((c) => c.year === year);
  return yearSems.length > 0 ? Math.max(...yearSems.map((c) => c.semester)) + 1 : (year === '1st Year' ? 1 : year === '2nd Year' ? 3 : 5);
}

function AdminDepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isEdit) fetchDept();
  }, [id]);

  const fetchDept = async () => {
    try {
      const res = await fetch(`${API_URL}/departments`);
      const depts = await res.json();
      const dept = depts.find((d) => d._id === id);
      if (dept) {
        setForm({
          name: dept.name || '',
          slug: dept.slug || '',
          image: dept.image || '',
          intake: dept.intake || 60,
          directSecond: dept.directSecond ?? true,
          about: dept.about || '',
          vision: dept.vision || '',
          mission: Array.isArray(dept.mission) ? dept.mission.join('\n') : '',
          hod: dept.hod || '',
          hodImage: dept.hodImage || '',
          hodQual: dept.hodQual || '',
          hodMsg: dept.hodMsg || '',
          faculty: dept.faculty || [],
          labs: [...(dept.labs || []), ...(dept.infrastructure || [])],
          infrastructure: [],
          curriculum: dept.curriculum || [],
          peos: dept.peos || [],
          pos: dept.pos || [],
          psos: dept.psos || [],
          cos: dept.cos || [],
          deptNotices: dept.deptNotices || [],
          deptEvents: dept.deptEvents || [],
          deptTimetable: dept.deptTimetable || [],
          order: dept.order || 0,
        });
      } else {
        setMessage({ type: 'error', text: 'Department not found' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load department' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm((prev) => ({ ...prev, name, slug }));
  };

  // Faculty management
  const addFaculty = () => {
    setForm((prev) => ({ ...prev, faculty: [...prev.faculty, { name: '', designation: '', qual: '', exp: '', expYear: new Date().getFullYear(), email: '', image: '' }] }));
  };
  const updateFaculty = (idx, field, val) => {
    setForm((prev) => {
      const f = [...prev.faculty];
      f[idx] = { ...f[idx], [field]: val };
      return { ...prev, faculty: f };
    });
  };
  const removeFaculty = (idx) => {
    setForm((prev) => ({ ...prev, faculty: prev.faculty.filter((_, i) => i !== idx) }));
  };

  // Labs management (combined Infrastructure section)
  const addLab = () => {
    setForm((prev) => ({ ...prev, labs: [...prev.labs, { name: '', image: '' }] }));
  };
  const updateLab = (idx, field, val) => {
    setForm((prev) => {
      const l = [...prev.labs];
      l[idx] = { ...l[idx], [field]: val };
      return { ...prev, labs: l };
    });
  };
  const removeLab = (idx) => {
    setForm((prev) => ({ ...prev, labs: prev.labs.filter((_, i) => i !== idx) }));
  };

  // Curriculum management
  const curriculumEndRef = useRef(null);
  const addSubject = () => {
    setForm((prev) => ({
      ...prev,
      curriculum: [...prev.curriculum, { year: '1st Year', semester: 1, name: '', url: '' }],
    }));
    setTimeout(() => {
      curriculumEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };
  const updateCurriculum = (idx, field, val) => {
    setForm((prev) => {
      const curr = [...prev.curriculum];
      curr[idx] = { ...curr[idx], [field]: val };
      if (field === 'year') {
        curr[idx].semester = semestersByYear[val]?.[0] || 1;
      }
      return { ...prev, curriculum: curr };
    });
  };
  const removeSubject = (idx) => {
    setForm((prev) => ({ ...prev, curriculum: prev.curriculum.filter((_, i) => i !== idx) }));
  };

  // OBE management
  const addObeItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], { title: '', description: '' }] }));
  };
  const updateObeItem = (field, idx, subField, val) => {
    setForm((prev) => {
      const items = [...prev[field]];
      items[idx] = { ...items[idx], [subField]: val };
      return { ...prev, [field]: items };
    });
  };
  const removeObeItem = (field, idx) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  // Department Notices management
  const addDeptNotice = () => {
    setForm((prev) => ({ ...prev, deptNotices: [...prev.deptNotices, { title: '', url: '' }] }));
  };
  const updateDeptNotice = (idx, field, val) => {
    setForm((prev) => {
      const n = [...prev.deptNotices];
      n[idx] = { ...n[idx], [field]: val };
      return { ...prev, deptNotices: n };
    });
  };
  const removeDeptNotice = (idx) => {
    setForm((prev) => ({ ...prev, deptNotices: prev.deptNotices.filter((_, i) => i !== idx) }));
  };

  // Department Events management
  const addDeptEvent = () => {
    setForm((prev) => ({ ...prev, deptEvents: [...prev.deptEvents, { title: '', description: '', images: [] }] }));
  };
  const updateDeptEvent = (idx, field, val) => {
    setForm((prev) => {
      const e = [...prev.deptEvents];
      e[idx] = { ...e[idx], [field]: val };
      return { ...prev, deptEvents: e };
    });
  };
  const addEventImage = (idx) => {
    setForm((prev) => {
      const e = [...prev.deptEvents];
      e[idx] = { ...e[idx], images: [...(e[idx].images || []), ''] };
      return { ...prev, deptEvents: e };
    });
  };
  const updateEventImage = (eventIdx, imgIdx, val) => {
    setForm((prev) => {
      const e = [...prev.deptEvents];
      const imgs = [...(e[eventIdx].images || [])];
      imgs[imgIdx] = val;
      e[eventIdx] = { ...e[eventIdx], images: imgs };
      return { ...prev, deptEvents: e };
    });
  };
  const removeEventImage = (eventIdx, imgIdx) => {
    setForm((prev) => {
      const e = [...prev.deptEvents];
      e[eventIdx] = { ...e[eventIdx], images: (e[eventIdx].images || []).filter((_, i) => i !== imgIdx) };
      return { ...prev, deptEvents: e };
    });
  };
  const removeDeptEvent = (idx) => {
    setForm((prev) => ({ ...prev, deptEvents: prev.deptEvents.filter((_, i) => i !== idx) }));
  };

  // Department Timetable management
  const addTimetableEntry = (year) => {
    setForm((prev) => ({ ...prev, deptTimetable: [...prev.deptTimetable, { year, title: '', url: '' }] }));
  };
  const updateTimetableEntry = (idx, field, val) => {
    setForm((prev) => {
      const t = [...prev.deptTimetable];
      t[idx] = { ...t[idx], [field]: val };
      return { ...prev, deptTimetable: t };
    });
  };
  const removeTimetableEntry = (idx) => {
    setForm((prev) => ({ ...prev, deptTimetable: prev.deptTimetable.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const url = isEdit ? `${API_URL}/departments/${id}` : `${API_URL}/departments`;
      const method = isEdit ? 'PUT' : 'POST';

      const data = {
        ...form,
        mission: form.mission.split('\n').filter((m) => m.trim()),
        curriculum: form.curriculum.filter((s) => s.name.trim()),
        peos: form.peos.filter((p) => p.title.trim() || p.description.trim()),
        pos: form.pos.filter((p) => p.title.trim() || p.description.trim()),
        psos: form.psos.filter((p) => p.title.trim() || p.description.trim()),
        cos: form.cos.filter((p) => p.title.trim() || p.description.trim()),
        deptNotices: form.deptNotices.filter((n) => n.title.trim()),
        deptEvents: form.deptEvents.filter((e) => e.title.trim()),
        deptTimetable: form.deptTimetable.filter((t) => t.title.trim()),
        faculty: form.faculty.filter((f) => f.name.trim()),
        labs: form.labs.filter((l) => l.name.trim()),
        infrastructure: [],
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: isEdit ? 'Department updated!' : 'Department created!' });
        setTimeout(() => navigate('/admin/departments'), 1000);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Is the server running?' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-topbar"><h1>Loading...</h1></div>
        <div className="admin-content"><p>Loading...</p></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>{isEdit ? 'Edit Department' : 'Add New Department'}</h1>
      </div>
      <div className="admin-content">
        <AdminAlert type={message?.type} message={message} onDismiss={() => setMessage(null)} />

        {/* Live Preview */}
        <div className="live-preview">
          <div className="live-preview-header">Live Preview</div>
          <div className="preview-cell-card">
            {form.image && (
              <div style={{ marginBottom: '12px', borderRadius: '6px', overflow: 'hidden', height: '160px' }}>
                <img src={form.image} alt={form.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <h3 className="preview-cell-name">{form.name || 'Department Name'}</h3>
            <p className="preview-cell-desc">{form.about || 'About section will appear here...'}</p>
            {form.hod && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#F2E5E8', borderRadius: '4px' }}>
                <strong>HOD:</strong> {form.hod} {form.hodQual && `(${form.hodQual})`}
              </div>
            )}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#666' }}>Intake: {form.intake}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>Faculty: {form.faculty.filter(f => f.name.trim()).length}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>Infrastructure: {form.labs.filter(l => l.name.trim()).length}</span>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <AdminTabs
          tabs={[
            { key: 'basic', label: 'Basic Info' },
            { key: 'vision', label: 'Vision & Mission' },
            { key: 'hod', label: 'HOD' },
            { key: 'faculty', label: 'Faculty' },
            { key: 'infrastructure', label: 'Infrastructure' },
            { key: 'curriculum', label: 'Curriculum' },
            { key: 'obe', label: 'OBE' },
            { key: 'notices', label: 'Notices' },
            { key: 'events', label: 'Events' },
            { key: 'timetable', label: 'Timetable' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Form */}
        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Card 1: Basic Info */}
          {activeTab === 'basic' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div>
                <h3>Basic Information</h3>
                <p>Department name, image, and description</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              <div className="form-group">
                <label>Department Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleNameChange} placeholder="e.g. Computer Engineering" required />
              </div>
              <div className="form-group">
                <label>Slug (auto-generated)</label>
                <input type="text" name="slug" value={form.slug} onChange={handleChange} />
              </div>
              <div className="form-group">
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                  label="Department Image"
                  placeholder="Upload department image..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Intake</label>
                  <input type="number" name="intake" value={form.intake} onChange={handleChange} min={0} />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} min={0} />
                </div>
              </div>
              <div className="form-group">
                <label>Direct 2nd Year Admission</label>
                <div className="toggle-row">
                  <button
                    type="button"
                    className={`toggle-switch ${form.directSecond ? 'active' : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, directSecond: !prev.directSecond }))}
                  >
                    <span className="toggle-knob"></span>
                  </button>
                  <span className="toggle-label">{form.directSecond ? 'Available' : 'Not Available'}</span>
                </div>
              </div>
              <div className="form-group">
                <label>About</label>
                <textarea name="about" value={form.about} onChange={handleChange} placeholder="About the department..." rows={4} />
              </div>
            </div>
          </div>
          )}

          {/* Vision & Mission */}
          {activeTab === 'vision' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <div>
                <h3>Vision & Mission</h3>
                <p>Department vision and mission statements</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              <div className="form-group">
                <label>Vision</label>
                <textarea name="vision" value={form.vision} onChange={handleChange} placeholder="Department vision..." rows={2} />
              </div>
              <div className="form-group">
                <label>Mission (one per line)</label>
                <textarea name="mission" value={form.mission} onChange={handleChange} placeholder="Mission point 1\nMission point 2\nMission point 3" rows={4} />
              </div>
            </div>
          </div>
          )}

          {/* Card 2: HOD Details */}
          {activeTab === 'hod' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <h3>HOD Details</h3>
                <p>Head of Department information</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>HOD Name</label>
                  <input type="text" name="hod" value={form.hod} onChange={handleChange} placeholder="HOD name" />
                </div>
                <div className="form-group">
                  <label>HOD Qualification</label>
                  <input type="text" name="hodQual" value={form.hodQual} onChange={handleChange} placeholder="e.g. M.E. Computer" />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ImageUpload
                  value={form.hodImage}
                  onChange={(url) => setForm((prev) => ({ ...prev, hodImage: url }))}
                  label="HOD Photo"
                  placeholder="Upload HOD photo..."
                  circle
                />
              </div>
              <div className="form-group">
                <label>HOD Message</label>
                <textarea name="hodMsg" value={form.hodMsg} onChange={handleChange} placeholder="HOD's welcome message...\n(Use Enter for line breaks)" rows={5} />
              </div>
            </div>
          </div>
          )}

          {/* Card 3: Faculty Members */}
          {activeTab === 'faculty' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h3>Faculty Members</h3>
                <p>Add and manage faculty details</p>
              </div>
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addFaculty}>+ Add Faculty</button>
            </div>
            <div className="dept-form-card-body">
              {form.faculty.length === 0 ? (
                <div className="members-empty">No faculty added yet. Click "+ Add Faculty" to add one.</div>
              ) : (
                <div className="faculty-cards-grid">
                  {form.faculty.map((f, idx) => (
                    <div key={idx} className="faculty-card">
                      <button type="button" className="faculty-card-remove" onClick={() => removeFaculty(idx)} title="Remove">
                        ✕
                      </button>
                      <div className="faculty-card-img">
                        <ImageUpload
                          value={f.image}
                          onChange={(url) => updateFaculty(idx, 'image', url)}
                          label=""
                          placeholder="Photo"
                          circle
                        />
                      </div>
                      <div className="faculty-card-fields">
                        <input type="text" placeholder="Name" value={f.name} onChange={(e) => updateFaculty(idx, 'name', e.target.value)} />
                        <input type="text" placeholder="Designation" value={f.designation} onChange={(e) => updateFaculty(idx, 'designation', e.target.value)} />
                        <input type="text" placeholder="Qualification" value={f.qual} onChange={(e) => updateFaculty(idx, 'qual', e.target.value)} />
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input type="text" placeholder="Experience (e.g. 5)" value={f.exp} onChange={(e) => {
                            updateFaculty(idx, 'exp', e.target.value);
                            updateFaculty(idx, 'expYear', new Date().getFullYear());
                          }} style={{ flex: 1 }} />
                          <input type="number" placeholder="Year" value={f.expYear || new Date().getFullYear()} onChange={(e) => updateFaculty(idx, 'expYear', Number(e.target.value))} style={{ width: '70px' }} title="Year experience was last updated" />
                        </div>
                        <input type="text" placeholder="Email" value={f.email} onChange={(e) => updateFaculty(idx, 'email', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Card 4: Infrastructure (Labs + Facilities) */}
          {activeTab === 'infrastructure' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="22" height="12" rx="2" ry="2"/><line x1="1" y1="12" x2="23" y2="12"/></svg>
              </div>
              <div>
                <h3>Infrastructure</h3>
                <p>Laboratories and department facilities</p>
              </div>
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addLab}>+ Add Item</button>
            </div>
            <div className="dept-form-card-body">
              {form.labs.length === 0 ? (
                <div className="members-empty">No items added yet. Click "+ Add Item" to add one.</div>
              ) : (
                <div className="labs-items-grid">
                  {form.labs.map((l, idx) => (
                    <div key={idx} className="lab-item-card">
                      <button type="button" className="lab-item-remove" onClick={() => removeLab(idx)} title="Remove">✕</button>
                      <div className="lab-item-img">
                        <ImageUpload
                          value={l.image}
                          onChange={(url) => updateLab(idx, 'image', url)}
                          label=""
                          placeholder="Photo"
                        />
                      </div>
                      <input type="text" placeholder="Item Name (e.g. CAD Lab)" value={l.name} onChange={(e) => updateLab(idx, 'name', e.target.value)} className="lab-item-input" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Card 6: Curriculum / Syllabus */}
          {activeTab === 'curriculum' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div>
                <h3>Curriculum / Syllabus</h3>
                <p>Add subjects with a PDF link or website link</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              {form.curriculum.length === 0 ? (
                <div className="members-empty">No subjects added yet. Click "+ Add Subject" to add one.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {form.curriculum.map((item, idx) => (
                    <div key={idx} className="curriculum-sem-card">
                      <div className="curriculum-item-row">
                        <select value={item.year} onChange={(e) => updateCurriculum(idx, 'year', e.target.value)} className="curriculum-select">
                          {years.map((y) => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select value={item.semester} onChange={(e) => updateCurriculum(idx, 'semester', Number(e.target.value))} className="curriculum-select">
                          {(semestersByYear[item.year] || [1, 2]).map((s) => <option key={s} value={s}>Sem {s}</option>)}
                        </select>
                        <input type="text" placeholder="Subject name" value={item.name} onChange={(e) => updateCurriculum(idx, 'name', e.target.value)} className="curriculum-input" />
                        <PdfUpload value={item.url} onChange={(url) => updateCurriculum(idx, 'url', url)} />
                        <button type="button" className="btn btn-danger btn-sm curriculum-remove-btn" onClick={() => removeSubject(idx)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '12px' }}>
                <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addSubject}>+ Add Subject</button>
              </div>
              <div ref={curriculumEndRef} />
            </div>
          </div>
          )}

          {/* Card 5: Outcome Based Education */}
          {activeTab === 'obe' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div>
                <h3>Outcome Based Education</h3>
                <p>PEOs, POs, PSOs, and COs</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              {['peos', 'pos', 'psos', 'cos'].map((field) => {
                const labels = { peos: 'PEOs', pos: 'POs', psos: 'PSOs', cos: 'COs' };
                return (
                  <div key={field} style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px', fontFamily: "'Georgia', serif", fontSize: '16px', color: '#243358', borderBottom: '2px solid #c8963e', paddingBottom: '6px' }}>{labels[field]}</h4>
                    {form[field].length === 0 ? (
                      <div className="members-empty">No {labels[field]} added yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {form[field].map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px', background: '#f8f9fb', borderRadius: '6px', border: '1px solid #e4e8ed' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', height: '28px', background: '#243358', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '4px', flexShrink: 0 }}>{labels[field].slice(0, -1)} {idx + 1}</span>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <input type="text" placeholder="Title (optional)" value={item.title} onChange={(e) => updateObeItem(field, idx, 'title', e.target.value)} style={{ padding: '7px 10px', border: '1px solid #e4e8ed', borderRadius: '4px', fontSize: '13px' }} />
                              <textarea placeholder="Description" value={item.description} onChange={(e) => updateObeItem(field, idx, 'description', e.target.value)} rows={2} style={{ padding: '7px 10px', border: '1px solid #e4e8ed', borderRadius: '4px', fontSize: '13px', resize: 'vertical' }} />
                            </div>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeObeItem(field, idx)} style={{ flexShrink: 0, padding: '4px 8px' }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={() => addObeItem(field)} style={{ marginTop: '8px' }}>+ Add {labels[field].slice(0, -1)}</button>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* Card 7: Department Notices */}
          {activeTab === 'notices' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div>
                <h3>Department Notices</h3>
                <p>Notices specific to this department</p>
              </div>
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addDeptNotice}>+ Add Notice</button>
            </div>
            <div className="dept-form-card-body">
              {form.deptNotices.length === 0 ? (
                <div className="members-empty">No notices added yet. Click "+ Add Notice" to add one.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {form.deptNotices.map((notice, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#f8f9fb', borderRadius: '6px', border: '1px solid #e4e8ed' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '28px', background: '#243358', color: '#fff', fontSize: '12px', fontWeight: 700, borderRadius: '4px', flexShrink: 0 }}>{idx + 1}</span>
                      <input type="text" placeholder="Notice title" value={notice.title} onChange={(e) => updateDeptNotice(idx, 'title', e.target.value)} style={{ flex: 1, padding: '7px 10px', border: '1px solid #e4e8ed', borderRadius: '4px', fontSize: '13px' }} />
                      <PdfUpload value={notice.url} onChange={(url) => updateDeptNotice(idx, 'url', url)} />
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeDeptNotice(idx)} style={{ flexShrink: 0, padding: '4px 8px' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Card 8: Department Events & Activities */}
          {activeTab === 'events' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <h3>Events & Activities</h3>
                <p>Department events and activities</p>
              </div>
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addDeptEvent}>+ Add Event</button>
            </div>
            <div className="dept-form-card-body">
              {form.deptEvents.length === 0 ? (
                <div className="members-empty">No events added yet. Click "+ Add Event" to add one.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {form.deptEvents.map((event, idx) => (
                    <div key={idx} style={{ padding: '14px', background: '#f8f9fb', borderRadius: '8px', border: '1px solid #e4e8ed' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '28px', background: '#243358', color: '#fff', fontSize: '12px', fontWeight: 700, borderRadius: '4px', flexShrink: 0 }}>{idx + 1}</span>
                        <input type="text" placeholder="Event title" value={event.title} onChange={(e) => updateDeptEvent(idx, 'title', e.target.value)} style={{ flex: 1, padding: '7px 10px', border: '1px solid #e4e8ed', borderRadius: '4px', fontSize: '13px' }} />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeDeptEvent(idx)} style={{ flexShrink: 0, padding: '4px 8px' }}>✕</button>
                      </div>
                      <textarea placeholder="Description (optional)" value={event.description} onChange={(e) => updateDeptEvent(idx, 'description', e.target.value)} rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid #e4e8ed', borderRadius: '4px', fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }} />
                      {/* Multiple images */}
                      <div className="dept-event-images-grid">
                        {(event.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="dept-event-image-item">
                            <span className="dept-event-image-num">{imgIdx + 1}</span>
                            <div className="dept-event-image-upload">
                              <ImageUpload
                                value={img}
                                onChange={(url) => updateEventImage(idx, imgIdx, url)}
                                label=""
                                placeholder={`Image ${imgIdx + 1}`}
                              />
                            </div>
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEventImage(idx, imgIdx)} style={{ flexShrink: 0, padding: '3px 7px', fontSize: '11px' }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={() => addEventImage(idx)} style={{ marginTop: '8px' }}>+ Add Image</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Card 9: Department Timetable */}
          {activeTab === 'timetable' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <h3>Time Table</h3>
                <p>Add time tables for each year</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              {['1st Year', '2nd Year', '3rd Year'].map((yr) => {
                const items = form.deptTimetable.filter((t) => t.year === yr);
                const firstIdx = form.deptTimetable.findIndex((t) => t.year === yr);
                return (
                  <div key={yr} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: '15px', color: '#243358', fontWeight: 700 }}>{yr}</h4>
                      <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={() => addTimetableEntry(yr)}>+ Add</button>
                    </div>
                    {items.length === 0 ? (
                      <div className="members-empty">No time table entries for {yr}.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {items.map((item, i) => {
                          const realIdx = form.deptTimetable.indexOf(item);
                          return (
                            <div key={realIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', background: '#f8f9fb', borderRadius: '6px', border: '1px solid #e4e8ed' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '28px', background: '#243358', color: '#fff', fontSize: '12px', fontWeight: 700, borderRadius: '4px', flexShrink: 0 }}>{i + 1}</span>
                              <input type="text" placeholder="Title" value={item.title} onChange={(e) => updateTimetableEntry(realIdx, 'title', e.target.value)} style={{ flex: 1, padding: '7px 10px', border: '1px solid #e4e8ed', borderRadius: '4px', fontSize: '13px' }} />
                              <PdfUpload value={item.url} onChange={(url) => updateTimetableEntry(realIdx, 'url', url)} />
                              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeTimetableEntry(realIdx)} style={{ flexShrink: 0, padding: '4px 8px' }}>✕</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* Submit */}
          <div className="dept-form-submit">
            <button type="submit" className="btn btn-success" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Department' : 'Create Department'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/departments')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminDepartmentForm;
