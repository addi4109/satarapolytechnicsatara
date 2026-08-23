import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../components/ImageUpload';
import './Admin.css';

const API_URL = '/api';

const emptyPhoto = { title: '', image: '', category: 'general', description: '', order: 0 };
const emptyVideo = { title: '', videoUrl: '', thumbnail: '', description: '', order: 0 };
const emptyNews = { title: '', date: '', source: '', summary: '', image: '', order: 0 };
const emptyRecruiter = { name: '', logo: '', order: 0 };
const emptyNotice = { text: '', active: true, order: 0 };
const emptySlide = { image: '', title: '', link: '', order: 0 };

function AdminGallery() {
  const [tab, setTab] = useState('photos');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
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
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally { setLoading(false); }
  };

  const openAdd = () => { setEditId(null); setForm(getEmpty()); setShowForm(true); };
  const openEdit = (item) => { setEditId(item._id); setForm({ ...item }); setShowForm(true); };
  const cancelForm = () => { setShowForm(false); setEditId(null); setMessage(null); };

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ep = getEndpoint();
      const url = editId ? `${API_URL}/${ep}/${editId}` : `${API_URL}/${ep}`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) {
        setMessage({ type: 'success', text: editId ? 'Updated!' : 'Added!' });
        setShowForm(false); setEditId(null);
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

  const switchTab = (t) => { setTab(t); setShowForm(false); setEditId(null); setMessage(null); };

  const renderItemActions = (id) => (
    <div className="cells-admin-card-actions">
      <button className="btn btn-primary btn-sm" onClick={() => {
        const list = tab === 'photos' ? photos : tab === 'videos' ? videos : tab === 'news' ? news : slides;
        openEdit(list.find((i) => i._id === id));
      }}>Edit</button>
      {deleteConfirm === id ? (
        <>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>Confirm</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
        </>
      ) : (
        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(id)}>Delete</button>
      )}
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Gallery & Content</h1>
        <div className="admin-topbar-actions">
          <button className="btn btn-success" onClick={openAdd}>+ Add New</button>
        </div>
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

        {/* Inline Form */}
        {showForm && (
          <div className="dept-form-card" style={{ marginBottom: '24px' }}>
            <div className="dept-form-card-header">
              <div className="dept-form-card-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div><h3>{editId ? 'Edit' : 'Add New'} {tab.charAt(0).toUpperCase() + tab.slice(1, -1)}</h3></div>
            </div>
            <div className="dept-form-card-body">
              <form className="admin-form" onSubmit={handleSave}>
                {/* Photo fields */}
                {tab === 'photos' && <>
                  <div className="form-group"><label>Title *</label><input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Category</label><select value={form.category || 'general'} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="general">General</option><option value="campus">Campus</option><option value="events">Events</option><option value="labs">Labs</option><option value="placements">Placements</option></select></div>
                    <div className="form-group"><label>Order</label><input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} /></div>
                  </div>
                  <div className="form-group"><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="Photo" placeholder="Upload photo..." /></div>
                  <div className="form-group"><label>Description</label><textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                </>}

                {/* Video fields */}
                {tab === 'videos' && <>
                  <div className="form-group"><label>Title *</label><input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                  <div className="form-group"><label>YouTube URL *</label><input type="text" value={form.videoUrl || ''} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." required /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Thumbnail URL</label><input type="text" value={form.thumbnail || ''} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." /></div>
                    <div className="form-group"><label>Order</label><input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} /></div>
                  </div>
                  <div className="form-group"><label>Description</label><textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
                </>}

                {/* News fields */}
                {tab === 'news' && <>
                  <div className="form-group"><label>Title *</label><input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Date *</label><input type="text" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. 15 Jul 2025" required /></div>
                    <div className="form-group"><label>Source</label><input type="text" value={form.source || ''} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="e.g. Times of India" /></div>
                  </div>
                  <div className="form-group"><label>Summary</label><textarea value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={4} /></div>
                  <div className="form-group"><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="News Image (optional)" placeholder="Upload news image..." /></div>
                  <div className="form-group"><label>Order</label><input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} /></div>
                </>}



                {/* Slide fields */}
                {tab === 'slides' && <>
                  <div className="form-group"><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="Slide Image" placeholder="Upload slide image..." /></div>
                  <div className="form-row">
                    <div className="form-group"><label>Title (optional)</label><input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Slide title" /></div>
                    <div className="form-group"><label>Link URL (optional)</label><input type="text" value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
                  </div>
                  <div className="form-group"><label>Order</label><input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} /></div>
                </>}



                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
                  <button type="button" className="btn btn-secondary" onClick={cancelForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== PHOTOS ===== */}
        {tab === 'photos' && !showForm && (
          loading ? <p>Loading...</p> : photos.length === 0 ? (
            <EmptyState text="No photos yet." onAdd={openAdd} />
          ) : (
            <div className="cells-admin-grid">
              {photos.map((p) => (
                <div key={p._id} className="cells-admin-card">
                  {p.image && <div style={{ height: '160px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}><img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  <div className="cells-admin-card-top"><span className="badge badge-cell">{p.category}</span></div>
                  <h3 className="cells-admin-card-title">{p.title}</h3>
                  <p className="cells-admin-card-desc">{p.description || 'No description'}</p>
                  {renderItemActions(p._id)}
                </div>
              ))}
            </div>
          )
        )}

        {/* ===== VIDEOS ===== */}
        {tab === 'videos' && !showForm && (
          loading ? <p>Loading...</p> : videos.length === 0 ? (
            <EmptyState text="No videos yet." onAdd={openAdd} />
          ) : (
            <div className="cells-admin-grid">
              {videos.map((v) => (
                <div key={v._id} className="cells-admin-card">
                  <div style={{ height: '160px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px', background: '#7A263A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {v.thumbnail ? <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#315C4A', fontSize: '36px' }}>▶</span>}
                  </div>
                  <h3 className="cells-admin-card-title">{v.title}</h3>
                  <p className="cells-admin-card-desc" style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>{v.videoUrl}</p>
                  {renderItemActions(v._id)}
                </div>
              ))}
            </div>
          )
        )}

        {/* ===== NEWS ===== */}
        {tab === 'news' && !showForm && (
          loading ? <p>Loading...</p> : news.length === 0 ? (
            <EmptyState text="No news yet." onAdd={openAdd} />
          ) : (
            <>
              {/* News with image - 3 per row grid */}
              {news.filter(n => n.image).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                  {news.filter(n => n.image).map((n) => (
                    <div key={n._id} className="cells-admin-card">
                      <div style={{ height: '160px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                        <img src={n.image} alt={n.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-cell">{n.date}</span>
                        {n.source && <span className="badge badge-committee">{n.source}</span>}
                      </div>
                      <h3 className="cells-admin-card-title" style={{ fontSize: '14px' }}>{n.title}</h3>
                      <p className="cells-admin-card-desc" style={{ fontSize: '12px' }}>{n.summary}</p>
                      <div className="cells-admin-card-actions" style={{ marginTop: '10px' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => openEdit(n)}>Edit</button>
                        {deleteConfirm === n._id ? (
                          <><button className="btn btn-danger btn-sm" onClick={() => handleDelete(n._id)}>Confirm</button><button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button></>
                        ) : (
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(n._id)}>Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* News without image - full width */}
              {news.filter(n => !n.image).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {news.filter(n => !n.image).map((n) => (
                    <div key={n._id} className="admin-card" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
                            <span className="badge badge-cell">{n.date}</span>
                            {n.source && <span className="badge badge-committee">{n.source}</span>}
                          </div>
                          <h3 style={{ fontFamily: "'Georgia', serif", fontSize: '15px', color: '#7A263A', margin: '0 0 4px' }}>{n.title}</h3>
                          <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' }}>{n.summary}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => openEdit(n)}>Edit</button>
                          {deleteConfirm === n._id ? (
                            <><button className="btn btn-danger btn-sm" onClick={() => handleDelete(n._id)}>Confirm</button><button className="btn btn-secondary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button></>
                          ) : (
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(n._id)}>Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        )}



        {/* ===== SLIDES ===== */}
        {tab === 'slides' && !showForm && (
          loading ? <p>Loading...</p> : slides.length === 0 ? (
            <EmptyState text="No slides yet." onAdd={openAdd} />
          ) : (
            <div className="cells-admin-grid">
              {slides.map((s) => (
                <div key={s._id} className="cells-admin-card">
                  {s.image && <div style={{ height: '160px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}><img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  {s.title && <h3 className="cells-admin-card-title">{s.title}</h3>}
                  {s.link && <p className="cells-admin-card-desc" style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>{s.link}</p>}
                  {renderItemActions(s._id)}
                </div>
              ))}
            </div>
          )
        )}


      </div>
    </AdminLayout>
  );
}

function EmptyState({ text, onAdd }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <p style={{ color: '#888', marginBottom: '16px' }}>{text}</p>
      <button className="btn btn-success" onClick={onAdd}>Add First Item</button>
    </div>
  );
}

export default AdminGallery;
