
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransporterPages.css";

const API = "http://localhost:8081/api/transporters";

const sections = {
  "Personal Details": [
    ["fullName", "Full Name"], ["email", "Email"],
    ["phone", "Phone"], ["alternativePhone", "Alternative Phone"],
    ["dateOfBirth", "Date of Birth"],
    ["aadhaarNumber", "Aadhaar Number"],
    ["drivingLicenceNumber", "Driving Licence Number"],
  ],
  "Business Details": [
    ["businessName", "Business Name"],
    ["transporterType", "Transporter Type"],
    ["gstNumber", "GST Number"],
    ["yearsOfExperience", "Experience (years)"],
    ["businessAddress", "Business Address"],
  ],
  "Address Details": [
    ["village", "Village"], ["mandal", "Mandal"],
    ["district", "District"], ["state", "State"],
    ["pincode", "PIN Code"],
  ],
  "Vehicle Details": [
    ["vehicleNumber", "Vehicle Number"],
    ["vehicleType", "Vehicle Type"],
    ["vehicleModel", "Vehicle Model"],
    ["vehicleCapacity", "Vehicle Capacity"],
    ["capacityUnit", "Capacity Unit"],
    ["vehicleOwnership", "Ownership"],
    ["fuelType", "Fuel Type"],
    ["coldStorageAvailable", "Cold Storage"],
    ["perishableGoodsSupported", "Perishable Goods"],
  ],
  "Pricing Details": [
    ["baseCharge", "Base Charge"],
    ["pricePerKm", "Price per KM"],
    ["pricePerQuintal", "Price per Quintal"],
    ["minimumTripCharge", "Minimum Trip Charge"],
  ],
  "Availability and Location": [
    ["availableDays", "Available Days"],
    ["availableTime", "Available Time"],
    ["maximumTravelDistance", "Maximum Travel Distance"],
    ["currentlyAvailable", "Currently Available"],
    ["latitude", "Latitude"], ["longitude", "Longitude"],
  ],
  "Documents": [
    ["drivingLicenceFile", "Driving Licence File"],
    ["vehicleRCFile", "Vehicle RC File"],
    ["insuranceFile", "Insurance File"],
    ["fitnessCertificateFile", "Fitness Certificate"],
    ["pollutionCertificateFile", "Pollution Certificate"],
  ],
};

export default function TransporterProfile() {
  const navigate = useNavigate();
  const id = localStorage.getItem("transporterId");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/transporter/login");
      return;
    }

    fetch(`${API}/${id}/profile`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }
        return data;
      })
      .then(setProfile)
      .catch(err => setError(err.message));
  }, [id, navigate]);

  if (error) return <div className="tp-message tp-error">{error}</div>;
  if (!profile) return <div className="tp-message">Loading profile...</div>;

  const photo = profile.profilePhoto
    ? `${API}/profile-photo/${encodeURIComponent(profile.profilePhoto)}`
    : null;

  return (
    <div className="tp-page">
      <header className="tp-header">
        <div>
          <h2>AgriTransport</h2>
          <span>My Profile</span>
        </div>
        <button className="tp-secondary"
          onClick={() => navigate("/transporter/dashboard")}>
          ← Dashboard
        </button>
      </header>

      <main className="tp-container">
        <section className="tp-profile-banner">
          {photo ? (
            <img className="tp-avatar" src={photo} alt="Profile"
              onError={e => {
                e.currentTarget.style.display = "none";
              }} />
          ) : (
            <div className="tp-avatar tp-avatar-placeholder">
              {profile.fullName?.charAt(0)?.toUpperCase() || "T"}
            </div>
          )}

          <div className="tp-profile-heading">
            <h1>{profile.fullName}</h1>
            <p>{profile.email}</p>
            <span className="tp-status">
              {profile.currentlyAvailable || "Availability not set"}
            </span>
          </div>

          <div className="tp-profile-buttons">
            <button className="tp-primary"
              onClick={() => navigate("/transporter/edit-profile")}>
              Edit Profile
            </button>
            <button className="tp-secondary"
              onClick={() => navigate("/transporter/change-password")}>
              Change Password
            </button>
          </div>
        </section>

        {Object.entries(sections).map(([title, fields]) => (
          <section className="tp-section" key={title}>
            <h2>{title}</h2>
            <div className="tp-details-grid">
              {fields.map(([key, label]) => (
                <div className="tp-detail" key={key}>
                  <span>{label}</span>
                  <strong>
                    {profile[key] !== null &&
                    profile[key] !== undefined &&
                    profile[key] !== ""
                      ? String(profile[key])
                      : "Not provided"}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        ))}

        <button className="tp-secondary"
          onClick={() => navigate("/transporter/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}
