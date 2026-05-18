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
    <div className="edit-client-page">
      {/* STICKY HEADER */}
      <div className="edit-client-header">
        {/* LEFT */}
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2>Edit Client</h2>

          <p>Update organization information</p>
        </div>

        {/* RIGHT */}
        <button className="primary-btn" onClick={update}>
          💾 Save Changes
        </button>
      </div>

      {/* BODY */}
      <div className="edit-client-body">
        <div className="glass-form-card">
          {/* SECTION TITLE */}
          <div className="section-title">
            <h3>Organization Details</h3>

            <p>Edit and manage client information</p>
          </div>

          {/* FORM */}
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>

              <input
                placeholder="Enter company name"
                value={form.companyName}
                onChange={(e) =>
                  handleChange("companyName", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Company Slug</label>

              <input
                placeholder="Enter company slug"
                value={form.companySlug}
                onChange={(e) =>
                  handleChange("companySlug", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Company Type</label>

              <input
                placeholder="Enter company type"
                value={form.companyType}
                onChange={(e) =>
                  handleChange("companyType", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                placeholder="Enter email address"
                value={form.contactEmail}
                onChange={(e) =>
                  handleChange("contactEmail", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                placeholder="Enter phone number"
                value={form.contactNumber}
                onChange={(e) =>
                  handleChange("contactNumber", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                placeholder="Enter company location"
                value={form.location}
                onChange={(e) =>
                  handleChange("location", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Employee Count</label>

              <input
                placeholder="Enter employee count"
                value={form.employeeCount}
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
