import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Search, GitCommit, GitPullRequest, CircleDot, ChevronDown, X } from 'lucide-react';
import EventDetails from '../../Components/EventDetails/EventDetails';
import { events } from '../../data/mockData';
import './Events.css';

const eventTypes = [
  { value: 'all', label: 'All Events' },
  { value: 'push', label: 'Push' },
  { value: 'pull_request', label: 'Pull Request' },
  { value: 'issue', label: 'Issue' },
];

const typeIcons = {
  push: GitCommit,
  pull_request: GitPullRequest,
  issue: CircleDot,
};

const statusStyles = {
  success: 'green',
  open: 'warning',
  merged: 'purple',
  closed: 'red',
};

function Events() {
  const containerRef = useRef(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const branches = ['all', ...new Set(events.map((e) => e.branch))];
  const users = ['all', ...new Set(events.map((e) => e.user))];

  const filtered = events.filter((e) => {
    const matchSearch =
      e.repository.toLowerCase().includes(search.toLowerCase()) ||
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.branch.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || e.type === typeFilter;
    const matchBranch = branchFilter === 'all' || e.branch === branchFilter;
    const matchUser = userFilter === 'all' || e.user === userFilter;
    return matchSearch && matchType && matchBranch && matchUser;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.events-row', { opacity: 0, y: 15, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [filtered.length]);

  return (
    <div ref={containerRef} className="events-page">
      <div className="events-header">
        <h1 className="events-title">Events</h1>
        <p className="events-subtitle">Monitor all webhook events across your repositories</p>
      </div>

      {/* Filters */}
      <div className="events-filters glass">
        <div className="events-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="events-search-clear" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="events-filter-group">
          {eventTypes.map((t) => (
            <button
              key={t.value}
              className={`events-filter-btn ${typeFilter === t.value ? 'events-filter-btn--active' : ''}`}
              onClick={() => setTypeFilter(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="events-selects">
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            {branches.map((b) => (
              <option key={b} value={b}>{b === 'all' ? 'All Branches' : b}</option>
            ))}
          </select>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            {users.map((u) => (
              <option key={u} value={u}>{u === 'all' ? 'All Users' : u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="events-table glass">
        <div className="events-table-header">
          <span>Event</span>
          <span>User</span>
          <span>Repository</span>
          <span>Branch</span>
          <span>Time</span>
          <span>Status</span>
        </div>
        {filtered.length === 0 ? (
          <div className="events-empty">
            <p>No events match your filters.</p>
          </div>
        ) : (
          filtered.map((event) => {
            const Icon = typeIcons[event.type];
            return (
              <div
                key={event.id}
                className="events-row"
                onClick={() => setSelectedEvent(event)}
              >
                <span className="events-row-event">
                  <span className={`events-row-icon events-row-icon--${event.type === 'push' ? 'blue' : event.type === 'pull_request' ? 'purple' : 'warning'}`}>
                    <Icon size={14} />
                  </span>
                  {event.type === 'pull_request' ? 'Pull Request' : event.type === 'push' ? 'Push' : 'Issue'}
                </span>
                <span className="events-row-user">
                  <span className="events-row-avatar">{event.user[0].toUpperCase()}</span>
                  {event.user}
                </span>
                <span className="events-row-repo">{event.repository}</span>
                <span className="events-row-branch">{event.branch}</span>
                <span className="events-row-time">{event.timeAgo}</span>
                <span className={`events-row-status events-row-status--${statusStyles[event.status]}`}>
                  {event.status}
                </span>
              </div>
            );
          })
        )}
      </div>

      {selectedEvent && (
        <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

export default Events;
