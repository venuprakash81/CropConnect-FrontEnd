import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const TransporterDashboard = () => {

    const navigate = useNavigate();

    const [transporter, setTransporter] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);


    // =====================================================
    // LOAD TRANSPORTER
    // =====================================================

    useEffect(() => {

        const savedTransporter =
            localStorage.getItem("cropconnectTransporter");

        if (!savedTransporter) {

            navigate("/transporter-login");

            return;
        }

        try {

            const transporterData =
                JSON.parse(savedTransporter);

            setTransporter(transporterData);

        } catch (error) {

            console.error(
                "Error loading transporter:",
                error
            );

            localStorage.removeItem(
                "cropconnectTransporter"
            );

            localStorage.removeItem(
                "transporterId"
            );

            navigate("/transporter-login");
        }

    }, [navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "cropconnectTransporter"
        );

        localStorage.removeItem(
            "transporterId"
        );

        setShowProfileMenu(false);

        navigate("/transporter-login");
    };


    // =====================================================
    // TRANSPORTER IMAGE
    // =====================================================

    const getProfileImage = () => {

        if (
            !transporter ||
            !transporter.profilePhoto
        ) {

            return null;
        }
        

        return (
            "https://cropconnect-backend-exn7.onrender.com/api/transporters/profile-photo/" +
            encodeURIComponent(
                transporter.profilePhoto
            )
            
        );
    };
    


    // =====================================================
    // TRANSPORTER NAME
    // =====================================================

    const getTransporterName = () => {

        if (!transporter) {

            return "Transporter";
        }

        return (
            transporter.fullName ||
            "Transporter"
        );
    };


    // =====================================================
    // VEHICLE INFORMATION
    // =====================================================

    const getVehicleInfo = () => {

        if (!transporter) {

            return "Vehicle";
        }

        if (
            transporter.vehicleType &&
            transporter.vehicleNumber
        ) {

            return (
                transporter.vehicleType +
                " - " +
                transporter.vehicleNumber
            );
        }

        if (transporter.vehicleType) {

            return transporter.vehicleType;
        }

        return "Transport Vehicle";
    };


    // =====================================================
    // DASHBOARD CARD
    // =====================================================

    const DashboardCard = ({
        icon,
        title,
        onClick
    }) => {

        return (

            <button
                className="farmer-dashboard-card"
                onClick={onClick}
            >

                <div className="dashboard-card-icon">
                    {icon}
                </div>

                <div className="dashboard-card-title">
                    {title}
                </div>

            </button>
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (!transporter) {

        return (

            <div className="farmer-dashboard-loading">

                <div className="loading-spinner">
                </div>

                <p>
                    Loading Transporter Dashboard...
                </p>

            </div>
        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="farmer-dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="farmer-dashboard-header">


                {/* =================================================
                    LEFT - CROPCONNECT
                ================================================= */}

                <div
                    className="cropconnect-brand"
                    onClick={() =>
                        navigate(
                            "/transporter-dashboard"
                        )
                    }
                >

                    <div className="cropconnect-logo">
                        🌱
                    </div>


                    <div className="cropconnect-brand-text">

                        <h2>
                            CropConnect
                        </h2>

                        <span>
                            Transporter Platform
                        </span>

                    </div>

                </div>


                {/* =================================================
                    CENTER - TITLE
                ================================================= */}

                <div className="dashboard-title">

                    <h1>
                        Transporter Dashboard
                    </h1>

                </div>


                {/* =================================================
                    RIGHT - NOTIFICATION + PROFILE
                ================================================= */}

                <div className="dashboard-header-actions">


                    {/* NOTIFICATION */}

                    <button
                        className="notification-button"
                        title="Notifications"
                        onClick={() =>
                            navigate(
                                "/transporter-notifications"
                            )
                        }
                    >

                        🔔

                        <span className="notification-dot">
                        </span>

                    </button>


                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <div className="profile-container">


                        <button
                            className="farmer-profile-button"
                            onClick={() =>
                                setShowProfileMenu(
                                    !showProfileMenu
                                )
                            }
                        >


                            {/* TRANSPORTER IMAGE */}

                            <div className="profile-image-wrapper">

                                {getProfileImage() ? (

                                    <img
                                        src={getProfileImage()}
                                        alt={getTransporterName()}
                                        className="farmer-profile-image"
                                        onError={(e) => {
                                            e.target.style.display =
                                                "none";
                                        }}
                                    />

                                ) : (

                                    <div className="default-farmer-image">
                                        🚚
                                    </div>

                                )}

                            </div>


                            {/* TRANSPORTER NAME */}

                            <div className="profile-name">

                                <strong>
                                    {getTransporterName()}
                                </strong>

                                <span>
                                    Transporter
                                </span>

                            </div>


                            {/* ARROW */}

                            <span className="profile-arrow">
                                ▾
                            </span>

                        </button>


                        {/* =================================================
                            PROFILE DROPDOWN
                        ================================================= */}

                        {showProfileMenu && (

                            <div className="profile-dropdown">


                                {/* DROPDOWN HEADER */}

                                <div className="dropdown-header">


                                    <div className="dropdown-profile-image">

                                        {getProfileImage() ? (

                                            <img
                                                src={
                                                    getProfileImage()
                                                }
                                                alt={
                                                    getTransporterName()
                                                }
                                            />

                                        ) : (

                                            <span>
                                                🚚
                                            </span>

                                        )}

                                    </div>


                                    <div className="dropdown-farmer-info">

                                        <strong>
                                            {getTransporterName()}
                                        </strong>

                                        <span>
                                            {transporter.email}
                                        </span>

                                    </div>

                                </div>


                                <div className="dropdown-divider">
                                </div>


                                {/* MY PROFILE */}

                                <button
                                    onClick={() => {

                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/transporter/profile"
                                        );

                                    }}
                                >

                                    <span>
                                        👤
                                    </span>

                                    My Profile

                                </button>


                                {/* EDIT PROFILE */}

                                <button
                                    onClick={() => {

                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/transporter-edit-profile"
                                        );

                                    }}
                                >

                                    <span>
                                        ✏️
                                    </span>

                                    Edit Profile

                                </button>


                                {/* VEHICLE DETAILS */}

                              

                                {/* BUSINESS DETAILS */}

                               

                                {/* DOCUMENTS */}

                                
                          


                                {/* AVAILABILITY */}

                               
                                {/* CHANGE PASSWORD */}

                                <button
                                    onClick={() => {

                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/transporter-change-password"
                                        );

                                    }}
                                >

                                    <span>
                                        🔐
                                    </span>

                                    Change Password

                                </button>


                                <div className="dropdown-divider">
                                </div>


                                {/* SETTINGS */}

                                <button
                                    onClick={() => {

                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/transporter/profile"
                                        );

                                    }}
                                >

                                    <span>
                                        ⚙️
                                    </span>

                                    Settings

                                </button>


                                {/* LOGOUT */}

                                <button
                                    className="logout-button"
                                    onClick={
                                        handleLogout
                                    }
                                >

                                    <span>
                                        🚪
                                    </span>

                                    Logout

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="farmer-dashboard-main">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="dashboard-welcome">


                    <div className="welcome-content">

                        <span className="welcome-small">
                            CROPCONNECT TRANSPORTER
                        </span>


                        <h2>
                            Welcome,{" "}
                            {getTransporterName()} 🚚
                        </h2>


                        <p>
                            Manage your transport bookings,
                            deliveries, vehicle, payments
                            and availability from one place.
                        </p>


                        <p>
                            <strong>
                                🚛 {getVehicleInfo()}
                            </strong>
                        </p>

                    </div>


                    {/* TRANSPORTER IMAGE */}

                    <div className="welcome-farmer-icon">

                        {getProfileImage() ? (

                            <img
                                src={getProfileImage()}
                                alt={getTransporterName()}
                            />

                        ) : (

                            <span>
                                🚚
                            </span>

                        )}

                    </div>

                </section>


                {/* =================================================
                    3 × 3 DASHBOARD
                ================================================= */}

                <section className="dashboard-grid">


                    {/* ROW 1 */}

                    <DashboardCard
                        icon="📦"
                        title="My Bookings"
                        onClick={() =>
                            navigate(
                                "/transporter-bookings"
                            )
                        }
                    />


                    <DashboardCard
                        icon="🚚"
                        title="My Vehicle"
                        onClick={() =>
                            navigate(
                                "/transporter/profile"
                            )
                        }
                    />


                    <DashboardCard
                        icon="🏭"
                        title="Book Warehouse"
                        onClick={() =>
                            navigate(
                                "/book-warehouse"
                            )
                        }
                    />


                    {/* ROW 2 */}

                    <DashboardCard
                        icon="💰"
                        title="Payments & Earnings"
                        onClick={() =>
                            navigate(
                                "/transporter-payments"
                            )
                        }
                    />


                    <DashboardCard
                        icon="🛒"
                        title="All Buyers"
                        onClick={() =>
                            navigate(
                                "/all-buyers"
                            )
                        }
                    />


                    <DashboardCard
                        icon="👨‍🌾"
                        title="All Farmers"
                        onClick={() =>
                            navigate(
                                "/all-farmers"
                            )
                        }
                    />


                    {/* ROW 3 */}

                    <DashboardCard
                        icon="🚚"
                        title="Emergency Transport"
                        onClick={() =>
                            navigate(
                                "/transport-management"
                            )
                        }
                    />

                    <DashboardCard
                        icon="💬"
                        title="Chats"
                        onClick={() =>
                            navigate(
                                "/transporter-chats"
                            )
                        }
                    />


                    


                    <DashboardCard
                        icon="🤖"
                        title="AI Chat"
                        onClick={() =>
                            navigate(
                                "/cropconnect-ai"
                            )
                        }
                    />

                </section>


                {/* =================================================
                    SMALL ACCOUNT MESSAGE
                ================================================= */}

                <section className="dashboard-message">


                    <div className="dashboard-message-icon">
                        🚚
                    </div>


                    <div>

                        <h3>
                            Grow With CropConnect
                        </h3>

                        <p>
                            Connect with farmers and buyers,
                            manage your deliveries and grow
                            your transportation business.
                        </p>

                    </div>

                </section>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="farmer-dashboard-footer">

                <p>
                    © {new Date().getFullYear()} CropConnect
                </p>

                <span>
                    Smart Farmer-to-Market Platform 🚚
                </span>

            </footer>

        </div>
    );
};

export default TransporterDashboard;

