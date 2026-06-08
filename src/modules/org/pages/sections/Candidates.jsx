import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import { useParams } from "react-router-dom";
import useDebounce from "../../../../services/hooks/DebounceEffect";
import { useRef } from "react";
import { Search, Bell, Filter, Download, MoreVertical, Users, UserCheck, ShieldCheck, FileCheck2, } from "lucide-react";
import "../../styles/Candidates.css";

export default function Candidates() {
  const { deptId } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const base = getBasePath();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const menuRef = useRef();

  const fetchCandidates = async () => {
    try {
      let url = `/org/candidates/getFullDetailsBy-department/${deptId}?`;

      if (debouncedSearch.trim()) {
        url += `q=${encodeURIComponent(debouncedSearch)}&`;
      }
      if (status) {
        url += `status=${status}`;
      }
      const res = await api.get(url);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    if (deptId) fetchCandidates();
  }, [debouncedSearch, deptId, status]);
  const deleteCandidate = async () => {
    if (!selectedCandidate) return;
    try {
      await api.delete(
        `/org/candidates/deleteCandidate/${selectedCandidate.id}`,
      );
      setShowDeleteModal(false);
      setSelectedCandidate(null);
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const highlight = (text) => {
    if (!search || !text) return text;
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  // const filtered = data.filter((item) => {
  //   const text =
  //     `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase();
  //   return text.includes(search.toLowerCase());
  // });

  const isActionDisabled = (status) => {
    return !["CREATED", "ROLLED_BACK"].includes(status);
  };

  return (
    <div className="candx-page">
      {/* HEADER */}
      <div className="candx-top-header">
        <div>
          <h1>Candidates</h1>

          <div className="candx-breadcrumb">
            <span>Departments</span>
            <span>›</span>
            <span>Candidates</span>
          </div>
        </div>

        <div className="candx-header-actions">
          {/* NOTIFICATION */}
          <div className="candx-notification">
            <Bell size={20} />
            <span>3</span>
          </div>

          {/* BUTTON */}
          <button
            className="candx-add-btn"
            onClick={() => navigate(`${base}/candidates/new/${deptId}`)}
          >
            + Add Candidate
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="candx-cards-grid">
        <div className="candx-stat-card">
          <div className="candx-stat-icon purple">
            <Users size={24} />
          </div>

          <div>
            <h5>Total Candidates</h5>
            <h2>{data.length}</h2>
            <p>Across all records</p>
          </div>
        </div>

        <div className="candx-stat-card">
          <div className="candx-stat-icon blue">
            <UserCheck size={24} />
          </div>

          <div>
            <h5>Active Verifications</h5>
            <h2>{data.filter((d) => d.status === "IN_PROGRESS").length}</h2>
            <p>Currently processing</p>
          </div>
        </div>

        <div className="candx-stat-card">
          <div className="candx-stat-icon green">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h5>Completed</h5>
            <h2>{data.filter((d) => d.status === "COMPLETED").length}</h2>
            <p>Verification completed</p>
          </div>
        </div>

        <div className="candx-stat-card">
          <div className="candx-stat-icon orange">
            <FileCheck2 size={24} />
          </div>

          <div>
            <h5>Initiated</h5>
            <h2>{data.filter((d) => d.status === "INITIATED").length}</h2>
            <p>Verification started</p>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="candx-table-container">
        {/* FILTER BAR */}
        <div className="candx-table-header">
          <div className="candx-table-search">
            <Search size={16} />

            <input
              placeholder="Search by candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="candx-filter-actions">
            <div className="candx-filter-box">
              <Filter size={16} />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>

                <option value="CREATED">Created</option>

                <option value="INITIATED">Initiated</option>

                <option value="IN_PROGRESS">In Progress</option>

                <option value="COMPLETED">Completed</option>

                <option value="FAILED">Failed</option>
              </select>
            </div>

            <button className="candx-export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="candx-list-header">
          <span>Candidate</span>
          <span>Details</span>
          <span>Remarks</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* LIST */}
        {data.map((c) => (
          <div
            key={c.id}
            className="candx-row"
            onClick={() =>
              navigate(`${base}/candidates/candidateDetails/${c.id}/`)
            }
          >
            {/* CANDIDATE */}
            <div className="candx-user-box">
              <div className="candx-avatar">{c.firstName?.charAt(0)}</div>

              <div>
                <h4>
                  {c.firstName} {c.lastName}
                </h4>

                <p>{c.email}</p>
              </div>
            </div>
            {/* DETAILS */}
            <div className="candx-details-box">
              <div className="candx-detail-row">
                <span className="candx-detail-label">Location:</span>
                <span className="candx-detail-value">
                  {c.location || "N/A"}
                </span>
              </div>
              <div className="candx-detail-row">
                <span className="candx-detail-label">Phone:</span>
                <span className="candx-detail-value">
                  {c.phone ? `${c.countryCode || ""} ${c.phone}` : "N/A"}
                </span>
              </div>
              <div className="candx-detail-row">
                <span className="candx-detail-label">Role:</span>
                <span className="candx-detail-value">{c.role || "N/A"}</span>
              </div>
            </div>

            {/* REMARKS */}
            <div
              className="candx-remarks-section"
              onClick={(e) => { e.stopPropagation(); setSelectedRemark(c.remark || "No remarks available"); setShowRemarksModal(true); }} >
              <div className="candx-remarks-card">
                <span className="candx-remarks-title">Remarks</span>
                <p>{c.remark?.trim() ? c.remark : "N/A"}</p>
              </div>
            </div>

            {/* STATUS */}
            <div>
              <span className={`candx-status-badge ${c.status?.toLowerCase()}`}>
                {c.status}
              </span>
            </div>

            {/* ACTION */}
            <div
              className="candx-action-cell"
              onClick={(e) => e.stopPropagation()}
              ref={menuRef}
            >
              <button
                className="candx-menu-btn"
                onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
              >
                <MoreVertical size={18} />
              </button>

              {openMenuId === c.id && (
                <div className="candx-dropdown-menu">
                  <button
                    onClick={() => navigate(`${base}/candidates/edit/${c.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => {
                      setSelectedCandidate(c);

                      setShowDeleteModal(true);

                      setOpenMenuId(null);
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="candx-modal-overlay">
          <div
            className="candx-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Delete Candidate</h2>

            <p>
              Type <strong>CONFIRM</strong> to delete this candidate.
            </p>

            <input
              placeholder="Enter CONFIRM"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <div className="candx-modal-actions">
              <button
                className="cancel"
                onClick={() => {
                  setShowDeleteModal(false);

                  setConfirmText("");
                }}
              >
                Cancel
              </button>

              <button
                className="confirm"
                disabled={confirmText !== "CONFIRM"}
                onClick={() => {
                  deleteCandidate();

                  setConfirmText("");
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
