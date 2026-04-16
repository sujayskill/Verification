import React, { useState } from "react";
import { Bell, User } from "react-feather";
import { useNavigate } from "react-router-dom";
import "../styles/ClientHeader.css";

export default function ClientHeader() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const goToProfile = () => {
      navigate("/org/profile");
  };

  return (
    <div className="header-container">
      <div className="header-right">

        {/* ROLE LABEL */}
        <span className="admin-label">
          {role === "ROLE_CLIENT" ? "Client" : "Admin"}
        </span>

        {/* 🔔 NOTIFICATIONS */}
        <div className="icon-wrapper">
          <Bell onClick={() => setShowNotif(!showNotif)} />

          {showNotif && (
            <div className="dropdown">
              <p>Verification Completed</p>
              <p>New Request Received</p>
            </div>
          )}
        </div>

        {/* 👤 PROFILE */}
        <div className="icon-wrapper">
          <User onClick={() => setShowProfile(!showProfile)} />

          {showProfile && (
            <div className="dropdown">
              <p onClick={goToProfile}>My Account</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}