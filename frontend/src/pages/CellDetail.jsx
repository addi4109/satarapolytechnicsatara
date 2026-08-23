import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import './CellsPage.css';

const API_URL = '/api';

function CellDetail() {
  const { cellId } = useParams();
  const [cell, setCell] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/cells/${cellId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((cellData) => setCell(cellData))
      .catch((err) => console.error('Failed to fetch cell:', err))
      .finally(() => setLoading(false));
  }, [cellId]);

  if (loading) {
    return (
      <>
        <PageBanner
          title="Cells"
          breadcrumb={<><a href="/">Home</a><span className="sep">|</span>Cells</>}
        />
        <div className="cells-page-wrap">
          <p style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading...</p>
        </div>
      </>
    );
  }

  if (!cell) {
    return (
      <>
        <PageBanner
          title="Cells"
          breadcrumb={<><a href="/">Home</a><span className="sep">|</span>Cells</>}
        />
        <div className="cells-page-wrap">
          <h2 className="cells-main-heading">Cell Not Found</h2>
          <div className="cells-main-line"></div>
          <p className="cells-intro">
            The requested cell page could not be found.{' '}
            <a href="/">Go back to Home</a>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBanner
        title={cell.name}
        breadcrumb={
          <>
            <a href="/">Home</a>
            <span className="sep">|</span>
            {cell.name}
          </>
        }
      />

      <div className="cells-page-wrap">
        <h2 className="cells-main-heading">{cell.name}</h2>
        <div className="cells-main-line"></div>
        {cell.members && cell.members.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="cell-card-table">
              <thead>
                <tr>
                  <th style={{ width: '70px', textAlign: 'center' }}>Sr. No.</th>
                  <th>Name of Member</th>
                  <th>Position</th>
                  <th>Designation</th>
                  <th>Contact Number</th>
                </tr>
              </thead>
              <tbody>
                {cell.members.map((member, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#243358' }}>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>{member.name}</td>
                    <td>{member.position || '-'}</td>
                    <td>{member.designation}</td>
                    <td>{member.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888', padding: '40px' }}>No members found.</p>
        )}
      </div>
    </>
  );
}

export default CellDetail;
