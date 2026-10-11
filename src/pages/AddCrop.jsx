
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCrop.css";

const API = "http://localhost:8081/api";

const EMPTY_FORM = {
  cropName: "",
  cropType: "",
  quantity: "",
  unit: "kg",
  price: "",
  harvestDate: "",
  location: "",
  description: "",
  image: null,
};

function getLoggedInFarmer() {
  try {
    const raw = localStorage.getItem("cropconnectFarmer");

    if (!raw) {
      return { email: "", id: "" };
    }

    const result = JSON.parse(raw);
    const farmer = result?.farmer || result?.user || result;

    return {
      email: String(
        farmer.farmerEmail ||
          farmer.email ||
          farmer.emailId ||
          farmer.userEmail ||
          ""
      )
        .trim()
        .toLowerCase(),

      id: String(
        farmer.farmerId ??
          farmer.id ??
          farmer.userId ??
          ""
      ),
    };
  } catch (error) {
    console.error("Unable to read farmer login details:", error);
    return { email: "", id: "" };
  }
}

function getImageUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  return `http://localhost:8081${
    path.startsWith("/") ? path : `/${path}`
  }`;
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export default function AddCrops() {
  const navigate = useNavigate();

  const [farmer] = useState(() => getLoggedInFarmer());
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successCrop, setSuccessCrop] = useState(null);

  const email = farmer.email;
  const farmerId = farmer.id;

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "image" ? files?.[0] || null : value,
    }));
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // Always read the current login response.
    const currentFarmer = getLoggedInFarmer();

    if (!currentFarmer.email) {
      setMessage(
        "Farmer email was not found in your login response. Please log in again."
      );
      return;
    }

    if (!currentFarmer.id) {
      setMessage(
        "Farmer ID is missing from the login response. Please check your farmer login API response."
      );
      return;
    }

    if (!form.cropName.trim()) {
      setMessage("Please enter the crop name.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setMessage("Quantity must be greater than zero.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setMessage("Price must be greater than zero.");
      return;
    }

    const data = new FormData();

    data.append("farmerId", currentFarmer.id);
    data.append("farmerEmail", currentFarmer.email);
    data.append("cropName", form.cropName.trim());
    data.append("cropType", form.cropType);
    data.append("quantity", form.quantity);
    data.append("unit", form.unit);
    data.append("price", form.price);
    data.append("harvestDate", form.harvestDate);
    data.append("location", form.location);
    data.append("description", form.description);

    if (form.image) {
      data.append("image", form.image);
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/crops/add`, {
        method: "POST",
        body: data,
      });

      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Failed to add crop. HTTP ${response.status}`
        );
      }

      setSuccessCrop({
        ...result,
        id: result.id ?? result.cropId ?? null,
        farmerEmail: currentFarmer.email,
        cropName: result.cropName || form.cropName.trim(),
        cropType: result.cropType || form.cropType,
        quantity: result.quantity ?? Number(form.quantity),
        unit: result.unit || form.unit,
        price: result.price ?? Number(form.price),
        harvestDate: result.harvestDate || form.harvestDate,
        location: result.location || form.location,
        description: result.description || form.description,
        imageUrl:
          result.imageUrl ||
          result.imagePath ||
          result.image ||
          "",
      });

      setForm({ ...EMPTY_FORM });
      setMessage("");
    } catch (error) {
      console.error("Add crop error:", error);

      if (
        error instanceof TypeError &&
        /fetch/i.test(error.message)
      ) {
        setMessage(
          "Cannot connect to the backend. Make sure Spring Boot is running on port 8081."
        );
      } else {
        setMessage(error.message || "Unable to add crop.");
      }
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = getImageUrl(successCrop?.imageUrl);

  return (
    <main className="ag-page">
      <header className="ag-header">
        <div>
          <p className="ag-eyebrow">FARMER DASHBOARD</p>
          <h1>Add New Crop</h1>
          <p>
            Enter your crop details to make them available to buyers.
          </p>
        </div>
      </header>

      <section className="ag-panel">
        <h2>Crop Information</h2>

        <div className="ag-message">
          Logged-in farmer:{" "}
          <strong>{email || "Not logged in"}</strong>
        </div>

        {message && (
          <div className="ag-message" role="alert">
            {message}
          </div>
        )}

        <form className="ag-form" onSubmit={handleSubmit}>
          <label>
            Crop Name *
            <input
              name="cropName"
              value={form.cropName}
              onChange={handleChange}
              placeholder="Enter crop name"
              required
            />
          </label>

          <label>
            Crop Type
            <input
              name="cropType"
              value={form.cropType}
              onChange={handleChange}
              placeholder="Vegetable, grain, fruit..."
            />
          </label>

          <label>
            Available Quantity *
            <input
              type="number"
              name="quantity"
              min="0.01"
              step="any"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Unit
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="quintal">Quintal</option>
              <option value="ton">Tonnes</option>
              <option value="piece">Pieces</option>
              <option value="bag">Bags</option>
            </select>
          </label>

          <label>
            Price Per Unit (₹) *
            <input
              type="number"
              name="price"
              min="0.01"
              step="any"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Harvest Date
            <input
              type="date"
              name="harvestDate"
              value={form.harvestDate}
              onChange={handleChange}
            />
          </label>

          <label className="ag-full">
            Location
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Village, district, state"
            />
          </label>

          <label className="ag-full">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter details about your crop"
            />
          </label>

          <label className="ag-full">
            Crop Image
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange}
            />
          </label>

          {form.image && (
            <div className="ag-full">
              <p>Selected image: {form.image.name}</p>
              <img
                src={URL.createObjectURL(form.image)}
                alt="Crop preview"
                style={{
                  width: "160px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </div>
          )}

          <div className="ag-actions ag-full">
            <button
              type="submit"
              className="ag-btn ag-primary"
              disabled={loading}
            >
              {loading ? "Saving Crop..." : "Submit Crop Details"}
            </button>

            <button
              type="button"
              className="ag-btn ag-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </section>

      {successCrop && (
        <div className="ac-overlay">
          <section
            className="ac-modal ac-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-success-title"
          >
            <div className="ac-success-icon">✓</div>

            <p className="ac-eyebrow">CROP REGISTRATION</p>
            <h2 id="crop-success-title">
              Crop Added Successfully!
            </h2>

            <p className="ac-success-subtitle">
              Your crop details have been saved successfully.
            </p>

            {imageUrl && (
              <img
                src={imageUrl}
                alt={successCrop.cropName}
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              />
            )}

            <div className="ac-confirmation-details">
              <div>
                <span>Crop ID</span>
                <strong>{successCrop.id ?? "Saved"}</strong>
              </div>

              <div>
                <span>Farmer Email</span>
                <strong>{successCrop.farmerEmail}</strong>
              </div>

              <div>
                <span>Crop Name</span>
                <strong>{successCrop.cropName}</strong>
              </div>

              <div>
                <span>Crop Type</span>
                <strong>{successCrop.cropType || "Not provided"}</strong>
              </div>

              <div>
                <span>Quantity</span>
                <strong>
                  {successCrop.quantity} {successCrop.unit}
                </strong>
              </div>

              <div>
                <span>Price Per Unit</span>
                <strong>
                  ₹{Number(successCrop.price).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Harvest Date</span>
                <strong>
                  {successCrop.harvestDate || "Not provided"}
                </strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {successCrop.location || "Not provided"}
                </strong>
              </div>

              <div>
                <span>Description</span>
                <strong>
                  {successCrop.description || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="ac-modal-buttons">
              <button
                type="button"
                className="ac-button ac-green"
                onClick={() => {
                  setSuccessCrop(null);
                  navigate("/farmer-crops");
                }}
              >
                View My Crops
              </button>

              <button
                type="button"
                className="ac-button ac-outline"
                onClick={() => {
                  setSuccessCrop(null);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Add Another Crop
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
