import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";

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
    <div className="content">
      <h2>Verification Departments</h2>

      <input
        placeholder="Search department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="dept-list">
        {data.map((d) => (
          <div
            key={d.id}
            className="dept-row"
            onClick={() => navigate(`${base}/verifications/${d.id}`)}
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