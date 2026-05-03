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
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="reports-container">
      <h2>Departments</h2>

      <input
        placeholder="Search department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="reports-list">
        {data.map((d) => (
          <div
            key={d.id}
            className="report-row"
            onClick={() => navigate(`${base}/reports/${d.id}`)}
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