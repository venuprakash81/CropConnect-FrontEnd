import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminFarmers.css";

const API = "http://localhost:8081/api/farmers";

function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const loadFarmers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to load farmers");
      }

      const data = await response.json();
      setFarmers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  const filteredFarmers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return farmers;

    return farmers.filter((farmer) =>
      [
        farmer.fullName,
        farmer.email,
        farmer.phone,
        farmer.village,
        farmer.mandal,
        farmer.district,
        farmer.state,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [farmers, search]);

  const openLocation = (farmer) => {
    const lat = Number(farmer.latitude);
    const lng = Number(farmer.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert("Location coordinates are not available for this farmer.");
      return;
    }

    const url = `https://www.google.com/maps?q=${encodeURIComponent(
      `${lat},${lng}`
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const deleteFarmer = async (farmer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${farmer.fullName || "this farmer"}?`
    );

    if (!confirmed) return;

    setDeletingId(farmer.id);
    setError("");

    try {
      const response = await fetch(`${API}/${farmer.id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete farmer");
      }

      setFarmers((current) =>
        current.filter((item) => item.id !== farmer.id)
      );
    } catch (err) {
      setError(err.message || "Could not delete farmer");
    } finally {
      setDeletingId(null);
    }
  };

  const photoUrl = (fileName) =>
    fileName
      ? `${API}/profile-photo/${encodeURIComponent(fileName)}`
      : "";

  return (
    <div className="admin-farmers-page">
      <header className="farmers-header">
        <div>
          <button
            className="farmers-back-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Manage Farmers</h1>
          <p>View farmer registrations, contact details, and farm locations.</p>
        </div>

        <button
          className="farmers-refresh-btn"
          onClick={loadFarmers}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      <section className="farmers-summary">
        <div className="farmers-summary-icon">👨‍🌾</div>
        <div>
          <span>Total registered farmers</span>
          <strong>{farmers.length}</strong>
        </div>
      </section>

      <div className="farmers-toolbar">
        <input
          type="search"
          placeholder="Search by name, email, phone, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search farmers"
        />
      </div>

      {error && (
        <div className="farmers-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="farmers-message">Loading farmers...</div>
      ) : filteredFarmers.length === 0 ? (
        <div className="farmers-message">
          {farmers.length === 0
            ? "No farmers have registered yet."
            : "No farmers match your search."}
        </div>
      ) : (
        <div className="farmers-grid">
          {filteredFarmers.map((farmer) => {
            const hasCoordinates =
              farmer.latitude !== null &&
              farmer.latitude !== undefined &&
              farmer.longitude !== null &&
              farmer.longitude !== undefined &&
              Number.isFinite(Number(farmer.latitude)) &&
              Number.isFinite(Number(farmer.longitude));

            const address = [
              farmer.village,
              farmer.mandal,
              farmer.district,
              farmer.state,
              farmer.pincode,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <article className="farmer-card" key={farmer.id}>
                <div className="farmer-card-top">
                  <div className="farmer-photo">
                    {farmer.profilePhoto ? (
                      <img
                        src={photoUrl(farmer.profilePhoto)}
                        alt={`${farmer.fullName || "Farmer"} profile`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>👨‍🌾</span>
                    )}
                  </div>

                  <div className="farmer-heading">
                    <h2>{farmer.fullName || "Unnamed Farmer"}</h2>
                    <span>Farmer ID: #{farmer.id}</span>
                  </div>
                </div>

                <div className="farmer-details">
                  <div className="farmer-detail">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{farmer.email || "—"}</span>
                  </div>

                  <div className="farmer-detail">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{farmer.phone || "—"}</span>
                  </div>

                  <div className="farmer-detail">
                    <span className="detail-label">Alternative phone</span>
                    <span className="detail-value">
                      {farmer.alternativePhone || "—"}
                    </span>
                  </div>

                  <div className="farmer-detail">
                    <span className="detail-label">Farm location</span>
                    <span className="detail-value">
                      {address || "Address not provided"}
                    </span>
                  </div>

                  <div className="farmer-detail">
                    <span className="detail-label">Total land</span>
                    <span className="detail-value">
                      {farmer.totalLand != null
                        ? `${farmer.totalLand} ${farmer.landUnit || ""}`
                        : "—"}
                    </span>
                  </div>

                  {hasCoordinates && (
                    <div className="farmer-coordinates">
                      <span>Latitude: {farmer.latitude}</span>
                      <span>Longitude: {farmer.longitude}</span>
                    </div>
                  )}
                </div>

                <div className="farmer-actions">
                  <button
                    className="farmer-location-btn"
                    onClick={() => openLocation(farmer)}
                    disabled={!hasCoordinates}
                    title={
                      hasCoordinates
                        ? "Open farm location in Google Maps"
                        : "Coordinates unavailable"
                    }
                  >
                    <span>📍</span> Location
                  </button>

                  <button
                    className="farmer-delete-btn"
                    onClick={() => deleteFarmer(farmer)}
                    disabled={deletingId === farmer.id}
                  >
                    {deletingId === farmer.id ? "Deleting..." : "🗑 Delete"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminFarmers;