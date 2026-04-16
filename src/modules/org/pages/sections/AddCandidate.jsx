import React, { useState } from "react";
import { api } from "../../../../services/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/AddCandidate.css";

export default function AddCandidate() {
  const navigate = useNavigate();

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
      navigate("/org/candidates");
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("❌ Failed");
    }
  };

  // ================= UI =================

  return (
    <div className="add-page">
      <h2>Add Candidate</h2>

      {/* 🔹 BASIC */}
      <div className="form-card">
        <h3>Basic Information</h3>

        <input
          placeholder="First Name"
          onChange={(e) => handleChange("firstName", e.target.value)}
        />

        <input
          placeholder="Last Name"
          onChange={(e) => handleChange("lastName", e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => handleChange("email", e.target.value)}
        />

        {/* 🔥 DOB */}
        <input
          type="date"
          onChange={(e) => handleChange("dob", e.target.value)}
        />

        {/* 🔥 PHONE WITH COUNTRY CODE */}
        <div className="phone-group">
          <select onChange={(e) => handleChange("countryCode", e.target.value)}>
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
          </select>

          <input
            placeholder="Phone Number"
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* 🔹 ADDRESS */}
      <div className="form-card">
        <h3>Current Address</h3>

        <input
          placeholder="Street"
          onChange={(e) =>
            handleNestedChange("currentAddress", "street", e.target.value)
          }
        />
        <input
          placeholder="City"
          onChange={(e) =>
            handleNestedChange("currentAddress", "city", e.target.value)
          }
        />
        <input
          placeholder="State"
          onChange={(e) =>
            handleNestedChange("currentAddress", "state", e.target.value)
          }
        />
        <input
          placeholder="Zip Code"
          onChange={(e) =>
            handleNestedChange("currentAddress", "zipCode", e.target.value)
          }
        />
      </div>

      <div className="form-card">
        <h3>Permanent Address</h3>

        <input
          placeholder="Street"
          onChange={(e) =>
            handleNestedChange("permanentAddress", "street", e.target.value)
          }
        />
        <input
          placeholder="City"
          onChange={(e) =>
            handleNestedChange("permanentAddress", "city", e.target.value)
          }
        />
        <input
          placeholder="State"
          onChange={(e) =>
            handleNestedChange("permanentAddress", "state", e.target.value)
          }
        />
        <input
          placeholder="Zip Code"
          onChange={(e) =>
            handleNestedChange("permanentAddress", "zipCode", e.target.value)
          }
        />
      </div>

      {/* 🔹 KYC */}
      <div className="form-card">
        <h3>Scanned copies of Aadhar & PAN</h3>

        <input
          type="file"
          onChange={(e) => handleFileChange("PAN", e.target.files[0])}
        />
        <input
          type="file"
          onChange={(e) => handleFileChange("AADHAR", e.target.files[0])}
        />
      </div>

      {/* 🔹 EDUCATION */}
      <div className="form-card">
        <h3>Education</h3>

        <button onClick={addEducation}>+ Add Education</button>

        {educations.map((edu, i) => (
          <div key={i} className="sub-card">
            <input
              placeholder="Degree"
              onChange={(e) =>
                handleEducationChange(i, "degree", e.target.value)
              }
            />
            <input
              placeholder="Institution"
              onChange={(e) =>
                handleEducationChange(i, "institution", e.target.value)
              }
            />
            <input
              placeholder="Year"
              onChange={(e) =>
                handleEducationChange(i, "graduationYear", e.target.value)
              }
            />

            <input
              type="file"
              multiple
              onChange={(e) => handleEducationFiles(i, e.target.files)}
            />
          </div>
        ))}
      </div>

      {/* 🔹 EXPERIENCE */}
      <div className="form-card">
        <h3>Experience</h3>

        <button onClick={addExperience}>+ Add Experience</button>

        {experiences.map((exp, i) => (
          <div key={i} className="sub-card">
            <input
              placeholder="Company"
              onChange={(e) =>
                handleExperienceChange(i, "companyName", e.target.value)
              }
            />
            <input
              placeholder="Role"
              onChange={(e) =>
                handleExperienceChange(i, "role", e.target.value)
              }
            />
            <input
              type="date"
              onChange={(e) => handleChange("Start date", e.target.value)}
            />
            <input
              type="date"
              onChange={(e) => handleChange("End date", e.target.value)}
            />

            <label>Payslips</label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                handleExperienceFiles(i, "payslips", e.target.files)
              }
            />

            <label>Experience Letter</label>
            <input
              type="file"
              onChange={(e) =>
                handleExperienceFiles(i, "experienceLetter", e.target.files[0])
              }
            />

            <label>Relieving Letter</label>
            <input
              type="file"
              onChange={(e) =>
                handleExperienceFiles(i, "relievingLetter", e.target.files[0])
              }
            />
          </div>
        ))}
      </div>

      <button className="submit-btn" onClick={save}>
        Save Candidate
      </button>
    </div>
  );
}
