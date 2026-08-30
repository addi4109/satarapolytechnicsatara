import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { getAdminApiKey } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import './Admin.css';

function AdminFeedbacks() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showOnHome, setShowOnHome] = useState({});

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth') || !getAdminApiKey()) {
      navigate('/admin/login');
      return;
    }
    fetchFeedbacks();
  }, [navigate]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFeedbacks(data);
      const homeMap = {};
      data.forEach((f) => { homeMap[f.id] = f.showOnHome || false; });
      setShowOnHome(homeMap);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      setError('Failed to load feedbacks. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await deleteDoc(doc(db, 'feedbacks', id));
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      if (selectedFeedback?.id === id) setSelectedFeedback(null);
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      alert('Failed to delete feedback');
    }
  };

  const toggleShowOnHome = async (id, current) => {
    try {
      await updateDoc(doc(db, 'feedbacks', id), { showOnHome: !current });
      setShowOnHome((prev) => ({ ...prev, [id]: !current }));
      setFeedbacks((prev) => prev.map((f) => f.id === id ? { ...f, showOnHome: !current } : f));
    } catch (err) {
      console.error('Failed to update feedback:', err);
      alert('Failed to update feedback');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <span style={{ color: '#f59e0b', fontSize: '14px' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  const filtered = feedbacks.filter((f) => {
    const term = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (f.name || '').toLowerCase().includes(term) ||
      (f.email || '').toLowerCase().includes(term) ||
      (f.subject || '').toLowerCase().includes(term) ||
      (f.message || '').toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Feedbacks</h1>
        <div className="admin-topbar-actions">
          <span style={{ fontSize: '13px', color: '#888', alignSelf: 'center' }}>
            {filtered.length} feedback{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="admin-content">
        <AdminAlert type="error" message={error} onDismiss={() => setError('')} />

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: "'Times New Roman', Times, serif",
            }}
          />
          <button className="btn btn-primary" onClick={fetchFeedbacks}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            Loading feedbacks...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            {feedbacks.length === 0
              ? 'No feedbacks yet. They will appear here when someone submits the feedback form.'
              : 'No feedbacks match your search.'}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="admin-card" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Rating</th>
                      <th>Show on Home</th>
                      <th>Date</th>
                      <th style={{ width: '100px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((fb, idx) => (
                      <tr
                        key={fb.id}
                        onClick={() =>
                          setSelectedFeedback(selectedFeedback?.id === fb.id ? null : fb)
                        }
                        style={{
                          cursor: 'pointer',
                          background:
                            selectedFeedback?.id === fb.id ? '#f5f7fa' : 'transparent',
                        }}
                      >
                        <td style={{ fontWeight: 600, color: '#243358' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{fb.name || 'N/A'}</td>
                        <td>{fb.email || 'N/A'}</td>
                        <td>{fb.subject || 'N/A'}</td>
                        <td>{renderStars(fb.rating)}</td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleShowOnHome(fb.id, showOnHome[fb.id]);
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              background: showOnHome[fb.id] ? '#dcfce7' : '#fee2e2',
                              color: showOnHome[fb.id] ? '#166534' : '#991b1b',
                            }}
                          >
                            {showOnHome[fb.id] ? 'Visible' : 'Hidden'}
                          </button>
                        </td>
                        <td style={{ fontSize: '12px', color: '#888' }}>
                          {formatDate(fb.createdAt)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(fb.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Card */}
            {selectedFeedback && (
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e4e8ed',
                  borderRadius: '8px',
                  padding: '24px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e4e8ed',
                  }}
                >
                  <h3 style={{ margin: 0, fontFamily: "'Georgia', serif", color: '#243358' }}>
                    Feedback Details
                  </h3>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedFeedback(null)}
                  >
                    Close
                  </button>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Name
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedFeedback.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Email
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedFeedback.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Phone
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedFeedback.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Subject
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedFeedback.subject || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Rating
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {renderStars(selectedFeedback.rating)} ({selectedFeedback.rating || 0}/5)
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Submitted On
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {formatDate(selectedFeedback.createdAt)}
                    </p>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Message
                    </label>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '15px',
                        color: '#333',
                        lineHeight: 1.6,
                        background: '#f9fafb',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      {selectedFeedback.message || 'No message'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminFeedbacks;
