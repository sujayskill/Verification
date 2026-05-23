import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import { useParams } from "react-router-dom";
import useDebounce from "../../../../services/hooks/DebounceEffect";
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
    <div className="c-page">
      <div className="c-page-header">
        {/* LEFT */}
        <div className="c-eader-left">
          <button
            className="c-back-btn"
            onClick={() => navigate(`${base}/departments`)}
          >
            ← Back
          </button>
          <h1>Candidates</h1>
        </div>

        {/* RIGHT */}
        <div className="c-header-right">
          {/* STATUS FILTER */}
          <select
            className="c-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="CREATED">Created</option>
            <option value="INITIATED">Initiated</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>

          {/* SEARCH */}
          <input
            className="c-search-input"
            placeholder="Search Candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* BUTTON */}
          <button
            className="c-primary-btn"
            onClick={() => navigate(`${base}/candidates/new/${deptId}`)}
          >
            + Add Candidate
          </button>
        </div>
      </div>
      <div className="c-list">
        {data.length === 0 ? (
          <p>No candidates found</p>
        ) : (
          data.map((c) => (
            <div
              key={c.id}
              className="c-candidate-row c-clickable-row"
              onClick={() =>
                navigate(`${base}/candidates/candidateDetails/${c.id}/`)
              }
            >
              {/* LEFT SECTION */}
              <div className="c-candidate-col c-candidate-primary">
                <h4
                  dangerouslySetInnerHTML={{
                    __html: highlight(`${c.firstName} ${c.lastName}`),
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: highlight(c.email),
                  }}
                />

                <span className="c-candidate-status">
                  {c.status === "COMPLETED" && "✅ Verification Completed"}

                  {c.status === "IN_PROGRESS" && "🟡 In Progress"}

                  {c.status === "INITIATED" && "🔵 Initiated"}

                  {c.status === "ROLLBACK_REQUESTED" && "⚠ Rollback Requested"}

                  {c.status === "CREATED" && "⚪ Created"}
                </span>
              </div>

              {/* MIDDLE SECTION */}

              <div className="c-candidate-col c-candidate-middle">
                {/* MOBILE */}

                <div className="c-candidate-meta-row">
                  <span className="c-candidate-meta-label">Mobile:</span>

                  <span className="c-candidate-meta-value">
                    {c.phone ? `${c.countryCode || ""} ${c.phone}` : "N/A"}
                  </span>
                </div>

                {/* LOCATION */}

                <div className="c-candidate-meta-row">
                  <span className="c-candidate-meta-label">Location:</span>

                  <span className="c-candidate-meta-value">
                    {c.location?.trim() ? c.location : " N/A"}
                  </span>
                </div>

                {/* ROLE */}

                <div className="c-candidate-meta-row">
                  <span className="c-candidate-meta-label">Role:</span>

                  <span className="c-candidate-meta-value">
                    {c.role?.trim() ? c.role : " N/A"}
                  </span>
                </div>
              </div>

              {/* REMARKS SECTION */}

              <div
                className="c-candidate-col c-candidate-remarks"
                onClick={(e) => {
                  e.stopPropagation();

                  setSelectedRemark(c.remark || "No remarks available");

                  setShowRemarksModal(true);
                }}
              >
                <div className="c-remarks-box">
                  <span className="c-remarks-title">Remarks</span>

                  <p>{c.remark?.trim() ? c.remark : "N/A"}</p>
                </div>
              </div>
              {/* ACTIONS */}
              <div
                className="c-candidate-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  disabled={isActionDisabled(c.status)}
                  className={isActionDisabled(c.status) ? "disabled blur" : ""}
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`${base}/candidates/edit/${c.id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  disabled={isActionDisabled(c.status)}
                  className={isActionDisabled(c.status) ? "disabled blur" : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCandidate(c);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showDeleteModal && (
        <div
          className="c-delete-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedCandidate(null);
          }}
        >
          <div className="c-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Candidate</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </strong>
              ?
            </p>

            <div className="c-delete-modal-actions">
              <button
                className="c-cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </button>
              <button
                className="c-confirm-delete-btn"
                onClick={deleteCandidate}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showRemarksModal && (
        <div
          className="c-remarks-modal-overlay"
          onClick={() => {
            setShowRemarksModal(false);

            setSelectedRemark("");
          }}
        >
          <div className="c-remarks-modal" onClick={(e) => e.stopPropagation()}>
            <div className="c-remarks-modal-header">
              <h3>Candidate Remarks</h3>

              <button
                className="c-remarks-close-btn"
                onClick={() => {
                  setShowRemarksModal(false);

                  setSelectedRemark("");
                }}
              >
                ✕
              </button>
            </div>

            <div className="c-remarks-modal-body">
              {selectedRemark.split(",").map((item, index) => (
                <p key={index}>• {item.trim()}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
