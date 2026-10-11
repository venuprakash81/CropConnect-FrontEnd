import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

const WarehouseDashboard = () => {
    const navigate = useNavigate();

    const [warehouse, setWarehouse] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageFailed, setImageFailed] = useState(false);

    // LOAD LOGGED-IN WAREHOUSE
    useEffect(() => {
        let cancelled = false;

        const loadWarehouse = async () => {
            const saved = localStorage.getItem("cropconnectWarehouse");

            if (!saved) {
                navigate("/warehouse-login", { replace: true });
                return;
            }

            try {
                const savedWarehouse = JSON.parse(saved);
                const id = savedWarehouse.id || savedWarehouse.warehouseId;

                let response;

                if (id) {
                    response = await fetch(
                        `${API_BASE}/warehouses/${id}`
                    );
                } else if (savedWarehouse.email) {
                    response = await fetch(
                        `${API_BASE}/warehouses/email/${encodeURIComponent(
                            savedWarehouse.email
                        )}`
                    );
                } else {
                    throw new Error("Warehouse ID or email is missing.");
                }

                if (!response.ok) {
                    throw new Error(
                        `Warehouse request failed: ${response.status}`
                    );
                }

                const data = await response.json();

                if (cancelled) return;

                setWarehouse(data);
                setImageFailed(false);

                localStorage.setItem(
                    "cropconnectWarehouse",
                    JSON.stringify(data)
                );

                if (data.id != null) {
                    localStorage.setItem("warehouseId", String(data.id));
                }
            } catch (error) {
                console.error("Unable to load warehouse:", error);

                if (cancelled) return;

                // Keep showing the previously saved profile if the API fails.
                try {
                    const previous = JSON.parse(
                        localStorage.getItem("cropconnectWarehouse") || "null"
                    );

                    if (previous && (previous.id || previous.email)) {
                        setWarehouse(previous);
                    } else {
                        navigate("/warehouse-login", { replace: true });
                    }
                } catch {
                    navigate("/warehouse-login", { replace: true });
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadWarehouse();

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("cropconnectWarehouse");
        localStorage.removeItem("warehouseId");

        setWarehouse(null);
        setShowProfileMenu(false);

        navigate("/warehouse-login", { replace: true });
    };

    // UPLOADED REGISTRATION PROFILE IMAGE
    const getProfileImage = () => {
        if (!warehouse?.profilePhoto) {
            return null;
        }

        // Supports a full URL if one is stored instead of a filename.
        if (
            warehouse.profilePhoto.startsWith("https://") ||
            warehouse.profilePhoto.startsWith("http://")
        ) {
            return warehouse.profilePhoto;
        }

        return (
            `${API_BASE}/warehouses/profile-photo/` +
            encodeURIComponent(warehouse.profilePhoto)
        );
    };

    const warehouseName =
        warehouse?.warehouseName ||
        warehouse?.ownerName ||
        "Warehouse";

    const profileImage = getProfileImage();

    // LOADING
    if (loading) {
        return (
            <div className="farmer-dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading Warehouse Dashboard...</p>
            </div>
        );
    }

    if (!warehouse) {
        return (
            <div className="farmer-dashboard-loading">
                <p>Warehouse profile could not be loaded.</p>
                <button
                    type="button"
                    onClick={() =>
                        navigate("/warehouse-login", { replace: true })
                    }
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // DASHBOARD CARD
    const DashboardCard = ({ icon, title, onClick }) => (
        <button
            type="button"
            className="farmer-dashboard-card"
            onClick={onClick}
        >
            <div className="dashboard-card-icon">{icon}</div>
            <div className="dashboard-card-title">{title}</div>
        </button>
    );

    // PROFILE IMAGE
    const ProfileImage = ({ className = "farmer-profile-image" }) => (
        profileImage && !imageFailed ? (
            <img
                src={profileImage}
                alt="Warehouse profile"
                className={className}
                onError={() => setImageFailed(true)}
            />
        ) : (
            <div className="default-farmer-image">🏭</div>
        )
    );

    return (
        <div className="farmer-dashboard-page">

            {/* HEADER */}
            <header className="farmer-dashboard-header">

                {/* BRAND */}
                <div
                    className="cropconnect-brand"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/warehouse-dashboard")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            navigate("/warehouse-dashboard");
                        }
                    }}
                >
                    <div className="cropconnect-logo">🌱</div>

                    <div className="cropconnect-brand-text">
                        <h2>CropConnect</h2>
                        <span>Warehouse Platform</span>
                    </div>
                </div>

                {/* TITLE */}
                <div className="dashboard-title">
                    <h1>Warehouse Dashboard</h1>
                </div>

                {/* HEADER ACTIONS */}
                <div className="dashboard-header-actions">

                    <button
                        type="button"
                        className="notification-button"
                        title="Notifications"
                        onClick={() =>
                            navigate("/warehouse-notifications")
                        }
                    >
                        🔔
                        <span className="notification-dot"></span>
                    </button>

                    {/* CIRCULAR PROFILE */}
                    <div className="profile-container">

                        <button
                            type="button"
                            className="farmer-profile-button"
                            aria-label="Open warehouse profile menu"
                            aria-expanded={showProfileMenu}
                            onClick={() =>
                                setShowProfileMenu((previous) => !previous)
                            }
                        >
                            <div className="profile-image-wrapper">
                                <ProfileImage />
                            </div>

                            <div className="profile-name">
                                <strong>{warehouseName}</strong>
                                <span>Warehouse</span>
                            </div>

                            <span className="profile-arrow">▾</span>
                        </button>

                        {/* PROFILE DROPDOWN */}
                        {showProfileMenu && (
                            <div className="profile-dropdown">

                                <div className="dropdown-header">
                                    <div className="dropdown-profile-image">
                                        <ProfileImage />
                                    </div>

                                    <div className="dropdown-farmer-info">
                                        <strong>{warehouseName}</strong>
                                        <span>{warehouse.email}</span>
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate("/warehouse/profile");
                                    }}
                                >
                                    <span>👤</span>
                                    My Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate("/warehouse/edit-profile");
                                    }}
                                >
                                    <span>✏️</span>
                                    Edit Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate(
                                            "/warehouse/change-password"
                                        );
                                    }}
                                >
                                    <span>🔐</span>
                                    Change Password
                                </button>

                                <div className="dropdown-divider"></div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        navigate("/warehouse-settings");
                                    }}
                                >
                                    <span>⚙️</span>
                                    Settings
                                </button>

                                <button
                                    type="button"
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    <span>🚪</span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="farmer-dashboard-main">

                {/* WELCOME */}
                <section className="dashboard-welcome">
                    <div className="welcome-content">
                        <span className="welcome-small">
                            CROPCONNECT WAREHOUSE
                        </span>

                        <h2>Welcome, {warehouseName} 🏭</h2>

                        <p>
                            Manage your warehouse, storage capacity, crops,
                            bookings, services, payments and warehouse
                            operations from one place.
                        </p>
                    </div>

                    <div className="welcome-farmer-icon">
                        <ProfileImage />
                    </div>
                </section>

                {/* DASHBOARD BUTTONS */}
                <section className="dashboard-grid">

                    <DashboardCard
                        icon="📦"
                        title="My Orders"
                        onClick={() =>
                            navigate("/my-warehouse-bookings")
                        }
                    />

                    <DashboardCard
                        icon="👨‍🌾"
                        title="All Farmers"
                        onClick={() => navigate("/all-farmers")}
                    />

                    <DashboardCard
                        icon="🛒"
                        title="All Buyers"
                        onClick={() => navigate("/all-buyers")}
                    />

                    <DashboardCard
                        icon="🚚"
                        title="Book Transport"
                        onClick={() =>
                            navigate("/transport-management")
                        }
                    />

                    <DashboardCard
                        icon="🛠️"
                        title="Settings"
                        onClick={() => navigate("/warehouse/profile")}
                    />

                    <DashboardCard
                        icon="💰"
                        title="Payments & Earnings"
                        onClick={() => navigate("/warehouse-payments")}
                    />

                    <DashboardCard
                        icon="🏭"
                        title="Emergency Warehouse"
                        onClick={() => navigate("/book-warehouse")}
                    />

                    <DashboardCard
                        icon="💬"
                        title="Chats"
                        onClick={() => navigate("/warehouse-chats")}
                    />

                    <DashboardCard
                        icon="🤖"
                        title="AI Chat"
                        onClick={() => navigate("/cropconnect-ai")}
                    />

                </section>

                {/* MESSAGE */}
                <section className="dashboard-message">
                    <div className="dashboard-message-icon">🏭</div>

                    <div>
                        <h3>Smart Warehouse Management</h3>
                        <p>
                            Manage storage space, receive agricultural produce,
                            provide storage services and connect farmers and
                            buyers through CropConnect.
                        </p>
                    </div>
                </section>

            </main>

            {/* FOOTER */}
            <footer className="farmer-dashboard-footer">
                <p>© {new Date().getFullYear()} CropConnect</p>
                <span>Smart Farmer-to-Market Platform 🌾</span>
            </footer>

        </div>
    );
};

export default WarehouseDashboard;
