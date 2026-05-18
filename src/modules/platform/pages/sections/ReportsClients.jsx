import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate, } from "react-router-dom";
import "../../styles/ReportsClients.css";

export default function ReportsClients() {

  const { orgId } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    api
      .get(
        `/vendor/platform/verifications/reports/by-org?orgId=${orgId}`,
      )
      .then((res) => {

        setData(
          Array.isArray(res) ? res : [],
        );
      });

  }, [orgId]);

  const filtered = data.filter((v) =>
    v.candidateName
      ?.toLowerCase()
      .includes(search.toLowerCase()),
  );

  const highlight = (text) => {

    if (!search || !text) return text;

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
        <div className="reports-header-left">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/platform/reports")
            }
          >
            ← Back
          </button>

          <div>

            <h2>
              {data[0]?.organizationName ||
                "Reports"}
            </h2>

            <p>
              Completed verification reports
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="reports-header-right">

          <input
            placeholder="Search candidate..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>
      </div>

      {/* =========================
         LIST
      ========================= */}

      <div className="reports-list">

        {filtered.length === 0 ? (

          <div className="empty-state">
            No reports found
          </div>

        ) : (

          filtered.map((v) => (

            <div
              key={v.id}
              className="report-row clickable-row"
              onClick={() =>
                navigate(
                  `/platform/reports/client/${v.id}`,
                )
              }
            >

              {/* LEFT */}
              <div className="report-left">

                <div className="candidate-avatar">
                  {v.candidateName?.charAt(0)}
                </div>

                <div className="report-info">

                  <h4
                    dangerouslySetInnerHTML={{
                      __html: highlight(
                        v.candidateName || "",
                      ),
                    }}
                  />

                  <p
                    dangerouslySetInnerHTML={{
                      __html: highlight(
                        v.candidateEmail || "",
                      ),
                    }}
                  />

                  <span
                    className={`status-badge ${v.status?.toLowerCase()}`}
                  >
                    {v.status}
                  </span>

                </div>
              </div>

              {/* RIGHT */}
              <div className="report-right">

                <span className="ready-badge">
                  ✔ Report Ready
                </span>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}