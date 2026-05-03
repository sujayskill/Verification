import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/EditClientCandidate.css";

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
    <div className="container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Edit Candidate</h2>

      {/* 🔹 BASIC DETAILS */}
      <div className="section">
        <h3>Basic Details</h3>

        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />

        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          type="date"
          value={form.dob || ""}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
      </div>

      {/* 🔹 CLIENT + DEPARTMENT (READ ONLY) */}
      <div className="section">
        <h3>Organization</h3>

        <input value={form.clientName || ""} disabled />
        <input value={form.departmentName || ""} disabled />
      </div>

      {/* 🔹 ADDRESS */}
      <div className="section">
        <h3>Current Address</h3>

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

      <div className="section">
        <h3>Permanent Address</h3>

        <input
          placeholder="Street"
          value={form.permanentAddress?.street || ""}
          onChange={(e) =>
            setForm({
              ...form,
              permanentAddress: {
                ...(form.currentAddress || {}),
                street: e.target.value,
              },
            })
          }
        />
      </div>

      {/* 🔹 EDUCATION */}
      <div className="section">
        <h3>Educations</h3>

        {form.educations.map((edu, i) => (
          <div key={i} className="sub-card">
            <input
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) => {
                const updated = [...form.educations];
                updated[i].degree = e.target.value;
                setForm({ ...form, educations: updated });
              }}
            />

            <input
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) => {
                const updated = [...form.educations];
                updated[i].institution = e.target.value;
                setForm({ ...form, educations: updated });
              }}
            />

            <input
              type="date"
              value={edu.courseStartDate || ""}
              onChange={(e) => {
                const updated = [...form.educations];
                updated[i].courseStartDate = e.target.value;
                setForm({ ...form, educations: updated });
              }}
            />

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
        ))}
      </div>

      {/* 🔹 EXPERIENCE */}
      <div className="section">
        <h3>Experiences</h3>

        {form.experiences.map((exp, i) => (
          <div key={i} className="sub-card">
            <input
              placeholder="Company"
              value={exp.companyName || ""}
              onChange={(e) => {
                const updated = [...form.experiences];
                updated[i].companyName = e.target.value;
                setForm({ ...form, experiences: updated });
              }}
            />

            <input
              placeholder="Role"
              value={exp.role || ""}
              onChange={(e) => {
                const updated = [...form.experiences];
                updated[i].role = e.target.value;
                setForm({ ...form, experiences: updated });
              }}
            />

            <input
              type="date"
              value={exp.startDate || ""}
              onChange={(e) => {
                const updated = [...form.experiences];
                updated[i].startDate = e.target.value;
                setForm({ ...form, experiences: updated });
              }}
            />

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
        ))}
      </div>

      {/* 🔹 DOCUMENTS */}
      <div className="section">
        <h3>Documents</h3>

        {form.documents?.map((doc, i) => (
          <div key={i}>
            <p>{doc.type}</p>
          </div>
        ))}
      </div>

      {/* 🔹 CREATED DATE */}
      <div className="section">
        <h3>Created At</h3>
        <input
          value={
            form.createdAt ? new Date(form.createdAt).toLocaleString() : ""
          }
        />
      </div>

      {/* 🔹 ACTION */}
      <button onClick={update}>Update</button>
    </div>
  );
}
