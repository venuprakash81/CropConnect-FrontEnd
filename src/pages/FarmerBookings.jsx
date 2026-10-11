
import React, { useCallback, useEffect, useState } from "react";
import "./farmerBookings.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";

function getStoredValue(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || "";
}

function getLoggedInFarmer() {
  const stores = [localStorage, sessionStorage];
  const objectKeys = [
    "cropconnectFarmer",
    "farmer",
    "farmerData",
    "farmerUser",
    "loggedInFarmer",
  ];

  let farmer = {};

  for (const store of stores) {
    for (const key of objectKeys) {
      const raw = store.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        const candidate = parsed?.farmer || parsed?.user || parsed;

        if (candidate && typeof candidate === "object") {
          const email =
            candidate.farmerEmail ||
            candidate.email ||
            candidate.emailId ||
            candidate.userEmail;

          if (email) {
            farmer = candidate;
            break;
          }
        }
      } catch {
        // Ignore values that are not JSON.
      }
    }

    if (farmer.email || farmer.farmerEmail || farmer.emailId) break;
  }

  return farmer;
}

async function readResponse(response) {
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

function getBookingId(booking) {
  return booking.id ?? booking.bookingId ?? booking.cropBookingId;
}

function getCropName(booking) {
  return (
    booking.cropName ||
    booking.crop?.cropName ||
    booking.crop?.name ||
    "Crop"
  );
}

function getBuyerName(booking) {
  return (
    booking.buyerName ||
    booking.buyer?.fullName ||
    booking.buyer?.name ||
    "Buyer"
  );
}

function getBuyerEmail(booking) {
  return (
    booking.buyerEmail ||
    booking.buyer?.email ||
    booking.buyer?.buyerEmail ||
    "Not provided"
  );
}

function getQuantity(booking) {
  return Number(booking.quantity ?? booking.bookedQuantity ?? 0);
}

function getAmount(booking) {
  const total =
    booking.totalAmount ??
    booking.totalPrice ??
    booking.bookingAmount ??
    booking.amount;

  if (total !== undefined && total !== null && total !== "") {
    return Number(total);
  }

  const price = Number(
    booking.pricePerUnit ??
      booking.unitPrice ??
      booking.cropPrice ??
      booking.crop?.price ??
      booking.price ??
      0
  );

  return getQuantity(booking) * price;
}

function getStatus(booking) {
  return String(
    booking.bookingStatus ||
      booking.orderStatus ||
      booking.status ||
      "PENDING"
  ).toUpperCase();
}

function getDate(booking) {
  const value =
    booking.bookingDate ||
    booking.createdAt ||
    booking.orderDate;

  if (!value) return "—";

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime())
    ? String(value).slice(0, 10)
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.bookings)) return data.bookings;
  if (Array.isArray(data.orders)) return data.orders;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

const buttonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  margin: "3px",
};

const acceptStyle = {
  ...buttonStyle,
  background: "#16803c",
  color: "#ffffff",
};

const declineStyle = {
  ...buttonStyle,
  background: "#dc2626",
  color: "#ffffff",
};

const deliveredStyle = {
  ...buttonStyle,
  background: "#2563eb",
  color: "#ffffff",
};

export default function FarmerBookings() {
  const [farmerEmail] = useState(() => {
    const farmer = getLoggedInFarmer();

    return (
      farmer.email ||
      farmer.farmerEmail ||
      farmer.emailId ||
      farmer.userEmail ||
      getStoredValue("farmerEmail") ||
      getStoredValue("farmerLoginEmail") ||
      getStoredValue("loggedInFarmerEmail") ||
      ""
    )
      .trim()
      .toLowerCase();
  });

  const [farmerName] = useState(() => {
    const farmer = getLoggedInFarmer();

    return (
      farmer.fullName ||
      farmer.name ||
      getStoredValue("farmerName") ||
      "Farmer"
    );
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!farmerEmail) {
      setBookings([]);
      setError("Farmer login email was not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API}/crop-bookings/farmer/email/${encodeURIComponent(
          farmerEmail
        )}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      const data = await readResponse(response);
      const list = normalizeList(data);

      const ownBookings = list.filter((booking) => {
        const email = String(
          booking.farmerEmail ||
            booking.farmer?.email ||
            booking.farmer?.farmerEmail ||
            ""
        )
          .trim()
          .toLowerCase();

        // The API should already filter by farmer. This extra
        // check is used when the response includes farmer email.
        return !email || email === farmerEmail;
      });

      setBookings(ownBookings);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Farmer bookings error:", err);
      setBookings([]);
      setError(
        `${err.message || "Unable to load crop bookings."} Check the farmer bookings endpoint.`
      );
    } finally {
      setLoading(false);
    }
  }, [farmerEmail]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function updateBookingStatus(booking, newStatus) {
    const id = getBookingId(booking);

    if (id == null) {
      setError("Booking ID is missing.");
      return;
    }

    const currentStatus = getStatus(booking);

    if (
      ["DELIVERED", "CANCELLED", "REJECTED"].includes(currentStatus)
    ) {
      setError("This booking has already reached a final status.");
      return;
    }

    if (newStatus === "DELIVERED" && currentStatus !== "ACCEPTED") {
      setError("Accept the booking before marking it as delivered.");
      return;
    }

    if (
      newStatus === "CANCELLED" &&
      !["PENDING", "REQUESTED", "CONFIRMED", "ACCEPTED"].includes(
        currentStatus
      )
    ) {
      setError("This booking cannot be declined in its current status.");
      return;
    }

    const actionText =
      newStatus === "ACCEPTED"
        ? "accept this booking"
        : newStatus === "CANCELLED"
        ? "decline this booking"
        : "mark this booking as delivered";

    if (!window.confirm(`Are you sure you want to ${actionText}?`)) {
      return;
    }

    setUpdatingId(id);
    setError("");
    setNotice("");

    try {
      // Expected backend endpoint:
      // PUT /api/crop-bookings/{id}/status
      // JSON body: { status: "ACCEPTED" | "CANCELLED" | "DELIVERED" }
      const response = await fetch(
        `${API}/crop-bookings/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            farmerEmail,
          }),
        }
      );

      await readResponse(response);

      setBookings((previous) =>
        previous.map((item) => {
          if (String(getBookingId(item)) !== String(id)) {
            return item;
          }

          return {
            ...item,
            status: newStatus,
            bookingStatus: newStatus,
            orderStatus: newStatus,
          };
        })
      );

      const message =
        newStatus === "ACCEPTED"
          ? "Booking accepted successfully."
          : newStatus === "CANCELLED"
          ? "Booking declined and cancelled."
          : "Booking marked as delivered.";

      setNotice(message);
      setLastUpdated(new Date());

      // Reload the authoritative status from the backend.
      await loadBookings();
    } catch (err) {
      console.error("Booking status update error:", err);
      setError(
        `${err.message || "Unable to update booking status."} Ensure CropBookingController supports PUT /api/crop-bookings/{id}/status.`
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const totalValue = bookings.reduce(
    (sum, booking) => sum + Math.max(0, getAmount(booking) || 0),
    0
  );

  const pendingCount = bookings.filter((booking) =>
    ["PENDING", "REQUESTED", "CONFIRMED"].includes(getStatus(booking))
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => getStatus(booking) === "ACCEPTED"
  ).length;

  const deliveredCount = bookings.filter(
    (booking) => getStatus(booking) === "DELIVERED"
  ).length;

  return (
    <main className="farmer-bookings-page">
      <header className="fb-header">
        <div>
          <span className="fb-eyebrow">CROPCONNECT · FARMER PORTAL</span>
          <h1>Crop Bookings</h1>
          <p>
            Welcome, {farmerName}. Manage buyer bookings for your crops.
          </p>

          <div className="fb-email">
            <span className="fb-email-dot" />
            {farmerEmail || "Farmer email unavailable"}
          </div>
        </div>

        <button
          type="button"
          className="fb-refresh"
          onClick={loadBookings}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh Bookings"}
        </button>
      </header>

      <section className="fb-stats">
        <article className="fb-stat-card">
          <span className="fb-stat-icon">📦</span>
          <div>
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </div>
        </article>

        <article className="fb-stat-card">
          <span className="fb-stat-icon">⏳</span>
          <div>
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
        </article>

        <article className="fb-stat-card">
          <span className="fb-stat-icon">✓</span>
          <div>
            <span>Accepted</span>
            <strong>{acceptedCount}</strong>
          </div>
        </article>

        <article className="fb-stat-card">
          <span className="fb-stat-icon">🚚</span>
          <div>
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </div>
        </article>

        <article className="fb-stat-card">
          <span className="fb-stat-icon">₹</span>
          <div>
            <span>Total Booking Value</span>
            <strong>
              ₹{totalValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        </article>
      </section>

      {notice && (
        <div className="fb-alert" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="fb-alert" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      <section className="fb-bookings-section">
        <div className="fb-section-heading">
          <div>
            <h2>Bookings for My Crops</h2>
            <p>Accept, decline, or mark accepted bookings as delivered.</p>
          </div>

          {lastUpdated && (
            <span className="fb-last-updated">
              Updated {lastUpdated.toLocaleTimeString("en-IN")}
            </span>
          )}
        </div>

        {loading ? (
          <div className="fb-state">
            <span className="fb-spinner" />
            <p>Loading your crop bookings...</p>
          </div>
        ) : error && bookings.length === 0 ? (
          <div className="fb-state">
            <div className="fb-empty-icon">⚠️</div>
            <h3>Bookings could not be loaded</h3>
            <p>Check the API endpoint and Spring Boot server.</p>
            <button
              type="button"
              className="fb-primary-button"
              onClick={loadBookings}
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="fb-state">
            <div className="fb-empty-icon">🌾</div>
            <h3>No crop bookings yet</h3>
            <p>Buyer bookings for your crops will appear here.</p>
          </div>
        ) : (
          <div className="fb-table-wrapper">
            <table className="fb-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Crop</th>
                  <th>Buyer</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => {
                  const id = getBookingId(booking);
                  const status = getStatus(booking);
                  const busy = String(updatingId) === String(id);

                  const isPending = [
                    "PENDING",
                    "REQUESTED",
                    "CONFIRMED",
                  ].includes(status);

                  const isAccepted = status === "ACCEPTED";
                  const isFinal = [
                    "DELIVERED",
                    "CANCELLED",
                    "REJECTED",
                  ].includes(status);

                  return (
                    <tr key={id ?? `${getCropName(booking)}-${index}`}>
                      <td>
                        <span className="fb-booking-id">
                          #{id ?? "—"}
                        </span>
                      </td>

                      <td>
                        <div className="fb-crop-cell">
                          <span className="fb-crop-icon">🌱</span>
                          <strong>{getCropName(booking)}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="fb-buyer-cell">
                          <strong>{getBuyerName(booking)}</strong>
                          <span>{getBuyerEmail(booking)}</span>
                        </div>
                      </td>

                      <td>
                        <strong>{getQuantity(booking)}</strong>
                        <span className="fb-unit">
                          {" "}
                          {booking.unit || booking.crop?.unit || ""}
                        </span>
                      </td>

                      <td>
                        <strong className="fb-amount">
                          ₹{getAmount(booking).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </strong>
                      </td>

                      <td>{getDate(booking)}</td>

                      <td>
                        <span
                          className={`fb-status ${
                            ["ACCEPTED", "DELIVERED", "PAID", "COMPLETED"].includes(
                              status
                            )
                              ? "fb-status-success"
                              : ["CANCELLED", "REJECTED"].includes(status)
                              ? "fb-status-danger"
                              : "fb-status-pending"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div style={{ minWidth: "190px" }}>
                          {isPending && (
                            <>
                              <button
                                type="button"
                                style={acceptStyle}
                                disabled={busy}
                                onClick={() =>
                                  updateBookingStatus(booking, "ACCEPTED")
                                }
                              >
                                {busy ? "Updating..." : "Accept"}
                              </button>

                              <button
                                type="button"
                                style={declineStyle}
                                disabled={busy}
                                onClick={() =>
                                  updateBookingStatus(booking, "CANCELLED")
                                }
                              >
                                Decline
                              </button>
                            </>
                          )}

                          {isAccepted && (
                            <>
                              <span style={{ display: "block", fontSize: "12px" }}>
                                Accepted
                              </span>

                              <button
                                type="button"
                                style={deliveredStyle}
                                disabled={busy}
                                onClick={() =>
                                  updateBookingStatus(booking, "DELIVERED")
                                }
                              >
                                {busy ? "Updating..." : "Mark Delivered"}
                              </button>
                            </>
                          )}

                          {isFinal && (
                            <span style={{ fontSize: "12px" }}>
                              {status === "DELIVERED"
                                ? "Delivery completed"
                                : "Booking closed"}
                            </span>
                          )}

                          {!isPending && !isAccepted && !isFinal && (
                            <span style={{ fontSize: "12px" }}>
                              No actions available
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
