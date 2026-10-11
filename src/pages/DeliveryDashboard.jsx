import React from "react";
import { Link } from "react-router-dom";
import "./DeliveryDashboard.css";
import  { useState, useEffect } from "react";

import axios from "axios";
import "./DeliveryDashboard.css";

function DeliveryDashboard() {

  const [delivery_partners, setDeliveryPartner] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8081/delivery_partners/1") // Change the URL if needed
      .then((response) => {
        setDeliveryPartner(response.data);
      })
      .catch((error) => {
        console.error("Error fetching delivery partner:", error);
      });
  }, []);

  if (!delivery_partners) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <h2>🌱 CropConnect</h2>
          <p>Delivery Partner</p>
        </div>

        <ul>
          <li><Link to="/delivery-dashboard">🏠 Dashboard</Link></li>
          <li><Link to="/available-requests">📦 Available Requests</Link></li>
          <li><Link to="/my-bookings">🚚 My Bookings</Link></li>
          <li><Link to="/trip-status">📍 Trip Status</Link></li>
          <li><Link to="/earnings">💰 Earnings</Link></li>
          <li><Link to="/payments">💳 Payments</Link></li>
          <li><Link to="/vehicles">🚛 Vehicles</Link></li>
          <li><Link to="/notifications">🔔 Notifications</Link></li>
          <li><Link to="/delivery-profile">👤 Profile</Link></li>
          <li><Link to="/">🚪 Logout</Link></li>
        </ul>
      </div>

      {/* Main */}
      <div className="main-content">

        {/* Navbar */}
        <div className="navbar">
          <div className="welcome">
            <h1>Welcome, {delivery_partners?.fullName} 👋</h1>
            <p>Delivery Partner Dashboard</p>
          </div>

          <div className="nav-icons">
            <button className="icon-btn">🔔</button>
            <button className="icon-btn">⚙️</button>

            <img
              src={delivery_partners?.profileImage}
              alt="Profile"
              className="profile-img"
            />
          </div>
        </div>

        {/* Profile */}
        <div className="profile-section">

          <div className="profile-card">
            <img
              src={delivery_partners?.profileImage}
              alt="Profile"
              className="delivery-photo"
            />

            <h2>{delivery_partners?.fullName}</h2>

            <span className="status available">
              Delivery Partner
            </span>
          </div>

          <div className="details-grid">

            <div className="detail-box">
              <h4>👤 Full Name</h4>
              <p>{delivery_partners?.fullName}</p>
            </div>

            <div className="detail-box">
              <h4>📧 Email</h4>
              <p>{delivery_partners?.email}</p>
            </div>

            <div className="detail-box">
              <h4>📱 Phone</h4>
              <p>{delivery_partners?.phone}</p>
            </div>

            <div className="detail-box">
              <h4>🪪 Aadhaar Number</h4>
              <p>{delivery_partners?.aadhaarNumber}</p>
            </div>

            <div className="detail-box">
              <h4>🆔 Driving License</h4>
              <p>{delivery_partners?.drivingLicenseNumber}</p>
            </div>

            <div className="detail-box">
              <h4>🚚 Vehicle Type</h4>
              <p>{delivery_partners?.vehicleType}</p>
            </div>

            <div className="detail-box">
              <h4>🚛 Vehicle Number</h4>
              <p>{delivery_partners?.vehicleNumber}</p>
            </div>

            <div className="detail-box">
              <h4>🏠 Address</h4>
              <p>{delivery_partners?.address}</p>
            </div>

            <div className="detail-box">
              <h4>🏙 District</h4>
              <p>{delivery_partners?.district}</p>
            </div>

            <div className="detail-box">
              <h4>🌍 State</h4>
              <p>{delivery_partners?.state}</p>
            </div>

            <div className="detail-box">
              <h4>📮 Pincode</h4>
              <p>{delivery_partners?.pincode}</p>
            </div>

            <div className="detail-box">
              <h4>🚛 Vehicle Image</h4>

              <img
                src={delivery_partners?.vehicleImage}
                alt="Vehicle"
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DeliveryDashboard;