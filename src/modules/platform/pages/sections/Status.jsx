import { useEffect, useState } from "react";
import { api } from "../../../../services/Api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import "../../styles/Status.css";

export default function VerificationStatusDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/platform/verifications/summary").then((res) => {
      const chartData = Object.keys(res).map((org) => ({
        name: org,
        INITIATED: res[org].INITIATED || 0,
        IN_PROGRESS: res[org].IN_PROGRESS || 0,
        COMPLETED: res[org].COMPLETED || 0,
        FAILED: res[org].FAILED || 0,
      }));

      setData(chartData);
    });
  }, []);

  return (
    <div className="content">
      <h2>Verification Analytics</h2>

      <div className="card chart-card">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="INITIATED" />
            <Bar dataKey="IN_PROGRESS" />
            <Bar dataKey="COMPLETED" />
            <Bar dataKey="FAILED" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}