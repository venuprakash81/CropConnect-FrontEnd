import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "./TransportManagement.css";


// =====================================================
// API
// =====================================================

const API = "http://localhost:8081/api";


// =====================================================
// DEFAULT MAP LOCATION
// Hyderabad
// =====================================================

const DEFAULT_CENTER = [
  17.3850,
  78.4867,
];


// =====================================================
// MARKER ICONS
// =====================================================

const pickupIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});


const destinationIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});


// =====================================================
// MAP CLICK COMPONENT
// =====================================================

function BookingMapClick({
  selectionMode,
  setBooking,
}) {

  useMapEvents({

    click(e) {

      const latitude =
        Number(e.latlng.lat.toFixed(6));

      const longitude =
        Number(e.latlng.lng.toFixed(6));


      if (selectionMode === "pickup") {

        setBooking(prev => ({
          ...prev,

          pickupLatitude: latitude,

          pickupLongitude: longitude,
        }));

      }


      if (selectionMode === "destination") {

        setBooking(prev => ({
          ...prev,

          destinationLatitude: latitude,

          destinationLongitude: longitude,
        }));

      }

    },

  });


  return null;
}


// =====================================================
// MAIN COMPONENT
// =====================================================

function TransportManagement() {

  const [transporters, setTransporters] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);


  const [showBooking, setShowBooking] =
    useState(false);


  const [selectedTransporter, setSelectedTransporter] =
    useState(null);


  const [editingBooking, setEditingBooking] =
    useState(null);


  const [selectionMode, setSelectionMode] =
    useState("pickup");


  const [showMap, setShowMap] =
    useState(false);


  const [location, setLocation] =
    useState(null);


  const [booking, setBooking] =
    useState({

      userType: "FARMER",

      userId: "",

      userName: "",

      userEmail: "",

      userPhone: "",

      pickupLatitude: null,

      pickupLongitude: null,

      destinationLatitude: null,

      destinationLongitude: null,

      goodsName: "",

      quantity: "",

      quantityUnit: "Quintal",

      bookingDate: "",

      notes: "",

      status: "PENDING",

    });


  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    loadTransporters();

    loadBookings();

  }, []);


  // =====================================================
  // TRANSPORTERS
  // =====================================================

  const loadTransporters = async () => {

    try {

      const response = await fetch(
        `${API}/transporters/all`
      );


      if (!response.ok) {

        throw new Error(
          "Failed to load transporters"
        );
      }


      const data =
        await response.json();


      setTransporters(data);

    } catch (error) {

      console.error(error);

      alert(
        "Unable to load transporters"
      );
    }
  };


  // =====================================================
  // BOOKINGS
  // =====================================================

  const loadBookings = async () => {

    try {

      const response = await fetch(
        `${API}/transport-bookings/all`
      );


      if (!response.ok) {

        throw new Error(
          "Failed to load bookings"
        );
      }


      const data =
        await response.json();


      setBookings(data);

    } catch (error) {

      console.error(error);

      alert(
        "Unable to load bookings"
      );
    }
  };


  // =====================================================
  // OPEN BOOKING
  // =====================================================

  const openBooking = (transporter) => {

    setSelectedTransporter(
      transporter
    );

    setEditingBooking(null);


    setBooking({

      userType: "FARMER",

      userId: "",

      userName: "",

      userEmail: "",

      userPhone: "",

      pickupLatitude: null,

      pickupLongitude: null,

      destinationLatitude: null,

      destinationLongitude: null,

      goodsName: "",

      quantity: "",

      quantityUnit: "Quintal",

      bookingDate: "",

      notes: "",

      status: "PENDING",

    });


    setSelectionMode(
      "pickup"
    );


    setShowBooking(true);
  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setBooking(prev => ({

      ...prev,

      [name]: value,

    }));
  };


  // =====================================================
  // OPEN MAP
  // =====================================================

  const openLocationMap = (
    mode
  ) => {

    setSelectionMode(mode);

    setShowMap(true);
  };


  // =====================================================
  // CLEAR PICKUP
  // =====================================================

  const clearPickup = () => {

    setBooking(prev => ({

      ...prev,

      pickupLatitude: null,

      pickupLongitude: null,

    }));

    setSelectionMode(
      "pickup"
    );
  };


  // =====================================================
  // CLEAR DESTINATION
  // =====================================================

  const clearDestination = () => {

    setBooking(prev => ({

      ...prev,

      destinationLatitude: null,

      destinationLongitude: null,

    }));

    setSelectionMode(
      "destination"
    );
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const submitBooking = async (e) => {

    e.preventDefault();


    if (
      booking.pickupLatitude === null ||
      booking.pickupLongitude === null
    ) {

      alert(
        "Please select pickup location on the map."
      );

      return;
    }


    if (
      booking.destinationLatitude === null ||
      booking.destinationLongitude === null
    ) {

      alert(
        "Please select destination on the map."
      );

      return;
    }


    if (!selectedTransporter) {

      alert(
        "Transporter not selected."
      );

      return;
    }


    const payload = {

      ...booking,

      userId:
        booking.userId
          ? Number(booking.userId)
          : null,

      quantity:
        booking.quantity
          ? Number(booking.quantity)
          : null,

    };


    try {

      const response = await fetch(

        `${API}/transport-bookings/transporter/${selectedTransporter.id}`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body:
            JSON.stringify(
              payload
            ),

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Booking failed"
        );
      }


      alert(
        "Transport booked successfully!"
      );


      setShowBooking(false);

      loadBookings();

    } catch (error) {

      console.error(error);

      alert(
        error.message
      );
    }
  };


  // =====================================================
  // EDIT BOOKING
  // =====================================================

  const editBooking = (item) => {

    setEditingBooking(item);


    setSelectedTransporter(
      item.transporter
    );


    setBooking({

      userType:
        item.userType ||
        "FARMER",

      userId:
        item.userId ||
        "",

      userName:
        item.userName ||
        "",

      userEmail:
        item.userEmail ||
        "",

      userPhone:
        item.userPhone ||
        "",

      pickupLatitude:
        item.pickupLatitude ??
        null,

      pickupLongitude:
        item.pickupLongitude ??
        null,

      destinationLatitude:
        item.destinationLatitude ??
        null,

      destinationLongitude:
        item.destinationLongitude ??
        null,

      goodsName:
        item.goodsName ||
        "",

      quantity:
        item.quantity ||
        "",

      quantityUnit:
        item.quantityUnit ||
        "Quintal",

      bookingDate:
        item.bookingDate ||
        "",

      notes:
        item.notes ||
        "",

      status:
        item.status ||
        "PENDING",

    });


    setSelectionMode(
      "pickup"
    );


    setShowBooking(true);
  };


  // =====================================================
  // UPDATE BOOKING
  // =====================================================

  const updateBooking = async (e) => {

    e.preventDefault();


    if (
      booking.pickupLatitude === null ||
      booking.pickupLongitude === null
    ) {

      alert(
        "Please select pickup location."
      );

      return;
    }


    if (
      booking.destinationLatitude === null ||
      booking.destinationLongitude === null
    ) {

      alert(
        "Please select destination."
      );

      return;
    }


    try {

      const response = await fetch(

        `${API}/transport-bookings/${editingBooking.id}`,

        {

          method: "PUT",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            ...booking,

            userId:
              booking.userId
                ? Number(
                    booking.userId
                  )
                : null,

            quantity:
              booking.quantity
                ? Number(
                    booking.quantity
                  )
                : null,

          }),

        }

      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Update failed"
        );
      }


      alert(
        "Booking updated successfully!"
      );


      setShowBooking(false);

      setEditingBooking(null);

      loadBookings();

    } catch (error) {

      alert(
        error.message
      );
    }
  };


  // =====================================================
  // DELETE TRANSPORTER
  // =====================================================

  const deleteTransporter = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete this transporter?"
      )
    ) {

      return;
    }


    try {

      const response =
        await fetch(

          `${API}/transporters/${id}`,

          {
            method: "DELETE",
          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Delete failed"
        );
      }


      alert(
        "Transporter deleted."
      );


      loadTransporters();

    } catch (error) {

      alert(
        error.message
      );
    }
  };


  // =====================================================
  // DELETE BOOKING
  // =====================================================

  const deleteBooking = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete this booking?"
      )
    ) {

      return;
    }


    try {

      const response =
        await fetch(

          `${API}/transport-bookings/${id}`,

          {
            method: "DELETE",
          }

        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Delete failed"
        );
      }


      alert(
        "Booking deleted."
      );


      loadBookings();

    } catch (error) {

      alert(
        error.message
      );
    }
  };


  // =====================================================
  // TRACK TRANSPORTER
  // =====================================================

  const trackTransporter =
    async (
      transporter
    ) => {

      try {

        const response =
          await fetch(

            `${API}/transporters/${transporter.id}/location`

          );


        if (!response.ok) {

          alert(
            "Transporter location is unavailable."
          );

          return;
        }


        const data =
          await response.json();


        setLocation(data);

      } catch (error) {

        alert(
          "Unable to load location."
        );
      }
    };


  // =====================================================
  // GOOGLE MAP
  // =====================================================

  const openGoogleMaps = () => {

    if (!location) return;


    window.open(

      `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,

      "_blank"

    );
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="transport-management">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="transport-header">

        <div>

          <h1>
            Transport Management
          </h1>

          <p>
            Find transporters and manage
            transport bookings
          </p>

        </div>


        <div className="transport-count">

          {transporters.length}
          {" "}
          Transporters

        </div>

      </div>


      {/* =================================================
          TRANSPORTERS
      ================================================= */}

      <section className="transport-section">

        <div className="section-title">

          <h2>
            Available Transporters
          </h2>

          <span>
            {transporters.length}
            {" "}
            available
          </span>

        </div>


        <div className="transporter-grid">

          {transporters.map(
            transporter => (

              <div
                className="transporter-card"
                key={
                  transporter.id
                }
              >

                <div className="transporter-top">

                  <div className="profile-circle">

                    {transporter.fullName
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "T"}

                  </div>


                  <div>

                    <h3>
                      {
                        transporter.fullName
                      }
                    </h3>

                    <p>
                      {
                        transporter.businessName ||
                        "Transport Service"
                      }
                    </p>

                  </div>

                </div>


                <div className="transporter-info">

                  <div>

                    <span>
                      Vehicle
                    </span>

                    <strong>
                      {
                        transporter.vehicleNumber ||
                        "-"
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Vehicle Type
                    </span>

                    <strong>
                      {
                        transporter.vehicleType ||
                        "-"
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      Capacity
                    </span>

                    <strong>

                      {
                        transporter.vehicleCapacity
                          ? `${transporter.vehicleCapacity} ${transporter.capacityUnit || ""}`
                          : "-"
                      }

                    </strong>

                  </div>


                  <div>

                    <span>
                      Phone
                    </span>

                    <strong>
                      {
                        transporter.phone ||
                        "-"
                      }
                    </strong>

                  </div>

                </div>


                <div className="transporter-actions">

                  <button
                    className="location-btn"
                    onClick={() =>
                      trackTransporter(
                        transporter
                      )
                    }
                  >
                    📍 Track Location
                  </button>


                  <button
                    className="book-btn"
                    onClick={() =>
                      openBooking(
                        transporter
                      )
                    }
                  >
                    🚚 Book Transport
                  </button>

                </div>


                <div className="secondary-actions">

              

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* =================================================
          BOOKINGS
      ================================================= */}

      <section className="booking-section">

        <div className="section-title">

          <h2>
            Transport Bookings
          </h2>

          <span>
            {bookings.length}
            {" "}
            bookings
          </span>

        </div>


        <div className="booking-list">

          {bookings.map(
            item => (

              <div
                className="booking-card"
                key={item.id}
              >

                <div className="booking-card-header">

                  <div>

                    <span className="booking-number">
                      Booking #{item.id}
                    </span>

                    <h3>

                      {
                        item.transporter
                          ?.fullName ||
                        "Transporter"
                      }

                    </h3>

                  </div>


                  <span
                    className={
                      `status ${
                        (
                          item.status ||
                          "PENDING"
                        ).toLowerCase()
                      }`
                    }
                  >
                    {
                      item.status ||
                      "PENDING"
                    }
                  </span>

                </div>


                <div className="booking-details">

                  <div>

                    <label>
                      User Type
                    </label>

                    <strong>
                      {
                        item.userType
                      }
                    </strong>

                  </div>


                  <div>

                    <label>
                      User
                    </label>

                    <strong>
                      {
                        item.userName ||
                        "-"
                      }
                    </strong>

                  </div>


                  <div>

                    <label>
                      Goods
                    </label>

                    <strong>
                      {
                        item.goodsName ||
                        "-"
                      }
                    </strong>

                  </div>


                  <div>

                    <label>
                      Quantity
                    </label>

                    <strong>

                      {
                        item.quantity
                          ? `${item.quantity} ${item.quantityUnit || ""}`
                          : "-"
                      }

                    </strong>

                  </div>


                  <div>

                    <label>
                      Pickup Coordinates
                    </label>

                    <strong>

                      {
                        item.pickupLatitude != null
                          ? `${item.pickupLatitude}, ${item.pickupLongitude}`
                          : "-"
                      }

                    </strong>

                  </div>


                  <div>

                    <label>
                      Destination Coordinates
                    </label>

                    <strong>

                      {
                        item.destinationLatitude != null
                          ? `${item.destinationLatitude}, ${item.destinationLongitude}`
                          : "-"
                      }

                    </strong>

                  </div>


                  <div>

                    <label>
                      Booking Date
                    </label>

                    <strong>
                      {
                        item.bookingDate ||
                        "-"
                      }
                    </strong>

                  </div>

                </div>


                <div className="booking-actions">

                  <button
                    className="location-btn"
                    onClick={() =>
                      trackTransporter(
                        item.transporter
                      )
                    }
                  >
                    📍 Track Transporter
                  </button>


                  <button
                    className="map-booking-btn"
                    onClick={() => {

                      setLocation({

                        name:
                          "Pickup Location",

                        latitude:
                          item.pickupLatitude,

                        longitude:
                          item.pickupLongitude,

                      });

                    }}
                  >
                    🟢 Pickup
                  </button>


                  <button
                    className="map-booking-btn"
                    onClick={() => {

                      setLocation({

                        name:
                          "Destination",

                        latitude:
                          item.destinationLatitude,

                        longitude:
                          item.destinationLongitude,

                      });

                    }}
                  >
                    🔴 Destination
                  </button>


                  <button
                    className="edit-btn"
                    onClick={() =>
                      editBooking(item)
                    }
                  >
                    ✏️ Edit
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteBooking(
                        item.id
                      )
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* =================================================
          BOOKING MODAL
      ================================================= */}

      {showBooking && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowBooking(false)
          }
        >

          <div
            className="booking-modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>

                  {
                    editingBooking
                      ? "Edit Transport Booking"
                      : "Book Transport"
                  }

                </h2>

                <p>

                  Transporter:
                  {" "}

                  <strong>

                    {
                      selectedTransporter?.fullName
                    }

                  </strong>

                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setShowBooking(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                editingBooking
                  ? updateBooking
                  : submitBooking
              }
            >

              {/* =================================================
                  USER DETAILS
              ================================================= */}

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    User Type *
                  </label>

                  <select
                    name="userType"
                    value={
                      booking.userType
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >

                    <option value="FARMER">
                      Farmer
                    </option>

                    <option value="BUYER">
                      Buyer
                    </option>

                    <option value="WAREHOUSE">
                      Warehouse
                    </option>
 <option value="TRANSPORTER">
                      Transporter
                    </option>
                  </select>

                </div>


                <div className="form-group">

                  <label>
                    User ID
                  </label>

                  <input
                    name="userId"
                    type="number"
                    value={
                      booking.userId
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="User ID"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Name *
                  </label>

                  <input
                    name="userName"
                    value={
                      booking.userName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter name"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    name="userEmail"
                    type="email"
                    value={
                      booking.userEmail
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Email"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    name="userPhone"
                    value={
                      booking.userPhone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Phone"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Crop / Goods *
                  </label>

                  <input
                    name="goodsName"
                    value={
                      booking.goodsName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Rice, Wheat..."
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Quantity *
                  </label>

                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                      booking.quantity
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Quantity"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Unit
                  </label>

                  <select
                    name="quantityUnit"
                    value={
                      booking.quantityUnit
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="Kg">
                      Kg
                    </option>

                    <option value="Quintal">
                      Quintal
                    </option>

                    <option value="Ton">
                      Ton
                    </option>

                    <option value="Crate">
                      Crate
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Booking Date *
                  </label>

                  <input
                    type="date"
                    name="bookingDate"
                    value={
                      booking.bookingDate
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  PICKUP
              ================================================= */}

              <div className="map-selection-card">

                <div className="map-selection-header">

                  <div>

                    <span className="map-number pickup-number">
                      1
                    </span>

                    <div>

                      <h3>
                        Pickup Location
                      </h3>

                      <p>
                        Select pickup point
                        directly on the map
                      </p>

                    </div>

                  </div>


                  {booking.pickupLatitude !== null && (

                    <span className="selected-badge">
                      ✓ Selected
                    </span>

                  )}

                </div>


                {booking.pickupLatitude !== null ? (

                  <div className="coordinate-box">

                    <span>
                      Latitude
                    </span>

                    <strong>
                      {
                        booking.pickupLatitude
                      }
                    </strong>


                    <span>
                      Longitude
                    </span>

                    <strong>
                      {
                        booking.pickupLongitude
                      }
                    </strong>

                  </div>

                ) : (

                  <p className="not-selected">
                    Pickup location not selected
                  </p>

                )}


                <div className="map-button-row">

                  <button
                    type="button"
                    className="select-map-btn"
                    onClick={() =>
                      openLocationMap(
                        "pickup"
                      )
                    }
                  >
                    🗺️ Select Pickup on Map
                  </button>


                  {booking.pickupLatitude !== null && (

                    <button
                      type="button"
                      className="clear-map-btn"
                      onClick={
                        clearPickup
                      }
                    >
                      Clear
                    </button>

                  )}

                </div>

              </div>


              {/* =================================================
                  DESTINATION
              ================================================= */}

              <div className="map-selection-card">

                <div className="map-selection-header">

                  <div>

                    <span className="map-number destination-number">
                      2
                    </span>

                    <div>

                      <h3>
                        Destination
                      </h3>

                      <p>
                        Select destination
                        directly on the map
                      </p>

                    </div>

                  </div>


                  {booking.destinationLatitude !== null && (

                    <span className="selected-badge">
                      ✓ Selected
                    </span>

                  )}

                </div>


                {booking.destinationLatitude !== null ? (

                  <div className="coordinate-box">

                    <span>
                      Latitude
                    </span>

                    <strong>
                      {
                        booking.destinationLatitude
                      }
                    </strong>


                    <span>
                      Longitude
                    </span>

                    <strong>
                      {
                        booking.destinationLongitude
                      }
                    </strong>

                  </div>

                ) : (

                  <p className="not-selected">
                    Destination not selected
                  </p>

                )}


                <div className="map-button-row">

                  <button
                    type="button"
                    className="select-map-btn"
                    onClick={() =>
                      openLocationMap(
                        "destination"
                      )
                    }
                  >
                    🗺️ Select Destination on Map
                  </button>


                  {booking.destinationLatitude !== null && (

                    <button
                      type="button"
                      className="clear-map-btn"
                      onClick={
                        clearDestination
                      }
                    >
                      Clear
                    </button>

                  )}

                </div>

              </div>


              {/* =================================================
                  NOTES
              ================================================= */}

              <div className="form-group full">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={
                    booking.notes
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                  placeholder="Additional instructions..."
                />

              </div>


              {/* =================================================
                  SAVE
              ================================================= */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowBooking(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-btn"
                >

                  {
                    editingBooking
                      ? "Update Booking"
                      : "Confirm Booking"
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          MAP SELECTOR
      ================================================= */}

      {showMap && (

        <div className="map-overlay">

          <div className="map-selector">

            <div className="map-selector-header">

              <div>

                <h2>

                  {
                    selectionMode ===
                    "pickup"

                      ? "📍 Select Pickup Location"

                      : "🎯 Select Destination"

                  }

                </h2>

                <p>

                  Click anywhere on the map
                  to select the location.

                </p>

              </div>


              <button
                className="close-btn"
                onClick={() =>
                  setShowMap(false)
                }
              >
                ×
              </button>

            </div>


            <div className="map-instructions">

              {selectionMode ===
              "pickup"

                ? "Click on the map to select the pickup point."

                : "Click on the map to select the destination."}

            </div>


            <div className="leaflet-wrapper">

              <MapContainer
                center={
                  booking.pickupLatitude
                    ? [
                        booking.pickupLatitude,
                        booking.pickupLongitude,
                      ]
                    : DEFAULT_CENTER
                }
                zoom={12}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <BookingMapClick
                  selectionMode={
                    selectionMode
                  }
                  setBooking={
                    setBooking
                  }
                />


                {/* PICKUP */}

                {booking.pickupLatitude !== null && (

                  <Marker
                    position={[
                      booking.pickupLatitude,
                      booking.pickupLongitude,
                    ]}
                    icon={
                      pickupIcon
                    }
                  >

                    <Popup>
                      <strong>
                        Pickup Location
                      </strong>

                      <br />

                      {
                        booking.pickupLatitude
                      }

                      ,

                      {
                        booking.pickupLongitude
                      }

                    </Popup>

                  </Marker>

                )}


                {/* DESTINATION */}

                {booking.destinationLatitude !== null && (

                  <Marker
                    position={[
                      booking.destinationLatitude,
                      booking.destinationLongitude,
                    ]}
                    icon={
                      destinationIcon
                    }
                  >

                    <Popup>
                      <strong>
                        Destination
                      </strong>

                      <br />

                      {
                        booking.destinationLatitude
                      }

                      ,

                      {
                        booking.destinationLongitude
                      }

                    </Popup>

                  </Marker>

                )}


                {/* ROUTE LINE */}

                {booking.pickupLatitude !== null &&
                  booking.destinationLatitude !== null && (

                    <Polyline
                      positions={[
                        [
                          booking.pickupLatitude,
                          booking.pickupLongitude,
                        ],
                        [
                          booking.destinationLatitude,
                          booking.destinationLongitude,
                        ],
                      ]}
                    />

                  )}

              </MapContainer>

            </div>


            <div className="map-selected-summary">

              <div>

                <span>
                  🟢 Pickup
                </span>

                <strong>

                  {
                    booking.pickupLatitude !== null

                      ? `${booking.pickupLatitude}, ${booking.pickupLongitude}`

                      : "Not selected"

                  }

                </strong>

              </div>


              <div>

                <span>
                  🔴 Destination
                </span>

                <strong>

                  {
                    booking.destinationLatitude !== null

                      ? `${booking.destinationLatitude}, ${booking.destinationLongitude}`

                      : "Not selected"

                  }

                </strong>

              </div>

            </div>


            <div className="map-selector-actions">

              <button
                className="map-cancel-btn"
                onClick={() =>
                  setShowMap(false)
                }
              >
                Back
              </button>


              <button
                className="map-confirm-btn"
                onClick={() => {

                  if (
                    selectionMode ===
                    "pickup" &&
                    booking.pickupLatitude !== null
                  ) {

                    setSelectionMode(
                      "destination"
                    );

                    alert(
                      "Pickup selected. Now click the map to select destination."
                    );

                    return;
                  }


                  if (
                    selectionMode ===
                    "destination" &&
                    booking.destinationLatitude !== null
                  ) {

                    setShowMap(
                      false
                    );

                    return;
                  }


                  setShowMap(
                    false
                  );

                }}
              >

                Done

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          TRACK LOCATION
      ================================================= */}

      {location && (

        <div
          className="modal-overlay"
          onClick={() =>
            setLocation(null)
          }
        >

          <div
            className="location-modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <button
              className="close-btn"
              onClick={() =>
                setLocation(null)
              }
            >
              ×
            </button>


            <h2>
              📍 Location
            </h2>


            <h3>
              {
                location.name
              }
            </h3>


            <div className="coordinates">

              <div>

                <span>
                  Latitude
                </span>

                <strong>
                  {
                    location.latitude
                  }
                </strong>

              </div>


              <div>

                <span>
                  Longitude
                </span>

                <strong>
                  {
                    location.longitude
                  }
                </strong>

              </div>

            </div>


            <button
              className="map-btn"
              onClick={
                openGoogleMaps
              }
            >
              🗺️ Open in Google Maps
            </button>

          </div>

        </div>

      )}

    </div>
  );
}


export default TransportManagement;