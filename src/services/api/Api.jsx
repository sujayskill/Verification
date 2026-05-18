const BASE_URL = "http://localhost:8081";

let isRefreshing = false;
let refreshSubscribers = [];
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) =>
    callback(newToken)
  );
  refreshSubscribers = [];
};

/* =========================
   LOGOUT
========================= */

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(JSON.parse(atob(token.split(".")[1])));
    if (token) {
      await fetch(BASE_URL + "/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }

  localStorage.clear();
  window.location.href = "/login";
};

/* =========================
   REFRESH TOKEN
========================= */

const refreshAccessToken = async () => {
  // already refreshing
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;
  try {
    const refreshToken =
      localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logoutUser();
      return null;
    }
    const res = await fetch(
      BASE_URL + "/auth/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Refresh failed");
    }
    const data = await res.json();
    // SAVE TOKENS
    localStorage.setItem(
      "token",
      data.accessToken
    );
    localStorage.setItem(
      "refreshToken",
      data.refreshToken
    );

    // notify waiting requests
    onRefreshed(data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.error("REFRESH FAILED:", err);
    logoutUser();
    return null;
  } finally {
    isRefreshing = false;
  }
};

/* =========================
   COMMON REQUEST METHOD
========================= */

const request = async (
  url,
  method = "GET",
  body = null,
  retry = true,
) => {

  const isAuthRoute =
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout");

  let token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    let res = await fetch(BASE_URL + url, options);

    /* =========================
       ACCESS TOKEN EXPIRED
    ========================= */
    if (
      res.status === 401 &&
      retry &&
      !isAuthRoute
    ) {
      const newToken = await refreshAccessToken();
      console.log("TOKEN EXPIRED -> REFRESHING");

      if (!newToken) {
        return null;
      }

      // retry original request
      options.headers.Authorization =
        `Bearer ${newToken}`;
      res = await fetch(BASE_URL + url, options);
    }

    /* =========================
       STILL UNAUTHORIZED
    ========================= */

    if (res.status === 401) {
      logoutUser();
      return null;
    }

    /* =========================
       OTHER ERRORS
    ========================= */

    if (!res.ok) {
      const errorData =
        await res.json().catch(() => ({}));
      throw {
        status: res.status,
        data: errorData,
      };
    }
    return res.json().catch(() => ({}));
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
};

/* =========================
   API METHODS
========================= */
export const api = {
  get: (url) => request(url, "GET"),
  post: (url, body) => request(url, "POST", body),
  put: (url, body) => request(url, "PUT", body),
  delete: (url) => request(url, "DELETE"),
};