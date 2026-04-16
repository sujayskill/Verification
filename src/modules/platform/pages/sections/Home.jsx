import React from "react";
import "../../styles/PlatformDashboard.css";

export default function PlatformDashboard() {
  return (
    <div className="dashboard">

      {/* TOP CARDS */}
      <div className="cards">

        <div className="card purple">
          <h3>2,456</h3>
          <p>Actions</p>
        </div>

        <div className="card blue">
          <h3>5,789</h3>
          <p>Performance</p>
        </div>

        <div className="card light">
          <h3>7,899</h3>
          <p>Storage</p>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="bottom-section">

        <div className="chart-card">
          <h4>Monthly Analysis</h4>

          <div className="bars">
            {[5, 8, 6, 9, 7, 10, 6].map((h, i) => (
              <div key={i} style={{ height: h * 10 }}></div>
            ))}
          </div>
        </div>

        <div className="promo-card">
          <h3>Boost Campaign 🚀</h3>
          <p>Improve verification speed</p>
          <button>Start Now</button>
        </div>

      </div>

    </div>
  );
}