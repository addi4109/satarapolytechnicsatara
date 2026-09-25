import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import ImageUpload from '../components/ImageUpload';
import PdfUpload from '../components/PdfUpload';
import './Admin.css';

import API_URL from '../lib/api';

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
  rankersBannerImage: '',
  achievements: [],
  library: { description: '', books: [], titles: [] },
  deptTimetable: [],

  order: 0,
};

const years = ['1st Year', '2nd Year', '3rd Year'];
const semestersByYear = { '1st Year': [1, 2], '2nd Year': [3, 4], '3rd Year': [5, 6] };

function AdminDepartmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [editingBasic, setEditingBasic] = useState(false);
  const [obeEditing, setObEditing] = useState(false);
  const [hodEditing, setHodEditing] = useState(false);

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
          rankersBannerImage: dept.rankersBannerImage || '',
          achievements: dept.achievements || [],
          library: {
            description: dept.library?.description || '',
            books: dept.library?.books || [],
            titles: dept.library?.titles || [],
          },
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

  // Labs management
  const addLab = () => {
    setForm((prev) => ({ ...prev, labs: [...prev.labs, { name: '', image: '', count: '' }] }));
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


  // Department library management
  const updateLibrary = (field, val) => {
    setForm((prev) => ({ ...prev, library: { ...prev.library, [field]: val } }));
  };
  const addLibBook = () => {
    setForm((prev) => ({
      ...prev,
      library: { ...prev.library, books: [...prev.library.books, { particulars: '', count: '' }] },
    }));
  };
  const updateLibBook = (idx, field, val) => {
    setForm((prev) => {
      const books = [...prev.library.books];
      books[idx] = { ...books[idx], [field]: val };
      return { ...prev, library: { ...prev.library, books } };
    });
  };
  const removeLibBook = (idx) => {
    setForm((prev) => ({
      ...prev,
      library: { ...prev.library, books: prev.library.books.filter((_, i) => i !== idx) },
    }));
  };
  const addLibTitle = () => {
    setForm((prev) => ({
      ...prev,
      library: { ...prev.library, titles: [...prev.library.titles, { name: '', author: '' }] },
    }));
  };
  const updateLibTitle = (idx, field, val) => {
    setForm((prev) => {
      const titles = [...prev.library.titles];
      titles[idx] = { ...titles[idx], [field]: val };
      return { ...prev, library: { ...prev.library, titles } };
    });
  };
  const removeLibTitle = (idx) => {
    setForm((prev) => ({
      ...prev,
      library: { ...prev.library, titles: prev.library.titles.filter((_, i) => i !== idx) },
    }));
  };

  // Timetable management
  const addTimetable = () => {
    setForm((prev) => ({ ...prev, deptTimetable: [...prev.deptTimetable, { year: '1st Year', title: '', url: '' }] }));
  };
  const updateTimetable = (idx, field, val) => {
    setForm((prev) => {
      const tt = [...prev.deptTimetable];
      tt[idx] = { ...tt[idx], [field]: val };
      return { ...prev, deptTimetable: tt };
    });
  };
  const removeTimetable = (idx) => {
    setForm((prev) => ({ ...prev, deptTimetable: prev.deptTimetable.filter((_, i) => i !== idx) }));
  };

  // Achievements management
  const addAchievement = () => {
    setForm((prev) => ({ ...prev, achievements: [...prev.achievements, { title: '', image: '', description: '', order: 0 }] }));
  };
  const updateAchievement = (idx, field, val) => {
    setForm((prev) => {
      const a = [...prev.achievements];
      a[idx] = { ...a[idx], [field]: val };
      return { ...prev, achievements: a };
    });
  };
  const removeAchievement = (idx) => {
    setForm((prev) => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));
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
            { key: 'rankers', label: 'Rankers' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'library', label: 'Library' },
            { key: 'timetable', label: 'Time Table' },
          ]}
          activeTab={activeTab}
          onChange={(tab) => { setActiveTab(tab); if (tab === 'basic') setEditingBasic(false); if (tab === 'obe') setObEditing(false); if (tab === 'hod') setHodEditing(false); }}
        />

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* ===== BASIC INFO TAB ===== */}
          {activeTab === 'basic' && !editingBasic && (
            <div className="dept-preview-wrapper">
              <div className="dept-card dept-preview-card" onClick={() => setEditingBasic(true)}>
                <div className="dept-img-wrap">
                  {form.image ? (
                    <img src={form.image} alt={form.name || 'Department'} />
                  ) : (
                    <div className="dept-img-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c8963e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="dept-body">
                  <h3 className="dept-name">{form.name || 'Department Name'}</h3>
                  <p className="dept-desc">
                    {form.about
                      ? form.about.length > 130
                        ? `${form.about.substring(0, 130).trim()}...`
                        : form.about
                      : 'Click to add department details'}
                  </p>
                  <div className="dept-meta">
                    {form.slug !== 'general-science' && !form.name?.toLowerCase().includes('general science') && <span>Intake: {form.intake}</span>}
                    {form.directSecond && <span>Direct 2nd Year: Yes</span>}
                    <span>Faculty: {form.faculty.filter(f => f.name.trim()).length + 1}</span>
                  </div>
                  <div className="dept-preview-edit-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Click to edit basic info
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'basic' && editingBasic && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div>
                <h3>Basic Information</h3>
                <p>Department name, image, and description</p>
              </div>
              <button type="button" className="btn btn-secondary btn-sm dept-card-add-btn" onClick={() => setEditingBasic(false)}>
                ← Back to Preview
              </button>
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
                <textarea name="mission" value={form.mission} onChange={handleChange} placeholder={"Mission point 1\nMission point 2\nMission point 3"} rows={4} />
              </div>
            </div>
          </div>
          )}

          {/* HOD Details - Preview */}
          {activeTab === 'hod' && !hodEditing && (
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
            <div className="dept-form-card-body" style={{ cursor: 'pointer' }} onClick={() => setHodEditing(true)}>
              <div className="officer-card" style={{ margin: 0 }}>
                <div className="officer-left">
                  {form.hodImage ? (
                    <div className="officer-photo">
                      <img src={form.hodImage} alt={form.hod} />
                    </div>
                  ) : (
                    <div className="officer-photo officer-photo-placeholder">
                      <span>{form.hod?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                    </div>
                  )}
                  <h4 className="officer-name">{form.hod || 'HOD Name'}</h4>
                  <p className="officer-designation">Head of Department</p>
                  {form.hodQual && (
                    <p className="officer-qual">{form.hodQual}</p>
                  )}
                </div>
                <div className="officer-msg">
                  {form.hodMsg ? (
                    form.hodMsg.split('\n').filter(p => p.trim()).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>HOD message not added yet.</p>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Click to edit HOD details
                </span>
              </div>
            </div>
          </div>
          )}

          {/* HOD Details - Edit */}
          {activeTab === 'hod' && hodEditing && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <h3>HOD Details</h3>
                <p>Head of Department information</p>
              </div>
              <button type="button" className="btn btn-secondary btn-sm dept-card-add-btn" onClick={() => setHodEditing(false)}>
                ← Back to Preview
              </button>
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
                <textarea name="hodMsg" value={form.hodMsg} onChange={handleChange} placeholder={"HOD's welcome message...\n(Use Enter for line breaks)"} rows={5} />
              </div>
            </div>
          </div>
          )}

          {/* Faculty Members */}
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
                      <button type="button" className="faculty-card-remove" onClick={() => removeFaculty(idx)} title="Remove">✕</button>
                      <div className="faculty-card-img">
                        <ImageUpload value={f.image} onChange={(url) => updateFaculty(idx, 'image', url)} label="" placeholder="Photo" circle />
                      </div>
                      <div className="faculty-card-fields">
                        <input type="text" placeholder="Name" value={f.name} onChange={(e) => updateFaculty(idx, 'name', e.target.value)} />
                        <input type="text" placeholder="Designation" value={f.designation} onChange={(e) => updateFaculty(idx, 'designation', e.target.value)} />
                        <input type="text" placeholder="Qualification" value={f.qual} onChange={(e) => updateFaculty(idx, 'qual', e.target.value)} />
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input type="text" placeholder="Experience (e.g. 5)" value={f.exp} onChange={(e) => { updateFaculty(idx, 'exp', e.target.value); updateFaculty(idx, 'expYear', new Date().getFullYear()); }} style={{ flex: 1 }} />
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

          {/* Infrastructure */}
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
                        <ImageUpload value={l.image} onChange={(url) => updateLab(idx, 'image', url)} label="" placeholder="Photo" />
                      </div>
                      <input type="text" placeholder="Item Name (e.g. CAD Lab)" value={l.name} onChange={(e) => updateLab(idx, 'name', e.target.value)} className="lab-item-input" />
                      <input type="text" placeholder="Total Count (e.g. 25 PCs)" value={l.count || ''} onChange={(e) => updateLab(idx, 'count', e.target.value)} className="lab-item-input" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Rankers */}
          {activeTab === 'rankers' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 0 1-10 0V4z"/><path d="M17 5h3a1 1 0 0 1 1 1c0 2.5-2 4-4 4"/><path d="M7 5H4a1 1 0 0 0-1 1c0 2.5 2 4 4 4"/></svg>
              </div>
              <div>
                <h3>Rankers Banner</h3>
                <p>Upload a single banner image (poster/table of rankers) shown on the department Rankers tab</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              <ImageUpload
                value={form.rankersBannerImage}
                onChange={(url) => handleChange({ target: { name: 'rankersBannerImage', value: url } })}
                label="Banner Image"
                placeholder="Choose a banner image..."
              />
              <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: '#777' }}>
                Tip: a wide image works best. It replaces the old rankers table and year tabs.
              </p>
            </div>
          </div>
          )}

          {/* Achievements */}
          {activeTab === 'achievements' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/></svg>
              </div>
              <div>
                <h3>Achievements</h3>
                <p>Cards with image, title and description — shown in the department sidebar tab</p>
              </div>
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addAchievement}>+ Add Achievement</button>
            </div>
            <div className="dept-form-card-body">
              {form.achievements.length === 0 ? (
                <div className="members-empty">No achievements added yet. Click "+ Add Achievement" to add one.</div>
              ) : (
                <div className="faculty-cards-grid">
                  {form.achievements.map((a, idx) => (
                    <div key={idx} className="faculty-card">
                      <button type="button" className="faculty-card-remove" onClick={() => removeAchievement(idx)} title="Remove">✕</button>
                      <div className="faculty-card-img">
                        <ImageUpload value={a.image} onChange={(url) => updateAchievement(idx, 'image', url)} label="" placeholder="Image" />
                      </div>
                      <div className="faculty-card-fields">
                        <input type="text" placeholder="Title *" value={a.title} onChange={(e) => updateAchievement(idx, 'title', e.target.value)} />
                        <textarea
                          placeholder="Description"
                          rows={3}
                          value={a.description}
                          onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
                          style={{ resize: 'vertical' }}
                        />
                        <input
                          type="number"
                          placeholder="Order (0 = first)"
                          min={0}
                          value={a.order ?? 0}
                          onChange={(e) => updateAchievement(idx, 'order', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ))
                }
                </div>
              )}
            </div>
          </div>
          )}

          {/* Department Library */}
          {activeTab === 'library' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div>
                <h3>Department Library</h3>
                <p>Book summary counts and titles list</p>
              </div>
            </div>
            <div className="dept-form-card-body">
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Description</label>
                <textarea
                  rows={3}
                  value={form.library.description}
                  onChange={(e) => updateLibrary('description', e.target.value)}
                  placeholder="Short intro about the department library..."
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Books Summary (Particulars + Count)</label>
                  <button type="button" className="btn btn-success btn-sm" onClick={addLibBook}>+ Add Row</button>
                </div>
                {form.library.books.length === 0 && (
                  <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '12px' }}>No rows yet.</p>
                )}
                {form.library.books.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" placeholder="Particulars (e.g. Reference Books)" value={b.particulars} onChange={(e) => updateLibBook(idx, 'particulars', e.target.value)} style={{ flex: 2, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                    <input type="text" placeholder="Count (e.g. 250)" value={b.count} onChange={(e) => updateLibBook(idx, 'count', e.target.value)} style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLibBook(idx)}>×</button>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>Titles List (Name + Author)</label>
                  <button type="button" className="btn btn-success btn-sm" onClick={addLibTitle}>+ Add Title</button>
                </div>
                {form.library.titles.length === 0 && (
                  <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: '12px' }}>No titles yet.</p>
                )}
                {form.library.titles.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" placeholder="Book Title" value={t.name} onChange={(e) => updateLibTitle(idx, 'name', e.target.value)} style={{ flex: 2, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                    <input type="text" placeholder="Author (optional)" value={t.author} onChange={(e) => updateLibTitle(idx, 'author', e.target.value)} style={{ flex: 1, padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }} />
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLibTitle(idx)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Time Table */}
          {activeTab === 'timetable' && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <h3>Time Table</h3>
                <p>Class-wise timetable PDFs</p>
              </div>
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addTimetable}>+ Add Timetable</button>
            </div>
            <div className="dept-form-card-body">
              {form.deptTimetable.length === 0 ? (
                <div className="members-empty">No timetables added yet. Click "+ Add Timetable" to add one.</div>
              ) : (
                <div className="faculty-cards-grid">
                  {form.deptTimetable.map((t, idx) => (
                    <div key={idx} className="faculty-card">
                      <button type="button" className="faculty-card-remove" onClick={() => removeTimetable(idx)} title="Remove">✕</button>
                      <div className="faculty-card-fields">
                        <select
                          className="ranker-year-select"
                          value={t.year}
                          onChange={(e) => updateTimetable(idx, 'year', e.target.value)}
                          title="Academic year"
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                        <input type="text" placeholder="Title (e.g. 2nd Semester Timetable)" value={t.title} onChange={(e) => updateTimetable(idx, 'title', e.target.value)} />
                        <PdfUpload value={t.url} onChange={(url) => updateTimetable(idx, 'url', url)} label="Timetable PDF" />
                      </div>
                    </div>
                  ))
                }
                </div>
              )}
            </div>
          </div>
          )}

          {/* Curriculum / Syllabus */}
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
              <button type="button" className="btn btn-success btn-sm dept-card-add-btn" onClick={addSubject}>+ Add Subject</button>
            </div>
            <div className="dept-form-card-body">
              {form.curriculum.length === 0 ? (
                <div className="admin-curriculum-empty">No subjects added yet. Click "+ Add Subject" to add one.</div>
              ) : (
                <div className="admin-curriculum-wrapper">
                  {years.map((year) => {
                    const yearSubjects = form.curriculum
                      .map((item, idx) => ({ ...item, idx }))
                      .filter((c) => c.year === year);
                    if (yearSubjects.length === 0) return null;
                    return (
                      <div key={year}>
                        <h3 className="admin-curriculum-year">{year}</h3>
                        {[...new Set(yearSubjects.map((c) => c.semester))].sort((a, b) => a - b).map((sem) => {
                          const semSubjects = yearSubjects.filter((c) => c.semester === sem);
                          return (
                            <div key={sem} style={{ marginBottom: '16px' }}>
                              <h4 className="admin-curriculum-sem-label">Semester {sem}</h4>
                              <div style={{ overflowX: 'auto' }}>
                                <table className="admin-curriculum-table">
                                  <thead>
                                    <tr>
                                      <th style={{ width: '45%' }}>Subject</th>
                                      <th style={{ width: '40%' }}>Link (PDF/URL)</th>
                                      <th style={{ width: '15%', textAlign: 'center' }}>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {semSubjects.map((sub) => (
                                      <tr key={sub.idx}>
                                        <td>
                                          <input className="subj-input" type="text" placeholder="Subject name" value={sub.name} onChange={(e) => updateCurriculum(sub.idx, 'name', e.target.value)} />
                                        </td>
                                        <td>
                                          <PdfUpload value={sub.url} onChange={(url) => updateCurriculum(sub.idx, 'url', url)} />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSubject(sub.idx)}>Delete</button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
              <div ref={curriculumEndRef} />
            </div>
          </div>
          )}

          {/* Outcome Based Education */}
          {activeTab === 'obe' && !obeEditing && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div>
                <h3>Outcome Based Education</h3>
                <p>PEOs, POs, and PSOs</p>
              </div>
            </div>
            <div className="dept-form-card-body" style={{ cursor: 'pointer' }} onClick={() => setObEditing(true)}>
              <div className="obe-main-card" style={{ margin: 0 }}>
                <div className="obe-tabs">
                  {['peos', 'pos', 'psos'].map((tab) => (
                    <button key={tab} className="obe-tab active" style={{ pointerEvents: 'none' }}>
                      {tab === 'peos' && 'PEOs'}
                      {tab === 'pos' && 'POs'}
                      {tab === 'psos' && 'PSOs'}
                    </button>
                  ))}
                </div>
                <div className="obe-content">
                  {['peos', 'pos', 'psos'].map((field) => {
                    const labels = { peos: 'Program Educational Objectives (PEOs)', pos: 'Program Outcomes (POs)', psos: 'Program Specific Outcomes (PSOs)' };
                    const descs = {
                      peos: 'PEOs are broad statements that describe the career and professional achievements that the program is preparing graduates to achieve.',
                      pos: 'POs are measurable outcomes that students are expected to achieve by the time of graduation.',
                      psos: 'PSOs are outcomes that differentiate the program from other programs and reflect the discipline-specific competencies.',
                    };
                    return (
                      <div key={field} className="obe-sub-card" style={{ marginBottom: '16px' }}>
                        <h3 className="obe-sub-heading">{labels[field]}</h3>
                        <p className="obe-desc">{descs[field]}</p>
                        {form[field] && form[field].length > 0 ? (
                          <ul className="obe-list">
                            {form[field].map((item, i) => (
                              <li key={i} className="obe-list-item">
                                <div>
                                  {item.title && <strong>{item.title}</strong>}
                                  {item.description && <p>{item.description}</p>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ color: '#888', fontStyle: 'italic' }}>{labels[field].replace(/\(.*\)/, '').trim()} not added yet.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', color: '#888' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '4px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Click to edit OBE content
                </span>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'obe' && obeEditing && (
          <div className="dept-form-card">
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div>
                <h3>Outcome Based Education</h3>
                <p>PEOs, POs, and PSOs</p>
              </div>
              <button type="button" className="btn btn-secondary btn-sm dept-card-add-btn" onClick={() => setObEditing(false)}>
                ← Back to Preview
              </button>
            </div>
            <div className="dept-form-card-body">
              {['peos', 'pos', 'psos'].map((field) => {
                const labels = { peos: 'PEOs', pos: 'POs', psos: 'PSOs' };
                return (
                  <div key={field} style={{ marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 10px', fontFamily: "'Georgia', serif", fontSize: '16px', color: '#243358', borderBottom: '2px solid #c8963e', paddingBottom: '6px' }}>{labels[field]}</h4>
                    {form[field].length === 0 ? (
                      <div className="members-empty">No {labels[field]} added yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {form[field].map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px', background: '#f8f9fb', borderRadius: '6px', border: '1px solid #e4e8ed' }}>
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
