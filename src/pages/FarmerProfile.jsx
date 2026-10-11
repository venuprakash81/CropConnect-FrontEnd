import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Sprout,
  Map,
  CalendarDays,
  CreditCard,
  Edit3,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import "./FarmerProfile.css";

const API_BASE = "http://localhost:8081/api";

export default function FarmerProfile() {
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFarmer = async () => {
      try {
        const savedFarmer = JSON.parse(
          localStorage.getItem("cropconnectFarmer") ||
          localStorage.getItem("farmer") ||
          "null"
        );

        // Prefer the email belonging to the successful login.
        const email =
          localStorage.getItem("farmerEmail") ||
          savedFarmer?.email;

        if (!email) {
          setError("Login email not found. Please log in again.");
          return;
        }

        const response = await fetch(
          `${API_BASE}/farmers/by-email?email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load farmer profile.");
        }

        setFarmer(data);

        // Keep the latest profile details locally.
        localStorage.setItem("farmerId", String(data.id));
        localStorage.setItem("farmerEmail", data.email);
        localStorage.setItem("farmer", JSON.stringify(data));
        localStorage.setItem("cropconnectFarmer", JSON.stringify(data));
      } catch (err) {
        setError(err.message || "Failed to load farmer details.");
      } finally {
        setLoading(false);
      }
    };

    loadFarmer();
  }, []);

  if (loading) {
    return (
      <div className="fp-status">
        <LoaderCircle className="fp-spinner" size={30} />
        <p>Loading your farmer profile...</p>
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="fp-error">
        <AlertCircle size={28} />
        <h3>Profile unavailable</h3>
        <p>{error || "Farmer details could not be found."}</p>
        <button onClick={() => navigate("/farmer-login")}>
          Return to Login
        </button>
      </div>
    );
  }

  const photoUrl = farmer.profilePhoto
    ? `${API_BASE}/farmers/profile-photo/${encodeURIComponent(
        farmer.profilePhoto
      )}`
    : null;

  const initials = (farmer.fullName || "Farmer")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const address = [
    farmer.village,
    farmer.mandal,
    farmer.district,
    farmer.state,
    farmer.pincode,
  ]
    .filter((value) => value !== null && value !== undefined && value !== "")
    .join(", ");

  const aadhaar = farmer.aadhaarNumber
    ? `XXXX-XXXX-${String(farmer.aadhaarNumber).slice(-4)}`
    : "Not provided";

  const details = [
    { label: "Full Name", value: farmer.fullName, icon: UserRound },
    { label: "Email Address", value: farmer.email, icon: Mail },
    { label: "Phone Number", value: farmer.phone, icon: Phone },
    {
      label: "Alternative Phone",
      value: farmer.alternativePhone,
      icon: Phone,
    },
    {
      label: "Date of Birth",
      value: farmer.dateOfBirth,
      icon: CalendarDays,
    },
    { label: "Aadhaar Number", value: aadhaar, icon: CreditCard },
  ];

  return (
    <main className="fp-page">
      <header className="fp-heading">
        <div>
          <span className="fp-eyebrow">CROPCONNECT · FARMER ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Your personal details and agricultural information</p>
        </div>
<button
          className="fp-edit-button"
          onClick={() => navigate("/farmer-dashboard")}
        >
     
          ⬅Dashboard
        </button>
        <button
          className="fp-edit-button"
          onClick={() => navigate("/edit-profile")}
        >
          <Edit3 size={17} />
          Edit Profile
        </button>
        
      </header>

      <section className="fp-card">
        <div className="fp-banner">
          <div className="fp-avatar">
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Farmer"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <span>{initials}</span>
          </div>

          <div className="fp-identity">
            <h2>{farmer.fullName || "Farmer"}</h2>
            <p><Mail size={16} /> {farmer.email}</p>
            <span className="fp-badge">
              <Sprout size={15} /> Registered Farmer
            </span>
          </div>

          <span className="fp-id">Farmer ID: {farmer.id}</span>
        </div>

        <div className="fp-content">
          <SectionTitle icon={UserRound} title="Personal Information" />

          <div className="fp-grid">
            {details.map(({ label, value, icon: Icon }) => (
              <div className="fp-detail" key={label}>
                <span className="fp-detail-icon">
                  <Icon size={19} />
                </span>
                <div>
                  <label>{label}</label>
                  <p>{value || "Not provided"}</p>
                </div>
              </div>
            ))}
          </div>

          <SectionTitle icon={MapPin} title="Farm Location" />

          <div className="fp-address">
            <MapPin size={22} />
            <div>
              <label>Complete Address</label>
              <p>{address || "Address not provided"}</p>
            </div>
          </div>

          <div className="fp-coordinate-grid">
            <div>
              <label>Latitude</label>
              <p>{farmer.latitude ?? "Not provided"}</p>
            </div>
            <div>
              <label>Longitude</label>
              <p>{farmer.longitude ?? "Not provided"}</p>
            </div>
          </div>

          <SectionTitle icon={Sprout} title="Agricultural Information" />

          <div className="fp-land">
            <span className="fp-land-icon"><Map size={25} /></span>
            <div>
              <label>Total Agricultural Land</label>
              <p>
                {farmer.totalLand ?? "Not provided"}
                {farmer.totalLand != null && farmer.landUnit
                  ? ` ${farmer.landUnit}`
                  : ""}
              </p>
            </div>
          </div>

          <footer className="fp-footer">
            <span>🌱 Your farm, your profile, your CropConnect account.</span>
            <button
              className="fp-edit-button"
              onClick={() => navigate("/edit-profile")}
            >
              <Edit3 size={16} /> Edit My Details
            </button>
          </footer>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="fp-section-title">
      <Icon size={20} />
      <h3>{title}</h3>
    </div>
  );
}