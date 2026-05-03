import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import { getSlaMeta, formatTimeLeft } from "../../../../utils/SlaHelper";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import "../../styles/VerificationCX.css";

export default function VerificationCX() {
  const [newItems, setNewItems] = useState({});
  const { orgId, deptId } = useParams();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({});

  const [now, setNow] = useState(Date.now());
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  console.log("org", orgId);
  const fetchData = async () => {
    try {
      // console.log("Calling API with:", orgId, search);
      const res = await api.get(
        `/vendor/platform/verifications/by-department?orgId=${orgId}&deptId=${deptId}&q=${search}`,
      );
      // console.log("API RES:", res);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVerificationNotifications = async () => {
    try {
      const data = await api.get(
        `/vendor/notifications/count/verifications?orgId=${orgId}&deptId=${deptId}`,
      );

      if (!data || Object.keys(data).length === 0) return;

      const normalized = {};
      Object.keys(data).forEach((key) => {
        normalized[String(key)] = data[key];
      });

      setNotifications(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVerificationNotifications();
  }, [orgId, deptId]);

  useEffect(() => {
    const interval = setInterval(fetchVerificationNotifications, 10000);
    return () => clearInterval(interval);
  }, [orgId, deptId]);

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
            onClick={() =>
              navigate(`/platform/verifications/${orgId}/departments`)
            }
          >
            ← Back
          </button>
          <h2>{data[0]?.organizationName || "Candidates"} - Department</h2>{" "}
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
            onClick={async () => {
              const key = String(v.id);
              // ✅ remove notification locally
              setNotifications((prev) => {
                const copy = { ...prev };
                copy[key] = 0;
                return copy;
              });
              try {
                await api.put(
                  `/vendor/notifications/mark-read/${orgId}/${deptId}/verification/${v.id}`,
                );
              } catch (err) {
                console.error(err);
              }
              navigate(`/platform/verifications/verificationCX/${v.id}`);
            }}
          >
            {/* 🔥 TOP ROW (BEST PLACE FOR BADGE) */}
            <div className="card-header">
              <h4
                dangerouslySetInnerHTML={{
                  __html: highlight(v.candidateName),
                }}
              />
              {/* ✅ NEW BADGE HERE */}
              {notifications[v.id] && <span className="new-badge">NEW</span>}
            </div>

            {/* EMAIL */}
            <p
              className="email"
              dangerouslySetInnerHTML={{
                __html: highlight(v.candidateEmail),
              }}
            />

            {/* STATUS */}
            <span className={`status ${v.status.toLowerCase()}`}>
              {v.status}
            </span>

            {/* SLA */}
            <div className={`sla-badge ${sla.class}`}>{sla.label}</div>
          </div>
        );
      })}
    </div>
  );
}
