import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Reports.css";

export default function Reports() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const base = getBasePath();

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/org/verifications/candidateReports?q=${search}`,
      );
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  // 🔥 HIGHLIGHT FUNCTION
  const highlight = (text) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="reports-container">
      <h2>Candidate Reports</h2>

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Search candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="reports-list">
        {data.length === 0 && <p>No completed reports found</p>}

        {data.map((v) => (
          <div
            key={v.id}
            className="report-row"
            onClick={() => navigate(`${base}/reports/reportDetails/${v.id}`)}
          >
            <div>
              <h4
                dangerouslySetInnerHTML={{
                  __html: highlight(v.candidateName),
                }}
              />
              <p>Created: {v.createdAt}</p>
            </div>

            <span className={`status ${v.status.toLowerCase()}`}>
              {v.status}
            </span>

            {v.reportAvailable && <span className="ready">✔ Report Ready</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
