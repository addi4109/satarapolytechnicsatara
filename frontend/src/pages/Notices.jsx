import { useState, useEffect } from 'react';
import { SkeletonTable } from "../components/Skeleton";
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
import './Notices.css';

import API_URL from '../lib/api';

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
      <SEO
        title="Notices & Circulars | Latest Announcements"
        description="View latest notices, circulars, and official announcements from Satara Polytechnic administration. Stay updated with important college information."
        keywords="college notices, circulars, announcements, Satara Polytechnic notices, polytechnic circulars"
        url="/notices"
        structuredData={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Notices' },
        ])}
      />
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
        <div className="fee-table-wrap notices-doc-table-wrap">
          {loading ? (
            <SkeletonTable rows={8} cols={4} />
          ) : notices.length === 0 ? (
            <div className="notices-empty">
              <p>No notices available.</p>
            </div>
          ) : (
            <table className="fee-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>Sr. No.</th>
                  <th>Title</th>
                  <th style={{ width: 120, textAlign: 'center' }}>Date</th>
                  <th style={{ width: 120, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice._id}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{index + 1}</td>
                    <td>
                      <div className="fee-particular" style={{ fontWeight: 500 }}>{notice.title}</div>
                      {notice.text && (
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                          {notice.text.substring(0, 80)}
                          {notice.text.length > 80 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
                      {new Date(notice.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {(notice.pdfUrl || notice.imageUrl) ? (
                        <div className="exam-action-btns">
                          <a
                            className="exam-btn exam-btn-view"
                            href={notice.pdfUrl ? `${API_URL}/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >View</a>
                          <a
                            className="exam-btn exam-btn-download"
                            href={notice.pdfUrl ? `${API_URL}/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                            download
                            title="Download"
                          >
                            <span className="exam-download-text">Download</span>
                            <span className="exam-download-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </span>
                          </a>
                        </div>
                      ) : (
                        <span style={{ color: '#ccc', fontSize: '12px' }}>—</span>
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
