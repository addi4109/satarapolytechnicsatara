import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminLoading from '../components/AdminLoading';
import AdminContentCard from '../components/AdminContentCard';
import ImageUpload from '../components/ImageUpload';
import VideoUpload from '../components/VideoUpload';
import './Admin.css';

const API_URL = '/api';

const emptyPhoto = { title: '', image: '', description: '', order: 0 };
const emptyVideo = { title: '', videoUrl: '', thumbnail: '', description: '', order: 0 };
const emptyNews = { title: '', date: '', source: '', summary: '', image: '', order: 0 };
const emptySlide = { image: '', title: '', subtitle: '', link: '', order: 0 };

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

  const getLabel = () => {
    if (tab === 'photos') return 'Photo';
    if (tab === 'videos') return 'Video';
    if (tab === 'news') return 'News';
    return 'Slide';
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
    <div className="admin-content-card" style={{ borderColor: '#c8963e', borderWidth: '2px' }}>
      <div className="admin-content-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, color: '#243358', fontSize: '15px' }}>{editingId ? 'Edit' : 'Add New'} {getLabel()}</h4>
          <button onClick={cancelForm} className="alert-dismiss-btn" style={{ fontSize: '18px', color: '#999' }}>×</button>
        </div>
        <form onSubmit={handleSave}>
          {/* Photo fields */}
          {tab === 'photos' && <>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Title *</label>
              <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Photo title" required />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} style={{ width: '100px' }} />
            </div>
            <div className="form-group">
              <ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="" placeholder="Upload photo..." />
            </div>
            {form.image && <img src={form.image} alt="Preview" className="admin-content-card-img" style={{ height: '100px', borderRadius: '6px', marginBottom: '10px' }} />}
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Description</label>
              <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Optional description" />
            </div>
          </>}

          {/* Video fields */}
          {tab === 'videos' && <>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Title *</label>
              <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Video title" required />
            </div>
            <div className="form-group">
              <VideoUpload value={form.videoUrl || ''} onChange={(url) => setForm({ ...form, videoUrl: url })} label="Video *" placeholder="Upload video..." />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <ImageUpload value={form.thumbnail || ''} onChange={(url) => setForm({ ...form, thumbnail: url })} label="" placeholder="Thumbnail..." />
              </div>
              <div className="form-group" style={{ width: '80px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Order</label>
                <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} />
              </div>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Description</label>
              <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
          </>}

          {/* News fields */}
          {tab === 'news' && <>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Title *</label>
              <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="News title" required />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Date *</label>
                <input type="text" value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="15 Jul 2025" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Source</label>
                <input type="text" value={form.source || ''} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Times of India" />
              </div>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Summary</label>
              <textarea value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} />
            </div>
            <div className="form-group"><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="" placeholder="News image..." /></div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Order</label>
              <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} style={{ width: '100px' }} />
            </div>
          </>}

          {/* Slide fields */}
          {tab === 'slides' && <>
            <div className="form-group"><ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} label="" placeholder="Slide image..." /></div>
            {form.image && <img src={form.image} alt="Preview" className="admin-content-card-img" style={{ height: '80px', borderRadius: '6px', marginBottom: '10px' }} />}
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Title</label>
              <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Slide title" />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Subtitle</label>
              <input type="text" value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Slide subtitle" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Link</label>
                <input type="text" value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Optional link" />
              </div>
              <div className="form-group" style={{ width: '80px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Order</label>
                <input type="number" value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} min={0} />
              </div>
            </div>
          </>}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e4e8ed' }}>
            <button type="submit" className="btn btn-success btn-sm" disabled={saving} style={{ flex: 1 }}>{saving ? 'Saving...' : editingId ? 'Update' : 'Add'}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={cancelForm}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Gallery & Content</h1>
      </div>
      <div className="admin-content">
        <AdminAlert type={message?.type} message={message} onDismiss={() => setMessage(null)} />

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
          <AdminLoading text="Loading gallery..." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Add New Card */}
            {!adding && !editingId && (
              <div
                onClick={startAdd}
                className="admin-content-card"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '200px', borderStyle: 'dashed', cursor: 'pointer',
                }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#243358', fontWeight: 300 }}>+</div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#243358', marginTop: '10px' }}>Add {getLabel()}</span>
              </div>
            )}

            {/* Inline Form Card */}
            {adding && renderFormCard()}

            {/* ===== PHOTOS ===== */}
            {tab === 'photos' && photos.map((p) => (
              isEditing(p._id) ? (
                <div key={p._id}>{renderFormCard()}</div>
              ) : (
                <AdminContentCard
                  key={p._id}
                  image={p.image}
                  imageAlt={p.title}
                  title={p.title}
                  description={p.description ? p.description.substring(0, 60) + (p.description.length > 60 ? '...' : '') : undefined}
                  onEdit={() => startEdit(p)}
                  onDelete={() => handleDelete(p._id)}
                  deleteConfirm={deleteConfirm === p._id}
                  onCancelDelete={() => setDeleteConfirm(null)}
                />
              )
            ))}

            {/* ===== VIDEOS ===== */}
            {tab === 'videos' && videos.map((v) => (
              isEditing(v._id) ? (
                <div key={v._id}>{renderFormCard()}</div>
              ) : (
                <AdminContentCard
                  key={v._id}
                  image={v.thumbnail}
                  imageAlt={v.title}
                  placeholderIcon="▶"
                  imageHeight="160px"
                  title={v.title}
                  onEdit={() => startEdit(v)}
                  onDelete={() => handleDelete(v._id)}
                  deleteConfirm={deleteConfirm === v._id}
                  onCancelDelete={() => setDeleteConfirm(null)}
                />
              )
            ))}

            {/* ===== NEWS ===== */}
            {tab === 'news' && news.map((n) => (
              isEditing(n._id) ? (
                <div key={n._id}>{renderFormCard()}</div>
              ) : (
                <AdminContentCard
                  key={n._id}
                  image={n.image}
                  imageAlt={n.title}
                  imageHeight="140px"
                  title={n.title}
                  description={n.summary ? n.summary.substring(0, 80) + (n.summary.length > 80 ? '...' : '') : undefined}
                  badges={[
                    { text: n.date, style: { padding: '2px 8px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontSize: '10px', fontWeight: 600 } },
                    ...(n.source ? [{ text: n.source, style: { padding: '2px 8px', background: '#e3f2fd', color: '#1565c0', borderRadius: '4px', fontSize: '10px', fontWeight: 600 } }] : []),
                  ]}
                  onEdit={() => startEdit(n)}
                  onDelete={() => handleDelete(n._id)}
                  deleteConfirm={deleteConfirm === n._id}
                  onCancelDelete={() => setDeleteConfirm(null)}
                />
              )
            ))}

            {/* ===== SLIDES ===== */}
            {tab === 'slides' && slides.map((s) => (
              isEditing(s._id) ? (
                <div key={s._id}>{renderFormCard()}</div>
              ) : (
                <AdminContentCard
                  key={s._id}
                  image={s.image}
                  imageAlt={s.title}
                  imageHeight="140px"
                  title={s.title}
                  onEdit={() => startEdit(s)}
                  onDelete={() => handleDelete(s._id)}
                  deleteConfirm={deleteConfirm === s._id}
                  onCancelDelete={() => setDeleteConfirm(null)}
                />
              )
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminGallery;
