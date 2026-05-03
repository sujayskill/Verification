import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";

export default function Reports() {
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/platform/verifications/reports/clients").then((data) => {
      if (!Array.isArray(data)) return;

      const groupedData = {};

      data.forEach((v) => {
        if (!groupedData[v.orgId]) {
          groupedData[v.orgId] = {
            name: v.organizationName,
            list: [],
          };
        }

        groupedData[v.orgId].list.push(v);
      });

      setGrouped(groupedData);
    });
  }, []);

  const filtered = Object.entries(grouped).filter(([orgId, value]) =>
    value.name.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="reports-page">
      {/* HEADER */}
      <div className="reports-header">
        <div>
          <h2>Clients Reports</h2>
          <p>View completed verification reports by client</p>
        </div>

        <input
          className="search-input"
          placeholder="Search client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="reports-grid">
        {filtered.length === 0 && <p className="empty">No clients found</p>}

        {filtered.map(([orgId, value]) => (
          <div
            key={orgId}
            className="report-card"
            onClick={() => navigate(`/platform/reports/${orgId}/departments`)}
          >
            <div className="report-card-top">
              <h3
                dangerouslySetInnerHTML={{
                  __html: highlight(value.name),
                }}
              />
            </div>

            <div className="report-card-bottom">
              <span className="count">{value.list.length} Candidates</span>

              <span className="view">View →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
