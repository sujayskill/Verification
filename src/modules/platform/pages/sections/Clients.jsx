import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../../services/hooks/DebounceEffect";
import { getUserRole } from "../../../../utils/UiHideHelper";
import "../../styles/Clients.css";

export default function Organizations() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const role = getUserRole();

  console.log(role);

  const navigate = useNavigate();

  // 🔥 fetch clients
  useEffect(() => {
    fetchClients();
  }, [debouncedSearch, location, size]);

  const fetchClients = async () => {
    try {
      let url = `/clients/search?q=${debouncedSearch || ""}`;
      if (location) url += `&location=${location}`;
      if (size) url += `&size=${size}`;
      const res = await api.get(url);
      setClients(Array.isArray(res) ? res : res.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteClient = async (id) => {
    await api.delete(`/clients/delete/${id}`);
    fetchClients();
  };

  // 🔥 highlight text
  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="org-page">
      {/* HEADER */}
      <div className="org-header">
        <div>
          <h2>Clients</h2>
          <p>Manage all client organizations</p>
        </div>

        <div className="org-actions">
          {/* 🔍 SEARCH */}
          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔽 FILTERS */}
          <div className="filters">
            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">All Sizes</option>
              <option value="50">Small</option>
              <option value="200">Medium</option>
              <option value="1000">Large</option>
            </select>
          </div>

          {role !== "ROLE_VENDOR" && (
            <button
              className="primary-btn"
              onClick={() => navigate("/platform/clients/new")}
            >
              + Add Organization
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="org-list">
        {clients.length === 0 && <p>No clients found</p>}

        {clients.map((c) => (
          <div key={c.id} className="org-card">
            <div className="org-info">
              <h3
                className="link"
                dangerouslySetInnerHTML={{
                  __html: highlight(c.companyName || ""),
                }}
                onClick={() =>
                  navigate(`/platform/clients/${c.orgId}/departments`)
                }
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: highlight(c.contactEmail || ""),
                }}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: highlight(c.location || ""),
                }}
              />
            </div>
            <div className="org-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/platform/clients/edit/${c.id}`)}
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
