import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminApiKey } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminAlumni() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registrations');

  // ─── Registrations state ───
  const [alumni, setAlumni] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(true);
  const [alumniError, setAlumniError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);

  // ─── Entrepreneurs state ───
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [entLoading, setEntLoading] = useState(true);
  const [entError, setEntError] = useState('');
  const [entSearch, setEntSearch] = useState('');
  const [selectedEnt, setSelectedEnt] = useState(null);
  const [entEditing, setEntEditing] = useState(false);
  const [entForm, setEntForm] = useState(null);
  const [entSaving, setEntSaving] = useState(false);
  const [entAdding, setEntAdding] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth') || !getAdminApiKey()) {
      navigate('/admin/login');
      return;
    }
    fetchAlumni();
    fetchEntrepreneurs();
  }, [navigate]);

  // ═══════════════════════════════════════════
  // REGISTRATIONS
  // ═══════════════════════════════════════════

  const fetchAlumni = async () => {
    setAlumniLoading(true);
    setAlumniError('');
    try {
      const res = await fetch(`${API_URL}/alumni`);
      const data = await res.json();
      setAlumni(data);
    } catch (err) {
      setAlumniError('Failed to load alumni data.');
    } finally {
      setAlumniLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const departments = [...new Set(alumni.map((a) => a.department).filter(Boolean))];

  const filtered = alumni.filter((a) => {
    const ms = !searchTerm || (a.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || (a.phone || '').includes(searchTerm) || (a.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const mf = !filterStatus || a.status === filterStatus;
    const md = !filterDept || a.department === filterDept;
    return ms && mf && md;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/alumni/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { const updated = await res.json(); setAlumni((p) => p.map((a) => (a._id === id ? updated : a))); if (selectedAlumni?._id === id) setSelectedAlumni(updated); }
    } catch { alert('Failed to update status'); }
  };

  const handleDeleteAlumni = async (id) => {
    if (!window.confirm('Delete this alumni record?')) return;
    try {
      const res = await fetch(`${API_URL}/alumni/${id}`, { method: 'DELETE' });
      if (res.ok) { setAlumni((p) => p.filter((a) => a._id !== id)); if (selectedAlumni?._id === id) setSelectedAlumni(null); }
    } catch { alert('Failed to delete'); }
  };

  const startEditing = () => {
    if (!selectedAlumni) return;
    setEditForm({ fullName: selectedAlumni.fullName || '', email: selectedAlumni.email || '', phone: selectedAlumni.phone || '', passingYear: selectedAlumni.passingYear || '', department: selectedAlumni.department || '', currentPosition: selectedAlumni.currentPosition || '', company: selectedAlumni.company || '', message: selectedAlumni.message || '', status: selectedAlumni.status || 'pending' });
    setEditing(true);
  };

  const handleSaveAlumni = async () => {
    if (!selectedAlumni || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/alumni/${selectedAlumni._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
      if (res.ok) { const updated = await res.json(); setAlumni((p) => p.map((a) => (a._id === selectedAlumni._id ? updated : a))); setSelectedAlumni(updated); setEditing(false); setEditForm(null); }
      else { alert('Failed to save'); }
    } catch { alert('Network error'); } finally { setSaving(false); }
  };

  const statusColor = (s) => {
    if (s === 'approved') return { background: '#dcfce7', color: '#166534' };
    if (s === 'rejected') return { background: '#fee2e2', color: '#991b1b' };
    return { background: '#fef3c7', color: '#92400e' };
  };

  // ═══════════════════════════════════════════
  // ENTREPRENEURS
  // ═══════════════════════════════════════════

  const fetchEntrepreneurs = async () => {
    setEntLoading(true);
    setEntError('');
    try {
      const res = await fetch(`${API_URL}/entrepreneurs`);
      const data = await res.json();
      setEntrepreneurs(data);
    } catch {
      setEntError('Failed to load entrepreneurs.');
    } finally {
      setEntLoading(false);
    }
  };

  const filteredEnt = entrepreneurs.filter((e) => {
    if (!entSearch) return true;
    const s = entSearch.toLowerCase();
    return (e.name || '').toLowerCase().includes(s) || (e.firm || '').toLowerCase().includes(s) || (e.sector || '').toLowerCase().includes(s);
  });

  const startAddEnt = () => {
    setEntAdding(true);
    setEntForm({ name: '', firm: '', department: '', passingYear: '', phone: '', email: '', address: '', sector: '', description: '', order: 0 });
  };

  const startEditEnt = (ent) => {
    setEntAdding(false);
    setSelectedEnt(ent);
    setEntEditing(true);
    setEntForm({ name: ent.name || '', firm: ent.firm || '', department: ent.department || '', passingYear: ent.passingYear || '', phone: ent.phone || '', email: ent.email || '', address: ent.address || '', sector: ent.sector || '', description: ent.description || '', order: ent.order || 0 });
  };

  const handleSaveEnt = async () => {
    setEntSaving(true);
    try {
      if (entAdding) {
        const res = await fetch(`${API_URL}/entrepreneurs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entForm) });
        if (res.ok) { const created = await res.json(); setEntrepreneurs((p) => [...p, created]); cancelEntForm(); }
        else { alert('Failed to add'); }
      } else if (selectedEnt) {
        const res = await fetch(`${API_URL}/entrepreneurs/${selectedEnt._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entForm) });
        if (res.ok) { const updated = await res.json(); setEntrepreneurs((p) => p.map((e) => (e._id === selectedEnt._id ? updated : e))); cancelEntForm(); }
        else { alert('Failed to save'); }
      }
    } catch { alert('Network error'); } finally { setEntSaving(false); }
  };

  const handleDeleteEnt = async (id) => {
    if (!window.confirm('Delete this entrepreneur?')) return;
    try {
      const res = await fetch(`${API_URL}/entrepreneurs/${id}`, { method: 'DELETE' });
      if (res.ok) { setEntrepreneurs((p) => p.filter((e) => e._id !== id)); if (selectedEnt?._id === id) { setSelectedEnt(null); setEntEditing(false); setEntForm(null); } }
    } catch { alert('Failed to delete'); }
  };

  const cancelEntForm = () => {
    setEntAdding(false);
    setEntEditing(false);
    setSelectedEnt(null);
    setEntForm(null);
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', marginTop: '4px', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '12px', fontWeight: 600, color: '#888' };

  return (
    <AdminLayout>
      {/* ─── TOPBAR ─── */}
      <div className="admin-topbar">
        <h1>Alumni Management</h1>
        <div className="admin-topbar-actions">
          <button className={`btn ${activeTab === 'registrations' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('registrations')}>Registrations</button>
          <button className={`btn ${activeTab === 'entrepreneurs' ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setActiveTab('entrepreneurs')}>Entrepreneurs</button>
        </div>
      </div>

      <div className="admin-content">
        {/* ═══════════════════════════════════════════ */}
        {/* REGISTRATIONS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'registrations' && (
          <>
            {alumniError && <div className="alert alert-error">{alumniError}<button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setAlumniError('')}>×</button></div>}

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Search by name, email, phone, or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif" }} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif", minWidth: '140px' }}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif", minWidth: '180px' }}>
                <option value="">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {alumniLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading alumni...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>{alumni.length === 0 ? 'No alumni registrations yet.' : 'No records match your search.'}</div>
            ) : (
              <>
                <div className="admin-card" style={{ overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>#</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Year</th>
                          <th>Status</th>
                          <th style={{ width: '120px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((a, idx) => (
                          <tr key={a._id} onClick={() => { setSelectedAlumni(selectedAlumni?._id === a._id ? null : a); setEditing(false); setEditForm(null); }} style={{ cursor: 'pointer', background: selectedAlumni?._id === a._id ? '#f0f3f8' : 'transparent' }}>
                            <td style={{ fontWeight: 600, color: '#243358' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 500 }}>{a.fullName || 'N/A'}</td>
                            <td>{a.phone || 'N/A'}</td>
                            <td>{a.email || 'N/A'}</td>
                            <td><span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>{a.department || 'N/A'}</span></td>
                            <td>{a.passingYear || 'N/A'}</td>
                            <td><span style={{ ...statusColor(a.status), padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' }}>{a.status || 'pending'}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {a.status !== 'approved' && <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleStatusChange(a._id, 'approved'); }}>✓</button>}
                                {a.status !== 'rejected' && <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handleStatusChange(a._id, 'rejected'); }}>✗</button>}
                                <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDeleteAlumni(a._id); }}>Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedAlumni && (
                  <div style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '24px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e4e8ed' }}>
                      <h3 style={{ margin: 0, fontFamily: "'Georgia', serif", color: '#243358' }}>Alumni Details</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!editing ? <button className="btn btn-primary btn-sm" onClick={startEditing}>Edit</button> : <>
                          <button className="btn btn-primary btn-sm" onClick={handleSaveAlumni} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setEditForm(null); }}>Cancel</button>
                        </>}
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedAlumni(null); setEditing(false); setEditForm(null); }}>Close</button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {editing ? (<>
                        <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Full Name</label><input type="text" value={editForm.fullName} onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Phone</label><input type="text" value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Passing Year</label><input type="text" value={editForm.passingYear} onChange={(e) => setEditForm((p) => ({ ...p, passingYear: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Department</label><select value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))} style={inputStyle}><option value="">Select</option><option value="Computer Engineering">Computer Engineering</option><option value="Electronics & Telecommunication">Electronics & Telecommunication</option><option value="Mechanical Engineering">Mechanical Engineering</option><option value="Chemical Engineering">Chemical Engineering</option><option value="Electrical Engineering">Electrical Engineering</option><option value="Automobile Engineering">Automobile Engineering</option></select></div>
                        <div><label style={labelStyle}>Current Position</label><input type="text" value={editForm.currentPosition} onChange={(e) => setEditForm((p) => ({ ...p, currentPosition: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Company</label><input type="text" value={editForm.company} onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))} style={inputStyle} /></div>
                        <div><label style={labelStyle}>Status</label><select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} style={inputStyle}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div>
                        <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Message</label><textarea value={editForm.message} onChange={(e) => setEditForm((p) => ({ ...p, message: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                      </>) : (<>
                        <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Status</label><div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}><span style={{ ...statusColor(selectedAlumni.status), padding: '4px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>{selectedAlumni.status || 'pending'}</span>{selectedAlumni.status !== 'approved' && <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(selectedAlumni._id, 'approved')}>✓ Approve</button>}{selectedAlumni.status !== 'rejected' && <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(selectedAlumni._id, 'rejected')}>✗ Reject</button>}</div></div>
                        <div><label style={labelStyle}>Full Name</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.fullName || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Phone</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.phone || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Email</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.email || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Department</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.department || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Passing Year</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.passingYear || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Position</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.currentPosition || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Company</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{selectedAlumni.company || 'N/A'}</p></div>
                        <div><label style={labelStyle}>Registered On</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>{formatDate(selectedAlumni.createdAt)}</p></div>
                        {selectedAlumni.message && <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Message</label><p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333', lineHeight: 1.6 }}>{selectedAlumni.message}</p></div>}
                      </>)}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ENTREPRENEURS TAB */}
        {/* ═══════════════════════════════════════════ */}
        {activeTab === 'entrepreneurs' && (
          <>
            {entError && <div className="alert alert-error">{entError}<button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setEntError('')}>×</button></div>}

            {/* Top bar */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="text" placeholder="Search by name, firm, or sector..." value={entSearch} onChange={(e) => setEntSearch(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontFamily: "'Times New Roman', Times, serif" }} />
              <button className="btn btn-success" onClick={startAddEnt}>+ Add Entrepreneur</button>
              <button className="btn btn-primary" onClick={fetchEntrepreneurs}>Refresh</button>
            </div>

            {/* Live Preview Table */}
            <div className="admin-card" style={{ overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e8ed', background: '#f9fafb' }}>
                <h3 style={{ margin: 0, fontFamily: "'Georgia', serif", color: '#243358', fontSize: '16px' }}>Live Preview — Public Entrepreneurs Table</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>This is how the table appears on the public Alumni Entrepreneurs page.</p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                {entLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</div>
                ) : filteredEnt.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>{entrepreneurs.length === 0 ? 'No entrepreneurs added yet. Click "Add Entrepreneur" to get started.' : 'No records match your search.'}</div>
                ) : (
                  <table className="courses-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>Sr. No.</th>
                        <th>Name of Alumni</th>
                        <th>Firm / Company</th>
                        <th>Sector</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th style={{ width: 120 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnt.map((e, i) => (
                        <tr key={e._id} style={{ background: selectedEnt?._id === e._id ? '#f0f3f8' : 'transparent' }}>
                          <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                          <td style={{ fontWeight: 500 }}>{e.name}</td>
                          <td>{e.firm}</td>
                          <td>{e.sector ? <span style={{ background: '#e3f2fd', color: '#1565c0', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}>{e.sector}</span> : '—'}</td>
                          <td style={{ fontSize: '13px', color: '#666' }}>{e.department || '—'}</td>
                          <td style={{ fontSize: '13px', color: '#666' }}>{e.passingYear || '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="btn btn-primary btn-sm" onClick={() => startEditEnt(e)}>Edit</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEnt(e._id)}>Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Add / Edit Form */}
            {(entAdding || entEditing) && entForm && (
              <div style={{ background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '24px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e4e8ed' }}>
                  <h3 style={{ margin: 0, fontFamily: "'Georgia', serif", color: '#243358' }}>{entAdding ? 'Add New Entrepreneur' : 'Edit Entrepreneur'}</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary btn-sm" onClick={handleSaveEnt} disabled={entSaving}>{entSaving ? 'Saving...' : 'Save'}</button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEntForm}>Cancel</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Alumni Name *</label><input type="text" value={entForm.name} onChange={(e) => setEntForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Mr. Akshay Ghadge" style={inputStyle} required /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Firm / Company *</label><input type="text" value={entForm.firm} onChange={(e) => setEntForm((p) => ({ ...p, firm: e.target.value }))} placeholder="e.g. Microcraft Enterprises, Satara" style={inputStyle} required /></div>
                  <div><label style={labelStyle}>Sector</label><input type="text" value={entForm.sector} onChange={(e) => setEntForm((p) => ({ ...p, sector: e.target.value }))} placeholder="e.g. Manufacturing, IT, Automobile" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Department</label><select value={entForm.department} onChange={(e) => setEntForm((p) => ({ ...p, department: e.target.value }))} style={inputStyle}><option value="">Select</option><option value="Computer Engineering">Computer Engineering</option><option value="Electronics & Telecommunication">Electronics & Telecommunication</option><option value="Mechanical Engineering">Mechanical Engineering</option><option value="Chemical Engineering">Chemical Engineering</option><option value="Electrical Engineering">Electrical Engineering</option><option value="Automobile Engineering">Automobile Engineering</option></select></div>
                  <div><label style={labelStyle}>Passing Year</label><input type="text" value={entForm.passingYear} onChange={(e) => setEntForm((p) => ({ ...p, passingYear: e.target.value }))} placeholder="e.g. 2012" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Phone</label><input type="text" value={entForm.phone} onChange={(e) => setEntForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" value={entForm.email} onChange={(e) => setEntForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@example.com" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Address</label><input type="text" value={entForm.address} onChange={(e) => setEntForm((p) => ({ ...p, address: e.target.value }))} placeholder="City, State" style={inputStyle} /></div>
                  <div><label style={labelStyle}>Sort Order</label><input type="number" value={entForm.order} onChange={(e) => setEntForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} min={0} style={inputStyle} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description (optional)</label><textarea value={entForm.description} onChange={(e) => setEntForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description about the entrepreneur..." style={{ ...inputStyle, resize: 'vertical' }} /></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminAlumni;
