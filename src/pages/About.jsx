import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* ================= HERO ================= */}
      <section className="about-hero">
  <div className="about-hero-overlay"></div>

  <div className="about-hero-content">

    <div className="about-home-button">
      <Link to="/">
        ← Home
      </Link>
    </div>

    <span className="about-badge">
      🌱 ABOUT CROPCONNECT
    </span>

    <h1>
      Transforming Agriculture
      <span> Through Technology</span>
    </h1>

    <p>
      CropConnect is a smart digital platform designed to connect
      farmers, buyers, transport providers and warehouses through
      one integrated agricultural supply chain.
    </p>

  </div>
</section>


      {/* ================= INTRODUCTION ================= */}
      <section className="about-intro">

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1000&q=85"
            alt="Agriculture field"
          />

          <div className="image-card">
            <span>🌾</span>
            <div>
              <strong>Smart Agriculture</strong>
              <small>Connecting Farm to Market</small>
            </div>
          </div>
        </div>

        <div className="about-text">

          <span className="section-label">
            WHO WE ARE
          </span>

          <h2>
            A Smarter Way to
            <span> Connect Agriculture</span>
          </h2>

          <p>
            Agriculture is one of the most important sectors of our society,
            but farmers often face challenges such as limited market access,
            unpredictable prices, transportation problems and lack of storage
            facilities.
          </p>

          <p>
            CropConnect addresses these challenges by creating a digital
            ecosystem where farmers can connect directly with buyers while
            transport providers and warehouses become part of the same
            connected supply chain.
          </p>

          <p>
            Our goal is to make the agricultural supply chain more transparent,
            efficient and beneficial for every participant.
          </p>

          <div className="about-checks">
            <div>✓ Direct Farmer-to-Buyer Connection</div>
            <div>✓ Transparent Market Information</div>
            <div>✓ Smart Transportation Management</div>
            <div>✓ Warehouse & Storage Connectivity</div>
          </div>

        </div>

      </section>


      {/* ================= MISSION VISION ================= */}
      <section className="mission-section">

        <div className="section-heading">

          <span className="section-label">
            OUR PURPOSE
          </span>

          <h2>
            Mission & <span>Vision</span>
          </h2>

          <p>
            Creating a connected agricultural ecosystem where technology
            supports farmers and improves the entire supply chain.
          </p>

        </div>

        <div className="mission-grid">

          <div className="mission-card">
            <div className="mission-icon">🎯</div>

            <h3>Our Mission</h3>

            <p>
              To empower farmers with better market access, fair pricing,
              demand information and direct connections with buyers while
              improving transportation and storage management.
            </p>
          </div>


          <div className="mission-card vision-card">
            <div className="mission-icon">🔭</div>

            <h3>Our Vision</h3>

            <p>
              To build a smart and sustainable agricultural ecosystem where
              farmers, buyers, logistics providers and warehouses work together
              efficiently through digital technology.
            </p>
          </div>

        </div>

      </section>


      {/* ================= PROBLEMS ================= */}
      <section className="problem-section">

        <div className="section-heading">

          <span className="section-label">
            THE CHALLENGE
          </span>

          <h2>
            Problems Faced by
            <span> Farmers</span>
          </h2>

          <p>
            Traditional agricultural supply chains create several challenges
            that affect farmers, buyers and consumers.
          </p>

        </div>

        <div className="problem-grid">

          <div className="problem-card">
            <span className="problem-number">01</span>
            <div className="problem-icon">💰</div>
            <h3>Low Farmer Profit</h3>
            <p>
              Multiple intermediaries can reduce the amount farmers receive
              for their products.
            </p>
          </div>

          <div className="problem-card">
            <span className="problem-number">02</span>
            <div className="problem-icon">📊</div>
            <h3>Lack of Market Information</h3>
            <p>
              Farmers may not have easy access to current prices and market
              demand information.
            </p>
          </div>

          <div className="problem-card">
            <span className="problem-number">03</span>
            <div className="problem-icon">🚚</div>
            <h3>Transportation Issues</h3>
            <p>
              Finding reliable and affordable transportation can be difficult,
              especially for small farmers.
            </p>
          </div>

          <div className="problem-card">
            <span className="problem-number">04</span>
            <div className="problem-icon">🏚️</div>
            <h3>Storage Problems</h3>
            <p>
              Limited access to suitable storage can result in post-harvest
              losses and forced low-price sales.
            </p>
          </div>

        </div>

      </section>


      {/* ================= SOLUTION ================= */}
      <section className="solution-section">

        <div className="solution-content">

          <div className="solution-text">

            <span className="section-label">
              OUR SOLUTION
            </span>

            <h2>
              One Platform for the
              <span> Complete Supply Chain</span>
            </h2>

            <p>
              CropConnect brings all major participants of the agricultural
              supply chain onto one platform.
            </p>

            <div className="solution-list">

              <div className="solution-item">
                <span>01</span>
                <div>
                  <h3>Farmers</h3>
                  <p>
                    List crops, view market opportunities and connect with
                    buyers.
                  </p>
                </div>
              </div>

              <div className="solution-item">
                <span>02</span>
                <div>
                  <h3>Buyers</h3>
                  <p>
                    Find agricultural products and communicate directly with
                    farmers.
                  </p>
                </div>
              </div>

              <div className="solution-item">
                <span>03</span>
                <div>
                  <h3>Transport Providers</h3>
                  <p>
                    Manage delivery requests and transport agricultural
                    products efficiently.
                  </p>
                </div>
              </div>

              <div className="solution-item">
                <span>04</span>
                <div>
                  <h3>Warehouses</h3>
                  <p>
                    Provide storage facilities and manage available storage
                    capacity.
                  </p>
                </div>
              </div>

            </div>

          </div>


          <div className="solution-image">

            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1100&q=85"
              alt="Farmer working in agricultural field"
            />

            <div className="solution-stat">
              <strong>Farm → Market</strong>
              <span>Connected Supply Chain</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= VALUES ================= */}
      <section className="values-section">

        <div className="section-heading">

          <span className="section-label">
            OUR VALUES
          </span>

          <h2>
            What We <span>Believe In</span>
          </h2>

        </div>

        <div className="values-grid">

          <div className="value-card">
            <div>🤝</div>
            <h3>Transparency</h3>
            <p>
              Creating transparent interactions between farmers, buyers and
              service providers.
            </p>
          </div>

          <div className="value-card">
            <div>⚡</div>
            <h3>Efficiency</h3>
            <p>
              Reducing unnecessary delays and improving agricultural
              supply-chain operations.
            </p>
          </div>

          <div className="value-card">
            <div>🌱</div>
            <h3>Sustainability</h3>
            <p>
              Supporting sustainable agricultural practices and reducing
              product wastage.
            </p>
          </div>

          <div className="value-card">
            <div>👨‍🌾</div>
            <h3>Farmer First</h3>
            <p>
              Designing our platform around the needs and challenges of
              farmers.
            </p>
          </div>

        </div>

      </section>


      {/* ================= SUPPLY CHAIN ================= */}
      <section className="about-flow-section">

        <div className="section-heading">

          <span className="section-label">
            OUR ECOSYSTEM
          </span>

          <h2>
            From <span>Farm to Market</span>
          </h2>

          <p>
            CropConnect creates a connected flow of agricultural products
            through every stage of the supply chain.
          </p>

        </div>

        <div className="about-flow">

          <div className="about-flow-item">
            <div className="about-flow-icon">👨‍🌾</div>
            <h3>Farmer</h3>
            <p>Crop Production</p>
          </div>

          <div className="about-flow-line"></div>

          <div className="about-flow-item">
            <div className="about-flow-icon">🏬</div>
            <h3>Warehouse</h3>
            <p>Safe Storage</p>
          </div>

          <div className="about-flow-line"></div>

          <div className="about-flow-item">
            <div className="about-flow-icon">🚛</div>
            <h3>Transport</h3>
            <p>Delivery</p>
          </div>

          <div className="about-flow-line"></div>

          <div className="about-flow-item">
            <div className="about-flow-icon">🛒</div>
            <h3>Buyer</h3>
            <p>Market Purchase</p>
          </div>

        </div>

      </section>


      {/* ================= TEAM ================= */}
      <section className="team-section">

        <div className="section-heading">

          <span className="section-label">
            OUR TEAM
          </span>

          <h2>
            Meet the <span>Agritech Team</span>
          </h2>

          <p>
            A team working together to build a smarter farmer-to-market
            ecosystem.
          </p>

        </div>

        <div className="team-grid">

          <div className="team-card">
            <div className="team-avatar">VP</div>
            <h3>VENU PRAKASH DEVARASHETTY</h3>
            <p>Team Member</p>
          </div>

          <div className="team-card">
            <div className="team-avatar">NS</div>
            <h3>NARSIMHA SAI LAGISHETTY</h3>
            <p>Team Member</p>
          </div>

          <div className="team-card">
            <div className="team-avatar">KG</div>
            <h3>K. GNANESHWAR</h3>
            <p>Team Member</p>
          </div>

          <div className="team-card">
            <div className="team-avatar">MH</div>
            <h3>M. HARSHIT</h3>
            <p>Team Member</p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="about-cta">

        <div className="about-cta-content">

          <span className="section-label">
            JOIN CROPCONNECT
          </span>

          <h2>
            Together, Let's Build a
            <span> Smarter Agricultural Future</span>
          </h2>

          <p>
            Connect with farmers, buyers, transport providers and warehouses
            through CropConnect.
          </p>

          <div className="about-cta-buttons">
            <a href="/signup" className="about-primary-btn">
              Get Started →
            </a>

            <a href="/contact" className="about-outline-btn">
              Contact Us
            </a>
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="about-footer">

        <div className="about-footer-container">

          <div>
            <div className="about-footer-logo">
              🌱 Crop<span>Connect</span>
            </div>

            <p>
              Smart technology for a connected and sustainable agricultural
              supply chain.
            </p>
          </div>

          <div>
            <h3>Platform</h3>
            <a href="/">Home</a>
            <a href="/market">Market</a>
            <a href="/farmers">Farmers</a>
            <a href="/buyers">Buyers</a>
          </div>

          <div>
            <h3>Services</h3>
            <a href="/transport">Transport</a>
            <a href="/warehouses">Warehouses</a>
            <a href="/orders">Orders</a>
            <a href="/contact">Contact</a>
          </div>

          <div>
            <h3>Contact</h3>
            <p>📧 support@cropconnect.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 India</p>
          </div>

        </div>

        <div className="about-footer-bottom">
          © 2026 CropConnect | Smart Farmer-to-Market Supply Chain Management
          System
        </div>

      </footer>

    </div>
  );
};

export default About;