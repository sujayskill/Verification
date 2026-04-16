import "../../styles/Metrics.css";

export default function Metrics() {
  return (
    <div className="metrics-page">

      <h2>Metrics Dashboard</h2>

      <div className="metrics-grid">

        <div className="metric-card">
          <h4>Turnaround Time</h4>
          <h2>2.3 Days</h2>
        </div>

        <div className="metric-card danger">
          <h4>SLA Breach</h4>
          <h2>12%</h2>
        </div>

        <div className="metric-card success">
          <h4>Success Rate</h4>
          <h2>88%</h2>
        </div>

      </div>
    </div>
  );
}