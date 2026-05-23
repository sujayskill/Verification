import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Verifications.css";

export default function Verifications() {
  const navigate = useNavigate();
  const base = getBasePath();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showInitiateModal, setShowInitiateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [remarkModal, setRemarkModal] = useState(false);
  const [remarkText, setRemarkText] = useState("");

  // FETCH
  const fetchData = async () => {
    try {
      let url = `/org/candidates/verifications?q=${search}`;

      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const res = await api.get(url);
      setData(Array.isArray(res) ? res : []);
      console.log(res);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  const saveRemark = async () => {
    try {
      await api.put(
        `/org/verifications/${selectedCandidate.id}/remark?remark=${encodeURIComponent(remarkText)}`,
      );

      setRemarkModal(false);

      setRemarkText("");

      setSelectedCandidate(null);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const initiateVerification = async () => {
    if (!selectedCandidate) return;
    try {
      await api.post(`/org/verifications/${selectedCandidate.id}`);
      setShowInitiateModal(false);
      setSelectedCandidate(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const canInitiateVerification = (status) => {
    return status === "CREATED" || status === "ROLLED_BACK";
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  // HIGHLIGHT
  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="cv-page">
      {/* HEADER */}
      <div className="cv-page-header">
        <div className="cv-header-left">
          <h1>Verifications</h1>
        </div>

        {/* RIGHT */}
        <div className="cv-header-right">
          {/* STATUS FILTER */}

          <select
            className="cv-verification-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>

            <option value="CREATED">Created</option>

            <option value="INITIATED">Initiated</option>

            <option value="IN_PROGRESS">In Progress</option>

            <option value="COMPLETED">Completed</option>

            <option value="FAILED">Failed</option>
          </select>

          {/* SEARCH */}

          <input
            className="cv-search-input"
            placeholder="Search Candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="cv-list">
        {data.length === 0 ? (
          <p>No candidates found</p>
        ) : (
          data.map((c) => (
            <div
              key={c.id}
              className="cv-row cv-clickable-row candidate-row-style"
              onClick={() => navigate(`${base}/verifications/pipeline/${c.id}`)}
            >
              {/* LEFT SECTION */}

              <div className="cv-verification-row-left">
                {/* NAME */}
                <h4
                  dangerouslySetInnerHTML={{
                    __html: highlight(
                      `${c.firstName || ""} ${c.lastName || ""}`,
                    ),
                  }}
                />
                {/* EMAIL */}
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlight(c.email || ""),
                  }}
                />

                {/* STATUS */}

                <span className={`cv-status ${c.status?.toLowerCase()}`}>
                  {c.status === "COMPLETED" && "✅ Verification Completed"}

                  {c.status === "IN_PROGRESS" && "🟡 In Progress"}

                  {c.status === "INITIATED" && "🔵 Initiated"}

                  {c.status === "ROLLBACK_REQUESTED" && "⚠ Rollback Requested"}

                  {c.status === "CREATED" && "⚪ Not Started"}

                  {!c.status && "⚪ Not Started"}
                </span>
              </div>

              {/* CENTER SECTION */}

              <div className="cv-candidate-col cv-candidate-middle">
                {/* MOBILE */}

                <div className="cv-candidate-meta-row">
                  <span className="cv-candidate-meta-label">Mobile:</span>

                  <span className="cv-candidate-meta-value">
                    {c.phone ? `${c.countryCode || ""} ${c.phone}` : "N/A"}
                  </span>
                </div>

                {/* LOCATION */}

                <div className="cv-candidate-meta-row">
                  <span className="cv-candidate-meta-label">Location:</span>

                  <span className="cv-candidate-meta-value">
                    {c.location?.trim() ? c.location : " N/A"}
                  </span>
                </div>

                {/* ROLE */}

                <div className="cv-candidate-meta-row">
                  <span className="cv-candidate-meta-label">Role:</span>

                  <span className="cv-candidate-meta-value">
                    {c.role?.trim() ? c.role : " N/A"}
                  </span>
                </div>
              </div>

              {/* RIGHT SECTION */}

              <div className="cv-candidate-remarks">
                <div className="cv-remarks-box">
                  <span className="cv-remarks-title">Remarks</span>

                  <p>{c.remark?.trim() ? c.remark : "No remarks added"}</p>

                  <button
                    className="cv-add-remark-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      setSelectedCandidate(c);

                      setRemarkText(c.remark || "");

                      setRemarkModal(true);
                    }}
                  >
                    Add Remark
                  </button>
                </div>
              </div>

              <div className="cv-actions">
                <button
                  className={`initiate-btn ${
                    !canInitiateVerification(c.status) ? "initiated-btn" : ""
                  }`}
                  disabled={!canInitiateVerification(c.status)}
                  onClick={(e) => {
                    e.stopPropagation();

                    setSelectedCandidate(c);

                    setShowInitiateModal(true);
                  }}
                >
                  {canInitiateVerification(c.status)
                    ? "Start Verification"
                    : "Verification Initiated"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showInitiateModal && (
        <div
          className="cv-verification-modal-overlay"
          onClick={() => {
            setShowInitiateModal(false);
            setSelectedCandidate(null);
          }}
        >
          <div
            className="cv-verification-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Initiate Verification</h3>

            <p>
              Are you sure you want to initiate verification for{" "}
              <strong>
                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
              </strong>
              ?
            </p>

            <div className="cv-verification-modal-actions">
              <button
                className="cv-verification-cancel-btn"
                onClick={() => {
                  setShowInitiateModal(false);
                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </button>

              <button
                className="cv-verification-confirm-btn"
                onClick={initiateVerification}
              >
                Start Verification
              </button>
            </div>
          </div>
        </div>
      )}
      {remarkModal && (
        <div
          className="cv-verification-modal-overlay"
          onClick={() => {
            setRemarkModal(false);
            setSelectedCandidate(null);
          }}
        >
          <div
            className="cv-verification-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Candidate Remark</h3>

            <textarea
              className="cv-remark-textarea"
              placeholder="Add remarks..."
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />

            <div className="cv-verification-modal-actions">
              <button
                className="cv-verification-cancel-btn"
                onClick={() => {
                  setRemarkModal(false);
                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </button>

              <button
                className="cv-verification-confirm-btn"
                onClick={saveRemark}
              >
                Save Remark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
