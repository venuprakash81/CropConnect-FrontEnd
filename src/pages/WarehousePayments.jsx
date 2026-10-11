import React, { useState } from "react";
import "./WarehousePayments.css";

const WarehousePayments = () => {
  const [activeSection, setActiveSection] = useState("");

  // Sample payment data
  const payments = [
    {
      id: 1,
      customer: "Venu Prakash",
      bookingId: "WH001",
      date: "02-10-2026",
      amount: 8000,
      status: "Paid",
    },
    {
      id: 2,
      customer: "Ramesh Kumar",
      bookingId: "WH002",
      date: "01-10-2026",
      amount: 6000,
      status: "Paid",
    },
    {
      id: 3,
      customer: "Suresh Reddy",
      bookingId: "WH003",
      date: "30-09-2026",
      amount: 4000,
      status: "Pending",
    },
  ];

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="warehouse-payments-page">
      <div className="warehouse-payments-container">
        <div className="warehouse-payments-header">
          <h1>Warehouse Earnings</h1>
          <p>Manage your warehouse bookings and payments</p>
        </div>

        <div className="warehouse-payment-summary">
          <div className="warehouse-payment-card total">
            <div className="warehouse-payment-icon">💰</div>
            <h3>Total Amount</h3>
            <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
            <p>Overall earnings</p>
          </div>

          <div className="warehouse-payment-card paid">
            <div className="warehouse-payment-icon">✅</div>
            <h3>Received Amount</h3>
            <h2>₹{paidAmount.toLocaleString("en-IN")}</h2>
            <p>Successfully received</p>
          </div>

          <div className="warehouse-payment-card pending">
            <div className="warehouse-payment-icon">⏳</div>
            <h3>Pending Amount</h3>
            <h2>₹{pendingAmount.toLocaleString("en-IN")}</h2>
            <p>Awaiting payment</p>
          </div>
        </div>

        <div className="warehouse-payment-actions">
          <button
            className={activeSection === "my" ? "active" : ""}
            onClick={() =>
              setActiveSection(activeSection === "my" ? "" : "my")
            }
          >
            My Payments
          </button>

          <button
            className={activeSection === "received" ? "active" : ""}
            onClick={() =>
              setActiveSection(
                activeSection === "received" ? "" : "received"
              )
            }
          >
            Received Payments
          </button>
        </div>

        {activeSection === "my" && (
          <div className="warehouse-payment-details">
            <h2>My Payments</h2>
            <p>Payment details for your warehouse bookings.</p>

            <div className="warehouse-payment-table-wrapper">
              <table className="warehouse-payment-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.bookingId}</td>
                      <td>{payment.customer}</td>
                      <td>{payment.date}</td>
                      <td>
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`warehouse-payment-status ${payment.status.toLowerCase()}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "received" && (
          <div className="warehouse-payment-details">
            <h2>Received Payments</h2>
            <p>Payments successfully received from customers.</p>

            {payments
              .filter((payment) => payment.status === "Paid")
              .map((payment) => (
                <div
                  className="warehouse-received-item"
                  key={payment.id}
                >
                  <div>
                    <h3>{payment.customer}</h3>
                    <p>
                      Booking ID: {payment.bookingId} | {payment.date}
                    </p>
                  </div>

                  <div className="warehouse-received-amount">
                    <strong>
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </strong>
                    <span>Received</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehousePayments;