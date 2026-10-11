import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FarmerCrops.css";

const API = "https://cropconnect-backend-exn7.onrender.com/api";
const SERVER = "https://cropconnect-backend-exn7.onrender.com";

const INITIAL_FORM = {
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

// Read the logged-in farmer from localStorage or sessionStorage.
function getLoggedInFarmer() {
    const storages = [localStorage, sessionStorage];

    const objectKeys = [
        "cropconnectFarmer",
        "farmer",
        "farmerData",
        "farmerUser",
        "user",
        "buyer",
    ];

    for (const storage of storages) {
        for (const key of objectKeys) {
            try {
                const raw = storage.getItem(key);
                if (!raw) continue;

                const user = JSON.parse(raw);
                if (!user || typeof user !== "object") continue;

                const email =
                    user.farmerEmail ||
                    user.email ||
                    user.emailId ||
                    user.userEmail;

                if (email) {
                    return {
                        email: String(email).trim(),
                        id:
                            user.farmerId ??
                            user.id ??
                            user.userId ??
                            null,
                    };
                }
            } catch {
                // Continue checking other stored login details.
            }
        }
    }

    let email = "";
    let id = null;

    for (const storage of storages) {
        email =
            storage.getItem("farmerEmail") ||
            storage.getItem("farmerLoginEmail") ||
            storage.getItem("loggedInFarmerEmail") ||
            "";

        id =
            storage.getItem("farmerId") ||
            storage.getItem("loggedInFarmerId");

        if (email) break;
    }

    return {
        email: email.trim(),
        id,
    };
}

function FarmerCrops() {
    const navigate = useNavigate();

    const [farmer] = useState(() => getLoggedInFarmer());

    const farmerEmail = farmer.email;
    const farmerId = farmer.id;

    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingCrop, setEditingCrop] = useState(null);
    const [editForm, setEditForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Load crops for this farmer's email only.
    const loadCrops = useCallback(async () => {
        if (!farmerEmail) {
            setCrops([]);
            setError(
                "Farmer login email not found. Please log in again."
            );
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API}/crops/farmer/email/${encodeURIComponent(
                    farmerEmail
                )}`
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                        `Unable to load crops (${response.status}).`
                );
            }

            const data = await response.json();

            setCrops(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Farmer crops error:", err);

            setError(
                err.message || "Unable to load your crops."
            );
        } finally {
            setLoading(false);
        }
    }, [farmerEmail]);

    useEffect(() => {
        loadCrops();
    }, [loadCrops]);

    // Convert a stored image path into a URL.
    const getImageUrl = (crop) => {
        const imagePath =
            crop.imageUrl ||
            crop.image ||
            crop.imagePath;

        if (
            !imagePath ||
            typeof imagePath !== "string"
        ) {
            return "";
        }

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        const path = imagePath.startsWith("/")
            ? imagePath
            : `/${imagePath}`;

        return `${SERVER}${path}`;
    };

    // Open the edit popup.
    const openEdit = (crop) => {
        setEditingCrop(crop);

        setEditForm({
            cropName: crop.cropName || "",
            cropType: crop.cropType || "",
            quantity: crop.quantity ?? "",
            unit:
                crop.unit ||
                crop.quantityUnit ||
                "kg",
            price:
                crop.price ??
                crop.expectedPrice ??
                "",
            harvestDate: crop.harvestDate
                ? String(crop.harvestDate).slice(0, 10)
                : "",
            location: crop.location || "",
            description: crop.description || "",
            image: null,
        });
    };

    // Close the edit popup.
    const closeEdit = () => {
        if (saving) return;

        setEditingCrop(null);
        setEditForm(INITIAL_FORM);
    };

    // Update form fields.
    const handleEditChange = (event) => {
        const { name, value, files } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]:
                name === "image"
                    ? files?.[0] || null
                    : value,
        }));
    };

    // Save crop updates.
    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editingCrop) return;

        if (!farmerEmail) {
            alert("Farmer email not found. Please log in again.");
            return;
        }

        if (
            !editForm.cropName.trim() ||
            editForm.quantity === "" ||
            !Number.isFinite(Number(editForm.quantity)) ||
            Number(editForm.quantity) <= 0 ||
            editForm.price === "" ||
            !Number.isFinite(Number(editForm.price)) ||
            Number(editForm.price) < 0
        ) {
            alert(
                "Enter a crop name, positive quantity, and valid price."
            );
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            if (farmerId != null) {
                formData.append("farmerId", farmerId);
            }

            formData.append("farmerEmail", farmerEmail);
            formData.append(
                "cropName",
                editForm.cropName.trim()
            );
            formData.append("cropType", editForm.cropType);
            formData.append("quantity", editForm.quantity);
            formData.append("unit", editForm.unit);
            formData.append("price", editForm.price);
            formData.append(
                "harvestDate",
                editForm.harvestDate
            );
            formData.append("location", editForm.location);
            formData.append(
                "description",
                editForm.description
            );

            if (editForm.image) {
                formData.append("image", editForm.image);
            }

            const response = await fetch(
                `${API}/crops/update/${editingCrop.id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                        `Crop update failed (${response.status}).`
                );
            }

            setEditingCrop(null);
            setEditForm(INITIAL_FORM);

            await loadCrops();

            alert("Crop updated successfully!");
        } catch (err) {
            console.error("Crop update error:", err);

            alert(
                err.message || "Unable to update crop."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete a crop.
    const handleDelete = async (crop) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${
                crop.cropName || "this crop"
            }"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(crop.id);
            setError("");

            const response = await fetch(
                `${API}/crops/${crop.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const message = await response.text();

                throw new Error(
                    message ||
                        `Crop deletion failed (${response.status}).`
                );
            }

            setCrops((previous) =>
                previous.filter(
                    (item) =>
                        String(item.id) !== String(crop.id)
                )
            );

            alert("Crop deleted successfully!");
        } catch (err) {
            console.error("Crop delete error:", err);

            alert(
                err.message || "Unable to delete crop."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="farmer-crops-page">
            {/* Header */}
            <header className="fc-header">
                <div className="fc-brand">
                    <div className="fc-brand-icon">🌱</div>

                    <div>
                        <h1>My Crops</h1>
                        <p>Manage your farm products</p>
                    </div>
                </div>

                <div className="fc-header-actions">
                    <button
                        type="button"
                        className="fc-dashboard-link"
                        onClick={() =>
                            navigate("/farmer-dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <button
                        type="button"
                        className="fc-add-button"
                        onClick={() => navigate("/add-crop")}
                    >
                        <span className="fc-add-symbol">＋</span>
                        Add Crop
                    </button>
                </div>
            </header>

            {/* Farmer account */}
            <section className="fc-summary">
                <div className="fc-summary-icon">🌾</div>

                <div className="fc-summary-text">
                    <span>Total Crops</span>
                    <strong>{crops.length}</strong>
                </div>

                <div className="fc-summary-note">
                    {farmerEmail || "Farmer email unavailable"}
                </div>
            </section>

            {/* Section heading */}
            <div className="fc-section-heading">
                <div>
                    <h2>All Your Crops</h2>
                    <p>
                        View, edit, and manage your crop listings.
                    </p>
                </div>

                <span className="fc-count">
                    {crops.length}{" "}
                    {crops.length === 1 ? "crop" : "crops"}
                </span>
            </div>

            {/* Loading */}
            {loading && (
                <div className="fc-state">
                    <div className="fc-spinner" />
                    <p>Loading your crops...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="fc-state fc-error">
                    <div className="fc-state-icon">⚠️</div>

                    <h3>Unable to load crops</h3>
                    <p>{error}</p>

                    <button
                        type="button"
                        className="fc-retry-button"
                        onClick={loadCrops}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* No crops */}
            {!loading &&
                !error &&
                crops.length === 0 && (
                    <div className="fc-empty">
                        <div className="fc-empty-icon">
                            🌱
                        </div>

                        <h2>No crops added yet</h2>

                        <p>
                            Add your first crop to start managing
                            your farm products.
                        </p>

                        <button
                            type="button"
                            className="fc-add-button"
                            onClick={() =>
                                navigate("/add-crop")
                            }
                        >
                            ＋ Add Your First Crop
                        </button>
                    </div>
                )}

            {/* Crop cards */}
            {!loading &&
                !error &&
                crops.length > 0 && (
                    <section className="fc-grid">
                        {crops.map((crop) => {
                            const imageUrl = getImageUrl(crop);

                            const unit =
                                crop.unit ||
                                crop.quantityUnit ||
                                "";

                            const price =
                                crop.price ??
                                crop.expectedPrice;

                            return (
                                <article
                                    className="fc-card"
                                    key={crop.id}
                                >
                                    <div className="fc-image-wrap">
                                        {imageUrl && (
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    crop.cropName ||
                                                    "Crop"
                                                }
                                                className="fc-crop-image"
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";

                                                    event.currentTarget.nextElementSibling?.classList.add(
                                                        "fc-fallback-visible"
                                                    );
                                                }}
                                            />
                                        )}

                                        <div
                                            className={`fc-image-fallback ${
                                                imageUrl
                                                    ? ""
                                                    : "fc-fallback-visible"
                                            }`}
                                        >
                                            🌿
                                        </div>

                                        <span className="fc-crop-number">
                                            #{crop.id}
                                        </span>
                                    </div>

                                    <div className="fc-card-content">
                                        <div className="fc-card-title">
                                            <h3>
                                                {crop.cropName ||
                                                    "Unnamed Crop"}
                                            </h3>

                                            <span className="fc-status-badge">
                                                My Crop
                                            </span>
                                        </div>

                                        {crop.cropType && (
                                            <p className="fc-type">
                                                {crop.cropType}
                                            </p>
                                        )}

                                        <div className="fc-details-grid">
                                            <div className="fc-detail-box">
                                                <span>
                                                    Quantity
                                                </span>

                                                <strong>
                                                    {crop.quantity ??
                                                        "—"}{" "}
                                                    {unit}
                                                </strong>
                                            </div>

                                            <div className="fc-detail-box">
                                                <span>Price</span>

                                                <strong>
                                                    {price != null
                                                        ? `₹${price}`
                                                        : "—"}
                                                    {unit
                                                        ? `/${unit}`
                                                        : ""}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="fc-extra-details">
                                            <p>
                                                <span>
                                                    Harvest
                                                </span>

                                                <strong>
                                                    {crop.harvestDate ||
                                                        "Not specified"}
                                                </strong>
                                            </p>

                                            <p>
                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {crop.location ||
                                                        "Not specified"}
                                                </strong>
                                            </p>
                                        </div>

                                        {crop.description && (
                                            <p className="fc-description">
                                                {crop.description}
                                            </p>
                                        )}

                                        {/* Edit and Delete */}
                                        <div className="fc-card-actions">
                                            <button
                                                type="button"
                                                className="fc-edit-button"
                                                onClick={() =>
                                                    openEdit(crop)
                                                }
                                            >
                                                ✎ Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="fc-delete-button"
                                                disabled={
                                                    deletingId ===
                                                    crop.id
                                                }
                                                onClick={() =>
                                                    handleDelete(crop)
                                                }
                                            >
                                                {deletingId === crop.id
                                                    ? "Deleting..."
                                                    : "🗑 Delete"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

            {/* Edit popup */}
            {editingCrop && (
                <div
                    className="fc-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget
                        ) {
                            closeEdit();
                        }
                    }}
                >
                    <section
                        className="fc-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="fc-modal-title"
                    >
                        <div className="fc-modal-header">
                            <div>
                                <span className="fc-modal-eyebrow">
                                    MANAGE YOUR PRODUCT
                                </span>

                                <h2 id="fc-modal-title">
                                    Edit Crop
                                </h2>

                                <p>
                                    Update the information for{" "}
                                    {editingCrop.cropName ||
                                        "your crop"}
                                    .
                                </p>
                            </div>

                            <button
                                type="button"
                                className="fc-close-button"
                                onClick={closeEdit}
                                disabled={saving}
                                aria-label="Close edit window"
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="fc-edit-form"
                            onSubmit={handleUpdate}
                        >
                            <div className="fc-form-grid">
                                <label className="fc-field">
                                    <span>Crop Name *</span>

                                    <input
                                        type="text"
                                        name="cropName"
                                        value={editForm.cropName}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </label>

                                <label className="fc-field">
                                    <span>Crop Type</span>

                                    <input
                                        type="text"
                                        name="cropType"
                                        value={editForm.cropType}
                                        onChange={handleEditChange}
                                    />
                                </label>

                                <label className="fc-field">
                                    <span>Quantity *</span>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0.01"
                                        step="any"
                                        value={editForm.quantity}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </label>

                                <label className="fc-field">
                                    <span>Unit</span>

                                    <select
                                        name="unit"
                                        value={editForm.unit}
                                        onChange={handleEditChange}
                                    >
                                        <option value="kg">
                                            Kilograms (kg)
                                        </option>
                                        <option value="quintal">
                                            Quintal
                                        </option>
                                        <option value="ton">
                                            Ton
                                        </option>
                                        <option value="gram">
                                            Gram
                                        </option>
                                        <option value="piece">
                                            Piece
                                        </option>
                                    </select>
                                </label>

                                <label className="fc-field">
                                    <span>Price per Unit (₹) *</span>

                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="any"
                                        value={editForm.price}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </label>

                                <label className="fc-field">
                                    <span>Harvest Date</span>

                                    <input
                                        type="date"
                                        name="harvestDate"
                                        value={editForm.harvestDate}
                                        onChange={handleEditChange}
                                    />
                                </label>

                                <label className="fc-field fc-full-width">
                                    <span>Location</span>

                                    <input
                                        type="text"
                                        name="location"
                                        value={editForm.location}
                                        onChange={handleEditChange}
                                        placeholder="Enter farm location"
                                    />
                                </label>

                                <label className="fc-field fc-full-width">
                                    <span>Description</span>

                                    <textarea
                                        name="description"
                                        rows="3"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        placeholder="Describe your crop..."
                                    />
                                </label>

                                <label className="fc-field fc-full-width">
                                    <span>
                                        Replace Crop Image (Optional)
                                    </span>

                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleEditChange}
                                    />

                                    <small>
                                        Leave empty to keep the existing
                                        image.
                                    </small>
                                </label>
                            </div>

                            <div className="fc-modal-actions">
                                <button
                                    type="button"
                                    className="fc-cancel-button"
                                    onClick={closeEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="fc-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving Changes..."
                                        : "✓ Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </main>
    );
}

export default FarmerCrops;
