import { GitFork, LayoutDashboard, Activity, GitBranch, Bot, Settings, X } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: Activity },
  { id: 'repositories', label: 'Repositories', icon: GitBranch },
  // { id: 'ai', label: 'AI Assistant', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Sidebar({ page, onNavigate, mobileNavOpen, setMobileNavOpen }) {
  return (
    <>
      {mobileNavOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileNavOpen(false)} />
      )}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <GitFork size={22} />
            <span className="sidebar-brand-text">GitHub Monitor</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${active ? 'sidebar-item--active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={18} />
                <span className="sidebar-item-label">{item.label}</span>
                {active && <span className="sidebar-item-glow" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="sidebar-status-dot" />
            <span className="sidebar-status-text">Webhook Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
