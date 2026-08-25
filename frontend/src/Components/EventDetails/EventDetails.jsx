import { X, GitCommit, GitPullRequest, CircleDot, FileCode, Clock, User, Hash, GitBranch, Box } from 'lucide-react';
import './EventDetails.css';

const typeConfig = {
  push: { icon: GitCommit, label: 'Push Event', color: 'blue' },
  pull_request: { icon: GitPullRequest, label: 'Pull Request', color: 'purple' },
  issue: { icon: CircleDot, label: 'Issue Event', color: 'warning' },
};

function EventDetails({ event, onClose }) {
  if (!event) return null;
  const type = typeConfig[event.type];
  const TypeIcon = type.icon;

  return (
    <>
      <div className="event-details-overlay" onClick={onClose} />
      <aside className="event-details">
        <div className="event-details-header">
          <div className="event-details-title">
            <div className={`event-details-type-icon event-details-type-icon--${type.color}`}>
              <TypeIcon size={18} />
            </div>
            <div>
              <h2 className="event-details-heading">{type.label}</h2>
              <span className="event-details-id">{event.id}</span>
            </div>
          </div>
          <button className="event-details-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="event-details-body">
          <div className="event-details-section">
            <div className="event-details-info-grid">
              <div className="event-details-info-item">
                <Hash size={14} />
                <div>
                  <span className="event-details-info-label">Delivery ID</span>
                  <span className="event-details-info-value event-details-info-value--mono">{event.deliveryId}</span>
                </div>
              </div>
              <div className="event-details-info-item">
                <Box size={14} />
                <div>
                  <span className="event-details-info-label">Repository</span>
                  <span className="event-details-info-value">{event.repository}</span>
                </div>
              </div>
              <div className="event-details-info-item">
                <User size={14} />
                <div>
                  <span className="event-details-info-label">User</span>
                  <span className="event-details-info-value">{event.user}</span>
                </div>
              </div>
              <div className="event-details-info-item">
                <GitBranch size={14} />
                <div>
                  <span className="event-details-info-label">Branch</span>
                  <span className="event-details-info-value event-details-info-value--mono">{event.branch}</span>
                </div>
              </div>
              <div className="event-details-info-item">
                <Clock size={14} />
                <div>
                  <span className="event-details-info-label">Timestamp</span>
                  <span className="event-details-info-value">{event.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>

          {event.commits.length > 0 && (
            <div className="event-details-section">
              <h3 className="event-details-section-title">
                <GitCommit size={16} />
                Commits ({event.commits.length})
              </h3>
              <div className="event-details-commits">
                {event.commits.map((commit, i) => (
                  <div key={i} className="event-details-commit">
                    <div className="event-details-commit-sha">{commit.sha}</div>
                    <div className="event-details-commit-body">
                      <p className="event-details-commit-msg">{commit.message}</p>
                      <div className="event-details-commit-meta">
                        <span>by {commit.author}</span>
                        <span className="event-details-commit-changes">
                          <span className="event-details-commit-add">+{commit.added}</span>
                          <span className="event-details-commit-mod">~{commit.modified}</span>
                          <span className="event-details-commit-del">-{commit.removed}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.changedFiles.length > 0 && (
            <div className="event-details-section">
              <h3 className="event-details-section-title">
                <FileCode size={16} />
                Changed Files ({event.changedFiles.length})
              </h3>
              <div className="event-details-files">
                {event.changedFiles.map((file, i) => (
                  <div key={i} className="event-details-file">
                    <FileCode size={14} />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.type === 'issue' && (
            <div className="event-details-section">
              <div className="event-details-issue-note">
                <CircleDot size={16} />
                <p>This is an issue event. No commits or file changes are associated with this event type.</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default EventDetails;
