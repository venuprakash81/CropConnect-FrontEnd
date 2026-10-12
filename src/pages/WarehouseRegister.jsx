
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

// Keep your existing CSS import.
import "./WarehouseRegister.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";

const defaultPosition = [17.385, 78.4867];

const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const initialFormData = {
  warehouseName: "",
  ownerName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  latitude: defaultPosition[0],
  longitude: defaultPosition[1],
  totalStorageCapacity: "",
  supportedCrops: [],
  coldStorage: false,
  loadingFacility: false,
  securityAvailable: false,
};

function MapPositionUpdater({ position }) {
  const map = useMap();

  React.useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return null;
}

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      const nextPosition = [
        event.latlng.lat,
        event.latlng.lng,
      ];

      setPosition(nextPosition);
    },
  });

  return <Marker position={position} icon={markerIcon} />;
}

export default function WarehouseRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [warehouseDocument, setWarehouseDocument] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState(defaultPosition);

  const cropOptions = [
    "Rice",
    "Wheat",
    "Maize",
    "Cotton",
    "Chilli",
    "Tomato",
    "Potato",
    "Onion",
    "Other",
  ];

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

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

  const updatePosition = (nextPosition) => {
    setPosition(nextPosition);

    setFormData((previous) => ({
      ...previous,
      latitude: nextPosition[0],
      longitude: nextPosition[1],
    }));
  };

  const getResponseMessage = async (response) => {
    const body = await response.text();

    if (!body) {
      return {};
    }

    try {
      return JSON.parse(body);
    } catch {
      return { message: body };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const requiredFields = [
      ["warehouseName", "Warehouse name"],
      ["ownerName", "Owner name"],
      ["email", "Email"],
      ["password", "Password"],
      ["phone", "Phone"],
      ["address", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["totalStorageCapacity", "Storage capacity"],
    ];

    for (const [key, label] of requiredFields) {
      if (
        formData[key] === "" ||
        formData[key] === null ||
        formData[key] === undefined
      ) {
        setError(`${label} is required.`);
        return;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    if (Number(formData.totalStorageCapacity) <= 0) {
      setError("Storage capacity must be greater than zero.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.latitude)) ||
      !Number.isFinite(Number(formData.longitude))
    ) {
      setError("Please select a valid warehouse location on the map.");
      return;
    }

    setLoading(true);

    try {
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

        // Send an array, not a JSON-encoded string.
        // Warehouse.java should declare this as a List<String>.
        supportedCrops: formData.supportedCrops,
      };

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

      const result = await getResponseMessage(response);

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            result.message || "This email or phone number is already registered."
          );
        }

        throw new Error(
          result.message ||
            result.error ||
            `Registration failed with status ${response.status}.`
        );
      }

      setSuccess("Warehouse registered successfully! Redirecting to login...");

      // Allow the success message to appear before navigating.
      window.setTimeout(() => {
        navigate("/warehouse-login");
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          "Unable to register the warehouse. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="warehouse-register-page">
      <div className="warehouse-container">
        <header className="warehouse-header">
          <div className="warehouse-logo">🌾</div>
          <h1 className="warehouse-title">Warehouse Registration</h1>
          <p>Register your warehouse with CropConnect</p>

          <button
            type="button"
            className="warehouse-register-home-button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            type="button"
            className="warehouse-register-login-button"
            onClick={() => navigate("/warehouse-login")}
          >
            Already registered? Login
          </button>
        </header>

        {error && (
          <div className="my-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="my-success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <section className="warehouse-section">
            <h2 className="warehouse-section-heading">
              Owner Information
            </h2>

            <div className="warehouse-grid">
              <div className="warehouse-group">
                <label htmlFor="ownerName">Owner Name *</label>
                <input
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group full-width">
                <label htmlFor="profilePhoto">Profile Photo</label>
                <input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setProfilePhoto(event.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          </section>

          <section className="warehouse-section">
            <h2 className="warehouse-section-heading">
              Warehouse Information
            </h2>

            <div className="warehouse-grid">
              <div className="warehouse-group">
                <label htmlFor="warehouseName">Warehouse Name *</label>
                <input
                  id="warehouseName"
                  name="warehouseName"
                  value={formData.warehouseName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label htmlFor="totalStorageCapacity">
                  Total Storage Capacity *
                </label>
                <input
                  id="totalStorageCapacity"
                  name="totalStorageCapacity"
                  type="number"
                  min="1"
                  value={formData.totalStorageCapacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group full-width">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="warehouse-group">
                <label htmlFor="state">State *</label>
                <input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="warehouse-section">
            <h2 className="warehouse-section-heading">
              Warehouse Location
            </h2>

            <p>Select the warehouse location on the map.</p>

            <button
              type="button"
              className="warehouse-location-button"
              onClick={() => updatePosition(defaultPosition)}
            >
              Reset to Hyderabad
            </button>

            <div className="warehouse-map">
              <MapContainer
                center={position}
                zoom={12}
                scrollWheelZoom
                className="warehouse-leaflet-map"
                style={{ height: "350px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapPositionUpdater position={position} />

                <LocationMarker
                  position={position}
                  setPosition={updatePosition}
                />
              </MapContainer>
            </div>

            <p className="warehouse-coordinates">
              Latitude: {Number(position[0]).toFixed(6)} | Longitude:{" "}
              {Number(position[1]).toFixed(6)}
            </p>
          </section>

          <section className="warehouse-section">
            <h2 className="warehouse-section-heading">
              Facilities and Crops
            </h2>

            <div className="warehouse-grid">
              <div className="warehouse-group">
                <label>
                  <input
                    type="checkbox"
                    name="coldStorage"
                    checked={formData.coldStorage}
                    onChange={handleChange}
                  />
                  Cold Storage Available
                </label>
              </div>

              <div className="warehouse-group">
                <label>
                  <input
                    type="checkbox"
                    name="loadingFacility"
                    checked={formData.loadingFacility}
                    onChange={handleChange}
                  />
                  Loading Facility Available
                </label>
              </div>

              <div className="warehouse-group">
                <label>
                  <input
                    type="checkbox"
                    name="securityAvailable"
                    checked={formData.securityAvailable}
                    onChange={handleChange}
                  />
                  Security Available
                </label>
              </div>
            </div>

            <h3>Supported Crops</h3>

            <div className="crop-checkbox-grid">
              {cropOptions.map((crop) => (
                <label key={crop} className="crop-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.supportedCrops.includes(crop)}
                    onChange={() => handleCropChange(crop)}
                  />
                  {crop}
                </label>
              ))}
            </div>
          </section>

          <section className="warehouse-section">
            <h2 className="warehouse-section-heading">
              Warehouse Document
            </h2>

            <div className="warehouse-document-grid">
              <div className="warehouse-document-box">
                <label htmlFor="warehouseDocument">
                  Upload Warehouse Document
                </label>
                <input
                  id="warehouseDocument"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    setWarehouseDocument(event.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="warehouse-submit warehouse-register-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Warehouse"}
          </button>
        </form>
      </div>
    </div>
  );
}
