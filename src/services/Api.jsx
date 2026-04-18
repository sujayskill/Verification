const BASE_URL = "http://localhost:8081";

export const api = {
  get: async (url) => {
    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 HANDLE ERROR RESPONSE
    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return []; // prevent crash
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
      body: JSON.stringify(body),
    });

    return res.json();
  },

  delete: async (url) => {
    const token = localStorage.getItem("token");

    await fetch(BASE_URL + url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
