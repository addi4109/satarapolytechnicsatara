/**
 * AdminContentCard — Reusable card with image, title, description, and action buttons.
 * Used in gallery, placements, and other listing admin pages.
 *
 * Usage:
 *   <AdminContentCard
 *     image={photo.image}
 *     title={photo.title}
 *     description={photo.description}
 *     onDelete={() => handleDelete(photo._id)}
 *     onEdit={() => startEdit(photo)}
 *     deleteConfirm={deleteConfirm === photo._id}
 *     onCancelDelete={() => setDeleteConfirm(null)}
 *   />
 */
function AdminContentCard({
  image,
  imageAlt = '',
  imageHeight = '160px',
  placeholderIcon = '',
  title,
  description,
  badges,
  children,
  onEdit,
  onDelete,
  deleteConfirm,
  onCancelDelete,
  onClick,
  editLabel = 'Edit',
  style,
}) {
  return (
    <div
      className="admin-content-card"
      onClick={onClick}
      style={style}
    >
      {/* Image area */}
      {image ? (
        <img src={image} alt={imageAlt} className="admin-content-card-img" style={{ height: imageHeight }} />
      ) : placeholderIcon ? (
        <div className="admin-content-card-placeholder" style={{ height: imageHeight }}>
          {placeholderIcon}
        </div>
      ) : null}

      {/* Content area */}
      <div className="admin-content-card-body">
        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="admin-content-card-badges">
            {badges.map((badge, i) => (
              <span key={i} className={badge.className} style={badge.style}>
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {title && <h4 className="admin-content-card-title">{title}</h4>}
        {description && <p className="admin-content-card-desc">{description}</p>}
        {children}

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="admin-content-card-actions">
            {onEdit && (
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
              >
                {editLabel}
              </button>
            )}
            {onDelete && (
              deleteConfirm ? (
                <>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  >
                    Yes
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => { e.stopPropagation(); onCancelDelete?.(); }}
                  >
                    No
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                  Delete
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContentCard;
