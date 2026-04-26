// CandidateReport.jsx
import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/Reports.css";

export default function CandidateReport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/platform/verifications/${id}`).then(setData);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const v = data.verification;

  const steps = ["INITIATED", "IN_PROGRESS", "COMPLETED"];

  return (
    <div className="reports-container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>{v.candidateName}</h2>
      <p>{v.organizationName}</p>

      {/* 🔥 PIPELINE UI */}
      <div className="pipeline">
        {steps.map((step) => (
          <div
            key={step}
            className={`pipeline-step ${v.status === step ? "active" : ""}`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="report-card">
        <p>Status: {v.status}</p>
        <p>Created: {v.createdAt}</p>
        <p>Deadline: {v.slaDeadline}</p>

        {v.status === "COMPLETED" && (
          <a
            href={`http://localhost:8081/org/verifications/download/${v.id}`}
            target="_blank"
          >
            📄 Download Report
          </a>
        )}
        <button
          onClick={() => navigate(`/platform/reports/reportDetails/${v.id}`)}
        >
          View Report
        </button>
      </div>
    </div>
  );
}
