
import React, { useState } from "react";
import "./FarmerEarnings.css";

const FarmerEarnings = () => {
  const [activeTab, setActiveTab] = useState("");

  const earnings = [
    {
      id: "FR001",
      farmerName: "Venu Prakash",
      crop: "Rice",
      amount: 15000,
      date: "2026-09-25",
      status: "Received",
    },
    {
      id: "FR002",
      farmerName: "Venu Prakash",
      crop: "Wheat",
      amount: 10000,
      date: "2026-09-27",
      status: "Received",
    },
    {
      id: "FR003",
      farmerName: "Venu Prakash",
      crop: "Tomatoes",
      amount: 12000,
      date: "2026-09-29",
      status: "Pending",
    },
  ];

  const totalEarnings = earnings.reduce(
    (total, item) => total + item.amount,
    0
  );

  const receivedEarnings = earnings
    .filter((item) => item.status === "Received")
    .reduce((total, item) => total + item.amount, 0);

  const pendingEarnings = earnings
    .filter((item) => item.status === "Pending")
    .reduce((total, item) => total + item.amount, 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="farmer-earnings-page">
      <div className="farmer-earnings-header">
        <div>
          <h1>Farmer Earnings</h1>
          <p>Track your crop sales, received payments, and pending earnings.</p>
        </div>
      </div>

      <div className="farmer-earnings-summary">
        <div className="farmer-earning-card total">
          <div className="farmer-earning-icon">₹</div>
          <div>
            <h3>Total Earnings</h3>
            <h2>{formatCurrency(totalEarnings)}</h2>
            <p>All crop sales</p>
          </div>
        </div>

        <div className="farmer-earning-card received">
          <div className="farmer-earning-icon">✓</div>
          <div>
            <h3>Received Earnings</h3>
            <h2>{formatCurrency(receivedEarnings)}</h2>
            <p>Payments received</p>
          </div>
        </div>

        <div className="farmer-earning-card pending">
          <div className="farmer-earning-icon">◷</div>
          <div>
            <h3>Pending Earnings</h3>
            <h2>{formatCurrency(pendingEarnings)}</h2>
            <p>Awaiting payment</p>
          </div>
        </div>
      </div>

      <div className="farmer-earnings-actions">
        <button
          className={activeTab === "earnings" ? "active" : ""}
          onClick={() =>
            setActiveTab(activeTab === "earnings" ? "" : "earnings")
          }
        >
          My Earnings
        </button>

        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() =>
            setActiveTab(activeTab === "history" ? "" : "history")
          }
        >
          Earnings History
        </button>
      </div>

      {activeTab === "earnings" && (
        <div className="farmer-earnings-section">
          <h2>My Earnings</h2>
          <div className="farmer-earnings-table-wrapper">
            <table className="farmer-earnings-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Farmer Name</th>
                  <th>Crop</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.farmerName}</td>
                    <td>{item.crop}</td>
                    <td>{formatCurrency(item.amount)}</td>
                    <td>{item.date}</td>
                    <td>
                      <span
                        className={`farmer-earning-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="farmer-earnings-section">
          <h2>Earnings History</h2>

          <div className="farmer-earnings-history">
            {earnings.map((item) => (
              <div className="farmer-earnings-history-item" key={item.id}>
                <div className="farmer-history-icon">
                  {item.status === "Received" ? "✓" : "◷"}
                </div>

                <div className="farmer-history-details">
                  <h3>{item.crop} Sale</h3>
                  <p>Transaction ID: {item.id}</p>
                  <p>Date: {item.date}</p>
                </div>

                <div className="farmer-history-amount">
                  <h3>{formatCurrency(item.amount)}</h3>
                  <span
                    className={`farmer-earning-status ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "" && (
        <div className="farmer-earnings-empty">
          <div className="farmer-empty-icon">₹</div>
          <h2>Welcome to Your Earnings</h2>
          <p>
            Select My Earnings or Earnings History to view your crop
            sale transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerEarnings;
