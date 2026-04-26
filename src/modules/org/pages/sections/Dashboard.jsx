import React from "react";
import "../../styles/Dashboard.css";
import { getBasePath } from "../../../../utils/PathHelper";

export default function Dashboard() {
  const base = getBasePath();
  return (
    <div className="dashboard">
      {/* TOP CARDS */}
      <div className="cards">
        <div className="card purple">
          <h3>120</h3>
          <p>Candidates</p>
        </div>

        <div className="card blue">
          <h3>45</h3>
          <p>In Progress</p>
        </div>

        <div className="card light">
          <h3>30</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom-section">
        <div className="chart-card">
          <h4>Hiring Overview</h4>

          <div className="bars">
            {[4, 6, 8, 5, 7, 9].map((h, i) => (
              <div key={i} style={{ height: h * 10 }}></div>
            ))}
          </div>
        </div>

        <div className="promo-card">
          <h3>Need Faster BGV?</h3>
          <p>Upgrade your verification plan</p>
          <button>Upgrade</button>
        </div>
      </div>
    </div>
  );
}
