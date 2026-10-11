
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCrops.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api/crops";
const BACKEND_URL = "https://cropconnect-backend-exn7.onrender.com";

function AdminCrops() {
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Load all crops
  const loadCrops = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Could not load crops");
      }

      const data = await response.json();
      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  // Search crops
  const filteredCrops = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return crops;

    return crops.filter((crop) =>
      [
        crop.cropName,
        crop.cropType,
        crop.location,
        crop.description,
        crop.unit,
        crop.farmerId,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [crops, search]);

  // Open crop location in Google Maps
  const openLocation = (crop) => {
    if (!crop.location || !String(crop.location).trim()) {
      alert("Location is not available for this crop.");
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      crop.location
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Delete crop
  const deleteCrop = async (crop) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${crop.cropName || "this crop"}"?`
    );

    if (!confirmed) return;

    setDeletingId(crop.id);
    setError("");

    try {
      const response = await fetch(`${API}/${crop.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete crop");
      }

      setCrops((current) =>
        current.filter((item) => item.id !== crop.id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete crop");
    } finally {
      setDeletingId(null);
    }
  };

  // Build crop image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "";

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `${BACKEND_URL}${
      imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`
    }`;
  };

  return (
    <div className="admin-crops-page">
      <header className="crops-header">
        <div>
          <button
            className="crops-back-btn"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Manage Crops</h1>
          <p>View and manage all crops listed by registered farmers.</p>
        </div>

        <button
          className="crops-refresh-btn"
          onClick={loadCrops}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      <section className="crops-summary">
        <div className="crops-summary-icon">🌾</div>
        <div>
          <span>Total listed crops</span>
          <strong>{crops.length}</strong>
        </div>
      </section>

      <div className="crops-toolbar">
        <input
          type="search"
          placeholder="Search crop, type, location, or farmer ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search crops"
        />
      </div>

      {error && (
        <div className="crops-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="crops-message">Loading crops...</div>
      ) : filteredCrops.length === 0 ? (
        <div className="crops-message">
          {crops.length === 0
            ? "No crops have been listed yet."
            : "No crops match your search."}
        </div>
      ) : (
        <div className="crops-grid">
          {filteredCrops.map((crop) => (
            <article className="admin-crop-card" key={crop.id}>
              <div className="admin-crop-image">
                {crop.imageUrl ? (
                  <img
                    src={getImageUrl(crop.imageUrl)}
                    alt={crop.cropName || "Crop"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className="crop-image-placeholder"
                  style={{
                    display: crop.imageUrl ? "none" : "flex",
                  }}
                >
                  🌾
                  <span>No crop image</span>
                </div>
              </div>

              <div className="admin-crop-content">
                <div className="admin-crop-title-row">
                  <div>
                    <h2>{crop.cropName || "Unnamed Crop"}</h2>
                    <span className="admin-crop-id">
                      Crop ID: #{crop.id}
                    </span>
                  </div>
                  <span className="crop-type-badge">
                    {crop.cropType || "Crop"}
                  </span>
                </div>

                <div className="admin-crop-details">
                  <div className="admin-crop-detail">
                    <span>Farmer ID</span>
                    <strong>{crop.farmerId ?? "—"}</strong>
                  </div>

                  <div className="admin-crop-detail">
                    <span>Quantity</span>
                    <strong>
                      {crop.quantity != null
                        ? `${crop.quantity} ${crop.unit || ""}`
                        : "—"}
                    </strong>
                  </div>

                  <div className="admin-crop-detail">
                    <span>Price</span>
                    <strong>
                      {crop.price != null
                        ? `₹${Number(crop.price).toLocaleString("en-IN")}`
                        : "—"}
                    </strong>
                  </div>

                  <div className="admin-crop-detail">
                    <span>Harvest date</span>
                    <strong>{crop.harvestDate || "—"}</strong>
                  </div>
                </div>

                <div className="admin-crop-location">
                  <span>📍 Location</span>
                  <p>{crop.location || "Location not provided"}</p>
                </div>

                {crop.description && (
                  <div className="admin-crop-description">
                    <span>Description</span>
                    <p>{crop.description}</p>
                  </div>
                )}

                <div className="admin-crop-actions">
                  <button
                    className="crop-location-btn"
                    onClick={() => openLocation(crop)}
                    disabled={!crop.location || !crop.location.trim()}
                  >
                    📍 Location
                  </button>

                  <button
                    className="crop-delete-btn"
                    onClick={() => deleteCrop(crop)}
                    disabled={deletingId === crop.id}
                  >
                    {deletingId === crop.id
                      ? "Deleting..."
                      : "🗑 Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCrops;
