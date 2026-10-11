import React from "react";
import { Link } from "react-router-dom";

import {
  Sprout,
  ShoppingCart,
  Truck,
  Warehouse,
  CloudSun,
  Bot,
  TrendingUp,
  Users,
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Store,
  Leaf,
  Phone,
  Mail,
  LogIn,
  UserPlus,
  Menu,
  X,
  Package,
  DollarSign,
  MessageCircle,
  Database,
  Globe,
} from "lucide-react";

import "./Home.css";

function Home() {
  const [mobileMenu, setMobileMenu] = React.useState(false);

  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="home-navbar">

        <div className="home-container navbar-inner">

          {/* LOGO */}

          <Link to="/" className="home-logo">

            <span className="logo-icon">
              <Sprout size={25} />
            </span>

            <span className="logo-text">
              Crop<span>Connect</span>
            </span>

          </Link>


          {/* DESKTOP NAVIGATION */}

          <div className="home-nav-links">

            <Link to="/" className="active">
              Home
            </Link>

            <Link to="/features">
              Features
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>


          {/* LOGIN + REGISTER */}

          <div className="home-nav-actions">

            {/* LOGIN DROPDOWN */}

            <div className="login-dropdown">

              <button className="nav-login">

                <LogIn size={17} />

                Login

                <span className="dropdown-arrow">
                  ▾
                </span>

              </button>


              <div className="login-menu">

                <div className="dropdown-title">
                  Login As
                </div>


                <Link to="/farmer-login">
                  <span className="menu-icon farmer">
                    🌾
                  </span>

                  <span>
                    <strong>Farmer</strong>
                    <small>Farmer account</small>
                  </span>
                </Link>


                <Link to="/buyer-login">
                  <span className="menu-icon buyer">
                    🛒
                  </span>

                  <span>
                    <strong>Buyer</strong>
                    <small>Buyer account</small>
                  </span>
                </Link>


                <Link to="/transporter-login">
                  <span className="menu-icon transporter">
                    🚚
                  </span>

                  <span>
                    <strong>Transporter</strong>
                    <small>Transport account</small>
                  </span>
                </Link>


                <Link to="/warehouse-login">
                  <span className="menu-icon warehouse">
                    🏬
                  </span>

                  <span>
                    <strong>Warehouse</strong>
                    <small>Warehouse account</small>
                  </span>
                </Link>


                <div className="dropdown-divider"></div>


                <Link
                  to="/admin/login"
                  className="admin-menu-link"
                >

                  <span className="menu-icon admin">
                    🔐
                  </span>

                  <span>
                    <strong>Admin</strong>
                    <small>Administrator access</small>
                  </span>

                </Link>

              </div>

            </div>


            {/* REGISTER DROPDOWN */}

            <div className="register-dropdown">

              <button className="nav-register">

                <UserPlus size={17} />

                Register

                <span className="dropdown-arrow">
                  ▾
                </span>

              </button>


              <div className="register-menu">

                <div className="dropdown-title">
                  Create Account
                </div>


                <Link to="/farmer-register">

                  <span className="menu-icon farmer">
                    🌾
                  </span>

                  <span>
                    <strong>Farmer</strong>
                    <small>Sell your crops</small>
                  </span>

                </Link>


                <Link to="/buyer-register">

                  <span className="menu-icon buyer">
                    🛒
                  </span>

                  <span>
                    <strong>Buyer</strong>
                    <small>Buy crops directly</small>
                  </span>

                </Link>


                <Link to="/transport-register">

                  <span className="menu-icon transporter">
                    🚚
                  </span>

                  <span>
                    <strong>Transporter</strong>
                    <small>Provide transportation</small>
                  </span>

                </Link>


                <Link to="/warehouse-register">

                  <span className="menu-icon warehouse">
                    🏬
                  </span>

                  <span>
                    <strong>Warehouse</strong>
                    <small>Provide storage</small>
                  </span>

                </Link>

              </div>

            </div>

          </div>


          {/* MOBILE BUTTON */}

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
          >

            {mobileMenu ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}

          </button>

        </div>


        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileMenu && (

          <div className="mobile-menu">

            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </Link>

            <Link
              to="/features"
              onClick={() => setMobileMenu(false)}
            >
              Features
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenu(false)}
            >
              About
            </Link>

            <Link
              to="/how-it-works"
              onClick={() => setMobileMenu(false)}
            >
              How It Works
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenu(false)}
            >
              Contact
            </Link>


            <div className="mobile-menu-heading">
              LOGIN
            </div>


            <Link
              to="/farmer-login"
              onClick={() => setMobileMenu(false)}
            >
              🌾 Farmer Login
            </Link>

            <Link
              to="/buyer-login"
              onClick={() => setMobileMenu(false)}
            >
              🛒 Buyer Login
            </Link>

            <Link
              to="/transporter-login"
              onClick={() => setMobileMenu(false)}
            >
              🚚 Transporter Login
            </Link>

            <Link
              to="/warehouse-login"
              onClick={() => setMobileMenu(false)}
            >
              🏬 Warehouse Login
            </Link>

            <Link
              to="/admin/login"
              onClick={() => setMobileMenu(false)}
            >
              🔐 Admin Login
            </Link>


            <div className="mobile-menu-heading">
              REGISTER
            </div>


            <Link
              to="/farmer-register"
              onClick={() => setMobileMenu(false)}
            >
              🌾 Farmer Registration
            </Link>

            <Link
              to="/buyer-register"
              onClick={() => setMobileMenu(false)}
            >
              🛒 Buyer Registration
            </Link>

            <Link
              to="/transport-register"
              onClick={() => setMobileMenu(false)}
            >
              🚚 Transporter Registration
            </Link>

            <Link
              to="/warehouse-register"
              onClick={() => setMobileMenu(false)}
            >
              🏬 Warehouse Registration
            </Link>

          </div>

        )}

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section" id="home">

        <div className="home-container hero-grid">

          <div className="hero-content">

            <div className="hero-badge">

              <Sprout size={17} />

              Smart Agriculture • Digital Marketplace

            </div>


            <h1>

              Connecting

              <span> Farmers </span>

              Directly With

              <strong> Buyers</strong>

            </h1>


            <p className="hero-description">

              CropConnect is a smart agriculture platform that
              connects farmers, buyers, transporters and
              warehouses in one connected digital ecosystem.

            </p>


            <p className="hero-sub-description">

              Sell crops, discover buyers, check market prices,
              arrange transportation, find warehouses and manage
              agricultural activities from one platform.

            </p>


            <div className="hero-buttons">

              <Link
                to="/farmer-register"
                className="primary-btn"
              >

                Get Started

                <ArrowRight size={19} />

              </Link>


              <Link
                to="/how-it-works"
                className="secondary-btn"
              >

                How It Works

              </Link>

            </div>


            <div className="hero-trust">

              <div>

                <CheckCircle size={17} />

                Direct Farmer-Buyer Connection

              </div>


              <div>

                <CheckCircle size={17} />

                Smart Logistics

              </div>


              <div>

                <CheckCircle size={17} />

                AI Support

              </div>

            </div>

          </div>


          {/* HERO IMAGE */}

          <div className="hero-visual">

            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000"
                alt="Agricultural field"
              />


              <div className="floating-card price-card">

                <div className="floating-icon">

                  <TrendingUp size={20} />

                </div>

                <div>

                  <small>
                    Market Price
                  </small>

                  <strong>
                    ₹2,450 / Qtl
                  </strong>

                  <span>
                    ↑ Updated Today
                  </span>

                </div>

              </div>


              <div className="floating-card farmer-card">

                <div className="farmer-avatar">
                  🌾
                </div>

                <div>

                  <strong>
                    Farmer Connected
                  </strong>

                  <small>
                    Direct buyer connection
                  </small>

                </div>

                <CheckCircle size={19} />

              </div>

            </div>

            <div className="hero-circle circle-one"></div>

            <div className="hero-circle circle-two"></div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-section">

        <div className="home-container stats-grid">

          <div className="stat-item">

            <div className="stat-icon">
              <Users size={22} />
            </div>

            <div>
              <strong>4+</strong>
              <span>User Roles</span>
            </div>

          </div>


          <div className="stat-item">

            <div className="stat-icon">
              <Leaf size={22} />
            </div>

            <div>
              <strong>Smart</strong>
              <span>Agriculture</span>
            </div>

          </div>


          <div className="stat-item">

            <div className="stat-icon">
              <Truck size={22} />
            </div>

            <div>
              <strong>Easy</strong>
              <span>Transportation</span>
            </div>

          </div>


          <div className="stat-item">

            <div className="stat-icon">
              <Bot size={22} />
            </div>

            <div>
              <strong>AI</strong>
              <span>Powered Support</span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="about-preview" id="about">

        <div className="home-container about-grid">

          <div className="about-image">

            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900"
              alt="Farmer working"
            />

            <div className="about-experience">

              <Sprout size={23} />

              <div>

                <strong>
                  Smart Farming
                </strong>

                <span>
                  Connected Marketplace
                </span>

              </div>

            </div>

          </div>


          <div className="about-content">

            <span className="section-label">
              ABOUT CROPCONNECT
            </span>


            <h2>

              One Platform For The

              <span>
                Complete Agriculture Ecosystem
              </span>

            </h2>


            <p>

              CropConnect brings important agricultural
              activities together in one digital platform.

            </p>


            <p>

              Farmers can list crops and connect with buyers.
              Buyers can discover available crops. Transporters
              can manage delivery requests and warehouse owners
              can provide storage facilities.

            </p>


            <div className="about-checks">

              <div>
                <CheckCircle size={19} />
                Direct marketplace connection
              </div>

              <div>
                <CheckCircle size={19} />
                Transportation management
              </div>

              <div>
                <CheckCircle size={19} />
                Warehouse booking
              </div>

              <div>
                <CheckCircle size={19} />
                Market price information
              </div>

              <div>
                <CheckCircle size={19} />
                Weather information
              </div>

              <div>
                <CheckCircle size={19} />
                AI-powered assistance
              </div>

            </div>


            <Link
              to="/about"
              className="outline-btn"
            >

              Learn More

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="features-section"
        id="features"
      >

        <div className="home-container">

          <div className="section-heading">

            <span className="section-label">
              PLATFORM FEATURES
            </span>

            <h2>

              Everything You Need

              <span>
                In One Place
              </span>

            </h2>

            <p>

              CropConnect connects every important part
              of the agricultural supply chain.

            </p>

          </div>


          <div className="features-grid">


            {/* CROP */}

            <Link
              to="/all-crops"
              className="feature-card"
            >

              <div className="feature-icon green">
                <Leaf size={27} />
              </div>

              <h3>
                Crop Marketplace
              </h3>

              <p>

                Farmers can list crops with quantity,
                price and other important details.
                Buyers can browse available crops.

              </p>

              <span>
                View Crops
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* MARKET */}

            <Link
              to="/market-prices"
              className="feature-card"
            >

              <div className="feature-icon blue">
                <TrendingUp size={27} />
              </div>

              <h3>
                Market Prices
              </h3>

              <p>

                Check crop market price information
                and make informed buying and selling
                decisions.

              </p>

              <span>
                View Prices
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* WEATHER */}

            <Link
              to="/weather"
              className="feature-card"
            >

              <div className="feature-icon sky">
                <CloudSun size={27} />
              </div>

              <h3>
                Weather
              </h3>

              <p>

                Access weather information to help
                farmers plan agricultural activities.

              </p>

              <span>
                Check Weather
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* TRANSPORT */}

            <Link
              to="/all-transporters"
              className="feature-card"
            >

              <div className="feature-icon purple">
                <Truck size={27} />
              </div>

              <h3>
                Transportation
              </h3>

              <p>

                Find transporters and manage
                agricultural crop transportation.

              </p>

              <span>
                Find Transport
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* WAREHOUSE */}

            <Link
              to="/admin/warehouses"
              className="feature-card"
            >

              <div className="feature-icon brown">
                <Warehouse size={27} />
              </div>

              <h3>
                Warehouse
              </h3>

              <p>

                Find storage facilities and manage
                warehouse-related activities.

              </p>

              <span>
                Explore Warehouses
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* PAYMENTS */}

            <Link
              to="/buyer-payments"
              className="feature-card"
            >

              <div className="feature-icon orange">
                <DollarSign size={27} />
              </div>

              <h3>
                Payments
              </h3>

              <p>

                Manage crop-related payment information
                and transaction records.

              </p>

              <span>
                View Payments
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* CHAT */}

            <Link
              to="/chat"
              className="feature-card"
            >

              <div className="feature-icon pink">
                <MessageCircle size={27} />
              </div>

              <h3>
                Communication
              </h3>

              <p>

                Connect users through the platform
                communication and messaging system.

              </p>

              <span>
                Open Chat
                <ArrowRight size={16} />
              </span>

            </Link>


            {/* AI */}

            <div className="feature-card">

              <div className="feature-icon dark">
                <Bot size={27} />
              </div>

              <h3>
                CropConnect AI
              </h3>

              <p>

                AI-powered assistance designed to provide
                useful information about CropConnect,
                agriculture and project operations.

              </p>

              <span>
                AI Powered
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          USER ROLES
      ===================================================== */}

      <section className="roles-section">

        <div className="home-container">

          <div className="section-heading">

            <span className="section-label">
              CROPCONNECT USERS
            </span>

            <h2>

              Built For Every Part Of

              <span>
                The Supply Chain
              </span>

            </h2>

            <p>

              Different user roles work together through
              one connected agricultural platform.

            </p>

          </div>


          <div className="roles-grid">


            {/* FARMER */}

            <div className="role-card">

              <div className="role-number">
                01
              </div>

              <div className="role-icon">
                <Sprout size={28} />
              </div>

              <h3>
                Farmers
              </h3>

              <p>

                Farmers can register, add crops,
                manage orders, view earnings and
                arrange transportation.

              </p>

              <Link to="/farmer-register">
                Register as Farmer
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* BUYER */}

            <div className="role-card">

              <div className="role-number">
                02
              </div>

              <div className="role-icon">
                <Store size={28} />
              </div>

              <h3>
                Buyers
              </h3>

              <p>

                Buyers can discover crops, place
                orders, manage payments and
                arrange transportation.

              </p>

              <Link to="/buyer-register">
                Register as Buyer
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* TRANSPORTER */}

            <div className="role-card">

              <div className="role-number">
                03
              </div>

              <div className="role-icon">
                <Truck size={28} />
              </div>

              <h3>
                Transporters
              </h3>

              <p>

                Transporters can receive booking
                requests and manage agricultural
                deliveries.

              </p>

              <Link to="/transport-register">
                Register as Transporter
                <ArrowRight size={16} />
              </Link>

            </div>


            {/* WAREHOUSE */}

            <div className="role-card">

              <div className="role-number">
                04
              </div>

              <div className="role-icon">
                <Warehouse size={28} />
              </div>

              <h3>
                Warehouse Owners
              </h3>

              <p>

                Warehouse owners can register storage
                facilities and manage warehouse bookings.

              </p>

              <Link to="/warehouse-register">
                Register as Warehouse
                <ArrowRight size={16} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="home-container">

          <div className="section-heading">

            <span className="section-label">
              SIMPLE PROCESS
            </span>

            <h2>

              How CropConnect

              <span>
                Works
              </span>

            </h2>

            <p>

              A simple digital workflow connecting
              agricultural supply and demand.

            </p>

          </div>


          <div className="steps-grid">


            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                <UserPlus size={22} />
              </div>

              <h3>
                Register
              </h3>

              <p>

                Create an account as a farmer,
                buyer, transporter or warehouse owner.

              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                <Globe size={22} />
              </div>

              <h3>
                Connect
              </h3>

              <p>

                Find crops, buyers, transporters
                and warehouses.

              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                <Package size={22} />
              </div>

              <h3>
                Transact
              </h3>

              <p>

                Manage crop orders, transportation,
                warehouse bookings and payments.

              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                04
              </div>

              <div className="step-icon">
                <BarChart3 size={22} />
              </div>

              <h3>
                Grow
              </h3>

              <p>

                Use market information, weather data
                and AI assistance for better decisions.

              </p>

            </div>

          </div>


          <div className="how-action">

            <Link
              to="/how-it-works"
              className="primary-btn"
            >

              View Complete Process

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          TECHNOLOGY
      ===================================================== */}

      <section className="technology-section">

        <div className="home-container technology-grid">

          <div className="technology-content">

            <span className="section-label">
              SMART TECHNOLOGY
            </span>

            <h2>

              Technology That

              <span>
                Connects Agriculture
              </span>

            </h2>

            <p>

              CropConnect combines modern web technologies,
              digital marketplace functionality, real-time
              information and AI assistance to create a
              connected agricultural ecosystem.

            </p>


            <div className="technology-list">

              <div>

                <BarChart3 size={19} />

                <span>
                  Market information
                </span>

              </div>


              <div>

                <MapPin size={19} />

                <span>
                  Location-based services
                </span>

              </div>


              <div>

                <Bot size={19} />

                <span>
                  AI-powered assistance
                </span>

              </div>


              <div>

                <ShieldCheck size={19} />

                <span>
                  Secure user management
                </span>

              </div>


              <div>

                <Database size={19} />

                <span>
                  Digital data management
                </span>

              </div>


              <div>

                <Globe size={19} />

                <span>
                  Connected marketplace
                </span>

              </div>

            </div>

          </div>


          <div className="technology-card">

            <div className="tech-card-icon">

              <Bot size={38} />

            </div>

            <h3>
              CropConnect AI
            </h3>

            <p>

              An AI-powered assistant designed to help
              users understand CropConnect features,
              workflows and project information.

            </p>


            <div className="ai-status">

              <span></span>

              AI System Ready

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cta-section">

        <div className="home-container cta-content">

          <div className="cta-icon">

            <Sprout size={34} />

          </div>


          <h2>

            Ready To Connect With

            <span>
              CropConnect?
            </span>

          </h2>


          <p>

            Join the digital agriculture ecosystem and make
            crop trading, transportation and storage easier.

          </p>


          <div className="cta-buttons">

            <Link
              to="/farmer-register"
              className="cta-primary"
            >

              Create Farmer Account

              <ArrowRight size={18} />

            </Link>


            <Link
              to="/buyer-register"
              className="cta-secondary"
            >

              Create Buyer Account

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        className="contact-preview"
        id="contact"
      >

        <div className="home-container contact-grid">

          <div>

            <span className="section-label">
              GET IN TOUCH
            </span>


            <h2>

              Have Questions About

              <span>
                CropConnect?
              </span>

            </h2>


            <p>

              Learn more about our platform, features,
              agricultural marketplace and user services.

            </p>

          </div>


          <div className="contact-options">

            <div className="contact-item">

              <div>
                <Mail size={21} />
              </div>

              <span>
                Email
              </span>

              <strong>
                support@cropconnect.com
              </strong>

            </div>


            <div className="contact-item">

              <div>
                <Phone size={21} />
              </div>

              <span>
                Support
              </span>

              <strong>
                CropConnect Support
              </strong>

            </div>


            <Link
              to="/contact"
              className="contact-link"
            >

              Contact Us

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div className="home-container footer-grid">


          {/* BRAND */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >

              <span>
                <Sprout size={22} />
              </span>

              CropConnect

            </Link>


            <p>

              Empowering farmers and connecting
              agricultural markets through technology.

            </p>

          </div>


          {/* PLATFORM */}

          <div className="footer-column">

            <h4>
              Platform
            </h4>

            <Link to="/features">
              Features
            </Link>

            <Link to="/market-prices">
              Market Prices
            </Link>

            <Link to="/weather">
              Weather
            </Link>

            <Link to="/all-crops">
              Available Crops
            </Link>

            <Link to="/all-transporters">
              Transporters
            </Link>

          </div>


          {/* USERS */}

          <div className="footer-column">

            <h4>
              User Accounts
            </h4>

            <Link to="/farmer-register">
              Farmer Registration
            </Link>

            <Link to="/buyer-register">
              Buyer Registration
            </Link>

            <Link to="/transport-register">
              Transporter Registration
            </Link>

            <Link to="/warehouse-register">
              Warehouse Registration
            </Link>

          </div>


          {/* LOGIN */}

          <div className="footer-column">

            <h4>
              Login
            </h4>

            <Link to="/farmer-login">
              Farmer Login
            </Link>

            <Link to="/buyer-login">
              Buyer Login
            </Link>

            <Link to="/transporter-login">
              Transporter Login
            </Link>

            <Link to="/warehouse-login">
              Warehouse Login
            </Link>

            <Link to="/admin/login">
              Admin Login
            </Link>

          </div>


          {/* COMPANY */}

          <div className="footer-column">

            <h4>
              Company
            </h4>

            <Link to="/about">
              About
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>

        </div>


        <div className="home-container footer-bottom">

          <p>
            © 2026 CropConnect. All Rights Reserved.
          </p>

          <p>
            Empowering Farmers • Connecting Markets
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;