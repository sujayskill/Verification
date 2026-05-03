import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/EditCandidate.css";

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const base = getBasePath();

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
    <div className="edit-page">
      <button onClick={() => navigate(`/${base}/candidates`)}>
        ← Back to Candidates
      </button>
      <h2>Edit Candidate</h2>

      {/* 🔹 BASIC DETAILS */}
      <div className="card">
        <h3>Basic Details</h3>
        <div className="grid-3">
          <input
            placeholder="First Name"
            value={form.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <input
            placeholder="Last Name"
            value={form.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          <input
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <input
            placeholder="Phone"
            value={form.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <input
            placeholder="Country Code"
            value={form.countryCode || ""}
            onChange={(e) => handleChange("countryCode", e.target.value)}
          />
          <input
            type="date"
            value={form.dob || ""}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 ADDRESS */}
      <div className="card">
        <h3>Address</h3>

        <div className="grid-2">
          <div>
            <h4>Current Address</h4>
            <input
              placeholder="Street"
              value={form.currentAddress?.street || ""}
              onChange={(e) =>
                handleAddressChange("currentAddress", "street", e.target.value)
              }
            />
            <input
              placeholder="City"
              value={form.currentAddress?.city || ""}
              onChange={(e) =>
                handleAddressChange("currentAddress", "city", e.target.value)
              }
            />
          </div>

          <div>
            <h4>Permanent Address</h4>
            <input
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
              placeholder="City"
              value={form.permanentAddress?.city || ""}
              onChange={(e) =>
                handleAddressChange("permanentAddress", "city", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* 🔹 EDUCATION */}
      <div className="card">
        <h3>Education</h3>

        {form.educations.map((edu, i) => (
          <div key={i} className="sub-card">
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(i, "degree", e.target.value)}
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(i, "institution", e.target.value)
              }
            />
            <input
              type="date"
              value={edu.courseStartDate || ""}
              onChange={(e) =>
                updateEducation(i, "courseStartDate", e.target.value)
              }
            />

            <input
              type="date"
              value={edu.courseEndDate || ""}
              onChange={(e) =>
                updateEducation(i, "courseEndDate", e.target.value)
              }
            />
            <button onClick={() => removeEducation(i)}>❌</button>
          </div>
        ))}

        <button className="add-btn" onClick={addEducation}>
          + Add Education
        </button>
      </div>

      {/* 🔹 EXPERIENCE */}
      <div className="card">
        <h3>Experience</h3>

        {form.experiences.map((exp, i) => (
          <div key={i} className="sub-card">
            <input
              placeholder="Company"
              value={exp.companyName}
              onChange={(e) =>
                updateExperience(i, "companyName", e.target.value)
              }
            />
            <input
              placeholder="Role"
              value={exp.role}
              onChange={(e) => updateExperience(i, "role", e.target.value)}
            />
            <input
              type="date"
              value={exp.startDate || ""}
              onChange={(e) => updateExperience(i, "startDate", e.target.value)}
            />

            <input
              type="date"
              value={exp.endDate || ""}
              onChange={(e) => updateExperience(i, "endDate", e.target.value)}
            />
            <button onClick={() => removeExperience(i)}>❌</button>
          </div>
        ))}

        <button className="add-btn" onClick={addExperience}>
          + Add Experience
        </button>
      </div>

      <button className="update-btn" onClick={update}>
        Update Candidate
      </button>
    </div>
  );
}
