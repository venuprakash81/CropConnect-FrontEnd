import React, { useEffect, useState } from "react";
import "./BookWarehouse.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

const defaultForm = () => ({
  customerName:
    localStorage.getItem("name") ||
    localStorage.getItem("fullName") ||
    localStorage.getItem("userName") ||
    "",

  customerEmail:
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    "",

  customerPhone:
    localStorage.getItem("phone") ||
    localStorage.getItem("userPhone") ||
    "",

  customerType:
    (
      localStorage.getItem("role") ||
      localStorage.getItem("userRole") ||
      "FARMER"
    ).toUpperCase(),

  cropName: "",
  quantity: "",
  quantityUnit: "KG",
  startDate: "",
  endDate: "",
  purpose: "",
  notes: "",
});

function BookWarehouse() {
  const [warehouses, setWarehouses] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const [editingBookingId, setEditingBookingId] = useState(null);

  const [form, setForm] = useState(defaultForm());

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadWarehouses();
    loadBookings();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoadingWarehouses(true);

      const response = await fetch(`${API_BASE}/warehouses`);

      if (!response.ok) {
        throw new Error("Unable to load warehouses");
      }

      const data = await response.json();

      setWarehouses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Warehouse loading error:", error);

      setErrorMessage(
        "Unable to load warehouses. Please check your backend."
      );
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoadingBookings(true);

      const response = await fetch(
        `${API_BASE}/warehouse-bookings/all`
      );

      if (!response.ok) {
        throw new Error("Unable to load bookings");
      }

      const data = await response.json();

      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Booking loading error:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const getLocation = (warehouse) => {
    return [
      warehouse?.address,
      warehouse?.city,
      warehouse?.state,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const getWarehouseImage = (warehouse) => {
    if (!warehouse?.profilePhoto) {
      return "https://images.unsplash.com/photo-1586528116493-da8b9a6a1a7b?auto=format&fit=crop&w=1200&q=80";
    }

    return `${API_BASE}/warehouses/profile-photo/${warehouse.profilePhoto}`;
  };

  const getServices = (warehouse) => {
    const services = [];

    if (warehouse?.coldStorage) {
      services.push("Cold Storage");
    }

    if (warehouse?.temperatureControl) {
      services.push("Temperature Control");
    }

    if (warehouse?.humidityControl) {
      services.push("Humidity Control");
    }

    if (warehouse?.ventilation) {
      services.push("Ventilation");
    }

    if (warehouse?.electricity) {
      services.push("Electricity");
    }

    if (warehouse?.backupGenerator) {
      services.push("Generator");
    }

    if (warehouse?.cctv) {
      services.push("CCTV");
    }

    if (warehouse?.fireSafety) {
      services.push("Fire Safety");
    }

    if (warehouse?.pestControl) {
      services.push("Pest Control");
    }

    return services;
  };

  /* =====================================================
     LOCATION
  ===================================================== */

  const openLocation = (warehouse) => {
    let mapUrl = "";

    if (
      warehouse?.latitude !== null &&
      warehouse?.latitude !== undefined &&
      warehouse?.longitude !== null &&
      warehouse?.longitude !== undefined &&
      warehouse?.latitude !== "" &&
      warehouse?.longitude !== ""
    ) {
      mapUrl =
        `https://www.google.com/maps/search/?api=1&query=` +
        `${warehouse.latitude},${warehouse.longitude}`;
    } else {
      const location = getLocation(warehouse);

      if (!location) {
        setErrorMessage(
          "Location is not available for this warehouse."
        );
        return;
      }

      mapUrl =
        `https://www.google.com/maps/search/?api=1&query=` +
        `${encodeURIComponent(location)}`;
    }

    window.open(mapUrl, "_blank", "noopener,noreferrer");
  };

  /* =====================================================
     OPEN BOOKING
  ===================================================== */

  const openBooking = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setEditingBookingId(null);
    setForm(defaultForm());

    setSuccessMessage("");
    setErrorMessage("");

    setShowBookingForm(true);

    setTimeout(() => {
      document
        .getElementById("warehouse-booking-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* =====================================================
     FORM
  ===================================================== */

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedWarehouse(null);
    setEditingBookingId(null);
    setForm(defaultForm());
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     SUBMIT BOOKING
  ===================================================== */

  const submitBooking = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedWarehouse) {
      setErrorMessage("Please select a warehouse.");
      return;
    }

    if (!form.customerName.trim()) {
      setErrorMessage("Please enter customer name.");
      return;
    }

    if (!form.customerEmail.trim()) {
      setErrorMessage("Please enter customer email.");
      return;
    }

    if (!form.customerPhone.trim()) {
      setErrorMessage("Please enter phone number.");
      return;
    }

    if (!form.cropName.trim()) {
      setErrorMessage("Please enter crop name.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setErrorMessage("Please enter a valid quantity.");
      return;
    }

    if (!form.startDate) {
      setErrorMessage("Please select start date.");
      return;
    }

    if (!form.endDate) {
      setErrorMessage("Please select end date.");
      return;
    }

    if (form.endDate < form.startDate) {
      setErrorMessage(
        "End date cannot be before start date."
      );
      return;
    }

    const bookingData = {
      warehouseId: selectedWarehouse.id,
      warehouseName: selectedWarehouse.warehouseName,

      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      customerType: form.customerType,

      cropName: form.cropName,
      quantity: Number(form.quantity),
      quantityUnit: form.quantityUnit,

      startDate: form.startDate,
      endDate: form.endDate,

      purpose: form.purpose,
      notes: form.notes,
    };

    try {
      let url;
      let method;

      if (editingBookingId) {
        url = `${API_BASE}/warehouse-bookings/${editingBookingId}`;
        method = "PUT";
      } else {
        url =
          `${API_BASE}/warehouse-bookings/warehouse/` +
          `${selectedWarehouse.id}`;

        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Unable to save booking."
        );
      }

      if (editingBookingId) {
        setSuccessMessage(
          "Warehouse booking updated successfully."
        );
      } else {
        setSuccessMessage(
          "Warehouse booked successfully."
        );
      }

      await loadBookings();

      setForm(defaultForm());
      setEditingBookingId(null);

      setTimeout(() => {
        setShowBookingForm(false);
        setSelectedWarehouse(null);
      }, 1200);
    } catch (error) {
      console.error("Booking save error:", error);

      setErrorMessage(
        error.message ||
          "Unable to save booking. Please try again."
      );
    }
  };

  /* =====================================================
     EDIT BOOKING
  ===================================================== */

  const editBooking = (booking) => {
    const warehouse = warehouses.find(
      (item) =>
        Number(item.id) === Number(booking.warehouseId)
    );

    setSelectedWarehouse(
      warehouse || {
        id: booking.warehouseId,
        warehouseName:
          booking.warehouseName || "Warehouse",
      }
    );

    setForm({
      customerName: booking.customerName || "",
      customerEmail: booking.customerEmail || "",
      customerPhone: booking.customerPhone || "",
      customerType:
        booking.customerType || "FARMER",

      cropName: booking.cropName || "",
      quantity: booking.quantity || "",
      quantityUnit:
        booking.quantityUnit || "KG",

      startDate: booking.startDate || "",
      endDate: booking.endDate || "",

      purpose: booking.purpose || "",
      notes: booking.notes || "",
    });

    setEditingBookingId(booking.id);

    setSuccessMessage("");
    setErrorMessage("");

    setShowBookingForm(true);

    setTimeout(() => {
      document
        .getElementById("warehouse-booking-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this warehouse booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setSuccessMessage(
        "Warehouse booking deleted successfully."
      );

      await loadBookings();
    } catch (error) {
      console.error("Delete error:", error);

      setErrorMessage(
        "Unable to delete the booking."
      );
    }
  };

  /* =====================================================
     STATUS
  ===================================================== */

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/${id}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      await loadBookings();

      setSuccessMessage(
        `Booking ${status.toLowerCase()} successfully.`
      );
    } catch (error) {
      console.error("Status update error:", error);

      setErrorMessage(
        "Unable to update booking status."
      );
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="warehouse-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="warehouse-header">

        <div className="header-brand">

          <div className="brand-logo">
            C
          </div>

          <div className="brand-text">
            <h1>CropConnect</h1>
            <p>Warehouse Management</p>
          </div>

        </div>

        <div className="header-right">

          <div className="warehouse-total">
            <strong>{warehouses.length}</strong>
            <span>Warehouses</span>
          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="warehouse-container">

        {/* PAGE TITLE */}

        <section className="page-heading">

          <div className="heading-label">
            STORAGE NETWORK
          </div>

          <h2>Book a Warehouse</h2>

          <p>
            Find suitable storage facilities, view their
            locations and book warehouse space for your
            agricultural products.
          </p>

        </section>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {successMessage && (
          <div className="alert success-alert">

            <div className="alert-icon">
              ✓
            </div>

            <span>
              {successMessage}
            </span>

            <button
              onClick={() => setSuccessMessage("")}
            >
              ×
            </button>

          </div>
        )}

        {errorMessage && (
          <div className="alert error-alert">

            <div className="alert-icon">
              !
            </div>

            <span>
              {errorMessage}
            </span>

            <button
              onClick={() => setErrorMessage("")}
            >
              ×
            </button>

          </div>
        )}

        {/* =================================================
            BOOKING FORM
        ================================================= */}

        {showBookingForm && selectedWarehouse && (

          <section
            className="booking-form-section"
            id="warehouse-booking-form"
          >

            <div className="booking-form-header">

              <div>

                <span>
                  WAREHOUSE BOOKING
                </span>

                <h3>
                  {editingBookingId
                    ? "Edit Warehouse Booking"
                    : "Book Warehouse"}
                </h3>

                <p>
                  {selectedWarehouse.warehouseName ||
                    "Selected Warehouse"}
                </p>

              </div>

              <button
                className="close-form"
                type="button"
                onClick={closeBookingForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={submitBooking}>

              <div className="form-grid">

                <div className="form-field">
                  <label>
                    Customer Name *
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="customerEmail"
                    value={form.customerEmail}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="customerPhone"
                    value={form.customerPhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Customer Type
                  </label>

                  <select
                    name="customerType"
                    value={form.customerType}
                    onChange={handleChange}
                  >
                    <option value="FARMER">
                      FARMER
                    </option>

                    <option value="BUYER">
                      BUYER
                    </option>

                    <option value="WAREHOUSE">
                      WAREHOUSE
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Crop Name *
                  </label>

                  <input
                    type="text"
                    name="cropName"
                    value={form.cropName}
                    onChange={handleChange}
                    placeholder="Example: Rice"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Quantity *
                  </label>

                  <div className="quantity-wrapper">

                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="Quantity"
                    />

                    <select
                      name="quantityUnit"
                      value={form.quantityUnit}
                      onChange={handleChange}
                    >
                      <option value="KG">
                        KG
                      </option>

                      <option value="TON">
                        TON
                      </option>

                      <option value="QUINTAL">
                        QUINTAL
                      </option>
                    </select>

                  </div>
                </div>

                <div className="form-field">
                  <label>
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>
                    End Date *
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field full-width">
                  <label>
                    Purpose
                  </label>

                  <input
                    type="text"
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    placeholder="Example: Store harvested crops"
                  />
                </div>

                <div className="form-field full-width">
                  <label>
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Enter additional information"
                    rows="4"
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeBookingForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="confirm-booking-button"
                >
                  {editingBookingId
                    ? "Update Booking"
                    : "Confirm Booking"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* =================================================
            WAREHOUSE SECTION
        ================================================= */}

        <section className="warehouse-section">

          <div className="section-header">

            <div>
              <span>
                AVAILABLE STORAGE
              </span>

              <h3>
                All Warehouses
              </h3>
            </div>

            <div className="available-count">
              {warehouses.length} Available
            </div>

          </div>

          {/* LOADING */}

          {loadingWarehouses && (

            <div className="loading-container">

              <div className="spinner"></div>

              <p>
                Loading warehouses...
              </p>

            </div>

          )}

          {/* EMPTY */}

          {!loadingWarehouses &&
            warehouses.length === 0 && (

              <div className="empty-container">

                <div className="empty-icon">
                  ⌂
                </div>

                <h3>
                  No Warehouses Available
                </h3>

                <p>
                  There are currently no registered
                  warehouses.
                </p>

              </div>

            )}

          {/* WAREHOUSES */}

          {!loadingWarehouses &&
            warehouses.length > 0 && (

              <div className="warehouse-grid">

                {warehouses.map((warehouse) => {

                  const services =
                    getServices(warehouse);

                  return (

                    <article
                      className="warehouse-card"
                      key={warehouse.id}
                    >

                      {/* IMAGE */}

                      <div className="warehouse-image-box">

                        <img
                          src={getWarehouseImage(
                            warehouse
                          )}
                          alt={
                            warehouse.warehouseName ||
                            "Warehouse"
                          }
                          onError={(event) => {
                            event.currentTarget.src =
                              "https://images.unsplash.com/photo-1586528116493-da8b9a6a1a7b?auto=format&fit=crop&w=1200&q=80";
                          }}
                        />

                        <div className="verified-label">
                          ✓ VERIFIED
                        </div>

                        {warehouse.totalStorageCapacity && (
                          <div className="capacity-label">
                            {warehouse.totalStorageCapacity}
                          </div>
                        )}

                      </div>

                      {/* BODY */}

                      <div className="warehouse-card-body">

                        <div className="warehouse-title">

                          <h3>
                            {warehouse.warehouseName ||
                              "Unnamed Warehouse"}
                          </h3>

                          <p>
                            Owner:{" "}
                            {warehouse.ownerName ||
                              "Not Available"}
                          </p>

                        </div>

                        {/* LOCATION */}

                        <div className="detail-box">

                          <div className="detail-icon">
                            ⌖
                          </div>

                          <div>
                            <small>
                              LOCATION
                            </small>

                            <p>
                              {getLocation(
                                warehouse
                              ) ||
                                "Location not available"}
                            </p>
                          </div>

                        </div>

                        {/* PHONE */}

                        <div className="detail-box">

                          <div className="detail-icon">
                            ☎
                          </div>

                          <div>
                            <small>
                              PHONE
                            </small>

                            <p>
                              {warehouse.phone ||
                                "Not Available"}
                            </p>
                          </div>

                        </div>

                        {/* CROPS */}

                        {warehouse.supportedCrops && (

                          <div className="tag-section">

                            <span>
                              SUPPORTED CROPS
                            </span>

                            <div className="tags">

                              {String(
                                warehouse.supportedCrops
                              )
                                .split(",")
                                .filter(Boolean)
                                .slice(0, 6)
                                .map(
                                  (crop, index) => (
                                    <span
                                      key={index}
                                      className="crop-tag"
                                    >
                                      {crop.trim()}
                                    </span>
                                  )
                                )}

                            </div>

                          </div>

                        )}

                        {/* SERVICES */}

                        {services.length > 0 && (

                          <div className="tag-section">

                            <span>
                              SERVICES
                            </span>

                            <div className="tags">

                              {services
                                .slice(0, 5)
                                .map(
                                  (
                                    service,
                                    index
                                  ) => (
                                    <span
                                      key={index}
                                      className="service-tag"
                                    >
                                      {service}
                                    </span>
                                  )
                                )}

                            </div>

                          </div>

                        )}

                        {/* =================================================
                            BUTTONS - ALWAYS VISIBLE
                        ================================================= */}

                        <div className="warehouse-actions">

                          <button
                            type="button"
                            className="location-button"
                            onClick={() =>
                              openLocation(
                                warehouse
                              )
                            }
                          >
                            <span>⌖</span>
                            Location
                          </button>

                          <button
                            type="button"
                            className="book-button"
                            onClick={() =>
                              openBooking(
                                warehouse
                              )
                            }
                          >
                            <span>▣</span>
                            Book Warehouse
                          </button>

                        </div>

                      </div>

                    </article>

                  );
                })}

              </div>

            )}

        </section>

        {/* =================================================
            BOOKINGS
        ================================================= */}

        <section
          className="bookings-section"
          id="bookings-section"
        >

          <div className="section-header">

            <div>
              <span>
                BOOKING MANAGEMENT
              </span>

              <h3>
                Warehouse Bookings
              </h3>
            </div>

            <div className="available-count">
              {bookings.length} Bookings
            </div>

          </div>

          {loadingBookings ? (

            <div className="loading-container">

              <div className="spinner"></div>

              <p>
                Loading bookings...
              </p>

            </div>

          ) : bookings.length === 0 ? (

            <div className="empty-container">

              <div className="empty-icon">
                ▣
              </div>

              <h3>
                No Bookings Yet
              </h3>

              <p>
                Bookings will appear here after
                you book a warehouse.
              </p>

            </div>

          ) : (

            <div className="booking-table-container">

              <div className="booking-table">

                {/* HEADER */}

                <div className="booking-row booking-header">

                  <div>ID</div>
                  <div>Warehouse</div>
                  <div>Customer</div>
                  <div>Type</div>
                  <div>Crop</div>
                  <div>Quantity</div>
                  <div>Start</div>
                  <div>End</div>
                  <div>Status</div>
                  <div>Payment</div>
                  <div>Amount</div>
                  <div>Actions</div>

                </div>

                {/* DATA */}

                {bookings.map((booking) => (

                  <div
                    className="booking-row booking-data"
                    key={booking.id}
                  >

                    <div className="booking-id">
                      #{booking.id}
                    </div>

                    <div className="booking-warehouse">
                      {booking.warehouseName ||
                        "Warehouse"}
                    </div>

                    <div className="booking-customer">

                      <strong>
                        {booking.customerName ||
                          "Customer"}
                      </strong>

                      <small>
                        {booking.customerEmail ||
                          ""}
                      </small>

                    </div>

                    <div>
                      <span className="type-badge">
                        {booking.customerType ||
                          "FARMER"}
                      </span>
                    </div>

                    <div className="crop-name">
                      {booking.cropName || "-"}
                    </div>

                    <div>
                      {booking.quantity || "-"}{" "}
                      {booking.quantityUnit ||
                        "KG"}
                    </div>

                    <div>
                      {booking.startDate || "-"}
                    </div>

                    <div>
                      {booking.endDate || "-"}
                    </div>

                    <div>

                      <span
                        className={`status-badge status-${String(
                          booking.status ||
                            "PENDING"
                        ).toLowerCase()}`}
                      >
                        {booking.status ||
                          "PENDING"}
                      </span>

                    </div>

                    <div>

                      <span
                        className={`payment-badge payment-${String(
                          booking.paymentStatus ||
                            "NOT_PAID"
                        ).toLowerCase()}`}
                      >
                        {booking.paymentStatus ||
                          "NOT_PAID"}
                      </span>

                    </div>

                    <div className="booking-amount">
                      ₹
                      {Number(
                        booking.amount || 0
                      ).toLocaleString("en-IN")}
                    </div>

                    {/* ACTIONS */}

                    <div className="booking-actions">

                      <button
                        type="button"
                        className="table-btn location-action"
                        onClick={() => {

                          const warehouse =
                            warehouses.find(
                              (item) =>
                                Number(item.id) ===
                                Number(
                                  booking.warehouseId
                                )
                            );

                          if (warehouse) {
                            openLocation(
                              warehouse
                            );
                          }

                        }}
                      >
                        Location
                      </button>

                      <button
                        type="button"
                        className="table-btn edit-action"
                        onClick={() =>
                          editBooking(
                            booking
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="table-btn delete-action"
                        onClick={() =>
                          deleteBooking(
                            booking.id
                          )
                        }
                      >
                        Delete
                      </button>

                      {String(
                        booking.status ||
                          "PENDING"
                      ).toUpperCase() ===
                        "PENDING" && (

                        <>

                          <button
                            type="button"
                            className="table-btn approve-action"
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "APPROVED"
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            className="table-btn reject-action"
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </button>

                        </>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default BookWarehouse;
