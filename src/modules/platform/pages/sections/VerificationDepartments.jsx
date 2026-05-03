import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationDepartments.css";

export default function VerificationDepartments() {
  const [notifications, setNotifications] = useState({});
  const { orgId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await api.get(`/departments/platform/by-org?orgId=${orgId}`);
    setData(Array.isArray(res) ? res : []);
    // console.log(res);
    // console.log("hello");
  };

  const fetchDeptNotifications = async () => {
    try {
      const data = await api.get(
        `/vendor/notifications/count/departments?orgId=${orgId}`,
      );

      console.log("🔥 RAW DATA:", data, typeof data);

      if (!data || Object.keys(data).length === 0) {
        console.warn("⚠ Empty response from API");
        return;
      }

      const normalized = {};
      Object.keys(data).forEach((key) => {
        normalized[String(key)] = data[key];
      });

      console.log("✅ FINAL NOTIFICATIONS:", normalized);

      setNotifications(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  const openDepartment = async (deptId) => {
    const key = String(deptId);

    setNotifications((normalized) => {
      const updated = { ...normalized };
      delete updated[key];
      return updated;
    });

    // try {
    //   await api.put(`/vendor/notifications/mark-read/${orgId}/${deptId}`);
    // } catch (err) {
    //   console.error(err);
    // }
    // console.log("marked as read");

    navigate(`/platform/verifications/${orgId}/${deptId}`);
  };

  useEffect(() => {
    fetchDeptNotifications();
  }, [orgId]);

  useEffect(() => {
    let isMounted = true;
    const safeFetch = async () => {
      const data = await api.get(
        `/vendor/notifications/count/departments?orgId=${orgId}`,
      );
      if (!isMounted) return;
      if (data && Object.keys(data).length > 0) {
        const normalized = {};
        Object.keys(data).forEach((key) => {
          normalized[String(key)] = data[key];
        });
        setNotifications(normalized);
      }
    };
    safeFetch();
    const interval = setInterval(safeFetch, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orgId]);

  useEffect(() => {
    fetchData();
  }, [orgId]);
  const filtered = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="vr-page">
      <div className="vr-header">
        <h1>TEST CHANGE</h1>
        <button onClick={() => navigate("/platform/verifications")}>
          ← Back
        </button>

        <h2>Departments</h2>

        <input
          placeholder="Search department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="vr-grid">
        {filtered.map((d) => {
          const key = String(d.id);

          return (
            <div
              key={d.id}
              className={`vr-card ${notifications[key] ? "highlight" : ""}`}
              onClick={() => openDepartment(d.id)}
            >
              {notifications[key] && (
                <span className="notif-badge">
                  {notifications[key] > 3 ? "3+" : notifications[key]}
                </span>
              )}

              <h3 dangerouslySetInnerHTML={{ __html: highlight(d.name) }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
