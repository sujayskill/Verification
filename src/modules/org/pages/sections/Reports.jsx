import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";

export default function Reports() {
  const { deptId } = useParams();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const base = getBasePath();

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/org/verifications/candidateReports/by-department?deptId=${deptId}&q=${search}`
      );

      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (deptId) fetchData();
  }, [search, deptId]);

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="reports-container">
      <button onClick={() => navigate(`${base}/reports`)}>
        ← Back to Departments
      </button>

      <h2>Department Reports</h2>

      <input
        placeholder="Search candidate..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="reports-list">
        {data.length === 0 && <p>No reports found</p>}

        {data.map((v) => (
          <div
            key={v.id}
            className="report-row"
            onClick={() =>
              navigate(`${base}/reports/reportDetails/${v.id}`)
            }
          >
            <h4
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateName),
              }}
            />

            <span className={`status ${v.status.toLowerCase()}`}>
              {v.status}
            </span>

            {v.reportAvailable && (
              <span className="ready">✔ Report Ready</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}