import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page">

      {/* ================= HERO ================= */}
      <section className="contact-hero">

        <div className="contact-hero-overlay"></div>

        <div className="contact-hero-content">

          <div className="contact-home-button">
            <Link to="/">
              ← Home
            </Link>
          </div>

          <span className="contact-badge">
            📞 CONTACT CROPCONNECT
          </span>

          <h1>
            Let's <span>Connect</span>
            <br />
            & Grow Together
          </h1>

          <p>
            Have a question, suggestion or need support?
            Our team is here to help you connect with the
            CropConnect agricultural ecosystem.
          </p>

        </div>

      </section>


      {/* ================= CONTACT INFO ================= */}
      <section className="contact-info-section">

        <div className="section-heading">

          <span className="section-label">
            GET IN TOUCH
          </span>

          <h2>
            We're Here to
            <span> Help You</span>
          </h2>

          <p>
            Whether you are a farmer, buyer, transport provider or warehouse
            provider, you can reach out to us for assistance.
          </p>

        </div>


        <div className="contact-info-grid">

          {/* Email */}
          <div className="contact-info-card">

            <div className="contact-info-icon">
              📧
            </div>

            <h3>Email Us</h3>

            <p>
              Send us your questions or requirements.
            </p>

            <a href="mailto:support@cropconnect.com">
              support@cropconnect.com
            </a>

          </div>


          {/* Phone */}
          <div className="contact-info-card">

            <div className="contact-info-icon">
              📞
            </div>

            <h3>Call Us</h3>

            <p>
              Our support team is available to help.
            </p>

            <a href="tel:+919876543210">
              +91 98765 43210
            </a>

          </div>


          {/* Location */}
          <div className="contact-info-card">

            <div className="contact-info-icon">
              📍
            </div>

            <h3>Our Location</h3>

            <p>
              Visit us or connect with our team.
            </p>

            <span>
              India
            </span>

          </div>


          {/* Support */}
          <div className="contact-info-card">

            <div className="contact-info-icon">
              🕐
            </div>

            <h3>Support Hours</h3>

            <p>
              Monday – Saturday
            </p>

            <span>
              9:00 AM – 6:00 PM
            </span>

          </div>

        </div>

      </section>


      {/* ================= CONTACT FORM ================= */}
      <section className="contact-form-section">

        <div className="contact-form-container">

          {/* LEFT SIDE */}
          <div className="contact-form-text">

            <span className="section-label">
              SEND US A MESSAGE
            </span>

            <h2>
              How Can We
              <span> Help You?</span>
            </h2>

            <p>
              Fill out the form and tell us what you need. Our team will
              review your message and get back to you.
            </p>


            <div className="contact-points">

              <div className="contact-point">
                <span>✓</span>
                <div>
                  <h3>Farmer Support</h3>
                  <p>
                    Help with crop listings, orders and farmer accounts.
                  </p>
                </div>
              </div>


              <div className="contact-point">
                <span>✓</span>
                <div>
                  <h3>Buyer Support</h3>
                  <p>
                    Assistance with product search and purchasing.
                  </p>
                </div>
              </div>


              <div className="contact-point">
                <span>✓</span>
                <div>
                  <h3>Delivery Support</h3>
                  <p>
                    Help with delivery assignments and tracking.
                  </p>
                </div>
              </div>


              <div className="contact-point">
                <span>✓</span>
                <div>
                  <h3>Technical Support</h3>
                  <p>
                    Assistance with accounts and platform issues.
                  </p>
                </div>
              </div>

            </div>

          </div>


          {/* RIGHT SIDE FORM */}
          <div className="contact-form-box">

            {submitted && (
              <div className="success-message">
                ✓ Your message has been submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                  />

                </div>


                <div className="form-group">

                  <label>
                    I am a
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select your role
                    </option>

                    <option value="farmer">
                      Farmer
                    </option>

                    <option value="buyer">
                      Buyer
                    </option>

                    <option value="transport">
                      Transport Provider
                    </option>

                    <option value="warehouse">
                      Warehouse Provider
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Subject *
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is your message about?"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Message *
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="6"
                  required
                ></textarea>

              </div>


              <button
                type="submit"
                className="contact-submit-btn"
              >
                Send Message →
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* ================= WHY CONTACT ================= */}
      <section className="contact-help-section">

        <div className="section-heading">

          <span className="section-label">
            WE'RE HERE FOR YOU
          </span>

          <h2>
            How Can We
            <span> Support You?</span>
          </h2>

        </div>


        <div className="help-grid">

          <div className="help-card">

            <div className="help-icon">
              👨‍🌾
            </div>

            <h3>Farmer Assistance</h3>

            <p>
              Get assistance with account creation, crop listings,
              market access and orders.
            </p>

            <Link to="/signup">
              Join as Farmer →
            </Link>

          </div>


          <div className="help-card">

            <div className="help-icon">
              🛒
            </div>

            <h3>Buyer Assistance</h3>

            <p>
              Get help finding agricultural products, placing orders
              and managing purchases.
            </p>

            <Link to="/signup">
              Join as Buyer →
            </Link>

          </div>


          <div className="help-card">

            <div className="help-icon">
              🚚
            </div>

            <h3>Transport Assistance</h3>

            <p>
              Get support with delivery requests, assignments and
              transportation tracking.
            </p>

            <Link to="/signup">
              Join as Transport →
            </Link>

          </div>


          <div className="help-card">

            <div className="help-icon">
              🏬
            </div>

            <h3>Warehouse Assistance</h3>

            <p>
              Get support with storage registration, capacity and
              storage requests.
            </p>

            <Link to="/signup">
              Join as Warehouse →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= MAP ================= */}
      <section className="map-section">

        <div className="map-container">

          <div className="map-text">

            <span className="section-label">
              FIND US
            </span>

            <h2>
              CropConnect
              <span> India</span>
            </h2>

            <p>
              CropConnect is designed to connect agricultural communities
              across India through a digital farmer-to-market ecosystem.
            </p>

            <div className="map-details">

              <div>
                📍
                <span>
                  India
                </span>
              </div>

              <div>
                📧
                <span>
                  support@cropconnect.com
                </span>
              </div>

              <div>
                📞
                <span>
                  +91 98765 43210
                </span>
              </div>

            </div>

          </div>


          <div className="map-box">

            <div className="map-placeholder">

              <div className="map-pin">
                📍
              </div>

              <h3>
                CropConnect
              </h3>

              <p>
                India
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="contact-cta">

        <div className="contact-cta-content">

          <span className="section-label">
            CONNECT WITH US
          </span>

          <h2>
            Have Questions?
            <span> We're Here to Help.</span>
          </h2>

          <p>
            Join CropConnect and become part of a smarter and more connected
            agricultural ecosystem.
          </p>

          <div className="contact-cta-buttons">

            <Link
              to="/signup"
              className="contact-primary-btn"
            >
              Get Started →
            </Link>

            <Link
              to="/how-it-works"
              className="contact-outline-btn"
            >
              How It Works
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="contact-footer">

        <div className="contact-footer-container">

          <div className="contact-footer-brand">

            <h2>
              🌱 Crop<span>Connect</span>
            </h2>

            <p>
              Connecting farmers, markets and communities for a smarter
              agricultural future.
            </p>

          </div>


          <div className="contact-footer-links">

            <h3>Platform</h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/features">
              Features
            </Link>

            <Link to="/how-it-works">
              How It Works
            </Link>

          </div>


          <div className="contact-footer-links">

            <h3>Services</h3>

            <Link to="/farmers">
              Farmers
            </Link>

            <Link to="/buyers">
              Buyers
            </Link>

            <Link to="/transport">
              Transport
            </Link>

            <Link to="/warehouses">
              Warehouses
            </Link>

          </div>


          <div className="contact-footer-links">

            <h3>Contact</h3>

            <p>📧 support@cropconnect.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 India</p>

          </div>

        </div>


        <div className="contact-footer-bottom">
          © 2026 CropConnect. All Rights Reserved.
        </div>

      </footer>

    </div>
  );
};

export default Contact;