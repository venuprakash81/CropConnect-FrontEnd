import React, { useEffect, useState } from "react";
import "./MarketPrices.css";

const API_URL = "http://localhost:8081/api/market-prices";

const initialForm = {
  cropName: "",
  marketName: "",
  location: "",
  pricePerQuintal: "",
  priceDate: new Date().toISOString().split("T")[0],
  quality: "",
};

const getCropEmoji = (cropName = "") => {
  const crop = cropName.toLowerCase();

  if (crop.includes("rice") || crop.includes("paddy")) return "🌾";
  if (crop.includes("wheat")) return "🌾";
  if (crop.includes("tomato")) return "🍅";
  if (crop.includes("potato")) return "🥔";
  if (crop.includes("onion")) return "🧅";
  if (crop.includes("maize") || crop.includes("corn")) return "🌽";
  if (crop.includes("chilli") || crop.includes("chili")) return "🌶️";
  if (crop.includes("cotton")) return "☁️";
  if (crop.includes("mango")) return "🥭";
  if (crop.includes("banana")) return "🍌";
  if (crop.includes("grape")) return "🍇";
  if (crop.includes("apple")) return "🍎";
  if (crop.includes("orange")) return "🍊";
  if (crop.includes("groundnut") || crop.includes("peanut")) return "🥜";
  if (crop.includes("sugarcane")) return "🎋";
  if (crop.includes("soybean")) return "🫘";

  return "🌱";
};

export default function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load market prices.");
      }

      const data = await response.json();
      setPrices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setForm({
      ...initialForm,
      priceDate: new Date().toISOString().split("T")[0],
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

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

    const amount = Number(form.pricePerQuintal);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }

    const payload = {
      cropName: form.cropName.trim(),
      marketName: form.marketName.trim(),
      location: form.location.trim(),
      pricePerQuintal: amount,
      priceDate: form.priceDate,
      quality: form.quality.trim(),
    };

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || "Could not add market price."
        );
      }

      setShowModal(false);
      setForm(initialForm);
      setSuccess("Market price added successfully!");
      await loadPrices();
    } catch (err) {
      setError(err.message || "Unable to save market price.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="market-prices-page">
      <header className="market-prices-header">
        <div>
          <span className="market-label">🌿 FARMER MARKET</span>
          <h1>Market Prices</h1>
          <p>Explore the latest crop prices from different markets.</p>
        </div>

        
      </header>

      {success && (
        <div className="market-success-message">
          ✅ {success}
          <button onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      <section className="market-prices-content">
        <div className="market-results-heading">
          <div>
            <h2>🌾 Available Crop Prices</h2>
            <p>
              {prices.length} {prices.length === 1 ? "record" : "records"} found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="market-message">
            <div className="market-loader"></div>
            <p>Loading market prices...</p>
          </div>
        ) : error ? (
          <div className="market-message market-error-box">
            <span>⚠️</span>
            <h3>Unable to load prices</h3>
            <p>{error}</p>
            <button onClick={loadPrices}>Try Again</button>
          </div>
        ) : prices.length === 0 ? (
          <div className="market-message market-empty-box">
            <div className="market-empty-emoji">🌱</div>
            <h3>No market prices available</h3>
            <p>
              There are no crop prices to display yet. Add a market price
              to get started.
            </p>
            <button onClick={openModal}>＋ Add Market Price</button>
          </div>
        ) : (
          <div className="market-prices-grid">
            {prices.map((item) => (
              <article className="market-price-card" key={item.id}>
                <div className="market-card-top">
                  <div className="market-crop-emoji">
                    {getCropEmoji(item.cropName)}
                  </div>
                  <span className="market-quality">
                    {item.quality || "Standard"}
                  </span>
                </div>

                <h3 className="market-crop-title">
                  {item.cropName || "Crop"}
                </h3>

                <div className="market-price-value">
                  <span>₹</span>
                  {Number(item.pricePerQuintal || 0).toLocaleString("en-IN")}
                  <small>/ quintal</small>
                </div>

                <div className="market-card-divider"></div>

                <div className="market-card-info">
                  <div className="market-info-row">
                    <span>🏪</span>
                    <div>
                      <small>Market</small>
                      <strong>{item.marketName || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="market-info-row">
                    <span>📍</span>
                    <div>
                      <small>Location</small>
                      <strong>{item.location || "Not specified"}</strong>
                    </div>
                  </div>

                  <div className="market-info-row">
                    <span>📅</span>
                    <div>
                      <small>Price date</small>
                      <strong>{formatDate(item.priceDate)}</strong>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div
          className="market-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className="market-price-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="market-modal-title"
          >
            <div className="market-modal-heading">
              <div>
                <span>🌱 MARKET MANAGEMENT</span>
                <h2 id="market-modal-title">Add Market Price</h2>
                <p>Enter the crop price details.</p>
              </div>

              <button
                type="button"
                className="market-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="market-input-grid">
                <div className="market-input-group">
                  <label htmlFor="cropName">Crop Name *</label>
                  <input
                    id="cropName"
                    name="cropName"
                    value={form.cropName}
                    onChange={handleChange}
                    placeholder="e.g. Rice"
                    required
                  />
                </div>

                <div className="market-input-group">
                  <label htmlFor="marketName">Market Name *</label>
                  <input
                    id="marketName"
                    name="marketName"
                    value={form.marketName}
                    onChange={handleChange}
                    placeholder="e.g. Guntur Market"
                    required
                  />
                </div>

                <div className="market-input-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Guntur, Andhra Pradesh"
                    required
                  />
                </div>

                <div className="market-input-group">
                  <label htmlFor="pricePerQuintal">
                    Price per Quintal (₹) *
                  </label>
                  <input
                    id="pricePerQuintal"
                    name="pricePerQuintal"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.pricePerQuintal}
                    onChange={handleChange}
                    placeholder="e.g. 2500"
                    required
                  />
                </div>

                <div className="market-input-group">
                  <label htmlFor="priceDate">Price Date *</label>
                  <input
                    id="priceDate"
                    name="priceDate"
                    type="date"
                    value={form.priceDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="market-input-group">
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
                <div className="market-form-error">
                  ⚠️ {error}
                </div>
              )}

              <div className="market-modal-actions">
                <button
                  type="button"
                  className="market-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="market-save-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "💾 Save Market Price"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}