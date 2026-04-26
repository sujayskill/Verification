import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationCXDetails.css";

export default function VerificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    await api.put(`/platform/verifications/${id}/verify`, report);
    alert("Saved");
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
    <div className="container">
      <button onClick={() => navigate(-1)}>← Back</button>

      {/* STATUS */}
      <div style={{ float: "right", display: "flex", gap: "10px" }}>
        <select
          value={verification.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option>INITIATED</option>
          <option>IN_PROGRESS</option>
          <option>COMPLETED</option>
          <option>FAILED</option>
        </select>

        {/* 🔁 ROLLBACK APPROVAL BUTTON */}
        {verification.status === "ROLLBACK_REQUESTED" && (
          <button className="danger-btn" onClick={approveRollback}>
            ✅ Approve Rollback
          </button>
        )}
      </div>

      {/* BASIC */}
      <div className="card">
        <h2>{verification.candidateName}</h2>
        <p>{verification.organizationName}</p>
        <p>Status: {verification.status}</p>
      </div>

      {/* 👤 CANDIDATE */}
      <div className="card">
        <h3>Candidate Details</h3>
        <p>
          {candidate.firstName} {candidate.lastName}
        </p>
        <p>{candidate.email}</p>
        <p>{candidate.phone}</p>
        <select
          onChange={(e) =>
            setReport({ ...report, basicCheckStatus: e.target.value })
          }
        >
          <option value="">Select</option>
          <option>VERIFIED</option>
          <option>DISCREPANCY</option>
        </select>
      </div>

      {/* 🏠 ADDRESS */}
      <div className="card">
        <h3>Current Address</h3>
        <p>{candidate.currentAddress?.street || "-"}</p>
        <p>{candidate.currentAddress?.city || "-"}</p>
        <p>{candidate.currentAddress?.state || "-"}</p>
        <p>{candidate.currentAddress?.zipCode || "-"}</p>

        <h3 style={{ marginTop: "10px" }}>Permanent Address</h3>
        <p>{candidate.permanentAddress?.street || "-"}</p>
        <p>{candidate.permanentAddress?.city || "-"}</p>
        <p>{candidate.permanentAddress?.state || "-"}</p>
        <p>{candidate.permanentAddress?.zipCode || "-"}</p>
        <select
          onChange={(e) =>
            setReport({ ...report, addressStatus: e.target.value })
          }
        >
          <option>VERIFIED</option>
          <option>FAILED</option>
        </select>
      </div>

      {/* 🎓 EDUCATION */}
      <div className="card">
        <h3>Education</h3>

        {candidate.educations?.length > 0 ? (
          candidate.educations.map((edu, i) => (
            <div key={i} className="sub-card">
              <p>
                <b>Degree:</b> {edu.degree}
              </p>
              <p>
                <b>Institution:</b> {edu.institution}
              </p>
              <p>
                <b>Year:</b> {edu.graduationYear}
              </p>
            </div>
          ))
        ) : (
          <p>No education details</p>
        )}
        {candidate.educations?.map((edu, i) => (
          <div key={i} className="sub-card">
            <p>{edu.degree}</p>

            <select
              onChange={(e) => {
                const updated = [...report.educationChecks];
                updated[i] = {
                  name: edu.degree,
                  status: e.target.value,
                  remarks: "",
                };
                setReport({ ...report, educationChecks: updated });
              }}
            >
              <option>VERIFIED</option>
              <option>DISCREPANCY</option>
            </select>

            <input
              placeholder="Remarks"
              onChange={(e) => {
                const updated = [...report.educationChecks];
                updated[i] = {
                  ...updated[i],
                  remarks: e.target.value,
                };
                setReport({ ...report, educationChecks: updated });
              }}
            />
          </div>
        ))}
      </div>

      {/* 💼 EXPERIENCE */}
      <div className="card">
        <h3>Experience</h3>

        {candidate.experiences?.length > 0 ? (
          candidate.experiences.map((exp, i) => (
            <div key={i} className="sub-card">
              <p>
                <b>Company:</b> {exp.companyName}
              </p>
              <p>
                <b>Role:</b> {exp.role}
              </p>
              <p>
                <b>Duration:</b> {exp.startDate || "-"} → {exp.endDate || "-"}
              </p>
            </div>
          ))
        ) : (
          <p>No experience details</p>
        )}

        {candidate.experiences?.map((exp, i) => (
          <div key={i} className="sub-card">
            <p>
              {exp.companyName} - {exp.role}
            </p>

            <select
              onChange={(e) => {
                const updated = [...report.experienceChecks];
                updated[i] = {
                  name: `${exp.companyName} (${exp.role})`,
                  status: e.target.value,
                  remarks: "",
                };
                setReport({ ...report, experienceChecks: updated });
              }}
            >
              <option>VERIFIED</option>
              <option>DISCREPANCY</option>
            </select>

            <input
              placeholder="Remarks"
              onChange={(e) => {
                const updated = [...report.experienceChecks];
                updated[i] = {
                  ...updated[i],
                  remarks: e.target.value,
                };
                setReport({ ...report, experienceChecks: updated });
              }}
            />
          </div>
        ))}
      </div>

      {/* 📄 DOCUMENTS */}
      <div className="card">
        <h3>Candidate Documents</h3>

        {/* 🔥 GROUPING LOGIC */}
        {(() => {
          const kycDocs = docs.filter((d) =>
            ["PAN", "AADHAR"].includes(d.fileType),
          );

          const eduDocs = docs.filter((d) =>
            ["EDUCATION_CERTIFICATE", "MARKSHEET"].includes(d.fileType),
          );

          const expDocs = docs.filter((d) =>
            ["PAYSLIP", "EXPERIENCE_LETTER", "RELIEVING_LETTER"].includes(
              d.fileType,
            ),
          );

          const renderDocs = (list) =>
            list.length === 0 ? (
              <p>No documents</p>
            ) : (
              list.map((doc) => (
                <div key={doc.id} className="doc-row">
                  <div>
                    <b>{doc.fileName}</b>
                    <p>{doc.fileType}</p>
                  </div>

                  <div className="doc-actions">
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:8081/org/documents/preview/${doc.id}`,
                          "_blank",
                        )
                      }
                    >
                      👁 Preview
                    </button>

                    <a
                      href={`http://localhost:8081/org/documents/download/${doc.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ⬇ Download
                    </a>
                  </div>
                </div>
              ))
            );

          return (
            <>
              {/* 🔹 KYC */}
              <div className="sub-card">
                <h4>🪪 KYC Documents</h4>
                {renderDocs(kycDocs)}
              </div>

              {/* 🔹 EDUCATION */}
              <div className="sub-card">
                <h4>🎓 Education Documents</h4>
                {renderDocs(eduDocs)}
              </div>

              {/* 🔹 EXPERIENCE */}
              <div className="sub-card">
                <h4>💼 Experience Documents</h4>
                {renderDocs(expDocs)}
              </div>
            </>
          );
        })()}
      </div>

      {/* COMMENT */}
      <div className="card">
        <h3>Final Review</h3>

        <select
          onChange={(e) => setReport({ ...report, riskLevel: e.target.value })}
        >
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </select>

        <textarea
          placeholder="Final remarks"
          onChange={(e) =>
            setReport({ ...report, finalRemarks: e.target.value })
          }
        />
      </div>

      <button onClick={saveVerification}>Rollout Verification</button>

      {/* SLA */}
      <div className="card">
        <p>
          <b>Due Date:</b> {verification.slaDeadline}
        </p>

        {verification.breached && (
          <p style={{ color: "red" }}>⚠ SLA Breached</p>
        )}
      </div>
    </div>
  );
}
