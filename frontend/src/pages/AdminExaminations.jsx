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

  // Inline editing state
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
      setMsg({ type: 'success', text: 'Saved!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this section?')) return;
    try {
      await fetch(`${API_URL}/examinations/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultForm });
      setMsg({ type: 'success', text: 'Deleted.' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // Generic helpers
  const addEmptyRow = (field, empty) => handleChange(field, [...form[field], { ...empty }]);
  const updateRow = (field, i, key, val) => { const r = [...form[field]]; r[i] = { ...r[i], [key]: val }; handleChange(field, r); };
  const removeRow = (field, i) => handleChange(field, form[field].filter((_, idx) => idx !== i));

  // Rules helpers
  const addEmptyRule = () => { addEmptyRow('rules', { title: '', description: '', subPoints: [] }); setEditingRuleIdx(form.rules.length); };
  const addSubPoint = (ruleIdx) => { const r = [...form.rules]; r[ruleIdx] = { ...r[ruleIdx], subPoints: [...(r[ruleIdx].subPoints || []), ''] }; handleChange('rules', r); };
  const updateSubPoint = (ruleIdx, spIdx, val) => { const r = [...form.rules]; const sp = [...r[ruleIdx].subPoints]; sp[spIdx] = val; r[ruleIdx] = { ...r[ruleIdx], subPoints: sp }; handleChange('rules', r); };
  const removeSubPoint = (ruleIdx, spIdx) => { const r = [...form.rules]; r[ruleIdx] = { ...r[ruleIdx], subPoints: r[ruleIdx].subPoints.filter((_, i) => i !== spIdx) }; handleChange('rules', r); };

  // Sub-section helpers
  const addEmptySubSection = () => { const s = [...(form.ruleSubSections || []), { subTitle: '', rules: [] }]; handleChange('ruleSubSections', s); setEditingSubSectionIdx(s.length - 1); setEditingSubSectionRuleIdx(null); };
  const updateSubSectionTitle = (ssIdx, val) => { const s = [...form.ruleSubSections]; s[ssIdx] = { ...s[ssIdx], subTitle: val }; handleChange('ruleSubSections', s); };
  const removeSubSection = (ssIdx) => { handleChange('ruleSubSections', form.ruleSubSections.filter((_, i) => i !== ssIdx)); setEditingSubSectionIdx(null); setEditingSubSectionRuleIdx(null); };
  const addRuleToSubSection = (ssIdx) => { const s = [...form.ruleSubSections]; s[ssIdx] = { ...s[ssIdx], rules: [...s[ssIdx].rules, { title: '', description: '', subPoints: [] }] }; handleChange('ruleSubSections', s); setEditingSubSectionRuleIdx(s[ssIdx].rules.length - 1); };
  const updateSubSectionRule = (ssIdx, rIdx, key, val) => { const s = [...form.ruleSubSections]; const r = [...s[ssIdx].rules]; r[rIdx] = { ...r[rIdx], [key]: val }; s[ssIdx] = { ...s[ssIdx], rules }; handleChange('ruleSubSections', s); };
  const removeSubSectionRule = (ssIdx, rIdx) => { const s = [...form.ruleSubSections]; s[ssIdx] = { ...s[ssIdx], rules: s[ssIdx].rules.filter((_, i) => i !== rIdx) }; handleChange('ruleSubSections', s); };
  const addSubPointToSubSectionRule = (ssIdx, rIdx) => { const s = [...form.ruleSubSections]; const r = [...s[ssIdx].rules]; r[rIdx] = { ...r[rIdx], subPoints: [...(r[rIdx].subPoints || []), ''] }; s[ssIdx] = { ...s[ssIdx], rules }; handleChange('ruleSubSections', s); };
  const updateSubPointInSubSectionRule = (ssIdx, rIdx, spIdx, val) => { const s = [...form.ruleSubSections]; const r = [...s[ssIdx].rules]; const sp = [...r[rIdx].subPoints]; sp[spIdx] = val; r[rIdx] = { ...r[rIdx], subPoints: sp }; s[ssIdx] = { ...s[ssIdx], rules }; handleChange('ruleSubSections', s); };
  const removeSubPointFromSubSectionRule = (ssIdx, rIdx, spIdx) => { const s = [...form.ruleSubSections]; const r = [...s[ssIdx].rules]; r[rIdx] = { ...r[rIdx], subPoints: r[rIdx].subPoints.filter((_, i) => i !== spIdx) }; s[ssIdx] = { ...s[ssIdx], rules }; handleChange('ruleSubSections', s); };

  // Revaluation helpers
  const addEmptyRevStep = () => { addEmptyRow('revaluationSteps', { title: '', description: '', subPoints: [] }); setEditingRevStepIdx(form.revaluationSteps.length); };
  const addRevStepSubPoint = (stepIdx) => { const r = [...form.revaluationSteps]; r[stepIdx] = { ...r[stepIdx], subPoints: [...(r[stepIdx].subPoints || []), ''] }; handleChange('revaluationSteps', r); };
  const updateRevStepSubPoint = (stepIdx, spIdx, val) => { const r = [...form.revaluationSteps]; const sp = [...r[stepIdx].subPoints]; sp[spIdx] = val; r[stepIdx] = { ...r[stepIdx], subPoints: sp }; handleChange('revaluationSteps', r); };
  const removeRevStepSubPoint = (stepIdx, spIdx) => { const r = [...form.revaluationSteps]; r[stepIdx] = { ...r[stepIdx], subPoints: r[stepIdx].subPoints.filter((_, i) => i !== spIdx) }; handleChange('revaluationSteps', r); };

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  if (loading) {
    return <AdminLayout><div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="admin-topbar"><h1>Examination</h1></div>

      <div className="admin-content">
        {/* Tabs */}
        <div className="about-admin-tabs">
          {SECTIONS.map((sec) => (
            <button key={sec.key} className={`about-admin-tab ${activeTab === sec.key ? 'active' : ''}`} onClick={() => setActiveTab(sec.key)}>
              {sec.label}
              {sections[sec.key] && <span className="about-tab-saved">Saved</span>}
            </button>
          ))}
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <h2 style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', fontSize: '22px', color: '#243358' }}>{currentSection?.label}</h2>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{activeTab === 'schedule' ? 'Exam Schedule' : activeTab === 'rules' ? 'Exam Rules' : activeTab === 'results' ? 'Result Portal' : activeTab === 'revaluation' ? 'Revaluation Details' : 'Exam Notices'}</h3>
            {sections[activeTab] && <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>}
          </div>
          <div className="admin-card-body">

            {/* ===== SCHEDULE TAB ===== */}
            {activeTab === 'schedule' && (
              <>
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Exam Schedule Table</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Click a row to edit. Add exam name, semester, dates, and upload PDF.</p>
                <div className="fee-table-wrap">
                  <table className="fee-table" style={{ minWidth: '680px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr.</th>
                        <th style={{ textAlign: 'left' }}>Exam Name</th>
                        <th style={{ width: 100 }}>Semester</th>
                        <th style={{ width: 120 }}>Start Date</th>
                        <th style={{ width: 120 }}>End Date</th>
                        <th style={{ width: 130 }}>PDF</th>
                        <th style={{ width: 50 }}></th>
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
                          <td style={{ textAlign: 'center' }}><PdfUpload compact value={s.pdfUrl || ''} onChange={(url) => updateRow('schedules', i, 'pdfUrl', url)} /></td>
                          <td style={{ textAlign: 'center' }}><button className="member-remove-btn" onClick={() => removeRow('schedules', i)}>×</button></td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={7} style={{ padding: '10px', background: '#fafbfc' }}>
                          <div onClick={() => addEmptyRow('schedules', { examName: '', semester: '', startDate: '', endDate: '', pdfUrl: '' })} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}>
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
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Exam Rules & Sub-Sections</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Add sub-sections with titles, then add rules under each.</p>

                {(form.ruleSubSections || []).map((subSection, ssIdx) => (
                  <div key={ssIdx} style={{ marginBottom: '18px', padding: '16px', background: '#fff', border: editingSubSectionIdx === ssIdx ? '2px solid #c8963e' : '1px solid #e4e8ed', borderRadius: '8px' }}>
                    {editingSubSectionIdx === ssIdx ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                        <input autoFocus type="text" value={subSection.subTitle} onChange={(e) => updateSubSectionTitle(ssIdx, e.target.value)} placeholder="Sub-section title" style={{ flex: 1, padding: '8px 12px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '14px', fontWeight: 600, boxSizing: 'border-box' }} />
                        <button className="btn btn-success btn-sm" onClick={() => { setEditingSubSectionIdx(null); setEditingSubSectionRuleIdx(null); }}>Done</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 onClick={() => setEditingSubSectionIdx(ssIdx)} style={{ margin: 0, color: '#243358', fontSize: '20px', cursor: 'pointer', flex: 1 }}>
                          <span style={{ color: '#7A263A', marginRight: '8px' }}>§{ssIdx + 1}</span>
                          {subSection.subTitle || <em style={{ fontWeight: 400, color: '#aaa' }}>Untitled</em>}
                        </h4>
                        <button className="member-remove-btn" onClick={() => removeSubSection(ssIdx)}>×</button>
                      </div>
                    )}

                    {subSection.rules.map((rule, rIdx) => (
                      <div key={rIdx} style={{ position: 'relative', marginBottom: '10px', padding: '12px 14px', background: '#f8f9fa', border: editingSubSectionRuleIdx === rIdx && editingSubSectionIdx === ssIdx ? '1px solid #c8963e' : '1px solid #e8ecf0', borderRadius: '6px', marginLeft: '12px' }}>
                        {editingSubSectionRuleIdx === rIdx && editingSubSectionIdx === ssIdx ? (
                          <>
                            <input type="text" value={rule.title} onChange={(e) => updateSubSectionRule(ssIdx, rIdx, 'title', e.target.value)} placeholder="Rule title" style={{ width: '100%', padding: '6px 10px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }} />
                            <textarea value={rule.description} onChange={(e) => updateSubSectionRule(ssIdx, rIdx, 'description', e.target.value)} placeholder="Rule description" rows={2} style={{ width: '100%', padding: '6px 10px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }} />
                            <div style={{ marginBottom: '8px' }}>
                              <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' }}>Sub-Points</label>
                              {(rule.subPoints || []).map((sp, spIdx) => (
                                <div key={spIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                  <span style={{ color: '#7A263A', fontWeight: 700, fontSize: '13px' }}>•</span>
                                  <input type="text" value={sp} onChange={(e) => updateSubPointInSubSectionRule(ssIdx, rIdx, spIdx, e.target.value)} style={{ flex: 1, padding: '4px 8px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
                                  <button onClick={() => removeSubPointFromSubSectionRule(ssIdx, rIdx, spIdx)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '15px', fontWeight: 700, padding: '0 3px' }}>×</button>
                                </div>
                              ))}
                              <button onClick={() => addSubPointToSubSectionRule(ssIdx, rIdx)} style={{ marginTop: '3px', background: 'none', border: '1px dashed #b9c3d4', borderRadius: '3px', padding: '3px 10px', cursor: 'pointer', color: '#243358', fontSize: '11px', fontWeight: 600 }}>+ Add Sub-Point</button>
                            </div>
                            <button className="btn btn-success btn-sm" onClick={() => setEditingSubSectionRuleIdx(null)}>Done</button>
                          </>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div onClick={() => { setEditingSubSectionIdx(ssIdx); setEditingSubSectionRuleIdx(rIdx); }} style={{ cursor: 'pointer', flex: 1 }}>
                              <h5 style={{ margin: '0 0 4px', color: '#243358', fontSize: '17px' }}>
                                <span style={{ color: '#7A263A', marginRight: '6px' }}>Rule {rIdx + 1}:</span>
                                {rule.title || <em style={{ fontWeight: 400, color: '#aaa' }}>Untitled</em>}
                              </h5>
                              {rule.description && <p style={{ margin: '0 0 4px', color: '#555', fontSize: '15px', lineHeight: '1.5' }}>{rule.description}</p>}
                              {rule.subPoints && rule.subPoints.length > 0 && (
                                <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                                  {rule.subPoints.map((sp, spIdx) => <li key={spIdx} style={{ color: '#555', fontSize: '14px' }}>{sp}</li>)}
                                </ul>
                              )}
                            </div>
                            <button className="member-remove-btn" onClick={() => removeSubSectionRule(ssIdx, rIdx)}>×</button>
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ marginLeft: '12px', marginTop: '6px' }}>
                      <div onClick={() => addRuleToSubSection(ssIdx)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px dashed #b9c3d4', borderRadius: '5px', padding: '5px 14px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}>
                        <span style={{ fontSize: '15px', lineHeight: 1 }}>+</span> Add Rule
                      </div>
                    </div>
                  </div>
                ))}

                <div onClick={addEmptySubSection} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px' }}>
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Sub-Section
                </div>
              </>
            )}

            {/* ===== RESULTS TAB ===== */}
            {activeTab === 'results' && (
              <>
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Result Portal URL</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Add the result portal link. The button on the website opens this URL.</p>
                <div className="form-group">
                  <label>Result Portal Link</label>
                  <input type="text" value={form.resultPortalUrl} onChange={(e) => handleChange('resultPortalUrl', e.target.value)} placeholder="https://results.example.com/..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                {form.resultPortalUrl && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '6px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#444' }}><strong>Current:</strong> <a href={form.resultPortalUrl} target="_blank" style={{ color: '#243358' }}>{form.resultPortalUrl}</a></p>
                  </div>
                )}
              </>
            )}

            {/* ===== REVALUATION TAB ===== */}
            {activeTab === 'revaluation' && (
              <>
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Revaluation Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
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
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 4px' }}>Click a step to edit it.</p>

                <div style={{ marginTop: '8px' }}>
                  {form.revaluationSteps.map((step, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: '12px', padding: '14px', background: '#f8f9fa', border: editingRevStepIdx === i ? '2px solid #c8963e' : '1px solid #e4e8ed', borderRadius: '8px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <div className="step-number">{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        {editingRevStepIdx === i ? (
                          <>
                            <input autoFocus type="text" value={step.title} onChange={(e) => updateRow('revaluationSteps', i, 'title', e.target.value)} placeholder="Step title" style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '14px', marginBottom: '6px', boxSizing: 'border-box' }} />
                            <textarea value={step.description} onChange={(e) => updateRow('revaluationSteps', i, 'description', e.target.value)} placeholder="Description" rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid #c8963e', borderRadius: '5px', fontSize: '13px', resize: 'vertical', marginBottom: '8px', boxSizing: 'border-box' }} />
                            <div style={{ marginBottom: '10px' }}>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px', display: 'block' }}>Sub-Points</label>
                              {(step.subPoints || []).map((sp, spIdx) => (
                                <div key={spIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                  <span style={{ color: '#7A263A', fontWeight: 700 }}>•</span>
                                  <input type="text" value={sp} onChange={(e) => updateRevStepSubPoint(i, spIdx, e.target.value)} style={{ flex: 1, padding: '5px 8px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '12.5px', boxSizing: 'border-box' }} />
                                  <button onClick={() => removeRevStepSubPoint(i, spIdx)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '16px', fontWeight: 700, padding: '0 4px' }}>×</button>
                                </div>
                              ))}
                              <button onClick={() => addRevStepSubPoint(i)} style={{ marginTop: '4px', background: 'none', border: '1px dashed #b9c3d4', borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', color: '#243358', fontSize: '12px', fontWeight: 600 }}>+ Add Sub-Point</button>
                            </div>
                            <button className="btn btn-success btn-sm" onClick={() => setEditingRevStepIdx(null)}>Done</button>
                          </>
                        ) : (
                          <div onClick={() => setEditingRevStepIdx(i)} style={{ cursor: 'pointer' }}>
                            <h4 style={{ margin: '0 0 4px', color: '#243358', fontSize: '16px' }}>{step.title || <em style={{ color: '#aaa', fontWeight: 400 }}>Untitled</em>}</h4>
                            {step.description && <p style={{ margin: '0 0 4px', color: '#555', fontSize: '14px', lineHeight: '1.5' }}>{step.description}</p>}
                            {step.subPoints && step.subPoints.length > 0 && (
                              <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                                {step.subPoints.map((sp, spIdx) => <li key={spIdx} style={{ color: '#555', fontSize: '13px' }}>{sp}</li>)}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                      <button className="member-remove-btn" onClick={() => removeRow('revaluationSteps', i)} style={{ position: 'absolute', top: '10px', right: '10px' }}>×</button>
                    </div>
                  ))}
                  <div onClick={addEmptyRevStep} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '9px 18px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12.5px', marginTop: '8px' }}>
                    <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Step
                  </div>
                </div>
              </>
            )}

            {/* ===== NOTICES TAB ===== */}
            {activeTab === 'notices' && (
              <>
                <h4 style={{ margin: '0 0 12px', color: '#243358', fontSize: '15px' }}>Exam Notices</h4>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 12px' }}>Add notice title, date, description and upload PDF.</p>
                <div className="fee-table-wrap">
                  <table className="fee-table" style={{ minWidth: '680px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Sr.</th>
                        <th style={{ textAlign: 'left' }}>Title</th>
                        <th style={{ width: 110 }}>Date</th>
                        <th style={{ textAlign: 'left' }}>Description</th>
                        <th style={{ width: 120 }}>PDF</th>
                        <th style={{ width: 50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.noticesData.map((n, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td><input type="text" value={n.title} onChange={(e) => updateRow('noticesData', i, 'title', e.target.value)} placeholder="Notice Title" style={cellInput} /></td>
                          <td><input type="text" value={n.date} onChange={(e) => updateRow('noticesData', i, 'date', e.target.value)} placeholder="15/06/2026" style={cellInput} /></td>
                          <td><input type="text" value={n.description} onChange={(e) => updateRow('noticesData', i, 'description', e.target.value)} placeholder="Short description" style={cellInput} /></td>
                          <td style={{ textAlign: 'center' }}><PdfUpload compact value={n.pdfUrl || ''} onChange={(url) => updateRow('noticesData', i, 'pdfUrl', url)} /></td>
                          <td style={{ textAlign: 'center' }}><button className="member-remove-btn" onClick={() => removeRow('noticesData', i)}>×</button></td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={6} style={{ padding: '10px', background: '#fafbfc' }}>
                          <div onClick={() => addEmptyRow('noticesData', { title: '', date: '', description: '', pdfUrl: '' })} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px dashed #b9c3d4', borderRadius: '6px', padding: '7px 16px', cursor: 'pointer', color: '#243358', background: '#fff', fontWeight: 600, fontSize: '12px' }}>
                            <span style={{ fontSize: '17px', lineHeight: 1 }}>+</span> Add Notice
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Actions */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '10px 30px' }}>{saving ? 'Saving...' : 'Save'}</button>
              <button className="btn btn-secondary" onClick={() => {
                if (sections[activeTab]) {
                  setForm({ title: sections[activeTab].title || '', content: sections[activeTab].content || '', schedules: sections[activeTab].schedules || [], rules: sections[activeTab].rules || [], ruleSubSections: sections[activeTab].ruleSubSections || [], resultsData: sections[activeTab].resultsData || [], revaluationSteps: sections[activeTab].revaluationSteps || [], revaluationFee: sections[activeTab].revaluationFee || '', revaluationDeadline: sections[activeTab].revaluationDeadline || '', noticesData: sections[activeTab].noticesData || [], resultPortalUrl: sections[activeTab].resultPortalUrl || '', active: sections[activeTab].active !== false });
                } else { setForm({ ...defaultForm }); }
                setMsg(null); resetInputs();
              }}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminExaminations;
