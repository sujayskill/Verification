import React, { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/Organization.css";

export default function Organizations() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const result = clients.filter((c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase()),
    );
    setFiltered(result);
  }, [search, clients]);

  const fetchClients = async () => {
    const data = await api.get("/clients/getAll");
    setClients(data);
  };

  const deleteClient = async (id) => {
    await api.delete(`/clients/delete/${id}`);
    fetchClients();
  };

  return (
    <div className="org-page">
      {/* HEADER */}
      <div className="org-header">
        <div>
          <h2>Organizations</h2>
          <p>Manage all client organizations</p>
        </div>

        <div className="org-actions">
          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={() => navigate("/platform/organization/new")}
          >
            + Add Organization
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="org-list">
        {filtered.map((c) => (
          <div key={c.id} className="org-card">
            <div className="org-info">
              <h3
                className="link"
                onClick={() => navigate(`/platform/organization/${c.id}`)}
              >
                {c.companyName}
              </h3>
              <p>{c.contactEmail}</p>
              <span>{c.location}</span>
            </div>

            <div className="org-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/platform/organization/edit/${c.id}`)}
              >
                Edit
              </button>

              <button className="delete-btn" onClick={() => deleteClient(c.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
