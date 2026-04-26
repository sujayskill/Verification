import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/Notifications.css";

export default function VendorNotifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/notifications/vendor").then(setData);
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/read/${id}`);
    setData((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="notif-page">
      <h2>Vendor Notifications</h2>

      {data.map((n) => (
        <div
          key={n.id}
          className={`notif-card ${!n.read ? "unread" : ""}`}
          onClick={() => markRead(n.id)}
        >
          <p>{n.message}</p>
          <span>{new Date(n.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
