
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
import "./WarehouseRegister.css";

// =====================================================
// API
// =====================================================
const API = "https://cropconnect-backend-exn7.onrender.com/api";
const DEFAULT_POSITION = { lat: 17.385, lng: 78.4867 };

// =====================================================
// FIX LEAFLET MARKER
// =====================================================
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// =====================================================
// MAP POSITION UPDATER
// =====================================================
function MapPositionUpdater({ position }) {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 14);
    }
  }, [map, position]);

  return null;
}

// =====================================================
// LOCATION MARKER
// =====================================================
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} />
  ) : null;
}

// =====================================================
// INITIAL FORM
// Matches the supplied Warehouse Java entity
// =====================================================
const initialFormData = {
  warehouseName: "",
  ownerName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
  totalStorageCapacity: "",
  supportedCrops: [],
  coldStorage: false,
  loadingFacility: false,
  securityAvailable: false,
};

// =====================================================
// WAREHOUSE REGISTER
// =====================================================
export default function WarehouseRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  const [position, setPosition] = useState(null);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [warehouseDocument, setWarehouseDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // INPUT HANDLER
  // =====================================================
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // CROP CHECKBOX HANDLER
  // =====================================================
  const handleCropChange = (crop) => {
    setFormData((previous) => {
      const selected = previous.supportedCrops.includes(crop);

      return {
        ...previous,
        supportedCrops: selected
          ? previous.supportedCrops.filter((item) => item !== crop)
          : [...previous.supportedCrops, crop],
      };
    });
  };

  // =====================================================
  // MAP LOCATION HANDLER
  // =====================================================
  const handleMapLocation = (location) => {
    setPosition(location);

    setFormData((previous) => ({
      ...previous,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6),
    }));
  };

  // =====================================================
  // CURRENT LOCATION
  // =====================================================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        handleMapLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });

        setError("");
      },
      (locationError) => {
        console.error("Location error:", locationError);
        setError(
          "Unable to get your current location. Please allow location permission."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // =====================================================
  // RESET FORM
  // =====================================================
  const resetForm = () => {
    setFormData(initialFormData);
    setPosition(null);
    setProfilePhoto(null);
    setWarehouseDocument(null);
    setError("");
    setSuccess("");
  };

  // =====================================================
  // FORM SUBMISSION
  // =====================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.ownerName.trim()) {
      setError("Please enter the owner or manager name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.trim())) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (!formData.warehouseName.trim()) {
      setError("Please enter the warehouse name.");
      return;
    }

    if (
      !formData.totalStorageCapacity ||
      !Number.isFinite(Number(formData.totalStorageCapacity)) ||
      Number(formData.totalStorageCapacity) <= 0
    ) {
      setError("Storage capacity must be greater than zero.");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError("Please select the warehouse location on the map.");
      return;
    }

    const warehouse = {
      ...formData,
      warehouseName: formData.warehouseName.trim(),
      ownerName: formData.ownerName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      totalStorageCapacity: Number(formData.totalStorageCapacity),
      supportedCrops: JSON.stringify(formData.supportedCrops),
      coldStorage: Boolean(formData.coldStorage),
      loadingFacility: Boolean(formData.loadingFacility),
      securityAvailable: Boolean(formData.securityAvailable),
    };

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "warehouse",
        new Blob([JSON.stringify(warehouse)], {
          type: "application/json",
        })
      );

      if (profilePhoto) {
        data.append("profilePhoto", profilePhoto);
      }

      if (warehouseDocument) {
        data.append("warehouseDocument", warehouseDocument);
      }

      const response = await fetch(`${API}/warehouses/register`, {
        method: "POST",
        body: data,
      });

      const responseText = await response.text();

      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Registration failed (${response.status}).`
        );
      }

      setSuccess("Warehouse registered successfully.");

      window.alert(
        "Warehouse registered successfully!\n\nPlease login to continue."
      );

      navigate("/warehouse-login");
    } catch (submitError) {
      console.error("Warehouse registration error:", submitError);

      setError(
        submitError.message ||
          "Unable to connect to the backend. Please check your Spring Boot server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE UI
  // =====================================================
  return (
    <div className="warehouse-register-page">
      <button
        type="button"
        className="warehouse-register-home-button"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>

      <button
        type="button"
        className="warehouse-register-login-button"
        onClick={() => navigate("/warehouse-login")}
      >
        🔐 Already Registered? Login
      </button>

      <div className="warehouse-container">
        <div className="warehouse-header">
          <div className="warehouse-logo">🏬</div>

          <div>
            <h1>CropConnect</h1>
            <p>Smart Farmer-to-Market Platform</p>
          </div>
        </div>

        <div className="warehouse-title">
          <h2>Warehouse Registration</h2>
          <p>
            Register your warehouse and provide storage facilities for
            agricultural produce.
          </p>
        </div>

        {error && (
          <div className="my-error" role="alert">
            {error}
            <button type="button" onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="my-success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OWNER DETAILS */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>👤</span>
              <div>
                <h3>Owner / Manager Details</h3>
                <p>Enter your owner or manager information.</p>
              </div>
            </div>

            <div className="warehouse-grid">
              <div className="warehouse-group full-width">
                <label>
                  Owner Name <span>*</span>
                </label>
                <input
                  type="text"
                  name="ownerName"
                  placeholder="Enter owner or manager name"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label>
                  Email <span>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label>
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="warehouse-group">
                <label>
                  Phone Number <span>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setProfilePhoto(event.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          </div>

          {/* WAREHOUSE DETAILS */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>🏢</span>
              <div>
                <h3>Warehouse Details</h3>
                <p>Enter basic information about your warehouse.</p>
              </div>
            </div>

            <div className="warehouse-grid">
              <div className="warehouse-group full-width">
                <label>
                  Warehouse Name <span>*</span>
                </label>
                <input
                  type="text"
                  name="warehouseName"
                  placeholder="Enter warehouse name"
                  value={formData.warehouseName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>📍</span>
              <div>
                <h3>Address Information</h3>
                <p>Enter the warehouse address.</p>
              </div>
            </div>

            <div className="warehouse-grid">
              <div className="warehouse-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="warehouse-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="warehouse-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* LOCATION MAP */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>🗺️</span>
              <div>
                <h3>Warehouse Location</h3>
                <p>Select the exact warehouse location on the map.</p>
              </div>
            </div>

            <button
              type="button"
              className="warehouse-location-button"
              onClick={getCurrentLocation}
            >
              📍 Use My Current Location
            </button>

            <div className="warehouse-map">
              <MapContainer
                center={[
                  position?.lat ?? DEFAULT_POSITION.lat,
                  position?.lng ?? DEFAULT_POSITION.lng,
                ]}
                zoom={5}
                scrollWheelZoom
                className="warehouse-leaflet-map"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapPositionUpdater
                  position={position}
                />

                <LocationMarker
                  position={position}
                  setPosition={handleMapLocation}
                />
              </MapContainer>
            </div>

            <div className="warehouse-coordinates">
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

          {/* STORAGE CAPACITY */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>📦</span>
              <div>
                <h3>Storage Capacity</h3>
                <p>Enter warehouse storage capacity.</p>
              </div>
            </div>

            <div className="warehouse-grid">
              <div className="warehouse-group full-width">
                <label>
                  Total Storage Capacity <span>*</span>
                </label>
                <input
                  type="number"
                  name="totalStorageCapacity"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter total capacity"
                  value={formData.totalStorageCapacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* FACILITIES */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>🌡️</span>
              <div>
                <h3>Storage Facilities</h3>
                <p>Select available warehouse facilities.</p>
              </div>
            </div>

            <div className="warehouse-grid">
              {[
                ["coldStorage", "Cold Storage"],
                ["loadingFacility", "Loading Facility"],
                ["securityAvailable", "Security Available"],
              ].map(([name, label]) => (
                <div className="warehouse-group" key={name}>
                  <label>{label}</label>
                  <select
                    name={name}
                    value={formData[name] ? "Yes" : "No"}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        [name]: event.target.value === "Yes",
                      }))
                    }
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* SUPPORTED CROPS */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>🌾</span>
              <div>
                <h3>Supported Crops</h3>
                <p>Select crops that can be stored.</p>
              </div>
            </div>

            <div className="crop-checkbox-grid">
              {[
                "Rice",
                "Wheat",
                "Maize",
                "Cotton",
                "Pulses",
                "Vegetables",
                "Fruits",
                "Sugarcane",
                "Groundnut",
                "Other",
              ].map((crop) => (
                <label className="crop-checkbox" key={crop}>
                  <input
                    type="checkbox"
                    checked={formData.supportedCrops.includes(crop)}
                    onChange={() => handleCropChange(crop)}
                  />
                  <span>{crop}</span>
                </label>
              ))}
            </div>
          </div>

          {/* DOCUMENTS */}
          <div className="warehouse-section">
            <div className="warehouse-section-heading">
              <span>📄</span>
              <div>
                <h3>Documents</h3>
                <p>Upload warehouse supporting documents.</p>
              </div>
            </div>

            <div className="warehouse-document-grid">
              <div className="warehouse-document-box">
                <label>Warehouse Document</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    setWarehouseDocument(
                      event.target.files?.[0] || null
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="warehouse-submit">
            <button
              type="submit"
              className="warehouse-register-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "🏬 Register Warehouse"}
            </button>

            <button
              type="button"
              className="modal-cancel"
              onClick={resetForm}
              disabled={loading}
            >
              Reset Form
            </button>

            <p>
              Join CropConnect and provide reliable storage facilities
              to farmers.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
