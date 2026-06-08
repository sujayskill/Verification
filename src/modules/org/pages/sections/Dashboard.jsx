import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/clientDashboard/").then(setDashboard);
  }, []);

  if (!dashboard) {
    return <div className="client-dashboard-loading">Loading...</div>;
  }

  const { summary, pipeline, progress, recentActivities } = dashboard;

  return (
    <div className="client-dashboard">
      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="client-dashboard-page-header">
        {/* LEFT */}

        <div className="client-dashboard-page-left">
          <h1>Dashboard</h1>
        </div>

        {/* RIGHT */}

        <div className="client-dashboard-page-right">
          {/* SEARCH */}

          <div className="client-dashboard-search-wrapper">
            <span className="client-dashboard-search-icon">🔍</span>

            <input
              type="text"
              placeholder="Search anything..."
              className="client-dashboard-search-input"
            />
          </div>

          {/* NOTIFICATION */}

          <button className="client-dashboard-notification-btn">
            🔔
            <span className="client-dashboard-notification-dot">2</span>
          </button>

          {/* ACTION */}

          <button className="client-dashboard-primary-btn">+ New Verification</button>
        </div>
      </div>

      {/* KPI */}

      <div className="client-dashboard-kpis">
        <div className="client-dashboard-kpi-card">
          <span>Total Verifications</span>
          <h2>{summary?.totalVerifications || 0}</h2>
        </div>

        <div className="client-dashboard-kpi-card">
          <span>In Progress</span>
          <h2>{summary?.inProgress || 0}</h2>
        </div>

        <div className="client-dashboard-kpi-card">
          <span>Completed</span>
          <h2>{summary?.completed || 0}</h2>
        </div>

        <div className="client-dashboard-kpi-card">
          <span>Avg. Turnaround</span>
          <h2>{summary?.averageTatHours || 0} hrs</h2>
        </div>
      </div>

      {/* PIPELINE */}

      <div className="client-dashboard-panel">
        <h3>Verification Pipeline</h3>

        <div className="client-pipeline-container">
          <div className="client-pipeline-step">
            <div className="client-pipeline-icon">📋</div>
            <span>Initiated</span>
            <strong>{pipeline?.initiated || 0}</strong>
          </div>

          <div className="client-pipeline-line" />

          <div className="client-pipeline-step">
            <div className="client-pipeline-icon warning">⏳</div>
            <span>In Progress</span>
            <strong>{pipeline?.inProgress || 0}</strong>
          </div>

          <div className="client-pipeline-line" />

          <div className="client-pipeline-step">
            <div className="client-pipeline-icon purple">🔎</div>
            <span>Review</span>
            <strong>{pipeline?.review || 0}</strong>
          </div>

          <div className="client-pipeline-line" />

          <div className="client-pipeline-step">
            <div className="client-pipeline-icon blue">📄</div>
            <span>Report Ready</span>
            <strong>{pipeline?.reportReady || 0}</strong>
          </div>

          <div className="client-pipeline-line" />

          <div className="client-pipeline-step">
            <div className="client-pipeline-icon success">✓</div>
            <span>Completed</span>
            <strong>{pipeline?.completed || 0}</strong>
          </div>
        </div>
      </div>

      {/* LOWER GRID */}

      <div className="client-dashboard-grid">
        {/* PROGRESS */}

        <div className="client-dashboard-panel">
          <h3>Verification Progress</h3>

          {progress?.map((p, index) => {
            const percentage = (p.completed / p.total) * 100;

            return (
              <div key={index} className="client-progress-item">
                <div className="client-progress-header">
                  <span>{p.title}</span>

                  <span>
                    {p.completed}/{p.total}
                  </span>
                </div>

                <div className="client-progress-track">
                  <div
                    className="client-progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ACTIVITIES */}

        <div className="client-dashboard-panel">
          <h3>Recent Activity</h3>

          {recentActivities?.map((activity, i) => (
            <div key={i} className="client-activity-row">
              <div>{activity.title}</div>

              <span>{activity.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
