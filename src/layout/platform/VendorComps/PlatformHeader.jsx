import React, { useState, useEffect } from "react";
import { Bell, User } from "react-feather";
import { useNavigate } from "react-router-dom";
import "../styles/PlatformHeader.css";
import { connectSocket } from "../../../services/notifications/SocketService";
import { api } from "../../../services/api/Api";

export default function VendorHeader() {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const goToProfile = () => navigate("/platform/profile");

  useEffect(() => {
    const handleClickOutside = () => setShowNotif(false);
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    // 🔥 TOP 6
    api.get("/notifications/vendor/top").then((data) => {
      setNotifications(Array.isArray(data) ? data : []);
    });

    connectSocket(null, role, (msg) => {
      setNotifications((prev) => [msg, ...prev].slice(0, 6));
    });
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/read/${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="header-container">
      <div className="header-right">
        {/* ROLE */}
        <span className="role-badge">Vendor</span>
        {/* 🔔 NOTIFICATIONS */}
        <div
          className="icon-box"
          onClick={(e) => {
            e.stopPropagation();
            setShowNotif(!showNotif);
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}

          {showNotif && (
            <div className="dropdown notif-dropdown">
              {notifications.length === 0 && <p>No notifications</p>}

              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${!n.read ? "unread" : ""}`}
                  onClick={() => markRead(n.id)}
                >
                  <p>{n.message}</p>
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              ))}

              <button onClick={() => navigate("/org/notifications")}>
                See More →
              </button>
            </div>
          )}
        </div>

        {/* 👤 PROFILE */}
        <div
          className="icon-box"
          onClick={(e) => {
            e.stopPropagation();
            setShowProfile(!showProfile);
          }}
        >
          <User size={18} />

          {showProfile && (
            <div className="dropdown profile-dropdown">
              <p onClick={goToProfile}>My Account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
