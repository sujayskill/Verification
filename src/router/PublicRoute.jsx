import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "VENDOR" || role === "VENDOR_ADMIN") {
      return <Navigate to="/platform" replace />;
    }
    if (role === "CLIENT" || role === "CLIENT_ADMIN") {
      return <Navigate to="/org" replace />;
    }
  }

  return children;
}
