import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";

export default function StatusCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);

  useEffect(() => {
    api.get(`/platform/verifications/${id}`).then((res) => {
      setV(res.verification);
    });
  }, [id]);

  if (!v) return <p>Loading...</p>;

  const steps = [
    "INITIATED",
    "IN_PROGRESS",
    "ROLLBACK_REQUESTED",
    "ROLLED_BACK",
    "COMPLETED",
  ];

  return (
    <div className="pipeline-page">
      <button onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>{v.candidateName}</h2>

      <div className="pipeline">
        {steps.map((step, i) => (
          <div
            key={step}
            className={`step ${steps.indexOf(v.status) >= i ? "active" : ""}`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
