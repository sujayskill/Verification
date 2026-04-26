import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/Profile.css";

export default function PlatformProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get("/users/me");
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));

  const role = payload.role.replace("ROLE_", "");
  const isAdmin = role === "VENDOR_ADMIN";

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <div className="avatar">
            {user.firstName?.[0]}
          </div>

          <div>
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="role">{role}</p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="info-grid">
          <div><span>ID</span><p>{user.id}</p></div>
          <div><span>Email</span><p>{user.email}</p></div>
          <div><span>Username</span><p>{user.username}</p></div>
          <div><span>Role</span><p>{role}</p></div>

          <div>
            <span>Reporting To</span>
            <p>{isAdmin ? "None" : "Vendor Admin"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}