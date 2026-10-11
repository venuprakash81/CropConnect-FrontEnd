
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransporterPages.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api/transporters";

const fields = [
  ["fullName", "Full Name", "text"],
  ["email", "Email", "email"],
  ["phone", "Phone", "tel"],
  ["alternativePhone", "Alternative Phone", "tel"],
  ["dateOfBirth", "Date of Birth", "date"],
  ["aadhaarNumber", "Aadhaar Number", "text"],
  ["drivingLicenceNumber", "Driving Licence Number", "text"],
  ["businessName", "Business Name", "text"],
  ["transporterType", "Transporter Type", "text"],
  ["gstNumber", "GST Number", "text"],
  ["yearsOfExperience", "Years of Experience", "number"],
  ["businessAddress", "Business Address", "text"],
  ["village", "Village", "text"],
  ["mandal", "Mandal", "text"],
  ["district", "District", "text"],
  ["state", "State", "text"],
  ["pincode", "PIN Code", "text"],
  ["latitude", "Latitude", "number"],
  ["longitude", "Longitude", "number"],
  ["vehicleNumber", "Vehicle Number", "text"],
  ["vehicleType", "Vehicle Type", "text"],
  ["vehicleModel", "Vehicle Model", "text"],
  ["vehicleCapacity", "Vehicle Capacity", "number"],
  ["capacityUnit", "Capacity Unit", "text"],
  ["vehicleOwnership", "Vehicle Ownership", "text"],
  ["fuelType", "Fuel Type", "text"],
  ["coldStorageAvailable", "Cold Storage Available", "text"],
  ["perishableGoodsSupported", "Perishable Goods Supported", "text"],
  ["baseCharge", "Base Charge", "number"],
  ["pricePerKm", "Price per KM", "number"],
  ["pricePerQuintal", "Price per Quintal", "number"],
  ["minimumTripCharge", "Minimum Trip Charge", "number"],
  ["availableDays", "Available Days", "text"],
  ["availableTime", "Available Time", "text"],
  ["maximumTravelDistance", "Maximum Travel Distance", "number"],
  ["currentlyAvailable", "Currently Available", "text"],
];

const numericFields = new Set([
  "yearsOfExperience", "latitude", "longitude", "vehicleCapacity",
  "baseCharge", "pricePerKm", "pricePerQuintal",
  "minimumTripCharge", "maximumTravelDistance",
]);

export default function EditTransporterProfile() {
  const navigate = useNavigate();
  const id = localStorage.getItem("transporterId");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      .then(setForm)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = e => {
    setForm(previous => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const payload = { ...form };

    for (const key of numericFields) {
      if (payload[key] === "" || payload[key] === undefined) {
        payload[key] = null;
      } else if (payload[key] !== null) {
        payload[key] = Number(payload[key]);
      }
    }

    try {
      const response = await fetch(`${API}/${id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setForm(data);
      localStorage.setItem("transporterEmail", data.email);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="tp-message">Loading profile...</div>;

  return (
    <div className="tp-page">
      <header className="tp-header">
        <div>
          <h2>AgriTransport</h2>
          <span>Edit Profile</span>
        </div>
        <button className="tp-secondary"
          onClick={() => navigate("/transporter/dashboard")}>
          ← Dashboard
        </button>
      </header>

      <main className="tp-container">
        <section className="tp-section">
          <h1>Edit Transporter Details</h1>
          <p>Update your information and save your changes.</p>

          {error && <div className="tp-alert tp-error">{error}</div>}
          {message && <div className="tp-alert tp-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="tp-form-grid">
              {fields.map(([name, label, type]) => (
                <label className="tp-field" key={name}>
                  <span>{label}</span>
                  <input
                    name={name}
                    type={type}
                    value={form[name] ?? ""}
                    onChange={handleChange}
                    required={["fullName", "email", "phone"].includes(name)}
                    min={type === "number" ? 0 : undefined}
                    step={type === "number" &&
                      name !== "yearsOfExperience" ? "any" : undefined}
                  />
                </label>
              ))}
            </div>

            <div className="tp-form-actions">
              <button type="button" className="tp-secondary"
                onClick={() => navigate("/transporter/profile")}>
                Cancel
              </button>
              <button type="submit" className="tp-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
