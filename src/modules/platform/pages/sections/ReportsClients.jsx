// ClientCandidates.jsx
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/Reports.css";

export default function ClientCandidates() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No Data</p>;

  const { candidates, org } = state;

  return (
    <div className="reports-container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>{org} - Candidates</h2>

      {candidates.map((c) => (
        <div
          key={c.id}
          className="candidate-card"
          onClick={() =>
            navigate(`/platform/reports/client/candidate/${c.id}`)
          }
        >
          <h4>{c.candidateName}</h4>
          <p>Status: {c.status}</p>
        </div>
      ))}
    </div>
  );
}