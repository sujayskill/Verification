import React, { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import "../../styles/ManageAccounts.css";

export default function ManageAccounts() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    userType: "",
    role: "",
    orgId: "",
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔹 Load clients
  const fetchClients = async () => {
    const data = await api.get("/clients/getAll");
    setClients(data);
  };

  // 🔹 Load users
  const fetchUsers = async () => {
    const data = await api.get("/users/getAll");
    console.log("Users API Response:", data);
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  // 🔹 Create user
  const createUser = async () => {
    try {
      const payload = {
        username: form.username,
        password: form.password,
        role: form.role,
        orgId: form.userType === "CLIENT" ? form.orgId : null,
      };

      await api.post("/users/create", payload);

      setForm({
        username: "",
        password: "",
        userType: "",
        role: "",
        orgId: "",
      });
      
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    }
  };

  // 🔹 Role options
  const vendorRoles = ["VENDOR_ADMIN", "VENDOR"];
  const clientRoles = ["CLIENT_ADMIN", "CLIENT"];

  // 🔹 Filter users
  const vendorUsers = Array.isArray(users)
    ? users.filter((u) => u.role === "VENDOR_ADMIN" || u.role === "VENDOR")
    : [];

  const clientUsers = users.filter(
    (u) => u.role === "CLIENT_ADMIN" || u.role === "CLIENT",
  );

  // 🔹 Group client users
  const groupedClients = {};
  clientUsers.forEach((u) => {
    const key = u.client?.companyName || "Unknown";
    if (!groupedClients[key]) groupedClients[key] = [];
    groupedClients[key].push(u);
  });

  return (
    <div className="manage-container">
      <h2>Manage Accounts</h2>

      {/* 🔥 FORM */}
      <div className="card form-card">
        {/* BASIC */}
        <div className="form-row">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* 🔹 USER TYPE */}
        <div className="form-section">
          <label>Select Account Type</label>

          <div className="toggle-group">
            <button
              className={form.userType === "VENDOR" ? "active" : ""}
              onClick={() =>
                setForm({ ...form, userType: "VENDOR", role: "", orgId: "" })
              }
            >
              Vendor
            </button>

            <button
              className={form.userType === "CLIENT" ? "active" : ""}
              onClick={() =>
                setForm({ ...form, userType: "CLIENT", role: "", orgId: "" })
              }
            >
              Client
            </button>
          </div>
        </div>

        {/* 🔹 ROLE SELECTION */}
        {form.userType && (
          <div className="form-section role-section">
            <label>Select Role</label>

            <div className="role-grid">
              {(form.userType === "VENDOR" ? vendorRoles : clientRoles).map(
                (r) => (
                  <div
                    key={r}
                    className={`role-card ${form.role === r ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, role: r })}
                  >
                    {r}
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* 🔹 CLIENT SELECT */}
        {form.userType === "CLIENT" && form.role && (
          <div className="form-section">
            <label>Select Client</label>

            <select
              value={form.orgId}
              onChange={(e) => setForm({ ...form, orgId: e.target.value })}
            >
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.orgId}>
                  {c.companyName} ({c.orgId})
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="btn create-btn" onClick={createUser}>
          Create User
        </button>
      </div>

      {/* 🔥 VENDOR USERS */}
      <div className="card">
        <h3>Vendor Users</h3>

        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {vendorUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 CLIENT USERS */}
      <div className="card">
        <h3>Client Users</h3>

        {Object.keys(groupedClients).map((clientName) => (
          <div key={clientName} className="client-group">
            <h4>{clientName}</h4>

            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {groupedClients[clientName].map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
