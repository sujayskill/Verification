import React, { useState } from "react";
import { Bell, User } from "react-feather";
import { useNavigate } from "react-router-dom";
import "../styles/PlatformHeader.css";

export default function VendormHeader() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const goToProfile = () => {
      navigate("/platform/profile");
  };

  return (
    <div className="header-container">
      <div className="header-right">

        {/* ROLE LABEL */}
        <span className="admin-label">
          {role === "ROLE_CLIENT" ? "Client" : "Vendor"}
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