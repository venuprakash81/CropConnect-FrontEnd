import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyCrops.css";

function MyCrops() {

    const navigate = useNavigate();

    const [crops, setCrops] = useState([]);

    useEffect(() => {

        loadCrops();

    }, []);

    const loadCrops = async () => {

        try {

            const response = await axios.get(
                "https://cropconnect-backend-exn7.onrender.com/crop/all"
            );

            setCrops(response.data);

        }

        catch(error){

            console.log(error);

        }

    };

    const deleteCrop = async(id)=>{

        if(!window.confirm("Delete this crop?")){

            return;

        }

        try{

            await axios.delete(
                "http://localhost:8081/crop/delete/"+id
            );

            alert("Crop Deleted Successfully");

            loadCrops();

        }

        catch(error){

            console.log(error);

        }

    };

    return(

        <div className="my-crops-container">

            <div className="page-header">

                <h1>🌾 My Crops</h1>

                <div className="header-buttons">

                    <button
                        className="back-btn"
                        onClick={() => navigate("/farmer-dashboard")}
                    >
                        ⬅ Dashboard
                    </button>

                    <button
                        className="add-btn"
                        onClick={() => navigate("/add-crop")}
                    >
                        ➕ Add Crop
                    </button>

                </div>

            </div>

            <div className="crop-grid">

                {

                    crops.length===0 ?

                    <h2>No Crops Found</h2>

                    :

                    crops.map((crop)=>(

                        <div
                            key={crop.id}
                            className="crop-card"
                        >

                            <img
                                src={`http://localhost:8081/uploads/${crop.image}`}
                                alt={crop.cropName}
                                className="crop-image"
                            />

                            <div className="crop-body">

                                <h2>{crop.cropName}</h2>

                                <p>

                                    <strong>Quantity :</strong>

                                    {crop.quantity}

                                    {" "}

                                    {crop.quantityUnit}

                                </p>

                                <p>

                                    <strong>Price :</strong>

                                    ₹{crop.expectedPrice}

                                </p>

                                <p>

                                    <strong>Status :</strong>

                                    {crop.status}

                                </p>

                                <div className="crop-buttons">

                                    <button

                                        className="view-btn"

                                        onClick={() =>
                                            navigate("/crop-details/" + crop.id)
                                        }

                                    >

                                        View Details

                                    </button><button
    className="edit-btn"
    onClick={() =>
        navigate("/edit-crop/" + crop.id)
    }
>
    ✏ Edit
</button>

<button
    className="delete-btn"
    onClick={() =>
        deleteCrop(crop.id)
    }
>
    🗑 Delete
</button>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default MyCrops;
