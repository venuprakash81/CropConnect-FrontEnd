import React from "react";
import { Link } from "react-router-dom";
import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="how-page">

      {/* ================= HERO ================= */}
      <section className="how-hero">

        <div className="how-hero-overlay"></div>

        <div className="how-hero-content">

          <div className="how-home-button">
            <Link to="/">
              ← Home
            </Link>
          </div>

          <span className="how-badge">
            🌱 HOW CROPCONNECT WORKS
          </span>

          <h1>
            From <span>Farm</span> to
            <br />
            <span>Market</span>, Made Simple
          </h1>

          <p>
            CropConnect connects farmers, buyers, warehouses and transport
            providers through one simple and transparent agricultural
            supply-chain platform.
          </p>

        </div>

      </section>


      {/* ================= INTRO ================= */}
      <section className="how-intro">

        <span className="section-label">
          SIMPLE & CONNECTED
        </span>

        <h2>
          How Does <span>CropConnect</span> Work?
        </h2>

        <p>
          CropConnect simplifies the traditional agricultural supply chain
          by connecting every participant on a single digital platform.
          From listing a crop to completing delivery, every step can be
          managed efficiently.
        </p>

      </section>


      {/* ================= MAIN PROCESS ================= */}
      <section className="process-section">

        <div className="process-container">

          {/* STEP 01 */}
          <div className="process-row">

            <div className="process-number">
              01
            </div>

            <div className="process-icon">
              👨‍🌾
            </div>

            <div className="process-content">

              <span>STEP 01</span>

              <h3>Farmer Registers</h3>

              <p>
                Farmers create an account on CropConnect and provide their
                basic information, location and farming details.
              </p>

              <ul>
                <li>✓ Create farmer account</li>
                <li>✓ Add farm information</li>
                <li>✓ Manage farmer profile</li>
              </ul>

            </div>

          </div>


          {/* STEP 02 */}
          <div className="process-row reverse">

            <div className="process-number">
              02
            </div>

            <div className="process-icon">
              🌾
            </div>

            <div className="process-content">

              <span>STEP 02</span>

              <h3>Farmer Lists Crops</h3>

              <p>
                Farmers can add the agricultural products they want to sell
                with details such as crop name, quantity, price and location.
              </p>

              <ul>
                <li>✓ Add crop details</li>
                <li>✓ Set available quantity</li>
                <li>✓ Add expected price</li>
              </ul>

            </div>

          </div>


          {/* STEP 03 */}
          <div className="process-row">

            <div className="process-number">
              03
            </div>

            <div className="process-icon">
              🔎
            </div>

            <div className="process-content">

              <span>STEP 03</span>

              <h3>Buyer Discovers Crops</h3>

              <p>
                Buyers can browse available agricultural products and find
                crops based on category, location, quantity and price.
              </p>

              <ul>
                <li>✓ Search crops</li>
                <li>✓ Compare products</li>
                <li>✓ View farmer details</li>
              </ul>

            </div>

          </div>


          {/* STEP 04 */}
          <div className="process-row reverse">

            <div className="process-number">
              04
            </div>

            <div className="process-icon">
              🛒
            </div>

            <div className="process-content">

              <span>STEP 04</span>

              <h3>Buyer Places Order</h3>

              <p>
                After selecting a crop, the buyer can place an order and
                specify the required quantity and delivery information.
              </p>

              <ul>
                <li>✓ Select crop</li>
                <li>✓ Enter quantity</li>
                <li>✓ Place order</li>
              </ul>

            </div>

          </div>


          {/* STEP 05 */}
          <div className="process-row">

            <div className="process-number">
              05
            </div>

            <div className="process-icon">
              🏬
            </div>

            <div className="process-content">

              <span>STEP 05</span>

              <h3>Warehouse Storage</h3>

              <p>
                If storage is required, farmers or buyers can identify
                available warehouse facilities and submit a storage request.
              </p>

              <ul>
                <li>✓ Find nearby warehouse</li>
                <li>✓ Check storage capacity</li>
                <li>✓ Submit storage request</li>
              </ul>

            </div>

          </div>


          {/* STEP 06 */}
          <div className="process-row reverse">

            <div className="process-number">
              06
            </div>

            <div className="process-icon">
              🚚
            </div>

            <div className="process-content">

              <span>STEP 06</span>

              <h3>Transport is Assigned</h3>

              <p>
                Transport providers can view available delivery requests
                and accept suitable transportation jobs.
              </p>

              <ul>
                <li>✓ View delivery requests</li>
                <li>✓ Accept delivery</li>
                <li>✓ Update delivery status</li>
              </ul>

            </div>

          </div>


          {/* STEP 07 */}
          <div className="process-row">

            <div className="process-number">
              07
            </div>

            <div className="process-icon">
              📍
            </div>

            <div className="process-content">

              <span>STEP 07</span>

              <h3>Order is Tracked</h3>

              <p>
                The delivery progress can be monitored so that users can
                understand the current status of their agricultural order.
              </p>

              <ul>
                <li>✓ Track delivery</li>
                <li>✓ View current status</li>
                <li>✓ Receive notifications</li>
              </ul>

            </div>

          </div>


          {/* STEP 08 */}
          <div className="process-row reverse">

            <div className="process-number">
              08
            </div>

            <div className="process-icon">
              ✅
            </div>

            <div className="process-content">

              <span>STEP 08</span>

              <h3>Delivery Completed</h3>

              <p>
                The agricultural product reaches the buyer and the order
                is marked as successfully completed.
              </p>

              <ul>
                <li>✓ Product delivered</li>
                <li>✓ Order completed</li>
                <li>✓ Delivery history updated</li>
              </ul>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FLOW ================= */}
      <section className="simple-flow-section">

        <div className="section-heading">

          <span className="section-label">
            COMPLETE JOURNEY
          </span>

          <h2>
            The CropConnect
            <span> Supply Chain</span>
          </h2>

          <p>
            Every participant has a role in moving agricultural products
            efficiently from the farm to the final buyer.
          </p>

        </div>


        <div className="simple-flow">

          <div className="simple-flow-card">
            <div>👨‍🌾</div>
            <h3>Farmer</h3>
            <p>Produces & lists crops</p>
          </div>

          <span>→</span>

          <div className="simple-flow-card">
            <div>🌾</div>
            <h3>Crop Listing</h3>
            <p>Products become available</p>
          </div>

          <span>→</span>

          <div className="simple-flow-card">
            <div>🛒</div>
            <h3>Buyer</h3>
            <p>Selects products</p>
          </div>

          <span>→</span>

          <div className="simple-flow-card">
            <div>🏬</div>
            <h3>Warehouse</h3>
            <p>Storage when required</p>
          </div>

          <span>→</span>

          <div className="simple-flow-card">
            <div>🚚</div>
            <h3>Transport</h3>
            <p>Moves the product</p>
          </div>

          <span>→</span>

          <div className="simple-flow-card">
            <div>✅</div>
            <h3>Delivery</h3>
            <p>Order completed</p>
          </div>

        </div>

      </section>


      {/* ================= USER ROLES ================= */}
      <section className="roles-section">

        <div className="section-heading">

          <span className="section-label">
            FOR EVERYONE
          </span>

          <h2>
            One Platform,
            <span> Multiple Roles</span>
          </h2>

        </div>


        <div className="roles-grid">

          <div className="role-card">
            <div className="role-icon">👨‍🌾</div>
            <h3>Farmers</h3>
            <p>
              List crops, manage products, connect with buyers and track
              orders.
            </p>
            <Link to="/farmer-register">
              Join as Farmer →
            </Link>
          </div>


          <div className="role-card">
            <div className="role-icon">🛒</div>
            <h3>Buyers</h3>
            <p>
              Discover agricultural products and purchase directly from
              farmers.
            </p>
            <Link to="/buyer-register">
              Join as Buyer →
            </Link>
          </div>


          <div className="role-card">
            <div className="role-icon">🚚</div>
            <h3>Transport Providers</h3>
            <p>
              Accept delivery requests and manage agricultural transportation.
            </p>
            <Link to="/transport-register">
              Join as Transport →
            </Link>
          </div>


          <div className="role-card">
            <div className="role-icon">🏬</div>
            <h3>Warehouse Providers</h3>
            <p>
              Manage storage capacity and provide storage services to users.
            </p>
            <Link to="/warehouse-register">
              Join as Warehouse →
            </Link>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="how-cta">

        <div className="how-cta-content">

          <span className="section-label">
            START YOUR JOURNEY
          </span>

          <h2>
            Ready to Join the
            <span> CropConnect Ecosystem?</span>
          </h2>

          <p>
            Connect with farmers, buyers, warehouses and transport providers
            through one smart agricultural platform.
          </p>

          <div className="how-cta-buttons">

            <Link to="/" className="how-primary-btn">
              Get Started →
            </Link>

            <Link to="/features" className="how-outline-btn">
              Explore Features
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="how-footer">

        <div className="how-footer-container">

          <div className="how-footer-brand">

            <h2>
              🌱 Crop<span>Connect</span>
            </h2>

            <p>
              Connecting farmers, markets and communities for a smarter
              agricultural future.
            </p>

          </div>


          <div className="how-footer-links">

            <h3>Platform</h3>

            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/features">Features</Link>
            <Link to="/how-it-works">How It Works</Link>

          </div>


          <div className="how-footer-links">

            <h3>Services</h3>

            <Link to="/farmers">Farmers</Link>
            <Link to="/buyers">Buyers</Link>
            <Link to="/transport">Transport</Link>
            <Link to="/warehouses">Warehouses</Link>

          </div>


          <div className="how-footer-links">

            <h3>Contact</h3>

            <p>📧 support@cropconnect.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 India</p>

          </div>

        </div>


        <div className="how-footer-bottom">
          © 2026 CropConnect. All Rights Reserved.
        </div>

      </footer>

    </div>
  );
};

export default HowItWorks;