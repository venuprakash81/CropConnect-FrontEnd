import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./BuyerWarehouseDirectory.css";

const API_BASE = "http://localhost:8081/api";
const DEFAULT_CENTER = [17.385, 78.4867];

const warehouseIcon = new L.DivIcon({
  className: "wd-map-icon",
  html: '<div class="wd-map-pin">W</div>',
  iconSize: [36, 42],
  iconAnchor: [18, 38],
});

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng);
    },
  });

  return null;
}

const getBuyer = () => {
  const keys = ["cropconnectBuyer", "buyer", "buyerData", "loggedInBuyer"];

  for (const key of keys) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      if (value && typeof value === "object") return value;
    } catch (error) {
      console.warn("Unable to read buyer information:", error);
    }
  }

  return {};
};

const warehouseId = (item) =>
  item?.id ?? item?.warehouseId ?? "";

const warehouseName = (item) =>
  item?.warehouseName ??
  item?.name ??
  item?.ownerName ??
  "Warehouse";

const warehouseLocation = (item) =>
  item?.location ??
  item?.address ??
  item?.city ??
  "Location not specified";

const warehouseCapacity = (item) =>
  item?.capacity ?? item?.totalCapacity ?? "Not specified";

const warehouseAvailable = (item) =>
  item?.availableSpace ??
  item?.availableCapacity ??
  item?.available ??
  "Not specified";

const warehousePrice = (item) =>
  item?.pricePerUnit ??
  item?.rentPerUnit ??
  item?.price ??
  null;

const warehouseType = (item) =>
  item?.warehouseType ??
  item?.storageType ??
  item?.type ??
  "General storage";

const BuyerWarehouseDirectory = () => {
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(getBuyer);
  const [warehouses, setWarehouses] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("warehouses");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [storageLocation, setStorageLocation] = useState("");
  const [mapPosition, setMapPosition] = useState(null);

  const [storageDate, setStorageDate] = useState("");
  const [duration, setDuration] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("kg");
  const [productName, setProductName] = useState("");

  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const buyerName =
    buyer?.name || buyer?.buyerName || buyer?.fullName || "Buyer";

  const buyerEmail = buyer?.email || buyer?.buyerEmail || "";

  const buyerPhone =
    buyer?.phone ||
    buyer?.buyerPhone ||
    buyer?.mobile ||
    buyer?.phoneNumber ||
    "";

  const loadWarehouses = useCallback(async () => {
    setLoadingWarehouses(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/warehouses/all`);

      if (!response.ok) {
        throw new Error("Unable to load warehouses.");
      }

      const data = await response.json();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Warehouse loading error:", err);
      setWarehouses([]);
      setError(
        "Could not load warehouses. Check your backend and the /api/warehouses/all endpoint."
      );
    } finally {
      setLoadingWarehouses(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    const currentBuyer = getBuyer();
    setBuyer(currentBuyer);

    const email = currentBuyer?.email || currentBuyer?.buyerEmail;

    if (!email) {
      setBookings([]);
      setError("Buyer email not found. Please log in again.");
      return;
    }

    setLoadingBookings(true);

    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/buyer/${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error("Unable to load warehouse booking history.");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Warehouse booking history error:", err);
      setBookings([]);
      setError(err.message || "Could not load booking history.");
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    loadWarehouses();
    loadBookings();
  }, [loadWarehouses, loadBookings]);

  const filteredWarehouses = warehouses.filter((item) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      warehouseName(item).toLowerCase().includes(query) ||
      warehouseLocation(item).toLowerCase().includes(query) ||
      warehouseType(item).toLowerCase().includes(query);

    const matchesType =
      typeFilter === "all" ||
      warehouseType(item).toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesType;
  });

  const selectLocation = (latlng) => {
    const coordinates = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
    setMapPosition([latlng.lat, latlng.lng]);
    setStorageLocation(coordinates);
    setError("");
  };

  const openBookingForm = (item) => {
    setSelectedWarehouse(item);
    setStorageLocation("");
    setMapPosition(null);
    setStorageDate("");
    setDuration("");
    setQuantity("");
    setQuantityUnit("kg");
    setProductName("");
    setError("");
    setSuccess("");
    setActiveTab("book");
  };

  const resetForm = () => {
    setSelectedWarehouse(null);
    setStorageLocation("");
    setMapPosition(null);
    setStorageDate("");
    setDuration("");
    setQuantity("");
    setQuantityUnit("kg");
    setProductName("");
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const currentBuyer = getBuyer();
    const email =
      currentBuyer?.email || currentBuyer?.buyerEmail || buyerEmail;
    const name =
      currentBuyer?.name ||
      currentBuyer?.buyerName ||
      currentBuyer?.fullName ||
      buyerName;
    const phone =
      currentBuyer?.phone ||
      currentBuyer?.buyerPhone ||
      currentBuyer?.mobile ||
      currentBuyer?.phoneNumber ||
      buyerPhone;

    if (!email) {
      setError("Buyer email is missing. Please log in again.");
      return;
    }

    if (!selectedWarehouse) {
      setError("Please select a warehouse.");
      return;
    }

    if (!mapPosition || !storageLocation) {
      setError("Please select a storage location on the map.");
      return;
    }

    if (
      !storageDate ||
      !duration ||
      Number(duration) <= 0 ||
      !quantity ||
      Number(quantity) <= 0 ||
      !productName.trim()
    ) {
      setError("Please complete all booking details.");
      return;
    }

    const id = warehouseId(selectedWarehouse);

    if (id === "" || id === null) {
      setError("Selected warehouse does not have a valid ID.");
      return;
    }

    const bookingData = {
      warehouseId: Number(id),
      warehouseName: warehouseName(selectedWarehouse),
      buyerName: name,
      buyerEmail: email,
      buyerPhone: phone,
      storageLocation,
      storageDate,
      duration: Number(duration),
      productName: productName.trim(),
      quantity: Number(quantity),
      quantityUnit,
    };

    console.log("Submitting warehouse booking:", bookingData);
    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      const text = await response.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Booking failed. Server returned ${response.status}.`
        );
      }

      setSuccess("Warehouse booking submitted successfully.");
      resetForm();
      await loadBookings();
      setActiveTab("history");
    } catch (err) {
      console.error("Warehouse booking error:", err);
      setError(err.message || "Unable to submit warehouse booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusClass = (status) => {
    const value = (status || "Pending").toLowerCase();

    if (value.includes("confirm")) return "wd-status-confirmed";
    if (value.includes("progress")) return "wd-status-progress";
    if (value.includes("complete")) return "wd-status-completed";
    if (value.includes("cancel")) return "wd-status-cancelled";

    return "wd-status-pending";
  };

  const renderWarehouses = () => (
    <>
      <div className="wd-section-heading">
        <div>
          <span className="wd-eyebrow">STORAGE PARTNERS</span>
          <h2>Find a warehouse</h2>
          <p>Explore storage facilities for your agricultural products.</p>
        </div>

        <button
          type="button"
          className="wd-refresh-button"
          onClick={loadWarehouses}
          disabled={loadingWarehouses}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="wd-filter-bar">
        <div className="wd-search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search warehouse, location, or storage type"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          aria-label="Filter warehouse type"
        >
          <option value="all">All storage types</option>
          <option value="cold">Cold storage</option>
          <option value="dry">Dry storage</option>
          <option value="grain">Grain storage</option>
          <option value="general">General storage</option>
        </select>
      </div>

      {loadingWarehouses ? (
        <div className="wd-state-card">
          <div className="wd-loader" />
          <p>Loading warehouses...</p>
        </div>
      ) : filteredWarehouses.length === 0 ? (
        <div className="wd-state-card">
          <div className="wd-empty-icon">🏭</div>
          <h3>No warehouses found</h3>
          <p>
            Try another search or check whether warehouses are available in
            your database.
          </p>
        </div>
      ) : (
        <div className="wd-warehouse-grid">
          {filteredWarehouses.map((item) => {
            const id = warehouseId(item);
            const price = warehousePrice(item);

            return (
              <article
                className="wd-warehouse-card"
                key={id || warehouseName(item)}
              >
                <div className="wd-card-top">
                  <div className="wd-warehouse-avatar">🏭</div>
                  <span className="wd-listed-label">
                    <span /> Listed
                  </span>
                </div>

                <h3>{warehouseName(item)}</h3>
                <p className="wd-warehouse-location">
                  <span>⌖</span> {warehouseLocation(item)}
                </p>

                <div className="wd-warehouse-details">
                  <div>
                    <span className="wd-detail-icon">▦</span>
                    <span>{warehouseType(item)}</span>
                  </div>
                  <div>
                    <span className="wd-detail-icon">◫</span>
                    <span>Capacity: {warehouseCapacity(item)}</span>
                  </div>
                  <div>
                    <span className="wd-detail-icon">▣</span>
                    <span>Available: {warehouseAvailable(item)}</span>
                  </div>
                </div>

                <div className="wd-card-price">
                  <div>
                    <small>Storage price</small>
                    <strong>
                      {price !== null && price !== ""
                        ? `₹${price}`
                        : "Contact warehouse"}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="wd-primary-button"
                    onClick={() => openBookingForm(item)}
                  >
                    Book now <span>→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );

  const renderBookingForm = () => (
    <div className="wd-booking-layout">
      <div className="wd-booking-main">
        <div className="wd-section-heading">
          <div>
            <span className="wd-eyebrow">NEW STORAGE REQUEST</span>
            <h2>Book a warehouse</h2>
            <p>Enter your product and storage requirements.</p>
          </div>
        </div>

        <div className="wd-selected-warehouse">
          <div className="wd-warehouse-avatar">🏭</div>
          <div>
            <small>Selected warehouse</small>
            <h3>
              {selectedWarehouse
                ? warehouseName(selectedWarehouse)
                : "No warehouse selected"}
            </h3>
            <p>
              {selectedWarehouse
                ? warehouseLocation(selectedWarehouse)
                : "Select a warehouse from the directory."}
            </p>
          </div>
          <button
            type="button"
            className="wd-text-button"
            onClick={() => setActiveTab("warehouses")}
          >
            Change
          </button>
        </div>

        <form className="wd-booking-form" onSubmit={submitBooking}>
          <div className="wd-form-section-title">
            <span className="wd-step">1</span>
            <div>
              <h3>Storage location</h3>
              <p>Click on the map to select the location for your storage.</p>
            </div>
          </div>

          <div className="wd-map-selection">
            <div className="wd-map-instruction">
              Click anywhere on the map to set your storage location.
            </div>

            <div className="wd-map-wrapper">
              <MapContainer
                center={DEFAULT_CENTER}
                zoom={11}
                scrollWheelZoom
                className="wd-leaflet-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onSelect={selectLocation} />

                {mapPosition && (
                  <Marker position={mapPosition} icon={warehouseIcon}>
                    <Popup>Selected storage location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>

            <div className="wd-location-field">
              <label htmlFor="wd-storage-location">
                Selected coordinates
              </label>
              <input
                id="wd-storage-location"
                value={storageLocation}
                onChange={(event) => setStorageLocation(event.target.value)}
                placeholder="Select a point on the map"
                required
              />
            </div>
          </div>

          <div className="wd-form-divider" />

          <div className="wd-form-section-title">
            <span className="wd-step">2</span>
            <div>
              <h3>Product and storage details</h3>
              <p>Specify what you want to store and for how long.</p>
            </div>
          </div>

          <div className="wd-form-grid">
            <div className="wd-form-group">
              <label htmlFor="wd-product">Product name</label>
              <input
                id="wd-product"
                type="text"
                placeholder="e.g. Rice, Wheat, Tomatoes"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />
            </div>

            <div className="wd-form-group">
              <label htmlFor="wd-quantity">Quantity</label>
              <input
                id="wd-quantity"
                type="number"
                min="0.01"
                step="any"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                required
              />
            </div>

            <div className="wd-form-group">
              <label htmlFor="wd-unit">Quantity unit</label>
              <select
                id="wd-unit"
                value={quantityUnit}
                onChange={(event) => setQuantityUnit(event.target.value)}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintals</option>
                <option value="ton">Tons</option>
                <option value="bags">Bags</option>
                <option value="crates">Crates</option>
              </select>
            </div>

            <div className="wd-form-group">
              <label htmlFor="wd-storage-date">Storage start date</label>
              <input
                id="wd-storage-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={storageDate}
                onChange={(event) => setStorageDate(event.target.value)}
                required
              />
            </div>

            <div className="wd-form-group">
              <label htmlFor="wd-duration">Storage duration</label>
              <input
                id="wd-duration"
                type="number"
                min="1"
                step="1"
                placeholder="Number of days"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="wd-buyer-summary">
            <div>
              <small>Booking as</small>
              <strong>{buyerName}</strong>
              <span>{buyerEmail || "Email not available"}</span>
            </div>
            <span className="wd-summary-avatar">
              {buyerName.charAt(0).toUpperCase()}
            </span>
          </div>

          {error && <div className="wd-alert wd-alert-error">{error}</div>}
          {success && (
            <div className="wd-alert wd-alert-success">{success}</div>
          )}

          <div className="wd-form-actions">
            <button
              type="button"
              className="wd-secondary-button"
              onClick={() => setActiveTab("warehouses")}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="wd-primary-button"
              disabled={submitting || !selectedWarehouse}
            >
              {submitting ? "Submitting..." : "Confirm booking"}
              {!submitting && <span>→</span>}
            </button>
          </div>
        </form>
      </div>

      <aside className="wd-booking-aside">
        <div className="wd-aside-card">
          <div className="wd-aside-icon">ℹ</div>
          <h3>Booking instructions</h3>
          <ul>
            <li>Select a warehouse from the directory.</li>
            <li>Choose your storage location on the map.</li>
            <li>Enter product quantity and storage duration.</li>
            <li>Submit your request and track its status.</li>
          </ul>
        </div>

        <div className="wd-aside-card">
          <h3>Storage summary</h3>
          <div className="wd-summary-row">
            <span>Warehouse</span>
            <strong>
              {selectedWarehouse
                ? warehouseName(selectedWarehouse)
                : "Not selected"}
            </strong>
          </div>
          <div className="wd-summary-row">
            <span>Product</span>
            <strong>{productName || "Not entered"}</strong>
          </div>
          <div className="wd-summary-row">
            <span>Quantity</span>
            <strong>
              {quantity ? `${quantity} ${quantityUnit}` : "Not entered"}
            </strong>
          </div>
          <div className="wd-summary-row">
            <span>Duration</span>
            <strong>{duration ? `${duration} days` : "Not entered"}</strong>
          </div>
        </div>
      </aside>
    </div>
  );

  const renderHistory = () => (
    <>
      <div className="wd-section-heading">
        <div>
          <span className="wd-eyebrow">YOUR STORAGE REQUESTS</span>
          <h2>Warehouse booking history</h2>
          <p>Review the warehouse bookings you have submitted.</p>
        </div>

        <button
          type="button"
          className="wd-refresh-button"
          onClick={loadBookings}
          disabled={loadingBookings}
        >
          ↻ Refresh
        </button>
      </div>

      {loadingBookings ? (
        <div className="wd-state-card">
          <div className="wd-loader" />
          <p>Loading booking history...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="wd-state-card">
          <div className="wd-empty-icon">📦</div>
          <h3>No warehouse bookings yet</h3>
          <p>Your submitted storage requests will appear here.</p>
          <button
            type="button"
            className="wd-primary-button"
            onClick={() => setActiveTab("warehouses")}
          >
            Find a warehouse
          </button>
        </div>
      ) : (
        <div className="wd-history-list">
          {bookings.map((booking) => (
            <article className="wd-history-card" key={booking.id}>
              <div className="wd-history-header">
                <div className="wd-history-title">
                  <div className="wd-history-icon">🏭</div>
                  <div>
                    <h3>{booking.warehouseName || "Warehouse booking"}</h3>
                    <span>Booking #{booking.id}</span>
                  </div>
                </div>

                <span
                  className={`wd-status-badge ${statusClass(booking.status)}`}
                >
                  {booking.status || "Pending"}
                </span>
              </div>

              <div className="wd-history-details">
                <div>
                  <span>Product</span>
                  <strong>{booking.productName || "—"}</strong>
                </div>
                <div>
                  <span>Quantity</span>
                  <strong>
                    {booking.quantity ?? "—"} {booking.quantityUnit || ""}
                  </strong>
                </div>
                <div>
                  <span>Storage start</span>
                  <strong>{booking.storageDate || "—"}</strong>
                </div>
                <div>
                  <span>Duration</span>
                  <strong>
                    {booking.duration
                      ? `${booking.duration} days`
                      : "Not specified"}
                  </strong>
                </div>
                <div className="wd-history-location">
                  <span>Storage location</span>
                  <strong>{booking.storageLocation || "Not provided"}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="wd-page">
      <header className="wd-header">
        <div className="wd-header-inner">
          <button
            type="button"
            className="wd-brand"
            onClick={() => navigate("/buyer-dashboard")}
          >
            <span className="wd-brand-mark">C</span>
            <span>
              <strong>CropConnect</strong>
              <small>Buyer Portal</small>
            </span>
          </button>

          <div className="wd-header-right">
            <div className="wd-user-chip">
              <span className="wd-user-avatar">
                {buyerName.charAt(0).toUpperCase()}
              </span>
              <span className="wd-user-name">{buyerName}</span>
            </div>

            <button
              type="button"
              className="wd-back-button"
              onClick={() => navigate("/buyer-dashboard")}
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="wd-container">
        <section className="wd-welcome">
          <div className="wd-welcome-content">
            <span className="wd-eyebrow wd-welcome-eyebrow">
              CROPCONNECT STORAGE
            </span>
            <h1>Warehouse Directory</h1>
            <p>
              Find storage facilities for your agricultural products and
              manage your warehouse booking requests in one place.
            </p>
          </div>

          <div className="wd-welcome-art" aria-hidden="true">
            <div className="wd-art-circle">🏭</div>
            <span className="wd-art-spark">✦</span>
          </div>
        </section>

        <section className="wd-stat-row">
          <div className="wd-stat-card">
            <span className="wd-stat-icon wd-stat-green">🏭</span>
            <div>
              <strong>{warehouses.length}</strong>
              <span>Warehouses</span>
            </div>
          </div>

          <div className="wd-stat-card">
            <span className="wd-stat-icon wd-stat-blue">📦</span>
            <div>
              <strong>{bookings.length}</strong>
              <span>Your bookings</span>
            </div>
          </div>

          <div className="wd-stat-card">
            <span className="wd-stat-icon wd-stat-orange">◷</span>
            <div>
              <strong>
                {
                  bookings.filter(
                    (booking) =>
                      (booking.status || "Pending").toLowerCase() ===
                      "pending"
                  ).length
                }
              </strong>
              <span>Pending requests</span>
            </div>
          </div>
        </section>

        <nav className="wd-tabs" aria-label="Warehouse sections">
          <button
            type="button"
            className={activeTab === "warehouses" ? "active" : ""}
            onClick={() => {
              setActiveTab("warehouses");
              setError("");
              setSuccess("");
            }}
          >
            <span>🏭</span> Warehouses
          </button>

          <button
            type="button"
            className={activeTab === "book" ? "active" : ""}
            onClick={() => {
              setActiveTab("book");
              setError("");
              setSuccess("");
            }}
          >
            <span>＋</span> Book storage
          </button>

          <button
            type="button"
            className={activeTab === "history" ? "active" : ""}
            onClick={() => {
              setActiveTab("history");
              setError("");
              setSuccess("");
              loadBookings();
            }}
          >
            <span>▤</span> Booking history
            {bookings.length > 0 && (
              <span className="wd-tab-count">{bookings.length}</span>
            )}
          </button>
        </nav>

        {error && activeTab !== "book" && (
          <div className="wd-alert wd-alert-error wd-page-alert">
            {error}
          </div>
        )}

        <section className="wd-content-panel">
          {activeTab === "warehouses" && renderWarehouses()}
          {activeTab === "book" && renderBookingForm()}
          {activeTab === "history" && renderHistory()}
        </section>
      </main>

      <footer className="wd-footer">
        <span>© {new Date().getFullYear()} CropConnect</span>
        <span>Connecting buyers with storage facilities</span>
      </footer>
    </div>
  );
};

export default BuyerWarehouseDirectory;