import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/CandidateDetails.css";

export default function VendorCandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/vendor/client/candidates/${id}`)
      .then((res) => {
        // 🔥 Normalize all fields
        setData({
          ...res,
          currentAddress: res.currentAddress || {},
          permanentAddress: res.permanentAddress || {},
          educations: res.educations || [],
          experiences: res.experiences || [],
          documents: res.documents || [],
        });
      })
      .catch(console.error);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const safe = (val) => val || "-";

  return (
    <div className="Candidate-details-page">
      {/* =========================
       STICKY HEADER
    ========================= */}
      <div className="candidate-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div>
            <h2>
              {safe(data.firstName)} {safe(data.lastName)}
            </h2>

            <p>Candidate Details</p>
          </div>
        </div>

        <div className="header-right">
          <span className={`status-badge ${safe(data.status).toLowerCase()}`}>
            {safe(data.status)}
          </span>
        </div>
      </div>

      {/* =========================
       BODY
    ========================= */}
      <div className="candidate-body">
        {/* HERO CARD */}
        <div className="glass-card hero-card">
          <div className="avatar">
            {safe(data.firstName)?.charAt(0)}
            {safe(data.lastName)?.charAt(0)}
          </div>

          <div className="hero-info">
            <h1>
              {safe(data.firstName)} {safe(data.lastName)}
            </h1>

            <p>{safe(data.email)}</p>

            <span>{safe(data.phone)}</span>
          </div>
        </div>

        {/* GRID */}
        <div className="details-grid">
          {/* BASIC INFO */}
          <div className="glass-card">
            <h3>Basic Details</h3>

            <div className="info-grid">
              <div>
                <label>Email</label>
                <p>{safe(data.email)}</p>
              </div>

              <div>
                <label>Phone</label>
                <p>{safe(data.phone)}</p>
              </div>

              <div>
                <label>DOB</label>
                <p>{safe(data.dob)}</p>
              </div>

              <div>
                <label>Status</label>
                <p>{safe(data.status)}</p>
              </div>

              <div>
                <label>Created At</label>
                <p>{safe(data.createdAt)}</p>
              </div>

              <div>
                <label>Department ID</label>
                <p>{data.department?.id || "-"}</p>
              </div>
            </div>
          </div>

          {/* CURRENT ADDRESS */}
          <div className="glass-card">
            <h3>Current Address</h3>

            <div className="address-block">
              <p>{safe(data.currentAddress.street)}</p>

              <p>
                {safe(data.currentAddress.city)},{" "}
                {safe(data.currentAddress.state)}
              </p>

              <span>{safe(data.currentAddress.zipCode)}</span>
            </div>
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="glass-card">
            <h3>Permanent Address</h3>

            <div className="address-block">
              <p>{safe(data.permanentAddress.street)}</p>

              <p>
                {safe(data.permanentAddress.city)},{" "}
                {safe(data.permanentAddress.state)}
              </p>

              <span>{safe(data.permanentAddress.zipCode)}</span>
            </div>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="glass-card section-card">
          <h3>Education</h3>

          {data.educations.length === 0 ? (
            <p className="empty-text">No education details available</p>
          ) : (
            <div className="timeline-list">
              {data.educations.map((e, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot"></div>

                  <div className="timeline-content">
                    <h4>{safe(e.degree)}</h4>

                    <p>{safe(e.institution)}</p>

                    <span>
                      {safe(e.courseStartDate)} →{" "}
                      {safe(e.courseEndDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EXPERIENCE */}
        <div className="glass-card section-card">
          <h3>Experience</h3>

          {data.experiences.length === 0 ? (
            <p className="empty-text">No experience details available</p>
          ) : (
            <div className="timeline-list">
              {data.experiences.map((e, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot"></div>

                  <div className="timeline-content">
                    <h4>{safe(e.companyName)}</h4>

                    <p>{safe(e.role)}</p>

                    <span>
                      {safe(e.startDate)} → {safe(e.endDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DOCUMENTS */}
        <div className="glass-card section-card">
          <h3>Documents</h3>

          {data.documents.length === 0 ? (
            <p className="empty-text">No documents available</p>
          ) : (
            <div className="documents-grid">
              {data.documents.map((doc, i) => (
                <div key={i} className="document-card">
                  <h4>{safe(doc.type)}</h4>

                  <a
                    href={safe(doc.url)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Document
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
