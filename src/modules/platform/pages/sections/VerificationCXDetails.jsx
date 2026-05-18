import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationCXDetails.css";

export default function VerificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showRolloutModal, setShowRolloutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [verification, setVerification] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [docs, setDocs] = useState([]);

  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  const [report, setReport] = useState({
    basicCheckStatus: "",
    addressStatus: "",
    educationChecks: [],
    experienceChecks: [],
    finalRemarks: "",
    riskLevel: "LOW",
  });

  const saveVerification = async () => {
    try {
      setLoading(true);
      await api.put(
        `/platform/verifications/${id}/verify`,
        report,
      );
      setShowRolloutModal(false);
      alert("Verification rolled out successfully");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to rollout verification");
    } finally {
      setLoading(false);
    }
  };

  // Rollback request approval to client
  const approveRollback = async () => {
    if (!window.confirm("Approve rollback?")) return;

    try {
      await api.put(`/platform/verifications/${id}/approve-rollback`);
      alert("Rollback approved");
      fetchData();
    } catch (err) {
      alert("Failed");
    }
  };

  const fetchData = async () => {
    try {
      const res = await api.get(`/platform/verifications/${id}`);

      setVerification(res.verification);
      setCandidate(res.candidate);

      setDocs(Array.isArray(res.documents) ? res.documents : []);
      console.log("data fetched");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateStatus = async (status) => {
    await api.put(`/org/verifications/${id}/status?status=${status}`);
    fetchData();
  };

  const submitComment = async () => {
    await api.put(`/platform/verifications/${id}/comment?comment=${comment}`);
    setComment("");
    fetchData();
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`http://localhost:8081/platform/verifications/${id}/upload`, {
      method: "POST",
      body: formData,
    });

    fetchData();
  };

  if (!verification || !candidate) return <p>Loading...</p>;

  return (
    <div className="verification-page">

      {/* =========================
       STICKY HEADER
    ========================= */}
      <div className="verification-header">

        {/* LEFT */}
        <div className="verification-header-left">

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="verification-title-block">

            <div className="verification-title-row">
              <h2>{verification.candidateName}</h2>

              <span
                className={`verification-status-badge ${verification.status.toLowerCase()}`}
              >
                {verification.status.replace("_", " ")}
              </span>
            </div>

            <p>
              {verification.organizationName}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="verification-header-right">

          <div className="status-select-wrapper">

            <label>
              Verification Status
            </label>

            <div className="status-select-box">
              <select
                className="status-select"
                value={verification.status}
                onChange={(e) =>
                  updateStatus(e.target.value)
                }
              >
                <option value="INITIATED">
                  INITIATED
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

                <option value="FAILED">
                  FAILED
                </option>
              </select>

              <span className="select-arrow">
                ▼
              </span>
            </div>
          </div>

          {verification.status ===
            "ROLLBACK_REQUESTED" && (
              <button
                className="danger-btn"
                onClick={approveRollback}
              >
                ✅ Approve Rollback
              </button>
            )}
        </div>
      </div>

      {/* =========================
       CONTENT
    ========================= */}

      <div className="verification-content">

        {/* BASIC */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Verification Overview</h3>

            <span
              className={`status-badge ${verification.status.toLowerCase()}`}
            >
              {verification.status}
            </span>
          </div>

          <div className="info-grid">
            <div>
              <label>Candidate</label>
              <p>{verification.candidateName}</p>
            </div>

            <div>
              <label>Organization</label>
              <p>{verification.organizationName}</p>
            </div>

            <div>
              <label>Due Date</label>
              <p>{verification.slaDeadline}</p>
            </div>

            <div>
              <label>Risk Level</label>

              <select
                className="modern-select"
                onChange={(e) =>
                  setReport({
                    ...report,
                    riskLevel: e.target.value,
                  })
                }
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
              </select>
            </div>
          </div>
        </div>

        {/* CANDIDATE */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Candidate Details</h3>
          </div>

          <div className="info-grid">
            <div>
              <label>Full Name</label>

              <p>
                {candidate.firstName}{" "}
                {candidate.lastName}
              </p>
            </div>

            <div>
              <label>Email</label>

              <p>{candidate.email}</p>
            </div>

            <div>
              <label>Phone</label>

              <p>{candidate.phone}</p>
            </div>

            <div>
              <label>Basic Verification</label>

              <select
                className="modern-select"
                onChange={(e) =>
                  setReport({
                    ...report,
                    basicCheckStatus:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select
                </option>

                <option>
                  VERIFIED
                </option>

                <option>
                  DISCREPANCY
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Address Verification</h3>
          </div>

          <div className="address-grid">

            <div className="sub-glass-card">
              <h4>Current Address</h4>

              <p>
                {
                  candidate.currentAddress
                    ?.street
                }
              </p>

              <p>
                {
                  candidate.currentAddress
                    ?.city
                }
              </p>

              <p>
                {
                  candidate.currentAddress
                    ?.state
                }
              </p>

              <p>
                {
                  candidate.currentAddress
                    ?.zipCode
                }
              </p>
            </div>

            <div className="sub-glass-card">
              <h4>Permanent Address</h4>

              <p>
                {
                  candidate
                    .permanentAddress
                    ?.street
                }
              </p>

              <p>
                {
                  candidate
                    .permanentAddress
                    ?.city
                }
              </p>

              <p>
                {
                  candidate
                    .permanentAddress
                    ?.state
                }
              </p>

              <p>
                {
                  candidate
                    .permanentAddress
                    ?.zipCode
                }
              </p>
            </div>
          </div>

          <div className="verify-row">
            <select
              className="modern-select"
              onChange={(e) =>
                setReport({
                  ...report,
                  addressStatus:
                    e.target.value,
                })
              }
            >
              <option>
                VERIFIED
              </option>

              <option>
                FAILED
              </option>
            </select>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Education Verification</h3>
          </div>

          <div className="stack-layout">
            {candidate.educations?.map(
              (edu, i) => (
                <div
                  key={i}
                  className="sub-glass-card"
                >
                  <div className="info-grid">
                    <div>
                      <label>
                        Degree
                      </label>

                      <p>
                        {edu.degree}
                      </p>
                    </div>

                    <div>
                      <label>
                        Institution
                      </label>

                      <p>
                        {
                          edu.institution
                        }
                      </p>
                    </div>

                    <div>
                      <label>
                        Graduation Year
                      </label>

                      <p>
                        {
                          edu.graduationYear
                        }
                      </p>
                    </div>
                  </div>

                  <div className="verification-controls">
                    <select
                      className="modern-select"
                      onChange={(e) => {
                        const updated = [
                          ...report.educationChecks,
                        ];

                        updated[i] = {
                          name: edu.degree,
                          status:
                            e.target
                              .value,
                          remarks: "",
                        };

                        setReport({
                          ...report,
                          educationChecks:
                            updated,
                        });
                      }}
                    >
                      <option>
                        VERIFIED
                      </option>

                      <option>
                        DISCREPANCY
                      </option>
                    </select>

                    <input
                      className="modern-input"
                      placeholder="Remarks"
                      onChange={(e) => {
                        const updated = [
                          ...report.educationChecks,
                        ];

                        updated[i] = {
                          ...updated[i],
                          remarks:
                            e.target
                              .value,
                        };

                        setReport({
                          ...report,
                          educationChecks:
                            updated,
                        });
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Experience Verification</h3>
          </div>

          <div className="stack-layout">
            {candidate.experiences?.map(
              (exp, i) => (
                <div
                  key={i}
                  className="sub-glass-card"
                >
                  <div className="info-grid">
                    <div>
                      <label>
                        Company
                      </label>

                      <p>
                        {
                          exp.companyName
                        }
                      </p>
                    </div>

                    <div>
                      <label>
                        Role
                      </label>

                      <p>
                        {exp.role}
                      </p>
                    </div>

                    <div>
                      <label>
                        Duration
                      </label>

                      <p>
                        {
                          exp.startDate
                        }{" "}
                        →{" "}
                        {exp.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="verification-controls">
                    <select
                      className="modern-select"
                      onChange={(e) => {
                        const updated = [
                          ...report.experienceChecks,
                        ];

                        updated[i] = {
                          name: `${exp.companyName} (${exp.role})`,
                          status:
                            e.target
                              .value,
                          remarks: "",
                        };

                        setReport({
                          ...report,
                          experienceChecks:
                            updated,
                        });
                      }}
                    >
                      <option>
                        VERIFIED
                      </option>

                      <option>
                        DISCREPANCY
                      </option>
                    </select>

                    <input
                      className="modern-input"
                      placeholder="Remarks"
                      onChange={(e) => {
                        const updated = [
                          ...report.experienceChecks,
                        ];

                        updated[i] = {
                          ...updated[i],
                          remarks:
                            e.target
                              .value,
                        };

                        setReport({
                          ...report,
                          experienceChecks:
                            updated,
                        });
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Documents</h3>
          </div>

          <div className="stack-layout">

            {docs.map((doc) => (
              <div
                key={doc.id}
                className="doc-card"
              >
                <div>
                  <h4>{doc.fileName}</h4>

                  <p>{doc.fileType}</p>
                </div>

                <div className="doc-actions">

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      window.open(
                        `http://localhost:8081/org/documents/preview/${doc.id}`,
                        "_blank",
                      )
                    }
                  >
                    Preview
                  </button>

                  <a
                    className="download-btn"
                    href={`http://localhost:8081/org/documents/download/${doc.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL REVIEW */}
        <div className="glass-card">
          <div className="section-header">
            <h3>Final Review</h3>
          </div>

          <textarea
            className="modern-textarea"
            placeholder="Enter final remarks..."
            onChange={(e) =>
              setReport({
                ...report,
                finalRemarks:
                  e.target.value,
              })
            }
          />

          <div className="action-row">
            <button
              className="primary-btn"
              onClick={() =>
                setShowRolloutModal(true)
              }
            >
              Rollout Verification
            </button>
          </div>
        </div>
      </div>
      {/* =========================
    ROLLOUT MODAL
========================= */}

      {showRolloutModal && (
        <div className="verification-modal-overlay">
          <div className="verification-modal">
            <h3>
              Rollout Verification?
            </h3>

            <p>
              Are you sure you want to rollout
              verification for
              <b>
                {" "}
                {verification.candidateName}
              </b>
              ?
            </p>

            <p className="verification-modal-subtext">
              This action will generate
              verification reports and submit
              the final verification status.
            </p>

            <div className="verification-modal-actions">
              <button
                className="cancel-btn"
                onClick={() =>
                  setShowRolloutModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={saveVerification}
                disabled={loading}
              >
                {loading
                  ? "Rolling Out..."
                  : "Confirm Rollout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}