import React, { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/PageStyle.css";

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const candidate = await api.get(
        `/org/candidates/getCandidateDetailsById/${id}`,
      );
      setData(candidate);
      const exists = await api.get(`/org/verifications/exists/${id}`);
      setInitiated(exists);
      console.log(data);
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

      setInitiated(true);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container">
      {/* 🔙 BACK */}
      <button onClick={() => navigate("/org/candidates")}>
        ← Back to Candidates
      </button>

      {/* 🚀 ACTION */}
      <div className="action-bar">
        <button
          className={`primary-btn ${initiated ? "disabled" : ""}`}
          onClick={initiateVerification}
          disabled={initiated || loading}
        >
          {loading
            ? "Processing..."
            : initiated
              ? "Verification Initiated"
              : "🚀 Initiate Verification"}
        </button>
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
