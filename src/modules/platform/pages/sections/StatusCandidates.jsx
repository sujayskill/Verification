import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate, } from "react-router-dom";

import "../../styles/StatusCandidates.css";

export default function StatusCandidates() {

  const { orgId } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    api
      .get(
        `/vendor/platform/verifications/by-org?orgId=${orgId}&q=${search}`,
      )
      .then((res) =>
        setData(
          Array.isArray(res)
            ? res
            : [],
        ),
      );

  }, [orgId, search]);

  const highlight = (text) => {

    if (!search || !text)
      return text;

    return text.replace(
      new RegExp(
        `(${search})`,
        "gi",
      ),
      "<mark>$1</mark>",
    );
  };

  return (
    <div className="status-page">

      {/* =========================
          STICKY HEADER
      ========================= */}

      <div className="status-header">

        {/* LEFT */}
        <div className="status-header-left">

          <button
            className="back-btn"
            onClick={() =>
              navigate(
                "/platform/status",
              )
            }
          >
            ← Back
          </button>

          <div>

            <h2>
              {data[0]
                ?.organizationName ||
                "Candidates"}
            </h2>

            <p>
              Verification
              candidates list
            </p>

          </div>
        </div>

        {/* RIGHT */}
        <div className="status-header-right">

          <input
            placeholder="Search candidate / email..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
          />

        </div>
      </div>

      {/* =========================
          LIST
      ========================= */}

      <div className="status-list">

        {data.length === 0 && (
          <div className="empty-state">
            No candidates found
          </div>
        )}

        {data.map((v) => (

          <div
            key={v.id}
            className="status-row clickable-row"
            onClick={() =>
              navigate(
                `/platform/status/candidate/${v.id}`,
              )
            }
          >

            {/* LEFT */}
            <div className="candidate-info">

              <h4
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(
                      v.candidateName,
                    ),
                }}
              />

              <p
                dangerouslySetInnerHTML={{
                  __html:
                    highlight(
                      v.candidateEmail,
                    ),
                }}
              />

            </div>

            {/* RIGHT */}
            <div className="candidate-meta">

              <span
                className={`status-badge ${v.status.toLowerCase()}`}
              >
                {v.status}
              </span>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}