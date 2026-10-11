import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./DeliveryLogin.css";

function DeliveryLogin() {

    const navigate = useNavigate();

    const [delivery, setDelivery] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setDelivery({
            ...delivery,
            [e.target.name]: e.target.value
        });

    };

    const loginDelivery = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(

                "https://cropconnect-backend-exn7.onrender.com/delivery/login",

                delivery

            );

            if (response.data) {

                localStorage.setItem(
                    "delivery",
                    JSON.stringify(response.data)
                );

                alert("Login Successful");

                navigate("/delivery-dashboard");

            } else {

                alert("Invalid Email or Password");

            }

        }

        catch (error) {

            console.log(error);

            alert("Login Failed");

        }

    };

    return (

        <div className="delivery-login-container">

            <div className="delivery-login-card">

                <h1>Delivery Partner Login</h1>

                <form onSubmit={loginDelivery}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={delivery.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={delivery.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">

                        Login

                    </button>

                    <p>

                        Don't have an account?

                        <Link to="/delivery-register">

                            Register

                        </Link>

                    </p>

                </form>

            </div>

        </div>

    );

}

export default DeliveryLogin;
