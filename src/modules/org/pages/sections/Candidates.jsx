import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Candidates.css";

export default function Candidates() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const base = getBasePath();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchCandidates = async () => {
    try {
      let url = `/org/candidates/search?sortBy=createdAt&direction=desc`;
      if (search.trim()) {
        url += `&q=${search}`;
      }
      const res = await api.get(url);
      console.log("API RESPONSE:", res);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, status]);

  const deleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;
    try {
      await api.delete(`/org/candidates/deleteCandidate/${id}`);
      fetchCandidates();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Candidates</h2>
        <div className="actions">
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <button
          className="primary-btn"
          onClick={() => navigate(`/${base}/candidates/new`)}
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
                <h4
                  dangerouslySetInnerHTML={{
                    __html: highlight(`${c.firstName} ${c.lastName}`),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlight(c.email),
                  }}
                />
                <span className={`status ${c.locked ? "locked" : ""}`}>
                  {c.locked ? "🔒 Under Verification" : c.status}
                </span>{" "}
              </div>

              <div className="actions">
                <button
                  onClick={() =>
                    navigate(`${base}/candidates/candidateDetails/${c.id}`)
                  }
                >
                  View
                </button>

                <button
                  disabled={c.locked}
                  className={c.locked ? "disabled blur" : ""}
                  onClick={() => navigate(`${base}/candidates/edit/${c.id}`)}
                >
                  Edit
                </button>

                <button
                  disabled={c.locked}
                  className={c.locked ? "disabled blur" : ""}
                  onClick={() => deleteCandidate(c.id)}
                >
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
