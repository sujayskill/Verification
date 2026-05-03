import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRole } from "../../../../utils/UiHideHelper";
import "../../styles/Clients.css";

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
    <div className="container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <div className="card">
        <h2>{data.companyName}</h2>

        <p>
          <b>Org ID:</b> {data.orgId}
        </p>
        <p>
          <b>Company Slug:</b> {data.companySlug}
        </p>
        <p>
          <b>Type:</b> {data.companyType}
        </p>
        <p>
          <b>Email:</b> {data.contactEmail}
        </p>
        <p>
          <b>Phone:</b> {data.contactNumber}
        </p>
        <p>
          <b>Location:</b> {data.location}
        </p>
        <p>
          <b>Employees:</b> {data.employeeCount}
        </p>

        {role !== "ROLE_VENDOR" && (
          <button
            className="primary-btn"
            onClick={() => navigate(`/platform/clients/edit/${data.id}/${orgId}`)}
          >
            ✏️ Edit Client
          </button>
        )}
      </div>
    </div>
  );
}
