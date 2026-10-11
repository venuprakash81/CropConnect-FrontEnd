import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditBuyer.css";

const API_BASE = "https://cropconnect-backend-exn7.onrender.com/api";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  alternativePhone: "",
  dateOfBirth: "",
  village: "",
  mandal: "",
  district: "",
  state: "",
  pincode: "",
  businessName: "",
  buyerType: "",
  businessAddress: "",
  gstNumber: "",
  latitude: "",
  longitude: "",
  cropInterested: "",
  requiredQuantity: "",
  quantityUnit: "",
  preferredPrice: "",
};

function EditBuyer() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState(emptyForm);
  const [buyerId, setBuyerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("buyerEmail");

    if (!email) {
      setError("Please log in first.");
      setLoading(false);
      return;
    }

    const initialize = async () => {
      try {
        let buyer = location.state?.buyer;

        // Always retrieve the profile belonging to the logged-in email.
        const response = await fetch(
          `${API_BASE}/buyers/email/${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load buyer.");
        }

        buyer = data;

        if (buyer.email?.toLowerCase() !== email.toLowerCase()) {
          throw new Error("The logged-in buyer could not be verified.");
        }

        setBuyerId(buyer.id);

        const nextForm = { ...emptyForm };

        Object.keys(emptyForm).forEach((key) => {
          nextForm[key] =
            buyer[key] === null || buyer[key] === undefined
              ? ""
              : String(buyer[key]);
        });

        setForm(nextForm);
      } catch (err) {
        setError(err.message || "Unable to load buyer details.");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [location.state]);

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

    if (!buyerId) {
      setError("Buyer ID is missing. Please log in again.");
      return;
    }

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Full name, email and phone are required.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (form.alternativePhone && !/^\d{10}$/.test(form.alternativePhone)) {
      setError("Alternative phone must contain exactly 10 digits.");
      return;
    }

    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      setError("PIN code must contain exactly 6 digits.");
      return;
    }

    if (
      form.latitude !== "" &&
      (!Number.isFinite(Number(form.latitude)) ||
        Number(form.latitude) < -90 ||
        Number(form.latitude) > 90)
    ) {
      setError("Latitude must be between -90 and 90.");
      return;
    }

    if (
      form.longitude !== "" &&
      (!Number.isFinite(Number(form.longitude)) ||
        Number(form.longitude) < -180 ||
        Number(form.longitude) > 180)
    ) {
      setError("Longitude must be between -180 and 180.");
      return;
    }

    if (
      form.requiredQuantity !== "" &&
      (!Number.isFinite(Number(form.requiredQuantity)) ||
        Number(form.requiredQuantity) < 0)
    ) {
      setError("Required quantity must be a non-negative number.");
      return;
    }

    if (
      form.preferredPrice !== "" &&
      (!Number.isFinite(Number(form.preferredPrice)) ||
        Number(form.preferredPrice) < 0)
    ) {
      setError("Preferred price must be a non-negative number.");
      return;
    }

    const payload = {
      ...form,
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      requiredQuantity:
        form.requiredQuantity === "" ? null : Number(form.requiredQuantity),
      preferredPrice:
        form.preferredPrice === "" ? null : Number(form.preferredPrice),
    };

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE}/buyers/${buyerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to update buyer profile.");
      }

      setSuccess("Your profile has been updated successfully.");

      if (result.email) {
        localStorage.setItem("buyerEmail", result.email);
      }

      setTimeout(() => {
        navigate("/buyer-profile");
      }, 800);
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, name, options = {}) => (
    <label className="eb-field" key={name}>
      <span>{label}{options.required ? " *" : ""}</span>

      {options.multiline ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
          required={options.required}
          rows={3}
        />
      ) : options.select ? (
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={options.required}
        >
          <option value="">Select {label}</option>
          {options.select.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      ) : (
        <input
          type={options.type || "text"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
          required={options.required}
          maxLength={options.maxLength}
          step={options.step}
        />
      )}
    </label>
  );

  if (loading) {
    return (
      <main className="eb-page">
        <p className="eb-status">Loading buyer details...</p>
      </main>
    );
  }

  if (error && !buyerId) {
    return (
      <main className="eb-page">
        <div className="eb-status">
          <h2>Unable to open edit page</h2>
          <p>{error}</p>
          <button
            className="eb-secondary"
            onClick={() => navigate("/buyer-profile")}
          >
            Back to Profile
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="eb-page">
      <header className="eb-header">
        <div>
          <span className="eb-eyebrow">CROPCONNECT</span>
          <h1>Edit Buyer Profile</h1>
          <p>Update your personal, business and crop requirements.</p>
        </div>

        <button
          type="button"
          className="eb-secondary"
          onClick={() => navigate("/buyer-profile")}
        >
          ← Back to Profile
        </button>
      </header>

      {error && <div className="eb-alert eb-alert-error">{error}</div>}
      {success && <div className="eb-alert eb-alert-success">{success}</div>}

      <form className="eb-form" onSubmit={handleSubmit}>
        <section className="eb-section">
          <h2>Personal Information</h2>
          <div className="eb-grid">
            {field("Full Name", "fullName", { required: true })}
            {field("Email Address", "email", {
              type: "email",
              required: true,
            })}
            {field("Phone Number", "phone", {
              required: true,
              maxLength: 10,
            })}
            {field("Alternative Phone", "alternativePhone", {
              maxLength: 10,
            })}
            {field("Date of Birth", "dateOfBirth", { type: "date" })}
          </div>
        </section>

        <section className="eb-section">
          <h2>Business Information</h2>
          <div className="eb-grid">
            {field("Business Name", "businessName")}
            {field("Buyer Type", "buyerType", {
              select: ["Individual", "Retailer", "Wholesaler", "Distributor", "Processor", "Other"],
            })}
            {field("GST Number", "gstNumber")}
            {field("Business Address", "businessAddress", {
              multiline: true,
            })}
          </div>
        </section>

        <section className="eb-section">
          <h2>Address & Location</h2>
          <div className="eb-grid">
            {field("Village", "village")}
            {field("Mandal", "mandal")}
            {field("District", "district")}
            {field("State", "state")}
            {field("PIN Code", "pincode", { maxLength: 6 })}
            {field("Latitude", "latitude", { type: "number", step: "any" })}
            {field("Longitude", "longitude", { type: "number", step: "any" })}
          </div>
        </section>

        <section className="eb-section">
          <h2>Crop Requirements</h2>
          <div className="eb-grid">
            {field("Interested Crop", "cropInterested")}
            {field("Required Quantity", "requiredQuantity", {
              type: "number",
              step: "any",
            })}
            {field("Quantity Unit", "quantityUnit", {
              select: ["kg", "quintal", "tonne", "ton", "litre", "units"],
            })}
            {field("Preferred Price (₹)", "preferredPrice", {
              type: "number",
              step: "any",
            })}
          </div>
        </section>

        <div className="eb-actions">
          <button
            type="button"
            className="eb-secondary"
            onClick={() => navigate("/buyer-profile")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="eb-save"
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditBuyer;
