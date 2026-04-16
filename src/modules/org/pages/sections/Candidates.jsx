import React, { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/Candidates.css";

export default function Candidates() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/org/candidates/getAllCandidates");

      console.log("API RESPONSE:", res); // 🔥 DEBUG

      if (!Array.isArray(res)) {
        setData([]);
        return;
      }

      setData(res);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const deleteCandidate = async (id) => {
    await api.delete(`/org/candidates/deleteCandidate/${id}`);
    fetchCandidates();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Candidates</h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/org/candidates/new")}
        >
          + Add Candidate
        </button>
      </div>

      <div className="list">
        {data.length === 0 ? (
          <p>No candidates found</p>
        ) : (
          data.map((c) => (
            <div key={c.id} className="card row">
              <div className="info">
                <h4>{c.firstName} {c.lastName}</h4>
                <p>{c.email}</p>
                <span className="status">{c.status}</span>
              </div>

              <div className="actions">
                <button onClick={() => navigate(`/org/candidates/candidateDetails/${c.id}`)}>
                  View
                </button>

                <button onClick={() => navigate(`/org/candidates/edit/${c.id}`)}>
                  Edit
                </button>

                <button className="danger" onClick={() => deleteCandidate(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}