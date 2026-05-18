import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../styles/VerificationsDepartments.css";

export default function VerificationDepartments() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const base = getBasePath();

  const fetchData = async () => {
    const res = await api.get(`/departments?q=${search}`);
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="dept-page">
      {/* HEADER */}
      <div className="dept-header">
        <div className="header-left">
          <h2>Departments</h2>
        </div>
        <div className="header-right">
          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* LIST */}
      <div className="dept-list">
        {data.map((d) => (
          <div
            key={d.id}
            className="dept-row verification-row"
            onClick={() => navigate(`${base}/verifications/${d.id}`)}
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
