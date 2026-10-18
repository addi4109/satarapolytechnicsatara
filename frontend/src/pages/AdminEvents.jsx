import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminLoading from '../components/AdminLoading';
import ImageUpload from '../components/ImageUpload';
import './Admin.css';

import API_URL from '../lib/api';

const emptyCompetition = { title: '', description: '', rules: [''] };

const emptyEvent = {
  title: '',
  description: '',
  posterUrl: '',
  googleFormUrl: '',
  date: '',
  venue: '',
  competitions: [],
  active: true,
  order: 0,
};

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyEvent });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events/all`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load events' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyEvent });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      ...emptyEvent,
      ...item,
      competitions: (item.competitions || []).map((c) => ({
        title: c.title || '',
        description: c.description || '',
        rules: (c.rules || []).length ? [...c.rules] : [''],
      })),
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  /* ---- competition helpers ---- */
  const addCompetition = () =>
    setForm((f) => ({ ...f, competitions: [...f.competitions, { ...emptyCompetition, rules: [''] }] }));

  const removeCompetition = (ci) =>
    setForm((f) => ({
      ...f,
      competitions: f.competitions.filter((_, i) => i !== ci),
    }));

  const updateCompetition = (ci, field, value) =>
    setForm((f) => ({
      ...f,
      competitions: f.competitions.map((c, i) => (i === ci ? { ...c, [field]: value } : c)),
    }));

  const addRule = (ci) =>
    setForm((f) => ({
      ...f,
      competitions: f.competitions.map((c, i) => (i === ci ? { ...c, rules: [...c.rules, ''] } : c)),
    }));

  const removeRule = (ci, ri) =>
    setForm((f) => ({
      ...f,
      competitions: f.competitions.map((c, i) =>
        i === ci ? { ...c, rules: c.rules.filter((_, j) => j !== ri) } : c
      ),
    }));

  const updateRule = (ci, ri, value) =>
    setForm((f) => ({
      ...f,
      competitions: f.competitions.map((c, i) =>
        i === ci ? { ...c, rules: c.rules.map((r, j) => (j === ri ? value : r)) } : c
      ),
    }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Drop empty competitions / blank rules before saving.
      const competitions = form.competitions
        .filter((c) => c.title.trim())
        .map((c) => ({
          title: c.title.trim(),
          description: (c.description || '').trim(),
          rules: (c.rules || []).map((r) => r.trim()).filter(Boolean),
        }));

      const url = editId ? `${API_URL}/events/${editId}` : `${API_URL}/events`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: (form.description || '').trim(),
          posterUrl: (form.posterUrl || '').trim(),
          googleFormUrl: (form.googleFormUrl || '').trim(),
          date: (form.date || '').trim(),
          venue: (form.venue || '').trim(),
          competitions,
          active: form.active !== false,
          order: Number(form.order) || 0,
        }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: editId ? 'Event updated!' : 'Event added!' });
        setShowForm(false);
        setEditId(null);
        fetchEvents();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: 'Deleted' });
      fetchEvents();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setDeleteConfirm(null);
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '5px' };

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Events</h1>
      </div>
      <div className="admin-content">
        <AdminAlert type={message?.type} message={message} onDismiss={() => setMessage(null)} />

        {loading ? (
          <AdminLoading text="Loading events..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Add New Card */}
            <div
              onClick={openAdd}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '180px', border: '2px dashed #b9c3d4', borderRadius: '10px', cursor: 'pointer',
                background: '#fff', transition: 'all 0.25s ease', gap: '10px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#243358'; e.currentTarget.style.background = '#f8f9fa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#b9c3d4'; e.currentTarget.style.background = '#fff'; }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#243358', fontWeight: 300 }}>+</div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#243358' }}>Add Event</span>
            </div>

            {/* Event Cards */}
            {events.map((event) => (
              <div key={event._id} style={{
                background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', padding: '16px',
                display: 'flex', flexDirection: 'column', position: 'relative',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(36,51,88,0.1)'; e.currentTarget.style.borderColor = '#c8963e'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e4e8ed'; }}
              >
                {/* Status Badge */}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className={`badge ${event.active ? 'badge-cell' : 'badge-committee'}`} style={{ fontSize: '10px' }}>{event.active ? 'Active' : 'Inactive'}</span>
                </div>

                {/* Poster */}
                {event.posterUrl ? (
                  <img src={event.posterUrl} alt={event.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e4e8ed' }} />
                ) : (
                  <div style={{ width: '100%', height: '80px', borderRadius: '6px', marginBottom: '10px', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🎉</div>
                )}

                {/* Title */}
                <h4 style={{ margin: '0 0 4px', color: '#243358', fontSize: '15px', fontWeight: 700, paddingRight: '60px' }}>{event.title}</h4>

                {/* Description */}
                {event.description && (
                  <p style={{ margin: '0 0 8px', color: '#666', fontSize: '13px', lineHeight: '1.5', flex: 1 }}>
                    {event.description.substring(0, 100)}{event.description.length > 100 ? '...' : ''}
                  </p>
                )}

                {/* Meta */}
                <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#999' }}>
                  {(event.competitions || []).length} competition{(event.competitions || []).length !== 1 ? 's' : ''}
                  {event.googleFormUrl ? ' · Form linked' : ''}
                  {event.date ? ` · ${event.date}` : ''}
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {event.googleFormUrl && (
                    <a
                      href={event.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '5px 12px', background: '#243358', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', textDecoration: 'none' }}
                    >Form</a>
                  )}
                  <button
                    onClick={() => openEdit(event)}
                    style={{ padding: '5px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                  >Edit</button>
                  {deleteConfirm === event._id ? (
                    <>
                      <button onClick={() => handleDelete(event._id)} style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Yes</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ padding: '5px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>No</button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(event._id)}
                      style={{ padding: '5px 12px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}
                    >Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) cancelForm(); }}
        >
          <div style={{
            background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '640px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e4e8ed', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h3 style={{ margin: 0, color: '#243358', fontSize: '17px' }}>{editId ? 'Edit' : 'Add'} Event</h3>
              <button onClick={cancelForm} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
            </div>

            {/* Modal Body — scrollable */}
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <form onSubmit={handleSave}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Event Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. TechnoFest 2026" required style={inputStyle} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="About the event" required style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label style={labelStyle}>Date (optional)</label>
                    <input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. 15–16 March 2026" style={inputStyle} />
                  </div>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label style={labelStyle}>Venue (optional)</label>
                    <input type="text" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. College Auditorium" style={inputStyle} />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Event Poster</label>
                  <ImageUpload value={form.posterUrl} onChange={(url) => setForm({ ...form, posterUrl: url })} label="" placeholder="Upload event poster" />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Google Form Link (optional)</label>
                  <input type="url" value={form.googleFormUrl} onChange={(e) => setForm({ ...form, googleFormUrl: e.target.value })} placeholder="https://forms.gle/..." style={inputStyle} />
                  <small style={{ fontSize: '11.5px', color: '#888' }}>A “Register” button linking to this form appears on the event page.</small>
                </div>

                {/* ===== Competitions ===== */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Competitions</label>
                  {form.competitions.length === 0 && (
                    <small style={{ fontSize: '12px', color: '#888' }}>No competitions added yet.</small>
                  )}
                  {form.competitions.map((comp, ci) => (
                    <div key={ci} style={{ border: '1px solid #e4e8ed', borderRadius: '8px', padding: '12px', marginBottom: '10px', background: '#f9fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#243358' }}>Competition {ci + 1}</strong>
                        <button type="button" onClick={() => removeCompetition(ci)} style={{ padding: '3px 10px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}>Remove</button>
                      </div>

                      <input
                        type="text"
                        value={comp.title}
                        onChange={(e) => updateCompetition(ci, 'title', e.target.value)}
                        placeholder="Competition title *"
                        style={{ ...inputStyle, marginBottom: '8px' }}
                      />
                      <textarea
                        value={comp.description}
                        onChange={(e) => updateCompetition(ci, 'description', e.target.value)}
                        rows={2}
                        placeholder="Short description (optional)"
                        style={{ ...inputStyle, marginBottom: '8px', resize: 'vertical' }}
                      />

                      <label style={{ ...labelStyle, fontSize: '12px', marginBottom: '4px' }}>Rules</label>
                      {comp.rules.map((rule, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                          <input
                            type="text"
                            value={rule}
                            onChange={(e) => updateRule(ci, ri, e.target.value)}
                            placeholder={`Rule ${ri + 1}`}
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <button type="button" onClick={() => removeRule(ci, ri)} style={{ padding: '0 10px', background: '#fff', color: '#dc3545', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addRule(ci)} style={{ padding: '4px 12px', background: '#fff', color: '#243358', fontSize: '11px', fontWeight: 600, border: '1px solid #243358', borderRadius: '4px', cursor: 'pointer' }}>+ Add Rule</button>
                    </div>
                  ))}
                  <button type="button" onClick={addCompetition} style={{ padding: '6px 14px', background: '#fff', color: '#243358', fontSize: '12px', fontWeight: 600, border: '1px dashed #243358', borderRadius: '6px', cursor: 'pointer' }}>+ Add Competition</button>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <div className="toggle-row">
                      <button type="button" className={`toggle-switch ${form.active !== false ? 'active' : ''}`} onClick={() => setForm({ ...form, active: form.active === false })}>
                        <span className="toggle-knob"></span>
                      </button>
                      <span className="toggle-label">{form.active !== false ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div style={{ minWidth: '120px' }}>
                    <label style={labelStyle}>Sort Order</label>
                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e4e8ed' }}>
                  <button type="submit" className="btn btn-success" disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Event'}</button>
                  <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminEvents;
