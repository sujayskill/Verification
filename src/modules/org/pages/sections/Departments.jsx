import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Departments.css";

export default function Departments({ onSelect }) {
  const navigate = useNavigate();
  const base = getBasePath();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchData = async () => {
    const res = await api.get(`/departments?q=${search}`);
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const addDepartment = async () => {
    if (!name) return;
    await api.post("/departments", { name });
    fetchData();
  };

  const deleteDepartment = async () => {
    if (!selectedDept) return;

    try {
      await api.delete(`/departments/${selectedDept.id}`);

      setShowDeleteModal(false);
      setSelectedDept(null);

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const updateDepartment = async (id) => {
    if (!editName.trim()) return;

    await api.put(`/departments/${id}`, {
      name: editName,
    });

    setEditingId(null);
    setEditName("");
    fetchData();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".cpd-menu")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="cpd-page">

      {/* =========================
        HEADER
    ========================= */}

      <div className="cpd-header">

        {/* LEFT */}
        <div className="cpd-header-left">

          <h2>Departments</h2>

          <p>
            {data.length} departments
          </p>

        </div>

        {/* RIGHT */}
        <div className="cpd-header-actions">

          <input
            className="cpd-search-input"
            placeholder="Search department..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="cpd-add-btn"
            onClick={() =>
              navigate(
                `${base}/departments/new`,
              )
            }
          >
            + Add Department
          </button>

        </div>
      </div>

      {/* =========================
        GRID
    ========================= */}

      <div className="cpd-grid">

        {data.map((d) => (
          <div
            key={d.id}
            className="cpd-card cpd-clickable"
            onClick={() => {
              if (editingId !== d.id) {
                navigate(
                  `${base}/candidates/${d.id}`,
                );
              }
            }}
          >

            {/* INFO */}
            <div className="cpd-card-info">

              {editingId === d.id ? (
                <input
                  autoFocus
                  className="cpd-inline-input"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value,
                    )
                  }
                  onBlur={() =>
                    updateDepartment(d.id)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      updateDepartment(d.id);
                    }

                    if (
                      e.key === "Escape"
                    ) {
                      setEditingId(null);
                    }
                  }}
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                />
              ) : (
                <>
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: highlight(
                        d.name,
                      ),
                    }}
                  />

                  <span>
                    Department
                  </span>
                </>
              )}
            </div>

            {/* MENU */}
            <div
              className="cpd-menu"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <span
                className="cpd-menu-icon"
                onClick={(e) => {
                  e.stopPropagation();

                  setMenuOpen(
                    menuOpen === d.id
                      ? null
                      : d.id,
                  );
                }}
              >
                ⋮
              </span>

              {menuOpen === d.id && (
                <div className="cpd-menu-dropdown">

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(d.id);
                      setEditName(d.name);
                      setMenuOpen(null);
                    }}>
                    Edit
                  </button>

                  <button
                    className="cpd-danger-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDept(d);
                      setShowDeleteModal(true);
                      setMenuOpen(null);
                    }}>
                    Delete
                  </button>

                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
        DELETE MODAL
    ========================= */}

      {showDeleteModal && (
        <div
          className="cpd-modal-overlay"
          onClick={() => {
            setShowDeleteModal(
              false,
            );

            setSelectedDept(
              null,
            );
          }}
        >

          <div
            className="cpd-delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3>
              Delete Department
            </h3>

            <p>
              Are you sure you want
              to delete
              <strong>
                {" "}
                {
                  selectedDept?.name
                }
              </strong>
              ?
            </p>

            <div className="cpd-modal-actions">

              <button
                className="cpd-cancel-btn"
                onClick={() => {
                  setShowDeleteModal(
                    false,
                  );

                  setSelectedDept(
                    null,
                  );
                }}
              >
                Cancel
              </button>

              <button
                className="cpd-confirm-delete-btn"
                onClick={
                  deleteDepartment
                }
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
