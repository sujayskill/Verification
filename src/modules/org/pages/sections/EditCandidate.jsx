import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/PageStyle.css";

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

  const addEducation = () => {
    setForm({
      ...form,
      educations: [
        ...form.educations,
        { degree: "", institution: "", graduationYear: "" },
      ],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...form.educations];
    updated[index][field] = value;

    setForm({ ...form, educations: updated });
  };

  const removeEducation = (index) => {
    const updated = form.educations.filter((_, i) => i !== index);
    setForm({ ...form, educations: updated });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experiences: [
        ...form.experiences,
        { companyName: "", role: "", startDate: "", endDate: "" },
      ],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get(
          `/org/candidates/getCandidateDetailsById/${id}`,
        );
        if (!data || !data.candidate) {
          console.error("Invalid API response", data);
          return;
        }
        const c = data.candidate;
        setForm({
          ...c,
          dob: c?.dob ? new Date(c.dob).toISOString().split("T")[0] : "",
          educations: c?.educations || [],
          experiences: c?.experiences || [],
          currentAddress: c?.currentAddress || {},
          permanentAddress: c?.permanentAddress || {},
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const update = async () => {
    const payload = {
      ...form,
      dob: form.dob || null,
    };

    await api.put(`/org/candidates/editCandidateDetails/${id}`, payload);
    navigate(`/${base}/candidates`);
  };

  return (
    <div className="container">
      <h2>Edit Candidate</h2>

      <div className="card">
        <input
          value={form.firstName || ""}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          value={form.lastName || ""}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <input
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Street"
          value={form.currentAddress?.street || ""}
          onChange={(e) =>
            setForm({
              ...form,
              currentAddress: {
                ...form.currentAddress,
                street: e.target.value,
              },
            })
          }
        />

        {form.experiences?.map((exp, i) => (
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

            <button
              onClick={() => {
                const updated = form.experiences.filter((_, idx) => idx !== i);
                setForm({ ...form, experiences: updated });
              }}
            >
              ❌
            </button>
          </div>
        ))}

        <button onClick={addExperience}>+ Add Experience</button>

        <input
          placeholder="Phone"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Country Code"
          value={form.countryCode || ""}
          onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
        />

        <input
          type="date"
          value={form.dob || ""}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />

        <button onClick={update}>Update</button>
      </div>
    </div>
  );
}
