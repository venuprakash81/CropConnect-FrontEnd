
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WarehousePages.css";

const API = "http://localhost:8081/api/warehouses";

export default function WarehouseChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("Choose a different password.");
      return;
    }

    const saved = JSON.parse(
      localStorage.getItem("cropconnectWarehouse") || "{}"
    );

    const id = saved.id || saved.warehouseId || saved.warehouse?.id;

    if (!id) {
      navigate("/warehouse-login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/${id}/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully. Please use the new password next time you log in.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wh-page">
      <header className="wh-header">
        <div>
          <div className="wh-brand">CropConnect</div>
          <span>Account Security</span>
        </div>
        <button
          className="wh-btn wh-btn-light"
          onClick={() => navigate("/warehouse/dashboard")}
        >
          Dashboard
        </button>
      </header>

      <main className="wh-container wh-password-container">
        <section className="wh-form-card">
          <div className="wh-password-icon">⌑</div>
          <p className="wh-eyebrow">SECURITY SETTINGS</p>
          <h1>Change Password</h1>
          <p className="wh-muted">
            Protect your account with a new password of at least 8 characters.
          </p>

          {error && <div className="wh-alert">{error}</div>}
          {success && <div className="wh-success">{success}</div>}

          <form onSubmit={submit}>
            <label className="wh-field">
              Current Password
              <input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </label>

            <label className="wh-field">
              New Password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </label>

            <label className="wh-field">
              Confirm New Password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </label>

            <button className="wh-btn wh-btn-full" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

            <button
              className="wh-btn wh-btn-outline wh-btn-full"
              type="button"
              onClick={() => navigate("/warehouse/dashboard")}
            >
              Back to Dashboard
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
