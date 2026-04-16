import React from "react";
import "../../styles/Profile.css";

export default function PlatformProfile() {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Admin User";

  return (
    <div className="profile-page">

      <div className="profile-card">
        <div className="avatar">A</div>

        <h2>{username}</h2>
        <p className="role">{role}</p>

        <div className="info-box">
          <p><b>Name:</b> {username}</p>
          <p><b>Role:</b> {role}</p>
          <p><b>Access:</b> Vendor Platform</p>
        </div>

      </div>

    </div>
  );
}