import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import "../../styles/Metrics.css";

export default function Metrics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/SLA/metrics/sla").then(setData);
  }, []);

  // 🔥 PROCESS DATA

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // convert "dd-MM-yyyy HH:mm" → ISO
    const [date, time] = dateStr.split(" ");
    const [day, month, year] = date.split("-");

    return new Date(`${year}-${month}-${day}T${time}:00`);
  };

  const clientMap = {};
  let breached = 0,
    warning = 0,
    normal = 0;

  const trendMap = {};

  data.forEach((v) => {
    const created = parseDate(v.createdAt);
    const now = new Date();

    const diffDays = (now - created) / (1000 * 60 * 60 * 24);

    let status = "normal";

    if (v.slaBreached || diffDays > 7) {
      status = "breached";
      breached++;
    } else if (diffDays >= 5) {
      status = "warning";
      warning++;
    } else {
      normal++;
    }

    // 🔹 CLIENT-WISE
    if (!clientMap[v.organizationName]) {
      clientMap[v.organizationName] = {
        name: v.organizationName,
        normal: 0,
        warning: 0,
        breached: 0,
      };
    }

    clientMap[v.organizationName][status]++;

    // 🔹 TREND
    if (!created || isNaN(created)) return;
    const day = created.toISOString().split("T")[0];

    if (!trendMap[day]) {
      trendMap[day] = { date: day, count: 0 };
    }

    trendMap[day].count++;
  });

  const clientData = Object.values(clientMap);
  const trendData = Object.values(trendMap);

  const pieData = [
    { name: "On Time", value: normal },
    { name: "At Risk", value: warning },
    { name: "Breached", value: breached },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="metrics-page">
      <h2>SLA Metrics Dashboard</h2>

      <div className="metrics-grid">
        {/* 📊 BAR CHART */}
        <div className="card">
          <h3>SLA per Client</h3>
          <BarChart width={500} height={300} data={clientData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="normal" stackId="a" fill="#22c55e" />
            <Bar dataKey="warning" stackId="a" fill="#f59e0b" />
            <Bar dataKey="breached" stackId="a" fill="#ef4444" />
          </BarChart>
        </div>

        {/* 🥧 PIE CHART */}
        <div className="card">
          <h3>Overall SLA Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* 📈 LINE CHART */}
        <div className="card full">
          <h3>SLA Trend</h3>
          <LineChart width={900} height={300} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#6366f1" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
