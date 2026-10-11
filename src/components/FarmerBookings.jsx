
import React, { useCallback, useEffect, useState } from "react";
import "./FarmerBookings.css";

const API_BASE = "http://localhost:8081/api/crop-bookings";

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function normalizeStatus(value) {
  return String(value || "PENDING").toUpperCase();
}

export default function FarmerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Loads bookings belonging to ALL farmers.
      const response = await fetch(API_BASE);

      if (!response.ok) {
        throw new Error(
          `Unable to load bookings. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an unexpected response.");
      }

      setBookings(data);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the backend. Check that Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const updateStatus = async (bookingId, status) => {
    const action = status === "ACCEPTED" ? "accept" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} booking #${bookingId}?`
      )
    ) {
      return;
    }

    setProcessingId(bookingId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE}/${encodeURIComponent(bookingId)}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = responseText;

        try {
          const parsed = JSON.parse(responseText);
          errorMessage = parsed.message || responseText;
        } catch {
          // Keep the original response text.
        }

        throw new Error(
          errorMessage || `Status update failed (${response.status}).`
        );
      }

      let updatedBooking = null;

      try {
        updatedBooking = JSON.parse(responseText);
      } catch {
        // The backend may return an empty response.
      }

      setBookings((previous) =>
        previous.map((booking) =>
          String(booking.id) === String(bookingId)
            ? {
                ...booking,
                ...(updatedBooking || {}),
                status,
              }
            : booking
        )
      );

      setMessage(`Booking #${bookingId} was ${action}ed successfully.`);
    } catch (err) {
      setError(err.message || "Unable to update the booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = search.trim().toLowerCase();

    const searchableText = [
      booking.id,
      booking.farmerId,
      booking.farmerName,
      booking.farmerEmail,
      booking.buyerId,
      booking.buyerName,
      booking.buyerEmail,
      booking.cropId,
      booking.cropName,
      booking.status,
      booking.paymentStatus,
    ]
      .filter((value) => value !== null && value !== undefined)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchableText.includes(query);

    const status = normalizeStatus(booking.status);
    const matchesStatus =
      statusFilter === "ALL" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = bookings.filter(
    (booking) => normalizeStatus(booking.status) === "PENDING"
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => normalizeStatus(booking.status) === "ACCEPTED"
  ).length;

  const totalValue = bookings.reduce((total, booking) => {
    const amount =
      booking.totalPrice ??
      Number(booking.quantity || 0) *
        Number(booking.pricePerUnit ?? booking.price ?? 0);

    return total + (Number.isFinite(Number(amount)) ? Number(amount) : 0);
  }, 0);

  return (
    <main className="all-bookings-page">
      <header className="ab-header">
        <div>
          <span className="ab-eyebrow">CROPCONNECT ADMINISTRATION</span>
          <h1>All Farmers’ Bookings</h1>
          <p>
            View and manage crop booking requests across all farmers.
          </p>
        </div>

        <button
          className="ab-refresh-button"
          type="button"
          onClick={loadBookings}
          disabled={loading || processingId !== null}
        >
          ↻ Refresh
        </button>
      </header>

      <section className="ab-stats">
        <article className="ab-stat-card">
          <span>Total bookings</span>
          <strong>{bookings.length}</strong>
          <small>All farmers</small>
        </article>

        <article className="ab-stat-card">
          <span>Pending bookings</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting a decision</small>
        </article>

        <article className="ab-stat-card">
          <span>Accepted bookings</span>
          <strong>{acceptedCount}</strong>
          <small>Accepted requests</small>
        </article>

        <article className="ab-stat-card">
          <span>Total booking value</span>
          <strong className="ab-value">
            {formatCurrency(totalValue)}
          </strong>
          <small>Based on listed booking amounts</small>
        </article>
      </section>

      {error && (
        <div className="ab-alert ab-alert-error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="ab-alert ab-alert-success" role="status">
          {message}
        </div>
      )}

      <section className="ab-content">
        <div className="ab-content-heading">
          <div>
            <h2>Booking requests</h2>
            <p>Search by farmer, buyer, crop, booking ID, or status.</p>
          </div>
          <span className="ab-result-count">
            {filteredBookings.length} results
          </span>
        </div>

        <div className="ab-toolbar">
          <div className="ab-search-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search farmer, buyer, crop..."
              aria-label="Search all bookings"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter bookings by status"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="ab-state">
            <div className="ab-spinner" />
            <p>Loading all farmers’ bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="ab-state ab-empty">
            <div className="ab-empty-icon">🌾</div>
            <h3>No bookings found</h3>
            <p>
              There are no matching bookings. Try another search or status
              filter.
            </p>
            <button
              type="button"
              className="ab-secondary-button"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="ab-table-wrap">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Farmer</th>
                  <th>Buyer</th>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Total amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Booking date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => {
                  const status = normalizeStatus(booking.status);
                  const isPending = status === "PENDING";
                  const isProcessing =
                    String(processingId) === String(booking.id);

                  return (
                    <tr key={booking.id}>
                      <td>
                        <strong className="ab-booking-id">
                          #{booking.id}
                        </strong>
                        <small className="ab-cell-subtitle">
                          Farmer ID: {booking.farmerId ?? "—"}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {booking.farmerName ||
                            `Farmer #${booking.farmerId ?? "—"}`}
                        </strong>
                        <small className="ab-cell-subtitle">
                          {booking.farmerEmail || "Email unavailable"}
                        </small>
                      </td>

                      <td>
                        <strong>{booking.buyerName || "—"}</strong>
                        <small className="ab-cell-subtitle">
                          {booking.buyerEmail || "—"}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {booking.cropName ||
                            booking.crop?.name ||
                            `Crop #${booking.cropId ?? "—"}`}
                        </strong>
                        <small className="ab-cell-subtitle">
                          Crop ID: {booking.cropId ?? "—"}
                        </small>
                      </td>

                      <td>
                        {booking.quantity ?? "—"} {booking.unit || ""}
                      </td>

                      <td className="ab-amount">
                        {formatCurrency(
                          booking.totalPrice ??
                            Number(booking.quantity || 0) *
                              Number(
                                booking.pricePerUnit ?? booking.price ?? 0
                              )
                        )}
                      </td>

                      <td>
                        <span
                          className={`ab-payment ${
                            String(
                              booking.paymentStatus || "PENDING"
                            ).toLowerCase() === "paid"
                              ? "paid"
                              : "unpaid"
                          }`}
                        >
                          {booking.paymentStatus || "PENDING"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`ab-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>{formatDate(booking.createdAt)}</td>

                      <td>
                        {isPending ? (
                          <button
                            type="button"
                            className="ab-accept-button"
                            disabled={processingId !== null}
                            onClick={() =>
                              updateStatus(booking.id, "ACCEPTED")
                            }
                          >
                            {isProcessing ? "Saving..." : "✓ Accept"}
                          </button>
                        ) : (
                          <span className="ab-action-done">
                            {status === "ACCEPTED"
                              ? "✓ Accepted"
                              : "No action"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredBookings.length > 0 && (
          <p className="ab-footer-note">
            Showing {filteredBookings.length} of {bookings.length} bookings.
          </p>
        )}
      </section>
    </main>
  );
}
