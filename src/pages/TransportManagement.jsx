
import React, { useCallback, useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./TransportManagement.css";

const API = "http://localhost:8081/api";

const DEFAULT_CENTER = [17.3850, 78.4867];

// Leaflet marker icons
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      if (onSelect) {
        onSelect([event.latlng.lat, event.latlng.lng]);
      }
    },
  });

  return null;
}

function getCoordinates(item) {
  const latitude = Number(
    item.latitude ?? item.lat ?? item.pickupLatitude
  );
  const longitude = Number(
    item.longitude ?? item.lng ?? item.pickupLongitude
  );

  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    (latitude !== 0 || longitude !== 0)
  ) {
    return [latitude, longitude];
  }

  return null;
}

export default function TransportManagement() {
  const [transporters, setTransporters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const loadTransporters = useCallback(async () => {
    setLoadingTransporters(true);

    try {
      const response = await fetch(`${API}/transporters/all`);

      if (!response.ok) {
        throw new Error(`Transporters request failed: ${response.status}`);
      }

      const data = await response.json();
      setTransporters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Transporter loading error:", err);
      setError("Unable to load transporters. Check your backend connection.");
    } finally {
      setLoadingTransporters(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);

    try {
      // Change this endpoint only if your backend uses a different route.
      const response = await fetch(`${API}/transport-bookings`);

      if (response.status === 404) {
        setBookings([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Bookings request failed: ${response.status}`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Transport booking loading error:", err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    loadTransporters();
    loadBookings();
  }, [loadTransporters, loadBookings]);

  const deleteTransporter = async (id) => {
    if (id == null) {
      setError("Transporter ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this transporter?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API}/transporters/${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          detail || `Delete failed with status ${response.status}`
        );
      }

      setMessage("Transporter deleted successfully.");

      if (selectedTransporter?.id === id) {
        setSelectedTransporter(null);
      }

      await loadTransporters();
    } catch (err) {
      console.error("Transporter deletion error:", err);
      setError(err.message || "Unable to delete transporter.");
    }
  };

  const filteredTransporters = transporters.filter((transporter) => {
    const searchable = [
      transporter.name,
      transporter.transporterName,
      transporter.fullName,
      transporter.email,
      transporter.phone,
      transporter.vehicleType,
      transporter.vehicleNumber,
      transporter.city,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchable.includes(search.toLowerCase());
  });

  const mapCenter =
    selectedLocation ||
    getCoordinates(selectedTransporter || {}) ||
    DEFAULT_CENTER;

  const displayedRoute = routeCoordinates.length > 1
    ? routeCoordinates
    : [];

  const handleSelectMapLocation = (coordinates) => {
    setSelectedLocation(coordinates);
    setRouteCoordinates([]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setSelectedLocation(coordinates);
        setRouteCoordinates([]);
        setError("");
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError(
          "Unable to get your location. Please allow location access."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="transport-management">
      <header className="transport-header">
        <div>
          <h1>Transport Management</h1>
          <p>Manage transporters, view locations, and monitor bookings.</p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={() => {
            setError("");
            setMessage("");
            loadTransporters();
            loadBookings();
          }}
        >
          Refresh
        </button>
      </header>

      {message && (
        <div className="success-message" role="status">
          {message}
          <button type="button" onClick={() => setMessage("")}>
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button type="button" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      <section className="transport-summary">
        <div className="summary-card">
          <span>Total Transporters</span>
          <strong>{transporters.length}</strong>
        </div>

        <div className="summary-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </div>

        <div className="summary-card">
          <span>Map Location</span>
          <strong>
            {selectedLocation ? "Selected" : "Hyderabad"}
          </strong>
        </div>
      </section>

      <section className="transport-map-section">
        <div className="section-heading">
          <div>
            <h2>Transport Map</h2>
            <p>Select a point on the map to mark a location.</p>
          </div>

          <button
            type="button"
            className="location-btn"
            onClick={handleUseCurrentLocation}
          >
            Use My Location
          </button>
        </div>

        <div className="transport-map">
          <MapContainer
            center={mapCenter}
            zoom={11}
            scrollWheelZoom
            style={{ height: "100%", minHeight: "350px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onSelect={handleSelectMapLocation} />

            {selectedLocation && (
              <Marker position={selectedLocation}>
                <Popup>Selected location</Popup>
              </Marker>
            )}

            {filteredTransporters.map((transporter) => {
              const coordinates = getCoordinates(transporter);

              if (!coordinates) return null;

              return (
                <Marker
                  key={transporter.id}
                  position={coordinates}
                  eventHandlers={{
                    click: () => setSelectedTransporter(transporter),
                  }}
                >
                  <Popup>
                    <strong>
                      {transporter.name ||
                        transporter.transporterName ||
                        transporter.fullName ||
                        "Transporter"}
                    </strong>
                    <br />
                    {transporter.phone || "No phone provided"}
                  </Popup>
                </Marker>
              );
            })}

            {displayedRoute.length > 1 && (
              <Polyline positions={displayedRoute} />
            )}
          </MapContainer>
        </div>

        {selectedLocation && (
          <p className="selected-coordinates">
            Selected coordinates: {selectedLocation[0].toFixed(6)},{" "}
            {selectedLocation[1].toFixed(6)}
          </p>
        )}

        {selectedTransporter && (
          <div className="selected-transporter">
            <strong>
              {selectedTransporter.name ||
                selectedTransporter.transporterName ||
                selectedTransporter.fullName ||
                "Transporter"}
            </strong>
            <span>{selectedTransporter.email || "No email provided"}</span>
            <span>{selectedTransporter.phone || "No phone provided"}</span>
            <button
              type="button"
              onClick={() => setSelectedTransporter(null)}
            >
              Clear selection
            </button>
          </div>
        )}
      </section>

      <section className="transporters-section">
        <div className="section-heading">
          <div>
            <h2>All Transporters</h2>
            <p>View and manage registered transporters.</p>
          </div>

          <input
            type="search"
            className="transporter-search"
            placeholder="Search transporters..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loadingTransporters ? (
          <p className="loading-text">Loading transporters...</p>
        ) : filteredTransporters.length === 0 ? (
          <div className="empty-state">
            <h3>No transporters found</h3>
            <p>Try another search or register a transporter first.</p>
          </div>
        ) : (
          <div className="transporter-grid">
            {filteredTransporters.map((transporter) => (
              <article className="transporter-card" key={transporter.id}>
                <div className="transporter-card-header">
                  <div className="transporter-avatar">
                    {(
                      transporter.name ||
                      transporter.transporterName ||
                      transporter.fullName ||
                      "T"
                    )
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>
                      {transporter.name ||
                        transporter.transporterName ||
                        transporter.fullName ||
                        "Transporter"}
                    </h3>
                    <p>{transporter.email || "No email provided"}</p>
                  </div>
                </div>

                <div className="transporter-details">
                  <p>
                    <strong>Phone:</strong>{" "}
                    {transporter.phone || "Not provided"}
                  </p>
                  <p>
                    <strong>Vehicle:</strong>{" "}
                    {transporter.vehicleType || "Not provided"}
                  </p>
                  <p>
                    <strong>Vehicle Number:</strong>{" "}
                    {transporter.vehicleNumber || "Not provided"}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {[transporter.city, transporter.state]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </p>
                </div>

                <div className="secondary-actions">
                  <button
                    type="button"
                    className="view-btn"
                    onClick={() => {
                      setSelectedTransporter(transporter);
                      setSelectedLocation(getCoordinates(transporter));
                    }}
                  >
                    View on Map
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTransporter(transporter.id)}
                  >
                    Delete Transporter
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="transport-bookings-section">
        <div className="section-heading">
          <div>
            <h2>Transport Bookings</h2>
            <p>Recent transport booking records.</p>
          </div>
        </div>

        {loadingBookings ? (
          <p className="loading-text">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <h3>No transport bookings found</h3>
            <p>Bookings will appear here when available.</p>
          </div>
        ) : (
          <div className="transport-bookings-table-wrapper">
            <table className="transport-bookings-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Transporter</th>
                  <th>Pickup</th>
                  <th>Destination</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id ?? index}>
                    <td>{booking.id ?? "-"}</td>
                    <td>
                      {booking.customerName ||
                        booking.farmerName ||
                        booking.buyerName ||
                        booking.customerEmail ||
                        "-"}
                    </td>
                    <td>
                      {booking.transporterName ||
                        booking.transporter?.name ||
                        booking.transporterId ||
                        "-"}
                    </td>
                    <td>
                      {booking.pickupLocation ||
                        booking.pickupAddress ||
                        "-"}
                    </td>
                    <td>
                      {booking.destination ||
                        booking.destinationAddress ||
                        booking.deliveryLocation ||
                        "-"}
                    </td>
                    <td>
                      <span
                        className={`booking-status booking-status-${String(
                          booking.status || "PENDING"
                        ).toLowerCase()}`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
