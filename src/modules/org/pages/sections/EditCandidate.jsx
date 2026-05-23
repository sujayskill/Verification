import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/EditCandidate.css";

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const base = getBasePath();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
      const data = await api.get(
        `/org/candidates/getCandidateDetailsById/${id}`,
      );

      const c = data;
      console.log(data);

      setForm({
        ...c,
        dob: c?.dob ? new Date(c.dob).toISOString().split("T")[0] : "",
        educations:
          c?.educations?.map((e) => ({
            ...e,
            courseStartDate: e.courseStartDate
              ? new Date(e.courseStartDate).toISOString().split("T")[0]
              : "",
            courseEndDate: e.courseEndDate
              ? new Date(e.courseEndDate).toISOString().split("T")[0]
              : "",
          })) || [],
        experiences:
          c?.experiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate
              ? new Date(exp.startDate).toISOString().split("T")[0]
              : "",
            endDate: exp.endDate
              ? new Date(exp.endDate).toISOString().split("T")[0]
              : "",
          })) || [],
        currentAddress: c?.currentAddress || {},
        permanentAddress: c?.permanentAddress || {},
      });
    };

    fetchData();
  }, [id]);

  // 🔹 HANDLERS
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddressChange = (type, field, value) => {
    setForm({
      ...form,
      [type]: {
        ...form[type],
        [field]: value,
      },
    });
  };

  // 🔹 EDUCATION
  const addEducation = () => {
    setForm({
      ...form,
      educations: [
        ...form.educations,
        {
          degree: "",
          institution: "",
          courseStartDate: "",
          courseEndDate: "",
        },
      ],
    });
  };

  const updateEducation = (i, field, value) => {
    const updated = [...form.educations];
    updated[i] = {
      ...updated[i],
      [field]: value,
    };
    setForm({ ...form, educations: updated });
  };

  const removeEducation = (i) => {
    setForm({
      ...form,
      educations: form.educations.filter((_, idx) => idx !== i),
    });
  };

  // 🔹 EXPERIENCE
  const addExperience = () => {
    setForm({
      ...form,
      experiences: [
        ...form.experiences,
        {
          companyName: "",
          role: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const updateExperience = (i, field, value) => {
    const updated = [...form.experiences];

    updated[i] = {
      ...updated[i],
      [field]: value, // already yyyy-MM-dd from input
    };

    setForm({ ...form, experiences: updated });
  };

  const removeExperience = (i) => {
    setForm({
      ...form,
      experiences: form.experiences.filter((_, idx) => idx !== i),
    });
  };

  const update = async () => {
    const payload = {
      ...form,
      dob: form.dob || null,
      educations: form.educations,
      experiences: form.experiences,
    };

    await api.put(`/org/candidates/editCandidateDetails/${id}`, payload);
    navigate(`/${base}/candidates`);
  };

  return (
    <div className="cec-page">
      {/* =========================
       HEADER
    ========================= */}

      <div className="cec-header">
        {/* LEFT */}

        <div className="cec-header-left">
          <button
            className="cec-back-btn"
            onClick={() =>
              navigate(`/${base}/candidates/${form.department.id}`)
            }
          >
            ← Back
          </button>

          <div className="cec-header-info">
            <h2>Edit Candidate</h2>

            <p>Update candidate profile and verification details</p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="cec-header-right">
          <button
            className="cec-update-btn"
            onClick={() => setShowUpdateModal(true)}
          >
            Update Candidate
          </button>
        </div>
      </div>

      {/* =========================
       BODY
    ========================= */}

      <div className="cec-body">
        {/* BASIC DETAILS */}

        <div className="cec-card">
          <h3>Basic Details</h3>

          <div className="cec-grid-3">
            <input
              className="cec-input"
              placeholder="First Name"
              value={form.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />

            <input
              className="cec-input"
              placeholder="Last Name"
              value={form.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />

            <input
              className="cec-input"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <input
              className="cec-input"
              placeholder="Phone"
              value={form.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />

            <input
              className="cec-input"
              placeholder="Country Code"
              value={form.countryCode || ""}
              onChange={(e) => handleChange("countryCode", e.target.value)}
            />

            <input
              className="cec-input"
              type="date"
              value={form.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>
        </div>

        {/* ADDRESS */}

        <div className="cec-card">
          <h3>Address</h3>

          <div className="cec-grid-2">
            {/* CURRENT */}

            <div className="cec-sub-card">
              <h4>Current Address</h4>

              <div className="cec-form-group">
                <input
                  className="cec-input"
                  placeholder="Street"
                  value={form.currentAddress?.street || ""}
                  onChange={(e) =>
                    handleAddressChange(
                      "currentAddress",
                      "street",
                      e.target.value,
                    )
                  }
                />

                <input
                  className="cec-input"
                  placeholder="City"
                  value={form.currentAddress?.city || ""}
                  onChange={(e) =>
                    handleAddressChange(
                      "currentAddress",
                      "city",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            {/* PERMANENT */}

            <div className="cec-sub-card">
              <h4>Permanent Address</h4>

              <div className="cec-form-group">
                <input
                  className="cec-input"
                  placeholder="Street"
                  value={form.permanentAddress?.street || ""}
                  onChange={(e) =>
                    handleAddressChange(
                      "permanentAddress",
                      "street",
                      e.target.value,
                    )
                  }
                />

                <input
                  className="cec-input"
                  placeholder="City"
                  value={form.permanentAddress?.city || ""}
                  onChange={(e) =>
                    handleAddressChange(
                      "permanentAddress",
                      "city",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* EDUCATION */}

        <div className="cec-card">
          <div className="cec-section-header">
            <h3>Education</h3>

            <button className="cec-add-btn" onClick={addEducation}>
              + Add Education
            </button>
          </div>

          {form.educations.map((edu, i) => (
            <div key={i} className="cec-sub-card">
              <div className="cec-grid-3">
                <input
                  className="cec-input"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(i, "degree", e.target.value)}
                />

                <input
                  className="cec-input"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(i, "institution", e.target.value)
                  }
                />

                <input
                  className="cec-input"
                  type="date"
                  value={edu.courseStartDate || ""}
                  onChange={(e) =>
                    updateEducation(i, "courseStartDate", e.target.value)
                  }
                />

                <input
                  className="cec-input"
                  type="date"
                  value={edu.courseEndDate || ""}
                  onChange={(e) =>
                    updateEducation(i, "courseEndDate", e.target.value)
                  }
                />

                <button
                  className="cec-remove-btn"
                  onClick={() => removeEducation(i)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EXPERIENCE */}

        <div className="cec-card">
          <div className="cec-section-header">
            <h3>Experience</h3>

            <button className="cec-add-btn" onClick={addExperience}>
              + Add Experience
            </button>
          </div>

          {form.experiences.map((exp, i) => (
            <div key={i} className="cec-sub-card">
              <div className="cec-grid-3">
                <input
                  className="cec-input"
                  placeholder="Company"
                  value={exp.companyName}
                  onChange={(e) =>
                    updateExperience(i, "companyName", e.target.value)
                  }
                />

                <input
                  className="cec-input"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => updateExperience(i, "role", e.target.value)}
                />

                <input
                  className="cec-input"
                  type="date"
                  value={exp.startDate || ""}
                  onChange={(e) =>
                    updateExperience(i, "startDate", e.target.value)
                  }
                />

                <input
                  className="cec-input"
                  type="date"
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateExperience(i, "endDate", e.target.value)
                  }
                />

                <button
                  className="cec-remove-btn"
                  onClick={() => removeExperience(i)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* =========================
   UPDATE CONFIRM MODAL
========================= */}

      {showUpdateModal && (
        <div
          className="cec-modal-overlay"
          onClick={() => setShowUpdateModal(false)}
        >
          <div className="cec-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Update Candidate</h3>

            <p>
              Are you sure you want to update details for{" "}
              <strong>
                {form.firstName} {form.lastName}
              </strong>
              ?
            </p>

            <div className="cec-modal-actions">
              <button
                className="cec-cancel-btn"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>

              <button
                className="cec-confirm-btn"
                onClick={async () => {
                  try {
                    await update();

                    setShowUpdateModal(false);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
