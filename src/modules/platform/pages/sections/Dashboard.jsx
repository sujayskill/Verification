import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalVerifications: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/vendor/dashboard");
      setStats(res || {});
    } catch (err) {
      console.error(err);
    }
  };

  const completionRate =
    stats.totalVerifications > 0
      ? Math.round((stats.completed / stats.totalVerifications) * 100)
      : 0;

  return (
  <div className="vendor-dashboard">
    {/* HEADER */}
    <div className="dashboard-header modern-header">
      <div className="header-left">
        <h1>Dashboard</h1>
        <p>Overview of your verification operations</p>
      </div>

      <div className="header-right">
        <div className="badge-live">● Live</div>
      </div>
    </div>

    {/* KPI SECTION (Glass + Floating Layout) */}
    <div className="kpi-grid modern-kpi">
      <div className="kpi-card glass">
        <div className="kpi-label">Total Clients</div>
        <h2>{stats.totalClients}</h2>
        <div className="kpi-foot">All organizations onboarded</div>
      </div>

      <div className="kpi-card glass highlight">
        <div className="kpi-label">Active Clients</div>
        <h2>{stats.activeClients}</h2>
        <div className="kpi-foot">
          {stats.totalClients > 0 &&
            `${Math.round(
              (stats.activeClients / stats.totalClients) * 100
            )}% active`}
        </div>
      </div>

      <div className="kpi-card glass">
        <div className="kpi-label">Total Requests</div>
        <h2>{stats.totalVerifications}</h2>
        <div className="kpi-foot">All verification requests</div>
      </div>

      <div className="kpi-card glass warning">
        <div className="kpi-label">In Progress</div>
        <h2>{stats.inProgress}</h2>
        <div className="pulse-dot" />
      </div>

      <div className="kpi-card glass success">
        <div className="kpi-label">Completed</div>
        <h2>{stats.completed}</h2>
        <div className="kpi-foot">Successfully verified</div>
      </div>
    </div>

    {/* INSIGHTS (Split Layout + Depth) */}
    <div className="insights modern-insights">
      
      {/* LEFT → Progress (Hero Card) */}
      <div className="insight-card hero-card">
        <div className="hero-top">
          <h3>Completion Rate</h3>
          <span className="percentage">{completionRate}%</span>
        </div>

        <div className="progress-modern">
          <div
            className="progress-bar-modern"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="muted-text">
          Based on total verification lifecycle
        </p>
      </div>

      {/* RIGHT → Breakdown Cards */}
      <div className="insight-stack modern-stack">
        
        <div className="insight-card mini">
          <div className="row">
            <span>In Progress</span>
            <strong>{stats.inProgress}</strong>
          </div>
          <div className="mini-bar warning-bar" />
        </div>

        <div className="insight-card mini">
          <div className="row">
            <span>Completed</span>
            <strong>{stats.completed}</strong>
          </div>
          <div className="mini-bar success-bar" />
        </div>

      </div>
    </div>
  </div>
);
}
