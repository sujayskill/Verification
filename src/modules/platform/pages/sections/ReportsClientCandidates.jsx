import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import "../../styles/Reports.css";

export default function CandidateReport() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {

    api
      .get(`/platform/verifications/${id}`)
      .then(setData);

  }, [id]);

  if (!data) {
    return (
      <div className="reports-loading">
        Loading...
      </div>
    );
  }

  const v = data.verification;

  const steps = [
    "INITIATED",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  const getStepIndex = (status) => {
    return steps.indexOf(status);
  };

  const activeIndex = getStepIndex(v.status);

  return (

    <div className="reports-page">

      {/* =========================
         STICKY HEADER
      ========================= */}

      <div className="reports-header">

        <div className="reports-header-left">

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div>

            <h2>{v.candidateName}</h2>

            <p>
              {v.organizationName}
            </p>

          </div>
        </div>

        <div className="reports-header-right">

          <span
            className={`report-status ${v.status.toLowerCase()}`}
          >
            {v.status}
          </span>

          {v.status === "COMPLETED" && (
            <a
              className="download-btn"
              href={`http://localhost:8081/org/verifications/download/${v.id}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Download Report
            </a>
          )}

          <button
            className="primary-btn"
            onClick={() =>
              navigate(
                `/platform/reports/reportDetails/${v.id}`,
              )
            }
          >
            View Report
          </button>

        </div>
      </div>

      {/* =========================
         CONTENT
      ========================= */}

      <div className="reports-content">

        {/* =========================
           OVERVIEW CARD
        ========================= */}

        <div className="glass-card">

          <div className="section-header">
            <h3>Verification Overview</h3>
          </div>

          <div className="info-grid">

            <div>
              <label>Candidate Name</label>
              <p>{v.candidateName}</p>
            </div>

            <div>
              <label>Organization</label>
              <p>{v.organizationName}</p>
            </div>

            <div>
              <label>Current Status</label>
              <p>{v.status}</p>
            </div>

            <div>
              <label>Created Date</label>
              <p>{v.createdAt}</p>
            </div>

            <div>
              <label>SLA Deadline</label>
              <p>{v.slaDeadline}</p>
            </div>

          </div>

        </div>

        {/* =========================
           PIPELINE
        ========================= */}

        <div className="glass-card">

          <div className="section-header">
            <h3>Verification Progress</h3>
          </div>

          <div className="pipeline-container">

            {steps.map((step, index) => (

              <div
                key={step}
                className="pipeline-wrapper"
              >

                <div
                  className={`
                    pipeline-step
                    ${index <= activeIndex
                      ? "active"
                      : ""
                    }
                  `}
                >

                  <div className="pipeline-circle">
                    {index + 1}
                  </div>

                  <span>
                    {step.replaceAll("_", " ")}
                  </span>

                </div>

                {index !==
                  steps.length - 1 && (
                    <div
                      className={`
                      pipeline-line
                      ${index < activeIndex
                          ? "active"
                          : ""
                        }
                    `}
                    />
                  )}

              </div>
            ))}

          </div>

        </div>

        {/* =========================
           REPORT ACTIONS
        ========================= */}

        <div className="glass-card">

          <div className="section-header">
            <h3>Report Actions</h3>
          </div>

          <div className="report-actions-grid">

            <div className="action-card">
              <h4>
                Candidate Verification
              </h4>

              <p>
                View detailed verification
                report including
                education, experience,
                and address checks.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate(
                    `/platform/reports/reportDetails/${v.id}`,
                  )
                }
              >
                Open Report
              </button>
            </div>

            {v.status === "COMPLETED" && (
              <div className="action-card">

                <h4>
                  Export Verification
                </h4>

                <p>
                  Download the final
                  verification report in
                  PDF format for sharing
                  and auditing purposes.
                </p>

                <a
                  className="download-btn"
                  href={`http://localhost:8081/org/verifications/download/${v.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download PDF
                </a>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}