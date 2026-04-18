import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/PlatformSidebar.css";

export default function PlatformSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSettings, setShowSettings] = useState(false);

  const menu = [
    { name: "Home", path: "/platform/home" },
    { name: "Dashboard", path: "/platform/dashboard" },
    { name: "Vendor", path: "/platform/organizations" },
    { name: "Verification", path: "/platform/verificationRequests" },
    { name: "Status", path: "/platform/verificationStatus" },
    { name: "Reports", path: "/platform/reports" },
    { name: "Metrics", path: "/platform/metrics" },
    { name: "Sales", path: "/platform/sales" },
  ];

  return (
    <div className="sidebar-container">

      {/* 🔥 COMPANY BRAND */}
      <div className="company-box">
        <h2>ToFact</h2>
        <p>BGV Platform</p>
      </div>

      {/* MENU */}
      <div className="menu-list">
        {menu.map((item) => (
          <div
            key={item.name}
            className={`menu-item ${
              location.pathname.includes(item.path) ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* 🔥 SETTINGS SECTION */}
      <div className="sidebar-footer">
        <button
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙ Settings
        </button>

        {/* 🔥 SLIDE PANEL */}
        {showSettings && (
          <div className="settings-panel">
            <button onClick={() => navigate("/platform/manageAccounts")}>
              Manage Accounts
            </button>

            <button onClick={() => navigate("/platform/help&support")}>
              Help
            </button>

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}