import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Departments.css";

export default function Departments({ onSelect }) {
  const navigate = useNavigate();
  const base = getBasePath();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  const fetchData = async () => {
    const res = await api.get(`/departments?q=${search}`);
    setData(res);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const addDepartment = async () => {
    if (!name) return;
    await api.post("/departments", { name });
    setName("");
    fetchData();
  };

  const deleteDepartment = async (id) => {
    await api.delete(`/departments/${id}`);
    fetchData();
  };

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="dept-page">
      <div className="dept-header">
        <h2>Departments</h2>

        <div className="actions">
          <input
            placeholder="Search department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            placeholder="Add department..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => navigate(`${base}/departments/new`)}>
            + Add Department
          </button>
        </div>
      </div>

      <div className="dept-list">
        {data.map((d) => (
          <div key={d.id} className="dept-row">
            <div
              className="dept-name"
              dangerouslySetInnerHTML={{
                __html: highlight(d.name),
              }}
              onClick={() => navigate(`${base}/candidates/${d.id}`)}
            />

            {/* ⋮ MENU */}
            <div className="menu">
              <span onClick={() => setMenuOpen(d.id)}>⋮</span>

              {menuOpen === d.id && (
                <div className="menu-dropdown">
                  <button>Edit</button>
                  <button onClick={() => deleteDepartment(d.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
