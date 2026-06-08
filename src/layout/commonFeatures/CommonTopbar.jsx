import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CommonTopbar.css";

export default function CommonTopbar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const notifications = Number(localStorage.getItem("notificationCount")) || 0;

  return (
    <div className="common-topbar">
      {/* RIGHT SECTION */}
      <div className="topbar-actions">
        {/* NOTIFICATIONS */}
        <div className="notification-wrapper">
          <button className="notification-btn">🔔</button>
          {notifications > 0 && (
            <span className="notification-badge">
              {notifications > 99 ? "99+" : notifications}
            </span>
          )}
        </div>
        {/* PROFILE
        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)} >
            <div className="profile-avatar">
              {(localStorage.getItem("username") || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-info">
              <span>{localStorage.getItem("username")}</span>

              <small>Client</small>
            </div>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <button>My Profile</button>
              <button>Notifications</button>
              <button>Change Password</button>
              <button>Settings</button>
              <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>
                Logout
              </button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
