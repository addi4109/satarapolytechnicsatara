import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './Academics.css';

const API_URL = '/api';

const defaultOfficeRow = { designation: '', name: '', phone: '', email: '' };
const defaultDeptRow = { name: '', hod: '', phone: '', email: '', address: '', description: '' };

function AdminContact() {
  const [activeTab, setActiveTab] = useState('general');

  // EmailJS config (read-only from env vars)
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const emailjsCollegeTemplateId = import.meta.env.VITE_EMAILJS_COLLEGE_TEMPLATE_ID || '';
  const emailjsAutoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || '';
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
  const collegeEmail = import.meta.env.VITE_COLLEGE_EMAIL || '';
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // General settings
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  // Office contacts
  const [officeContacts, setOfficeContacts] = useState([]);

  // Department details
  const [departmentDetails, setDepartmentDetails] = useState([]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_URL}/contact`);
      const data = await res.json();
      const mapped = {};
      data.forEach((s) => { mapped[s.section] = s; });
      setSections(mapped);

      // Load general settings from office section or defaults
      const office = mapped['office'] || {};
      setPhone(office.phone || '+91-2162 284 040');
      setEmail(office.email || 'satarapolyinfo@gmail.com');
      setAddress(office.address || 'At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra');
      setOfficeHours(office.officeHours || 'Monday – Saturday, 10:30 AM – 5:00 PM');
      setMapEmbedUrl(office.mapEmbedUrl || '');
      setOfficeContacts(office.officeContacts && office.officeContacts.length > 0 ? office.officeContacts : [{ ...defaultOfficeRow }]);
      const deptSection = mapped['departments'] || {};
      setDepartmentDetails(deptSection.departmentDetails && deptSection.departmentDetails.length > 0 ? deptSection.departmentDetails : []);
    } catch (err) {
      console.error('Failed to fetch contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'office',
          phone, email, address, officeHours, mapEmbedUrl, officeContacts,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, office: saved }));
      setMsg({ type: 'success', text: 'Contact settings saved!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDeptDetails = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'departments',
          departmentDetails,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const saved = await res.json();
      setSections((prev) => ({ ...prev, departments: saved }));
      setMsg({ type: 'success', text: 'Department details saved!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const addOfficeRow = () => {
    setOfficeContacts([...officeContacts, { ...defaultOfficeRow }]);
  };

  const updateOfficeRow = (index, field, value) => {
    const updated = officeContacts.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setOfficeContacts(updated);
  };

  const removeOfficeRow = (index) => {
    setOfficeContacts(officeContacts.filter((_, i) => i !== index));
  };

  // Department details helpers
  const addDeptRow = () => {
    setDepartmentDetails([...departmentDetails, { ...defaultDeptRow }]);
  };

  const updateDeptRow = (index, field, value) => {
    const updated = departmentDetails.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setDepartmentDetails(updated);
  };

  const removeDeptRow = (index) => {
    setDepartmentDetails(departmentDetails.filter((_, i) => i !== index));
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '4px',
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
        <h1>Contact Management</h1>
        <div className="admin-topbar-actions">
          <button className="btn btn-primary" onClick={handleSaveGeneral} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Sub-tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#fff', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '4px' }}>
          {[
            { key: 'general', label: 'General Info' },
            { key: 'office', label: 'Office Contacts' },
            { key: 'departments', label: 'Department Details' },
            { key: 'emailjs', label: 'Email Settings' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`gallery-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alert */}
        {msg && (
          <div className={`alert alert-${msg.type}`}>{msg.text}</div>
        )}

        {/* General Info */}
        {activeTab === 'general' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>General Contact Information</h3>
            </div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={labelStyle}>Phone Number</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="+91-XXXXXXXXXX" />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="info@college.ac.in" />
                </div>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} placeholder="Full college address" />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Office Hours</label>
                <input type="text" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} style={inputStyle} placeholder="e.g. Monday – Saturday, 10:30 AM – 5:00 PM" />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Google Maps Embed URL</label>
                <input type="text" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} style={inputStyle} placeholder="https://www.google.com/maps/embed?..." />
              </div>
            </div>
          </div>
        )}

        {/* Office Contacts */}
        {activeTab === 'office' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Office Staff Contacts</h3>
              <button className="btn btn-success btn-sm" onClick={addOfficeRow}>+ Add Row</button>
            </div>
            <div className="admin-card-body" style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>Sr.</th>
                    <th>Designation</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th style={{ width: 60 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {officeContacts.map((row, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{i + 1}</td>
                      <td><input type="text" value={row.designation} onChange={(e) => updateOfficeRow(i, 'designation', e.target.value)} style={inputStyle} placeholder="e.g. Principal" /></td>
                      <td><input type="text" value={row.name} onChange={(e) => updateOfficeRow(i, 'name', e.target.value)} style={inputStyle} placeholder="Staff name" /></td>
                      <td><input type="text" value={row.phone} onChange={(e) => updateOfficeRow(i, 'phone', e.target.value)} style={inputStyle} placeholder="Phone number" /></td>
                      <td><input type="text" value={row.email} onChange={(e) => updateOfficeRow(i, 'email', e.target.value)} style={inputStyle} placeholder="Email" /></td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="member-remove-btn" title="Remove" onClick={() => removeOfficeRow(i)}>×</button>
                      </td>
                    </tr>
                  ))}
                  {officeContacts.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No office contacts added yet. Click "+ Add Row" to add one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* EmailJS Settings */}
        {activeTab === 'emailjs' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>EmailJS Configuration (Admission Enquiry)</h3>
            </div>
            <div className="admin-card-body">
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                These settings are configured via environment variables in Vercel. To change them, update the <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>VITE_*</code> variables in your Vercel Dashboard → Settings → Environment Variables, then redeploy.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={labelStyle}>Service ID</label>
                  <input type="text" value={emailjsServiceId} readOnly style={{ ...inputStyle, background: '#f8f9fa', color: emailjsServiceId ? '#333' : '#dc2626' }} placeholder="Not configured" />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Public Key</label>
                  <input type="text" value={emailjsPublicKey ? emailjsPublicKey.substring(0, 8) + '...' + emailjsPublicKey.substring(emailjsPublicKey.length - 4) : ''} readOnly style={{ ...inputStyle, background: '#f8f9fa', color: emailjsPublicKey ? '#333' : '#dc2626' }} placeholder="Not configured" />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>College Template ID</label>
                  <input type="text" value={emailjsCollegeTemplateId} readOnly style={{ ...inputStyle, background: '#f8f9fa', color: emailjsCollegeTemplateId ? '#333' : '#dc2626' }} placeholder="Not configured" />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Auto-Reply Template ID</label>
                  <input type="text" value={emailjsAutoReplyTemplateId} readOnly style={{ ...inputStyle, background: '#f8f9fa', color: emailjsAutoReplyTemplateId ? '#333' : '#dc2626' }} placeholder="Not configured" />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>College Email (To: for Template 1)</label>
                  <input type="text" value={collegeEmail} readOnly style={{ ...inputStyle, background: '#f8f9fa', color: collegeEmail ? '#333' : '#dc2626' }} placeholder="Not configured" />
                </div>
              </div>

              {/* Status summary */}
              <div style={{ marginTop: '20px', padding: '14px 18px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{emailjsServiceId && emailjsCollegeTemplateId && emailjsAutoReplyTemplateId && emailjsPublicKey ? '✅' : '❌'}</span>
                  <strong style={{ fontSize: '13px', color: '#166534' }}>
                    {emailjsServiceId && emailjsCollegeTemplateId && emailjsAutoReplyTemplateId && emailjsPublicKey
                      ? 'All EmailJS environment variables are configured'
                      : 'Some EmailJS environment variables are missing'
                    }
                  </strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'Service ID', ok: !!emailjsServiceId },
                    { label: 'Public Key', ok: !!emailjsPublicKey },
                    { label: 'College Template', ok: !!emailjsCollegeTemplateId },
                    { label: 'Auto-Reply Template', ok: !!emailjsAutoReplyTemplateId },
                    { label: 'College Email', ok: !!collegeEmail },
                  ].map((item) => (
                    <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: item.ok ? '#dcfce7' : '#fef2f2', color: item.ok ? '#166534' : '#991b1b' }}>
                      {item.ok ? '✓' : '✗'} {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Template variable reference */}
              <div style={{ marginTop: '20px', padding: '14px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#334155', margin: '0 0 10px' }}>📋 EmailJS Template Variables</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', lineHeight: '1.5' }}>
                  Both templates must use these exact variable names in the EmailJS dashboard:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['fullName', 'phone', 'email', 'department', 'message'].map((v) => (
                    <code key={v} style={{ padding: '3px 10px', background: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontSize: '11px', fontWeight: 600, fontFamily: 'monospace' }}>{'{{'}{v}{'}}'}</code>
                  ))}
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '10px 0 0', lineHeight: '1.5' }}>
                  <strong>Template 1 (College):</strong> To Email = college email address<br/>
                  <strong>Template 2 (Auto-Reply):</strong> To Email = {'{{email}}'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Department Details */}
        {activeTab === 'departments' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Department Contact Details</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-success btn-sm" onClick={addDeptRow}>+ Add Department</button>
                <button className="btn btn-primary btn-sm" onClick={handleSaveDeptDetails} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            <div className="admin-card-body">
              {departmentDetails.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No department details added yet. Click "+ Add Department" to add one.</p>
              )}
              {departmentDetails.map((dept, i) => (
                <div key={i} style={{ background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '16px', marginBottom: '14px', position: 'relative' }}>
                  <button
                    className="member-remove-btn"
                    title="Remove department"
                    onClick={() => removeDeptRow(i)}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  >×</button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={labelStyle}>Department Name *</label>
                      <input type="text" value={dept.name} onChange={(e) => updateDeptRow(i, 'name', e.target.value)} style={inputStyle} placeholder="e.g. Computer Engineering" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>HOD Name</label>
                      <input type="text" value={dept.hod} onChange={(e) => updateDeptRow(i, 'hod', e.target.value)} style={inputStyle} placeholder="Head of Department" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Phone</label>
                      <input type="text" value={dept.phone} onChange={(e) => updateDeptRow(i, 'phone', e.target.value)} style={inputStyle} placeholder="Phone number" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Email</label>
                      <input type="email" value={dept.email} onChange={(e) => updateDeptRow(i, 'email', e.target.value)} style={inputStyle} placeholder="Email address" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Address / Location</label>
                      <input type="text" value={dept.address} onChange={(e) => updateDeptRow(i, 'address', e.target.value)} style={inputStyle} placeholder="Room / Building info" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Description</label>
                      <input type="text" value={dept.description} onChange={(e) => updateDeptRow(i, 'description', e.target.value)} style={inputStyle} placeholder="Short description" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminContact;
