import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TransporterDirectory.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

const pickupIcon = L.divIcon({
  className: "location-marker pickup-marker",
  html: "<span>P</span>",
  iconSize: [32, 38],
  iconAnchor: [16, 38],
});

const deliveryIcon = L.divIcon({
  className: "location-marker delivery-marker",
  html: "<span>D</span>",
  iconSize: [32, 38],
  iconAnchor: [16, 38],
});

const readFarmer = () => {
  try {
    return JSON.parse(localStorage.getItem("cropconnectFarmer") || "null");
  } catch {
    return null;
  }
};

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

const TransporterDirectory = () => {
  const navigate = useNavigate();
  const farmer = readFarmer();

  const farmerEmail =
    farmer?.email || farmer?.farmerEmail || farmer?.username || "";

  const farmerName =
    farmer?.name || farmer?.farmerName || farmer?.fullName || "Farmer";

  const farmerPhone = farmer?.phone || farmer?.mobile || "";

  const [activeTab, setActiveTab] = useState("transporters");
  const [transporters, setTransporters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingTransporters, setLoadingTransporters] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mapMode, setMapMode] = useState("pickup");

  const [form, setForm] = useState({
    pickupLocation: "",
    destination: "",
    bookingDate: "",
    bookingTime: "",
    quantity: "",
    quantityUnit: "kg",
    notes: "",
    pickupCoordinates: null,
    deliveryCoordinates: null,
  });

  useEffect(() => {
    loadTransporters();
  }, []);

  useEffect(() => {
    if (farmerEmail) {
      loadBookings();
    }
  }, [farmerEmail]);

  const loadTransporters = async () => {
    setLoadingTransporters(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/transporters/all`);

      if (!response.ok) {
        throw new Error(`Transporters request failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      setTransporters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load transporters. Check that Spring Boot is running on port 8081 and that /api/transporters/all exists."
      );
    } finally {
      setLoadingTransporters(false);
    }
  };

  const loadBookings = async () => {
    if (!farmerEmail) return;

    setLoadingBookings(true);

    try {
      const response = await fetch(
        `${API_BASE}/transporter-bookings/farmer/${encodeURIComponent(
          farmerEmail
        )}`
      );

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `Unable to load bookings (HTTP ${response.status}): ${body}`
        );
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const openBooking = (transporter) => {
    setSelectedTransporter(transporter);
    setActiveTab("book");
    setMessage("");
    setError("");
    setMapMode("pickup");
  };

  const resetBooking = () => {
    setSelectedTransporter(null);
    setForm({
      pickupLocation: "",
      destination: "",
      bookingDate: "",
      bookingTime: "",
      quantity: "",
      quantityUnit: "kg",
      notes: "",
      pickupCoordinates: null,
      deliveryCoordinates: null,
    });
  };

  const closeBooking = () => {
    if (submitting) return;
    resetBooking();
    setActiveTab("transporters");
  };

  const selectMapLocation = (coordinates) => {
    const [lat, lng] = coordinates;
    const coordinateText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    if (mapMode === "pickup") {
      setForm((previous) => ({
        ...previous,
        pickupCoordinates: coordinates,
        pickupLocation: coordinateText,
      }));
    } else {
      setForm((previous) => ({
        ...previous,
        deliveryCoordinates: coordinates,
        destination: coordinateText,
      }));
    }
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!farmerEmail) {
      setError("Farmer email not found. Please log in again.");
      return;
    }

    if (!selectedTransporter) {
      setError("Please select a transporter.");
      return;
    }

    const transporterId =
      selectedTransporter.id ?? selectedTransporter.transporterId;

    if (transporterId == null) {
      setError("The selected transporter has no valid ID.");
      return;
    }

    const quantity = Number(form.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Enter a quantity greater than zero.");
      return;
    }

    const payload = {
      transporterId,
      transporterName:
        selectedTransporter.name ||
        selectedTransporter.transporterName ||
        "Transporter",
      buyerName: farmerName,
      buyerEmail: farmerEmail,
      buyerPhone: farmerPhone,
      pickupLocation: form.pickupLocation.trim(),
      destination: form.destination.trim(),
      bookingDate: form.bookingDate,
      bookingTime: form.bookingTime,
      quantity,
      quantityUnit: form.quantityUnit,
      status: "PENDING",
    };

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/transporter-bookings/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const body = await response.text();

      if (!response.ok) {
        throw new Error(
          body || `Booking failed (HTTP ${response.status})`
        );
      }

      setMessage("Booking submitted successfully.");
      resetBooking();
      setActiveTab("bookings");
      await loadBookings();
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to submit booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransporters = transporters.filter((transporter) => {
    const name =
      transporter.name || transporter.transporterName || "";
    const location =
      transporter.location ||
      transporter.address ||
      transporter.city ||
      "";
    const vehicle =
      transporter.vehicleType || transporter.vehicle || "";

    return `${name} ${location} ${vehicle}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const transporterName = (transporter) =>
    transporter?.name || transporter?.transporterName || "Transporter";

  const statusClass = (status) =>
    (status || "pending").toLowerCase().replaceAll("_", "-");

  const statusText = (status) =>
    (status || "PENDING").replaceAll("_", " ");

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="td-page">
      <header className="td-header">
        <div className="td-header-inner">
          <div className="td-brand">
            <div className="td-brand-icon">🌾</div>
            <div>
              <h1>CropConnect</h1>
              <span>FARMER TRANSPORT SERVICES</span>
            </div>
          </div>

          <div className="td-header-user">
            <div className="td-user-avatar">
              {farmerName.charAt(0).toUpperCase()}
            </div>
            <div className="td-user-info">
              <strong>{farmerName}</strong>
              <span>Farmer account</span>
            </div>
            <button
              type="button"
              className="td-home-button"
              onClick={() => navigate("/farmer-dashboard")}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="td-main">
        <section className="td-welcome">
          <div>
            <p className="td-eyebrow">LOGISTICS MADE SIMPLE</p>
            <h2>Move your harvest with confidence.</h2>
            <p>
              Find transport providers, choose your pickup and delivery
              locations, and track your booking requests in one place.
            </p>
          </div>
          <div className="td-welcome-art" aria-hidden="true">
            🚚
          </div>
        </section>

        {message && (
          <div className="td-alert td-alert-success" role="status">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="td-alert td-alert-error" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <nav className="td-tabs" aria-label="Transport sections">
          <button
            type="button"
            className={activeTab === "transporters" ? "active" : ""}
            onClick={() => {
              setActiveTab("transporters");
              setSelectedTransporter(null);
            }}
          >
            🚚 Transporters
          </button>

          <button
            type="button"
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => {
              setActiveTab("bookings");
              setSelectedTransporter(null);
              loadBookings();
            }}
          >
            📋 My Bookings
            <span className="td-tab-count">{bookings.length}</span>
          </button>
        </nav>

        {activeTab === "transporters" && (
          <section className="td-section">
            <div className="td-section-heading">
              <div>
                <h3>Available Transporters</h3>
                <p>Choose a transporter for your crop delivery.</p>
              </div>

              <div className="td-search">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search transporters..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            {loadingTransporters ? (
              <div className="td-empty">
                <div className="td-spinner" />
                <p>Loading transporters...</p>
              </div>
            ) : filteredTransporters.length === 0 ? (
              <div className="td-empty">
                <div className="td-empty-icon">🚚</div>
                <h3>No transporters found</h3>
                <p>Try another search or refresh the list.</p>
                <button
                  type="button"
                  className="td-primary-button td-empty-button"
                  onClick={loadTransporters}
                >
                  Refresh transporters
                </button>
              </div>
            ) : (
              <div className="td-transporter-grid">
                {filteredTransporters.map((transporter) => {
                  const id =
                    transporter.id ?? transporter.transporterId;

                  return (
                    <article className="td-transporter-card" key={id}>
                      <div className="td-card-top">
                        <div className="td-transporter-avatar">
                          {transporterName(transporter)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <span className="td-available">
                          <i />
                          Available
                        </span>
                      </div>

                      <h3>{transporterName(transporter)}</h3>
                      <p className="td-vehicle">
                        {transporter.vehicleType ||
                          transporter.vehicle ||
                          "Transport service"}
                      </p>

                      <div className="td-card-details">
                        <div>
                          <span className="td-detail-icon">📍</span>
                          <span>
                            <small>Location</small>
                            <strong>
                              {transporter.location ||
                                transporter.address ||
                                transporter.city ||
                                "Not provided"}
                            </strong>
                          </span>
                        </div>

                        <div>
                          <span className="td-detail-icon">📞</span>
                          <span>
                            <small>Contact</small>
                            <strong>
                              {transporter.phone ||
                                transporter.mobile ||
                                "Not provided"}
                            </strong>
                          </span>
                        </div>

                        <div>
                          <span className="td-detail-icon">📦</span>
                          <span>
                            <small>Capacity</small>
                            <strong>
                              {transporter.capacity || "Not specified"}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="td-primary-button"
                        onClick={() => openBooking(transporter)}
                      >
                        Book Transport <span>→</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "book" && selectedTransporter && (
          <section className="td-section td-booking-section">
            <button
              type="button"
              className="td-back-button"
              onClick={closeBooking}
            >
              ← Back to transporters
            </button>

            <div className="td-section-heading">
              <div>
                <h3>Book {transporterName(selectedTransporter)}</h3>
                <p>Complete the details to submit your request.</p>
              </div>
            </div>

            <form className="td-booking-form" onSubmit={submitBooking}>
              <div className="td-form-grid">
                <label>
                  Farmer Name
                  <input value={farmerName} readOnly />
                </label>

                <label>
                  Farmer Email
                  <input value={farmerEmail} readOnly />
                </label>

                <label>
                  Booking Date
                  <input
                    type="date"
                    name="bookingDate"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.bookingDate}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Booking Time
                  <input
                    type="time"
                    name="bookingTime"
                    value={form.bookingTime}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Crop Quantity
                  <input
                    type="number"
                    name="quantity"
                    min="0.01"
                    step="any"
                    placeholder="Enter quantity"
                    value={form.quantity}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Quantity Unit
                  <select
                    name="quantityUnit"
                    value={form.quantityUnit}
                    onChange={updateForm}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Tonnes</option>
                    <option value="bags">Bags</option>
                  </select>
                </label>
              </div>

              <div className="td-location-heading">
                <div>
                  <h4>Select Pickup and Delivery Locations</h4>
                  <p>Choose a location mode, then click the map.</p>
                </div>

                <div className="td-map-switch">
                  <button
                    type="button"
                    className={mapMode === "pickup" ? "selected pickup" : ""}
                    onClick={() => setMapMode("pickup")}
                  >
                    <span className="td-map-dot pickup-dot" />
                    Pickup
                  </button>
                  <button
                    type="button"
                    className={
                      mapMode === "delivery" ? "selected delivery" : ""
                    }
                    onClick={() => setMapMode("delivery")}
                  >
                    <span className="td-map-dot delivery-dot" />
                    Delivery
                  </button>
                </div>
              </div>

              <div className="td-map-instruction">
                {mapMode === "pickup"
                  ? "Click on the map to set your pickup location."
                  : "Click on the map to set your delivery location."}
              </div>

              <div className="td-map-wrap">
                <MapContainer
                  center={[17.385, 78.4867]}
                  zoom={10}
                  scrollWheelZoom
                  className="td-map"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapClickHandler onSelect={selectMapLocation} />

                  {form.pickupCoordinates && (
                    <Marker
                      position={form.pickupCoordinates}
                      icon={pickupIcon}
                    />
                  )}

                  {form.deliveryCoordinates && (
                    <Marker
                      position={form.deliveryCoordinates}
                      icon={deliveryIcon}
                    />
                  )}
                </MapContainer>
              </div>

              <div className="td-location-fields">
                <label>
                  <span className="td-location-label pickup-label">
                    Pickup Location
                  </span>
                  <input
                    name="pickupLocation"
                    value={form.pickupLocation}
                    onChange={updateForm}
                    placeholder="Click map or enter pickup address"
                    required
                  />
                  <small>
                    {form.pickupCoordinates
                      ? `Coordinates: ${form.pickupCoordinates
                          .map((value) => value.toFixed(6))
                          .join(", ")}`
                      : "You can enter an address manually."}
                  </small>
                </label>

                <label>
                  <span className="td-location-label delivery-label">
                    Delivery Location
                  </span>
                  <input
                    name="destination"
                    value={form.destination}
                    onChange={updateForm}
                    placeholder="Click map or enter delivery address"
                    required
                  />
                  <small>
                    {form.deliveryCoordinates
                      ? `Coordinates: ${form.deliveryCoordinates
                          .map((value) => value.toFixed(6))
                          .join(", ")}`
                      : "You can enter an address manually."}
                  </small>
                </label>
              </div>

              <label className="td-notes-label">
                Additional Notes (optional)
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateForm}
                  placeholder="Add any special instructions..."
                  rows="3"
                />
              </label>

              <div className="td-form-actions">
                <button
                  type="button"
                  className="td-secondary-button"
                  onClick={closeBooking}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="td-primary-button td-submit-button"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "bookings" && (
          <section className="td-section">
            <div className="td-section-heading">
              <div>
                <h3>My Transport Bookings</h3>
                <p>Review the requests you have submitted.</p>
              </div>

              <button
                type="button"
                className="td-refresh-button"
                onClick={loadBookings}
                disabled={loadingBookings}
              >
                {loadingBookings ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>

            {!farmerEmail ? (
              <div className="td-empty">
                <div className="td-empty-icon">👤</div>
                <h3>Farmer account not found</h3>
                <p>Please log in again to view your bookings.</p>
              </div>
            ) : loadingBookings ? (
              <div className="td-empty">
                <div className="td-spinner" />
                <p>Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="td-empty">
                <div className="td-empty-icon">📋</div>
                <h3>No bookings yet</h3>
                <p>Your submitted transport bookings will appear here.</p>
                <button
                  type="button"
                  className="td-primary-button td-empty-button"
                  onClick={() => setActiveTab("transporters")}
                >
                  Find Transporters
                </button>
              </div>
            ) : (
              <div className="td-bookings-list">
                {bookings.map((booking) => (
                  <article className="td-booking-card" key={booking.id}>
                    <div className="td-booking-card-head">
                      <div>
                        <span className="td-booking-reference">
                          BOOKING #{booking.id}
                        </span>
                        <h3>
                          {booking.transporterName || "Transporter"}
                        </h3>
                      </div>

                      <span
                        className={`td-status td-status-${statusClass(
                          booking.status
                        )}`}
                      >
                        {statusText(booking.status)}
                      </span>
                    </div>

                    <div className="td-route">
                      <div className="td-route-point">
                        <span className="td-route-circle pickup-circle" />
                        <div>
                          <small>Pickup location</small>
                          <strong>
                            {booking.pickupLocation || "Not provided"}
                          </strong>
                        </div>
                      </div>

                      <div className="td-route-line" />

                      <div className="td-route-point">
                        <span className="td-route-circle delivery-circle" />
                        <div>
                          <small>Delivery location</small>
                          <strong>
                            {booking.destination || "Not provided"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="td-booking-meta">
                      <div>
                        <small>Quantity</small>
                        <strong>
                          {booking.quantity ?? "—"}{" "}
                          {booking.quantityUnit || ""}
                        </strong>
                      </div>
                      <div>
                        <small>Date</small>
                        <strong>{booking.bookingDate || "—"}</strong>
                      </div>
                      <div>
                        <small>Time</small>
                        <strong>{booking.bookingTime || "—"}</strong>
                      </div>
                      <div>
                        <small>Created</small>
                        <strong>
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString(
                                "en-IN"
                              )
                            : today}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default TransporterDirectory;
