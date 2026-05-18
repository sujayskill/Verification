import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/CandidateDetails.css";

export default function CandidateDetails() {
  const { id, deptId } = useParams();
  const navigate = useNavigate();
  const base = getBasePath();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const candidate = await api.get(
        `/org/candidates/getCandidateDetailsById/${id}`,
      );
      setData(candidate);
      console.log(candidate);
      try {
        const verificationData = await api.get(
          `/org/verifications/by-candidate/${id}`,
        );

        setVerification(verificationData);
      } catch (err) {
        // 🔥 IMPORTANT: no verification exists
        setVerification(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 🔥 INITIATE BGV
  const initiateVerification = async () => {
    try {
      setLoading(true);

      await api.post(`/org/verifications/${id}`);
      alert("Verification request sent ✅");

      fetchData(); // 🔥 IMPORTANT
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  // Rollback request to vendor
  const requestRollback = async () => {
    if (!verification?.id) {
      alert("Verification not available");
      return;
    }

    if (!window.confirm("Request rollback for this verification?")) return;

    try {
      await api.put(`/org/verifications/${verification.id}/request-rollback`);
      alert("Rollback request sent");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to request rollback");
    }
  };

  const status = verification?.status;
  const isCompleted = status === "COMPLETED";
  const isInitiated =
    verification &&
    ["INITIATED", "IN_PROGRESS", "ROLLBACK_REQUESTED"].includes(
      verification.status,
    );

  if (!data) return <p>Loading...</p>;

  return (
    <div className="candidate-details-page">
      {/* TOP BAR */}
      <div className="candidate-topbar">
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() =>
              navigate(`/${base}/candidates/${data.department.id}`)
            }
          >
            ← Back
          </button>
          <h1>Candidates</h1>
        </div>

        <div className="top-section">
          <div className="top-left">
            {isCompleted && <h2 className="verified-title">✅ VERIFIED</h2>}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="glass-card hero-card">
        <div className="hero-left">
          <div className="avatar">
            {data.firstName?.charAt(0)}
            {data.lastName?.charAt(0)}
          </div>

          <div>
            <h1>
              {data.firstName} {data.lastName}
            </h1>

            <p>{data.email}</p>

            <span className={`status-pill ${data.status?.toLowerCase()}`}>
              {data.status}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="hero-actions">
          <button
            className={`primary-btn ${
              isCompleted || isInitiated ? "disabled" : ""
            }`}
            onClick={initiateVerification}
            disabled={isCompleted || isInitiated || loading}
          >
            {loading
              ? "Processing..."
              : isCompleted
                ? "✅ Verification Completed"
                : isInitiated
                  ? "Verification Initiated"
                  : "🚀 Initiate Verification"}
          </button>

          {verification?.status === "ROLLBACK_REQUESTED" && (
            <p className="info-text">⏳ Rollback requested</p>
          )}

          {verification &&
            verification.status !== "COMPLETED" &&
            verification.status !== "ROLLBACK_REQUESTED" && (
              <button className="warning-btn" onClick={requestRollback}>
                🔁 Request Rollback
              </button>
            )}
        </div>
      </div>

      {/* GRID */}
      <div className="details-grid">
        {/* BASIC INFO */}
        <div className="glass-card">
          <h3>Basic Information</h3>

          <div className="info-grid">
            <div>
              <label>Email</label>
              <p>{data.email}</p>
            </div>

            <div>
              <label>Phone</label>
              <p>
                {data.countryCode} {data.phone}
              </p>
            </div>

            <div>
              <label>Status</label>
              <p>{data.status}</p>
            </div>
          </div>
        </div>

        {/* CURRENT ADDRESS */}
        <div className="glass-card">
          <h3>Current Address</h3>

          <div className="address-block">
            <p>{data.currentAddress?.street || "-"}</p>

            <p>
              {data.currentAddress?.city || "-"},{" "}
              {data.currentAddress?.state || "-"}
            </p>

            <p>{data.currentAddress?.zipCode || "-"}</p>
          </div>
        </div>

        {/* PERMANENT ADDRESS */}
        <div className="glass-card">
          <h3>Permanent Address</h3>

          <div className="address-block">
            <p>{data.permanentAddress?.street || "-"}</p>

            <p>
              {data.permanentAddress?.city || "-"},{" "}
              {data.permanentAddress?.state || "-"}
            </p>

            <p>{data.permanentAddress?.zipCode || "-"}</p>
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <div className="glass-card section-card">
        <h3>Education</h3>

        <div className="timeline-list">
          {!data.educations || data.educations.length === 0 ? (
            <p>No education details available</p>
          ) : (
            data.educations.map((edu, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" />

                <div className="timeline-content">
                  <h4>{edu.degree || "-"}</h4>

                  <p>{edu.institution || "-"}</p>

                  <span>{edu.graduationYear || "-"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="glass-card section-card">
        <h3>Experience</h3>

        <div className="timeline-list">
          {!data.experiences || data.experiences.length === 0 ? (
            <p>No experience details available</p>
          ) : (
            data.experiences.map((exp, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" />

                <div className="timeline-content">
                  <h4>{exp.companyName || "-"}</h4>

                  <p>{exp.role || "-"}</p>

                  <span>
                    {exp.startDate || "-"} → {exp.endDate || "-"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
