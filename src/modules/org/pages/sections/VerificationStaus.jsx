import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/VerificationStatus.css";

export default function VerificationStatus() {
  const { id } = useParams();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const base = getBasePath();

  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const res = await api.get(`/org/verifications/by-candidate/${id}`);
      setData(res || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getStep = () => {
    switch (data.status) {
      case "INITIATED":
        return 1;

      case "IN_PROGRESS":
        return 2;

      case "COMPLETED":
        return 3;

      default:
        return 0;
    }
  };

  const currentStep = getStep();

  return (
    <div className="pipeline-page">
      {/* HEADER */}
      <div className="pipeline-header">
        <div className="pipeline-header-left">
          <button
            className="back-btn"
            onClick={() => navigate(`${base}/verifications`)}
          >
            ← Back
          </button>

          <div>
            <h1>Verification Pipeline</h1>
            <p>Track candidate verification progress</p>
          </div>
        </div>

        <div className={`pipeline-status ${data.status?.toLowerCase()}`}>
          {data.status || "NOT_STARTED"}
        </div>
        <button
          className="message-btn"
          onClick={() => setShowMessageBox(!showMessageBox)}
        >
          + Add Message
        </button>
      </div>

      {/* CANDIDATE CARD */}
      <div className="candidate-overview">
        <div className="candidate-avatar">{data.firstName?.charAt(0)}</div>

        <div className="candidate-details">
          <h2>
            {data.firstName} {data.lastName}
          </h2>

          <p>{data.email}</p>

          <span>Candidate ID : #{data.id}</span>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="pipeline-container">
        {/* STEP 1 */}
        <div className={`pipeline-step ${currentStep >= 1 ? "completed" : ""}`}>
          <div className="step-circle">{currentStep >= 1 ? "✓" : "1"}</div>

          <div className="step-content">
            <h3>Verification Initiated</h3>
            <p>Verification request created</p>
          </div>
        </div>

        <div className={`pipeline-line ${currentStep >= 2 ? "filled" : ""}`} />

        {/* STEP 2 */}
        <div className={`pipeline-step ${currentStep >= 2 ? "completed" : ""}`}>
          <div className="step-circle">{currentStep >= 2 ? "✓" : "2"}</div>

          <div className="step-content">
            <h3>Background Verification</h3>
            <p>Vendor processing verification</p>
          </div>
        </div>

        <div className={`pipeline-line ${currentStep >= 3 ? "filled" : ""}`} />

        {/* STEP 3 */}
        <div className={`pipeline-step ${currentStep >= 3 ? "completed" : ""}`}>
          <div className="step-circle">{currentStep >= 3 ? "✓" : "3"}</div>

          <div className="step-content">
            <h3>Verification Completed</h3>
            <p>Final verification report generated</p>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="timeline-card">
        <h3>Verification Timeline</h3>

        <div className="timeline-item">
          <div className="timeline-dot initiated" />

          <div>
            <h4>Candidate Created</h4>
            <p>{data.createdAt || "Recently Added"}</p>
          </div>
        </div>

        {currentStep >= 1 && (
          <div className="timeline-item">
            <div className="timeline-dot progress" />

            <div>
              <h4>Verification Initiated</h4>
              <p>Verification request raised</p>
            </div>
          </div>
        )}

        {currentStep >= 2 && (
          <div className="timeline-item">
            <div className="timeline-dot warning" />

            <div>
              <h4>Verification In Progress</h4>
              <p>Vendor reviewing candidate details</p>
            </div>
          </div>
        )}

        {currentStep >= 3 && (
          <div className="timeline-item">
            <div className="timeline-dot success" />

            <div>
              <h4>Verification Completed</h4>
              <p>Final report generated successfully</p>
            </div>
          </div>
        )}
      </div>
      {showMessageBox && (
        <div className="message-panel">
          <h3>Send Message</h3>

          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={() => {
              console.log(message);

              // future API
              // await api.post(...)

              setMessage("");

              setShowMessageBox(false);
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
