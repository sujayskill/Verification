import React from "react";
import { Outlet } from "react-router-dom";
import OrgSidebar from "./ClientSidebar";
import OrgHeader from "./ClientHeader";
import "../styles/ClientLayout.css";

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