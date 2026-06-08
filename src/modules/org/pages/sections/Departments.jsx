import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import {
  Search,
  Bell,
  Plus,
  Building2,
  Users,
  ShieldCheck,
  FileCheck,
  Filter,
  Download,
} from "lucide-react";
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
    <div className="cpd2-page">
      {/* =========================
        TOP HEADER
    ========================= */}

      <div className="cpd2-topbar">
        {/* LEFT */}
        <div className="cpd2-top-left">
          <h1>Departments</h1>

          <div className="cpd2-breadcrumb">
            <span>Candidates</span>
            <span>›</span>
            <span>Departments</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cpd2-top-right">
          {/* NOTIFICATION */}
          <div className="cpd2-notification">
            <Bell size={20} strokeWidth={2} />

            <span>3</span>
          </div>

          {/* ADD BTN */}
          <button
            className="cpd2-add-btn"
            onClick={() => navigate(`${base}/departments/new`)}
          >
            <Plus size={18} />
            Add Department
          </button>
        </div>
      </div>

      {/* =========================
        STATS
    ========================= */}

      <div className="cpd2-stats-grid">
        {/* TOTAL */}
        <div className="cpd2-stat-card">
          <div className="cpd2-stat-icon purple">
            <Building2 size={28} strokeWidth={2.2} />
          </div>

          <div>
            <p>Total Departments</p>
            <h2>{data.length}</h2>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="cpd2-stat-card">
          <div className="cpd2-stat-icon blue">
            <Users size={28} strokeWidth={2.2} />
          </div>

          <div>
            <p>Active Departments</p>
            <h2>{data.length}</h2>
          </div>
        </div>

        {/* CANDIDATES */}
        <div className="cpd2-stat-card">
          <div className="cpd2-stat-icon green">
            <ShieldCheck size={28} strokeWidth={2.2} />
          </div>

          <div>
            <p>Total Candidates</p>
            <h2>1,248</h2>
          </div>
        </div>

        {/* VERIFICATIONS */}
        <div className="cpd2-stat-card">
          <div className="cpd2-stat-icon orange">
            <FileCheck size={28} strokeWidth={2.2} />
          </div>

          <div>
            <p>Verifications</p>
            <h2>856</h2>
          </div>
        </div>
      </div>

      {/* =========================
        TABLE SECTION
    ========================= */}

      <div className="cpd2-table-card">
        {/* FILTER BAR */}
        <div className="cpd2-filter-bar">
          <div className="cpd2-filter-left">
            <div className="cpd2-search-small">
              <Search size={16} className="cpd2-search-svg" />

              <input
                placeholder="Search by department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="cpd2-filter-actions"> 
            <button className="cpd2-filter-btn"> <Filter size={17} /> Filters </button>

            <button className="cpd2-export-btn"> <Download size={17} /> Export </button>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="cpd2-table-header">
          <span>Department Name</span>

          <span>Status</span>

          <span>Actions</span>
        </div>

        {/* ROWS */}
        <div className="cpd2-table-body">
          {data.map((d) => (
            <div
              key={d.id}
              className="cpd2-row"
              onClick={() => {
                if (editingId !== d.id) {
                  navigate(`${base}/candidates/${d.id}`);
                }
              }}
            >
              {/* NAME */}
              <div className="cpd2-dept-info">

                <div>
                  {editingId === d.id ? (
                    <input
                      autoFocus
                      className="cpd2-inline-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => updateDepartment(d.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateDepartment(d.id);
                        }

                        if (e.key === "Escape") {
                          setEditingId(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: highlight(d.name),
                      }}
                    />
                  )}

                  <p>Department</p>
                </div>
              </div>

              {/* STATUS */}
              <div className="cpd2-status">Active</div>

              {/* ACTIONS */}
              <div className="cpd2-menu" onClick={(e) => e.stopPropagation()}>
                <button
                  className="cpd2-menu-btn"
                  onClick={() => setMenuOpen(menuOpen === d.id ? null : d.id)}
                >
                  ⋮
                </button>

                {menuOpen === d.id && (
                  <div className="cpd2-menu-dropdown">
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
                      className="danger"
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
      </div>

      {/* DELETE MODAL */}

      {showDeleteModal && (
        <div
          className="cpd2-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedDept(null);
          }}
        >
          <div className="cpd2-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Department</h3>

            <p>
              Are you sure you want to delete
              <strong> {selectedDept?.name}</strong>?
            </p>

            <div className="cpd2-modal-actions">
              <button
                className="cancel"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDept(null);
                }}
              >
                Cancel
              </button>

              <button className="delete" onClick={deleteDepartment}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
