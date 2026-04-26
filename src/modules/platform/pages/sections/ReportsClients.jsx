import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";

export default function ReportsCandidates() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const base = getBasePath();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get(`/platform/verifications/reports/${orgId}`).then((res) => {
      console.log("orgId",orgId);
      setData(Array.isArray(res) ? res : []);
      console.log(res);
    });
  }, [orgId]);

  const filtered = data.filter((v) =>
    v.candidateName?.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="reports-container">
      <button onClick={() => navigate(`/platform/reports`)}>← Back</button>

      <h2>{data[0]?.organizationName || "Reports"}</h2>

      <input
        placeholder="Search candidate..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="reports-list">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="report-row"
            onClick={() => navigate(`/platform/reports/client/${v.id}`)}
          >
            <h4
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateName || ""),
              }}
            />
            <p>{v.status}</p>

            <span className="ready">✔ Report Ready</span>
          </div>
        ))}
      </div>
    </div>
  );
}
