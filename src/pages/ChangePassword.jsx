
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const API_URL = "http://localhost:8081/api/farmers/change-password";

function getFarmerEmail() {
  try {
    const storedFarmer =
      localStorage.getItem("cropconnectFarmer") ||
      localStorage.getItem("farmer");

    if (storedFarmer) {
      const farmer = JSON.parse(storedFarmer);
      if (farmer?.email) {
        return farmer.email;
      }
    }
  } catch (error) {
    console.error("Unable to read farmer login details", error);
  }

  return localStorage.getItem("farmerEmail") || "";
}

export default function ChangePassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(getFarmerEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Enter your registered login email.");
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      setError("Password must contain 8 to 72 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must differ from current password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to change password."
        );
      }

      setMessage(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="farmer-password-page">
      <section className="farmer-password-card">
        <button
          type="button"
          className="farmer-password-back"
          onClick={() => navigate("/farmer-dashboard")}
        >
          &#8592; Back to Dashboard
        </button>

        <div className="farmer-password-icon" aria-hidden="true">
          &#128274;
        </div>

        <h1>Change Password</h1>

        <p className="farmer-password-subtitle">
          Keep your CropConnect farmer account secure.
        </p>

        {message && (
          <div className="farmer-password-success" role="status">
            {message}
          </div>
        )}

        {error && (
          <div className="farmer-password-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="farmer-password-field">
            <label htmlFor="farmer-password-email">
              Registered Login Email
            </label>
            <input
              id="farmer-password-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email"
              autoComplete="username"
              required
            />
          </div>

          <div className="farmer-password-field">
            <label htmlFor="farmer-current-password">
              Current Password
            </label>
            <input
              id="farmer-current-password"
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="farmer-password-field">
            <label htmlFor="farmer-new-password">
              New Password
            </label>
            <input
              id="farmer-new-password"
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <div className="farmer-password-field">
            <label htmlFor="farmer-confirm-password">
              Confirm New Password
            </label>
            <input
              id="farmer-confirm-password"
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <label className="farmer-password-show">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
            />
            Show passwords
          </label>

          <button
            type="submit"
            className="farmer-password-submit"
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Change Password"}
          </button>
        </form>

        <p className="farmer-password-note">
          Choose a unique password with at least 8 characters.
        </p>
      </section>
    </main>
  );
}
