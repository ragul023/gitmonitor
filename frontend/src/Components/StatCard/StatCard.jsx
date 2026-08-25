import './StatCard.css';

function StatCard({ icon: Icon, label, value, accent = 'blue' }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card-icon">
        <Icon size={20} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-glow" />
    </div>
  );
}

export default StatCard;
