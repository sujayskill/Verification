import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ClientDepartments.css";

export default function ClientDepartments() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // 🔥 fetch departments
  const fetchData = async () => {
    const res = await api.get(`/departments/by-org/${orgId}`);
    console.log(res);
    console.log("hello");
    setData(Array.isArray(res) ? res : []);
  };

  // 🔥 fetch client details
  const fetchClient = async () => {
    const res = await api.get(`/clients/by-org/${orgId}`);
    setClient(res);
  };

  const updateDepartment = async (id) => {
    if (!editName.trim()) return;
    try {
      await api.put(`/departments/${id}`, {
        name: editName,
      });
      setEditingId(null);
      setEditName("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDepartment = async () => {
    if (!selectedDepartment) return;
    try {
      await api.delete(`/departments/${selectedDepartment.id}`);
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
    fetchClient();
  }, [orgId]);

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="Client-Departments-page">
      {/* TOP HEADER */}
      <div className="vendor-client-dept-header">
        {/* LEFT */}
        <div>
          <button
            className="back-btn"
            onClick={() => navigate(`/platform/clients`)}
          >
            ← Back
          </button>

          <h2>{client?.companyName || "Departments"}</h2>

          <p>{filtered.length} departments</p>
        </div>

        {/* RIGHT */}
        <div className="dept-actions">
          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="secondary-btn"
            onClick={() => navigate(`/platform/clientsDetails/${orgId}`)}
          >
            View Client Details
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="dept-list">
        {filtered.length === 0 ? (
          <p>No departments found</p>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className="dept-card clickable-row"
              onClick={() => {
                if (editingId !== d.id) {
                  navigate(`/platform/clients/${orgId}/departments/${d.id}`);
                }
              }}
            >
              {/* CARD INFO */}
              <div className="dept-info">
                {editingId === d.id ? (
                  <input
                    autoFocus
                    className="inline-edit-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => updateDepartment(d.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateDepartment(d.id);

                      if (e.key === "Escape") {
                        setEditingId(null);
                        setEditName("");
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <h3
                      dangerouslySetInnerHTML={{
                        __html: highlight(d.name),
                      }}
                    />

                    <span>Department</span>
                  </>
                )}
              </div>

              {/* MENU */}
              <div
                className="dept-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="menu-icon"
                  onClick={() =>
                    setMenuOpen(menuOpen === d.id ? null : d.id)
                  }
                >
                  ⋮
                </span>

                {menuOpen === d.id && (
                  <div className="dept-menu-dropdown">
                    <button
                      onClick={() => {
                        setEditingId(d.id);

                        setEditName(d.name);

                        setMenuOpen(null);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="danger-item"
                      onClick={() => {
                        setSelectedDepartment(d);

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
          ))
        )}
      </div>
      {showDeleteModal && (
        <div
          className="client-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedDepartment(null);
          }}
        >
          <div
            className="client-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Department</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedDepartment?.name}</strong>?
            </p>

            <div className="client-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDepartment(null);
                }}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={deleteDepartment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
