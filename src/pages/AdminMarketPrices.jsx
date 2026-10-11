import React, { useEffect, useState } from "react";
import "./AdminMarketPrices.css";

const API_URL = "https://cropconnect-backend-exn7.onrender.com/api/market-prices";

const emptyForm = {
  cropName: "",
  marketName: "",
  location: "",
  pricePerQuintal: "",
  priceDate: new Date().toISOString().split("T")[0],
  quality: "",
};

function AdminMarketPrices() {
  const [prices, setPrices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load market prices.");
      }

      const data = await response.json();
      setPrices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      priceDate: new Date().toISOString().split("T")[0],
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (price) => {
    setEditingId(price.id);
    setForm({
      cropName: price.cropName || "",
      marketName: price.marketName || "",
      location: price.location || "",
      pricePerQuintal: price.pricePerQuintal ?? "",
      priceDate: price.priceDate || "",
      quality: price.quality || "",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const price = Number(form.pricePerQuintal);

    if (
      !form.cropName.trim() ||
      !form.marketName.trim() ||
      !form.location.trim() ||
      !form.pricePerQuintal ||
      !form.priceDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }

    const payload = {
      cropName: form.cropName.trim(),
      marketName: form.marketName.trim(),
      location: form.location.trim(),
      pricePerQuintal: price,
      priceDate: form.priceDate,
      quality: form.quality.trim(),
    };

    setSaving(true);

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            "Could not save the market price."
        );
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);

      setSuccess(
        editingId
          ? "Market price updated successfully!"
          : "Market price added successfully!"
      );

      await fetchPrices();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this market price?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message || "Could not delete the market price."
        );
      }

      setPrices((previous) =>
        previous.filter((price) => price.id !== id)
      );
      setSuccess("Market price deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete the market price.");
    }
  };

  return (
    <div className="market-page">
      <div className="market-header">
        <div>
          <p className="market-eyebrow">ADMIN PANEL</p>
          <h1>Market Prices</h1>
          <p className="market-subtitle">
            Add, view, update, and manage crop market prices.
          </p>
        </div>

        <button className="add-market-btn" onClick={openAddModal}>
          <span className="add-icon">+</span>
          Add Market Prices
        </button>
      </div>

      {success && (
        <div className="market-alert market-success" role="status">
          {success}
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            ×
          </button>
        </div>
      )}

      {error && !showModal && (
        <div className="market-alert market-error" role="alert">
          {error}
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}

      <div className="market-summary">
        <div className="market-summary-icon">₹</div>
        <div>
          <span>Total Market Price Records</span>
          <strong>{prices.length}</strong>
        </div>
      </div>

      <div className="market-section-heading">
        <div>
          <h2>Available Market Prices</h2>
          <p>All crop prices entered by the administrator</p>
        </div>
      </div>

      {loading ? (
        <div className="market-state">
          <div className="market-spinner"></div>
          <p>Loading market prices...</p>
        </div>
      ) : prices.length === 0 ? (
        <div className="market-empty">
          <div className="empty-icon">₹</div>
          <h3>No market prices available</h3>
          <p>
            No crop market prices have been added yet. Click the button
            above to add the first market price.
          </p>
          <button className="empty-add-btn" onClick={openAddModal}>
            + Add First Market Price
          </button>
        </div>
      ) : (
        <div className="market-grid">
          {prices.map((price) => (
            <div className="market-card" key={price.id}>
              <div className="market-card-top">
                <div className="crop-avatar">
                  {(price.cropName || "C").charAt(0).toUpperCase()}
                </div>

                <span className="quality-badge">
                  {price.quality || "Quality not specified"}
                </span>
              </div>

              <h3 className="market-crop-name">
                {price.cropName || "Unnamed crop"}
              </h3>

              <div className="market-price">
                <span>₹</span>
                {Number(price.pricePerQuintal || 0).toLocaleString("en-IN")}
                <small>/ quintal</small>
              </div>

              <div className="market-details">
                <div className="market-detail-row">
                  <span className="detail-icon">⌖</span>
                  <div>
                    <small>Market</small>
                    <strong>{price.marketName || "Not specified"}</strong>
                  </div>
                </div>

                <div className="market-detail-row">
                  <span className="detail-icon">📍</span>
                  <div>
                    <small>Location</small>
                    <strong>{price.location || "Not specified"}</strong>
                  </div>
                </div>

                <div className="market-detail-row">
                  <span className="detail-icon">▦</span>
                  <div>
                    <small>Price Date</small>
                    <strong>
                      {price.priceDate
                        ? new Date(
                            `${price.priceDate}T00:00:00`
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not specified"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="market-card-actions">
                <button
                  className="market-edit-btn"
                  onClick={() => openEditModal(price)}
                >
                  ✎ Edit
                </button>

                <button
                  className="market-delete-btn"
                  onClick={() => handleDelete(price.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="market-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="market-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-modal-title"
          >
            <div className="market-modal-header">
              <div>
                <p className="market-eyebrow">MARKET MANAGEMENT</p>
                <h2 id="market-modal-title">
                  {editingId ? "Edit Market Price" : "Add Market Price"}
                </h2>
                <p>
                  Enter the crop and market price details below.
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeModal}
                type="button"
                disabled={saving}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="market-form-grid">
                <div className="market-form-group">
                  <label htmlFor="cropName">
                    Crop Name <span>*</span>
                  </label>
                  <input
                    id="cropName"
                    name="cropName"
                    type="text"
                    placeholder="e.g. Rice"
                    value={form.cropName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="market-form-group">
                  <label htmlFor="marketName">
                    Market Name <span>*</span>
                  </label>
                  <input
                    id="marketName"
                    name="marketName"
                    type="text"
                    placeholder="e.g. Guntur Market"
                    value={form.marketName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="market-form-group">
                  <label htmlFor="location">
                    Location <span>*</span>
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Guntur, Andhra Pradesh"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="market-form-group">
                  <label htmlFor="pricePerQuintal">
                    Price per Quintal (₹) <span>*</span>
                  </label>
                  <input
                    id="pricePerQuintal"
                    name="pricePerQuintal"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="e.g. 2500"
                    value={form.pricePerQuintal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="market-form-group">
                  <label htmlFor="priceDate">
                    Price Date <span>*</span>
                  </label>
                  <input
                    id="priceDate"
                    name="priceDate"
                    type="date"
                    value={form.priceDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="market-form-group">
                  <label htmlFor="quality">Quality</label>
                  <select
                    id="quality"
                    name="quality"
                    value={form.quality}
                    onChange={handleChange}
                  >
                    <option value="">Select quality</option>
                    <option value="Premium">Premium</option>
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Standard">Standard</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="market-alert market-error modal-error">
                  {error}
                </div>
              )}

              <div className="market-modal-actions">
                <button
                  type="button"
                  className="market-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="market-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Price"
                    : "Save Market Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMarketPrices;
