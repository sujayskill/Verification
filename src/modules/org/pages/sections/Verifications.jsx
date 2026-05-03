import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import { useParams } from "react-router-dom";
import "../../styles/Verifications.css";

export default function Verifications() {
  const navigate = useNavigate();
  const base = getBasePath();
  const { deptId } = useParams();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 FETCH API
  const fetchData = async () => {
    try {
      const res = await api.get(
        `/org/verifications/by-department/${deptId}?q=${search}`,
      );
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  // 🔥 HIGHLIGHT FUNCTION
  const highlight = (text) => {
    if (!search || !text) return text;

    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="content">
      <button onClick={() => navigate(`${base}/verifications`)}>
        ← Back to Departments
      </button>
      <h2>Verification Status</h2>

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* LIST */}
      {data.map((v) => (
        <div key={v.id} className="card">
          <h4
            dangerouslySetInnerHTML={{
              __html: highlight(v.candidateName),
            }}
          />
          <h5>{v.candidateEmail}</h5> {/* 👈 Added email under name */}
          {/* 🔥 TIMELINE */}
          <div className="timeline">
            {["INITIATED", "IN_PROGRESS", "COMPLETED"].map((step) => (
              <span
                key={step}
                className={`step ${v.status === step ? "active" : ""}`}
              >
                {step}
              </span>
            ))}
          </div>
          <p>Status: {v.status}</p>
          <p>
            <b>Vendor Note:</b> {v.comment || "No updates yet"}
          </p>
          {v.status === "COMPLETED" && v.reportUrl && (
            <a
              href={`http://localhost:8081/org/verifications/download/${v.id}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Download Report
            </a>
          )}
        </div>
      ))}

      {/* 🔥 PAGINATION */}
    </div>
  );
}
