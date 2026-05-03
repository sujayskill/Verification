import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/PageStyle.css";

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
    <div className="container">
      {isCompleted && <h2 className="verified-title">✅ VERIFIED</h2>}
      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(`/${base}/candidates/${data.department.id}`)}
      >
        ← Back to Candidates
      </button>

      {/* 🚀 ACTION */}
      <div className="action-bar">
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
          <p className="info-text">
            ⏳ Rollback requested. Waiting for vendor approval
          </p>
        )}

        {verification &&
          verification.status !== "COMPLETED" &&
          verification.status !== "ROLLBACK_REQUESTED" && (
            <button className="warning-btn" onClick={requestRollback}>
              🔁 Request Rollback
            </button>
          )}
      </div>

      {/* 🔹 BASIC INFO */}
      <div className="card">
        <h2>
          {data.firstName} {data.lastName}
        </h2>
        <p>
          <b>Status:</b> {data.status}
        </p>

        <p>
          <b>Email:</b> {data.email}
        </p>
        <p>
          <b>Phone:</b> {data.countryCode} {data.phone}
        </p>
      </div>

      {/* 🔹 CURRENT ADDRESS */}
      <div className="card">
        <h3>Current Address</h3>
        <p>
          {data.currentAddress?.street || "-"},{" "}
          {data.currentAddress?.city || "-"}
        </p>
        <p>{data.currentAddress?.state || "-"}</p>
        <p>{data.currentAddress?.zipCode || "-"}</p>
      </div>

      {/* 🔹 PERMANENT ADDRESS */}
      <div className="card">
        <h3>Permanent Address</h3>
        <p>
          {data.permanentAddress?.street || "-"},{" "}
          {data.permanentAddress?.city || "-"}
        </p>
        <p>{data.permanentAddress?.state || "-"}</p>
        <p>{data.permanentAddress?.zipCode || "-"}</p>
      </div>

      {/* 🔥 EDUCATION (MULTIPLE) */}
      <div className="card">
        <h3>Education</h3>

        {!data.educations || data.educations.length === 0 ? (
          <p>No education details available</p>
        ) : (
          data.educations.map((edu, index) => (
            <div key={index} className="sub-card">
              <h4>Education {index + 1}</h4>
              <p>
                <b>Degree:</b> {edu.degree || "-"}
              </p>
              <p>
                <b>Institution:</b> {edu.institution || "-"}
              </p>
              <p>
                <b>Year:</b> {edu.graduationYear || "-"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 🔥 EXPERIENCE (MULTIPLE) */}
      <div className="card">
        <h3>Experience</h3>

        {!data.experiences || data.experiences.length === 0 ? (
          <p>No experience details available</p>
        ) : (
          data.experiences.map((exp, index) => (
            <div key={index} className="sub-card">
              <h4>Experience {index + 1}</h4>
              <p>
                <b>Company:</b> {exp.companyName || "-"}
              </p>
              <p>
                <b>Role:</b> {exp.role || "-"}
              </p>
              <p>
                <b>Duration:</b> {exp.startDate || "-"} → {exp.endDate || "-"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
