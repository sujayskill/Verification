import React, { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/PageStyle.css";

export default function EditCandidate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const data = await api.get(`/org/candidates/candidateDetails/${id}`);
      setForm(data);
    };
    fetch();
  }, [id]);

  const update = async () => {
    await api.put(`/org/candidates/editCandidateDetails/${id}`, form);
    navigate("/org/candidates");
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

        <button onClick={update}>Update</button>
      </div>
    </div>
  );
}
