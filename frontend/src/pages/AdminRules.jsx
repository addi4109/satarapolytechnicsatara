import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

const defaultForm = {
  title: 'College Rules & Regulations',
  description: '',
  rules: [],
  active: true,
};

function AdminRules() {
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => { fetchRules(); }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_URL}/rules`);
      const data = await res.json();
      if (data && data._id) {
        setForm({
          title: data.title || 'College Rules & Regulations',
          description: data.description || '',
          rules: data.rules || [],
          active: data.active !== false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setForm({
        title: saved.title || 'College Rules & Regulations',
        description: saved.description || '',
        rules: saved.rules || [],
        active: saved.active !== false,
      });
      setEditing(false);
      setMsg({ type: 'success', text: 'Rules saved successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const addRule = () => {
    setForm({ ...form, rules: [...form.rules, { ruleTitle: '', ruleDesc: '' }] });
  };

  const removeRule = (idx) => {
    setForm({ ...form, rules: form.rules.filter((_, i) => i !== idx) });
  };

  const updateRule = (idx, field, value) => {
    const updated = [...form.rules];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, rules: updated });
  };

  if (loading) {
    return <AdminLayout><div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Rules & Regulations</h1>
      </div>
      <div className="admin-content">
        {msg && (
          <div className={`alert alert-${msg.type}`} style={{ marginBottom: '16px' }}>
            {msg.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMsg(null)}>x</button>
          </div>
        )}

        {editing ? (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>Editing — make changes then save</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { fetchRules(); setEditing(false); }}>Cancel</button>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-body">
                {/* Title */}
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px', display: 'block' }}>Section Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="College Rules & Regulations" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px', display: 'block' }}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Write an overview of the rules and regulations..." rows={4} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />

                {/* Rules */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: 0 }}>Rules ({form.rules.length})</label>
                    <button className="btn btn-success btn-sm" onClick={addRule}>+ Add Rule</button>
                  </div>

                  {form.rules.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #b9c3d4', borderRadius: '8px', color: '#888', fontSize: '13px' }}>
                      No rules yet. Click "+ Add Rule" to create one.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {form.rules.map((rule, i) => (
                        <div key={i} style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '14px 16px', position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#d4a54a' }}>Rule {i + 1}</span>
                            <button onClick={() => removeRule(i)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }} title="Remove rule">×</button>
                          </div>
                          <input type="text" value={rule.ruleTitle} onChange={(e) => updateRule(i, 'ruleTitle', e.target.value)} placeholder="Rule title (e.g. Attendance Policy)" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box', fontWeight: 600 }} />
                          <textarea value={rule.ruleDesc} onChange={(e) => updateRule(i, 'ruleDesc', e.target.value)} placeholder="Rule description..." rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: '#888' }}>Preview — matches the live website</span>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit</button>
            </div>

            <div className="admin-card">
              <div className="admin-card-body">
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#2a5a8a', marginBottom: '8px' }}>{form.title}</h2>
                <div style={{ width: '60px', height: '3px', background: '#d4a54a', marginBottom: '16px', borderRadius: '2px' }}></div>

                {form.description && (
                  <p style={{ marginBottom: '20px', lineHeight: '1.7', color: '#555', fontSize: '14px' }}>{form.description}</p>
                )}

                {form.rules.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {form.rules.map((rule, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e8eaed' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2a5a8a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>{i + 1}</div>
                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#2a5a8a' }}>{rule.ruleTitle || `Rule ${i + 1}`}</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{rule.ruleDesc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#888', fontStyle: 'italic' }}>No rules added yet. Click Edit to add rules.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminRules;
