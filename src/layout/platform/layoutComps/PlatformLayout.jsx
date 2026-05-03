import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import PlatformSidebar from "./PlatformSidebar";
import PlatformHeader from "./PlatformHeader";
import "../styles/PlatformLayout.css";

export default function PlatformLayout() {
  const location = useLocation();

  // 🔥 detect dashboard route
  const isDashboard = location.pathname.includes("/dashboard");

  return (
    <div className={`app-container ${isDashboard ? "no-scroll" : ""}`}>
      <PlatformSidebar />

      <div className="main-section">
        <PlatformHeader />

        <div className={`page-content ${isDashboard ? "dashboard-page" : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}