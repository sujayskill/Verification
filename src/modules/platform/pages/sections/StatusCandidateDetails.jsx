import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/StatusCandidateDetails.css";

export default function StatusCandidate() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [v, setV] = useState(null);

  useEffect(() => {
    api.get(`/platform/verifications/${id}`).then((res) => {
      setV(res.verification);
    });
  }, [id]);

  if (!v) {
    return (
      <div className="status-loading">
        Loading...
      </div>
    );
  }

  const steps = [
    "INITIATED",
    "IN_PROGRESS",
    "ROLLBACK_REQUESTED",
    "ROLLED_BACK",
    "COMPLETED",
  ];

  const currentIndex =
    steps.indexOf(v.status);

  return (
    <div className="status-page">

      {/* =========================
         STICKY HEADER
      ========================= */}

      <div className="status-header">

        <div className="status-header-left">

          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div>
            <h2>{v.candidateName}</h2>

            <p>
              Verification Status Tracking
            </p>
          </div>
        </div>

        <div className="status-header-right">

          <div
            className={`status-pill ${v.status.toLowerCase()}`}
          >
            {v.status.replaceAll("_", " ")}
          </div>

        </div>
      </div>

      {/* =========================
         CONTENT
      ========================= */}

      <div className="status-content">

        {/* OVERVIEW */}

        <div className="glass-card overview-card">

          <div className="overview-grid">

            <div className="overview-item">
              <label>Candidate</label>
              <p>{v.candidateName}</p>
            </div>

            <div className="overview-item">
              <label>Organization</label>
              <p>{v.organizationName}</p>
            </div>

            <div className="overview-item">
              <label>Status</label>
              <p>{v.status}</p>
            </div>

            <div className="overview-item">
              <label>SLA Deadline</label>
              <p>
                {v.slaDeadline || "-"}
              </p>
            </div>

          </div>

        </div>

        {/* PIPELINE */}

        <div className="glass-card">

          <div className="section-header">
            <h3>
              Verification Progress
            </h3>

            <span>
              Step {currentIndex + 1} of{" "}
              {steps.length}
            </span>
          </div>

          <div className="pipeline-wrapper">

            {steps.map((step, i) => {

              const isCompleted =
                currentIndex >= i;

              const isCurrent =
                currentIndex === i;

              return (
                <div
                  key={step}
                  className="pipeline-step-wrapper"
                >

                  {/* STEP */}

                  <div
                    className={`pipeline-step 
                    ${isCompleted ? "completed" : ""}
                    ${isCurrent ? "current" : ""}`}
                  >

                    <div className="step-circle">
                      {isCompleted ? "✓" : i + 1}
                    </div>

                    <div className="step-content">

                      <h4>
                        {step.replaceAll(
                          "_",
                          " ",
                        )}
                      </h4>

                      <p>
                        {isCompleted
                          ? "Completed"
                          : "Pending"}
                      </p>

                    </div>

                  </div>

                  {/* CONNECTOR */}

                  {i !==
                    steps.length - 1 && (
                      <div
                        className={`pipeline-line 
                      ${currentIndex > i ? "active" : ""}`}
                      />
                    )}

                </div>
              );
            })}
          </div>
        </div>

        {/* TIMELINE CARD */}

        <div className="glass-card">

          <div className="section-header">
            <h3>Status Insights</h3>
          </div>

          <div className="insights-grid">

            <div className="insight-card">
              <span>
                Current Stage
              </span>

              <h4>
                {v.status.replaceAll(
                  "_",
                  " ",
                )}
              </h4>
            </div>

            <div className="insight-card">
              <span>
                Verification Type
              </span>

              <h4>
                Background Verification
              </h4>
            </div>

            <div className="insight-card">
              <span>
                Process Health
              </span>

              <h4 className="healthy">
                On Track
              </h4>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}