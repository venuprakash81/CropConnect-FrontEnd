import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SellCrop.css";

function SellCrop() {

    const navigate = useNavigate();

    const farmer = JSON.parse(localStorage.getItem("farmer"));

    const [myCrops, setMyCrops] = useState([]);

    const [sellCrop, setSellCrop] = useState({

        cropId: "",

        quantity: "",

        price: "",

        availableDate: "",

        description: "",

        paymentMode: "Cash",

        deliveryType: "Pickup"

    });

    useEffect(() => {

        loadMyCrops();

    }, []);

    const loadMyCrops = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8081/crop/all"
            );

            setMyCrops(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const handleChange = (e) => {

        setSellCrop({

            ...sellCrop,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(

                "http://localhost:8081/sellcrop/save",

                {

                    farmerId: farmer.id,

                    cropId: sellCrop.cropId,

                    quantity: sellCrop.quantity,

                    price: sellCrop.price,

                    availableDate: sellCrop.availableDate,

                    description: sellCrop.description,

                    paymentMode: sellCrop.paymentMode,

                    deliveryType: sellCrop.deliveryType

                }

            );

            alert("Crop Listed Successfully");

            navigate("/my-crops");

        }

        catch (error) {

            console.log(error);

            alert("Unable to List Crop");

        }

    };

    return (

        <div className="sell-container">

            <div className="sell-card">

                <h1>🌾 Sell Crop</h1>

                <form onSubmit={handleSubmit}>

                    <label>Select Crop</label>

                    <select
                        name="cropId"
                        value={sellCrop.cropId}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Crop
                        </option>

                        {
                            myCrops.map((crop) => (

                                <option
                                    key={crop.id}
                                    value={crop.id}
                                >
                                    {crop.cropName}
                                </option>

                            ))
                        }

                    </select>

                    <label>Quantity</label>

                    <input
                        type="number"
                        name="quantity"
                        value={sellCrop.quantity}
                        onChange={handleChange}
                        placeholder="Enter Quantity"
                        required
                    />

                    <label>Selling Price (₹)</label>

                    <input
                        type="number"
                        name="price"
                        value={sellCrop.price}
                        onChange={handleChange}
                        placeholder="Enter Price"
                        required
                    />

                    <label>Available Date</label>

                    <input
                        type="date"
                        name="availableDate"
                        value={sellCrop.availableDate}
                        onChange={handleChange}
                        required
                    /><label>Description</label>

<textarea
    name="description"
    value={sellCrop.description}
    onChange={handleChange}
    placeholder="Write crop details..."
    rows="4"
/>

<label>Payment Mode</label>

<select
    name="paymentMode"
    value={sellCrop.paymentMode}
    onChange={handleChange}
>

    <option value="Cash">Cash</option>

    <option value="UPI">UPI</option>

    <option value="Bank Transfer">Bank Transfer</option>

</select>

<label>Delivery Type</label>

<select
    name="deliveryType"
    value={sellCrop.deliveryType}
    onChange={handleChange}
>

    <option value="Pickup">Pickup</option>

    <option value="Home Delivery">Home Delivery</option>

    <option value="Transport Required">
        Transport Required
    </option>

</select>

<div className="farmer-box">

    <h3>👨 Farmer Information</h3>

    <p><strong>Name :</strong> {farmer?.name}</p>

    <p><strong>Phone :</strong> {farmer?.phone}</p>

    <p><strong>Village :</strong> {farmer?.village}</p>

    <p><strong>District :</strong> {farmer?.district}</p>

</div>

<div className="button-group">

    <button
        type="submit"
        className="sell-btn"
    >
        🌾 List Crop for Sale
    </button>

    <button
        type="button"
        className="back-btn"
        onClick={() => navigate("/farmer-dashboard")}
    >
        ⬅ Back to Dashboard
    </button>

</div>

</form>

</div>

</div>

);

}

export default SellCrop;