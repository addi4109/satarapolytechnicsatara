import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import PdfUpload from '../components/PdfUpload';
import './Academics.css';
import './Admin.css';

const API_URL = '/api';

const cellInput = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #d7dde6',
  borderRadius: '4px',
  fontSize: '12.5px',
  boxSizing: 'border-box',
};

const SECTIONS = [
  { key: 'schedule', label: 'Exam Schedule' },
  { key: 'rules', label: 'Exam Rules' },
  { key: 'results', label: 'Results' },
  { key: 'revaluation', label: 'Revaluation' },
  { key: 'notices', label: 'Exam Notices' },
];

const defaultForm = {
  title: '',
  content: '',
  schedules: [],
  rules: [],
  ruleSubSections: [],
  resultsData: [],
  revaluationSteps: [],
  revaluationFee: '',
  revaluationDeadline: '',
  noticesData: [],
  resultPortalUrl: '',
  active: true,
};

function AdminExaminations() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // Inline editing state - frontend-style editors
  const [editingRuleIdx, setEditingRuleIdx] = useState(null);
  const [editingRevStepIdx, setEditingRevStepIdx] = useState(null);
  const [editingSubSectionIdx, setEditingSubSectionIdx] = useState(null);
  const [editingSubSectionRuleIdx, setEditingSubSectionRuleIdx] = useState(null);

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/examinations`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch examinations:', err);
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
        schedules: existing.schedules || [],
        rules: existing.rules || [],
        ruleSubSections: existing.ruleSubSections || [],
        resultsData: existing.resultsData || [],
        revaluationSteps: existing.revaluationSteps || [],
        revaluationFee: existing.revaluationFee || '',
        revaluationDeadline: existing.revaluationDeadline || '',
        noticesData: existing.noticesData || [],
        resultPortalUrl: existing.resultPortalUrl || '',
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultForm });
    }
    setMsg(null);
    resetInputs();
  }, [activeTab, sections]);

  const resetInputs = () => {
    setEditingRuleIdx(null);
    setEditingRevStepIdx(null);
    setEditingSubSectionIdx(null);
    setEditingSubSectionRuleIdx(null);
  };

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/examinations`, {
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
      await fetch(`${API_URL}/examinations/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultForm });
      setMsg({ type: 'success', text: 'Deleted successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // Generic editable-row helpers
  const addEmptyRow = (field, empty) => {
    handleChange(field, [...form[field], { ...empty }]);
  };

  const updateRow = (field, index, key, value) => {
    const rows = [...form[field]];
    rows[index] = { ...rows[index], [key]: value };
    handleChange(field, rows);
  };

  const removeRow = (field, index) => {
    handleChange(field, form[field].filter((_, i) => i !== index));
  };

  // Rules - inline card editing
  const addEmptyRule = () => {
    addEmptyRow('rules', { title: '', description: '', subPoints: [] });
    setEditingRuleIdx(form.rules.length);
  };

  // Sub-points helpers
  const addSubPoint = (ruleIdx) => {
    const rows = [...form.rules];
    rows[ruleIdx] = { ...rows[ruleIdx], subPoints: [...(rows[ruleIdx].subPoints || []), ''] };
    handleChange('rules', rows);
  };

  const updateSubPoint = (ruleIdx, spIdx, value) => {
    const rows = [...form.rules];
    const sp = [...rows[ruleIdx].subPoints];
    sp[spIdx] = value;
    rows[ruleIdx] = { ...rows[ruleIdx], subPoints: sp };
    handleChange('rules', rows);
  };

  const removeSubPoint = (ruleIdx, spIdx) => {
    const rows = [...form.rules];
    rows[ruleIdx] = { ...rows[ruleIdx], subPoints: rows[ruleIdx].subPoints.filter((_, i) => i !== spIdx) };
    handleChange('rules', rows);
  };

  // ===== Sub-Section helpers =====
  const addEmptySubSection = () => {
    const sections = [...(form.ruleSubSections || []), { subTitle: '', rules: [] }];
    handleChange('ruleSubSections', sections);
    setEditingSubSectionIdx(sections.length - 1);
    setEditingSubSectionRuleIdx(null);
  };

  const updateSubSectionTitle = (ssIdx, value) => {
    const sections = [...form.ruleSubSections];
    sections[ssIdx] = { ...sections[ssIdx], subTitle: value };
    handleChange('ruleSubSections', sections);
  };

  const removeSubSection = (ssIdx) => {
    handleChange('ruleSubSections', form.ruleSubSections.filter((_, i) => i !== ssIdx));
    setEditingSubSectionIdx(null);
    setEditingSubSectionRuleIdx(null);
  };

  const addRuleToSubSection = (ssIdx) => {
    const sections = [...form.ruleSubSections];
    sections[ssIdx] = { ...sections[ssIdx], rules: [...sections[ssIdx].rules, { title: '', description: '', subPoints: [] }] };
    handleChange('ruleSubSections', sections);
    setEditingSubSectionRuleIdx(sections[ssIdx].rules.length - 1);
  };

  const updateSubSectionRule = (ssIdx, rIdx, key, value) => {
    const sections = [...form.ruleSubSections];
    const rules = [...sections[ssIdx].rules];
    rules[rIdx] = { ...rules[rIdx], [key]: value };
    sections[ssIdx] = { ...sections[ssIdx], rules };
    handleChange('ruleSubSections', sections);
  };

  const removeSubSectionRule = (ssIdx, rIdx) => {
    const sections = [...form.ruleSubSections];
    sections[ssIdx] = { ...sections[ssIdx], rules: sections[ssIdx].rules.filter((_, i) => i !== rIdx) };
    handleChange('ruleSubSections', sections);
  };

  const addSubPointToSubSectionRule = (ssIdx, rIdx) => {
    const sections = [...form.ruleSubSections];
    const rules = [...sections[ssIdx].rules];
    rules[rIdx] = { ...rules[rIdx], subPoints: [...(rules[rIdx].subPoints || []), ''] };
    sections[ssIdx] = { ...sections[ssIdx], rules };
    handleChange('ruleSubSections', sections);
  };

  const updateSubPointInSubSectionRule = (ssIdx, rIdx, spIdx, value) => {
    const sections = [...form.ruleSubSections];
    const rules = [...sections[ssIdx].rules];
    const sp = [...rules[rIdx].subPoints];
    sp[spIdx] = value;
    rules[rIdx] = { ...rules[rIdx], subPoints: sp };
    sections[ssIdx] = { ...sections[ssIdx], rules };
    handleChange('ruleSubSections', sections);
  };

  const removeSubPointFromSubSectionRule = (ssIdx, rIdx, spIdx) => {
    const sections = [...form.ruleSubSections];
    const rules = [...sections[ssIdx].rules];
    rules[rIdx] = { ...rules[rIdx], subPoints: rules[rIdx].subPoints.filter((_, i) => i !== spIdx) };
    sections[ssIdx] = { ...sections[ssIdx], rules };
    handleChange('ruleSubSections', sections);
  };

  // Revaluation steps - inline card editing
  const addEmptyRevStep = () => {
    addEmptyRow('revaluationSteps', { title: '', description: '' });
    setEditingRevStepIdx(form.revaluationSteps.length);
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
        <h1>Examination</h1>
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
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

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

            {/* ===== SCHEDULE TAB ===== */}
            {activeTab === 'schedule' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Exam Schedule</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Shown exactly like the live website — edit directly in the table.</p>
                <div className="fee-table-wrap">
                  <table className="fee-table" style={{ minWidth: '680px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr. No.</th>
                        <th style={{ textAlign: 'left' }}>Exam Name</th>
                        <th style={{ width: 100 }}>Semester</th>
                        <th style={{ width: 120 }}>Start Date</th>
                        <th style={{ width: 120 }}>End Date</th>
                        <th style={{ width: 130 }}>PDF</th>
                        <th style={{ width: 50 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.schedules.map((s, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td><input type="text" value={s.examName} onChange={(e) => updateRow('schedules', i, 'examName', e.target.value)} placeholder="Exam Name" style={cellInput} /></td>
                          <td><input type="text" value={s.semester} onChange={(e) => updateRow('schedules', i, 'semester', e.target.value)} placeholder="Semester" style={cellInput} /></td>
                          <td><input type="text" value={s.startDate} onChange={(e) => updateRow('schedules', i, 'startDate', e.target.value)} placeholder="01/06/2026" style={cellInput} /></td>
                          <td><input type="text" value={s.endDate} onChange={(e) => updateRow('schedules', i, 'endDate', e.target.value)} placeholder="15/06/2026" style={cellInput} /></td>
                          <td style={{ textAlign: 'center' }}>
                            <PdfUpload compact value={s.pdfUrl || ''} onChange={(url) => updateRow('schedules', i, 'pdfUrl', url)} />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="member-remove-btn" title="Delete" onClick={() => removeRow('schedules', i)}>×</button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={7} style={{ padding: '10px', background: '#fafbfc' }}>
                          <div
                            onClick={() => addEmptyRow('schedules', { examName: '', semester: '', department: '', startDate: '', endDate: '', pdfUrl: '' })}
                            title="Add Schedule"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}
                          >
                            <span style={{ fontSize: '17px', lineHeight: 1 }}>+</span> Add Schedule
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ===== RULES TAB ===== */}
            {activeTab === 'rules' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Exam Rules</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Add sub-sections with titles, then add rules under each sub-section.</p>

                {/* Sub-Sections */}
                {(form.ruleSubSections || []).map((subSection, ssIdx) => (
                  <div key={ssIdx} style={{ marginBottom: '18px', padding: '16px', background: '#fff', border: editingSubSectionIdx === ssIdx ? '2px solid #c8963e' : '1px solid #e4e8ed', borderRadius: '8px' }}>
                    {/* Sub-Section Header */}
                    {editingSubSectionIdx === ssIdx ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <input
                          autoFocus
                          type="text"
                          value={subSection.subTitle}
                          onChange={(e) => updateSubSectionTitle(ssIdx, e.target.value)}
                          placeholder="Sub-section title (e.g. General Rules, Exam Hall Rules)"
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box' }}
                        />
                        <button className="btn btn-success btn-sm" onClick={() => { setEditingSubSectionIdx(null); setEditingSubSectionRuleIdx(null); }}>Done</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4
                          onClick={() => setEditingSubSectionIdx(ssIdx)}
                          style={{ margin: 0, color: '#243358', fontSize: '20px', cursor: 'pointer', flex: 1 }}
                        >
                          <span style={{ color: '#7A263A', marginRight: '8px' }}>§{ssIdx + 1}</span>
                          {subSection.subTitle || <em style={{ fontWeight: 400, color: '#aaa' }}>Untitled sub-section</em>}
                        </h4>
                        <button
                          className="member-remove-btn"
                          title="Delete sub-section"
                          onClick={() => removeSubSection(ssIdx)}
                        >×</button>
                      </div>
                    )}

                    {/* Rules inside this sub-section */}
                    {subSection.rules.map((rule, rIdx) => (
                      <div key={rIdx} style={{ position: 'relative', marginBottom: '10px', padding: '12px 14px', background: '#f8f9fa', border: editingSubSectionRuleIdx === rIdx && editingSubSectionIdx === ssIdx ? '1px solid #c8963e' : '1px solid #e8ecf0', borderRadius: '6px', marginLeft: '12px' }}>
                        {editingSubSectionRuleIdx === rIdx && editingSubSectionIdx === ssIdx ? (
                          <>
                            <input
                              type="text"
                              value={rule.title}
                              onChange={(e) => updateSubSectionRule(ssIdx, rIdx, 'title', e.target.value)}
                              placeholder="Rule title"
                              style={{ width: '100%', padding: '6px 10px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }}
                            />
                            <textarea
                              value={rule.description}
                              onChange={(e) => updateSubSectionRule(ssIdx, rIdx, 'description', e.target.value)}
                              placeholder="Rule description"
                              rows={2}
                              style={{ width: '100%', padding: '6px 10px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }}
                            />
                            {/* Sub-points */}
                            <div style={{ marginBottom: '8px' }}>
                              <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Sub-Points (bullet dots)</label>
                              {(rule.subPoints || []).map((sp, spIdx) => (
                                <div key={spIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                  <span style={{ color: '#7A263A', fontWeight: 700, fontSize: '13px' }}>•</span>
                                  <input
                                    type="text"
                                    value={sp}
                                    onChange={(e) => updateSubPointInSubSectionRule(ssIdx, rIdx, spIdx, e.target.value)}
                                    placeholder="Sub-point text"
                                    style={{ flex: 1, padding: '4px 8px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }}
                                  />
                                  <button
                                    onClick={() => removeSubPointFromSubSectionRule(ssIdx, rIdx, spIdx)}
                                    style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '15px', fontWeight: 700, padding: '0 3px' }}
                                    title="Remove"
                                  >×</button>
                                </div>
                              ))}
                              <button
                                onClick={() => addSubPointToSubSectionRule(ssIdx, rIdx)}
                                style={{ marginTop: '3px', background: 'none', border: '1px dashed #b9c3d4', borderRadius: '3px', padding: '3px 10px', cursor: 'pointer', color: '#243358', fontSize: '11px', fontWeight: 600 }}
                              >+ Add Sub-Point</button>
                            </div>
                            <button className="btn btn-success btn-sm" onClick={() => setEditingSubSectionRuleIdx(null)}>Done</button>
                          </>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div
                              onClick={() => { setEditingSubSectionIdx(ssIdx); setEditingSubSectionRuleIdx(rIdx); }}
                              title="Click to edit"
                              style={{ cursor: 'pointer', flex: 1 }}
                            >
                              <h5 style={{ margin: '0 0 4px', color: '#243358', fontSize: '17px' }}>
                                <span style={{ color: '#7A263A', marginRight: '6px' }}>Rule {rIdx + 1}:</span>
                                {rule.title || <em style={{ fontWeight: 400, color: '#aaa' }}>Untitled rule</em>}
                              </h5>
                              {rule.description && (
                                <p style={{ margin: '0 0 4px', color: '#555', fontSize: '15px', lineHeight: '1.5' }}>{rule.description}</p>
                              )}
                              {rule.subPoints && rule.subPoints.length > 0 && (
                                <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                                  {rule.subPoints.map((sp, spIdx) => (
                                    <li key={spIdx} style={{ color: '#555', fontSize: '14px', lineHeight: '1.5', marginBottom: '1px' }}>{sp}</li>
                                  ))}
                                </ul>
                              )}
                              {!rule.description && (!rule.subPoints || rule.subPoints.length === 0) && (
                                <p style={{ margin: 0, color: '#aaa', fontStyle: 'italic', fontSize: '12px' }}>No description or sub-points</p>
                              )}
                            </div>
                            <button
                              className="member-remove-btn"
                              title="Delete rule"
                              onClick={() => removeSubSectionRule(ssIdx, rIdx)}
                            >×</button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add rule to this sub-section */}
                    <div style={{ marginLeft: '12px', marginTop: '6px' }}>
                      <div
                        onClick={() => addRuleToSubSection(ssIdx)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px dashed #b9c3d4', borderRadius: '5px', padding: '5px 14px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}
                      >
                        <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span> Add Rule
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  onClick={addEmptySubSection}
                  title="Add Sub-Section"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px' }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Sub-Section
                </div>
              </>
            )}

            {/* ===== RESULTS TAB ===== */}
            {activeTab === 'results' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Result Portal Button</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>One single link — the button on the website opens this URL.</p>

                <div className="form-group">
                  <label>Button Link (Result Portal URL)</label>
                  <input
                    type="text"
                    value={form.resultPortalUrl}
                    onChange={(e) => handleChange('resultPortalUrl', e.target.value)}
                    placeholder="https://results.example.com/..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Live preview of the whole section - exactly like the website */}
                <div style={{ marginTop: '4px', padding: '28px 28px 32px', background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', margin: '0 0 18px', textAlign: 'center' }}>Live Preview — how this section looks on the website</p>
                  <div className="about-content">
                    <h2 className="content-heading">{form.title || 'Results'}</h2>
                    <div className="content-line"></div>
                    {form.content ? (
                      form.content.split('\n').filter((p) => p.trim()).map((para, i) => <p key={i}>{para}</p>)
                    ) : (
                      <p style={{ color: '#888' }}>No content available. Add details from admin panel.</p>
                    )}

                    {form.resultPortalUrl ? (
                      <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <a
                          href={form.resultPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '12px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}
                        >
                          View Result Portal →
                        </a>
                      </div>
                    ) : (
                      <p style={{ color: '#888', marginTop: '20px' }}>Result portal link will be available soon.</p>
                    )}
                  </div>
                  {form.resultPortalUrl && (
                    <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#666', wordBreak: 'break-all', textAlign: 'center' }}>{form.resultPortalUrl}</p>
                  )}
                </div>
              </>
            )}

            {/* ===== REVALUATION TAB ===== */}
            {activeTab === 'revaluation' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Revaluation Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label>Revaluation Fee</label>
                    <input type="text" value={form.revaluationFee} onChange={(e) => handleChange('revaluationFee', e.target.value)} placeholder="e.g. ₹500 per subject" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div className="form-group">
                    <label>Last Date to Apply</label>
                    <input type="text" value={form.revaluationDeadline} onChange={(e) => handleChange('revaluationDeadline', e.target.value)} placeholder="e.g. 30/06/2026" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <h4 style={{ margin: '12px 0', color: '#243358', fontSize: '15px' }}>Revaluation Process Steps</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Shown exactly like the live website — click a step to edit it.</p>

                <div className="process-steps" style={{ marginTop: '8px' }}>
                  {form.revaluationSteps.map((step, i) => (
                    <div className="process-step" key={i}>
                      <div className="step-number">{i + 1}</div>
                      <div className="step-content" style={{ flex: 1 }}>
                        {editingRevStepIdx === i ? (
                          <>
                            <input
                              autoFocus
                              type="text"
                              value={step.title}
                              onChange={(e) => updateRow('revaluationSteps', i, 'title', e.target.value)}
                              placeholder="Step title"
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', marginBottom: '6px' }}
                            />
                            <textarea
                              value={step.description}
                              onChange={(e) => updateRow('revaluationSteps', i, 'description', e.target.value)}
                              placeholder="Step description (optional)"
                              rows={2}
                              style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', resize: 'vertical', marginBottom: '8px' }}
                            />
                            <button className="btn btn-success btn-sm" onClick={() => setEditingRevStepIdx(null)}>Done</button>
                          </>
                        ) : (
                          <>
                            <div onClick={() => setEditingRevStepIdx(i)} title="Click to edit" style={{ cursor: 'pointer' }}>
                              <h4>{step.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled step</em>}</h4>
                              {step.description && <p>{step.description}</p>}
                              {!step.description && <p style={{ fontStyle: 'italic', color: '#aaa' }}>No description</p>}
                            </div>
                            <button
                              className="member-remove-btn"
                              title="Delete step"
                              onClick={() => removeRow('revaluationSteps', i)}
                            >
                              ×
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={addEmptyRevStep}
                    title="Add Step"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px', marginTop: '14px' }}
                  >
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Step
                  </div>
                </div>
              </>
            )}

            {/* ===== NOTICES TAB ===== */}
            {activeTab === 'notices' && (
              <>
                <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Exam Notices</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Shown exactly like the live website — edit directly in the table.</p>
                <div className="fee-table-wrap">
                  <table className="fee-table" style={{ minWidth: '680px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr. No.</th>
                        <th style={{ textAlign: 'left' }}>Title</th>
                        <th style={{ width: 110 }}>Date</th>
                        <th style={{ textAlign: 'left' }}>Description</th>
                        <th style={{ width: 120 }}>PDF</th>
                        <th style={{ width: 50 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.noticesData.map((n, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td><input type="text" value={n.title} onChange={(e) => updateRow('noticesData', i, 'title', e.target.value)} placeholder="Notice Title" style={cellInput} /></td>
                          <td><input type="text" value={n.date} onChange={(e) => updateRow('noticesData', i, 'date', e.target.value)} placeholder="15/06/2026" style={cellInput} /></td>
                          <td><input type="text" value={n.description} onChange={(e) => updateRow('noticesData', i, 'description', e.target.value)} placeholder="Short description (optional)" style={cellInput} /></td>
                          <td style={{ textAlign: 'center' }}>
                            <PdfUpload compact value={n.pdfUrl || ''} onChange={(url) => updateRow('noticesData', i, 'pdfUrl', url)} />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="member-remove-btn" title="Delete" onClick={() => removeRow('noticesData', i)}>×</button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={6} style={{ padding: '10px', background: '#fafbfc' }}>
                          <div
                            onClick={() => addEmptyRow('noticesData', { title: '', date: '', description: '', pdfUrl: '' })}
                            title="Add Notice"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}
                          >
                            <span style={{ fontSize: '17px', lineHeight: 1 }}>+</span> Add Notice
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ===== ACTIONS ===== */}
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
                      schedules: sections[activeTab].schedules || [],
                      rules: sections[activeTab].rules || [],
                      ruleSubSections: sections[activeTab].ruleSubSections || [],
                      resultsData: sections[activeTab].resultsData || [],
                      revaluationSteps: sections[activeTab].revaluationSteps || [],
                      revaluationFee: sections[activeTab].revaluationFee || '',
                      revaluationDeadline: sections[activeTab].revaluationDeadline || '',
                      noticesData: sections[activeTab].noticesData || [],
                      resultPortalUrl: sections[activeTab].resultPortalUrl || '',
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
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminExaminations;
