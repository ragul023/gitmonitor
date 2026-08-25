import { GitBranch as Github, Star, GitFork, Activity } from 'lucide-react';
import './RepositoryCard.css';

const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Go: '#00add0',
  Python: '#3572A5',
  MDX: '#fcb32c',
};

function RepositoryCard({ repo, onClick }) {
  return (
    <div className="repo-card" onClick={onClick}>
      <div className="repo-card-header">
        <div className="repo-card-icon">
          <Github size={18} />
        </div>
        <span className={`repo-card-visibility repo-card-visibility--${repo.visibility}`}>
          {repo.visibility}
        </span>
      </div>
      <h3 className="repo-card-name">{repo.name}</h3>
      <p className="repo-card-owner">{repo.owner}</p>
      <p className="repo-card-desc">{repo.description}</p>
      <div className="repo-card-meta">
        <span className="repo-card-lang">
          <span className="repo-card-lang-dot" style={{ background: languageColors[repo.language] || '#ccc' }} />
          {repo.language}
        </span>
        <span className="repo-card-branch">{repo.defaultBranch}</span>
      </div>
      <div className="repo-card-footer">
        <div className="repo-card-stats">
          <span className="repo-card-stat">
            <Activity size={13} />
            {repo.eventCount} events
          </span>
          <span className="repo-card-stat">
            <Star size={13} />
            24
          </span>
          <span className="repo-card-stat">
            <GitFork size={13} />
            8
          </span>
        </div>
        <span className="repo-card-activity">{repo.lastActivity}</span>
      </div>
    </div>
  );
}

export default RepositoryCard;
