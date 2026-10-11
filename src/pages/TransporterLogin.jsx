import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransporterLogin.css";

const TransporterLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  // ===============================
  // LOGIN
  // ===============================

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email.trim()) {

      alert("Please enter your email.");

      return;
    }

    if (!password.trim()) {

      alert("Please enter your password.");

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8081/api/transporters/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );


      const result = await response.json();


      if (!response.ok) {

        alert(
          result.message ||
          "Invalid email or password."
        );

        return;
      }


      // ===============================
      // SAVE LOGIN DATA
      // ===============================

      localStorage.setItem(
        "cropconnectTransporter",
        JSON.stringify(result.transporter)
      );

      localStorage.setItem(
        "transporterId",
        result.transporterId
      );


      alert("Transporter login successful!");


      // ===============================
      // GO TO DASHBOARD
      // ===============================

      navigate("/transporter/dashboard");


    } catch (error) {

      console.error(
        "Transporter login error:",
        error
      );

      alert(
        "Unable to connect to backend.\n\n" +
        "Make sure Spring Boot is running on port 8081."
      );

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // UI
  // ===============================

  return (

    <div className="transporter-login-page">

      {/* HOME BUTTON */}

      <button
        className="transporter-home-button"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>


      {/* LOGIN CARD */}

      <div className="transporter-login-card">


        {/* HEADER */}

        <div className="transporter-login-header">

          <div className="transporter-login-icon">
            🚚
          </div>

          <h1>
            Transporter Login
          </h1>

          <p>
            Login to your CropConnect Transporter Account
          </p>

        </div>


        {/* FORM */}

        <form onSubmit={handleLogin}>


          {/* EMAIL */}

          <div className="transporter-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
            />

          </div>


          {/* PASSWORD */}

          <div className="transporter-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              autoComplete="current-password"
            />

          </div>


          {/* OPTIONS */}

          <div className="transporter-login-options">

            <label>

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>


            <button
              type="button"
              onClick={() =>
                alert(
                  "Forgot password feature coming soon."
                )
              }
            >
              Forgot Password?
            </button>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="transporter-login-button"
            disabled={loading}
          >

            {loading
              ? "⏳ Logging in..."
              : "🔐 Login as Transporter"}

          </button>

        </form>


        {/* REGISTER */}

        <div className="transporter-no-account">

          <p>
            Don't have a Transporter account?
          </p>

          <button
            onClick={() =>
              navigate("/transporter-register")
            }
          >
            ✨ Create Transporter Account
          </button>

        </div>


        {/* OTHER LOGIN */}

        <div className="other-login">

          <p>
            Login as another user
          </p>

          <div className="other-login-buttons">

            <button
              onClick={() =>
                navigate("/farmer-login")
              }
            >
              👨‍🌾 Farmer
            </button>


            <button
              onClick={() =>
                navigate("/buyer-login")
              }
            >
              🛒 Buyer
            </button>


            <button
              onClick={() =>
                navigate("/warehouse-login")
              }
            >
              🏬 Warehouse
            </button>

          </div>

        </div>


      </div>

    </div>
  );
};

export default TransporterLogin;