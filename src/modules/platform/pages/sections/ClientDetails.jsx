import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRole } from "../../../../utils/UiHideHelper";
import "../../styles/ClientDetails.css";

export default function OrganizationDetails() {
  const role = getUserRole();
  const { id, orgId } = useParams();
  const navigate = useNavigate();
  console.log(orgId);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/clients/by-org/${orgId}`).then(setData);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="client-details-page">
      {/* HEADER */}
      <div className="client-details-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div>
            <h1>{data.companyName}</h1>
            <p>Client Details</p>
          </div>
        </div>

        {role !== "ROLE_VENDOR" && (
          <button
            className="primary-btn"
            onClick={() =>
              navigate(`/platform/clients/edit/${data.id}/${orgId}`)
            }
          >
            ✏ Edit Client
          </button>
        )}
      </div>

      {/* HERO CARD */}
      <div className="client-hero-card">
        <div className="hero-avatar">
          {data.companyName?.charAt(0)}
        </div>

        <div className="hero-content">
          <h2>{data.companyName}</h2>

          <p>{data.contactEmail}</p>

          <span className="company-badge">
            {data.companyType || "Organization"}
          </span>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="details-grid">
        {/* COMPANY INFO */}
        <div className="glass-card">
          <h3>Company Information</h3>

          <div className="info-group">
            <label>Organization ID</label>
            <p>{data.orgId}</p>
          </div>

          <div className="info-group">
            <label>Company Slug</label>
            <p>{data.companySlug}</p>
          </div>

          <div className="info-group">
            <label>Company Type</label>
            <p>{data.companyType}</p>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="glass-card">
          <h3>Contact Information</h3>

          <div className="info-group">
            <label>Email</label>
            <p>{data.contactEmail}</p>
          </div>

          <div className="info-group">
            <label>Phone</label>
            <p>{data.contactNumber}</p>
          </div>

          <div className="info-group">
            <label>Location</label>
            <p>{data.location}</p>
          </div>
        </div>

        {/* EMPLOYEE INFO */}
        <div className="glass-card">
          <h3>Organization Stats</h3>

          <div className="stats-box">
            <span>Total Employees</span>

            <h2>{data.employeeCount || 0}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
