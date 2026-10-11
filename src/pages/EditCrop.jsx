import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EditCrop.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationMarker({ location, setLocation }) {

    useMapEvents({

        click(e){

            setLocation({

                lat:e.latlng.lat,

                lng:e.latlng.lng

            });

        }

    });

    return(

        <Marker position={[location.lat,location.lng]} />

    );

}

function EditCrop(){

    const navigate=useNavigate();

    const {id}=useParams();

    const [preview,setPreview]=useState("");

    const [location,setLocation]=useState({

        lat:17.3850,

        lng:78.4867

    });

    const [crop,setCrop]=useState({

        cropName:"",

        variety:"",

        quantity:"",

        quantityUnit:"Quintals",

        expectedPrice:"",

        harvestDate:"",

        status:"",

        village:"",

        district:"",

        state:"",

        pincode:"",

        image:null

    });

    useEffect(()=>{

        loadCrop();

    },[]);

    const loadCrop=async()=>{

        try{

            const response=await axios.get(

                "https://cropconnect-backend-exn7.onrender.com/crop/"+id

            );

            setCrop(response.data);

            setPreview(

                "https://cropconnect-backend-exn7.onrender.com/uploads/"+response.data.image

            );

            setLocation({

                lat:response.data.latitude,

                lng:response.data.longitude

            });

        }

        catch(error){

            console.log(error);

        }

    };

    const handleChange=(e)=>{

        setCrop({

            ...crop,

            [e.target.name]:e.target.value

        });

    };

    const handleImage=(e)=>{

        const file=e.target.files[0];

        if(file){

            setCrop({

                ...crop,

                image:file

            });

            setPreview(URL.createObjectURL(file));

        }

    };const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("id", id);

    formData.append("cropName", crop.cropName);
    formData.append("variety", crop.variety);
    formData.append("quantity", crop.quantity);
    formData.append("quantityUnit", crop.quantityUnit);
    formData.append("expectedPrice", crop.expectedPrice);
    formData.append("harvestDate", crop.harvestDate);
    formData.append("status", crop.status);

    formData.append("village", crop.village);
    formData.append("district", crop.district);
    formData.append("state", crop.state);
    formData.append("pincode", crop.pincode);

    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);

    if(crop.image != null){

        formData.append("image", crop.image);

    }

    try{

        await axios.put(

            "http://localhost:8081/crop/update",

            formData,

            {

                headers:{

                    "Content-Type":"multipart/form-data"

                }

            }

        );

        alert("Crop Updated Successfully");

        navigate("/my-crops");

    }

    catch(error){

        console.log(error);

        alert("Unable To Update Crop");

    }

};const cancelUpdate = () => {

    navigate("/crop-details/" + id);

};return (

<div className="edit-crop-container">

    <div className="edit-card">

        <h1>🌾 Edit Crop</h1>

        <form onSubmit={handleSubmit}>

            <input
                type="text"
                name="cropName"
                placeholder="Crop Name"
                value={crop.cropName}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="variety"
                placeholder="Crop Variety"
                value={crop.variety}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={crop.quantity}
                onChange={handleChange}
                required
            />

            <select
                name="quantityUnit"
                value={crop.quantityUnit}
                onChange={handleChange}
            >

                <option value="Kg">Kg</option>

                <option value="Quintals">Quintals</option>

                <option value="Ton">Ton</option>

                <option value="Bags">Bags</option>

            </select>

            <input
                type="number"
                name="expectedPrice"
                placeholder="Expected Price"
                value={crop.expectedPrice}
                onChange={handleChange}
                required
            />

            <input
                type="date"
                name="harvestDate"
                value={crop.harvestDate}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="status"
                placeholder="Status"
                value={crop.status}
                onChange={handleChange}
            />

            <input
                type="text"
                name="village"
                placeholder="Village"
                value={crop.village}
                onChange={handleChange}
            />

            <input
                type="text"
                name="district"
                placeholder="District"
                value={crop.district}
                onChange={handleChange}
            />

            <input
                type="text"
                name="state"
                placeholder="State"
                value={crop.state}
                onChange={handleChange}
            />

            <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={crop.pincode}
                onChange={handleChange}
            />

            <label>

                Change Crop Image

            </label>

            <input

                type="file"

                accept="image/*"

                onChange={handleImage}

            />

            {

                preview &&

                <div className="preview-box">

                    <img

                        src={preview}

                        alt="Crop"

                        className="preview-image"

                    />

                </div>

            }

            <h3>

                Select Crop Location

            </h3>

            <MapContainer

                center={[location.lat,location.lng]}

                zoom={13}

                style={{

                    height:"350px",

                    width:"100%",

                    borderRadius:"10px",

                    marginBottom:"20px"

                }}

            >

                <TileLayer

                    attribution="&copy; OpenStreetMap contributors"

                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                />

                <LocationMarker

                    location={location}

                    setLocation={setLocation}

                />

            </MapContainer>

            <input

                value={location.lat}

                readOnly

            />

            <input

                value={location.lng}

                readOnly

            />            <div className="button-group">

                <button
                    type="submit"
                    className="save-btn"
                >
                    💾 Update Crop
                </button>

                <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelUpdate}
                >
                    ❌ Cancel
                </button>

                <button
                    type="button"
                    className="dashboard-btn"
                    onClick={() => navigate("/farmer-dashboard")}
                >
                    🏠 Dashboard
                </button>

            </div>

        </form>

    </div>

</div>

);

}

export default EditCrop;
