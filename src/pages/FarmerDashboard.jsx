import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const FarmerDashboard = () => {

    const navigate = useNavigate();

    const [farmer, setFarmer] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);


    // =====================================================
    // LOAD LOGGED-IN FARMER
    // =====================================================

    useEffect(() => {

        const savedFarmer =
            localStorage.getItem("cropconnectFarmer");

        if (!savedFarmer) {

            navigate("/farmer-login");

            return;
        }


        try {

            const farmerData =
                JSON.parse(savedFarmer);

            setFarmer(farmerData);

        } catch (error) {

            console.error(
                "Error loading farmer:",
                error
            );

            localStorage.removeItem(
                "cropconnectFarmer"
            );

            localStorage.removeItem(
                "farmerId"
            );

            navigate("/farmer-login");
        }

    }, [navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "cropconnectFarmer"
        );

        localStorage.removeItem(
            "farmerId"
        );

        setShowProfileMenu(false);

        navigate("/farmer-login");
    };


    // =====================================================
    // FARMER IMAGE
    // =====================================================

    const getProfileImage = () => {

    if (
        !farmer ||
        !farmer.profilePhoto
    ) {
        return null;
    }

    return (
        "https://cropconnect-backend-exn7.onrender.com/api/farmers/profile-photo/" +
        encodeURIComponent(
            farmer.profilePhoto
        )
    );
};


    // =====================================================
    // FARMER NAME
    // =====================================================

    const getFarmerName = () => {

        if (!farmer) {

            return "Farmer";
        }


        return farmer.fullName || "Farmer";
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

    if (!farmer) {

        return (

            <div className="farmer-dashboard-loading">

                <div className="loading-spinner">
                </div>

                <p>
                    Loading Farmer Dashboard...
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
                        navigate("/farmer-dashboard")
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
                            Farmer Platform
                        </span>

                    </div>

                </div>


                {/* =================================================
                    CENTER - TITLE
                ================================================= */}

                <div className="dashboard-title">

                    <h1>
                        Farmer Dashboard
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
                                "/farmer-notifications"
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


                            {/* FARMER IMAGE */}

                            <div className="profile-image-wrapper">

    {getProfileImage() ? (

        <img
            src={getProfileImage()}
            alt={farmer.fullName}
            className="farmer-profile-image"
            onError={(e) => {

                console.error(
                    "Farmer image could not be loaded:",
                    getProfileImage()
                );

                e.target.style.display = "none";
            }}
        />

    ) : (

        <div className="default-farmer-image">
            👨‍🌾
        </div>

    )}


                                

                            </div>


                            {/* FARMER NAME */}

                            <div className="profile-name">

                                <strong>
                                    {getFarmerName()}
                                </strong>

                                <span>
                                    Farmer
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
                                                    getFarmerName()
                                                }
                                            />

                                        ) : (

                                            <span>
                                                👨‍🌾
                                            </span>

                                        )}

                                    </div>


                                    <div className="dropdown-farmer-info">

                                        <strong>
                                            {getFarmerName()}
                                        </strong>

                                        <span>
                                            {farmer.email}
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
                                            "/farmer-profile"
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
                                            "/edit-profile"
                                        );

                                    }}
                                >

                                    <span>
                                        ✏️
                                    </span>

                                    Edit Profile

                                </button>


                                {/* PERSONAL DETAILS */}


                                {/* CHANGE ADDRESS */}

                               

                                {/* CHANGE PASSWORD */}

                                <button
                                    onClick={() => {

                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/change-password"
                                        );

                                    }}
                                >

                                    <span>
                                        🔐
                                    </span>

                                    Change Password

                                </button>


                                {/* CHANGE LAND */}

                             
                                 

                                    

                                {/* SETTINGS */}

                                <button
                                    onClick={() => {

                                        setShowProfileMenu(
                                            false
                                        );

                                        navigate(
                                            "/farmer-profile"
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
                            CROPCONNECT FARMER
                        </span>


                        <h2>
                            Welcome, {getFarmerName()} 🌾
                        </h2>


                        <p>
                            Manage your crops, orders,
                            transportation, payments and
                            market information from one place.
                        </p>

                    </div>


                    {/* FARMER IMAGE */}

                    <div className="welcome-farmer-icon">

                        {getProfileImage() ? (

                            <img
                                src={getProfileImage()}
                                alt={getFarmerName()}
                            />

                        ) : (

                            <span>
                                👨‍🌾
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
                        icon="🌾"
                        title="My Crops"
                        onClick={() =>
                            navigate("/my-crops")
                        }
                    />


                    <DashboardCard
                        icon="📦"
                        title="Orders Received"
                        onClick={() =>
                            navigate("/farmer-orders")
                        }
                    />


                    <DashboardCard
                        icon="🚚"
                        title="Transport Booking"
                        onClick={() =>
                            navigate(
                                "/transport-management"
                            )
                        }
                    />


                    {/* ROW 2 */}

                    <DashboardCard
                        icon="🏭"
                        title="Book Warehouse"
                        onClick={() =>
                            navigate("/book-warehouse")
                        }
                    />


                    <DashboardCard
                        icon="💰"
                        title="Payments & Earnings"
                        onClick={() =>
                            navigate(
                                "/farmer-earnings"
                            )
                        }
                    />


                    <DashboardCard
                        icon="📈"
                        title="Market Prices"
                        onClick={() =>
                            navigate(
                                "/market-prices"
                            )
                        }
                    />


                    {/* ROW 3 */}

                    <DashboardCard
                        icon="🌦️"
                        title="Weather"
                        onClick={() =>
                            navigate(
                                "/weather"
                            )
                        }
                    />


                    <DashboardCard
                        icon="💬"
                        title="Chats"
                        onClick={() =>
                            navigate(
                                "/chat"
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
                        🌱
                    </div>


                    <div>

                        <h3>
                            Grow With CropConnect
                        </h3>

                        <p>
                            Connect with buyers, manage your
                            crops and grow your farming business.
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
                    Smart Farmer-to-Market Platform 🌾
                </span>

            </footer>

        </div>
    );
};

export default FarmerDashboard;
