import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Reports.css";

export default function ReportsDepartments() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const base = getBasePath();

  useEffect(() => {
    api.get(`/departments?q=${search}`).then(setData);
  }, [search]);

  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="dept-page">
      {/* HEADER */}
      <div className="dept-header">
        <h2>Departments</h2>

        <div className="actions">
          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="dept-list">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="dept-row report-row"
            onClick={() => navigate(`${base}/reports/${d.id}`)}
          >
            {/* LEFT */}
            <div className="dept-name">
              <span
                dangerouslySetInnerHTML={{
                  __html: highlight(d.name),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
