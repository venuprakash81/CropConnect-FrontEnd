import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WarehouseDetails.css";

const API_BASE = "http://localhost:8081/api";
const SERVER_BASE = "http://localhost:8081";

function WarehouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWarehouse();
  }, [id]);

  const loadWarehouse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/warehouses/${id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load warehouse. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Warehouse details:", data);

      setWarehouse(data);
    } catch (err) {
      console.error("Warehouse loading error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPhotoUrl = () => {
    if (!warehouse?.profilePhoto) {
      return null;
    }

    if (
      warehouse.profilePhoto.startsWith("http://") ||
      warehouse.profilePhoto.startsWith("https://")
    ) {
      return warehouse.profilePhoto;
    }

    const fileName = warehouse.profilePhoto
      .replace(/\\/g, "/")
      .split("/")
      .pop();

    return `${SERVER_BASE}/api/warehouses/profile-photo/${encodeURIComponent(
      fileName
    )}`;
  };

  const openLocation = () => {
    if (
      warehouse?.latitude !== null &&
      warehouse?.latitude !== undefined &&
      warehouse?.longitude !== null &&
      warehouse?.longitude !== undefined
    ) {
      const url =
        `https://www.google.com/maps/search/?api=1` +
        `&query=${warehouse.latitude},${warehouse.longitude}`;

      window.open(url, "_blank");
      return;
    }

    const address = [
      warehouse?.address,
      warehouse?.city,
      warehouse?.state,
    ]
      .filter(Boolean)
      .join(", ");

    if (address) {
      const url =
        `https://www.google.com/maps/search/?api=1&query=` +
        encodeURIComponent(address);

      window.open(url, "_blank");
    }
  };

  const getValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not provided";
    }

    return value;
  };

  const serviceList = [
    {
      key: "coldStorage",
      label: "Cold Storage",
    },
    {
      key: "temperatureControl",
      label: "Temperature Control",
    },
    {
      key: "humidityControl",
      label: "Humidity Control",
    },
    {
      key: "ventilation",
      label: "Ventilation",
    },
    {
      key: "electricity",
      label: "Electricity",
    },
    {
      key: "backupGenerator",
      label: "Backup Generator",
    },
    {
      key: "cctv",
      label: "CCTV Security",
    },
    {
      key: "fireSafety",
      label: "Fire Safety",
    },
    {
      key: "pestControl",
      label: "Pest Control",
    },
  ];

  if (loading) {
    return (
      <div className="warehouse-details-page">
        <div className="warehouse-loading">
          <div className="warehouse-spinner"></div>
          <p>Loading warehouse details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="warehouse-details-page">
        <div className="warehouse-error">
          <h2>Unable to load warehouse</h2>
          <p>{error}</p>

          <button onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="warehouse-details-page">
        <div className="warehouse-error">
          <h2>Warehouse not found</h2>

          <button onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const photoUrl = getPhotoUrl();

  return (
    <div className="warehouse-details-page">

      {/* HEADER */}
      <header className="warehouse-details-header">

        <div className="warehouse-header-left">
          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <div>
            <h1>Warehouse Details</h1>
            <p>Complete warehouse information</p>
          </div>
        </div>

        <button
          className="book-button"
          onClick={() =>
            navigate(`/book-warehouse/${warehouse.id}`)
          }
        >
          Book Warehouse
        </button>

      </header>


      <main className="warehouse-details-container">

        {/* PROFILE CARD */}
        <section className="warehouse-profile-card">

          <div className="warehouse-photo-section">

            {photoUrl ? (
              <img
                src={photoUrl}
                alt={warehouse.warehouseName}
                className="warehouse-profile-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}

            <div
              className="warehouse-photo-placeholder"
              style={{
                display: photoUrl ? "none" : "flex",
              }}
            >
              🏢
            </div>

          </div>


          <div className="warehouse-profile-main">

            <div className="warehouse-title-row">

              <div>
                <span className="warehouse-label">
                  WAREHOUSE
                </span>

                <h2>
                  {getValue(warehouse.warehouseName)}
                </h2>

                <p className="warehouse-owner">
                  Owned by{" "}
                  <strong>
                    {getValue(warehouse.ownerName)}
                  </strong>
                </p>
              </div>

              <span className="verified-badge">
                ✓ Verified
              </span>

            </div>


            <div className="quick-info-grid">

              <div className="quick-info-item">
                <span>📧</span>
                <div>
                  <small>Email</small>
                  <strong>
                    {getValue(warehouse.email)}
                  </strong>
                </div>
              </div>

              <div className="quick-info-item">
                <span>📞</span>
                <div>
                  <small>Phone</small>
                  <strong>
                    {getValue(warehouse.phone)}
                  </strong>
                </div>
              </div>

              <div className="quick-info-item">
                <span>📦</span>
                <div>
                  <small>Storage Capacity</small>
                  <strong>
                    {getValue(
                      warehouse.totalStorageCapacity
                    )}
                  </strong>
                </div>
              </div>

              <div className="quick-info-item">
                <span>📍</span>
                <div>
                  <small>Location</small>
                  <strong>
                    {getValue(warehouse.city)}
                    {warehouse.state
                      ? `, ${warehouse.state}`
                      : ""}
                  </strong>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* BASIC INFORMATION */}
        <section className="details-section">

          <div className="section-heading">
            <span className="section-icon">🏢</span>

            <div>
              <h2>Basic Information</h2>
              <p>Warehouse and owner information</p>
            </div>
          </div>


          <div className="details-grid">

            <div className="detail-box">
              <span>Warehouse Name</span>
              <strong>
                {getValue(warehouse.warehouseName)}
              </strong>
            </div>

            <div className="detail-box">
              <span>Owner Name</span>
              <strong>
                {getValue(warehouse.ownerName)}
              </strong>
            </div>

            <div className="detail-box">
              <span>Email</span>
              <strong>
                {getValue(warehouse.email)}
              </strong>
            </div>

            <div className="detail-box">
              <span>Phone</span>
              <strong>
                {getValue(warehouse.phone)}
              </strong>
            </div>

            <div className="detail-box full-width">
              <span>Address</span>
              <strong>
                {getValue(warehouse.address)}
              </strong>
            </div>

            <div className="detail-box">
              <span>City</span>
              <strong>
                {getValue(warehouse.city)}
              </strong>
            </div>

            <div className="detail-box">
              <span>State</span>
              <strong>
                {getValue(warehouse.state)}
              </strong>
            </div>

            <div className="detail-box">
              <span>Storage Capacity</span>
              <strong>
                {getValue(
                  warehouse.totalStorageCapacity
                )}
              </strong>
            </div>

          </div>

        </section>


        {/* SUPPORTED CROPS */}
        <section className="details-section">

          <div className="section-heading">
            <span className="section-icon">🌾</span>

            <div>
              <h2>Supported Crops</h2>
              <p>Crops that can be stored in this warehouse</p>
            </div>
          </div>


          <div className="crop-container">

            {warehouse.supportedCrops ? (
              warehouse.supportedCrops
                .split(",")
                .map((crop, index) => (
                  <span
                    className="crop-tag"
                    key={index}
                  >
                    🌾 {crop.trim()}
                  </span>
                ))
            ) : (
              <p className="not-provided">
                No supported crops provided.
              </p>
            )}

          </div>

        </section>


        {/* SERVICES */}
        <section className="details-section">

          <div className="section-heading">
            <span className="section-icon">⚙️</span>

            <div>
              <h2>Warehouse Services</h2>
              <p>Available facilities and services</p>
            </div>
          </div>


          <div className="services-grid">

            {serviceList.map((service) => {

              const enabled =
                warehouse[service.key] === true ||
                warehouse[service.key] === "true" ||
                warehouse[service.key] === 1;

              return (
                <div
                  className={`service-card ${
                    enabled ? "service-enabled" : "service-disabled"
                  }`}
                  key={service.key}
                >

                  <span className="service-status">
                    {enabled ? "✓" : "×"}
                  </span>

                  <div>
                    <strong>{service.label}</strong>

                    <small>
                      {enabled
                        ? "Available"
                        : "Not Available"}
                    </small>
                  </div>

                </div>
              );
            })}

          </div>

        </section>


        {/* LOCATION */}
        <section className="details-section">

          <div className="section-heading">
            <span className="section-icon">📍</span>

            <div>
              <h2>Warehouse Location</h2>
              <p>Registered warehouse location</p>
            </div>
          </div>


          <div className="location-card">

            <div className="location-information">

              <div className="location-row">
                <span>Address</span>
                <strong>
                  {getValue(warehouse.address)}
                </strong>
              </div>

              <div className="location-row">
                <span>City</span>
                <strong>
                  {getValue(warehouse.city)}
                </strong>
              </div>

              <div className="location-row">
                <span>State</span>
                <strong>
                  {getValue(warehouse.state)}
                </strong>
              </div>

              <div className="location-row">
                <span>Latitude</span>
                <strong>
                  {getValue(warehouse.latitude)}
                </strong>
              </div>

              <div className="location-row">
                <span>Longitude</span>
                <strong>
                  {getValue(warehouse.longitude)}
                </strong>
              </div>

            </div>


            <button
              className="map-button"
              onClick={openLocation}
            >
              📍 Open in Google Maps
            </button>

          </div>

        </section>


        {/* DOCUMENTS */}
        <section className="details-section">

          <div className="section-heading">
            <span className="section-icon">📄</span>

            <div>
              <h2>Documents</h2>
              <p>Warehouse registration documents</p>
            </div>
          </div>


          <div className="documents-grid">

            {warehouse.registrationDocument && (
              <a
                className="document-card"
                href={`${SERVER_BASE}/${warehouse.registrationDocument}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>📄</span>
                <div>
                  <strong>
                    Registration Document
                  </strong>
                  <small>
                    View Document
                  </small>
                </div>
              </a>
            )}


            {warehouse.licenseDocument && (
              <a
                className="document-card"
                href={`${SERVER_BASE}/${warehouse.licenseDocument}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>📋</span>
                <div>
                  <strong>
                    License Document
                  </strong>
                  <small>
                    View Document
                  </small>
                </div>
              </a>
            )}


            {!warehouse.registrationDocument &&
              !warehouse.licenseDocument && (
                <p className="not-provided">
                  No documents uploaded.
                </p>
              )}

          </div>

        </section>


        {/* BOTTOM ACTIONS */}
        <div className="bottom-actions">

          <button
            className="secondary-action"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <button
            className="primary-action"
            onClick={() =>
              navigate(`/book-warehouse/${warehouse.id}`)
            }
          >
            📦 Book This Warehouse
          </button>

        </div>

      </main>

    </div>
  );
}

export default WarehouseDetails;