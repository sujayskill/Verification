import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationCX.css";
import { getSlaMeta, formatTimeLeft } from "../../../../utils/SlaHelper";

export default function VerificationCandidates() {
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [now, setNow] = useState(Date.now());
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  console.log("org", orgId);
  const fetchData = async () => {
    try {
      console.log("Calling API with:", orgId, search);
      const res = await api.get(
        `/platform/verifications/search/candidates?orgId=${orgId}&q=${search}`,
      );
      console.log("API RES:", res);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ⏱ LIVE TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orgId) fetchData();
  }, [search, orgId]);

  const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlight = (text) => {
    if (!search || !text) return text;

    const safeSearch = escapeRegex(search);
    const regex = new RegExp(`(${safeSearch})`, "gi");

    return text.replace(regex, "<mark>$1</mark>");
  };

  // 🔥 SLA COLOR
  const getSlaDetails = (v) => {
    if (!v.createdAt) return { class: "sla-normal", label: "🟢 On Time" };
    const created = new Date(v.createdAt);
    const now = new Date();
    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
    // 🔥 BREACHED (7 days passed OR backend flag)
    if (v.slaBreached || diffDays > 7) {
      return { class: "sla-breached", label: "🔥 SLA Breached" };
    }
    // ⚠️ AT RISK (5-7 days)
    if (diffDays >= 5) {
      return { class: "sla-warning", label: "🟡 At Risk" };
    }
    // ✅ ON TIME
    return { class: "sla-normal", label: "🟢 On Time" };
  };

  return (
    <div className="vr-page">
      <div className="vr-header">
        <div className="vr-left">
          <button
            className="back-btn"
            onClick={() => navigate("/platform/verifications")}
          >
            ← Back
          </button>

          <h2>{data[0]?.organizationName || "Candidates"} - Candidates</h2>
        </div>

        <div className="vr-search">
          <input
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {data.map((v) => {
        const sla = getSlaDetails(v);

        return (
          <div
            key={v.id}
            className={`candidate-card ${sla.class}`}
            onClick={() =>
              navigate(`/platform/verifications/verificationCX/${v.id}`)
            }
          >
            <div className="sla-section">
              <div className={`sla-badge ${sla.class}`}>{sla.label}</div>

              <div className="sla-timer">
                ⏱ {formatTimeLeft(sla.remainingMs)}
              </div>
            </div>
            <h4
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateName),
              }}
            />

            <p
              className="email"
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateEmail),
              }}
            />

            <p>ID: {v.candidateId}</p>

            <span className={`status ${v.status.toLowerCase()}`}>
              {v.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
