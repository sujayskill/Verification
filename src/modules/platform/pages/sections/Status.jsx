import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/Status.css";

export default function VerificationStatus() {

  const [clients, setClients] = useState({});
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    api.get("/platform/verifications")
      .then((data) => {

        if (!Array.isArray(data)) return;

        const grouped = {};

        data.forEach((v) => {

          if (!grouped[v.orgId]) {

            grouped[v.orgId] = {
              name: v.organizationName,
              count: 0,
            };
          }

          grouped[v.orgId].count++;
        });

        setClients(grouped);
      });

  }, []);

  const filtered = Object.entries(clients).filter(([_, v]) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  const highlight = (text) => {

    if (!search) return text;

    return text.replace(
      new RegExp(`(${search})`, "gi"),
      "<mark>$1</mark>"
    );
  };

  return (

    <div className="status-page">

      {/* =========================
         HEADER
      ========================= */}

      <div className="status-header">
        <div>
          <h2>Client Status</h2>
          <p>
            Track verification status across all organizations
          </p>
        </div>
        <div className="status-header-right">
          <input
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* =========================
         GRID
      ========================= */}

      <div className="status-grid">

        {filtered.length === 0 && (
          <p className="empty-text">
            No clients found
          </p>
        )}

        {filtered.map(([orgId, v]) => (

          <div
            key={orgId}
            className="status-card clickable-row"
            onClick={() =>
              navigate(`/platform/status/${orgId}`)
            }
          >

            <div className="status-card-content">

              <h3
                dangerouslySetInnerHTML={{
                  __html: highlight(v.name),
                }}
              />

              <div className="status-meta">

                <span className="candidate-count">
                  {v.count} Candidates
                </span>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}