import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminBuyers.css";

const API = "http://localhost:8081/api/buyers";

function AdminBuyers() {
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadBuyers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/all`);

      if (!response.ok) {
        throw new Error("Could not load buyers");
      }

      const data = await response.json();
      setBuyers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);

  const filteredBuyers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return buyers;

    return buyers.filter((buyer) =>
      [
        buyer.fullName,
        buyer.email,
        buyer.phone,
        buyer.village,
        buyer.mandal,
        buyer.district,
        buyer.state,
        buyer.companyName,
        buyer.businessName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [buyers, search]);

  const openLocation = (buyer) => {
    const lat = Number(buyer.latitude);
    const lng = Number(buyer.longitude);

    if (
      buyer.latitude == null ||
      buyer.longitude == null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      alert("Location coordinates are not available for this buyer.");
      return;
    }

    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const deleteBuyer = async (buyer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        buyer.fullName || "this buyer"
      }?`
    );

    if (!confirmed) return;

    setDeletingId(buyer.id);
    setError("");

    try {
      const response = await fetch(`${API}/${buyer.id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete buyer");
      }

      setBuyers((current) =>
        current.filter((item) => item.id !== buyer.id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete buyer");
    } finally {
      setDeletingId(null);
    }
  };

  const getPhotoUrl = (fileName) => {
    if (!fileName) return "";

    return `${API}/profile-photo/${encodeURIComponent(fileName)}`;
  };

  return (
    <div className="admin-buyers-page">
      <header className="buyers-header">
        <div>
          <button
            className="buyers-back-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Manage Buyers</h1>
          <p>View registered buyers and manage their information.</p>
        </div>

        <button
          className="buyers-refresh-btn"
          onClick={loadBuyers}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      <section className="buyers-summary">
        <div className="buyers-summary-icon">🛒</div>
        <div>
          <span>Total registered buyers</span>
          <strong>{buyers.length}</strong>
        </div>
      </section>

      <div className="buyers-search">
        <input
          type="search"
          placeholder="Search by name, email, phone, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search buyers"
        />
      </div>

      {error && (
        <div className="buyers-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="buyers-message">Loading buyers...</div>
      ) : filteredBuyers.length === 0 ? (
        <div className="buyers-message">
          {buyers.length === 0
            ? "No buyers have registered yet."
            : "No buyers match your search."}
        </div>
      ) : (
        <div className="buyers-grid">
          {filteredBuyers.map((buyer) => {
            const hasLocation =
              buyer.latitude != null &&
              buyer.longitude != null &&
              Number.isFinite(Number(buyer.latitude)) &&
              Number.isFinite(Number(buyer.longitude)) &&
              Number(buyer.latitude) >= -90 &&
              Number(buyer.latitude) <= 90 &&
              Number(buyer.longitude) >= -180 &&
              Number(buyer.longitude) <= 180;

            const address = [
              buyer.village,
              buyer.mandal,
              buyer.district,
              buyer.state,
              buyer.pincode,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <article className="buyer-card" key={buyer.id}>
                <div className="buyer-card-top">
                  <div className="buyer-photo">
                    {buyer.profilePhoto ? (
                      <img
                        src={getPhotoUrl(buyer.profilePhoto)}
                        alt={`${buyer.fullName || "Buyer"} profile`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>🛒</span>
                    )}
                  </div>

                  <div className="buyer-heading">
                    <h2>{buyer.fullName || "Unnamed Buyer"}</h2>
                    <span>Buyer ID: #{buyer.id}</span>
                  </div>
                </div>

                <div className="buyer-details">
                  <div className="buyer-detail">
                    <span className="buyer-label">Email</span>
                    <span className="buyer-value">
                      {buyer.email || "—"}
                    </span>
                  </div>

                  <div className="buyer-detail">
                    <span className="buyer-label">Phone</span>
                    <span className="buyer-value">
                      {buyer.phone || "—"}
                    </span>
                  </div>

                  <div className="buyer-detail">
                    <span className="buyer-label">Alternative phone</span>
                    <span className="buyer-value">
                      {buyer.alternativePhone || "—"}
                    </span>
                  </div>

                  <div className="buyer-detail">
                    <span className="buyer-label">Location</span>
                    <span className="buyer-value">
                      {address || "Address not provided"}
                    </span>
                  </div>

                  {hasLocation && (
                    <div className="buyer-coordinates">
                      <span>Latitude: {buyer.latitude}</span>
                      <span>Longitude: {buyer.longitude}</span>
                    </div>
                  )}
                </div>

                <div className="buyer-actions">
                  <button
                    className="buyer-location-btn"
                    onClick={() => openLocation(buyer)}
                    disabled={!hasLocation}
                    title={
                      hasLocation
                        ? "Open buyer location in Google Maps"
                        : "Location coordinates unavailable"
                    }
                  >
                    📍 Location
                  </button>

                  <button
                    className="buyer-delete-btn"
                    onClick={() => deleteBuyer(buyer)}
                    disabled={deletingId === buyer.id}
                  >
                    {deletingId === buyer.id
                      ? "Deleting..."
                      : "🗑 Delete"}
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

export default AdminBuyers;