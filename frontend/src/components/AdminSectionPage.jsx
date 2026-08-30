/**
 * AdminSectionPage — Reusable wrapper for tab-based admin section pages.
 * Provides consistent layout: topbar → tabs → alert → title → action bar → content.
 *
 * Usage:
 *   <AdminSectionPage
 *     title="Placements"
 *     tabs={SECTIONS}
 *     activeTab={activeTab}
 *     onTabChange={setActiveTab}
 *     hasData={!!sections[activeTab]}
 *     isEditing={view === 'edit'}
 *     onStartEdit={startEditing}
 *     onSave={handleSave}
 *     onCancel={cancelEditing}
 *     onDelete={handleDelete}
 *     saving={saving}
 *     msg={msg}
 *     onDismissMsg={() => setMsg(null)}
 *   >
 *     {/* preview or edit content */}
 *   </AdminSectionPage>
 */
import AdminAlert from './AdminAlert';
import AdminTabs from './AdminTabs';
import AdminLoading from './AdminLoading';

function AdminSectionPage({
  title,
  tabs,
  activeTab,
  onTabChange,
  hasData = false,
  isEditing = false,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
  saving = false,
  msg,
  onDismissMsg,
  loading = false,
  loadingText = 'Loading...',
  tabBadges = {},
  children,
  showEditBar = true,
  sectionLabel,
}) {
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        <AdminLoading text={loadingText} />
      </div>
    );
  }

  const currentTab = tabs?.find((t) => t.key === activeTab);
  const displayTitle = sectionLabel || currentTab?.label || title;

  return (
    <>
      {/* Tabs */}
      {tabs && (
        <AdminTabs
          tabs={tabs.map((t) => ({
            ...t,
            badge: tabBadges[t.key],
            saved: hasData && t.key === activeTab ? undefined : !!tabBadges[t.key],
          }))}
          activeTab={activeTab}
          onChange={onTabChange}
        />
      )}

      {/* Section Title */}
      <div className="admin-section-title-bar">
        <h2 className="admin-section-title">{displayTitle}</h2>
      </div>

      {/* Alert */}
      <AdminAlert type={msg?.type} message={msg} onDismiss={onDismissMsg} />

      {/* Action Bar */}
      {showEditBar && (
        <div className="admission-action-bar">
          {isEditing ? (
            <>
              <button className="btn btn-primary" onClick={onSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={onStartEdit}>
                {hasData ? 'Edit' : 'Add Content'}
              </button>
              {hasData && onDelete && (
                <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
              )}
            </>
          )}
        </div>
      )}

      {/* Content */}
      {children}
    </>
  );
}

export default AdminSectionPage;
