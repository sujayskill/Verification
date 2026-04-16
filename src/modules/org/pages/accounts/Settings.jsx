import React from "react";
import "../../styles/Settings.css";

export default function Settings() {
  return (
    <div className="page-container">
      <h2 className="page-title">Settings</h2>
      <div className="settings-section">
        <h3>Preferences</h3>
        <label>
          <input type="checkbox" /> Enable Dark Mode
        </label>
        <label>
          <input type="checkbox" /> Email Notifications
        </label>
      </div>

      <div className="settings-section">
        <h3>Security</h3>
        <button className="btn-primary">Change Password</button>
      </div>
    </div>
  );
}
