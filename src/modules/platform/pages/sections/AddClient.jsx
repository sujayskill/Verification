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
    <div className="add-client-page">
      {/* STICKY HEADER */}
      <div className="add-client-header">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2>Add Organization</h2>

          <p>Create a new client organization</p>
        </div>

        <button className="primary-btn" onClick={save}>
          Create Organization
        </button>
      </div>

      {/* BODY */}
      <div className="add-client-body">
        <div className="glass-form-card">
          <div className="section-title">
            <h3>Organization Information</h3>
            <p>Enter all required company details</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Company Slug</label>

              <input
                placeholder="Enter company slug"
                onChange={(e) =>
                  handleChange("companySlug", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Company Name</label>

              <input
                placeholder="Enter company name"
                onChange={(e) =>
                  handleChange("companyName", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Company Type</label>

              <input
                placeholder="Enter company type"
                onChange={(e) =>
                  handleChange("companyType", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                placeholder="Enter email address"
                onChange={(e) =>
                  handleChange("contactEmail", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                placeholder="Enter phone number"
                onChange={(e) =>
                  handleChange("contactNumber", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                placeholder="Enter company location"
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Employee Count</label>

              <input
                placeholder="Enter employee count"
                onChange={(e) =>
                  handleChange("employeeCount", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
