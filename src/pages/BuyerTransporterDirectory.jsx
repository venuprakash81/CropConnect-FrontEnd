import React from "react";
import "./MobileResponsive.css";
import TransportBookingForm from "./TransportBookingForm";

export default function FarmerTransportBooking() {
  return (
    <TransportBookingForm
      role="farmer"
      title="Farmer Transport Booking"
      subtitle="Book a vehicle to transport your farm produce."
      userKeys={[
        "cropconnectFarmer",
        "farmer",
        "farmerData",
        "loggedInFarmer"
      ]}
    />
  );
}