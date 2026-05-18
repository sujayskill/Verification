import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/EditClient.css";

export default function EditOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();


  const [form, setForm] = useState({});

  useEffect(() => {
    api.get(`/clients/${id}`).then(setForm);
  }, [id]);

  const update = async () => {
    await api.put(`/clients/update/${id}`, form);
    navigate("/platform/organizations");
  };

  return (
    <div className="edit-clients-page">
      {/* STICKY HEADER */}
      <div className="edit-client-header">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2>Edit Client</h2>

          <p>Update organization information</p>
        </div>

        <button className="primary-btn" onClick={update}>
          Save Changes
        </button>
      </div>

      {/* BODY */}
      <div className="edit-client-body">
        <div className="glass-form-card">
          {/* SECTION HEADER */}
          <div className="section-title">
            <h3>Organization Details</h3>

            <p>Edit and manage client organization information</p>
          </div>

          {/* FORM GRID */}
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>

              <input
                value={form.companyName || ""}
                placeholder="Enter company name"
                onChange={(e) =>
                  setForm({
                    ...form,
                    companyName: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Company Slug</label>

              <input
                value={form.companySlug || ""}
                placeholder="Enter company slug"
                onChange={(e) =>
                  setForm({
                    ...form,
                    companySlug: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Company Type</label>

              <input
                value={form.companyType || ""}
                placeholder="Enter company type"
                onChange={(e) =>
                  setForm({
                    ...form,
                    companyType: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                value={form.contactEmail || ""}
                placeholder="Enter email"
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactEmail: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                value={form.contactNumber || ""}
                placeholder="Enter phone number"
                onChange={(e) =>
                  setForm({
                    ...form,
                    contactNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                value={form.location || ""}
                placeholder="Enter location"
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Employee Count</label>

              <input
                value={form.employeeCount || ""}
                placeholder="Enter employee count"
                onChange={(e) =>
                  setForm({
                    ...form,
                    employeeCount: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
