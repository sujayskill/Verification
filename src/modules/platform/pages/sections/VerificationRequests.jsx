import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/VerificationRequests.css";

export default function VerificationRequests() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await api.get(`/platform/verifications/clients?q=${search}`);

      setData(res.content || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchData, 400);
    return () => clearTimeout(delay);
  }, [search]);

  // 🔥 HIGHLIGHT
  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="vr-page">
      {/* 🔍 SEARCH */}
      <div className="vr-header">
        <h2>Verification Requests</h2>
        <div className="vr-search">
          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <p style={{ marginTop: "20px", color: "#888" }}>
          No organizations found
        </p>
      )}

      {/* LIST */}
      <div className="vr-grid">
        {data.map((org) => (
          <div
            key={org.orgId}
            className="vr-card"
            onClick={() => navigate(`/platform/verifications/${org.orgId}`)}
          >
            <h3
              dangerouslySetInnerHTML={{
                __html: highlight(org.organizationName),
              }}
            />
            <p>{org.count} Requests</p>
          </div>
        ))}
      </div>
    </div>
  );
}
