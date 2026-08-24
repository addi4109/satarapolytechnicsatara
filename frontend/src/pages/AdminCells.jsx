import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

const API_URL = '/api';

function AdminCells() {
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    fetchCells();
  }, []);

  const fetchCells = async () => {
    try {
      const res = await fetch(`${API_URL}/cells`);
      const data = await res.json();
      setCells(data);
    } catch (err) {
      console.error('Failed to fetch cells:', err);
      setMessage({ type: 'error', text: 'Failed to load cells' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/cells/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = cells.filter((c) => c._id !== id);
        setCells(updated);
        if (selectedCell?._id === id) {
          setSelectedCell(null);
        }
        setMessage({ type: 'success', text: 'Cell deleted successfully' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete cell' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete cell' });
    }
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout>
      <div className="admin-topbar">
        <h1>Cells & Committees</h1>
        <div className="admin-topbar-actions">
          <Link to="/admin/cells/new" className="btn btn-success">
            Add New
          </Link>
        </div>
      </div>
      <div className="admin-content">
        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                color: 'inherit',
              }}
              onClick={() => setMessage(null)}
            >
              x
            </button>
          </div>
        )}

        {/* Live Preview Panel */}
        {selectedCell && (
          <div className="live-preview">
            <div className="live-preview-header">Live Preview</div>
            <div className="preview-cell-card">
              <span className={`preview-tag preview-tag-${selectedCell.type}`}>
                {selectedCell.type}
              </span>
              <h3 className="preview-cell-name">{selectedCell.name}</h3>
              <p className="preview-cell-desc">{selectedCell.description}</p>
              {selectedCell.members && selectedCell.members.length > 0 && (
                <table className="preview-members-table">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCell.members.map((m, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{m.name}</td>
                        <td>{m.position || m.designation || '-'}</td>
                        <td>{m.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {(!selectedCell.members || selectedCell.members.length === 0) && (
                <p className="preview-empty">No members added.</p>
              )}
            </div>
          </div>
        )}

        {/* Cells Cards Grid */}
        {loading ? (
          <p>Loading...</p>
        ) : cells.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ color: '#888', marginBottom: '16px' }}>No cells or committees found.</p>
            <Link to="/admin/cells/new" className="btn btn-success">
              Add First Cell
            </Link>
          </div>
        ) : (
          <div className="cells-admin-grid">
            {cells.map((cell) => (
              <div
                key={cell._id}
                className={`cells-admin-card ${selectedCell?._id === cell._id ? 'active' : ''}`}
                onClick={() => setSelectedCell(cell)}
              >
                <div className="cells-admin-card-top">
                  <span className={`badge badge-${cell.type}`}>
                    {cell.type}
                  </span>
                  <span className="cells-admin-card-count">
                    {cell.members?.length || 0} members
                  </span>
                </div>
                <h3 className="cells-admin-card-title">{cell.name}</h3>
                <p className="cells-admin-card-desc">
                  {cell.description
                    ? cell.description.length > 100
                      ? cell.description.substring(0, 100) + '...'
                      : cell.description
                    : 'No description'}
                </p>
                <div className="cells-admin-card-actions">
                  <Link
                    to={`/admin/cells/edit/${cell._id}`}
                    className="btn btn-primary btn-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  {deleteConfirm === cell._id ? (
                    <>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cell._id);
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(null);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(cell._id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCells;
