import React from "react";
import { Outlet } from "react-router-dom";
import OrgSidebar from "./OrgSidebar";
import OrgHeader from "./OrgHeader";
import "../styles/OrgLayout.css";

export default function OrgLayout() {
  return (
    <div className="app-container">
      <OrgSidebar />

      <div className="main-section">
        <OrgHeader />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}