import React, { useCallback, useEffect, useState } from "react";
import "./AllFarmers.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api/farmers";

const AllFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all farmers from Spring Boot
  const fetchFarmers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_BASE);

      if (!response.ok) {
        throw new Error(
          `Unable to load farmers. HTTP error: ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server did not return a valid farmers list.");
      }

      setFarmers(data);
    } catch (err) {
      console.error("Error loading farmers:", err);
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  // Support the field names returned by your FarmerController
  const getFarmerName = (farmer) =>
    farmer.fullName || farmer.name || "Unnamed Farmer";

  // Search farmers by name, email, phone and address
  const filteredFarmers = farmers.filter((farmer) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      farmer.id,
      farmer.fullName,
      farmer.email,
      farmer.phone,
      farmer.alternativePhone,
      farmer.village,
      farmer.mandal,
      farmer.district,
      farmer.state,
      farmer.pincode,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    );
  });

  // Build the profile photo URL using your backend endpoint
  const getPhotoUrl = (photo) => {
    if (!photo) return null;

    return `${API_BASE}/profile-photo/${encodeURIComponent(photo)}`;
  };

  // Open the farmer's coordinates in Google Maps
  const openLocation = (farmer) => {
    const lat = Number(farmer.latitude);
    const lng = Number(farmer.longitude);

    if (
      farmer.latitude == null ||
      farmer.longitude == null ||
      farmer.latitude === "" ||
      farmer.longitude === "" ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      alert("Location is not available for this farmer.");
      return;
    }

    const url = `https://www.google.com/maps?q=${lat},${lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="farmers-loading">
        <div className="farmers-spinner"></div>
        <h3>Loading farmers...</h3>
        <p>Please wait while we retrieve registered farmers.</p>
      </div>
    );
  }

  return (
    <main className="all-farmers-page">
      {/* Page header */}
      <header className="farmers-header">
        <div>
          <span className="farmers-eyebrow">
            CROPCONNECT DIRECTORY
          </span>

          <h1>All Farmers</h1>

          <p>
            Explore registered farmers, discover their locations,
            and connect with them directly.
          </p>
        </div>

        <button
          type="button"
          className="farmers-refresh-btn"
          onClick={fetchFarmers}
        >
          <span>↻</span> Refresh
        </button>
      </header>

      {/* Statistics */}
      <section className="farmers-stats">
        <div className="farmers-stat-card">
          <div className="stat-icon">🌾</div>
          <div>
            <span className="stat-label">Registered Farmers</span>
            <h2>{farmers.length}</h2>
          </div>
        </div>

        <div className="farmers-stat-card">
          <div className="stat-icon">🔎</div>
          <div>
            <span className="stat-label">Farmers Found</span>
            <h2>{filteredFarmers.length}</h2>
          </div>
        </div>
      </section>

      {/* Search toolbar */}
      <section className="farmers-toolbar">
        <div className="farmers-search">
          <span className="search-icon">⌕</span>

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, village..."
            aria-label="Search farmers"
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <p className="farmers-count">
          Showing <strong>{filteredFarmers.length}</strong> of{" "}
          <strong>{farmers.length}</strong> farmers
        </p>
      </section>

      {/* Error state */}
      {error && (
        <section className="farmers-error">
          <div className="error-icon">!</div>
          <h2>Unable to load farmers</h2>
          <p>{error}</p>

          <button
            type="button"
            className="farmers-refresh-btn"
            onClick={fetchFarmers}
          >
            Try Again
          </button>
        </section>
      )}

      {/* Empty state */}
      {!error && filteredFarmers.length === 0 && (
        <section className="farmers-empty">
          <div className="empty-icon">🌱</div>

          <h2>
            {farmers.length === 0
              ? "No Farmers Registered Yet"
              : "No Matching Farmers Found"}
          </h2>

          <p>
            {farmers.length === 0
              ? "Registered farmer profiles will appear here."
              : "Try searching with a different name or location."}
          </p>

          {search && (
            <button
              type="button"
              className="farmers-refresh-btn"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          )}
        </section>
      )}

      {/* All farmer cards */}
      {!error && filteredFarmers.length > 0 && (
        <section className="farmers-grid">
          {filteredFarmers.map((farmer, index) => {
            const name = getFarmerName(farmer);
            const photo = farmer.profilePhoto || null;

            return (
              <article
                className="farmer-card"
                key={farmer.id ?? farmer.email ?? index}
              >
                {/* Farmer identity */}
                <div className="farmer-card-top">
                  <div className="farmer-avatar">
                    {photo && (
                      <img
                        src={getPhotoUrl(photo)}
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const fallback =
                            e.currentTarget.nextElementSibling;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    )}

                    <span
                      className="farmer-avatar-fallback"
                      style={{
                        display: photo ? "none" : "flex",
                      }}
                    >
                      {name.charAt(0).toUpperCase() || "F"}
                    </span>
                  </div>

                  <div className="farmer-identity">
                    <h3>{name}</h3>

                    <span className="farmer-id">
                      Farmer ID: {farmer.id ?? "N/A"}
                    </span>
                  </div>
                </div>

                {/* Farmer information */}
                <div className="farmer-details">
                  <div className="farmer-detail-row">
                    <span className="detail-icon">✉</span>
                    <div className="detail-content">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">
                        {farmer.email || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="farmer-detail-row">
                    <span className="detail-icon">☎</span>
                    <div className="detail-content">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">
                        {farmer.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {farmer.alternativePhone && (
                    <div className="farmer-detail-row">
                      <span className="detail-icon">📱</span>
                      <div className="detail-content">
                        <span className="detail-label">
                          Alternative Phone
                        </span>
                        <span className="detail-value">
                          {farmer.alternativePhone}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="farmer-detail-row">
                    <span className="detail-icon">⌖</span>
                    <div className="detail-content">
                      <span className="detail-label">Farm Location</span>
                      <span className="detail-value">
                        {[
                          farmer.village,
                          farmer.mandal,
                          farmer.district,
                          farmer.state,
                          farmer.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Location not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="farmer-land">
                    <div>
                      <span className="land-label">Total Land</span>
                      <strong>
                        {farmer.totalLand ?? "—"}
                        {farmer.totalLand != null
                          ? ` ${farmer.landUnit || "acres"}`
                          : ""}
                      </strong>
                    </div>

                    <span className="land-icon">🌾</span>
                  </div>
                </div>

                {/* Farmer actions */}
                <div className="farmer-actions">
                  <a
                    className="farmer-contact-btn"
                    href={
                      farmer.phone
                        ? `tel:${farmer.phone}`
                        : undefined
                    }
                    onClick={(e) => {
                      if (!farmer.phone) {
                        e.preventDefault();
                        alert("Phone number is not available.");
                      }
                    }}
                  >
                    <span>☎</span> Contact
                  </a>

                  <button
                    type="button"
                    className="farmer-location-btn"
                    onClick={() => openLocation(farmer)}
                  >
                    <span>⌖</span> See Location
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default AllFarmers;
