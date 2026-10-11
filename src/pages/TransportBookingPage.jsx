import React, { useEffect, useState, useCallback } from "react";
import "./TransportBookingPage.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";
const BOOKING_API = `${API_BASE}/transporter-bookings`;
const TRANSPORTER_API = `${API_BASE}/transporters`;

const TransportBookingPage = ({
  role: roleProp,
  email: emailProp,
}) => {
  const role = (
    roleProp ||
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    ""
  ).toUpperCase();

  const email =
    emailProp ||
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    "";

  const [transporters, setTransporters] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState("");

  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("KG");
  const [vehicleType, setVehicleType] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");

  const [bookings, setBookings] = useState([]);
  const [loadingTransporters, setLoadingTransporters] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const rolePath = {
    FARMER: "farmer",
    BUYER: "buyer",
    WAREHOUSE: "warehouse",
  }[role];

  const fetchTransporters = useCallback(async () => {
    setLoadingTransporters(true);

    try {
      const response = await fetch(TRANSPORTER_API);

      if (!response.ok) {
        throw new Error(`Transporter request failed (${response.status})`);
      }

      const data = await response.json();
      setTransporters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Transporter loading error:", err);
      setError(
        "Could not load transporters. Check that GET /api/transporters works."
      );
    } finally {
      setLoadingTransporters(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!email) {
      setBookings([]);
      return;
    }

    setLoadingBookings(true);

    try {
      const endpoint = rolePath
        ? `${BOOKING_API}/${rolePath}/${encodeURIComponent(email)}`
        : `${BOOKING_API}/requester/${encodeURIComponent(email)}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Booking history failed (${response.status})`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Booking history error:", err);
      setError("Could not load your booking history.");
    } finally {
      setLoadingBookings(false);
    }
  }, [email, rolePath]);

  useEffect(() => {
    fetchTransporters();
  }, [fetchTransporters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const resetForm = () => {
    setSelectedTransporter("");
    setPickupLocation("");
    setDeliveryLocation("");
    setProductName("");
    setQuantity("");
    setQuantityUnit("KG");
    setVehicleType("");
    setBookingDate("");
    setNotes("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Please log in. Your email was not found.");
      return;
    }

    if (!["FARMER", "BUYER", "WAREHOUSE"].includes(role)) {
      setError("Your account role is missing or invalid.");
      return;
    }

    if (!selectedTransporter) {
      setError("Please select a transporter.");
      return;
    }

    if (
      !pickupLocation.trim() ||
      !deliveryLocation.trim() ||
      !productName.trim() ||
      !quantity ||
      Number(quantity) <= 0 ||
      !bookingDate
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const transporter = transporters.find(
      (item) => String(item.id) === String(selectedTransporter)
    );

    if (!transporter) {
      setError("The selected transporter could not be found.");
      return;
    }

    const bookingData = {
      transporterId: Number(transporter.id),
      transporterName:
        transporter.name || transporter.transporterName || "Transporter",
      requesterEmail: email,
      requesterRole: role,
      pickupLocation: pickupLocation.trim(),
      deliveryLocation: deliveryLocation.trim(),
      productName: productName.trim(),
      quantity: Number(quantity),
      quantityUnit,
      vehicleType: vehicleType || transporter.vehicleType || "",
      bookingDate,
      notes: notes.trim(),
      status: "PENDING",
    };

    console.log("Sending booking:", bookingData);

    try {
      setSubmitting(true);

      const response = await fetch(BOOKING_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(
          responseText || `Server returned ${response.status}`
        );
      }

      alert("Transporter booking submitted successfully!");
      resetForm();
      await fetchBookings();
    } catch (err) {
      console.error("Submit booking error:", err);
      setError(`Booking failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BOOKING_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Could not cancel booking (${response.status})`);
      }

      alert("Booking cancelled successfully.");
      await fetchBookings();
    } catch (err) {
      console.error("Cancel booking error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="transport-page">
      <div className="transport-header">
        <div>
          <p className="transport-eyebrow">CROPCONNECT LOGISTICS</p>
          <h1>Transporter Booking</h1>
          <p>
            Book transportation for your agricultural products and track
            your booking requests.
          </p>
        </div>
      </div>

      {error && (
        <div className="transport-error" role="alert">
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

      <div className="transport-layout">
        <section className="transport-card">
          <div className="transport-card-heading">
            <div>
              <h2>Book a transporter</h2>
              <p>Enter your pickup, delivery, and product details.</p>
            </div>
            <span className="transport-icon">🚚</span>
          </div>

          <form onSubmit={handleSubmit} className="transport-form">
            <div className="transport-field">
              <label htmlFor="transporter">Select transporter *</label>
              <select
                id="transporter"
                value={selectedTransporter}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedTransporter(id);

                  const selected = transporters.find(
                    (item) => String(item.id) === id
                  );

                  if (selected?.vehicleType) {
                    setVehicleType(selected.vehicleType);
                  }
                }}
                required
                disabled={loadingTransporters}
              >
                <option value="">
                  {loadingTransporters
                    ? "Loading transporters..."
                    : "Choose a transporter"}
                </option>

                {transporters.map((transporter) => (
                  <option
                    key={transporter.id}
                    value={transporter.id}
                  >
                    {transporter.name ||
                      transporter.transporterName ||
                      `Transporter #${transporter.id}`}
                    {transporter.vehicleType
                      ? ` — ${transporter.vehicleType}`
                      : ""}
                  </option>
                ))}
              </select>

              {!loadingTransporters && transporters.length === 0 && (
                <small className="transport-help">
                  No transporters were returned by the server.
                </small>
              )}
            </div>

            <div className="transport-two-columns">
              <div className="transport-field">
                <label htmlFor="pickup">Pickup location *</label>
                <input
                  id="pickup"
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter pickup location"
                  required
                />
              </div>

              <div className="transport-field">
                <label htmlFor="delivery">Delivery location *</label>
                <input
                  id="delivery"
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Enter delivery location"
                  required
                />
              </div>
            </div>

            <div className="transport-field">
              <label htmlFor="product">Product name *</label>
              <input
                id="product"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Rice, Wheat, Tomatoes"
                required
              />
            </div>

            <div className="transport-two-columns">
              <div className="transport-field">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  id="quantity"
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="transport-field">
                <label htmlFor="unit">Unit *</label>
                <select
                  id="unit"
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                >
                  <option value="KG">Kilograms (KG)</option>
                  <option value="TON">Tons</option>
                  <option value="QUINTAL">Quintals</option>
                  <option value="BAGS">Bags</option>
                  <option value="BOXES">Boxes</option>
                </select>
              </div>
            </div>

            <div className="transport-two-columns">
              <div className="transport-field">
                <label htmlFor="vehicle">Vehicle type</label>
                <input
                  id="vehicle"
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="e.g. Truck, Mini truck"
                />
              </div>

              <div className="transport-field">
                <label htmlFor="date">Booking date *</label>
                <input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="transport-field">
              <label htmlFor="notes">Additional notes</label>
              <textarea
                id="notes"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any special instructions..."
              />
            </div>

            <div className="transport-form-actions">
              <button
                type="button"
                className="transport-reset-btn"
                onClick={resetForm}
                disabled={submitting}
              >
                Clear form
              </button>

              <button
                type="submit"
                className="transport-submit-btn"
                disabled={submitting || loadingTransporters}
              >
                {submitting ? "Submitting..." : "Submit Booking"}
              </button>
            </div>
          </form>
        </section>

        <aside className="transport-side">
          <div className="transport-info-card">
            <h3>Booking information</h3>
            <ul>
              <li>Select a transporter before submitting.</li>
              <li>Enter accurate pickup and delivery locations.</li>
              <li>Your request is initially marked as pending.</li>
              <li>Check the booking history for updates.</li>
            </ul>
          </div>

          <div className="transport-info-card">
            <h3>Your account</h3>
            <p>
              <strong>Role:</strong> {role || "Not available"}
            </p>
            <p className="transport-email">
              <strong>Email:</strong> {email || "Not available"}
            </p>
          </div>
        </aside>
      </div>

      <section className="transport-history">
        <div className="transport-history-heading">
          <div>
            <h2>My booking history</h2>
            <p>View your transporter booking requests.</p>
          </div>

          <button
            type="button"
            className="transport-refresh-btn"
            onClick={fetchBookings}
            disabled={loadingBookings}
          >
            {loadingBookings ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loadingBookings ? (
          <div className="transport-empty">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="transport-empty">
            <span className="transport-empty-icon">📦</span>
            <h3>No bookings found</h3>
            <p>Your submitted bookings will appear here.</p>
          </div>
        ) : (
          <div className="transport-table-wrapper">
            <table className="transport-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transporter</th>
                  <th>Product</th>
                  <th>Route</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>#{booking.id}</td>
                    <td>{booking.transporterName || "—"}</td>
                    <td>{booking.productName || "—"}</td>
                    <td>
                      <div className="transport-route">
                        <span>{booking.pickupLocation}</span>
                        <span className="transport-route-arrow">↓</span>
                        <span>{booking.deliveryLocation}</span>
                      </div>
                    </td>
                    <td>
                      {booking.quantity} {booking.quantityUnit}
                    </td>
                    <td>{booking.bookingDate || "—"}</td>
                    <td>
                      <span
                        className={`transport-status ${
                          (booking.status || "PENDING").toLowerCase()
                        }`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </td>
                    <td>
                      {["PENDING", "REQUESTED"].includes(
                        (booking.status || "").toUpperCase()
                      ) ? (
                        <button
                          type="button"
                          className="transport-cancel-btn"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="transport-no-action">—</span>
                      )}
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
};

export default TransportBookingPage;
