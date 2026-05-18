import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";

import "../../styles/Reports.css";

export default function Reports() {

  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    api.get("/platform/verifications/reports/clients")
      .then((data) => {

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

  const filtered = Object.entries(grouped)
    .filter(([_, value]) =>
      value.name
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const highlight = (text) => {

    if (!search) return text;

    return text.replace(
      new RegExp(`(${search})`, "gi"),
      "<mark>$1</mark>",
    );
  };

  return (

    <div className="reports-page">

      {/* =========================
         HEADER
      ========================= */}

      <div className="reports-header">

        {/* LEFT */}
        <div>

          <h2>Client Reports</h2>

          <p>
            View completed verification reports across organizations
          </p>

        </div>

        {/* RIGHT */}
        <div className="reports-actions">

          <input
            className="reports-search"
            placeholder="Search client..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* =========================
         GRID
      ========================= */}

      <div className="reports-grid">

        {filtered.length === 0 && (
          <div className="empty-state">
            No clients found
          </div>
        )}

        {filtered.map(([orgId, value]) => (

          <div
            key={orgId}
            className="report-card clickable-row"
            onClick={() =>
              navigate(`/platform/reports/${orgId}`)
            }
          >

            {/* TOP */}
            <div className="report-card-top">

              <div className="report-avatar">
                {value.name?.charAt(0)}
              </div>

              <div className="report-info">

                <h3
                  dangerouslySetInnerHTML={{
                    __html: highlight(value.name),
                  }}
                />

                <p>
                  Verification Reports
                </p>

              </div>

            </div>

            {/* BOTTOM */}
            <div className="report-card-bottom">

              <div className="report-stat">

                <span className="stat-label">
                  Candidates
                </span>

                <span className="stat-value">
                  {value.list.length}
                </span>

              </div>

              <div className="view-report">
                View Reports →
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}