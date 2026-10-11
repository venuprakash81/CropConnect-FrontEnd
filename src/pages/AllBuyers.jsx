import React, { useEffect, useState } from "react";
import "./AllBuyers.css";

const API_URL = "http://localhost:8081/api/buyers";

const AllBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/all`);

      if (!response.ok) {
        throw new Error("Failed to fetch buyers");
      }

      const data = await response.json();
      setBuyers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load buyers");
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (phone) => {
    if (!phone) {
      alert("Phone number is not available");
      return;
    }

    window.location.href = `tel:${phone}`;
  };

  const handleLocation = (buyer) => {
    const lat = buyer.latitude ?? buyer.lat;
    const lng = buyer.longitude ?? buyer.lng;

    if (
      lat === null ||
      lat === undefined ||
      lng === null ||
      lng === undefined ||
      lat === "" ||
      lng === ""
    ) {
      alert("Location is not available for this buyer");
      return;
    }

    const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      `${lat},${lng}`
    )}`;

    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "B";
  };

  if (loading) {
    return (
      <div className="buyers-page">
        <div className="buyers-message">Loading buyers...</div>
      </div>
    );
  }

  return (
    <div className="buyers-page">
      <div className="buyers-header">
        <div>
          <h1>All Buyers</h1>
          <p>View registered buyers and contact them directly.</p>
        </div>

        <button className="buyers-refresh" onClick={fetchBuyers}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="buyers-error">
          {error}
          <button onClick={fetchBuyers}>Try Again</button>
        </div>
      )}

      {!error && buyers.length === 0 && (
        <div className="buyers-message">
          <h3>No buyers found</h3>
          <p>Registered buyers will appear here.</p>
        </div>
      )}

      <div className="buyers-grid">
        {buyers.map((buyer) => {
          const imageUrl = buyer.profilePhoto
            ? `${API_URL}/profile-photo/${encodeURIComponent(
                buyer.profilePhoto
              )}`
            : null;

          return (
            <div className="buyer-card" key={buyer.id}>
              <div className="buyer-card-top">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={buyer.name || "Buyer"}
                    className="buyer-avatar"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="buyer-avatar buyer-avatar-placeholder">
                    {getInitial(buyer.name)}
                  </div>
                )}

                <div className="buyer-info">
                  <h2>{buyer.name || "Unnamed Buyer"}</h2>
                  <span className="buyer-role">Registered Buyer</span>
                </div>
              </div>

              <div className="buyer-details">
                <div className="buyer-detail-row">
                  <span className="buyer-detail-label">Email</span>
                  <span className="buyer-detail-value">
                    {buyer.email || "Not available"}
                  </span>
                </div>

                <div className="buyer-detail-row">
                  <span className="buyer-detail-label">Phone</span>
                  <span className="buyer-detail-value">
                    {buyer.phone || "Not available"}
                  </span>
                </div>

                {buyer.businessName && (
                  <div className="buyer-detail-row">
                    <span className="buyer-detail-label">Business</span>
                    <span className="buyer-detail-value">
                      {buyer.businessName}
                    </span>
                  </div>
                )}
              </div>

              <div className="buyer-actions">
                <button
                  className="buyer-contact-btn"
                  onClick={() => handleContact(buyer.phone)}
                >
                  Contact
                </button>

                <button
                  className="buyer-location-btn"
                  onClick={() => handleLocation(buyer)}
                >
                  Location
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllBuyers;