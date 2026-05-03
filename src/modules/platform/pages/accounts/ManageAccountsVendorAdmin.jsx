import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/ManageAccounts.css";

export default function ManageAccounts() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    userType: "",
    role: "",
    orgId: "",
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchUsers();
  }, []);

  const fetchClients = async () => {
    const data = await api.get("/clients/getAll");
    setClients(data || []);
  };

  const fetchUsers = async () => {
    const data = await api.get("/users/getAll");
    setUsers(Array.isArray(data) ? data : []);
  };

  // 🔥 CREATE USER
  const createUser = async () => {
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role,
        orgId: form.userType === "CLIENT" ? form.orgId : null,
      };

      await api.post("/users/create", payload);

      alert("User created successfully ✅");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
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

  // 🔥 TOGGLE ACTIVE
  const toggleActive = async (id) => {
    try {
      // 🔥 Optimistic UI update
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
      );
      // 🔥 Call backend
      await api.put(`/users/toggle/${id}`);
    } catch (err) {
      console.error(err);
      // ❌ revert if API fails
      fetchUsers();
    }
  };

  // const updateStatus = async (id, currentStatus) => {
  //   try {
  //     await api.put(`/users/status/${id}?active=${!currentStatus}`);
  //     fetchUsers();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // 🔹 ROLE OPTIONS
  const vendorRoles = ["VENDOR_ADMIN", "VENDOR"];
  const clientRoles = ["CLIENT_ADMIN", "CLIENT"];

  // 🔹 FILTER USERS
  const vendorUsers = users.filter(
    (u) => u.role === "VENDOR_ADMIN" || u.role === "VENDOR",
  );

  const clientUsers = users.filter(
    (u) => u.role === "CLIENT_ADMIN" || u.role === "CLIENT",
  );

  // 🔹 GROUP CLIENT USERS
  const groupedClients = {};
  clientUsers.forEach((u) => {
    const key = u.client?.companyName || "Unknown";
    if (!groupedClients[key]) groupedClients[key] = [];
    groupedClients[key].push(u);
  });

  return (
    <div className="manage-container">
      <h2>Manage Accounts</h2>

      {/* 🔥 CREATE FORM */}
      <div className="card form-card">
        <div className="form-row">
          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

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

        {/* USER TYPE */}
        <div className="form-section">
          <label>Account Type</label>

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

        {/* ROLE */}
        {form.userType && (
          <div className="form-section">
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

        {/* CLIENT SELECT */}
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
                  {c.companyName}
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {vendorUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Disabled" : "Active"}</td>
                <td>
                  <button
                    className="toggle-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 prevents row interference
                      toggleActive(u.id);
                    }}
                  >
                    {u.isActive ? "Enable" : "Disable"}
                  </button>
                </td>
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
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {groupedClients[clientName].map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.isActive ? "Disabled" : "Active"}</td>
                    <td>
                      <button
                        className="toggle-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // 🔥 prevents row interference
                          toggleActive(u.id);
                        }}
                      >
                        {u.isActive ? "Enable" : "Disable"}
                      </button>
                    </td>
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
