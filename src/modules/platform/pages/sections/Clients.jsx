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
  const [menuOpen, setMenuOpen] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

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

  const deleteClient = async () => {
    if (!selectedClient) return;
    try {
      await api.delete(`/clients/delete/${selectedClient.id}`);
      setShowDeleteModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(null);
    };
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  // 🔥 highlight text
  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="v-clients-page">
      {/* HEADER */}
      <div className="v-clients-header">
        <div>
          <h2>Clients</h2>
          <p>Manage all client organizations</p>
        </div>

        <div className="v-clients-header-actions">
          {/* 🔍 SEARCH */}
          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔽 FILTERS */}
          <div className="v-clients-search2">
            <input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select className="v-clients-status-filter"
            value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">All Sizes</option>
              <option value="50">Small</option>
              <option value="200">Medium</option>
              <option value="1000">Large</option>
            </select>
          </div>

          {role !== "ROLE_VENDOR" && (
            <button
              className="v-clients-primary-btn"
              onClick={() => navigate("/platform/clients/new")}
            >
              + Add Client
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="org-list">
        {clients.length === 0 && <p>No clients found</p>}

        {clients.map((c) => (
          <div
            key={c.id}
            className="org-card clickable-row"
            onClick={() => navigate(`/platform/clients/${c.orgId}/departments`)}
          >
            {/* LEFT */}
            <div className="org-info">
              <h3
                dangerouslySetInnerHTML={{
                  __html: highlight(c.companyName || ""),
                }}
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

            {/* RIGHT MENU */}
            <div className="org-menu" onClick={(e) => e.stopPropagation()}>
              <span
                className="menu-icon"
                onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
              >
                ⋮
              </span>

              {menuOpen === c.id && (
                <div className="org-menu-dropdown">
                  <button
                    className="danger-item"
                    onClick={() => {
                      setSelectedClient(c);
                      setShowDeleteModal(true);
                      setMenuOpen(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <div
          className="client-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedClient(null);
          }}
        >
          <div
            className="client-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Client</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedClient?.companyName}</strong>?
            </p>

            <div className="client-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedClient(null);
                }}
              >
                Cancel
              </button>

              <button className="confirm-delete-btn" onClick={deleteClient}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
