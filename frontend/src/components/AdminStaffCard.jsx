/**
 * AdminStaffCard — Reusable staff member card with click-to-edit.
 * Used in Governing Body, Local Governing Body, Non-teaching Staff,
 * Office Staff, Placement Team, and any other staff listing.
 *
 * Usage:
 *   <AdminStaffCard
 *     member={member}
 *     isEditing={editId === member._id}
 *     editForm={editForm}
 *     onFormChange={setEditForm}
 *     onStartEdit={() => startEdit(member)}
 *     onSave={handleSave}
 *     onCancel={cancelEdit}
 *     onDelete={() => handleDelete(member._id)}
 *     deleteConfirm={deleteConfirm === member._id}
 *     onCancelDelete={() => setDeleteConfirm(null)}
 *     fields={[
 *       { key: 'name', label: 'Name', placeholder: 'Name' },
 *       { key: 'designation', label: 'Designation', placeholder: 'Designation' },
 *       { key: 'phone', label: 'Phone', placeholder: 'Phone' },
 *       { key: 'email', label: 'Email', placeholder: 'Email' },
 *     ]}
 *   />
 *
 *   // Add new member
 *   <AdminStaffCard
 *     isAddMode
 *     editForm={form}
 *     onFormChange={setForm}
 *     onSave={handleSave}
 *     onCancel={cancelForm}
 *     saving={saving}
 *     fields={[...]}
 *   />
 */
import ImageUpload from './ImageUpload';

function AdminStaffCard({
  member,
  isEditing = false,
  isAddMode = false,
  editForm,
  onFormChange,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  deleteConfirm = false,
  onCancelDelete,
  saving = false,
  fields = [],
  order,
}) {
  const handleFieldChange = (key, value) => {
    onFormChange({ ...editForm, [key]: value });
  };

  // ── Add mode ──
  if (isAddMode) {
    return (
      <div className="gb-member-card gb-member-editing" style={{ background: '#fff', border: '1px solid #000' }}>
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <ImageUpload
            value={editForm.photoUrl || ''}
            onChange={(url) => onFormChange({ ...editForm, photoUrl: url })}
            circle
          />
        </div>
        {fields.map((f) => (
          <input
            key={f.key}
            type={f.type || 'text'}
            className="gb-member-input"
            value={editForm[f.key] || ''}
            onChange={(e) => handleFieldChange(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={f.placeholder}
            min={f.min}
          />
        ))}
        <div className="gb-member-actions">
          <button className="btn btn-success btn-sm" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── Editing mode (inline) ──
  if (isEditing) {
    return (
      <div className="gb-member-card gb-member-editing" style={{ background: '#fff', border: '1px solid #000' }}>
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <ImageUpload
            value={editForm.photoUrl || ''}
            onChange={(url) => onFormChange({ ...editForm, photoUrl: url })}
            circle
          />
        </div>
        {fields.map((f) => (
          <input
            key={f.key}
            type={f.type || 'text'}
            className="gb-member-input"
            value={editForm[f.key] || ''}
            onChange={(e) => handleFieldChange(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={f.placeholder}
            min={f.min}
          />
        ))}
        <div className="gb-member-actions">
          <button className="btn btn-success btn-sm" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  // ── Display mode ──
  const name = member?.name || 'Unknown';
  const initials = name.split(' ')?.map((w) => w.charAt(0)).join('').substring(0, 2).toUpperCase() || '?';

  return (
    <div
      className="gb-member-card"
      onClick={onStartEdit}
      style={{ cursor: 'pointer' }}
      title="Click to edit"
    >
      {order != null && <span className="gb-member-order">{order}</span>}
      {member?.photoUrl ? (
        <img src={member.photoUrl} alt={name} className="gb-member-photo" />
      ) : (
        <div className="gb-member-photo gb-member-photo-empty">
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#243358', fontFamily: 'Georgia, serif' }}>
            {initials}
          </span>
        </div>
      )}
      <h3 className="gb-member-name">{name}</h3>
      <p className="gb-member-designation">{member?.designation || member?.position || ''}</p>
      {member?.phone && (
        <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#888' }}>{member.phone}</p>
      )}
      {member?.email && (
        <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{member.email}</p>
      )}
      <div className="gb-member-actions" onClick={(e) => e.stopPropagation()}>
        {deleteConfirm ? (
          <>
            <button className="btn btn-danger btn-sm" onClick={onDelete}>Yes, Delete</button>
            <button className="btn btn-secondary btn-sm" onClick={onCancelDelete}>Cancel</button>
          </>
        ) : (
          <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
        )}
      </div>
    </div>
  );
}

export default AdminStaffCard;
