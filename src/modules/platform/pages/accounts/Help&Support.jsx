import React from "react";
import "../../styles/Help&Support.css";

export default function HelpSupport() {
  return (
    <div className="page-container">
      <h2 className="page-title">Help & Support</h2>
      <div className="help-section">
        <h3>Documentation</h3>
        <p>Find guides and FAQs to help you use ToFact efficiently.</p>
        <button className="btn-link">View Docs</button>
      </div>

      <div className="help-section">
        <h3>Contact Support</h3>
        <p>If you’re facing issues, reach out to our support team.</p>
        <button className="btn-primary">Contact Us</button>
      </div>
    </div>
  );
}
