import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>

      <div className="grid">
        <div className="card">
          <h3>25</h3>
          <p>Total Organizations</p>
        </div>

        <div className="card">
          <h3>18</h3>
          <p>Active Clients</p>
        </div>

        <div className="card">
          <h3>120</h3>
          <p>BGV Cases</p>
        </div>
      </div>
    </div>
  );
}