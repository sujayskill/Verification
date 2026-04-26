import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";

export default function Reports() {
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/platform/verifications/reports/clients").then((data) => {
      if (!Array.isArray(data)) return;

      const groupedData = {};

      data.forEach((v) => {
        if (!groupedData[v.orgId]) {
          groupedData[v.orgId] = {
            name: v.organizationName,
            list: [],
          };
        }

        groupedData[v.orgId].list.push(v);
      });

      setGrouped(groupedData);
    });
  }, []);

  const filtered = Object.entries(grouped).filter(([orgId, value]) =>
    value.name.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="reports-container">
      <h2>Clients Reports</h2>

      <input
        placeholder="Search client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="reports-list">
        {filtered.map(([orgId, value]) => (
          <div
            key={orgId}
            className="report-row"
            onClick={() => navigate(`/platform/reports/${orgId}`)}
          >
            <h4
              dangerouslySetInnerHTML={{
                __html: highlight(value.name),
              }}
            />
            <p>{value.list.length} Candidates</p>
          </div>
        ))}
      </div>
    </div>
  );
}
