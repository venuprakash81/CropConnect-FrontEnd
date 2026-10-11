import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./TransporterRegister.css";


// =====================================================
// FIX LEAFLET MARKER ICON
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

});


// =====================================================
// MAP LOCATION MARKER
// =====================================================

const LocationMarker = ({ position, setPosition }) => {

  useMapEvents({

    click(e) {

      setPosition({

        lat: e.latlng.lat,

        lng: e.latlng.lng,

      });

    },

  });


  return position ? (

    <Marker
      position={[
        position.lat,
        position.lng,
      ]}
    />

  ) : null;

};


// =====================================================
// TRANSPORTER REGISTER
// =====================================================

const TransporterRegister = () => {

  const navigate = useNavigate();


  // ===================================================
  // FORM DATA
  // ===================================================

  const [formData, setFormData] = useState({

    // Personal
    fullName: "",
    email: "",
    password: "",
    phone: "",
    alternativePhone: "",
    dateOfBirth: "",
    aadhaarNumber: "",
    drivingLicenceNumber: "",

    // Business
    businessName: "",
    transporterType: "",
    gstNumber: "",
    yearsOfExperience: "",
    businessAddress: "",

    // Address
    village: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",

    // Location
    latitude: "",
    longitude: "",

    // Vehicle
    vehicleNumber: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleCapacity: "",
    capacityUnit: "Tonnes",
    vehicleOwnership: "",
    fuelType: "",

    // Vehicle features
    coldStorageAvailable: "No",
    perishableGoodsSupported: "No",

    // Pricing
    baseCharge: "",
    pricePerKm: "",
    pricePerQuintal: "",
    minimumTripCharge: "",

    // Availability
    availableDays: "",
    availableTime: "",
    maximumTravelDistance: "",
    currentlyAvailable: "Yes",

  });


  // ===================================================
  // FILE STATES
  // ===================================================

  const [profilePhoto, setProfilePhoto] =
    useState(null);

  const [drivingLicence, setDrivingLicence] =
    useState(null);

  const [vehicleRC, setVehicleRC] =
    useState(null);

  const [insurance, setInsurance] =
    useState(null);

  const [fitnessCertificate, setFitnessCertificate] =
    useState(null);

  const [pollutionCertificate, setPollutionCertificate] =
    useState(null);


  // ===================================================
  // DEFAULT MAP LOCATION
  // ===================================================

  const [position, setPosition] = useState({

    lat: 20.5937,

    lng: 78.9629,

  });


  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };


  // ===================================================
  // MAP LOCATION
  // ===================================================

  const handleMapLocation = (location) => {

    setPosition(location);

    setFormData((previous) => ({

      ...previous,

      latitude:
        location.lat.toFixed(6),

      longitude:
        location.lng.toFixed(6),

    }));

  };


  // ===================================================
  // CURRENT LOCATION
  // ===================================================

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert(
        "Geolocation is not supported by your browser."
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (location) => {

        handleMapLocation({

          lat: location.coords.latitude,

          lng: location.coords.longitude,

        });

      },

      () => {

        alert(
          "Unable to get your current location."
        );

      }

    );

  };


  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // =================================================
    // REQUIRED VALIDATION
    // =================================================

    if (!formData.fullName) {

      alert("Please enter full name.");

      return;

    }


    if (!formData.email) {

      alert("Please enter email.");

      return;

    }


    if (!formData.password) {

      alert("Please enter password.");

      return;

    }


    if (!formData.phone) {

      alert("Please enter phone number.");

      return;

    }


    if (!formData.vehicleNumber) {

      alert("Please enter vehicle number.");

      return;

    }


    if (!formData.vehicleType) {

      alert("Please select vehicle type.");

      return;

    }


    if (
      !formData.latitude ||
      !formData.longitude
    ) {

      alert(
        "Please select transporter location on the map."
      );

      return;

    }


    // =================================================
    // SEND DATA
    // =================================================

    try {

      const data = new FormData();


      // JSON DATA

      data.append(

        "transporter",

        new Blob(

          [
            JSON.stringify(formData)
          ],

          {
            type: "application/json",
          }

        )

      );


      // =================================================
      // PROFILE PHOTO
      // =================================================

      if (profilePhoto) {

        data.append(
          "profilePhoto",
          profilePhoto
        );

      }


      // =================================================
      // DOCUMENTS
      // =================================================

      if (drivingLicence) {

        data.append(
          "drivingLicence",
          drivingLicence
        );

      }


      if (vehicleRC) {

        data.append(
          "vehicleRC",
          vehicleRC
        );

      }


      if (insurance) {

        data.append(
          "insurance",
          insurance
        );

      }


      if (fitnessCertificate) {

        data.append(
          "fitnessCertificate",
          fitnessCertificate
        );

      }


      if (pollutionCertificate) {

        data.append(
          "pollutionCertificate",
          pollutionCertificate
        );

      }


      // =================================================
      // BACKEND API
      // =================================================

      const response = await fetch(

        "http://localhost:8081/api/transporters/register",

        {

          method: "POST",

          body: data,

        }

      );


      const result =
        await response.json();


      // =================================================
      // SUCCESS
      // =================================================

      if (response.ok) {

        alert(
          "Transporter registered successfully! Please login."
        );

        console.log(result);


        // OPEN TRANSPORTER LOGIN PAGE

        navigate("/transporter-login");

      }


      // =================================================
      // ERROR
      // =================================================

      else {

        alert(

          result.message ||
          "Registration failed."

        );

      }


    }

    catch (error) {

      console.error(error);

      alert(
        "Unable to connect to Spring Boot backend."
      );

    }

  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="transporter-register-page">

      <div className="transporter-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="transporter-header">


          {/* BRAND */}

          <div className="transporter-brand">

            <div className="transporter-logo">

              🚚

            </div>


            <div>

              <h1>
                CropConnect
              </h1>

              <p>
                Smart Farmer-to-Market Platform
              </p>

            </div>

          </div>


          {/* HEADER BUTTONS */}

          <div className="transporter-header-buttons">


            {/* HOME */}

            <button
              type="button"
              className="transporter-home-button"
              onClick={() => navigate("/")}
            >

              🏠 Home

            </button>


            {/* LOGIN */}

            <button
              type="button"
              className="transporter-login-button"
              onClick={() =>
                navigate("/transporter-login")
              }
            >

              🔐 Login

            </button>


          </div>


        </div>


        {/* =================================================
            TITLE
        ================================================= */}

        <div className="transporter-title">

          <h2>
            Transporter Registration
          </h2>

          <p>
            Register your transportation services
            and connect with CropConnect users.
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                👤
              </span>

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Enter your personal details
                </p>

              </div>

            </div>


            <div className="transporter-grid">


              {/* FULL NAME */}

              <div className="transporter-group full-width">

                <label>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

              </div>


              {/* EMAIL */}

              <div className="transporter-group">

                <label>
                  Email <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>


              {/* PASSWORD */}

              <div className="transporter-group">

                <label>
                  Password <span>*</span>
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />

              </div>


              {/* PHONE */}

              <div className="transporter-group">

                <label>
                  Phone Number <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  placeholder="10 digit mobile number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>


              {/* ALTERNATIVE PHONE */}

              <div className="transporter-group">

                <label>
                  Alternative Phone
                </label>

                <input
                  type="tel"
                  name="alternativePhone"
                  maxLength="10"
                  placeholder="Alternative phone"
                  value={formData.alternativePhone}
                  onChange={handleChange}
                />

              </div>


              {/* DOB */}

              <div className="transporter-group">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />

              </div>


              {/* AADHAAR */}

              <div className="transporter-group">

                <label>
                  Aadhaar Card Number
                </label>

                <input
                  type="text"
                  name="aadhaarNumber"
                  maxLength="12"
                  placeholder="12 digit Aadhaar number"
                  value={formData.aadhaarNumber}
                  onChange={handleChange}
                />

              </div>


              {/* LICENCE */}

              <div className="transporter-group">

                <label>
                  Driving Licence Number
                </label>

                <input
                  type="text"
                  name="drivingLicenceNumber"
                  placeholder="Enter licence number"
                  value={
                    formData.drivingLicenceNumber
                  }
                  onChange={handleChange}
                />

              </div>


              {/* PROFILE PHOTO */}

              <div className="transporter-group">

                <label>
                  Profile Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePhoto(
                      e.target.files[0]
                    )
                  }
                />

              </div>


            </div>

          </div>


          {/* =================================================
              BUSINESS INFORMATION
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                🏢
              </span>

              <div>

                <h3>
                  Business Information
                </h3>

                <p>
                  Enter your transportation business details
                </p>

              </div>

            </div>


            <div className="transporter-grid">


              <div className="transporter-group">

                <label>
                  Business Name
                </label>

                <input
                  type="text"
                  name="businessName"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Transporter Type
                </label>

                <select
                  name="transporterType"
                  value={formData.transporterType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Type
                  </option>

                  <option value="Individual">
                    Individual
                  </option>

                  <option value="Driver">
                    Driver
                  </option>

                  <option value="Fleet Owner">
                    Fleet Owner
                  </option>

                  <option value="Transport Company">
                    Transport Company
                  </option>

                </select>

              </div>


              <div className="transporter-group">

                <label>
                  GST Number
                </label>

                <input
                  type="text"
                  name="gstNumber"
                  placeholder="Enter GST number"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Years of Experience
                </label>

                <input
                  type="number"
                  name="yearsOfExperience"
                  placeholder="Years"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group full-width">

                <label>
                  Business Address
                </label>

                <textarea
                  name="businessAddress"
                  placeholder="Enter complete business address"
                  value={formData.businessAddress}
                  onChange={handleChange}
                />

              </div>


            </div>

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                📍
              </span>

              <div>

                <h3>
                  Address Information
                </h3>

                <p>
                  Enter your residential or business location
                </p>

              </div>

            </div>


            <div className="transporter-grid">


              <div className="transporter-group">

                <label>
                  Village
                </label>

                <input
                  type="text"
                  name="village"
                  placeholder="Enter village"
                  value={formData.village}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Mandal
                </label>

                <input
                  type="text"
                  name="mandal"
                  placeholder="Enter mandal"
                  value={formData.mandal}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  maxLength="6"
                  placeholder="Enter PIN code"
                  value={formData.pincode}
                  onChange={handleChange}
                />

              </div>


            </div>

          </div>


          {/* =================================================
              MAP
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                🗺️
              </span>

              <div>

                <h3>
                  Transporter Location
                </h3>

                <p>
                  Select your current or business location
                </p>

              </div>

            </div>


            <button
              type="button"
              className="current-location-button"
              onClick={getCurrentLocation}
            >

              📍 Use My Current Location

            </button>


            <div className="transporter-map">

              <MapContainer

                center={[
                  position.lat,
                  position.lng,
                ]}

                zoom={5}

                scrollWheelZoom={true}

                className="leaflet-map"

              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <LocationMarker

                  position={position}

                  setPosition={handleMapLocation}

                />

              </MapContainer>

            </div>


            <div className="coordinates-grid">


              <div>

                <label>
                  Latitude
                </label>

                <input
                  type="text"
                  value={formData.latitude}
                  readOnly
                />

              </div>


              <div>

                <label>
                  Longitude
                </label>

                <input
                  type="text"
                  value={formData.longitude}
                  readOnly
                />

              </div>


            </div>

          </div>


          {/* =================================================
              VEHICLE INFORMATION
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                🚛
              </span>

              <div>

                <h3>
                  Vehicle Information
                </h3>

                <p>
                  Enter the details of your vehicle
                </p>

              </div>

            </div>


            <div className="transporter-grid">


              <div className="transporter-group">

                <label>
                  Vehicle Number <span>*</span>
                </label>

                <input
                  type="text"
                  name="vehicleNumber"
                  placeholder="Example: TS09AB1234"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Vehicle Type <span>*</span>
                </label>

                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Vehicle
                  </option>

                  <option value="Mini Truck">
                    Mini Truck
                  </option>

                  <option value="Pickup Truck">
                    Pickup Truck
                  </option>

                  <option value="Tractor">
                    Tractor
                  </option>

                  <option value="Lorry">
                    Lorry
                  </option>

                  <option value="Refrigerated Truck">
                    Refrigerated Truck
                  </option>

                  <option value="Container Truck">
                    Container Truck
                  </option>

                </select>

              </div>


              <div className="transporter-group">

                <label>
                  Vehicle Model
                </label>

                <input
                  type="text"
                  name="vehicleModel"
                  placeholder="Enter vehicle model"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Vehicle Capacity
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="vehicleCapacity"
                  placeholder="Enter capacity"
                  value={formData.vehicleCapacity}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Capacity Unit
                </label>

                <select
                  name="capacityUnit"
                  value={formData.capacityUnit}
                  onChange={handleChange}
                >

                  <option value="Kg">
                    Kilograms
                  </option>

                  <option value="Quintals">
                    Quintals
                  </option>

                  <option value="Tonnes">
                    Tonnes
                  </option>

                </select>

              </div>


              <div className="transporter-group">

                <label>
                  Vehicle Ownership
                </label>

                <select
                  name="vehicleOwnership"
                  value={formData.vehicleOwnership}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Ownership
                  </option>

                  <option value="Own">
                    Own
                  </option>

                  <option value="Rented">
                    Rented
                  </option>

                  <option value="Leased">
                    Leased
                  </option>

                </select>

              </div>


              <div className="transporter-group">

                <label>
                  Fuel Type
                </label>

                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Fuel
                  </option>

                  <option value="Diesel">
                    Diesel
                  </option>

                  <option value="Petrol">
                    Petrol
                  </option>

                  <option value="CNG">
                    CNG
                  </option>

                  <option value="Electric">
                    Electric
                  </option>

                </select>

              </div>


              <div className="transporter-group">

                <label>
                  Cold Storage Available
                </label>

                <select
                  name="coldStorageAvailable"
                  value={formData.coldStorageAvailable}
                  onChange={handleChange}
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>


              <div className="transporter-group">

                <label>
                  Perishable Goods Supported
                </label>

                <select
                  name="perishableGoodsSupported"
                  value={
                    formData.perishableGoodsSupported
                  }
                  onChange={handleChange}
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>


            </div>

          </div>


          {/* =================================================
              PRICING
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                💰
              </span>

              <div>

                <h3>
                  Transportation Pricing
                </h3>

                <p>
                  Set your transportation charges
                </p>

              </div>

            </div>


            <div className="transporter-grid">


              <div className="transporter-group">

                <label>
                  Base Charge
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="baseCharge"
                  placeholder="₹ Base charge"
                  value={formData.baseCharge}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Price Per KM
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="pricePerKm"
                  placeholder="₹ per KM"
                  value={formData.pricePerKm}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Price Per Quintal
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="pricePerQuintal"
                  placeholder="₹ per quintal"
                  value={formData.pricePerQuintal}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Minimum Trip Charge
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="minimumTripCharge"
                  placeholder="₹ minimum charge"
                  value={formData.minimumTripCharge}
                  onChange={handleChange}
                />

              </div>


            </div>

          </div>


          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                📅
              </span>

              <div>

                <h3>
                  Availability
                </h3>

                <p>
                  Tell us when you are available
                </p>

              </div>

            </div>


            <div className="transporter-grid">


              <div className="transporter-group">

                <label>
                  Available Days
                </label>

                <input
                  type="text"
                  name="availableDays"
                  placeholder="Example: Monday - Saturday"
                  value={formData.availableDays}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Available Time
                </label>

                <input
                  type="text"
                  name="availableTime"
                  placeholder="Example: 8 AM - 8 PM"
                  value={formData.availableTime}
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Maximum Travel Distance
                </label>

                <input
                  type="number"
                  name="maximumTravelDistance"
                  placeholder="Distance in KM"
                  value={
                    formData.maximumTravelDistance
                  }
                  onChange={handleChange}
                />

              </div>


              <div className="transporter-group">

                <label>
                  Currently Available
                </label>

                <select
                  name="currentlyAvailable"
                  value={
                    formData.currentlyAvailable
                  }
                  onChange={handleChange}
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>


            </div>

          </div>


          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <div className="transporter-section">

            <div className="transporter-section-heading">

              <span>
                📄
              </span>

              <div>

                <h3>
                  Documents
                </h3>

                <p>
                  Upload your vehicle and driver documents
                </p>

              </div>

            </div>


            <div className="transporter-document-grid">


              <div className="document-box">

                <label>
                  Driving Licence
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setDrivingLicence(
                      e.target.files[0]
                    )
                  }
                />

              </div>


              <div className="document-box">

                <label>
                  Vehicle RC
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setVehicleRC(
                      e.target.files[0]
                    )
                  }
                />

              </div>


              <div className="document-box">

                <label>
                  Vehicle Insurance
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setInsurance(
                      e.target.files[0]
                    )
                  }
                />

              </div>


              <div className="document-box">

                <label>
                  Fitness Certificate
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFitnessCertificate(
                      e.target.files[0]
                    )
                  }
                />

              </div>


              <div className="document-box">

                <label>
                  Pollution Certificate
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setPollutionCertificate(
                      e.target.files[0]
                    )
                  }
                />

              </div>


            </div>

          </div>


          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="transporter-submit">

            <button
              type="submit"
              className="transporter-register-button"
            >

              🚚 Register as Transporter

            </button>


            <p>

              Join CropConnect and provide
              reliable transportation services.

            </p>

          </div>


        </form>

      </div>

    </div>

  );

};


export default TransporterRegister;