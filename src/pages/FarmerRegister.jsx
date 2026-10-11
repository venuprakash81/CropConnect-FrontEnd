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

import "./FarmerRegister.css";

// ========================================
// FIX LEAFLET MARKER ICON
// ========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ========================================
// MAP LOCATION MARKER
// ========================================

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
        position.lng
      ]}
    />
  ) : null;
};


// ========================================
// FARMER REGISTER
// ========================================

const FarmerRegister = () => {

  const navigate = useNavigate();


  // ========================================
  // FORM DATA
  // ========================================

  const [formData, setFormData] = useState({

    fullName: "",
    email: "",
    password: "",

    phone: "",
    alternativePhone: "",

    aadhaarNumber: "",
    dateOfBirth: "",

    village: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",

    latitude: "",
    longitude: "",

    totalLand: "",
    landUnit: "Acres",

  });


  const [profilePhoto, setProfilePhoto] =
    useState(null);


  // ========================================
  // DEFAULT INDIA LOCATION
  // ========================================

  const [position, setPosition] = useState({

    lat: 20.5937,
    lng: 78.9629,

  });


  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };


  // ========================================
  // MAP LOCATION
  // ========================================

  const handleMapLocation = (location) => {

    setPosition(location);

    setFormData((prev) => ({

      ...prev,

      latitude:
        location.lat.toFixed(6),

      longitude:
        location.lng.toFixed(6),

    }));

  };


  // ========================================
  // CURRENT LOCATION
  // ========================================

  const getCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert(
        "Geolocation is not supported by your browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (location) => {

        const lat =
          location.coords.latitude;

        const lng =
          location.coords.longitude;


        handleMapLocation({

          lat,
          lng,

        });

      },


      () => {

        alert(
          "Unable to get your current location."
        );

      }

    );

  };


  // ========================================
  // PROFILE PHOTO
  // ========================================

  const handleProfilePhoto = (e) => {

    setProfilePhoto(
      e.target.files[0]
    );

  };


  // ========================================
  // REGISTER FARMER
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.fullName.trim()) {

      alert(
        "Please enter full name."
      );

      return;
    }


    if (!formData.email.trim()) {

      alert(
        "Please enter email."
      );

      return;
    }


    if (!formData.password) {

      alert(
        "Please enter password."
      );

      return;
    }


    if (!formData.phone) {

      alert(
        "Please enter phone number."
      );

      return;
    }


    if (!/^\d{10}$/.test(formData.phone)) {

      alert(
        "Phone number must contain 10 digits."
      );

      return;
    }


    if (!formData.aadhaarNumber) {

      alert(
        "Please enter Aadhaar number."
      );

      return;
    }


    if (
      !/^\d{12}$/.test(
        formData.aadhaarNumber
      )
    ) {

      alert(
        "Aadhaar number must contain 12 digits."
      );

      return;
    }


    if (!formData.village) {

      alert(
        "Please enter village."
      );

      return;
    }


    if (!formData.mandal) {

      alert(
        "Please enter mandal."
      );

      return;
    }


    if (!formData.district) {

      alert(
        "Please enter district."
      );

      return;
    }


    if (!formData.state) {

      alert(
        "Please enter state."
      );

      return;
    }


    if (!formData.pincode) {

      alert(
        "Please enter PIN code."
      );

      return;
    }


    if (!formData.latitude ||
        !formData.longitude) {

      alert(
        "Please select your farm location on the map."
      );

      return;
    }


    if (!formData.totalLand) {

      alert(
        "Please enter total land."
      );

      return;
    }


    // ========================================
    // CREATE FORM DATA
    // ========================================

    try {

      const data = new FormData();


      // Farmer JSON

      data.append(

        "farmer",

        new Blob(

          [
            JSON.stringify(
              formData
            )
          ],

          {
            type:
              "application/json",
          }

        )

      );


      // Profile Photo

      if (profilePhoto) {

        data.append(
          "profilePhoto",
          profilePhoto
        );

      }


      // ========================================
      // SEND TO SPRING BOOT
      // ========================================

      const response = await fetch(

        "http://localhost:8081/api/farmers/register",

        {

          method: "POST",

          body: data,

        }

      );


      const result =
        await response.json();


      // ========================================
      // SUCCESS
      // ========================================

      if (response.ok) {

        alert(
          "🌱 Farmer registered successfully!"
        );


        console.log(
          "Registration Response:",
          result
        );


        // ========================================
        // CLEAR FORM
        // ========================================

        setFormData({

          fullName: "",
          email: "",
          password: "",

          phone: "",
          alternativePhone: "",

          aadhaarNumber: "",
          dateOfBirth: "",

          village: "",
          mandal: "",
          district: "",
          state: "",
          pincode: "",

          latitude: "",
          longitude: "",

          totalLand: "",
          landUnit: "Acres",

        });


        setProfilePhoto(null);


        // ========================================
        // GO TO LOGIN
        // ========================================

        navigate("/farmer-login");

      } else {

        alert(

          result.message ||
          "Farmer registration failed."

        );

      }


    } catch (error) {

      console.error(
        "Registration Error:",
        error
      );


      alert(

        "Unable to connect to backend.\n\n" +
        "Make sure Spring Boot is running on port 8081."

      );

    }

  };


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="farmer-register-page">


      {/* ========================================
          TOP NAVIGATION
      ======================================== */}

      <div className="register-top-buttons">


        {/* HOME */}

        <button
          type="button"
          className="register-home-button"
          onClick={() =>
            navigate("/")
          }
        >
          🏠 Home
        </button>


        {/* LOGIN */}

        <button
          type="button"
          className="register-login-button"
          onClick={() =>
            navigate("/farmer-login")
          }
        >
          🔐 Farmer Login
        </button>


      </div>


      {/* ========================================
          MAIN CONTAINER
      ======================================== */}

      <div className="register-container">


        {/* HEADER */}

        <div className="register-header">

          <div className="logo">
            🌱
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


        {/* TITLE */}

        <div className="form-title">

          <h2>
            Farmer Registration
          </h2>

          <p>
            Register your farm and connect directly
            with markets, buyers and transport services.
          </p>

        </div>


        {/* ========================================
            FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
        >


          {/* ========================================
              PERSONAL INFORMATION
          ======================================== */}

          <div className="form-section">

            <div className="section-heading">

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


            <div className="form-grid">


              {/* FULL NAME */}

              <div className="form-group full-width">

                <label>
                  Full Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={
                    formData.fullName
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                  <span>*</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label>
                  Password
                  <span>*</span>
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone Number
                  <span>*</span>
                </label>

                <input
                  type="tel"
                  name="phone"
                  maxLength="10"
                  placeholder="10 digit mobile number"
                  value={
                    formData.phone
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* ALTERNATIVE PHONE */}

              <div className="form-group">

                <label>
                  Alternative Phone
                </label>

                <input
                  type="tel"
                  name="alternativePhone"
                  maxLength="10"
                  placeholder="Alternative number"
                  value={
                    formData.alternativePhone
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* AADHAAR */}

              <div className="form-group">

                <label>
                  Aadhaar Card Number
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="aadhaarNumber"
                  maxLength="12"
                  placeholder="Enter 12 digit Aadhaar number"
                  value={
                    formData.aadhaarNumber
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* DOB */}

              <div className="form-group">

                <label>
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              {/* PROFILE PHOTO */}

              <div className="form-group profile-group">

                <label>
                  Profile Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleProfilePhoto
                  }
                />

              </div>

            </div>

          </div>


          {/* ========================================
              ADDRESS INFORMATION
          ======================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                📍
              </span>

              <div>

                <h3>
                  Address Information
                </h3>

                <p>
                  Enter your residential and farm area details
                </p>

              </div>

            </div>


            <div className="form-grid">


              <div className="form-group">

                <label>
                  Village
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="village"
                  placeholder="Enter village"
                  value={
                    formData.village
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Mandal
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="mandal"
                  placeholder="Enter mandal"
                  value={
                    formData.mandal
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  District
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="district"
                  placeholder="Enter district"
                  value={
                    formData.district
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  State
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  PIN Code
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="pincode"
                  maxLength="6"
                  placeholder="Enter PIN code"
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

            </div>

          </div>


          {/* ========================================
              FARM LOCATION
          ======================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                🗺️
              </span>

              <div>

                <h3>
                  Farm Location
                </h3>

                <p>
                  Click on the map to select your farm location
                </p>

              </div>

            </div>


            <div className="location-actions">

              <button
                type="button"
                className="location-button"
                onClick={
                  getCurrentLocation
                }
              >
                📍 Use My Current Location
              </button>

            </div>


            <div className="map-container">

              <MapContainer
                center={[
                  position.lat,
                  position.lng
                ]}
                zoom={5}
                scrollWheelZoom={true}
                className="farmer-map"
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


            <div className="coordinates">


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


          {/* ========================================
              LAND DETAILS
          ======================================== */}

          <div className="form-section">

            <div className="section-heading">

              <span>
                🌾
              </span>

              <div>

                <h3>
                  Land Details
                </h3>

                <p>
                  Provide your total agricultural land information
                </p>

              </div>

            </div>


            <div className="land-row">


              <div className="form-group">

                <label>
                  Total Land
                  <span>*</span>
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="totalLand"
                  placeholder="Enter total land"
                  value={
                    formData.totalLand
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Land Unit
                </label>

                <select
                  name="landUnit"
                  value={
                    formData.landUnit
                  }
                  onChange={
                    handleChange
                  }
                >

                  <option value="Acres">
                    Acres
                  </option>

                  <option value="Hectares">
                    Hectares
                  </option>

                  <option value="Guntas">
                    Guntas
                  </option>

                </select>

              </div>


            </div>

          </div>


          {/* ========================================
              REGISTER BUTTON
          ======================================== */}

          <div className="submit-area">

            <button
              type="submit"
              className="register-button"
            >
              🌱 Register as Farmer
            </button>


            <p>
              By registering, you agree to the
              CropConnect terms and conditions.
            </p>

          </div>


          {/* ========================================
              LOGIN LINK
          ======================================== */}

          <div className="register-login-section">

            <p>
              Already have a Farmer account?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/farmer-login")
              }
            >
              🔐 Login to Farmer Account
            </button>

          </div>


        </form>

      </div>

    </div>

  );

};

export default FarmerRegister;