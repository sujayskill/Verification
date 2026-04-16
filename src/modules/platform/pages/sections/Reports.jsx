import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/platform/verifications").then(setData);
  }, []);

  return (
    <div className="content">
      <h2>Reports</h2>

      {data.map((v) => (
        <div key={v.id} className="card">
          <h4>{v.candidateName}</h4>
          <p>{v.organizationName}</p>
          <p>Status: {v.status}</p>

          {v.status === "COMPLETED" && (
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
