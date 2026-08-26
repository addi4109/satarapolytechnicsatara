import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';
import { STATIC_CONTENT } from '../data/staticContent';
import './Admin.css';
import './Academics.css';
import './DepartmentsPage.css';

const API_URL = '/api';

const SECTIONS = [
  { key: 'library', label: 'Library' },
  { key: 'bus-facility', label: 'Bus Facility' },
  { key: 'canteen', label: 'Canteen' },
  { key: 'registrar', label: "Registrar's Desk" },
  { key: 'office-staff', label: 'Office Staff' },
  { key: 'non-teaching-staff', label: 'Non Teaching Staff' },
];

const defaultForm = {
  title: '',
  content: '',
  infoRows: [],
  stats: [],
  tables: [],
  rules: [],
  images: [],
  staffMembers: [],
  active: true,
};

const defaultStaff = {
  name: '',
  designation: '',
  phone: '',
  email: '',
  photoUrl: '',
};

function AdminCampus() {
  const [activeTab, setActiveTab] = useState('library');
  const [sections, setSections] = useState({});
  const [form, setForm] = useState({ ...defaultForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editing, setEditing] = useState(false);

  // Staff state
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editStaffIdx, setEditStaffIdx] = useState(null);
  const [staffForm, setStaffForm] = useState({ ...defaultStaff });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Table editing state
  const [editingTableIdx, setEditingTableIdx] = useState(null);
  const [editingCell, setEditingCell] = useState(null); // { tableIdx, rowIdx, colIdx }

  useEffect(() => { fetchSections(); }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/campus`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);
    } catch (err) {
      console.error('Failed to fetch campus:', err);
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
        infoRows: existing.infoRows || [],
        stats: existing.stats || [],
        tables: existing.tables || [],
        rules: existing.rules || [],
        images: existing.images || [],
        staffMembers: existing.staffMembers || [],
        active: existing.active !== false,
      });
    } else {
      setForm({ ...defaultForm });
    }
    setMsg(null);
    setEditing(false);
    setShowStaffForm(false);
    setEditStaffIdx(null);
    setStaffForm({ ...defaultStaff });
    setDeleteConfirm(null);
    setEditingTableIdx(null);
    setEditingCell(null);
  }, [activeTab, sections]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/campus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, section: activeTab }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, [activeTab]: saved }));
      setEditing(false);
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
      await fetch(`${API_URL}/campus/${activeTab}`, { method: 'DELETE' });
      setSections((prev) => { const u = { ...prev }; delete u[activeTab]; return u; });
      setForm({ ...defaultForm });
      setEditing(false);
      setMsg({ type: 'success', text: 'Deleted successfully!' });
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' });
    }
  };

  // ===== TABLE HELPERS =====
  const addTable = () => {
    const newTables = [...form.tables, { title: '', columns: ['Sr. No.', 'Item', 'Details'], rows: [['1', '', '']] }];
    handleChange('tables', newTables);
    setEditingTableIdx(newTables.length - 1);
  };

  const removeTable = (idx) => {
    handleChange('tables', form.tables.filter((_, i) => i !== idx));
    setEditingTableIdx(null);
  };

  const updateTableTitle = (idx, title) => {
    const t = [...form.tables];
    t[idx] = { ...t[idx], title };
    handleChange('tables', t);
  };

  const addColumn = (tableIdx) => {
    const t = [...form.tables];
    t[tableIdx] = {
      ...t[tableIdx],
      columns: [...t[tableIdx].columns, 'New Column'],
      rows: t[tableIdx].rows.map(row => [...row, '']),
    };
    handleChange('tables', t);
  };

  const removeColumn = (tableIdx, colIdx) => {
    const t = [...form.tables];
    t[tableIdx] = {
      ...t[tableIdx],
      columns: t[tableIdx].columns.filter((_, i) => i !== colIdx),
      rows: t[tableIdx].rows.map(row => row.filter((_, i) => i !== colIdx)),
    };
    handleChange('tables', t);
  };

  const updateColumnName = (tableIdx, colIdx, name) => {
    const t = [...form.tables];
    const cols = [...t[tableIdx].columns];
    cols[colIdx] = name;
    t[tableIdx] = { ...t[tableIdx], columns: cols };
    handleChange('tables', t);
  };

  const addRow = (tableIdx) => {
    const t = [...form.tables];
    const newRow = Array(t[tableIdx].columns.length).fill('');
    newRow[0] = String(t[tableIdx].rows.length + 1);
    t[tableIdx] = { ...t[tableIdx], rows: [...t[tableIdx].rows, newRow] };
    handleChange('tables', t);
  };

  const removeRow = (tableIdx, rowIdx) => {
    const t = [...form.tables];
    t[tableIdx] = { ...t[tableIdx], rows: t[tableIdx].rows.filter((_, i) => i !== rowIdx) };
    handleChange('tables', t);
  };

  const updateCell = (tableIdx, rowIdx, colIdx, value) => {
    const t = [...form.tables];
    const rows = t[tableIdx].rows.map(r => [...r]);
    rows[rowIdx][colIdx] = value;
    t[tableIdx] = { ...t[tableIdx], rows };
    handleChange('tables', t);
  };

  // ===== INFO ROW HELPERS =====
  const addInfoRow = () => handleChange('infoRows', [...form.infoRows, { label: '', value: '' }]);
  const updateInfoRow = (i, field, val) => { const r = [...form.infoRows]; r[i] = { ...r[i], [field]: val }; handleChange('infoRows', r); };
  const removeInfoRow = (i) => handleChange('infoRows', form.infoRows.filter((_, idx) => idx !== i));

  // ===== STAFF HELPERS =====
  const openAddStaff = () => { setEditStaffIdx(null); setStaffForm({ ...defaultStaff }); setShowStaffForm(true); };
  const openEditStaff = (idx) => {
    const m = form.staffMembers[idx];
    setEditStaffIdx(idx);
    setStaffForm({ name: m.name || '', designation: m.designation || '', phone: m.phone || '', email: m.email || '', photoUrl: m.photoUrl || '' });
    setShowStaffForm(true);
  };
  const cancelStaffForm = () => { setShowStaffForm(false); setEditStaffIdx(null); setStaffForm({ ...defaultStaff }); };
  const saveStaff = () => {
    if (!staffForm.name.trim()) { setMsg({ type: 'error', text: 'Name is required' }); return; }
    const updated = [...form.staffMembers];
    if (editStaffIdx !== null) updated[editStaffIdx] = { ...staffForm };
    else updated.push({ ...staffForm });
    handleChange('staffMembers', updated);
    setShowStaffForm(false);
    setEditStaffIdx(null);
    setStaffForm({ ...defaultStaff });
    setMsg({ type: 'success', text: editStaffIdx !== null ? 'Staff updated!' : 'Staff added!' });
  };
  const deleteStaff = (idx) => { handleChange('staffMembers', form.staffMembers.filter((_, i) => i !== idx)); setDeleteConfirm(null); };

  const currentSection = SECTIONS.find((s) => s.key === activeTab);

  // ===== TABLE EDITOR (used in edit mode for all sections with tables) =====
  const renderTableEditor = (table, tableIdx) => (
    <div key={tableIdx} style={{ marginBottom: '20px', background: '#fff', border: editingTableIdx === tableIdx ? '2px solid #c8963e' : '1px solid #e4e8ed', borderRadius: '10px', overflow: 'hidden' }}>
      {/* Table Header */}
      <div style={{ padding: '12px 16px', background: '#f5f7fa', borderBottom: '1px solid #e4e8ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {editingTableIdx === tableIdx ? (
          <input autoFocus type="text" value={table.title} onChange={(e) => updateTableTitle(tableIdx, e.target.value)} placeholder="Table title (e.g. Book Collection by Department)" style={{ flex: 1, padding: '6px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', fontWeight: 600, marginRight: '10px' }} />
        ) : (
          <h4 style={{ margin: 0, fontSize: '14px', color: '#243358', fontWeight: 700 }}>{table.title || 'Untitled Table'}</h4>
        )}
        <div style={{ display: 'flex', gap: '6px' }}>
          {editingTableIdx === tableIdx ? (
            <>
              <button className="btn btn-success btn-sm" onClick={() => { setEditingTableIdx(null); setEditingCell(null); }}>Done</button>
              <button className="btn btn-danger btn-sm" onClick={() => removeTable(tableIdx)}>Delete Table</button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => setEditingTableIdx(tableIdx)}>Edit Table</button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {editingTableIdx === tableIdx ? (
        <div style={{ padding: '12px 16px' }}>
          {/* Column headers - editable */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', alignItems: 'center' }}>
            {table.columns.map((col, ci) => (
              <div key={ci} style={{ flex: ci === 0 ? '0 60px' : 1, position: 'relative' }}>
                <input type="text" value={col} onChange={(e) => updateColumnName(tableIdx, ci, e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #c8963e', borderRadius: '4px', fontSize: '12px', fontWeight: 700, background: '#fffbe6', boxSizing: 'border-box' }} />
                {ci > 0 && (
                  <button onClick={() => removeColumn(tableIdx, ci)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '16px', height: '16px', borderRadius: '50%', border: 'none', background: '#fdecea', color: '#d32f2f', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>×</button>
                )}
              </div>
            ))}
            <button onClick={() => addColumn(tableIdx)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px dashed #b9c3d4', background: '#fff', color: '#243358', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
          </div>

          {/* Rows */}
          {table.rows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
              {row.map((cell, ci) => (
                <input key={ci} type="text" value={cell} onChange={(e) => updateCell(tableIdx, ri, ci, e.target.value)} style={{ flex: ci === 0 ? '0 60px' : 1, padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box', textAlign: ci === 0 ? 'center' : 'left' }} />
              ))}
              <button onClick={() => removeRow(tableIdx, ri)} style={{ width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: '#fdecea', color: '#d32f2f', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>×</button>
            </div>
          ))}

          <button onClick={() => addRow(tableIdx)} style={{ marginTop: '6px', padding: '4px 12px', border: '1px dashed #b9c3d4', borderRadius: '4px', background: '#fff', color: '#243358', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>+ Add Row</button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {table.columns.map((col, ci) => (
                  <th key={ci} style={{ padding: '10px 12px', textAlign: ci === 0 ? 'center' : 'left', background: '#243358', color: '#fff', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '8px 12px', borderBottom: '1px solid #e4e8ed', textAlign: ci === 0 ? 'center' : 'left', fontWeight: ci === 0 ? 600 : 400, color: ci === 0 ? '#243358' : '#333' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // ===== LIBRARY PREVIEW =====
  const renderLibraryPreview = () => {
    const title = form.title || 'Library';
    const content = form.content || STATIC_CONTENT.campus.library;

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>Preview — matches the live website</span>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit</button>
        </div>

        <div className="about-content" style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '24px 28px' }}>
          <h2 className="content-heading">{title}</h2>
          <div className="content-line"></div>
          {content.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          {/* Data Tables */}
          {form.tables.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              {form.tables.map((table, ti) => (
                <div key={ti} style={{ marginBottom: '24px' }}>
                  {table.title && <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', marginBottom: '12px' }}>{table.title}</h3>}
                  <div className="fee-table-wrap">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          {table.columns.map((col, ci) => (
                            <th key={ci} style={ci === 0 ? { width: 50 } : {}}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={ci === 0 ? { width: 50, fontWeight: 600, color: '#243358' } : ci === 1 ? { fontWeight: 500 } : {}}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Rows */}
          {form.infoRows.length > 0 && (
            <div className="info-table" style={{ marginTop: '20px' }}>
              {form.infoRows.map((row, i) => (
                <div className="info-row" key={i}>
                  <span className="info-label">{row.label}</span>
                  <span className="info-value">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Library Rules */}
          {form.rules.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', marginBottom: '12px' }}>Library Rules</h3>
              <div className="rules-list">
                {form.rules.map((rule, i) => (
                  <div className="rule-item" key={i}>
                    <div className="rule-number">{i + 1}</div>
                    <div className="rule-content">
                      <h4 className="rule-title">{rule.ruleTitle || `Rule ${i + 1}`}</h4>
                      <p className="rule-desc">{rule.ruleDesc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Library Images */}
          {form.images.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', marginBottom: '12px' }}>Library Gallery</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '160px', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {img.url ? (
                        <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '12px', color: '#aaa' }}>No image</span>
                      )}
                    </div>
                    {img.caption && <p style={{ margin: 0, padding: '10px 12px', fontSize: '13px', color: '#555', textAlign: 'center' }}>{img.caption}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== GENERAL SECTION PREVIEW =====
  const renderGeneralPreview = () => {
    const title = form.title || currentSection?.label || '';
    const content = form.content || STATIC_CONTENT.campus?.[activeTab] || '';

    return (
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: '#888' }}>Preview — matches the live website</span>
          <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>Edit</button>
        </div>

        <div className="about-content" style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '24px 28px' }}>
          <h2 className="content-heading">{title}</h2>
          <div className="content-line"></div>
          {content.split('\n').filter(p => p.trim()).map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          {form.tables.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              {form.tables.map((table, ti) => (
                <div key={ti} style={{ marginBottom: '24px' }}>
                  {table.title && <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#243358', marginBottom: '12px' }}>{table.title}</h3>}
                  <div className="fee-table-wrap">
                    <table className="fee-table">
                      <thead>
                        <tr>
                          {table.columns.map((col, ci) => (
                            <th key={ci} style={ci === 0 ? { width: 50 } : {}}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci} style={ci === 0 ? { textAlign: 'center', fontWeight: 600, color: '#243358' } : {}}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {form.infoRows.length > 0 && (
            <div className="info-table" style={{ marginTop: '20px' }}>
              {form.infoRows.map((row, i) => (
                <div className="info-row" key={i}>
                  <span className="info-label">{row.label}</span>
                  <span className="info-value">{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Staff Cards */}
          {(activeTab === 'office-staff' || activeTab === 'non-teaching-staff') && form.staffMembers.length > 0 && (
            <div className="faculty-grid" style={{ marginTop: '20px' }}>
              {form.staffMembers.map((member, i) => (
                <div className="faculty-card-new" key={i}>
                  <div className="fcard-photo">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} />
                    ) : (
                      <span>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <h4 className="fcard-name">{member.name}</h4>
                  <p className="fcard-designation">{member.designation}</p>
                  <div className="fcard-details">
                    {member.phone && <span><strong>Phone:</strong> {member.phone}</span>}
                    {member.email && <span><strong>Email:</strong> {member.email}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ===== EDIT MODE =====
  const renderEditor = () => (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: '#888' }}>Editing — make changes then save</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-success btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          <button className="btn btn-secondary btn-sm" onClick={() => {
            const existing = sections[activeTab];
            if (existing) {
              setForm({ title: existing.title || '', content: existing.content || '', infoRows: existing.infoRows || [], stats: existing.stats || [], tables: existing.tables || [], rules: existing.rules || [], images: existing.images || [], staffMembers: existing.staffMembers || [], active: existing.active !== false });
            } else { setForm({ ...defaultForm }); }
            setEditing(false);
            setShowStaffForm(false);
            setDeleteConfirm(null);
            setEditingTableIdx(null);
            setEditingCell(null);
          }}>Cancel</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-body">


          {/* Data Tables */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: 0 }}>Data Tables ({form.tables.length})</label>
                <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>Click "Edit Table" to modify rows, columns, and data.</p>
              </div>
              <button className="btn btn-success btn-sm" onClick={addTable}>+ Add Table</button>
            </div>
            {form.tables.length > 0 ? (
              form.tables.map((table, ti) => renderTableEditor(table, ti))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #b9c3d4', borderRadius: '8px', color: '#888', fontSize: '13px' }}>
                No tables yet. Click "+ Add Table" to create one.
              </div>
            )}
          </div>

          {/* Rules (library only) */}
          {activeTab === 'library' && (
            <>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: 0 }}>Library Rules ({form.rules.length})</label>
                    <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>Add rules for library usage.</p>
                  </div>
                  <button className="btn btn-success btn-sm" onClick={() => setForm({ ...form, rules: [...form.rules, { ruleTitle: '', ruleDesc: '' }] })}>+ Add Rule</button>
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
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#c8963e' }}>Rule {i + 1}</span>
                          <button onClick={() => setForm({ ...form, rules: form.rules.filter((_, idx) => idx !== i) })} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }} title="Remove">×</button>
                        </div>
                        <input type="text" value={rule.ruleTitle} onChange={(e) => { const r = [...form.rules]; r[i] = { ...r[i], ruleTitle: e.target.value }; setForm({ ...form, rules: r }); }} placeholder="Rule title (e.g. Return Policy)" style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box', fontWeight: 600 }} />
                        <textarea value={rule.ruleDesc} onChange={(e) => { const r = [...form.rules]; r[i] = { ...r[i], ruleDesc: e.target.value }; setForm({ ...form, rules: r }); }} placeholder="Rule description..." rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Library Images */}
          {activeTab === 'library' && (
            <>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', margin: 0 }}>Library Images ({form.images.length})</label>
                    <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>Add images to display on the library page.</p>
                  </div>
                  <button className="btn btn-success btn-sm" onClick={() => setForm({ ...form, images: [...form.images, { url: '', caption: '' }] })}>+ Add Image</button>
                </div>

                {form.images.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #b9c3d4', borderRadius: '8px', color: '#888', fontSize: '13px' }}>
                    No images yet. Click "+ Add Image" to add one.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                        <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} style={{ position: 'absolute', top: '6px', right: '6px', width: '22px', height: '22px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, zIndex: 2 }} title="Remove">×</button>
                        <div style={{ width: '100%', height: '140px', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          {img.url ? (
                            <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '12px', color: '#aaa' }}>No image</span>
                          )}
                        </div>
                        <div style={{ padding: '10px' }}>
                          <div style={{ marginBottom: '6px' }}><ImageUpload value={img.url} onChange={(url) => { const imgs = [...form.images]; imgs[i] = { ...imgs[i], url }; setForm({ ...form, images: imgs }); }} /></div>
                          <input type="text" value={img.caption} onChange={(e) => { const imgs = [...form.images]; imgs[i] = { ...imgs[i], caption: e.target.value }; setForm({ ...form, images: imgs }); }} placeholder="Caption (optional)" style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Info Rows (for non-library sections) */}
          {activeTab !== 'library' && (
            <>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>Info Rows (Label - Value)</label>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px' }}>Click a row to edit it.</p>
                <div className="admin-info-table">
                  <div className="admin-info-add" onClick={addInfoRow}>+ Add Row</div>
                  {form.infoRows.map((row, i) => (
                    editingCell?.type === 'info' && editingCell?.idx === i ? (
                      <div key={i} className="admin-info-editing">
                        <input autoFocus type="text" value={row.label || ''} onChange={(e) => updateInfoRow(i, 'label', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)} placeholder="Label" style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12.5px', boxSizing: 'border-box' }} />
                        <input type="text" value={row.value || ''} onChange={(e) => updateInfoRow(i, 'value', e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)} placeholder="Value" style={{ width: '100%', padding: '7px 8px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '12.5px', boxSizing: 'border-box' }} />
                        <button className="btn btn-success btn-sm" onClick={() => setEditingCell(null)} style={{ alignSelf: 'flex-start' }}>Done</button>
                      </div>
                    ) : (
                      <div key={i} className="admin-info-row" onClick={() => setEditingCell({ type: 'info', idx: i })} title="Click to edit">
                        <span className="admin-info-label">{row.label || <em style={{ color: '#aaa' }}>Label</em>}</span>
                        <span className="admin-info-value">{row.value || <em style={{ color: '#aaa' }}>Value</em>}</span>
                        <button className="admin-info-remove" onClick={(e) => { e.stopPropagation(); removeInfoRow(i); }}>×</button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Staff Members */}
          {(activeTab === 'office-staff' || activeTab === 'non-teaching-staff') && (
            <>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e4e8ed' }} />
              <div className="form-group">
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '12px', display: 'block' }}>Staff Members ({form.staffMembers.length})</label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {/* Existing staff cards */}
                  {form.staffMembers.map((member, index) => (
                    <div key={index} style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '16px', textAlign: 'center', position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <button onClick={() => deleteStaff(index)} style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: '#fdecea', color: '#d32f2f', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} title="Remove">×</button>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #e4e8ed', margin: '0 auto 12px', overflow: 'hidden', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '28px', fontWeight: 700, color: '#243358', fontFamily: 'Georgia, serif' }}>{member.name?.split(' ')?.pop()?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#243358' }}>{member.name}</h4>
                      <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#666' }}>{member.designation}</p>
                      {member.phone && <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#555' }}>{member.phone}</p>}
                      {member.email && <p style={{ margin: '0 0 10px', fontSize: '11px', color: '#888' }}>{member.email}</p>}
                      <button className="btn btn-primary btn-sm" onClick={() => openEditStaff(index)} style={{ width: '100%', fontSize: '12px' }}>Edit</button>
                    </div>
                  ))}

                  {/* Add new card */}
                  {showStaffForm ? (
                    <div style={{ background: '#f8f9fa', border: '2px solid #c8963e', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                        <button onClick={cancelStaffForm} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}>×</button>
                      </div>
                      <div style={{ marginBottom: '12px' }}><ImageUpload value={staffForm.photoUrl} onChange={(url) => setStaffForm({ ...staffForm, photoUrl: url })} circle /></div>
                      <input type="text" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="Name *" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '8px' }} />
                      <input type="text" value={staffForm.designation} onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })} placeholder="Designation" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '8px' }} />
                      <input type="text" value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} placeholder="Phone" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '8px' }} />
                      <input type="email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} placeholder="Email" style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box', marginBottom: '10px' }} />
                      <button className="btn btn-success btn-sm" onClick={saveStaff} style={{ width: '100%' }}>{editStaffIdx !== null ? 'Update' : 'Add'} Staff</button>
                    </div>
                  ) : (
                    <div onClick={openAddStaff} style={{ background: '#fff', border: '2px dashed #b9c3d4', borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#c8963e'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#b9c3d4'}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f0f3f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#243358', marginBottom: '10px' }}>+</div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#243358' }}>Add Staff</span>
                      <span style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>Click to add new member</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <AdminLayout><div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Campus</h1>
      </div>
      <div className="admin-content">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '4px', flexWrap: 'wrap' }}>
          {SECTIONS.map((sec) => (
            <button key={sec.key} className={`gallery-tab ${activeTab === sec.key ? 'active' : ''}`} onClick={() => setActiveTab(sec.key)}>
              {sec.label}
              {sections[sec.key] && <span className="gallery-tab-count" style={{ fontSize: '10px' }}>Saved</span>}
            </button>
          ))}
        </div>

        {/* Alert */}
        {msg && (
          <div className={`alert alert-${msg.type}`} style={{ marginBottom: '16px' }}>
            {msg.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMsg(null)}>x</button>
          </div>
        )}

        <h2 style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', fontSize: '22px', color: '#243358' }}>
          {currentSection?.label}
        </h2>

        {/* Preview or Edit mode */}
        {editing ? renderEditor() : (activeTab === 'library' ? renderLibraryPreview() : renderGeneralPreview())}
      </div>
    </AdminLayout>
  );
}

export default AdminCampus;
