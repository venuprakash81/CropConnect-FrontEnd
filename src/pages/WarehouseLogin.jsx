import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./WarehouseLogin.css";

const WarehouseLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  // ==========================================
  // LOGIN
  // ==========================================

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
        "http://localhost:8081/api/auth/warehouse-login",
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


      // ==========================================
      // SAVE LOGIN DATA
      // ==========================================

      localStorage.setItem(
        "cropconnectWarehouse",
        JSON.stringify(result)
      );


      alert("Warehouse login successful!");


      // ==========================================
      // DASHBOARD
      // ==========================================

      navigate("/warehouse/dashboard");


    } catch (error) {

      console.error(
        "Warehouse login error:",
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


  return (

    <div className="warehouse-login-page">


      {/* ==========================================
           HOME BUTTON
      ========================================== */}

      <button
        className="warehouse-home-button"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>



      {/* ==========================================
           LOGIN CARD
      ========================================== */}

      <div className="warehouse-login-card">


        {/* ==========================================
             HEADER
        ========================================== */}

        <div className="warehouse-login-header">

          <div className="warehouse-login-icon">
            🏬
          </div>

          <h1>
            Warehouse Login
          </h1>

          <p>
            Login to your CropConnect Warehouse Account
          </p>

        </div>



        {/* ==========================================
             LOGIN FORM
        ========================================== */}

        <form onSubmit={handleLogin}>


          {/* EMAIL */}

          <div className="warehouse-form-group">

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
            />

          </div>



          {/* PASSWORD */}

          <div className="warehouse-form-group">

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
            />

          </div>



          {/* OPTIONS */}

          <div className="warehouse-login-options">

            <label>

              <input
                type="checkbox"
              />

              Remember me

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
            className="warehouse-login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "🔐 Login as Warehouse"
            }

          </button>

        </form>



        {/* ==========================================
             REGISTER
        ========================================== */}

        <div className="warehouse-no-account">

          <p>
            Don't have a Warehouse account?
          </p>

          <button
            onClick={() =>
              navigate("/warehouse-register")
            }
          >
            ✨ Create Warehouse Account
          </button>

        </div>



        {/* ==========================================
             OTHER LOGIN
        ========================================== */}

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
                navigate("/transporter-login")
              }
            >
              🚚 Transporter
            </button>

          </div>

        </div>


      </div>

    </div>

  );
};

export default WarehouseLogin;