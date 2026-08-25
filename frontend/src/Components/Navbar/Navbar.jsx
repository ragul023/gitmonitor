import { Search, Bell, ChevronDown, Menu, GitBranch } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { repositories } from '../../data/mockData';
import './Navbar.css';

function Navbar({ selectedRepo, setSelectedRepo, onMobileMenu }) {
  const [repoOpen, setRepoOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const repoRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (repoRef.current && !repoRef.current.contains(e.target)) setRepoOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="navbar glass-strong">
      <button className="navbar-menu-btn" onClick={onMobileMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <div className="navbar-repo-selector" ref={repoRef}>
        <button className="navbar-repo-btn" onClick={() => setRepoOpen(!repoOpen)}>
          <GitBranch size={16} />
          <span className="navbar-repo-name">{selectedRepo}</span>
          <ChevronDown size={14} className={`navbar-chevron ${repoOpen ? 'navbar-chevron--open' : ''}`} />
        </button>
        {repoOpen && (
          <div className="navbar-dropdown">
            {repositories.map((repo) => (
              <button
                key={repo.id}
                className={`navbar-dropdown-item ${selectedRepo === repo.name ? 'navbar-dropdown-item--active' : ''}`}
                onClick={() => {
                  setSelectedRepo(repo.name);
                  setRepoOpen(false);
                }}
              >
                <span className="navbar-dropdown-item-name">{repo.name}</span>
                <span className="navbar-dropdown-item-meta">{repo.visibility}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="navbar-search">
        <Search size={16} className="navbar-search-icon" />
        <input type="text" placeholder="Search events, repos, users..." />
      </div>

      <div className="navbar-right">
        <div className="navbar-connection">
          <span className="navbar-connection-dot" />
          <span className="navbar-connection-text">Live</span>
        </div>

        <div className="navbar-notifications" ref={notifRef}>
          <button className="navbar-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={18} />
            <span className="navbar-notif-badge">3</span>
          </button>
          {notifOpen && (
            <div className="navbar-dropdown navbar-notif-dropdown">
              <div className="navbar-notif-header">Notifications</div>
              <div className="navbar-notif-item">
                <span className="navbar-notif-item-dot" />
                <div>
                  <div className="navbar-notif-item-title">New push to main</div>
                  <div className="navbar-notif-item-time">2 min ago</div>
                </div>
              </div>
              <div className="navbar-notif-item">
                <span className="navbar-notif-item-dot" />
                <div>
                  <div className="navbar-notif-item-title">Pull request opened</div>
                  <div className="navbar-notif-item-time">15 min ago</div>
                </div>
              </div>
              <div className="navbar-notif-item">
                <span className="navbar-notif-item-dot" />
                <div>
                  <div className="navbar-notif-item-title">Issue #23 reported</div>
                  <div className="navbar-notif-item-time">32 min ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-profile">
          <div className="navbar-profile-avatar">R</div>
          <div className="navbar-profile-info">
            <span className="navbar-profile-name">ragul023</span>
            <span className="navbar-profile-role">Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
