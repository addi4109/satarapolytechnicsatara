import { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import './Notices.css';

const API_URL = '/api';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/notices`);
      const data = await res.json();
      setNotices(data.filter((n) => n.category !== 'tinker'));
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBanner
        title="Notices"
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            Notices
          </>
        }
      />



      <div className="notices-page-wrap">
        <div className="notices-table-wrap">
          {loading ? (
            <div className="notices-loading">Loading...</div>
          ) : notices.length === 0 ? (
            <div className="notices-empty">
              <p>No notices available.</p>
            </div>
          ) : (
            <table className="notices-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Sr. No.</th>
                  <th style={{ textAlign: 'left' }}>Title</th>
                  <th style={{ width: '120px' }}>Date</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice._id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>
                      <div className="notice-title-cell">{notice.title}</div>
                    </td>
                    <td>{new Date(notice.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>
                      {notice.pdfUrl ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <a
                            href={notice.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="notice-btn notice-view-btn"
                            style={{ textDecoration: 'none' }}
                          >View</a>
                          <button
                            className="notice-btn notice-download-btn"
                            onClick={async () => {
                              try {
                                const res = await fetch(notice.pdfUrl);
                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${notice.title}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                              } catch {
                                window.open(notice.pdfUrl, '_blank');
                              }
                            }}
                          >Download</button>
                        </div>
                      ) : (
                        <span className="notice-btn notice-btn disabled">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Notices;
