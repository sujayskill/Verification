import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ClientCandidates.css";

export default function ClientCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get(`/clients/${id}/candidates/search?q=${search}`);
      console.log(res,"data");
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, id]);

  // 🔥 highlight
  const highlight = (text) => {
    if (!search || !text) return text;

    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  const deleteCandidate = async (cid) => {
    if (!window.confirm("Delete candidate?")) return;

    await api.delete(`/candidates/${cid}`);
    fetchData();
  };

  return (
    <div className="cc-page">
      {/* HEADER */}
      <div className="cc-header">
        <button onClick={() => navigate(-1)}>← Back</button>

        <h2>Client Candidates</h2>

        <input
          placeholder="Search name / email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="cc-list">
        {data.length === 0 && <p>No candidates found</p>}

        {data.map((c) => (
          <div key={c.id} className="cc-card">
            <div className="cc-info">
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
            </div>

            <div className="cc-actions">
              <button
                onClick={() => navigate(`/platform/candidates/details/${c.id}`)}
              >
                View
              </button>

              <button
                className="edit"
                onClick={() => navigate(`/platform/candidates/edit/${c.id}`)}
              >
                Edit
              </button>

              <button className="delete" onClick={() => deleteCandidate(c.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
