
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TransporterBookings.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";
const defaultCenter = [17.3850, 78.4867];

const pickupIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function readStoredUser() {
  for (const storage of [localStorage, sessionStorage]) {
    for (const key of ["transporter", "user", "loggedInUser"]) {
      try {
        const raw = storage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch {
        // The storage value may be a plain string rather than JSON.
      }
    }
  }

  return {};
}

function getCoordinates(latitude, longitude) {
  if (
    latitude === undefined ||
    latitude === null ||
    longitude === undefined ||
    longitude === null ||
    latitude === "" ||
    longitude === ""
  ) {
    return null;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180 ||
    (lat === 0 && lng === 0)
  ) {
    return null;
  }

  return [lat, lng];
}

function getBookingCoordinates(booking) {
  const pickup = getCoordinates(
    booking.pickupLatitude ?? booking.pickupLat ?? booking.fromLatitude,
    booking.pickupLongitude ?? booking.pickupLng ?? booking.fromLongitude
  );

  const destination = getCoordinates(
    booking.destinationLatitude ??
      booking.dropLatitude ??
      booking.toLatitude,
    booking.destinationLongitude ??
      booking.dropLongitude ??
      booking.toLongitude
  );

  return { pickup, destination };
}

function getStatusClass(status) {
  return String(status || "PENDING")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-");
}

export default function TransporterBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const transporter = useMemo(() => readStoredUser(), []);

  const transporterId =
    transporter.id ??
    transporter.transporterId ??
    localStorage.getItem("transporterId") ??
    sessionStorage.getItem("transporterId");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      /*
       * IMPORTANT:
       * This assumes your backend supports:
       * GET /api/transport-bookings/transporter/{transporterId}
       *
       * If your controller uses a different endpoint, replace this URL
       * with the exact mapping from your TransportBookingController.
       */
      if (!transporterId) {
        setBookings([]);
        setError(
          "Transporter ID was not found. Please log in again."
        );
        return;
      }

      const response = await fetch(
        `${API}/transport-bookings/transporter/${encodeURIComponent(
          transporterId
        )}`
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load bookings (HTTP ${response.status}). Check the backend endpoint.`
        );
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Transporter bookings error:", err);
      setBookings([]);
      setError(err.message || "Unable to load transport bookings.");
    } finally {
      setLoading(false);
    }
  }, [transporterId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch = [
        booking.id,
        booking.customerName,
        booking.farmerName,
        booking.buyerName,
        booking.customerEmail,
        booking.pickupLocation,
        booking.pickupAddress,
        booking.destination,
        booking.destinationAddress,
        booking.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        String(booking.status || "PENDING").toUpperCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const openBookingOnMap = (booking) => {
    setSelectedBooking(booking);
  };

  const updateStatus = async (booking, status) => {
    setError("");
    setMessage("");

    try {
      /*
       * Assumes the backend supports:
       * PUT /api/transport-bookings/{id}/status?status=APPROVED
       *
       * Match this URL to your existing Spring Boot controller.
       */
      const response = await fetch(
        `${API}/transport-bookings/${encodeURIComponent(
          booking.id
        )}/status?status=${encodeURIComponent(status)}`,
        { method: "PUT" }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to update booking status (HTTP ${response.status}).`
        );
      }

      setMessage(`Booking ${status.toLowerCase()} successfully.`);
      await loadBookings();
    } catch (err) {
      console.error("Booking status update error:", err);
      setError(err.message || "Unable to update booking status.");
    }
  };

  const activeBooking = filteredBookings.find(
    (booking) => booking.id === selectedBooking?.id
  );

  const displayedBooking = activeBooking || selectedBooking;
  const coordinates = displayedBooking
    ? getBookingCoordinates(displayedBooking)
    : { pickup: null, destination: null };

  const mapCenter =
    coordinates.pickup ||
    coordinates.destination ||
    defaultCenter;

  const routePositions =
    coordinates.pickup && coordinates.destination
      ? [coordinates.pickup, coordinates.destination]
      : [];

  return (
    <div className="transporter-bookings-page">
      <header className="transporter-bookings-header">
        <div>
          <h1>My Transport Bookings</h1>
          <p>View your transport requests and manage booking status.</p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={loadBookings}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
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

      <section className="transporter-bookings-summary">
        <div className="summary-card">
          <span>Total Bookings</span>
          <strong>{bookings.length}</strong>
        </div>

        <div className="summary-card">
          <span>Pending</span>
          <strong>
            {
              bookings.filter(
                (booking) =>
                  String(booking.status || "PENDING").toUpperCase() ===
                  "PENDING"
              ).length
            }
          </strong>
        </div>

        <div className="summary-card">
          <span>Approved</span>
          <strong>
            {
              bookings.filter(
                (booking) =>
                  String(booking.status || "").toUpperCase() ===
                  "APPROVED"
              ).length
            }
          </strong>
        </div>
      </section>

      <section className="transporter-bookings-map-section">
        <div className="section-heading">
          <div>
            <h2>Pickup and Destination Map</h2>
            <p>
              Select a booking below to view its available coordinates.
            </p>
          </div>
        </div>

        <div className="transporter-bookings-map">
          <MapContainer
            key={`${mapCenter[0]}-${mapCenter[1]}`}
            center={mapCenter}
            zoom={11}
            scrollWheelZoom
            style={{ width: "100%", height: "100%", minHeight: "350px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {coordinates.pickup && (
              <Marker position={coordinates.pickup} icon={pickupIcon}>
                <Popup>
                  <strong>Pickup Location</strong>
                  <br />
                  {displayedBooking?.pickupLocation ||
                    displayedBooking?.pickupAddress ||
                    "Pickup"}
                </Popup>
              </Marker>
            )}

            {coordinates.destination && (
              <Marker
                position={coordinates.destination}
                icon={destinationIcon}
              >
                <Popup>
                  <strong>Destination</strong>
                  <br />
                  {displayedBooking?.destination ||
                    displayedBooking?.destinationAddress ||
                    "Destination"}
                </Popup>
              </Marker>
            )}

            {routePositions.length === 2 && (
              <Polyline positions={routePositions} />
            )}
          </MapContainer>
        </div>

        {displayedBooking &&
          !coordinates.pickup &&
          !coordinates.destination && (
            <p className="map-info-message">
              This booking does not contain valid pickup or destination
              coordinates. The map is showing Hyderabad as the default view.
            </p>
          )}
      </section>

      <section className="transporter-bookings-list-section">
        <div className="section-heading">
          <div>
            <h2>Booking Details</h2>
            <p>Search and filter your transport bookings.</p>
          </div>
        </div>

        <div className="booking-filters">
          <input
            type="search"
            className="booking-search"
            placeholder="Search bookings..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="booking-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <h3>No bookings found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="transporter-bookings-grid">
            {filteredBookings.map((booking, index) => {
              const status = String(
                booking.status || "PENDING"
              ).toUpperCase();

              const bookingCoordinates =
                getBookingCoordinates(booking);

              return (
                <article
                  className="transporter-booking-card"
                  key={booking.id ?? index}
                >
                  <div className="booking-card-header">
                    <div>
                      <span>BOOKING ID</span>
                      <h3>#{booking.id ?? index + 1}</h3>
                    </div>

                    <span
                      className={`booking-status booking-status-${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="booking-card-details">
                    <p>
                      <strong>Customer:</strong>{" "}
                      {booking.customerName ||
                        booking.farmerName ||
                        booking.buyerName ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {booking.customerPhone ||
                        booking.phone ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>Pickup:</strong>{" "}
                      {booking.pickupLocation ||
                        booking.pickupAddress ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>Destination:</strong>{" "}
                      {booking.destination ||
                        booking.destinationAddress ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>Crop / Goods:</strong>{" "}
                      {booking.cropName || booking.goodsName || "-"}
                    </p>

                    <p>
                      <strong>Quantity:</strong>{" "}
                      {booking.quantity ?? "-"}{" "}
                      {booking.quantityUnit || ""}
                    </p>

                    <p>
                      <strong>Booking Date:</strong>{" "}
                      {booking.bookingDate ||
                        booking.createdAt ||
                        "-"}
                    </p>
                  </div>

                  <div className="booking-card-actions">
                    <button
                      type="button"
                      className="view-booking-btn"
                      onClick={() => openBookingOnMap(booking)}
                    >
                      View Route
                    </button>

                    {status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          className="approve-button"
                          onClick={() => updateStatus(booking, "APPROVED")}
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="reject-button"
                          onClick={() => updateStatus(booking, "REJECTED")}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {status === "APPROVED" && (
                      <button
                        type="button"
                        className="complete-button"
                        onClick={() => updateStatus(booking, "COMPLETED")}
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>

                  {!bookingCoordinates.pickup &&
                    !bookingCoordinates.destination && (
                      <p className="map-info-message">
                        Coordinates are not available for this booking.
                      </p>
                    )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
