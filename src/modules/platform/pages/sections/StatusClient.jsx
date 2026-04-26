import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";

export default function StatusClient() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get(`/platform/verifications/search/candidates?orgId=${orgId}&q=${search}`)
      .then((res) => setData(Array.isArray(res) ? res : []));
  }, [orgId, search]);

  const highlight = (text) => {
    if (!search || !text) return text;
    return text.replace(
      new RegExp(`(${search})`, "gi"),
      "<mark>$1</mark>"
    );
  };

  return (
    <div className="status-page">
      <button onClick={() => navigate("/platform/status")}>
        ← Back
      </button>

      <h2>{data[0]?.organizationName || "Candidates"}</h2>

      <input
        placeholder="Search name / email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="status-list">
        {data.map((v) => (
          <div
            key={v.id}
            className="status-card"
            onClick={() =>
              navigate(`/platform/status/candidate/${v.id}`)
            }
          >
            <h4
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateName),
              }}
            />

            <p
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateEmail),
              }}
            />

            <span className={`status ${v.status.toLowerCase()}`}>
              {v.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}