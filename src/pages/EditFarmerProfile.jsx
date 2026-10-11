
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./EditFarmerProfile.css";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Sprout,
  CalendarDays,
  CreditCard,
  Camera,
  Save,
  LoaderCircle,
  AlertCircle,
  LocateFixed,
} from "lucide-react";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";
const DEFAULT_CENTER = [17.385, 78.4867];

const initialForm = {
  fullName: "",
  email: "",
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
  landUnit: "",
};

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function MapRecenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 14));
    }
  }, [map, position]);

  return null;
}

export default function EditFarmerProfile() {
  const navigate = useNavigate();

  const [farmerId, setFarmerId] = useState("");
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasCoordinates =
    form.latitude !== "" &&
    form.longitude !== "" &&
    Number.isFinite(Number(form.latitude)) &&
    Number.isFinite(Number(form.longitude)) &&
    Number(form.latitude) >= -90 &&
    Number(form.latitude) <= 90 &&
    Number(form.longitude) >= -180 &&
    Number(form.longitude) <= 180;

  const position = hasCoordinates
    ? [Number(form.latitude), Number(form.longitude)]
    : null;

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const stored = JSON.parse(
          localStorage.getItem("cropconnectFarmer") ||
          localStorage.getItem("farmer") ||
          "null"
        );

        const email =
          localStorage.getItem("farmerEmail") || stored?.email;

        if (!email) {
          throw new Error("Login email not found. Please log in again.");
        }

        const response = await fetch(
          `${API_BASE}/farmers/by-email?email=${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load farmer profile.");
        }

        if (!active) return;

        setFarmerId(String(data.id));

        const nextForm = { ...initialForm };

        Object.keys(nextForm).forEach((key) => {
          nextForm[key] =
            data[key] === null || data[key] === undefined
              ? ""
              : String(data[key]);
        });

        setForm(nextForm);
        setCurrentPhoto(data.profilePhoto || "");
      } catch (err) {
        if (active) setError(err.message || "Unable to load profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const selectLocation = (latitude, longitude) => {
    setForm((previous) => ({
      ...previous,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }));

    setError("");
    setSuccess("");
  };

  const handlePhotoChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Profile photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setPhoto(selected);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!farmerId || !/^\d+$/.test(farmerId)) {
      setError("Valid farmer ID not found. Please log in again.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (
      form.alternativePhone &&
      !/^\d{10}$/.test(form.alternativePhone)
    ) {
      setError("Alternative phone must contain exactly 10 digits.");
      return;
    }

    if (
      form.aadhaarNumber &&
      !/^\d{12}$/.test(form.aadhaarNumber)
    ) {
      setError("Aadhaar number must contain exactly 12 digits.");
      return;
    }

    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must contain exactly 6 digits.");
      return;
    }

    if (!hasCoordinates) {
      setError("Click the map to select a valid farm location.");
      return;
    }

    if (
      form.totalLand !== "" &&
      (!Number.isFinite(Number(form.totalLand)) ||
        Number(form.totalLand) < 0)
    ) {
      setError("Enter a valid non-negative land area.");
      return;
    }

    setSaving(true);

    try {
      const farmerData = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        totalLand:
          form.totalLand === "" ? null : Number(form.totalLand),
      };

      const body = new FormData();

      body.append(
        "farmer",
        new Blob([JSON.stringify(farmerData)], {
          type: "application/json",
        })
      );

      if (photo) {
        body.append("profilePhoto", photo);
      }

      const response = await fetch(
        `${API_BASE}/farmers/${encodeURIComponent(farmerId)}`,
        {
          method: "PUT",
          body,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      const updatedFarmer = data.farmer || data;

      localStorage.setItem("farmerId", String(updatedFarmer.id));
      localStorage.setItem("farmerEmail", updatedFarmer.email);
      localStorage.setItem("farmer", JSON.stringify(updatedFarmer));
      localStorage.setItem(
        "cropconnectFarmer",
        JSON.stringify(updatedFarmer)
      );

      setCurrentPhoto(updatedFarmer.profilePhoto || "");
      setPhoto(null);
      setSuccess("Profile and farm location updated successfully.");

      window.setTimeout(() => {
        navigate("/farmer-profile");
      }, 900);
    } catch (err) {
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const photoUrl =
    preview ||
    (currentPhoto
      ? `${API_BASE}/farmers/profile-photo/${encodeURIComponent(currentPhoto)}`
      : "");

  if (loading) {
    return (
      <div className="ef-status">
        <LoaderCircle className="ef-spinner" size={28} />
        Loading your profile...
      </div>
    );
  }

  if (!farmerId) {
    return (
      <div className="ef-status ef-error">
        <AlertCircle size={25} />
        <p>{error || "Farmer profile not found."}</p>
        <button onClick={() => navigate("/farmer-login")}>
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <main className="ef-page">
      <header className="ef-heading">
        <button
          type="button"
          className="ef-back"
          onClick={() => navigate("/farmer-profile")}
        >
          <ArrowLeft size={18} />
          Back to Profile
        </button>

        <span className="ef-eyebrow">
          CROPCONNECT · ACCOUNT SETTINGS
        </span>
        <h1>Edit Farmer Profile</h1>
        <p>Update your personal details and farm location.</p>
      </header>

      <form className="ef-card" onSubmit={handleSubmit}>
        <div className="ef-profile-top">
          <div className="ef-avatar">
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Farmer profile"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            <span>
              {(form.fullName || "F")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>

          <div className="ef-photo-info">
            <h2>{form.fullName || "Farmer"}</h2>
            <p>Upload a profile photo (maximum 5 MB).</p>
            <label className="ef-upload-button">
              <Camera size={17} />
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
            {photo && <small>{photo.name}</small>}
          </div>
        </div>

        {error && (
          <div className="ef-message ef-message-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="ef-message ef-message-success">
            {success}
          </div>
        )}

        <section className="ef-section">
          <h3><UserRound size={19} /> Personal Information</h3>

          <div className="ef-grid">
            <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} icon={UserRound} required />
            <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} icon={Mail} required />
            <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} icon={Phone} required maxLength={10} />
            <Field label="Alternative Phone" name="alternativePhone" value={form.alternativePhone} onChange={handleChange} icon={Phone} maxLength={10} />
            <Field label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} icon={CalendarDays} />
            <Field label="Aadhaar Number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} icon={CreditCard} maxLength={12} />
          </div>
        </section>

        <section className="ef-section">
          <h3><MapPin size={19} /> Farm Address</h3>

          <div className="ef-grid">
            <Field label="Village" name="village" value={form.village} onChange={handleChange} icon={MapPin} />
            <Field label="Mandal" name="mandal" value={form.mandal} onChange={handleChange} icon={MapPin} />
            <Field label="District" name="district" value={form.district} onChange={handleChange} icon={MapPin} />
            <Field label="State" name="state" value={form.state} onChange={handleChange} icon={MapPin} />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} icon={MapPin} maxLength={6} />
          </div>
        </section>

        <section className="ef-section ef-map-section">
          <div className="ef-map-heading">
            <div>
              <h3><MapPin size={20} /> Select Farm Location</h3>
              <p>Click anywhere on the map or drag the marker to your farm.</p>
            </div>
            <span className="ef-map-badge">Interactive Map</span>
          </div>

          <div className="ef-map">
            <MapContainer
              center={position || DEFAULT_CENTER}
              zoom={position ? 14 : 5}
              scrollWheelZoom
              className="ef-leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              <MapClickHandler onSelect={selectLocation} />

              {position && (
                <Marker
                  position={position}
                  draggable
                  eventHandlers={{
                    dragend(event) {
                      const point = event.target.getLatLng();
                      selectLocation(point.lat, point.lng);
                    },
                  }}
                >
                  <Popup>
                    <strong>Selected Farm Location</strong>
                    <br />
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </Popup>
                </Marker>
              )}

              <MapRecenter position={position} />
            </MapContainer>
          </div>

          <div className="ef-map-instructions">
            <MapPin size={18} />
            {position
              ? "Farm marker selected. Drag it to adjust the exact location."
              : "No saved coordinates found. Zoom into your area and click your farm location."}
          </div>

          <div className="ef-coordinate-grid">
            <Field
              label="Latitude"
              name="latitude"
              type="number"
              value={form.latitude}
              onChange={handleChange}
              icon={MapPin}
              required
            />
            <Field
              label="Longitude"
              name="longitude"
              type="number"
              value={form.longitude}
              onChange={handleChange}
              icon={MapPin}
              required
            />
          </div>

          <p className="ef-coordinate-note">
            <LocateFixed size={16} />
            Coordinates update automatically when you move the marker or click the map.
          </p>
        </section>

        <section className="ef-section">
          <h3><Sprout size={19} /> Agricultural Information</h3>

          <div className="ef-grid">
            <Field label="Total Land" name="totalLand" type="number" value={form.totalLand} onChange={handleChange} icon={Sprout} />

            <div className="ef-field">
              <label htmlFor="landUnit">Land Unit</label>
              <select
                id="landUnit"
                name="landUnit"
                value={form.landUnit}
                onChange={handleChange}
              >
                <option value="">Select land unit</option>
                <option value="Acres">Acres</option>
                <option value="Hectares">Hectares</option>
                <option value="Square Feet">Square Feet</option>
                <option value="Square Meters">Square Meters</option>
              </select>
            </div>
          </div>
        </section>

        <div className="ef-actions">
          <button
            type="button"
            className="ef-cancel"
            disabled={saving}
            onClick={() => navigate("/farmer-profile")}
          >
            Cancel
          </button>

          <button type="submit" className="ef-save" disabled={saving}>
            {saving ? (
              <LoaderCircle className="ef-spinner" size={18} />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  type = "text",
  required = false,
  maxLength,
}) {
  return (
    <div className="ef-field">
      <label htmlFor={name}>
        {label}{required ? " *" : ""}
      </label>

      <div className="ef-input-wrap">
        {Icon && <Icon size={17} />}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          step={type === "number" ? "any" : undefined}
        />
      </div>
    </div>
  );
}
