import React, { useState } from "react";
import { api } from "../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const [error, setError] = useState("");

  const login = async () => {
    try {
      // console.log("LOGIN PAYLOAD:", form);
      const res = await api.post("/auth/login", form);

      const accessToken = res.accessToken;
      const refreshToken = res.refreshToken;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const role = payload.role.replace("ROLE_", "");

      if (payload.slug) {
        localStorage.setItem("slug", payload.slug);
      } else {
        localStorage.removeItem("slug"); // vendor case
      }
      localStorage.setItem("role", role);
      localStorage.setItem("orgId", payload.orgId);
      localStorage.setItem("username", payload.sub);
      const slug = payload.slug;

      if (role === "VENDOR" || role === "VENDOR_ADMIN") {
        navigate("/platform");
      } else {
        navigate(`/${payload.slug}/home`);
      }
    } catch (err) {
      setError("Invalid username or password");
      // 🚫 BLOCKED USER
      if (err.status === 403 && err.data?.error === "ACCESS_DENIED") {
        alert("Access denied. Please contact admin.");
        return;
      }

      // ❌ INVALID PASSWORD
      if (err.status === 401) {
        alert("Invalid username or password");
        return;
      }

      alert("Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="login-brand">
            <div className="brand-badge">
              Enterprise Verification Suite
            </div>
            <h1>ToFact</h1>
            <h3>
              Smart Background Verification Platform
              for Modern Enterprises
            </h3>
            <p>
              Automate candidate verification workflows with
              secure document handling, real-time tracking,
              SLA monitoring, and seamless collaboration
              between clients and vendors.
            </p>
            <div className="login-features">
              <div className="login-feature-card">
                <h4>Real-Time Tracking</h4>
                <span>
                  Monitor verification progress instantly
                  across all departments.
                </span>
              </div>
              <div className="login-feature-card">
                <h4>Enterprise Security</h4>
                <span>
                  Secure document management with
                  role-based access control.
                </span>
              </div>
              <div className="login-feature-card">
                <h4>SLA Monitoring</h4>
                <span>
                  Track deadlines and ensure timely
                  verification completion.
                </span>
              </div>
              <div className="login-feature-card">
                <h4>Vendor Collaboration</h4>
                <span>
                  Seamless communication between
                  clients and verification teams.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="login-card">
            <h2>Welcome Back</h2>

            <p className="login-subtitle">
              Login to continue managing your verification workflows.
            </p>

            <div className="form-group">
              <label>Username</label>
              <input
                placeholder="Enter your username"
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                  setError("");
                }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  setError("");
                }}
              />
            </div>

            <button className="login-btn" onClick={login}>
              Login
            </button>

            {error && <p className="error-text">{error}</p>}

            <div className="login-footer">
              <span className="forgot-link">
                Forgot password?
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
