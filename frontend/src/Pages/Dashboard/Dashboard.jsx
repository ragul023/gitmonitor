import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Activity, GitCommit, GitPullRequest, CircleDot, GitFork as Github, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import StatCard from '../../Components/StatCard/StatCard';
import ActivityItem from '../../Components/ActivityItem/ActivityItem';
import { stats, weeklyActivity, recentActivity, repositories } from '../../data/mockData';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dash-repo-card', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
      gsap.from('.stat-card', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, delay: 0.1, ease: 'power2.out' });
      gsap.from('.dash-activity-item', { opacity: 0, x: -20, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'power2.out' });
      gsap.from('.dash-chart-bar', { scaleY: 0, transformOrigin: 'bottom', duration: 0.6, stagger: 0.08, delay: 0.4, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const repo = repositories[0];
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value));

  return (
    <div ref={containerRef} className="dashboard">
      {/* Repository Overview */}
      <div className="dash-repo-card glass">
        <div className="dash-repo-left">
          <div className="dash-repo-icon">
            <Github size={24} />
          </div>
          <div className="dash-repo-info">
            <h2 className="dash-repo-name">{repo.name}</h2>
            <div className="dash-repo-meta">
              <span>{repo.owner}</span>
              <span className="dash-repo-sep">/</span>
              <span className={`dash-repo-visibility dash-repo-visibility--${repo.visibility}`}>
                {repo.visibility}
              </span>
              <span className="dash-repo-sep">/</span>
              <span className="dash-repo-branch">{repo.defaultBranch}</span>
              <span className="dash-repo-sep">/</span>
              <span className="dash-repo-lang">{repo.language}</span>
            </div>
          </div>
        </div>
        <div className="dash-repo-right">
          <div className="dash-repo-activity-badge">
            <Activity size={14} />
            <span>Last activity: {repo.lastActivity}</span>
          </div>
          <button className="dash-repo-link" onClick={() => onNavigate('events')}>
            View Events
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="dash-stats">
        <StatCard icon={Activity} label="Total Events" value={stats.totalEvents} accent="blue" />
        <StatCard icon={GitCommit} label="Pushes" value={stats.pushes} accent="green" />
        <StatCard icon={GitPullRequest} label="Pull Requests" value={stats.pullRequests} accent="purple" />
        <StatCard icon={CircleDot} label="Issues" value={stats.issues} accent="warning" />
      </div>

      {/* Main Grid */}
      <div className="dash-grid">
        {/* Recent Activity */}
        <div className="dash-activity-panel glass">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">
              <Activity size={18} />
              Recent Activity
            </h3>
            <button className="dash-panel-link" onClick={() => onNavigate('events')}>
              View all
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="dash-activity-list">
            {recentActivity.map((item) => (
              <div key={item.id} className="dash-activity-item">
                <ActivityItem activity={item} />
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Activity Chart */}
        <div className="dash-chart-panel glass">
          <div className="dash-panel-header">
            <h3 className="dash-panel-title">
              <TrendingUp size={18} />
              7-Day Activity
            </h3>
            <span className="dash-chart-total">{stats.totalEvents} events</span>
          </div>
          <div className="dash-chart">
            {weeklyActivity.map((d) => (
              <div key={d.day} className="dash-chart-col">
                <div className="dash-chart-bar-wrap">
                  <div
                    className="dash-chart-bar"
                    style={{ height: `${(d.value / maxActivity) * 100}%` }}
                  >
                    <span className="dash-chart-value">{d.value}</span>
                  </div>
                </div>
                <span className="dash-chart-day">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="dash-chart-footer">
            <Calendar size={14} />
            <span>Aug 19 - Aug 25, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
