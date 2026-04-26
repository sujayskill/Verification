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
      console.log("LOGIN PAYLOAD:", form);
      const res = await api.post("/auth/login", form);

      const token = res.token;

      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
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
      <div className="login-card">
        {/* LEFT PANEL */}
        <div className="login-left">
          <h1>ToFact</h1>
          <h3>BGV Platform</h3>
          <p>
            Securely manage your background verification workflows with
            real-time tracking and reporting.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <h2>Welcome Back 👋</h2>

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

          {/* 🔥 ADD THIS HERE */}
          {error && <p className="error-text">{error}</p>}

          <p className="forgot-link">Forgot password?</p>
        </div>
      </div>
    </div>
  );
}
