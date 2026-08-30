/**
 * AdminAlert — Reusable dismissible alert banner for admin pages.
 *
 * Usage:
 *   <AdminAlert type="success" message={msg} onDismiss={() => setMsg(null)} />
 *   <AdminAlert type="error" message="Something went wrong" />
 */
function AdminAlert({ type = 'success', message, onDismiss, style }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type}`} style={style}>
      {typeof message === 'string' ? message : message.text}
      {onDismiss && (
        <button
          className="alert-dismiss-btn"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default AdminAlert;
