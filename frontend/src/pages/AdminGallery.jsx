import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import './Admin.css';

const API_URL = '/api';

const emptyPhoto = { title: '', image: '', description: '', order: 0 };
const emptyVideo = { title: '', videoUrl: '', thumbnail: '', description: '', order: 0 };
const emptyNews = { title: '', date: '', source: '', summary: '', image: '', order: 0 };
const emptySlide = { image: '', title: '', link: '', order: 0 };

function AdminGallery() {
  const [tab, setTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyPhoto });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [p, v, n, s] = await Promise.all([
        fetch(`${API_URL}/photos`).then((r) => r.json()),
        fetch(`${API_URL}/videos`).then((r) => r.json()),
        fetch(`${API_URL}/news`).then((r) => r.json()),
        fetch(`${API_URL}/slides`).then((r) => r.json()),
      ]);
      setPhotos(p); setVideos(v); setNews(n); setSlides(s);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally { setLoading(false); }
  };

  const getEmpty = () => {
    if (tab === 'photos') return { ...emptyPhoto };
    if (tab === 'videos') return { ...emptyVideo };
    if (tab === 'news') return { ...emptyNews };
    return { ...emptySlide };
  };

  const getEndpoint = () => {
    if (tab === 'photos') return 'photos';
    if (tab === 'videos') return 'videos';
    if (tab === 'news') return 'news';
    return 'slides';
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    setForm(getEmpty());
  };

  const startEdit = (item) => {
    setAdding(false);
    setEditingId(item._id);
    setForm({ ...item });
  };

  const cancelForm = () => {
    setAdding(false);
    setEditingId(null);
    setForm(getEmpty());
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ep = getEndpoint();
      const url = editingId ? `${API_URL}/${ep}/${editingId}` : `${API_URL}/${ep}`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        setMessage({ type: 'success', text: editingId ? 'Updated!' : 'Added!' });
        setAdding(false);
        setEditingId(null);
        setForm(getEmpty());
        fetchAll();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed' });
      }
    } catch { setMessage({ type: 'error', text: 'Network error' }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${getEndpoint()}/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: 'Deleted' });
      fetchAll();
    } catch { setMessage({ type: 'error', text: 'Failed to delete' }); }
    setDeleteConfirm(null);
  };

  const switchTab = (t) => { setTab(t); setAdding(false); setEditingId(null); setMessage(null); };

  const isEditing = (id) => editingId === id;



  // Inline form card
  const renderFormCard = () => (
    <div style={{
      background: '#fff', border: '2px solid #d4a54a', borderRadius: '10px', padding: '16px',
      minHeight: '280px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, color: '#2a5a8a', fontSize: '15px' }}>{editingId ? 'Edit' : 'Add New'} {tab === 'photos' ? 'Photo' : tab === 'videos' ? 'Video' : tab === 'news' ? 'News' : 'Slide'}</h4>
        <button onClick={cancelForm} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}>×</button>
      </div>
      <form onSubmit={handleSave}>
        {/* Photo fields */}
        {tab === 'photos' && <>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Photo title" required style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Order</label>
            <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} style={{ width: '100px', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="" placeholder="Upload photo..." />
          </div>
          {form.image && <img src={form.image} alt="Preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e4e8ed' }} />}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional description" style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </>}

        {/* Video fields */}
        {tab === 'videos' && <>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Video title" required style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <VideoUpload value={form.videoUrl || ''} onChange={(url) => setForm({ ...form, videoUrl: url })} label="Video *" placeholder="Upload video..." />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}><ImageUpload value={form.thumbnail || ''} onChange={(url) => setForm({ ...form, thumbnail: url })} label="" placeholder="Thumbnail..." /></div>
            <div style={{ width: '80px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </>}

        {/* News fields */}
        {tab === 'news' && <>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Title *</label>
            <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="News title" required style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Date *</label>
              <input type="text" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="15 Jul 2025" required style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Source</label>
              <input type="text" value={form.source || ''} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Times of India" style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Summary</label>
            <textarea value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="" placeholder="News image..." /></div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Order</label>
            <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} style={{ width: '100px', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
        </>}

        {/* Slide fields */}
        {tab === 'slides' && <>
          <div style={{ marginBottom: '10px' }}><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="" placeholder="Slide image..." /></div>
          {form.image && <img src={form.image} alt="Preview" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px', border: '1px solid #e4e8ed' }} />}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Title</label>
              <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Slide title" style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ width: '80px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} style={{ width: '100%', padding: '7px 10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>
          </div>
        </>}

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e4e8ed' }}>
          <button type="submit" className="btn btn-success btn-sm" disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={cancelForm}>Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Gallery & Content</h1>
      </div>
      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'inherit' }} onClick={() => setMessage(null)}>x</button>
          </div>
        )}

        {/* Tabs */}
        <div className="gallery-admin-tabs">
          <button className={`gallery-tab ${tab === 'photos' ? 'active' : ''}`} onClick={() => switchTab('photos')}>
            Photo Gallery <span className="gallery-tab-count">{photos.length}</span>
          </button>
          <button className={`gallery-tab ${tab === 'videos' ? 'active' : ''}`} onClick={() => switchTab('videos')}>
            Video Gallery <span className="gallery-tab-count">{videos.length}</span>
          </button>
          <button className={`gallery-tab ${tab === 'news' ? 'active' : ''}`} onClick={() => switchTab('news')}>
            Media News <span className="gallery-tab-count">{news.length}</span>
          </button>
          <button className={`gallery-tab ${tab === 'slides' ? 'active' : ''}`} onClick={() => switchTab('slides')}>
            Slider Images <span className="gallery-tab-count">{slides.length}</span>
          </button>
        </div>

        {/* Card Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Add New Card */}
            {!adding && !editingId && (
              <div
                onClick={startAdd}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '200px', border: '2px dashed #b9c3d4', borderRadius: '10px', cursor: 'pointer',
                  background: '#fff', transition: 'all 0.25s ease', gap: '10px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2a5a8a'; e.currentTarget.style.background = '#f8f9fa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#b9c3d4'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#2a5a8a', fontWeight: 300 }}>+</div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#2a5a8a' }}>Add {tab === 'photos' ? 'Photo' : tab === 'videos' ? 'Video' : tab === 'news' ? 'News' : 'Slide'}</span>
              </div>
            )}

            {/* Inline Form Card */}
            {adding && renderFormCard()}

            {/* ===== PHOTOS ===== */}
            {tab === 'photos' && photos.map((p) => (
              isEditing(p._id) ? (
                <div key={p._id}>{renderFormCard()}</div>
              ) : (
                <div key={p._id} style={{
                  background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', overflow: 'hidden',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(36,51,88,0.1)'; e.currentTarget.style.borderColor = '#d4a54a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e4e8ed'; }}
                >
                  {p.image && <img src={p.image} alt={p.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
                  {!p.image && <div style={{ height: '160px', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '32px' }}></div>}
                  <div style={{ padding: '12px 14px' }}>
                    <h4 style={{ margin: '0 0 4px', color: '#2a5a8a', fontSize: '14px', fontWeight: 700 }}>{p.title}</h4>
                    {p.description && <p style={{ margin: 0, color: '#666', fontSize: '12px', lineHeight: '1.4' }}>{p.description.substring(0, 60)}{p.description.length > 60 ? '...' : ''}</p>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button onClick={(e) => { e.stopPropagation(); startEdit(p); }} style={{ padding: '4px 12px', background: '#fff', color: '#2a5a8a', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>Edit</button>
                      {deleteConfirm === p._id ? (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id); }} style={{ padding: '4px 12px', background: '#dc3545', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Yes</button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }} style={{ padding: '4px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>No</button>
                        </>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(p._id); }} style={{ padding: '4px 12px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* ===== VIDEOS ===== */}
            {tab === 'videos' && videos.map((v) => (
              isEditing(v._id) ? (
                <div key={v._id}>{renderFormCard()}</div>
              ) : (
                <div key={v._id} style={{
                  background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', overflow: 'hidden',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(36,51,88,0.1)'; e.currentTarget.style.borderColor = '#d4a54a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e4e8ed'; }}
                >
                  <div style={{ height: '160px', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {v.thumbnail ? <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: '36px' }}>▶</span>}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <h4 style={{ margin: '0 0 4px', color: '#2a5a8a', fontSize: '14px', fontWeight: 700 }}>{v.title}</h4>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button onClick={() => startEdit(v)} style={{ padding: '4px 12px', background: '#fff', color: '#2a5a8a', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>Edit</button>
                      {deleteConfirm === v._id ? (
                        <>
                          <button onClick={() => handleDelete(v._id)} style={{ padding: '4px 12px', background: '#dc3545', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>No</button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(v._id)} style={{ padding: '4px 12px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* ===== NEWS ===== */}
            {tab === 'news' && news.map((n) => (
              isEditing(n._id) ? (
                <div key={n._id}>{renderFormCard()}</div>
              ) : (
                <div key={n._id} style={{
                  background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', overflow: 'hidden',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(36,51,88,0.1)'; e.currentTarget.style.borderColor = '#d4a54a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e4e8ed'; }}
                >
                  {n.image && <img src={n.image} alt={n.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />}
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ padding: '2px 8px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{n.date}</span>
                      {n.source && <span style={{ padding: '2px 8px', background: '#e3f2fd', color: '#1565c0', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>{n.source}</span>}
                    </div>
                    <h4 style={{ margin: '0 0 4px', color: '#2a5a8a', fontSize: '14px', fontWeight: 700 }}>{n.title}</h4>
                    {n.summary && <p style={{ margin: 0, color: '#666', fontSize: '12px', lineHeight: '1.4' }}>{n.summary.substring(0, 80)}{n.summary.length > 80 ? '...' : ''}</p>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button onClick={() => startEdit(n)} style={{ padding: '4px 12px', background: '#fff', color: '#2a5a8a', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>Edit</button>
                      {deleteConfirm === n._id ? (
                        <>
                          <button onClick={() => handleDelete(n._id)} style={{ padding: '4px 12px', background: '#dc3545', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>No</button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(n._id)} style={{ padding: '4px 12px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* ===== SLIDES ===== */}
            {tab === 'slides' && slides.map((s) => (
              isEditing(s._id) ? (
                <div key={s._id}>{renderFormCard()}</div>
              ) : (
                <div key={s._id} style={{
                  background: '#fff', border: '1px solid #e4e8ed', borderRadius: '10px', overflow: 'hidden',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(36,51,88,0.1)'; e.currentTarget.style.borderColor = '#d4a54a'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e4e8ed'; }}
                >
                  {s.image && <img src={s.image} alt={s.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />}
                  <div style={{ padding: '12px 14px' }}>
                    {s.title && <h4 style={{ margin: '0 0 4px', color: '#2a5a8a', fontSize: '14px', fontWeight: 700 }}>{s.title}</h4>}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button onClick={() => startEdit(s)} style={{ padding: '4px 12px', background: '#fff', color: '#2a5a8a', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>Edit</button>
                      {deleteConfirm === s._id ? (
                        <>
                          <button onClick={() => handleDelete(s._id)} style={{ padding: '4px 12px', background: '#dc3545', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Yes</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: '4px 12px', background: '#fff', color: '#555', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}>No</button>
                        </>
                      ) : (
                        <button onClick={() => setDeleteConfirm(s._id)} style={{ padding: '4px 12px', background: '#fff', color: '#dc3545', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: '1px solid #dc3545', cursor: 'pointer' }}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminGallery;
