import React, { useState } from "react";
import { api } from "../../../services/Api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const login = async () => {
    try {
      const res = await api.post("/auth/login", form);
      const token = res.token;

      if (!token) {
        alert("Invalid login response");
        return;
      }

      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("role", payload.role);

      if (payload.role === "ROLE_VENDOR" || payload.role === "ROLE_VENDOR_ADMIN") {
        navigate("/platform");
      } else if (payload.role === "ROLE_CLIENT") {
        navigate("/org");
      } else {
        alert("Unknown role");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Login failed");
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
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button className="login-btn" onClick={login}>
            Login
          </button>

          <p className="forgot-link">Forgot password?</p>
        </div>

      </div>
    </div>
  );
}