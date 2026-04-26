import React, { useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../styles/AddClient.css";

export default function AddOrganizations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({});

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const save = async () => {
    await api.post("/clients/create", form);
    navigate("/platform/organizations");
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Add Organization</h2>

        <div className="form-grid">
          <input
            placeholder="Company's Slug Name"
            onChange={(e) => handleChange("companySlug", e.target.value)}
          />
          <input
            placeholder="Company Name"
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
          <input
            placeholder="Company Type"
            onChange={(e) => handleChange("companyType", e.target.value)}
          />
          <input
            placeholder="Email"
            onChange={(e) => handleChange("contactEmail", e.target.value)}
          />
          <input
            placeholder="Phone"
            onChange={(e) => handleChange("contactNumber", e.target.value)}
          />
          <input
            placeholder="Location"
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <input
            placeholder="Employee Count"
            onChange={(e) => handleChange("employeeCount", e.target.value)}
          />
        </div>

        <button className="primary-btn" onClick={save}>
          Create
        </button>
      </div>
    </div>
  );
}
