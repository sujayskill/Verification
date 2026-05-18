import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/EditCandidate.css";

export default function VendorEditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "",
    dob: "",
    currentAddress: {},
    permanentAddress: {},
    educations: [],
    experiences: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/vendor/client/candidates/${id}`);
        console.log("FETCHED DATA:", res);

        setForm({
          firstName: res?.firstName || "",
          lastName: res?.lastName || "",
          email: res?.email || "",
          phone: res?.phone || "",
          countryCode: res?.countryCode || "",
          dob: res?.dob || "",

          currentAddress: res?.currentAddress || {},
          permanentAddress: res?.permanentAddress || {},

          educations: res?.educations || [],
          experiences: res?.experiences || [],
          documents: res?.documents || [],

          clientName: res?.client?.companyName || "",
          departmentName: res?.department?.name || "",

          createdAt: res?.createdAt || "",
        });
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchData();
  }, [id]);

  const update = async () => {
    const payload = {
      ...form,
      dob: form.dob || null,

      educations: form.educations?.map(({ candidate, ...rest }) => rest),
      experiences: form.experiences?.map(({ candidate, ...rest }) => rest),
    };

    await api.put(`/vendor/client/candidates/${id}`, form);
    navigate(-1);
  };

  return (
    <div className="edit-candidates-page">
      {/* =========================
         STICKY HEADER
    ========================= */}
      <div className="edit-candidate-header">
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h2>Edit Candidate</h2>

          <p>Update candidate information and records</p>
        </div>

        <button className="primary-btn" onClick={update}>
          Save Changes
        </button>
      </div>

      {/* =========================
         BODY
    ========================= */}
      <div className="edit-candidate-body">
        {/* BASIC DETAILS */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Basic Details</h3>
            <p>Manage candidate personal information</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>

              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>

              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <input
                type="date"
                value={form.dob || ""}
                onChange={(e) =>
                  setForm({ ...form, dob: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* ORGANIZATION */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Organization</h3>
            <p>Client & department details</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Client</label>

              <input value={form.clientName || ""} disabled />
            </div>

            <div className="form-group">
              <label>Department</label>

              <input value={form.departmentName || ""} disabled />
            </div>
          </div>
        </div>

        {/* CURRENT ADDRESS */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Current Address</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Street</label>

              <input
                placeholder="Street"
                value={form.currentAddress?.street || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currentAddress: {
                      ...(form.currentAddress || {}),
                      street: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>City</label>

              <input
                placeholder="City"
                value={form.currentAddress?.city || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currentAddress: {
                      ...(form.currentAddress || {}),
                      city: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* PERMANENT ADDRESS */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Permanent Address</h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Street</label>

              <input
                placeholder="Street"
                value={form.permanentAddress?.street || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    permanentAddress: {
                      ...(form.permanentAddress || {}),
                      street: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Educations</h3>
            <p>Academic details</p>
          </div>

          <div className="multi-list">
            {form.educations.map((edu, i) => (
              <div key={i} className="sub-glass-card">
                <h4>Education {i + 1}</h4>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree</label>

                    <input
                      placeholder="Degree"
                      value={edu.degree || ""}
                      onChange={(e) => {
                        const updated = [...form.educations];
                        updated[i].degree = e.target.value;
                        setForm({ ...form, educations: updated });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Institution</label>

                    <input
                      placeholder="Institution"
                      value={edu.institution || ""}
                      onChange={(e) => {
                        const updated = [...form.educations];
                        updated[i].institution = e.target.value;
                        setForm({ ...form, educations: updated });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>

                    <input
                      type="date"
                      value={edu.courseStartDate || ""}
                      onChange={(e) => {
                        const updated = [...form.educations];
                        updated[i].courseStartDate = e.target.value;
                        setForm({ ...form, educations: updated });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>

                    <input
                      type="date"
                      value={edu.courseEndDate || ""}
                      onChange={(e) => {
                        const updated = [...form.educations];
                        updated[i].courseEndDate = e.target.value;
                        setForm({ ...form, educations: updated });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Experiences</h3>
            <p>Employment history</p>
          </div>

          <div className="multi-list">
            {form.experiences.map((exp, i) => (
              <div key={i} className="sub-glass-card">
                <h4>Experience {i + 1}</h4>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Company</label>

                    <input
                      placeholder="Company"
                      value={exp.companyName || ""}
                      onChange={(e) => {
                        const updated = [...form.experiences];
                        updated[i].companyName = e.target.value;
                        setForm({ ...form, experiences: updated });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>

                    <input
                      placeholder="Role"
                      value={exp.role || ""}
                      onChange={(e) => {
                        const updated = [...form.experiences];
                        updated[i].role = e.target.value;
                        setForm({ ...form, experiences: updated });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>

                    <input
                      type="date"
                      value={exp.startDate || ""}
                      onChange={(e) => {
                        const updated = [...form.experiences];
                        updated[i].startDate = e.target.value;
                        setForm({ ...form, experiences: updated });
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>

                    <input
                      type="date"
                      value={exp.endDate || ""}
                      onChange={(e) => {
                        const updated = [...form.experiences];
                        updated[i].endDate = e.target.value;
                        setForm({ ...form, experiences: updated });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Documents</h3>
          </div>

          <div className="documents-list">
            {form.documents?.map((doc, i) => (
              <div key={i} className="document-chip">
                {doc.type}
              </div>
            ))}
          </div>
        </div>

        {/* CREATED DATE */}
        <div className="glass-section">
          <div className="section-title">
            <h3>Created At</h3>
          </div>

          <div className="form-group">
            <input
              value={
                form.createdAt
                  ? new Date(form.createdAt).toLocaleString()
                  : ""
              }
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}
