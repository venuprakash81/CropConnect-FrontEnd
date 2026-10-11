import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FarmerLogin.css";

const FarmerLogin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "https://cropconnect-backend-exn7.onrender.com/api/auth/farmer-login",
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


      // Store farmer information
      localStorage.setItem(
        "cropconnectFarmer",
        JSON.stringify(result)
      );

      alert("Farmer login successful!");


      // Go to dashboard
      navigate("/farmer-dashboard");


    } catch (error) {

      console.error(
        "Farmer Login Error:",
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

    <div className="farmer-login-page">


      {/* HOME BUTTON */}

      <button
        className="farmer-home-button"
        onClick={() => navigate("/")}
      >
        🏠 Home
      </button>


      {/* LOGIN CARD */}

      <div className="farmer-login-card">


        {/* HEADER */}

        <div className="farmer-login-header">

          <div className="farmer-login-icon">
            👨‍🌾
          </div>

          <h1>
            Farmer Login
          </h1>

          <p>
            Login to your CropConnect Farmer Account
          </p>

        </div>


        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>


          {/* EMAIL */}

          <div className="farmer-form-group">

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

          <div className="farmer-form-group">

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

          <div className="farmer-login-options">

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
            className="farmer-login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "🔐 Login as Farmer"}

          </button>


        </form>


        {/* REGISTER */}

        <div className="farmer-no-account">

          <p>
            Don't have a Farmer account?
          </p>

          <button
            onClick={() =>
              navigate("/farmer-register")
            }
          >
            ✨ Create Farmer Account
          </button>

        </div>


        {/* OTHER LOGIN BUTTONS */}

        <div className="other-login">

          <p>
            Login as another user
          </p>


          <div>

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

export default FarmerLogin;
