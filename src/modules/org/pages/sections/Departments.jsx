import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import { useRef } from "react";
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
  const menuRef = useRef(null);

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
      if (!e.target.closest(".menu")) {
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
    <div className="page">
      <div className="client-dept-header">
        <h2>Departments</h2>

        <div className="actions">
          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => navigate(`${base}/departments/new`)}>
            + Add Department
          </button>
        </div>
      </div>

      <div className="dept">
        {data.map((d) => (
          <div
            key={d.id}
            className="dept-row"
            onClick={() => {
              if (editingId !== d.id) {
                navigate(`${base}/candidates/${d.id}`);
              }
            }}
          >
            <div className="dept-name">
              {editingId === d.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => updateDepartment(d.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateDepartment(d.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight(d.name),
                  }}
                />
              )}
            </div>
            {/* ⋮ MENU */}
            <div className="menu" onClick={(e) => e.stopPropagation()}>
              <span onClick={() => setMenuOpen(d.id)}>⋮</span>
              {menuOpen === d.id && (
                <div className="menu-dropdown">
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
                    onClick={() => {
                      setSelectedDept(d);
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
          className="dept-delete-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedDept(null);
          }}
        >
          <div
            className="dept-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Department</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedDept?.name}</strong>?
            </p>

            <div className="dept-delete-actions">
              <button
                className="dept-cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDept(null);
                }}
              >
                Cancel
              </button>

              <button
                className="dept-confirm-delete-btn"
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
