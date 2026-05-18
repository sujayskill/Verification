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

  // 🔥 FETCH ALL REPORTS
  const fetchData = async () => {
    try {
      const res = await api.get(
        `/org/verifications/client/reports?q=${search}`,
      );

      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  // 🔥 SEARCH HIGHLIGHT
  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="reports-header">
        <div className="header-left">
          <h2>Candidate Reports</h2>
          <p>View all verification reports</p>
        </div>

        <div className="header-right">
          <input
            className="reports-search"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="reports-list">
        {data.length === 0 ? (
          <div className="empty-state">
            <p>No reports found</p>
          </div>
        ) : (
          data.map((v) => (
            <div
              key={v.id}
              className="report-card"
              onClick={() => navigate(`${base}/reports/reportDetails/${v.id}`)}
            >
              {/* LEFT */}
              <div className="report-left">
                <h4
                  dangerouslySetInnerHTML={{
                    __html: highlight(v.candidateName),
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: highlight(v.candidateEmail || ""),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlight(v.candidateEmail || ""),
                  }}
                />
              </div>

              {/* RIGHT */}
              <div className="report-right">
                <span className={`status ${v.status?.toLowerCase()}`}>
                  {v.status}
                </span>

                {v.reportAvailable && (
                  <span className="ready">✔ Report Ready</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
