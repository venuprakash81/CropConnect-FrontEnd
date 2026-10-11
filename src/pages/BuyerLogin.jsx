
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerLogin.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

export default function BuyerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const loginEmail = email.trim().toLowerCase();

    if (!loginEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/buyers/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: password,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Invalid email or password."
        );
      }

      const buyer = result.buyer || result;
      const buyerId = result.buyerId ?? buyer.id;
      const buyerEmail = result.email || buyer.email || loginEmail;

      if (buyerId == null || !buyerEmail) {
        throw new Error(
          "Buyer ID or email was not returned by the backend."
        );
      }

      const safeBuyer = { ...buyer };

      delete safeBuyer.password;
      delete safeBuyer.aadhaarNumber;

      const keys = [
        "buyer",
        "cropconnectBuyer",
        "buyerData",
        "buyerId",
        "buyerEmail",
        "buyerName",
        "userEmail",
      ];

      keys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      const storage = rememberMe ? localStorage : sessionStorage;

      storage.setItem("buyer", JSON.stringify(safeBuyer));
      storage.setItem("buyerData", JSON.stringify(safeBuyer));
      storage.setItem("cropconnectBuyer", buyerEmail);
      storage.setItem("buyerId", String(buyerId));
      storage.setItem("buyerEmail", buyerEmail);
      storage.setItem("buyerName", safeBuyer.fullName || "");
      storage.setItem("userEmail", buyerEmail);

      // Show success alert after successful login.
      setPassword("");
      setSuccess("Login Successfully! Welcome to CropConnect.");

      // Navigate only after the user sees the success message.
      window.setTimeout(() => {
        navigate("/buyer-dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Buyer login error:", err);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transporter-login-page buyer-login-page">
      <button
        type="button"
        className="transporter-home-button"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>

      <div className="transporter-login-card">
        <div className="transporter-login-header">
          <div className="transporter-login-icon">🌾</div>

          <h1>Buyer Login</h1>

          <p>
            Welcome back to CropConnect.
            <br />
            Connect with farmers and source fresh produce.
          </p>
        </div>

        {/* Success alert using the existing login page classes */}
        {success && (
          <div className="buyer-login-success" role="alert">
            <span className="buyer-success-icon">✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="buyer-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="transporter-form-group">
            <label htmlFor="buyer-login-email">
              Email Address
            </label>

            <input
              id="buyer-login-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              disabled={loading || Boolean(success)}
            />
          </div>

          <div className="transporter-form-group">
            <label htmlFor="buyer-login-password">
              Password
            </label>

            <input
              id="buyer-login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={loading || Boolean(success)}
            />
          </div>

          <div className="transporter-login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                disabled={loading || Boolean(success)}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="transporter-login-button"
            disabled={loading || Boolean(success)}
          >
            {loading
              ? "Signing in..."
              : success
                ? "✓ Login Successful"
                : "🔐 Login as Buyer"}
          </button>
        </form>

        <div className="transporter-no-account">
          <p>Don't have a Buyer account?</p>

          <button
            type="button"
            onClick={() => navigate("/buyer-register")}
            disabled={loading || Boolean(success)}
          >
            🌱 Create Buyer Account
          </button>
        </div>

        <div className="other-login">
          <p>Looking for another account?</p>

          <div className="other-login-buttons">
            <button
              type="button"
              onClick={() => navigate("/farmer-login")}
            >
              🌾 Farmer
            </button>

            <button
              type="button"
              onClick={() => navigate("/transporter-login")}
            >
              🚚 Transporter
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
