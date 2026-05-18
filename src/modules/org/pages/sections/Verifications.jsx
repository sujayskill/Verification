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

  // FETCH
  const fetchData = async () => {
    try {
      const res = await api.get(`/org/candidates/verifications?q=${search}`);
      setData(Array.isArray(res) ? res : []);
      console.log(res);
    } catch (err) {
      console.error(err);
      setData([]);
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
  }, [search]);

  // HIGHLIGHT
  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-left">
          <h1>Verifications</h1>
        </div>

        {/* RIGHT */}
        <div className="header-right">
          <input
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="list">
        {data.length === 0 ? (
          <p>No candidates found</p>
        ) : (
          data.map((c) => (
            <div
              key={c.id}
              className="row clickable-row"
              onClick={() =>
                navigate(`${base}/verifications/pipeline/${c.id}`)
              }
            >

              {/* LEFT SECTION */}

              <div className="verification-row-left">
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

                <span
                  className={`status ${c.status?.toLowerCase()}`}
                >
                  {c.status === "COMPLETED" &&
                    "✅ Verification Completed"}

                  {c.status === "IN_PROGRESS" &&
                    "🟡 In Progress"}

                  {c.status === "INITIATED" &&
                    "🔵 Initiated"}

                  {c.status ===
                    "ROLLBACK_REQUESTED" &&
                    "⚠ Rollback Requested"}

                  {c.status === "CREATED" &&
                    "⚪ Not Started"}

                  {!c.status && "⚪ Not Started"}
                </span>
              </div>

              {/* CENTER SECTION */}

              <div className="verification-row-center">

                <div className="verification-meta-item">
                  <span>Mobile</span>

                  <p>{c.phone || "N/A"}</p>
                </div>

                <div className="verification-meta-item">
                  <span>Location</span>

                  <p>{c.location || "N/A"}</p>
                </div>

                <div className="verification-meta-item">
                  <span>Role</span>

                  <p>{c.role || "N/A"}</p>
                </div>
              </div>

              {/* RIGHT SECTION */}

              <div className="actions">

                <button
                  className={`initiate-btn ${!canInitiateVerification(c.status)
                      ? "initiated-btn"
                      : ""
                    }`}
                  disabled={
                    !canInitiateVerification(c.status)
                  }
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
          className="verification-modal-overlay"
          onClick={() => {
            setShowInitiateModal(false);
            setSelectedCandidate(null);
          }}
        >
          <div
            className="verification-modal"
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

            <div className="verification-modal-actions">
              <button
                className="verification-cancel-btn"
                onClick={() => {
                  setShowInitiateModal(false);
                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </button>

              <button
                className="verification-confirm-btn"
                onClick={initiateVerification}
              >
                Start Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
