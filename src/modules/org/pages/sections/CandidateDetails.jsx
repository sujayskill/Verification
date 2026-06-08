import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import {
  ArrowLeft,
  Bell,
  Mail,
  Phone,
  CalendarDays,
  User,
  Briefcase,
  MapPin,
  GraduationCap,
  Building2,
  ShieldCheck,
  Clock3,
  RotateCcw,
  FileText,
} from "lucide-react";
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
    <div className="candetailsx-page">
      {/* TOP HEADER */}
      <div className="candetailsx-topbar">
        {/* LEFT */}
        <div className="candetailsx-top-left">
          <button
            className="candetailsx-back-btn"
            onClick={() =>
              navigate(`/${base}/candidates/${data.department.id}`)
            }
          >
            <ArrowLeft size={18} />
            Back to Candidates
          </button>
        </div>

        {/* RIGHT */}
        <div className="candetailsx-top-right">
          {/* SEARCH */}
          <div className="candetailsx-search-box">
            <input placeholder="Search anything..." />
          </div>

          {/* NOTIFICATION */}
          <div className="candetailsx-notification">
            <Bell size={20} />

            <span>3</span>
          </div>

          {/* ACTION BUTTON */}
          <button
            className={`candetailsx-primary-btn ${
              isCompleted || isInitiated ? "disabled" : ""
            }`}
            onClick={initiateVerification}
            disabled={isCompleted || isInitiated || loading}
          >
            {loading
              ? "Processing..."
              : isCompleted
                ? "Verification Completed"
                : isInitiated
                  ? "Verification Initiated"
                  : "+ New Verification"}
          </button>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="candetailsx-hero-card">
        {/* LEFT */}
        <div className="candetailsx-hero-left">
          <div className="candetailsx-avatar">
            {data.firstName?.charAt(0)}
            {data.lastName?.charAt(0)}
          </div>

          <div className="candetailsx-hero-info">
            <div className="candetailsx-name-row">
              <h1>
                {data.firstName} {data.lastName}
              </h1>

              <span
                className={`candetailsx-status ${data.status?.toLowerCase()}`}
              >
                {data.status}
              </span>
            </div>

            <p className="candetailsx-candidate-id">
              Candidate ID: CND-{data.id}
            </p>

            <div className="candetailsx-contact-row">
              <div>
                <Mail size={16} />
                {data.email}
              </div>

              <div>
                <Phone size={16} />
                {data.countryCode} {data.phone}
              </div>

              <div>
                <CalendarDays size={16} />
                Applied Recently
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="candetailsx-hero-actions">
          {verification &&
            verification.status !== "COMPLETED" &&
            verification.status !== "ROLLBACK_REQUESTED" && (
              <button
                className="candetailsx-warning-btn"
                onClick={requestRollback}
              >
                <RotateCcw size={16} />
                Request Rollback
              </button>
            )}
        </div>
      </div>

      {/* PERSONAL INFO */}
      <div className="candetailsx-section-card">
        <div className="candetailsx-section-header">
          <div className="candetailsx-section-title">
            <User size={18} />

            <h3>Personal Information</h3>
          </div>
        </div>

        <div className="candetailsx-info-grid">
          <div>
            <label>Full Name</label>

            <p>
              {data.firstName} {data.lastName}
            </p>
          </div>

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
            <label>Department</label>

            <p>{data.department?.name}</p>
          </div>

          <div>
            <label>Current Address</label>

            <p>
              {data.currentAddress?.street || "-"},{" "}
              {data.currentAddress?.city || "-"}
            </p>
          </div>

          <div>
            <label>Permanent Address</label>

            <p>
              {data.permanentAddress?.street || "-"},{" "}
              {data.permanentAddress?.city || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* APPLICATION INFO */}
      <div className="candetailsx-section-card">
        <div className="candetailsx-section-header">
          <div className="candetailsx-section-title">
            <Briefcase size={18} />

            <h3>Application Information</h3>
          </div>
        </div>

        <div className="candetailsx-info-grid">
          <div>
            <label>Role</label>

            <p>{data.role || "-"}</p>
          </div>

          <div>
            <label>Status</label>

            <p>{data.status}</p>
          </div>

          <div>
            <label>Department</label>

            <p>{data.department?.name}</p>
          </div>

          <div>
            <label>Verification</label>

            <p>{verification?.status || "Not Initiated"}</p>
          </div>
        </div>
      </div>

      {/* EDUCATION */}
      <div className="candetailsx-section-card">
        <div className="candetailsx-section-header">
          <div className="candetailsx-section-title">
            <GraduationCap size={18} />

            <h3>Education</h3>
          </div>
        </div>

        <div className="candetailsx-timeline-list">
          {!data.educations || data.educations.length === 0 ? (
            <p>No education details available</p>
          ) : (
            data.educations.map((edu, index) => (
              <div key={index} className="candetailsx-timeline-item">
                <div className="candetailsx-timeline-dot" />

                <div className="candetailsx-timeline-content">
                  <h4>{edu.degree || "-"}</h4>

                  <p>{edu.institution || "-"}</p>

                  <span>Graduation: {edu.graduationYear || "-"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="candetailsx-section-card">
        <div className="candetailsx-section-header">
          <div className="candetailsx-section-title">
            <Building2 size={18} />

            <h3>Experience</h3>
          </div>
        </div>

        <div className="candetailsx-timeline-list">
          {!data.experiences || data.experiences.length === 0 ? (
            <p>No experience details available</p>
          ) : (
            data.experiences.map((exp, index) => (
              <div key={index} className="candetailsx-timeline-item">
                <div className="candetailsx-timeline-dot" />

                <div className="candetailsx-timeline-content">
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

      {/* VERIFICATION SUMMARY */}
      <div className="candetailsx-summary-grid">
        <div className="candetailsx-summary-card">
          <div>
            <h5>Total Verifications</h5>

            <h2>{verification ? 1 : 0}</h2>
          </div>

          <ShieldCheck size={26} />
        </div>

        <div className="candetailsx-summary-card">
          <div>
            <h5>Completed</h5>

            <h2>{verification?.status === "COMPLETED" ? 1 : 0}</h2>
          </div>

          <ShieldCheck size={26} />
        </div>

        <div className="candetailsx-summary-card">
          <div>
            <h5>In Progress</h5>

            <h2>
              {verification?.status === "IN_PROGRESS" ||
              verification?.status === "INITIATED"
                ? 1
                : 0}
            </h2>
          </div>

          <Clock3 size={26} />
        </div>
      </div>
    </div>
  );
}
