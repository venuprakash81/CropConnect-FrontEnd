import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./DeliveryRegister.css";

function DeliveryRegister() {

    const navigate = useNavigate();

    const [delivery, setDelivery] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        aadhaarNumber: "",
        drivingLicenseNumber: "",
        vehicleType: "",
        vehicleNumber: "",
        address: "",
        state: "",
        district: "",
        pincode: ""
    });

    const [profileImage, setProfileImage] = useState(null);
    const [vehicleImage, setVehicleImage] = useState(null);

    const handleChange = (e) => {
        setDelivery({
            ...delivery,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileImage = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleVehicleImage = (e) => {
        setVehicleImage(e.target.files[0]);
    };

    const registerDelivery = async (e) => {

        e.preventDefault();

        if (delivery.password !== delivery.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const formData = new FormData();

        formData.append("fullName", delivery.fullName);
        formData.append("email", delivery.email);
        formData.append("phone", delivery.phone);
        formData.append("password", delivery.password);

        formData.append("aadhaarNumber", delivery.aadhaarNumber);
        formData.append("drivingLicenseNumber", delivery.drivingLicenseNumber);

        formData.append("vehicleType", delivery.vehicleType);
        formData.append("vehicleNumber", delivery.vehicleNumber);

        formData.append("address", delivery.address);
        formData.append("state", delivery.state);
        formData.append("district", delivery.district);
        formData.append("pincode", delivery.pincode);

        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        if (vehicleImage) {
            formData.append("vehicleImage", vehicleImage);
        }

        try {

            await axios.post(
                "http://localhost:8081/delivery/register",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("Delivery Partner Registered Successfully");

            navigate("/delivery-login");

        } catch (error) {

            console.log(error);

            if (error.response) {
                alert(error.response.data);
            } else {
                alert("Registration Failed");
            }
        }
    };    return (
        <div className="delivery-register-container">

            <div className="delivery-card">

                <h1>Delivery Partner Registration</h1>

                <form onSubmit={registerDelivery}>

                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={delivery.fullName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={delivery.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={delivery.phone}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={delivery.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={delivery.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="aadhaarNumber"
                        placeholder="Aadhaar Number"
                        value={delivery.aadhaarNumber}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="drivingLicenseNumber"
                        placeholder="Driving License Number"
                        value={delivery.drivingLicenseNumber}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="vehicleType"
                        value={delivery.vehicleType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="Bike">Bike</option>
                        <option value="Auto">Auto</option>
                        <option value="Mini Truck">Mini Truck</option>
                        <option value="Pickup Van">Pickup Van</option>
                        <option value="Tractor">Tractor</option>
                        <option value="Lorry">Lorry</option>
                    </select>

                    <input
                        type="text"
                        name="vehicleNumber"
                        placeholder="Vehicle Number"
                        value={delivery.vehicleNumber}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="address"
                        placeholder="Address"
                        rows="3"
                        value={delivery.address}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={delivery.state}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="district"
                        placeholder="District"
                        value={delivery.district}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        value={delivery.pincode}
                        onChange={handleChange}
                        required
                    />

                    <label className="upload-label">
                        Upload Profile Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImage}
                        required
                    />

                    <label className="upload-label">
                        Upload Vehicle Photo
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleVehicleImage}
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                    <p className="login-link">
                        Already have an account?
                        <Link to="/delivery-login"> Login</Link>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default DeliveryRegister;