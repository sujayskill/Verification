const SLA_DAYS = 7;

export const getSlaMeta = (v) => {
  if (!v.createdAt) {
    return {
      class: "sla-normal",
      label: "🟢 On Time",
      remainingMs: 0,
    };
  }

  const created = new Date(v.createdAt);
  const now = new Date();

  const deadline = new Date(created);
  deadline.setDate(deadline.getDate() + SLA_DAYS);

  const remainingMs = deadline - now;

  const remainingDays = remainingMs / (1000 * 60 * 60 * 24);

  // 🔥 BREACHED
  if (remainingMs <= 0 || v.slaBreached) {
    return {
      class: "sla-breached",
      label: "🔥 SLA Breached",
      remainingMs,
    };
  }

  // ⚠️ WARNING (last 2 days)
  if (remainingDays <= 2) {
    return {
      class: "sla-warning",
      label: "🟡 At Risk",
      remainingMs,
    };
  }

  // ✅ NORMAL
  return {
    class: "sla-normal",
    label: "🟢 On Time",
    remainingMs,
  };
};

// ⏱ FORMAT COUNTDOWN
export const formatTimeLeft = (ms) => {
  if (ms <= 0) return "Expired";

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);

  return `${days}d ${hours}h ${mins}m`;
};


export const getSlaStats = (list) => {
  let normal = 0,
    warning = 0,
    breached = 0;

  list.forEach((v) => {
    const sla = getSlaMeta(v);

    if (sla.class === "sla-normal") normal++;
    else if (sla.class === "sla-warning") warning++;
    else breached++;
  });

  return { normal, warning, breached };
};