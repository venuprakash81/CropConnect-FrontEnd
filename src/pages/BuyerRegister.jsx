
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BuyerRegister.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

// Map click handler
function LocationMarker({ position, onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null;
}

// Move map when location changes
function MapUpdater({ position }) {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 14);
    }
  }, [position, map]);

  return null;
}

const initialForm = {
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
  businessName: "",
  buyerType: "",
  businessAddress: "",
  gstNumber: "",
  cropInterested: "",
  requiredQuantity: "",
  quantityUnit: "Quintals",
  preferredPrice: "",
  latitude: "",
  longitude: "",
};

export default function BuyerRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleMapLocation = (location) => {
    setPosition(location);

    setFormData((previous) => ({
      ...previous,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setError("");

    navigator.geolocation.getCurrentPosition(
      (location) => {
        handleMapLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location permission denied. Allow location access in your browser."
            : "Unable to get your location. Select it directly on the map."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPG, PNG, or WEBP profile photo.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (
      formData.alternativePhone &&
      !/^\d{10}$/.test(formData.alternativePhone)
    ) {
      setError("Alternative phone must contain exactly 10 digits.");
      return;
    }

    if (
      formData.aadhaarNumber &&
      !/^\d{12}$/.test(formData.aadhaarNumber)
    ) {
      setError("Aadhaar number must contain exactly 12 digits.");
      return;
    }

    if (!formData.village.trim() ||
        !formData.mandal.trim() ||
        !formData.district.trim() ||
        !formData.state.trim()) {
      setError("Please complete your village, mandal, district and state.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("PIN code must contain exactly 6 digits.");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError("Select your business location on the map.");
      return;
    }

    if (
      formData.requiredQuantity &&
      Number(formData.requiredQuantity) <= 0
    ) {
      setError("Required quantity must be greater than zero.");
      return;
    }

    if (
      formData.preferredPrice &&
      Number(formData.preferredPrice) < 0
    ) {
      setError("Preferred price cannot be negative.");
      return;
    }

    const buyer = {
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      alternativePhone: formData.alternativePhone.trim() || null,
      aadhaarNumber: formData.aadhaarNumber.trim() || null,
      dateOfBirth: formData.dateOfBirth || null,
      businessName: formData.businessName.trim() || null,
      buyerType: formData.buyerType || null,
      businessAddress: formData.businessAddress.trim() || null,
      gstNumber: formData.gstNumber.trim() || null,
      cropInterested: formData.cropInterested.trim() || null,
      requiredQuantity: formData.requiredQuantity
        ? Number(formData.requiredQuantity)
        : null,
      preferredPrice: formData.preferredPrice
        ? Number(formData.preferredPrice)
        : null,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "buyer",
        new Blob([JSON.stringify(buyer)], {
          type: "application/json",
        })
      );

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      const response = await fetch(
        `${API_BASE}/buyers/register`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || `Registration failed (${response.status}).`
        );
      }

      setSuccess("Buyer registered successfully!");

      // Do not store the password or Aadhaar in browser storage.
      window.alert("Buyer registered successfully!");

      navigate("/buyer-login", { replace: true });
    } catch (err) {
      console.error("Buyer registration error:", err);

      setError(
        err.message ||
        "Could not connect to the backend. Check your Spring Boot server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-register-page">
      <div className="buyer-register-top-buttons">
        <button
          type="button"
          className="buyer-home-button"
          onClick={() => navigate("/")}
        >
          🏠 Home
        </button>

        <button
          type="button"
          className="buyer-login-button"
          onClick={() => navigate("/buyer-login")}
        >
          🔐 Buyer Login
        </button>
      </div>

      <main className="buyer-register-container">
        <header className="buyer-register-header">
          <div className="buyer-brand-logo">🌱</div>
          <div>
            <h1>CropConnect</h1>
            <p>Smart Farmer-to-Market Platform</p>
          </div>
        </header>

        <div className="buyer-form-title">
          <span className="buyer-eyebrow">JOIN CROPConnect</span>
          <h2>Buyer Registration</h2>
          <p>
            Register your business, discover agricultural produce,
            and connect directly with farmers.
          </p>
        </div>

        {error && (
          <div className="buyer-alert buyer-alert-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="buyer-alert buyer-alert-success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* PERSONAL INFORMATION */}
          <section className="buyer-form-section">
            <div className="buyer-section-heading">
              <span className="buyer-section-icon">👤</span>
              <div>
                <h3>Personal Information</h3>
                <p>Enter your contact and identification details.</p>
              </div>
            </div>

            <div className="buyer-form-grid">
              <div className="buyer-form-group buyer-full-width">
                <label htmlFor="buyer-fullName">
                  Full Name <span>*</span>
                </label>
                <input
                  id="buyer-fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-email">
                  Email Address <span>*</span>
                </label>
                <input
                  id="buyer-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-password">
                  Password <span>*</span>
                </label>
                <input
                  id="buyer-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-phone">
                  Phone Number <span>*</span>
                </label>
                <input
                  id="buyer-phone"
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-alternativePhone">
                  Alternative Phone
                </label>
                <input
                  id="buyer-alternativePhone"
                  type="tel"
                  name="alternativePhone"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.alternativePhone}
                  onChange={handleChange}
                  placeholder="Optional mobile number"
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-aadhaar">
                  Aadhaar Number
                </label>
                <input
                  id="buyer-aadhaar"
                  type="password"
                  name="aadhaarNumber"
                  inputMode="numeric"
                  maxLength={12}
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                  placeholder="Optional, 12 digits"
                  autoComplete="off"
                />
                <small>Optional. It will not be returned by your API.</small>
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-dob">Date of Birth</label>
                <input
                  id="buyer-dob"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="buyer-form-group buyer-full-width">
                <label htmlFor="buyer-photo">Profile Photo</label>
                <input
                  id="buyer-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <img
                    className="buyer-photo-preview"
                    src={photoPreview}
                    alt="Buyer profile preview"
                  />
                )}
                <small>JPG, PNG or WEBP; maximum 5 MB.</small>
              </div>
            </div>
          </section>

          {/* BUSINESS INFORMATION */}
          <section className="buyer-form-section">
            <div className="buyer-section-heading">
              <span className="buyer-section-icon">🏢</span>
              <div>
                <h3>Business Information</h3>
                <p>Tell farmers about your purchasing business.</p>
              </div>
            </div>

            <div className="buyer-form-grid">
              <div className="buyer-form-group">
                <label htmlFor="buyer-businessName">Business Name</label>
                <input
                  id="buyer-businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your company or shop"
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-buyerType">Buyer Type</label>
                <select
                  id="buyer-buyerType"
                  name="buyerType"
                  value={formData.buyerType}
                  onChange={handleChange}
                >
                  <option value="">Select buyer type</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Processor">Food Processor</option>
                  <option value="Exporter">Exporter</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Individual">Individual Buyer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="buyer-form-group buyer-full-width">
                <label htmlFor="buyer-businessAddress">
                  Business Address
                </label>
                <textarea
                  id="buyer-businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  placeholder="Shop, market, warehouse or office address"
                  rows={3}
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-gst">GST Number</label>
                <input
                  id="buyer-gst"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Optional GST number"
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-crop">Interested Crops</label>
                <input
                  id="buyer-crop"
                  name="cropInterested"
                  value={formData.cropInterested}
                  onChange={handleChange}
                  placeholder="Rice, cotton, maize..."
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-quantity">Required Quantity</label>
                <input
                  id="buyer-quantity"
                  type="number"
                  name="requiredQuantity"
                  min="0.01"
                  step="0.01"
                  value={formData.requiredQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-unit">Quantity Unit</label>
                <select
                  id="buyer-unit"
                  name="quantityUnit"
                  value={formData.quantityUnit}
                  onChange={handleChange}
                >
                  <option value="Quintals">Quintals</option>
                  <option value="Kilograms">Kilograms</option>
                  <option value="Tonnes">Tonnes</option>
                  <option value="Bags">Bags</option>
                </select>
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-price">Preferred Price (₹)</label>
                <input
                  id="buyer-price"
                  type="number"
                  name="preferredPrice"
                  min="0"
                  step="0.01"
                  value={formData.preferredPrice}
                  onChange={handleChange}
                  placeholder="Price per selected unit"
                />
              </div>
            </div>
          </section>

          {/* ADDRESS */}
          <section className="buyer-form-section">
            <div className="buyer-section-heading">
              <span className="buyer-section-icon">📍</span>
              <div>
                <h3>Address Information</h3>
                <p>Enter the location of your business.</p>
              </div>
            </div>

            <div className="buyer-form-grid">
              <div className="buyer-form-group">
                <label htmlFor="buyer-village">
                  Village / Town <span>*</span>
                </label>
                <input
                  id="buyer-village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-mandal">
                  Mandal <span>*</span>
                </label>
                <input
                  id="buyer-mandal"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-district">
                  District <span>*</span>
                </label>
                <input
                  id="buyer-district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-state">
                  State <span>*</span>
                </label>
                <input
                  id="buyer-state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-pincode">
                  PIN Code <span>*</span>
                </label>
                <input
                  id="buyer-pincode"
                  name="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  required
                />
              </div>
            </div>
          </section>

          {/* MAP LOCATION */}
          <section className="buyer-form-section">
            <div className="buyer-section-heading">
              <span className="buyer-section-icon">🗺️</span>
              <div>
                <h3>Choose Business Location</h3>
                <p>
                  Click anywhere on the map to place your marker,
                  or use your device's current location.
                </p>
              </div>
            </div>

            <div className="buyer-location-actions">
              <button
                type="button"
                className="buyer-location-button"
                onClick={getCurrentLocation}
              >
                📍 Use My Current Location
              </button>
              {position && (
                <button
                  type="button"
                  className="buyer-clear-location"
                  onClick={() => {
                    setPosition(null);
                    setFormData((previous) => ({
                      ...previous,
                      latitude: "",
                      longitude: "",
                    }));
                  }}
                >
                  Clear Location
                </button>
              )}
            </div>

            <div className="buyer-map-container">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom
                className="buyer-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater position={position} />
                <LocationMarker
                  position={position}
                  onSelect={handleMapLocation}
                />
              </MapContainer>
            </div>

            <p className="buyer-map-help">
              {position
                ? "Location selected successfully. You can click another point to change it."
                : "No location selected. Click the map or use your current location."}
            </p>

            <div className="buyer-coordinates">
              <div className="buyer-form-group">
                <label htmlFor="buyer-latitude">Latitude</label>
                <input
                  id="buyer-latitude"
                  value={formData.latitude}
                  placeholder="Select location on map"
                  readOnly
                />
              </div>

              <div className="buyer-form-group">
                <label htmlFor="buyer-longitude">Longitude</label>
                <input
                  id="buyer-longitude"
                  value={formData.longitude}
                  placeholder="Select location on map"
                  readOnly
                />
              </div>
            </div>
          </section>

          <div className="buyer-submit-area">
            <button
              type="submit"
              className="buyer-register-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "🌱 Register as Buyer"}
            </button>

            <p>
              By registering, you agree to the CropConnect terms
              and conditions.
            </p>
          </div>

          <div className="buyer-register-login-section">
            <p>Already have a Buyer account?</p>
            <button
              type="button"
              onClick={() => navigate("/buyer-login")}
            >
              🔐 Login to Buyer Account
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
