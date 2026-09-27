import { Link } from 'react-router-dom';
import './PageSidebar.css';

/**
 * Shared grouped sidebar for the Life@SPS pages (Activities / Campus / Gallery).
 *
 * groups: [{ title: 'Activities', items: [{ label, to }] }, ...]
 * activePath: current pathname used to highlight the active link.
 *
 * Links are real routes, so switching groups navigates between the
 * Activities, Campus and Gallery pages while keeping the same sidebar.
 */
function PageSidebar({ groups, activePath }) {
  return (
    <aside className="about-sidebar">
      {groups.map((group) => (
        <div className="sidebar-group" key={group.title}>
          <h3 className="sidebar-heading">{group.title}</h3>
          <ul className="sidebar-list">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`sidebar-link ${activePath === item.to ? 'active' : ''}`}
                >
                  <span className="arrow">→</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}

export default PageSidebar;
