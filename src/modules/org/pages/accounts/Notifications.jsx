import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";

export default function Notifications() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/org/notifications").then(setList);
  }, []);

  return (
    <div className="card">
      <h3>🔔 Notifications</h3>

      {list.map((n) => (
        <div key={n.id}>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
