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
                  <th className="col-sr">Sr. No.</th>
                  <th className="col-title">Title</th>
                  <th className="col-date">Date</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice._id}>
                    <td className="cell-sr">{index + 1}</td>
                    <td>
                      <div className="notice-title-cell">{notice.title}</div>
                      {notice.text && (
                        <div className="notice-excerpt">
                          {notice.text.substring(0, 80)}
                          {notice.text.length > 80 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td className="cell-date">
                      {new Date(notice.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="cell-actions">
                      <div className="notice-actions">
                        {(notice.pdfUrl || notice.imageUrl) && (
                          <a
                            className="notice-btn notice-view-btn"
                            href={notice.pdfUrl ? `${API_URL}/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        )}
                        {(notice.pdfUrl || notice.imageUrl) && (
                          <a
                            className="notice-btn notice-download-btn"
                            href={notice.pdfUrl ? `${API_URL}/pdf-proxy?url=${encodeURIComponent(notice.pdfUrl)}` : notice.imageUrl}
                            download
                          >
                            Download
                          </a>
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
