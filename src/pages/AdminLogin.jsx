import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(
            "http://localhost:8081/api/admin/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Invalid email or password.");
            return;
        }

        sessionStorage.setItem("adminEmail", data.email);
        navigate("/admin/dashboard");
    } catch (err) {
        setError("Server connection failed. Please try again.");
    } finally {
        setLoading(false);
    }
};

return (
    <div className="cc-admin-page">
        <div className="cc-admin-background-shape shape-one"></div>
        <div className="cc-admin-background-shape shape-two"></div>

        <div className="cc-admin-card">
            <div className="cc-admin-brand">
                <div className="cc-admin-logo">
                    <span>🌱</span>
                </div>
                <h1>Crop<span>Connect</span></h1>
                <p>Smart Agriculture Management</p>
            </div>

            <div className="cc-admin-divider"></div>

            <div className="cc-admin-heading">
                <div className="cc-admin-lock">🔐</div>
                <h2>Admin Login</h2>
                <p>Welcome back! Sign in to your admin account.</p>
            </div>

            <form onSubmit={handleLogin}>
                <div className="cc-admin-input-group">
                    <label htmlFor="adminEmail">Email Address</label>
                    <div className="cc-admin-input-wrapper">
                        <span className="cc-admin-input-icon">✉</span>
                        <input
                            id="adminEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>
                </div>

                <div className="cc-admin-input-group">
                    <label htmlFor="adminPassword">Password</label>
                    <div className="cc-admin-input-wrapper">
                        <span className="cc-admin-input-icon">🔑</span>
                        <input
                            id="adminPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="cc-admin-show-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="cc-admin-error" role="alert">
                        <span>⚠</span> {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="cc-admin-submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="cc-admin-spinner"></span>
                            Signing in...
                        </>
                    ) : (
                        <>Sign In <span>→</span></>
                    )}
                </button>
            </form>

            <div className="cc-admin-footer">
                <span className="cc-admin-footer-icon">🛡️</span>
                Secure administrator access
            </div>
        </div>

        <p className="cc-admin-copyright">
            © {new Date().getFullYear()} CropConnect. All rights reserved.
        </p>
    </div>
);
}

export default AdminLogin;