import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { getAdminApiKey } from '../lib/adminApi';
import AdminLayout from './AdminLayout';
import AdminAlert from '../components/AdminAlert';
import AdminLoading from '../components/AdminLoading';
import './Admin.css';

function AdminEnquiries() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth') || !getAdminApiKey()) {
      navigate('/admin/login');
      return;
    }
    fetchEnquiries();
  }, [navigate]);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      setError('Failed to load enquiries. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
      alert('Failed to delete enquiry');
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

  const departments = [...new Set(enquiries.map((e) => e.department).filter(Boolean))];

  const buildGmailUrl = (enq) => {
    if (!enq.email) return null;
    const body = [
      `Dear ${enq.fullName || 'Student'},`,
      ``,
      `Thank you for your enquiry regarding ${enq.department || 'Satara Polytechnic'}.`,
      ``,
      `Here are the details of your enquiry:`,
      `  Name: ${enq.fullName || 'N/A'}`,
      `  Phone: ${enq.phone || 'N/A'}`,
      `  Email: ${enq.email || 'N/A'}`,
      `  Department: ${enq.department || 'N/A'}`,
      `  Message: ${enq.message || 'No message'}`,
      `  Date: ${formatDate(enq.createdAt)}`,
      ``,
      `[Write your reply here]`,
      ``,
      `Best regards,`,
      `Satara Polytechnic`,
    ].join('\n');
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(enq.email)}&su=${encodeURIComponent(`Re: Your enquiry - ${enq.department || 'Satara Polytechnic'}`)}&body=${encodeURIComponent(body)}`;
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      !searchTerm ||
      (e.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.phone || '').includes(searchTerm) ||
      (e.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDept || e.department === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Enquiries</h1>
        <div className="admin-topbar-actions">
          <span style={{ fontSize: '13px', color: '#888', alignSelf: 'center' }}>
            {filtered.length} enquiry{filtered.length !== 1 ? 'ies' : ''}
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
            placeholder="Search by name, email, phone, or message..."
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
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: "'Times New Roman', Times, serif",
              minWidth: '180px',
            }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={fetchEnquiries}>
            Refresh
          </button>
        </div>

        {loading ? (
          <AdminLoading text="Loading enquiries..." />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            {enquiries.length === 0
              ? 'No enquiries yet. They will appear here when someone submits the enquiry form.'
              : 'No enquiries match your search.'}
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
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Date</th>
                      <th style={{ width: '80px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((enq, idx) => (
                      <tr
                        key={enq.id}
                        onClick={() =>
                          setSelectedEnquiry(selectedEnquiry?.id === enq.id ? null : enq)
                        }
                        style={{
                          cursor: 'pointer',
                          background:
                            selectedEnquiry?.id === enq.id ? '#f5f7fa' : 'transparent',
                        }}
                      >
                        <td style={{ fontWeight: 600, color: '#243358' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{enq.fullName || 'N/A'}</td>
                        <td>{enq.phone || 'N/A'}</td>
                        <td>{enq.email || 'N/A'}</td>
                        <td>
                          <span
                            style={{
                              background: '#e3f2fd',
                              color: '#1565c0',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {enq.department || 'N/A'}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#888' }}>
                          {formatDate(enq.createdAt)}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              title="Send Email"
                              onClick={(e) => {
                                e.stopPropagation();
                                const url = buildGmailUrl(enq);
                                if (url) {
                                  window.open(url, '_blank');
                                } else {
                                  alert('No email address provided for this enquiry.');
                                }
                              }}
                            >
                              ✉
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(enq.id);
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

            {/* Detail Card (when a row is clicked) */}
            {selectedEnquiry && (
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
                    Enquiry Details
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedEnquiry.email && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          const url = buildGmailUrl(selectedEnquiry);
                          if (url) window.open(url, '_blank');
                        }}
                      >
                        ✉ Reply via Gmail
                      </button>
                    )}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedEnquiry(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                  }}
                >
                  {selectedEnquiry.email && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <a
                        href={buildGmailUrl(selectedEnquiry) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'linear-gradient(135deg, #d44638 0%, #c23321 100%)',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          fontFamily: "'Times New Roman', Times, serif",
                        }}
                      >
                        ✉ Send Email to {selectedEnquiry.fullName}
                      </a>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Full Name
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedEnquiry.fullName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Phone
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedEnquiry.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Email
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedEnquiry.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Department
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedEnquiry.department || 'N/A'}
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
                      }}
                    >
                      {selectedEnquiry.message || 'No message'}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Submitted On
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {formatDate(selectedEnquiry.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>
                      Source
                    </label>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#333' }}>
                      {selectedEnquiry.source || 'website'}
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

export default AdminEnquiries;
