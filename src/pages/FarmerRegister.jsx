
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./FarmerRegister.css";

// ========================================
// FIX LEAFLET MARKER ICON
// ========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ========================================
// MAP LOCATION MARKER
// ========================================

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null;
};

// ========================================
// INITIAL FORM DATA
// ========================================

const initialFormData = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  alternativePhone: "",
  aadhaarNumber: "",
  dateOfBirth: "",
  village: "",
  mandal: "",
  district: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
  totalLand: "",
  landUnit: "Acres",
};

// ========================================
// FARMER REGISTER
// ========================================

const FarmerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [position, setPosition] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // MAP LOCATION
  // ========================================

  const handleMapLocation = (location) => {
    setPosition(location);

    setFormData((prev) => ({
      ...prev,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    }));
  };

  // ========================================
  // CURRENT LOCATION
  // ========================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        handleMapLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);

        alert(
          "Unable to get your current location. Allow location access or select your farm on the map."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ========================================
  // PROFILE PHOTO
  // ========================================

  const handleProfilePhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProfilePhoto(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      setProfilePhoto(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be smaller than 5 MB.");
      e.target.value = "";
      setProfilePhoto(null);
      return;
    }

    setProfilePhoto(file);
  };

  // ========================================
  // VALIDATE FORM
  // ========================================

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Please enter full name.");
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must contain exactly 10 digits.");
      return false;
    }

    if (
      formData.alternativePhone &&
      !/^\d{10}$/.test(formData.alternativePhone)
    ) {
      alert("Alternative phone must contain exactly 10 digits.");
      return false;
    }

    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      alert("Aadhaar number must contain exactly 12 digits.");
      return false;
    }

    const requiredFields = [
      ["village", "village"],
      ["mandal", "mandal"],
      ["district", "district"],
      ["state", "state"],
    ];

    for (const [field, label] of requiredFields) {
      if (!formData[field].trim()) {
        alert(`Please enter ${label}.`);
        return false;
      }
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Please enter a valid 6-digit PIN code.");
      return false;
    }

    if (!formData.latitude || !formData.longitude) {
      alert("Please select your farm location on the map.");
      return false;
    }

    if (
      !Number.isFinite(Number(formData.totalLand)) ||
      Number(formData.totalLand) <= 0
    ) {
      alert("Please enter a valid total land area.");
      return false;
    }

    if (
      formData.dateOfBirth &&
      new Date(formData.dateOfBirth) > new Date()
    ) {
      alert("Date of birth cannot be in the future.");
      return false;
    }

    return true;
  };

  // ========================================
  // REGISTER FARMER
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      const farmerData = {
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        village: formData.village.trim(),
        mandal: formData.mandal.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
      };

      // JSON part expected by Spring Boot
      data.append(
        "farmer",
        new Blob([JSON.stringify(farmerData)], {
          type: "application/json",
        })
      );

      // Optional profile photo
      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      const response = await fetch(
        "https://cropconnect-backend-exn7.onrender.com/api/farmers/register",
        {
          method: "POST",
          body: data,
        }
      );

      const responseText = await response.text();

      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = { message: responseText };
        }
      }

      console.log("Registration HTTP status:", response.status);

      // ========================================
      // SUCCESS
      // ========================================

      if (response.ok) {
        alert("🌱 Farmer registered successfully! Please log in.");

        setFormData({ ...initialFormData });
        setProfilePhoto(null);

        const fileInput = document.getElementById(
          "farmer-profile-photo"
        );

        if (fileInput) {
          fileInput.value = "";
        }

        navigate("/farmer-login", { replace: true });
        return;
      }

      // ========================================
      // ERROR HANDLING
      // ========================================

      const message =
        result.message ||
        result.error ||
        "";

      console.error("Registration response:", result);

      if (
        response.status === 409 ||
        /duplicate entry|already registered|email.*already exists/i.test(
          message
        )
      ) {
        alert(
          "This email is already registered. Please log in or use another email."
        );
        return;
      }

      if (response.status === 400) {
        alert(
          message ||
            "Invalid registration details. Please check your information."
        );
        return;
      }

      if (response.status >= 500) {
        alert(
          "The server encountered an error. Please try again. If the farmer was already saved, check the database before registering again."
        );
        return;
      }

      alert(
        message ||
          `Registration failed. HTTP status: ${response.status}`
      );
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Unable to connect to the backend. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // PAGE UI — EXISTING CSS CLASS NAMES
  // ========================================

  return (
    <div className="farmer-register-page">
      <div className="register-top-buttons">
        <button
          type="button"
          className="register-home-button"
          onClick={() => navigate("/")}
        >
          🏠 Home
        </button>

        <button
          type="button"
          className="register-login-button"
          onClick={() => navigate("/farmer-login")}
        >
          🔐 Farmer Login
        </button>
      </div>

      <div className="register-container">
        <div className="register-header">
          <div className="logo">🌱</div>

          <div>
            <h1>CropConnect</h1>
            <p>Smart Farmer-to-Market Platform</p>
          </div>
        </div>

        <div className="form-title">
          <h2>Farmer Registration</h2>
          <p>
            Register your farm and connect directly with markets,
            buyers and transport services.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PERSONAL INFORMATION */}

          <div className="form-section">
            <div className="section-heading">
              <span>👤</span>
              <div>
                <h3>Personal Information</h3>
                <p>Enter your personal details</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>
                  Full Name <span>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email <span>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number <span>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Alternative Phone</label>
                <input
                  type="tel"
                  name="alternativePhone"
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Alternative number"
                  value={formData.alternativePhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Aadhaar Card Number <span>*</span>
                </label>
                <input
                  type="password"
                  name="aadhaarNumber"
                  maxLength={12}
                  inputMode="numeric"
                  placeholder="Enter 12 digit Aadhaar number"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group profile-group">
                <label>Profile Photo</label>
                <input
                  id="farmer-profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhoto}
                />
              </div>
            </div>
          </div>

          {/* ADDRESS INFORMATION */}

          <div className="form-section">
            <div className="section-heading">
              <span>📍</span>
              <div>
                <h3>Address Information</h3>
                <p>
                  Enter your residential and farm area details
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Village <span>*</span>
                </label>
                <input
                  type="text"
                  name="village"
                  placeholder="Enter village"
                  value={formData.village}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Mandal <span>*</span>
                </label>
                <input
                  type="text"
                  name="mandal"
                  placeholder="Enter mandal"
                  value={formData.mandal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  District <span>*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  State <span>*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  PIN Code <span>*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="Enter PIN code"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* FARM LOCATION */}

          <div className="form-section">
            <div className="section-heading">
              <span>🗺️</span>
              <div>
                <h3>Farm Location</h3>
                <p>
                  Click on the map to select your farm location
                </p>
              </div>
            </div>

            <div className="location-actions">
              <button
                type="button"
                className="location-button"
                onClick={getCurrentLocation}
              >
                📍 Use My Current Location
              </button>
            </div>

            <div className="map-container">
              <MapContainer
                center={[position.lat, position.lng]}
                zoom={5}
                scrollWheelZoom={true}
                className="farmer-map"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker
                  position={position}
                  setPosition={handleMapLocation}
                />
              </MapContainer>
            </div>

            <div className="coordinates">
              <div>
                <label>Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  readOnly
                />
              </div>

              <div>
                <label>Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* LAND DETAILS */}

          <div className="form-section">
            <div className="section-heading">
              <span>🌾</span>
              <div>
                <h3>Land Details</h3>
                <p>
                  Provide your total agricultural land information
                </p>
              </div>
            </div>

            <div className="land-row">
              <div className="form-group">
                <label>
                  Total Land <span>*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="totalLand"
                  placeholder="Enter total land"
                  value={formData.totalLand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Land Unit</label>
                <select
                  name="landUnit"
                  value={formData.landUnit}
                  onChange={handleChange}
                >
                  <option value="Acres">Acres</option>
                  <option value="Hectares">Hectares</option>
                  <option value="Guntas">Guntas</option>
                </select>
              </div>
            </div>
          </div>

          {/* REGISTER BUTTON */}

          <div className="submit-area">
            <button
              type="submit"
              className="register-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Registering..."
                : "🌱 Register as Farmer"}
            </button>

            <p>
              By registering, you agree to the CropConnect terms
              and conditions.
            </p>
          </div>

          {/* LOGIN LINK */}

          <div className="register-login-section">
            <p>Already have a Farmer account?</p>

            <button
              type="button"
              onClick={() => navigate("/farmer-login")}
            >
              🔐 Login to Farmer Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerRegister;
