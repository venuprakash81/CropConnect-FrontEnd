import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

const BuyerDashboard = () => {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const readSavedValue = (key) =>
    localStorage.getItem(key) || sessionStorage.getItem(key);

  const saveBuyerData = (buyerData) => {
    const storage = localStorage.getItem("buyer")
      ? localStorage
      : sessionStorage;

    const otherStorage =
      storage === localStorage ? sessionStorage : localStorage;

    [
      "buyer",
      "cropconnectBuyer",
      "buyerEmail",
      "buyerId",
      "buyerName",
      "userEmail",
    ].forEach((key) => otherStorage.removeItem(key));

    storage.setItem("buyer", JSON.stringify(buyerData));
    storage.setItem("cropconnectBuyer", JSON.stringify(buyerData));

    if (buyerData.email) {
      storage.setItem("buyerEmail", buyerData.email);
      storage.setItem("userEmail", buyerData.email);
    }

    if (buyerData.id != null) {
      storage.setItem("buyerId", String(buyerData.id));
    }

    storage.setItem("buyerName", buyerData.fullName || "");
  };

  useEffect(() => {
    let active = true;

    const loadBuyer = async () => {
      let savedBuyer = null;

      try {
        const stored =
          readSavedValue("buyer") ||
          readSavedValue("cropconnectBuyer");

        if (stored) {
          savedBuyer = JSON.parse(stored);
        }
      } catch (error) {
        console.error("Could not read saved buyer:", error);
      }

      const email =
        savedBuyer?.email ||
        readSavedValue("buyerEmail") ||
        readSavedValue("userEmail");

      if (!email) {
        navigate("/buyer-login", { replace: true });
        return;
      }

      if (active) {
        setBuyer({ ...(savedBuyer || {}), email });
      }

      try {
        const response = await fetch(
          `${API_BASE}/buyers/email/${encodeURIComponent(email)}`
        );

        if (!response.ok) {
          throw new Error(`Profile request failed: ${response.status}`);
        }

        const latestBuyer = await response.json();

        const buyerData = {
          ...(savedBuyer || {}),
          ...latestBuyer,
          email: latestBuyer.email || email,
        };

        if (active) {
          setBuyer(buyerData);
          setImageFailed(false);
          saveBuyerData(buyerData);
        }
      } catch (error) {
        console.error("Could not refresh buyer profile:", error);
      }
    };

    loadBuyer();

    return () => {
      active = false;
    };
  }, [navigate]);

  const getBuyerName = () =>
    buyer?.fullName || buyer?.name || "Buyer";

  // Use the backend photo endpoint.
  const getProfileImage = () => {
    if (!buyer?.id || !buyer?.profilePhoto || imageFailed) {
      return null;
    }

    // Support an absolute image URL if the backend stores one.
    if (/^https?:\/\//i.test(buyer.profilePhoto)) {
      return buyer.profilePhoto;
    }

    return `${API_BASE}/buyers/${buyer.id}/photo`;
  };

  const handleLogout = () => {
    [
      "buyer",
      "cropconnectBuyer",
      "buyerId",
      "buyerEmail",
      "buyerName",
      "userEmail",
      "email",
      "name",
      "role",
      "userRole",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    setBuyer(null);
    setShowProfileMenu(false);
    navigate("/buyer-login", { replace: true });
  };

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

  // Reusable circular profile image.
  const ProfileAvatar = ({ large = false }) => {
    const imageUrl = getProfileImage();

    return (
      <div
        className={`buyer-avatar-image ${
          large ? "buyer-avatar-large" : ""
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${getBuyerName()}'s profile`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>{getBuyerName().charAt(0).toUpperCase()}</span>
        )}
      </div>
    );
  };

  if (!buyer) {
    return (
      <div className="farmer-dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading Buyer Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="farmer-dashboard-page buyer-dashboard-page">
      <header className="farmer-dashboard-header">
        <div
          className="cropconnect-brand"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/buyer-dashboard")}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              navigate("/buyer-dashboard");
            }
          }}
        >
          <div className="cropconnect-logo">🌱</div>

          <div className="cropconnect-brand-text">
            <h2>CropConnect</h2>
            <span>Buyer Platform</span>
          </div>
        </div>

        <div className="dashboard-title">
          <h1>Buyer Dashboard</h1>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="notification-button"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => navigate("/buyer-notifications")}
          >
            🔔
            <span className="notification-dot" />
          </button>

          <div className="profile-container">
            <button
              type="button"
              className="farmer-profile-button"
              onClick={() =>
                setShowProfileMenu((previous) => !previous)
              }
              aria-expanded={showProfileMenu}
            >
              <div className="profile-image-wrapper">
                <ProfileAvatar />
              </div>

              <div className="profile-name">
                <strong>{getBuyerName()}</strong>
                <span>Buyer</span>
              </div>

              <span className="profile-arrow">
                {showProfileMenu ? "▴" : "▾"}
              </span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-profile-image">
                    <ProfileAvatar large />
                  </div>

                  <div className="dropdown-farmer-info">
                    <strong>{getBuyerName()}</strong>
                    <span>{buyer.email}</span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/buyer-profile");
                  }}
                >
                  <span>👤</span> My Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/buyer-edit-profile");
                  }}
                >
                  <span>✏️</span> Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/buyer-change-password");
                  }}
                >
                  <span>🔐</span> Change Password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/settings");
                  }}
                >
                  <span>⚙️</span> Settings
                </button>

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="farmer-dashboard-main">
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <span className="welcome-small">
              CROPCONNECT BUYER
            </span>

            <h2>Welcome, {getBuyerName()} 🛒</h2>

            <p>
              Browse fresh crops, connect with farmers, manage your
              orders, arrange transportation, book warehouse storage,
              and track your purchases from one dashboard.
            </p>
          </div>

          <div className="welcome-farmer-icon buyer-welcome-avatar">
            <ProfileAvatar large />
          </div>
        </section>

        <section className="dashboard-grid">
          <DashboardCard
            icon="🌾"
            title="All Crops"
            onClick={() => navigate("/all-crops")}
          />

          <DashboardCard
            icon="📦"
            title="My Orders"
            onClick={() => navigate("/my-orders")}
          />

          <DashboardCard
            icon="👨‍🌾"
            title="See All Farmers"
            onClick={() => navigate("/all-farmers")}
          />

          <DashboardCard
            icon="🚚"
            title="Book Transporter"
            onClick={() => navigate("/transport-management")}
          />

          <DashboardCard
            icon="🏭"
            title="Book Warehouse"
            onClick={() => navigate("/book-warehouse")}
          />

          <DashboardCard
            icon="📈"
            title="Market Prices"
            onClick={() => navigate("/market-prices")}
          />

          <DashboardCard
            icon="💬"
            title="Chat"
            onClick={() => navigate("/chat")}
          />

          <DashboardCard
            icon="💳"
            title="Payments & Rewards"
            onClick={() => navigate("/buyer-payments")}
          />

          <DashboardCard
            icon="🤖"
            title="AI Chat"
            onClick={() => navigate("/cropconnect-ai")}
          />
        </section>

        <section className="dashboard-message">
          <div className="dashboard-message-icon">🌱</div>

          <div>
            <h3>Grow With CropConnect</h3>
            <p>
              Connect directly with farmers, discover quality produce,
              and manage your agricultural purchases in one place.
            </p>
          </div>
        </section>
      </main>

      <footer className="farmer-dashboard-footer">
        <p>© {new Date().getFullYear()} CropConnect</p>
        <span>Smart Farmer-to-Market Platform 🌾</span>
      </footer>
    </div>
  );
};

export default BuyerDashboard;
