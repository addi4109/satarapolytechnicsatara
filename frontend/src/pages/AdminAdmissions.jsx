import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import PdfUpload from '../components/PdfUpload';
import './Academics.css';
import { getAcademicYear } from '../lib/siteConfig';
import './Admin.css';

const API_URL = '/api';

const courseCellInput = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '12px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const defaultInfoRows = [
  { label: 'Academic Year', value: getAcademicYear() },
  { label: 'Duration of Programme', value: '3 Years (6 Semesters)' },
  { label: 'Admission Mode', value: 'Central Admission Process (CAP) by DTE Maharashtra' },
  { label: 'Institute Level Seats', value: 'Available for vacant seats after CAP rounds' },
  { label: 'Direct Second Year', value: 'Available for SSC / HSC (Science) / ITI pass candidates' },
  { label: 'Contact for Admissions', value: '+91-94233 42843 | satarapolyinfo@gmail.com' },
];

const SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'courses', label: 'Courses' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'process', label: 'Process' },
  { key: 'first-year', label: 'First Year' },
  { key: 'direct-second', label: 'Direct Second' },
  { key: 'acap', label: 'A-CAP' },
  { key: 'fees', label: 'Fees' },
  { key: 'scholarships', label: 'Scholarships' },
  { key: 'brochure', label: 'Brochure' },
];

const defaultSection = {
  title: '',
  content: '',
  note: '',
  stats: [],
  steps: [],
  documents: [],
  courseTable: [],
  eligFirstYear: [],
  eligDirect2nd: [],
  feePdfUrl: '',
  pdfUrl: '',
  scholarshipDocs: [],
  infoRows: [...defaultInfoRows],
  active: true,
};



function AdminAdmissions() {
  const [activeTab, setActiveTab] = useState('courses');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultSection });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // View mode: 'preview' or 'edit'
  const [view, setView] = useState('preview');

  // List item states
  const [editingStatIdx, setEditingStatIdx] = useState(null);
  const [editingDocIdx, setEditingDocIdx] = useState(null);
  const [editingStepIdx, setEditingStepIdx] = useState(null);
  const [editingElig, setEditingElig] = useState(null);
  const [editingScholCatIdx, setEditingScholCatIdx] = useState(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/admissions-admin`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch admissions:', err);
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
        note: existing.note || '',
        stats: existing.stats || [],
        steps: existing.steps || [],
        documents: existing.documents || [],
        courseTable: existing.courseTable || [],
        eligFirstYear: existing.eligFirstYear || [],
        eligDirect2nd: existing.eligDirect2nd || [],
        feePdfUrl: existing.feePdfUrl || '',
        pdfUrl: existing.pdfUrl || '',
        scholarshipDocs: existing.scholarshipDocs || [],
        infoRows: existing.infoRows && existing.infoRows.length > 0 ? existing.infoRows : [...defaultInfoRows],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultSection });
    }
    setMsg(null);
    resetListInputs();
    setView('preview');
  }, [activeTab, sections]);

  const resetListInputs = () => {
    setEditingDocIdx(null);
    setEditingStatIdx(null);
    setEditingElig(null);
    setEditingStepIdx(null);
    setEditingScholCatIdx(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const startEditing = () => {
    setView('edit');
    resetListInputs();
  };

  const cancelEditing = () => {
    // Revert form to saved data
    const existing = sections[activeTab];
    if (existing) {
      setForm({
        title: existing.title || '',
        content: existing.content || '',
        note: existing.note || '',
        stats: existing.stats || [],
        steps: existing.steps || [],
        documents: existing.documents || [],
        courseTable: existing.courseTable || [],
        eligFirstYear: existing.eligFirstYear || [],
        eligDirect2nd: existing.eligDirect2nd || [],
        feePdfUrl: existing.feePdfUrl || '',
        pdfUrl: existing.pdfUrl || '',
        scholarshipDocs: existing.scholarshipDocs || [],
        infoRows: existing.infoRows && existing.infoRows.length > 0 ? existing.infoRows : [...defaultInfoRows],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultSection });
    }
    setView('preview');
    resetListInputs();
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/admissions-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setMsg({ type: 'success', text: 'Saved successfully!' });
      setView('preview');
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await fetch(`${API_URL}/admissions-admin/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => {
        const updated = { ...prev };
        delete updated[activeTab];
        return updated;
      });
      setForm({ ...defaultSection });
      setMsg({ type: 'success', text: 'Deleted.' });
      setView('preview');
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────
  const addEmptyDoc = () => { handleChange('documents', [...form.documents, '']); setEditingDocIdx(form.documents.length); };
  const updateDoc = (i, val) => { const d = [...form.documents]; d[i] = val; handleChange('documents', d); };
  const removeDoc = (i) => { handleChange('documents', form.documents.filter((_, idx) => idx !== i)); setEditingDocIdx(null); };

  const addEmptyStat = () => { handleChange('stats', [...form.stats, { num: '', label: '' }]); setEditingStatIdx(form.stats.length); };
  const updateStat = (i, f, v) => { const s = [...form.stats]; s[i] = { ...s[i], [f]: v }; handleChange('stats', s); };
  const removeStat = (i) => { handleChange('stats', form.stats.filter((_, idx) => idx !== i)); setEditingStatIdx(null); };

  const addEmptyStep = () => { handleChange('steps', [...form.steps, { title: '', desc: '' }]); setEditingStepIdx(form.steps.length); };
  const updateStep = (i, f, v) => { const s = [...form.steps]; s[i] = { ...s[i], [f]: v }; handleChange('steps', s); };
  const removeStep = (i) => { handleChange('steps', form.steps.filter((_, idx) => idx !== i)); setEditingStepIdx(null); };

  const addEmptyCourse = () => { handleChange('courseTable', [...form.courseTable, { name: '', duration: '3 Years', intake: '60', direct2nd: 'Yes' }]); };
  const updateCourse = (i, f, v) => { const c = [...form.courseTable]; c[i] = { ...c[i], [f]: v }; handleChange('courseTable', c); };
  const removeCourse = (i) => { handleChange('courseTable', form.courseTable.filter((_, idx) => idx !== i)); };

  const addEmptyElig = (field) => { handleChange(field, [...form[field], '']); setEditingElig({ field, index: form[field].length }); };
  const updateEligItem = (field, i, val) => { const items = [...form[field]]; items[i] = val; handleChange(field, items); };
  const removeEligItem = (field, i) => { handleChange(field, form[field].filter((_, idx) => idx !== i)); setEditingElig(null); };

  const addEmptyScholCategory = () => { handleChange('scholarshipDocs', [...form.scholarshipDocs, { category: '', scheme: '', docs: [] }]); setEditingScholCatIdx(form.scholarshipDocs.length); };
  const updateScholCategory = (i, f, v) => { const c = [...form.scholarshipDocs]; c[i] = { ...c[i], [f]: v }; handleChange('scholarshipDocs', c); };
  const removeScholCategory = (i) => { handleChange('scholarshipDocs', form.scholarshipDocs.filter((_, idx) => idx !== i)); setEditingScholCatIdx(null); };
  const addEmptyScholDoc = (catIdx) => {
    const updated = form.scholarshipDocs.map((cat, i) => i === catIdx ? { ...cat, docs: [...cat.docs, { sr: String(cat.docs.length + 1), document: '', details: '' }] } : cat);
    handleChange('scholarshipDocs', updated);
  };
  const updateScholDoc = (catIdx, docIdx, f, v) => {
    const updated = form.scholarshipDocs.map((cat, i) => {
      if (i === catIdx) { const docs = [...cat.docs]; docs[docIdx] = { ...docs[docIdx], [f]: v }; return { ...cat, docs }; }
      return cat;
    });
    handleChange('scholarshipDocs', updated);
  };
  const removeScholDoc = (catIdx, docIdx) => {
    const updated = form.scholarshipDocs.map((cat, i) => {
      if (i === catIdx) return { ...cat, docs: cat.docs.filter((_, j) => j !== docIdx).map((d, idx) => ({ ...d, sr: String(idx + 1) })) };
      return cat;
    });
    handleChange('scholarshipDocs', updated);
  };

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  // ─── Preview Renderers ────────────────────────────────────────────
  const renderContent = (text) => {
    if (!text) return <p style={{ color: '#aaa', fontStyle: 'italic' }}>No content yet.</p>;
    return text.split('\n').filter(p => p.trim()).map((p, i) => <p key={i}>{p}</p>);
  };

  const renderInfoRows = (rows) => {
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

  const renderStats = (stats) => {
    if (!stats || stats.length === 0) return null;
    return (
      <div className="overview-stats">
        {stats.map((s, i) => (
          <div className="stat-box" key={i}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-txt">{s.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSteps = (steps) => {
    if (!steps || steps.length === 0) return null;
    return (
      <div className="process-steps">
        {steps.map((step, i) => (
          <div className="process-step" key={i}>
            <div className="step-number">{i + 1}</div>
            <div className="step-content">
              <h4>{step.title}</h4>
              {step.desc && <p>{step.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDocuments = (docs) => {
    if (!docs || docs.length === 0) return null;
    return (
      <>
        <h3 className="content-sub-heading">Documents Required</h3>
        <ul className="vm-list">
          {docs.map((doc, i) => <li key={i}>{doc}</li>)}
        </ul>
      </>
    );
  };

  const renderNotePreview = () => {
    if (!form.note || !form.note.trim()) return null;
    return (
      <div style={{ marginTop: '24px', padding: '16px 20px', background: '#fffbe6', borderLeft: '4px solid #c8963e', borderRadius: '0 6px 6px 0' }}>
        <strong style={{ color: '#243358', fontSize: '13px' }}>📝 Note:</strong>
        <p style={{ margin: '6px 0 0', color: '#555', fontSize: '13px', lineHeight: '1.7' }}>{form.note}</p>
      </div>
    );
  };

  const renderNoteEditor = () => (
    <div style={{ marginTop: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' }}>Note (optional)</label>
      <textarea
        value={form.note || ''}
        onChange={(e) => handleChange('note', e.target.value)}
        rows={3}
        placeholder="Add any important note for this section..."
        style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
      />
    </div>
  );

  const renderFeePreview = (feeRows, label) => {
    if (!feeRows || feeRows.length === 0) return null;
    return (
      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table className="fee-table">
          <thead>
            <tr>
              <th style={{ width: 80 }}>Year</th>
              <th>Fee Particulars</th>
              <th>OPEN/OBC/EWS/SEBC</th>
              <th>VJNT/SBC</th>
              <th>SC/ST</th>
              <th>Girls</th>
            </tr>
          </thead>
          <tbody>
            {feeRows.map((row, i) => (
              <tr key={i} style={i === feeRows.length - 1 ? { fontWeight: 700, background: '#f8f9fa' } : {}}>
                {i === 0 && <td rowSpan={feeRows.length} style={{ fontWeight: 600, textAlign: 'center', verticalAlign: 'middle' }}>{label}</td>}
                <td style={{ fontWeight: 500 }}>{row.particular}</td>
                <td>{row.open || '-'}</td>
                <td>{row.vjnt || '-'}</td>
                <td>{row.scst || '-'}</td>
                <td>{row.girls || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ─── Preview for each tab ─────────────────────────────────────────
  const renderPreview = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Admission Overview</h2>
            <div className="content-line"></div>
            <p>Welcome to the Admissions section of Satara Polytechnic, Satara. Explore complete information about diploma engineering admissions.</p>
            {renderInfoRows(form.infoRows)}
            {renderNotePreview()}
          </div>
        );

      case 'courses':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Courses Offered</h2>
            <div className="content-line"></div>
            {form.courseTable.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="fee-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Sr. No.</th>
                      <th>Course Name</th>
                      <th style={{ width: 110 }}>Duration</th>
                      <th style={{ width: 90 }}>Intake</th>
                      <th style={{ width: 130 }}>Direct 2nd Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.courseTable.map((c, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{c.name}</td>
                        <td>{c.duration}</td>
                        <td>{c.intake}</td>
                        <td>{c.direct2nd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No courses added yet.</p>
            )}
            {renderNotePreview()}
          </div>
        );

      case 'eligibility':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Eligibility</h2>
            <div className="content-line"></div>
            {form.eligFirstYear.length > 0 && (
              <>
                <h3 className="content-sub-heading">First Year Diploma</h3>
                <ul className="vm-list">{form.eligFirstYear.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </>
            )}
            {form.eligDirect2nd.length > 0 && (
              <>
                <h3 className="content-sub-heading">Direct Second Year Diploma</h3>
                <ul className="vm-list">{form.eligDirect2nd.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </>
            )}
            {form.eligFirstYear.length === 0 && form.eligDirect2nd.length === 0 && (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No eligibility points added yet.</p>
            )}
            {renderNotePreview()}
          </div>
        );

      case 'process':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Admission Process</h2>
            <div className="content-line"></div>
            {renderSteps(form.steps)}
            {form.steps.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic' }}>No steps added yet.</p>}
            {renderNotePreview()}
          </div>
        );

      case 'first-year':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">First Year Admission</h2>
            <div className="content-line"></div>
            {renderDocuments(form.documents)}
            {form.documents.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic' }}>No documents added yet.</p>}
            {renderNotePreview()}
          </div>
        );

      case 'direct-second':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Direct Second Year</h2>
            <div className="content-line"></div>
            {renderDocuments(form.documents)}
            {form.documents.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic' }}>No documents added yet.</p>}
            {renderNotePreview()}
          </div>
        );

      case 'acap':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">A-CAP</h2>
            <div className="content-line"></div>
            {renderDocuments(form.documents)}
            {form.documents.length === 0 && <p style={{ color: '#aaa', fontStyle: 'italic' }}>No documents added yet.</p>}
            {renderNotePreview()}
          </div>
        );

      case 'fees':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Fee Structure</h2>
            <div className="content-line"></div>
            {form.feePdfUrl ? (
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e4e8ed' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
                  📄 <a href={`/api/pdf-proxy?url=${encodeURIComponent(form.feePdfUrl)}`} target="_blank" style={{ color: '#243358', fontWeight: 600 }}>View Fee Structure PDF</a>
                </p>
              </div>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No fee structure PDF uploaded yet.</p>
            )}
            {renderNotePreview()}
          </div>
        );

      case 'scholarships':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">Scholarships</h2>
            <div className="content-line"></div>
            {form.scholarshipDocs.length > 0 ? form.scholarshipDocs.map((cat, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <h3 className="content-sub-heading">{cat.category || 'Untitled'}</h3>
                {cat.scheme && <p className="scholarship-scheme"><strong>Scheme:</strong> {cat.scheme}</p>}
                {cat.docs.length > 0 && (
                  <div className="courses-table-wrap">
                    <table className="courses-table">
                      <thead><tr><th style={{ width: 60 }}>Sr.</th><th>Document</th><th>Details</th></tr></thead>
                      <tbody>{cat.docs.map((d, j) => <tr key={j}><td>{j + 1}</td><td>{d.document}</td><td>{d.details}</td></tr>)}</tbody>
                    </table>
                  </div>
                )}
              </div>
            )) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No scholarship categories added yet.</p>
            )}
            {renderNotePreview()}
          </div>
        );

      case 'brochure':
        return (
          <div className="admission-preview-card">
            <h2 className="content-heading">College Brochure</h2>
            <div className="content-line"></div>
            {form.pdfUrl ? (
              <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e4e8ed' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>
                  📄 <a href={`/api/pdf-proxy?url=${encodeURIComponent(form.pdfUrl)}`} target="_blank" style={{ color: '#243358', fontWeight: 600 }}>View Brochure PDF</a>
                </p>
              </div>
            ) : (
              <p style={{ color: '#aaa', fontStyle: 'italic' }}>No brochure uploaded yet.</p>
            )}
            {renderNotePreview()}
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Editor for each tab ──────────────────────────────────────────
  const renderEditor = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="admission-edit-form">
            <h4>Important Information</h4>
            {form.infoRows.map((row, i) => (
              <div key={i} className="admission-info-edit-row">
                <input type="text" value={row.label} onChange={(e) => { const u = [...form.infoRows]; u[i] = { ...u[i], label: e.target.value }; handleChange('infoRows', u); }} placeholder="Label" />
                <input type="text" value={row.value} onChange={(e) => { const u = [...form.infoRows]; u[i] = { ...u[i], value: e.target.value }; handleChange('infoRows', u); }} placeholder="Value" />
                <button className="member-remove-btn" onClick={() => handleChange('infoRows', form.infoRows.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            <button className="btn btn-success btn-sm" onClick={() => handleChange('infoRows', [...form.infoRows, { label: '', value: '' }])}>+ Add Row</button>
            {renderNoteEditor()}
          </div>
        );

      case 'courses':
        return (
          <div className="admission-edit-form">
            <h4>Course Table</h4>
            <div className="fee-table-wrap">
              <table className="fee-table" style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>Sr.</th>
                    <th>Course Name</th>
                    <th style={{ width: 110 }}>Duration</th>
                    <th style={{ width: 90 }}>Intake</th>
                    <th style={{ width: 130 }}>Direct 2nd Year</th>
                    <th style={{ width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {form.courseTable.map((c, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{i + 1}</td>
                      <td><input type="text" value={c.name} onChange={(e) => updateCourse(i, 'name', e.target.value)} placeholder="Course name" style={courseCellInput} /></td>
                      <td><input type="text" value={c.duration} onChange={(e) => updateCourse(i, 'duration', e.target.value)} style={courseCellInput} /></td>
                      <td><input type="text" value={c.intake} onChange={(e) => updateCourse(i, 'intake', e.target.value)} style={courseCellInput} /></td>
                      <td>
                        <select value={c.direct2nd} onChange={(e) => updateCourse(i, 'direct2nd', e.target.value)} style={{ ...courseCellInput, cursor: 'pointer' }}>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </td>
                      <td><button className="member-remove-btn" onClick={() => removeCourse(i)}>×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn btn-success btn-sm" style={{ marginTop: '12px' }} onClick={addEmptyCourse}>+ Add Course</button>
            {renderNoteEditor()}
          </div>
        );

      case 'eligibility':
        return (
          <div className="admission-edit-form">
            <h4>First Year Diploma</h4>
            <ul className="vm-list">
              {form.eligFirstYear.map((item, i) => (
                <li key={i}>
                  {editingElig && editingElig.field === 'eligFirstYear' && editingElig.index === i ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input autoFocus type="text" value={item} onChange={(e) => updateEligItem('eligFirstYear', i, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setEditingElig(null)} style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }} />
                      <button className="btn btn-success btn-sm" onClick={() => setEditingElig(null)}>Done</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span onClick={() => setEditingElig({ field: 'eligFirstYear', index: i })} style={{ flex: 1, cursor: 'pointer', color: '#555' }}>{item || <em style={{ color: '#aaa' }}>Click to edit</em>}</span>
                      <button className="member-remove-btn" onClick={() => removeEligItem('eligFirstYear', i)}>×</button>
                    </div>
                  )}
                </li>
              ))}
              <li style={{ listStyle: 'none', marginTop: '6px' }}>
                <button className="btn btn-success btn-sm" onClick={() => addEmptyElig('eligFirstYear')}>+ Add Point</button>
              </li>
            </ul>

            <h4 style={{ marginTop: '20px' }}>Direct Second Year Diploma</h4>
            <ul className="vm-list">
              {form.eligDirect2nd.map((item, i) => (
                <li key={i}>
                  {editingElig && editingElig.field === 'eligDirect2nd' && editingElig.index === i ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input autoFocus type="text" value={item} onChange={(e) => updateEligItem('eligDirect2nd', i, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setEditingElig(null)} style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }} />
                      <button className="btn btn-success btn-sm" onClick={() => setEditingElig(null)}>Done</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span onClick={() => setEditingElig({ field: 'eligDirect2nd', index: i })} style={{ flex: 1, cursor: 'pointer', color: '#555' }}>{item || <em style={{ color: '#aaa' }}>Click to edit</em>}</span>
                      <button className="member-remove-btn" onClick={() => removeEligItem('eligDirect2nd', i)}>×</button>
                    </div>
                  )}
                </li>
              ))}
              <li style={{ listStyle: 'none', marginTop: '6px' }}>                <button className="btn btn-success btn-sm" onClick={() => addEmptyElig('eligDirect2nd')}>+ Add Point</button>
              </li>
            </ul>
            {renderNoteEditor()}
          </div>
        );


      case 'process':
        return (
          <div className="admission-edit-form">
            <h4>Process Steps</h4>
            <div className="process-steps">
              {form.steps.map((step, i) => (
                <div className="process-step" key={i} style={{ position: 'relative' }}>
                  <button className="member-remove-btn" onClick={() => removeStep(i)} style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1 }}>×</button>
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content" style={{ flex: 1 }}>
                    {editingStepIdx === i ? (
                      <>
                        <input autoFocus type="text" value={step.title} onChange={(e) => updateStep(i, 'title', e.target.value)} placeholder="Step title" style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px' }} />
                        <textarea value={step.desc} onChange={(e) => updateStep(i, 'desc', e.target.value)} placeholder="Description" rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', resize: 'vertical', marginBottom: '8px' }} />
                        <button className="btn btn-success btn-sm" onClick={() => setEditingStepIdx(null)}>Done</button>
                      </>
                    ) : (
                      <div onClick={() => setEditingStepIdx(i)} style={{ cursor: 'pointer', paddingRight: '24px' }}>
                        <h4>{step.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled</em>}</h4>
                        {step.desc && <p>{step.desc}</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-success btn-sm" style={{ marginTop: '12px' }} onClick={addEmptyStep}>+ Add Step</button>
            {renderNoteEditor()}
          </div>
        );

      case 'first-year':
      case 'direct-second':
      case 'acap':
        return (
          <div className="admission-edit-form">
            <h4>Documents Required</h4>
            <ul className="vm-list">
              {form.documents.map((doc, i) => (
                <li key={i}>
                  {editingDocIdx === i ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input autoFocus type="text" value={doc} onChange={(e) => updateDoc(i, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setEditingDocIdx(null)} style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }} />
                      <button className="btn btn-success btn-sm" onClick={() => setEditingDocIdx(null)}>Done</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span onClick={() => setEditingDocIdx(i)} style={{ flex: 1, cursor: 'pointer', color: '#555' }}>{doc || <em style={{ color: '#aaa' }}>Click to edit</em>}</span>
                      <button className="member-remove-btn" onClick={() => removeDoc(i)}>×</button>
                    </div>
                  )}
                </li>
              ))}
              <li style={{ listStyle: 'none', marginTop: '6px' }}>
                <button className="btn btn-success btn-sm" onClick={addEmptyDoc}>+ Add Document</button>
              </li>
            </ul>
            {renderNoteEditor()}
          </div>
        );

      case 'fees':
        return (
          <div className="admission-edit-form">
            <h4>Fee Structure PDF</h4>
            <div className="form-group">
              <label>Upload Fee Structure PDF</label>
              <PdfUpload value={form.feePdfUrl} onChange={(url) => handleChange('feePdfUrl', url)} />
            </div>
            {form.feePdfUrl && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>
                  📄 <a href={`/api/pdf-proxy?url=${encodeURIComponent(form.feePdfUrl)}`} target="_blank" style={{ color: '#243358', fontWeight: 600 }}>View current PDF</a>
                </p>
              </div>
            )}
            {renderNoteEditor()}
          </div>
        );

      case 'scholarships':
        return (
          <div className="admission-edit-form">
            <h4>Scholarship Categories</h4>
            {form.scholarshipDocs.map((cat, catIdx) => (
              <div key={catIdx} style={{ marginBottom: '24px', paddingBottom: '18px', borderBottom: catIdx < form.scholarshipDocs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                {editingScholCatIdx === catIdx ? (
                  <>
                    <input autoFocus type="text" value={cat.category} onChange={(e) => updateScholCategory(catIdx, 'category', e.target.value)} placeholder="Category" style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" value={cat.scheme} onChange={(e) => updateScholCategory(catIdx, 'scheme', e.target.value)} placeholder="Scheme" style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }} />
                      <button className="btn btn-success btn-sm" onClick={() => setEditingScholCatIdx(null)}>Done</button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div onClick={() => setEditingScholCatIdx(catIdx)} style={{ flex: 1, cursor: 'pointer' }}>
                      <h3 className="content-sub-heading" style={{ margin: 0 }}>{cat.category || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled</em>}</h3>
                      <p className="scholarship-scheme">{cat.scheme ? <><strong>Scheme:</strong> {cat.scheme}</> : <em style={{ color: '#aaa' }}>No scheme</em>}</p>
                    </div>
                    <button className="member-remove-btn" onClick={() => removeScholCategory(catIdx)}>×</button>
                  </div>
                )}
                <div className="courses-table-wrap" style={{ marginTop: '4px' }}>
                  <table className="courses-table">
                    <thead><tr><th style={{ width: 60 }}>Sr.</th><th>Document</th><th>Details</th><th style={{ width: 50 }}></th></tr></thead>
                    <tbody>
                      {cat.docs.map((doc, docIdx) => (
                        <tr key={docIdx}>
                          <td style={{ textAlign: 'center' }}>{docIdx + 1}</td>
                          <td><input type="text" value={doc.document} onChange={(e) => updateScholDoc(catIdx, docIdx, 'document', e.target.value)} placeholder="Document" style={{ width: '100%', padding: '6px 8px', border: '1px solid #d7dde6', borderRadius: '4px', fontSize: '12.5px' }} /></td>
                          <td><input type="text" value={doc.details} onChange={(e) => updateScholDoc(catIdx, docIdx, 'details', e.target.value)} placeholder="Details" style={{ width: '100%', padding: '6px 8px', border: '1px solid #d7dde6', borderRadius: '4px', fontSize: '12.5px' }} /></td>
                          <td><button className="member-remove-btn" onClick={() => removeScholDoc(catIdx, docIdx)}>×</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn btn-success btn-sm" style={{ marginTop: '8px' }} onClick={() => addEmptyScholDoc(catIdx)}>+ Add Document</button>
              </div>
            ))}
            <button className="btn btn-success btn-sm" onClick={addEmptyScholCategory}>+ Add Category</button>
            {renderNoteEditor()}
          </div>
        );

      case 'brochure':
        return (
          <div className="admission-edit-form">
            <h4>College Brochure PDF</h4>
            <div className="form-group">
              <label>Upload PDF</label>
              <PdfUpload value={form.pdfUrl} onChange={(url) => handleChange('pdfUrl', url)} />
            </div>
            {form.pdfUrl && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>
                  <strong>Current:</strong> <a href={`/api/pdf-proxy?url=${encodeURIComponent(form.pdfUrl)}`} target="_blank" style={{ color: '#243358' }}>{form.pdfUrl}</a>
                </p>
              </div>
            )}
            {renderNoteEditor()}
          </div>
        );

      default:
        return null;
    }
  };

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
        <h1>Admissions</h1>
      </div>

      <div className="admin-content">
        {/* Tabs */}
        <div className="about-admin-tabs">
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              className={`about-admin-tab ${activeTab === sec.key ? 'active' : ''}`}
              onClick={() => setActiveTab(sec.key)}
            >
              {sec.label}
              {sections[sec.key] && <span className="about-tab-saved">Saved</span>}
            </button>
          ))}
        </div>

        {/* Alert */}
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        {/* Action Bar */}
        <div className="admission-action-bar">
          {view === 'preview' ? (
            <>
              <button className="btn btn-primary" onClick={startEditing}>
                {sections[activeTab] ? 'Edit' : 'Add Content'}
              </button>
              {sections[activeTab] && activeTab !== 'courses' && activeTab !== 'eligibility' && (
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
            </>
          )}
        </div>

        {/* Preview or Editor */}
        {view === 'preview' ? renderPreview() : (
          <div className="admission-editor-panel">
            <div className="admission-editor-header">
              <h3>Editing: {currentSection?.label}</h3>
            </div>
            {renderEditor()}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAdmissions;
