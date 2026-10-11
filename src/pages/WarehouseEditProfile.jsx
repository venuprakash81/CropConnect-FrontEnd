
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WarehousePages.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api/warehouses";

const fields = [
  ["warehouseName", "Warehouse Name", "text"],
  ["ownerName", "Owner Name", "text"],
  ["phone", "Phone Number", "tel"],
  ["address", "Address", "text"],
  ["city", "City", "text"],
  ["state", "State", "text"],
  ["totalStorageCapacity", "Total Storage Capacity", "number"],
  ["latitude", "Latitude", "number"],
  ["longitude", "Longitude", "number"],
  ["supportedCrops", "Supported Crops", "text"]
];

const facilities = [
  ["coldStorageAvailable", "Cold Storage"],
  ["temperatureControl", "Temperature Control"],
  ["humidityControl", "Humidity Control"],
  ["ventilation", "Ventilation"],
  ["electricityAvailable", "Electricity"],
  ["backupGenerator", "Backup Generator"],
  ["cctvSecurity", "CCTV Security"],
  ["fireSafety", "Fire Safety"],
  ["pestControl", "Pest Control"]
];

export default function WarehouseEditProfile() {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const saved = JSON.parse(
          localStorage.getItem("cropconnectWarehouse") || "{}"
        );

        const savedId = saved.id || saved.warehouseId || saved.warehouse?.id;
        const email = saved.email || saved.warehouseEmail ||
          saved.warehouse?.email;

        if (!savedId && !email) {
          navigate("/warehouse-login");
          return;
        }

        const response = await fetch(
          savedId ? `${API}/${savedId}` :
            `${API}/email/${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load warehouse.");
        }

        if (active) {
          setId(data.id);
          setForm(data);
          localStorage.setItem("cropconnectWarehouse", JSON.stringify(data));
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [navigate]);

  const updateField = (key, value) => {
    setForm(previous => ({ ...previous, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(form.phone || "")) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (!form.totalStorageCapacity ||
        Number(form.totalStorageCapacity) <= 0) {
      setError("Storage capacity must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        warehouseName: form.warehouseName,
        ownerName: form.ownerName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        latitude: form.latitude === "" ? null : Number(form.latitude),
        longitude: form.longitude === "" ? null : Number(form.longitude),
        totalStorageCapacity: Number(form.totalStorageCapacity),
        supportedCrops: form.supportedCrops,
        coldStorageAvailable: form.coldStorageAvailable,
        temperatureControl: form.temperatureControl,
        humidityControl: form.humidityControl,
        ventilation: form.ventilation,
        electricityAvailable: form.electricityAvailable,
        backupGenerator: form.backupGenerator,
        cctvSecurity: form.cctvSecurity,
        fireSafety: form.fireSafety,
        pestControl: form.pestControl
      };

      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      setForm(data);
      localStorage.setItem("cropconnectWarehouse", JSON.stringify(data));
      setSuccess("Warehouse profile updated successfully.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="wh-loading">Loading edit profile...</div>;

  return (
    <div className="wh-page">
      <header className="wh-header">
        <div>
          <div className="wh-brand">CropConnect</div>
          <span>Edit Warehouse Profile</span>
        </div>
        <button className="wh-btn wh-btn-light" onClick={() => navigate("/warehouse/dashboard")}>
          Dashboard
        </button>
      </header>

      <main className="wh-container wh-form-container">
        <section className="wh-form-card">
          <p className="wh-eyebrow">ACCOUNT SETTINGS</p>
          <h1>Edit Warehouse Details</h1>
          <p className="wh-muted">Update your information and save changes.</p>

          {error && <div className="wh-alert">{error}</div>}
          {success && <div className="wh-success">{success}</div>}

          <form onSubmit={submit}>
            <div className="wh-form-grid">
              {fields.map(([key, label, type]) => (
                <label className="wh-field" key={key}>
                  {label}
                  <input
                    type={type}
                    step={type === "number" ? "any" : undefined}
                    min={key === "totalStorageCapacity" ? "0.01" : undefined}
                    value={form[key] ?? ""}
                    onChange={e => updateField(key, e.target.value)}
                    required={!["latitude", "longitude", "supportedCrops"].includes(key)}
                  />
                </label>
              ))}
            </div>

            <h2 className="wh-form-subtitle">Warehouse Facilities</h2>
            <div className="wh-edit-facilities">
              {facilities.map(([key, label]) => (
                <label className="wh-checkbox" key={key}>
                  <input
                    type="checkbox"
                    checked={form[key] === true}
                    onChange={e => updateField(key, e.target.checked)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            <div className="wh-form-buttons">
              <button className="wh-btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="wh-btn wh-btn-outline"
                type="button"
                onClick={() => navigate("/warehouse/profile")}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
