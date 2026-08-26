import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import PdfUpload from '../components/PdfUpload';
import './Academics.css';

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

const SECTIONS = [
  { key: 'courses', label: 'Courses Offered' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'process', label: 'Admission Process' },
  { key: 'first-year', label: 'First Year Admission' },
  { key: 'direct-second', label: 'Direct Second Year' },
  { key: 'acap', label: 'A-CAP' },
  { key: 'fees', label: 'Fee Structure' },
  { key: 'scholarships', label: 'Scholarships' },
  { key: 'brochure', label: 'College Brochure' },
];

const defaultFeeRows = [
  { particular: 'Tuition Fee', open: '', vjnt: '', scst: '', girls: '' },
  { particular: 'Development Fee', open: '', vjnt: '', scst: '', girls: '' },
  { particular: 'Enrollment Fees', open: '', vjnt: '', scst: '', girls: '' },
  { particular: 'Eligibility Fees', open: '', vjnt: '', scst: '', girls: '' },
  { particular: 'Insurance Fees', open: '', vjnt: '', scst: '', girls: '' },
  { particular: 'Identity Card Fees', open: '', vjnt: '', scst: '', girls: '' },
  { particular: 'Total Payable Fee', open: '', vjnt: '', scst: '', girls: '' },
];

const defaultSection = {
  title: '',
  content: '',
  stats: [],
  steps: [],
  documents: [],
  courseTable: [],
  eligFirstYear: [],
  eligDirect2nd: [],
  feeRows1: [...defaultFeeRows],
  feeRows2: [...defaultFeeRows],
  pdfUrl: '',
  scholarshipDocs: [],
  subSections: [],
  active: true,
};

// Fee Table Editor Component
function FeeTableEditor({ yearLabel, feeRows, onChange }) {
  const handleCellChange = (index, field, value) => {
    const updated = feeRows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    onChange(updated);
  };

  const inputStyle = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
      <table className="admin-table" style={{ width: '100%' }}>
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
              {i === 0 && (
                <td rowSpan={feeRows.length} style={{ fontWeight: 600, textAlign: 'center', verticalAlign: 'middle' }}>
                  {yearLabel}
                </td>
              )}
              <td style={{ fontWeight: 500 }}>{row.particular}</td>
              <td><input type="text" value={row.open} onChange={(e) => handleCellChange(i, 'open', e.target.value)} style={inputStyle} placeholder="0/-" /></td>
              <td><input type="text" value={row.vjnt} onChange={(e) => handleCellChange(i, 'vjnt', e.target.value)} style={inputStyle} placeholder="0/-" /></td>
              <td><input type="text" value={row.scst} onChange={(e) => handleCellChange(i, 'scst', e.target.value)} style={inputStyle} placeholder="0/-" /></td>
              <td><input type="text" value={row.girls} onChange={(e) => handleCellChange(i, 'girls', e.target.value)} style={inputStyle} placeholder="0/-" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminAdmissions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultSection });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

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
        stats: existing.stats || [],
        steps: existing.steps || [],
        documents: existing.documents || [],
        courseTable: existing.courseTable || [],
        eligFirstYear: existing.eligFirstYear || [],
        eligDirect2nd: existing.eligDirect2nd || [],
        feeRows1: existing.feeRows1 && existing.feeRows1.length > 0 ? existing.feeRows1 : [...defaultFeeRows],
        feeRows2: existing.feeRows2 && existing.feeRows2.length > 0 ? existing.feeRows2 : [...defaultFeeRows],
        pdfUrl: existing.pdfUrl || '',
        scholarshipDocs: existing.scholarshipDocs || [],
        subSections: existing.subSections || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultSection });
    }
    setMsg(null);
    resetListInputs();
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
      await fetch(`${API_URL}/admissions-admin/${activeTab}`, { method: 'DELETE' });
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

  // Documents helpers - frontend-style list with inline edit/delete
  const addEmptyDoc = () => {
    handleChange('documents', [...form.documents, '']);
    setEditingDocIdx(form.documents.length);
  };

  const updateDoc = (index, value) => {
    const docs = [...form.documents];
    docs[index] = value;
    handleChange('documents', docs);
  };

  const removeDoc = (index) => {
    handleChange('documents', form.documents.filter((_, i) => i !== index));
    setEditingDocIdx(null);
  };

  // Stats helpers - inline card editing
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

  // Steps helpers - frontend-style list with inline edit/delete
  const addEmptyStep = () => {
    handleChange('steps', [...form.steps, { title: '', desc: '' }]);
    setEditingStepIdx(form.steps.length);
  };

  const updateStep = (index, field, value) => {
    const steps = [...form.steps];
    steps[index] = { ...steps[index], [field]: value };
    handleChange('steps', steps);
  };

  const removeStep = (index) => {
    handleChange('steps', form.steps.filter((_, i) => i !== index));
    setEditingStepIdx(null);
  };

  // Course table helpers
  const addEmptyCourse = () => {
    handleChange('courseTable', [...form.courseTable, { name: '', duration: '3 Years', intake: '60', direct2nd: 'Yes' }]);
  };

  const updateCourse = (index, field, value) => {
    const courseTable = [...form.courseTable];
    courseTable[index] = { ...courseTable[index], [field]: value };
    handleChange('courseTable', courseTable);
  };

  const removeCourse = (index) => {
    handleChange('courseTable', form.courseTable.filter((_, i) => i !== index));
  };

  // Scholarship helpers - frontend-style categories with inline edit/delete
  const addEmptyScholCategory = () => {
    handleChange('scholarshipDocs', [...form.scholarshipDocs, { category: '', scheme: '', docs: [] }]);
    setEditingScholCatIdx(form.scholarshipDocs.length);
  };

  const updateScholCategory = (index, field, value) => {
    const cats = [...form.scholarshipDocs];
    cats[index] = { ...cats[index], [field]: value };
    handleChange('scholarshipDocs', cats);
  };

  const removeScholCategory = (index) => {
    handleChange('scholarshipDocs', form.scholarshipDocs.filter((_, i) => i !== index));
    setEditingScholCatIdx(null);
  };

  const addEmptyScholDoc = (catIndex) => {
    const updated = form.scholarshipDocs.map((cat, i) => {
      if (i === catIndex) {
        return { ...cat, docs: [...cat.docs, { sr: String(cat.docs.length + 1), document: '', details: '' }] };
      }
      return cat;
    });
    handleChange('scholarshipDocs', updated);
  };

  const updateScholDoc = (catIndex, docIndex, field, value) => {
    const updated = form.scholarshipDocs.map((cat, i) => {
      if (i === catIndex) {
        const docs = [...cat.docs];
        docs[docIndex] = { ...docs[docIndex], [field]: value };
        return { ...cat, docs };
      }
      return cat;
    });
    handleChange('scholarshipDocs', updated);
  };

  const removeScholDoc = (catIndex, docIndex) => {
    const updated = form.scholarshipDocs.map((cat, i) => {
      if (i === catIndex) {
        return { ...cat, docs: cat.docs.filter((_, j) => j !== docIndex).map((d, idx) => ({ ...d, sr: String(idx + 1) })) };
      }
      return cat;
    });
    handleChange('scholarshipDocs', updated);
  };

  // Eligibility helpers - frontend-style list with inline edit/delete
  const addEmptyElig = (field) => {
    handleChange(field, [...form[field], '']);
    setEditingElig({ field, index: form[field].length });
  };

  const updateEligItem = (field, index, value) => {
    const items = [...form[field]];
    items[index] = value;
    handleChange(field, items);
  };

  const removeEligItem = (field, index) => {
    handleChange(field, form[field].filter((_, i) => i !== index));
    setEditingElig(null);
  };

  // Sub-sections helpers
  const [editingSubIdx, setEditingSubIdx] = useState(null);

  const addSubSection = () => {
    const newSub = { title: '', content: '', stats: [], documents: [], steps: [] };
    handleChange('subSections', [...form.subSections, newSub]);
    setEditingSubIdx(form.subSections.length);
  };

  const updateSubSection = (index, field, value) => {
    const updated = form.subSections.map((sub, i) =>
      i === index ? { ...sub, [field]: value } : sub
    );
    handleChange('subSections', updated);
  };

  const removeSubSection = (index) => {
    handleChange('subSections', form.subSections.filter((_, i) => i !== index));
    setEditingSubIdx(null);
  };

  const addSubStat = (subIdx) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) return { ...sub, stats: [...sub.stats, { num: '', label: '' }] };
      return sub;
    });
    handleChange('subSections', updated);
  };

  const updateSubStat = (subIdx, statIdx, field, value) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) {
        const stats = sub.stats.map((s, j) => j === statIdx ? { ...s, [field]: value } : s);
        return { ...sub, stats };
      }
      return sub;
    });
    handleChange('subSections', updated);
  };

  const removeSubStat = (subIdx, statIdx) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) return { ...sub, stats: sub.stats.filter((_, j) => j !== statIdx) };
      return sub;
    });
    handleChange('subSections', updated);
  };

  const addSubDocument = (subIdx) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) return { ...sub, documents: [...sub.documents, ''] };
      return sub;
    });
    handleChange('subSections', updated);
  };

  const updateSubDocument = (subIdx, docIdx, value) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) {
        const docs = sub.documents.map((d, j) => j === docIdx ? value : d);
        return { ...sub, documents: docs };
      }
      return sub;
    });
    handleChange('subSections', updated);
  };

  const removeSubDocument = (subIdx, docIdx) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) return { ...sub, documents: sub.documents.filter((_, j) => j !== docIdx) };
      return sub;
    });
    handleChange('subSections', updated);
  };

  const addSubStep = (subIdx) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) return { ...sub, steps: [...sub.steps, { title: '', desc: '' }] };
      return sub;
    });
    handleChange('subSections', updated);
  };

  const updateSubStep = (subIdx, stepIdx, field, value) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) {
        const steps = sub.steps.map((s, j) => j === stepIdx ? { ...s, [field]: value } : s);
        return { ...sub, steps };
      }
      return sub;
    });
    handleChange('subSections', updated);
  };

  const removeSubStep = (subIdx, stepIdx) => {
    const updated = form.subSections.map((sub, i) => {
      if (i === subIdx) return { ...sub, steps: sub.steps.filter((_, j) => j !== stepIdx) };
      return sub;
    });
    handleChange('subSections', updated);
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
        <h1>Admissions</h1>
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
            <h3>{activeTab === 'courses' ? 'Course Table' : activeTab === 'eligibility' ? 'Eligibility Points' : 'Section Content'}</h3>
            {sections[activeTab] && activeTab !== 'courses' && activeTab !== 'eligibility' && (
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            )}
          </div>
          <div className="admin-card-body">
            {/* Title - hidden for courses */}
            {activeTab !== 'courses' && activeTab !== 'eligibility' && (
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

            {/* Content - hidden for courses */}
            {activeTab !== 'courses' && activeTab !== 'eligibility' && (
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

            {/* Sub Sections - hidden for courses */}
            {activeTab !== 'courses' && activeTab !== 'eligibility' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: '#243358', fontSize: '15px' }}>Additional Sections</h4>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={addSubSection}
                    style={{ fontSize: '12px' }}
                  >
                    + Add Section
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Add multiple content blocks below the main content. Each section has its own title, content, stats, documents, and steps.</p>

                {form.subSections.map((sub, subIdx) => (
                  <div key={subIdx} style={{ background: '#f8f9fb', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '16px', marginBottom: '14px', position: 'relative' }}>
                    {/* Section header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#243358' }}>Section {subIdx + 1}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingSubIdx(editingSubIdx === subIdx ? null : subIdx)}
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          {editingSubIdx === subIdx ? 'Close' : 'Edit'}
                        </button>
                        <button
                          className="member-remove-btn"
                          title="Delete section"
                          onClick={() => removeSubSection(subIdx)}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Display / Edit mode */}
                    {editingSubIdx === subIdx ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                          type="text"
                          value={sub.title}
                          onChange={(e) => updateSubSection(subIdx, 'title', e.target.value)}
                          placeholder="Section title"
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                        <textarea
                          value={sub.content}
                          onChange={(e) => updateSubSection(subIdx, 'content', e.target.value)}
                          placeholder="Section content..."
                          rows={4}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }}
                        />

                        {/* Stats */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#243358' }}>Stats</span>
                            <button className="btn btn-success btn-sm" onClick={() => addSubStat(subIdx)} style={{ fontSize: '10px', padding: '2px 8px' }}>+ Add</button>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {sub.stats.map((stat, si) => (
                              <div key={si} style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#fff', border: '1px solid #e4e8ed', borderRadius: '5px', padding: '4px 6px' }}>
                                <input type="text" value={stat.num} onChange={(e) => updateSubStat(subIdx, si, 'num', e.target.value)} placeholder="Num" style={{ width: '50px', padding: '4px 6px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '11px', textAlign: 'center' }} />
                                <input type="text" value={stat.label} onChange={(e) => updateSubStat(subIdx, si, 'label', e.target.value)} placeholder="Label" style={{ width: '100px', padding: '4px 6px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '11px' }} />
                                <button className="member-remove-btn" onClick={() => removeSubStat(subIdx, si)} title="Remove" style={{ fontSize: '10px' }}>×</button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Documents */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#243358' }}>Documents</span>
                            <button className="btn btn-success btn-sm" onClick={() => addSubDocument(subIdx)} style={{ fontSize: '10px', padding: '2px 8px' }}>+ Add</button>
                          </div>
                          {sub.documents.map((doc, di) => (
                            <div key={di} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                              <input type="text" value={doc} onChange={(e) => updateSubDocument(subIdx, di, e.target.value)} placeholder="Document name" style={{ flex: 1, padding: '5px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                              <button className="member-remove-btn" onClick={() => removeSubDocument(subIdx, di)} title="Remove">×</button>
                            </div>
                          ))}
                        </div>

                        {/* Steps */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#243358' }}>Steps</span>
                            <button className="btn btn-success btn-sm" onClick={() => addSubStep(subIdx)} style={{ fontSize: '10px', padding: '2px 8px' }}>+ Add</button>
                          </div>
                          {sub.steps.map((step, sti) => (
                            <div key={sti} style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                              <input type="text" value={step.title} onChange={(e) => updateSubStep(subIdx, sti, 'title', e.target.value)} placeholder="Step title" style={{ flex: 1, padding: '5px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                              <input type="text" value={step.desc} onChange={(e) => updateSubStep(subIdx, sti, 'desc', e.target.value)} placeholder="Description" style={{ flex: 1, padding: '5px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} />
                              <button className="member-remove-btn" onClick={() => removeSubStep(subIdx, sti)} title="Remove">×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Preview mode */
                      <div style={{ fontSize: '13px', color: '#555' }}>
                        <div style={{ fontWeight: 600, color: '#243358', marginBottom: '4px' }}>{sub.title || <em style={{ color: '#aaa' }}>Untitled</em>}</div>
                        <div style={{ marginBottom: '6px', lineHeight: 1.5 }}>{sub.content ? (sub.content.length > 150 ? sub.content.slice(0, 150) + '...' : sub.content) : <em style={{ color: '#aaa' }}>No content</em>}</div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#888' }}>
                          {sub.stats.length > 0 && <span>{sub.stats.length} stat{sub.stats.length !== 1 ? 's' : ''}</span>}
                          {sub.documents.length > 0 && <span>{sub.documents.length} doc{sub.documents.length !== 1 ? 's' : ''}</span>}
                          {sub.steps.length > 0 && <span>{sub.steps.length} step{sub.steps.length !== 1 ? 's' : ''}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {form.subSections.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fb', border: '1px dashed #d7dde6', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>No additional sections yet. Click "+ Add Section" to create one.</p>
                  </div>
                )}
              </>
            )}

            {/* Overview - Stats */}
            {activeTab === 'overview' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Stats (Number - Label)</h4>
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
              </>
            )}

            {/* Fees - Fee Tables */}
            {activeTab === 'fees' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>First Year Fee Structure</h4>
                <FeeTableEditor
                  yearLabel="First Year"
                  feeRows={form.feeRows1 || []}
                  onChange={(rows) => handleChange('feeRows1', rows)}
                />

                <h4 style={{ margin: '20px 0 12px', color: '#243358', fontSize: '15px' }}>Direct Second Year Fee Structure</h4>
                <FeeTableEditor
                  yearLabel="Direct Second Year"
                  feeRows={form.feeRows2 || []}
                  onChange={(rows) => handleChange('feeRows2', rows)}
                />
              </>
            )}

            {/* Eligibility */}
            {activeTab === 'eligibility' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Eligibility Points</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Shown exactly like the live website — click a point to edit it.</p>

                {/* First Year Diploma - frontend style */}
                <h3 className="content-sub-heading">First Year Diploma</h3>
                <ul className="vm-list" style={{ marginBottom: '20px' }}>
                  {form.eligFirstYear.map((item, i) => (
                    <li key={i}>
                      {editingElig && editingElig.field === 'eligFirstYear' && editingElig.index === i ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            autoFocus
                            type="text"
                            value={item}
                            onChange={(e) => updateEligItem('eligFirstYear', i, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingElig(null)}
                            placeholder="Eligibility point..."
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }}
                          />
                          <button className="btn btn-success btn-sm" onClick={() => setEditingElig(null)}>Done</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            onClick={() => setEditingElig({ field: 'eligFirstYear', index: i })}
                            title="Click to edit"
                            style={{ flex: 1, cursor: 'pointer', color: '#555' }}
                          >
                            {item || <em style={{ color: '#aaa' }}>Empty point — click to edit</em>}
                          </span>
                          <button
                            className="member-remove-btn"
                            title="Delete"
                            onClick={() => removeEligItem('eligFirstYear', i)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                  <li style={{ listStyle: 'none', marginTop: '6px' }}>
                    <div
                      onClick={() => addEmptyElig('eligFirstYear')}
                      title="Add Point"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px' }}
                    >
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Point
                    </div>
                  </li>
                </ul>

                {/* Direct Second Year Diploma - frontend style */}
                <h3 className="content-sub-heading">Direct Second Year Diploma</h3>
                <ul className="vm-list">
                  {form.eligDirect2nd.map((item, i) => (
                    <li key={i}>
                      {editingElig && editingElig.field === 'eligDirect2nd' && editingElig.index === i ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            autoFocus
                            type="text"
                            value={item}
                            onChange={(e) => updateEligItem('eligDirect2nd', i, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingElig(null)}
                            placeholder="Eligibility point..."
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }}
                          />
                          <button className="btn btn-success btn-sm" onClick={() => setEditingElig(null)}>Done</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            onClick={() => setEditingElig({ field: 'eligDirect2nd', index: i })}
                            title="Click to edit"
                            style={{ flex: 1, cursor: 'pointer', color: '#555' }}
                          >
                            {item || <em style={{ color: '#aaa' }}>Empty point — click to edit</em>}
                          </span>
                          <button
                            className="member-remove-btn"
                            title="Delete"
                            onClick={() => removeEligItem('eligDirect2nd', i)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                  <li style={{ listStyle: 'none', marginTop: '6px' }}>
                    <div
                      onClick={() => addEmptyElig('eligDirect2nd')}
                      title="Add Point"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px' }}
                    >
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Point
                    </div>
                  </li>
                </ul>
              </>
            )}

            {/* Courses - Course Table */}
            {activeTab === 'courses' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Courses Offered</h4>
                <div className="fee-table-wrap">
                  <table className="fee-table" style={{ minWidth: '600px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>Sr. No.</th>
                        <th style={{ textAlign: 'left' }}>Course Name</th>
                        <th style={{ width: 110 }}>Duration</th>
                        <th style={{ width: 90 }}>Intake</th>
                        <th style={{ width: 130 }}>Direct 2nd Year</th>
                        <th style={{ width: 50 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.courseTable.map((course, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td className="fee-particular">
                            <input
                              type="text"
                              value={course.name || ''}
                              onChange={(e) => updateCourse(i, 'name', e.target.value)}
                              placeholder="Course name"
                              style={courseCellInput}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={course.duration || ''}
                              onChange={(e) => updateCourse(i, 'duration', e.target.value)}
                              placeholder="Duration"
                              style={courseCellInput}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={course.intake || ''}
                              onChange={(e) => updateCourse(i, 'intake', e.target.value)}
                              placeholder="Intake"
                              style={courseCellInput}
                            />
                          </td>
                          <td>
                            <select
                              value={course.direct2nd || 'Yes'}
                              onChange={(e) => updateCourse(i, 'direct2nd', e.target.value)}
                              style={{ ...courseCellInput, cursor: 'pointer' }}
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="member-remove-btn"
                              title="Remove course"
                              onClick={() => removeCourse(i)}
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Add Course - dashed tile inside the table */}
                      <tr>
                        <td colSpan={6} style={{ padding: '10px', background: '#fafbfc' }}>
                          <div
                            onClick={addEmptyCourse}
                            title="Add Course"
                            style={{ border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', color: '#243358', background: '#fff' }}
                          >
                            <span style={{ fontSize: '22px', lineHeight: 1 }}>+</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>Add Course</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Process - Steps */}
            {activeTab === 'process' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Process Steps</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Shown exactly like the live website — click a step to edit it.</p>

                <div className="process-steps" style={{ marginTop: '12px' }}>
                  {form.steps.map((step, i) => (
                    <div className="process-step" key={i}>
                      <div className="step-number">{i + 1}</div>
                      <div className="step-content" style={{ flex: 1 }}>
                        {editingStepIdx === i ? (
                          <>
                            <input
                              autoFocus
                              type="text"
                              value={step.title}
                              onChange={(e) => updateStep(i, 'title', e.target.value)}
                              placeholder="Step title"
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px' }}
                            />
                            <textarea
                              value={step.desc}
                              onChange={(e) => updateStep(i, 'desc', e.target.value)}
                              placeholder="Step description (optional)"
                              rows={2}
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', resize: 'vertical', marginBottom: '8px' }}
                            />
                            <button className="btn btn-success btn-sm" onClick={() => setEditingStepIdx(null)}>Done</button>
                          </>
                        ) : (
                          <>
                            <div onClick={() => setEditingStepIdx(i)} title="Click to edit" style={{ cursor: 'pointer' }}>
                              <h4>{step.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled step</em>}</h4>
                              {step.desc && <p>{step.desc}</p>}
                              {!step.desc && <p style={{ fontStyle: 'italic', color: '#aaa' }}>No description</p>}
                            </div>
                            <button
                              className="member-remove-btn"
                              title="Delete step"
                              onClick={() => removeStep(i)}
                            >
                              ×
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={addEmptyStep}
                    title="Add Step"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px', marginTop: '14px' }}
                  >
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Step
                  </div>
                </div>
              </>
            )}

            {/* First Year / Direct Second / A-CAP - Documents */}
            {(activeTab === 'first-year' || activeTab === 'direct-second' || activeTab === 'acap') && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Documents Required</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Shown exactly like the live website — click a document to edit it.</p>

                <ul className="vm-list">
                  {form.documents.map((doc, i) => (
                    <li key={i}>
                      {editingDocIdx === i ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            autoFocus
                            type="text"
                            value={doc}
                            onChange={(e) => updateDoc(i, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingDocIdx(null)}
                            placeholder="Document name..."
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }}
                          />
                          <button className="btn btn-success btn-sm" onClick={() => setEditingDocIdx(null)}>Done</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            onClick={() => setEditingDocIdx(i)}
                            title="Click to edit"
                            style={{ flex: 1, cursor: 'pointer', color: '#555' }}
                          >
                            {doc || <em style={{ color: '#aaa' }}>Empty document — click to edit</em>}
                          </span>
                          <button
                            className="member-remove-btn"
                            title="Delete"
                            onClick={() => removeDoc(i)}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                  <li style={{ listStyle: 'none', marginTop: '6px' }}>
                    <div
                      onClick={addEmptyDoc}
                      title="Add Document"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '8px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px' }}
                    >
                      <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Document
                    </div>
                  </li>
                </ul>
              </>
            )}

            {/* Scholarships - frontend-style categories */}
            {activeTab === 'scholarships' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Scholarship Categories</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 16px' }}>Shown exactly like the live website — click a category name to edit it.</p>

                {form.scholarshipDocs.map((cat, catIdx) => (
                  <div key={catIdx} style={{ marginBottom: '24px', paddingBottom: '18px', borderBottom: catIdx < form.scholarshipDocs.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                    {editingScholCatIdx === catIdx ? (
                      <>
                        <input
                          autoFocus
                          type="text"
                          value={cat.category}
                          onChange={(e) => updateScholCategory(catIdx, 'category', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingScholCatIdx(null)}
                          placeholder="Category (e.g. SC, ST, OBC)"
                          style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={cat.scheme}
                            onChange={(e) => updateScholCategory(catIdx, 'scheme', e.target.value)}
                            placeholder="Scheme name (optional)"
                            style={{ flex: 1, padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px' }}
                          />
                          <button className="btn btn-success btn-sm" onClick={() => setEditingScholCatIdx(null)}>Done</button>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div onClick={() => setEditingScholCatIdx(catIdx)} title="Click to edit" style={{ flex: 1, cursor: 'pointer' }}>
                          <h3 className="content-sub-heading" style={{ margin: 0 }}>{cat.category || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled category</em>}</h3>
                          {(cat.scheme || true) && (
                            <p className="scholarship-scheme">
                              {cat.scheme ? <><strong>Scheme:</strong> {cat.scheme}</> : <em style={{ color: '#aaa' }}>No scheme — click to edit</em>}
                            </p>
                          )}
                        </div>
                        <button
                          className="member-remove-btn"
                          title="Delete category"
                          onClick={() => removeScholCategory(catIdx)}
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Docs table - editable like the live site */}
                    <div className="courses-table-wrap" style={{ marginTop: '4px' }}>
                      <table className="courses-table">
                        <thead>
                          <tr>
                            <th style={{ width: 60 }}>Sr. No.</th>
                            <th>Document</th>
                            <th>Details / Notes</th>
                            <th style={{ width: 50 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cat.docs.length === 0 && (
                            <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999', fontSize: '12.5px' }}>No documents added yet</td></tr>
                          )}
                          {cat.docs.map((doc, docIdx) => (
                            <tr key={docIdx}>
                              <td style={{ textAlign: 'center' }}>{docIdx + 1}</td>
                              <td>
                                <input
                                  type="text"
                                  value={doc.document}
                                  onChange={(e) => updateScholDoc(catIdx, docIdx, 'document', e.target.value)}
                                  placeholder="Document name"
                                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #d7dde6', borderRadius: '4px', fontSize: '12.5px' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={doc.details}
                                  onChange={(e) => updateScholDoc(catIdx, docIdx, 'details', e.target.value)}
                                  placeholder="Details / Notes"
                                  style={{ width: '100%', padding: '6px 8px', border: '1px solid #d7dde6', borderRadius: '4px', fontSize: '12.5px' }}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  className="member-remove-btn"
                                  title="Delete document"
                                  onClick={() => removeScholDoc(catIdx, docIdx)}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={4} style={{ padding: '10px', background: '#fafbfc' }}>
                              <div
                                onClick={() => addEmptyScholDoc(catIdx)}
                                title="Add Document"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}
                              >
                                <span style={{ fontSize: '17px', lineHeight: 1 }}>+</span> Add Document
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                <div
                  onClick={addEmptyScholCategory}
                  title="Add Category"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px' }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Category
                </div>
              </>
            )}

            {/* College Brochure - PDF Upload */}
            {activeTab === 'brochure' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>College Brochure PDF</h4>
                <div className="form-group">
                  <label>Upload PDF or Add Link</label>
                  <PdfUpload
                    value={form.pdfUrl}
                    onChange={(url) => handleChange('pdfUrl', url)}
                  />
                </div>
                {form.pdfUrl && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>
                      <strong>Current PDF:</strong>{' '}
                      <a href={`/api/pdf-proxy?url=${encodeURIComponent(form.pdfUrl)}`} target="_blank" style={{ color: '#243358' }}>
                        {form.pdfUrl}
                      </a>
                    </p>
                  </div>
                )}
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
                      stats: sections[activeTab].stats || [],
                      steps: sections[activeTab].steps || [],
                      documents: sections[activeTab].documents || [],
                      courseTable: sections[activeTab].courseTable || [],
                      eligFirstYear: sections[activeTab].eligFirstYear || [],
                      eligDirect2nd: sections[activeTab].eligDirect2nd || [],
                      feeRows1: sections[activeTab].feeRows1 && sections[activeTab].feeRows1.length > 0 ? sections[activeTab].feeRows1 : [...defaultFeeRows],
                      feeRows2: sections[activeTab].feeRows2 && sections[activeTab].feeRows2.length > 0 ? sections[activeTab].feeRows2 : [...defaultFeeRows],
                      pdfUrl: sections[activeTab].pdfUrl || '',
                      scholarshipDocs: sections[activeTab].scholarshipDocs || [],
                      subSections: sections[activeTab].subSections || [],
                      active: sections[activeTab].active !== false,
                    });
                  } else {
                    setForm({ ...defaultSection });
                  }
                  setMsg(null);
                  resetListInputs();
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

export default AdminAdmissions;
