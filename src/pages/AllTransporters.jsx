import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  MapPin,
  Truck,
  IndianRupee,
  Clock,
  Navigation,
  FileText,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ShieldCheck,
  Fuel,
  Package,
  Route,
  RefreshCw,
} from "lucide-react";

import "./AllTransporters.css";

const API = "http://localhost:8081/api";

function AllTransporters() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadTransporter();
    } else {
      setError("Transporter ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const loadTransporter = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/transporters/${id}`);

      if (!response.ok) {
        throw new Error(
          `Failed to load transporter. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Transporter details:", data);

      setTransporter(data);
    } catch (err) {
      console.error("Transporter loading error:", err);
      setError(
        err.message || "Unable to load transporter details."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "null" ||
      value === "undefined"
    ) {
      return "Not provided";
    }

    return value;
  };

  const displayBoolean = (value) => {
    if (
      value === true ||
      value === "true" ||
      value === "TRUE" ||
      value === "Yes" ||
      value === "YES" ||
      value === 1
    ) {
      return "Yes";
    }

    if (
      value === false ||
      value === "false" ||
      value === "FALSE" ||
      value === "No" ||
      value === "NO" ||
      value === 0
    ) {
      return "No";
    }

    return "Not provided";
  };

  const getProfilePhoto = () => {
    if (!transporter?.profilePhoto) {
      return null;
    }

    return `${API}/transporters/profile-photo/${encodeURIComponent(
      transporter.profilePhoto
    )}`;
  };

  const openGoogleMaps = () => {
    const latitude = transporter?.latitude;
    const longitude = transporter?.longitude;

    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined
    ) {
      alert("Transporter location is not available.");
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const getDocumentUrl = (fileName) => {
    if (!fileName) {
      return null;
    }

    return `${API}/transporters/documents/${encodeURIComponent(
      fileName
    )}`;
  };

  if (loading) {
    return (
      <div className="all-transporters-loading">
        <div className="loading-spinner"></div>
        <h3>Loading transporter details...</h3>
        <p>Please wait.</p>
      </div>
    );
  }

  if (error || !transporter) {
    return (
      <div className="all-transporters-error">
        <div className="error-card">
          <div className="error-icon">
            <Truck size={40} />
          </div>

          <h2>Transporter Not Found</h2>

          <p>
            {error ||
              "The requested transporter details could not be found."}
          </p>

          <div className="error-buttons">
            <button
              className="back-main-button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <button
              className="retry-button"
              onClick={loadTransporter}
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const profilePhoto = getProfilePhoto();

  return (
    <div className="all-transporters-page">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="transporter-top-header">

        <div className="top-header-inner">

          <button
            className="top-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <div className="page-title-area">
            <div className="page-title-icon">
              <Truck size={25} />
            </div>

            <div>
              <h1>Transporter Details</h1>
              <p>
                Complete information about the registered transporter
              </p>
            </div>
          </div>

          <button
            className="refresh-button"
            onClick={loadTransporter}
            title="Refresh"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>
      </header>


      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <main className="transporter-main">

        <section className="profile-card">

          <div className="profile-left">

            <div className="profile-image-wrapper">

              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={displayValue(transporter.fullName)}
                  className="transporter-profile-image"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}

              <div
                className="profile-image-placeholder"
                style={{
                  display: profilePhoto ? "none" : "flex",
                }}
              >
                <User size={55} />
              </div>

            </div>

            <div className="profile-main-info">

              <div className="profile-name-row">

                <h2>
                  {displayValue(transporter.fullName)}
                </h2>

                <span
                  className={
                    transporter.currentlyAvailable
                      ? "status-badge available"
                      : "status-badge unavailable"
                  }
                >
                  <span className="status-dot"></span>

                  {transporter.currentlyAvailable
                    ? "Available"
                    : "Unavailable"}
                </span>

              </div>

              <p className="profile-transporter-type">
                {displayValue(transporter.transporterType)}
              </p>

              <div className="profile-contact">

                <span>
                  <Phone size={16} />
                  {displayValue(transporter.phone)}
                </span>

                <span>
                  <Mail size={16} />
                  {displayValue(transporter.email)}
                </span>

              </div>

              <div className="profile-id">
                Transporter ID:{" "}
                <strong>{displayValue(transporter.id)}</strong>
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<User size={21} />}
            title="Personal Information"
            description="Personal and identification details"
          />

          <div className="details-grid">

            <Detail
              icon={<User size={16} />}
              label="Full Name"
              value={transporter.fullName}
            />

            <Detail
              icon={<Mail size={16} />}
              label="Email"
              value={transporter.email}
            />

            <Detail
              icon={<Phone size={16} />}
              label="Phone"
              value={transporter.phone}
            />

            <Detail
              icon={<Phone size={16} />}
              label="Alternative Phone"
              value={transporter.alternativePhone}
            />

            <Detail
              icon={<Calendar size={16} />}
              label="Date of Birth"
              value={transporter.dateOfBirth}
            />

            <Detail
              icon={<CreditCard size={16} />}
              label="Aadhaar Number"
              value={transporter.aadhaarNumber}
            />

            <Detail
              icon={<CreditCard size={16} />}
              label="Driving Licence Number"
              value={transporter.drivingLicenceNumber}
            />

          </div>

        </section>


        {/* =====================================================
            BUSINESS INFORMATION
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<Building2 size={21} />}
            title="Business Information"
            description="Transport business registration details"
          />

          <div className="details-grid">

            <Detail
              label="Business Name"
              value={transporter.businessName}
            />

            <Detail
              label="Transporter Type"
              value={transporter.transporterType}
            />

            <Detail
              label="GST Number"
              value={transporter.gstNumber}
            />

            <Detail
              label="Years of Experience"
              value={
                transporter.yearsOfExperience !== null &&
                transporter.yearsOfExperience !== undefined &&
                transporter.yearsOfExperience !== ""
                  ? `${transporter.yearsOfExperience} years`
                  : null
              }
            />

            <Detail
              label="Business Address"
              value={transporter.businessAddress}
              full
            />

          </div>

        </section>


        {/* =====================================================
            ADDRESS
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<MapPin size={21} />}
            title="Address"
            description="Registered transporter address"
          />

          <div className="details-grid">

            <Detail
              label="Village"
              value={transporter.village}
            />

            <Detail
              label="Mandal"
              value={transporter.mandal}
            />

            <Detail
              label="District"
              value={transporter.district}
            />

            <Detail
              label="State"
              value={transporter.state}
            />

            <Detail
              label="Pincode"
              value={transporter.pincode}
            />

          </div>

        </section>


        {/* =====================================================
            VEHICLE INFORMATION
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<Truck size={21} />}
            title="Vehicle Information"
            description="Vehicle registration and capacity details"
          />

          <div className="details-grid">

            <Detail
              icon={<Truck size={16} />}
              label="Vehicle Number"
              value={transporter.vehicleNumber}
            />

            <Detail
              label="Vehicle Type"
              value={transporter.vehicleType}
            />

            <Detail
              label="Vehicle Model"
              value={transporter.vehicleModel}
            />

            <Detail
              label="Vehicle Capacity"
              value={
                transporter.vehicleCapacity !== null &&
                transporter.vehicleCapacity !== undefined
                  ? `${transporter.vehicleCapacity} ${
                      transporter.capacityUnit || ""
                    }`
                  : null
              }
            />

            <Detail
              label="Vehicle Ownership"
              value={transporter.vehicleOwnership}
            />

            <Detail
              icon={<Fuel size={16} />}
              label="Fuel Type"
              value={transporter.fuelType}
            />

            <Detail
              icon={<ShieldCheck size={16} />}
              label="Cold Storage Available"
              value={displayBoolean(
                transporter.coldStorageAvailable
              )}
            />

            <Detail
              icon={<Package size={16} />}
              label="Perishable Goods Supported"
              value={displayBoolean(
                transporter.perishableGoodsSupported
              )}
            />

          </div>

        </section>


        {/* =====================================================
            PRICING
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<IndianRupee size={21} />}
            title="Pricing Information"
            description="Transportation charges"
          />

          <div className="details-grid">

            <Detail
              label="Base Charge"
              value={
                transporter.baseCharge !== null &&
                transporter.baseCharge !== undefined
                  ? `₹ ${transporter.baseCharge}`
                  : null
              }
            />

            <Detail
              label="Price Per KM"
              value={
                transporter.pricePerKm !== null &&
                transporter.pricePerKm !== undefined
                  ? `₹ ${transporter.pricePerKm}`
                  : null
              }
            />

            <Detail
              label="Price Per Quintal"
              value={
                transporter.pricePerQuintal !== null &&
                transporter.pricePerQuintal !== undefined
                  ? `₹ ${transporter.pricePerQuintal}`
                  : null
              }
            />

            <Detail
              label="Minimum Trip Charge"
              value={
                transporter.minimumTripCharge !== null &&
                transporter.minimumTripCharge !== undefined
                  ? `₹ ${transporter.minimumTripCharge}`
                  : null
              }
            />

          </div>

        </section>


        {/* =====================================================
            AVAILABILITY
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<Clock size={21} />}
            title="Availability"
            description="Working schedule and travel limits"
          />

          <div className="details-grid">

            <Detail
              label="Available Days"
              value={transporter.availableDays}
            />

            <Detail
              label="Available Time"
              value={transporter.availableTime}
            />

            <Detail
              icon={<Route size={16} />}
              label="Maximum Travel Distance"
              value={
                transporter.maximumTravelDistance !== null &&
                transporter.maximumTravelDistance !== undefined
                  ? `${transporter.maximumTravelDistance} km`
                  : null
              }
            />

            <Detail
              label="Currently Available"
              value={displayBoolean(
                transporter.currentlyAvailable
              )}
            />

          </div>

        </section>


        {/* =====================================================
            LOCATION
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<Navigation size={21} />}
            title="Live Location"
            description="Registered GPS coordinates"
          />

          <div className="location-container">

            <div className="coordinate-card">

              <span>Latitude</span>

              <strong>
                {displayValue(transporter.latitude)}
              </strong>

            </div>

            <div className="coordinate-card">

              <span>Longitude</span>

              <strong>
                {displayValue(transporter.longitude)}
              </strong>

            </div>

            <button
              className="google-map-button"
              onClick={openGoogleMaps}
            >
              <MapPin size={18} />
              Open in Google Maps
            </button>

          </div>

        </section>


        {/* =====================================================
            DOCUMENTS
        ===================================================== */}

        <section className="information-section">

          <SectionHeader
            icon={<FileText size={21} />}
            title="Documents"
            description="Uploaded transporter verification documents"
          />

          <div className="documents-grid">

            <DocumentCard
              title="Driving Licence"
              file={transporter.drivingLicenceFile}
              getUrl={getDocumentUrl}
            />

            <DocumentCard
              title="Vehicle RC"
              file={
                transporter.vehicleRCFile ||
                transporter.vehiclercfile
              }
              getUrl={getDocumentUrl}
            />

            <DocumentCard
              title="Insurance"
              file={transporter.insuranceFile}
              getUrl={getDocumentUrl}
            />

            <DocumentCard
              title="Fitness Certificate"
              file={transporter.fitnessCertificateFile}
              getUrl={getDocumentUrl}
            />

            <DocumentCard
              title="Pollution Certificate"
              file={transporter.pollutionCertificateFile}
              getUrl={getDocumentUrl}
            />

          </div>

        </section>


        {/* =====================================================
            BOTTOM ACTIONS
        ===================================================== */}

        <div className="bottom-actions">

          <button
            className="bottom-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            className="bottom-refresh-button"
            onClick={loadTransporter}
          >
            <RefreshCw size={18} />
            Refresh Details
          </button>

        </div>

      </main>
    </div>
  );
}


/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeader({ icon, title, description }) {
  return (
    <div className="section-header">

      <div className="section-header-icon">
        {icon}
      </div>

      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

    </div>
  );
}


/* =====================================================
   DETAIL
===================================================== */

function Detail({ icon, label, value, full = false }) {
  const empty =
    value === null ||
    value === undefined ||
    value === "" ||
    value === "null" ||
    value === "undefined";

  return (
    <div
      className={`detail-card ${
        full ? "detail-card-full" : ""
      }`}
    >

      <div className="detail-label">

        {icon && (
          <span className="small-detail-icon">
            {icon}
          </span>
        )}

        <span>{label}</span>

      </div>

      <strong>
        {empty ? "Not provided" : value}
      </strong>

    </div>
  );
}


/* =====================================================
   DOCUMENT CARD
===================================================== */

function DocumentCard({ title, file, getUrl }) {
  if (!file) {
    return (
      <div className="document-card document-disabled">

        <div className="document-icon">
          <FileText size={23} />
        </div>

        <div className="document-info">

          <h3>{title}</h3>

          <p>Not uploaded</p>

        </div>

      </div>
    );
  }

  return (
    <a
      href={getUrl(file)}
      target="_blank"
      rel="noopener noreferrer"
      className="document-card"
    >

      <div className="document-icon">
        <FileText size={23} />
      </div>

      <div className="document-info">

        <h3>{title}</h3>

        <p>View uploaded document</p>

      </div>

      <div className="document-arrow">
        →
      </div>

    </a>
  );
}

export default AllTransporters;