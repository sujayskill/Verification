import React, { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import "../../styles/ManageAccounts.css";

export default function ClientManageAccounts() {
  const orgId = localStorage.getItem("orgId");

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "CLIENT",
  });

  const fetchUsers = async () => {
    const data = await api.get(`/users/client/${orgId}`);
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async () => {
    console.log("ORG ID:", orgId);
    await api.post("/users/create", {
      ...form,
      orgId,
    });

    setForm({ username: "", password: "", role: "CLIENT" });
    console.log(form);
    console.log("User Created");
    fetchUsers();
  };

  const toggleUser = async (id) => {
    await api.put(`/users/toggle/${id}`);
    fetchUsers();
  };

  const changePassword = async (id) => {
    const newPass = prompt("Enter new password:");
    if (!newPass) return;

    await api.put(`/users/change-password/${id}`, {
      password: newPass,
    });

    alert("Password updated");
  };

  return (
    <div className="manage-container">
      <h2>Client Manage Accounts</h2>

      {/* FORM */}
      <div className="card form-card">
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

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="CLIENT">CLIENT</option>
          <option value="CLIENT_ADMIN">CLIENT_ADMIN</option>
        </select>

        <button onClick={createUser}>Create User</button>
      </div>

      {/* USERS TABLE */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>{u.active ? "Active" : "Blocked"}</td>

                <td>
                  <button onClick={() => toggleUser(u.id)}>
                    {u.active ? "Block" : "Unblock"}
                  </button>

                  <button onClick={() => changePassword(u.id)}>
                    Change Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
