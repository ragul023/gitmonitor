import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Plus, X, GitFork as Github, GitBranch } from 'lucide-react';
import RepositoryCard from '../../Components/RepositoryCard/RepositoryCard';
import { repositories } from '../../data/mockData';
import './Repositories.css';

function Repositories({ onNavigate }) {
  const containerRef = useRef(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.repo-card', { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="repos-page">
      <div className="repos-header">
        <div>
          <h1 className="repos-title">Repositories</h1>
          <p className="repos-subtitle">{repositories.length} connected repositories</p>
        </div>
        <button className="repos-add-btn" onClick={() => setShowAdd(true)}>
          <Plus size={18} />
          Add Repository
        </button>
      </div>

      <div className="repos-grid">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} onClick={() => onNavigate('events')} />
        ))}
      </div>

      {showAdd && (
        <>
          <div className="repos-modal-overlay" onClick={() => setShowAdd(false)} />
          <div className="repos-modal glass-strong">
            <div className="repos-modal-header">
              <h2 className="repos-modal-title">
                <Github size={20} />
                Add Repository
              </h2>
              <button className="repos-modal-close" onClick={() => setShowAdd(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="repos-modal-body">
              <p className="repos-modal-desc">
                Enter the repository URL to connect it to GitHub Monitor. A webhook will be configured automatically.
              </p>
              <div className="repos-modal-field">
                <label>Repository URL</label>
                <div className="repos-modal-input-wrap">
                  <Github size={16} />
                  <input type="text" placeholder="github.com/owner/repository" />
                </div>
              </div>
              <div className="repos-modal-field">
                <label>Webhook Events</label>
                <div className="repos-modal-events">
                  <label className="repos-modal-event">
                    <input type="checkbox" defaultChecked /> Push
                  </label>
                  <label className="repos-modal-event">
                    <input type="checkbox" defaultChecked /> Pull Request
                  </label>
                  <label className="repos-modal-event">
                    <input type="checkbox" defaultChecked /> Issues
                  </label>
                </div>
              </div>
            </div>
            <div className="repos-modal-footer">
              <button className="repos-modal-cancel" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="repos-modal-connect" onClick={() => setShowAdd(false)}>
                <GitBranch size={16} />
                Connect Repository
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Repositories;
