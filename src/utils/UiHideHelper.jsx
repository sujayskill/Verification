// utils/AuthHelper.js

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role; // depends on your JWT structure
  } catch (e) {
    return null;
  }
};