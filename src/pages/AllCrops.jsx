import React, { useEffect, useState } from "react";
import "./AllCrops.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";
const SERVER = "https://cropconnect-backend-exn7.onrender.com";

// Read buyer information from either storage.
const getBuyerValue = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key) || "";

export default function AllCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // These values now work with your existing BuyerLogin.jsx.
  const buyerId =
    getBuyerValue("buyerId") ||
    getBuyerValue("loggedInBuyerId");

  const buyerName =
    getBuyerValue("buyerName") ||
    getBuyerValue("loggedInBuyerName") ||
    "";

  const buyerEmail =
    getBuyerValue("buyerEmail") ||
    getBuyerValue("loggedInBuyerEmail") ||
    getBuyerValue("cropconnectBuyer") ||
    getBuyerValue("userEmail");

  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/crops`);

      if (!response.ok) {
        throw new Error("Unable to load crops. Please try again.");
      }

      const data = await response.json();
      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load crops.");
    } finally {
      setLoading(false);
    }
  }

  function getImageUrl(path) {
    if (!path) return "";

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${SERVER}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  function openBooking(crop) {
    if (!buyerId || !buyerEmail) {
      alert(
        "Buyer login details were not found. Please log in again."
      );
      return;
    }

    setSelectedCrop(crop);
    setQuantity("");
  }

  function closeBooking() {
    if (submitting) return;

    setSelectedCrop(null);
    setQuantity("");
  }

  function contactFarmer(crop) {
    const email = crop.farmerEmail || crop.farmer?.email;
    const location =
      crop.location || crop.farmerLocation || crop.farmer?.location;

    if (email) {
      const subject = encodeURIComponent(
        `Inquiry about ${crop.cropName || "crop"}`
      );

      const body = encodeURIComponent(
        `Hello Farmer,\n\nI am interested in your crop: ${
          crop.cropName || "crop"
        }.\nFarmer location: ${
          location || "Not specified"
        }\n\nPlease share more details.\n\nBuyer: ${
          buyerName || "Agritech Buyer"
        }\nBuyer email: ${buyerEmail || "Not provided"}`
      );

      window.location.href =
        `mailto:${email}?subject=${subject}&body=${body}`;
      return;
    }

    if (location) {
      alert(
        `Farmer location: ${location}\n\nFarmer email is not available in the crop data.`
      );
    } else {
      alert(
        "Farmer contact information is not available for this crop."
      );
    }
  }

  const estimatedTotal =
    selectedCrop && quantity !== ""
      ? Number(selectedCrop.price || 0) * Number(quantity)
      : 0;

  async function handleBooking(event) {
    event.preventDefault();

    if (!selectedCrop) return;

    if (!buyerId || !buyerEmail) {
      alert("Please log in again before booking.");
      return;
    }

    const requestedQuantity = Number(quantity);
    const availableQuantity = Number(selectedCrop.quantity);

    if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
      alert("Enter a quantity greater than zero.");
      return;
    }

    if (
      Number.isFinite(availableQuantity) &&
      requestedQuantity > availableQuantity
    ) {
      alert(
        `Only ${availableQuantity} ${selectedCrop.unit || "units"} are available.`
      );
      return;
    }

    if (
      selectedCrop.price == null ||
      !Number.isFinite(Number(selectedCrop.price)) ||
      Number(selectedCrop.price) < 0
    ) {
      alert("This crop does not have a valid price.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API}/crop-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cropId: selectedCrop.id,
          buyerId: Number(buyerId),
          buyerName,
          buyerEmail,
          quantity: requestedQuantity,
        }),
      });

      const responseText = await response.text();
      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = { message: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Booking failed (HTTP ${response.status}).`
        );
      }

      const totalPrice =
        result.totalPrice != null
          ? Number(result.totalPrice)
          : requestedQuantity * Number(selectedCrop.price);

      setBookingDetails({
        bookingId: result.id ?? result.bookingId ?? "Created",
        cropId: selectedCrop.id,
        cropName: selectedCrop.cropName || "Crop",
        buyerName: buyerName || "Buyer",
        buyerEmail,
        farmerEmail:
          result.farmerEmail ||
          selectedCrop.farmerEmail ||
          selectedCrop.farmer?.email ||
          "Not available",
        location:
          selectedCrop.location ||
          selectedCrop.farmerLocation ||
          selectedCrop.farmer?.location ||
          "Not specified",
        quantity: requestedQuantity,
        unit: selectedCrop.unit || "unit",
        price: Number(selectedCrop.price),
        totalPrice,
        status: result.status || "PENDING",
        paymentStatus: result.paymentStatus || "PENDING",
        bookingDate: result.createdAt || new Date().toLocaleString(),
      });

      setSelectedCrop(null);
      setQuantity("");

      // Refresh available crops and stock.
      await loadCrops();
    } catch (err) {
      alert(err.message || "Could not complete the booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="all-crops-page">
      <header className="all-crops-header">
        <div>
          <span className="all-crops-eyebrow">
            AGRITECH MARKETPLACE
          </span>
          <h1>Explore All Crops</h1>
          <p>
            Discover crops from farmers, check their locations, and book
            directly.
          </p>
        </div>

        <button
          type="button"
          className="all-crops-refresh"
          onClick={loadCrops}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </header>

      <div className="all-crops-count">
        <span className="all-crops-count-icon">🌾</span>
        <div>
          <span>Crop Listings</span>
          <strong>{crops.length}</strong>
        </div>
      </div>

      {loading ? (
        <div className="all-crops-state">Loading all crops...</div>
      ) : error ? (
        <div className="all-crops-state all-crops-error">
          <p>{error}</p>
          <button type="button" onClick={loadCrops}>
            Try Again
          </button>
        </div>
      ) : crops.length === 0 ? (
        <div className="all-crops-empty">
          <div>🌱</div>
          <h2>No crops available</h2>
          <p>Crop listings will appear here when farmers add their crops.</p>
        </div>
      ) : (
        <section className="all-crops-grid">
          {crops.map((crop) => {
            const stock = Number(crop.quantity);
            const outOfStock = !Number.isFinite(stock) || stock <= 0;

            return (
              <article className="all-crop-card" key={crop.id}>
                <div className="all-crop-image-wrap">
                  {crop.imageUrl ? (
                    <img
                      src={getImageUrl(crop.imageUrl)}
                      alt={crop.cropName || "Crop"}
                      className="all-crop-image"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="all-crop-no-image">🌿</div>
                  )}

                  <span
                    className={`all-crop-stock ${
                      outOfStock ? "out-of-stock" : ""
                    }`}
                  >
                    {outOfStock ? "Out of stock" : "Available"}
                  </span>
                </div>

                <div className="all-crop-content">
                  <div className="all-crop-title-row">
                    <h2>{crop.cropName || "Unnamed Crop"}</h2>
                    <span className="all-crop-id">#{crop.id}</span>
                  </div>

                  {crop.cropType && (
                    <p>
                      <strong>Type:</strong> {crop.cropType}
                    </p>
                  )}

                  <div className="all-crop-price">
                    ₹{Number(crop.price || 0).toLocaleString("en-IN")}
                    <span> / {crop.unit || "unit"}</span>
                  </div>

                  <p>
                    <strong>Available quantity:</strong>{" "}
                    {crop.quantity ?? "—"} {crop.unit || ""}
                  </p>

                  <div className="all-crop-location">
                    <span className="all-crop-location-icon">📍</span>
                    <div>
                      <span>Farmer's Location</span>
                      <strong>
                        {crop.location ||
                          crop.farmerLocation ||
                          crop.farmer?.location ||
                          "Location not provided"}
                      </strong>
                    </div>
                  </div>

                  {crop.harvestDate && (
                    <p>
                      <strong>Harvest Date:</strong> {crop.harvestDate}
                    </p>
                  )}

                  {crop.description && (
                    <p className="all-crop-description">
                      {crop.description}
                    </p>
                  )}

                  <div className="all-crop-actions">
                    <button
                      type="button"
                      className="all-crop-book-button"
                      disabled={outOfStock}
                      onClick={() => openBooking(crop)}
                    >
                      {outOfStock ? "Unavailable" : "🛒 Book Crop"}
                    </button>

                    <button
                      type="button"
                      className="all-crop-contact-button"
                      onClick={() => contactFarmer(crop)}
                    >
                      ✉ Contact Farmer
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* BOOKING FORM POPUP */}
      {selectedCrop && (
        <div className="all-crops-overlay" onClick={closeBooking}>
          <section
            className="all-crops-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-booking-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="all-crops-modal-header">
              <div>
                <span className="all-crops-eyebrow">NEW BOOKING</span>
                <h2 id="crop-booking-title">
                  Book {selectedCrop.cropName}
                </h2>
              </div>

              <button
                type="button"
                className="all-crops-close"
                onClick={closeBooking}
                disabled={submitting}
                aria-label="Close booking form"
              >
                ×
              </button>
            </div>

            <div className="all-crops-booking-info">
              <p>
                <strong>Farmer Location:</strong>{" "}
                {selectedCrop.location ||
                  selectedCrop.farmerLocation ||
                  selectedCrop.farmer?.location ||
                  "Not specified"}
              </p>
              <p>
                <strong>Available:</strong> {selectedCrop.quantity}{" "}
                {selectedCrop.unit || ""}
              </p>
              <p>
                <strong>Price per unit:</strong> ₹{selectedCrop.price}
              </p>
            </div>

            <form className="all-crops-booking-form" onSubmit={handleBooking}>
              <label>
                Buyer Name
                <input value={buyerName} readOnly />
              </label>

              <label>
                Buyer Email
                <input value={buyerEmail} readOnly />
              </label>

              <label>
                Booking Quantity *
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  max={selectedCrop.quantity}
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="Enter required quantity"
                  required
                />
              </label>

              <div className="all-crops-total">
                <span>Estimated Total Amount</span>
                <strong>
                  ₹
                  {estimatedTotal.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>

              <p className="all-crops-payment-note">
                This creates a booking request. Payment is handled separately.
              </p>

              <div className="all-crops-modal-actions">
                <button
                  type="button"
                  className="all-crops-cancel-button"
                  onClick={closeBooking}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="all-crops-confirm-button"
                  disabled={submitting}
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* BOOKING DETAILS POPUP */}
      {bookingDetails && (
        <div className="all-crops-overlay">
          <section
            className="all-crops-modal all-crops-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-success-title"
          >
            <div className="all-crops-success-icon">✓</div>

            <h2 id="booking-success-title">Booking Submitted!</h2>

            <p className="all-crops-success-message">
              Your booking request was accepted by the server. Check the
              status below for confirmation.
            </p>

            <div className="all-crops-booking-details">
              <div>
                <span>Booking ID</span>
                <strong>{bookingDetails.bookingId}</strong>
              </div>
              <div>
                <span>Crop</span>
                <strong>{bookingDetails.cropName}</strong>
              </div>
              <div>
                <span>Crop ID</span>
                <strong>{bookingDetails.cropId}</strong>
              </div>
              <div>
                <span>Buyer Name</span>
                <strong>{bookingDetails.buyerName}</strong>
              </div>
              <div>
                <span>Buyer Email</span>
                <strong>{bookingDetails.buyerEmail}</strong>
              </div>
              <div>
                <span>Farmer Email</span>
                <strong>{bookingDetails.farmerEmail}</strong>
              </div>
              <div>
                <span>Farmer Location</span>
                <strong>{bookingDetails.location}</strong>
              </div>
              <div>
                <span>Quantity</span>
                <strong>
                  {bookingDetails.quantity} {bookingDetails.unit}
                </strong>
              </div>
              <div>
                <span>Price per Unit</span>
                <strong>₹{bookingDetails.price}</strong>
              </div>
              <div>
                <span>Total Amount</span>
                <strong>
                  ₹
                  {bookingDetails.totalPrice.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>
              <div>
                <span>Booking Status</span>
                <strong className="all-crops-pending">
                  {bookingDetails.status}
                </strong>
              </div>
              <div>
                <span>Payment Status</span>
                <strong className="all-crops-pending">
                  {bookingDetails.paymentStatus}
                </strong>
              </div>
              <div>
                <span>Booking Date</span>
                <strong>{bookingDetails.bookingDate}</strong>
              </div>
            </div>

            <button
              type="button"
              className="all-crops-confirm-button all-crops-done-button"
              onClick={() => setBookingDetails(null)}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
