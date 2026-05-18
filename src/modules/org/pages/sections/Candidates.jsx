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

  const fetchCandidates = async () => {
    try {
      let url = `/org/candidates/by-department/${deptId}`;
      if (debouncedSearch.trim()) {
        url += `?q=${debouncedSearch}`;
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
  }, [debouncedSearch, deptId]);
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

  const filtered = data.filter((item) => {
    const text =
      `${item.firstName} ${item.lastName} ${item.email}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const isActionDisabled = (status) => {
    return !["CREATED", "ROLLED_BACK"].includes(status);
  };

  return (
    <div className="page">
      <div className="page-header">
        {/* LEFT */}
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() => navigate(`${base}/departments`)}
          >
            ← Back
          </button>
          <h1>Candidates</h1>
        </div>

        {/* RIGHT */}
        <div className="header-right">
          <input
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={() => navigate(`${base}/candidates/new/${deptId}`)}
          >
            + Add Candidate
          </button>
        </div>
      </div>
      <div className="list">
        {data.length === 0 ? (
          <p>No candidates found</p>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="row clickable-row"
              onClick={() =>
                navigate(`${base}/candidates/candidateDetails/${c.id}/`)
              }
            >
              <div className="info">
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
                <span className={`status`}>
                  {c.status === "COMPLETED" && "✅ Verification Completed"}
                  {c.status === "IN_PROGRESS" && "🟡 In Progress"}
                  {c.status === "INITIATED" && "🔵 Initiated"}
                  {c.status === "ROLLBACK_REQUESTED" && "⚠ Rollback Requested"}
                  {c.status === "CREATED" && "Not Started"}
                </span>
              </div>
              <div className="actions">
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
          className="delete-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedCandidate(null);
          }}
        >
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Candidate</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </strong>
              ?
            </p>

            <div className="delete-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </button>

              <button className="confirm-delete-btn" onClick={deleteCandidate}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
