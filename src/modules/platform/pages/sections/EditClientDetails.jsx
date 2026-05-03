import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/EditClientDetails.css";

export default function EditClientDetails() {
  const { id, orgId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/clients/by-org/${orgId}`);

        setForm({
          companyName: res.companyName || "",
          companySlug: res.companySlug || "",
          companyType: res.companyType || "",
          contactEmail: res.contactEmail || "",
          contactNumber: res.contactNumber || "",
          location: res.location || "",
          employeeCount: res.employeeCount || "",
          orgId: res.orgId,
        });

        console.log("Fetched orgId:", res.orgId); // ✅ correct place
      } catch (err) {
        console.error(err);
      }
    };

    if (orgId) fetchData();
  }, [orgId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [form, setForm] = useState({
    companyName: "",
    companySlug: "",
    companyType: "",
    contactEmail: "",
    contactNumber: "",
    location: "",
    employeeCount: "",
    orgId: "", // ✅ FIX
  });

  useEffect(() => {
    console.log("form orgId:", form.orgId);
  }, [form.orgId]);

  const update = async () => {
    try {
      await api.put(`/clients/update/${id}`, form);

      if (!form.orgId) {
        alert("OrgId missing");
        return;
      }

      navigate(`/platform/clientsDetails/${form.orgId}`);
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <div className="card form-card">
        <h2>Edit Client</h2>

        <div className="form-grid">
          <input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />

          <input
            placeholder="Company Slug"
            value={form.companySlug}
            onChange={(e) => handleChange("companySlug", e.target.value)}
          />

          <input
            placeholder="Company Type"
            value={form.companyType}
            onChange={(e) => handleChange("companyType", e.target.value)}
          />

          <input
            placeholder="Email"
            value={form.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
          />

          <input
            placeholder="Phone"
            value={form.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />

          <input
            placeholder="Employee Count"
            value={form.employeeCount}
            onChange={(e) => handleChange("employeeCount", e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={update}>
          💾 Update Client
        </button>
      </div>
    </div>
  );
}
