import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/VerificationRequests.css";

export default function VerificationRequests() {
  const [grouped, setGrouped] = useState({});
  const [selectedOrg, setSelectedOrg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/platform/verifications").then((data) => {

      if (!Array.isArray(data)) return;

      const groupedData = {};

      data.forEach((v) => {
        if (!groupedData[v.organizationName]) {
          groupedData[v.organizationName] = [];
        }
        groupedData[v.organizationName].push(v);
      });

      setGrouped(groupedData);
    });
  }, []);

  return (
    <div className="vr-page">

      <h2>Verification Requests</h2>

      {/* STEP 1: ORGANIZATIONS */}
      {!selectedOrg && (
        <div className="vr-grid">
          {Object.keys(grouped).map((org) => (
            <div
              key={org}
              className="vr-card"
              onClick={() => setSelectedOrg(org)}
            >
              <h3>{org}</h3>
              <p>{grouped[org].length} Requests</p>
            </div>
          ))}
        </div>
      )}

      {/* STEP 2: CANDIDATES */}
      {selectedOrg && (
        <>
          <button className="back-btn" onClick={() => setSelectedOrg(null)}>
            ← Back
          </button>

          <div className="vr-list">
            {grouped[selectedOrg].map((v) => (
              <div
                key={v.id}
                className="candidate-card"
                onClick={() =>
                  navigate(`/platform/verificationDetails/${v.id}`)
                }
              >
                <div>
                  <h4>{v.candidateName}</h4>
                  <p>ID: {v.candidateId}</p>
                </div>

                <span className={`status ${v.status.toLowerCase()}`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}