import { useEffect, useState } from "react";
import { api } from "../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "./StatusDepartments.css";

export default function StatusDepartments() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await api.get(`/departments/platform/by-org?orgId=${orgId}`);
    setData(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="status-page">
      <button onClick={() => navigate("/platform/status")}>
        ← Back
      </button>

      <h2>Departments</h2>

      <input
        placeholder="Search department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="status-list">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="status-card"
            onClick={() =>
              navigate(`/platform/status/${orgId}/${d.id}`)
            }
          >
            <h4
              dangerouslySetInnerHTML={{
                __html: highlight(d.name),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}