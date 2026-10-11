import React, { useEffect, useState } from "react";
import "./AgritechPages.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";

export default function FarmerCropBookings() {
  const email = localStorage.getItem("farmerEmail");

  const [bookings, setBookings] = useState([]);
  const [crops, setCrops] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!email) {
      setMessage("Please log in as a farmer.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [bookingResponse, cropResponse] = await Promise.all([
        fetch(
          `${API}/crop-bookings/farmer/email/${encodeURIComponent(email)}`
        ),
        fetch(`${API}/crops/farmer/email/${encodeURIComponent(email)}`),
      ]);

      if (!bookingResponse.ok || !cropResponse.ok) {
        throw new Error("Could not load bookings.");
      }

      setBookings(await bookingResponse.json());
      setCrops(await cropResponse.json());
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [email]);

  const updateStatus = async (bookingId, status) => {
    const action = status === "ACCEPTED" ? "accept" : "reject";

    if (!window.confirm(`Do you want to ${action} this booking?`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/crop-bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to update booking.");
      }

      setMessage(`Booking ${status.toLowerCase()} successfully.`);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const getCrop = (cropId) =>
    crops.find((crop) => Number(crop.id) === Number(cropId));

  if (loading) {
    return <main className="ag-page">Loading received bookings...</main>;
  }

  return (
    <main className="ag-page">
      <header className="ag-header">
        <div>
          <p className="ag-eyebrow">FARMER DASHBOARD</p>
          <h1>Received Bookings</h1>
          <p>Manage requests from buyers interested in your crops.</p>
        </div>
        <span className="ag-count">{bookings.length} bookings</span>
      </header>

      {message && <div className="ag-message">{message}</div>}

      {bookings.length === 0 ? (
        <div className="ag-empty">No buyers have booked your crops yet.</div>
      ) : (
        <div className="ag-booking-list">
          {bookings.map((booking) => {
            const crop = getCrop(booking.cropId);

            return (
              <article className="ag-panel" key={booking.id}>
                <div className="ag-header">
                  <div>
                    <p className="ag-eyebrow">BOOKING #{booking.id}</p>
                    <h2>{crop?.cropName || `Crop #${booking.cropId}`}</h2>
                    <p>Buyer: {booking.buyerName || "Buyer"}</p>
                    <p>Email: {booking.buyerEmail || "Not provided"}</p>
                  </div>

                  <span
                    className={`ag-status ${String(
                      booking.status || "PENDING"
                    ).toLowerCase()}`}
                  >
                    {booking.status || "PENDING"}
                  </span>
                </div>

                <div className="ag-details">
                  <p>
                    <strong>Quantity:</strong> {booking.quantity}{" "}
                    {booking.unit || crop?.unit || ""}
                  </p>
                  <p>
                    <strong>Price per unit:</strong> ₹
                    {Number(
                      booking.pricePerUnit ?? booking.price ?? 0
                    ).toLocaleString("en-IN")}
                  </p>
                  <p>
                    <strong>Total amount:</strong> ₹
                    {Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                  </p>
                  <p>
                    <strong>Booking date:</strong>{" "}
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleString()
                      : "Not available"}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {booking.paymentStatus || "PENDING"}
                  </p>
                  <p>
                    <strong>Crop location:</strong>{" "}
                    {crop?.location || "Not provided"}
                  </p>
                </div>

                <div className="ag-actions">
                  {booking.status === "PENDING" && (
                    <>
                      <button
                        className="ag-btn ag-primary"
                        onClick={() =>
                          updateStatus(booking.id, "ACCEPTED")
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="ag-btn ag-danger"
                        onClick={() =>
                          updateStatus(booking.id, "REJECTED")
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {booking.buyerEmail && (
                    <a
                      className="ag-btn ag-secondary"
                      href={`mailto:${booking.buyerEmail}?subject=${encodeURIComponent(
                        `Crop booking #${booking.id}`
                      )}`}
                    >
                      Contact Buyer
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
