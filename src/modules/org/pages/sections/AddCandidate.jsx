import React, { useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import { useParams } from "react-router-dom";
import "../../styles/AddCandidate.css";

export default function AddCandidate() {
  const { deptId } = useParams();
  const navigate = useNavigate();
  const base = getBasePath();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentAddress: {},
    permanentAddress: {},
  });

  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [documents, setDocuments] = useState({});

  // ================= HANDLERS =================

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNestedChange = (parent, field, value) => {
    setForm((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleFileChange = (field, file) => {
    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  // ================= EDUCATION =================

  const addEducation = () => {
    setEducations([
      ...educations,
      { degree: "", institution: "", graduationYear: "", files: [] },
    ]);
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const handleEducationFiles = (index, files) => {
    const updated = [...educations];
    updated[index].files = files;
    setEducations(updated);
  };

  // ================= EXPERIENCE =================

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        companyName: "",
        role: "",
        startDate: "",
        endDate: "",
        files: {
          payslips: [],
          experienceLetter: null,
          relievingLetter: null,
        },
      },
    ]);
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const handleExperienceFiles = (index, type, value) => {
    const updated = [...experiences];
    updated[index].files[type] = value;
    setExperiences(updated);
  };

  // ================= FILE UPLOAD FUNCTION =================

  const uploadFile = async (candidateId, file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    console.log("Uploading:", file.name, "TYPE:", type);

    await fetch(`http://localhost:8081/org/documents/upload/${candidateId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
  };

  // ================= SAVE =================

  const save = async () => {
    try {
      // 🔥 STEP 1: CREATE
      const res = await api.post(`/org/candidates/createCandidate`, {
        ...form,
        educations,
        experiences,
        departmentId: deptId,
      });

      const candidateId = res?.id;

      console.log("Candidate Created:", candidateId);

      if (!candidateId) {
        alert("❌ Candidate creation failed");
        return;
      }

      // ================= KYC =================
      for (let key in documents) {
        const file = documents[key]; // ✅ FIXED

        if (!file) continue;

        await uploadFile(candidateId, file, key.toUpperCase()); // PAN / AADHAR
      }

      // ================= EDUCATION =================
      for (let edu of educations) {
        if (edu.files?.length) {
          for (let file of edu.files) {
            await uploadFile(candidateId, file, "EDUCATION_CERTIFICATE"); // ✅ FIXED ENUM
          }
        }
      }

      // ================= EXPERIENCE =================
      for (let exp of experiences) {
        // Payslips
        if (exp.files?.payslips?.length) {
          for (let file of exp.files.payslips) {
            await uploadFile(candidateId, file, "PAYSLIP");
          }
        }

        // Experience Letter
        if (exp.files?.experienceLetter) {
          await uploadFile(
            candidateId,
            exp.files.experienceLetter,
            "EXPERIENCE_LETTER",
          );
        }

        // Relieving Letter
        if (exp.files?.relievingLetter) {
          await uploadFile(
            candidateId,
            exp.files.relievingLetter,
            "RELIEVING_LETTER",
          );
        }
      }

      alert("✅ Candidate + Documents uploaded");
      navigate(`/${base}/candidates/${deptId}`);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("❌ Failed");
    }
  };

  // ================= UI =================

  return (
    <div className="cac-page">
      {/* HEADER */}
      <div className="cac-header">
        {/* LEFT */}
        <div className="cac-header-left">
          <button
            className="cac-back-btn"
            onClick={() => navigate( `/${base}/candidates/${deptId}`,)}>
            ← Back
          </button>
          <div className="cac-header-info">
            <h2>Add Candidate</h2>
            <p>
              Create and manage candidate
              verification profile
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="cac-header-right">
          <button
            className="cac-submit-btn"
            onClick={save}
          >
            Save Candidate
          </button>
        </div>
      </div>

      {/* =========================
       BODY
    ========================= */}

      <div className="cac-body">

        {/* BASIC */}
        <div className="cac-card">
          <h3>Basic Information</h3>

          <div className="cac-grid">

            <input
              className="cac-input"
              placeholder="First Name"
              onChange={(e) =>
                handleChange(
                  "firstName",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="Last Name"
              onChange={(e) =>
                handleChange(
                  "lastName",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="Email"
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              type="date"
              onChange={(e) =>
                handleChange(
                  "dob",
                  e.target.value,
                )
              }
            />

          </div>

          {/* PHONE */}

          <div className="cac-phone-group">

            <select
              className="cac-select"
              onChange={(e) =>
                handleChange(
                  "countryCode",
                  e.target.value,
                )
              }
            >
              <option value="+91">
                🇮🇳 +91
              </option>

              <option value="+1">
                🇺🇸 +1
              </option>

              <option value="+44">
                🇬🇧 +44
              </option>

              <option value="+61">
                🇦🇺 +61
              </option>
            </select>

            <input
              className="cac-input"
              placeholder="Phone Number"
              onChange={(e) =>
                handleChange(
                  "phone",
                  e.target.value,
                )
              }
            />
          </div>
        </div>

        {/* CURRENT ADDRESS */}

        <div className="cac-card">

          <h3>Current Address</h3>

          <div className="cac-grid">

            <input
              className="cac-input"
              placeholder="Street"
              onChange={(e) =>
                handleNestedChange(
                  "currentAddress",
                  "street",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="City"
              onChange={(e) =>
                handleNestedChange(
                  "currentAddress",
                  "city",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="State"
              onChange={(e) =>
                handleNestedChange(
                  "currentAddress",
                  "state",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="Zip Code"
              onChange={(e) =>
                handleNestedChange(
                  "currentAddress",
                  "zipCode",
                  e.target.value,
                )
              }
            />
          </div>
        </div>

        {/* PERMANENT ADDRESS */}

        <div className="cac-card">

          <h3>Permanent Address</h3>

          <div className="cac-grid">

            <input
              className="cac-input"
              placeholder="Street"
              onChange={(e) =>
                handleNestedChange(
                  "permanentAddress",
                  "street",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="City"
              onChange={(e) =>
                handleNestedChange(
                  "permanentAddress",
                  "city",
                  e.target.value,
                )
              }
            />

            <input
              className="cac-input"
              placeholder="State"
              onChange={(e) =>
                handleNestedChange(
                  "permanentAddress",
                  "state",
                  e.target.value,
                )
              }
            />
            <input
              className="cac-input"
              placeholder="Zip Code"
              onChange={(e) =>
                handleNestedChange(
                  "permanentAddress",
                  "zipCode",
                  e.target.value,
                )
              }
            />
          </div>
        </div>
        {/* KYC */}
        <div className="cac-card">
          <h3>
            KYC Documents
          </h3>
          <div className="cac-grid">
            <input
              className="cac-file-input"
              type="file"
              onChange={(e) =>
                handleFileChange(
                  "PAN",
                  e.target.files[0],
                )
              }
            />
            <input
              className="cac-file-input"
              type="file"
              onChange={(e) =>
                handleFileChange(
                  "AADHAR",
                  e.target.files[0],
                )
              }
            />
          </div>
        </div>
        {/* EDUCATION */}
        <div className="cac-card">
          <div className="cac-section-header">
            <h3>Education</h3>
            <button
              className="cac-add-btn"
              onClick={addEducation}
            >
              + Add Education
            </button>
          </div>
          {educations.map((edu, i) => (
            <div key={i} className="cac-sub-card">
              <div className="cac-grid">
                <input
                  className="cac-input"
                  placeholder="Degree"
                  onChange={(e) =>
                    handleEducationChange(
                      i,
                      "degree",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="cac-input"
                  placeholder="Institution"
                  onChange={(e) =>
                    handleEducationChange(
                      i,
                      "institution",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="cac-input"
                  placeholder="Year"
                  onChange={(e) =>
                    handleEducationChange(
                      i,
                      "graduationYear",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="cac-file-input"
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleEducationFiles(
                      i,
                      e.target.files,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
        {/* EXPERIENCE */}
        <div className="cac-card">
          <div className="cac-section-header">
            <h3>Experience</h3>
            <button
              className="cac-add-btn"
              onClick={addExperience}
            >
              + Add Experience
            </button>
          </div>
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="cac-sub-card"
            >
              <div className="cac-grid">
                <input
                  className="cac-input"
                  placeholder="Company"
                  onChange={(e) =>
                    handleExperienceChange(
                      i,
                      "companyName",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="cac-input"
                  placeholder="Role"
                  onChange={(e) =>
                    handleExperienceChange(
                      i,
                      "role",
                      e.target.value,
                    )
                  }
                />
                <input
                  className="cac-input"
                  type="date"
                />
                <input
                  className="cac-input"
                  type="date"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
