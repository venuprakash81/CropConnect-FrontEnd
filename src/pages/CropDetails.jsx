import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CropDetails.css";

function CropDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [crop, setCrop] = useState({});

    useEffect(() => {

        loadCrop();

    }, []);

    const loadCrop = async () => {

        try {

            const response = await axios.get(

                "https://cropconnect-backend-exn7.onrender.com/crop/" + id

            );

            setCrop(response.data);

        }

        catch(error){

            console.log(error);

        }

    };

    const deleteCrop = async()=>{

        if(!window.confirm("Do you want to delete this crop?")){

            return;

        }

        try{

            await axios.delete(

                "https://cropconnect-backend-exn7.onrender.com/crop/delete/" + id

            );

            alert("Crop Deleted Successfully");

            navigate("/my-crops");

        }

        catch(error){

            console.log(error);

        }

    };

    return(

        <div className="crop-details-page">

            <div className="details-card">

                <div className="top-header">

                    <button
                        className="back-btn"
                        onClick={() => navigate("/my-crops")}
                    >
                        ⬅ Back
                    </button>

                    <h1>🌾 Crop Details</h1>

                </div>

                <img

                    src={`https://cropconnect-backend-exn7.onrender.com/uploads/${crop.image}`}

                    alt={crop.cropName}

                    className="details-image"

                />

                <h2>{crop.cropName}</h2>

                <div className="details-grid"></div>
                <div className="detail-item">
    <h3>🌱 Variety</h3>
    <p>{crop.variety}</p>
</div>

<div className="detail-item">
    <h3>📦 Quantity</h3>
    <p>{crop.quantity} {crop.quantityUnit}</p>
</div>

<div className="detail-item">
    <h3>💰 Expected Price</h3>
    <p>₹ {crop.expectedPrice}</p>
</div>

<div className="detail-item">
    <h3>📅 Harvest Date</h3>
    <p>{crop.harvestDate}</p>
</div>

<div className="detail-item">
    <h3>📊 Status</h3>
    <p>{crop.status}</p>
</div>

<div className="detail-item">
    <h3>🏡 Village</h3>
    <p>{crop.village}</p>
</div>

<div className="detail-item">
    <h3>🏙 District</h3>
    <p>{crop.district}</p>
</div>

<div className="detail-item">
    <h3>🌍 State</h3>
    <p>{crop.state}</p>
</div>

<div className="detail-item">
    <h3>📮 Pincode</h3>
    <p>{crop.pincode}</p>
</div>

<div className="detail-item">
    <h3>📍 Latitude</h3>
    <p>{crop.latitude}</p>
</div>

<div className="detail-item">
    <h3>📍 Longitude</h3>
    <p>{crop.longitude}</p>
</div>

</div>

<div className="action-buttons">

    <button
        className="edit-btn"
        onClick={() =>
            navigate("/edit-crop/" + crop.id)
        }
    >
        ✏ Edit Crop
    </button>

    <button
        className="delete-btn"
        onClick={deleteCrop}
    >
        🗑 Delete Crop
    </button>

    <button
        className="dashboard-btn"
        onClick={() =>
            navigate("/farmer-dashboard")
        }
    >
        🏠 Dashboard
    </button>

</div>

</div>



);

}

export default CropDetails;
