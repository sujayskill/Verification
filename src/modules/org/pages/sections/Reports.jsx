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
    <div className="c-reports-page">
      {/* HEADER */}
      <div className="c-reports-header">
        <div className="c-reports-header-left">
          <h1>Candidate Reports</h1>
          <p>View all verification reports</p>
        </div>

        <div className="c-reports-header-right">
          <input
            className="c-reports-search"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="c-reports-list">
        {data.length === 0 ? (
          <div className="c-reports-empty">
            <p>No reports found</p>
          </div>
        ) : (
          data.map((v) => (
            <div
              key={v.id}
              className="c-report-card"
              onClick={() => navigate(`${base}/reports/reportDetails/${v.id}`)}
            >
              {/* =========================
            COLUMN 1
        ========================= */}

              <div className="c-report-column c-report-column-1">
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

                <span className={`c-report-status ${v.status?.toLowerCase()}`}>
                  {v.status}
                </span>
              </div>

              {/* =========================
            COLUMN 2
        ========================= */}

              <div className="c-report-column c-report-column-2">
                {/* MOBILE */}

                <div className="c-report-meta-row">
                  <span className="c-report-meta-label">Mobile:</span>

                  <span className="c-report-meta-value">
                    {v.phone ? `${v.countryCode || ""} ${v.phone}` : " N/A"}
                  </span>
                </div>

                {/* LOCATION */}

                <div className="c-report-meta-row">
                  <span className="c-report-meta-label">Location:</span>

                  <span className="c-report-meta-value">
                    {v.location?.trim() ? v.location : " N/A"}
                  </span>
                </div>

                {/* ROLE */}

                <div className="c-report-meta-row">
                  <span className="c-report-meta-label">Role:</span>

                  <span className="c-report-meta-value">
                    {v.role?.trim() ? v.role : " N/A"}
                  </span>
                </div>
              </div>

              {/* =========================
            COLUMN 3
        ========================= */}

              <div className="c-report-column c-report-column-3">
                <span className="c-report-remarks-title">Remarks</span>

                <p className="c-report-remarks-text">{v.remarks || "N/A"}</p>
              </div>
              <div className="c-report-column c-report-badge">
                {v.reportAvailable && (
                  <span className="c-report-ready">✔ Report Ready</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
