import React from "react";
import "../../styles/Profile.css";

export default function OrgProfile() {
  const username = localStorage.getItem("username") || "Client User";
  const orgName = localStorage.getItem("orgName") || "Company Name";
  const role = localStorage.getItem("role");

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="avatar">C</div>

        <h2>{orgName}</h2>
        <p className="role">{role}</p>

        <div className="info-box">
          <p><b>User:</b> {username}</p>
          <p><b>Company:</b> {orgName}</p>
          <p><b>Access:</b> Client Panel</p>
        </div>

      </div>

    </div>
  );
}