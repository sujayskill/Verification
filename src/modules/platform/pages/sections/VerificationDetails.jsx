import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationDetails.css";

export default function VerificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [verification, setVerification] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [docs, setDocs] = useState([]);

  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get(`/platform/verifications/${id}`);

      setVerification(res.verification);
      setCandidate(res.candidate);

      setDocs(Array.isArray(res.documents) ? res.documents : []);
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
      <div style={{ float: "right" }}>
        <select
          value={verification.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option>INITIATED</option>
          <option>IN_PROGRESS</option>
          <option>COMPLETED</option>
          <option>FAILED</option>
        </select>
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
        <h3>Vendor Comments</h3>
        <p>{verification.comment || "No comments yet"}</p>

        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button onClick={submitComment}>Submit</button>
      </div>

      {/* FILE UPLOAD */}
      <div className="card">
        <h3>Upload Vendor File</h3>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload</button>

        {verification.documentUrl && <p>📄 {verification.documentUrl}</p>}
      </div>

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
