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

import "./WarehouseRegister.css";


// =====================================================
// FIX LEAFLET MARKER
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
// LOCATION MARKER
// =====================================================

const LocationMarker = ({
  position,
  setPosition,
}) => {

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
// WAREHOUSE REGISTER
// =====================================================

const WarehouseRegister = () => {

  const navigate = useNavigate();


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({

    // Owner Details

    fullName: "",
    email: "",
    password: "",
    phone: "",
    alternativePhone: "",
    dateOfBirth: "",
    governmentId: "",

    // Warehouse Details

    warehouseName: "",
    warehouseType: "",
    ownership: "",
    yearEstablished: "",
    warehouseDescription: "",

    // Address

    village: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",
    fullAddress: "",

    // Location

    latitude: "",
    longitude: "",

    // Capacity

    totalStorageCapacity: "",
    capacityUnit: "Tonnes",
    availableCapacity: "",
    occupiedCapacity: "",
    storageSections: "",

    // Facilities

    coldStorageAvailable: "No",
    temperatureControl: "No",
    humidityControl: "No",
    ventilation: "Yes",
    electricityAvailable: "Yes",
    backupGenerator: "No",
    cctvSecurity: "No",
    fireSafety: "No",
    pestControl: "No",

    // Crops

    supportedCrops: [],

    // Pricing

    pricePerQuintal: "",
    pricePerTonne: "",
    dailyCharge: "",
    monthlyCharge: "",
    loadingCharge: "",
    unloadingCharge: "",

    // Availability

    currentlyAcceptingProduce: "Yes",
    openingTime: "",
    closingTime: "",
    workingDays: "",
    advanceBookingRequired: "No",

  });


  // =====================================================
  // FILE STATES
  // =====================================================

  const [profilePhoto, setProfilePhoto] =
    useState(null);

  const [warehouseRegistration, setWarehouseRegistration] =
    useState(null);

  const [ownershipDocument, setOwnershipDocument] =
    useState(null);

  const [warehouseLicense, setWarehouseLicense] =
    useState(null);

  const [fireSafetyCertificate, setFireSafetyCertificate] =
    useState(null);

  const [otherDocument, setOtherDocument] =
    useState(null);


  // =====================================================
  // MAP POSITION
  // =====================================================

  const [position, setPosition] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // =====================================================
  // HANDLE CROP CHECKBOX
  // =====================================================

  const handleCropChange = (crop) => {

    setFormData((previous) => {

      const crops =
        previous.supportedCrops;


      if (crops.includes(crop)) {

        return {

          ...previous,

          supportedCrops:
            crops.filter(
              (item) => item !== crop
            ),

        };

      }


      return {

        ...previous,

        supportedCrops: [
          ...crops,
          crop,
        ],

      };

    });

  };


  // =====================================================
  // HANDLE MAP LOCATION
  // =====================================================

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


  // =====================================================
  // CURRENT LOCATION
  // =====================================================

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

          lat:
            location.coords.latitude,

          lng:
            location.coords.longitude,

        });

      },


      (error) => {

        console.error(
          "Location error:",
          error
        );


        alert(
          "Unable to get your current location. " +
          "Please allow location permission."
        );

      }

    );

  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setFormData({

      fullName: "",
      email: "",
      password: "",
      phone: "",
      alternativePhone: "",
      dateOfBirth: "",
      governmentId: "",

      warehouseName: "",
      warehouseType: "",
      ownership: "",
      yearEstablished: "",
      warehouseDescription: "",

      village: "",
      mandal: "",
      district: "",
      state: "",
      pincode: "",
      fullAddress: "",

      latitude: "",
      longitude: "",

      totalStorageCapacity: "",
      capacityUnit: "Tonnes",
      availableCapacity: "",
      occupiedCapacity: "",
      storageSections: "",

      coldStorageAvailable: "No",
      temperatureControl: "No",
      humidityControl: "No",
      ventilation: "Yes",
      electricityAvailable: "Yes",
      backupGenerator: "No",
      cctvSecurity: "No",
      fireSafety: "No",
      pestControl: "No",

      supportedCrops: [],

      pricePerQuintal: "",
      pricePerTonne: "",
      dailyCharge: "",
      monthlyCharge: "",
      loadingCharge: "",
      unloadingCharge: "",

      currentlyAcceptingProduce: "Yes",
      openingTime: "",
      closingTime: "",
      workingDays: "",
      advanceBookingRequired: "No",

    });


    setProfilePhoto(null);
    setWarehouseRegistration(null);
    setOwnershipDocument(null);
    setWarehouseLicense(null);
    setFireSafetyCertificate(null);
    setOtherDocument(null);


    setPosition({
      lat: 20.5937,
      lng: 78.9629,
    });

  };


  // =====================================================
  // SUBMIT REGISTRATION
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // =====================================================
    // REQUIRED VALIDATION
    // =====================================================

    if (!formData.fullName.trim()) {

      alert(
        "Please enter owner / manager name."
      );

      return;

    }


    if (!formData.email.trim()) {

      alert(
        "Please enter email address."
      );

      return;

    }


    if (!formData.password.trim()) {

      alert(
        "Please create a password."
      );

      return;

    }


    if (
      formData.password.length < 6
    ) {

      alert(
        "Password must contain at least 6 characters."
      );

      return;

    }


    if (!formData.phone.trim()) {

      alert(
        "Please enter phone number."
      );

      return;

    }


    if (
      !/^\d{10}$/.test(
        formData.phone
      )
    ) {

      alert(
        "Phone number must contain exactly 10 digits."
      );

      return;

    }


    if (
      formData.alternativePhone &&
      !/^\d{10}$/.test(
        formData.alternativePhone
      )
    ) {

      alert(
        "Alternative phone number must contain 10 digits."
      );

      return;

    }


    if (
      !formData.warehouseName.trim()
    ) {

      alert(
        "Please enter warehouse name."
      );

      return;

    }


    if (!formData.warehouseType) {

      alert(
        "Please select warehouse type."
      );

      return;

    }


    if (
      !formData.totalStorageCapacity ||
      Number(formData.totalStorageCapacity) <= 0
    ) {

      alert(
        "Storage capacity must be greater than zero."
      );

      return;

    }


    if (
      !formData.latitude ||
      !formData.longitude
    ) {

      alert(
        "Please select warehouse location on the map."
      );

      return;

    }


    try {

      // =================================================
      // CREATE FORMDATA
      // =================================================

      const data = new FormData();


      // =================================================
      // CONVERT CROPS
      // =================================================

      const warehouseData = {

        ...formData,

        supportedCrops:
          JSON.stringify(
            formData.supportedCrops
          ),

        yearEstablished:
          formData.yearEstablished
            ? Number(
                formData.yearEstablished
              )
            : null,

        latitude:
          formData.latitude
            ? Number(
                formData.latitude
              )
            : null,

        longitude:
          formData.longitude
            ? Number(
                formData.longitude
              )
            : null,

        totalStorageCapacity:
          formData.totalStorageCapacity
            ? Number(
                formData.totalStorageCapacity
              )
            : null,

        availableCapacity:
          formData.availableCapacity
            ? Number(
                formData.availableCapacity
              )
            : null,

        occupiedCapacity:
          formData.occupiedCapacity
            ? Number(
                formData.occupiedCapacity
              )
            : null,

        storageSections:
          formData.storageSections
            ? Number(
                formData.storageSections
              )
            : null,

        pricePerQuintal:
          formData.pricePerQuintal
            ? Number(
                formData.pricePerQuintal
              )
            : null,

        pricePerTonne:
          formData.pricePerTonne
            ? Number(
                formData.pricePerTonne
              )
            : null,

        dailyCharge:
          formData.dailyCharge
            ? Number(
                formData.dailyCharge
              )
            : null,

        monthlyCharge:
          formData.monthlyCharge
            ? Number(
                formData.monthlyCharge
              )
            : null,

        loadingCharge:
          formData.loadingCharge
            ? Number(
                formData.loadingCharge
              )
            : null,

        unloadingCharge:
          formData.unloadingCharge
            ? Number(
                formData.unloadingCharge
              )
            : null,

      };


      // =================================================
      // JSON WAREHOUSE
      // =================================================

      data.append(

        "warehouse",

        new Blob(

          [
            JSON.stringify(
              warehouseData
            ),
          ],

          {
            type:
              "application/json",
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
      // WAREHOUSE REGISTRATION
      // =================================================

      if (
        warehouseRegistration
      ) {

        data.append(
          "warehouseRegistration",
          warehouseRegistration
        );

      }


      // =================================================
      // OWNERSHIP DOCUMENT
      // =================================================

      if (
        ownershipDocument
      ) {

        data.append(
          "ownershipDocument",
          ownershipDocument
        );

      }


      // =================================================
      // WAREHOUSE LICENSE
      // =================================================

      if (
        warehouseLicense
      ) {

        data.append(
          "warehouseLicense",
          warehouseLicense
        );

      }


      // =================================================
      // FIRE SAFETY CERTIFICATE
      // =================================================

      if (
        fireSafetyCertificate
      ) {

        data.append(
          "fireSafetyCertificate",
          fireSafetyCertificate
        );

      }


      // =================================================
      // OTHER DOCUMENT
      // =================================================

      if (otherDocument) {

        data.append(
          "otherDocument",
          otherDocument
        );

      }


      // =================================================
      // SEND TO SPRING BOOT
      // =================================================

      const response =
        await fetch(

          "http://localhost:8081/api/warehouses/register",

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
          "Warehouse registered successfully!\n\n" +
          "Please login to continue."
        );


        console.log(
          "Registration response:",
          result
        );


        // Go directly to Login

        navigate(
          "/warehouse-login"
        );


        return;

      }


      // =================================================
      // ERROR
      // =================================================

      alert(

        result.message ||
        "Warehouse registration failed."

      );


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      alert(

        "Unable to connect to Spring Boot backend.\n\n" +
        "Make sure Spring Boot is running on port 8081."

      );

    }

  };


  // =====================================================
  // RETURN UI
  // =====================================================

  return (

    <div className="warehouse-register-page">


      {/* =================================================
          HOME BUTTON
      ================================================= */}

      <button
        type="button"
        className="warehouse-register-home-button"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>



      {/* =================================================
          ALREADY REGISTERED BUTTON
      ================================================= */}

      <button
        type="button"
        className="warehouse-register-login-button"
        onClick={() =>
          navigate("/warehouse-login")
        }
      >
        🔐 Already Registered? Login
      </button>



      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="warehouse-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="warehouse-header">

          <div className="warehouse-logo">
            🏬
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



        {/* =================================================
            TITLE
        ================================================= */}

        <div className="warehouse-title">

          <h2>
            Warehouse Registration
          </h2>

          <p>
            Register your warehouse and provide
            storage facilities for agricultural produce.
          </p>

        </div>



        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>


          {/* =================================================
              OWNER DETAILS
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                👤
              </span>


              <div>

                <h3>
                  Owner / Manager Details
                </h3>

                <p>
                  Enter warehouse owner or manager information
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              {/* FULL NAME */}

              <div className="warehouse-group full-width">

                <label>
                  Full Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter owner / manager name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

              </div>



              {/* EMAIL */}

              <div className="warehouse-group">

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

              <div className="warehouse-group">

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

              <div className="warehouse-group">

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

              <div className="warehouse-group">

                <label>
                  Alternative Phone
                </label>

                <input
                  type="tel"
                  name="alternativePhone"
                  maxLength="10"
                  placeholder="Alternative phone number"
                  value={formData.alternativePhone}
                  onChange={handleChange}
                />

              </div>



              {/* DOB */}

              <div className="warehouse-group">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={handleChange}
                />

              </div>



              {/* GOVERNMENT ID */}

              <div className="warehouse-group">

                <label>
                  Government ID
                </label>

                <input
                  type="text"
                  name="governmentId"
                  placeholder="Enter government ID"
                  value={
                    formData.governmentId
                  }
                  onChange={handleChange}
                />

              </div>



              {/* PROFILE PHOTO */}

              <div className="warehouse-group">

                <label>
                  Profile Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfilePhoto(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />

              </div>


            </div>

          </div>



          {/* =================================================
              WAREHOUSE DETAILS
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                🏢
              </span>


              <div>

                <h3>
                  Warehouse Details
                </h3>

                <p>
                  Enter basic information about your warehouse
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              {/* WAREHOUSE NAME */}

              <div className="warehouse-group">

                <label>
                  Warehouse Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="warehouseName"
                  placeholder="Enter warehouse name"
                  value={
                    formData.warehouseName
                  }
                  onChange={handleChange}
                />

              </div>



              {/* TYPE */}

              <div className="warehouse-group">

                <label>
                  Warehouse Type <span>*</span>
                </label>

                <select
                  name="warehouseType"
                  value={
                    formData.warehouseType
                  }
                  onChange={handleChange}
                >

                  <option value="">
                    Select warehouse type
                  </option>

                  <option value="Private">
                    Private Warehouse
                  </option>

                  <option value="Government">
                    Government Warehouse
                  </option>

                  <option value="Cooperative">
                    Cooperative Warehouse
                  </option>

                  <option value="Cold Storage">
                    Cold Storage
                  </option>

                  <option value="Agricultural Warehouse">
                    Agricultural Warehouse
                  </option>

                </select>

              </div>



              {/* OWNERSHIP */}

              <div className="warehouse-group">

                <label>
                  Ownership
                </label>

                <select
                  name="ownership"
                  value={
                    formData.ownership
                  }
                  onChange={handleChange}
                >

                  <option value="">
                    Select ownership
                  </option>

                  <option value="Own">
                    Own
                  </option>

                  <option value="Leased">
                    Leased
                  </option>

                </select>

              </div>



              {/* YEAR */}

              <div className="warehouse-group">

                <label>
                  Year Established
                </label>

                <input
                  type="number"
                  name="yearEstablished"
                  placeholder="Example: 2020"
                  value={
                    formData.yearEstablished
                  }
                  onChange={handleChange}
                />

              </div>



              {/* DESCRIPTION */}

              <div className="warehouse-group full-width">

                <label>
                  Warehouse Description
                </label>

                <textarea
                  name="warehouseDescription"
                  placeholder="Describe your warehouse"
                  value={
                    formData.warehouseDescription
                  }
                  onChange={handleChange}
                />

              </div>


            </div>

          </div>



          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                📍
              </span>


              <div>

                <h3>
                  Address Information
                </h3>

                <p>
                  Enter warehouse address
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              <div className="warehouse-group">

                <label>
                  Village
                </label>

                <input
                  type="text"
                  name="village"
                  placeholder="Enter village"
                  value={
                    formData.village
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Mandal
                </label>

                <input
                  type="text"
                  name="mandal"
                  placeholder="Enter mandal"
                  value={
                    formData.mandal
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  District
                </label>

                <input
                  type="text"
                  name="district"
                  placeholder="Enter district"
                  value={
                    formData.district
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  State
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={
                    formData.state
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  maxLength="6"
                  placeholder="Enter PIN code"
                  value={
                    formData.pincode
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group full-width">

                <label>
                  Full Address
                </label>

                <textarea
                  name="fullAddress"
                  placeholder="Enter complete warehouse address"
                  value={
                    formData.fullAddress
                  }
                  onChange={handleChange}
                />

              </div>


            </div>

          </div>



          {/* =================================================
              MAP LOCATION
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                🗺️
              </span>


              <div>

                <h3>
                  Warehouse Location
                </h3>

                <p>
                  Select the exact warehouse location on the map
                </p>

              </div>

            </div>



            <button
              type="button"
              className="warehouse-location-button"
              onClick={getCurrentLocation}
            >
              📍 Use My Current Location
            </button>



            <div className="warehouse-map">

              <MapContainer
                center={[
                  position.lat,
                  position.lng,
                ]}
                zoom={5}
                scrollWheelZoom={true}
                className="warehouse-leaflet-map"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <LocationMarker
                  position={position}
                  setPosition={
                    handleMapLocation
                  }
                />

              </MapContainer>

            </div>



            <div className="warehouse-coordinates">


              <div>

                <label>
                  Latitude
                </label>

                <input
                  type="text"
                  value={
                    formData.latitude
                  }
                  readOnly
                />

              </div>



              <div>

                <label>
                  Longitude
                </label>

                <input
                  type="text"
                  value={
                    formData.longitude
                  }
                  readOnly
                />

              </div>


            </div>

          </div>



          {/* =================================================
              STORAGE CAPACITY
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                📦
              </span>


              <div>

                <h3>
                  Storage Capacity
                </h3>

                <p>
                  Enter warehouse storage capacity
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              <div className="warehouse-group">

                <label>
                  Total Storage Capacity <span>*</span>
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="totalStorageCapacity"
                  placeholder="Enter total capacity"
                  value={
                    formData.totalStorageCapacity
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Capacity Unit
                </label>

                <select
                  name="capacityUnit"
                  value={
                    formData.capacityUnit
                  }
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



              <div className="warehouse-group">

                <label>
                  Available Capacity
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="availableCapacity"
                  placeholder="Available capacity"
                  value={
                    formData.availableCapacity
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Occupied Capacity
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="occupiedCapacity"
                  placeholder="Occupied capacity"
                  value={
                    formData.occupiedCapacity
                  }
                  onChange={handleChange}
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Number of Storage Sections
                </label>

                <input
                  type="number"
                  name="storageSections"
                  placeholder="Number of sections"
                  value={
                    formData.storageSections
                  }
                  onChange={handleChange}
                />

              </div>


            </div>

          </div>



          {/* =================================================
              FACILITIES
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                🌡️
              </span>


              <div>

                <h3>
                  Storage Facilities
                </h3>

                <p>
                  Select available warehouse facilities
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              {[
                [
                  "coldStorageAvailable",
                  "Cold Storage",
                ],

                [
                  "temperatureControl",
                  "Temperature Control",
                ],

                [
                  "humidityControl",
                  "Humidity Control",
                ],

                [
                  "ventilation",
                  "Ventilation",
                ],

                [
                  "electricityAvailable",
                  "Electricity Available",
                ],

                [
                  "backupGenerator",
                  "Backup Generator",
                ],

                [
                  "cctvSecurity",
                  "CCTV Security",
                ],

                [
                  "fireSafety",
                  "Fire Safety",
                ],

                [
                  "pestControl",
                  "Pest Control",
                ],

              ].map(
                ([name, label]) => (

                  <div
                    className="warehouse-group"
                    key={name}
                  >

                    <label>
                      {label}
                    </label>

                    <select
                      name={name}
                      value={
                        formData[name]
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>

                    </select>

                  </div>

                )
              )}

            </div>

          </div>



          {/* =================================================
              SUPPORTED CROPS
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                🌾
              </span>


              <div>

                <h3>
                  Supported Crops
                </h3>

                <p>
                  Select crops that can be stored
                </p>

              </div>

            </div>



            <div className="crop-checkbox-grid">


              {[
                "Rice",
                "Wheat",
                "Maize",
                "Cotton",
                "Pulses",
                "Vegetables",
                "Fruits",
                "Sugarcane",
                "Groundnut",
                "Other",
              ].map((crop) => (

                <label
                  className="crop-checkbox"
                  key={crop}
                >

                  <input
                    type="checkbox"
                    checked={
                      formData.supportedCrops.includes(
                        crop
                      )
                    }
                    onChange={() =>
                      handleCropChange(crop)
                    }
                  />

                  <span>
                    {crop}
                  </span>

                </label>

              ))}

            </div>

          </div>



          {/* =================================================
              PRICING
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                💰
              </span>


              <div>

                <h3>
                  Storage Pricing
                </h3>

                <p>
                  Enter your storage charges
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              {[
                [
                  "pricePerQuintal",
                  "Price Per Quintal",
                  "₹ per quintal",
                ],

                [
                  "pricePerTonne",
                  "Price Per Tonne",
                  "₹ per tonne",
                ],

                [
                  "dailyCharge",
                  "Daily Charge",
                  "₹ per day",
                ],

                [
                  "monthlyCharge",
                  "Monthly Charge",
                  "₹ per month",
                ],

                [
                  "loadingCharge",
                  "Loading Charge",
                  "₹ loading charge",
                ],

                [
                  "unloadingCharge",
                  "Unloading Charge",
                  "₹ unloading charge",
                ],

              ].map(
                ([name, label, placeholder]) => (

                  <div
                    className="warehouse-group"
                    key={name}
                  >

                    <label>
                      {label}
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name={name}
                      placeholder={placeholder}
                      value={
                        formData[name]
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                )
              )}

            </div>

          </div>



          {/* =================================================
              AVAILABILITY
          ================================================= */}

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                📅
              </span>


              <div>

                <h3>
                  Availability
                </h3>

                <p>
                  Tell farmers when storage is available
                </p>

              </div>

            </div>



            <div className="warehouse-grid">


              <div className="warehouse-group">

                <label>
                  Currently Accepting Produce
                </label>

                <select
                  name="currentlyAcceptingProduce"
                  value={
                    formData.currentlyAcceptingProduce
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>



              <div className="warehouse-group">

                <label>
                  Opening Time
                </label>

                <input
                  type="time"
                  name="openingTime"
                  value={
                    formData.openingTime
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Closing Time
                </label>

                <input
                  type="time"
                  name="closingTime"
                  value={
                    formData.closingTime
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Working Days
                </label>

                <input
                  type="text"
                  name="workingDays"
                  placeholder="Example: Monday - Saturday"
                  value={
                    formData.workingDays
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>



              <div className="warehouse-group">

                <label>
                  Advance Booking Required
                </label>

                <select
                  name="advanceBookingRequired"
                  value={
                    formData.advanceBookingRequired
                  }
                  onChange={
                    handleChange
                  }
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

          <div className="warehouse-section">

            <div className="warehouse-section-heading">

              <span>
                📄
              </span>


              <div>

                <h3>
                  Documents
                </h3>

                <p>
                  Upload warehouse supporting documents
                </p>

              </div>

            </div>



            <div className="warehouse-document-grid">


              <div className="warehouse-document-box">

                <label>
                  Warehouse Registration
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setWarehouseRegistration(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />

              </div>



              <div className="warehouse-document-box">

                <label>
                  Ownership / Lease Document
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setOwnershipDocument(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />

              </div>



              <div className="warehouse-document-box">

                <label>
                  Warehouse License
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setWarehouseLicense(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />

              </div>



              <div className="warehouse-document-box">

                <label>
                  Fire Safety Certificate
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFireSafetyCertificate(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />

              </div>



              <div className="warehouse-document-box">

                <label>
                  Other Document
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setOtherDocument(
                      e.target.files?.[0] ||
                      null
                    )
                  }
                />

              </div>


            </div>

          </div>



          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="warehouse-submit">

            <button
              type="submit"
              className="warehouse-register-button"
            >
              🏬 Register Warehouse
            </button>


            <p>
              Join CropConnect and provide reliable
              storage facilities to farmers.
            </p>

          </div>


        </form>

      </div>

    </div>

  );

};


export default WarehouseRegister;