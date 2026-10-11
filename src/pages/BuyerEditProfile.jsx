
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerPages.css";

const API = "http://localhost:8081/api";

function getLoggedInBuyerEmail() {
  return (
    localStorage.getItem("buyerEmail") ||
    sessionStorage.getItem("buyerEmail")
  );
}

const fields = [
  ["fullName", "Full Name", "text"],
  ["phone", "Phone Number", "tel"],
  ["alternativePhone", "Alternative Phone", "tel"],
  ["dateOfBirth", "Date of Birth", "date"],
  ["village", "Village", "text"],
  ["mandal", "Mandal", "text"],
  ["district", "District", "text"],
  ["state", "State", "text"],
  ["pincode", "Pincode", "text"],
  ["businessName", "Business Name", "text"],
  ["buyerType", "Buyer Type", "text"],
  ["businessAddress", "Business Address", "textarea"],
  ["gstNumber", "GST Number", "text"],
  ["cropInterested", "Crops Interested In", "text"],
  ["requiredQuantity", "Required Quantity", "number"],
  ["quantityUnit", "Quantity Unit", "text"],
  ["preferredPrice", "Preferred Price", "number"],
  ["latitude", "Latitude", "number"],
  ["longitude", "Longitude", "number"],
];

export default function BuyerEditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const email = getLoggedInBuyerEmail();
    let cancelled = false;

    if (!email) {
      navigate("/buyer-login", { replace: true });
      return;
    }

    async function loadBuyer() {
      try {
        const response = await fetch(
          `${API}/buyers/email/${encodeURIComponent(email)}`
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load buyer details."
          );
        }

        if (!cancelled) {
          setForm(data.buyer || data);
        }
      } catch (err) {
        if (!cancelled) {
          setMessage(err.message || "Unable to load profile.");
          setSuccess(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBuyer();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function handleChange(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage("");
    setSuccess(false);
  }

  async function handleSave(event) {
    event.preventDefault();

    const email = getLoggedInBuyerEmail();

    if (!email) {
      navigate("/buyer-login", { replace: true });
      return;
    }

    setSaving(true);
    setMessage("");
    setSuccess(false);

    try {
      const payload = {};

      fields.forEach(([key, , type]) => {
        const value = form[key];

        if (value !== undefined && value !== null && value !== "") {
          payload[key] = type === "number" ? Number(value) : value;
        }
      });

      const response = await fetch(
        `${API}/buyers/profile/${encodeURIComponent(email)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update profile."
        );
      }

      const updatedBuyer = data.buyer || data;

      setForm((previous) => ({
        ...previous,
        ...updatedBuyer,
      }));

      // Refresh the stored buyer information without storing passwords.
      const buyerForStorage = {
        ...form,
        ...payload,
        ...updatedBuyer,
      };

      delete buyerForStorage.password;
      delete buyerForStorage.aadhaarNumber;

      ["buyer", "buyerData"].forEach((key) => {
        const saved =
          localStorage.getItem(key) ||
          sessionStorage.getItem(key);

        if (saved) {
          const storage = localStorage.getItem(key)
            ? localStorage
            : sessionStorage;

          storage.setItem(key, JSON.stringify(buyerForStorage));
        }
      });

      const storage = localStorage.getItem("buyerEmail")
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "buyerName",
        buyerForStorage.fullName || ""
      );

      setSuccess(true);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setSuccess(false);
      setMessage(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="buyer-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="buyer-page">
      <main className="buyer-card">
        <div className="buyer-list-heading">
          <div>
            <h2>Edit Buyer Profile</h2>
            <p>Update your personal and business details.</p>
          </div>

          <button
            type="button"
            className="buyer-secondary"
            onClick={() => navigate("/buyer-dashboard")}
          >
            Dashboard
          </button>
        </div>

        {message && (
          <div
            className={success ? "buyer-success" : "buyer-error"}
            role="alert"
          >
            {success ? "✓ " : "⚠ "}
            {message}
          </div>
        )}

        <form className="buyer-form" onSubmit={handleSave}>
          {fields.map(([key, label, type]) => (
            <label key={key}>
              {label}

              {type === "textarea" ? (
                <textarea
                  value={form[key] ?? ""}
                  onChange={(event) =>
                    handleChange(key, event.target.value)
                  }
                  rows={3}
                />
              ) : (
                <input
                  type={type}
                  step={type === "number" ? "any" : undefined}
                  value={form[key] ?? ""}
                  onChange={(event) =>
                    handleChange(key, event.target.value)
                  }
                />
              )}
            </label>
          ))}

          <div className="buyer-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="buyer-secondary"
              onClick={() => navigate("/buyer-dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
