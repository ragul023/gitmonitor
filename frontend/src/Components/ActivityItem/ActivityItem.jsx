import { GitCommit, GitPullRequest, CircleDot, Check, GitMerge, X } from 'lucide-react';
import './ActivityItem.css';

const typeConfig = {
  push: { icon: GitCommit, color: 'blue' },
  pull_request: { icon: GitPullRequest, color: 'purple' },
  issue: { icon: CircleDot, color: 'warning' },
};

const statusConfig = {
  success: { icon: Check, label: 'Success', color: 'green' },
  open: { icon: GitPullRequest, label: 'Open', color: 'warning' },
  merged: { icon: GitMerge, label: 'Merged', color: 'purple' },
  closed: { icon: X, label: 'Closed', color: 'red' },
};

function ActivityItem({ activity }) {
  const type = typeConfig[activity.type];
  const status = statusConfig[activity.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;

  return (
    <div className="activity-item">
      <div className={`activity-item-icon activity-item-icon--${type.color}`}>
        <TypeIcon size={16} />
      </div>
      <div className="activity-item-body">
        <p className="activity-item-message">{activity.message}</p>
        <div className="activity-item-meta">
          <span className="activity-item-user">
            <span className="activity-item-avatar">{activity.avatar}</span>
            {activity.user}
          </span>
          {activity.branch !== '—' && (
            <span className="activity-item-branch">
              <GitCommit size={12} />
              {activity.branch}
            </span>
          )}
          <span className="activity-item-time">{activity.timestamp}</span>
        </div>
      </div>
      <div className={`activity-item-status activity-item-status--${status.color}`}>
        <StatusIcon size={12} />
        {status.label}
      </div>
    </div>
  );
}

export default ActivityItem;
