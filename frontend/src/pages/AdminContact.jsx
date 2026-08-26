import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import './Academics.css';

const API_URL = '/api';

const defaultOfficeRow = { designation: '', name: '', phone: '', email: '' };

function AdminContact() {
  const [activeTab, setActiveTab] = useState('general');
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
      setOfficeHours(office.officeHours || 'Monday – Saturday, 8:00 AM – 6:00 PM');
      setMapEmbedUrl(office.mapEmbedUrl || '');
      setOfficeContacts(office.officeContacts && office.officeContacts.length > 0 ? office.officeContacts : [{ ...defaultOfficeRow }]);
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
                <input type="text" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} style={inputStyle} placeholder="e.g. Monday – Saturday, 8 AM – 6 PM" />
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
      </div>
    </AdminLayout>
  );
}

export default AdminContact;
