import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationDetails.css";

export default function VerificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [verification, setVerification] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [docs, setDocs] = useState([]); // 🔥 NEW

  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get(`/platform/verifications/${id}`);

      setVerification(res.verification);
      setCandidate(res.candidate);

      // 🔥 SAFE DOCUMENT HANDLING
      setDocs(Array.isArray(res.documents) ? res.documents : []);

      console.log(docs.length);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 🔥 STATUS UPDATE
  const updateStatus = async (status) => {
    await api.put(`/org/verifications/${id}/status?status=${status}`);
    fetchData();
  };

  // 🔥 COMMENT
  const submitComment = async () => {
    await api.put(`/platform/verifications/${id}/comment?comment=${comment}`);
    setComment("");
    fetchData();
  };

  // 🔥 FILE UPLOAD
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

      {/* TIMELINE */}
      <div className="timeline">
        {["INITIATED", "IN_PROGRESS", "COMPLETED"].map((step) => (
          <div
            key={step}
            className={`step ${verification.status === step ? "active" : ""}`}
          >
            {step}
          </div>
        ))}
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
        <p>{candidate.firstName} {candidate.lastName}</p>
        <p>{candidate.email}</p>
        <p>{candidate.phone}</p>
      </div>

      {/* 📄 DOCUMENTS (🔥 MAIN FEATURE) */}
      <div className="card">
        <h3>Candidate Documents</h3>

        {docs.length === 0 ? (
          <p>No documents uploaded</p>
        ) : (
          docs.map((doc) => (
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
                      "_blank"
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
        )}
      </div>

      {/* COMMENT */}
      <div className="card">
        <h3>Vendor Comments</h3>
        <p>{verification.comment || "No comments yet"}</p>

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
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
        <p><b>Due Date:</b> {verification.slaDeadline}</p>

        {verification.breached && (
          <p style={{ color: "red" }}>⚠ SLA Breached</p>
        )}
      </div>
    </div>
  );
}