import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Clients.css";

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
    <div className="container">
      <button onClick={() => navigate(-1)}>← Back</button>

      <h2>Edit Client</h2>

      <div className="card grid">
        <input
          value={form.companyName || ""}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <input
          value={form.companySlug || ""}
          onChange={(e) => setForm({ ...form, companySlug: e.target.value })}
        />
        <input
          value={form.companyType || ""}
          onChange={(e) => setForm({ ...form, companyType: e.target.value })}
        />
        <input
          value={form.contactEmail || ""}
          onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
        />
        <input
          value={form.contactNumber || ""}
          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
        />
        <input
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          value={form.employeeCount || ""}
          onChange={(e) => setForm({ ...form, employeeCount: e.target.value })}
        />

        <button className="btn" onClick={update}>
          Update
        </button>
      </div>
    </div>
  );
}
