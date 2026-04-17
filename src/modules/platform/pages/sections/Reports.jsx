// Reports.jsx
import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/Reports.css";

export default function Reports() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/platform/verifications").then((res) => {
      setData(res);
    });
  }, []);

  // 🔥 GROUP BY CLIENT
  const grouped = data.reduce((acc, curr) => {
    const org = curr.organizationName;
    if (!acc[org]) acc[org] = [];
    acc[org].push(curr);
    return acc;
  }, {});

  return (
    <div className="reports-container">
      <h2>Reports (Client Wise)</h2>

      {Object.keys(grouped).map((org) => (
        <div
          key={org}
          className="client-card"
          onClick={() =>
            navigate("/platform/reports/clients", {
              state: { candidates: grouped[org], org },
            })
          }
        >
          <h3>{org}</h3>
          <p>{grouped[org].length} Candidates</p>
        </div>
      ))}
    </div>
  );
}
