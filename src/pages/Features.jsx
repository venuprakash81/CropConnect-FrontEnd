import React from "react";
import { Link } from "react-router-dom";
import "./Features.css";

const Features = () => {
  return (
    <div className="features-page">

      {/* ================= HERO ================= */}
      <section className="features-hero">
  <div className="features-hero-overlay"></div>

  <div className="features-hero-content">

    <div className="features-home-button">
      <Link to="/">
        ← Home
      </Link>
    </div>

    <span className="features-badge">
      🌱 CROPCONNECT FEATURES
    </span>

    <h1>
      Powerful Features for a
      <span> Smarter Agriculture</span>
    </h1>

    <p>
      CropConnect brings farmers, buyers, transport providers,
      warehouses and administrators together through one intelligent
      digital platform.
    </p>

  </div>
</section>


      {/* ================= INTRO ================= */}
      <section className="features-intro">

        <span className="section-label">
          EVERYTHING IN ONE PLATFORM
        </span>

        <h2>
          Complete Agricultural
          <span> Supply Chain Management</span>
        </h2>

        <p>
          From crop listing and market discovery to transportation,
          warehouse management and order tracking, CropConnect provides
          all the essential tools required to simplify the farmer-to-market
          journey.
        </p>

      </section>


      {/* ================= MAIN FEATURES ================= */}
      <section className="main-features">

        <div className="feature-grid">

          {/* Farmer */}
          <div className="feature-card farmer-feature">
            <div className="feature-top">
              <div className="feature-icon">👨‍🌾</div>
              <span>01</span>
            </div>

            <h3>Farmer Management</h3>

            <p>
              Give farmers the tools they need to manage crops, discover
              buyers and improve their market access.
            </p>

            <ul>
              <li>✓ Farmer registration</li>
              <li>✓ Farmer profile management</li>
              <li>✓ Add and manage crops</li>
              <li>✓ View market prices</li>
              <li>✓ Connect with buyers</li>
              <li>✓ Manage crop orders</li>
            </ul>

            <a href="/farmers">
              Explore Farmer Features →
            </a>
          </div>


          {/* Buyer */}
          <div className="feature-card buyer-feature">
            <div className="feature-top">
              <div className="feature-icon">🛒</div>
              <span>02</span>
            </div>

            <h3>Buyer Management</h3>

            <p>
              Help buyers discover agricultural products and communicate
              directly with farmers.
            </p>

            <ul>
              <li>✓ Buyer registration</li>
              <li>✓ Search agricultural products</li>
              <li>✓ View crop details</li>
              <li>✓ Contact farmers</li>
              <li>✓ Place orders</li>
              <li>✓ Track purchases</li>
            </ul>

            <a href="/buyers">
              Explore Buyer Features →
            </a>
          </div>


          {/* Market */}
          <div className="feature-card market-feature">
            <div className="feature-top">
              <div className="feature-icon">📊</div>
              <span>03</span>
            </div>

            <h3>Smart Market</h3>

            <p>
              Provide users with useful agricultural market information
              to support better buying and selling decisions.
            </p>

            <ul>
              <li>✓ Crop listings</li>
              <li>✓ Current market prices</li>
              <li>✓ Product search</li>
              <li>✓ Demand information</li>
              <li>✓ Crop comparison</li>
              <li>✓ Market opportunities</li>
            </ul>

            <a href="/market">
              Explore Market Features →
            </a>
          </div>


          {/* Delivery */}
          <div className="feature-card delivery-feature">
            <div className="feature-top">
              <div className="feature-icon">🚚</div>
              <span>04</span>
            </div>

            <h3>Smart Transportation</h3>

            <p>
              Connect agricultural products with reliable transportation
              providers and improve delivery management.
            </p>

            <ul>
              <li>✓ Delivery provider registration</li>
              <li>✓ Available delivery requests</li>
              <li>✓ Accept delivery</li>
              <li>✓ Delivery status updates</li>
              <li>✓ Order tracking</li>
              <li>✓ Delivery history</li>
            </ul>

            <a href="/transport">
              Explore Transport Features →
            </a>
          </div>


          {/* Warehouse */}
          <div className="feature-card warehouse-feature">
            <div className="feature-top">
              <div className="feature-icon">🏬</div>
              <span>05</span>
            </div>

            <h3>Warehouse Management</h3>

            <p>
              Connect farmers with suitable storage facilities and help
              manage agricultural inventory.
            </p>

            <ul>
              <li>✓ Warehouse registration</li>
              <li>✓ Storage availability</li>
              <li>✓ Storage requests</li>
              <li>✓ Capacity management</li>
              <li>✓ Product storage records</li>
              <li>✓ Warehouse history</li>
            </ul>

            <a href="/warehouses">
              Explore Warehouse Features →
            </a>
          </div>


          {/* Admin */}
          <div className="feature-card admin-feature">
            <div className="feature-top">
              <div className="feature-icon">🛡️</div>
              <span>06</span>
            </div>

            <h3>Admin Management</h3>

            <p>
              Provide administrators with complete control over users,
              products, orders and platform activities.
            </p>

            <ul>
              <li>✓ User management</li>
              <li>✓ Farmer verification</li>
              <li>✓ Buyer management</li>
              <li>✓ Crop management</li>
              <li>✓ Order monitoring</li>
              <li>✓ Reports and analytics</li>
            </ul>

            <a href="/admin">
              Explore Admin Features →
            </a>
          </div>

        </div>

      </section>


      {/* ================= SPECIAL FEATURES ================= */}
      <section className="smart-features">

        <div className="section-heading">

          <span className="section-label">
            SMART TECHNOLOGY
          </span>

          <h2>
            Technology That Makes
            <span> Agriculture Smarter</span>
          </h2>

          <p>
            CropConnect uses digital technology to improve transparency,
            connectivity and efficiency throughout the agricultural
            supply chain.
          </p>

        </div>


        <div className="smart-grid">

          <div className="smart-card">
            <div className="smart-icon">📍</div>
            <h3>Location Services</h3>
            <p>
              Help users identify nearby farmers, buyers, warehouses and
              transportation services.
            </p>
          </div>


          <div className="smart-card">
            <div className="smart-icon">🔔</div>
            <h3>Real-Time Notifications</h3>
            <p>
              Keep users informed about orders, deliveries, requests and
              important platform activities.
            </p>
          </div>


          <div className="smart-card">
            <div className="smart-icon">📦</div>
            <h3>Order Tracking</h3>
            <p>
              Monitor agricultural orders from placement through delivery.
            </p>
          </div>


          <div className="smart-card">
            <div className="smart-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>
              Protect user accounts with role-based authentication and
              secure access.
            </p>
          </div>


          <div className="smart-card">
            <div className="smart-icon">📈</div>
            <h3>Analytics & Reports</h3>
            <p>
              Generate useful information about users, crops, orders and
              supply-chain activities.
            </p>
          </div>


          <div className="smart-card">
            <div className="smart-icon">💬</div>
            <h3>Direct Communication</h3>
            <p>
              Allow farmers, buyers and service providers to communicate
              efficiently.
            </p>
          </div>

        </div>

      </section>


      {/* ================= SUPPLY CHAIN ================= */}
      <section className="feature-flow-section">

        <div className="section-heading">

          <span className="section-label">
            CONNECTED ECOSYSTEM
          </span>

          <h2>
            One Connected
            <span> Agricultural Journey</span>
          </h2>

        </div>


        <div className="feature-flow">

          <div className="flow-feature-card">
            <div className="flow-feature-icon">👨‍🌾</div>
            <h3>Farmer</h3>
            <p>List crops and connect with buyers.</p>
          </div>

          <div className="flow-feature-arrow">→</div>

          <div className="flow-feature-card">
            <div className="flow-feature-icon">🏪</div>
            <h3>Market</h3>
            <p>Discover products and market information.</p>
          </div>

          <div className="flow-feature-arrow">→</div>

          <div className="flow-feature-card">
            <div className="flow-feature-icon">🏬</div>
            <h3>Warehouse</h3>
            <p>Store products safely when required.</p>
          </div>

          <div className="flow-feature-arrow">→</div>

          <div className="flow-feature-card">
            <div className="flow-feature-icon">🚚</div>
            <h3>Transport</h3>
            <p>Move products efficiently.</p>
          </div>

          <div className="flow-feature-arrow">→</div>

          <div className="flow-feature-card">
            <div className="flow-feature-icon">🛒</div>
            <h3>Buyer</h3>
            <p>Receive agricultural products.</p>
          </div>

        </div>

      </section>


      {/* ================= BENEFITS ================= */}
      <section className="benefits-section">

        <div className="benefits-content">

          <div className="benefits-image">
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=85"
              alt="Smart agriculture"
            />
          </div>


          <div className="benefits-text">

            <span className="section-label">
              WHY CROPCONNECT?
            </span>

            <h2>
              Benefits for the
              <span> Entire Ecosystem</span>
            </h2>

            <p>
              CropConnect is designed to create value for every participant
              in the agricultural supply chain.
            </p>

            <div className="benefit-item">
              <span>✓</span>
              <div>
                <h3>Better Market Access</h3>
                <p>
                  Farmers can reach more potential buyers.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>✓</span>
              <div>
                <h3>Improved Transparency</h3>
                <p>
                  Users can access clearer information throughout the
                  supply chain.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>✓</span>
              <div>
                <h3>Reduced Delays</h3>
                <p>
                  Digital coordination helps improve transportation and
                  order management.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <span>✓</span>
              <div>
                <h3>Reduced Product Wastage</h3>
                <p>
                  Better storage and transportation coordination can help
                  reduce post-harvest losses.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="features-cta">

        <div className="features-cta-content">

          <span className="section-label">
            START TODAY
          </span>

          <h2>
            Experience the Future of
            <span> Agricultural Supply Chains</span>
          </h2>

          <p>
            Join CropConnect and become part of a connected agricultural
            ecosystem.
          </p>

          <div className="features-cta-buttons">

            <a href="/signup" className="features-primary-btn">
              Get Started →
            </a>

            <a href="/about" className="features-outline-btn">
              Learn More
            </a>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="features-footer">

        <div className="features-footer-container">

          <div className="footer-brand">
            <h2>🌱 Crop<span>Connect</span></h2>

            <p>
              Smart technology for a connected and sustainable agricultural
              supply chain.
            </p>
          </div>

          <div className="footer-links">
            <h3>Platform</h3>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/features">Features</a>
            <a href="/market">Market</a>
          </div>

          <div className="footer-links">
            <h3>Services</h3>
            <a href="/farmers">Farmers</a>
            <a href="/buyers">Buyers</a>
            <a href="/transport">Transport</a>
            <a href="/warehouses">Warehouses</a>
          </div>

          <div className="footer-links">
            <h3>Contact</h3>
            <p>📧 support@cropconnect.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 India</p>
          </div>

        </div>

        <div className="features-footer-bottom">
          © 2026 CropConnect. All Rights Reserved.
        </div>

      </footer>

    </div>
  );
};

export default Features;