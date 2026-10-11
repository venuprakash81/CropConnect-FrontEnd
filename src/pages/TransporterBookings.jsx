import React, { useEffect, useState } from "react";
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

const API = "http://localhost:8081/api";

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

export default function TransporterBookings() {

  const [transporterId, setTransporterId] =
    useState(null);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  // =====================================================
  // GET TRANSPORTER ID
  // =====================================================

  useEffect(() => {

    /*
      Change these localStorage keys according
      to your transporter login code.
    */

    const storedId =
      localStorage.getItem("transporterId");

    if (storedId) {

      setTransporterId(storedId);

    } else {

      // If your login stores the complete transporter object
      const transporterData =
        localStorage.getItem("transporter");

      if (transporterData) {

        try {

          const transporter =
            JSON.parse(transporterData);

          if (transporter.id) {
            setTransporterId(transporter.id);
          }

        } catch (error) {

          console.error(
            "Invalid transporter data",
            error
          );

        }

      }

    }

  }, []);

  // =====================================================
  // LOAD THIS TRANSPORTER'S BOOKINGS
  // =====================================================

  useEffect(() => {

    if (!transporterId) {
      return;
    }

    loadBookings();

  }, [transporterId]);

  const loadBookings = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/transport-bookings/transporter/${transporterId}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load transporter bookings"
        );

      }

      const data = await response.json();

      console.log(
        "THIS TRANSPORTER BOOKINGS:",
        data
      );

      setBookings(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load your transport bookings."
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // DELETE BOOKING
  // =====================================================

  const deleteBooking = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this booking?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API}/transport-bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete booking"
        );
      }

      alert(
        "Booking deleted successfully"
      );

      loadBookings();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete booking"
      );

    }

  };

  // =====================================================
  // TRACK TRANSPORTER
  // =====================================================

  const trackTransporter = () => {

    window.open(
      `https://www.google.com/maps?q=${defaultCenter[0]},${defaultCenter[1]}`,
      "_blank"
    );

  };

  // =====================================================
  // OPEN PICKUP
  // =====================================================

  const openPickup = (booking) => {

    if (
      booking.pickupLatitude == null ||
      booking.pickupLongitude == null
    ) {

      alert(
        "Pickup location is not available."
      );

      return;

    }

    window.open(
      `https://www.google.com/maps?q=${booking.pickupLatitude},${booking.pickupLongitude}`,
      "_blank"
    );

  };

  // =====================================================
  // OPEN DESTINATION
  // =====================================================

  const openDestination = (booking) => {

    if (
      booking.destinationLatitude == null ||
      booking.destinationLongitude == null
    ) {

      alert(
        "Destination location is not available."
      );

      return;

    }

    window.open(
      `https://www.google.com/maps?q=${booking.destinationLatitude},${booking.destinationLongitude}`,
      "_blank"
    );

  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusClass = (status) => {

    switch (
      status?.toUpperCase()
    ) {

      case "CONFIRMED":
        return "confirmed";

      case "ACCEPTED":
        return "accepted";

      case "COMPLETED":
        return "completed";

      case "CANCELLED":
        return "cancelled";

      default:
        return "pending";

    }

  };

  // =====================================================
  // NO TRANSPORTER ID
  // =====================================================

  if (!transporterId) {

    return (
      <div className="transporter-bookings-page">

        <div className="booking-error">

          <h2>Transporter Login Required</h2>

          <p>
            Transporter ID was not found.
          </p>

          <p>
            Please login again.
          </p>

        </div>

      </div>
    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="transporter-bookings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bookings-header">

        <div>

          <span className="header-label">
            TRANSPORTER DASHBOARD
          </span>

          <h1>
            My Transport Bookings
          </h1>

          <p>
            All transport bookings assigned to you
          </p>

        </div>

        <div className="booking-count">

          <strong>
            {bookings.length}
          </strong>

          <span>
            My Bookings
          </span>

        </div>

      </div>

      {/* =================================================
          TRANSPORTER ID
      ================================================= */}

      <div className="transporter-info">

        <div className="info-icon">
          🚚
        </div>

        <div>

          <span>
            Transporter ID
          </span>

          <strong>
            {transporterId}
          </strong>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="booking-error">
          {error}
        </div>

      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="loading-card">

          <div className="loader"></div>

          <p>
            Loading your bookings...
          </p>

        </div>

      ) : bookings.length === 0 ? (

        <div className="empty-card">

          <div className="empty-icon">
            🚚
          </div>

          <h2>
            No Transport Bookings
          </h2>

          <p>
            You currently don't have any
            transport bookings assigned to you.
          </p>

        </div>

      ) : (

        <div className="bookings-container">

          {bookings.map((booking) => (

            <div
              className="transporter-booking-card"
              key={booking.id}
            >

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="card-header">

                <div>

                  <span className="booking-number">
                    BOOKING #{booking.id}
                  </span>

                  <h2>
                    {booking.goodsName ||
                      "Transport Booking"}
                  </h2>

                </div>

                <span
                  className={`status ${getStatusClass(
                    booking.status
                  )}`}
                >
                  {booking.status ||
                    "PENDING"}
                </span>

              </div>

              {/* =================================================
                  CUSTOMER
              ================================================= */}

              <div className="customer-section">

                <div className="customer-avatar">
                  {booking.userName
                    ? booking.userName
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <div>

                  <span>
                    {booking.userType ||
                      "USER"}
                  </span>

                  <h3>
                    {booking.userName ||
                      "Unknown User"}
                  </h3>

                  <p>
                    {booking.userEmail ||
                      "No email"}
                  </p>

                  <p>
                    {booking.userPhone ||
                      "No phone"}
                  </p>

                </div>

              </div>

              {/* =================================================
                  BOOKING DETAILS
              ================================================= */}

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    User ID
                  </span>

                  <strong>
                    {booking.userId || "-"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Goods / Crop
                  </span>

                  <strong>
                    {booking.goodsName || "-"}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Quantity
                  </span>

                  <strong>
                    {booking.quantity || "-"}{" "}
                    {booking.quantityUnit || ""}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Booking Date
                  </span>

                  <strong>
                    {booking.bookingDate || "-"}
                  </strong>

                </div>

              </div>

              {/* =================================================
                  LOCATIONS
              ================================================= */}

              <div className="locations">

                <div className="location-card pickup-card">

                  <div className="location-dot pickup-dot">
                    🟢
                  </div>

                  <div>

                    <span>
                      PICKUP
                    </span>

                    <strong>

                      {booking.pickupLatitude != null &&
                      booking.pickupLongitude != null
                        ? `${Number(
                            booking.pickupLatitude
                          ).toFixed(6)}, ${Number(
                            booking.pickupLongitude
                          ).toFixed(6)}`
                        : "Not selected"}

                    </strong>

                  </div>

                </div>

                <div className="arrow">
                  →
                </div>

                <div className="location-card destination-card">

                  <div className="location-dot">
                    🔴
                  </div>

                  <div>

                    <span>
                      DESTINATION
                    </span>

                    <strong>

                      {booking.destinationLatitude != null &&
                      booking.destinationLongitude != null
                        ? `${Number(
                            booking.destinationLatitude
                          ).toFixed(6)}, ${Number(
                            booking.destinationLongitude
                          ).toFixed(6)}`
                        : "Not selected"}

                    </strong>

                  </div>

                </div>

              </div>

              {/* =================================================
                  NOTES
              ================================================= */}

              {booking.notes && (

                <div className="notes">

                  <span>
                    NOTES
                  </span>

                  <p>
                    {booking.notes}
                  </p>

                </div>

              )}

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="actions">

                <button
                  className="route-btn"
                  onClick={() =>
                    setSelectedBooking(
                      booking
                    )
                  }
                >
                  🗺️ View Route
                </button>

                <button
                  className="track-btn"
                  onClick={
                    trackTransporter
                  }
                >
                  📍 Track Me
                </button>

                <button
                  className="pickup-btn"
                  onClick={() =>
                    openPickup(booking)
                  }
                >
                  🟢 Pickup
                </button>

                <button
                  className="destination-btn"
                  onClick={() =>
                    openDestination(
                      booking
                    )
                  }
                >
                  🔴 Destination
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteBooking(
                      booking.id
                    )
                  }
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* =================================================
          ROUTE MAP
      ================================================= */}

      {selectedBooking && (

        <div className="map-overlay">

          <div className="map-container">

            <div className="map-header">

              <div>

                <h2>
                  Booking #{selectedBooking.id}
                </h2>

                <p>
                  Pickup → Destination
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="close-map"
              >
                ×
              </button>

            </div>

            <MapContainer
              center={
                selectedBooking.pickupLatitude != null
                  ? [
                      Number(
                        selectedBooking.pickupLatitude
                      ),
                      Number(
                        selectedBooking.pickupLongitude
                      ),
                    ]
                  : defaultCenter
              }
              zoom={12}
              className="route-map"
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {selectedBooking.pickupLatitude != null &&
                selectedBooking.pickupLongitude != null && (

                  <Marker
                    position={[
                      Number(
                        selectedBooking.pickupLatitude
                      ),
                      Number(
                        selectedBooking.pickupLongitude
                      ),
                    ]}
                    icon={pickupIcon}
                  >

                    <Popup>
                      <strong>
                        Pickup Location
                      </strong>

                      <br />

                      {
                        selectedBooking.pickupLatitude
                      }
                      ,{" "}
                      {
                        selectedBooking.pickupLongitude
                      }

                    </Popup>

                  </Marker>

                )}

              {selectedBooking.destinationLatitude != null &&
                selectedBooking.destinationLongitude != null && (

                  <Marker
                    position={[
                      Number(
                        selectedBooking.destinationLatitude
                      ),
                      Number(
                        selectedBooking.destinationLongitude
                      ),
                    ]}
                    icon={destinationIcon}
                  >

                    <Popup>
                      <strong>
                        Destination
                      </strong>

                      <br />

                      {
                        selectedBooking.destinationLatitude
                      }
                      ,{" "}
                      {
                        selectedBooking.destinationLongitude
                      }

                    </Popup>

                  </Marker>

                )}

              {selectedBooking.pickupLatitude != null &&
                selectedBooking.pickupLongitude != null &&
                selectedBooking.destinationLatitude != null &&
                selectedBooking.destinationLongitude != null && (

                  <Polyline
                    positions={[
                      [
                        Number(
                          selectedBooking.pickupLatitude
                        ),
                        Number(
                          selectedBooking.pickupLongitude
                        ),
                      ],
                      [
                        Number(
                          selectedBooking.destinationLatitude
                        ),
                        Number(
                          selectedBooking.destinationLongitude
                        ),
                      ],
                    ]}
                    pathOptions={{
                      color: "#2563eb",
                      weight: 5,
                    }}
                  />

                )}

            </MapContainer>

          </div>

        </div>

      )}

    </div>

  );
}