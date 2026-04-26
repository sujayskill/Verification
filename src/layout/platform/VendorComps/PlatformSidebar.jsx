import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/PlatformSidebar.css";

export default function PlatformSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef();

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

  useEffect(() => {
    setShowSettings(false);
  }, [location.pathname]);

  const menu = [
    { name: "Home", path: "/platform/home" },
    { name: "Dashboard", path: "/platform/dashboard" },
    { name: "Clients", path: "/platform/clients" },
    { name: "Verification", path: "/platform/verifications" },
    { name: "Status", path: "/platform/status" },
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
      <div className="sidebar-footer" ref={settingsRef}>
        <button
          className="settings-btn"
          onClick={(e) => {
            e.stopPropagation(); // ✅ VERY IMPORTANT
            setShowSettings(!showSettings);
          }}
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
