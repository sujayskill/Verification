import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    if (role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN") {
      return <Navigate to="/platform" replace />;
    }
    if (role === "ROLE_CLIENT") {
      return <Navigate to="/org" replace />;
    }
  }

  return children;
}