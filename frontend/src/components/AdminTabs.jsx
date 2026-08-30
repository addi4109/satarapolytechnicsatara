/**
 * AdminTabs — Reusable tab bar for admin section pages.
 *
 * Usage:
 *   <AdminTabs
 *     tabs={[
 *       { key: 'library', label: 'Library' },
 *       { key: 'canteen', label: 'Canteen', badge: 3 },
 *     ]}
 *     activeTab={activeTab}
 *     onChange={setActiveTab}
 *   />
 */
function AdminTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="admin-tabs-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`gallery-tab ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {tab.badge != null && tab.badge > 0 && (
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>{tab.badge}</span>
          )}
          {tab.saved && (
            <span className="gallery-tab-count" style={{ fontSize: '10px' }}>Saved</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;
