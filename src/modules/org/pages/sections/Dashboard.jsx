import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    inProgress: 0,
    completed: 0,
    hiringTrend: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/client/dashboard");
      setStats(res);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const max = Math.max(...stats.hiringTrend.map((d) => d.count), 1);

  return (
    <div className="dashboard modern-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <span className="badge-live">● Live Data</span>
      </div>

      {/* KPI CARDS */}
      <div className="cards modern-cards">
        <div className="card glass purple">
          <p>Total Candidates</p>
          <h3>{stats.totalCandidates}</h3>
        </div>

        <div className="card glass blue">
          <p>In Progress</p>
          <h3>{stats.inProgress}</h3>
        </div>

        <div className="card glass green">
          <p>Completed</p>
          <h3>{stats.completed}</h3>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="bottom-section modern-grid">
        {/* CHART */}
        <div className="chart-card glass">
          <h4>Hiring Overview</h4>

          <div className="bars modern-bars">
            {stats.hiringTrend.map((item, i) => (
              <div key={i} className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${(item.count / max) * 100}%`,
                  }}
                />
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
