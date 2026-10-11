
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransporterPages.css";

const API = "http://localhost:8081/api/transporters";

export default function ChangeTransporterPassword() {
  const navigate = useNavigate();
  const id = localStorage.getItem("transporterId");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(previous => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!id) {
      navigate("/transporter/login");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/${id}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      setMessage(data.message || "Password changed successfully.");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tp-page">
      <header className="tp-header">
        <div>
          <h2>AgriTransport</h2>
          <span>Account Security</span>
        </div>
        <button className="tp-secondary"
          onClick={() => navigate("/transporter/dashboard")}>
          ← Dashboard
        </button>
      </header>

      <main className="tp-container tp-password-container">
        <section className="tp-section">
          <h1>Change Password</h1>
          <p>Enter your current password before choosing a new one.</p>

          {error && <div className="tp-alert tp-error">{error}</div>}
          {message && <div className="tp-alert tp-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <label className="tp-field">
              <span>Current Password</span>
              <input type="password" name="currentPassword"
                value={form.currentPassword} onChange={handleChange}
                autoComplete="current-password" required />
            </label>

            <label className="tp-field">
              <span>New Password</span>
              <input type="password" name="newPassword"
                value={form.newPassword} onChange={handleChange}
                autoComplete="new-password" minLength={8} required />
            </label>

            <label className="tp-field">
              <span>Confirm New Password</span>
              <input type="password" name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                autoComplete="new-password" minLength={8} required />
            </label>

            <div className="tp-form-actions">
              <button type="button" className="tp-secondary"
                onClick={() => navigate("/transporter/profile")}>
                Cancel
              </button>
              <button type="submit" className="tp-primary"
                disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
