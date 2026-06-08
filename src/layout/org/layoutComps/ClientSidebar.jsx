import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBasePath } from "../../../utils/PathHelper";
import "../styles/ClientSidebar.css";

export default function OrgSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSettings, setShowSettings] = useState(false);

  const settingsRef = useRef();

  const base = getBasePath();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menu = [
    {
      name: "Dashboard",
      path: `/${base}/home`,
      icon: "📊",
    },

    {
      name: "Candidates",
      path: `/${base}/departments`,
      icon: "👤",
    },

    {
      name: "Verifications",
      path: `/${base}/verifications`,
      icon: "✔",
    },

    {
      name: "Reports",
      path: `/${base}/reports`,
      icon: "📑",
    },

    {
      name: "Documents",
      path: `/${base}/documents`,
      icon: "📂",
    },

    {
      name: "Analytics",
      path: `/${base}/analytics`,
      icon: "📈",
    },

    {
      name: "Settings",
      path: `/${base}/settings`,
      icon: "⚙",
    },
  ];

  return (
    <div className="client-sidebar-container">
      {/* BRAND */}
      <div className="client-company-box">
        <div className="client-logo">TF</div>

        <div>
          <h2>ToFact</h2>
          <p>BGV Platform</p>
        </div>
      </div>

      {/* MENU */}
      <div className="client-menu-list">
        {menu.map((item) => (
          <div
            key={item.name}
            className={`client-menu-item ${
              location.pathname.includes(item.path) ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>

            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* PROFILE */}
      <div className="client-profile-section" ref={settingsRef}>
        <div
          className="client-profile-card"
          onClick={() => setShowSettings(!showSettings)}
        >
          <div className="profile-avatar">S</div>

          <div className="profile-info">
            <h4>Sujay Reddy</h4>
            <p>Super Admin</p>
          </div>
        </div>

        {/* DROPDOWN */}
        {showSettings && (
          <div className="client-settings-panel">
            <button onClick={() => navigate(`/${base}/manageAccounts`)}>
              Manage Accounts
            </button>

            <button onClick={() => navigate(`/${base}/help&support`)}>
              Help & Support
            </button>

            <button
              className="client-logout-btn"
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
