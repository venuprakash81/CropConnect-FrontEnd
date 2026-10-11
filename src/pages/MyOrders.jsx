import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./MyOrders.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";

// Replace this with your real UPI ID before accepting payments.
const UPI_ID = "6305348465@ybl";
const PAYEE_NAME = "CropConnect";

const getStoredValue = (key) =>
  localStorage.getItem(key) || sessionStorage.getItem(key) || "";

function getStoredBuyer() {
  const raw =
    localStorage.getItem("buyer") ||
    sessionStorage.getItem("buyer") ||
    localStorage.getItem("buyerData") ||
    sessionStorage.getItem("buyerData");

  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
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

function getBookingId(order) {
  return order.id ?? order.bookingId ?? order.cropBookingId;
}

function getCropName(order) {
  return (
    order.cropName ||
    order.crop?.cropName ||
    order.crop?.name ||
    order.crop?.nameOfCrop ||
    "Crop order"
  );
}

function getQuantity(order) {
  return Number(order.quantity ?? order.bookedQuantity ?? 0);
}

function getUnitPrice(order) {
  return Number(
    order.pricePerUnit ??
      order.unitPrice ??
      order.cropPrice ??
      order.price ??
      order.crop?.price ??
      0
  );
}

function getTotal(order) {
  const savedTotal =
    order.totalAmount ??
    order.totalPrice ??
    order.amount ??
    order.bookingAmount;

  if (savedTotal !== undefined && savedTotal !== null && savedTotal !== "") {
    return Number(savedTotal);
  }

  return getQuantity(order) * getUnitPrice(order);
}

function getPaymentStatus(order) {
  return String(
    order.paymentStatus || order.payment_status || order.status || "PENDING"
  ).toUpperCase();
}

export default function MyOrders() {
  const buyer = getStoredBuyer();

  const buyerId =
    buyer.id ??
    buyer.buyerId ??
    getStoredValue("buyerId");

  const buyerEmail = (
    buyer.email ||
    buyer.buyerEmail ||
    getStoredValue("buyerEmail") ||
    getStoredValue("cropconnectBuyer") ||
    getStoredValue("userEmail") ||
    ""
  ).trim().toLowerCase();

  const buyerName =
    buyer.fullName ||
    buyer.name ||
    getStoredValue("buyerName") ||
    "Buyer";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [editingOrder, setEditingOrder] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  const [payingOrder, setPayingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
    // Load orders when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError("");

    if (!buyerEmail) {
      setOrders([]);
      setError("Buyer login details were not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API}/crop-bookings/buyer/email/${encodeURIComponent(buyerEmail)}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      const data = await readResponse(response);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
          ? data.content
          : Array.isArray(data.bookings)
            ? data.bookings
            : Array.isArray(data.orders)
              ? data.orders
              : [];

      setOrders(list);
    } catch (err) {
      setError(
        `${err.message || "Could not load your orders."} Check the buyer bookings endpoint in CropBookingController.`
      );
    } finally {
      setLoading(false);
    }
  }

  function canModify(order) {
    const status = getPaymentStatus(order);
    return (
      !payingOrder ||
      String(getBookingId(order)) !== String(getBookingId(payingOrder))
    ) && !["PAID", "COMPLETED", "DELIVERED", "CANCELLED"].includes(status);
  }

  function openEdit(order) {
    if (!canModify(order)) {
      setError("This order cannot be edited in its current status.");
      return;
    }

    setError("");
    setNotice("");
    setEditingOrder(order);
    setEditQuantity(String(getQuantity(order)));
  }

  async function saveEdit(event) {
    event.preventDefault();

    if (!editingOrder) return;

    const quantity = Number(editQuantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Enter a quantity greater than zero.");
      return;
    }

    const id = getBookingId(editingOrder);

    if (id == null) {
      setError("Booking ID is missing.");
      return;
    }

    const payload = {
      quantity,
      buyerId: buyerId !== "" ? Number(buyerId) : null,
      buyerEmail,
    };

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const response = await fetch(`${API}/crop-bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      await readResponse(response);

      setEditingOrder(null);
      setNotice("Order updated successfully.");
      await loadOrders();
    } catch (err) {
      setError(
        `${err.message || "Could not update order."} Check your CropBookingController update endpoint and request fields.`
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteOrder(order) {
    if (!canModify(order)) {
      setError("This order cannot be deleted in its current status.");
      return;
    }

    const id = getBookingId(order);

    if (id == null) {
      setError("Booking ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Delete the order for "${getCropName(order)}"?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API}/crop-bookings/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      await readResponse(response);

      setOrders((previous) =>
        previous.filter(
          (item) => String(getBookingId(item)) !== String(id)
        )
      );

      setNotice("Order deleted successfully.");
    } catch (err) {
      setError(
        `${err.message || "Could not delete order."} Check your CropBookingController delete endpoint.`
      );
    }
  }

  function openPayment(order) {
    const status = getPaymentStatus(order);
    const amount = getTotal(order);

    if (["PAID", "COMPLETED"].includes(status)) {
      setError("This order is already marked as paid.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("The order amount is invalid. Check the crop price and quantity.");
      return;
    }

    if (!UPI_ID || UPI_ID === "YOUR_UPI_ID@bank") {
      setError(
        "Set your actual UPI ID in MyOrders.jsx before generating a payment QR code."
      );
      return;
    }

    const upiUrl = new URL("upi://pay");
    upiUrl.searchParams.set("pa", UPI_ID);
    upiUrl.searchParams.set("pn", PAYEE_NAME);
    upiUrl.searchParams.set("am", amount.toFixed(2));
    upiUrl.searchParams.set("cu", "INR");
    upiUrl.searchParams.set(
      "tn",
      `CropConnect order ${getBookingId(order)}`
    );

    setError("");
    setPayingOrder({
      ...order,
      qrValue: upiUrl.toString(),
    });
  }

  const totalOrders = orders.length;

  const totalValue = orders.reduce(
    (sum, order) => sum + Math.max(0, getTotal(order) || 0),
    0
  );

  const paidOrders = orders.filter((order) =>
    ["PAID", "COMPLETED"].includes(getPaymentStatus(order))
  ).length;

  return (
    <main className="my-orders-page">
      <header className="my-orders-header">
        <div>
          <span className="my-orders-eyebrow">CROPCONNECT BUYER PORTAL</span>
          <h1>My Orders</h1>
          <p>
            Welcome, {buyerName}. View your crop bookings and manage payments.
          </p>
        </div>

        <button
          type="button"
          className="my-orders-refresh"
          onClick={loadOrders}
          disabled={loading}
        >
          ↻ Refresh Orders
        </button>
      </header>

      <section className="my-orders-stats">
        <article className="my-orders-stat-card">
          <span className="my-orders-stat-icon">📦</span>
          <div>
            <small>Total Orders</small>
            <strong>{totalOrders}</strong>
          </div>
        </article>

        <article className="my-orders-stat-card">
          <span className="my-orders-stat-icon">₹</span>
          <div>
            <small>Total Order Value</small>
            <strong>
              ₹{totalValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        </article>

        <article className="my-orders-stat-card">
          <span className="my-orders-stat-icon">✓</span>
          <div>
            <small>Paid Orders</small>
            <strong>{paidOrders}</strong>
          </div>
        </article>
      </section>

      {notice && (
        <div className="my-orders-notice" role="status">
          <span>✓</span>
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="my-orders-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="my-orders-state">
          <span className="my-orders-spinner" />
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <section className="my-orders-empty">
          <div>🛒</div>
          <h2>No orders found</h2>
          <p>Your crop bookings will appear here after you place an order.</p>
        </section>
      ) : (
        <section className="my-orders-list">
          {orders.map((order) => {
            const id = getBookingId(order);
            const cropName = getCropName(order);
            const quantity = getQuantity(order);
            const unitPrice = getUnitPrice(order);
            const total = getTotal(order);
            const status = getPaymentStatus(order);
            const isPaid = ["PAID", "COMPLETED"].includes(status);
            const isTerminal = [
              "PAID",
              "COMPLETED",
              "DELIVERED",
              "CANCELLED",
            ].includes(status);

            return (
              <article className="my-order-card" key={id}>
                <div className="my-order-top">
                  <div className="my-order-crop-icon">🌾</div>

                  <div className="my-order-title">
                    <h2>{cropName}</h2>
                    <span>Order #{id ?? "—"}</span>
                  </div>

                  <span
                    className={`my-order-status ${
                      isPaid
                        ? "my-order-status-paid"
                        : status === "CANCELLED"
                          ? "my-order-status-cancelled"
                          : "my-order-status-pending"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="my-order-details">
                  <div>
                    <span>Quantity</span>
                    <strong>{quantity}</strong>
                  </div>

                  <div>
                    <span>Price per unit</span>
                    <strong>
                      ₹{unitPrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>

                  <div>
                    <span>Total Amount</span>
                    <strong className="my-order-total">
                      ₹{(total || 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>

                  <div>
                    <span>Farmer</span>
                    <strong>
                      {order.farmerName ||
                        order.farmer?.fullName ||
                        order.farmer?.name ||
                        order.farmerEmail ||
                        order.farmer?.email ||
                        "Farmer"}
                    </strong>
                  </div>

                  <div>
                    <span>Order Date</span>
                    <strong>
                      {order.bookingDate || order.createdAt
                        ? String(
                            order.bookingDate || order.createdAt
                          ).slice(0, 10)
                        : "—"}
                    </strong>
                  </div>
                </div>

                {order.description && (
                  <p className="my-order-description">
                    {order.description}
                  </p>
                )}

                <div className="my-order-actions">
                  <button
                    type="button"
                    className="my-order-edit-button"
                    onClick={() => openEdit(order)}
                    disabled={isTerminal || saving}
                  >
                    ✎ Edit
                  </button>

                  <button
                    type="button"
                    className="my-order-delete-button"
                    onClick={() => deleteOrder(order)}
                    disabled={isTerminal}
                  >
                    🗑 Delete
                  </button>

                  <button
                    type="button"
                    className="my-order-pay-button"
                    onClick={() => openPayment(order)}
                    disabled={isPaid}
                  >
                    ₹ Pay Amount
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {editingOrder && (
        <div className="my-orders-overlay">
          <section
            className="my-orders-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-orders-edit-title"
          >
            <div className="my-orders-modal-header">
              <div>
                <span className="my-orders-eyebrow">ORDER MANAGEMENT</span>
                <h2 id="my-orders-edit-title">Edit Order</h2>
                <p>{getCropName(editingOrder)}</p>
              </div>

              <button
                type="button"
                className="my-orders-close"
                onClick={() => setEditingOrder(null)}
                disabled={saving}
                aria-label="Close edit form"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveEdit} className="my-orders-edit-form">
              <label>
                Quantity
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={editQuantity}
                  onChange={(event) => setEditQuantity(event.target.value)}
                  required
                />
              </label>

              <div className="my-orders-edit-total">
                <span>Updated estimated total</span>
                <strong>
                  ₹{(
                    Number(editQuantity || 0) * getUnitPrice(editingOrder)
                  ).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>

              <div className="my-orders-modal-actions">
                <button
                  type="button"
                  className="my-orders-cancel-button"
                  onClick={() => setEditingOrder(null)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="my-orders-save-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {payingOrder && (
        <div className="my-orders-overlay">
          <section
            className="my-orders-modal my-orders-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-orders-payment-title"
          >
            <div className="my-orders-modal-header">
              <div>
                <span className="my-orders-eyebrow">CROPCONNECT PAYMENTS</span>
                <h2 id="my-orders-payment-title">Pay Your Order</h2>
                <p>{getCropName(payingOrder)}</p>
              </div>

              <button
                type="button"
                className="my-orders-close"
                onClick={() => setPayingOrder(null)}
                aria-label="Close payment QR"
              >
                ×
              </button>
            </div>

            <div className="my-orders-payment-content">
              <p className="my-orders-payment-label">Amount to pay</p>

              <strong className="my-orders-payment-amount">
                ₹{getTotal(payingOrder).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>

              <div className="my-orders-qr">
                <QRCodeSVG
                  value={payingOrder.qrValue}
                  size={220}
                  level="M"
                  includeMargin
                />
              </div>

              <p className="my-orders-qr-help">
                Scan this QR code using a UPI payment app and confirm the
                amount before paying.
              </p>

              <div className="my-orders-upi-details">
                <span>UPI ID</span>
                <strong>{UPI_ID}</strong>
              </div>

              <div className="my-orders-payment-warning">
                <strong>Important:</strong> A QR scan does not confirm payment.
                After paying, the order remains pending until your backend
                verifies the transaction and updates its payment status.
              </div>

              <button
                type="button"
                className="my-orders-payment-done"
                onClick={() => setPayingOrder(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
