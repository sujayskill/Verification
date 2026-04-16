const BASE_URL = "http://localhost:8081";

export const api = {
  get: async (url) => {
    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.json();
  }, 

  post: async (url, body) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    // ✅ ONLY attach token if exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return res.json();
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
