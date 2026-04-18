import React from "react";
import { Outlet } from "react-router-dom";
import PlatformSidebar from "./PlatformSidebar";
import PlatformHeader from "./PlatformHeader";
import "../styles/Platform.css";

export default function PlatformLayout() {
  return (
    <div className="app-container">
      <PlatformSidebar />

      <div className="main-section">
        <PlatformHeader />

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
