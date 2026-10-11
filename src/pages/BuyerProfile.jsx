
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerPages.css";

const API = "http://localhost:8081/api";
const SERVER = "http://localhost:8081";

function getBuyerEmail() {
  return (
    localStorage.getItem("buyerEmail") ||
    sessionStorage.getItem("buyerEmail")
  );
}

function getBuyerImage(photo) {
  if (!photo) return "";

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://") ||
    photo.startsWith("data:")
  ) {
    return photo;
  }

  return `${SERVER}/${photo.replace(/^\/+/, "")}`;
}

const profileSections = [
  {
    title: "Personal Information",
    fields: [
      ["fullName", "Full Name"],
      ["email", "Email Address"],
      ["phone", "Phone Number"],
      ["alternativePhone", "Alternative Phone"],
      ["dateOfBirth", "Date of Birth"],
    ],
  },
  {
    title: "Address Information",
    fields: [
      ["village", "Village"],
      ["mandal", "Mandal"],
      ["district", "District"],
      ["state", "State"],
      ["pincode", "Pincode"],
      ["latitude", "Latitude"],
      ["longitude", "Longitude"],
    ],
  },
  {
    title: "Business Information",
    fields: [
      ["businessName", "Business Name"],
      ["buyerType", "Buyer Type"],
      ["businessAddress", "Business Address"],
      ["gstNumber", "GST Number"],
      ["cropInterested", "Crops Interested In"],
      ["requiredQuantity", "Required Quantity"],
      ["quantityUnit", "Quantity Unit"],
      ["preferredPrice", "Preferred Price"],
    ],
  },
];

export default function BuyerProfile() {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const email = getBuyerEmail();

    if (!email) {
      navigate("/buyer-login", { replace: true });
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch(
          `${API}/buyers/email/${encodeURIComponent(email)}`
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load buyer profile."
          );
        }

        const profile = data.buyer || data;

        if (!cancelled) {
          setBuyer(profile);

          // Keep the stored buyer data up to date.
          const storage = localStorage.getItem("buyerEmail")
            ? localStorage
            : sessionStorage;

          const safeProfile = { ...profile };
          delete safeProfile.password;
          delete safeProfile.aadhaarNumber;

          storage.setItem("buyer", JSON.stringify(safeProfile));
          storage.setItem("buyerData", JSON.stringify(safeProfile));
          storage.setItem(
            "buyerName",
            safeProfile.fullName || ""
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load profile.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleLogout() {
    const keys = [
      "buyer",
      "buyerData",
      "cropconnectBuyer",
      "buyerId",
      "buyerEmail",
      "buyerName",
      "userEmail",
      "cropconnectBuyerEmail",
    ];

    keys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    navigate("/buyer-login", { replace: true });
  }

  if (loading) {
    return <div className="buyer-loading">Loading buyer profile...</div>;
  }

  if (error) {
    return (
      <div className="buyer-page">
        <main className="buyer-card">
          <h2>Buyer Profile</h2>
          <p className="buyer-error">{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button
            type="button"
            className="buyer-secondary"
            onClick={() => navigate("/buyer-dashboard")}
          >
            Dashboard
          </button>
        </main>
      </div>
    );
  }

  const imageUrl = getBuyerImage(buyer.profilePhoto);

  return (
    <div className="buyer-page">
      <main className="buyer-card">
        <div className="buyer-list-heading">
          <div>
            <h2>My Buyer Profile</h2>
            <p>View your CropConnect account information.</p>
          </div>

          <button
            type="button"
            className="buyer-secondary"
            onClick={() => navigate("/buyer-dashboard")}
          >
            Dashboard
          </button>
        </div>

        <section className="buyer-profile-hero">
          <div className="buyer-profile-avatar">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${buyer.fullName || "Buyer"} profile`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>
                {buyer.fullName
                  ? buyer.fullName.charAt(0).toUpperCase()
                  : "👤"}
              </span>
            )}
          </div>

          <div className="buyer-profile-heading">
            <h2>{buyer.fullName || "Buyer"}</h2>
            <p>{buyer.email || getBuyerEmail()}</p>
            <span className="buyer-profile-badge">
              {buyer.buyerType || "Registered Buyer"}
            </span>
          </div>
        </section>

        <div className="buyer-actions buyer-profile-actions">
          <button
            type="button"
            onClick={() => navigate("/buyer-edit-profile")}
          >
            ✏️ Edit Profile
          </button>

          <button
            type="button"
            className="buyer-secondary"
            onClick={() => navigate("/buyer-change-password")}
          >
            🔒 Change Password
          </button>

          <button
            type="button"
            className="buyer-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {profileSections.map((section) => (
          <section className="buyer-profile-section" key={section.title}>
            <h3>{section.title}</h3>

            <div className="buyer-profile-grid">
              {section.fields.map(([key, label]) => (
                <div className="buyer-profile-item" key={key}>
                  <span>{label}</span>
                  <strong>
                    {buyer[key] !== null &&
                    buyer[key] !== undefined &&
                    buyer[key] !== ""
                      ? String(buyer[key])
                      : "Not provided"}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
