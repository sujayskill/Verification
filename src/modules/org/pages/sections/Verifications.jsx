import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import "../../styles/Verifications.css";

export default function Verifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/org/verifications/org").then(setData);
  }, []);

  return (
    <div className="content">
      <h2>Verification Status</h2>

      {data.map((v) => (
        <div key={v.id} className="card">
          <h4>{v.candidateName}</h4>

          {/* 🔥 TIMELINE */}
          <div className="timeline">
            {["INITIATED", "IN_PROGRESS", "COMPLETED"].map((step) => (
              <span
                key={step}
                className={`step ${v.status === step ? "active" : ""}`}
              >
                {step}
              </span>
            ))}
          </div>

          <p>Status: {v.status}</p>

          {/* 🔥 COMMENT */}
          <p>
            <b>Vendor Note:</b> {v.comment || "No updates yet"}
          </p>

          {/* 🔥 DOCUMENT */}
          {v.status === "COMPLETED" && v.reportUrl && (
            <a
              href={`http://localhost:8081/org/verifications/download/${v.id}`}
              target="_blank"
            >
              📄 Download Report
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
