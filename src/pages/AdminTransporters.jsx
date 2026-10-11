
import React, { useEffect, useState } from "react";
import "./AdminTransporters.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api/transporters";

function AdminTransporters() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTransporters();
  }, []);

  const fetchTransporters = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/all`);

      if (!response.ok) {
        throw new Error("Failed to load transporters");
      }

      const data = await response.json();
      setTransporters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load transporters");
    } finally {
      setLoading(false);
    }
  };

  const openLocation = (transporter) => {
    const lat = transporter.latitude;
    const lng = transporter.longitude;

    if (lat == null || lng == null) {
      alert("Location is not available for this transporter.");
      return;
    }

    const url = `https://www.google.com/maps?q=${encodeURIComponent(
      `${lat},${lng}`
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const deleteTransporter = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transporter?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete transporter");
      }

      setTransporters((previous) =>
        previous.filter((transporter) => transporter.id !== id)
      );

      alert("Transporter deleted successfully.");
    } catch (err) {
      alert(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTransporters = transporters.filter((t) => {
    const text = [
      t.fullName,
      t.phone,
      t.email,
      t.businessName,
      t.transporterType,
      t.vehicleNumber,
      t.vehicleType,
      t.village,
      t.district,
      t.state,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const getPhotoUrl = (photo) => {
    if (!photo) return "";

    if (photo.startsWith("http://") || photo.startsWith("https://")) {
      return photo;
    }

    const filename = photo.split("/").pop();
    return `${API}/profile-photo/${encodeURIComponent(filename)}`;
  };

  return (
    <div className="admin-transporters">
      <div className="transporters-header">
        <div>
          <span className="transporters-eyebrow">CROPCONNECT ADMIN</span>
          <h1>Transporter Management</h1>
          <p>View and manage all registered transporters.</p>
        </div>

        <button className="refresh-btn" onClick={fetchTransporters}>
          ↻ Refresh
        </button>
      </div>

      <div className="transporter-toolbar">
        <div className="transporter-count">
          <span>Total Transporters</span>
          <strong>{transporters.length}</strong>
        </div>

        <input
          type="search"
          placeholder="Search by name, phone, vehicle, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="transporter-search"
        />
      </div>

      {loading && (
        <div className="transporter-message">Loading transporters...</div>
      )}

      {!loading && error && (
        <div className="transporter-error">
          <p>{error}</p>
          <button onClick={fetchTransporters}>Try Again</button>
        </div>
      )}

      {!loading && !error && filteredTransporters.length === 0 && (
        <div className="transporter-empty">
          <div className="empty-icon">🚚</div>
          <h2>No transporters found</h2>
          <p>
            {search
              ? "Try a different search term."
              : "No transporters have registered yet."}
          </p>
        </div>
      )}

      {!loading && !error && filteredTransporters.length > 0 && (
        <div className="transporter-grid">
          {filteredTransporters.map((t) => (
            <article className="transporter-card" key={t.id}>
              <div className="transporter-card-top">
                <div className="transporter-photo">
                  {t.profilePhoto ? (
                    <img
                      src={getPhotoUrl(t.profilePhoto)}
                      alt={t.fullName || "Transporter"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="photo-placeholder"
                    style={{
                      display: t.profilePhoto ? "none" : "flex",
                    }}
                  >
                    🚚
                  </div>
                </div>

                <div className="transporter-title">
                  <h2>{t.fullName || "Unnamed transporter"}</h2>
                  <span className="transporter-id">
                    ID: {t.id}
                  </span>
                  <span
                    className={
                      t.currentlyAvailable
                        ? "availability available"
                        : "availability unavailable"
                    }
                  >
                    {t.currentlyAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="transporter-details">
                <div className="detail-row">
                  <span>📞 Phone</span>
                  <strong>{t.phone || "Not provided"}</strong>
                </div>

                <div className="detail-row">
                  <span>✉️ Email</span>
                  <strong>{t.email || "Not provided"}</strong>
                </div>

                <div className="detail-row">
                  <span>🏢 Business</span>
                  <strong>{t.businessName || "Not provided"}</strong>
                </div>

                <div className="detail-row">
                  <span>🚛 Transport type</span>
                  <strong>{t.transporterType || "Not provided"}</strong>
                </div>

                <div className="detail-row">
                  <span>🚚 Vehicle</span>
                  <strong>{t.vehicleType || "Not provided"}</strong>
                </div>

                <div className="detail-row">
                  <span>🔢 Vehicle number</span>
                  <strong>{t.vehicleNumber || "Not provided"}</strong>
                </div>

                <div className="detail-row">
                  <span>📦 Capacity</span>
                  <strong>
                    {t.vehicleCapacity != null
                      ? `${t.vehicleCapacity} ${t.capacityUnit || ""}`
                      : "Not provided"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>📍 Address</span>
                  <strong>
                    {[t.village, t.district, t.state]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </strong>
                </div>
              </div>

              <div className="transporter-actions">
                <button
                  className="location-btn"
                  onClick={() => openLocation(t)}
                  disabled={t.latitude == null || t.longitude == null}
                >
                  📍 Location
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteTransporter(t.id)}
                  disabled={deletingId === t.id}
                >
                  {deletingId === t.id ? "Deleting..." : "🗑 Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTransporters;
