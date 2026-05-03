import React, { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";

export default function VendorAccount() {
  const [profile, setProfile] = useState({});
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/users/me");
    setProfile(res);
  };

  const updatePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await api.put("/users/change-password", password);
    alert("Password updated");
  };

  const forgotPassword = async () => {
    await api.post("/auth/forgot-password", {
      email: profile.email,
    });
    alert("Reset link sent");
  };

  return (
    <div className="account-page">
      <h2>My Account</h2>

      {/* PROFILE */}
      <div className="card">
        <h3>Profile</h3>
        <input value={profile.name || ""} readOnly />
        <input value={profile.email || ""} readOnly />
      </div>

      {/* PASSWORD */}
      <div className="card">
        <h3>Change Password</h3>

        {!forgotMode ? (
          <>
            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) =>
                setPassword({ ...password, confirmPassword: e.target.value })
              }
            />

            <button onClick={updatePassword}>Update Password</button>

            <p
              className="link"
              onClick={() => setForgotMode(true)}
            >
              Forgot password?
            </p>
          </>
        ) : (
          <>
            <p>Reset password via email</p>
            <button onClick={forgotPassword}>
              Send Reset Link
            </button>

            <p className="link" onClick={() => setForgotMode(false)}>
              Back to change password
            </p>
          </>
        )}
      </div>
    </div>
  );
}