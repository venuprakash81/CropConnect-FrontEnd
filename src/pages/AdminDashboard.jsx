import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
const navigate = useNavigate();
const adminEmail = sessionStorage.getItem("adminEmail");

const [showNotifications, setShowNotifications] = useState(false);

const notifications = [
    {
        id: 1,
        icon: "👨‍🌾",
        title: "New Farmer Registration",
        message: "A new farmer has registered.",
        time: "Recently"
    },
    {
        id: 2,
        icon: "🛒",
        title: "New Buyer Registration",
        message: "A new buyer has joined CropConnect.",
        time: "Recently"
    },
    {
        id: 3,
        icon: "📦",
        title: "New Crop Booking",
        message: "A new crop booking requires attention.",
        time: "Recently"
    }
];

const features = [
    { icon: "👨‍🌾", title: "Manage Farmers", path: "/admin/farmers" },
    { icon: "🛒", title: "Manage Buyers", path: "/admin/buyers" },
    { icon: "🌾", title: "Manage Crops", path: "/admin/crops" },
    { icon: "🚚", title: "Transporters", path: "/admin/transporters" },
    { icon: "🏬", title: "Warehouses", path: "/admin/warehouses" },
    { icon: "📦", title: "Crop Bookings", path: "/admin/bookings" },
    { icon: "📊", title: "Market Prices", path: "/admin/market-prices" },
    { icon: "🗨️", title: "Chats", path: "/admin/reports" },
    { icon: "🤖", title: "AI chat", path: "/cropconnect-ai" }
];

const handleLogout = () => {
    sessionStorage.removeItem("adminEmail");
    navigate("/admin/login");
};

return (
    <div className="admin-dashboard-page">

        <header className="admin-dashboard-header">

            <div className="admin-brand">
                <div className="admin-logo">🌱</div>
                <div className="admin-brand-text">
                    <h2>CropConnect</h2>
                    <span>Smart Agriculture Management</span>
                </div>
            </div>

            <div className="admin-dashboard-title">
                <h1>Admin Dashboard</h1>
            </div>

            <div className="admin-header-actions">

                {/* NOTIFICATIONS */}
                <div className="admin-notification-container">
                    <button
                        className="admin-notification-button"
                        onClick={() =>
                            setShowNotifications(!showNotifications)
                        }
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                    >
                        🔔
                        <span className="admin-notification-dot"></span>
                    </button>

                    {showNotifications && (
                        <div className="admin-notification-dropdown">
                            <div className="admin-notification-heading">
                                <h3>Notifications</h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            {notifications.map((notification) => (
                                <div
                                    className="admin-notification-item"
                                    key={notification.id}
                                >
                                    <div className="admin-notification-icon">
                                        {notification.icon}
                                    </div>
                                    <div className="admin-notification-content">
                                        <strong>{notification.title}</strong>
                                        <p>{notification.message}</p>
                                        <span>{notification.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SETTINGS */}
                <button
                    className="admin-settings-button"
                    onClick={() => navigate("/admin/settings")}
                    aria-label="Settings"
                    title="Settings"
                >
                    ⚙️
                </button>

                {/* PROFILE */}
                <div className="admin-profile">
                    <div className="admin-profile-icon">👤</div>
                    <div className="admin-profile-info">
                        <strong>Administrator</strong>
                        <span>{adminEmail || "Admin"}</span>
                    </div>
                </div>

                {/* LOGOUT */}
                <button
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    ↪ Logout
                </button>
            </div>
        </header>

        <main className="admin-dashboard-main">

            <section className="admin-welcome">
                <div>
                    <span className="admin-welcome-label">
                        ADMIN CONTROL PANEL
                    </span>
                    <h2>Welcome, Admin! 👋</h2>
                    <p>
                        Manage farmers, buyers, crops, transport,
                        warehouses and all CropConnect activities
                        from one place.
                    </p>
                </div>
                <div className="admin-welcome-icon">🌿</div>
            </section>

            <section className="admin-section-heading">
                <div>
                    <h2>Management Modules</h2>
                    <p>Select a module to continue</p>
                </div>
                <span className="admin-module-count">
                    9 Modules
                </span>
            </section>

            <section className="admin-dashboard-grid">
                {features.map((feature, index) => (
                    <button
                        key={index}
                        className="admin-dashboard-card"
                        onClick={() => navigate(feature.path)}
                    >
                        <div className={`admin-card-icon icon-${index + 1}`}>
                            {feature.icon}
                        </div>
                        <span className="admin-card-title">
                            {feature.title}
                        </span>
                        <span className="admin-card-arrow">→</span>
                    </button>
                ))}
            </section>

            <section className="admin-dashboard-message">
                <div className="admin-message-icon">🌱</div>
                <div>
                    <h3>CropConnect Administration</h3>
                    <p>
                        Keep your agricultural supply chain organized
                        by monitoring platform activities and managing
                        all registered users.
                    </p>
                </div>
            </section>

        </main>

        <footer className="admin-dashboard-footer">
            <p>© {new Date().getFullYear()} CropConnect</p>
            <span>Admin Management Portal</span>
        </footer>

    </div>
);
}

export default AdminDashboard;