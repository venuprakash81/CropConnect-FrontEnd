import React from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUser,
    FaUserEdit,
    FaLock,
    FaBell,
    FaSignOutAlt,
    FaArrowLeft
} from "react-icons/fa";

import "./Settings.css";

function Settings() {

    const navigate = useNavigate();

    const farmer = JSON.parse(localStorage.getItem("farmer"));

    const logout = () => {

        if (window.confirm("Are you sure you want to logout?")) {

            localStorage.removeItem("farmer");

            navigate("/farmer-login");

        }

    };

    return (

        <div className="settings-container">

            <div className="settings-card">

                <img
                    src={
                        farmer?.photo
                            ? `https://cropconnect-backend-exn7.onrender.com/uploads/${farmer.photo}`
                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Farmer"
                    className="settings-image"
                />

                <h2>{farmer?.name}</h2>

                <p>{farmer?.email}</p>

                <button
                    className="settings-btn"
                    onClick={() => navigate("/profile")}
                >
                    <FaUser /> View Profile
                </button>

                <button
                    className="settings-btn"
                    onClick={() => navigate("/edit-profile")}
                >
                    <FaUserEdit /> Edit Profile
                </button>

                <button
                    className="settings-btn"
                    onClick={() => navigate("/change-password")}
                >
                    <FaLock /> Change Password
                </button>

                <button
                    className="settings-btn"
                    onClick={() => navigate("/notifications")}
                >
                    <FaBell /> Notifications
                </button>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    <FaSignOutAlt /> Logout
                </button>

                <button
                    className="back-btn"
                    onClick={() => navigate("/farmer-dashboard")}
                >
                    <FaArrowLeft /> Back to Dashboard
                </button>

            </div>

        </div>

    );

}

export default Settings;
