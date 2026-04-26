import { useEffect } from "react";

export const useAutoLogout = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();

      const timeout = expiryTime - currentTime;

      if (timeout <= 0) {
        logout();
      } else {
        setTimeout(logout, timeout);
      }
    } catch (err) {
      console.error("Invalid token");
      logout();
    }
  }, []);
};

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};