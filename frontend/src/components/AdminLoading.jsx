/**
 * AdminLoading — Simple centered loading indicator for admin pages.
 *
 * Usage:
 *   <AdminLoading />
 *   <AdminLoading text="Loading departments..." />
 */
function AdminLoading({ text = 'Loading...' }) {
  return (
    <div className="admin-loading">
      <div className="admin-loading-spinner" />
      <span>{text}</span>
    </div>
  );
}

export default AdminLoading;
