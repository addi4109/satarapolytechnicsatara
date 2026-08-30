import { useState, useEffect } from 'react';
import { SkeletonTable } from "../components/Skeleton";
import PageBanner from '../components/PageBanner';
import SEO, { breadcrumbSchema } from '../components/SEO';
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
        <div className="notices-table-wrap">
          {loading ? (
            <SkeletonTable rows={8} cols={4} />
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
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{index + 1}</td>
                    <td>
                      <div className="notice-title-cell">{notice.title}</div>
                      {notice.text && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{notice.text.substring(0, 80)}{notice.text.length > 80 ? '...' : ''}</div>}
                    </td>
                    <td style={{ fontSize: '13px', color: '#666' }}>{new Date(notice.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        {(notice.pdfUrl || notice.imageUrl) && (
                          <a
                            href={notice.pdfUrl ? `/api/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                            target="_blank"
                            style={{ padding: '5px 14px', background: '#243358', color: '#fff', fontSize: '12px', fontWeight: 600, borderRadius: '4px', textDecoration: 'none', cursor: 'pointer' }}
                          >View</a>
                        )}
                        {(notice.pdfUrl || notice.imageUrl) && (
                          <a
                            href={notice.pdfUrl ? `/api/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                            download
                            style={{ padding: '5px 14px', background: '#fff', color: '#243358', fontSize: '12px', fontWeight: 600, borderRadius: '4px', border: '1px solid #243358', textDecoration: 'none', cursor: 'pointer' }}
                          >Download</a>
                        )}
                      </div>
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
