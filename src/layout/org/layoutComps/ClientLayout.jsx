import React from "react";
import { Outlet } from "react-router-dom";
import OrgSidebar from "./ClientSidebar";
import "../styles/ClientLayout.css";

export default function OrgLayout() {
  return (
    <div className="app-container">
      <OrgSidebar />

      <div className="main-section">
        <div className="client-page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
