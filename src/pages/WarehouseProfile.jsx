
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WarehousePages.css";

const API = "http://localhost:8081/api/warehouses";

export default function WarehouseProfile() {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const saved = JSON.parse(
          localStorage.getItem("cropconnectWarehouse") || "{}"
        );

        const id = saved.id || saved.warehouseId || saved.warehouse?.id;
        const email = saved.email || saved.warehouseEmail ||
          saved.warehouse?.email;

        if (!id && !email) {
          navigate("/warehouse-login");
          return;
        }

        const response = await fetch(
          id ? `${API}/${id}` :
            `${API}/email/${encodeURIComponent(email)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        if (active) {
          setWarehouse(data);
          localStorage.setItem("cropconnectWarehouse", JSON.stringify(data));
        }
      } catch (e) {
        if (active) setError(e.message);
      }
    }

    load();
    return () => { active = false; };
  }, [navigate]);

  if (error) return <main className="wh-container"><div className="wh-alert">{error}</div></main>;
  if (!warehouse) return <div className="wh-loading">Loading profile...</div>;

  const photo = warehouse.profilePhoto
    ? `${API}/profile-photo/${encodeURIComponent(warehouse.profilePhoto)}`
    : "";

  const documents = [
    ["Registration Document", warehouse.warehouseRegistrationFile],
    ["Ownership Document", warehouse.ownershipDocumentFile],
    ["Warehouse License", warehouse.warehouseLicenseFile],
    ["Fire Safety Certificate", warehouse.fireSafetyCertificateFile],
    ["Other Document", warehouse.otherDocumentFile]
  ];

  const facilities = [
    ["Cold Storage", warehouse.coldStorageAvailable],
    ["Temperature Control", warehouse.temperatureControl],
    ["Humidity Control", warehouse.humidityControl],
    ["Ventilation", warehouse.ventilation],
    ["Electricity", warehouse.electricityAvailable],
    ["Backup Generator", warehouse.backupGenerator],
    ["CCTV Security", warehouse.cctvSecurity],
    ["Fire Safety", warehouse.fireSafety],
    ["Pest Control", warehouse.pestControl]
  ];

  return (
    <div className="wh-page">
      <header className="wh-header">
        <div>
          <div className="wh-brand">CropConnect</div>
          <span>Warehouse Profile</span>
        </div>
        <button className="wh-btn wh-btn-light" onClick={() => navigate("/warehouse/dashboard")}>
          Dashboard
        </button>
      </header>

      <main className="wh-container">
        <section className="wh-profile-hero">
          {photo
            ? <img className="wh-profile-photo" src={photo} alt="Warehouse profile" />
            : <div className="wh-profile-photo wh-avatar-placeholder">W</div>}
          <div>
            <p className="wh-eyebrow">YOUR WAREHOUSE ACCOUNT</p>
            <h1>{warehouse.warehouseName || "Warehouse Profile"}</h1>
            <p>{warehouse.email}</p>
            <button className="wh-btn" onClick={() => navigate("/warehouse/edit-profile")}>
              Edit Profile
            </button>
          </div>
        </section>

        <section className="wh-panel">
          <h2>Owner and Contact Details</h2>
          <div className="wh-details-grid">
            <div><span>Owner Name</span><strong>{warehouse.ownerName || "—"}</strong></div>
            <div><span>Email</span><strong>{warehouse.email || "—"}</strong></div>
            <div><span>Phone</span><strong>{warehouse.phone || "—"}</strong></div>
            <div><span>Address</span><strong>{warehouse.address || "—"}</strong></div>
            <div><span>City</span><strong>{warehouse.city || "—"}</strong></div>
            <div><span>State</span><strong>{warehouse.state || "—"}</strong></div>
          </div>
        </section>

        <section className="wh-panel">
          <h2>Storage and Location</h2>
          <div className="wh-details-grid">
            <div><span>Total Capacity</span><strong>{warehouse.totalStorageCapacity ?? "—"}</strong></div>
            <div><span>Latitude</span><strong>{warehouse.latitude ?? "—"}</strong></div>
            <div><span>Longitude</span><strong>{warehouse.longitude ?? "—"}</strong></div>
            <div><span>Supported Crops</span><strong>{warehouse.supportedCrops || "—"}</strong></div>
          </div>
        </section>

        <section className="wh-panel">
          <h2>Warehouse Facilities</h2>
          <div className="wh-facility-grid">
            {facilities.map(([label, value]) => (
              <div className="wh-facility" key={label}>
                <span>{label}</span>
                <strong className={value === true ? "wh-yes" : "wh-no"}>
                  {value === true ? "Available" :
                    value === false ? "Not available" : "Not specified"}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="wh-panel">
          <h2>Uploaded Documents</h2>
          <div className="wh-document-list">
            {documents.map(([label, file]) => (
              <div className="wh-document" key={label}>
                <span>{label}</span>
                <strong>{file || "Not uploaded"}</strong>
              </div>
            ))}
          </div>
          <p className="wh-note">
            These are saved filenames. Download links require a separate
            protected document endpoint.
          </p>
        </section>

        <button className="wh-btn" onClick={() => navigate("/warehouse/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}
