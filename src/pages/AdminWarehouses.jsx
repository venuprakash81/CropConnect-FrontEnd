import React, { useCallback, useEffect, useState } from "react";
import "./AdminWarehouses.css";

const API_URL = "https://cropconnect-backend-exn7.onrender.com/api/warehouses";

function getMapUrl(warehouse) {
  const lat = warehouse.latitude;
  const lng = warehouse.longitude;

  if (
    lat !== null &&
    lat !== undefined &&
    lng !== null &&
    lng !== undefined &&
    lat !== "" &&
    lng !== ""
  ) {
    return `https://www.google.com/maps?q=${encodeURIComponent(
      `${lat},${lng}`
    )}`;
  }

  if (warehouse.location) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      warehouse.location
    )}`;
  }

  return null;
}

function getPhotoUrl(photo) {
  if (!photo) return null;

  if (photo.startsWith("http://") || photo.startsWith("https://")) {
    return photo;
  }

  return `http://localhost:8081/api/warehouses/profile-photo/${encodeURIComponent(
    photo
  )}`;
}

export default function AdminWarehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/all`);

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Request failed (${response.status}): ${
            responseText || response.statusText
          }`
        );
      }

      let data;

      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch {
        throw new Error("The backend returned invalid JSON.");
      }

      if (!Array.isArray(data)) {
        throw new Error(
          data?.message || "Expected a list of warehouses from the backend."
        );
      }

      setWarehouses(data);
    } catch (err) {
      console.error("Warehouse loading error:", err);
      setError(err.message || "Could not load warehouses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleDelete = async (warehouse) => {
    const id = warehouse.id;

    if (id === null || id === undefined) {
      alert("This warehouse does not have an ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        warehouse.warehouseName || "this warehouse"
      }?`
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          `Delete failed (${response.status}): ${
            responseText || response.statusText
          }`
        );
      }

      setWarehouses((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Warehouse deletion error:", err);
      alert(err.message || "Could not delete the warehouse.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return true;

    return [
      warehouse.warehouseName,
      warehouse.location,
      warehouse.supportedCrops,
      warehouse.ownerName,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(searchText)
      );
  });

  return (
    <div className="admin-warehouses">
      <div className="warehouse-header">
        <div>
          <span className="warehouse-eyebrow">ADMIN PANEL</span>
          <h1>Warehouse Management</h1>
          <p>View, locate, search, and manage registered warehouses.</p>
        </div>

        <button
          className="warehouse-refresh"
          onClick={fetchWarehouses}
          disabled={loading}
          type="button"
        >
          ↻ {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="warehouse-summary">
        <div className="warehouse-summary-icon">▦</div>
        <div>
          <span>Total warehouses</span>
          <strong>{warehouses.length}</strong>
        </div>
      </div>

      <div className="warehouse-toolbar">
        <div className="warehouse-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by name, location, or crop..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="warehouse-error" role="alert">
          <strong>Could not load warehouses</strong>
          <p>{error}</p>
          <button type="button" onClick={fetchWarehouses}>
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="warehouse-message">
          <div className="warehouse-spinner" />
          <p>Loading warehouses...</p>
        </div>
      ) : !error && filteredWarehouses.length === 0 ? (
        <div className="warehouse-empty">
          <div className="warehouse-empty-icon">▦</div>
          <h2>
            {warehouses.length === 0
              ? "No warehouses registered"
              : "No matching warehouses"}
          </h2>
          <p>
            {warehouses.length === 0
              ? "Registered warehouses will appear here."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="warehouse-grid">
          {filteredWarehouses.map((warehouse) => {
            const mapUrl = getMapUrl(warehouse);
            const photoUrl = getPhotoUrl(warehouse.profilePhoto);

            return (
              <article
                className="warehouse-card"
                key={warehouse.id}
              >
                <div className="warehouse-card-top">
                  <div className="warehouse-avatar">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={warehouse.warehouseName || "Warehouse"}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>▦</span>
                    )}
                  </div>

                  <div className="warehouse-card-title">
                    <h2>
                      {warehouse.warehouseName || "Unnamed Warehouse"}
                    </h2>
                    <span className="warehouse-id">
                      ID: {warehouse.id}
                    </span>
                  </div>
                </div>

                <div className="warehouse-details">
                  <div className="warehouse-detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">
                      {warehouse.location || "Not provided"}
                    </span>
                  </div>

                  <div className="warehouse-detail-row">
                    <span className="detail-label">Capacity</span>
                    <span className="detail-value">
                      {warehouse.totalStorageCapacity !== null &&
                      warehouse.totalStorageCapacity !== undefined
                        ? `${warehouse.totalStorageCapacity} units`
                        : "Not provided"}
                    </span>
                  </div>

                  <div className="warehouse-detail-row">
                    <span className="detail-label">Coordinates</span>
                    <span className="detail-value">
                      {warehouse.latitude != null &&
                      warehouse.longitude != null
                        ? `${warehouse.latitude}, ${warehouse.longitude}`
                        : "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="warehouse-actions">
                  {mapUrl ? (
                    <a
                      className="warehouse-location-button"
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>⌖</span> View Location
                    </a>
                  ) : (
                    <button
                      className="warehouse-location-button disabled"
                      type="button"
                      disabled
                    >
                      Location unavailable
                    </button>
                  )}

                  <button
                    className="warehouse-delete-button"
                    type="button"
                    onClick={() => handleDelete(warehouse)}
                    disabled={deletingId === warehouse.id}
                  >
                    {deletingId === warehouse.id
                      ? "Deleting..."
                      : "Delete"}
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
