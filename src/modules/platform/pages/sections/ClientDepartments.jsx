import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ClientDepartments.css";

export default function ClientDepartments() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [client, setClient] = useState(null);
  const [search, setSearch] = useState("");

  // 🔥 fetch departments
  const fetchData = async () => {
    const res = await api.get(`/departments/by-org/${orgId}`);
    console.log(res);
    console.log("hello");
    setData(Array.isArray(res) ? res : []);
  };

  // 🔥 fetch client details
  const fetchClient = async () => {
    const res = await api.get(`/clients/by-org/${orgId}`);
    setClient(res);
  };

  useEffect(() => {
    fetchData();
    fetchClient();
  }, [orgId]);

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="dept-page">
      <button onClick={() => navigate(`/platform/clients`)}>← Back</button>
      {/* HEADER */}
      <div className="dept-header">
        <div>
          <h2>{client?.companyName || "Departments"}</h2>
          <p>{filtered.length} departments</p>
        </div>

        <div className="actions">
          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🔥 VIEW CLIENT DETAILS */}
          <button
            className="secondary-btn"
            onClick={() => navigate(`/platform/clientsDetails/${orgId}`)}
          >
            View Client Details
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="dept-list">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="dept-row"
            onClick={() =>
              navigate(`/platform/clients/${orgId}/departments/${d.id}`)
            }
          >
            <span
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
