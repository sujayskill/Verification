const BASE_URL = "http://localhost:8081";

// 🔥 CENTRAL LOGOUT HANDLER
const handleAuthError = (status) => {
  if (status === 401 || status === 403) {
    localStorage.clear();
    // redirect to login
    window.location.href = "/login";
  }
};

export const api = {
  get: async (url) => {
    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL + url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired. Please login again.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return [];
    }

    return res.json();
  },

  post: async (url, body) => {
    const token = localStorage.getItem("token");
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      handleAuthError(res.status);
      throw { status: res.status, data };
    }

    return data;
  },

  put: async (url, body) => {
    const token = localStorage.getItem("token");
    const res = await fetch(BASE_URL + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }), // ✅ ONLY SEND IF EXISTS
    });
    if (!res.ok) {
      handleAuthError(res.status);
    }
    return res.json().catch(() => ({})); // ✅ prevent crash
  },

  delete: async (url) => {
    const token = localStorage.getItem("token");
    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      handleAuthError(res.status);
    }
  },
};
