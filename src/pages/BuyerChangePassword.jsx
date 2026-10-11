
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerPages.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";

function getLoggedInBuyerEmail() {
  return (
    localStorage.getItem("buyerEmail") ||
    sessionStorage.getItem("buyerEmail")
  );
}

export default function BuyerChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(event) {
    event.preventDefault();

    const email = getLoggedInBuyerEmail();

    if (!email) {
      navigate("/buyer-login", { replace: true });
      return;
    }

    setMessage("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/buyers/change-password/${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Password change failed.");
      }

      setSuccess(true);
      setMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="buyer-page">
      <main className="buyer-card buyer-password-card">
        <div className="buyer-list-heading">
          <div>
            <h2>🔐 Change Password</h2>
            <p>Keep your CropConnect account secure.</p>
          </div>

          <button
            type="button"
            className="buyer-secondary"
            onClick={() => navigate("/buyer-dashboard")}
          >
            Dashboard
          </button>
        </div>

        <form
          className="buyer-form buyer-form-single"
          onSubmit={handleChangePassword}
        >
          <label>
            Current Password
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.target.value)
              }
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              required
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
            />
          </label>

          {message && (
            <p className={success ? "buyer-success" : "buyer-error"}>
              {message}
            </p>
          )}

          <div className="buyer-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>

            <button
              type="button"
              className="buyer-secondary"
              onClick={() => navigate("/buyer-dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
