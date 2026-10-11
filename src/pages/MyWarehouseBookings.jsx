import React, { useEffect, useState } from "react";
import "./MyWarehouseBookings.css";

const API_BASE = "http://localhost:8081/api";

function MyWarehouseBookings() {
  const [warehouse, setWarehouse] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingBooking, setEditingBooking] =
    useState(null);

  const [editForm, setEditForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerType: "",
    cropName: "",
    quantity: "",
    quantityUnit: "KG",
    startDate: "",
    endDate: "",
    purpose: "",
    notes: "",
  });

  /* =====================================================
     LOAD WAREHOUSE
  ===================================================== */

  useEffect(() => {
    loadWarehouse();
  }, []);

  const loadWarehouse = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Your warehouse login should store the
       * warehouse ID in localStorage.
       *
       * Example:
       * localStorage.setItem("warehouseId", warehouse.id)
       */

      const warehouseId =
        localStorage.getItem("warehouseId");

      if (!warehouseId) {
        setError(
          "Warehouse ID not found. Please login again."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE}/warehouses/${warehouseId}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load warehouse"
        );
      }

      const data = await response.json();

      setWarehouse(data);

      await loadBookings(warehouseId);

    } catch (error) {
      console.error(
        "Warehouse loading error:",
        error
      );

      setError(
        "Unable to load warehouse details."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD ONLY MY WAREHOUSE BOOKINGS
  ===================================================== */

  const loadBookings = async (warehouseId) => {
    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/warehouse/${warehouseId}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load bookings"
        );
      }

      const data = await response.json();

      setBookings(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Booking loading error:",
        error
      );

      setError(
        "Unable to load warehouse bookings."
      );
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const openEdit = (booking) => {
    setEditingBooking(booking);

    setEditForm({
      customerName:
        booking.customerName || "",

      customerEmail:
        booking.customerEmail || "",

      customerPhone:
        booking.customerPhone || "",

      customerType:
        booking.customerType || "FARMER",

      cropName:
        booking.cropName || "",

      quantity:
        booking.quantity || "",

      quantityUnit:
        booking.quantityUnit || "KG",

      startDate:
        booking.startDate || "",

      endDate:
        booking.endDate || "",

      purpose:
        booking.purpose || "",

      notes:
        booking.notes || "",
    });
  };

  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     UPDATE
  ===================================================== */

  const updateBooking = async (event) => {
    event.preventDefault();

    if (!editingBooking) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/${editingBooking.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            warehouseId:
              editingBooking.warehouseId,

            warehouseName:
              editingBooking.warehouseName,

            customerName:
              editForm.customerName,

            customerEmail:
              editForm.customerEmail,

            customerPhone:
              editForm.customerPhone,

            customerType:
              editForm.customerType,

            cropName:
              editForm.cropName,

            quantity:
              Number(editForm.quantity),

            quantityUnit:
              editForm.quantityUnit,

            startDate:
              editForm.startDate,

            endDate:
              editForm.endDate,

            purpose:
              editForm.purpose,

            notes:
              editForm.notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Update failed"
        );
      }

      setMessage(
        "Booking updated successfully."
      );

      setEditingBooking(null);

      const warehouseId =
        localStorage.getItem("warehouseId");

      await loadBookings(warehouseId);

    } catch (error) {
      console.error(
        "Update error:",
        error
      );

      setError(
        "Unable to update booking."
      );
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteBooking = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this booking?"
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
        throw new Error(
          "Delete failed"
        );
      }

      setMessage(
        "Booking deleted successfully."
      );

      const warehouseId =
        localStorage.getItem("warehouseId");

      await loadBookings(warehouseId);

    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      setError(
        "Unable to delete booking."
      );
    }
  };

  /* =====================================================
     APPROVE / REJECT
  ===================================================== */

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const response = await fetch(
        `${API_BASE}/warehouse-bookings/${id}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Status update failed"
        );
      }

      setMessage(
        `Booking ${status.toLowerCase()} successfully.`
      );

      const warehouseId =
        localStorage.getItem("warehouseId");

      await loadBookings(warehouseId);

    } catch (error) {
      console.error(
        "Status error:",
        error
      );

      setError(
        "Unable to update booking status."
      );
    }
  };

  /* =====================================================
     LOCATION
  ===================================================== */

  const openLocation = () => {
    if (!warehouse) {
      return;
    }

    let url = "";

    if (
      warehouse.latitude &&
      warehouse.longitude
    ) {
      url =
        `https://www.google.com/maps/search/?api=1&query=` +
        `${warehouse.latitude},${warehouse.longitude}`;
    } else {
      const location = [
        warehouse.address,
        warehouse.city,
        warehouse.state,
      ]
        .filter(Boolean)
        .join(", ");

      if (!location) {
        setError(
          "Warehouse location is not available."
        );

        return;
      }

      url =
        `https://www.google.com/maps/search/?api=1&query=` +
        encodeURIComponent(location);
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="my-bookings-page">

        <div className="loading-screen">

          <div className="booking-spinner"></div>

          <p>
            Loading your warehouse...
          </p>

        </div>

      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="my-bookings-page">

      {/* HEADER */}

      <header className="my-bookings-header">

        <div className="my-brand">

          <div className="my-brand-logo">
            C
          </div>

          <div>
            <h1>
              CropConnect
            </h1>

            <p>
              My Warehouse Bookings
            </p>
          </div>

        </div>

        <div className="header-booking-count">

          <strong>
            {bookings.length}
          </strong>

          <span>
            Bookings
          </span>

        </div>

      </header>

      <main className="my-bookings-container">

        {/* ALERT */}

        {message && (
          <div className="my-success">

            <span>
              ✓
            </span>

            {message}

            <button
              onClick={() =>
                setMessage("")
              }
            >
              ×
            </button>

          </div>
        )}

        {error && (
          <div className="my-error">

            <span>
              !
            </span>

            {error}

            <button
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}

        {/* WAREHOUSE INFO */}

        {warehouse && (

          <section className="my-warehouse-card">

            <div className="warehouse-icon">
              W
            </div>

            <div className="my-warehouse-details">

              <span>
                MY WAREHOUSE
              </span>

              <h2>
                {warehouse.warehouseName}
              </h2>

              <p>
                {[
                  warehouse.address,
                  warehouse.city,
                  warehouse.state,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="warehouse-contact">

                <span>
                  Owner:{" "}
                  {warehouse.ownerName ||
                    "Not Available"}
                </span>

                <span>
                  Phone:{" "}
                  {warehouse.phone ||
                    "Not Available"}
                </span>

                <span>
                  Capacity:{" "}
                  {warehouse.totalStorageCapacity ||
                    "Not Available"}
                </span>

              </div>

            </div>

            <button
              className="warehouse-location-button"
              onClick={openLocation}
            >
              ⌖ Location
            </button>

          </section>

        )}

        {/* TITLE */}

        <section className="my-bookings-title">

          <div>

            <span>
              WAREHOUSE MANAGEMENT
            </span>

            <h2>
              My Bookings
            </h2>

            <p>
              These are the bookings made for
              your warehouse only.
            </p>

          </div>

          <div className="total-bookings">

            <strong>
              {bookings.length}
            </strong>

            <span>
              Total
            </span>

          </div>

        </section>

        {/* NO BOOKINGS */}

        {bookings.length === 0 ? (

          <div className="no-my-bookings">

            <div className="no-booking-icon">
              ▣
            </div>

            <h3>
              No Bookings Yet
            </h3>

            <p>
              No customers have booked your
              warehouse yet.
            </p>

          </div>

        ) : (

          <section className="my-bookings-table-card">

            <div className="my-table-scroll">

              <div className="my-table">

                {/* HEADER */}

                <div className="my-row my-row-header">

                  <div>
                    ID
                  </div>

                  <div>
                    Customer
                  </div>

                  <div>
                    Type
                  </div>

                  <div>
                    Phone
                  </div>

                  <div>
                    Crop
                  </div>

                  <div>
                    Quantity
                  </div>

                  <div>
                    Start Date
                  </div>

                  <div>
                    End Date
                  </div>

                  <div>
                    Purpose
                  </div>

                  <div>
                    Status
                  </div>

                  <div>
                    Payment
                  </div>

                  <div>
                    Amount
                  </div>

                  <div>
                    Actions
                  </div>

                </div>

                {/* BOOKINGS */}

                {bookings.map(
                  (booking) => (

                    <div
                      className="my-row my-row-data"
                      key={booking.id}
                    >

                      <div className="booking-id">
                        #
                        {booking.id}
                      </div>

                      <div className="customer-info">

                        <strong>
                          {
                            booking.customerName ||
                            "Customer"
                          }
                        </strong>

                        <small>
                          {
                            booking.customerEmail ||
                            ""
                          }
                        </small>

                      </div>

                      <div>

                        <span className="customer-type">
                          {
                            booking.customerType ||
                            "FARMER"
                          }
                        </span>

                      </div>

                      <div>
                        {
                          booking.customerPhone ||
                          "-"
                        }
                      </div>

                      <div className="crop-name">
                        {
                          booking.cropName ||
                          "-"
                        }
                      </div>

                      <div>
                        {
                          booking.quantity ||
                          "-"
                        }{" "}
                        {
                          booking.quantityUnit ||
                          "KG"
                        }
                      </div>

                      <div>
                        {
                          booking.startDate ||
                          "-"
                        }
                      </div>

                      <div>
                        {
                          booking.endDate ||
                          "-"
                        }
                      </div>

                      <div>
                        {
                          booking.purpose ||
                          "-"
                        }
                      </div>

                      <div>

                        <span
                          className={
                            `status status-${String(
                              booking.status ||
                                "PENDING"
                            ).toLowerCase()}`
                          }
                        >
                          {
                            booking.status ||
                            "PENDING"
                          }
                        </span>

                      </div>

                      <div>

                        <span
                          className={
                            `payment payment-${String(
                              booking.paymentStatus ||
                                "NOT_PAID"
                            ).toLowerCase()}`
                          }
                        >
                          {
                            booking.paymentStatus ||
                            "NOT_PAID"
                          }
                        </span>

                      </div>

                      <div className="amount">
                        ₹
                        {Number(
                          booking.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      {/* ACTIONS */}

                      <div className="my-actions">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEdit(
                              booking
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
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
                              className="approve-button"
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
                              className="reject-button"
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

                  )
                )}

              </div>

            </div>

          </section>

        )}

      </main>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingBooking && (

        <div className="modal-overlay">

          <div className="edit-modal">

            <div className="modal-header">

              <div>

                <span>
                  BOOKING
                </span>

                <h3>
                  Edit Booking
                </h3>

              </div>

              <button
                onClick={() =>
                  setEditingBooking(null)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={updateBooking}
            >

              <div className="edit-grid">

                <div>
                  <label>
                    Customer Name
                  </label>

                  <input
                    name="customerName"
                    value={
                      editForm.customerName
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div>
                  <label>
                    Email
                  </label>

                  <input
                    name="customerEmail"
                    value={
                      editForm.customerEmail
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div>
                  <label>
                    Phone
                  </label>

                  <input
                    name="customerPhone"
                    value={
                      editForm.customerPhone
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div>
                  <label>
                    Customer Type
                  </label>

                  <select
                    name="customerType"
                    value={
                      editForm.customerType
                    }
                    onChange={
                      handleEditChange
                    }
                  >
                    <option value="FARMER">
                      FARMER
                    </option>

                    <option value="BUYER">
                      BUYER
                    </option>
                  </select>
                </div>

                <div>
                  <label>
                    Crop
                  </label>

                  <input
                    name="cropName"
                    value={
                      editForm.cropName
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div>
                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={
                      editForm.quantity
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div>
                  <label>
                    Quantity Unit
                  </label>

                  <select
                    name="quantityUnit"
                    value={
                      editForm.quantityUnit
                    }
                    onChange={
                      handleEditChange
                    }
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

                <div>
                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      editForm.startDate
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div>
                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={
                      editForm.endDate
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div className="edit-full">
                  <label>
                    Purpose
                  </label>

                  <input
                    name="purpose"
                    value={
                      editForm.purpose
                    }
                    onChange={
                      handleEditChange
                    }
                  />
                </div>

                <div className="edit-full">
                  <label>
                    Notes
                  </label>

                  <textarea
                    name="notes"
                    value={
                      editForm.notes
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="3"
                  />
                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setEditingBooking(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                >
                  Update Booking
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyWarehouseBookings;