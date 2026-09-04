import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminTabs from '../components/AdminTabs';
import './Academics.css';

import API_URL from '../lib/api';

const defaultOfficeRow = { designation: '', name: '', phone: '', email: '' };
const defaultDeptRow = { name: '', hod: '', phone: '', email: '', address: '', description: '' };

function AdminContact() {
  const [activeTab, setActiveTab] = useState('general');


  const [, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  // General settings
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [officeHours, setOfficeHours] = useState('');


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
      setPhone(office.phone || '+91-94233 42843');
      setEmail(office.email || 'satarapolyinfo@gmail.com');
      setAddress(office.address || 'At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra');
      setOfficeHours(office.officeHours || 'Monday – Saturday, 10:30 AM – 5:00 PM');

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
          phone, email, address, officeHours, officeContacts,
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

  const updateOfficeRow = (index, field, value, fullUpdate) => {
    const updated = officeContacts.map((row, i) =>
      i === index ? (fullUpdate ? fullUpdate : { ...row, [field]: value }) : row
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
        <AdminTabs
          tabs={[
            { key: 'general', label: 'General Info' },
            { key: 'office', label: 'Office Contacts' },
            { key: 'departments', label: 'Department Details' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Alert */}
        <AdminAlert type={msg?.type} message={msg} onDismiss={() => setMsg(null)} />

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
            <div className="admin-card-body">
              {officeContacts.length === 0 && (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No office contacts yet. Click "+ Add Row" to add one.</p>
              )}
              {officeContacts.map((row, i) => (
                <div key={i} style={{ background: '#f8f9fa', border: '1px solid #e4e8ed', borderRadius: '8px', padding: '16px', marginBottom: '12px', position: 'relative' }}>
                  <button
                    className="member-remove-btn"
                    title="Remove"
                    onClick={() => removeOfficeRow(i)}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                  >×</button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={labelStyle}>Designation</label>
                      <input type="text" value={row.designation} onChange={(e) => updateOfficeRow(i, 'designation', e.target.value)} style={inputStyle} placeholder="e.g. Principal" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Name</label>
                      <input type="text" value={row.name} onChange={(e) => updateOfficeRow(i, 'name', e.target.value)} style={inputStyle} placeholder="Staff name" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Phone</label>
                      <input type="text" value={row.phone} onChange={(e) => updateOfficeRow(i, 'phone', e.target.value)} style={inputStyle} placeholder="Phone number" />
                    </div>
                    <div className="form-group">
                      <label style={labelStyle}>Email</label>
                      <input type="email" value={row.email} onChange={(e) => updateOfficeRow(i, 'email', e.target.value)} style={inputStyle} placeholder="Email address" />
                    </div>
                  </div>
                </div>
              ))}
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
