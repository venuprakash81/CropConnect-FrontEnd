import React from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

    const navigate = useNavigate();

    const farmer = JSON.parse(localStorage.getItem("farmer"));

    return (

        <div className="profile-container">

            <div className="profile-card">

                <div className="profile-header">

                    <img
                        src={
                            farmer?.photo
                            ? `http://localhost:8081/uploads/${farmer.photo}`
                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="Farmer"
                        className="profile-image"
                    />

                    <h1>{farmer?.name}</h1>

                    <p>🌱 Registered Farmer</p>

                </div>

                <div className="profile-details">

                    <div className="detail-box">

                        <h3>📧 Email</h3>

                        <p>{farmer?.email}</p>

                    </div>

                    <div className="detail-box">

                        <h3>📱 Phone</h3>

                        <p>{farmer?.phone}</p>

                    </div>

                    <div className="detail-box">

                        <h3>🏡 Village</h3>

                        <p>{farmer?.village}</p>

                    </div>

                    <div className="detail-box">

                        <h3>🏙 District</h3>

                        <p>{farmer?.district}</p>

                    </div>

                    <div className="detail-box">

                        <h3>🌍 State</h3>

                        <p>{farmer?.state}</p>

                    </div>

                    <div className="detail-box">

                        <h3>📮 Pincode</h3>

                        <p>{farmer?.pincode}</p>

                    </div>

                    <div className="detail-box">

                        <h3>🌾 Main Crop</h3>

                        <p>{farmer?.crop}</p>

                    </div>

                    <div className="detail-box">

                        <h3>🚜 Land Area</h3>

                        <p>{farmer?.land} Acres</p>

                    </div>

                </div>                <div className="profile-buttons">

                    <button
                        className="edit-btn"
                        onClick={() => navigate("/edit-profile")}
                    >
                        ✏ Edit Profile
                    </button>

                    <button
                        className="password-btn"
                        onClick={() => navigate("/change-password")}
                    >
                        🔑 Change Password
                    </button>

                    <button
                        className="photo-btn"
                        onClick={() => navigate("/change-photo")}
                    >
                        📷 Change Photo
                    </button>

                    <button
                        className="dashboard-btn"
                        onClick={() => navigate("/farmer-dashboard")}
                    >
                        🏠 Back to Dashboard
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Profile;